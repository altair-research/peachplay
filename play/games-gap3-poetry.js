(() => {
  'use strict';
  // Original mini-poems. English sound targets are never translated.
  const B = (en, ko) => ({en, ko});
  const pairs = [
    ['A snail on a trail.','A seed in a pail.','A hen by the gate.','trail','pail','seed','snail'],
    ['A goat in a coat.','A duck by a boat.','A pup in the rain.','coat','boat','duck','goat'],
    ['A bug on a rug.','A hen by a mug.','A fox by the wall.','rug','mug','hen','bug'],
    ['A kite in the light.','A star in the night.','A cat on a chair.','light','night','star','kite'],
    ['A bear in the snow.','A seed starts to grow.','A fish in a pool.','snow','grow','seed','bear'],
    ['A bird in the rain.','A pup by a train.','A bee in a tree.','rain','train','pup','bird'],
    ['A bee in a tree.','A bug flies by me.','A dog by a log.','tree','me','bug','bee'],
    ['A cat on a mat.','A frog by a hat.','A snail on a leaf.','mat','hat','frog','cat'],
    ['A dog by a log.','A duck in the fog.','A hen by a nest.','log','fog','duck','dog'],
    ['A mouse in a house.','A hat on a mouse.','A kite by the lake.','house','mouse','hat','house'],
    ['A hen with a bell.','A crab by a shell.','A bird on a branch.','bell','shell','crab','hen'],
    ['A fox by a lake.','A pup with a cake.','A bug on a leaf.','lake','cake','pup','fox']
  ];
  const repeats = [
    'Little leaves fall.','We tap our toes.','Clouds drift by.','I wave hello.',
    'Soft seeds settle.','We hum at home.','The rain taps down.','My boat rocks slowly.',
    'Small stars shine.','We walk together.','A bird sings softly.','I clap my hands.'
  ];
  const starts = [
    ['Busy bees buzz.','Blue birds bob.','b'],['Tiny turtles tiptoe.','Tall trees turn.','t'],
    ['Soft seeds settle.','Small snails slide.','s'],['Little leaves leap.','Long logs lie.','l'],
    ['Merry mice march.','Mini moths move.','m'],['Pink pigs play.','Plump pups pause.','p'],
    ['Funny foxes flop.','Five frogs float.','f'],['Dancing ducks dip.','Damp dogs dig.','d'],
    ['Red rabbits run.','Round rocks roll.','r'],['Happy hens hop.','Huge horses hide.','h'],
    ['Wet worms wiggle.','White waves wash.','w'],['Kind cats curl.','Cool cubs climb.','k']
  ];
  const askRhyme = B('Which pair sounds alike at the end?','끝소리가 같은 짝은 무엇일까요?');
  const linePairs = ['① + ②','① + ③','② + ③'];
  const pairIndices = [[0,1],[0,2],[1,2]];
  const only = [B('A alone','A만'),B('B alone','B만'),B('A and B','A와 B')];
  const meanings = [
    ['길 위의 달팽이.','양동이 속 씨앗.','문 옆의 암탉.'],['외투를 입은 염소.','배 옆의 오리.','빗속의 강아지.'],
    ['깔개 위의 벌레.','컵 옆의 암탉.','벽 옆의 여우.'],['빛 속의 연.','밤의 별.','의자 위의 고양이.'],
    ['눈 속의 곰.','자라기 시작하는 씨앗.','물웅덩이 속 물고기.'],['빗속의 새.','기차 옆의 강아지.','나무 속의 벌.'],
    ['나무 속의 벌.','내 옆을 나는 벌레.','통나무 옆의 개.'],['매트 위의 고양이.','모자 옆의 개구리.','잎 위의 달팽이.'],
    ['통나무 옆의 개.','안개 속의 오리.','둥지 옆의 암탉.'],['집 안의 생쥐.','생쥐 위의 모자.','호수 옆의 연.'],
    ['방울을 가진 암탉.','조개껍데기 옆의 게.','나뭇가지 위의 새.'],['호수 옆의 여우.','케이크를 가진 강아지.','잎 위의 벌레.']
  ];
  const glossary=new Map();
  pairs.forEach((p,n)=>p.slice(0,3).forEach((line,i)=>glossary.set(line,meanings[n][i])));
  const repeatMeanings=['작은 잎들이 떨어져요.','발끝을 톡톡 두드려요.','구름이 흘러가요.','손을 흔들어 인사해요.','보드라운 씨앗이 내려앉아요.','집에서 흥얼거려요.','비가 톡톡 내려요.','내 배가 천천히 흔들려요.','작은 별들이 빛나요.','함께 걸어요.','새가 부드럽게 노래해요.','손뼉을 쳐요.'];
  repeats.forEach((line,i)=>{glossary.set(line,repeatMeanings[i]);glossary.set(line.replace(/\.$/,'')+' with me.',repeatMeanings[i]+' 나와 함께요.');});
  const startMeanings=[['바쁜 벌들이 윙윙거려요.','파란 새들이 까딱거려요.'],['작은 거북들이 살금살금 걸어요.','키 큰 나무들이 돌아요.'],['보드라운 씨앗이 내려앉아요.','작은 달팽이들이 미끄러져요.'],['작은 잎들이 뛰어요.','긴 통나무들이 누워 있어요.'],['즐거운 생쥐들이 행진해요.','작은 나방들이 움직여요.'],['분홍 돼지들이 놀아요.','통통한 강아지들이 잠깐 멈춰요.'],['재미있는 여우들이 털썩 누워요.','개구리 다섯이 떠 있어요.'],['춤추는 오리들이 몸을 담가요.','젖은 개들이 땅을 파요.'],['붉은 토끼들이 달려요.','둥근 돌들이 굴러요.'],['즐거운 암탉들이 뛰어요.','커다란 말들이 숨어요.'],['젖은 벌레들이 꿈틀거려요.','하얀 파도가 밀려와요.'],['착한 고양이들이 몸을 웅크려요.','멋진 새끼 곰들이 기어올라요.']];
  starts.forEach((p,n)=>p.slice(0,2).forEach((line,i)=>glossary.set(line,startMeanings[n][i])));
  const escape = text => String(text).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  function poem(lines, label = '') {
    return `<section class="g3p-poem" lang="en">${label?`<b>${label}</b>`:''}${lines.map((line,i)=>`<div class="g3p-line"><button class="g3p-gloss" data-g3p-meaning="${escape(line)}" aria-label="${escape(line)} — ${L(B('Meaning','뜻'))}">${lines.length===3?['①','②','③'][i]+' ':''}${escape(line)}</button><button class="g3p-hear" data-g3p-say="${escape(line)}" aria-label="${L(B('Hear line','행 듣기'))} ${i+1}">🔊</button></div>`).join('')}</section>`;
  }
  function bindSpeech() {
    $$('[data-g3p-say]').forEach(b => b.onclick = () => say(b.dataset.g3pSay,'en-US'));
    $$('[data-g3p-meaning]').forEach(b=>b.onclick=()=>{
      const line=b.dataset.g3pMeaning,d=document.createElement('dialog');d.className='g3p-dialog';
      d.innerHTML=`<p lang="en">${escape(line)}</p><p lang="ko">${escape(glossary.get(line)||'')}</p><button class="g3p-button">${L(B('Back','돌아가기'))}</button>`;
      view().append(d);d.querySelector('button').onclick=()=>d.close();d.onclose=()=>{d.remove();b.focus();};d.showModal();
    });
  }
  function build(grade, level, n) {
    const p = pairs[n], r = repeats[n];
    if (grade==='K' && level===2) {
      // Rotate the unrelated ending through all three positions.
      const lines=[p[0],p[1]]; lines.splice(n%3,0,p[2]);
      const right=pairIndices.findIndex(indices=>indices.every(i=>i!==n%3));
      return {lines,ask:B('Which two line endings sound alike?','끝소리가 같은 두 행은 무엇일까요?'),choices:linePairs,right,
        after:B('Listen to the last word of each line.','각 행의 마지막 낱말 소리를 들어요.')};
    }
    if (grade==='1' && level===2) {
      const rhyme=[p[0],p[1]], repeated=[r,r], partial=[r,r.replace(/\.$/,'')+' with me.'];
      // A-only, B-only, both: whole-line repetition vs partial words / rhyme / initial sounds.
      const other=n%2?rhyme:partial, a=n%3===1?other:repeated, b=n%3===0?other:n%3===2?[repeats[(n+1)%12],repeats[(n+1)%12]]:repeated;
      return {poems:[a,b],lines:[...a,...b],ask:B('Which poem repeats a whole line?','행 전체를 되풀이한 시는 무엇일까요?'),choices:only.map(L),right:n%3,
        after:B('A repeated line uses the same words again.','반복행은 같은 행을 다시 써요.')};
    }
    if (grade==='1' && n%3===1) {
      return {lines:[r,r],ask:B('What repeats in this poem?','이 시에서 무엇이 되풀이될까요?'),
        choices:[L(B('A whole line','행 전체')),L(B('Just the first word','첫 낱말만')),L(B('Just the last word','끝 낱말만'))],right:0,
        after:B('The same whole line comes again.','같은 행 전체가 다시 나와요.')};
    }
    if (grade==='1' && n%3===2) {
      const s=starts[n], words=s[0].replace(/\.$/,'').split(' ');
      return {lines:s.slice(0,2),ask:B('Which pair starts with the same sound?','첫소리가 같은 짝은 무엇일까요?'),
        choices:[`${words[0]} – ${words[1]}`,`${words[0]} – owl`,`${words[1]} – egg`],choiceLang:'en-US',right:0,
        after:B('These words start with the same sound.','이 낱말들은 같은 소리로 시작해요.')};
    }
    return {lines:p.slice(0,2),ask:askRhyme,choices:[`${p[3]} – ${p[4]}`,`${p[6]} – ${p[5]}`,`${p[5]} – ${p[4]}`],right:0,
      after:B('The last words have matching ending sounds.','마지막 낱말들의 끝소리가 같아요.')};
  }
  function maker(game) {
    // Clear the pending practice item; no scoring/logging/adaptive calls below.
    window.LearnLog.finish(); NEXT_TOK++;
    let topic=-1, slot=0, chosen=[null,null], history=[], done=false;
    const level=lvl(game.id), topics=[['🌱','Garden','정원'],['☁️','Sky','하늘'],['🐾','Animals','동물']];
    const cards=[['A seed in the sun.','We grow one by one.','Soft leaves sway.'],['A cloud floats high.','A bird sails by.','Blue fills the sky.'],['A pup on a mat.','A small sleepy cat.','Tiny paws tap.']];
    const endings=[['rain','shade'],['night','light'],['rug','log']];
    const snapshot=()=>history.push({chosen:chosen.slice(),slot});
    const draw=()=>{
      view().innerHTML=`<div class="g3p-maker"><div class="g3p-instruction">${L(B('Make a poem together — no scores.','함께 시를 만들어요 — 점수는 없어요.'))}</div><button class="g3p-button" id="g3p-guide">🔊 ${L(B('Help','안내'))}</button>${topic<0?
        `<p>${L(B('Choose a picture.','그림을 골라요.'))}</p><div class="g3p-topics">${topics.map((t,i)=>`<button class="g3p-button" data-topic="${i}">${t[0]} ${L(B(t[1],t[2]))}</button>`).join('')}</div>`:
        `<div class="g3p-slots">${chosen.map((line,i)=>`<button class="g3p-button" data-slot="${i}" aria-pressed="${slot===i}">${i+1}. ${escape(line||L(B('Tap a line card','행 카드를 눌러요')))}</button>`).join('')}</div><div class="g3p-cards">${cards[topic].map((line,i)=>`<button class="g3p-button" data-card="${i}" lang="en">${line}</button>`).join('')}</div>${level===2?`<div class="g3p-tools"><button class="g3p-button" id="g3p-swap">${L(B('Swap lines','행 바꾸기'))}</button><button class="g3p-button" id="g3p-repeat">${L(B('Repeat line','행 반복'))}</button>${endings[topic].map(w=>`<button class="g3p-button" data-end="${w}">${w}</button>`).join('')}</div>`:''}<div class="g3p-tools"><button class="g3p-button" id="g3p-undo">↶ ${L(B('Undo','되돌리기'))}</button><button class="g3p-button" id="g3p-listen">🔊 ${L(B('My poem','내 시'))}</button><button class="g3p-button" id="g3p-done">${L(B('Done','완료'))}</button></div>`}
        <div class="g3p-status" role="status">${done?L(B('Activity tried! Share your poem aloud.','활동했어요! 시를 직접 들려줘요.')):L(B('Silent? Ask an adult to read. Rhymes are optional.','무음이면 어른이 읽어 주세요. 운이 없어도 괜찮아요.'))}</div><button class="g3p-button" id="g3p-back">${L(B('Practice','연습으로'))}</button></div>`;
      $('#g3p-guide').onclick=()=>say(L(B('Choose a picture, tap a line space, then choose a line. Say your own poem to an adult too.','그림과 행 칸을 누른 뒤 행 카드를 골라요. 내 말로 만든 시도 어른에게 들려줘요.')));
      $('#g3p-back').onclick=()=>launch(game);
      $$('[data-topic]').forEach(b=>b.onclick=()=>{topic=+b.dataset.topic;draw();});
      $$('[data-slot]').forEach(b=>b.onclick=()=>{slot=+b.dataset.slot;draw();});
      $$('[data-card]').forEach(b=>b.onclick=()=>{snapshot();chosen[slot]=cards[topic][+b.dataset.card];say(chosen[slot],'en-US');slot=1-slot;done=false;draw();});
      if(topic<0)return;
      $('#g3p-undo').disabled=!history.length;
      $('#g3p-undo').onclick=()=>{const h=history.pop();if(h){chosen=h.chosen;slot=h.slot;done=false;draw();}};
      $('#g3p-listen').onclick=()=>chosen.filter(Boolean).forEach((line,i)=>say(line,'en-US',i>0));
      $('#g3p-done').disabled=chosen.some(x=>!x);
      $('#g3p-done').onclick=()=>{done=true;draw();};
      if(level===2){
        $('#g3p-swap').onclick=()=>{snapshot();chosen.reverse();done=false;draw();};
        $('#g3p-repeat').onclick=()=>{if(!chosen[slot])return;snapshot();chosen[1-slot]=chosen[slot];done=false;draw();};
        $$('[data-end]').forEach(b=>b.onclick=()=>{if(!chosen[slot])return;snapshot();chosen[slot]=chosen[slot].replace(/\S+\.$/,b.dataset.end+'.');done=false;draw();});
      }
    };draw();
  }
  for(const grade of ['K','1'])registerGame({
    id:grade==='K'?'poemK':'poem1',grade,subject:'read',icon:'🎶',rounds:10,
    title:B('Little Poems','짧은 시'),sub:B('Listen, notice, and make','듣고 찾고 만들어요'),
    area:B('Reading · Poetry','읽기 · 시'),
    play(){
      const item=build(grade,lvl(this.id),rnd(12)), game=this;
      const canMake=!DIAG.active&&!SESSION.review;
      quiz(this,{ask:item.ask,askExtra:{t:item.lines.join(' '),lang:'en-US'},
        show:`<div class="g3p-material">${item.poems?item.poems.map((lines,i)=>poem(lines,['A','B'][i])).join(''):poem(item.lines)}<div class="g3p-note">${L(B('Silent? An adult can read.','무음이면 어른이 읽어 주세요.'))}${canMake?` <button class="g3p-button" id="g3p-make">${L(B('Make','만들기'))}</button>`:''}</div></div>`,
        cls:'g3p-options',opts:item.choices.map((text,i)=>({html:`<span class="g3p-choice">${escape(text)}</span>`,ok:i===item.right,category:'poetry-choice'})),after:item.after,
        onRender(){bindSpeech();if($('#g3p-make'))$('#g3p-make').onclick=()=>maker(game);
          let reader=$('#spo');
          if(!reader){reader=document.createElement('button');reader.id='spo';reader.className='say';reader.textContent='🔉';reader.setAttribute('aria-label',L(B('Hear choices','보기 듣기')));$('#sp').after(reader);}
          reader.onclick=()=>$$('.g3p-choice').forEach((e,i)=>{
            const pair=linePairs.indexOf(e.textContent), text=grade==='K'&&lvl(game.id)===2&&pair>=0?L(B(`Lines ${pairIndices[pair][0]+1} and ${pairIndices[pair][1]+1}`,`${pairIndices[pair][0]+1}행과 ${pairIndices[pair][1]+1}행`)):e.textContent;
            say(text,item.choiceLang||(item.ask===askRhyme?'en-US':S.lang==='ko'?'ko-KR':'en-US'),i>0);
          });
        }});
    }
  });
})();
