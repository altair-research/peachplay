(() => {
  'use strict';
  // "Today's 15 minutes" (2026-10-28): one home button runs a short, fixed routine
  //   warm-up (counting + syllable claps, ~30 s, no wrong answers) -> 1 round of a practice game (weaker area)
  //   -> 1 round of a game the child does well -> spaced-review questions (review-spacing.js) -> celebration.
  // The amount is counted in rounds, not minutes; no clock is shown to the child.
  // A "slow" learner style (learner-style.js) plays the confident game first, like Learner.arrange.
  // Progress for today is kept in S.today, so leaving and coming back continues from the same step.
  // Loaded before core.js (cleanState uses clean()); everything else runs after the app is ready.
  const B = (en, ko) => ({ en, ko });
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const okDate = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(Date.parse(d + 'T00:00:00Z')) && new Date(d + 'T00:00:00Z').toISOString().slice(0, 10) === d;
  const okId = v => typeof v === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(v);
  const STEPS = ['warm', 'a', 'b', 'review'];
  // S.today = { d: day of the current plan, step: 0..4, a, b: game ids, done: [days finished] (last 60) }
  const clean = (t) => {
    if (!isObj(t)) return null;
    const o = { d: okDate(t.d) ? t.d : '', step: Number.isInteger(t.step) && t.step >= 0 && t.step <= STEPS.length ? t.step : 0, a: okId(t.a) ? t.a : '', b: okId(t.b) ? t.b : '' };
    o.done = [...new Set((Array.isArray(t.done) ? t.done : []).filter(okDate))].sort().slice(-60);
    return o;
  };
  const TX = {
    title: B("Today's 15 minutes", '오늘의 15분'),
    sub: B('Warm-up → 2 games → review', '준비 운동 → 게임 2판 → 복습'),
    cont: (n) => B(`Keep going (${n}/${STEPS.length})`, `이어서 하기 (${n}/${STEPS.length})`),
    doneSub: B('All done today! Play again?', '오늘 다 했어요! 또 할까요?'),
    warm: B('Warm-up', '준비 운동'), practice: B('Practice game', '힘 기르기 게임'), fav: B('Game you do well', '잘하는 게임'), review: B('Look again', '다시 보기'), party: B('Done!', '끝!'),
    go: B('Start', '시작'), next: B("Next: Today's 15", '다음: 오늘의 15분'), stop: B('Stop for now', '여기까지 할래요'),
    count: B('Tap each one to count!', '하나씩 눌러 세어 봐요!'), skipCount: (n) => B(`Count by ${n}s! Tap each group.`, `${n}씩 세어 봐요! 묶음을 하나씩 눌러요.`),
    clap: B('Tap the drum for each part of the word!', '낱말 조각마다 북을 쳐요!'),
    skip: B('Skip warm-up', '준비 운동 건너뛰기'),
    finish: B("You finished today's 15 minutes!", '오늘의 15분을 다 했어요!'),
    days: (n) => B(`Days finished in the last 2 weeks: ${n}`, `최근 2주 동안 끝낸 날: ${n}일`),
    noReview: B('No review waiting today.', '오늘은 다시 볼 문제가 없어요.'),
    home: B('Home', '처음으로'),
  };
  const dayNow = () => today();
  const st = () => { const t = clean(S.today) || { d: '', step: 0, a: '', b: '', done: [] }; S.today = t; return t; };
  let active = false;                                      // true only while a Today step is running in this page
  const skipId = id => id === 'blockpuzzle' || (typeof CHECK_SKIP !== 'undefined' && CHECK_SKIP.includes(id));
  const pool = () => visibleGames().filter(g => !skipId(g.id) && gradeOf(g) !== 'P' && typeof g.play === 'function');
  const acc = id => { const s = S.stats[id]; const n = s ? s.right + s.wrong : 0; return n ? s.right / n : null; };
  const plays = id => { const s = S.stats[id]; return s ? s.right + s.wrong : 0; };
  // Practice game: a recommended game in a weaker area (currentPicks + Learner.weakGame), else the lowest-accuracy tried game.
  function pickWeak(games) {
    const ids = new Set(games.map(g => g.id));
    const picks = (typeof currentPicks === 'function' ? currentPicks(6) : []).map(p => p.id).filter(id => ids.has(id));
    const weakPick = picks.find(id => window.Learner && window.Learner.weakGame && window.Learner.weakGame(gameById(id)));
    if (weakPick) return weakPick;
    if (picks.length) return picks[0];
    const tried = games.filter(g => plays(g.id) >= 3).sort((x, y) => acc(x.id) - acc(y.id));
    if (tried.length && acc(tried[0].id) < 0.85) return tried[0].id;
    const cur = games.filter(g => gradeOf(g) === kidGrade());
    return (cur.length ? pick(cur) : pick(games)).id;
  }
  // Game done well: 5+ answers at 85%+, then a strong area from the report card, then the most-played game.
  function pickStrong(games, not) {
    const rest = games.filter(g => g.id !== not && !(window.Learner && window.Learner.weakGame && window.Learner.weakGame(g)));
    const good = rest.filter(g => plays(g.id) >= 5 && acc(g.id) >= 0.85).sort((x, y) => plays(y.id) - plays(x.id));
    if (good.length) return good[0].id;
    const areas = (S.strongAreas && S.strongAreas.grade === kidGrade() && S.strongAreas.domains) || [];
    if (areas.length && window.Learner) { const g = rest.find(x => { const d = window.Learner.domainFor(x.id); return d && areas.includes(d.k); }); if (g) return g.id; }
    const played = rest.filter(g => plays(g.id) > 0).sort((x, y) => plays(y.id) - plays(x.id));
    if (played.length) return played[0].id;
    const cur = rest.filter(g => gradeOf(g) === kidGrade());
    return (cur.length ? pick(cur) : pick(rest.length ? rest : games)).id;
  }
  function plan() {
    const t = st(), games = pool();
    if (!games.length) return null;
    if (t.d !== dayNow() || t.step >= STEPS.length || !gameById(t.a) || !gameById(t.b)) {
      const weak = pickWeak(games), strong = pickStrong(games, weak);
      const slow = window.Learner && window.Learner.style && window.Learner.style() === 'slow';
      Object.assign(t, { d: dayNow(), step: 0, a: slow ? strong : weak, b: slow ? weak : strong });
      save();
    }
    return t;
  }
  const doneToday = () => st().done.includes(dayNow());
  const icons = () => { const t = st(), slow = window.Learner && window.Learner.style && window.Learner.style() === 'slow'; return [['🤸', TX.warm], [slow ? '⭐' : '💪', slow ? TX.fav : TX.practice, t.a], [slow ? '💪' : '⭐', slow ? TX.practice : TX.fav, t.b], ['🔁', TX.review], ['🎉', TX.party]]; };
  // ---- home button
  function homeHtml() {
    if (kidGrade() === 'P' || !pool().length) return '';
    const t = st(), going = t.d === dayNow() && t.step > 0 && t.step < STEPS.length, done = doneToday() && !going;
    return `<div class="controw hb-today-row"><button class="big read hb-today" id="today15"><span class="gi">${done ? '✅' : '⏱️'}</span>${L(TX.title)}<small>${done ? L(TX.doneSub) : going ? L(TX.cont(t.step + 1)) : L(TX.sub)}</small></button></div>`;
  }
  function bind() { const b = document.getElementById('today15'); if (b) b.onclick = start; }
  function start() {
    if (kidGrade() === 'P') return;
    const t = st();
    if (doneToday() && t.d === dayNow() && t.step >= STEPS.length) t.step = 0;
    if (!plan()) return home();
    stepScreen();
  }
  // Path screen between steps: where we are, one big button.
  function stepScreen() {
    const t = st(); active = false;
    if (t.step >= STEPS.length) return finish();
    const list = icons();
    const path = list.map(([ic, label, id], i) => `<li class="hb-stop${i < t.step ? ' done' : i === t.step ? ' now' : ''}" aria-current="${i === t.step ? 'step' : 'false'}"><span class="hb-ic">${i < t.step ? '✔️' : ic}</span><span class="hb-lb">${L(label)}${id && gameById(id) ? `<small>${gameById(id).icon} ${L(gameById(id).title)}</small>` : ''}</span></li>`).join('');
    const [ic, label] = list[t.step];
    view().innerHTML = `<div class="hb-wrap"><h1 class="hb-h">⏱️ ${L(TX.title)}</h1><ol class="hb-path">${path}</ol>
      <button class="next hb-go" id="hbGo">${ic} ${L(TX.go)}: ${L(label)}</button><button class="link" id="hbHome">🏠 ${L(TX.home)}</button></div>`;
    say(`${L(TX.title)}. ${L(label)}`);
    $('#hbGo').onclick = runStep; $('#hbHome').onclick = home;
  }
  function runStep() {
    const t = st(), kind = STEPS[t.step];
    if (kind === 'warm') return warmUp();
    if (kind === 'a' || kind === 'b') {
      const g = gameById(t[kind]); if (!g) { t.step++; save(); return stepScreen(); }
      active = true; launch(g); return;
    }
    if (kind === 'review') {
      if (!window.Spacing || !window.Spacing.dueCount()) { t.step++; save(); return stepScreen(); }
      active = true;
      window.Spacing.start({ onlySpacing: true, max: kidGrade() === 'K' ? 5 : 8, onEmpty: () => { active = false; t.step++; save(); stepScreen(); } });
    }
  }
  // Hook from core.js sessionEnd(game) after its screen is drawn: swap the end buttons for "Next".
  function afterRound(game) {
    const t = st(), kind = STEPS[t.step];
    if (!active || !(kind === 'a' || kind === 'b') || !game || game.id !== t[kind]) { active = false; return; }
    active = false; t.step++; save();
    swapButtons();
  }
  // Hook from core.js reviewStep() when a review run ends.
  function afterReview() {
    const t = st();
    if (!active || STEPS[t.step] !== 'review') { active = false; return; }
    active = false; t.step++; save();
    swapButtons();
  }
  function swapButtons() {
    const box = document.querySelector('#view .round-actions') || document.getElementById('reviewHome');
    const html = `<div class="menu intro round-actions hb-after"><button class="big math round-primary" id="hbNext"><span class="gi">⏱️</span>${L(TX.next)}<small>${STEPS.length > st().step ? `${Math.min(st().step + 1, STEPS.length)}/${STEPS.length}` : '🎉'}</small></button><button class="big ss" id="hbStop"><span class="gi">🏠</span>${L(TX.stop)}</button></div>`;
    if (box) box.outerHTML = html; else view().insertAdjacentHTML('beforeend', html);
    $('#hbNext').onclick = stepScreen; $('#hbStop').onclick = home;
  }
  function finish() {
    const t = st(); active = false;
    const first = !t.done.includes(dayNow());
    if (first) { t.done = t.done.concat(dayNow()).slice(-60); addPeach(); }
    t.step = STEPS.length; save();
    view().innerHTML = `<div class="hb-wrap"><h1 class="round-title">${PEACH_SVG('yay')}${L(TX.finish)}</h1>
      <p class="hb-row" aria-hidden="true">${icons().map(([ic]) => `<span>${ic}</span>`).join('<i>✔️</i>')}</p>
      <p class="tag">${first ? '🍑 +1 · ' : ''}${L(TX.days(recentDays()))}</p><button class="next" id="hbHome">🏠 ${L(TX.home)}</button></div>`;
    $('#hbHome').onclick = home; say(L(TX.finish)); sfx('win'); confetti(150);
  }
  const recentDays = () => { const from = window.Spacing ? window.Spacing.addDays(-13) : ''; return st().done.filter(d => d >= from).length; };
  // Grown-ups line: count of finished days, no scores.
  function grownHtml() { if (kidGrade() === 'P') return ''; const n = recentDays(); return `<p class="note2">⏱️ ${L(TX.title)} — ${L(TX.days(n))}</p>`; }

  // ---- warm-up: 3 short tasks, every tap is right (counting + syllable claps). About 30 seconds.
  const OBJ = ['🍎', '⭐', '🐟', '🌼', '🚗', '🐞', '🍪', '🎈'];
  const GROUPS = { 2: '🧦🧦', 5: '✋', 10: '🔟' };
  const WORDS = [['🦋', ['but', 'ter', 'fly']], ['🍌', ['ba', 'na', 'na']], ['🐢', ['tur', 'tle']], ['🌈', ['rain', 'bow']], ['🍎', ['ap', 'ple']], ['🐘', ['el', 'e', 'phant']], ['🐰', ['rab', 'bit']], ['🍉', ['wa', 'ter', 'mel', 'on']], ['🚀', ['rock', 'et']], ['🍕', ['piz', 'za']], ['🐶', ['dog']], ['🦒', ['gi', 'raffe']], ['🐊', ['al', 'li', 'ga', 'tor']], ['🧁', ['cup', 'cake']], ['🌻', ['sun', 'flow', 'er']]];
  let warm = null;
  function warmUp() {
    const g = kidGrade(), by = g === 'K' || g === '1' ? 1 : g === '2' ? pick([2, 5]) : pick([5, 10]);
    const words = shuffle(WORDS);
    warm = { i: 0, tasks: [{ kind: 'count', by }, { kind: 'clap', w: words[0] }, { kind: 'clap', w: words[1] }], tok: Date.now() };
    warmTask();
  }
  function warmTask() {
    const w = warm; if (!w) return;
    if (w.i >= w.tasks.length) { warm = null; const t = st(); t.step = Math.max(t.step, 1); save(); return stepScreen(); }
    const still = () => warm === w && !!document.getElementById('hbSkip');   // the child may have left the warm-up
    const task = w.tasks[w.i], dots = w.tasks.map((_, i) => `<b class="round-dot${i < w.i ? ' done' : i === w.i ? ' current' : ''}"></b>`).join('');
    const top = `<div class="hb-warmtop"><span class="round-dots" aria-hidden="true">${dots}</span><button class="link hb-skip" id="hbSkip">${L(TX.skip)} ⏭️</button></div>`;
    if (task.kind === 'count') {
      const n = task.by === 1 ? 3 + rnd(4) : 3 + rnd(3), obj = task.by === 1 ? pick(OBJ) : GROUPS[task.by];
      const ask = task.by === 1 ? L(TX.count) : L(TX.skipCount(task.by));
      view().innerHTML = `${top}<div class="prompt hb-ask"><span>${ask}</span><button class="say" id="hbSay" aria-label="🔊">🔊</button></div>
        <div class="hb-count" role="group">${Array.from({ length: n }, (_, i) => `<button class="hb-obj" data-i="${i}" aria-label="${obj}">${obj}<i></i></button>`).join('')}</div><div class="hb-big" id="hbBig" aria-live="polite"></div>`;
      let c = 0;
      $$('.hb-obj').forEach(b => b.onclick = () => {
        if (b.classList.contains('on')) return;
        c++; b.classList.add('on'); const v = c * task.by; b.querySelector('i').textContent = v; say(String(v), 'en-US'); tone(440 + c * 60, 120);
        if (c === n) { $('#hbBig').textContent = String(n * task.by); setTimeout(() => { if (still()) { w.i++; warmTask(); } }, 1400); }
      });
      $('#hbSay').onclick = () => say(ask);
      say(ask);
    } else {
      const [pic, parts] = task.w;
      view().innerHTML = `${top}<div class="prompt hb-ask"><span>${L(TX.clap)}</span><button class="say" id="hbSay" aria-label="🔊">🔊</button></div>
        <div class="hb-pic" aria-hidden="true">${pic}</div><div class="hb-parts">${parts.map((p, i) => `<span class="hb-part" data-i="${i}">${p}</span>`).join('<span class="hb-dot">·</span>')}</div>
        <button class="hb-drum" id="hbDrum" aria-label="🥁">🥁</button>`;
      let c = 0;
      say(parts.join(''), 'en-US');
      $('#hbSay').onclick = () => { say(L(TX.clap)); say(parts.join(''), 'en-US', true); };
      $('#hbDrum').onclick = () => {
        if (c >= parts.length) return;
        const el = document.querySelector(`.hb-part[data-i="${c}"]`); el.classList.add('on'); say(parts[c], 'en-US'); tone(300 + c * 80, 140, 0, 'triangle'); c++;
        const d = $('#hbDrum'); d.classList.remove('hit'); void d.offsetWidth; d.classList.add('hit');
        if (c === parts.length) setTimeout(() => { if (!still()) return; say(parts.join(''), 'en-US'); $('.hb-parts').classList.add('whole'); setTimeout(() => { if (still()) { w.i++; warmTask(); } }, 1300); }, 600);
      };
    }
    $('#hbSkip').onclick = () => { w.i = w.tasks.length; warmTask(); };
  }
  window.Today = { clean, homeHtml, bind, start, afterRound, afterReview, grownHtml, STEPS };
})();
