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
    { k: 'pa', s: 'read', icon: '👂', kid: B('Hear the sounds', '소리 듣기'), g: ['rhyme', 'syllable', 'compound', 'soundplay', 'endsound', 'phoneme'] },
    { k: 'ph', s: 'read', icon: '🔤', kid: B('Letters and sounds', '글자와 소리'), g: ['letters', 'sounds', 'memory', 'readmatch', 'wordchain'] },
    { k: 'hfw', s: 'read', icon: '👀', kid: B('Words I know by sight', '한눈에 읽는 낱말'), g: ['sight', 'adwordsK'] },
    { k: 'voc', s: 'read', icon: '💬', kid: B('Word meanings', '낱말 뜻'), g: ['opposites', 'admeaningK', 'directions'] },
    { k: 'lit', s: 'read', icon: '📖', kid: B('Stories', '이야기'), g: ['adstoryK', 'adstoryorderK', 'poemK', 'bookmakersK'] },
    { k: 'inf', s: 'read', icon: '🔎', kid: B('Fact books', '정보 글'), g: ['adinfoK', 'adinfotopicK', 'askfindK', 'bookway'] },
    { k: 'num', s: 'math', icon: '🔢', kid: B('Counting and numbers', '세기와 수'), g: ['count', 'quantity', 'pair1to1', 'order', 'compare', 'represent', 'teens', 'tens', 'ladder'] },
    { k: 'alg', s: 'math', icon: '➕', kid: B('Add, take away, patterns', '더하기·빼기·규칙'), g: ['addsub', 'ten', 'numline', 'pattern'] },
    { k: 'meas', s: 'math', icon: '📏', kid: B('Measure and graphs', '길이·그래프'), g: ['measure', 'graph', 'clock', 'daytime'] },
    { k: 'geo', s: 'math', icon: '🔺', kid: B('Shapes', '도형'), g: ['shapes2d', 'shapes3d', 'shapejoin'] }
  ];
  const RANK = { b: 0, e: 1, m: 2 };
  let back = false;   // true while a game started from this section is open

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
    back = false;
    const s = placed(), hasPlace = s && Object.keys(s.ir).length;
    view().innerHTML = `<h1>📝 ${L(B('i-Ready K practice', 'i-Ready K 준비'))}</h1>
      <p class="tag">${L(B('Pick an area and play. Each game has new questions every round.', '영역을 골라 게임을 해요. 판마다 문제가 바뀌어요.'))}</p>
      <h2 class="irk-sub">📚 ${L(B('Reading', '읽기'))}</h2>${ordered('read').map(areaCard).join('')}
      <h2 class="irk-sub">🧮 ${L(B('Math', '수학'))}</h2>${ordered('math').map(areaCard).join('')}
      <div class="controw"><button class="big adapt" id="irkAdapt"><span class="gi">🧭</span>${L(B('Diagnostic Practice', '진단 평가 연습'))}<small>${L(B('Questions change to fit you, like the school test', '학교 시험처럼 나에게 맞게 문제가 바뀌어요'))}</small></button></div>
      <p class="note2">${hasPlace ? L(B('Areas marked lower on the school i-Ready results come first.', '학교 i-Ready 결과에서 낮게 나온 영역이 먼저 나와요.')) : L(B('Grown-ups: enter the school i-Ready results (Grown-ups · Add school results) and the areas that need practice come first.', '보호자: 학교 i-Ready 결과를 넣으면(보호자 · 학교 결과 넣기) 연습이 필요한 영역이 먼저 나와요.'))} ${L(B('PeachPlay is not affiliated with i-Ready or Curriculum Associates and uses its own questions.', 'PeachPlay는 i-Ready·Curriculum Associates와 관계없고, 자체 문제를 써요.'))}</p>
      <div><button class="next" id="irkHome">🏠 ${T().back}</button></div>`;
    view().classList.add('irk-screen');
    wireGames();
    // a game started here comes back here
    $$('.irk-area [data-id]').forEach(b => b.addEventListener('click', () => { back = true; }, true));
    $$('.irk-say').forEach(b => b.onclick = () => say(b.dataset.say));
    $('#irkAdapt').onclick = () => { if (typeof adaptIntro === 'function') adaptIntro(); };
    $('#irkHome').onclick = () => { back = false; home(); };
    window.scrollTo(0, 0);
  }
  // home() asks this first: after a game started from the section, home goes back to the section once.
  function takeReturn() { if (!back || !shown()) { back = false; return false; } back = false; return true; }

  window.IReadyK = { AREAS, homeHtml, bind, open, takeReturn };
})();
