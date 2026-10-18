(() => {
  'use strict';
  const {art,shape,group,scene,position,svg,register,task}=PK;
  const banks=fn=>[1,2].map(lv=>Array.from({length:36},(_,i)=>fn(lv,i)));
  const objects=['ball','cup','book','box'];
  register('countP','math','Count together','하나씩 세어요','CD-MA1',banks((lv,i)=>{
    const max=lv===1?3:5,n=1+i%max,other=1+(n+i% (max-1))%max,k=objects[Math.floor(i/max)%4],a=Math.floor(i/(max*4))%2;
    return task('Tap each picture. Find the same amount.','그림을 하나씩 누르고 같은 만큼 찾아요.',group(n,k,a),group(n,k,1-a),group(other,k,1-a),{onRender(){ $$('.show .pk-picture').forEach(e=>{e.setAttribute('tabindex','0');e.setAttribute('role','button');const go=()=>{e.classList.add('pk-counted');say(L(B('One picture','그림 하나')));};e.onclick=go;e.onkeydown=x=>{if(x.key==='Enter'||x.key===' '){x.preventDefault();go();}};}); }});
  }));
  register('quantityP','math','Same amount','같은 양 찾기','CD-MA1',banks((lv,i)=>{
    const max=lv===1?3:5,n=1+i%max,m=1+(n+Math.floor(i/max)%(max-1))%max,k=objects[Math.floor(i/3)%4];
    return task('Find the same amount.','같은 만큼 있는 그림을 찾아요.',group(n,k,0),group(n,k,lv===1?0:1),group(m,k,lv===1?0:1));
  }));
  register('moreP','math','Which has more?','어느 쪽이 많을까','CD-MA2',banks((lv,i)=>{
    const pairs=lv===1?[[1,3],[1,2],[2,3]]:[[2,3],[3,5],[2,5],[1,4]], [a,b]=pairs[i%pairs.length],k=objects[Math.floor(i/pairs.length)%4];
    return task('Which group has more?','어느 쪽에 더 많이 있나요?','',group(b,k,i%2),group(a,k,i%2));
  }));
  register('sizeP','math','Big and small','큰 것 작은 것','CD-MA4',banks((lv,i)=>{
    const large=32+i%6,small=lv===1?13+i%5:23+i%5,big=i%2===0,k=Math.floor(i/2)%3;
    return task(big?'Find the bigger shape.':'Find the smaller shape.',big?'더 큰 모양을 찾아요.':'더 작은 모양을 찾아요.','',shape(k,big?large:small),shape(k,big?small:large));
  }));
  register('lengthP','math','Long and short','길이를 살펴요','CD-MA4',banks((lv,i)=>{
    const long=70+i%12,short=25+i%10,wantLong=i%2===0;
    const bar=n=>svg(lv===1?`<rect x="12" y="40" width="${n}" height="18" fill="#436cb5"/>`:`<rect x="50" y="${92-n}" width="18" height="${n}" fill="#436cb5"/>`);
    return task(lv===1?(wantLong?'Find the longer strip.':'Find the shorter strip.'):(wantLong?'Find the taller tower.':'Find the shorter tower.'),lv===1?(wantLong?'더 긴 띠를 찾아요.':'더 짧은 띠를 찾아요.'):(wantLong?'더 높은 탑을 찾아요.':'더 낮은 탑을 찾아요.'),'',bar(wantLong?long:short),bar(wantLong?short:long));
  }));
  register('sortP','math','Find a matching friend','같은 친구 찾기','CD-MA6',banks((lv,i)=>{
    const k=i%3,foil=(k+1+Math.floor(i/3)%2)%3,size=18+Math.floor(i/6)*4,bySize=lv===2&&i%2===0;
    return task(bySize?'Find the same size.':'Find the same shape.',bySize?'크기가 같은 모양을 찾아요.':'모양이 같은 친구를 찾아요.',shape(k,size),shape(k,size),shape(bySize?k:foil,bySize?size+12:size));
  }));
  register('patternP','math','Next picture','다음 무늬','CD-MA6',banks((lv,i)=>{
    const all=['ball','cup','book','flower','cat','fish'],a=i%6,b=(a+1+Math.floor(i/6)%5)%6,last=i%2===0,seq=lv===1?(last?[a,b,a,b]:[b,a,b,a]):(last?[a,a,b,a,a,b]:[a,b,b,a,b,b]);
    return task('The pictures take turns. What comes next?','그림이 번갈아 나와요. 다음 그림은 무엇일까요?',`<div class="pk-pattern">${seq.map(x=>art(all[x])).join('')}<span>?</span></div>`,art(all[lv===1?(last?a:b):a]),art(all[lv===1?(last?b:a):b]));
  }));
  register('positionP','math','Where is it?','어디에 있나요','CD-MA8',banks((lv,i)=>{
    const pair=lv===1?['inside','outside']:['above','below'],n=i%2,k=['ball','cup','cat','fish','book','flower'][Math.floor(i/2)%6],words={inside:B('inside','안'),outside:B('outside','밖'),above:B('above','위'),below:B('below','아래')};
    return task(`Find the picture with the ${PK.names[k].en} ${words[pair[n]].en} the box.`,`물건이 상자 ${words[pair[n]].ko}에 있는 그림을 찾아요.`,art(k),position(pair[n],k),position(pair[1-n],k));
  }));
  register('shapeP','math','Shape partners','모양 짝꿍','CD-MA10',banks((lv,i)=>{
    const k=lv===1?i%2:i%3,foil=lv===1?1-k:(k+1+Math.floor(i/3)%2)%3,size=19+Math.floor(i/6)*4,rotation=lv===1?0:(i%4-2)*8;
    return task('Find the same shape.','모양이 같은 친구를 찾아요.',shape(k,size),shape(k,30,rotation),shape(foil,30,rotation));
  }));
})();
