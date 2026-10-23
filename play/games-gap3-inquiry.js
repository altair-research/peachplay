(() => {
  'use strict';
  // All records below are invented learning materials, not reports of real observations.
  const b = (en, ko) => B(en, ko), t = x => L(x);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const topics = [b('Garden','텃밭'), b('Library','도서실'), b('Playground','놀이터')];
  const state = new Map();
  // Separate authored banks: changing only the source heading is not a new grade bank.
  const bankRows = {
    '1': [
      [0,'seed trays','씨앗 쟁반','We put seeds in trays.','쟁반에 씨를 놓았어요.','We swept the steps.','계단을 쓸었어요.','We hung up our coats.','외투를 걸었어요.','seed trays','씨앗 쟁반','We set the trays by the window.','쟁반을 창가에 두었어요.'],
      [0,'garden labels','텃밭 이름표','We wrote names on sticks.','막대에 이름을 썼어요.','We washed our boots.','장화를 씻었어요.','We folded a blanket.','담요를 접었어요.','plant labels','식물 이름표','We put a name beside each plant.','식물마다 이름표를 놓았어요.'],
      [0,'plant pots','식물 화분','We put soil in pots.','화분에 흙을 담았어요.','We packed our snacks.','간식을 챙겼어요.','We shut the gate.','문을 닫았어요.','plant pots','식물 화분','We moved the pots onto a tray.','화분을 쟁반 위로 옮겼어요.'],
      [0,'garden paths','텃밭 길','We laid stones along the path.','길을 따라 돌을 놓았어요.','We drew a flower.','꽃을 그렸어요.','We picked a tomato.','토마토를 땄어요.','path stones','길의 돌','We walked between the stones.','돌 사이로 걸었어요.'],
      [1,'bookmarks','책갈피','We put strips between pages.','책장 사이에 긴 종이를 끼웠어요.','We stacked the chairs.','의자를 쌓았어요.','We wiped the window.','창문을 닦았어요.','bookmarks','책갈피','We marked where we stopped reading.','읽기를 멈춘 곳을 표시했어요.'],
      [1,'story time','이야기 시간','We listened to a reader.','책 읽는 사람의 이야기를 들었어요.','We sharpened pencils.','연필을 깎았어요.','We tied our shoes.','신발 끈을 묶었어요.','story cards','이야기 카드','We sat together to hear the ending.','함께 앉아 결말을 들었어요.'],
      [1,'finding books','책 찾기','We checked the shelf signs.','책장의 안내판을 살폈어요.','We opened our lunch boxes.','도시락을 열었어요.','We watered a plant.','식물에 물을 줬어요.','shelf signs','책장 안내판','We followed a sign to the animal books.','안내판을 보고 동물 책으로 갔어요.'],
      [1,'returning books','책 돌려주기','We used the return box.','반납 상자를 썼어요.','We drew a map.','지도를 그렸어요.','We chose a seat.','자리를 골랐어요.','returned books','돌려준 책','We took the books back after reading.','다 읽은 책을 가져다줬어요.'],
      [2,'hopscotch','사방치기','We hopped through chalk squares.','분필로 그린 칸에서 뛰었어요.','We dug a hole.','구덩이를 팠어요.','We tossed a ball.','공을 던졌어요.','chalk squares','분필 칸','We drew numbers inside the squares.','칸 안에 숫자를 썼어요.'],
      [2,'beanbag toss','콩주머니 던지기','We tossed bags into a hoop.','테 안으로 주머니를 던졌어요.','We spun a wheel.','바퀴를 돌렸어요.','We rode a scooter.','킥보드를 탔어요.','beanbags','콩주머니','We stood behind a line to throw.','선 뒤에 서서 던졌어요.'],
      [2,'balancing','균형 잡기','We walked along a low beam.','낮은 평균대 위를 걸었어요.','We drew on the wall.','벽에 그림을 그렸어요.','We bounced a ball.','공을 튀겼어요.','balance blocks','균형 놀이 블록','We held our arms out on the beam.','평균대 위에서 팔을 벌렸어요.'],
      [2,'play signals','놀이 신호','We stopped when a flag rose.','깃발이 올라가면 멈췄어요.','We filled a sand mold.','모래 틀을 채웠어요.','We rolled a hoop.','테를 굴렸어요.','signal flags','신호 깃발','We watched the leader before moving.','움직이기 전에 진행자를 봤어요.']
    ],
    '2': [
      [0,'plant supports','식물 받침대','We tied stems to canes.','줄기를 막대에 묶었어요.','We ate our lunch.','점심을 먹었어요.','We painted a gate.','문에 칠했어요.','support canes','받침 막대','We checked the ties beside the stems.','줄기 옆의 묶은 곳을 살폈어요.'],
      [0,'garden gloves','텃밭 장갑','We covered our hands before digging.','땅을 파기 전에 손에 장갑을 꼈어요.','We counted the birds.','새 수를 셌어요.','We filled a flower vase.','꽃병을 채웠어요.','garden gloves','텃밭 장갑','We left the gloves by the spades.','모종삽 옆에 장갑을 두었어요.'],
      [0,'measuring plants','식물 재기','We held rulers beside the stems.','줄기 옆에 자를 세웠어요.','We sorted our snacks.','간식을 나눴어요.','We locked the shed.','창고를 잠갔어요.','plant rulers','식물 재는 자','We wrote the heights in a notebook.','공책에 높이를 적었어요.'],
      [0,'garden harvest','텃밭 수확','We picked peas into baskets.','완두콩을 따서 바구니에 담았어요.','We put up a sign.','안내판을 세웠어요.','We repaired a chair.','의자를 고쳤어요.','harvest baskets','수확 바구니','We carried the full baskets inside.','가득 찬 바구니를 안으로 날랐어요.'],
      [1,'book displays','책 전시','We stood books facing outward.','표지가 보이게 책을 세웠어요.','We folded our coats.','외투를 접었어요.','We cleaned the clock.','시계를 닦았어요.','display stands','전시 받침대','We put a story book on each stand.','받침대마다 이야기책을 놓았어요.'],
      [1,'book bags','책 가방','We packed books in cloth bags.','천 가방에 책을 담았어요.','We moved a desk.','책상을 옮겼어요.','We changed a poster.','포스터를 바꿨어요.','book bags','책 가방','We carried the bags to our class.','가방을 교실로 날랐어요.'],
      [1,'book voting','책 투표','We placed tokens by favorite titles.','좋아하는 제목 옆에 표를 놓았어요.','We hung a picture.','그림을 걸었어요.','We stacked empty boxes.','빈 상자를 쌓았어요.','voting tokens','투표 조각','We counted the votes for each book.','책마다 받은 표를 셌어요.'],
      [1,'audio stories','소리로 듣는 이야기','We wore headphones to hear a story.','헤드폰으로 이야기를 들었어요.','We sharpened crayons.','크레용을 깎았어요.','We straightened the rug.','깔개를 폈어요.','headphones','헤드폰','We paused the story to talk about it.','이야기를 멈추고 이야기에 대해 말했어요.'],
      [2,'game teams','놀이 모둠','We wore bands to show our teams.','모둠을 표시하는 띠를 둘렀어요.','We washed the slide.','미끄럼틀을 씻었어요.','We drew a tree.','나무를 그렸어요.','team bands','모둠 띠','We stood beside our teammates.','같은 모둠 친구 옆에 섰어요.'],
      [2,'obstacle paths','장애물 길','We stepped over low bars.','낮은 막대를 넘어갔어요.','We planted a seed.','씨를 심었어요.','We opened a book.','책을 펼쳤어요.','path cones','길의 고깔','We went around cones on the path.','길의 고깔을 돌아갔어요.'],
      [2,'target games','과녁 놀이','We aimed balls at circles.','원을 겨냥해 공을 던졌어요.','We swept up leaves.','나뭇잎을 쓸었어요.','We sat for a photo.','사진을 찍으려고 앉았어요.','target hoops','과녁 테','We moved the circles before another turn.','다음 차례 전에 원을 옮겼어요.'],
      [2,'wheel tracks','바퀴 자국','We looked at lines left by wheels.','바퀴가 남긴 줄을 살폈어요.','We sang on the bench.','벤치에서 노래했어요.','We tossed a scarf.','스카프를 던졌어요.','toy wheels','장난감 바퀴','We rolled wheels across soft sand.','부드러운 모래 위로 바퀴를 굴렸어요.']
    ]
  };
  const banks={};
  for(const grade of ['1','2'])banks[grade]=bankRows[grade].map(r=>[r[0],b(r[1],r[2]),b(r[3],r[4]),b(r[5],r[6]),b(r[7],r[8]),b(r[9],r[10]),b(r[11],r[12])]);
  const labels = [b('Note 1','기록 1'),b('Note 2','기록 2'),b('Note 3','기록 3')];
  const attrs = [b('Did the number change?','수가 달라졌나요?'),b('Did the color change?','색이 달라졌나요?'),b('Did the size change?','크기가 달라졌나요?')];
  // K: picture cards + audio on familiar topics (animals, weather, food); the first card answers the question.
  // [topic, question, short name, wonder picture, [[picture, en, ko] x3]]
  const kTopics = [b('🐾 Animals','🐾 동물'), b('🌦️ Weather','🌦️ 날씨'), b('🍎 Food','🍎 먹을 것')];
  const kItems = [
    [0,b('Which picture shows what birds eat?','새가 먹는 것을 알려 주는 그림은?'),b('bird food','새 먹이'),'🐦',[['🐦🌻','seeds','씨앗'],['🐦🪺','nest','둥지'],['🐦☁️','sky','하늘']]],
    [0,b('Which picture shows where fish live?','물고기가 사는 곳을 알려 주는 그림은?'),b('fish home','물고기 집'),'🐟',[['🐟🌊','water','물'],['🐟🪱','worm','지렁이'],['🐟🐠','friend','친구']]],
    [0,b('Which picture shows a toy for cats?','고양이 장난감을 알려 주는 그림은?'),b('cat toy','고양이 장난감'),'🐱',[['🐱🧶','yarn','털실'],['🐱🐟','fish','생선'],['🐱🛏️','bed','침대']]],
    [0,b('Which picture shows where a dog sleeps?','강아지가 자는 곳을 알려 주는 그림은?'),b('dog sleep','강아지 잠'),'🐶',[['🐶🛏️','bed','침대'],['🐶🦴','bone','뼈다귀'],['🐶⚽','ball','공']]],
    [0,b('Which picture shows what rabbits eat?','토끼가 먹는 것을 알려 주는 그림은?'),b('rabbit food','토끼 먹이'),'🐰',[['🐰🥕','carrot','당근'],['🐰🕳️','hole','굴'],['🐰🧺','basket','바구니']]],
    [0,b('Which picture shows what monkeys eat?','원숭이가 먹는 것을 알려 주는 그림은?'),b('monkey food','원숭이 먹이'),'🐒',[['🐒🍌','banana','바나나'],['🐒💤','sleep','잠'],['🐒🌧️','rain','비']]],
    [1,b('Which picture shows shoes for rain?','비 오는 날 신발은 어느 그림?'),b('rain day','비 오는 날'),'🌧️',[['🌧️👢','boots','장화'],['🌧️🍪','cookie','과자'],['🌧️📖','book','책']]],
    [1,b('Which picture shows how to warm hands?','손을 따뜻하게 하는 것은 어느 그림?'),b('cold hands','차가운 손'),'❄️',[['❄️🧤','mittens','장갑'],['❄️🛷','sled','썰매'],['❄️⛄','snowman','눈사람']]],
    [1,b('Which picture keeps sun off your head?','햇볕에서 머리를 가려 주는 그림은?'),b('sunny day','해 나는 날'),'☀️',[['☀️👒','hat','모자'],['☀️🍉','melon','수박'],['☀️🧃','juice','주스']]],
    [1,b('Which picture shows what wind can move?','바람이 움직이는 것을 알려 주는 그림은?'),b('windy day','바람 부는 날'),'🌬️',[['🌬️🪁','kite','연'],['🌬️🪨','rock','돌'],['🌬️🏠','house','집']]],
    [2,b('Which picture shows a cold treat?','차가운 간식을 알려 주는 그림은?'),b('cold treat','차가운 간식'),'🧊',[['🍦','ice cream','아이스크림'],['🍪','cookie','과자'],['🍞','bread','빵']]],
    [2,b('Which picture shows what cows give us?','소가 주는 것을 알려 주는 그림은?'),b('cow','소'),'🐄',[['🐄🥛','milk','우유'],['🐄🌾','grass','풀'],['🐄💤','sleep','잠']]],
    [2,b('Which picture shows what hens lay?','닭이 낳는 것을 알려 주는 그림은?'),b('hen','닭'),'🐔',[['🐔🥚','egg','달걀'],['🐔🌽','corn','옥수수'],['🐔🏠','house','집']]],
    [2,b('Which picture shows where apples grow?','사과가 자라는 곳을 알려 주는 그림은?'),b('apples','사과'),'🍎',[['🍎🌳','tree','나무'],['🍎🧺','basket','바구니'],['🍎🥧','pie','파이']]],
    [2,b('Which picture shows what bees make?','벌이 만드는 것을 알려 주는 그림은?'),b('bees','벌'),'🐝',[['🐝🍯','honey','꿀'],['🐝🌸','flower','꽃'],['🐝🌳','tree','나무']]]
  ];
  // K level 2: two pictures differ in exactly one feature (0 number, 1 color, 2 size).
  const hue = (e, deg) => `<span style="filter:hue-rotate(${deg}deg)">${e}</span>`, sized = (e, em) => `<span style="font-size:${em}em">${e}</span>`;
  const kChanges = [
    ...[['🍪',2,4,'cookies','과자','개'],['🐟',1,3,'fish','물고기','마리'],['🌸',3,5,'flowers','꽃','송이'],['🐤',2,3,'chicks','병아리','마리'],['🍓',4,2,'strawberries','딸기','개']].map(([e,x,y,en,ko,c])=>[0,e.repeat(x),e.repeat(y),b(`${x} ${en}`,`${ko} ${x}${c}`),b(`${y} ${en}`,`${ko} ${y}${c}`)]),
    [1,'🍏','🍎',b('a green apple','초록 사과'),b('a red apple','빨간 사과')],
    [1,'🎈',hue('🎈',220),b('a red balloon','빨간 풍선'),b('a blue balloon','파란 풍선')],
    [1,'🚗',hue('🚗',220),b('a red car','빨간 자동차'),b('a blue car','파란 자동차')],
    [1,hue('🍌',60),'🍌',b('a green banana','초록 바나나'),b('a yellow banana','노란 바나나')],
    [1,'🧢',hue('🧢',150),b('a blue cap','파란 모자'),b('a red cap','빨간 모자')],
    ...[['🌱',0.6,1.3,'plant','새싹'],['🎈',0.6,1.3,'balloon','풍선'],['⛄',1.3,0.6,'snowman','눈사람'],['🐶',0.6,1.3,'puppy','강아지'],['🫧',0.6,1.3,'bubble','비눗방울']].map(([e,x,y,en,ko])=>{const s=x<y;return [2,sized(e,x),sized(e,y),b(`a ${s?'small':'big'} ${en}`,`${s?'작은':'큰'} ${ko}`),b(`a ${s?'big':'small'} ${en}`,`${s?'큰':'작은'} ${ko}`)];})
  ];
  const kAttrs = [['🔢',b('number','수')],['🎨',b('color','색')],['📏',b('size','크기')]];
  const kOpt = (pic, label) => `<span class="g3k-pic" aria-hidden="true">${pic}</span><span class="word">${esc(t(label))}</span>`;
  function kReadChoices() {
    // Short Korean labels fall under core's text-length threshold, so give the choices their own replay.
    if ($('#spo')) return;
    const rb=document.createElement('button');rb.className='say';rb.id='spo';rb.textContent='🔉';rb.setAttribute('aria-label',t(b('Read the choices','보기 읽어 주기')));
    rb.onclick=()=>$$('.opt .word').forEach((e,i)=>say(e.textContent,S.lang==='ko'?'ko-KR':'en-US',i>0));
    $('#sp').after(rb);
  }
  function makeK(level) {
    let ask,show,opts,after,notes;
    if(level===1) {
      const r=pick(kItems);
      ask=r[1];notes=[r[1]];
      show=`<div class="g3a-material g3k"><button type="button" class="g3a-note g3k-wonder" data-g3a-note="0" aria-label="${esc(t(b('Hear our question','우리 질문 듣기')))}"><span class="g3k-pic" aria-hidden="true">${r[3]}❓</span> 🔊</button></div>`;
      opts=r[4].map((o,i)=>({html:kOpt(o[0],b(o[1],o[2])),ok:i===0,category:'picture'}));
      after=b('This picture answers our question.','이 그림이 우리 질문에 답해 줘요.');
    } else {
      const r=pick(kChanges),pre=[b('Picture 1: ','그림 1: '),b('Picture 2: ','그림 2: ')];
      ask=b('What changed between the two pictures?','두 그림에서 무엇이 바뀌었나요?');
      notes=[r[3],r[4]].map((x,i)=>b(pre[i].en+x.en+'.',pre[i].ko+x.ko+'.'));
      const card=(i,pic)=>`<button type="button" class="g3a-note g3k-card" data-g3a-note="${i}" aria-label="${esc(t(notes[i]))}"><span class="g3k-pic" aria-hidden="true">${pic}</span><span>${i+1} 🔊</span></button>`;
      show=`<div class="g3a-material g3k"><div class="g3k-pair">${card(0,r[1])}<span aria-hidden="true">➜</span>${card(1,r[2])}</div></div>`;
      opts=kAttrs.map((x,i)=>({html:kOpt(x[0],x[1]),ok:i===r[0],category:'feature'}));
      after=b('The pictures show the same thing; only this changed.','두 그림은 같은 것이고 이것만 바뀌었어요.');
    }
    return {ask,show,opts,after,notes};
  }
  const button = (id, text) => `<button type="button" id="${id}">${esc(t(text))}</button>`;
  function speak(text) { say(t(text), S.lang === 'ko' ? 'ko-KR' : 'en-US'); }
  function cards(notes, names = labels) {
    return notes.map((x,i) => `<button type="button" class="g3a-note" data-g3a-note="${i}"><strong>${esc(t(names[i]))}</strong> 🔊<span>${esc(t(x))}</span></button>`).join('');
  }
  function bindNotes(notes) { $$('[data-g3a-note]').forEach(e => e.onclick = () => speak(notes[Number(e.dataset.g3aNote)])); }
  function frame(title, html) {
    view().innerHTML = `<section class="g3a-panel"><h2>${esc(t(title))}</h2><button type="button" class="g3a-menu" id="g3a-read">🔊 ${esc(t(b('Hear this page','이 화면 듣기')))}</button>${html}</section>`;
    $('#g3a-read').onclick=()=>say($('.g3a-panel').innerText,S.lang==='ko'?'ko-KR':'en-US');
  }
  function entry(game) {
    const s = state.get(game.id);
    frame(b('What shall we explore?','무엇을 알아볼까요?'), `<p>${esc(t(b('Choose a topic. No points here.','주제를 골라요. 점수는 없어요.')))}</p><div class="g3a-topics">${(game.grade==="K"?kTopics:topics).map((x,i)=>`<button type="button" data-g3a-topic="${i}" aria-pressed="${s.topic===i}">${esc(t(x))}${s.topic===i?' ✓':''}</button>`).join('')}</div><p>${esc(t(game.grade==='K'?b('Pretend pictures · Tap 🔊 to hear.','가상 그림 · 🔊를 눌러 들어요.'):b('Invented records · Read with an adult when sound is off.','가상 기록 · 무음일 때는 어른과 함께 읽어요.')))}</p>${button('g3a-practice',b('Practice · 10 questions','연습 · 10문제'))}${button('g3a-open',b('Investigate together · no score','함께 조사 · 점수 없음'))}`);
    $$('[data-g3a-topic]').forEach(e=>e.onclick=()=>{s.topic=Number(e.dataset.g3aTopic);speak((game.grade==="K"?kTopics:topics)[s.topic]);entry(game);});
    $('#g3a-practice').onclick=()=>{s.practice=true; SESSION.rounds=10;game.play();};
    $('#g3a-open').onclick=()=>investigate(game);
  }
  function investigate(game) {
    // No quiz, LearnLog, stat, save, completion or reward calls on this path.
    const s=state.get(game.id);s.practice=false;
    const k=game.grade==='K',pool=(k?kItems:banks[game.grade]).filter(r=>r[0]===s.topic);
    let question=0, stage=0, slot=0, bins=[[],[]];
    const names=k?[b('👍 Helps','👍 도움 돼요'),b('🤔 Not this','🤔 아니에요')]:[b('Helps my question','질문에 도움이 돼요'),b('Another topic','다른 주제예요')];
    let notes=[],pics=[];
    // K notes are the three picture cards of the chosen question, in a fresh order.
    const updateNotes=()=>{const r=pool[question];if(k){const o=shuffle(r[4]);pics=o.map(x=>x[0]);notes=o.map(x=>b(x[1],x[2]));}else notes=[r[2],r[3],r[6],r[4]];};
    updateNotes();
    const source=i=>game.grade==='2'?(i<2?b('A · class note','A · 학급 기록'):b('B · invented interview','B · 가상 인터뷰')):b('Class note','학급 기록');
    const noteText=i=>k?`${pics[i]} ${t(notes[i])}`:`${t(source(i))}: ${t(notes[i])}`;
    const qName=r=>k?`${r[3]} ${t(r[2])}`:t(r[1]);
    function render() {
      const q=k?pool[question][1]:b(`What can we find out about ${t(pool[question][1])}?`,`${t(pool[question][1])}에 대해 무엇을 알아볼까요?`);
      const help=k?b('Find pictures for your question.','내 질문에 맞는 그림을 찾아요.'):b('Choose your question, sort the notes, then share in your own words.','질문을 고르고 기록을 나눈 뒤 내 말로 알려 줘요.');
      let html=`<p>${esc(t(help))}</p>`;
      if(stage===0) html+=`<p>${esc(t(k?b('Pick a question card.','질문 카드를 골라요.'):b('Choose a question card; say your own question to someone too.','질문 카드를 골라요. 나만의 질문도 직접 말해 봐요.')))}</p><div class="g3a-choices">${pool.map((r,i)=>`<button data-g3a-q="${i}" aria-pressed="${question===i}">${esc(qName(r))}${question===i?' ✓':''}</button>`).join('')}</div>${button('g3a-next',b('Collect and sort','모아서 나누기'))}`;
      else if(stage===1) html+=`<p>${esc(t(q))}</p><div class="g3a-bins">${names.map((x,i)=>`<button data-g3a-bin="${i}" aria-pressed="${slot===i}">${esc(t(x))}${slot===i?' ✓':''} (${bins[i].length})</button>`).join('')}</div><p>${esc(t(k?b('Tap a box, then a picture.','칸을 누르고 그림을 눌러요.'):b('Tap a box, then a note. Tap a selected note to remove it.','칸을 고르고 기록을 눌러요. 고른 기록을 다시 누르면 빼요.')))}</p><div class="g3a-collection">${notes.map((x,i)=>`<button data-g3a-collect="${i}" aria-pressed="${bins.some(a=>a.includes(i))}">${esc(noteText(i))}${bins[0].includes(i)?' [1]':bins[1].includes(i)?' [2]':''}</button>`).join('')}</div>${button('g3a-next',b('Share my board','정리판으로 알려 주기'))}`;
      else html+=`<p>${esc(t(q))}</p><div class="g3a-summary">${names.map((x,i)=>`<div><strong>${esc(t(x))}</strong><p>${bins[i].map(n=>esc(noteText(n))).join('<br>')||esc(t(b('No cards yet','아직 카드가 없어요')))}</p></div>`).join('')}</div><p>${esc(t(k?b('Tell someone what you found.','알아낸 것을 말해 봐요.'):b('Tell someone your question and what these notes show. This activity is not a mastery score.','질문과 기록에서 알아낸 것을 직접 말해 봐요. 이 활동은 실력 점수가 아니에요.')))}</p>${button('g3a-hear',b('🔊 Hear my board','🔊 정리판 듣기'))}${button('g3a-edit',b('Change my board','정리판 고치기'))}`;
      frame(b('Our investigation · no score','우리 조사 · 점수 없음'),html+button('g3a-exit',b('Finish · discard cards','마치기 · 카드 지우기')));
      $$('[data-g3a-q]').forEach(e=>e.onclick=()=>{question=Number(e.dataset.g3aQ);updateNotes();speak(pool[question][1]);render();});
      $$('[data-g3a-bin]').forEach(e=>e.onclick=()=>{slot=Number(e.dataset.g3aBin);render();});
      $$('[data-g3a-collect]').forEach(e=>e.onclick=()=>{const n=Number(e.dataset.g3aCollect),was=bins[slot].includes(n);bins=bins.map(a=>a.filter(x=>x!==n));if(!was)bins[slot].push(n);speak(notes[n]);render();});
      if($('#g3a-next'))$('#g3a-next').onclick=()=>{stage++;render();};
      if($('#g3a-edit'))$('#g3a-edit').onclick=()=>{stage=1;render();};
      if($('#g3a-hear'))$('#g3a-hear').onclick=()=>speak(b(`${t(q)} ${bins[0].map(n=>t(notes[n])).join(' ')}`,`${t(q)} ${bins[0].map(n=>t(notes[n])).join(' ')}`));
      $('#g3a-exit').onclick=()=>{bins=[[],[]];entry(game);};
    }
    render();
  }
  function menuButton(game) {
    if(DIAG.active||SESSION.review)return;
    const el=document.createElement('button');el.className='g3a-menu';el.textContent=t(b('Topics / investigate','주제 / 함께 조사'));el.onclick=()=>{window.LearnLog.leave();state.get(game.id).practice=false;entry(game);};$('.g3a-material').prepend(el);
  }
  function makeItem(game) {
    if(game.grade==='K') {
      const k=makeK(lvl(game.id));
      return {ask:k.ask,show:k.show,opts:k.opts,after:k.after,cls:'g3a-options g3k-options',onRender(){bindNotes(k.notes);kReadChoices();menuButton(game);}};
    }
    const g=game.grade,bank=banks[g],r=pick(bank),index=bank.indexOf(r),level=lvl(game.id);
    let notes,ask,opts,after,names=labels;
    if(level===1) {
      // Separate grade banks: grade 1 club report (plain note numbers keep the material short); grade 2 interviewer notes.
      const prefix=b('Invented interview','가상 인터뷰');
      notes=[r[2],r[3],r[4]];
      ask=b(`Which note helps us learn about ${r[1].en}?`,`${r[1].ko} 조사에 쓸 기록은?`);
      opts=labels.map((x,i)=>({html:esc(t(x)),ok:i===0,category:'record'}));
      after=b('This note is about our question.','이 기록은 조사 질문과 관련 있어요.');
      if(g==='2')names=labels.map(x=>b(`${prefix.en} · ${x.en}`,`${prefix.ko} · ${x.ko}`));
    } else {
      const kind=index%3;
      const a=kind===0?b(`Monday: ${index+2} ${r[5].en}.`,`월요일: ${r[5].ko} ${index+2}개.`):kind===1?b(`${r[5].en}: red on Monday.`,`${r[5].ko}: 월요일에는 빨간색.`):b(`${r[5].en}: small on Monday.`,`${r[5].ko}: 월요일에는 작았어요.`);
      const z=kind===0?b(`Friday: ${index+5} ${r[5].en}.`,`금요일: ${r[5].ko} ${index+5}개.`):kind===1?b(`${r[5].en}: blue on Friday.`,`${r[5].ko}: 금요일에는 파란색.`):b(`${r[5].en}: large on Friday.`,`${r[5].ko}: 금요일에는 컸어요.`);
      notes=[a,z];names=[b('A · observation','A · 관찰'),b('B · observation','B · 관찰')];
      ask=b('Which question can both records answer?','두 기록으로 답할 수 있는 질문은?');
      opts=attrs.map((x,i)=>({html:esc(t(x)),ok:i===kind,category:'question'}));
      after=b('Both records describe the same feature on different days.','두 기록은 서로 다른 날의 같은 특징을 알려 줘요.');
      if(g==='2') {
        // Two distinct source types must be combined to answer a question about both days.
        names=[b('A · class note','A · 학급 기록'),b('B · invented interview','B · 가상 인터뷰')];
        const extra=b('We put tools away.','도구를 치웠어요.'), swap=rnd(2)===1;
        const first=swap?extra:a,second=swap?a:extra;
        notes=[b(`1. ${first.en} 2. ${second.en}`,`1. ${first.ko} 2. ${second.ko}`),b(`1. ${z.en}`,`1. ${z.ko}`)];
        ask=b(`Which pair shows how the ${['number','color','size'][kind]} changed?`,`${['수가','색이','크기가'][kind]} 어떻게 달라졌는지 보여 주는 짝은?`);
        opts=['A1 + B1','A2 + B1','A1 + A2'].map((x,i)=>({html:x,ok:i===(swap?1:0),category:'source-pair'}));
        after=b('The two day records give the same feature for both days.','두 날짜의 기록에 같은 특징이 나와요.');
      }
    }
    // Shuffle source positions for L1 while preserving visible note labels and answer key.
    if(level===1) {
      const order=shuffle([0,1,2]);notes=order.map(i=>notes[i]);
      opts=labels.map((x,i)=>({html:esc(t(x)),ok:order[i]===0,category:'record'}));
    }
    return {ask,show:`<div class="g3a-material"><small>${esc(t(b('Invented records','가상 기록')))}</small>${cards(notes,names)}</div>`,opts,after,cls:'g3a-options',onRender(){
      bindNotes(notes);menuButton(game);
    }};
  }
  for(const grade of ['K','1','2']) {
    const id=`askfind${grade}`;state.set(id,{topic:0,practice:false});
    registerGame({id,grade,roundMenu:true,subject:'read',icon:'🔎',title:b('Ask, Find, Share','질문하고 찾아서 알려요'),sub:b('Records and evidence','기록과 근거'),area:b('Inquiry and evidence','탐구와 근거'),rounds:10,
      play(){if(!DIAG.active&&!SESSION.review&&!SESSION.mix&&!state.get(id).practice)return entry(this);quiz(this,makeItem(this));}});
  }
})();
