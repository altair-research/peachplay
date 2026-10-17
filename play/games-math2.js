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

const DAYTIME = [['⏰', B('Waking up', '잠에서 깨요'), 'morning'], ['🥞', B('Eating breakfast', '아침밥을 먹어요'), 'morning'], ['🚌', B('Riding the bus to school', '학교 버스를 타요'), 'morning'],
  ['🥪', B('Eating lunch', '점심을 먹어요'), 'afternoon'], ['⚽', B('Playing outside after school', '방과 후에 밖에서 놀아요'), 'afternoon'],
  ['🛁', B('Taking a bath before bed', '자기 전에 목욕해요'), 'night'], ['📖', B('Reading a bedtime story', '잠자리 동화를 읽어요'), 'night'], ['😴', B('Going to sleep', '잠을 자요'), 'night'], ['🌙', B('Seeing stars in a dark night sky', '깜깜한 밤하늘에서 별을 봐요'), 'night'], ['🪥', B('Brushing teeth after breakfast', '아침밥을 먹고 이를 닦아요'), 'morning'], ['🎒', B('Packing a bag before morning school', '아침에 학교 가기 전 가방을 챙겨요'), 'morning'], ['🖍️', B('Drawing after lunch, before dinner', '점심 먹고 저녁 먹기 전에 그림을 그려요'), 'afternoon']];
registerGame({
  id: 'daytime', subject: 'math', icon: '🕐', title: B('My Day', '나의 하루'), sub: B('Morning, afternoon, night', '아침, 오후, 밤'),
  area: AREA_MATH('Time patterns'),
  play() {
    const t = pick(DAYTIME), P = { morning: ['🌅', B('Morning', '아침')], afternoon: ['☀️', B('Afternoon', '오후')], night: ['🌙', B('Night', '밤')] };
    quiz(this, {
      ask: B('When do you do this?', '언제 하는 일일까요?'),
      show: `<div class="bigword"><span class="emo">${t[0]}</span> ${L(t[1])}</div>`,
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
    const names = { morning:B('morning','아침'), afternoon:B('afternoon','오후'), night:B('night','밤') };
    quiz(this, { ask: earlier ? B('In this one day, which comes earlier?', '같은 하루예요. 어느 일이 더 먼저일까요?') : B('In this one day, which comes later?', '같은 하루예요. 어느 일이 더 나중일까요?'),
      opts: [a,b].map(x => ({html:'<span class="emo">'+x[0]+'</span><span class="ol">'+L(names[x[2]])+' · '+L(x[1])+'</span>', ok:x===right})), cls:'groups' });
  };
})();
