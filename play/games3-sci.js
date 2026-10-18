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
// Fact sources and limits are documented in docs/review/codex-done-10.md.
const reg=(id,en,ko,code,make)=>registerGame({id,grade:'3',subject:'sci',icon:'🔬',title:B(en,ko),sub:B('Observe, compare and use evidence','관찰하고 비교하며 근거를 찾아요'),area:B(`Grade 3 Science · ${code}`,`3학년 과학 · ${code}`),play(){quiz(this,fresh(id,lvl(id),make));}});
const panel=s=>`<div class="g3-science">${s}</div>`;
const opts=(r,w)=>[r,...w].map((s,i)=>({html:`<span class="word">${typeof s==='object'?L(s):s}</span>`,ok:i===0}));
const q=(ask,show,r,w,after)=>({ask,show,opts:opts(r,w),cls:'words g3-science-options',after:after|| (typeof r==='object'?r:B(String(r),String(r)))});
const table=(head,rows)=>panel(`<table><thead><tr>${head.map(s=>`<th>${L(s)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(s=>`<td>${typeof s==='object'?L(s):s}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
const bank=(id,en,ko,code,rows)=>reg(id,en,ko,code,lv=>{const r=pick([...(lv===1?rows.slice(0,2):rows),...moreScience[id]]);return q(r[0],r[1]?panel(L(r[1])):'',r[2],r.slice(3));});
const made=B('Practice observations (made up)','연습용 가상 관찰');
reg('rocksort3','Rock Observations','암석 관찰','S3E1.a',lv=>{
 const labels=shuffle(['A','B','C']),rough=B('rough','거칠어요'),smooth=B('smooth','매끈해요'),red=pick([B('red','빨강'),B('brown','갈색'),B('white','흰색'),B('black','검정'),B('pink','분홍')]),gray=B('gray','회색');
 return q(lv===1?B('Which sample is rough?','표면이 거친 표본은?'):B(`Which sample is BOTH ${red.en} and smooth?`,`색이 ${red.ko}이면서 표면이 매끈한 표본은?`),table([made,B('Color','색'),B('Texture','질감')],[[labels[0],red,rough],[labels[1],red,smooth],[labels[2],gray,smooth]]),lv===1?labels[0]:labels[1],lv===1?[labels[1],labels[2]]:[labels[0],labels[2]],B('Describe properties; color alone does not identify a rock.','성질을 관찰해요. 색만으로 암석 이름을 알 수는 없어요.'));
});
bank('rocktest3','Choose an Observation','관찰 방법 고르기','S3E1.a',[
 [B('Which test compares hardness?','단단한 정도를 비교하는 방법은?'),null,B('Compare resistance to scratching','긁힘에 견디는 정도 비교'),B('Compare color in a picture','사진의 색 비교'),B('Compare the surface texture','표면 질감 비교')],
 [B('Which observation describes luster?','광택을 살펴보는 방법은?'),null,B('Look at reflected light','반사되는 빛 살펴보기'),B('Feel the surface texture','표면 질감 살펴보기'),B('Test scratch resistance','긁힘에 견디는 정도 살펴보기')],
 [B('How can we compare scratch tests fairly?','긁기 실험을 공정하게 하려면?'),B('An adult tests two samples.','어른이 표본 두 개를 긁어 봐요.'),B('Use the same tool and method','같은 도구와 방법 사용'),B('Use a different tool for each','각각 다른 도구 사용'),B('Guess from color only','색만 보고 짐작')]]);
reg('soil3','Soil Evidence','흙의 성질','S3E1.b',lv=>{
 const sand=40+rnd(20),clay=10+rnd(15),loam=25+rnd(10);
 if(lv===1)return q(B('Which sample has the most sand in this data?','이 자료에서 모래가 가장 많은 표본은?'),...(()=>{const k=shuffle(['A','B','C']);return [table([made,B('Sand parts / 100','모래 양(100 중)')],[[k[0],sand+30],[k[1],clay],[k[2],loam]].sort((x,y)=>x[0].localeCompare(y[0]))),k[0],[k[1],k[2]]];})());
 if(lv===2){const x=2+rnd(8),y=x+2+rnd(5),z=y+2+rnd(5);return q(B('Same starting height. Which plant grew more than A but less than C?','처음 키가 같아요. A보다 더 자랐지만 C보다는 덜 자란 식물은?'),table([made,B('Start cm','처음 cm'),B('End cm','끝 cm')],[['A',5,5+x],['B',5,5+y],['C',5,5+z]]),'B',['A','C']);}
 return q(B('Same plant type and conditions. Which grew tallest in THIS trial?','같은 종류의 식물을 같은 조건에서 길렀어요. 이번 실험에서 가장 크게 자란 것은?'),...(()=>{const k=shuffle(['A','B','C']);return [table([made,B('Height (cm)','키(cm)')],[[k[0],clay],[k[1],sand],[k[2],loam]].sort((x,y)=>x[0].localeCompare(y[0]))),k[1],[k[0],k[2]]];})(),B('This trial does not prove one soil is best for every plant.','한 번의 실험으로 모든 식물에 가장 좋은 흙을 정할 수는 없어요.'));
});
reg('soilwater3','Soil and Water','흙과 물','S3E1.b',lv=>{
 const input=100,a=20+rnd(15),b=60+rnd(15),c=40+rnd(10),labels=shuffle(['A','B','C']),rows=[[labels[0],a],[labels[1],b],[labels[2],c]].sort((x,y)=>x[0].localeCompare(y[0]));
 if(lv===1)return q(B('Each dry soil gets 100 mL of water. Only drainage removes water. Which keeps the most?','마른 흙마다 물 100mL를 부어요. 아래로 빠진 물만 줄었어요. 물이 가장 많이 남은 흙은?'),table([made,B('Drained (mL)','빠진 물(mL)')],rows),labels[0],[labels[1],labels[2]],B('Less drained out, so more remained in this trial.','이번 실험에서는 적게 빠진 쪽에 더 많이 남았어요.'));
 const i=rnd(3),drained=[a,b,c][i];
 return q(B(`Each gets 100 mL; only drainage removes water. How many mL stay in soil ${labels[i]}?`,`흙마다 물 100mL를 부었고 아래로 빠진 물만 줄었어요. 흙 ${labels[i]}에 남은 물은 몇 mL일까요?`),table([made,B('Drained (mL)','빠진 물(mL)')],rows),input-drained,[drained,input-drained+10],B(`100 − ${drained} = ${100-drained} mL`,`100 − ${drained} = ${100-drained}mL`));
});
bank('erosion3','Moving Earth','흙의 이동','S3E1.c',[
 [B('What moved the sand in this observation?','이 관찰에서 모래를 옮긴 것은?'),B('Wind blew. Sand grains traveled across the tray.','바람이 불자 모래 알갱이가 쟁반을 가로질러 이동했어요.'),B('Wind','바람'),B('A growing root','자라는 뿌리'),B('Freezing water','어는 물')],
 [B('Which observation shows erosion?','침식(erosion)이 일어난 관찰은? 침식은 흙이나 돌이 깎여 옮겨지는 거예요.'),null,B('Flowing water carries soil away','흐르는 물이 흙을 옮겨요'),B('A rock cracks in place','돌이 제자리에서 갈라져요'),B('A pebble stays in a jar','자갈이 통 안에 그대로 있어요')],
 [B('What is the evidence of movement?','이동했다는 근거는?'),B('Before rain: soil on a slope. After rain: soil collected downhill.','비 오기 전에는 비탈에 흙이 있었어요. 비 온 뒤에는 아래쪽에 흙이 쌓였어요.'),B('Soil collected downhill','아래쪽에 흙이 쌓였어요'),B('A crack widened in place','제자리에서 틈이 넓어졌어요'),B('A rock stayed on the slope','돌이 비탈에 그대로 있어요')]]);
bank('fossilclue3','Fossil Clues','화석 단서','S3E2.a',[
 [B('Which is a trace fossil?','흔적 화석(trace fossil)은 어느 것일까요? 옛 생물이 살면서 남긴 흔적이 굳은 화석이에요.'),null,B('An ancient footprint preserved in rock','암석에 남은 옛 발자국'),B('A footprint made today in mud','오늘 진흙에 찍은 발자국'),B('An ancient shell preserved in rock','암석에 보존된 옛 조개껍데기')],
 [B('What can a fossil give evidence about?','화석으로 무엇을 알아볼 수 있나요?'),null,B('Life long ago','아주 오래전 생물'),B('The rock’s exact age without other tests','다른 검사 없이 암석의 정확한 나이'),B('The animal’s exact body color','동물 몸의 정확한 색')],
 [B('What does this evidence support?','이 근거로 알 수 있는 것은?'),B('A marine shell fossil was found in a rock layer on land.','육지의 암석층에서 바다 조개 화석을 찾았어요.'),B('A marine animal lived long ago','오래전에 바다 생물이 살았어요'),B('This spot must be underwater today','이곳은 지금도 바닷속이 분명해요'),B('Every fossil is a dinosaur','모든 화석은 공룡이에요')]]);
bank('fossilorder3','Fossil Model','화석 모형','S3E2.b',[
 [B('In this model, what comes next?','이 모형에서 다음 단계는?'),B('A shell rests on the bottom. Sediment begins to pile up.','조개껍데기가 바닥에 있어요. 퇴적물(흙, 모래 등)이 쌓이기 시작해요.'),B('Sediment covers the shell','퇴적물이 껍데기를 덮어요'),B('Waves wash the shell away','물결이 껍데기를 쓸어 가요'),B('The shell breaks on the surface','껍데기가 표면에서 부서져요')],
 [B('Which can improve the chance of preservation?','보존될 가능성을 높일 수 있는 것은?'),null,B('Rapid burial in sediment','퇴적물에 빨리 묻히기'),B('Complete decay','완전히 썩어 없어지기'),B('Being eaten completely','전부 먹혀 없어지기')],
 [B('Which statement fits the fossil model?','화석 모형에 맞는 설명은?'),null,B('Not every organism becomes a fossil','모든 생물이 화석으로 남는 것은 아니에요'),B('Every dead organism becomes a fossil','죽은 생물은 모두 화석이 돼요'),B('All fossils form in one day','모든 화석은 하루 만에 생겨요')]]);
reg('habitat3','Georgia Habitat Notes','조지아 서식지','S3L1.a',lv=>{
 const rows=habitatNotes, r=pick(rows);
 return q(lv===1?B('Which feature matches this Georgia region note?','이 조지아 지역 기록에 맞는 특징은?'):B('Which comparison follows from these region notes?','두 지역 기록을 비교하면 알 수 있는 것은?'),panel(L(lv===1?r[0]:r[4])),lv===1?r[1]:r[5],lv===1?r.slice(2,4):r.slice(6,8));
});
bank('adaptation3','Features for Living','살아가는 특징','S3L1.b',[
 [B('What helps a beaver push through water?','비버가 물을 밀며 헤엄치도록 돕는 특징은?'),B('Beavers have webbed hind feet.','비버의 뒷발에는 물갈퀴가 있어요.'),B('Webbed hind feet','뒷발의 물갈퀴'),B('Sharp front teeth','날카로운 앞니'),B('Thick fur','두꺼운 털')],
 [B('Which function matches webbed feet?','물갈퀴가 있는 발의 쓰임은?'),null,B('Pushing water while swimming','헤엄칠 때 물을 밀기'),B('Cutting branches','나뭇가지 자르기'),B('Keeping body heat in','몸의 열 지키기')],
 [B('Which connects a feature with its function?','특징과 쓰임을 바르게 이은 것은?'),null,B('Webbed feet help beavers swim','물갈퀴가 비버의 헤엄을 도와요'),B('Sharp teeth keep a beaver warm','날카로운 이가 비버를 따뜻하게 해요'),B('Thick fur helps cut wood','두꺼운 털이 나무를 잘라요')]]);
bank('survival3','A Place to Live','살 수 있는 곳','S3L1.c',[
 [B('Which site meets BOTH listed needs?','적힌 두 가지 조건을 모두 갖춘 곳은?'),B('For this beaver model: water and woody plants. Site A has both. Site B is dry.','이 비버 모형의 조건: 물과 나무. A에는 둘 다 있고 B는 말라 있어요.'),B('Site A','장소 A'),B('Site B','장소 B'),B('Neither site','둘 다 아니에요')],
 [B('What is missing at this model site?','이 모형 장소에서 부족한 것은?'),B('Needs: water and woody plants. The site has trees but no water.','필요 조건: 물과 나무. 이곳에는 나무만 있고 물은 없어요.'),B('Water','물'),B('Trees','나무'),B('Both are already there','이미 둘 다 있어요')],
 [B('What conclusion fits the evidence?','근거에 맞는 결론은?'),B('Two beaver sites both have water and woody plants. We have not checked other needs.','비버 모형의 두 장소 모두 물과 나무가 있어요. 다른 조건은 아직 살펴보지 않았어요.'),B('Both meet the two checked needs','둘 다 확인한 두 조건은 갖췄어요'),B('Survival is guaranteed at both','둘 다 생존이 보장돼요'),B('Neither has water','둘 다 물이 없어요')]]);
bank('pollution3','Pollution Records','오염 기록','S3L2.a',[
 [B('Which material received the pollution directly?','오염 물질이 직접 들어간 곳은?'),B('Practice record: oil spilled into a pond.','연습용 기록: 연못에 기름이 흘러들었어요.'),B('Water','물'),B('Air','공기'),B('Land','땅')],
 [B('Which record describes air pollution?','공기 오염을 나타내는 기록은?'),null,B('Dirty smoke entered the air','더러운 연기가 공기 중에 퍼졌어요'),B('Oil entered a stream','기름이 개울에 들어갔어요'),B('Trash was buried in soil','쓰레기가 흙에 묻혔어요')],
 [B('Which observation directly supports water pollution?','물 오염을 직접 뒷받침하는 관찰은?'),B('Practice notes: oil floats on pond water; a bench is brown; birds sing.','연습용 기록: 연못에 기름이 떠 있어요. 벤치는 갈색이에요. 새가 노래해요.'),B('Oil floats on the water','물에 기름이 떠 있어요'),B('Dust is beside the pond','연못 옆에 먼지가 있어요'),B('Smoke is above the pond','연못 위에 연기가 있어요')]]);
bank('conserve3','Protect Resources','자원 지키기','S3L2.b',[
 [B('Which action reuses an item?','물건을 다시 사용하는 행동은?'),null,B('Use a clean jar to store pencils','깨끗한 통에 연필 보관하기'),B('Throw away the clean jar','깨끗한 통 버리기'),B('Buy a jar and never use it','통을 사서 전혀 안 쓰기')],
 [B('Which action reduces paper use?','종이를 덜 쓰는 방법은?'),null,B('Use both sides when suitable','쓸 수 있을 때 종이 양면 쓰기'),B('Use a new page for each word','낱말 하나마다 새 종이 쓰기'),B('Throw away unused pages','안 쓴 종이 버리기')],
 [B('Before putting an item in a recycling bin, what should you check?','재활용 통에 넣기 전에 무엇을 확인하나요?'),null,B('Local rules for accepted materials','우리 지역에서 받는 재활용품'),B('Only whether it is clean','깨끗한지만'),B('Only the recycling symbol','재활용 표시만')]]);
bank('heatsource3','Sources of Heat','열은 어디에서 올까요?','S3P1.a',[
 [B('What supplies energy that warms a sunlit bench?','햇빛 받는 벤치를 데우는 에너지는 어디서 오나요?'),null,B('The Sun','태양'),B('The surrounding air','주변 공기'),B('The cool ground','차가운 땅')],
 [B('What warms your hands as you rub them?','손을 서로 비빌 때 따뜻해지는 까닭은?'),null,B('Friction from rubbing','비빌 때 생기는 마찰(friction)'),B('Heat from nearby air','주변 공기에서 온 열'),B('Heat from sunlight alone','햇빛에서만 온 열')],
 [B('Which is producing heat in this scene?','이 장면에서 열을 내는 것은?'),B('An electric heater is on. An unplugged lamp stands nearby.','전기 난방기가 켜져 있어요. 옆의 전등은 플러그가 빠져 있어요.'),B('The working heater','켜진 난방기'),B('The unplugged lamp','플러그가 빠진 전등'),B('The switched-off toaster','꺼진 토스터')]]);
reg('temperature3','Read a Thermometer','온도 읽기','S3P1.b',lv=>{
 if(lv===2){const a=10+rnd(40),b=a+1+rnd(12);return q(B('How many degrees did the temperature rise?','온도가 몇 도 올랐나요?'),table([made,B('Start °C','처음 °C'),B('End °C','끝 °C')],[[B('Water','물'),a,b]]),`${b-a}°C`,[`${b}°C`,`${b+a}°C`]);}
 const unit=lv===1?'°C':pick(['°C','°F']),base=unit==='°C'?0:40,step=lv===1?pick([5,10]):5,index=1+rnd(8),value=base+index*step;
 const visual=panel(`<svg viewBox="0 0 250 185" role="img" aria-label="${L(B('Thermometer','온도계'))}"><rect x="80" y="12" width="24" height="152" fill="#fff" stroke="#234"/><rect x="85" y="${160-index*18}" width="14" height="${index*18}" fill="#b84120"/>${Array.from({length:9},(_,i)=>`<path d="M104 ${160-i*18} H118" stroke="#234"/><text x="126" y="${165-i*18}">${base+i*step}</text>`).join('')}<text x="180" y="35">${unit}</text></svg>`);
 return q(B(`What temperature does it show in ${unit}?`,`온도계가 가리키는 온도는 몇 ${unit}일까요?`),visual,`${value}${unit}`,[`${value+step}${unit}`,`${value-step}${unit}`]);
});
reg('sundata3','Sunlight Data','햇빛 실험','S3P1.b',lv=>{
 const start=20+rnd(5),sun=start+8+rnd(7),shade=start+1+rnd(4);
 const show=table([made,B('Start °C','처음 °C'),B('After 10 min °C','10분 뒤 °C')],[[B('Sun','햇빛'),start,sun],[B('Shade','그늘'),start,shade]]);
 const warmer=!!rnd(2),target=!!rnd(2),light=B('Sunlit block','햇빛을 받은 블록'),cover=B('Shaded block','그늘에 둔 블록');
 return lv===1?q(warmer?B('Identical blocks. Which ended warmer in this trial?','똑같은 블록 두 개예요. 이번 실험에서 끝 온도가 더 높은 것은?'):B('Identical blocks. Which ended cooler in this trial?','똑같은 블록 두 개예요. 이번 실험에서 끝 온도가 더 낮은 것은?'),show,warmer?light:cover,[warmer?cover:light,B('Same temperature','같은 온도')]):q(target?B('How many °C did the SUNLIT block warm?','햇빛을 받은 블록의 온도는 몇 °C 올랐나요?'):B('How many °C did the SHADED block warm?','그늘에 둔 블록의 온도는 몇 °C 올랐나요?'),show,(target?sun:shade)-start,[(target?sun:shade),(target?sun:shade)-start+1]);
});
reg('sunshade3','Shade Design Lab','그늘 설계 실험실','S3P1.c',lv=>{
 const roof=!!rnd(2),correct=roof?'A':'B';
 const visual=panel(`<div>${L(B('Model: sunlight comes straight down.','모형: 햇빛이 바로 위에서 내려와요.'))}</div><svg class="g3-shade" viewBox="0 0 320 120" role="img">${[0,1].map((i)=>{const x=80+i*160,covered=i===(roof?0:1);return `<text x="${x}" y="18" text-anchor="middle">${'AB'[i]} ↓ ☀ ↓</text><path d="M${x-38} ${covered?50:104} H${x+38}" stroke="#234" stroke-width="7"/><rect x="${x-15}" y="75" width="30" height="20" fill="#df713d"/>`;}).join('')}</svg></div>`);
 if(lv===1){const asks=[B('Which cover blocks light BEFORE it reaches the block?','어느 가림막이 블록에 닿기 전에 햇빛을 막나요?'),B('Which block receives the direct sunlight?','어느 블록에 햇빛이 직접 닿나요?'),B('Which roof is ABOVE its block?','블록 위에 가림막이 있는 것은?'),B('Which roof is BELOW its block?','블록 아래에 가림막이 있는 것은?'),B('Which design needs its roof moved above the block?','햇빛을 가리려면 가림막을 위로 옮겨야 하는 설계는?')],i=rnd(5),ans=[0,2].includes(i)?correct:(correct==='A'?'B':'A');return q(asks[i],visual,ans,[ans==='A'?'B':'A']);}
 const r=pick(shadeQuestions);
 return q(r[0],visual,r[1],r.slice(2),B('This light-path model is a plan. Real temperatures need testing.','빛의 경로 모형은 계획이에요. 실제 온도는 실험해야 알아요.'));
});
const sr=(en,ko,pEn,pKo,aEn,aKo,bEn,bKo,cEn,cKo)=>[B(en,ko),pEn?B(pEn,pKo):null,B(aEn,aKo),B(bEn,bKo),B(cEn,cKo)];
// Fact sources: NPS/USGS/EPA and Georgia DNR; see codex-done-12.md.
const moreScience={
rocktest3:[
 sr('Which observation is about texture?','질감을 살펴본 관찰은?','','','The surface feels rough','표면이 거칠어요','The sample weighs 20 g','무게가 20g이에요','It reflects a bright shine','빛을 반사해 반짝여요'),
 sr('Which is a color observation?','색을 살펴본 관찰은?','','','The sample is gray','표본이 회색이에요','It resists scratching','긁힘에 잘 견뎌요','It feels smooth','표면이 매끈해요'),
 sr('Which sample is harder in this test?','이 실험에서 더 단단한 표본은?','Same tool: A scratched, B did not.','같은 도구로 긁었어요. A에는 흠집이 나고 B에는 안 났어요.','B','B','A','A','Both scratched','둘 다 흠집이 났어요'),
 sr('Which test compares luster?','광택을 비교하는 방법은?','','','Use the same light to view reflections','같은 빛에서 반사 비교','Feel the surface texture','표면 질감 비교','Compare resistance to scratches','긁힘에 견디는 정도 비교'),
 sr('What did the test measure?','무엇을 살펴본 실험인가요?','An adult used the same tool to scratch A and B.','어른이 같은 도구로 A와 B를 긁었어요.','Hardness','단단함','Color','색','Weight of the tray','쟁반 무게'),
 sr('Can color alone identify this rock?','색만으로 이 암석 이름을 알 수 있나요?','We only know it is gray.','회색이라는 것만 알아요.','No; more evidence is needed','아니요, 근거가 더 필요해요','Yes, every gray rock is identical','네, 회색 암석은 모두 같아요','Its label decides its type','이름표가 종류를 정해요'),
 sr('An observation says “gray.” Which property was recorded?','관찰 기록에 ‘회색’이라고 썼어요. 어떤 성질을 기록했나요?','','','Color','색','The tray’s mass','쟁반의 질량','Scratch resistance','긁힘에 견디는 정도'),
 sr('Which change makes scratch tests unfair?','긁기 실험을 공정하지 않게 만드는 것은?','','','Different tools for A and B','A와 B에 다른 도구 사용','The same tool','같은 도구 사용','Recording both results','두 결과 기록')],
erosion3:[
 ...[['A stream carried sand to a new place.','개울물이 모래를 다른 곳으로 옮겼어요.','Flowing water','흐르는 물'],['A gust blew dry soil off a field.','돌풍이 밭의 마른 흙을 날려 옮겼어요.','Wind','바람'],['Rainwater carried soil into a ditch.','빗물이 흙을 도랑으로 옮겼어요.','Moving water','움직이는 물'],['Waves carried grains along the shore.','파도가 모래 알갱이를 해안을 따라 옮겼어요.','Waves','파도']].map(r=>sr('What moved the material?','무엇이 흙이나 모래를 옮겼나요?',...r,'Moving ice','움직이는 얼음','Growing roots','자라는 뿌리')),
 sr('Which is weathering rather than movement?','옮겨지는 대신 제자리에서 부서진 것은?','','','A rock cracks but stays in place','돌이 제자리에서 갈라져요','A stream carries sand','개울이 모래를 옮겨요','Wind carries soil','바람이 흙을 옮겨요'),
 sr('What supports erosion?','침식이 일어났다는 근거는?','A marked grain moved downhill during rain.','표시한 알갱이가 비가 올 때 아래로 이동했어요.','The grain changed location','알갱이의 위치가 바뀌었어요','The grain cracked in place','알갱이가 제자리에서 갈라졌어요','The grain stayed on the slope','알갱이가 비탈에 그대로 있었어요'),
 sr('Which material was deposited?','이동해 와서 쌓인 것은?','Water carried sand, then sand settled at the tray’s end.','물이 모래를 옮겼고 끝부분에 모래가 쌓였어요.','Sand at the end','끝부분의 모래','Soil still on the slope','비탈에 그대로 있는 흙','A rock still fixed at the top','위쪽에 고정된 돌'),
 sr('Which record compares before and after?','전과 후를 비교한 기록은?','','','Soil on slope before; soil below after rain','비 전에는 비탈, 비 뒤에는 아래쪽 흙','Only the soil’s starting position','흙의 처음 위치만','Only the soil’s final position','흙의 마지막 위치만')],
fossilclue3:[
 sr('What does a fossil leaf support?','잎 화석으로 알 수 있는 것은?','','','A plant lived long ago','오래전에 식물이 살았어요','That plant still lives here','그 식물이 지금도 여기에 살아요','That plant grew here last week','그 식물이 지난주에 여기서 자랐어요'),
 sr('What is evidence of ancient movement?','옛 생물의 이동 흔적은?','','','A fossil trackway','화석으로 남은 발자국 길','A fresh tire mark','새 타이어 자국','A fossil shell','조개 화석'),
 sr('What can shell fossils help explain?','바다 조개 화석이 알려 줄 수 있는 것은?','Marine shell fossils occur in an old layer.','오래된 지층에 바다 조개 화석이 있어요.','A past watery environment','옛날 물이 있던 환경','The exact water temperature then','그때 물의 정확한 온도','The exact water depth then','그때 물의 정확한 깊이'),
 sr('Which is a preserved body part?','몸의 일부가 남은 화석은?','','','An ancient fossil tooth','옛 생물의 이빨 화석','A footprint made today','오늘 찍은 발자국','An ancient fossil trackway','옛 생물의 발자국 길 화석'),
 sr('What can this footprint support?','이 발자국으로 알 수 있는 것은?','An ancient trackway is preserved in rock.','옛 발자국 길이 암석에 남아 있어요.','An animal moved across this surface','동물이 이 표면을 지나갔어요','The animal ate only plants','그 동물은 식물만 먹었어요','The animal lived alone','그 동물은 혼자 살았어요'),
 sr('Why compare several fossils?','여러 화석을 비교하는 까닭은?','','','To gather more evidence about past life','옛 생물의 근거를 더 모으려고','To prove all past habitats were alike','옛 서식지가 모두 같다고 증명하려고','To prove one fossil shows every species','화석 하나로 모든 종을 알 수 있다고 하려고'),
 sr('Which is not an ancient fossil?','옛 화석이 아닌 것은?','','','A fresh footprint in today’s mud','오늘 진흙에 찍은 새 발자국','An old footprint preserved in rock','암석에 보존된 옛 발자국','A fossil shell','조개 화석'),
 sr('Which conclusion goes beyond the evidence?','근거보다 지나친 결론은?','A marine fossil was found on land.','육지에서 바다 생물 화석을 찾았어요.','This place must be underwater today','이곳은 지금도 반드시 바닷속이에요','Past life left evidence','옛 생물의 근거가 남았어요','A marine organism lived long ago','오래전에 바다 생물이 살았어요')],
fossilorder3:[
 sr('What happens before burial in this model?','이 모형에서 묻히기 전 단계는?','Death → burial → preservation','죽음 → 묻힘 → 보존','The organism dies','생물이 죽어요','A fossil is dug up','화석을 파내요','The shell breaks on the surface','껍데기가 표면에서 부서져요'),
 sr('What covers remains in this model?','이 모형에서 몸을 덮는 것은?','','','Sediment','퇴적물','Air currents','공기 흐름','Surface waves','표면의 물결'),
 sr('Why can quick burial help?','빨리 묻히면 도움이 되는 까닭은?','','','It can protect remains from disturbance','몸이 흩어지는 것을 줄일 수 있어요','It exposes remains to more scavengers','몸이 먹이를 찾는 동물에 더 드러나요','It keeps remains on the surface longer','몸이 표면에 더 오래 남아요'),
 sr('Which claim is too certain?','너무 단정한 말은?','','','Every buried animal becomes a fossil','묻힌 동물은 모두 화석이 돼요','Some remains may be preserved','일부는 남을 수 있어요','Burial can help preservation','묻힘이 보존에 도움을 줘요'),
 sr('Which part often preserves more easily?','더 잘 남는 경우가 많은 부분은?','','','A hard shell','단단한 껍데기','Soft skin','부드러운 피부','Soft muscle','부드러운 근육'),
 sr('What is missing from this model?','이 모형에서 빠진 단계는?','Death → ? → preservation','죽음 → ? → 보존','Burial','묻힘','Excavation','발굴','Surface erosion','표면 침식'),
 sr('What should a fossil model show?','화석 모형에 나타낼 것은?','','','Sequence and conditions','순서와 조건','Only the final preserved shape','마지막에 남은 모양만','Only the starting organism','처음 생물만'),
 sr('Which is a limit of a quick model?','짧은 모형 활동의 한계는?','','','It does not reproduce the full time needed','실제 걸리는 시간을 모두 보여 주지 못해요','It proves every fossil forms fast','모든 화석이 빨리 생김을 증명해요','It makes all remains fossils','모든 몸을 화석으로 만들어요')],
adaptation3:[
 sr('Which strategy matches the observation?','관찰에 맞는 적응은?','An Alaskan snowshoe hare’s winter fur blends with snow.','알래스카 눈덧신토끼의 겨울 털이 눈과 비슷하게 보여요.','Camouflage','위장','Migration','계절 이동','Keeping body heat in','몸의 열 지키기'),
 sr('Why can blending with snow help?','눈과 비슷하게 보이면 도움이 되는 까닭은?','A snowshoe hare has white winter fur.','눈덧신토끼는 겨울에 흰 털을 갖게 돼요.','It is harder to see against snow','눈 속에서 잘 눈에 띄지 않아요','It can run faster in deep snow','깊은 눈에서 더 빨리 달릴 수 있어요','It can find food under snow','눈 밑의 먹이를 찾을 수 있어요'),
 sr('Which strategy matches this winter state?','이 겨울 상태에 맞는 적응은?','A bat lowers its breathing and energy use during winter.','박쥐가 겨울에 호흡과 에너지 사용을 크게 줄여요.','Hibernation','겨울잠','Mimicry','흉내','Migration','계절 이동'),
 sr('How can hibernation help?','겨울잠이 도움이 되는 까닭은?','Some bats hibernate when winter food is scarce.','일부 박쥐는 겨울에 먹이가 적을 때 겨울잠을 자요.','It saves energy','에너지를 아껴요','It increases the need for food','먹이가 더 많이 필요해져요','It keeps activity at summer levels','여름만큼 활발히 움직여요'),
 sr('Which strategy matches seasonal travel?','계절에 따라 먼 곳으로 가는 적응은?','A bird flies to another region for the season.','새가 계절에 따라 다른 지역으로 날아가요.','Migration','계절 이동','Camouflage','위장','Hibernation','겨울잠'),
 sr('What may help a migrating animal?','계절 이동이 도움을 주는 경우는?','Some bats travel to warmer places with winter food.','일부 박쥐는 겨울 먹이가 있는 따뜻한 곳으로 가요.','Finding food in another region','다른 지역에서 먹이 찾기','Reducing the need to eat while staying','머무르며 먹이 필요량 줄이기','Blending into the local snow','그곳의 눈에 섞여 보이기'),
 sr('Which strategy is shown?','어떤 적응을 보여 주나요?','A harmless hoverfly resembles a wasp.','꽃등에가 말벌과 비슷하게 생겼어요.','Mimicry','흉내','Hibernation','겨울잠','Migration','계절 이동'),
 sr('What does resemblance NOT mean?','비슷하게 생겼어도 뜻하지 않는 것은?','A hoverfly looks like a wasp.','꽃등에가 말벌과 비슷해요.','It has become a wasp','말벌로 변했어요','The appearance is similar','모습이 비슷해요','Different animals can look alike','다른 동물이 비슷할 수 있어요')],
survival3:[
 ...[['water','물','food','먹이'],['shelter','숨을 곳','water','물'],['food','먹이','space','공간'],['space','공간','shelter','숨을 곳']].flatMap(r=>[
 sr('Which listed need is missing?','적힌 필요 조건 중 부족한 것은?',`Model needs: ${r[0]} and ${r[2]}. This site has only ${r[0]}.`,`모형 조건: ${r[1]}, ${r[3]}. 이곳에는 ${r[1]}만 있어요.`,r[2],r[3],r[0],r[1],'Nothing','아무것도 없어요'),
 sr('Which site meets both checked needs?','확인한 두 조건을 갖춘 장소는?',`Needs: ${r[0]} and ${r[2]}. A has only ${r[0]}; B has both.`,`조건: ${r[1]}, ${r[3]}. A에는 ${r[1]}만 있고 B에는 둘 다 있어요.`,'Site B','장소 B','Site A','장소 A','Neither site','둘 다 아니에요')])],
pollution3:[
 ...[['waste entered a stream','폐수가 개울에 들어갔어요','Water','물'],['smoke entered the air','연기가 공기 중에 퍼졌어요','Air','공기'],['oil spilled onto the soil','기름이 흙에 쏟아졌어요','Land','땅'],['trash was dumped on the ground','쓰레기를 땅에 쏟았어요','Land','땅']].map(r=>sr('Where did pollution enter directly?','오염 물질이 직접 들어간 곳은?',`Practice record: ${r[0]}.`,`연습 기록: ${r[1]}.`,r[2],r[3],`${r[2]==='Water'?'Air':'Water'}`,`${r[2]==='Water'?'공기':'물'}`,`${r[2]==='Land'?'Air':'Land'}`,`${r[2]==='Land'?'공기':'땅'}`)),
 sr('Which record gives a pollution source?','오염의 원인을 적은 기록은?','','','An oil spill entered the pond','기름이 연못에 흘러들었어요','Algae covered part of the pond','연못 일부를 조류가 덮었어요','Fish moved near the surface','물고기가 표면 근처로 왔어요'),
 sr('What should be recorded to study an effect?','영향을 알아보려면 기록할 것은?','','','Observations before and after pollution','오염 전과 후의 관찰','Only the final preserved shape','마지막에 남은 모양만','Only the amount of pollutant released','배출한 오염 물질 양만'),
 sr('Which observation directly shows dirty air?','공기가 더러워졌다는 직접 관찰은?','','','Smoke is in the air','공기 중에 연기가 있어요','Oil floats on pond water','연못 물에 기름이 떠요','Litter lies on the soil','흙에 쓰레기가 놓여 있어요'),
 sr('What is a limit of this observation?','이 관찰의 한계는?','We saw oil on the water, but did not examine fish.','물에 기름이 있는 것을 보았지만 물고기는 살펴보지 않았어요.','It does not show every effect on fish','물고기에 미친 모든 영향을 알 수는 없어요','It proves all fish are safe','모든 물고기가 안전함을 증명해요','It proves there was no oil','기름이 없었음을 증명해요')],
conserve3:[
 sr('Which reduces waste?','쓰레기를 줄이는 방법은?','','','Refill a reusable bottle','다시 쓰는 물병에 물 채우기','Throw it away after one use','한 번 쓰고 버리기','Buy it and never use it','사서 전혀 안 쓰기'),
 sr('Which reuses paper?','종이를 다시 쓰는 방법은?','','','Draw on a clean unused side','아직 깨끗한 뒷면에 그리기','Discard an unused sheet','안 쓴 종이 버리기','Use ten sheets for one letter','글자 하나에 열 장 쓰기'),
 sr('Which reuses a box?','상자를 다시 쓰는 방법은?','','','Store game pieces in it','놀이 조각을 보관해요','Throw the usable box away','쓸 수 있는 상자를 버려요','Leave it in a stream','개울에 두어요'),
 sr('Which saves water?','물을 아끼는 방법은?','','','Close the tap when not needed','필요 없을 때 수도꼭지 잠그기','Let water run unused','쓰지 않는 물 계속 틀기','Ignore a leaking tap','새는 수도꼭지 무시하기'),
 sr('What should be checked before recycling a cup?','컵을 재활용하기 전에 확인할 것은?','','','Whether local collection accepts it','지역에서 그 컵을 받는지','Only whether the cup is clean','컵이 깨끗한지만','Only a recycling symbol','재활용 표시만'),
 sr('What is reducing?','덜 쓰기에 해당하는 것은?','','','Use fewer disposable items','일회용품을 덜 사용하기','Buy extra items to discard','버릴 물건 더 사기','Throw away unused supplies','안 쓴 도구 버리기'),
 sr('Which protects a shared stream?','함께 쓰는 개울을 지키는 행동은?','','','Keep trash out of the water','쓰레기가 물에 들어가지 않게 하기','Dump litter into the stream','쓰레기를 개울에 버리기','Hide litter under water','쓰레기를 물속에 숨기기'),
 sr('Which is reuse rather than buying new?','새로 사는 대신 다시 쓰는 것은?','','','Use the same sturdy bag again','튼튼한 가방을 다시 사용하기','Buy a bag each time','매번 가방 새로 사기','Discard the bag before use','쓰기도 전에 가방 버리기')],
heatsource3:[
 ...[['a stone','돌'],['a roof','지붕'],['a road','도로']].map(r=>sr('What supplies the warming energy?','데우는 에너지는 어디서 오나요?',`Sunlight warms ${r[0]}.`,`햇빛으로 ${r[1]}의 온도가 올라가요.`,'The Sun','태양','The surrounding air','주변 공기','The cool ground','차가운 땅')),
 sr('Which device is producing heat?','열을 내는 기구는?','A toaster is on; a nearby heater is unplugged.','토스터는 켜져 있고 옆 난방기는 플러그가 빠져 있어요.','The working toaster','켜진 토스터','The unplugged heater','플러그가 빠진 난방기','The switched-off stove','꺼진 전기레인지'),
 sr('Why can rubbing produce warmth?','비비면 따뜻해질 수 있는 까닭은?','Two surfaces rub against each other.','두 표면을 서로 비벼요.','Friction','마찰','Sunlight alone','햇빛만','Warm air alone','따뜻한 공기만'),
 sr('Which is a heat source rather than its effect?','열의 결과 대신 열원인 것은?','Sunlight warms a bench.','햇빛이 벤치를 데워요.','The Sun','태양','The bench’s warmth','벤치의 따뜻함','The ground below','아래의 땅'),
 sr('What heats water in this scene?','이 장면에서 물을 데우는 것은?','An electric kettle is switched on.','전기 주전자가 켜져 있어요.','The working heating element','켜진 가열 장치','The unplugged toaster','플러그가 빠진 토스터','The switched-off stove','꺼진 전기레인지'),
 sr('Does a mirror make sunlight itself?','거울이 햇빛을 스스로 만드나요?','A mirror reflects sunlight.','거울이 햇빛을 반사해요.','No, it reflects light from the Sun','아니요, 태양의 빛을 반사해요','Yes, it produces the reflected energy','네, 반사되는 에너지를 만들어 내요','Yes, the glass burns to make light','네, 유리가 타면서 빛을 내요')]
};
const habitatNotes=[
 ['Blue Ridge: moist mountain forests.','블루리지: 습한 산지 숲.','Moist forest','습한 숲','Dry open ocean','마른 바다','No plants','식물이 없는 곳'],
 ['Piedmont: rolling hills and rock outcrops.','피드몬트: 완만한 언덕과 드러난 암석.','Rolling hills','완만한 언덕','Sea ice','바다 얼음','Ocean floor','바다 바닥'],
 ['Coastal Plain: longleaf pine and wiregrass habitat.','해안 평야: 긴잎소나무와 와이어그래스 서식지.','Pine and grass habitat','소나무와 풀 서식지','Frozen sea','얼어붙은 바다','Bare glacier','식물 없는 빙하'],
 ['Valley and Ridge: ridges with valleys between.','계곡과 산등성이: 산등성이 사이에 계곡.','Ridges and valleys','산등성이와 계곡','Only sea ice','바다 얼음만','Only an ocean floor','바다 바닥만'],
 ['Appalachian Plateau: flat-topped mountains and caves.','애팔래치아 고원: 평평한 산 정상과 동굴.','Flat-topped mountains','평평한 산 정상','A tropical ocean','열대 바다','Sea ice alone','바다 얼음만'],
 ['Georgia coast: salt marshes near the ocean.','조지아 해안: 바다 가까운 염습지.','Salty wet habitat','소금기가 있는 젖은 서식지','Only dry sand','마른 모래만','A freshwater-only habitat','민물만 있는 서식지'],
 ['Blue Ridge: salamanders use moist forest-floor cover.','블루리지: 도롱뇽은 습한 숲 바닥의 숨을 곳을 이용해요.','Moist forest-floor cover','습한 숲 바닥의 숨을 곳','Dry sea ice','마른 바다 얼음','No shelter','숨을 곳이 없음'],
 ['Piedmont: some habitats include rock outcrops.','피드몬트: 일부 서식지에 드러난 암석이 있어요.','Rock outcrops','드러난 암석','Only floating ice','떠 있는 얼음만','Only salt water','소금물만'],
 ['Coastal Plain: Okefenokee is a wetland habitat.','해안 평야: 오키피노키는 습지 서식지예요.','Wetland','습지','Bare glacier','식물 없는 빙하','Only dry mountain peaks','마른 산 정상만'],
 ['Georgia salt marsh: cordgrass grows in tidal wetland.','조지아 염습지: 갯줄풀이 바닷물 드나드는 습지에서 자라요.','Tidal wetland','바닷물 드나드는 습지','Only dry desert','마른 사막만','Only ice','얼음만']
].map((r,i,all)=>{const other=all[(i+3)%all.length];return [B(r[0],r[1]),B(r[2],r[3]),B(other[2],other[3]),B(all[(i+4)%all.length][2],all[(i+4)%all.length][3]),B(`${r[0]} Compare: ${other[0]}`,`${r[1]} 비교: ${other[1]}`),B(`${r[2]} versus ${other[2]}`,`${r[3]} / ${other[3]}`),B(`${other[2]} versus ${r[2]}`,`${other[3]} / ${r[3]}`),B(`Both: ${r[2]}`,`둘 다: ${r[3]}`)];});
const shadeQuestions=[
 [B('How should we compare the designs fairly?','공정하게 비교하는 방법은?'),B('Same blocks, starting temperature and time','같은 블록·처음 온도·시간'),B('Different blocks and times','다른 블록과 시간'),B('Measure only the prettier design','예쁜 설계만 측정')],
 [B('Which tool checks the warming effect?','따뜻해진 정도를 확인할 도구는?'),B('Thermometer','온도계'),B('Ruler','자'),B('Balance scale','양팔저울')],
 [B('What should we record for each design?','설계마다 기록할 것은?'),B('Start and end temperatures','처음과 끝 온도'),B('Only the roof color','가림막 색만'),B('Only the cover height','가림막 높이만')],
 [B('What is this model’s limit?','이 모형의 한계는?'),B('Real temperatures need testing','실제 온도는 실험해야 알아요'),B('It guarantees exact temperatures','정확한 온도를 보장해요'),B('It proves all roofs work equally','모든 가림막이 똑같이 작용해요')],
 [B('What single feature are these designs comparing?','비교하는 설계의 차이는?'),B('The cover’s position','가림막 위치'),B('The block material','블록 재료'),B('The size of the blocks','블록 크기')],
 [B('What would make the comparison unfair?','공정하지 않은 비교는?'),B('Use different measurement times','다른 시간 동안 측정하기'),B('Use identical blocks','똑같은 블록 사용하기'),B('Record both temperatures','두 온도 기록하기')]
];
})();
