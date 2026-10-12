(() => {
'use strict';
const reg=(id,en,ko,code,make)=>registerGame({id,grade:'3',subject:'math',icon:'📐',title:B(en,ko),sub:B('Use pictures, units and evidence','그림과 단위를 보고 근거를 들어 생각해요'),area:B(`Grade 3 Math · ${code}`,`3학년 수학 · ${code}`),play(){quiz(this,make(lvl(id)));}});
const opts=(a,wrong)=>[...new Set([a,...wrong])].slice(0,3).map((n,i)=>({html:`<span class="word">${typeof n==='object'?L(n):n}</span>`,ok:i===0}));
const panel=s=>`<div class="g3-geometry">${s}</div>`;
const svg=(s,h=120)=>panel(`<svg viewBox="0 0 320 ${h}" role="img">${s}</svg>`);
const text=(x,y,s)=>`<text x="${x}" y="${y}" text-anchor="middle">${s}</text>`;
const strip=(d,n,y=15)=>Array.from({length:d},(_,i)=>`<rect x="${10+i*300/d}" y="${y}" width="${300/d}" height="32" fill="${i<n?'#236d98':'#fff'}" stroke="#17364a"/>`).join('');
const q=(ask,show,a,w,after)=>({ask,show,opts:opts(a,w),cls:'g3-geometry-options',after:after||B(String(a),String(a))});
const fraction=n=>n%1===0?String(n):n%1===0.5?`${Math.floor(n)?Math.floor(n)+' ':''}1/2`:`${Math.floor(n)?Math.floor(n)+' ':''}${Math.round((n%1)*4)}/4`;
reg('unitfraction3','Unit Fractions','단위분수 만들기','3.NR.4.1',lv=>{
 const d=pick(lv===1?[2,3,4]:[2,3,4,6,8]);
 return q(B('One whole, equal parts. What fraction is shaded?','전체를 똑같이 나누었어요. 색칠한 부분은 전체의 얼마인지 분수로 골라요.'),svg(strip(d,1),65),`1/${d}`,[`1/${d+1}`,`${d}/1`],B(`1 of ${d} equal parts: 1/${d}`,`같은 크기 ${d}조각 중 한 조각: 1/${d}`));
});
reg('fractionline3','Fractions on a Line','수직선 위의 분수','3.NR.4.1 · 3.NR.4.3',lv=>{
 const d=pick([2,3,4,6,8]),whole=lv===1?1:2,n=1+rnd(d*whole-1),step=280/(d*whole);
 return q(B('What fraction marks the dot?','점이 나타내는 분수를 골라요.'),svg(`<path d="M20 55 H300" stroke="currentColor"/>${Array.from({length:d*whole+1},(_,i)=>`<path d="M${20+i*step} 47 V63" stroke="currentColor"/>${i%d===0?text(20+i*step,88,i/d):''}`).join('')}<circle cx="${20+n*step}" cy="55" r="7" fill="#b84120"/>`,100),`${n}/${d}`,[`${n+1}/${d}`,`${n-1}/${d}`],B(`${n} steps of 1/${d}`,`1/${d}씩 ${n}칸 이동해요.`));
});
reg('equivalent3','Equal Fractions','크기가 같은 분수','3.NR.4.4',lv=>{
 const [d,D]=pick(lv===1?[[2,4],[3,6]]:[[2,4],[2,6],[2,8],[3,6],[4,8]]),n=1+rnd(d-1),N=n*D/d;
 return q(B(`Same-size wholes. Which fraction equals ${n}/${d}?`,`전체 크기가 같아요. 크기가 같은 분수를 골라요: ${n}/${d} = ?`),svg(strip(d,n,12)+strip(D,N,65),110),`${N}/${D}`,[`${N+1}/${D}`,`${N-1}/${D}`],B(`${n}/${d} = ${N}/${D}`,`${n}/${d} = ${N}/${D}`));
});
reg('fractioncompare3','Compare Unit Fractions','단위분수 비교','3.NR.4.2',lv=>{
 const ds=shuffle(lv===1?[2,3,4]:[2,3,4,6,8]),a=ds[0],b=ds[1],large=rnd(2)===0,right=large?Math.min(a,b):Math.max(a,b);
 return q(large?B('Same-size wholes. Which fraction is greater?','전체 크기가 같아요. 더 큰 분수는?'):B('Same-size wholes. Which fraction is smaller?','전체 크기가 같아요. 더 작은 분수는?'),svg(strip(a,1,12)+text(290,60,`1/${a}`)+strip(b,1,70)+text(290,119,`1/${b}`),125),`1/${right}`,[`1/${right===a?b:a}`],B('With the same whole, more equal parts make each part smaller.','같은 전체를 더 많이 등분하면 한 조각은 더 작아져요.'));
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
reg('elapsed3','Time Passed','걸린 시간 구하기','3.MDR.5.3',lv=>{
 const step=lv===1?30:15,start=8*60+rnd(4)*step,duration=(1+rnd(4))*step,end=start+duration;
 return q(B('Both times are in the morning. How many minutes passed?','둘 다 오전이에요. 몇 분이 지났을까요?'),panel(`<div class="g3-time">${time(start)} → ${time(end)}</div>`),duration,[duration+step,Math.max(0,duration-step)],B(`${duration} minutes`,`${duration}분`));
});
reg('ruler3','Inch Ruler','인치 눈금자','3.MDR.5.4',lv=>{
 const unit=lv===1?2:4,start=lv===1?0:rnd(5),len=1+rnd(8),end=start+len,max=4*unit,scale=280/max;
 return q(B('How long is the orange bar in inches? Drawing is not actual size.','주황 막대는 몇 인치일까요? 그림은 실제 크기가 아니에요.'),svg(`<rect x="${20+start*scale}" y="14" width="${len*scale}" height="14" fill="#ba4a22"/><path d="M20 50 H300" stroke="currentColor"/>${Array.from({length:max+1},(_,i)=>`<path d="M${20+i*scale} 50 V${i%unit===0?72:(unit===4&&i%2===0?67:62)}" stroke="currentColor"/>${i%unit===0?text(20+i*scale,94,i/unit):''}`).join('')}`,105),fraction((end-start)/unit),[fraction((len+1)/unit),fraction((len-1)/unit)],B(`${fraction(len/unit)} inches`,`${fraction(len/unit)}인치`));
});
reg('measure3','Choose a Unit','알맞은 단위','3.MDR.5.5',lv=>{
 const rows=[
 [B('Which unit measures the LENGTH of a ribbon?','리본의 길이를 재는 단위는?'),B('inches','인치'),B('ounces (weight)','온스(무게)'),B('fluid ounces (liquid)','액량 온스(들이)')],
 [B('Which unit measures the WEIGHT of a bag of flour?','밀가루 봉지의 무게를 재는 단위는?'),B('pounds','파운드'),B('gallons','갤런'),B('feet','피트')],
 [B('Which unit measures how much WATER a jug holds?','물통에 물이 얼마나 들어가는지(들이) 재는 단위는?'),B('gallons','갤런'),B('inches','인치'),B('pounds','파운드')]];
 if(lv>1&&rnd(2)){const a=2+rnd(8),b=1+rnd(8);return q(B(`A ribbon is ${a} inches long. Add ${b} more inches. How many inches long is it now?`,`리본 길이가 ${a}인치예요. ${b}인치를 더 이으면 모두 몇 인치가 될까요?`),'',a+b,[a+b+1,Math.abs(a-b)]);}
 const r=pick(rows);return {ask:r[0],opts:opts(r[1],r.slice(2)),cls:'words g3-geometry-options',after:r[1]};
});
reg('graph3','Data Stories','자료 이야기','3.MDR.5.1',lv=>{
 const a=1+rnd(6),b=1+rnd(6),c=1+rnd(6),k=lv===1?1:2,compare=lv>1&&rnd(2),ans=compare?(a+b+c)*k:a*k;
 return q(compare?B('Made-up class data. How many votes altogether?','연습용 학급 자료예요. 모두 몇 표일까요?'):B('Made-up class data. How many votes for A?','연습용 학급 자료예요. A는 몇 표를 받았나요?'),panel(`<div>${L(B(`Each ● = ${k} votes`,`● 하나 = ${k}표`))}</div><table>${[a,b,c].map((n,i)=>`<tr><th>${'ABC'[i]}</th><td>${'● '.repeat(n)}</td></tr>`).join('')}</table>`),ans,[ans+k,Math.max(0,ans-k)],B(`${ans} votes`,`${ans}표`));
});
reg('polygon3','Shape Properties','도형의 성질 탐정','3.GSR.6.1–6.3',lv=>{
 const square=!!rnd(2),width=square?90:160,show=svg(`<rect x="${160-width/2}" y="15" width="${width}" height="90" fill="#d4eafa" stroke="#234" stroke-width="2"/><path d="M${160-width/2+12} 15 V27 H${160-width/2}" fill="none" stroke="#234"/>`,120);
 if(lv===1)return q(B('How many right angles does this shape have?','이 도형의 직각은 몇 개일까요?'),show,4,[2,3]);
 const right=square?B('A square AND a rectangle','정사각형이면서 직사각형'):B('A rectangle, but not a square','정사각형이 아닌 직사각형');
 return {ask:B('Which statement is true?','맞는 설명을 골라요.'),show,opts:opts(right,[B('A triangle','삼각형'),B('It has no parallel sides','평행한 변이 없어요')]),cls:'words g3-geometry-options',after:B('A rectangle has four right angles. A square also has four equal sides.','직사각형은 직각이 네 개예요. 정사각형은 네 변의 길이도 같아요.')};
});
const tiles=(w,h,cut=0)=>svg(Array.from({length:w*h},(_,i)=>{const x=i%w,y=Math.floor(i/w);return cut&&x===w-1&&y<h-1?'':`<rect x="${20+x*28}" y="${10+y*28}" width="28" height="28" fill="#d4eafa" stroke="#234"/>`;}).join(''),h*28+20);
reg('area3','Area Tiles','넓이 타일','3.GSR.7.1–7.3',lv=>{
 const w=2+rnd(6),h=2+rnd(4),cut=lv>1&&rnd(2),ans=w*h-(cut?h-1:0);
 return q(B('Each tile is 1 square unit. What is the area?','한 칸의 넓이는 1제곱단위(square unit)예요. 넓이는 몇 제곱단위일까요?'),tiles(w,h,cut),ans,[ans+1,ans+w],B(`${ans} square units`,`${ans}제곱단위`));
});
reg('perimeter3','Perimeter Plans','둘레 설계','3.GSR.8.1–8.2',lv=>{
 const w=2+rnd(7),h=2+rnd(5),ans=2*(w+h);
 const show=svg(`<rect x="65" y="30" width="190" height="70" fill="#fff2dd" stroke="#234" stroke-width="2"/>${text(160,22,`${w} cm`)}${text(160,123,`${w} cm`)}${text(31,70,`${h} cm`)}${text(289,70,`${h} cm`)}`,135);
 if(lv>1&&rnd(2))return q(B(`A rectangle has perimeter ${ans} cm and length ${w} cm. What is its width in cm?`,`직사각형 둘레는 ${ans}cm, 가로는 ${w}cm예요. 세로는 몇 cm일까요?`),panel(`<div class="g3-time">${w} + n + ${w} + n = ${ans}</div>`),h,[h+1,h+2]);
 return q(B('Add the outside edges. What is the perimeter in cm?','네 변의 길이를 모두 더해요. 둘레는 몇 cm일까요?'),show,ans,[ans+2,ans-2],B(`${w} + ${h} + ${w} + ${h} = ${ans} cm`,`${w} + ${h} + ${w} + ${h} = ${ans}cm`));
});
})();
