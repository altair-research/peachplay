// School results -> starting point (selling point 1: "upload the school result and start from it").
//  (1) i-Ready Diagnostic: the grown-up picks one of three placement bands per domain (read 6, math 4),
//  (2) missed-question check: tap the kinds of unit-test questions the child missed (K-2),
//  (3) result card: what it means / this week's 15 minutes / one home activity / what to look for next time.
// Everything stays in this browser (S.profile.school). Not affiliated with i-Ready or Curriculum Associates.
(() => {
  'use strict';
  const B = (en, ko) => ({ en, ko });
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const AGR = ['K', '1', '2', '3', '4', '5'];

  // Placement wording follows i-Ready Diagnostic reports (5-level placements grouped into 3). Wording differs a little by report version.
  const LEVELS = [
    { v: 'm', dot: '🟢', n: B('Mid or Above Grade Level', '학년 중간 이상'), sn: B('Mid or above', '중간 이상'), w: 0 },
    { v: 'e', dot: '🟡', n: B('Early On Grade Level', '학년 초반'), sn: B('Early on', '학년 초반'), w: 1.5 },
    { v: 'b', dot: '🔴', n: B('One Grade Level Below or lower', '한 학년 아래 이하'), sn: B('Below', '아래'), w: 3 }
  ];
  const levelOf = (v) => LEVELS.find(l => l.v === v);

  // i-Ready domain -> ADAPT_DOMAINS key, with plain-language meaning, one home activity and what to look for next time.
  const IR = [
    { k: 'pa', s: 'read', n: B('Phonological Awareness', '음운 인식(소리 인식)'),
      mean: B('Hearing the sounds inside spoken words: rhymes, syllables, first and last sounds.', '말소리 안의 소리 듣기: 운율, 음절, 첫소리·끝소리.'),
      home: B('At dinner, clap the syllables of family names, then play "I spy something that starts with /m/".', '저녁 식사 때 가족 이름을 음절마다 손뼉 치고, "/ㅁ/ 소리로 시작하는 물건 찾기" 놀이를 해요.') },
    { k: 'ph', s: 'read', n: B('Phonics', '파닉스'),
      mean: B('Matching letters to sounds and sounding out words.', '글자와 소리를 잇고 낱말을 소리 내어 읽기.'),
      home: B('Pick 3 letters on a cereal box or street sign and say their sounds together.', '시리얼 상자나 표지판에서 글자 3개를 골라 함께 소리를 말해요.') },
    { k: 'hfw', s: 'read', n: B('High-Frequency Words', '고빈도 낱말'),
      mean: B('Reading very common words (the, is, and) quickly without sounding them out.', '자주 나오는 낱말(the, is, and)을 소리 내지 않고 바로 읽기.'),
      home: B('Put 5 sight words on sticky notes around the house and read them each time you pass.', '자주 쓰는 낱말 5개를 포스트잇에 써서 집 곳곳에 붙이고, 지나갈 때마다 읽어요.') },
    { k: 'voc', s: 'read', n: B('Vocabulary', '어휘'),
      mean: B('Knowing what words mean and choosing the right word.', '낱말 뜻을 알고 알맞은 낱말 고르기.'),
      home: B('Choose one new word a day and use it in two sentences together.', '하루에 새 낱말 하나를 골라 함께 두 문장으로 써 봐요.') },
    { k: 'lit', s: 'read', n: B('Comprehension: Literature', '이해: 이야기'),
      mean: B('Understanding stories: who is in it, what happens, and in what order.', '이야기 이해: 누가 나오고, 무슨 일이, 어떤 순서로 일어나는지.'),
      home: B('After a bedtime story, ask: "What happened first? Then? At the end?"', '잠자리 동화 뒤에 "처음에 무슨 일이? 그다음엔? 마지막엔?" 하고 물어요.') },
    { k: 'inf', s: 'read', n: B('Comprehension: Informational Text', '이해: 정보 글'),
      mean: B('Understanding nonfiction: the main topic and key facts.', '정보 글 이해: 중심 내용과 중요한 사실.'),
      home: B('Read a short nonfiction picture book and ask: "What was this mostly about?"', '짧은 지식 그림책을 읽고 "이 책은 주로 무엇에 대한 거였지?" 하고 물어요.') },
    { k: 'num', s: 'math', n: B('Number and Operations', '수와 연산'),
      mean: B('Counting, comparing numbers, and adding or subtracting.', '세기, 수 비교, 덧셈·뺄셈.'),
      home: B('Count snacks into groups of 10 and ask: "How many more to make 10?"', '간식을 10개씩 묶어 세고 "10이 되려면 몇 개 더?" 하고 물어요.') },
    { k: 'alg', s: 'math', n: B('Algebra and Algebraic Thinking', '대수적 사고'),
      mean: B('Patterns, missing numbers and simple story problems.', '규칙, 빠진 수, 간단한 문장제.'),
      home: B('Make a pattern with spoons and forks and ask what comes next.', '숟가락·포크로 규칙을 만들고 다음에 올 것을 물어요.') },
    { k: 'meas', s: 'math', n: B('Measurement and Data', '측정과 자료'),
      mean: B('Comparing length, telling time, money, and reading simple charts.', '길이 비교, 시각 읽기, 돈, 간단한 그래프 읽기.'),
      home: B('Line up 3 shoes from shortest to longest, then count coins from a pocket.', '신발 3켤레를 짧은 것부터 줄 세우고, 주머니 동전을 세어 봐요.') },
    { k: 'geo', s: 'math', n: B('Geometry', '도형'),
      mean: B('Naming shapes and noticing their sides and corners.', '도형 이름과 변·꼭짓점 알기.'),
      home: B('Find 3 circles, squares and triangles in the kitchen.', '부엌에서 원·사각형·삼각형을 3개씩 찾아요.') }
  ];

  // Common K-2 unit-test question kinds. K games come from report-parse.js SKILL_RULES (gamesFor on `en`); grades 1-2 are listed.
  const CK = [
    { k: 'count', s: 'math', en: 'Counting sets of objects', ko: '물건 세기', g: { 1: ['count120'], 2: ['count1000'] }, home: B('Count forks while setting the table, touching each one.', '상 차릴 때 포크를 하나씩 짚으며 세어요.') },
    { k: 'represent', s: 'math', en: 'Showing a number with pictures or a ten frame', ko: '그림·10칸 틀로 수 나타내기', g: { 1: ['tensones'], 2: ['place1000'] }, home: B('Show a number with buttons in an egg carton (10 cups).', '달걀판(10칸)에 단추를 놓아 수를 나타내요.') },
    { k: 'make10', s: 'math', en: 'Make 10 with number pairs', ko: '10 만들기(수 짝)', g: { 1: ['maketen20', 'facts10'], 2: ['facts20'] }, home: B('Hold up some fingers; the child shows how many more make 10.', '손가락 몇 개를 펴면, 아이가 10이 되려면 몇 개 더인지 보여 줘요.') },
    { k: 'numwrite', s: 'math', en: 'Writing numbers', ko: '숫자 쓰기', g: { 1: ['count120'] }, home: B('Write the numbers on a grocery list together.', '장보기 목록의 숫자를 함께 써요.') },
    { k: 'compare', s: 'math', en: 'Comparing numbers: more, fewer', ko: '수 비교(더 많다·더 적다)', g: { 1: ['compare100'], 2: ['compare1000'] }, home: B('Make two piles of grapes and ask which has more.', '포도 두 무더기를 만들고 어느 쪽이 더 많은지 물어요.') },
    { k: 'addsub', s: 'math', en: 'Adding and subtracting story problems', ko: '덧셈·뺄셈 이야기 문제', g: { 1: ['wordprob', 'facts10'], 2: ['wordprob2', 'add2dig'] }, home: B('Tell a snack story: "You have 5, you eat 2. How many now?"', '"5개 있었는데 2개 먹었어. 지금 몇 개?" 하고 간식 이야기를 해요.') },
    { k: 'shapes', s: 'math', en: 'Naming shapes', ko: '도형 이름', g: { 1: ['shapeattr'], 2: ['shapes2'] }, home: B('Go on a shape hunt in the house and name each one.', '집 안에서 도형 찾기를 하고 이름을 말해요.') },
    { k: 'measure', s: 'math', en: 'Comparing length and weight', ko: '길이·무게 비교', g: { 1: ['cubelength'], 2: ['ruler'] }, home: B('Compare two toys: which is longer? Which is heavier?', '장난감 두 개를 비교해요: 어느 게 더 길까? 더 무거울까?') },
    { k: 'time', s: 'math', en: 'Time words and daily routine', ko: '시간·하루 일과', g: { 1: ['clock1'], 2: ['clock2g'] }, home: B('Look at a clock at breakfast and bedtime and say the time together.', '아침 식사와 잠자기 전에 시계를 보고 함께 시각을 말해요.') },
    { k: 'money', s: 'math', en: 'Coins and money', ko: '동전·돈', grades: ['1', '2'], g: { 1: ['coins1'], 2: ['money2'] }, home: B('Sort coins from a jar and count the pennies and nickels.', '저금통 동전을 종류별로 나누고 세어요.') },
    { k: 'graph', s: 'math', en: 'Reading a picture graph', ko: '그림그래프 읽기', g: { 1: ['graph1'], 2: ['graph2'] }, home: B('Tally the family\'s favorite fruit and ask which got the most.', '가족이 좋아하는 과일을 표시해 세고, 어느 것이 가장 많은지 물어요.') },
    { k: 'letters', s: 'read', en: 'Letter names, uppercase and lowercase', ko: '알파벳 이름(대·소문자)', grades: ['K'], home: B('Find the letters of the child\'s name on signs outside.', '밖의 표지판에서 아이 이름의 글자를 찾아요.') },
    { k: 'sounds', s: 'read', en: 'Letter sounds', ko: '글자 소리', g: { 1: ['blends'], 2: ['vowels2'] }, home: B('Say a word slowly, and the child says its first sound.', '낱말을 천천히 말하면, 아이가 첫소리를 말해요.') },
    { k: 'rhyme', s: 'read', en: 'Rhyming words', ko: '운율 맞는 낱말', grades: ['K', '1'], g: { 1: ['onsetrime1'] }, home: B('Play a rhyme game in the car: cat, hat, ...?', '차 안에서 운율 놀이: cat, hat, ...?') },
    { k: 'syllable', s: 'read', en: 'Counting syllables', ko: '음절 세기', grades: ['K'], home: B('Clap the syllables of foods at dinner: ba-na-na.', '저녁에 음식 이름을 음절마다 손뼉 쳐요: ba-na-na.') },
    { k: 'sight', s: 'read', en: 'Sight words', ko: '자주 쓰는 낱말(사이트 워드)', g: { 1: ['tricky1'], 2: ['tricky2'] }, home: B('Find "the" and "and" in a picture book together.', '그림책에서 "the", "and"를 함께 찾아요.') },
    { k: 'story', s: 'read', en: 'Retelling a story', ko: '이야기 다시 말하기', g: { 1: ['storyq'], 2: ['fables'] }, home: B('After a story, the child retells it using "first, then, last".', '이야기 뒤에 아이가 "처음, 그다음, 마지막"으로 다시 말해요.') },
    { k: 'info', s: 'read', en: 'Informational text: main topic', ko: '정보 글의 중심 내용', g: { 1: ['factdet'], 2: ['info2'] }, home: B('Read the back of a cereal box and ask what it is mostly about.', '시리얼 상자 뒷면을 읽고 주로 무엇에 대한 것인지 물어요.') },
    { k: 'sentence', s: 'write', en: 'Writing a sentence', ko: '문장 쓰기', g: { 1: ['fixsent'], 2: ['grammar2a'] }, home: B('The child says one sentence about their day; write it together.', '아이가 오늘 하루를 한 문장으로 말하면 함께 적어요.') },
    { k: 'pushpull', s: 'sci', en: 'Push and pull (force and motion)', ko: '밀기·당기기', grades: ['K', '2'], g: { 2: ['force2'] }, home: B('Roll a ball softly and hard; talk about push and pull.', '공을 살살·세게 굴려 보며 밀기·당기기를 이야기해요.') },
    { k: 'living', s: 'sci', en: 'Living things and their needs', ko: '살아 있는 것과 필요한 것', grades: ['K', '1'], g: { 1: ['plants1', 'animals1'] }, home: B('On a walk, sort what you see into living and not living.', '산책하며 본 것을 살아 있는 것·아닌 것으로 나눠요.') },
    { k: 'sky', s: 'sci', en: 'Day and night sky', ko: '낮·밤 하늘', grades: ['K', '2'], g: { 2: ['moon2', 'sky2'] }, home: B('Look at the sky in the morning and at night; what is different?', '아침과 밤에 하늘을 보고 무엇이 다른지 말해요.') },
    { k: 'weather', s: 'sci', en: 'Weather and seasons', ko: '날씨와 계절', grades: ['1'], g: { 1: ['weather1', 'seasons1'] }, home: B('Each morning, the child tells the weather and picks clothes for it.', '아침마다 아이가 날씨를 말하고 맞는 옷을 골라요.') },
    { k: 'symbols', s: 'ss', en: 'Naming national symbols (flag, Liberty Bell)', ko: '국가 상징 이름(국기 등)', grades: ['K', '1'], g: { 1: ['patriot'] }, home: B('Spot flags in town and talk about what they stand for.', '동네에서 국기를 찾고 무엇을 뜻하는지 이야기해요.') },
    { k: 'address', s: 'ss', en: 'Knowing my address', ko: '우리 집 주소', grades: ['K', '1'], g: { 1: ['whereilive'] }, home: B('Say the home address together when you arrive home.', '집에 도착할 때 함께 주소를 말해요.') },
    { k: 'maps', s: 'ss', en: 'Map directions', ko: '지도와 방향', g: { 1: ['mapdir'], 2: ['gamap2'] }, home: B('Draw a simple map of the child\'s room together.', '아이 방을 간단한 지도로 함께 그려요.') },
    { k: 'jobs', s: 'ss', en: 'Jobs in the community', ko: '우리 동네 직업', g: { 1: ['goodsservices'], 2: ['goods2'] }, home: B('On errands, name the jobs you see (cashier, mail carrier).', '심부름 길에 보이는 직업(계산원, 집배원)을 말해요.') },
    { k: 'citizen', s: 'ss', en: 'Good citizens and rules', ko: '좋은 시민과 규칙', g: { 1: ['character1'], 2: ['gov2'] }, home: B('Talk about one family rule and why it helps.', '집안 규칙 하나와 왜 도움이 되는지 이야기해요.') },
    { k: 'figures', s: 'ss', en: 'Famous Americans', ko: '미국의 인물', grades: ['1', '2'], g: { 1: ['figures1'], 2: ['heroes2'] }, home: B('Look at a coin or bill and talk about the person on it.', '동전·지폐 속 인물에 대해 이야기해요.') }
  ];
  const CK_GRADES = ['K', '1', '2'];
  const ckGrades = (it) => it.grades || ['K', ...Object.keys(it.g || {})];
  const usable = (id) => typeof gameById === 'function' && gameById(id) && (typeof visibleGames !== 'function' || visibleGames().includes(gameById(id)));

  // games for a checklist kind at a grade (K reuses the report-card keyword rules)
  function ckGames(it, grade) {
    if (!ckGrades(it).includes(grade)) return [];
    const list = grade === 'K' && typeof gamesFor === 'function' ? gamesFor({ subject: it.s, name: it.en }).games : ((it.g || {})[grade] || []);
    return list.filter(usable);
  }
  // games for an i-Ready domain at a grade (closest lower grade when the domain has none at this grade)
  function irGames(k, grade) {
    const dom = Object.values(typeof ADAPT_DOMAINS === "undefined" ? {} : ADAPT_DOMAINS).flat().find(d => d.k === k); if (!dom) return [];
    for (let gi = AGR.indexOf(grade); gi >= 0; gi--) { const ids = (dom.g[AGR[gi]] || []).filter(usable); if (ids.length) return ids; }
    return [];
  }

  // ---- storage: S.profile.school = { at, grade, ir: {key: 'm'|'e'|'b'}, miss: [kind] } ----
  function clean(v) {
    if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
    const ir = {}; if (v.ir && typeof v.ir === 'object') IR.forEach(d => { if (levelOf(v.ir[d.k])) ir[d.k] = v.ir[d.k]; });
    const miss = Array.isArray(v.miss) ? [...new Set(v.miss.filter(k => CK.some(c => c.k === k)))] : [];
    const grade = AGR.includes(v.grade) ? v.grade : 'K', at = typeof v.at === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v.at) ? v.at : '';
    return { at, grade, ir, miss };
  }
  const read = () => clean(S && S.profile && S.profile.school);
  const current = () => { const s = read(); return s && s.grade === kidGrade() ? s : null; };     // results of another grade are not used
  function store(patch) {
    const s = Object.assign(current() || { ir: {}, miss: [] }, patch, { at: new Date().toISOString().slice(0, 10), grade: kidGrade() });
    S.profile = S.profile || {}; S.profile.school = clean(s); save();
  }
  // domain keys parents marked One Grade Level Below or lower (for Learner.weakDomain, see docs/review/integ-results.md)
  const weakKeys = () => { const s = current(); return s ? Object.keys(s.ir).filter(k => s.ir[k] === 'b') : []; };

  // -> [{id, score, why}] ; why = '__ir:<key>' or '__ck:<kind>' (rendered by whyText in profile.js)
  function picks() {
    const s = current(); if (!s || kidGrade() === 'P') return [];
    const out = [], gr = kidGrade();
    Object.keys(s.ir).forEach(k => { const w = levelOf(s.ir[k]).w; if (w) irGames(k, gr).slice(0, 3).forEach((id, i) => out.push({ id, score: w * (i ? 0.6 : 1), why: '__ir:' + k })); });
    s.miss.forEach(k => ckGames(CK.find(c => c.k === k), gr).slice(0, 2).forEach((id, i) => out.push({ id, score: i ? 1.5 : 3, why: '__ck:' + k })));
    return out;
  }
  function whyLabel(tag) {
    const [kind, k] = tag.slice(2).split(':');
    if (kind === 'ir') { const d = IR.find(x => x.k === k); return d ? `i-Ready: ${L(d.n)}` : ''; }
    if (kind === 'ck') { const c = CK.find(x => x.k === k); return c ? `${L(B('Test check', '평가지 체크'))}: ${L(B(c.en, c.ko))}` : ''; }
    return '';
  }

  // ---- screens ----
  const CSS = `.sr-tabs{display:flex;gap:6px;flex-wrap:wrap;justify-content:center;margin:4px 0 8px}.sr-tabs .pill[aria-pressed=true]{outline:3px solid #f28b54}
.sr-row{display:flex;flex-wrap:wrap;align-items:center;gap:2px 6px;margin:2px auto;max-width:720px;text-align:left}.sr-row b{flex:1 1 200px;font-size:16px}.sr-row span{display:flex;gap:4px}
.sr-row button,.sr-chips button{font-size:15px;padding:6px 9px;border-radius:12px;border:2px solid #ffe4d3;background:#fff;min-height:44px}
.sr-row button[aria-pressed=true],.sr-chips button[aria-pressed=true]{background:#ffe1cc;border-color:#f28b54;font-weight:700}
.sr-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:760px;margin:4px auto}.sr-sub{margin:8px 0 2px;font-size:17px}
.sr-card{max-width:720px;margin:6px auto;text-align:left;background:#fff;border-radius:16px;padding:10px 14px;box-shadow:0 3px 0 #0001}
.sr-card h2{font-size:18px;margin:10px 0 4px}.sr-card ul{margin:2px 0;padding-left:20px}.sr-card li{margin:2px 0}`;
  const style = () => { if (!document.getElementById('sr-css')) document.head.insertAdjacentHTML('beforeend', `<style id="sr-css">${CSS}</style>`); };
  let backTo = null;
  const goBack = () => (backTo || home)();
  const disclaimer = () => `<p class="note2">${L(B('PeachPlay is not affiliated with i-Ready or Curriculum Associates. These are starting suggestions from what you entered, not a score, a prediction or a promise of results. Nothing leaves this device.', 'PeachPlay는 i-Ready·Curriculum Associates와 관련이 없어요. 입력하신 내용으로 고른 시작 제안일 뿐, 점수·예측·효과 보장이 아니에요. 아무것도 이 기기 밖으로 나가지 않아요.'))}</p>`;
  const tabs = (on) => `<div class="sr-tabs" role="group">${[['ir', '📊 i-Ready'], ['ck', `✏️ ${L(B('Missed test questions', '틀린 문항 체크'))}`], ['rep', `📄 ${T().importCard}`], ['card', `🗂️ ${L(B('Result card', '결과 풀이 카드'))}`]].map(([k, t]) => `<button class="pill" data-tab="${k}" aria-pressed="${k === on}">${t}</button>`).join('')}</div>`;
  const wireTabs = () => $$('[data-tab]').forEach(b => b.onclick = () => ({ ir: irScreen, ck: checkScreen, rep: importScreen, card: cardScreen })[b.dataset.tab]());
  const gradeNote = () => { const s = read(); return s && s.grade !== kidGrade() ? `<p class="warn">${L(B(`Saved results are for ${s.grade === 'K' ? 'kindergarten' : 'grade ' + s.grade}, so they are not used now. Enter this grade's results.`, `저장된 결과는 ${s.grade === 'K' ? '유치원' : s.grade + '학년'} 것이라 지금은 쓰지 않아요. 이번 학년 결과를 넣어 주세요.`))}</p>` : ''; };

  function open(back) {
    if (typeof back === 'function') backTo = back;
    if (kidGrade() === 'P') { S.introSeen = true; return home(); }
    const s = current();
    return s && (Object.keys(s.ir).length || s.miss.length) ? cardScreen() : irScreen();
  }

  function irScreen() {
    style();
    const s = current() || { ir: {} }, sel = Object.assign({}, s.ir);
    const row = (d) => `<div class="sr-row"><b>${L(d.n)}</b><span>${LEVELS.map(l => `<button data-k="${d.k}" data-v="${l.v}" aria-pressed="${sel[d.k] === l.v}" title="${esc(L(l.n))}" aria-label="${esc(L(d.n) + ': ' + L(l.n))}">${l.dot} ${L(l.sn)}</button>`).join('')}</span></div>`;
    view().innerHTML = `<h1>🏫 ${L(B('School results', '학교 결과'))}</h1>${tabs('ir')}
      <p class="note2">${L(B('From the i-Ready Diagnostic family report, choose the placement for each domain. Skip any you do not have (tap again to clear).', 'i-Ready 진단 가정 통신 보고서에서 영역마다 배치 수준을 고르세요. 없는 영역은 비워 두세요(다시 누르면 지워져요).'))}<br>${LEVELS.map(l => `${l.dot} ${L(l.n)}`).join(' · ')}</p>${gradeNote()}
      <h2 class="sr-sub">📖 ${T().subjects.read}</h2>${IR.filter(d => d.s === 'read').map(row).join('')}
      <h2 class="sr-sub">🔢 ${T().subjects.math}</h2>${IR.filter(d => d.s === 'math').map(row).join('')}
      <div><button class="next" id="srSave">${L(B('Save and see the result card', '저장하고 결과 풀이 보기'))}</button></div>
      ${disclaimer()}<button class="link" id="b">${T().back}</button>`;
    $$('.sr-row button').forEach(b => b.onclick = () => {
      const k = b.dataset.k; sel[k] = sel[k] === b.dataset.v ? undefined : b.dataset.v; if (!sel[k]) delete sel[k];
      $$(`.sr-row button[data-k="${k}"]`).forEach(x => x.setAttribute('aria-pressed', String(sel[k] === x.dataset.v)));
    });
    $('#srSave').onclick = () => { store({ ir: sel }); cardScreen(); };
    $('#b').onclick = goBack; wireTabs(); window.scrollTo(0, 0);
  }

  function checkScreen() {
    style();
    const gr = kidGrade(), s = current() || { miss: [] }, sel = new Set(s.miss);
    const items = CK.filter(it => ckGames(it, gr).length);
    const subj = ['math', 'read', 'write', 'sci', 'ss'].filter(k => items.some(it => it.s === k));
    const body = CK_GRADES.includes(gr) ? subj.map(k => `<h2 class="sr-sub">${T().subjects[k] || k}</h2><div class="sr-chips">${items.filter(it => it.s === k).map(it => `<button data-ck="${it.k}" aria-pressed="${sel.has(it.k)}">${L(B(it.en, it.ko))}</button>`).join('')}</div>`).join('')
      : `<p class="note2">${L(B('This checklist is for kindergarten to grade 2. For older grades, use i-Ready or the report card.', '이 체크 목록은 유치원~2학년용이에요. 3학년부터는 i-Ready나 성적표를 써 주세요.'))}</p>`;
    view().innerHTML = `<h1>🏫 ${L(B('School results', '학교 결과'))}</h1>${tabs('ck')}
      <p class="note2">${L(B('Look at a returned unit test. Tap the kinds of questions your child missed. No photo needed.', '돌려받은 단원 평가지를 보면서 아이가 틀린 문항 종류를 눌러 주세요. 사진은 필요 없어요.'))}</p>${gradeNote()}
      ${body}
      <div><button class="next" id="srSave">${L(B('Save and see the result card', '저장하고 결과 풀이 보기'))}</button></div>
      ${disclaimer()}<button class="link" id="b">${T().back}</button>`;
    $$('[data-ck]').forEach(b => b.onclick = () => { const k = b.dataset.ck; sel.has(k) ? sel.delete(k) : sel.add(k); b.setAttribute('aria-pressed', String(sel.has(k))); });
    $('#srSave').onclick = () => { store({ miss: [...sel] }); cardScreen(); };
    $('#b').onclick = goBack; wireTabs(); window.scrollTo(0, 0);
  }

  // signals in priority order: i-Ready below, missed questions, report N/U, i-Ready early
  function signals() {
    const s = current(), gr = kidGrade(), out = [];
    const irSig = (lv) => s ? IR.filter(d => s.ir[d.k] === lv).map(d => ({ label: `i-Ready · ${L(d.n)} — ${levelOf(lv).dot} ${L(levelOf(lv).n)}`, mean: L(d.mean), home: L(d.home), next: L(B(`the ${d.n.en} line on the next i-Ready report`, `다음 i-Ready 보고서의 "${d.n.ko}" 줄`)) })) : [];
    out.push(...irSig('b'));
    if (s) s.miss.forEach(k => { const c = CK.find(x => x.k === k); if (c && ckGames(c, gr).length) out.push({ label: `${L(B('Missed', '틀린 문항'))} · ${L(B(c.en, c.ko))}`, mean: L(B('This kind of question needs more practice.', '이런 문항을 더 연습하면 좋아요.')), home: L(c.home), next: L(B(`"${c.en}" questions on the next unit test`, `다음 단원 평가의 "${c.ko}" 문항`)) }); });
    const rep = S.profile && S.profile.report;
    if (rep && Array.isArray(rep.picks)) {
      const reasons = [...new Set(rep.picks.flatMap(p => Array.isArray(p.reasons) ? p.reasons : []).filter(r => /\((?:N|U)\)/.test(r)))].slice(0, 3);
      const dom = rep.picks.map(p => typeof window !== 'undefined' && window.Learner ? window.Learner.domainFor(p.id) : null).find(Boolean), ird = dom && IR.find(d => d.k === dom.k);
      if (reasons.length) out.push({ label: `${T().fromReport} · ${reasons.map(esc).join(', ')}`, mean: L(B('The report card marked these as Needs Development or Unsatisfactory.', '성적표에서 N(발달 필요) 또는 U(미흡)로 표시된 항목이에요.')), home: ird ? L(ird.home) : '', next: L(B('the same lines on the next progress report', '다음 진도 보고서의 같은 항목')) });
    }
    out.push(...irSig('e'));
    return out;
  }

  function cardScreen() {
    style();
    if (kidGrade() === 'P') return home();
    const sig = signals(), games = typeof currentPicks === 'function' ? currentPicks(3) : [];
    const homeAct = sig.find(x => x.home), nexts = sig.slice(0, 2);
    const meaning = sig.length ? `<ul>${sig.slice(0, 4).map(x => `<li><b>${x.label}</b><br>${x.mean}</li>`).join('')}</ul>`
      : `<p>${L(B('Nothing entered shows a weak spot. Play what your child enjoys, and enter the next school result when it comes.', '입력한 결과에서 약한 곳이 보이지 않아요. 아이가 좋아하는 게임을 하고, 다음 학교 결과가 오면 넣어 주세요.'))}</p>`;
    view().innerHTML = `<h1>🗂️ ${L(B('Result card', '결과 풀이 카드'))}</h1>${tabs('card')}${gradeNote()}
      <div class="sr-card">
        <h2>1. ${L(B('What this result means', '이 결과가 뜻하는 것'))}</h2>${meaning}
        <h2>2. ${L(B('This week: 15 minutes of games', '이번 주 15분에 할 게임'))}</h2>
        <p class="note2">${L(B('About 5 minutes each. Start at level 1 if it feels hard.', '하나에 약 5분. 어려우면 레벨 1부터 해요.'))}</p>
        <div class="menu">${games.map(p => { const g = gameById(p.id); return g ? `<button class="big ${g.subject} pick" data-id="${g.id}"><span class="gi">${g.icon}</span>${L(g.title)}<small>${whyText ? whyText(p) : ''}</small></button>` : ''; }).join('') || `<p>${T().noPicks}</p>`}</div>
        <h2>3. ${L(B('One thing to do at home', '집에서 할 것 1개'))}</h2>
        <p>${homeAct ? homeAct.home : L(B('Read a picture book together and talk about it for 5 minutes.', '그림책을 함께 읽고 5분 동안 이야기해요.'))}</p>
        <h2>4. ${L(B('What to look at on the next school result', '다음 결과지에서 볼 것'))}</h2>
        ${nexts.length ? `<ul>${nexts.map(x => `<li>${x.next}</li>`).join('')}</ul>` : `<p>${L(B('Whether anything new is marked as needing practice.', '새로 연습이 필요하다고 표시된 것이 있는지.'))}</p>`}
        <p class="note2">✍️ ${L(B('Your eyes matter most: you know how your child learns. Change anything here that does not fit.', '아이를 가장 잘 아는 건 보호자예요. 맞지 않는 부분은 언제든 바꿔 주세요.'))}</p>
      </div>
      ${disclaimer()}<div><button class="next" id="play">${T().letsPlay}</button></div><button class="link" id="b">${T().back}</button>`;
    $$('.sr-card .pick').forEach(b => b.onclick = () => launch(gameById(b.dataset.id)));
    $('#play').onclick = home; $('#b').onclick = goBack; wireTabs(); window.scrollTo(0, 0);
  }

  const api = { LEVELS, IR, CK, clean, read, current, picks, whyLabel, weakKeys, irGames, ckGames, open, irScreen, checkScreen, cardScreen };
  if (typeof window !== 'undefined') window.SchoolResults = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
