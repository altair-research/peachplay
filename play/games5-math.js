(() => {
'use strict';
const decks=new Map();
const take=(id,lv)=>{const k=`${id}:${lv}:${S.lang}`;let d=decks.get(k);if(!d){d=shuffle(Array.from({length:12},(_,i)=>i));decks.set(k,d);}const i=d.shift();d.push(i);return i;};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const panel=s=>`<div class="g5-math-model">${s}</div>`,eq=s=>panel(`<div class="g5-math-equation">${s}</div>`);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const f=(n,d)=>{const g=gcd(n,d);return d/g===1?String(n/g):`${n/g}/${d/g}`;};
const clean=x=>typeof x==='number'?String(Number(x.toFixed(8))):String(x);
const q=(ask,show,a,w,after)=>({ask,show,opts:[...new Set([clean(a),...w.map(clean)])].slice(0,3).map((x,i)=>({html:`<span class="word">${esc(x)}</span>`,ok:i===0})),cls:'words g5-math-options',after:after||B(`Answer: ${clean(a)}`,`정답: ${clean(a)}`)});
const nq=(ask,show,a,step=1,after)=>q(ask,show,a,[a+step,a-step],after);
const strip=(n,d)=>`<div class="g5-math-strip" aria-label="${n}/${d}">${Array.from({length:d},(_,i)=>`<span class="${i<n?'filled':''}"></span>`).join('')}</div>`;
const support={};
const scopeFor=id=>support[id];
const reg=(id,en,ko,code,make)=>registerGame({id,grade:'5',subject:'math',icon:'🧮',title:B(en,ko),sub:B('Models and reasoning · partial practice','모형과 추론 · 부분 연습'),practiceScope:scopeFor(id)?B(...scopeFor(id)):undefined,area:B(`Grade 5 Math · ${code}${scopeFor(id)?" · "+scopeFor(id)[0]:""}`,`5학년 수학 · ${code}${scopeFor(id)?" · "+scopeFor(id)[1]:""}`),play(){const lv=lvl(id)>1?2:1,i=take(id,lv),it=make(lv,i);if(i>=10){it.bankGrowth=true;it.cls+=' bank-growth-options';}const scope=scopeFor(id);if(scope){it.show+='<div class="g5-scope">'+L(B(scope[0],scope[1]))+'</div>';}if(S.lang==='ko'&&/[A-Za-z]/.test(it.ask.ko)){it.askSay=B(it.ask.en,'질문과 자료를 보고 답을 골라요. 영어 질문도 들어 보세요.');it.askExtra={t:it.ask.en,lang:'en-US'};}it.itemKey=`${id}:${lv}:${i}`;quiz(this,it);}});
reg('place5','Place Value Relationships','자리 사이의 관계','5.NR.1.1',(lv,i)=>{
 const digit=1+i%5,base=10**(1+Math.floor(i/5)),left=digit*base,right=digit*base/10;
 if(lv===1){const reverse=i>=5,a=reverse?right:left,b=reverse?left:right;return q(B('The first value is what multiple of the second?','첫째 값은 둘째 값의 몇 배일까요?'),eq(`${a} : ${b}`),reverse?'1/10':'10',['100',reverse?'10':'1/10'],B(`${b} × ${reverse?'1/10':'10'} = ${a}`,`${b} × ${reverse?'1/10':'10'} = ${a}`));}
 const small=digit*(i%2?100:10),big=digit*(i>=10?10000:1000),div=big/small;
 return q(B('Choose the relationship from the larger value to the smaller.','큰 자릿값에서 작은 자릿값으로 가는 관계를 골라요.'),eq(`${big} → ${small}`),`÷ ${div}`,[`× ${div}`,`÷ ${div===10?100:10}`],B('Each step right gives one tenth of the value.','오른쪽으로 한 자리 갈 때마다 값은 10분의 1이 돼요.'));
});
reg('power5','Powers of Ten','10의 거듭제곱','5.NR.1.2',(lv,i)=>{
 const n=(lv===1?[12,34,56,78,91,23,45,67,89,16,28,49]:[125,240,375,408,560,625,704,815,936,990,352,468])[i],p=lv===1?1+i%2:2+i%2,div=i>=5,scale=10**p,a=div?n/scale:n*scale;
 if(lv===2)return nq(B('Apply both operations. Find the final value.','두 연산을 차례로 적용해 마지막 값을 구해요.'),eq(`(${n} ${div?'÷':'×'} 10<sup>${p}</sup>) ${div?'×':'÷'} 10`),div?a*10:a/10,div?1/scale:scale);
 return nq(B('Find the value using powers of ten.','10의 거듭제곱을 이용해 값을 구해요.'),eq(`${n} ${div?'÷':'×'} 10<sup>${p}</sup>`),a,div?1/scale:scale,B(`10^${p} = ${scale}; result = ${a}`,`10의 ${p}제곱: ${scale} · 계산한 값: ${a}`));
});
reg('multiply5','Partial Products','부분곱으로 계산해요','5.NR.2.1',(lv,i)=>{
 const [a,b]=(lv===1?[[24,6],[35,4],[48,3],[62,5],[79,2],[86,7],[93,8],[57,9],[41,6],[68,4],[73,5],[54,8]]:[[124,12],[205,15],[316,24],[407,18],[528,21],[630,14],[742,25],[853,16],[964,13],[109,22],[235,16],[462,23]])[i],h=Math.floor(a/10)*10,t=a%10;
 if(lv===2)return nq(B('A partial product is missing. Find it.','부분 곱 하나가 빠졌어요. 빠진 값을 구해요.'),eq(`${a} × ${b} = ${h*b} + ?`),t*b,b);
 return nq(B('Combine the partial products.','부분곱을 합쳐서 전체 곱을 구해요.'),panel(`<div class="g5-math-area"><span>${h} × ${b}</span><span>${t} × ${b}</span></div><div>${a} × ${b}</div><small>${L(B('Area model; not to scale','넓이 모형 · 실제 비율이 아니에요'))}</small>`),a*b,b,B(`${h*b} + ${t*b} = ${a*b}`,`${h*b} + ${t*b} = ${a*b}`));
});
reg('divide5','Division Strategies','나눗셈 전략','5.NR.2.2',(lv,i)=>{
 const [a,b]=(lv===1?[[144,6],[168,7],[192,8],[225,9],[156,4],[285,5],[174,3],[248,8],[336,7],[432,6],[378,9],[416,8]]:[[1440,12],[2250,15],[2880,24],[3640,20],[4250,25],[1728,16],[3192,21],[4050,18],[2464,22],[2990,23],[3456,24],[3870,30]])[i];
 if(lv===2)return nq(B(`Divide ${a} objects equally into ${b} boxes, then remove 3 from each box. How many remain in each?`,`${a}개를 ${b}상자에 똑같이 나눈 뒤 각 상자에서 3개씩 꺼내요. 한 상자에 몇 개 남을까요?`),eq(`${a} ÷ ${b}, then −3`),a/b-3);
 return nq(B('How many equal groups?','같은 크기로 나누면 몇 묶음일까요?'),eq(`${a} ÷ ${b} = ?`),a/b,1,B(`${a/b} × ${b} = ${a}`,`${a/b} × ${b} = ${a}`));
});
reg('remainder5','Remainders in Stories','나머지는 무엇일까요?','5.NR.2.2',(lv,i)=>{
 const b=3+i%5,n=(4+i)*b+1+i%(b-1),r=n%b;
 if(lv===1)return nq(B(`${n} objects, ${b} per full box. How many left?`,`물건 ${n}개를 상자마다 ${b}개씩 담아요. 꽉 찬 상자에 담고 나면 몇 개가 남을까요?`),eq(`${n} ÷ ${b}`),r,1,B(`${Math.floor(n/b)} full boxes; ${r} left.`,`꽉 찬 상자 ${Math.floor(n/b)}개와 남은 물건 ${r}개예요.`));
 if(i%3===0)return nq(B(`${n} riders; ${b} seats per van, and everyone needs a seat. How many vans?`,`${n}명이 타고 차 한 대에 ${b}자리예요. 모두 앉으려면 차가 몇 대 필요할까요?`),eq(`${n} ÷ ${b}`),Math.ceil(n/b),1,B('An extra van carries the remaining riders.','남은 사람도 타려면 차 한 대가 더 필요해요.'));
 if(i%3===1)return nq(B(`${n} cards, ${b} per complete set. Count only complete sets.`,`카드 ${n}장을 ${b}장씩 묶어요. 완전한 묶음만 세면 몇 묶음일까요?`),eq(`${n} ÷ ${b}`),Math.floor(n/b),1,B(`Keep ${r} leftover cards separate.`,`남은 카드 ${r}장은 따로 두어요.`));
 return q(B(`Share ${n} liters among ${b} containers equally. Liters per container?`,`${n}리터를 통 ${b}개에 똑같이 나눠요. 한 통에는 몇 리터일까요?`),eq(`${n} ÷ ${b}`),f(n,b),[Math.floor(n/b),Math.ceil(n/b)],B('Liquid can be divided further.','액체는 더 작게 나눌 수 있어요.'));
});
reg('fractiondivision5','Fractions Are Division','분수는 나눗셈이에요','5.NR.3.1',(lv,i)=>{
 const [n,d]=(lv===1?[[1,2],[2,3],[3,4],[2,5],[4,5],[3,8],[5,6],[1,4],[5,8],[4,7],[7,9],[5,12]]:[[7,3],[9,4],[11,5],[13,6],[8,3],[10,4],[17,8],[19,6],[14,5],[16,7],[23,8],[25,9]])[i];
 if(lv===2)return q(B(`Share ${n} loaves among ${d} people, and each person eats half their share. How many loaves remain per person?`,`빵 ${n}개를 ${d}명이 똑같이 나눠요. 각자 자기 몫의 절반을 먹으면 한 명에게 빵 몇 개가 남을까요?`),eq(`${n} ÷ ${d}, then half`),f(n,2*d),[f(n,d),f(2*n,d)]);
 return q(B(`Share ${n} identical loaves among ${d} people equally. Loaves per person?`,`같은 크기 빵 ${n}개를 ${d}명에게 똑같이 나눠요. 한 명의 몫은 빵 몇 개일까요?`),eq(`${n} ÷ ${d}`),f(n,d),[f(d,n),f(n+1,d)],B(`${n} ÷ ${d} = ${f(n,d)}`,`${n} ÷ ${d} = ${f(n,d)}`));
});
reg('fractionorder5','Order Fractions','분수 순서','5.NR.3.2',(lv,i)=>{
 const [a,b,c,d]=(lv===1?[[1,2,2,3],[2,5,1,3],[3,4,5,8],[1,6,2,9],[4,5,5,6],[3,7,4,9],[2,3,3,5],[5,12,1,2],[3,8,2,5],[7,10,2,3],[5,9,3,4],[7,12,4,7]]:[[1,3,3,8],[4,7,5,8],[5,6,7,9],[3,5,7,12],[4,9,5,12],[7,8,8,9],[5,11,4,9],[7,12,5,9],[9,10,8,9],[5,7,7,10],[4,5,5,6],[5,8,7,12]])[i];
 if(lv===1)return q(B('Compare. All wholes have equal size.','전체 크기는 같아요. 알맞은 비교를 골라요.'),panel(`${f(a,b)}${strip(a,b)}${f(c,d)}${strip(c,d)}`),a*d<c*b?'<':'>',[a*d<c*b?'>':'<','='],B(`${f(a,b)} ${a*d<c*b?'<':'>'} ${f(c,d)}`,`${f(a,b)} ${a*d<c*b?'<':'>'} ${f(c,d)}`));
 const labels=[[a,b],[c,d],[1,2]].sort((x,y)=>x[0]*y[1]-y[0]*x[1]).map(x=>f(...x)),ans=labels.join(' < ');
 return q(B('Order from least to greatest.','작은 수부터 큰 수까지 차례로 놓은 보기를 골라요.'),eq(shuffle(labels).join(' · ')),ans,[[...labels].reverse().join(' < '),[labels[1],labels[0],labels[2]].join(' < ')],B(ans,ans));
});
const pairs=[[[1,2,1,3],[1,4,1,6],[2,5,1,3],[1,3,1,4],[3,8,1,4],[2,7,1,2],[1,5,1,2],[3,10,1,4],[1,6,2,5],[2,9,1,3],[3,7,1,4],[5,12,1,3]],[[3,4,2,3],[4,5,3,4],[5,6,3,5],[7,8,2,3],[5,7,4,5],[4,7,5,6],[7,9,3,4],[5,8,4,7],[8,9,2,5],[6,7,5,8],[7,10,5,6],[9,10,3,7]]];
reg('fractionadd5','Add Unlike Fractions','분모가 다른 분수 더하기','5.NR.3.3',(lv,i)=>{
 const [a,b,c,d]=pairs[lv-1][i],den=b*d,ans=f(a*d+c*b,den);
 if(lv===2)return q(B('Join the two ribbon lengths, then use 1/2 meter. How many meters remain?','두 리본을 이은 뒤 1/2미터를 써요. 남은 길이는 몇 미터일까요?'),eq(`${f(a,b)} + ${f(c,d)}, then −1/2`),f(2*(a*d+c*b)-den,2*den),[ans,f(2*(a*d+c*b)+den,2*den)]);
 return q(B(lv===1?'Add. The strips use the same whole.':'Join two ribbon lengths. Total meters?',lv===1?'전체 크기가 같은 분수 띠예요. 합을 구해요.':'두 리본 길이를 이어요. 전체 길이는 몇 미터일까요?'),panel(`${f(a,b)} + ${f(c,d)}${strip(a,b)}${strip(c,d)}`),ans,[f(Math.abs(a*d-c*b),den),f(a+c,b+d)],B(`${a*d}/${den} + ${c*b}/${den} = ${ans}`,`조각 크기를 맞춰요: ${a*d}/${den} + ${c*b}/${den} = ${ans}`));
});
reg('fractionsub5','Subtract Unlike Fractions','분모가 다른 분수 빼기','5.NR.3.3',(lv,i)=>{
 const [a,b,c,d]=pairs[lv-1][i],large=a*d>=c*b?[a,b]:[c,d],small=a*d>=c*b?[c,d]:[a,b],ans=f(Math.abs(a*d-c*b),b*d);
 if(lv===2)return q(B('Find the difference, then divide that remaining ribbon into two equal pieces. Meters per piece?','두 길이의 차이만큼 남은 리본을 다시 똑같이 둘로 나눠요. 한 조각은 몇 미터일까요?'),eq(`(${f(...large)} − ${f(...small)}) ÷ 2`),f(Math.abs(a*d-c*b),2*b*d),[ans,f(a*d+c*b,2*b*d)]);
 return q(B(lv===1?'Subtract using equal-size parts.':'Cut away the smaller ribbon length. Meters left?',lv===1?'조각 크기를 같게 해서 빼요.':'더 작은 길이만큼 잘라요. 몇 미터가 남을까요?'),eq(`${f(...large)} − ${f(...small)}`),ans,[f(a*d+c*b,b*d),f(Math.abs(a-c)+1,b+d)],B(`Difference: ${ans}`,`차: ${ans}`));
});
reg('mixed5','Regroup Mixed Numbers','대분수를 더하고 빼요','5.NR.3.3',(lv,i)=>{
 const w=2+i,b=3+i%4,c=2+i%3,n=w*b+1;
 if(lv===1){const ans=f(n*c+b,b*c);return q(B('Add the mixed number and fraction.','대분수와 분수를 더해요.'),eq(`${w} 1/${b} + 1/${c}`),ans,[f(n*c-b,b*c),f(n+1,b)],B(`Total: ${ans}`,`합: ${ans}`));}
 const ans=f(n*2-3*b,b*2);return q(B('Subtract 1 1/2. Regroup one whole if needed.','1과 1/2을 빼요. 필요하면 자연수 1을 분수로 바꿔요.'),eq(`${w} 1/${b} − 1 1/2`),ans,[f(n*2+3*b,b*2),f((w-1)*b*2+1,b*2)],B(`One whole is ${b}/${b}. Difference: ${ans}`,`자연수 1 = ${b}/${b} · 차: ${ans}`));
});
reg('fractionmultiply5','Fractions of Whole Numbers','자연수의 분수만큼','5.NR.3.4',(lv,i)=>{
 const n=lv===1?2+i%5:12+i*3,a=lv===1?1+i%2:2+i%3,b=lv===1?3+i%3:5+i%4,ans=f(n*a,b);
 if(lv===2)return q(B(`Use ${a}/${b} of a ${n}-meter roll. How many meters are LEFT?`,`${n}미터 리본의 ${a}/${b}만큼 써요. 남은 길이는 몇 미터일까요?`),eq(`${n} − (${n} × ${a}/${b})`),f(n*(b-a),b),[f(n*(b-a)+1,b),f(n*(b-a)-1,b)]);
 return q(B(lv===1?`${n} groups of ${a}/${b}. Total?`:`Use ${a}/${b} of a ${n}-meter roll. Meters used?`,lv===1?`${a}/${b}만큼씩 ${n}묶음 있어요. 모두 얼마일까요?`:`${n}미터 리본의 ${a}/${b}만큼 써요. 몇 미터일까요?`),eq(`${n} × ${a}/${b}`),ans,[f(i>=10?n*a+1:n+a,b),f(n*a,b+1)],B(`${n} × ${a}/${b} = ${ans}`,`${n} × ${a}/${b} = ${ans}`));
});
reg('scale5','Scaling by Fractions','곱해서 커지거나 작아져요','5.NR.3.5 (partial)',(lv,i)=>{
 const n=lv===1?5+i:20+i,d=2+i%4,a=lv===1?(i%2?d+1:d-1):[d-1,d,d+2][i%3],idx=a<d?0:a===d?1:2,relations=[B('Smaller','더 작아요'),B('Equal','같아요'),B('Larger','더 커요')],reasons=[B('Factor < 1','곱하는 수가 1보다 작아요'),B('Factor = 1','곱하는 수가 1이에요'),B('Factor > 1','곱하는 수가 1보다 커요')];
 return {ask:B(lv===1?'Compare the product with the positive start.':'Choose the reason for the change in size.',lv===1?'곱한 값과 처음의 양수(0보다 큰 수)를 비교해요.':'곱한 값의 크기를 설명하는 이유를 골라요.'),show:eq(`${n} × ${a}/${d}`),opts:(lv===1?relations:reasons).map((x,j)=>({html:`<span class="word">${esc(L(x))}</span>`,ok:j===idx})),cls:'words g5-math-options',after:B(`${relations[idx].en}: ${reasons[idx].en}`,`${relations[idx].ko} ${reasons[idx].ko}`)};
});
reg('unitdivide5','Divide a Unit Fraction','단위분수를 나누어요','5.NR.3.6',(lv,i)=>{
 const b=lv===1?2+i%5:3+i%5,n=lv===1?2+Math.floor(i/5):3+Math.floor(i/5),a=f(1,b*n);
 if(lv===2)return q(B(`Share 1/${b} liter equally among ${n} cups, then pour two cups into one jar. How many liters are in the jar?`,`1/${b}리터를 컵 ${n}개에 똑같이 나눠요. 두 컵의 물을 병 하나에 부으면 몇 리터일까요?`),eq(`(1/${b} ÷ ${n}) × 2`),f(2,b*n),[a,f(2*n,b)]);
 return q(B(lv===1?'Share this unit fraction equally.':'Share this fraction of a liter equally among cups. Liters per cup?',lv===1?'단위분수를 똑같이 나눠요.':'이만큼의 액체를 컵에 똑같이 나눠요. 한 컵에는 몇 리터일까요?'),panel(`1/${b} ÷ ${n}${strip(1,b)}`),a,[f(n,b),f(1,b+n)],B(`1/${b} ÷ ${n} = ${a}`,`1/${b} ÷ ${n} = ${a}`));
});
reg('wholeunitdivide5','Count Fraction Groups','단위분수 몇 묶음일까요?','5.NR.3.6',(lv,i)=>{
 const n=1+i%5,b=lv===1?(i<5?2:i<10?4:8):(i<5?3:i<10?5:6);
 if(lv===2)return nq(B(`Cut ${n} meter${n>1?'s':''} into 1/${b}-meter pieces and use two pieces. How many pieces remain?`,`${n}미터를 1/${b}미터씩 잘라요. 두 조각을 쓰면 몇 조각 남을까요?`),eq(`(${n} ÷ 1/${b}) − 2`),n*b-2);
 return nq(B(lv===1?'How many unit-fraction groups fit?':`${n} meters, cut into 1/${b}-meter pieces. How many pieces?`,lv===1?'단위분수가 몇 묶음 들어갈까요?':`${n}미터를 1/${b}미터씩 잘라요. 몇 조각일까요?`),eq(`${n} ÷ 1/${b}`),n*b,1,B(`${n} × ${b} = ${n*b}`,`자연수 1에 ${b}묶음이 있어요. ${n} × ${b} = ${n*b}`));
});
})();
