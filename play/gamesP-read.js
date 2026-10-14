(() => {
  'use strict';
  const {art,scene,position,person,svg,register,task,names}=PK;
  const objects=['ball','cup','book','box','flower','tree','cat','fish','hat','house','apple','chair'];
  const banks=fn=>[1,2].map(lv=>Array.from({length:24},(_,i)=>fn(lv,i)));
  const sound={pkSound:true};
  register('listenP','read','Listen and find','듣고 찾아요','CLL1 · CLL2',banks((lv,i)=>{
    const k=objects[i%12],other=objects[(i+1+Math.floor(i/12))%12];
    if(lv===1)return task(`Find the ${names[k].en}.`,`${names[k].ko} 그림을 찾아요.`,art(k),art(k),art(other),sound);
    const inside=i%2===0;
    return task(`Move the ${names[k].en} picture ${inside?'inside':'outside'} the box picture.`,`${names[k].ko} 그림을 상자 그림 ${inside?'안':'밖'}에 놓아요.`,scene([art(k),position(inside?'inside':'outside',k)]),position(inside?'inside':'outside',k),position(inside?'outside':'inside',k),sound);
  }));
  register('actionP','read','Follow one direction','부탁대로 해요','CLL1 · CLL3',banks((lv,i)=>{
    const k=objects[i%12],where=lv===1?(i%2?'inside':'outside'):(i%2?'above':'below'),foil={inside:'outside',outside:'inside',above:'below',below:'above'}[where],loc={inside:'안',outside:'밖',above:'위',below:'아래'};
    return task(`Move the ${names[k].en} picture ${where} the box picture.`,`${names[k].ko} 그림을 상자 그림 ${loc[where]}에 놓아요.`,position(where,k),position(where,k),position(foil,k),sound);
  }));
  function opposite(k,state) {
    if(k==='door')return svg(`<rect x="30" y="10" width="55" height="80" fill="#eee" stroke="#684b38" stroke-width="4"/>${state?'<path d="M30 10l32 17v63L30 90z" fill="#c99e6c"/>':'<rect x="30" y="10" width="55" height="80" fill="#c99e6c"/><circle cx="74" cy="53" r="4"/>'}`);
    if(k==='box')return svg(`<rect x="28" y="40" width="65" height="45" fill="#c99e6c"/>${state?'<path d="M28 40L13 20h80l15 20" stroke="#684b38" stroke-width="5" fill="none"/>':'<path d="M24 40h73" stroke="#684b38" stroke-width="10"/>'}`);
    if(k==='book')return state?art('book'):svg('<rect x="26" y="12" width="68" height="80" fill="#edc46c" stroke="#684b38" stroke-width="3"/><path d="M35 12v80" stroke="#684b38" stroke-width="3"/>');
    if(k==='curtain')return svg(`<rect x="20" y="10" width="80" height="80" fill="#cbe5ed" stroke="#684b38" stroke-width="3"/><path d="M60 10v80m-40-40h80" stroke="#684b38" stroke-width="3"/><path d="M20 10h${state?20:40}v80H20zM100 10h-${state?20:40}v80h${state?20:40}z" fill="#8254a5"/>`);
    if(k==='jar')return svg(`<rect x="35" y="30" width="50" height="60" rx="8" fill="#b7dce7" stroke="#436cb5" stroke-width="3"/><rect x="${state?78:32}" y="${state?10:23}" width="56" height="10" rx="3" fill="#8254a5"/>`, '',state?150:120,100);
    if(k==='window')return svg(`<rect x="18" y="10" width="84" height="80" fill="#b7dce7" stroke="#684b38" stroke-width="4"/>${state?'<path d="M18 10l30 15v55L18 90M102 10L72 25v55l30 10" fill="#fff" stroke="#684b38" stroke-width="3"/>':'<path d="M60 10v80m-42-40h84" stroke="#684b38" stroke-width="4"/>'}`);
    const body=art(k).replace(/^.*?<svg[^>]*>|<\/svg>$/g,'');
    return svg(body+(state?'<path d="M38 32q-12 16 0 16q12 0 0-16M67 48q-12 16 0 16q12 0 0-16M85 20q-12 16 0 16q12 0 0-16" fill="#579dcc" stroke="#fff" stroke-width="1"/>':''),L(B(state?'wet '+names[k].en:'dry '+names[k].en,state?'물방울이 맺힌 그림':'마른 그림')));
  }
  register('oppositeP','read','Opposite partners','반대 짝꿍','CLL2',banks((lv,i)=>{
    const kinds=lv===1?['door','box','book','curtain','jar','window']:['towel','rock','leaf','cup','book','sock'],k=kinds[i%kinds.length],state=Math.floor(i/kinds.length)%2;
    return task(lv===1?`This picture is ${state?'open':'closed'}. Find the ${state?'closed':'open'} picture.`:`This picture is ${state?'wet':'dry'}. Find the ${state?'dry':'wet'} picture.`,lv===1?`이 그림은 ${state?'열려':'닫혀'} 있어요. ${state?'닫힌':'열린'} 그림을 찾아요.`:`이 그림은 ${state?'물방울이 맺혀':'말라'} 있어요. ${state?'마른':'물방울이 맺힌'} 그림을 찾아요.`,opposite(k,state),opposite(k,!state),opposite(k,state));
  }));
  register('storyP','read','A little picture story','작은 그림 이야기','CLL6',banks((lv,i)=>{
    const animals=['cat','dog','bear','duck'],a=animals[i%4],obj=['ball','book','flower','hat','cup','apple'][Math.floor(i/4)],other=objects[(objects.indexOf(obj)+3)%12];
    return task(`The ${names[a].en} found a ${names[obj].en}. Find what the ${names[a].en} found.`,`${names[a].ko} 그림이 ${names[obj].ko} 그림을 찾았어요. 무엇을 찾았나요?`,scene(lv===1?[art(a),art(obj)]:[scene([art(a),art('house')]),scene([art(a),art(obj)])]),art(obj),art(other),sound);
  }));
  const rhymes=[['cat','hat','dog'],['dog','log','cat'],['frog','log','bee'],['boat','goat','fish'],['mouse','house','duck'],['bee','tree','cat'],['hat','cat','boat'],['log','frog','hat'],['goat','boat','dog'],['house','mouse','fish'],['tree','bee','hat'],['bear','chair','frog']];
  register('rhymeP','read','Sound partners','소리 짝꿍','CLL7',banks((lv,i)=>{
    const [a,b,c]=rhymes[i%12];
    return task('Listen to the English words. Find the sound partner.','영어 낱말을 듣고 끝소리가 비슷한 짝을 찾아요.',lv===1?scene([art(a),art(b)]):art(a),art(b),art(c),{...sound,askExtra:{t:`${a}. ${lv===1?a+'. '+b+'. ':''}${b}. ${c}.`,lang:'en-US'},pkChoices:[B(b,b),B(c,c)],pkChoiceLang:'en-US'});
  }));
  register('letterP','read','Letter picture match','글자 그림 찾기','CLL8',banks((lv,i)=>{
    const alphabet=lv===1?'AMSOTXHILUVW':'BPDRNMFECOGQ',a=alphabet[i%12],b=alphabet[(i+1+Math.floor(i/12))%12],letter=(s,size)=>svg(`<text x="60" y="75" text-anchor="middle" font-family="Arial,sans-serif" font-weight="bold" font-size="${size}">${s}</text>`,s);
    return task('Find the same letter picture.','같은 글자 그림을 찾아요.',letter(a,65),letter(a,70),letter(b,70));
  }));
  register('stampP','write','Tell with pictures','그림으로 전해요','CLL10 · CD-CR2',banks((lv,i)=>task(lv===1?'Pick a picture. Tell a grown-up about it.':'Pick two pictures. Tell a grown-up your picture story.',lv===1?'그림을 골라 어른에게 이야기해요.':'그림 두 개를 골라 어른에게 이야기해요.','',art(objects[i%12]),art(objects[(i+1+Math.floor(i/12))%12]))),{open:true});
})();
