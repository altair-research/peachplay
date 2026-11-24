// i-Ready K section (2026-11-20, 대표: the child takes the K i-Ready Diagnostic at school in December —
// "one place to practice only that"). A button at the top of a K child's home opens a screen grouped by the
// i-Ready Diagnostic domains (reading 6, math 4) with the K games that practice each one. If a grown-up entered
// the school i-Ready placements (SchoolResults), the areas marked lowest come first. A game started here returns
// here when the child presses home, so practice stays in this section (a full lock is the next step).
// Not affiliated with i-Ready or Curriculum Associates; no test items are used.
(() => {
  'use strict';
  const B = (en, ko) => ({ en, ko });
  // kid-facing name, i-Ready domain name (from SchoolResults.IR), K games in a gentle order
  const AREAS = [
    { k: 'pa', s: 'read', icon: '👂', kid: B('Hear the sounds', '소리 듣기'), g: ['rhyme', 'syllable', 'compound', 'soundplay', 'endsound', 'phoneme', 'soundswap'] },
    { k: 'ph', s: 'read', icon: '🔤', kid: B('Letters and sounds', '글자와 소리'), g: ['letters', 'sounds', 'memory', 'readmatch', 'wordchain', 'soundteam'] },
    { k: 'hfw', s: 'read', icon: '👀', kid: B('Words I know by sight', '한눈에 읽는 낱말'), g: ['sight', 'adwordsK'] },
    { k: 'voc', s: 'read', icon: '💬', kid: B('Word meanings', '낱말 뜻'), g: ['opposites', 'admeaningK', 'directions', 'sortbox', 'listenpic'] },
    { k: 'lit', s: 'read', icon: '📖', kid: B('Stories', '이야기'), g: ['adstoryK', 'adstoryorderK', 'poemK', 'bookmakersK'] },
    { k: 'inf', s: 'read', icon: '🔎', kid: B('Fact books', '정보 글'), g: ['adinfoK', 'adinfotopicK', 'askfindK'] },
    { k: 'num', s: 'math', icon: '🔢', kid: B('Counting and numbers', '세기와 수'), g: ['count', 'quantity', 'pair1to1', 'order', 'compare', 'represent', 'teens', 'tens', 'ladder'] },
    { k: 'alg', s: 'math', icon: '➕', kid: B('Add, take away, patterns', '더하기·빼기·규칙'), g: ['addsub', 'ten', 'numline', 'pattern'] },
    { k: 'meas', s: 'math', icon: '📏', kid: B('Measure and graphs', '길이·그래프'), g: ['measure', 'graph', 'daytime'] },
    { k: 'geo', s: 'math', icon: '🔺', kid: B('Shapes', '도형'), g: ['shapes2d', 'shapes3d', 'shapejoin', 'positions'] }
  ];
  const RANK = { b: 0, e: 1, m: 2 };
  // 11-20 (서연): the child left through the breadcrumb subject link and the end screen's "play anything".
  // Section mode now stays on from opening the section until the section's own 🏠 is pressed: home(), the
  // breadcrumb and the end screen all lead back here (nav.js, core.js ask active()).
  let mode = false;
  // the six K "ad" reading games shared one 📖 icon and one subtitle — a child who cannot read saw six identical cards
  const LOOK = {
    adwordsK: ['🔡', B('Spell a word you know', '아는 낱말 철자')], admeaningK: ['🤝', B('Opposite pairs', '반대 뜻 짝 찾기')],
    adstoryK: ['🐻', B('Listen to a short story', '짧은 이야기 듣기')], adstoryorderK: ['1️⃣', B('What happened first?', '무엇이 먼저?')],
    adinfoK: ['📋', B('Steps to make something', '만드는 순서')], adinfotopicK: ['🛠️', B('What is it making?', '무엇을 만들까?')]
  };
  function relook() { Object.entries(LOOK).forEach(([id, [icon, sub]]) => { const g = typeof gameById === 'function' && gameById(id); if (g) { g.icon = icon; g.sub = sub; } }); }

  const shown = () => typeof kidGrade === 'function' && kidGrade() === 'K';
  const games = (a) => a.g.map(id => typeof gameById === 'function' && gameById(id)).filter(g => g && visibleGames().includes(g));
  const irName = (k) => { const d = window.SchoolResults && SchoolResults.IR.find(x => x.k === k); return d ? L(d.n) : k; };
  const placed = () => (window.SchoolResults && SchoolResults.current && SchoolResults.current()) || null;
  function ordered(subject) {
    const s = placed(), list = AREAS.filter(a => a.s === subject);
    if (!s || !Object.keys(s.ir).length) return list;
    return list.map((a, i) => ({ a, i, r: s.ir[a.k] in RANK ? RANK[s.ir[a.k]] : 1.5 })).sort((x, y) => x.r - y.r || x.i - y.i).map(x => x.a);
  }
  const dot = (k) => { const s = placed(), v = s && s.ir[k]; const l = v && SchoolResults.LEVELS.find(x => x.v === v); return l ? `<span class="irk-dot" title="${L(l.n)}">${l.dot}</span>` : ''; };

  // 11-20 (서연 persona split, 지안 decision): "today, these two" — one reading and one math game. With school results the
  // lowest area of each subject; without, the areas take turns by day. Inside the area, the game played least (stable all day).
  function todayPicks() {
    const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 6e4) / 864e5), played = id => { const v = (S.stats || {})[id]; return v ? (v.right || 0) + (v.wrong || 0) : 0; };
    // 서연 v5.14: "below" should start with the area's easiest games, and a first-time child without results got a heavy
    // reading-comprehension game. Area game lists are in gentle order, so the level picks how far down the list to look:
    // below → first 2 games, early on → first 3, mid or above → any. Without results: reading takes turns among the
    // foundational areas (sounds, letters, sight words, word meanings) and only their first 2 games.
    const s = placed(), hasPlace = s && Object.keys(s.ir).length;
    return ['read', 'math'].map((subject, si) => {
      let list = ordered(subject).filter(a => games(a).length);
      if (!hasPlace && subject === 'read') list = list.filter(a => ['pa', 'ph', 'hfw', 'voc'].includes(a.k));
      if (!list.length) return null;
      const area = hasPlace ? list[0] : list[(day + si * 3) % list.length], all = games(area);
      const v = hasPlace ? s.ir[area.k] : '', gs = all.slice(0, v === 'b' || !hasPlace ? 2 : v === 'e' ? 3 : all.length);
      if (v === 'b') { const first = gs.find(g => played(g.id) < 20); if (first) return first; }   // easiest first until two rounds
      return gs.map((g, i) => ({ g, n: played(g.id), r: (i + day) % gs.length })).sort((x, y) => x.n - y.n || x.r - y.r)[0].g;
    }).filter(Boolean);
  }
  // 11-20 (지안 decision, 대표 "섹션 먼저, 나중에 그것만 보이게"): grown-ups can lock the app to this section. Locked: home,
  // subject lists and "play anything" all lead here, and only the grown-up gate unlocks it.
  // the section and the results screen are not history screens, so the last game's path (홈 › 수학 › …) stayed on top (서연 11-20)
  function hideCrumbs() { const c = document.getElementById('crumbs'); if (c) c.hidden = true; document.body.classList.remove('has-crumbs'); }
  const locked = () => !!(S && S.irkLock) && shown();
  function setLock(on) { S.irkLock = !!on; if (!on) delete S.irkLock; save(); }

  function homeHtml() {
    if (!shown()) return '';
    return `<div class="controw irk-home"><button class="big irk-go" id="irkOpen"><span class="gi">📝</span><span class="irk-bt"><b>${L(B('i-Ready K practice', 'i-Ready K 준비'))}</b><small>${L(B('Reading and math, area by area', '읽기·수학 영역별 연습'))}</small></span></button></div>`;
  }
  function bind() { const b = document.getElementById('irkOpen'); if (b) b.onclick = open; }

  const areaCard = (a) => {
    const gs = games(a); if (!gs.length) return '';
    return `<section class="irk-area" data-k="${a.k}"><h3><span class="irk-ic" aria-hidden="true">${a.icon}</span><span class="irk-names"><b>${L(a.kid)}</b><small>${dot(a.k)}i-Ready · ${irName(a.k)}</small></span><button class="home-say irk-say" data-say="${L(a.kid).replace(/"/g, '&quot;')}" aria-label="${T().listen}: ${L(a.kid)}">🔊</button></h3><div class="menu">${gs.map(gameBtn).join('')}</div></section>`;
  };
  function open() {
    mode = true; relook(); document.body.classList.remove('grown'); hideCrumbs();
    const s = placed(), hasPlace = s && Object.keys(s.ir).length;
    // 서연 11-20: the two things grown-ups want most (diagnostic practice, entering results) were at the very bottom.
    view().innerHTML = `<h1>📝 ${L(B('i-Ready K practice', 'i-Ready K 준비'))}</h1>
      <p class="tag">${L(B('Pick an area and play. Each game has new questions every round.', '영역을 골라 게임을 해요. 판마다 문제가 바뀌어요.'))}</p>
      ${(() => { const t = todayPicks(); return t.length ? `<section class="irk-today"><h2 class="irk-sub">⭐ ${L(B('Today, these two', '오늘 추천 2개'))}<button class="home-say irk-say" data-say="${L(B('Today, these two', '오늘 추천 2개'))}" aria-label="${T().listen}">🔊</button></h2><div class="menu">${t.map(gameBtn).join('')}</div></section>` : ''; })()}
      <div class="controw"><button class="big adapt" id="irkAdapt"><span class="gi">🧭</span>${L(B('Diagnostic Practice', '진단 평가 연습'))}<small>${L(B('Questions change to fit you, like the school test', '학교 시험처럼 나에게 맞게 문제가 바뀌어요'))}</small></button></div>
      <h2 class="irk-sub">📚 ${L(B('Reading', '읽기'))}</h2>${ordered('read').map(areaCard).join('')}
      <h2 class="irk-sub">🧮 ${L(B('Math', '수학'))}</h2>${ordered('math').map(areaCard).join('')}
      <div class="irk-grown"><p class="note2">${hasPlace ? L(B('Areas marked lower on the school i-Ready results come first.', '학교 i-Ready 결과에서 낮게 나온 영역이 먼저 나와요.')) : L(B('Grown-ups: enter the school i-Ready results and the areas that need practice come first.', '보호자: 학교 i-Ready 결과를 넣으면 연습이 필요한 영역이 먼저 나와요.'))}</p>
      <button class="pill" id="irkResults">📊 ${L(B('Grown-ups · Enter school i-Ready results', '보호자 · 학교 i-Ready 결과 넣기'))}</button>
      <button class="pill" id="irkLock">${locked() ? '🔓 ' + L(B('Grown-ups · Unlock the app', '보호자 · 잠금 풀기')) : '🔒 ' + L(B('Grown-ups · Show only this section', '보호자 · 이 섹션만 보이게'))}</button>
      ${locked() ? `<p class="note2">🔒 ${L(B('Locked: the app opens here and other games are hidden until a grown-up unlocks it.', '잠금 중: 앱을 열면 여기로 오고, 보호자가 풀 때까지 다른 게임은 안 보여요.'))}</p>` : ''}
      <p class="note2">${L(B('PeachPlay is not affiliated with i-Ready or Curriculum Associates and uses its own questions.', 'PeachPlay는 i-Ready·Curriculum Associates와 관계없고, 자체 문제를 써요.'))}</p></div>
      ${locked() ? '' : `<div><button class="next" id="irkHome">🏠 ${L(B('Leave i-Ready practice', 'i-Ready 준비 나가기'))}</button></div>`}`;
    view().classList.add('irk-screen');
    wireGames();
    $$('.irk-say').forEach(b => b.onclick = () => say(b.dataset.say));
    $('#irkAdapt').onclick = () => { if (typeof adaptIntro === 'function') adaptIntro(); };
    $('#irkResults').onclick = () => { if (typeof gate === 'function' && window.SchoolResults) gate(() => { hideCrumbs(); SchoolResults.open(open); }); };
    $('#irkLock').onclick = () => { if (typeof gate !== 'function') return; const on = !locked(); gate(() => { setLock(on); open(); }); };
    if ($('#irkHome')) $('#irkHome').onclick = () => { mode = false; home(); };
    window.scrollTo(0, 0);
  }
  // home() asks this first: while section mode is on, home is the section.
  const active = () => { if (!shown()) { mode = false; return false; } return mode || locked(); };
  function takeReturn() { return active(); }

  const has = (id) => AREAS.some(a => a.g.includes(id));
  window.IReadyK = { AREAS, homeHtml, bind, open, takeReturn, active, locked, todayPicks, has };
})();
