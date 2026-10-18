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
    ['paper bag','종이 봉투','🛍️','paper','종이'],['paper card','종이 카드','💌','paper','종이'],['paper sheet','종이 한 장','📄','paper','종이']
  ];
  const materialClues={wood:B('Cut from a trunk; its grain has lines.','줄기에서 잘라 만들었고 나뭇결이 보여요.'),metal:B('Shiny, conducts heat, and rings when struck.','반짝이고 열이 잘 전해지며 두드리면 맑은 소리가 나요.'),plastic:B('Molded into shape; light and waterproof.','틀로 모양을 만들었고 가벼우며 물에 젖지 않아요.'),paper:B('Made from pressed fibers; thin and easy to fold or tear.','섬유를 눌러 만들었고 얇아서 접거나 찢기 쉬워요.')};
  const rock = (color,big,dots) => `<svg viewBox="0 0 120 60" style="width:120px;height:60px" role="img" aria-label="${L(B('Rock model','암석 모형'))}"><ellipse cx="60" cy="30" rx="${big?48:28}" ry="${big?25:16}" fill="${color}" stroke="#25324a" stroke-width="2"/>${dots?'<g fill="#fff"><circle cx="48" cy="25" r="3"/><circle cx="65" cy="34" r="3"/><circle cx="73" cy="24" r="3"/></g>':''}</svg>`;
  add('materials',B('Material Detectives','재질 탐정'),'🪨',lv=>{
    if(lv===1){
      const t=pick(materials),names=[B('wood','나무'),B('metal','금속'),B('plastic','플라스틱'),B('paper','종이')];
      return {ask:B(`${materialClues[t[3]].en} What material?`,`${materialClues[t[3]].ko} 어떤 재질일까요?`),show:card(t[2]),opts:opts(B(t[3],t[4]),shuffle(names.filter(n=>n.en!==t[3])).slice(0,2)),cls:'words'};
    }
    const t=pick(materials), mate=pick(materials.filter(x=>x!==t&&x[3]===t[3]));
    const ds=shuffle(materials.filter(x=>x[3]!==t[3])).slice(0,3);
    return {ask:B(`${materialClues[t[3]].en} Which object uses this material?`,`${materialClues[t[3]].ko} 이 재질로 만든 물건은?`),show:card(t[2]),opts:opts(B(mate[0],mate[1]),ds.map(x=>B(x[0],x[1]))),cls:'words'};
  });
  const earth=[
    ['💧',B('Water in a cup','컵 속 물'),'water',B('It fills a drinking cup and pours out','마실 컵에 담겨 있고 기울이면 쏟아져요')],['💧',B('Water in a puddle','웅덩이의 물'),'water',B('After rain it collects in a shallow dip','비가 온 뒤 얕게 팬 곳에 고여요')],['💧',B('Water in a river','강의 물'),'water',B('It flows between two banks toward the sea','양쪽 둑 사이로 바다를 향해 흘러요')],
    ['🪨',B('A hard rock by a path','길가의 단단한 암석'),'rock',B('A hard solid piece lies beside a path','길가에 단단한 덩어리가 놓여 있어요')],['🪨',B('A small hard pebble','작고 단단한 자갈'),'rock',B('A tiny hard solid keeps its shape in your hand','손에 든 작은 덩어리가 단단하고 모양이 그대로예요')],['🪨',B('A large hard boulder','크고 단단한 바위'),'rock',B('A huge hard solid is too heavy to lift','아주 크고 단단해서 들어 올리기 무거운 덩어리예요')],
    ['🌱',B('Loose soil under a plant','식물 아래의 흙'),'soil',B('Roots spread through loose ground below a plant','식물 아래 부드러운 땅속으로 뿌리가 뻗어요')],['🌱',B('Loose soil in a garden','정원의 흙'),'soil',B('A gardener digs loose ground for seeds','씨앗을 심으려고 정원의 부드러운 땅을 파요')],['🌱',B('Loose soil in a pot','화분 속 흙'),'soil',B('Roots grow among tiny grains inside a flowerpot','화분 속 작은 알갱이 사이로 뿌리가 자라요')],
    ['🎈',B('Air inside a balloon','풍선 속 공기'),'air',B('Invisible stuff fills a balloon and stretches it','보이지 않는 것이 풍선을 채워 부풀려요')],['💨',B('Moving air turns a pinwheel','공기가 움직여 바람개비를 돌려요'),'air',B('Invisible moving stuff turns a pinwheel','보이지 않는 것이 움직여 바람개비를 돌려요')],['🛞',B('Air inside a tire','타이어 속 공기'),'air',B('Invisible stuff is pumped into a tire','펌프로 보이지 않는 것을 타이어 안에 넣어요')]
  ];
  const earthNames={water:B('Water','물'),rock:B('Rock','암석'),soil:B('Soil','흙'),air:B('Air','공기')};
  add('earthstuff',B('Earth Materials','지구의 물질'),'🌱',lv=>{
    const t=pick(earth),same=pick(earth.filter(x=>x!==t&&x[2]===t[2])),ds=shuffle(earth.filter(x=>x[2]!==t[2])).slice(0,lv===1?2:3);
    return {ask:lv===1?B(`${t[3].en} Which material?`,`${t[3].ko} 어떤 물질일까요?`):B(`${t[3].en} Where is this material?`,`${t[3].ko} 이 물질이 있는 곳은?`),show:'',opts:lv===1?opts(earthNames[t[2]],shuffle(Object.keys(earthNames).filter(k=>k!==t[2])).slice(0,2).map(k=>earthNames[k])):opts(same[1],ds.map(x=>x[1])),cls:'words'};
  });
  add('rocksort',B('Rock and Earth Clues','암석과 지구 물질'),'🌎',lv=>{
    const colors=[['#b96742',B('red-brown','적갈색')],['#adb5bd',B('gray','회색')],['#e5cc88',B('tan','황갈색')]],ci=rnd(3),big=!!rnd(2),dots=!!rnd(2),c=colors[ci];
    const feature=pick(['size','color','dots']);
    const right=feature==='size'?(big?B('Large','커요'):B('Small','작아요')):feature==='color'?c[1]:(dots?B('Spotted','점이 있어요'):B('No spots','점이 없어요'));
    const wrong=feature==='size'?[big?B('Small','작아요'):B('Large','커요')]:feature==='color'?colors.filter((_,i)=>i!==ci).map(x=>x[1]):[dots?B('No spots','점이 없어요'):B('Spotted','점이 있어요')];
    if(lv===1)return {ask:B(`Look at the model. Describe its ${feature}.`,`암석 모형의 ${feature==='size'?'크기':feature==='color'?'색':'점'}를 살펴봐요.`),show:rock(c[0],big,dots),opts:opts(right,wrong),cls:'words'};
    const other=feature==='color'?colors[(ci+1)%3][0]:c[0],body=rock(c[0],big,dots)+rock(other,feature==='size'?!big:big,feature==='dots'?!dots:dots);
    return {ask:B('Which property is different?','두 모형의 어떤 특징이 다를까요?'),show:body,opts:opts(feature==='size'?B('Size','크기'):feature==='color'?B('Color','색'):B('Spots','점'),[...(feature!=='size'?[B('Size','크기')]:[]),...(feature!=='color'?[B('Color','색')]:[]),...(feature!=='dots'?[B('Spots','점')]:[])]),cls:'words'};
  });
  const animals=[['🐕','dog','개','fur','털'],['🐈','cat','고양이','fur','털'],['🐇','rabbit','토끼','fur','털'],['🐻','bear','곰','fur','털'],['🐦','bird','새','feathers','깃털'],['🦆','duck','오리','feathers','깃털']];
  const leaf=(n,round)=>`<svg viewBox="0 0 120 70" style="width:120px;height:70px" role="img" aria-label="${L(B('Plant model','식물 모형'))}"><path d="M60 65V8" stroke="#256b34" stroke-width="3"/>${Array.from({length:n},(_,i)=>`<ellipse cx="${i%2?75:45}" cy="${15+i*10}" rx="${round?12:19}" ry="${round?11:5}" fill="#479e53"/>`).join('')}</svg>`;
  add('lifeclues',B('Living Thing Clues','생물의 특징'),'🐾',lv=>{
    if(rnd(3)===0){const n=2+rnd(4),round=!!rnd(2);return {ask:lv===1?B('How many leaves in this model?','식물 모형의 잎은 몇 개일까요?'):B('Compare the leaf shapes. What differs?','두 식물 모형의 잎을 비교해요. 무엇이 다를까요?'),show:leaf(n,round)+(lv===2?leaf(n,!round):''),opts:lv===1?opts(String(n),[String(n+1),String(n-1)]):opts(B('Leaf shape','잎 모양'),[B('Leaf count','잎 수'),B('Leaf color','잎 색')]),cls:'words'};}
    const a=pick(animals);
    if(lv===1)return {ask:B(`Look at the ${a[1]}. Which covering?`,`${a[2]}의 몸을 덮고 있는 것은?`),show:card(a[0]),opts:opts(B(a[3],a[4]),[a[3]==='fur'?B('feathers','깃털'):B('fur','털'),B('scales','비늘')]),cls:'words'};
    return {ask:B(`An adult ${a[1]} and its young: what do both have?`,`어른 ${a[2]}와 새끼 ${a[2]}의 공통 특징은?`),show:card(`<span style="font-size:48px">${a[0]}</span> <span style="font-size:28px">${a[0]}</span>`),opts:opts(B(a[3],a[4]),[a[3]==='fur'?B('feathers','깃털'):B('fur','털'),B('scales','비늘')]),cls:'words',after:B('A model compares a parent and young of the same kind.','같은 종류의 어른과 새끼를 비교하는 모형이에요.')};
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
    const result=same?B('No change shown','그림에서 변화가 없어요'):night?(up?B('More stars shown','그려진 별이 늘어요'):B('Fewer stars shown','그려진 별이 줄어요')):(up?B('Sun shown higher','해가 더 높게 보여요'):B('Sun shown lower','해가 더 낮게 보여요'));
    if(lv===1)return {ask:B('Compare earlier and later. What changes in this model?','먼저와 나중을 비교해요. 모형에서 무엇이 달라지나요?'),show:`<div style="font-size:16px">${L(firstName)}　→　${L(lastName)}<br>${frame(first,night?a:0)}${frame(last,night?b:0)}</div>`,opts:[option(result,true),...shuffle([B('No change shown','그림에서 변화가 없어요'),night?B('More stars shown','그려진 별이 늘어요'):B('Sun shown higher','해가 더 높게 보여요'),night?B('Fewer stars shown','그려진 별이 줄어요'):B('Sun shown lower','해가 더 낮게 보여요')].filter(x=>x.en!==result.en)).map(x=>option(x,false))],cls:'words',after:B('These are recorded pictures, not a rule that all skies change this way.','관찰을 기록한 그림이에요. 하늘이 언제나 이렇게 변한다는 뜻은 아니에요.')};
    const middle=night?6:56;
    return {ask:B('Find the picture that matches the last recorded view.','마지막 관찰 기록과 같은 하늘 그림을 골라요.'),show:`<div style="font-size:16px">${L(firstName)}　→　${L(lastName)}<br>${frame(first,night?a:0)}${frame(last,night?b:0)}</div>`,opts:[{html:frame(last,night?b:0),label:B('View A','그림 A'),ok:true},{html:frame(night?last:(last===12?20:12),night?(b===1?2:1):0),label:B('View B','그림 B'),ok:false},{html:frame(middle,night?middle:0),label:B('View C','그림 C'),ok:false}],after:B('The last picture is evidence of the later view.','마지막 그림이 나중 하늘의 관찰 근거예요.'),onRender(){const b=document.createElement('button');b.className='say';b.textContent='🔉';b.onclick=()=>$$('.opt .ol').forEach((e,i)=>say(e.textContent,undefined,i>0));$('#sp').after(b);}};
  });
  const objects=[B('ball','공'),B('toy car','장난감 자동차'),B('block','블록'),B('cart','카트'),B('box','상자'),B('sled','썰매')];
  add('moveplan',B('Plan a Move','움직임 계획'),'↔️',B('Science · Motion plans','과학 · 움직임 계획'),lv=>{
    const obj=pick(objects),right=!!rnd(2),round=!!rnd(2),direction=right?B('right','오른쪽'):B('left','왼쪽');
    const svg=`<svg viewBox="0 0 180 65" style="width:180px;height:65px"><path d="M5 55H175" stroke="#435269" stroke-width="3"/>${round?'<circle cx="90" cy="40" r="14" fill="#f3b65d"/>':'<rect x="76" y="27" width="28" height="28" fill="#76bec7"/>'}<text x="${right?148:12}" y="48" font-size="24">★</text></svg>`;
    const r=lv===1?B(`Push it ${direction.en}`,`${direction.ko}으로 밀어요`):round?B('It can roll on its curved surface','둥근 면으로 굴러갈 수 있어요'):B('Slide it on its flat face','평평한 면으로 밀어 움직여요');
    const wrongs=lv===1?[B(`Push it ${right?'left':'right'}`,`${right?'왼쪽':'오른쪽'}으로 밀어요`),B('Leave it still','그대로 두어요')]:round?[B('Only a flat face touches the ground','평평한 면만 바닥에 닿아요'),B('Shape cannot affect motion','모양은 움직임과 관계없어요')]:[B('It has a curved rolling surface','굴러가는 둥근 면이 있어요'),B('Every shape rolls the same way','모든 모양은 똑같이 굴러요')];
    return {ask:lv===1?B(`Move the model ${obj.en} toward the star. Which push?`,`모형 ${obj.ko}을 별 쪽으로 움직여요. 어느 쪽으로 밀까요?`):B(`A model ${obj.en} has this shape. Which plan uses its shape?`,`모형 ${obj.ko}의 모양을 봐요. 모양에 맞는 계획은?`),show:svg,opts:[option(r,true),...wrongs.map(x=>option(x,false))],cls:'words',after:B('This is a plan. Test real objects with an adult to observe what happens.','움직임 계획이에요. 실제 결과는 어른과 물체를 움직여 관찰해요.')};
  });
})();

const SENSES = { eyes: ['👀', B('eyes', '눈')], ears: ['👂', B('ears', '귀')], nose: ['👃', B('nose', '코')], tongue: ['👅', B('tongue', '혀')], hands: ['✋', B('hands', '손')] };
const SENSE_Q = [['🌸', B('smell a flower', '꽃 냄새를 맡아요'), 'nose'], ['🌈', B('see a rainbow', '무지개를 봐요'), 'eyes'], ['🎵', B('hear music', '음악을 들어요'), 'ears'], ['🍦', B('taste ice cream', '아이스크림 맛을 봐요'), 'tongue'],
  ['🧸', B('feel a soft teddy bear', '부드러운 곰 인형을 만져요'), 'hands'], ['🔔', B('hear a bell', '종소리를 들어요'), 'ears'], ['🍋', B('taste a lemon', '레몬 맛을 봐요'), 'tongue'], ['🍪', B('smell a warm cookie', '따뜻한 쿠키 냄새를 맡아요'), 'nose'], ['⭐', B('see a star', '별을 봐요'), 'eyes'], ['🧊', B('feel a cold ice cube', '차가운 얼음을 만져요'), 'hands'], ['🥁', B('hear a drum', '북소리를 들어요'), 'ears'], ['🍎', B('taste an apple', '사과 맛을 봐요'), 'tongue']];
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
 const species=[B('rabbit','토끼'),B('dog','강아지'),B('cat','고양이'),B('hamster','햄스터')];
 const needCases=[
 [B('has an empty drinking bowl','마실 그릇이 비었어요'),B('has food but an empty drinking bowl','먹이는 있지만 마실 그릇이 비었어요'),[B('Fill its drinking bowl','마실 그릇을 채워요'),B('Fill its food bowl','먹이 그릇을 채워요'),B('Make a safe resting place','안전한 쉴 곳을 마련해요')]],
 [B('has an empty food bowl','먹이 그릇이 비었어요'),B('has water but an empty food bowl','물은 있지만 먹이 그릇이 비었어요'),[B('Fill its food bowl','먹이 그릇을 채워요'),B('Fill its drinking bowl','마실 그릇을 채워요'),B('Make a safe resting place','안전한 쉴 곳을 마련해요')]],
 [B('has no safe place to rest','안전하게 쉴 곳이 없어요'),B('has food and water but no safe resting place','먹이와 물은 있지만 안전하게 쉴 곳이 없어요'),[B('Make a safe resting place','안전한 쉴 곳을 마련해요'),B('Fill its food bowl','먹이 그릇을 채워요'),B('Fill its drinking bowl','마실 그릇을 채워요')]]
 ];
 needs.play=function(){const n=pick(species),q=pick(needCases),lv=lvl(this.id),story=B(`The ${n.en} ${q[lv-1].en}.`,`${n.ko}: ${q[lv-1].ko}.`);quiz(this,{ask:B('Which care helps now?','지금 어떤 돌봄이 도움이 될까요?'),show:`<div class="storytext">${L(story)}</div>`,askExtra:{t:L(story)},opts:opts(q[2]),cls:'words'});};
})();
