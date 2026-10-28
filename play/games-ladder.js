'use strict';
// Number Ladder `ladder` (K math, continues into grade 1; D3, 2026-10-28). docs/review/impl-ladder.md
// Small steps after the ORDER of Kumon 3A/2A/A (docs/kumon-research.md §2, §5): +1 -> +1 to 20 -> +2 -> mix +1/+2 -> +3 -> mix to +3
// -> +4 -> +5 -> mix to +5 -> make 10 -> (grade 1) +6 ... +10 -> mix to +10 -> -1 -> -2 -> mix -1/-2. No Kumon items, pictures or wording.
// The child's rung is kept in S.ladder (per child, on this device), separate from the engine's level 1/2:
//   rung         = which facts are practised;
//   level 2 or a first-try streak (core scaffoldStep) = less picture: dots -> start number + dots -> numbers only. A miss brings the picture back.
// Up one rung: a round with >= 90% right on the first try (9/10). Down one rung: two rounds in a row at <= 70% (7/10).
// Time per question is stored for the grown-ups screen only; the child never sees a clock. Speed does not gate the rung (SPEED_GATE).
// Wrong choices are counting slips (one more / one less), not adding at all, or reading the added number as another (6 <-> 9, + for -).
(() => {
  const ID = 'ladder', MAX_H = 40, SPEED_GATE = false, UP = 0.9, LOW = 0.7;
  // k: key, op: '+', '-' or '10' (make ten), adds: the numbers added/taken, a in [lo, hi], cap: largest sum in a mix,
  // base/top: least and most picture fading (0 dots, 1 start number + dots, 2 numbers only), g: grade band.
  const R = (k, op, adds, lo, hi, cap, base, top, g, en, ko, chip) => ({ k, op, adds, lo, hi, cap, base, top, g, name: B(en, ko), chip });
  const RUNGS = [
    R('n1', '+', [1], 1, 9, 10, 0, 1, 'K', '+1: the next number (to 10)', '+1: 다음 수 (10까지)', '+1'),
    R('n1b', '+', [1], 10, 19, 20, 0, 1, 'K', '+1 to 20', '+1 (20까지)', '+1'),
    R('p2', '+', [2], 1, 8, 10, 0, 1, 'K', '+2', '+2', '+2'),
    R('m2', '+', [1, 2], 1, 9, 10, 0, 2, 'K', 'Mix +1 and +2', '+1·+2 섞기', '+1 +2'),
    R('p3', '+', [3], 1, 7, 10, 0, 2, 'K', '+3', '+3', '+3'),
    R('m3', '+', [1, 2, 3], 1, 9, 10, 1, 2, 'K', 'Mix up to +3', '+3까지 섞기', '+1 +2 +3'),
    R('p4', '+', [4], 0, 6, 10, 1, 2, 'K', '+4', '+4', '+4'),
    R('p5', '+', [5], 0, 5, 10, 1, 2, 'K', '+5', '+5', '+5'),
    R('m5', '+', [1, 2, 3, 4, 5], 1, 9, 10, 1, 2, 'K', 'Mix up to +5', '+5까지 섞기', '+1 … +5'),
    R('ten', '10', [], 1, 9, 10, 0, 2, 'K', 'Make 10', '10 만들기', '10'),
    R('p6', '+', [6], 1, 9, 20, 1, 2, '1', '+6', '+6', '+6'),
    R('p7', '+', [7], 1, 9, 20, 1, 2, '1', '+7', '+7', '+7'),
    R('p8', '+', [8], 1, 9, 20, 1, 2, '1', '+8', '+8', '+8'),
    R('p9', '+', [9], 1, 9, 20, 1, 2, '1', '+9', '+9', '+9'),
    R('p10', '+', [10], 1, 10, 20, 1, 2, '1', '+10', '+10', '+10'),
    R('m10', '+', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1, 10, 20, 1, 2, '1', 'Mix up to +10 (to 20)', '+10까지 섞기 (20까지)', '+1 … +10'),
    R('s1', '-', [1], 2, 20, 20, 1, 2, '1', '−1', '−1', '−1'),
    R('s2', '-', [2], 3, 20, 20, 1, 2, '1', '−2', '−2', '−2'),
    R('s12', '-', [1, 2], 3, 20, 20, 1, 2, '1', 'Mix −1 and −2', '−1·−2 섞기', '−1 −2')
  ];
  const N = RUNGS.length, FIRST_GRADE1 = RUNGS.findIndex(r => r.k === 'm3') + 1;   // grade 1+ starts at "mix to +3" (AI decision, see impl doc)

  // ---------- saved state: S.ladder = { r: rung 1..N, low: rounds in a row at <= 70%, best, h: [[date, before, after, right, total, secs]] } ----------
  const isDay = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d);
  const int = (v, lo, hi, d) => (Number.isFinite(v) ? Math.min(hi, Math.max(lo, Math.floor(v))) : d);
  function clean(v) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
    const r = int(v.r, 1, N, 1);
    return {
      r, low: int(v.low, 0, 1, 0), best: Math.max(r, int(v.best, 1, N, 1)),
      h: (Array.isArray(v.h) ? v.h : []).filter(e => Array.isArray(e) && e.length === 6 && isDay(e[0]) && e.slice(1).every(Number.isFinite))
        .slice(-MAX_H).map(e => [e[0], int(e[1], 1, N, 1), int(e[2], 1, N, 1), int(e[3], 0, 99, 0), int(e[4], 1, 99, 1), int(e[5], 0, 36000, 0)])
    };
  }
  // Until core.js cleanState keeps `ladder` (docs/review/integ-ladder.md), bring it back from the saved copy once at load.
  if (!S.ladder) { try { const raw = JSON.parse(localStorage.getItem(KEY) || 'null'); const c = raw && clean(raw.ladder); if (c) S.ladder = c; } catch (e) {} }
  const state = () => {
    const c = clean(S.ladder);
    S.ladder = c || { r: ['K', 'P'].includes(kidGrade()) ? 1 : FIRST_GRADE1, low: 0, best: 1, h: [] };
    if (!c) S.ladder.best = S.ladder.r;
    return S.ladder;
  };

  // ---------- pictures ----------
  const COLORS = [['#2f6fd6', '#f08a00'], ['#127fa3', '#d9467a'], ['#1f8f62', '#8a4fd8']];   // first group / added group; variety only
  const dot = (x, y, c, cross) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}"${cross ? ' fill-opacity=".35"' : ''}/>` +
    (cross ? `<path d="M${x - 7} ${y - 7}L${x + 7} ${y + 7}M${x + 7} ${y - 7}L${x - 7} ${y + 7}" stroke="#b3261e" stroke-width="3" stroke-linecap="round"/>` : '');
  // cells: [{c, x}] in order; frames of 5x2 side by side. dashed: empty cells drawn dashed (make 10).
  const frames = (cells, size, label, dashed, cls = '') => {
    const F = Math.max(1, Math.ceil(size / 10)), w = F * 100 + (F - 1) * 10;
    let s = '';
    for (let i = 0; i < F * 10; i++) {
      const f = Math.floor(i / 10), j = i % 10, x = f * 110 + (j % 5) * 20, y = Math.floor(j / 5) * 20, cell = cells[i];
      s += `<rect x="${x + 1}" y="${y + 1}" width="18" height="18" fill="#fff" stroke="#35506f" stroke-width="1.5"${dashed && !cell ? ' stroke-dasharray="3 2"' : ''}/>`;
      if (cell) s += dot(x + 10, y + 10, cell.c, cell.x);
    }
    return `<svg class="ld-pic ${cls}" viewBox="-1 -1 ${w + 2} 42" role="img" aria-label="${label}">${s}</svg>`;
  };
  // one row: first group, a gap, then the second group (<= 10 dots in all)
  const row = (n1, c1, n2, c2, label, cross) => {
    const w = (n1 + n2) * 18 + (n1 && n2 ? 14 : 0);
    let s = '';
    for (let i = 0; i < n1; i++) s += dot(9 + i * 18, 10, c1);
    for (let i = 0; i < n2; i++) s += dot(9 + n1 * 18 + (n1 ? 14 : 0) + i * 18, 10, c2, cross);
    return `<svg class="ld-pic ld-row" viewBox="0 0 ${Math.max(w, 18)} 20" role="img" aria-label="${label}">${s}</svg>`;
  };
  const card = n => `<span class="ld-card">${n}</span>`;
  const eqLine = (parts, big) => `<div class="ld-eq${big ? ' ld-big' : ''}">${parts.join(' ')}</div>`;

  // ---------- one question ----------
  const josa = n => ([2, 4, 5, 9].includes(n % 10) ? '는' : '은');
  const between = (lo, hi) => lo + rnd(hi - lo + 1);
  function numOpts(ans, bad) {
    const set = [ans];
    for (const v of bad) if (set.length < 3 && Number.isInteger(v) && v >= 0 && v <= 21 && !set.includes(v)) set.push(v);
    for (const d of [1, -1, 2, -2, 3]) if (set.length < 3 && ans + d >= 0 && !set.includes(ans + d)) set.push(ans + d);
    return set.map(v => ({ html: `<span class="num">${v}</span>`, ok: v === ans }));
  }
  const CONFUSE = { 6: 9, 9: 6 };                                // 6 and 9 are the numerals young children mix up most
  function fact(rung) {
    if (rung.op === '10') { const a = between(rung.lo, rung.hi); return { a, k: 10 - a, ans: 10 - a }; }
    const k = pick(rung.adds);
    if (rung.op === '-') { const a = between(Math.max(rung.lo, k + 1), rung.hi); return { a, k, ans: a - k }; }
    const hi = Math.min(rung.hi, rung.cap - k), a = between(Math.min(rung.lo, hi), hi);
    return { a, k, ans: a + k };
  }
  function wrongs(rung, f) {
    const { a, k, ans } = f, near = shuffle([ans - 1, ans + 1]);
    if (rung.op === '10') return [near[0], rnd(2) ? a : near[1], near[1]];                       // count slip, or copied the number shown
    if (rung.op === '-') return [near[0], rnd(3) ? near[1] : a + k, near[1]];                      // count slip, or added instead
    const seen = CONFUSE[k] && rnd(2) ? a + CONFUSE[k] : null;                                       // read +6 as +9 etc.
    return [near[0], seen ?? (k <= 2 && !rnd(3) ? a : near[1]), near[1]];                         // count slip, or did not add
  }
  // mode: 0 dots for everything, 1 start number + dots, 2 numbers only. v: layout/colour variety.
  function show(rung, f, mode, v) {
    const { a, k } = f, [c1, c2] = COLORS[v % 3], flip = v % 2 === 1, chip = `<div class="ld-chip" aria-hidden="true">🪜 ${rung.chip}</div>`;
    const sign = rung.op === '-' ? '−' : '+';
    let pic = '', eq;
    if (rung.op === '10') {
      eq = mode === 2 && flip ? ['10', '=', a, '+', '?'] : [a, '+', '?', '=', '10'];
      if (mode < 2) pic = frames(Array.from({ length: a }, () => ({ c: mode ? '#8a96a8' : c1 })), 10, `${a}`, true, mode ? 'ld-mini' : '');
    } else {
      eq = mode === 2 && flip ? ['?', '=', a, sign, k] : [a, sign, k, '=', '?'];
      if (mode === 0) {
        const cells = rung.op === '-' ? Array.from({ length: a }, (_, i) => ({ c: c1, x: i >= a - k })) : [...Array(a).fill({ c: c1 }), ...Array(k).fill({ c: c2 })];
        const total = rung.op === '-' ? a : a + k;
        pic = total <= 10 && flip ? (rung.op === '-' ? row(a - k, c1, k, c1, `${a}`, true) : row(a, c1, k, c2, `${a} ${k}`)) : frames(cells, total, `${a} ${k}`);
      } else if (mode === 1) {
        // start number + only the dots that are added or taken: count on / count back from the card
        return `<div class="ld-show">${chip}${eqLine([card(a), sign, rung.op === '-' ? row(0, c1, k, c1, `${k}`, true) : row(0, c1, k, c2, `${k}`), '=', '?'])}</div>`;
      }
    }
    return `<div class="ld-show">${chip}${pic}${eqLine(eq, mode === 2)}</div>`;
  }
  const ASK = {
    '+': B('How many in all?', '모두 몇일까요?'),
    '-': B('How many are left?', '남은 것은 몇일까요?'),
    '10': B('How many more make 10?', '10이 되려면 몇이 더 필요할까요?')
  };
  const say2 = (rung, { a, k }) => rung.op === '10' ? B(`${a} and how many more make 10?`, `${a}에 몇을 더하면 10이 될까요?`)
    : rung.op === '-' ? B(`${a} take away ${k}. How many are left?`, `${a} 빼기 ${k}${josa(k)} 얼마일까요?`)
    : B(`${a} plus ${k}. How many in all?`, `${a} 더하기 ${k}${josa(k)} 얼마일까요?`);
  const after = (rung, { a, k, ans }) => { const t = rung.op === '10' ? `${a} + ${ans} = 10` : rung.op === '-' ? `${a} − ${k} = ${ans}` : `${a} + ${k} = ${ans}`; return B(t, t); };

  function makeItem(game, rung, mode, f, tracked) {
    f = f || fact(rung);
    const v = rnd(6), item = {
      ask: ASK[rung.op], askSay: say2(rung, f), show: show(rung, f, mode, v), opts: numOpts(f.ans, wrongs(rung, f)), after: after(rung, f),
      cls: 'ld-opts', fade: tracked ? 'ld-' + rung.k : undefined, ld: { rung: rung.k, op: rung.op, a: f.a, k: f.k, ans: f.ans, mode }
    };
    if (tracked) { const q = { ans: f.ans, done: false }; item.onRender = () => track(q); }
    return item;
  }

  // ---------- the round tally (first try only) ----------
  let round = { res: new Map(), t0: 0, last: null, up: false };
  function track(q) {
    if (DIAG.active || SESSION.review || SESSION.id !== ID) return;
    const idx = SESSION.n;
    if (q !== round.last && (round.res.has(idx) || [...round.res.keys()].some(i => i > idx))) round = { res: new Map(), t0: 0, last: null, up: false };
    if (idx === 0 && !round.t0) round.t0 = Date.now();
    round.last = q;
    $$('.opt').forEach(btn => btn.addEventListener('click', () => {
      const ok = (btn.querySelector('.num')?.textContent || '') === String(q.ans);
      if (!q.done) {
        q.done = true; round.res.set(idx, ok);
        if (idx >= (SESSION.rounds || 10) - 1) finish();
      }
      if (ok && round.up) { round.up = false; setTimeout(cheerUp, 60); }
    }));
  }
  function cheerUp() {
    const fact = $('#fact'); if (!fact) return;
    const t = L(B('Up one step on the ladder!', '사다리 한 칸 올라가요!'));
    fact.insertAdjacentHTML('beforeend', `<span class="ld-up"> 🪜⬆️ ${t}</span>`); say(t, undefined, true);
  }
  function finish() {
    const st = state(), total = round.res.size, right = [...round.res.values()].filter(Boolean).length, before = st.r;
    const secs = round.t0 ? Math.round((Date.now() - round.t0) / 1000) : 0;
    if (total >= 5 && !SESSION.mix) {                                        // a mixed run (3 questions) is practice only
      const p = right / total, quick = !SPEED_GATE || fasterThanUsual(st, before, secs / total);
      if (p >= UP && quick) { st.low = 0; if (st.r < N) st.r++; }
      else if (p <= LOW) { st.low++; if (st.low >= 2) { st.r = Math.max(1, st.r - 1); st.low = 0; } }
      else st.low = 0;
      st.best = Math.max(st.best, st.r);
    }
    if (total >= 5 && !SESSION.mix) { st.h.push([today(), before, st.r, right, total, secs]); st.h = st.h.slice(-MAX_H); }
    round.up = st.r > before;
    save();
  }
  const perQ = e => e[5] / Math.max(1, e[4]);
  function usual(st, rung) {                                                 // median seconds per question, last 5 rounds on this rung
    const xs = st.h.filter(e => e[1] === rung && e[4] >= 5).slice(-5).map(perQ).sort((x, y) => x - y);
    return xs.length ? xs[Math.floor(xs.length / 2)] : null;
  }
  function fasterThanUsual(st, rung, sec) { const u = usual(st, rung); return u === null || sec <= u; }

  // ---------- grown-ups: one line ----------
  function summary() {
    const st = clean(S.ladder);
    if (!st || !st.h.length) return L(B('Number Ladder: not started yet.', '한 칸씩 사다리: 아직 시작 전이에요.'));
    const rung = RUNGS[st.r - 1], d = new Date(); d.setDate(d.getDate() - 7);
    const weekAgo = today(d), old = st.h.filter(e => e[0] <= weekAgo).pop(), ref = old ? old[2] : st.h[0][1], diff = st.r - ref;
    const since = old ? B('last week', '지난주') : B('the start', '처음');
    const move = diff > 0 ? B(`${diff} up from ${since.en}`, `${since.ko}보다 ${diff}칸 위`) : diff < 0 ? B(`${-diff} down from ${since.en} (practising an easier step)`, `${since.ko}보다 ${-diff}칸 아래(쉬운 칸 다지는 중)`) : B(`same step as ${since.en}`, `${since.ko}와 같은 칸`);
    const last = st.h[st.h.length - 1], u = usual(st, st.r);
    const time = u === null ? B('', '') : B(` · usually about ${Math.round(u)} s a question on this step`, ` · 이 칸에서 보통 문제당 약 ${Math.round(u)}초`);
    return L(B(`Number Ladder: step ${st.r}/${N}, ${rung.name.en} · ${move.en} · last round ${last[3]}/${last[4]}${time.en}.`,
      `한 칸씩 사다리: 지금 칸 ${st.r}/${N} ${rung.name.ko} · ${move.ko} · 지난 판 ${last[3]}/${last[4]}${time.ko}.`));
  }
  const html = () => `<p class="note2 ld-summary">🪜 ${summary()}</p>`;

  window.Ladder = {
    rungs: RUNGS, clean, summary, html,
    rung: () => state().r,
    setRung(n) { const st = state(); st.r = int(n, 1, N, st.r); st.low = 0; st.best = Math.max(st.best, st.r); save(); return st.r; },   // grown-ups/QA
    reset() { S.ladder = null; save(); }
  };

  registerGame({
    id: ID, grade: 'K', subject: 'math', icon: '🪜', title: B('Number Ladder', '한 칸씩 사다리'), sub: B('One small step at a time', '한 칸씩 올라가요'),
    area: B('Math · Adding step by step', '수학 · 한 칸씩 더하기'),
    // Step-down (core quiz, 2nd miss): the same fact with every dot shown; with dots already shown, "one more/one less" first.
    stepDown(item) {
      const m = item.ld; if (!m) return null;
      const rung = RUNGS.find(r => r.k === m.rung);
      if (m.mode > 0) return makeItem(this, rung, 0, { a: m.a, k: m.k, ans: m.ans }, false);
      if (m.op === '+' && m.k > 1 && m.a + 1 <= 20) return makeItem(this, RUNGS[0], 0, { a: m.a, k: 1, ans: m.a + 1 }, false);
      if (m.op === '-' && m.k > 1) return makeItem(this, RUNGS.find(r => r.k === 's1'), 0, { a: m.a, k: 1, ans: m.a - 1 }, false);
      return null;
    },
    play() {
      const rung = RUNGS[state().r - 1], lv = lvl(ID);
      const mode = Math.min(rung.top, Math.max(rung.base + lv - 1, scaffoldStep(this, 'ld-' + rung.k)));
      quiz(this, makeItem(this, rung, mode, null, true));
    }
  });
})();
