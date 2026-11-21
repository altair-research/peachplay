'use strict';
(() => {
  'use strict';
  // Tap the missing piece; on success the piece joins the outlined whole.
  registerGame({id:'shapejoin',grade:'K',subject:'math',icon:'🧩',title:B('Join the Shape','도형 조각 합치기'),sub:B('Tap a piece to fill the outline','조각을 눌러 빈 곳을 채워요'),area:B('Math · Composing shapes','수학 · 도형 합성'),play(){
    const lv=lvl('shapejoin'),w=pick([60,80,100,120]),h=pick([35,55,75]),vertical=!!rnd(2),tri=lv===2&&!!rnd(2),missing=!!rnd(2);
    const points=tri?(missing?`0,0 ${w},0 ${w},${h}`:`0,0 0,${h} ${w},${h}`):'';
    const piece=(kind,color)=>kind==='triangle'?`<polygon points="${points||`0,0 ${w},0 0,${h}`}" fill="${color}"/>`:kind==='rectangle'?`<rect width="${vertical?w/2:w}" height="${vertical?h:h/2}" fill="${color}"/>`:`<circle cx="${w/2}" cy="${h/2}" r="${Math.min(w,h)/2}" fill="${color}"/>`;
    const right=tri?'triangle':'rectangle',name=k=>k==='triangle'?B('Triangle','삼각형'):k==='rectangle'?B('Rectangle','직사각형'):B('Circle','원');
    const svg=(body)=>`<svg viewBox="-4 -4 ${w+8} ${h+8}" style="width:120px;max-width:100%;height:80px">${body}</svg>`;
    const filled=tri?(missing?`<polygon points="0,0 0,${h} ${w},${h}" fill="#8acbd0"/>`:`<polygon points="0,0 ${w},0 ${w},${h}" fill="#8acbd0"/>`):`<rect x="${vertical&&missing?w/2:0}" y="${!vertical&&missing?h/2:0}" width="${vertical?w/2:w}" height="${vertical?h:h/2}" fill="#8acbd0"/>`;
    quiz(this,{ask:B('Tap the piece that fills the empty part.','빈 부분에 꼭 맞는 조각을 눌러요.'),show:`<div id="kJoin">${svg(`<rect width="${w}" height="${h}" fill="white" stroke="#435269" stroke-width="2" stroke-dasharray="3 2"/>${filled}`)}</div>`,opts:[right,...(tri?['rectangle','circle']:['triangle','circle'])].map((k,i)=>({html:svg(piece(k,'#ed9a68')),label:name(k),ok:i===0})),cls:'shapes',onRender(){const b=document.createElement('button');b.className='say';b.textContent='🔉';b.setAttribute('aria-label',L(B('Hear the pieces','조각 이름 듣기')));b.onclick=()=>$$('.opt .ol').forEach((e,i)=>say(e.textContent,undefined,i>0));$('#sp').after(b);},onCorrect(){const target=$('#kJoin');if(target)target.innerHTML=svg(`<rect width="${w}" height="${h}" fill="#ed9a68" stroke="#435269" stroke-width="2"/>${filled}`);},after:B('The pieces join to fill one larger shape.','조각을 합쳐 더 큰 도형을 채웠어요.')});
  }});
})();
// Math extension: measurement (length / weight) and time-of-day patterns.

const HEAVY_PAIRS = [
  [['🐘', B('elephant', '코끼리')], ['🐭', B('mouse', '쥐')]], [['🚗', B('car', '자동차')], ['🚲', B('bicycle', '자전거')]],
  [['🐋', B('whale', '고래')], ['🐟', B('fish', '물고기')]], [['🐻', B('bear', '곰')], ['🐦', B('bird', '새')]],
  // 2026-11-20 (i-Ready K practice, more questions): familiar pairs where one is clearly much heavier.
  [['🍉', B('watermelon', '수박')], ['🍓', B('strawberry', '딸기')]], [['🐄', B('cow', '소')], ['🐥', B('chick', '병아리')]],
  [['🪨', B('rock', '바위')], ['🪶', B('feather', '깃털')]], [['🎃', B('pumpkin', '호박')], ['🍇', B('grapes', '포도')]],
  [['🚚', B('truck', '트럭')], ['🧸', B('teddy bear', '곰 인형')]], [['🐎', B('horse', '말')], ['🐇', B('rabbit', '토끼')]],
  [['🦛', B('hippo', '하마')], ['🐸', B('frog', '개구리')]], [['🚌', B('bus', '버스')], ['🛴', B('scooter', '킥보드')]],
  [['🐊', B('alligator', '악어')], ['🦋', B('butterfly', '나비')]], [['🍍', B('pineapple', '파인애플')], ['🍒', B('cherry', '체리')]],
  [['🛋️', B('sofa', '소파')], ['📕', B('book', '책')]], [['🐢', B('turtle', '거북')], ['🐜', B('ant', '개미')]]
];
// L2: three objects with clear steps from heaviest to lightest.
const HEAVY_THREES = [
  [['🐘', B('elephant', '코끼리')], ['🐕', B('dog', '개')], ['🐭', B('mouse', '쥐')]],
  [['🚌', B('bus', '버스')], ['🚲', B('bicycle', '자전거')], ['⚽', B('ball', '공')]],
  [['🍉', B('watermelon', '수박')], ['🍎', B('apple', '사과')], ['🍒', B('cherry', '체리')]],
  [['🐄', B('cow', '소')], ['🐈', B('cat', '고양이')], ['🐥', B('chick', '병아리')]],
  [['🐋', B('whale', '고래')], ['🐬', B('dolphin', '돌고래')], ['🐟', B('fish', '물고기')]],
  [['🐻', B('bear', '곰')], ['🐇', B('rabbit', '토끼')], ['🐜', B('ant', '개미')]],
  [['🪨', B('rock', '바위')], ['🧸', B('teddy bear', '곰 인형')], ['🪶', B('feather', '깃털')]],
  [['🎃', B('pumpkin', '호박')], ['🍊', B('orange', '오렌지')], ['🍇', B('grapes', '포도')]]
];
// L2 balance pictures: things of about the same size, so the tilt of the scale (not what the child already knows) shows the answer.
const SCALE_PAIRS = [
  [['🎁', B('gift', '선물')], ['📦', B('box', '상자')]], [['🍎', B('apple', '사과')], ['🍊', B('orange', '오렌지')]],
  [['🧸', B('teddy bear', '곰 인형')], ['⚽', B('soccer ball', '축구공')]], [['👟', B('shoe', '신발')], ['🎒', B('bag', '가방')]],
  [['📕', B('book', '책')], ['🧃', B('juice box', '주스 팩')]], [['🍐', B('pear', '배')], ['🍋', B('lemon', '레몬')]],
  [['🧁', B('cupcake', '컵케이크')], ['🍩', B('donut', '도넛')]], [['🥥', B('coconut', '코코넛')], ['🥭', B('mango', '망고')]]
];
const kJosa = (w, withB, noB) => { const c = w.charCodeAt(w.length - 1); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 ? withB : noB; };
const LEN_STEPS = [60, 90, 120, 150, 180, 210, 240];
// Length pictures: plain bars (first version), pencils, snakes, ropes. All options in one question are the same kind of thing.
const LEN_THEMES = {
  bar: (v, c) => `<div class="bar" style="width:${v}px;background:${c}"></div>`,
  pencil: (v, c) => `<svg viewBox="0 0 ${v} 26" style="display:block;width:${v}px;height:26px;margin:6px 0"><rect x="0" y="3" width="12" height="20" rx="3" fill="#f4a6b7"/><rect x="12" y="3" width="${v - 34}" height="20" fill="${c}"/><polygon points="${v - 22},3 ${v},13 ${v - 22},23" fill="#f3d2a2"/><polygon points="${v - 7},10 ${v},13 ${v - 7},16" fill="#333"/></svg>`,
  snake: (v) => `<svg viewBox="0 0 ${v} 26" style="display:block;width:${v}px;height:26px;margin:6px 0"><rect x="0" y="5" width="${v}" height="16" rx="8" fill="#5cb85c"/><circle cx="${v - 8}" cy="11" r="2.5" fill="#222"/></svg>`,
  rope: (v) => `<svg viewBox="0 0 ${v} 26" style="display:block;width:${v}px;height:26px;margin:6px 0"><rect x="0" y="8" width="${v}" height="10" rx="5" fill="#c68b4e"/><path d="${Array.from({ length: Math.floor(v / 12) }, (_, i) => `M${i * 12 + 4} 8l6 10`).join('')}" stroke="#8a5a2b" stroke-width="2"/></svg>`
};
// Height pictures: something standing on one ground line (stem, pole, string, stick) with its top.
const TALL_THEMES = { flower: ['🌻', '#3a9d23', 5], flag: ['🚩', '#8d99ae', 4], balloon: ['🎈', '#8d99ae', 1.5], lollipop: ['🍭', '#d9cfb8', 4] };
const tallSvg = (theme, h) => { const [top, col, w] = TALL_THEMES[theme]; return `<svg viewBox="0 0 60 210" style="display:block;height:clamp(96px,21dvh,170px);width:auto"><line x1="0" y1="208" x2="60" y2="208" stroke="#7a5230" stroke-width="4"/><rect x="${30 - w / 2}" y="${206 - h}" width="${w}" height="${h}" fill="${col}"/><text x="30" y="${216 - h}" font-size="30" text-anchor="middle">${top}</text></svg>`; };
const scaleSvg = (l, r, leftDown) => { const dy = leftDown ? 14 : -14; return `<svg viewBox="0 0 220 120" style="display:block;width:min(70vw,260px);height:auto;margin:0 auto"><polygon points="100,116 120,116 110,58" fill="#8d99ae"/><line x1="30" y1="${58 + dy}" x2="190" y2="${58 - dy}" stroke="#435269" stroke-width="5" stroke-linecap="round"/><circle cx="110" cy="58" r="5" fill="#435269"/><path d="M8 ${60 + dy}h44l-6 10h-32z" fill="#cfd8e3" stroke="#435269" stroke-width="2"/><path d="M168 ${60 - dy}h44l-6 10h-32z" fill="#cfd8e3" stroke="#435269" stroke-width="2"/><text x="30" y="${57 + dy}" font-size="34" text-anchor="middle">${l}</text><text x="190" y="${57 - dy}" font-size="34" text-anchor="middle">${r}</text></svg>`; };
const emoOpt = (x, ok) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok });
registerGame({
  id: 'measure', subject: 'math', icon: '📏', title: B('Longer or Shorter?', '더 길까? 더 짧을까?'), sub: B('Length and weight', '길이와 무게'),
  area: AREA_MATH('Measurement'),
  play() {
    const lv = lvl('measure'), kind = pick(lv === 1 ? ['heavy', 'length', 'length', 'tall'] : ['heavy3', 'scale', 'length', 'length', 'tall']);
    if (kind === 'heavy') {                                          // heavier / lighter
      const pr = pick(HEAVY_PAIRS), heavy = rnd(2) === 0;
      quiz(this, {
        ask: heavy ? B('Which one is HEAVIER?', '어느 것이 더 무거울까요?') : B('Which one is LIGHTER?', '어느 것이 더 가벼울까요?'),
        opts: [emoOpt(pr[0], heavy), emoOpt(pr[1], !heavy)], cls: 'groups',
        after: B(`The ${pr[0][1].en} is heavier.`, `${pr[0][1].ko}${kJosa(pr[0][1].ko, '이', '가')} 더 무거워요.`), vocab: heavy ? 'heavier' : 'lighter'
      });
      return;
    }
    if (kind === 'heavy3') {                                         // L2: compare three at once
      const tr = pick(HEAVY_THREES), heavy = rnd(2) === 0, right = heavy ? tr[0] : tr[2];
      quiz(this, {
        ask: heavy ? B('Which one is the HEAVIEST?', '어느 것이 가장 무거울까요?') : B('Which one is the LIGHTEST?', '어느 것이 가장 가벼울까요?'),
        opts: tr.map(x => emoOpt(x, x === right)), cls: 'shapes',
        after: B(`The ${right[1].en} is the ${heavy ? 'heaviest' : 'lightest'}.`, `${right[1].ko}${kJosa(right[1].ko, '이', '가')} 가장 ${heavy ? '무거워요' : '가벼워요'}.`), vocab: heavy ? 'heaviest' : 'lightest'
      });
      return;
    }
    if (kind === 'scale') {                                          // L2: read the balance (the lower side is heavier)
      const pr = shuffle(pick(SCALE_PAIRS)), leftDown = rnd(2) === 0, heavy = rnd(2) === 0;
      const heavier = leftDown ? pr[0] : pr[1], right = heavy ? heavier : (heavier === pr[0] ? pr[1] : pr[0]);
      quiz(this, {
        ask: heavy ? B('Look at the scale. Which is HEAVIER?', '저울을 봐요. 어느 것이 더 무거울까요?') : B('Look at the scale. Which is LIGHTER?', '저울을 봐요. 어느 것이 더 가벼울까요?'),
        show: scaleSvg(pr[0][0], pr[1][0], leftDown),
        opts: pr.map(x => emoOpt(x, x === right)), cls: 'groups',
        after: B('The heavier side goes down.', '더 무거운 쪽이 아래로 내려가요.'), vocab: heavy ? 'heavier' : 'lighter'
      });
      return;
    }
    const n = lv === 1 ? 2 : 3, gap = lv === 1 ? 60 : 30, more = rnd(2) === 0;
    let ws; do { ws = shuffle(LEN_STEPS).slice(0, n); } while ([...ws].sort((a, b) => a - b).some((v, i, a) => i && v - a[i - 1] < gap));
    const target = more ? Math.max(...ws) : Math.min(...ws), cols = shuffle(['#ef476f', '#118ab2', '#06d6a0', '#ffb703']);
    // The bar lengths sit in style attributes (ignored by the repeat check), so the key names them.
    const key = (theme) => `measure|${kind}|${lv}|${theme}|${more}|${[...ws].sort((a, b) => a - b).join(',')}`;
    if (kind === 'tall') {
      const theme = pick(Object.keys(TALL_THEMES));
      quiz(this, {
        ask: n === 2 ? (more ? B('Which one is TALLER?', '어느 것이 더 키가 클까요?') : B('Which one is SHORTER?', '어느 것이 더 키가 작을까요?'))
          : (more ? B('Which one is the TALLEST?', '어느 것이 가장 키가 클까요?') : B('Which one is the SHORTEST?', '어느 것이 가장 키가 작을까요?')),
        opts: ws.map(v => ({ html: tallSvg(theme, v * 0.75), ok: v === target })), cls: 'shapes', itemKey: key(theme),
        after: more ? B('That one is the tallest!', '이것이 가장 키가 커요!') : B('That one is the shortest!', '이것이 가장 키가 작아요!'), vocab: more ? 'taller' : 'shorter'
      });
      return;
    }
    const theme = pick(Object.keys(LEN_THEMES));
    quiz(this, {
      ask: n === 2 ? (more ? B('Which one is LONGER?', '어느 것이 더 길까요?') : B('Which one is SHORTER?', '어느 것이 더 짧을까요?'))
        : (more ? B('Which one is the LONGEST?', '어느 것이 가장 길까요?') : B('Which one is the SHORTEST?', '어느 것이 가장 짧을까요?')),
      opts: ws.map((v, i) => ({ html: LEN_THEMES[theme](v, cols[i]), ok: v === target })), cls: 'bars', itemKey: key(theme),
      after: more ? B('That one is the longest!', '이것이 가장 길어요!') : B('That one is the shortest!', '이것이 가장 짧아요!'), vocab: more ? 'longer' : 'shorter'
    });
  }
});

const DAYTIME = [['⏰', B('Waking up', '잠에서 깨요'), 'morning'], ['🥞', B('Eating breakfast', '팬케이크를 먹어요'), 'morning'], ['🚌', B('Riding the bus to school', '학교 버스를 타요'), 'morning'],
  ['🥪', B('Eating lunch', '점심을 먹어요'), 'afternoon'], ['⚽', B('Playing outside after school', '방과 후에 밖에서 놀아요'), 'afternoon'],
  ['🛁', B('Taking a bath before bed', '자기 전에 목욕해요'), 'night'], ['📖', B('Reading a bedtime story', '잠자리 동화를 읽어요'), 'night'], ['😴', B('Going to sleep', '잠을 자요'), 'night'], ['🌌', B('Seeing stars in a dark sky', '깜깜한 하늘에서 별을 봐요'), 'night'], ['🪥', B('Brushing teeth after breakfast', '잠에서 깬 뒤 이를 닦아요'), 'morning'], ['🎒', B('Packing a bag before the first bus', '첫 버스를 타기 전 가방을 챙겨요'), 'morning'], ['🖍️', B('Drawing after lunch, before dinner', '점심 먹고 저녁 먹기 전에 그림을 그려요'), 'afternoon']];
// Each activity is tied to a clue in the child's pictured day.
for (const [part, prefix, koPrefix, events] of [
  ['morning', 'At sunrise', '해 뜰 때', [
    ['🥛','drink milk','우유를 마셔요'], ['🧦','put on socks','양말을 신어요'],
    ['🍎','pack a snack','간식을 챙겨요'], ['💧','water a plant','화분에 물을 줘요'],
    ['🪮','brush your hair','머리를 빗어요'], ['🐕','walk the dog','강아지와 걸어요'],
    ['🥣','eat cereal','시리얼을 먹어요'], ['🧥','put on a coat','겉옷을 입어요'],
    ['📘','open a book','책을 펼쳐요'], ['👟','tie your shoes','신발 끈을 묶어요'],
    ['🧇','eat a waffle','와플을 먹어요'], ['🐦','hear the birds','새 소리를 들어요']]],
  ['afternoon', 'After lunch, before dinner', '점심 뒤, 저녁 전', [
    ['🪁','fly a kite','연을 날려요'], ['🚲','ride a bike','자전거를 타요'],
    ['🧩','do a puzzle','퍼즐을 맞춰요'], ['🎨','paint a picture','그림을 그려요'],
    ['📚','visit the library','도서관에 가요'], ['🏀','play ball','공놀이를 해요'],
    ['🍐','eat a pear','배를 먹어요'], ['🛝','go down the slide','미끄럼틀을 타요'],
    ['🧱','build a tower','탑을 쌓아요'], ['🧸','play with a bear','곰 인형과 놀아요'],
    ['🥁','play a drum','북을 쳐요'], ['🫧','blow bubbles','비눗방울을 불어요']]],
  ['night', 'Under the stars', '별이 뜬 뒤', [
    ['🏕️','sit by a tent','텐트 옆에 앉아요'], ['🔦','turn on a flashlight','손전등을 켜요'],
    ['🦉','hear an owl','올빼미 소리를 들어요'], ['🪟','look out the window','창밖을 봐요'],
    ['🛏️','get in bed','침대에 들어가요'], ['🧸','hug a teddy bear','곰 인형을 안아요'],
    ['🧺','put away clothes','옷을 정리해요'], ['🚪','close the door','문을 닫아요'],
    ['🎵','sing a soft song','조용히 노래해요'], ['⛺','get into a tent','텐트에 들어가요'],
    ['🐈','watch the cat','고양이를 봐요'], ['🫗','pour some water','물을 따라요']]]
]) {
  for (const [icon, en, ko] of events) DAYTIME.push([icon, B(prefix + ', ' + en + '.', koPrefix + ' ' + ko), part]);
}
registerGame({
  id: 'daytime', subject: 'math', icon: '🕐', title: B('My Day', '나의 하루'), sub: B('Morning, afternoon, night', '아침, 오후, 밤'),
  area: AREA_MATH('Time patterns'),
  play() {
    const t = pick(DAYTIME), P = { morning: ['🌅', B('Morning', '아침')], afternoon: ['☀️', B('Afternoon', '오후')], night: ['🌙', B('Night', '밤')] };
    const sky = { morning: '🌄', afternoon: '🌤️', night: '🌌' };
    quiz(this, {
      ask: B('What part of the day?', '하루 중 언제일까요?'),
      askSay: B(t[1].en + ' What part of the day?', t[1].ko + ' 하루 중 언제일까요?'),
      show: `<div class="bigword" style="font-size:clamp(17px,3dvh,24px)"><span style="display:block;font-size:clamp(30px,6dvh,52px)">${sky[t[2]]} ${t[0]}</span>${L(t[1])}</div>`,
      opts: Object.keys(P).map(k => ({ html: `<span class="emo">${P[k][0]}</span>`, label: P[k][1], ok: k === t[2] })), cls: 'shapes',
      after: B(`That is in the ${P[t[2]][1].en.toLowerCase()}.`, `${P[t[2]][1].ko}에 해요.`), vocab: P[t[2]][1].en
    });
  }
});

// L2 compares two explicitly placed events within one day.
(() => {
  const game = GAMES.find(g => g.id === 'daytime'), original = game.play;
  game.play = function () {
    if (lvl(this.id) === 1) return original.call(this);
    const a = pick(DAYTIME), b = pick(DAYTIME.filter(x => x[2] !== a[2]));
    const order = ['morning', 'afternoon', 'night'], earlier = !!rnd(2);
    const right = (order.indexOf(a[2]) < order.indexOf(b[2])) === earlier ? a : b;
    const names = { morning:['🌅',B('morning','아침')], afternoon:['☀️',B('afternoon','오후')], night:['🌙',B('night','밤')] };
    quiz(this, { ask: earlier ? B('In this one day, which comes earlier?', '하루 중 어느 일이 더 먼저일까요?') : B('In this one day, which comes later?', '하루 중 어느 일이 더 나중일까요?'),
      opts: [a,b].map(x => ({html:'<span class="emo" role="img" aria-label="'+L(x[1])+'">'+x[0]+'</span><span class="ol">'+names[x[2]][0]+' '+L(names[x[2]][1])+'</span>', ok:x===right})), cls:'groups' });
  };
})();
