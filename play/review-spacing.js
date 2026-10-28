(() => {
  'use strict';
  // Spaced review (2026-10-28): a missed game-level, and the first time a game is answered right,
  // come back after 1 day, then 3 days, then 7 days. A clean answer moves it to the next gap;
  // a miss starts again at 1 day. After the 7-day review it leaves the list.
  // It adds dates to the existing S.review idea (game id + level, no generated question is stored).
  // Saved per child in S.spacing on this device only. Loaded before core.js so cleanState can use clean().
  const B = (en, ko) => ({ en, ko });
  const GAPS = [1, 3, 7];
  const MAX = 60;
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const okDate = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(Date.parse(d + 'T00:00:00Z')) && new Date(d + 'T00:00:00Z').toISOString().slice(0, 10) === d;
  const dayStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const addDays = (n, from = new Date()) => { const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + n); return dayStr(d); };
  const todayStr = () => dayStr(new Date());
  // { k: key, id, lv, st: 0..2 (index into GAPS), due: 'YYYY-MM-DD', why: 'm' miss | 'f' first right }
  const clean = (list) => {
    const seen = new Set();
    return (Array.isArray(list) ? list : []).filter(x => isObj(x) && typeof x.id === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(x.id) && Number.isInteger(x.lv) && x.lv >= 1 && x.lv <= 3
      && Number.isInteger(x.st) && x.st >= 0 && x.st < GAPS.length && okDate(x.due) && !seen.has(x.id + ':' + x.lv) && seen.add(x.id + ':' + x.lv))
      .slice(-MAX).map(x => ({ k: 'sp_' + x.id + '_' + x.lv, id: x.id, lv: x.lv, st: x.st, due: x.due, why: x.why === 'f' ? 'f' : 'm' }));
  };
  const list = () => (S.spacing = clean(S.spacing));
  const find = (id, lv) => list().find(x => x.id === id && x.lv === lv);
  const skip = id => id === 'blockpuzzle' || (typeof CHECK_SKIP !== 'undefined' && CHECK_SKIP.includes(id));
  const playable = x => { const g = gameById(x.id); return !!g && !skip(x.id) && gradeOf(g) !== 'P' && !heldGame(g); };
  // Called from core.js record() for school grades (not Pre-K, not quick check, not inside a review run).
  // missedBefore: this round already logged a miss, so a later right answer is not a "first right".
  const note = (id, lv, ok, missedBefore) => {
    try {
      if (skip(id) || !Number.isInteger(lv)) return;
      const g = gameById(id); if (!g || gradeOf(g) === 'P') return;
      const cur = find(id, lv);
      if (!ok) {
        if (missedBefore) return;
        if (cur) { cur.st = 0; cur.due = addDays(GAPS[0]); cur.why = 'm'; }
        else S.spacing = list().concat({ k: 'sp_' + id + '_' + lv, id, lv, st: 0, due: addDays(GAPS[0]), why: 'm' }).slice(-MAX);
        return;   // core.js saves right after
      }
      const st = S.stats[id];
      if (!cur && !missedBefore && (!st || (st.right || 0) === 0)) S.spacing = list().concat({ k: 'sp_' + id + '_' + lv, id, lv, st: 0, due: addDays(GAPS[0]), why: 'f' }).slice(-MAX);
    } catch (e) { console.warn('[peachy] spacing note', e); }
  };
  const due = (day = todayStr()) => list().filter(x => x.due <= day && playable(x) && visibleGames().includes(gameById(x.id)))
    .sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0) || (a.why === 'm' ? -1 : 1) - (b.why === 'm' ? -1 : 1));
  const dueCount = () => (kidGrade() === 'P' ? 0 : due().length);
  // Review-run hooks (core.js reviewSolved / record / recordFinal). Only items with an sp_ key are spacing items.
  // A short pool repeats inside one run, so each item moves at most once per run (a miss in any copy wins).
  const run = { missed: new Set(), done: new Set() };
  const missed = (it) => {
    if (!it || typeof it.key !== 'string' || !it.key.startsWith('sp_')) return;
    run.missed.add(it.key);
    const cur = find(it.id, it.lv); if (cur) { cur.st = 0; cur.due = addDays(GAPS[0]); cur.why = 'm'; save(); }
  };
  const solved = (it) => {
    if (!it || typeof it.key !== 'string' || !it.key.startsWith('sp_') || run.done.has(it.key) || run.missed.has(it.key)) return;
    run.done.add(it.key);
    const cur = find(it.id, it.lv); if (!cur) return;
    if (cur.st + 1 >= GAPS.length) S.spacing = list().filter(x => x !== cur);
    else { cur.st++; cur.due = addDays(GAPS[cur.st]); }
    save();
  };
  // Starts a review run: due spacing items first, then the existing "missed" list (S.review) fills the rest.
  // Uses core.js reviewStep(), so the screens and the end-of-review screen are the same as the 🔁 review.
  const start = (opts = {}) => {
    if (kidGrade() === 'P') return startReview();
    quitDiag();
    const max = opts.max || ROUNDS;
    const sp = due().slice(0, max).map(x => ({ key: x.k, id: x.id, lv: x.lv }));
    const old = opts.onlySpacing ? [] : (cleanState({ review: S.review }).review || []).filter(x => gameById(x.id) && !CHECK_SKIP.includes(x.id) && gradeOf(gameById(x.id)) !== 'P' && !sp.some(y => y.id === x.id && y.lv === x.lv));
    const pool = sp.concat(old).slice(0, max);
    if (!pool.length) { if (opts.onEmpty) return opts.onEmpty(); return home(); }
    const rounds = opts.rounds || Math.min(max, Math.max(pool.length, opts.onlySpacing ? pool.length : ROUNDS));
    const items = Array.from({ length: rounds }, (_, i) => Object.assign({}, pool[i % pool.length]));
    run.missed.clear(); run.done.clear();
    NEXT_TOK++;
    Object.assign(SESSION, { review: items, n: 0, done: 0, mix: false, rounds, prevPeek: null });
    reviewStep();
  };
  // Grown-ups line: how many are waiting today and later (no scores).
  const summary = () => {
    if (kidGrade() === 'P') return '';
    const all = list().filter(playable), now = due().length, later = all.length - now;
    if (!all.length) return '';
    return `<p class="note2">🗓️ ${L(B(`Spaced review: ${now} ready today, ${later} coming later (1, 3, 7 days after a miss or a first right answer).`, `간격 복습: 오늘 ${now}개, 나중에 ${later}개 (틀리거나 처음 맞힌 뒤 1·3·7일).`))}</p>`;
  };
  window.Spacing = { GAPS, clean, note, due, dueCount, missed, solved, start, summary, addDays };
})();
