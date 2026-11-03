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
  [['🐋', B('whale', '고래')], ['🐟', B('fish', '물고기')]], [['🐻', B('bear', '곰')], ['🐦', B('bird', '새')]]
];
registerGame({
  id: 'measure', subject: 'math', icon: '📏', title: B('Longer or Shorter?', '더 길까? 더 짧을까?'), sub: B('Length and weight', '길이와 무게'),
  area: AREA_MATH('Measurement'),
  play() {
    const lv = lvl('measure');
    if (rnd(3) === 0) {                                          // heavier / lighter
      const pr = pick(HEAVY_PAIRS), heavy = rnd(2) === 0;
      quiz(this, {
        ask: heavy ? B('Which one is HEAVIER?', '어느 것이 더 무거울까요?') : B('Which one is LIGHTER?', '어느 것이 더 가벼울까요?'),
        opts: [{ html: `<span class="emo">${pr[0][0]}</span>`, label: pr[0][1], ok: heavy }, { html: `<span class="emo">${pr[1][0]}</span>`, label: pr[1][1], ok: !heavy }], cls: 'groups',
        after: B(`The ${pr[0][1].en} is heavier.`, `${pr[0][1].ko}가 더 무거워요.`), vocab: heavy ? 'heavier' : 'lighter'
      });
      return;
    }
    const n = lv === 1 ? 2 : 3, gap = lv === 1 ? 50 : 28, longer = rnd(2) === 0;
    let ws; do { ws = Array.from({ length: n }, () => 60 + rnd(181)); } while ([...ws].sort((a, b) => a - b).some((v, i, a) => i && v - a[i - 1] < gap));
    const target = longer ? Math.max(...ws) : Math.min(...ws), cols = shuffle(['#ef476f', '#118ab2', '#06d6a0', '#ffb703']);
    quiz(this, {
      ask: longer ? B('Which one is LONGER?', '어느 것이 더 길까요?') : B('Which one is SHORTER?', '어느 것이 더 짧을까요?'),
      opts: ws.map((v, i) => ({ html: `<div class="bar" style="width:${v}px;background:${cols[i]}"></div>`, ok: v === target })), cls: 'bars',
      after: longer ? B('That one is the longest!', '이것이 가장 길어요!') : B('That one is the shortest!', '이것이 가장 짧아요!'), vocab: longer ? 'longer' : 'shorter'
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
