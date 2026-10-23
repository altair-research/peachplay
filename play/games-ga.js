'use strict';
(() => {
  'use strict';
  const text=s=>`<div style="font-size:${/^[^\p{L}\p{N}<>]+$/u.test(s)?'clamp(36px,7dvh,48px)':'clamp(16px,3dvh,22px)'};line-height:1.2">${s}</div>`;
  const choice=(a,bs)=>[a,...bs].map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0}));
  const add=(id,title,icon,make)=>registerGame({id,grade:'K',subject:'ss',icon,title,sub:B('Look, listen, and choose','보고 듣고 골라요'),area:B('Social Studies · Our world','사회 · 우리 세상'),play(){const item=make(lvl(id));item.onRender=()=>{if(id==='mapview'&&$$('.opt [data-cq-name]').length){const b=document.createElement('button');b.className='say';b.textContent='🔊';b.setAttribute('aria-label',L(B('Hear picture names','그림 이름 듣기')));b.onclick=()=>$$('.opt [data-cq-name]').forEach((e,i)=>say(e.dataset.cqName,undefined,i>0));$('#sp').after(b);}if($$('.opt svg').length){const b=document.createElement('button');b.className='say';b.textContent='🔉';b.setAttribute('aria-label',L(B('Hear map choices','지도 보기 듣기')));b.onclick=()=>$$('.opt .ol').forEach((e,i)=>say(e.textContent,undefined,i>0));$('#sp').after(b);}};quiz(this,item);}});
  const places=[['🏠',B('house','집')],['🏫',B('school','학교')],['🌳',B('tree','나무')],['⛲',B('fountain','분수')]];
  const map=(items,turn=0,scene=false)=>`<svg viewBox="0 0 120 80" style="width:120px;max-width:100%;height:80px" role="img" aria-label="${L(B(scene?'Scene beside water':'Map model from above',scene?'물가의 장면':'위에서 본 지도 모형'))}"><rect width="120" height="80" fill="${scene?'#dceefb':'#a9db9c'}"/><rect y="50" width="120" height="30" fill="#a9db9c"/><rect x="88" y="${scene?50:0}" width="32" height="80" fill="#78c8f0"/>${items.map((it,i)=>{const x=5+((i+turn)%3)*27, key=places.indexOf(it);let shape;if(scene)shape=`<text x="0" y="40" font-size="23">${it[0]}</text>`;else if(key<2)shape=`<rect x="1" y="21" width="20" height="18" fill="${key?'#f1b166':'#ec7878'}" stroke="#435269"/><path d="M1 30H21" stroke="#435269"/>`;else if(key===2)shape='<circle cx="11" cy="30" r="10" fill="#408b45" stroke="#435269"/>';else shape='<circle cx="11" cy="30" r="10" fill="#78c8f0" stroke="#435269"/><circle cx="11" cy="30" r="4" fill="white"/>';return `<g transform="translate(${x} 0)">${shape}<text x="11" y="63" text-anchor="middle" font-size="11">${key+1}</text></g>`;}).join('')}</svg>`;
  add('mapview',B('Little Map Models','작은 지도 모형'),'🗺️',lv=>{
    const items=shuffle(places).slice(0,3),turn=rnd(3),kind=rnd(3);
    if(lv===1&&rnd(3)===0){const water=!!rnd(2);return {ask:water?B('Blue on this model means what?','이 모형의 파랑은 무엇일까요?'):B('Green on this model means what?','이 모형의 초록은 무엇일까요?'),show:map(items,turn),opts:choice(water?B('Water','물'):B('Land','육지'),[water?B('Land','육지'):B('Water','물'),B('Sky','하늘')]),cls:'words'};}
    if(lv===1){const t=pick(items);return {ask:B(`Which sign shows the ${t[1].en}?`,`작은 지도에서 ${t[1].ko} 표시는?`),show:map(items,turn,true)+map(items,turn),opts:[t,...items.filter(x=>x!==t)].map((x,i)=>({html:`<span class="emo" data-cq-name="${L(x[1])}" aria-label="${L(x[1])}">${x[0]}</span>`,ok:i===0})),after:B('A map uses small signs to show places. Blue here means water.','지도는 장소를 작은 표시로 나타내요. 여기서 파랑은 물이에요.')};}
    if(kind===0)return {ask:B('Which map from above matches the scene?','장면과 배치가 같은 지도는?'),show:map(items,turn,true),opts:[0,1,2].map((d,i)=>({html:map(items,(turn+d)%3),label:B('Map '+(i+1),'지도 '+(i+1)),ok:i===0})),after:B('The matching model keeps the places in the same positions.','작은 모형에서도 장소의 위치 관계는 같아요.')};
    const t=items[kind-1];return {ask:B('Which numbered place is shown by this sign?','이 표시는 지도의 몇 번 장소일까요?'),show:text(t[0])+map(items,turn),opts:[t,...items.filter(x=>x!==t)].map((x,i)=>({html:text(String(places.indexOf(x)+1)),ok:i===0})),after:B('A map sign stands for a place.','지도 표시는 장소를 나타내요.')};
  });
  const goods=[['🍎',B('apple','사과')],['📖',B('book','책')],['🧢',B('hat','모자')],['🖍️',B('crayon','크레용')],['⚽',B('ball','공')],['🧸',B('toy','장난감')]];
  add('workmoney',B('Work, Money, Choices','일과 돈과 선택'),'🛍️',lv=>{
    const a=pick(goods),b=pick(goods.filter(x=>x!==a)),price=1+rnd(4);
    if(lv===1){const service=!!rnd(2),repair=pick([['🚲',B('fixes a bike','자전거를 고쳐 줘요')],['👞',B('mends a shoe','신발을 고쳐 줘요')],['⌚',B('fixes a watch','시계를 고쳐 줘요')],['👜',B('mends a bag','가방을 고쳐 줘요')],['💡',B('fixes a lamp','전등을 고쳐 줘요')],['👕',B('mends a shirt','옷을 고쳐 줘요')]]),story=service?B(`A worker ${repair[1].en}.`,repair[1].ko):B(`You buy a ${a[1].en}.`,`${a[1].ko} 구입이에요.`);return {ask:B('A thing or work for someone?','물건일까요, 해 주는 일일까요?'),show:text((service?repair[0]:a[0])+' '+L(story)),askExtra:{t:L(story)},opts:[[true,'🛠️',B('service','서비스')],[false,'📦',B('goods','재화')]].map(([v,e,n])=>({html:`<span class="emo">${e}</span>`,label:n,ok:v===service})),cls:'groups',after:B('Money buys goods and services.','돈으로 물건과 서비스를 사요.')};}
    return {ask:B(`How many can ${price} buy at ${price} each?`,`${price}달러로 하나에 ${price}달러면 몇 개 살까요?`),show:text(`${a[0]} ${price}　${b[0]} ${price}`),opts:choice(B('Buy one','한 개'),[B('Buy two','두 개'),B('Buy three','세 개')]),cls:'words',after:B('Money is limited, so choose one.','돈이 한정되어 있어서 하나를 골라요.')};
  });
})();
// Georgia & Our Nation (HMH Into Social Studies K: The World Around Us; Georgia K Social Studies AKS)
(() => {
  'use strict';
  // Original cards; official facts and dated checks are listed in codex-done-60.md.
  const option=(x,ok)=>({html:`<span class="word" style="font-size:clamp(15px,2.7dvh,20px)">${L(x)}</span>`,ok});
  const card=s=>`<div style="font-size:${/^[^\p{L}\p{N}<>]+$/u.test(s)?'clamp(36px,7dvh,48px)':'clamp(16px,2.9dvh,21px)'};line-height:1.2">${s}</div>`;
  const add=(id,title,icon,area,make)=>registerGame({id,grade:'K',subject:'ss',icon,title,sub:B('Listen to the clues','단서를 듣고 골라요'),area,play(){quiz(this,make(lvl(id)));}});
  const symbols=[
    [B('Pledge of Allegiance','충성 맹세'),'📜',B('Words of loyalty to the U.S. flag','미국 국기에 충성을 약속하는 말'),B('Spoken words, not the national song','국가 노래가 아니라 말로 하는 맹세')],
    [B('The Star-Spangled Banner','성조기여 영원하라'),'🎵',B('The U.S. national anthem','미국의 국가'),B('A song used as a national symbol','나라의 상징으로 쓰는 노래')],
    [B('Bald eagle','흰머리수리'),'🦅',B('A bird used as a U.S. emblem','미국의 상징인 새'),B('The eagle on the Great Seal','미국의 큰 인장에 그려진 독수리')],
    [B('Statue of Liberty','자유의 여신상'),'🗽',B('A statue that stands for liberty','자유를 나타내는 조각상'),B('A statue holding a torch','횃불을 들고 있는 조각상')],
    [B('Lincoln Memorial','링컨 기념관'),'🏛️',B('A memorial honoring Abraham Lincoln','에이브러햄 링컨을 기리는 기념관'),B('A seated president inside a columned hall','기둥이 있는 건물 안에 앉아 있는 대통령 조각상')],
    [B('Washington Monument','워싱턴 기념탑'),'📐',B('A monument honoring George Washington','조지 워싱턴을 기리는 기념탑'),B('A tall, pointed stone monument','높고 끝이 뾰족한 돌 기념탑')],
    [B('White House','백악관'),'🏠',B('The home of the U.S. president','미국 대통령의 집'),B('A building where the U.S. president works','미국 대통령이 일하는 건물')]
  ];
  // Generic icons are memory cues, not depictions of specific buildings or people.
  add('nationcards',B('U.S. Symbol Clues','미국 상징 단서'),'🇺🇸',B('Social Studies · National symbols','사회 · 미국의 상징'),lv=>{
    const pool=symbols.filter((_,i)=>[3,4,5].includes(i)),t=pick(pool),ds=pool.filter(x=>x!==t),clues={
     'Statue of Liberty':[B('A tall figure holds a torch.','큰 사람 조각상이 횃불을 들고 있어요.'),B('A crown sits on its head.','머리에 왕관을 쓰고 있어요.'),B('It stands on an island.','섬 위에 서 있어요.'),B('One hand holds a tablet.','한 손에 판을 들고 있어요.')],
     'Lincoln Memorial':[B('A seated president is inside.','안에 앉아 있는 대통령 조각상이 있어요.'),B('Tall columns surround the hall.','높은 기둥들이 건물을 둘러싸요.'),B('Wide steps lead up to it.','넓은 계단을 올라가요.'),B('Its statue is under a roof.','조각상이 지붕 아래에 있어요.')],
     'Washington Monument':[B('Its stone top is pointed.','돌탑 꼭대기가 뾰족해요.'),B('It looks like a giant pencil.','아주 큰 연필처럼 생겼어요.'),B('It is very, very tall.','아주아주 높아요.'),B('Flags circle its bottom.','밑부분을 깃발들이 둘러싸요.')]
    },c=clues[t[0].en],a=rnd(4),b=pick([0,1,2,3].filter(x=>x!==a)),story=lv===1?c[a]:B(`${c[a].en} ${c[b].en}`,`${c[a].ko} ${c[b].ko}`);
    return {ask:B(lv===1?'Which place fits the clue?':'Which place fits BOTH clues?',lv===1?'단서에 맞는 곳은?':'두 단서에 맞는 곳은?'),show:card(L(story)),askExtra:{t:L(story)},opts:[option(t[0],true),...ds.map(x=>option(x[0],false))],cls:'words'};
  });
  const holidays=[
    [B('Christmas Day','성탄절'),B('December 25','12월 25일'),B('A holiday observed by many Christians','많은 기독교인이 기념하는 날'),'🎄'],
    [B('Columbus Day','콜럼버스의 날'),B('Second Monday in October','10월 둘째 월요일'),B('A federal holiday named for Columbus','콜럼버스의 이름을 붙인 연방 공휴일'),'⛵'],
    [B('Juneteenth','준틴스'),B('June 19','6월 19일'),B('Remembers freedom from slavery','노예제에서 벗어난 자유를 기념해요'),'🕊️'],
    [B('Martin Luther King Jr. Day','마틴 루서 킹 주니어의 날'),B('Third Monday in January','1월 셋째 월요일'),B('Honors a leader for equal rights','평등한 권리를 위해 힘쓴 지도자를 기려요'),'🤝'],
    [B('Memorial Day','메모리얼 데이'),B('Last Monday in May','5월 마지막 월요일'),B('Remembers people who died in military service','군 복무 중 목숨을 잃은 분들을 기억해요'),'🌺'],
    [B("Washington’s Birthday / Presidents Day",'워싱턴 탄생일 / 대통령의 날'),B('Third Monday in February','2월 셋째 월요일'),B('A federal holiday named for George Washington','조지 워싱턴의 이름을 붙인 연방 공휴일'),'📅']
  ];
  add('holidayclues',B('Holiday Stories','기념일 이야기'),'📅',B('Social Studies · Holidays','사회 · 기념일'),lv=>{
    if(rnd(4)===0){const p=pick(people),ds=people.filter(x=>x!==p);return {ask:lv===1?B('Who is this?','누구일까요?'):B(`${p[0].en}: which connection?`,`${p[0].ko}: 맞는 연결은?`),show:card(lv===1?`🏛️ ${L(p[1])}`:'🏛️'),opts:[option(lv===1?p[0]:p[1],true),...ds.map(x=>option(lv===1?x[0]:x[1],false))],cls:'words'};}
    const t=pick(holidays),which=1+rnd(2),ds=shuffle(holidays.filter(x=>x!==t)).slice(0,2);
    const extra=t===holidays[1]?B('Indigenous peoples already lived in the Americas. Families and communities observe different days.','아메리카에는 이미 원주민들이 살고 있었어요. 가정과 공동체마다 기념하는 날이 달라요.'):t===holidays[0]?B('Families may celebrate this holiday, another holiday, or none.','이 날을 기념하는 가정도, 다른 날을 기념하거나 기념하지 않는 가정도 있어요.'):B('People remember history in different ways.','사람들은 여러 방법으로 역사를 기억해요.');
    return {ask:lv===1?B('Which holiday fits this clue?','이 단서에 맞는 날은?'):B(`${t[0].en}: choose its ${which===1?'date':'meaning'}.`,`${t[0].ko}: ${which===1?'언제일까요':'뜻을 골라요'}?`),show:card(lv===1?`${t[3]} ${L(t[which])}`:t[3]),opts:[option(lv===1?t[0]:t[which],true),...ds.map(x=>option(lv===1?x[0]:x[which],false))],cls:'words',after:extra};
  });
  const routines=[B('read a story','이야기를 읽어요'),B('draw a picture','그림을 그려요'),B('play with blocks','블록으로 놀아요'),B('visit a park','공원에 가요'),B('sing a song','노래해요'),B('plant a seed','씨앗을 심어요')];
  const customs=[
    [B('Mia eats rice; Leo eats noodles.','미아는 밥을, 레오는 국수를 먹어요.'),B('foods','음식')],
    [B('Mia says hello; Leo says annyeong.','미아는 hello, 레오는 안녕이라고 말해요.'),B('greetings','인사말')],
    [B('Mia sings at a birthday; Leo tells a story.','미아는 생일에 노래하고 레오는 이야기를 해요.'),B('celebrations','축하 방법')],
    [B('Mia visits cousins; Leo calls cousins.','미아는 사촌을 만나고 레오는 전화해요.'),B('family visits','연락 방법')],
    [B('Mia plays a drum; Leo plays a flute.','미아는 북을, 레오는 플루트를 연주해요.'),B('music','음악')],
    [B('Mia reads in English; Leo reads in Korean.','미아는 영어로, 레오는 한국어로 읽어요.'),B('languages','언어')]
  ];
  const rules=[
    [B('Toys block the path.','장난감이 길을 막아요.'),B('toys away','장난감 치우기'),B('clear path','길 비우기')],
    [B('Running can cause a fall here.','여기서 뛰면 넘어질 수 있어요.'),B('Walk here','걸어가기'),B('no falls','안 넘어지기')],
    [B('Everyone wants a turn with one ball.','공 하나로 모두 놀고 싶어요.'),B('Take turns','차례 지키기'),B('everyone plays','모두 놀기')],
    [B('Loud voices hide a story being read.','목소리가 크면 읽는 이야기가 안 들려요.'),B('quiet voices','작게 말하기'),B('hear the story','이야기 듣기')],
    [B('Trash covers the shared table.','함께 쓰는 탁자에 쓰레기가 있어요.'),B('use trash can','쓰레기통 쓰기'),B('clean table','깨끗한 탁자')],
    [B('People bump into each other at the door.','문에서 사람들이 부딪혀요.'),B('leave space','간격 두기'),B('no bumping','안 부딪히기')]
  ];
  add('timeculture',B('Our Days Together','함께하는 하루'),'🤝',B('Social Studies · Time, culture and rules','사회 · 시간과 문화와 규칙'),lv=>{
    const kind=rnd(3);
    if(kind===0){
      const act=pick(routines),when=rnd(4),words=[B('Yesterday','어제'),B('Today','오늘'),B('Tomorrow','내일'),B('Long ago','아주 옛날')],word=words[when],tense=[B('Past','과거'),B('Present','현재'),B('Future','미래')],key=when===3?0:when;
      const clue=[B('The day before today','오늘 전날'),B('The day happening now','지금인 날'),B('The day after today','오늘 다음 날'),B('Before you were born','내가 태어나기 훨씬 전')][when];
      const ask=lv===1?B(`${clue.en}: which time word?`,`${clue.ko}: 어떤 시간말일까요?`):B(`${word.en}: past, present, or future?`,`${word.ko}: 과거, 현재, 미래 중 무엇일까요?`);
      const options=lv===1?[option(word,true),...shuffle(words.filter(x=>x!==word)).slice(0,2).map(x=>option(x,false))]:tense.map((x,i)=>option(x,i===key));
      return {ask,show:card(`${L(act)} · ${L(lv===1?clue:word)}`),askSay:B(`${act.en}. ${ask.en}`,`${act.ko}. ${ask.ko}`),opts:options,cls:'words'};
    }
    if(kind===1){const t=pick(customs),story=t[0];return {ask:lv===1?B('What is different?','무엇이 다를까요?'):B('How can we learn from each other?','서로 어떻게 배울까요?'),show:card(L(story)),askExtra:{t:L(story)},opts:lv===1?[option(t[1],true),option(customs[(customs.indexOf(t)+1)%customs.length][1],false),option(customs[(customs.indexOf(t)+2)%customs.length][1],false)]:[option(B('ask kindly','존중하며 묻기'),true),option(B('talk about me','내 얘기만'),false),option(B('guess, not ask','묻지 않고 짐작'),false)],cls:'words',after:B('These are two made-up families, not a rule about a whole group.','두 가상의 가정 이야기예요. 한 집단 모두의 관습이라는 뜻은 아니에요.')};}
    const t=pick(rules),form=rnd(2);
    return {ask:lv===1?B('Which rule helps here?','어떤 규칙이 도움이 될까요?'):B('Why use this rule here?','왜 이 규칙을 쓸까요?'),show:card(L(t[0])+(lv===2?'<br>'+L(t[1]):'')),askExtra:{t:L(t[0])+(lv===2?' '+L(t[1]):'')},opts:lv===1?[option(t[1],true),option(rules[(rules.indexOf(t)+1)%rules.length][1],false),option(rules[(rules.indexOf(t)+2)%rules.length][1],false)]:[option(t[2],true),option(rules[(rules.indexOf(t)+1)%rules.length][2],false),option(rules[(rules.indexOf(t)+2)%rules.length][2],false)],cls:'words',after:B('People can discuss a shared problem and agree on a helpful rule.','함께 겪는 문제를 의논하고 도움이 되는 규칙을 정할 수 있어요.')};
  });
  const people=[
    [B('George Washington','조지 워싱턴'),B('The first U.S. president','미국의 첫 번째 대통령')],
    [B('Abraham Lincoln','에이브러햄 링컨'),B('The president in the Lincoln Memorial','링컨 기념관에서 기리는 대통령')],
    [B('Donald Trump','도널드 트럼프'),B('The U.S. president on October 16, 2026','2026년 10월 16일의 미국 대통령')]
  ];

})();
// Simplified flag drawings; see docs/curriculum-analysis.md.
const AREA_SS = (u) => B(`Social Studies · ${u}`, `사회 · ${u}`);
const starPoly = (cx, cy, r) => {
  const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.4 : r; p.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1)); }
  return `<polygon points="${p.join(' ')}" fill="#fff"/>`;
};
function flagUS() {
  const h = 100 / 13; let s = '';
  for (let i = 0; i < 13; i++) s += `<rect x="0" y="${i * h}" width="190" height="${h}" fill="${i % 2 ? '#fff' : '#b22234'}"/>`;
  s += `<rect width="76" height="${7 * h}" fill="#3c3b6e"/>`;
  for (let r = 0; r < 9; r++) { const n = r % 2 ? 5 : 6; for (let c = 0; c < n; c++) s += `<circle cx="${(r % 2 ? 12.6 + c * 12.6 : 6.3 + c * 12.6)}" cy="${4.2 + r * 5.6}" r="1.7" fill="#fff"/>`; }
  return `<svg viewBox="0 0 190 100" class="flag">${s}</svg>`;
}
function flagGA() {
  let s = `<rect width="190" height="100" fill="#fff"/><rect width="190" height="33.4" fill="#b22234"/><rect y="66.6" width="190" height="33.4" fill="#b22234"/>`;
  s += `<rect width="66.6" height="66.6" fill="#1b3a8a"/><circle cx="33.3" cy="33.3" r="12" fill="#e5b92b"/>`;
  for (let i = 0; i < 13; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 13; s += starPoly(33.3 + 25 * Math.cos(a), 33.3 + 25 * Math.sin(a), 4.2); }
  return `<svg viewBox="0 0 190 100" class="flag">${s}</svg>`;
}

// ---------- 1. Flags ----------
registerGame({
  id: 'flags', subject: 'ss', icon: '🇺🇸', title: B('Georgia & U.S. Flags', '조지아 주기와 미국 국기'), sub: B('Which flag is which?', '어느 깃발일까?'),
  area: AREA_SS('Symbols'),
  play() {
    const qs = [
      { ga: true, ask: B('Tap the GEORGIA flag.', '조지아 주기를 눌러요.') },
      { ga: false, ask: B('Tap the U.S.A. flag.', '미국 국기를 눌러요.') },
      { ga: false, ask: B('Which flag has 50 stars?', '별이 50개인 깃발은?') },
      { ga: true, ask: B('Which flag has stars in a circle?', '파란 네모 안에 별이 동그랗게 있는 깃발은?') },
      { ga: false, ask: B('Which flag has many stripes and stars?', '빨강 흰색 줄이 많고 파란 모서리에 별이 많은 깃발은?') },
      { ga: true, ask: B('Which flag is the flag of the Peach State?', '복숭아의 주(Peach State) 깃발은?') },
      { ga: false, ask: B('Which flag is the flag of our country?', '우리나라(미국)의 깃발은?') }
    ];
    const q = pick(qs), ga = q.ga;
    quiz(this, {
      ask: q.ask,
      opts: [{ html: flagUS(), ok: !ga }, { html: flagGA(), ok: ga }], cls: 'flags',
      after: ga ? B('The Georgia flag has a blue square with 13 stars.', '조지아 주기는 파란 네모 안에 별 13개가 있어요.') : B('The U.S. flag has 50 stars and 13 stripes.', '미국 국기에는 별 50개와 줄 13개가 있어요.'),
      vocab: ga ? 'Georgia flag' : 'U.S. flag'
    });
  }
});

// ---------- 2. Georgia state symbols ----------
const GA_SYMBOLS = [
  { e: '🍑', n: B('peach', '복숭아'), q: B('fruit', '과일') }, { e: '🧅', n: B('Vidalia onion', '비달리아 양파'), q: B('vegetable', '채소') },
  { e: '🐦', n: B('brown thrasher', '브라운 트래셔'), q: B('bird', '새') }, { e: '🌳', n: B('live oak', '라이브 오크'), q: B('tree', '나무') },
  { e: '🐝', n: B('honeybee', '꿀벌'), q: B('insect', '곤충') }, { e: '🐢', n: B('gopher tortoise', '고퍼거북'), q: B('reptile', '파충류') },
  { e: '🌹', n: B('Cherokee rose', '체로키 장미'), q: B('flower', '꽃') }
];
registerGame({
  id: 'gasymbols', subject: 'ss', icon: '🍑', title: B('Peach State Symbols', '조지아 상징'), sub: B('Peach, bee, thrasher...', '복숭아, 꿀벌...'),
  area: AREA_SS('Georgia symbols'),
  play() {
    const t = pick(GA_SYMBOLS), ds = others(GA_SYMBOLS, t, lvl('gasymbols') === 2 ? 3 : 2);
    if (rnd(2)) {
      quiz(this, { ask: B(`The ${t.n.en} is Georgia's state what?`, `조지아의 상징 ${t.n.ko}: 어떤 종류일까요?`), show: `<span class="emo">${t.e}</span>`, opts: [t, ...ds].map(s => ({ html: `<span class="word">${L(s.q)}</span>`, ok: s === t })), cls: 'words', vocab: t.n.en });
      return;
    }
    const o = (s) => ({ html: `<span class="emo">${s.e}</span>`, label: s.n, ok: s === t });
    quiz(this, {
      ask: B(`Which one is Georgia's state ${t.q.en.toUpperCase()}?`, `조지아의 주 ${t.q.ko}은(는) 어느 것일까요?`),
      askSay: B(`Which one is Georgia's state ${t.q.en}?`, `조지아의 주 ${t.q.ko}은 어느 것일까요?`),
      opts: [o(t), ...ds.map(o)],
      after: B(`The ${t.n.en} is Georgia's state ${t.q.en}!`, `${t.n.ko}은(는) 조지아의 주 ${t.q.ko}이에요!`), vocab: `The ${t.n.en} is Georgia's state ${t.q.en}!`
    });
  }
});

// ---------- 3. My address (street / city / state / country) ----------
const GWINNETT_CITIES = ['Lawrenceville', 'Duluth', 'Suwanee', 'Snellville', 'Lilburn', 'Buford', 'Norcross', 'Dacula', 'Grayson', 'Sugar Hill', 'Peachtree Corners'];
registerGame({
  id: 'address', subject: 'ss', icon: '🏠', title: B('Where I Live', '내가 사는 곳'), sub: B('Street, city, state, country', '주소, 도시, 주, 나라'),
  area: AREA_SS('My address'),
  play() {
    const kinds = ['state', 'country', 'nick', 'capital', 'big'];
    if (S.addr.city) kinds.push('city', 'city'); if (S.addr.street) kinds.push('street', 'street');
    const kind = pick(kinds), txt = (v) => `<span class="word">${v}</span>`;
    let ask, ok, ds, after;
    if (kind === 'state') { ask = B('What STATE do you live in?', '우리는 어느 주에 살까요?'); ok = 'Georgia'; ds = ['Florida', 'Alabama', 'Texas'].slice(0, 2); after = B('I live in the state of Georgia.', '우리는 조지아 주에 살아요.'); }
    else if (kind === 'country') { ask = B('What COUNTRY do you live in?', '우리는 어느 나라에 살까요?'); ok = 'United States'; ds = ['Canada', 'Mexico']; after = B('I live in the United States of America.', '우리는 미국에 살아요.'); }
    else if (kind === 'nick') { ask = B('Georgia is called the ___ State.', '조지아는 ___ 주(State)라고 불러요.'); ok = 'Peach'; ds = ['Apple', 'Orange']; after = B('Georgia is the Peach State!', '조지아는 복숭아의 주예요!'); }
    else if (kind === 'capital') { ask = B('What is the capital city of Georgia?', '조지아 주의 주도(수도)는 어디일까요?'); ok = 'Atlanta'; ds = ['Savannah', 'Macon'].slice(0, 2); after = B('Atlanta is the capital of Georgia.', '애틀랜타가 조지아의 주도예요.'); }
    else if (kind === 'big') { ask = B('Which place is the biggest?', '가장 큰 곳은 어디일까요?'); ok = 'Country'; ds = ['City', 'State']; after = B('A country is bigger than a state, and a state is bigger than a city.', '나라는 주보다 크고, 주는 도시보다 커요.'); }
    else if (kind === 'city') { ask = B('What CITY do you live in?', '우리는 어느 도시에 살까요?'); ok = S.addr.city; ds = others(GWINNETT_CITIES.filter(c => c.toLowerCase() !== ok.toLowerCase()), '', 2); after = B(`I live in ${ok}.`, `우리는 ${ok}에 살아요.`); }
    else { ask = B('What is your STREET address?', '우리 집 주소(번지/도로)는 무엇일까요?'); ok = S.addr.street; ds = ['100 Peachtree Street', '25 Maple Lane'].filter(x => x !== ok); after = B(`I live at ${ok}.`, `우리 집은 ${ok}예요.`); }
    const hint = (!S.addr.city && !S.addr.street && kind === 'state') ? `<div class="hint">👨‍👩‍👦 ${T().grownups} → ${T().addrTitle}</div>` : '';
    quiz(this, { ask, show: (kind === 'nick' ? '🍑' : '🏠') + hint, opts: [ok, ...ds].map(v => ({ html: txt(v), ok: v === ok })), cls: 'words', after, vocab: ok });
  }
});

// ---------- 4. Cardinal directions ----------
registerGame({
  id: 'compass', subject: 'ss', icon: '🧭', title: B('Map Directions', '지도 방향'), sub: B('North, south, east, west', '북, 남, 동, 서'),
  area: AREA_SS('Maps & directions'),
  play() {
    if(lvl('compass')===2){
      const d=[B('North','북쪽'),B('East','동쪽'),B('South','남쪽'),B('West','서쪽')],start=rnd(4),right=!!rnd(2),turns=1+rnd(3),ans=(start+(right?turns:4-turns))%4;
      // 70a: one sentence; each quarter-turn is drawn as one arrow so the count is visible.
      quiz(this,{ask:B(`Facing ${d[start].en}, turn ${right?'right':'left'} ${turns} time${turns===1?'':'s'}: which way?`,`${d[start].ko}에서 ${right?'오른쪽':'왼쪽'}으로 ${turns}번 돌면?`),show:`<div style="display:flex;align-items:center;justify-content:center;gap:18px"><div style="font-size:22px;line-height:1.2">N ↑<br>W ← · → E<br>S ↓</div><div style="font-size:28px" aria-hidden="true">🧍 ${(right?'↻':'↺').repeat(turns)}</div></div>`,opts:d.map((n,i)=>({html:`<span class="word">${L(n)}</span>`,ok:i===ans})),cls:'words'});return;
    }
    const dirs = [['N', B('North', '북쪽'), [0, -1]], ['E', B('East', '동쪽'), [1, 0]], ['S', B('South', '남쪽'), [0, 1]], ['W', B('West', '서쪽'), [-1, 0]]];
    const N = 4, items = [['🏠', B('house', '집')], ['🏫', B('school', '학교')], ['🌳', B('tree', '나무')], ['🏪', B('store', '가게')], ['⛲', B('fountain', '분수')], ['🏥', B('hospital', '병원')]];
    const [a, b] = shuffle(items).slice(0, 2); let ax, ay, d, dist;
    for (let k = 0; k < 40; k++) {                                        // random start + direction with room to move
      ax = rnd(N); ay = rnd(N); d = pick(dirs); dist = 1 + rnd(2);
      const bx = ax + d[2][0] * dist, by = ay + d[2][1] * dist; if (bx >= 0 && bx < N && by >= 0 && by < N) break;
    }
    const bx = ax + d[2][0] * dist, by = ay + d[2][1] * dist, rev = rnd(3) === 0;       // sometimes ask the other way around
    const ans = rev ? dirs.find(x => x[2][0] === -d[2][0] && x[2][1] === -d[2][1]) : d;
    const cells = []; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) cells.push(`<div class="mc">${x === ax && y === ay ? a[0] : x === bx && y === by ? b[0] : ''}</div>`);
    const rose = '<div class="rose"><span class="rn">N</span><span class="rw">W</span><span class="re">E</span><span class="rs">S</span></div>';
    const from = rev ? b : a, to = rev ? a : b;
    quiz(this, {
      ask: B(`Which way is the ${to[1].en} from the ${from[1].en}?`, `${from[1].ko}에서 ${to[1].ko}은(는) 어느 쪽에 있을까요?`),
      show: `<div class="mapwrap"><div class="map n4">${cells.join('')}</div>${rose}</div>`,
      opts: dirs.map(x => ({ html: `<span class="num">${x[0]}</span>`, label: x[1], ok: x === ans })), cls: 'shapes',
      after: B(`It is to the ${ans[1].en}.`, `${ans[1].ko}에 있어요.`), vocab: ans[1].en
    });
  }
});

// ---------- 5. Good citizens ----------
const CITIZEN = [
  [['🤝', B('sharing toys', '나눠 써요')], ['😠', B('grabbing toys', '빼앗아요')]],
  [['🗑️', B('trash away', '통에 버려요')], ['🍬', B('littering', '바닥에 버려요')]],
  [['🙋', B('raising hand', '손 들기')], ['📢', B('shouting', '소리치기')]],
  [['🚶', B('walking inside', '복도에서 걸어요')], ['🏃', B('running inside', '복도에서 뛰어요')]],
  [['🙏', B('saying thanks', '고맙다고 말해요')], ['🙊', B('being rude', '무례하게 말해요')]],
  [['🧸', B('cleaning up', '정리해요')], ['🛋️', B('leaving mess', '어질러요')]],
  [['👂', B('listening', '잘 들어요')], ['🗣️', B('chatting loudly', '떠들어요')]],
  [['🪑', B('chair in', '의자 넣어요')], ['🪑', B('chair out', '그냥 둬요')]],
  [['🧍', B('taking turns', '차례 지켜요')], ['🚷', B('cutting line', '새치기해요')]],
  [['🩹', B('helping friend', '친구 도와요')], ['😆', B('laughing at', '비웃어요')]],
  [['📚', B('returning book', '책 돌려줘요')], ['📚', B('keeping book', '안 돌려줘요')]],
  [['🚰', B('tap off', '물 잠가요')], ['🚰', B('wasting water', '물 낭비해요')]]
];
registerGame({
  id: 'citizen', subject: 'ss', icon: '🌟', title: B('Good Citizens', '착한 시민'), sub: B('Kind and fair', '친절하고 공정하게'),
  area: AREA_SS('Citizenship'),
  play() {
    if(lvl('citizen')===2){
      const p=pick(CITIZEN),wrong=pick(CITIZEN.filter(x=>x!==p))[1];
      quiz(this,{ask:B('Which action helps our shared space?','함께 쓰는 곳에 도움이 되는 행동은?'),opts:[p[0],p[1],wrong].map((x,i)=>({html:`<span class="emo">${x[0]}</span><span class="ol">${L(x[1])}</span>`,ok:i===0})),cls:'shapes'});return;
    }
    const p = pick(CITIZEN), notQ = rnd(3) === 0;
    quiz(this, {
      ask: notQ ? B('Who is NOT being a good citizen?', '누가 좋은 시민이 아닐까요?') : B('Who is being a good citizen?', '누가 좋은 시민일까요?'),
      opts: [{ html: `<span class="emo">${p[0][0]}</span><span class="ol">${L(p[0][1])}</span>`, ok: !notQ }, { html: `<span class="emo">${p[1][0]}</span><span class="ol">${L(p[1][1])}</span>`, ok: notQ }], cls: 'groups',
      after: B('Good citizens are kind and follow the rules!', '좋은 시민은 친절하고 규칙을 지켜요!'), vocab: 'Good citizens follow the rules!'
    });
  }
});

// ---------- 6. Community workers (Labor Day) ----------
const JOBS = [
  { e: '🧑‍🚒', n: B('firefighter', '소방관'), q: B('Who puts out fires?', '불을 끄는 사람은 누구일까요?') },
  { e: '👮', n: B('police officer', '경찰관'), q: B('Who keeps people safe on roads?', '길에서 사람들을 안전하게 지키는 사람은?') },
  { e: '🧑‍🏫', n: B('teacher', '선생님'), q: B('Who teaches children at school?', '학교에서 아이들을 가르치는 사람은?') },
  { e: '🧑‍⚕️', n: B('doctor', '의사'), q: B('Who helps sick people feel better?', '아픈 사람을 낫게 도와주는 사람은?') },
  { e: '🧑‍🌾', n: B('farmer', '농부'), q: B('Who grows food on a farm?', '농장에서 먹거리를 키우는 사람은?') },
  { e: '👷', n: B('builder', '건축 노동자'), q: B('Who builds houses and buildings?', '집과 건물을 짓는 사람은?') },
  { e: '🧑‍🍳', n: B('cook', '요리사'), q: B('Who cooks food in a restaurant?', '식당에서 음식을 만드는 사람은?') },
  { e: '🧑‍✈️', n: B('pilot', '조종사'), q: B('Who flies an airplane?', '비행기를 조종하는 사람은?') }
];
registerGame({
  id: 'jobs', subject: 'ss', icon: '👷', title: B('Who Helps Us?', '누가 도와줄까?'), sub: B('Workers & Labor Day', '일하는 사람들과 노동절'),
  area: AREA_SS('Labor Day & jobs'),
  play() {
    const t = pick(JOBS), ds = others(JOBS, t, lvl('jobs') === 2 ? 3 : 2);
    if (rnd(2)) {
      quiz(this, { ask: B('What is this worker called?', '이 일을 하는 사람의 이름을 골라요.'), askExtra: { t: L(t.q) }, show: `<span class="emo">${t.e}</span><div style="font-size:clamp(16px,3dvh,22px)">${L(t.q)}</div>`, opts: [t, ...ds].map(j => ({ html: `<span class="word">${L(j.n)}</span>`, ok: j === t })), cls: 'words', vocab: t.n.en });
      return;
    }
    const o = (j) => ({ html: `<span class="emo">${j.e}</span>`, label: j.n, ok: j === t });
    quiz(this, { ask: t.q, opts: [o(t), ...ds.map(o)], after: B(`A ${t.n.en} helps our community!`, `${t.n.ko}은(는) 우리 마을을 도와줘요!`), vocab: t.n.en });
  }
});

// ---------- 7. Holidays ----------
const HOLIDAYS = [
  { e: '👷', n: B('Labor Day', '노동절') }, { e: '🦃', n: B('Thanksgiving', '추수감사절') }, { e: '🎆', n: B('Independence Day', '독립기념일') },
  { e: '🎖️', n: B('Veterans Day', '재향군인의 날') }, { e: '⛵', n: B('Columbus Day', '콜럼버스의 날') }
];
registerGame({
  id: 'holidays', subject: 'ss', icon: '🎆', title: B('American Holidays', '미국 기념일'), sub: B('Match the picture', '그림 짝 맞추기'),
  area: AREA_SS('Holidays'),
  play() {
    const t = pick(HOLIDAYS), ds = others(HOLIDAYS, t, 2);
    const o = (h) => ({ html: `<span class="emo">${h.e}</span>`, ok: h === t });
    quiz(this, { ask: B(`Which picture goes with ${t.n.en.toUpperCase()}?`, `${t.n.ko}과 어울리는 그림은?`), askSay: B(`Which picture goes with ${t.n.en}?`, `${t.n.ko}과 어울리는 그림은?`), opts: [o(t), ...ds.map(o)], cls: 'shapes', after: B(`${t.n.en}!`, `${t.n.ko}!`), vocab: t.n.en });
  }
});
// Additional K retrieval tasks; existing SVG flag artwork remains the source.
(() => {
  const flags = GAMES.find(g => g.id === 'flags'), flagsPlay = flags.play;
  const questions = [
    [true, B('Which flag belongs to our STATE, Georgia?', '우리가 사는 조지아 주의 깃발을 찾아요.')],
    [false, B('Which flag belongs to the United States?', '미국을 나타내는 깃발을 찾아요.')],
    [true, B('Which flag has three wide stripes?', '빨강·하양·빨강의 넓은 줄 세 개가 있는 깃발은?')],
    [false, B('Which flag has 13 red and white stripes?', '빨강과 하양 줄이 모두 13개인 깃발은?')],
    [true, B('Which flag has 13 stars in a ring?', '별 13개가 고리 모양으로 놓인 깃발은?')]
  ];
  flags.play = function () {
    const mode = rnd(3);
    if (mode === 0) return flagsPlay.call(this);
    if (mode === 1) {
      const ga = !!rnd(2);
      return quiz(this, { ask: B('What is the name of this flag?', '이 깃발의 이름을 골라요.'), show: (ga ? flagGA() : flagUS()).replace('<svg ', '<svg style="width:min(70vw,42dvh);height:auto" '), opts: [true, false].map(v => ({ html: `<span class="word">${L(v ? B('Georgia flag', '조지아 주기') : B('USA flag', '미국 국기'))}</span>`, ok: v === ga })), cls: 'words' });
    }
    const [ga, ask] = pick(questions);
    quiz(this, { ask, opts: [{ html: flagGA(), ok: ga }, { html: flagUS(), ok: !ga }], cls: 'flags' });
  };
  const address = GAMES.find(g => g.id === 'address'), addressPlay = address.play;
  const kinds = [B('Street address', '도로명과 번지'), B('City', '도시'), B('State', '주'), B('Country', '나라')];
  const examples = [['12 Maple Lane', 'Duluth', 'Georgia', 'United States'], ['25 Oak Road', 'Atlanta', 'Georgia', 'United States'], ['8 Pine Court', 'Lawrenceville', 'Georgia', 'United States'], ['40 Creek Drive', 'Suwanee', 'Georgia', 'United States'], ['3 Lake Street', 'Savannah', 'Georgia', 'United States']];
  // 70a: short K questions; the address is an envelope with one part per line (small place first).
  // Level 2 compares sizes of address parts instead of adding a fourth option.
  const envelope = ex => `<div style="display:inline-block;text-align:left;border:2px solid #b9a27f;border-radius:10px;padding:6px 12px;background:#fffdf6;font-size:clamp(16px,3dvh,22px);line-height:1.3">✉️ ${ex.join('<br>')}</div>`;
  address.play = function () {
    const ex = pick(examples);
    if (lvl('address') === 2) {
      const shown = shuffle([0, 1, 2, 3]).slice(0, 3).sort(), big = !!rnd(2), i = big ? shown[2] : shown[0];
      return quiz(this, { ask: big ? B('Which place is the biggest?', '가장 큰 곳은 어디일까요?') : B('Which place is the smallest?', '가장 작은 곳은 어디일까요?'), show: envelope(ex), opts: shown.map(j => ({ html: `<span class="word">${ex[j]}</span>`, ok: j === i })), cls: 'words', after: B('House, city, state, country: each one is inside the next.', '집, 도시, 주, 나라 순서로 점점 커져요.') });
    }
    if (!rnd(3)) return addressPlay.call(this);
    const i = rnd(4), reverse = !!rnd(2);
    const ask = reverse ? B(`What kind of place is ${ex[i]}?`, `${ex[i]}: 어떤 곳일까요?`) : B(`Find the ${kinds[i].en.toLowerCase()} here.`, `${kinds[i].ko}를 찾아요.`);
    const indices = [i, ...others([0, 1, 2, 3], i, 2)];
    quiz(this, { ask, show: envelope(ex), opts: indices.map(j => ({ html: `<span class="word">${reverse ? L(kinds[j]) : ex[j]}</span>`, ok: j === i })), cls: 'words' });
  };
  // Illustrations are mnemonics, not official holiday symbols. Captions disambiguate them.
  const holidays = GAMES.find(g => g.id === 'holidays');
  const bank = [
    ['👷', B('Labor Day', '노동절'), B('We honor workers.', '일하는 사람들에게 감사해요.')],
    ['🦃', B('Thanksgiving', '추수감사절'), B('A day for giving thanks.', '감사하는 마음을 나누는 날이에요.')],
    ['🎆', B('Independence Day', '독립기념일'), B('We celebrate U.S. independence.', '미국의 독립을 기념해요.')],
    ['🎖️', B('Veterans Day', '재향군인의 날'), B('We honor people who served in the military.', '군에서 복무한 분들에게 감사해요.')],
    ['🇺🇸', B('Flag Day', '국기의 날'), B('We celebrate the U.S. flag.', '미국 국기를 기념해요.')],
    ['📅', B("New Year's Day", '새해 첫날'), B('The first day of a new year.', '새해의 첫날이에요.')]
  ];
  holidays.play = function () {
    const t = pick(bank), reverse = !!rnd(2), ds = others(bank, t, lvl('holidays') === 2 ? 3 : 2);
    quiz(this, { ask: reverse ? t[2] : B(`Find the card for ${t[1].en}.`, `${t[1].ko} 카드를 찾아요.`), show: reverse ? `<span class="emo">${t[0]}</span>` : '', opts: [t, ...ds].map(h => ({ html: `<span class="emo" role="img" aria-label="${L(h[2])}">${h[0]}</span>`, label: reverse ? h[1] : undefined, ok: h === t })), cls: 'shapes', after: t[2], vocab: t[1].en });
  };
})();

// 63a: compare symbols within a category and connect two roles at level 2.
(() => {
 const choices=a=>a.map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0}));
 const sameKind=[
 [B('apple','사과'),B('orange','오렌지')], [B('carrot','당근'),B('cabbage','양배추')],
 [B('cardinal','홍관조'),B('robin','개똥지빠귀')], [B('pine','소나무'),B('maple','단풍나무')],
 [B('butterfly','나비'),B('ladybug','무당벌레')], [B('alligator','악어'),B('sea turtle','바다거북')],
 [B('sunflower','해바라기'),B('daisy','데이지')]];
 GAMES.find(g=>g.id==='gasymbols').play=function(){const i=rnd(GA_SYMBOLS.length),t=GA_SYMBOLS[i];
  if(lvl(this.id)===1&&rnd(2))return quiz(this,{ask:B(`What kind of symbol is the ${t.n.en}?`,`주 상징 ${t.n.ko}: 어떤 종류일까요?`),opts:choices([t.q,...others(GA_SYMBOLS,t,2).map(x=>x.q)]),cls:'words'});
  if(lvl(this.id)===1)return quiz(this,{ask:B(`Which is Georgia's state ${t.q.en}?`,`조지아의 주 ${t.q.ko} 상징은?`),opts:choices([t.n,...sameKind[i]]),cls:'words'});
  const j=(i+1+rnd(GA_SYMBOLS.length-1))%GA_SYMBOLS.length,u=GA_SYMBOLS[j],pair=(a,b)=>B(`${a.en} + ${b.en}`,`${a.ko} + ${b.ko}`);
  quiz(this,{ask:B(`Which pair matches Georgia's ${t.q.en} and ${u.q.en}?`,`조지아의 ${t.q.ko} 상징과 ${u.q.ko} 상징에 맞는 짝은?`),opts:choices([pair(t.n,u.n),pair(sameKind[i][0],u.n),pair(t.n,sameKind[j][0])]),cls:'words'});
 };
 const jobs=GAMES.find(g=>g.id==='jobs'),old=jobs.play;
 jobs.play=function(){if(lvl(this.id)===1)return old.call(this);const a=pick(JOBS),b=pick(JOBS.filter(x=>x!==a)),c=pick(JOBS.filter(x=>x!==a&&x!==b)),pair=(x,y)=>B(`${x.n.en} + ${y.n.en}`,`${x.n.ko} + ${y.n.ko}`);quiz(this,{ask:B('Which pair can do BOTH jobs in order?','두 일을 차례로 하는 사람들의 짝은?'),show:`<div class="storytext">${L(a.q)}<br>${L(b.q)}</div>`,askExtra:{t:`${L(a.q)} ${L(b.q)}`},opts:choices([pair(a,b),pair(a,c),pair(c,b)]),cls:'words'});};
 const holidays=GAMES.find(g=>g.id==='holidays'),prior=holidays.play;
 const days=[
 [B('Labor Day','노동절'),B('workers','일하는 사람들')],
 [B('Veterans Day','재향군인의 날'),B('people who served in the military','군에서 복무한 분들')],
 [B('Flag Day','국기의 날'),B('the U.S. flag','미국 국기')],
 [B('Independence Day','독립기념일'),B('U.S. independence','미국의 독립')],
 [B('Thanksgiving','추수감사절'),B('giving thanks','감사하는 마음')],
 [B("New Year's Day",'새해 첫날'),B('the start of a new year','새해의 시작')]];
 holidays.play=function(){if(lvl(this.id)===1)return prior.call(this);const a=pick(days),b=pick(days.filter(x=>x!==a)),c=pick(days.filter(x=>x!==a&&x!==b)),pair=(x,y)=>B(`${x[0].en} → ${y[0].en}`,`${x[0].ko} → ${y[0].ko}`);quiz(this,{ask:B('Which pair of days fits in order?','차례대로 맞는 기념일의 짝은?'),show:`<div class="storytext">1: ${L(a[1])}<br>2: ${L(b[1])}</div>`,askExtra:{t:`${L(a[1])}. ${L(b[1])}`},opts:choices([pair(a,b),pair(b,a),pair(a,c)]),cls:'words'});};
})();

// 63a: compare two features together instead of repeating flag-name recall.
(() => {const g=GAMES.find(g=>g.id==='flags'),old=g.play;g.play=function(){if(lvl(this.id)===1)return old.call(this);const ga=!!rnd(2);quiz(this,{ask:B('Which description matches BOTH features?','두 가지 모습에 모두 맞는 설명은?'),show:(ga?flagGA():flagUS()).replace('<svg ','<svg style="width:min(55vw,28dvh);height:auto" '),opts:(()=>{const facts=ga?[B('3 stripes','줄 3개'),B('stars in a ring','별은 고리 모양'),B('13 stars','별 13개'),B('a gold circle','금색 동그라미')]:[B('13 stripes','줄 13개'),B('stars in rows','별은 여러 줄'),B('50 stars','별 50개'),B('no gold circle','금색 동그라미 없음')],wrong=ga?[B('13 stripes','줄 13개'),B('stars in rows','별은 여러 줄'),B('50 stars','별 50개'),B('no gold circle','금색 동그라미 없음')]:[B('3 stripes','줄 3개'),B('stars in a ring','별은 고리 모양'),B('13 stars','별 13개'),B('a gold circle','금색 동그라미')],a=rnd(4),b=pick([0,1,2,3].filter(x=>x!==a)),pair=(x,y)=>B(`${x.en}; ${y.en}`,`${x.ko}, ${y.ko}`);return [pair(facts[a],facts[b]),pair(wrong[a],facts[b]),pair(facts[a],wrong[b])];})().map((x,i)=>({html:`<span class="word" style="font-size:clamp(15px,2.7dvh,20px);line-height:1.15">${L(x)}</span>`,ok:i===0})),cls:'words'});};})();
