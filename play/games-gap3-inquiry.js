(() => {
  'use strict';
  // All records below are invented learning materials, not reports of real observations.
  const b = (en, ko) => B(en, ko), t = x => L(x);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const topics = [b('Garden','텃밭'), b('Library','도서실'), b('Playground','놀이터')];
  // topic, research focus, three distinct same-setting notes, measured object.
  const records = [
    [0,b('planting','심기'),b('We planted beans.','콩을 심었어요.'),b('We read a story.','이야기를 읽었어요.'),b('We sang a song.','노래를 불렀어요.'),b('sprouts','새싹')],
    [0,b('watering','물 주기'),b('We filled the watering can.','물뿌리개를 채웠어요.'),b('We put away the spade.','모종삽을 치웠어요.'),b('We sat on the bench.','벤치에 앉았어요.'),b('watering cans','물뿌리개')],
    [0,b('garden tools','텃밭 도구'),b('We used a small rake.','작은 갈퀴를 썼어요.'),b('We saw a red leaf.','빨간 잎을 봤어요.'),b('We heard a bird.','새 소리를 들었어요.'),b('rakes','갈퀴')],
    [0,b('leaves','나뭇잎'),b('We picked up yellow leaves.','노란 잎을 주웠어요.'),b('We moved a flowerpot.','화분을 옮겼어요.'),b('We cleaned the path.','길을 청소했어요.'),b('leaves','나뭇잎')],
    [1,b('borrowing','책 빌리기'),b('We borrowed six books.','책 여섯 권을 빌렸어요.'),b('We fixed a chair.','의자를 고쳤어요.'),b('We painted the door.','문에 칠했어요.'),b('borrowed books','빌린 책')],
    [1,b('book covers','책 표지'),b('We saw green covers.','초록색 표지를 봤어요.'),b('We counted the chairs.','의자 수를 셌어요.'),b('We opened a window.','창문을 열었어요.'),b('book covers','책 표지')],
    [1,b('reading places','책 읽는 자리'),b('We read on the rug.','깔개 위에서 읽었어요.'),b('We returned a book.','책을 돌려줬어요.'),b('We mended a page.','책장을 고쳤어요.'),b('reading cushions','독서 방석')],
    [1,b('book care','책 돌보기'),b('We taped a torn page.','찢어진 책장에 테이프를 붙였어요.'),b('We listened to a story.','이야기를 들었어요.'),b('We counted the shelves.','책장 수를 셌어요.'),b('repaired books','고친 책')],
    [2,b('ball games','공놀이'),b('We rolled a ball.','공을 굴렸어요.'),b('We sat on a swing.','그네에 앉았어요.'),b('We climbed the steps.','계단을 올랐어요.'),b('balls','공')],
    [2,b('sand play','모래놀이'),b('We filled a bucket with sand.','양동이에 모래를 담았어요.'),b('We skipped on the path.','길에서 깡충 뛰었어요.'),b('We played on the slide.','미끄럼틀을 탔어요.'),b('sand buckets','모래 양동이')],
    [2,b('bike riding','자전거 타기'),b('We rode around the track.','자전거로 길을 돌았어요.'),b('We threw a beanbag.','콩주머니를 던졌어요.'),b('We played on the bars.','철봉에서 놀았어요.'),b('bikes','자전거')],
    [2,b('jumping','줄넘기'),b('We jumped over a rope.','줄을 넘었어요.'),b('We kicked a ball.','공을 찼어요.'),b('We built a sand hill.','모래 언덕을 쌓았어요.'),b('jump ropes','줄넘기 줄')]
  ];
  const state = new Map();
  const more = [b('Our seeds were brown.','우리가 심은 씨는 갈색이었어요.'),b('We poured water beside each plant.','식물 옆에 물을 부었어요.'),b('We carried a spade in a basket.','바구니에 모종삽을 넣어 날랐어요.'),b('We saw a leaf with five points.','끝이 다섯 군데로 뾰족한 잎을 봤어요.'),b('We used our library cards.','도서관 카드를 썼어요.'),b('One cover had a picture of a boat.','표지 하나에 배 그림이 있었어요.'),b('We read in the window seat.','창가 자리에 앉아 읽었어요.'),b('We kept our books dry.','책이 젖지 않게 했어요.'),b('We passed the ball to a friend.','친구에게 공을 건넸어요.'),b('We made a sand tower.','모래 탑을 만들었어요.'),b('We parked the bikes by the gate.','문 옆에 자전거를 세웠어요.'),b('We took turns with the rope.','번갈아 줄넘기를 했어요.')];
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
  const banks={K:records};
  for(const grade of ['1','2'])banks[grade]=bankRows[grade].map(r=>[r[0],b(r[1],r[2]),b(r[3],r[4]),b(r[5],r[6]),b(r[7],r[8]),b(r[9],r[10]),b(r[11],r[12])]);
  const labels = [b('Note 1','기록 1'),b('Note 2','기록 2'),b('Note 3','기록 3')];
  const attrs = [b('Did the number change?','수가 달라졌나요?'),b('Did the color change?','색이 달라졌나요?'),b('Did the size change?','크기가 달라졌나요?')];
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
    frame(b('What shall we explore?','무엇을 알아볼까요?'), `<p>${esc(t(b('Choose a topic. No points here.','주제를 골라요. 점수는 없어요.')))}</p><div class="g3a-topics">${topics.map((x,i)=>`<button type="button" data-g3a-topic="${i}" aria-pressed="${s.topic===i}">${esc(t(x))}${s.topic===i?' ✓':''}</button>`).join('')}</div><p>${esc(t(b('Invented records · Read with an adult when sound is off.','가상 기록 · 무음일 때는 어른과 함께 읽어요.')))}</p>${button('g3a-practice',b('Practice · 10 questions','연습 · 10문제'))}${button('g3a-open',b('Investigate together · no score','함께 조사 · 점수 없음'))}`);
    $$('[data-g3a-topic]').forEach(e=>e.onclick=()=>{s.topic=Number(e.dataset.g3aTopic);speak(topics[s.topic]);entry(game);});
    $('#g3a-practice').onclick=()=>{s.practice=true; SESSION.rounds=10;game.play();};
    $('#g3a-open').onclick=()=>investigate(game);
  }
  function investigate(game) {
    // No quiz, LearnLog, stat, save, completion or reward calls on this path.
    const s=state.get(game.id);s.practice=false;
    const pool=banks[game.grade].filter(r=>r[0]===s.topic);
    let question=0, stage=0, slot=0, bins=[[],[]];
    const names=[b('Helps my question','질문에 도움이 돼요'),b('Another topic','다른 주제예요')];
    let notes=[];
    const updateNotes=()=>{const r=pool[question];notes=[r[2],r[3],r[6]||more[records.indexOf(r)],r[4]];};
    updateNotes();
    const source=i=>game.grade==='2'?(i<2?b('A · class note','A · 학급 기록'):b('B · invented interview','B · 가상 인터뷰')):b('Class note','학급 기록');
    const noteText=i=>`${t(source(i))}: ${t(notes[i])}`;
    function render() {
      const q=b(`What can we find out about ${t(pool[question][1])}?`,`${t(pool[question][1])}에 대해 무엇을 알아볼까요?`);
      const help=game.grade==='K'?b('Ask an adult to help you make a question and tell what you found.','어른과 질문을 만들고 알아낸 것을 말해 봐요.'):b('Choose your question, sort the notes, then share in your own words.','질문을 고르고 기록을 나눈 뒤 내 말로 알려 줘요.');
      let html=`<p>${esc(t(help))}</p>`;
      if(stage===0) html+=`<p>${esc(t(b('Choose a question card; say your own question to someone too.','질문 카드를 골라요. 나만의 질문도 직접 말해 봐요.')))}</p><div class="g3a-choices">${pool.map((r,i)=>`<button data-g3a-q="${i}" aria-pressed="${question===i}">${esc(t(r[1]))}${question===i?' ✓':''}</button>`).join('')}</div>${button('g3a-next',b('Collect and sort','모아서 나누기'))}`;
      else if(stage===1) html+=`<p>${esc(t(q))}</p><div class="g3a-bins">${names.map((x,i)=>`<button data-g3a-bin="${i}" aria-pressed="${slot===i}">${esc(t(x))}${slot===i?' ✓':''} (${bins[i].length})</button>`).join('')}</div><p>${esc(t(b('Tap a box, then a note. Tap a selected note to remove it.','칸을 고르고 기록을 눌러요. 고른 기록을 다시 누르면 빼요.')))}</p><div class="g3a-collection">${notes.map((x,i)=>`<button data-g3a-collect="${i}" aria-pressed="${bins.some(a=>a.includes(i))}">${esc(noteText(i))}${bins[0].includes(i)?' [1]':bins[1].includes(i)?' [2]':''}</button>`).join('')}</div>${button('g3a-next',b('Share my board','정리판으로 알려 주기'))}`;
      else html+=`<p>${esc(t(q))}</p><div class="g3a-summary">${names.map((x,i)=>`<div><strong>${esc(t(x))}</strong><p>${bins[i].map(n=>esc(noteText(n))).join('<br>')||esc(t(b('No cards yet','아직 카드가 없어요')))}</p></div>`).join('')}</div><p>${esc(t(b('Tell someone your question and what these notes show. This activity is not a mastery score.','질문과 기록에서 알아낸 것을 직접 말해 봐요. 이 활동은 실력 점수가 아니에요.')))}</p>${button('g3a-hear',b('🔊 Hear my board','🔊 정리판 듣기'))}${button('g3a-edit',b('Change my board','정리판 고치기'))}`;
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
  function makeItem(game) {
    const g=game.grade,bank=banks[g],r=pick(bank),index=bank.indexOf(r),level=lvl(game.id);
    let notes,ask,opts,after,names=labels;
    if(level===1) {
      // Separate grade banks: K class observation; grade 1 club report; grade 2 interviewer notes.
      const prefix=g==='K'?b('Class record','학급 기록'):g==='1'?b('Club record','모임 기록'):b('Invented interview','가상 인터뷰');
      notes=[r[2],r[3],r[4]];
      ask=b(`Which note helps us learn about ${r[1].en}?`,`${r[1].ko} 조사에 쓸 기록은?`);
      opts=labels.map((x,i)=>({html:esc(t(x)),ok:i===0,category:'record'}));
      after=b('This note is about our question.','이 기록은 조사 질문과 관련 있어요.');
      names=labels.map(x=>b(`${prefix.en} · ${x.en}`,`${prefix.ko} · ${x.ko}`));
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
      bindNotes(notes);
      if(DIAG.active||SESSION.review)return;
      const el=document.createElement('button');el.className='g3a-menu';el.textContent=t(b('Topics / investigate','주제 / 함께 조사'));el.onclick=()=>{window.LearnLog.leave();state.get(game.id).practice=false;entry(game);};$('.g3a-material').prepend(el);
    }};
  }
  for(const grade of ['K','1','2']) {
    const id=`askfind${grade}`;state.set(id,{topic:0,practice:false});
    registerGame({id,grade,roundMenu:true,subject:'read',icon:'🔎',title:b('Ask, Find, Share','질문하고 찾아서 알려요'),sub:b('Records and evidence','기록과 근거'),area:b('Inquiry and evidence','탐구와 근거'),rounds:10,
      play(){if(!DIAG.active&&!SESSION.review&&!SESSION.mix&&!state.get(id).practice)return entry(this);quiz(this,makeItem(this));}});
  }
})();
