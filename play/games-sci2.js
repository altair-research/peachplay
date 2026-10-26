'use strict';
// Request 60: original K observation activities. All names stay inside this IIFE.
(() => {
  'use strict';
  const card = s => `<div style="font-size:${/^[^\p{L}\p{N}<>]+$/u.test(s)?'clamp(36px,7dvh,48px)':'clamp(16px,3dvh,22px)'};line-height:1.2">${s}</div>`;
  const opts = (right, wrongs) => [right, ...wrongs].map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0}));
  const add = (id,title,icon,make) => registerGame({id,grade:'K',subject:'sci',icon,title,sub:B('Look, listen, and compare','보고 듣고 비교해요'),area:B('Science · Observing properties','과학 · 특징 관찰'),play(){quiz(this,make(lvl(id)));}});
  const materials = [
    ['wooden spoon','나무 숟가락','🥄','wood','나무'],['wooden block','나무 블록','🧱','wood','나무'],['wooden chair','나무 의자','🪑','wood','나무'],
    ['metal spoon','금속 숟가락','🥄','metal','금속'],['metal key','금속 열쇠','🔑','metal','금속'],['metal bell','금속 종','🔔','metal','금속'],
    ['plastic cup','플라스틱 컵','🥤','plastic','플라스틱'],['plastic ruler','플라스틱 자','📏','plastic','플라스틱'],['plastic toy','플라스틱 장난감','🧸','plastic','플라스틱'],
    ['paper bag','종이 봉투','🛍️','paper','종이'],['paper card','종이 카드','💌','paper','종이'],['paper sheet','종이 낱장','📄','paper','종이']
  ];
  // 70a: everyday clues a K child can hear and check by touch; the Korean wood clue avoids 나무 (the answer).
  const materialClues={wood:B('It is cut from trees.','숲에서 베어 와요.'),metal:B('It is shiny and feels cold.','반짝이고 만지면 차가워요.'),plastic:B('It is light and keeps out water.','가볍고 물이 스며들지 않아요.'),paper:B('It folds and tears easily.','쉽게 접히고 찢어져요.')};
  const clueCard=(e,clue)=>`<div style="display:flex;align-items:center;justify-content:center;gap:10px"><span style="font-size:clamp(36px,7dvh,48px)">${e}</span><span style="font-size:clamp(17px,3dvh,23px)">${L(clue)}</span></div>`;
  const rock = (color,big,dots) => `<svg viewBox="0 0 120 60" style="width:120px;height:60px" role="img" aria-label="${L(B('Rock model','암석 모형'))}"><ellipse cx="60" cy="30" rx="${big?48:28}" ry="${big?25:16}" fill="${color}" stroke="#25324a" stroke-width="2"/>${dots?'<g fill="#fff"><circle cx="48" cy="25" r="3"/><circle cx="65" cy="34" r="3"/><circle cx="73" cy="24" r="3"/></g>':''}</svg>`;
  add('materials',B('Material Detectives','재질 탐정'),'🪨',lv=>{
    if(lv===1){
      const t=pick(materials),names=[B('wood','나무'),B('metal','금속'),B('plastic','플라스틱'),B('paper','종이')];
      return {ask:B('What material is this?','어떤 재질일까요?'),show:clueCard(t[2],materialClues[t[3]]),opts:opts(B(t[3],t[4]),shuffle(names.filter(n=>n.en!==t[3])).slice(0,2)),cls:'words'};
    }
    const t=pick(materials), mate=pick(materials.filter(x=>x!==t&&x[3]===t[3]));
    const ds=shuffle(materials.filter(x=>x[3]!==t[3])).slice(0,2);
    return {ask:B('Which thing is made of the same material?','같은 재질로 만든 물건은?'),show:clueCard(t[2],materialClues[t[3]]),opts:opts(B(mate[0],mate[1]),ds.map(x=>B(x[0],x[1]))),cls:'words'};
  });
  // [picture, short place name, material, clue]. 70a: the clue is shown (and read) as material; question stays one short sentence.
  const earth=[
    ['💧',B('water cup','컵 속 물'),'water',B('It fills a cup and pours out.','컵에 담겨 있고 기울이면 쏟아져요.')],['💧',B('puddle water','웅덩이 물'),'water',B('After rain it sits in a low spot.','비가 온 뒤 낮은 곳에 고여요.')],['💧',B('river water','강물'),'water',B('It flows between two banks.','양쪽 둑 사이로 흘러요.')],
    ['🪨',B('path rock','길가 바위'),'rock',B('A hard piece lies by a path.','길가에 단단한 덩어리가 있어요.')],['🪨',B('small pebble','작은 자갈'),'rock',B('A tiny hard piece keeps its shape.','작고 단단한 덩어리가 모양 그대로예요.')],['🪨',B('big boulder','큰 바위'),'rock',B('A huge hard piece is too heavy to lift.','너무 크고 단단해서 들 수 없어요.')],
    ['🌱',B('plant soil','식물 흙'),'soil',B('Roots spread through loose ground.','부드러운 땅속으로 뿌리가 뻗어요.')],['🌱',B('garden soil','정원 흙'),'soil',B('A gardener digs loose ground for seeds.','씨앗을 심으려고 부드러운 땅을 파요.')],['🌱',B('pot soil','화분 흙'),'soil',B('Roots grow in tiny grains in a pot.','화분 속 작은 알갱이 사이로 뿌리가 자라요.')],
    ['🎈',B('balloon air','풍선 공기'),'air',B('Something you cannot see fills a balloon.','보이지 않는 것이 풍선을 채워요.')],['💨',B('pinwheel air','바람개비 공기'),'air',B('Something you cannot see turns a pinwheel.','보이지 않는 것이 바람개비를 돌려요.')],['🛞',B('tire air','타이어 공기'),'air',B('Something you cannot see is pumped into a tire.','펌프로 보이지 않는 것을 타이어에 넣어요.')]
  ];
  const earthNames={water:B('Water','물'),rock:B('Rock','암석'),soil:B('Soil','흙'),air:B('Air','공기')};
  add('earthstuff',B('Earth Materials','지구의 물질'),'🌱',lv=>{
    const t=pick(earth),same=pick(earth.filter(x=>x!==t&&x[2]===t[2])),ds=shuffle(earth.filter(x=>x[2]!==t[2])).slice(0,2);
    const place=x=>({html:`<span class="emo">${x[0]}</span><span class="ol">${L(x[1])}</span>`});
    return {ask:lv===1?B('Which material is it?','어떤 물질일까요?'):B('Where else is this material?','이 물질이 또 있는 곳은?'),show:`<div style="font-size:clamp(17px,3dvh,23px)">${L(t[3])}</div>`,opts:lv===1?opts(earthNames[t[2]],shuffle(Object.keys(earthNames).filter(k=>k!==t[2])).slice(0,2).map(k=>earthNames[k])):[same,...ds].map((x,i)=>({...place(x),ok:i===0})),cls:lv===1?'words':'shapes'};
  });
  add('rocksort',B('Rock and Earth Clues','암석과 지구 물질'),'🌎',lv=>{
    const colors=[['#b96742',B('red-brown','적갈색')],['#adb5bd',B('gray','회색')],['#e5cc88',B('tan','황갈색')]],ci=rnd(3),big=!!rnd(2),dots=!!rnd(2),c=colors[ci];
    const feature=pick(['size','color','dots']);
    const right=feature==='size'?(big?B('Large','커요'):B('Small','작아요')):feature==='color'?c[1]:(dots?B('Spotted','점이 있어요'):B('No spots','점이 없어요'));
    const wrong=feature==='size'?[big?B('Small','작아요'):B('Large','커요')]:feature==='color'?colors.filter((_,i)=>i!==ci).map(x=>x[1]):[dots?B('No spots','점이 없어요'):B('Spotted','점이 있어요')];
    if(lv===1)return {ask:B(`Describe the rock model's ${feature==='dots'?'spots':feature}.`,`암석 모형의 ${feature==='size'?'크기':feature==='color'?'색':'점'}를 살펴봐요.`),show:rock(c[0],big,dots),opts:opts(right,wrong),cls:'words'};
    const other=feature==='color'?colors[(ci+1)%3][0]:c[0],body=rock(c[0],big,dots)+rock(other,feature==='size'?!big:big,feature==='dots'?!dots:dots);
    return {ask:B('Which property is different?','두 모형의 어떤 특징이 다를까요?'),show:body,opts:opts(feature==='size'?B('Size','크기'):feature==='color'?B('Color','색'):B('Spots','점'),[...(feature!=='size'?[B('Size','크기')]:[]),...(feature!=='color'?[B('Color','색')]:[]),...(feature!=='dots'?[B('Spots','점')]:[])]),cls:'words'};
  });
  const animals=[['🐕','dog','개','fur','털'],['🐈','cat','고양이','fur','털'],['🐇','rabbit','토끼','fur','털'],['🐻','bear','곰','fur','털'],['🐦','bird','새','feathers','깃털'],['🦆','duck','오리','feathers','깃털']];
  const leaf=(n,round)=>`<svg viewBox="0 0 120 70" style="width:120px;height:70px" role="img" aria-label="${L(B('Plant model','식물 모형'))}"><path d="M60 65V8" stroke="#256b34" stroke-width="3"/>${Array.from({length:n},(_,i)=>`<ellipse cx="${i%2?75:45}" cy="${15+i*10}" rx="${round?12:19}" ry="${round?11:5}" fill="#479e53"/>`).join('')}</svg>`;
  add('lifeclues',B('Living Thing Clues','생물의 특징'),'🐾',lv=>{
    if(rnd(3)===0){const n=2+rnd(4),round=!!rnd(2);return {ask:lv===1?B('How many leaves in this model?','식물 모형의 잎은 몇 개일까요?'):B('What is different in the two plants?','두 식물 모형에서 다른 것은?'),show:leaf(n,round)+(lv===2?leaf(n,!round):''),opts:lv===1?opts(String(n),[String(n+1),String(n-1)]):opts(B('Leaf shape','잎 모양'),[B('Leaf count','잎 수'),B('Leaf color','잎 색')]),cls:'words'};}
    const a=pick(animals);
    if(lv===1)return {ask:B(`What covers the ${a[1]}'s body?`,`${a[2]}의 몸을 덮고 있는 것은?`),show:card(a[0]),opts:opts(B(a[3],a[4]),[a[3]==='fur'?B('feathers','깃털'):B('fur','털'),B('scales','비늘')]),cls:'words'};
    return {ask:B(`What do both ${a[1]}s have?`,`두 ${a[2]} 모두 가진 것은?`),show:card(`<span style="font-size:48px">${a[0]}</span> <span style="font-size:28px">${a[0]}</span>`),opts:opts(B(a[3],a[4]),[a[3]==='fur'?B('feathers','깃털'):B('fur','털'),B('scales','비늘')]),cls:'words',after:B('A model compares a parent and young of the same kind.','같은 종류의 어른과 새끼를 비교하는 모형이에요.')};
  });
})();
// Science extension: five senses, what living things need.
(() => {
  'use strict';
  const option=(x,ok)=>({html:`<span class="word" style="font-size:clamp(15px,2.7dvh,20px)">${L(x)}</span>`,ok});
  const add=(id,title,icon,area,make)=>registerGame({id,grade:'K',subject:'sci',icon,title,sub:B('Use the model clues','모형의 단서를 살펴봐요'),area,play(){quiz(this,make(lvl(id)));}});
  const frame=(sun,stars)=>`<svg viewBox="0 0 100 65" style="width:100px;max-width:100%;height:65px" role="img" aria-label="${L(B('Sky observation model','하늘 관찰 모형'))}"><rect width="100" height="65" fill="${stars?'#203f70':'#c3e9ff'}"/><rect y="58" width="100" height="7" fill="#4f8a47"/>${stars?Array.from({length:stars},(_,i)=>`<text x="${8+i*13}" y="${15+(i%2)*17}" fill="white" font-size="12">★</text>`).join(''):`<circle cx="50" cy="${sun}" r="7" fill="#ffcc43"/>`}</svg>`;
  add('skytime',B('Sky Over Time','시간에 따른 하늘'),'🌤️',B('Science · Sky changes','과학 · 하늘의 변화'),lv=>{
    const first=12+rnd(4)*8,last=12+rnd(4)*8,night=!!rnd(2),a=1+rnd(4),b=1+rnd(4);
    const same=night?a===b:first===last,up=night?b>a:last<first;
    const firstName=B('Earlier','먼저'),lastName=B('Later','나중');
    const NO=B('No change','변화 없어요'),MORE=B('More stars','별이 늘어요'),FEWER=B('Fewer stars','별이 줄어요'),HIGH=B('Sun higher','해가 올라가요'),LOW=B('Sun lower','해가 내려가요');
    const result=same?NO:night?(up?MORE:FEWER):(up?HIGH:LOW);
    if(lv===1)return {ask:B('What changed from earlier to later?','먼저에서 나중으로 무엇이 바뀌었나요?'),show:`<div style="font-size:16px">${L(firstName)}　→　${L(lastName)}<br>${frame(first,night?a:0)}${frame(last,night?b:0)}</div>`,opts:[option(result,true),...shuffle([NO,night?MORE:HIGH,night?FEWER:LOW].filter(x=>x.en!==result.en)).map(x=>option(x,false))],cls:'words',after:B('These are recorded pictures, not a rule that all skies change this way.','관찰을 기록한 그림이에요. 하늘이 언제나 이렇게 변한다는 뜻은 아니에요.')};
    const middle=night?6:56;
    return {ask:B('Which picture matches the later view?','나중 하늘과 같은 그림은?'),show:`<div style="font-size:16px">${L(firstName)}　→　${L(lastName)}<br>${frame(first,night?a:0)}${frame(last,night?b:0)}</div>`,opts:[{html:frame(last,night?b:0),label:B('View A','그림 A'),ok:true},{html:frame(night?last:(last===12?20:12),night?(b===1?2:1):0),label:B('View B','그림 B'),ok:false},{html:frame(middle,night?middle:0),label:B('View C','그림 C'),ok:false}],after:B('The last picture is evidence of the later view.','마지막 그림이 나중 하늘의 관찰 근거예요.'),onRender(){const b=document.createElement('button');b.className='say';b.textContent='🔉';b.onclick=()=>$$('.opt .ol').forEach((e,i)=>say(e.textContent,undefined,i>0));$('#sp').after(b);}};
  });
  const objects=[[B('ball','공을'),true],[B('wheel','바퀴를'),true],[B('orange','오렌지를'),true],[B('block','블록을'),false],[B('box','상자를'),false],[B('book','책을'),false]];
  add('moveplan',B('Plan a Move','움직임 계획'),'↔️',B('Science · Motion plans','과학 · 움직임 계획'),lv=>{
    const [obj,round]=pick(objects),right=!!rnd(2);
    const svg=`<svg viewBox="0 0 180 65" style="width:180px;height:65px"><path d="M5 55H175" stroke="#435269" stroke-width="3"/>${round?'<circle class="moveplan-obj" cx="90" cy="40" r="14" fill="#f3b65d" stroke="#435269" stroke-width="2"/>':'<rect class="moveplan-obj" x="76" y="27" width="28" height="28" fill="#76bec7" stroke="#435269" stroke-width="2"/>'}<text x="${right?148:12}" y="48" font-size="24" fill="#e0a800">★</text></svg>`;
    // 70a: two-word options with arrows. L2 combines the shape (roll or slide) with the star's side.
    const mv=(e,en,ko,m)=>({e,t:B(en,ko),m}),side=right?['➡️','right','오른쪽으로']:['⬅️','left','왼쪽으로'],away=right?['⬅️','left','왼쪽으로']:['➡️','right','오른쪽으로'];
    const choices=lv===1?[mv(side[0],`push ${side[1]}`,`${side[2]} 밀어요`,'side'),mv(away[0],`push ${away[1]}`,`${away[2]} 밀어요`,'away'),mv('✋','stay still','그대로 두어요','stay')]
      :round?[mv('🔄'+side[0],`roll ${side[1]}`,`${side[2]} 굴려요`,'side'),mv('🔄'+away[0],`roll ${away[1]}`,`${away[2]} 굴려요`,'away'),mv('⬆️','lift up','들어 올려요','up')]
      :[mv('📦'+side[0],`slide ${side[1]}`,`${side[2]} 밀어요`,'side'),mv('🔄'+side[0],`roll ${side[1]}`,`${side[2]} 굴려요`,'stay'),mv('📦'+away[0],`slide ${away[1]}`,`${away[2]} 밀어요`,'away')];
    return {ask:lv===1?B(`Which push moves the ${obj.en} to the star?`,`${obj.ko} 어느 쪽으로 밀면 별에 닿을까요?`):B(`Which move takes the ${obj.en} to the star?`,`${obj.ko} 별까지 옮기는 움직임은?`),show:svg,opts:choices.map((c,i)=>({html:`<span class="emo" data-mv="${c.m}">${c.e}</span>`,label:c.t,ok:i===0})),cls:'shapes',
      // Picture-first: a tapped move is acted out on the model (toward the star, away from it, or not at all), then a wrong one slides back.
      onRender(){const o=$('.show .moveplan-obj');if(!o)return;const dx=right?58:-58;$$('.opt').forEach(b=>b.addEventListener('click',()=>{const m=b.querySelector('[data-mv]')?.dataset.mv;o.style.transform=m==='side'?`translateX(${dx}px)`:m==='away'?`translateX(${-dx*0.6}px)`:m==='up'?'translateY(-14px)':'rotate(8deg)';if(m!=='side')setTimeout(()=>{o.style.transform='';},1100);}));},
      after:B('This is a plan. Test real objects with an adult to observe what happens.','움직임 계획이에요. 실제 결과는 어른과 물체를 움직여 관찰해요.')};
  });
})();

const SENSES = { eyes: ['👀', B('eyes', '눈')], ears: ['👂', B('ears', '귀')], nose: ['👃', B('nose', '코')], tongue: ['👅', B('tongue', '혀')], hands: ['✋', B('hands', '손')] };
const SENSE_Q = [['🌸', B('smell a flower', '꽃 냄새를 맡아요'), 'nose'], ['🌈', B('see a rainbow', '무지개를 봐요'), 'eyes'], ['🎵', B('hear music', '음악을 들어요'), 'ears'], ['🍦', B('taste ice cream', '아이스크림 맛을 봐요'), 'tongue'],
  ['🧸', B('feel a teddy', '부드러운 곰 인형을 만져요'), 'hands'], ['🔔', B('hear a bell', '종소리를 들어요'), 'ears'], ['🍋', B('taste a lemon', '레몬 맛을 봐요'), 'tongue'], ['🍪', B('smell a cookie', '따뜻한 쿠키 냄새를 맡아요'), 'nose'], ['⭐', B('see a star', '별을 봐요'), 'eyes'], ['🧊', B('feel cold ice', '차가운 얼음을 만져요'), 'hands'], ['🥁', B('hear a drum', '북소리를 들어요'), 'ears'], ['🍎', B('taste an apple', '사과 맛을 봐요'), 'tongue']];
registerGame({
  id: 'senses', subject: 'sci', icon: '👃', title: B('My Five Senses', '오감 탐험'), sub: B('Eyes, ears, nose, tongue, hands', '눈, 귀, 코, 혀, 손'),
  area: AREA_SCI('Five senses'),
  play() {
    const t = pick(SENSE_Q), keys = Object.keys(SENSES), ds = others(keys, t[2], lvl('senses') === 2 ? 3 : 2), o = (k) => ({ html: `<span class="emo">${SENSES[k][0]}</span>`, label: SENSES[k][1], ok: k === t[2] });
    quiz(this, {
      ask: B(`What do you use to ${t[1].en}?`, `${t[1].ko} — 무엇을 쓸까요?`), show: `<div class="bigword"><span class="emo">${t[0]}</span></div>`,
      opts: [o(t[2]), ...ds.map(o)], cls: 'shapes', after: B(`You use your ${SENSES[t[2]][1].en}!`, `${SENSES[t[2]][1].ko}을(를) 써요!`), vocab: SENSES[t[2]][1].en
    });
  }
});

const NEEDS = [
  ...[['CAT', '고양이'], ['RABBIT', '토끼']].map(([en, ko]) => ({ q: B(`What does a ${en} need to live?`, `${ko}에게 무엇이 필요할까요?`), good: [['💧', B('water', '물')], ['🥣', B('food', '먹이')]], bad: [['🎮', B('video game', '게임')], ['📺', B('TV', '텔레비전')], ['📱', B('phone', '휴대폰')]] })),
  { q: B('What does a PLANT need to grow?', '식물이 자라려면 무엇이 필요할까요?'), good: [['💧', B('water', '물')], ['☀️', B('sunlight', '햇빛')]], bad: [['🍕', B('pizza', '피자')], ['🧸', B('toys', '장난감')], ['📱', B('phone', '휴대폰')]] },
  { q: B('What does a DOG need to live?', '강아지가 살려면 무엇이 필요할까요?'), good: [['🍖', B('food', '먹이')], ['💧', B('water', '물')], ['🏠', B('shelter', '쉴 곳')]], bad: [['🎮', B('video game', '게임')], ['👟', B('shoes', '신발')], ['📺', B('TV', '텔레비전')]] },
  { q: B('What do PEOPLE need to live?', '사람이 살려면 무엇이 필요할까요?'), good: [['🍎', B('food', '음식')], ['💧', B('water', '물')], ['🌬️', B('air', '공기')]], bad: [['🎮', B('video game', '게임')], ['🧸', B('toys', '장난감')], ['🍬', B('candy', '사탕')]] }
];
registerGame({
  id: 'needs', subject: 'sci', icon: '💧', title: B('What Do They Need?', '무엇이 필요할까?'), sub: B('Plants, animals, people', '식물, 동물, 사람'),
  area: AREA_SCI('Needs of living things'),
  play() {
    const n = pick(NEEDS), g = pick(n.good), bs = shuffle(n.bad).slice(0, lvl('needs') === 2 ? 3 : 2), o = (x, ok) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok });
    quiz(this, { ask: n.q, opts: [o(g, true), ...bs.map(b => o(b, false))], cls: 'shapes', after: B(`They need ${g[1].en}!`, `${g[1].ko}이(가) 필요해요!`), vocab: g[1].en });
  }
});

// 63a: apply senses to two clues; choose care for the missing need.
(() => {
 const opts=(a)=>a.map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0}));
 const senses=GAMES.find(g=>g.id==='senses'),old=senses.play;
 senses.play=function(){
  if(lvl(this.id)===1)return old.call(this);
  const a=pick(SENSE_Q),b=pick(SENSE_Q.filter(x=>x[2]!==a[2])),keys=[a[2],b[2]],wrong=Object.keys(SENSES).filter(k=>!keys.includes(k));
  const pair=(x,y)=>B(`${SENSES[x][1].en} + ${SENSES[y][1].en}`,`${SENSES[x][1].ko} + ${SENSES[y][1].ko}`);
  quiz(this,{ask:B('Which pair helps with BOTH clues?','두 단서에 맞는 짝은?'),askSay:B(`${a[1].en}; ${b[1].en}. Which pair?`,`${a[1].ko}, ${b[1].ko}. 어떤 짝일까요?`),show:`<div class="storytext">${L(a[1])}<br>${L(b[1])}</div>`,opts:opts([pair(...keys),pair(keys[0],wrong[0]),pair(wrong[0],wrong[1])]),cls:'words'});
 };
 const needs=GAMES.find(g=>g.id==='needs');
 const species=[[B('rabbit','토끼'),'🐇'],[B('dog','강아지'),'🐕'],[B('cat','고양이'),'🐈'],[B('hamster','햄스터'),'🐹']];
 // 70a: care choices are a picture plus a two-word name.
 const W=['💧',B('water bowl','물그릇')],F=['🥣',B('food bowl','먹이 그릇')],R=['🏠',B('safe bed','쉴 곳')];
 const needCases=[
 [B('has an empty drinking bowl','마실 그릇이 비었어요'),B('has food but an empty drinking bowl','먹이는 있지만 마실 그릇이 비었어요'),[W,F,R]],
 [B('has an empty food bowl','먹이 그릇이 비었어요'),B('has water but an empty food bowl','물은 있지만 먹이 그릇이 비었어요'),[F,W,R]],
 [B('has no safe place to rest','안전하게 쉴 곳이 없어요'),B('has food and water but no safe resting place','먹이와 물은 있지만 안전하게 쉴 곳이 없어요'),[R,F,W]]
 ];
 needs.play=function(){const [n,e]=pick(species),q=pick(needCases),lv=lvl(this.id),story=B(`The ${n.en} ${q[lv-1].en}.`,`${n.ko}: ${q[lv-1].ko}.`);quiz(this,{ask:B('Which care helps now?','지금 어떤 돌봄이 도움이 될까요?'),show:`<div class="emo" aria-hidden="true" style="font-size:clamp(34px,6dvh,46px)">${e}</div><div class="storytext">${L(story)}</div>`,askExtra:{t:L(story)},opts:q[2].map((x,i)=>({html:`<span class="emo">${x[0]}</span>`,label:x[1],ok:i===0})),cls:'shapes'});};
})();
