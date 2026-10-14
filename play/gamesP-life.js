(() => {
  'use strict';
  const {art,scene,position,person,svg,face,register,task,names}=PK;
  const banks=fn=>[1,2].map(lv=>Array.from({length:24},(_,i)=>fn(lv,i)));
  // Roles are introduced by their pictured action, never by uniform or gender.
  register('helpersP','ss','People who help','도와주는 사람','CD-SS2',banks((lv,i)=>{
    const deliver=lv===2&&i%2===0,object=deliver?'box':'book',foil=['ball','flower','hat','cup','cat','fish'][Math.floor(i/2)%6];
    return task(deliver?'The delivery helper brings this parcel. Find the person with the parcel.':'The librarian reads this book with us. Find the person reading the book.',deliver?'배달하는 분이 이 소포를 가져다줘요. 소포를 든 사람을 찾아요.':'사서가 이 책을 읽어 줘요. 책을 읽어 주는 사람을 찾아요.',art(object),scene([person('happy',i%3),art(object)]),scene([person('happy',i%3),art(foil)]));
  }));
  const playthings=['ball','book','box','hat','cup','bear','cat','fish','duck','boat','frog','sock'];
  register('routineP','ss','What happens next?','다음에는 무엇','CD-SS5',banks((lv,i)=>{
    const object=playthings[i%12];
    if(lv===1)return task(`In this story, we wash our hands, then eat an apple. What is next after washing?`,`이 이야기에서는 손을 씻고 사과를 먹어요. 손을 씻은 다음은 무엇일까요?`,scene([art('soap'),art('apple')]),art('apple'),art(object==='apple'?'ball':object),{pkSound:true});
    return task(`In this story, we play with the ${names[object].en} picture card, then put the card away. What comes next after playing?`,`이 이야기에서는 ${names[object].ko} 그림 카드로 놀고 정리해요. 놀이 다음에는 무엇을 하나요?`,scene([art(object),position('inside',object)]),position('inside',object),position('outside',object),{pkSound:true});
  }));
  register('feelingP','life','Listen to a feeling','마음을 들어요','SED2',banks((lv,i)=>{
    const emotions=lv===1?['happy','sad']:['happy','sad','angry'],a=emotions[i%emotions.length],b=emotions[(i+1+Math.floor(i/emotions.length)% (emotions.length-1))%emotions.length],words={happy:'기뻐요',sad:'슬퍼요',angry:'화나요'},tone=Math.floor(i/emotions.length)%3;
    const object=['ball','book','flower','hat','boat','bear'][Math.floor(i/emotions.length)%6];
    return task(`This pretend person is looking at a ${names[object].en} and says, "I feel ${a}." Find their picture. You may feel differently.`,`그림 속 사람이 ${names[object].ko} 그림을 보고 "${words[a]}"라고 말해요. 그 그림을 찾아요. 내 마음은 달라도 괜찮아요.`,scene([art(object),person(a,tone)]),person(a,tone),person(b,tone),{pkSound:true});
  }));
  function turnPicture(which,object) { return `<div class="pk-turn"><div>${person('happy',0)}${which===0?art(object):''}</div><div>${person('happy',2)}${which===1?art(object):''}</div></div>`; }
  register('turnP','life','Take turns','차례차례 놀아요','SED5 · APL5',banks((lv,i)=>{
    const first=i%2,object=playthings[Math.floor(i/2)%12],next=1-first;
    return task('These two friends take turns. The friend holding the toy just played. Find whose turn comes next.','두 친구가 번갈아 놀아요. 장난감을 든 친구가 방금 놀았어요. 다음 차례를 찾아요.',lv===1?turnPicture(first,object):scene([turnPicture(next,object),turnPicture(first,object)]),turnPicture(next,object),turnPicture(first,object),{pkSound:true});
  }));
  function helpScene(object,tone,ask) { return scene([position('above',object),person('happy',tone),ask?svg('<path d="M14 15h88v45H68L49 79V60H14z" fill="#b7dce7" stroke="#436cb5" stroke-width="2"/><text x="60" y="49" text-anchor="middle" font-size="26">?</text>'):art('chair')]); }
  register('helpP','life','Ask for help','도움을 부탁해요','SED4',banks((lv,i)=>{
    const object=playthings[i%12],tone=Math.floor(i/4)%3;
    const locked=scene([art('box'),art('key')]);
    return task(lv===1?'The toy is high up. This is the grown-up caring for you. Ask them for help instead of climbing.':'The box is locked. This is the grown-up caring for you. Ask them for help.',lv===1?'장난감이 높은 곳에 있어요. 나를 돌보는 어른이에요. 올라가지 말고 도움을 부탁해요.':'상자가 잠겨 있어요. 나를 돌보는 어른이에요. 도움을 부탁해요.',lv===1?scene([position('above',object),person('happy',tone)]):scene([art(object),locked,person('happy',tone)]),lv===1?helpScene(object,tone,true):scene([art(object),person('happy',tone),art('key')]),lv===1?helpScene(object,tone,false):scene([art(object),art('box'),art('chair')]),{pkSound:true});
  }));
  register('washP','life','Wash our hands','손을 씻어요','PDM1',banks((lv,i)=>{
    const tools=lv===1?['soap','water']:['water','towel'],k=tools[i%2],foil=playthings[Math.floor(i/2)%12];
    const prompts={soap:B('We use soap to wash hands. Find soap.','손을 씻을 때 비누를 써요. 비누를 찾아요.'),water:B('We rinse hands with clean running water. Find water.','깨끗한 흐르는 물로 손을 헹궈요. 물을 찾아요.'),towel:B('After rinsing, use a clean towel to dry hands. Find the towel.','헹군 다음 깨끗한 수건으로 손을 말려요. 수건을 찾아요.')};
    return task(prompts[k].en,prompts[k].ko,scene([person('happy',i%3),art(k)]),art(k),art(foil));
  }));
  const poses=['wave','stretch','up','down','wide','shoulders','lap','clap','heart','head','oneUp','oneOut'];
  register('moveP','life','Copy a movement','몸으로 흉내 내요','PDM3 · PDM5 · CD-CR1 · APL4',banks((lv,i)=>task('Choose a gentle arm pose. Copy it with a grown-up, sitting or standing. Check your space. You can skip.','가볍게 팔을 움직이는 모습을 골라 어른과 따라 해요. 앉아도 서도 돼요. 주변을 살피고 건너뛰어도 돼요.','',person('happy',i%3,poses[i%12]),person('happy',i%3,poses[(i+(lv===1?1:5)+Math.floor(i/12))%12]))),{open:true});
})();
