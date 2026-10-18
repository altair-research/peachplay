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
const reg=(id,en,ko,code,make)=>registerGame({id,grade:'3',subject:'math',icon:'🧮',title:B(en,ko),sub:B('Explore numbers and explain your thinking','수를 살펴보고 생각을 설명해요'),area:B(`Grade 3 Math · ${code}`,`3학년 수학 · ${code}`),play(){quiz(this,fresh(id,lvl(id),make));}});
const nums=(a,w=[])=>[...new Set([a,...w,a+1,a+10,Math.max(0,a-1)])].filter(n=>Number.isInteger(n)&&n>=0).slice(0,3).map(n=>({html:`<span class="num">${n}</span>`,ok:n===a}));
const panel=s=>`<div class="g3-math-model">${s}</div>`;
const eq=s=>panel(`<div class="g3-equation">${s}</div>`);
const dots=(r,c,split=0)=>panel(`<svg viewBox="0 0 ${c*20+12} ${r*20+12}" role="img" aria-label="${r} × ${c}">${Array.from({length:r*c},(_,i)=>`<circle cx="${i%c*20+16}" cy="${Math.floor(i/c)*20+16}" r="6" fill="${split&&Math.floor(i/c)>=split?'#ba4a22':'#276e96'}"/>`).join('')}${split?`<path d="M4 ${split*20+6} H${c*20+8}" stroke="currentColor" stroke-dasharray="3 3"/>`:''}</svg>`);
const q=(ask,show,a,w,after)=>({ask,show,opts:nums(a,w),after:after||B(`${a}`,`${a}`),cls:'g3-math-options'});
reg('place3','Place Value Builder','자릿값 조립','3.NR.1.1',lv=>{
 const n=lv===1?100+rnd(901):pick([10000,rnd(10001),rnd(10001)]),base=lv===1?100:1000,h=Math.floor(n/base),r=n%base;
 const p=lv>1&&h>0&&rnd(2)?[(h-1)*base,base+Math.floor(r/10)*10,r%10]:[h*base,Math.floor(r/10)*10,r%10];
 return q(B('Combine the parts. What number do they make?','부분을 모두 더하면 어떤 수가 될까요?'),eq(p.join(' + ')),n,[n+100,Math.abs(n-10)],B(`${p.join(' + ')} = ${n}`,`${p.join(' + ')} = ${n}`));
});
reg('compare3','Compare Big Numbers','큰 수 비교','3.NR.1.2',lv=>{
 const a=rnd(lv===1?1001:10001),b=rnd(4)===0?a:rnd(lv===1?1001:10001);
 if(lv>1&&rnd(2)){
 const ns=[...new Set([a,b,a===10000?a-1:a+1,a===0?2:a-1,a>=2?a-2:3])].slice(0,3).sort((x,y)=>x-y);
 return {ask:B('Order the numbers from least to greatest.','수를 작은 수부터 차례로 놓아요.'),show:eq(shuffle(ns).join(' · ')),opts:[ns,[ns[1],ns[0],ns[2]],[...ns].reverse()].map((v,i)=>({html:`<span class="word">${v.join(' → ')}</span>`,ok:i===0})),cls:'words g3-math-options',after:B(ns.join(' < '),ns.join(' < '))};
 }
 return {ask:B('Which sign belongs in the box?','□ 안에 알맞은 기호를 골라요.'),show:eq(`${a} □ ${b}`),opts:['<','=','>'].map(s=>({html:`<span class="num">${s==='<'?'&lt;':s==='>'?'&gt;':s}</span>`,ok:s===(a<b?'<':a>b?'>':'=')})),after:B(`${a} ${a<b?'<':a>b?'>':'='} ${b}`,`${a} ${a<b?'<':a>b?'>':'='} ${b}`)};
});
reg('round3','Near Tens and Hundreds','몇십, 몇백으로 반올림','3.NR.1.3',lv=>{
 const step=lv===1?10:pick([10,100]),n=rnd(lv===1?101:1001),lo=Math.floor(n/step)*step,hi=lo+step,a=Math.floor(n/step+0.5)*step,x=25+(n-lo)/step*250;
 return q(B(`Round to the nearest ${step}. Halfway? Choose the larger multiple.`,`${step===10?'몇십':'몇백'}으로 반올림(rounding)해요. 딱 중간이면 더 큰 수를 골라요.`),panel(`<svg viewBox="0 0 300 100" role="img" aria-label="${lo} — ${n} — ${hi}"><path d="M25 50 H275 M25 42 V58 M275 42 V58" stroke="currentColor" stroke-width="2"/><circle cx="${x}" cy="50" r="6" fill="#ba4a22"/><text x="${x}" y="25" text-anchor="middle">${n}</text><text x="25" y="82" text-anchor="middle">${lo}</text><text x="275" y="82" text-anchor="middle">${hi}</text></svg>`),a,[a===lo?hi:lo,a+step],B(`${n} → ${a}`,`${n} → ${a}`));
});
reg('addsub3','Calculation Strategies','여러 방법으로 계산하기','3.PAR.2.1',lv=>{
 const a=100+rnd(700),b=10+rnd(Math.min(190,1000-a)),minus=!!rnd(2),ans=minus?a-b:a+b;
 // Keep subtraction nonnegative, including the smallest generated minuend.
 const large=Math.max(a,b),small=Math.min(a,b),value=minus?large-small:ans;
 const op=minus?'−':'+',left=minus?large:a,right=minus?small:b;
 return q(B('Find the value. You can split a number into parts.','값을 구해요. 수를 몇백, 몇십, 몇으로 갈라서 계산해도 돼요.'),eq(lv===1?`${left} ${op} ${Math.floor(right/10)*10} ${op} ${right%10}`:`${left} ${op} ${right}`),value,[value+10,Math.abs(value-10)],B(`${left} ${op} ${right} = ${value}`,`${left} ${op} ${right} = ${value}`));
});
reg('barstory3','Bar Stories','막대 그림 문제','3.PAR.2.2',lv=>{
 if(lv===2){const a=10+rnd(80),b=10+rnd(80),sent=1+rnd(9);return q(B(`A shelf has ${a} books and a cart has ${b}. ${sent} are lent out. How many remain?`,`선반에 ${a}권, 수레에 ${b}권이 있어요. ${sent}권을 빌려주면 모두 몇 권이 남나요?`),eq(`${a} + ${b} − ?`),a+b-sent,[a+b,a+b+sent]);}
 const a=10+rnd(lv===1?390:4490),b=10+rnd(lv===1?390:4490),t=a+b,m=rnd(3),ans=[a,b,t][m],v=[a,b,t].map((n,i)=>i===m?'n':n);
 const asks=[B(`There are ${t} books. ${b} are on a cart; the rest are on a shelf. How many on the shelf?`,`책 ${t}권 중 ${b}권은 수레에 있어요. 나머지는 선반에 있어요. 선반에는 몇 권일까요?`),B(`A shelf has ${a} books. More arrive, making ${t}. How many arrived?`,`선반에 책 ${a}권이 있었어요. 책이 더 들어와서 ${t}권이 되었어요. 더 들어온 책은 몇 권일까요?`),B(`A shelf has ${a} books and a cart has ${b}. How many altogether?`,`선반에 책 ${a}권, 수레에 ${b}권이 있어요. 모두 몇 권일까요?`)];
 return q(asks[m],panel(`<div class="g3-bar"><span style="flex:${a}">${v[0]}</span><span style="flex:${b}">${v[1]}</span></div><div>${v[2]}</div>`),ans,[ans+10,ans+100],B(`${a} + ${b} = ${t}`,`${a} + ${b} = ${t}`));
});
reg('array3','Multiplication Arrays','곱셈 배열','3.PAR.3.2',lv=>{
 if(lv===2){const r=2+rnd(7),c=2+rnd(7),removed=1+rnd(c-1);return q(B(`Remove ${removed} dots from this array. How many remain?`,`이 배열에서 점 ${removed}개를 빼면 몇 개가 남나요?`),dots(r,c),r*c-removed,[r*c,r*c+removed]);}
 const r=2+rnd(lv===1?4:8),c=2+rnd(lv===1?4:8);
 return q(B(`${r} rows, ${c} dots in each row. How many dots?`,`점이 한 줄에 ${c}개씩 ${r}줄 있어요. 점은 모두 몇 개일까요?`),dots(r,c),r*c,[r+c,r*c+c],B(`${r} × ${c} = ${r*c}`,`${r} × ${c} = ${r*c}`));
});
reg('divide3','Share and Group','똑같이 나누기','3.PAR.3.2 · 3.PAR.3.6',lv=>{
 const g=2+rnd(7),e=2+rnd(7),t=g*e,share=lv===1||!!rnd(2);
 return q(share?B(`Share ${t} counters equally among ${g} children. How many for each?`,`토큰 ${t}개를 어린이 ${g}명에게 똑같이 나누어 줘요. 한 명이 몇 개씩 가질까요?`):B(`Put ${t} counters in groups of ${e}. How many groups?`,`토큰 ${t}개를 ${e}개씩 묶어요. 몇 묶음일까요?`),eq(`${t} ÷ ${share?g:e} = ?`),share?e:g,[t,t+1]);
});
reg('factfamily3','Related Facts','곱셈과 나눗셈의 관계','3.PAR.3.2',lv=>{
 const a=1+rnd(9),b=1+rnd(9),p=a*b,d=lv>1&&rnd(2);
 return q(B('Use the related fact to find n.','곱셈식과 나눗셈식의 관계를 이용해 n을 구해요.'),eq(d?`${p} ÷ n = ${b}`:`${a} × n = ${p}`),d?a:b,[p,a+b]);
});
reg('splitmultiply3','Split to Multiply','쪼개서 곱하기','3.PAR.3.3',lv=>{
 if(lv===2){const a=2+rnd(3),b=1+rnd(3),c=2+rnd(7),ans=b*c;return q(B(`There are ${a+b} rows of ${c}. The top ${a} rows are packed away. How many dots remain?`,`한 줄에 ${c}개씩 ${a+b}줄이에요. 위 ${a}줄을 치우면 몇 개가 남나요?`),dots(a+b,c,a),ans,[(a+b)*c,a*c],B(`${a+b} × ${c} − ${a} × ${c} = ${ans}`,`${a+b} × ${c} − ${a} × ${c} = ${ans}`));}
 const a=2+rnd(3),b=1+rnd(3),c=2+rnd(lv===1?4:8);
 return q(B('Add the two parts. How many dots altogether?','두 부분을 합쳐요. 점은 모두 몇 개일까요?'),dots(a+b,c,a),(a+b)*c,[a*c,b*c],B(`${a} × ${c} + ${b} × ${c} = ${(a+b)*c}`,`${a} × ${c} + ${b} × ${c} = ${(a+b)*c}`));
});
reg('multiplytens3','Multiply Tens','몇십 곱하기','3.PAR.3.5',lv=>{
 if(lv===2){const packs=2+rnd(7),each=10*(1+rnd(8)),used=1+rnd(9);return q(B(`${packs} packs hold ${each} sheets each. Use ${used} sheets. How many remain?`,`${packs}묶음에 종이가 ${each}장씩 있어요. ${used}장을 쓰면 몇 장이 남나요?`),'',packs*each-used,[packs*each,packs*each+used]);}
 const a=1+rnd(9),b=10*(1+rnd(lv===1?2:9));
 return q(B('How many altogether?','모두 얼마일까요?'),eq(`${a} × ${b}`),a*b,[a*b/10,a+b],B(`${a} × ${b/10} tens = ${a*b}`,`${a} × (10이 ${b/10}개) = 10이 ${a*(b/10)}개 = ${a*b}`));
});
reg('multpattern3','Multiplication Patterns','곱셈 규칙','3.PAR.3.1',lv=>{
 if(lv===2){const k=2+rnd(8),x=2+rnd(7),extra=1+rnd(5);return q(B(`Multiply an input by ${k}, then add ${extra}. What is the output for ${x}?`,`넣은 수에 ${k}를 곱한 뒤 ${extra}를 더해요. ${x}를 넣으면 얼마가 나오나요?`),eq(`${x} → ×${k} → +${extra} → ?`),x*k+extra,[x*k,(x+extra)*k]);}
 const k=2+rnd(lv===1?4:8),x=1+rnd(5),a=(x+3)*k;
 return q(B(`Rule: multiply the input by ${k}. Fill the last output.`,`규칙: 넣은 수 × ${k} = 나온 수. 마지막 칸의 나온 수를 구해요.`),panel(`<table><tr><th>${L(B('In','넣은 수'))}</th>${[x,x+1,x+2,x+3].map(n=>`<td>${n}</td>`).join('')}</tr><tr><th>${L(B('Out','나온 수'))}</th>${[x*k,(x+1)*k,(x+2)*k,'?'].map(n=>`<td>${n}</td>`).join('')}</tr></table>`),a,[a-k,a+k]);
});
reg('balance3','Equal Values','같은 값 저울','3.PAR.3.4',lv=>{
 const a=2+rnd(8),b=2+rnd(8),c=1+rnd(3),value=a*b,truth=!!rnd(2),right=value+(truth?0:pick([-1,1])),sub=lv>1&&rnd(2),expr=sub?`${right+c} − ${c}`:`${c} + ${right-c}`;
 return {ask:B('Do both sides have the same value?','양쪽의 값이 같을까요?'),show:eq(`${a} × ${b} = ${expr}`),opts:[B('Equal','같아요'),B('Not equal','달라요')].map((s,i)=>({html:`<span class="word">${L(s)}</span>`,ok:i===(truth?0:1)})),cls:'words g3-math-options',after:B(`Left: ${value}. Right: ${right}.`,`왼쪽: ${value}, 오른쪽: ${right}`)};
});
reg('multstory3','Multiply and Divide Stories','곱하고 나누는 이야기','3.PAR.3.6–3.7',lv=>{
 const a=2+rnd(8),b=2+rnd(8),t=a*b,d=lv>1&&rnd(2);
 return q(d?B(`${t} cards fill ${a} equal packs. How many cards per pack?`,`카드 ${t}장을 ${a}봉지에 똑같이 담아요. 한 봉지에 몇 장일까요?`):B(`There are ${a} packs with ${b} cards in each. How many cards?`,`봉지 ${a}개에 카드가 ${b}장씩 있어요. 모두 몇 장일까요?`),eq(d?`${t} ÷ ${a} = n`:`${a} × ${b} = n`),d?b:t,[a+b,t+a]);
});
})();
