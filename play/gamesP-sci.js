(() => {
  'use strict';
  const {art,shape,scene,svg,register,task,colors}=PK;
  const banks=fn=>[1,2].map(lv=>Array.from({length:24},(_,i)=>fn(lv,i)));
  register('observeP','sci','Look closely','자세히 보아요','CD-SC1',banks((lv,i)=>{
    const k=i%3,foil=(k+1+Math.floor(i/3)%2)%3,size=20+Math.floor(i/6)*4;
    return task('Look at the outline. Find the matching outline.','테두리 모양을 보고 같은 모양을 찾아요.',shape(k,size,0,colors[i%4]),shape(k,size,lv===1?0:10,lv===1?colors[i%4]:colors[(i+1)%4]),shape(foil,size,0,colors[i%4]));
  }));
  function sky(kind,i) {
    const x=12+i%6*12;
    const body=art(kind).replace(/^.*?<svg[^>]*>|<\/svg>$/g,'');
    return svg(`<rect x="0" y="0" width="180" height="110" rx="8" fill="#e4f1f8"/><g transform="translate(${x} 0)">${body}</g>${i%4>=2?'<path d="M7 60a13 13 0 0 1 0-25q10-20 25 0a13 13 0 0 1 0 25z" fill="#a8b4c6"/>':''}<path d="M0 105h180" stroke="#548e48" stroke-width="8"/>`,L(PK.names[kind]),180,110);
  }
  register('weatherP','sci','Sky pictures','오늘의 하늘 그림','CD-SC2',banks((lv,i)=>{
    const kinds=lv===1?['sun','rain']:['cloud','rain','sun'],k=kinds[i%kinds.length],other=kinds[(i+1)%kinds.length];
    return task(k==='cloud'?'Find the cloudy sky without rain.':`Find the ${PK.names[k].en} in the sky picture.`,k==='cloud'?'비가 내리지 않는 구름 낀 하늘을 찾아요.':`하늘 그림에서 ${PK.names[k].ko} 그림을 찾아요.`,sky(k,i),sky(k,23-i),sky(other,23-i));
  }));
  const plants=['tree','flower','leaf'],animals=['cat','fish','dog','bee','frog','duck','goat','mouse','bear'];
  register('plantanimalP','sci','Plants and animals','식물과 동물','CD-SC3',banks((lv,i)=>{
    const j=Math.floor(i/2),p=plants[j%3],a=animals[j%9],plant=i%2===0;
    return task(plant?'A tree and a flower are plants. Find a plant or a plant part.':'A cat and a fish are animals. Find an animal.',plant?'나무와 꽃은 식물이에요. 식물이나 식물의 일부를 찾아요.':'고양이와 물고기는 동물이에요. 동물을 찾아요.',scene([art(lv===1?'tree':'flower'),art(lv===1?'cat':'fish')]),art(plant?p:a),art(plant?a:p));
  }));
  function plantScene(kind,i,dark=false) {
    const body=art(kind).replace(/^.*?<svg[^>]*>|<\/svg>$/g,'');
    return svg(`<rect width="160" height="120" fill="${dark?'#596477':'#f5f0dc'}"/><g transform="translate(${18+i%4*6} 0) scale(.8)">${body}</g><rect x="24" y="91" width="110" height="22" fill="#a17a50"/>${dark?'':'<path d="M30 96l12 8 10-7 15 8 15-8 16 9 14-8" stroke="#674b36" fill="none" stroke-width="2"/>'}`,L(B(dark?'Plant in a dark room':'Plant with dry soil',dark?'어두운 곳의 식물':'흙이 마른 식물')),160,120);
  }
  register('needsP','sci','Care for a plant','식물에게 물을','CD-SC3',banks((lv,i)=>{
    const light=lv===2&&i%2===0,k=i%3===0?'tree':'flower',foil=['ball','book','hat','soap','box','chair'][Math.floor(i/2)%6];
    return task(light?'This plant needs light. Find sunlight. A grown-up helps choose a suitable place.':'The soil is dry. Find water. A grown-up checks how much the plant needs.',light?'이 식물은 빛이 필요해요. 햇빛을 찾아요. 어른이 알맞은 자리를 골라 줘요.':'흙이 말랐어요. 물을 찾아요. 어른이 필요한 양을 살펴봐요.',plantScene(k,i,light),art(light?'sun':'water'),art(foil));
  }));
  function movement(kind,start,end) {
    const body=art(kind).replace(/^.*?<svg[^>]*>|<\/svg>$/g,'');
    return svg(`<path d="M20 88h140" stroke="#966639" stroke-width="3"/><circle cx="${start}" cy="81" r="4" fill="#30343c"/><path d="M${start} 28h${end-start}" stroke="#cb633e" stroke-width="4"/><path d="M${end-8} 20l8 8-8 8" stroke="#cb633e" stroke-width="4" fill="none"/><g transform="translate(${end-17} 42) scale(.28)">${body}</g>`,L(B('Movement diagram','움직임 그림')),180,100);
  }
  register('motionP','sci','Push and pull','밀면 움직여요','CD-SC4 · CD-CP1',banks((lv,i)=>{
    const start=22+i%6*6,end=start+45+Math.floor(i/6)*9,k=lv===1?'ball':'box';
    return task(lv===1?'The arrow shows a push. Find where the ball moved.':'The arrow shows a pull. Find where the box moved.',lv===1?'화살표가 미는 방향을 보여 줘요. 공이 움직인 곳을 찾아요.':'화살표가 당기는 방향을 보여 줘요. 상자가 움직인 곳을 찾아요.',movement(k,start,end),movement(k,start,end),movement(k,start,start));
  }));
})();
