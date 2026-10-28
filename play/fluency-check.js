(() => {
  'use strict';
  // Grown-up 1-minute check (2026-10-28). A grown-up holds the device, the child reads aloud, the grown-up taps.
  // K: letter names (upper and lower case mixed, our own random order) or school sight words (window.SCHOOL_SIGHT).
  // Grade 1+: a short original passage; when the minute ends the grown-up taps the last word read.
  // No recording, no microphone, nothing leaves the device (S.fluency only).
  // Results are compared ONLY with this child's own earlier tries ("+4 since last time"):
  // no official names, cut-off numbers, colors, grade norms or risk words (docs/worksheets/dibels-heggerty.md §4).
  // The child never sees a clock: the minute is a thin bar on the grown-up's side, and a soft tone ends it.
  // Loaded before core.js (cleanState uses clean()).
  const B = (en, ko) => ({ en, ko });
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const okDate = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(Date.parse(d + 'T00:00:00Z')) && new Date(d + 'T00:00:00Z').toISOString().slice(0, 10) === d;
  const KINDS = ['letters', 'sight', 'passage'];
  const int = (v, max) => (Number.isInteger(v) && v >= 0 && v <= max ? v : 0);
  // S.fluency = [{ d, k, n (right / words read), x (marked not yet), u (not sure), sec (time used), p (passage id) }], last 60
  const clean = (list) => (Array.isArray(list) ? list : []).filter(r => isObj(r) && okDate(r.d) && KINDS.includes(r.k) && Number.isInteger(r.n) && r.n >= 0 && r.n <= 400)
    .slice(-60).map(r => Object.assign({ d: r.d, k: r.k, n: r.n, x: int(r.x, 400), u: int(r.u, 400), sec: Number.isInteger(r.sec) && r.sec >= 1 && r.sec <= 60 ? r.sec : 60 }, typeof r.p === 'string' && /^[a-z0-9]{1,8}$/.test(r.p) ? { p: r.p } : {}));

  // Original passages written for this app (not taken from any test or book). Bands by school grade.
  const PASSAGES = {
    g1: [
      ['g1a', 'Sam has a red cap. He puts it on his head. The wind comes and the cap flies up. It lands in a big tree. Sam can not get it. His dog sits and looks up. A bird hops on the cap. Then the bird drops it. Sam and his dog run to get it.'],
      ['g1b', 'Mia likes to dig. She digs in the sand with a pink cup. She finds a shell and a stick. She makes a sand cake. Then she puts the shell on top. Her mom says it looks good. Mia says it is not for eating. It is just for fun. They both laugh.'],
      ['g1c', 'The frog is on a log. It is a hot day. The frog wants to get wet. It jumps in the pond with a big splash. A fish swims by. The frog swims fast to the other side. It sits on a rock in the sun. Now the frog is wet and happy.'],
    ],
    g2: [
      ['g2a', 'On Saturday morning, Leo and his grandpa went to the farmers market. They walked past tables full of peaches, corn, and green beans. Leo wanted to buy something all by himself. He counted the coins in his pocket and found four quarters. He chose a basket of small red tomatoes. The farmer smiled and gave him one extra tomato to taste. It was sweet and warm from the sun. On the way home, Leo told his grandpa that he wanted to plant tomatoes in their own backyard.'],
      ['g2b', 'Nora had a loose tooth for a whole week. It wiggled when she ate apples, and it wiggled when she talked. At lunch on Tuesday, she bit into a sandwich and felt something small and hard. Her tooth had come out! She wrapped it in a napkin and showed her teacher. The teacher gave her a tiny paper box shaped like a tooth. Nora carried the box carefully all afternoon. That night, she put it next to her bed and tried very hard to stay awake.'],
      ['g2c', 'The class planted bean seeds in clear cups so they could watch the roots grow. Every morning, Omar checked his cup first. On the third day, a thin white root poked out of the seed. A few days later, a green stem pushed up through the soil. Omar measured it with a ruler and wrote the number in his notebook. By Friday, his plant had two round leaves. He turned the cup toward the window because the plant was leaning that way, looking for light.'],
    ],
    g3: [
      ['g3a', 'When the power went out during the storm, the whole apartment turned dark and quiet. Priya could hear rain hitting the windows and the wind pushing against the building. Her dad found a flashlight in the kitchen drawer, and her little brother brought every blanket he could carry. They built a fort in the living room and sat inside it together. Dad told a story about a storm he remembered from when he was a boy. Priya made shadow animals on the blanket wall with the flashlight. A rabbit, a bird, and a very wobbly elephant appeared. Before long, nobody was thinking about the storm anymore. When the lights finally blinked back on, her brother groaned and asked if they could turn them off again.'],
      ['g3b', 'Every fall, monarch butterflies begin a long trip south. Some of them fly thousands of miles to reach the same mountain forests their great-grandparents visited the year before. No single butterfly makes the whole round trip, so none of them has been there before. Scientists are still studying how they find their way. They think the butterflies use the position of the sun, and maybe the pull of the earth, to guide them. Along the way, the monarchs stop to drink nectar from flowers and rest in trees. People can help by planting milkweed and wildflowers. Milkweed is the only plant where monarchs lay their eggs, so a small garden can make a big difference.'],
      ['g3c', 'Grace wanted to win the paper airplane contest at the library. Her first plane flew straight into the floor. Her second plane looped once and crashed into a chair. Instead of giving up, she unfolded both planes and looked closely at the creases. She noticed that one wing was bigger than the other. She folded a new plane slowly, pressing every edge with her thumbnail to make it sharp and even. Then she added a small paper clip to the nose. On the day of the contest, her plane glided across the room in a long, smooth line. It did not fly the farthest, but the librarian gave her a ribbon for the best design.'],
    ],
    g4: [
      ['g4a', 'Long before there were maps on phones, sailors crossed oceans by reading the sky. During the day they watched the sun, and at night they looked for bright stars that rose and set in the same places. Some islanders in the Pacific could also read the shape of the waves. When waves bounced off an island far away, they changed the way the canoe rocked, even when no land was in sight. Navigators trained for years to notice these tiny clues. They memorized star paths in songs and stories so the knowledge could be passed down. Today, some sailors still practice these old skills. They say it helps them understand the ocean in a way that a screen never could, because they have to pay attention to everything around them.'],
      ['g4b', 'Marcus had always been the fastest runner in his class, so he expected to win the school race easily. On the morning of the race, he barely stretched and joked with his friends at the starting line. When the whistle blew, he shot ahead of everyone. By the second lap, though, his legs felt heavy and his breathing was loud and ragged. A quiet girl named Ellie, who had started slowly, passed him on the final curve. She kept the same steady pace she had used from the very beginning. Marcus finished third. At first he was embarrassed, but later he asked Ellie how she had trained. She showed him the running plan she had followed for six weeks, and he asked if he could try it with her.'],
      ['g4c', 'The Okefenokee Swamp in southern Georgia is one of the largest wetlands in North America. Its name is often said to mean land of trembling earth, because some of the ground is made of thick floating peat that shakes when you step on it. Alligators rest along the edges of the dark water, and great blue herons stand perfectly still while they wait for fish. The water looks like strong tea because of tannins from fallen leaves and plants. Many visitors explore the swamp by canoe, paddling slowly along narrow trails between cypress trees. Rangers remind them to stay in the boat, keep their hands inside, and leave every plant and animal exactly where they found it.'],
    ],
  };
  const band = () => { const g = kidGrade(); return g === '1' ? 'g1' : g === '2' ? 'g2' : g === '3' ? 'g3' : 'g4'; };
  const LETTERS_MIX = () => shuffle('ABCDEFGHJKLMNOPQRSTUVWXYZ'.split('').concat('abcdefghijkmnopqrstuvwxyz'.split('')));   // I and l left out (look the same in many fonts)
  const sightList = () => {
    const src = window.SCHOOL_SIGHT && Array.isArray(window.SCHOOL_SIGHT.L2) ? window.SCHOOL_SIGHT.L2 : (typeof SIGHT2 !== 'undefined' ? SIGHT2 : ['the', 'and', 'see', 'like', 'can', 'go', 'we', 'my', 'to', 'is']);
    return shuffle([...new Set(src.map(w => typeof w === 'string' ? w : isObj(w) ? (w.w || w.word || '') : '').filter(w => /^[A-Za-z' ]{1,20}$/.test(w)))]);
  };
  const TX = {
    title: B('1-minute reading check (grown-ups)', '1분 읽기 점검 (보호자용)'),
    intro: B('You hold the device, your child reads aloud, you tap. Nothing is recorded or sent.', '보호자가 기기를 들고, 아이가 소리 내어 읽으면 보호자가 탭해요. 녹음하지 않고 어디에도 보내지 않아요.'),
    notTest: B('This is a practice record, not a school test. It only compares your child with their own earlier tries.', '연습 기록이며 학교 검사가 아닙니다. 같은 아이의 지난 기록과만 비교해요.'),
    letters: B('Letter names', '글자 이름'), sight: B('School sight words', '학교 sight word'), passage: B('Short passage', '짧은 글'),
    lettersSub: B('Upper and lower case, mixed', '대문자·소문자 섞어서'), sightSub: B('Words from school lists', '학교 낱말 목록에서'), passageSub: B('Tap the last word read', '마지막으로 읽은 낱말을 탭'),
    rules: B('Before you start', '시작 전에'),
    r1: B('Stuck for about 3 seconds? Say the answer and tap ✗.', '3초쯤 멈추면 답을 알려 주고 ✗를 눌러요.'),
    r2: B('Fixes it by themselves? That is ✓.', '스스로 고쳐 읽으면 ✓예요.'),
    r3: B('Accent or a new-English-learner sound is not wrong.', '말투나 영어를 배우는 중인 발음은 틀린 게 아니에요.'),
    r4: B('Not sure? Tap ? — it is not counted.', '확실하지 않으면 ?를 눌러요 — 세지 않아요.'),
    r5: B('Do not mention time. Say "Read these to me, like a game."', '시간 얘기는 하지 마세요. "게임처럼 읽어 줄래?" 하고 시작해요.'),
    rp1: B('Your child reads from the first word. When the soft tone plays, tap the last word they read.', '아이가 첫 낱말부터 읽어요. 부드러운 소리가 나면 마지막으로 읽은 낱말을 탭해요.'),
    rp2: B('Skipped or wrong words are fine to ignore here — only how far they got is saved.', '건너뛰거나 틀린 낱말은 여기서는 따로 표시하지 않아요 — 어디까지 읽었는지만 저장해요.'),
    start: B('Start (1 minute)', '시작 (1분)'), back: B('Back', '뒤로'), stopEarly: B('Finished early', '일찍 끝남'), stop: B('Stop', '그만'),
    tapLast: B('Time! Tap the last word your child read.', '끝! 아이가 마지막으로 읽은 낱말을 탭하세요.'), lost: B('I lost track (do not save)', '놓쳤어요 (저장 안 함)'),
    done: B('Saved on this device', '이 기기에 저장했어요'), notSaved: B('Not saved.', '저장하지 않았어요.'),
    right: B('read', '읽음'), words: B('words read', '읽은 낱말'), first: B('First try — next time you will see the change.', '첫 기록이에요 — 다음부터 변화를 볼 수 있어요.'),
    since: (d, v) => B(`${v > 0 ? '+' : ''}${v} since last time (${d})`, `지난번(${d})보다 ${v > 0 ? '+' : ''}${v}`), same: (d) => B(`Same as last time (${d})`, `지난번(${d})과 같아요`),
    vary: B('Numbers go up and down a little from day to day (different order, different passage, tiredness). Look at the direction over several weeks.', '날마다 순서·글·컨디션이 달라 숫자가 조금씩 오르내려요. 몇 주에 걸친 방향을 보세요.'),
    teacher: B('If you are worried, talk with the classroom teacher.', '걱정되면 담임 선생님과 이야기해 보세요.'),
    recent: B('Recent tries', '최근 기록'), none: B('No tries yet.', '아직 기록이 없어요.'), open: B('Open 1-minute check', '1분 점검 열기'),
    earlyAll: (s) => B(`finished early (${s}s)`, `일찍 끝남 (${s}초)`),
    grownBar: B('Grown-up timer', '보호자용 시간'),
  };
  const kindsFor = () => (kidGrade() === 'K' ? ['letters', 'sight'] : ['passage']);
  const list = () => (S.fluency = clean(S.fluency));
  const prevOf = (k, p) => list().filter(r => r.k === k && (k !== 'passage' || (r.p || '').slice(0, 2) === (p || '').slice(0, 2)));
  const md = d => d.slice(5).replace('-', '/');
  function trendLine(r, before) {
    if (!before) return `<p class="fc-trend">${L(TX.first)}</p>`;
    const v = r.n - before.n;
    return `<p class="fc-trend">${v === 0 ? L(TX.same(md(before.d))) : L(TX.since(md(before.d), v))}</p>`;
  }
  // Small neutral bar list of this child's own tries (one color, no bands, no target line).
  function historyHtml(k) {
    const rows = list().filter(r => r.k === k && (k !== 'passage' || (r.p || '').slice(0, 2) === band())).slice(-4);
    if (!rows.length) return `<p class="note2">${L(TX.none)}</p>`;
    const max = Math.max(...rows.map(r => r.n), 1);
    return `<ul class="fc-hist">${rows.map(r => `<li><span>${md(r.d)}</span><i style="width:${Math.max(4, Math.round(100 * r.n / max))}%"></i><b>${r.n}${r.sec < 60 ? `<small>${r.sec}s</small>` : ''}</b></li>`).join('')}</ul>`;
  }
  // ---- grown-ups panel section (app.js grownups())
  function html() {
    if (kidGrade() === 'P') return '';
    const parts = kindsFor().map(k => {
      const rows = list().filter(r => r.k === k && (k !== 'passage' || (r.p || '').slice(0, 2) === band())), last = rows[rows.length - 1], before = rows[rows.length - 2];
      return last ? `<li>${L(TX[k])}: <b>${last.n}</b> ${k === 'passage' ? L(TX.words) : L(TX.right)} · ${md(last.d)}${before ? ` (${last.n - before.n > 0 ? '+' : ''}${last.n - before.n})` : ''}</li>` : '';
    }).join('');
    return `<section class="fc-sec"><h2>⏱️ ${L(TX.title)}</h2><p class="note2">${L(TX.notTest)}</p>${parts ? `<ul class="fc-mini">${parts}</ul>` : ''}<button class="pill" id="fcOpen">${L(TX.open)}</button></section>`;
  }
  function bind() { const b = document.getElementById('fcOpen'); if (b) b.onclick = open; }
  // ---- choose screen
  function open() {
    stopTimer();
    if (kidGrade() === 'P') return grownups();
    const kinds = kindsFor();
    view().innerHTML = `<div class="fc-wrap"><h1 class="fc-h">⏱️ ${L(TX.title)}</h1><p class="note2">${L(TX.intro)} ${L(TX.notTest)}</p>
      <div class="menu fc-kinds">${kinds.map(k => `<button class="big read" data-fc="${k}"><span class="gi">${k === 'letters' ? '🔤' : k === 'sight' ? '👀' : '📄'}</span>${L(TX[k])}<small>${L(TX[k + 'Sub'])}</small></button>`).join('')}</div>
      ${kinds.map(k => `<h2 class="fc-h2">${L(TX[k])}</h2>${historyHtml(k)}`).join('')}
      <button class="next" id="fcBack">${L(TX.back)}</button></div>`;
    $$('[data-fc]').forEach(b => b.onclick = () => rules(b.dataset.fc));
    $('#fcBack').onclick = grownups;
  }
  function rules(k) {
    const items = k === 'passage' ? [TX.rp1, TX.r3, TX.rp2, TX.r5] : [TX.r1, TX.r2, TX.r3, TX.r4, TX.r5];
    view().innerHTML = `<div class="fc-wrap"><h1 class="fc-h">${L(TX[k])}</h1><h2 class="fc-h2">${L(TX.rules)}</h2>
      <ul class="fc-rules">${items.map(t => `<li>${L(t)}</li>`).join('')}</ul><p class="note2">${L(TX.notTest)}</p>
      <button class="next" id="fcStart">▶ ${L(TX.start)}</button><button class="link" id="fcBack">${L(TX.back)}</button></div>`;
    $('#fcStart').onclick = () => (k === 'passage' ? runPassage() : runCards(k));
    $('#fcBack').onclick = open;
  }
  // ---- timer (grown-up side only: a thin bar, no numbers)
  let timer = null;
  const stopTimer = () => { if (timer) { clearInterval(timer.id); timer = null; } };
  function startTimer(onEnd) {
    stopTimer();
    const t0 = Date.now(), me = { id: 0, t0 };
    me.id = setInterval(() => {
      const bar = document.getElementById('fcBar');
      if (!bar) return stopTimer();                                     // screen changed
      const p = Math.min(1, (Date.now() - t0) / 60000); bar.style.width = (100 * (1 - p)) + '%';
      if (p >= 1) { stopTimer(); tone(660, 220, 0, 'sine', 0.08); tone(523, 320, 0.22, 'sine', 0.08); onEnd(60); }
    }, 250);
    timer = me;
  }
  const used = () => (timer ? Math.max(1, Math.min(60, Math.round((Date.now() - timer.t0) / 1000))) : 60);
  // ---- K cards: one big item; grown-up taps ✗ / ? / ✓
  function runCards(k) {
    const items = k === 'letters' ? LETTERS_MIX() : sightList();
    const r = { n: 0, x: 0, u: 0 }; let i = 0, over = false;
    view().innerHTML = `<div class="fc-run"><div class="fc-card" id="fcCard" lang="en"></div>
      <div class="fc-grown"><div class="fc-timer" title="${L(TX.grownBar)}"><i id="fcBar"></i></div>
      <div class="fc-taps"><button class="fc-tap no" id="fcNo" aria-label="✗">✗</button><button class="fc-tap un" id="fcUn" aria-label="?">?</button><button class="fc-tap ok" id="fcOk" aria-label="✓">✓</button></div>
      <button class="link" id="fcStop">${L(TX.stop)}</button></div></div>`;
    const show = () => { $('#fcCard').textContent = items[i]; $('#fcCard').classList.toggle('word', k === 'sight'); };
    const end = (sec) => { if (over) return; over = true; stopTimer(); saveResult({ k, n: r.n, x: r.x, u: r.u, sec }); };
    const tap = (key) => { if (over) return; r[key]++; i++; try { navigator.vibrate && navigator.vibrate(10); } catch (e) {} if (i >= items.length) return end(used()); show(); };
    $('#fcOk').onclick = () => tap('n'); $('#fcNo').onclick = () => tap('x'); $('#fcUn').onclick = () => tap('u');
    $('#fcStop').onclick = () => { over = true; stopTimer(); notSaved(); };
    show(); startTimer(end);
  }
  // ---- passage: child reads; at the tone the grown-up taps the last word read
  function runPassage() {
    const b = band(), pool = PASSAGES[b], seen = list().filter(r => r.k === 'passage' && r.p).map(r => r.p);
    const p = pool.slice().sort((x, y) => seen.lastIndexOf(x[0]) - seen.lastIndexOf(y[0]))[0];
    const words = p[1].split(/\s+/);
    let over = false;
    view().innerHTML = `<div class="fc-run fc-prun"><div class="fc-text ${b}" id="fcText" lang="en">${words.map((w, i) => `<span class="fc-w" data-i="${i}">${w}</span>`).join(' ')}</div>
      <div class="fc-grown"><p class="fc-msg" id="fcMsg" role="status" aria-live="polite"></p><div class="fc-timer" title="${L(TX.grownBar)}"><i id="fcBar"></i></div>
      <div class="fc-row" id="fcRow"><button class="pill" id="fcEarly">${L(TX.stopEarly)}</button><button class="link" id="fcStop">${L(TX.stop)}</button></div></div></div>`;
    // Shrink the passage until it fits the box (no scrolling, nothing cut off); 13px is the floor.
    const box = $('#fcText'); let fs = parseFloat(getComputedStyle(box).fontSize);
    while (box.scrollHeight > box.clientHeight + 1 && fs > 13) { fs -= 1; box.style.fontSize = fs + 'px'; }
    const ask = (sec) => {
      if (over) return; over = true; stopTimer();
      $('#fcMsg').textContent = L(TX.tapLast); $('#fcText').classList.add('pickable');
      $('#fcRow').innerHTML = `<button class="link" id="fcLost">${L(TX.lost)}</button>`;
      $('#fcLost').onclick = notSaved;
      $$('.fc-w').forEach(s => s.onclick = () => saveResult({ k: 'passage', n: +s.dataset.i + 1, x: 0, u: 0, sec, p: p[0] }));
    };
    $('#fcEarly').onclick = () => ask(used());
    $('#fcStop').onclick = () => { over = true; stopTimer(); notSaved(); };
    startTimer(ask);
  }
  function notSaved() { stopTimer(); view().innerHTML = `<div class="fc-wrap"><p class="tag">${L(TX.notSaved)}</p><button class="next" id="fcBack">${L(TX.back)}</button></div>`; $('#fcBack').onclick = open; }
  function saveResult(r) {
    stopTimer();
    const before = prevOf(r.k, r.p).slice(-1)[0];
    const row = clean([Object.assign({ d: today() }, r)])[0];
    if (!row) return notSaved();
    S.fluency = list().concat(row).slice(-60); save();
    const extra = r.k === 'passage' ? '' : ` <small>(✗ ${r.x} · ? ${r.u})</small>`;
    view().innerHTML = `<div class="fc-wrap"><h1 class="fc-h">${L(TX[r.k])}</h1><p class="fc-num"><b>${r.n}</b> ${r.k === 'passage' ? L(TX.words) : L(TX.right)}${extra}${r.sec < 60 ? ` · ${L(TX.earlyAll(r.sec))}` : ''}</p>
      ${trendLine(row, before)}${historyHtml(r.k)}
      <p class="note2">✅ ${L(TX.done)} · ${L(TX.notTest)} ${L(TX.vary)} ${L(TX.teacher)}</p><button class="next" id="fcBack">${L(TX.back)}</button></div>`;
    $('#fcBack').onclick = open;
  }
  window.Fluency = { clean, html, bind, open, PASSAGES };
})();
