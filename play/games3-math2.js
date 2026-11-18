(() => {
'use strict';
// Keep ten successive rounds distinct without changing the shared engine.
const recentItems = new Map();
const fresh = (id, level, make) => {
 const key = `${id}:${level}:${S.lang}`, seen = recentItems.get(key) || [];
 for (let attempt = 0; attempt < 2048; attempt++) {
  const it = make(level), signature = JSON.stringify([it.ask.en, it.show || '', it.opts.filter(o=>o.ok).map(o=>o.html)]);
  if (!seen.includes(signature)) { seen.push(signature); if (seen.length > 9) seen.shift(); recentItems.set(key, seen); return it; }
 }
 throw new Error(`Insufficient distinct questions: ${id}/${level}`);
};
const reg=(id,en,ko,code,make)=>registerGame({id,grade:'3',subject:'math',icon:'📐',title:B(en,ko),sub:B('Use pictures, units and evidence','그림과 단위를 보고 근거를 들어 생각해요'),area:B(`Grade 3 Math · ${code}`,`3학년 수학 · ${code}`),play(){quiz(this,fresh(id,lvl(id),make));}});
const opts=(a,wrong)=>[...new Set([a,...wrong])].slice(0,3).map((n,i)=>({html:`<span class="word">${typeof n==='object'?L(n):n}</span>`,ok:i===0}));
const panel=s=>`<div class="g3-geometry">${s}</div>`;
const svg=(s,h=120)=>panel(`<svg viewBox="0 0 320 ${h}" role="img">${s}</svg>`);
const text=(x,y,s)=>`<text x="${x}" y="${y}" text-anchor="middle">${s}</text>`;
const strip=(d,n,y=15)=>Array.from({length:d},(_,i)=>`<rect x="${10+i*300/d}" y="${y}" width="${300/d}" height="32" fill="${i<n?'#236d98':'#fff'}" stroke="#17364a"/>`).join('');
const q=(ask,show,a,w,after)=>({ask,show,opts:opts(a,w),cls:'g3-geometry-options',after:after||B(String(a),String(a))});
const fraction=n=>n%1===0?String(n):n%1===0.5?`${Math.floor(n)?Math.floor(n)+' ':''}1/2`:`${Math.floor(n)?Math.floor(n)+' ':''}${Math.round((n%1)*4)}/4`;
// 11-18 bank widening (user: "문항 수가 너무 적고 반복이 있다"). Grade 3 fractions stay inside denominators 2, 3, 4, 6, 8,
// so the banks grow by representation (strip, circle, column, number line, story) and by which quantity is unknown.
const w2=(a,c)=>c.filter((x,i)=>x!==a&&c.indexOf(x)===i).slice(0,2);
const DEN=[2,3,4,6,8];
const piePath=(cx,cy,r,d,on)=>Array.from({length:d},(_,i)=>{const a=i*2*Math.PI/d,b=(i+1)*2*Math.PI/d,f=n=>n.toFixed(1);return `<path d="M${cx} ${cy} L${f(cx+r*Math.sin(a))} ${f(cy-r*Math.cos(a))} A${r} ${r} 0 0 1 ${f(cx+r*Math.sin(b))} ${f(cy-r*Math.cos(b))} Z" fill="${on.includes(i)?'#236d98':'#fff'}" stroke="#17364a"/>`;}).join('');
const stripOn=(d,on,y=15)=>Array.from({length:d},(_,i)=>`<rect x="${(10+i*300/d).toFixed(1)}" y="${y}" width="${(300/d).toFixed(1)}" height="32" fill="${on.includes(i)?'#236d98':'#fff'}" stroke="#17364a"/>`).join('');
const colOn=(d,on)=>Array.from({length:d},(_,i)=>`<rect x="130" y="${(8+i*124/d).toFixed(1)}" width="60" height="${(124/d).toFixed(1)}" fill="${on.includes(i)?'#236d98':'#fff'}" stroke="#17364a"/>`).join('');
const wholeModel=(d,on,shape)=>shape===0?svg(stripOn(d,on),65):shape===1?svg(piePath(160,70,55,d,on),140):svg(colOn(d,on),140);
const STORY=[['A ribbon','the ribbon','리본을'],['A sandwich','the sandwich','샌드위치를'],['A chocolate bar','the chocolate bar','초콜릿을'],['A pizza','the pizza','피자를'],['A paper strip','the paper strip','종이 띠를']];
reg('unitfraction3','Unit Fractions','단위분수 만들기','3.NR.4.1',lv=>{
 if(lv===2){
  const d=pick([3,4,6,8]),used=1+rnd(d-1),left=d-used,mode=rnd(3),on=shuffle([...Array(d).keys()]).slice(0,used),model=wholeModel(d,on,rnd(3)),frac=`${used}/${d}`,wrongFrac=w2(frac,[`${left}/${d}`,`1/${d}`,`${d}/${used}`,`${used}/${d+1}`]);
  if(mode===0)return q(B(`One whole has ${d} equal pieces, and the ${used} shaded pieces are used. How many pieces of 1/${d} remain?`,`전체를 ${d}등분해서 색칠한 ${used}조각을 썼어요. 1/${d}인 조각이 몇 개 남나요?`),model,left,w2(left,[d,used,left+1,left+2]));
  if(mode===1)return q(B('What fraction of the whole is shaded?','색칠한 부분은 전체의 얼마인지 분수로 골라요.'),model,frac,wrongFrac,B(`${used} pieces of 1/${d}: ${frac}`,`1/${d}인 조각 ${used}개: ${frac}`));
  const o=pick(STORY);
  return q(B(`${o[0]} is cut into ${d} equal pieces. Mia takes ${used} of them. What fraction of ${o[1]} does she take?`,`${o[2]} 똑같이 ${d}조각으로 나누었어요. 미아가 ${used}조각을 가져갔어요. 미아가 가져간 것은 전체의 얼마일까요?`),'',frac,wrongFrac,B(`${used} of ${d} equal pieces: ${frac}`,`같은 크기 ${d}조각 중 ${used}조각: ${frac}`));
 }
 const d=pick(DEN),mode=rnd(4),model=wholeModel(d,[rnd(d)],rnd(3));
 if(mode===1)return q(B('How many equal parts make this whole?','전체를 똑같은 몇 조각으로 나누었나요?'),model,d,[d+1,d-1]);
 if(mode===2)return q(B(`How many pieces of 1/${d} make one whole?`,`1/${d}인 조각이 몇 개 모이면 전체가 될까요?`),model,d,[d+1,d-1]);
 if(mode===3)return q(B('How many more pieces the same size as the shaded one would make one whole?','색칠한 조각과 같은 크기의 조각이 몇 개 더 있으면 전체가 될까요?'),model,d-1,w2(d-1,[d,d+1,d-2>0?d-2:d+2]),B(`${d} pieces make the whole, 1 is shaded: ${d-1} more`,`${d}조각이 전체, 1조각은 색칠: ${d-1}개 더`));
 return q(B('One whole, equal parts. What fraction is shaded?','전체를 똑같이 나누었어요. 색칠한 부분은 전체의 얼마인지 분수로 골라요.'),model,`1/${d}`,[`1/${d+1}`,`${d}/1`],B(`1 of ${d} equal parts: 1/${d}`,`같은 크기 ${d}조각 중 한 조각: 1/${d}`));
});
const fline=(d,wh,marks)=>{const step=280/(d*wh);return svg(`<path d="M20 55 H300" stroke="currentColor"/>${Array.from({length:d*wh+1},(_,i)=>`<path d="M${(20+i*step).toFixed(1)} 47 V63" stroke="currentColor"/>${i%d===0?text((20+i*step).toFixed(1),88,i/d):''}`).join('')}${marks(step)}`,100);};
reg('fractionline3','Fractions on a Line','수직선 위의 분수','3.NR.4.1 · 3.NR.4.3',lv=>{
 const d=pick(DEN),wh=lv===1?1:2,top=d*wh,n=1+rnd(top-1),mode=top>=4?rnd(3):pick([0,2]),f=`${n}/${d}`;
 const dot=s=>`<circle cx="${(20+n*s).toFixed(1)}" cy="55" r="7" fill="#b84120"/>`;
 if(mode===1){
  const ps=[n,...shuffle(Array.from({length:top-1},(_,i)=>i+1).filter(i=>i!==n)).slice(0,2)].sort((a,b)=>a-b),letter='ABC'[ps.indexOf(n)];
  return q(B(`Which point shows ${f}?`,`${f}의 위치를 나타내는 점은 어느 것일까요?`),fline(d,wh,s=>ps.map((p,i)=>`<circle cx="${(20+p*s).toFixed(1)}" cy="55" r="6" fill="#b84120"/>${text((20+p*s).toFixed(1),36,'ABC'[i])}`).join('')),letter,['A','B','C'].filter(x=>x!==letter),B(`${f} is ${n} steps of 1/${d} from 0: point ${letter}`,`0에서 1/${d}씩 ${n}칸: 점 ${letter}`));
 }
 if(mode===2)return q(B(`How many jumps of 1/${d} from 0 reach the dot?`,`0에서 1/${d}씩 몇 번 뛰면 점에 닿을까요?`),fline(d,wh,dot),n,w2(n,[n+1,n>1?n-1:n+2,n+2]),B(`${n} jumps of 1/${d}: ${f}`,`1/${d}씩 ${n}번: ${f}`));
 return q(B('What fraction marks the dot?','점이 나타내는 분수를 골라요.'),fline(d,wh,dot),f,w2(f,[`${n+1}/${d}`,n>1?`${n-1}/${d}`:`${n+2}/${d}`,`${n}/${top+1}`]),B(`${n} steps of 1/${d}`,`1/${d}씩 ${n}칸 이동해요.`));
});
const EQP=[];DEN.forEach(d=>DEN.forEach(D=>{if(d!==D)for(let n=1;n<d;n++){const N=n*D/d;if(Number.isInteger(N))EQP.push([n,d,N,D]);}}));
const twoLines=(d,n,D)=>{const t=(den,y)=>`<path d="M20 ${y} H300" stroke="currentColor"/>${Array.from({length:den+1},(_,i)=>`<path d="M${(20+i*280/den).toFixed(1)} ${y-8} V${y+8}" stroke="currentColor"/>`).join('')}`,x=(20+n*280/d).toFixed(1);return svg(t(d,30)+t(D,90)+text(20,64,0)+text(300,64,1)+`<path d="M${x} 38 V82" stroke="#b84120" stroke-dasharray="4 4"/><circle cx="${x}" cy="30" r="7" fill="#b84120"/>`,110);};
const SPLIT=[['A garden bed','텃밭을'],['A fence','울타리를'],['A flag','깃발을'],['A wall','벽을']];
reg('equivalent3','Equal Fractions','크기가 같은 분수','3.NR.4.4',lv=>{
 if(lv===2){
  const mode=pick([0,0,1,1,1,2]);
  if(mode===0){
   const [d,factor]=pick([[2,2],[2,3],[2,4],[3,2],[4,2]]),n=1+rnd(d-1),D=d*factor,N=n*factor,o=pick(SPLIT);
   return q(B(`${o[0]} has ${d} equal parts, and ${n} ${n>1?'are':'is'} painted. Each part is split into ${factor}. Which fraction still equals ${n}/${d}?`,`${o[1]} ${d}등분해서 ${n}칸을 칠했어요. 각 칸을 다시 ${factor}등분하면 ${n}/${d}와 크기가 같은 분수는?`),svg(strip(d,n),65),`${N}/${D}`,w2(`${N}/${D}`,[`${n}/${D}`,`${N-1}/${D}`,`${N+1}/${D}`]),B(`${n}/${d} = ${N}/${D}`,`${n}/${d} = ${N}/${D}`));
  }
  if(mode===1){
   const [n,d,N,D]=pick(EQP),askTop=rnd(2),ans=askTop?N:D,s=askTop?`${n}/${d} = ?/${D}`:`${n}/${d} = ${N}/?`;
   return q(B(`Equal fractions. What number goes in the box? ${s}`,`크기가 같은 분수예요. ?에 알맞은 수는? ${s}`),panel(`<div class="g3-time">${s}</div>`),ans,w2(ans,askTop?[n,N+1,N>1?N-1:N+2,D]:[d,D+1,D-1,D+2]),B(`${n}/${d} = ${N}/${D}`,`${n}/${d} = ${N}/${D}`));
  }
  const pairs=[];DEN.forEach(d=>[1,2,3].forEach(k=>{if(k*d<=12)pairs.push([k,d]);}));
  const [k,d]=pick(pairs),ans=k*d,s=`${k} = ?/${d}`;
  return q(B(`Write ${k} ${k>1?'wholes':'whole'} as a fraction with ${d} equal parts in each whole. ${s}`,`전체 ${k}개를 각각 ${d}등분하면 분수로 얼마일까요? ${s}`),panel(`<div class="g3-time">${s}</div>`),ans,w2(ans,[k+d,d,k,ans+d,ans+1]),B(`${k} × ${d} = ${ans}, so ${k} = ${ans}/${d}`,`${k} × ${d} = ${ans}이므로 ${k} = ${ans}/${d}`));
 }
 const mode=pick([0,0,1,1,2,2,3]);
 if(mode===3){const d=pick(DEN);return q(B('The whole strip is shaded. Which fraction names 1 whole?','띠 전체를 색칠했어요. 전체(1)와 크기가 같은 분수는?'),svg(stripOn(d,[...Array(d).keys()]),65),`${d}/${d}`,[`1/${d}`,`${d}/1`],B(`${d} pieces of 1/${d} = ${d}/${d} = 1`,`1/${d}인 조각 ${d}개: ${d}/${d} = 1`));}
 const [n,d,N,D]=pick(EQP),ans=`${N}/${D}`,wrong=w2(ans,[`${N+1}/${D}`,N>1?`${N-1}/${D}`:`${N+2}/${D}`,`${n}/${D}`]);
 if(mode===1)return q(B(`The dot is at ${n}/${d}. Which fraction on the bottom line names the same point?`,`점은 ${n}/${d}에 있어요. 아래 수직선에서 같은 점을 나타내는 분수는?`),twoLines(d,n,D),ans,wrong,B(`${n}/${d} = ${ans}`,`${n}/${d} = ${ans}`));
 if(mode===2)return q(B(`Same-size wholes. ${n}/${d} = ?/${D}. What number goes in the box?`,`전체 크기가 같아요. ${n}/${d} = ?/${D}에서 ?에 알맞은 수는?`),svg(strip(d,n,12)+strip(D,0,65),110),N,w2(N,[n,N+1,N>1?N-1:N+2]),B(`${n}/${d} = ${ans}`,`${n}/${d} = ${ans}`));
 return q(B(`Same-size wholes. Which fraction equals ${n}/${d}?`,`전체 크기가 같아요. 크기가 같은 분수를 골라요: ${n}/${d} = ?`),svg(strip(d,n,12)+strip(D,N,65),110),ans,wrong,B(`${n}/${d} = ${ans}`,`${n}/${d} = ${ans}`));
});
const PAIRS=[['pizzas','피자'],['sandwiches','샌드위치'],['ribbons','리본'],['chocolate bars','초콜릿'],['pies','파이'],['paper strips','종이 띠']];
reg('fractioncompare3','Compare Unit Fractions','단위분수 비교','3.NR.4.2',lv=>{
 if(lv===2){
  const ds=shuffle(DEN).slice(0,3),down=rnd(2),sorted=ds.slice().sort((a,b)=>down?a-b:b-a),j=down?' > ':' < ',show=o=>o.map(d=>`1/${d}`).join(j);
  return q(down?B('Same-size wholes. Order these pieces from largest to smallest.','전체 크기가 같아요. 조각을 큰 것부터 차례로 놓아요.'):B('Same-size wholes. Order these pieces from smallest to largest.','전체 크기가 같아요. 조각을 작은 것부터 차례로 놓아요.'),panel(ds.map(d=>`1/${d}`).join(' · ')),show(sorted),[show(sorted.slice().reverse()),show([sorted[1],sorted[0],sorted[2]])]);
 }
 const ds=shuffle(DEN),a=ds[0],b=ds[1],large=rnd(2)===0,right=large?Math.min(a,b):Math.max(a,b),mode=rnd(3),after=B('With the same whole, more equal parts make each part smaller.','같은 전체를 더 많이 등분하면 한 조각은 더 작아져요.');
 if(mode===2){const o=pick(PAIRS);return q(B(`Two same-size ${o[0]}: one is cut into ${a} equal pieces, the other into ${b}. Which one piece is ${large?'bigger':'smaller'}?`,`크기가 같은 ${o[1]} 두 개를 하나는 ${a}조각, 하나는 ${b}조각으로 똑같이 나누었어요. 한 조각이 더 ${large?'큰':'작은'} 것은?`),'',`1/${right}`,[`1/${right===a?b:a}`],after);}
 const show=mode===1?svg(piePath(80,60,48,a,[0])+piePath(240,60,48,b,[0])+text(80,128,`1/${a}`)+text(240,128,`1/${b}`),135):svg(strip(a,1,12)+text(290,60,`1/${a}`)+strip(b,1,70)+text(290,119,`1/${b}`),125);
 return q(large?B('Same-size wholes. Which fraction is greater?','전체 크기가 같아요. 더 큰 분수는?'):B('Same-size wholes. Which fraction is smaller?','전체 크기가 같아요. 더 작은 분수는?'),show,`1/${right}`,[`1/${right===a?b:a}`],after);
});
const clock=(hour,minute)=>{
 const hand=(angle,r)=>{const a=angle*Math.PI/180;return [160+Math.sin(a)*r,90-Math.cos(a)*r];};
 const hp=hand((hour%12)*30+minute/2,42),mp=hand(minute*6,66);
 return svg(`<circle cx="160" cy="90" r="78" fill="#fff" stroke="#345" stroke-width="2"/>${Array.from({length:60},(_,i)=>{const a=hand(i*6,73),b=hand(i*6,i%5?70:66);return `<path d="M${a} L${b}" stroke="#345"/>`;}).join('')}${Array.from({length:12},(_,i)=>{const p=hand((i+1)*30,57);return text(p[0],p[1]+5,i+1);}).join('')}<path d="M160 90 L${hp}" stroke="#243747" stroke-width="5"/><path d="M160 90 L${mp}" stroke="#b84120" stroke-width="3"/><circle cx="160" cy="90" r="4" fill="#243747"/>`,180);
};
const time=t=>`${Math.floor(t/60)%12||12}:${String(t%60).padStart(2,'0')}`;
reg('clock3','Minute Clock','몇 시 몇 분 읽기','3.MDR.5.2',lv=>{
 const h=1+rnd(12),m=rnd(60),t=h*60+m,round=lv>1&&rnd(2),answer=round?Math.round(t/15)*15:t;
 return q(round?B('About what time, to the nearest 15 minutes?','가장 가까운 15분 단위(정각, 15분, 30분, 45분)로 어림하면 몇 시 몇 분일까요?'):B('Read the clock to the minute.','시계를 보고 몇 시 몇 분인지 읽어요.'),clock(h,m),time(answer),[time(answer+(round?15:1)),time(answer-(round?15:1))],B(time(answer),time(answer)));
});
const ACTS=[['Soccer practice','축구 연습'],['A movie','영화'],['Art class','미술 수업'],['A picnic','소풍'],['Swim lessons','수영 강습'],['A library visit','도서관 방문'],['Piano practice','피아노 연습'],['A bike ride','자전거 타기']];
reg('elapsed3','Time Passed','걸린 시간 구하기','3.MDR.5.3',lv=>{
 if(lv===2){const start=480+rnd(8)*15,ride=15*(1+rnd(4)),wait=5+rnd(5),end=start+ride+wait;return q(B(`Both times are morning, and ${wait} minutes were spent waiting. How many minutes were spent riding?`,`둘 다 오전이고 그중 ${wait}분은 기다렸어요. 타고 간 시간은 몇 분인가요?`),panel(`${time(start)} → ${time(end)}`),ride,[ride+wait,ride+2*wait]);}
 // 11-18: on the hour / half hour only (3.MDR.5.3), a.m. 6:00-11:30 or p.m. 1:00-8:30, never crossing noon; ask the minutes or the end time.
 let pm,start,duration;do{pm=rnd(2);start=(pm?13+rnd(6):6+rnd(5))*60+30*rnd(2);duration=30*(1+rnd(4));}while(!pm&&start+duration>=720);
 const end=start+duration,act=pick(ACTS),en=t=>`${time(t)} ${pm?'p.m.':'a.m.'}`,ko=t=>`${pm?'오후':'오전'} ${time(t)}`,at=t=>L(B(en(t),ko(t)));
 if(rnd(2))return q(B(`${act[0]} starts at ${en(start)} and lasts ${duration} minutes. What time does it end?`,`${act[1]}: ${ko(start)}에 시작해서 ${duration}분 동안 해요. 끝나는 시각은?`),panel(`<div class="g3-time">${at(start)} + ${duration} ${L(B('min','분'))} → ?</div>`),time(end),w2(time(end),[time(end+30),time(end-30),time(end+60)]),B(`${en(start)} + ${duration} minutes = ${en(end)}`,`${ko(start)} + ${duration}분 = ${ko(end)}`));
 return q(B(`${act[0]} starts and ends at these times. How many minutes does it last?`,`${act[1]}의 시작 시각과 끝 시각이에요. 몇 분 동안 했을까요?`),panel(`<div class="g3-time">${at(start)} → ${at(end)}</div>`),duration,w2(duration,[duration+30,duration>30?duration-30:duration+60,duration+60]),B(`${duration} minutes`,`${duration}분`));
});
const rulerPic=(unit,max,start,len)=>{const scale=280/max;return svg(`<rect x="${(20+start*scale).toFixed(1)}" y="14" width="${(len*scale).toFixed(1)}" height="14" fill="#ba4a22"/><path d="M20 50 H300" stroke="currentColor"/>${Array.from({length:max+1},(_,i)=>`<path d="M${(20+i*scale).toFixed(1)} 50 V${i%unit===0?72:(unit===4&&i%2===0?67:62)}" stroke="currentColor"/>${i%unit===0?text((20+i*scale).toFixed(1),94,i/unit):''}`).join('')}`,105);};
reg('ruler3','Inch Ruler','인치 눈금자','3.MDR.5.4',lv=>{
 if(lv===2&&rnd(2)){
  // 11-18: ribbon on a quarter-inch ruler, start anywhere 0-2 inches, 3/4 to 2 1/2 inches long, 1/4 or 1/2 inch cut off.
  let s,len,c;do{s=rnd(9);len=3+rnd(8);c=1+rnd(2);}while([fraction(s/4),fraction((s+len)/4),c===1?'1/4':'1/2'].some(t=>t.includes(fraction((len-c)/4)))); // Q1: the answer is never one of the marks in the question
  const e=s+len,ans=fraction((len-c)/4),cut=c===1?'1/4':'1/2';
  return q(B(`A ribbon lies along a ruler from the ${fraction(s/4)} inch mark to the ${fraction(e/4)} inch mark. You cut off ${cut} inch. How long is the ribbon now?`,`리본이 자의 ${fraction(s/4)}인치 눈금부터 ${fraction(e/4)}인치 눈금까지 놓여 있어요. ${cut}인치를 자르면 리본은 몇 인치일까요?`),panel(`<div class="g3-time">${fraction(s/4)} → ${fraction(e/4)}</div>`),ans,w2(ans,[fraction(len/4),fraction((e-c)/4),fraction((len-c+1)/4),fraction((len-c+2)/4)]),B(`${fraction(len/4)} − ${cut} = ${ans} inches`,`${fraction(len/4)} − ${cut} = ${ans}인치`));
 }
 // 11-18: level 1 half inches on a 6-inch ruler, level 2 quarter inches on a 4-inch ruler; the bar can start anywhere.
 const unit=lv===1?2:4,max=lv===1?12:16,len=1+rnd(lv===1?10:12),start=rnd(max-len+1),end=start+len,ans=fraction(len/unit);
 return q(B('How long is the orange bar in inches? Drawing is not actual size.','주황 막대는 몇 인치일까요? 그림은 실제 크기가 아니에요.'),rulerPic(unit,max,start,len),ans,w2(ans,[start>0?fraction(end/unit):'',fraction((len+1)/unit),len>1?fraction((len-1)/unit):'',fraction((len+2)/unit)].filter(Boolean)),B(`${ans} inches`,`${ans}인치`));
});
// 11-18: units, tools and objects as data so the choose-a-unit bank is not 12 fixed rows. size: S small / B big (for "best unit").
const DIM={L:{name:B('length','길이'),cap:'LENGTH',ko:'길이',units:[B('inches','인치 (inches)'),B('feet','피트 (feet)'),B('yards','야드 (yards)')],tool:B('ruler or tape measure','자 또는 줄자')},
 W:{name:B('weight','무게'),cap:'WEIGHT',ko:'무게',units:[B('ounces','온스 (ounces)'),B('pounds','파운드 (pounds)')],tool:B('scale','저울')},
 V:{name:B('liquid volume','들이'),cap:'LIQUID VOLUME',ko:'들이',units:[B('fluid ounces','액량 온스 (fluid ounces)'),B('cups','컵 (cups)'),B('quarts','쿼트 (quarts)'),B('gallons','갤런 (gallons)')],tool:B('measuring cup','계량컵')}};
const THINGS=[['L','a pencil','연필',0,'S'],['L','a crayon','크레용',0,'S'],['L','a shoe','신발',0,'S'],['L','a book','책',0,'S'],['L','a paper clip','클립',0,'S'],['L','a spoon','숟가락',0,'S'],['L','a table','탁자',1,''],['L','a door','문',1,''],['L','a rug','깔개',1,''],['L','a jump rope','줄넘기 줄',1,''],['L','a hallway','복도',2,'B'],['L','a football field','미식축구 경기장',2,'B'],['L','a playground','놀이터',2,'B'],
 ['W','a potato','감자',0,'S'],['W','an apple','사과',0,'S'],['W','a letter','편지',0,'S'],['W','a banana','바나나',0,'S'],['W','a bag of flour','밀가루 봉지',1,'B'],['W','a suitcase','여행 가방',1,'B'],['W','a melon','멜론',1,''],['W','a puppy','강아지',1,'B'],['W','a pumpkin','호박',1,'B'],['W','a backpack','책가방',1,''],
 ['V','a juice box','주스 팩',0,'S'],['V','a spoonful of medicine','약 한 숟가락',0,'S'],['V','a glass of milk','우유 한 잔',1,''],['V','a bowl of soup','수프 한 그릇',1,''],['V','a pot of soup','수프 한 냄비',2,''],['V','a bucket of water','물 한 양동이',3,'B'],['V','a fish tank','어항',3,'B'],['V','a bathtub','욕조',3,'B'],['V','a watering can','물뿌리개',3,''],['V','a swimming pool','수영장',3,'B']];
const otherUnits=k=>Object.keys(DIM).filter(x=>x!==k).map(x=>pick(DIM[x].units));
const STORIES=[
 (a,b)=>[B(`A ribbon is ${a} inches long, and you add ${b} more inches. How long is it now?`,`리본 길이가 ${a}인치예요. ${b}인치를 더 이으면 모두 몇 인치가 될까요?`),a+b,'+','inches','인치'],
 (a,b)=>[B(`A puppy weighed ${a} pounds and then gained ${b} pounds. How much does it weigh now?`,`강아지 무게가 ${a}파운드였는데 ${b}파운드 늘었어요. 지금은 몇 파운드일까요?`),a+b,'+','pounds','파운드'],
 (a,b)=>[B(`A jug holds ${a} cups of water. You pour out ${b} cups. How many cups are left?`,`물병에 물이 ${a}컵 있어요. ${b}컵을 따르면 몇 컵이 남을까요?`),a-b,'−','cups','컵'],
 (a,b)=>[B(`A board is ${a} feet long. You cut off ${b} feet. How long is the board now?`,`나무판 길이가 ${a}피트예요. ${b}피트를 잘라 내면 몇 피트가 남을까요?`),a-b,'−','feet','피트'],
 (a,b)=>[B(`One bag of nuts weighs ${a} ounces and another weighs ${b} ounces. How many ounces together?`,`견과 봉지 하나는 ${a}온스, 다른 하나는 ${b}온스예요. 모두 몇 온스일까요?`),a+b,'+','ounces','온스'],
 (a,b)=>[B(`A fish tank has ${a} gallons of water. You add ${b} more gallons. How many gallons now?`,`어항에 물이 ${a}갤런 있어요. ${b}갤런을 더 부으면 몇 갤런일까요?`),a+b,'+','gallons','갤런'],
 (a,b)=>[B(`A rope is ${a} yards long. You use ${b} yards. How many yards are left?`,`밧줄 길이가 ${a}야드예요. ${b}야드를 쓰면 몇 야드가 남을까요?`),a-b,'−','yards','야드']];
reg('measure3','Choose a Unit','알맞은 단위','3.MDR.5.5',lv=>{
 if(lv>1){
  if(rnd(2)){const a=10+rnd(51),b=2+rnd(Math.min(30,a-3)),[ask,ans,op,ue,uk]=pick(STORIES)(a,b),other=op==='+'?a-b:a+b;return q(ask,'',ans,w2(ans,[other,ans+10,ans+1,Math.max(1,ans-1)]),B(`${a} ${op} ${b} = ${ans} ${ue}`,`${a} ${op} ${b} = ${ans}${uk}`));}
  const t=pick(THINGS.filter(x=>x[4])),D=DIM[t[0]],u=D.units[t[3]],far=t[4]==='S'?D.units[D.units.length-1]:D.units[0];
  return {ask:B(`Which unit is the BEST choice to measure the ${D.cap} of ${t[1]}?`,`${t[2]}의 ${D.ko}를 잴 때 가장 알맞은 단위는?`),opts:opts(u,[far,pick(otherUnits(t[0]))]),cls:'words g3-geometry-options',after:u};
 }
 const mode=pick([0,0,1,1,2]);
 if(mode===2){const k=pick(Object.keys(DIM)),u=pick(DIM[k].units);return {ask:B(`What do ${u.en} measure?`,`${u.ko.split(" (")[0]} 단위로는 무엇을 잴까요?`),opts:opts(DIM[k].name,Object.keys(DIM).filter(x=>x!==k).map(x=>DIM[x].name)),cls:'words g3-geometry-options',after:DIM[k].name};}
 const t=pick(THINGS),D=DIM[t[0]];
 if(mode===1)return {ask:B(`Which tool would you use to measure the ${D.cap} of ${t[1]}?`,`${t[2]}의 ${D.ko}를 잴 때 쓰는 도구는?`),opts:opts(D.tool,Object.keys(DIM).filter(x=>x!==t[0]).map(x=>DIM[x].tool)),cls:'words g3-geometry-options',after:D.tool};
 const u=D.units[t[3]];return {ask:B(`Which unit measures the ${D.cap} of ${t[1]}?`,`${t[2]}의 ${D.ko}를 재는 단위는?`),opts:opts(u,otherUnits(t[0])),cls:'words g3-geometry-options',after:u};
});
reg('graph3','Data Stories','자료 이야기','3.MDR.5.1',lv=>{
 const a=1+rnd(6),b=1+rnd(6),c=1+rnd(6),k=lv===1?1:2,compare=lv>1&&rnd(2),ans=compare?(a+b+c)*k:a*k;
 return q(compare?B('Made-up class data. How many votes altogether?','연습용 학급 자료예요. 모두 몇 표일까요?'):B('Made-up class data. How many votes for A?','연습용 학급 자료예요. A는 몇 표를 받았나요?'),panel(`<div>${L(B(`Each ● = ${k} votes`,`● 하나 = ${k}표`))}</div><table>${[a,b,c].map((n,i)=>`<tr><th>${'ABC'[i]}</th><td>${'● '.repeat(n)}</td></tr>`).join('')}</table>`),ans,[ans+k,Math.max(0,ans-k)],B(`${ans} votes`,`${ans}표`));
});
// 11-18 bank widening: 13 shapes (was 5), drawn turned and flipped (level 1 quarter turns, level 2 any 15° step).
// `also` lists names that are ALSO true of the shape, so they never appear as a wrong description; trapezoid is kept off
// the parallelogram family because inclusive/exclusive definitions differ.
const regular=n=>Array.from({length:n},(_,i)=>{const a=-Math.PI/2+i*2*Math.PI/n;return [50*Math.cos(a),50*Math.sin(a)];});
const SHAPES=[
 {id:'sq',name:B('A square AND a rectangle','정사각형이면서 직사각형'),also:['trap'],p:[[-35,-35],[35,-35],[35,35],[-35,35]],angles:4,parallel:2,symmetry:4,sides:4},
 {id:'rect',name:B('rectangle (not square)','정사각형이 아닌 직사각형'),also:['trap'],p:[[-45,-23],[45,-23],[45,23],[-45,23]],angles:4,parallel:2,symmetry:2,sides:4},
 {id:'rhom',name:B('rhombus (not square)','정사각형이 아닌 마름모'),also:['para','trap'],p:[[0,-50],[32,0],[0,50],[-32,0]],angles:0,parallel:2,symmetry:2,sides:4},
 {id:'para',name:B('parallelogram with no right angles','직각이 없는 평행사변형'),also:['trap'],p:[[-45,-22],[15,-22],[45,22],[-15,22]],angles:0,parallel:2,symmetry:0,sides:4},
 {id:'trap',name:B('trapezoid','사다리꼴'),p:[[-25,-30],[25,-30],[50,30],[-50,30]],angles:0,parallel:1,symmetry:1,sides:4},
 {id:'rtrap',name:B('trapezoid','사다리꼴'),p:[[-45,-30],[15,-30],[45,30],[-45,30]],angles:2,parallel:1,symmetry:0,sides:4},
 {id:'kite',p:[[0,-45],[30,-10],[0,50],[-30,-10]],angles:0,parallel:0,symmetry:1,sides:4},
 {id:'rt',name:B('right triangle','직각삼각형'),p:[[-40,-40],[-40,40],[45,40]],angles:1,parallel:0,symmetry:0,sides:3},
 {id:'iso',name:B('isosceles triangle','이등변삼각형'),p:[[0,-50],[-35,45],[35,45]],angles:0,parallel:0,symmetry:1,sides:3},
 {id:'equi',name:B('equilateral triangle','정삼각형'),also:['iso'],p:regular(3),angles:0,parallel:0,symmetry:3,sides:3},
 {id:'scal',p:[[-50,30],[40,30],[-10,-35]],angles:0,parallel:0,symmetry:0,sides:3},
 {id:'pent',name:B('pentagon','오각형'),p:regular(5),angles:0,parallel:0,symmetry:5,sides:5},
 {id:'hex',name:B('hexagon','육각형'),p:regular(6),angles:0,parallel:3,symmetry:6,sides:6}
];
const drawShape=(s,lv)=>{
 const cx=s.p.reduce((t,v)=>t+v[0],0)/s.p.length,cy=s.p.reduce((t,v)=>t+v[1],0)/s.p.length,c=s.p.map(([x,y])=>[x-cx,y-cy]),k=50/Math.max(...c.map(([x,y])=>Math.hypot(x,y)));
 const th=(lv===1?90*rnd(4):15*rnd(24))*Math.PI/180,fl=rnd(2)?-1:1;
 const pts=c.map(([x,y])=>{x*=k*fl;y*=k;return `${(160+x*Math.cos(th)-y*Math.sin(th)).toFixed(1)},${(62+x*Math.sin(th)+y*Math.cos(th)).toFixed(1)}`;}).join(' ');
 return svg(`<polygon points="${pts}" fill="#d4eafa" stroke="#234" stroke-width="2"/>`,125);
};
reg('polygon3','Shape Properties','도형의 성질 탐정','3.GSR.6.1–6.3',lv=>{
 const mode=rnd(lv===1?4:5);let s=pick(mode===4?SHAPES.filter(x=>x.name):SHAPES);
 // answer-skew: many shapes have 0 right angles / 0 parallel pairs, so half the time a zero shape is swapped for one that has some.
 if((mode===0||mode===3&&lv===2)&&!s.angles&&rnd(2))s=pick(SHAPES.filter(x=>x.angles));
 if(mode===1&&!s.parallel&&rnd(2))s=pick(SHAPES.filter(x=>x.parallel));
 const show=drawShape(s,lv);
 if(mode===0)return q(B('How many right angles are in this shape?','이 도형의 직각은 몇 개일까요?'),show,s.angles,[s.angles===0?1:0,s.angles===4?2:4]);
 if(mode===1)return q(B('How many PAIRS of parallel sides?','평행한 변은 몇 쌍인가요?'),show,s.parallel,[s.parallel===0?1:0,s.parallel===2?1:2]);
 if(mode===3)return lv===1?q(B('How many corners (vertices) does this shape have?','이 도형의 꼭짓점은 몇 개인가요?'),show,s.sides,[s.sides+1,s.sides-1]):q(B('How many pairs of neighboring sides meet at a right angle?','이웃한 두 변이 수직으로 만나는 곳은 몇 군데인가요?'),show,s.angles,[s.angles===0?1:0,s.angles===4?2:4]);
 if(mode===2)return q(lv===1?B('How many sides are in this polygon?','이 다각형의 변은 몇 개인가요?'):B('How many lines of symmetry does this shape have?','이 도형의 대칭축은 몇 개인가요?'),show,lv===1?s.sides:s.symmetry,lv===1?[s.sides+1,s.sides-1]:[s.symmetry+1,s.symmetry===0?2:0]);
 const pool=shuffle(SHAPES.filter(x=>x.name&&x.name.en!==s.name.en&&!(s.also||[]).includes(x.id))),seen=new Set(),wrong=[...pool.filter(x=>x.sides===s.sides),...pool.filter(x=>x.sides!==s.sides)].filter(x=>!seen.has(x.name.en)&&seen.add(x.name.en)).slice(0,2).map(x=>x.name);
 return {ask:B('Choose the true description.','맞는 설명을 골라요.'),show,opts:opts(s.name,wrong),cls:'words g3-geometry-options',after:s.name};
});
const tiles=(w,h,cut=0)=>svg(Array.from({length:w*h},(_,i)=>{const x=i%w,y=Math.floor(i/w);return cut&&x===w-1&&y<h-1?'':`<rect x="${20+x*28}" y="${10+y*28}" width="28" height="28" fill="#d4eafa" stroke="#234"/>`;}).join(''),h*28+20);
reg('area3','Area Tiles','넓이 타일','3.GSR.7.1–7.3 · 3.GSR.8.2',lv=>{
 if (gap50Next('area3')) return gap50Rect(lv, true);
 const w=2+rnd(6),h=2+rnd(4),cut=lv>1&&rnd(2),ans=w*h-(cut?h-1:0);
 return q(B('Each tile is 1 square unit. What is the area?','한 칸의 넓이는 1제곱단위(square unit)예요. 넓이는 몇 제곱단위일까요?'),tiles(w,h,cut),ans,[ans+1,ans+w],B(`${ans} square units`,`${ans}제곱단위`));
});
reg('perimeter3','Perimeter Plans','둘레 설계','3.GSR.8.1–8.2',lv=>{
 if (gap50Next('perimeter3')) return gap50Rect(lv, false);
 const w=2+rnd(7),h=2+rnd(5),ans=2*(w+h);
 const scale=125/Math.max(w,h),W=w*scale,H=h*scale,x=160-W/2,y=35;
 const show=svg(`<rect x="${x}" y="${y}" width="${W}" height="${H}" fill="#fff2dd" stroke="#234" stroke-width="2"/>${text(160,y-10,`${w} cm`)}${text(160,y+H+22,`${w} cm`)}${text(x-30,y+H/2,`${h} cm`)}${text(x+W+30,y+H/2,`${h} cm`)}`,H+65);
 if(lv>1&&rnd(2))return q(B(`A rectangle has perimeter ${ans} cm and length ${w} cm. What is its width in cm?`,`직사각형 둘레는 ${ans}cm, 가로는 ${w}cm예요. 세로는 몇 cm일까요?`),panel(`<div class="g3-time">${w} + n + ${w} + n = ${ans}</div>`),h,[h+1,h+2]);
 return q(B('Add the outside edges. What is the perimeter in cm?','네 변의 길이를 모두 더해요. 둘레는 몇 cm일까요?'),show,ans,[ans+2,ans-2],B(`${w} + ${h} + ${w} + ${h} = ${ans} cm`,`${w} + ${h} + ${w} + ${h} = ${ans}cm`));
});
// Fixed-condition comparisons have one true explanation; no free design is scored.
const gap50Turns={};
const gap50Next=id=>((gap50Turns[id]=(gap50Turns[id]||0)+1)%2===1);
const gap50Rect=(lv,sameArea)=>{
 const pairs=sameArea?[[2,6,3,4],[2,8,4,4],[2,9,3,6],[3,8,4,6],[1,6,2,3],[1,8,2,4]]:[[1,5,2,4],[1,6,2,5],[2,5,3,4],[2,6,3,5],[1,8,3,6],[2,7,4,5]];
 let [a,b,c,d]=pick(pairs);if(rnd(2))[a,b,c,d]=[c,d,a,b];if(rnd(2))[a,b]=[b,a];if(rnd(2))[c,d]=[d,c];
 // Orientation changes preserve the condition; the two shapes are never rotation-only equivalents.
 const A=a*b,C=c*d,P=2*(a+b),Q=2*(c+d),labels=[B('Same perimeter; different areas','둘레는 같고 넓이는 달라요'),B('Same area; different perimeters','넓이는 같고 둘레는 달라요'),B('Same area and perimeter','넓이와 둘레가 모두 같아요')];
 const rect=(x,w,h,name)=>{const s=80/Math.max(w,h);return `<rect x="${x}" y="20" width="${w*s}" height="${h*s}" fill="#d4eafa" stroke="#234"/>${text(x+40,15,`${name}: ${w} × ${h}`)}`;};
 const model=svg('<rect width="320" height="105" rx="6" fill="#fff"/>'+rect(20,a,b,'A')+rect(180,c,d,'B'),105)+panel(L(B('Side lengths: units. Area: square units.','변 길이: 단위. 넓이: 제곱단위.')));
 if(lv===1)return q(B('Compare the two rectangles. Which statement is true?','두 직사각형을 비교해요. 무엇이 같고 다를까요?'),model,labels[sameArea?1:0],labels.filter((_,i)=>i!==(sameArea?1:0)),B(`Areas ${A}, ${C}; perimeters ${P}, ${Q}.`,`넓이는 ${A}, ${C}제곱단위, 둘레는 ${P}, ${Q}단위예요.`));
 const evidence=(first,second)=>sameArea?`${a} × ${b} ${first} ${c} × ${d}; ${P} ${second} ${Q}`:`2 × (${a} + ${b}) ${first} 2 × (${c} + ${d}); ${A} ${second} ${C}`;
 return q(B(sameArea?'Which evidence shows equal areas but different perimeters?':'Which evidence shows equal perimeters but different areas?',sameArea?'넓이는 같고 둘레는 다르다는 근거는?':'둘레는 같고 넓이는 다르다는 근거는?'),model,evidence('=','≠'),[evidence('≠','≠'),evidence('=','=')]);
};
})();
