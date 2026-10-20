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
const reg=(id,en,ko,code,make)=>registerGame({id,grade:'3',subject:'sci',icon:'🔬',title:B(en,ko),sub:B('Observe, compare and use evidence','관찰하고 비교하며 근거를 찾아요'),area:B(`Grade 3 Science · ${code}`,`3학년 과학 · ${code}`),play(){quiz(this,fresh(id,lvl(id),lv=>bankGrowthMake(id,lv,make)));}});
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
 [B('What can a fossil give evidence about?','화석으로 무엇을 알아볼 수 있나요?'),null,B('Life long ago','아주 오래전 생물'),B('The rock’s exact age','다른 검사 없이 암석의 정확한 나이'),B('The animal’s exact color','동물 몸의 정확한 색')],
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
 [B('What is missing at this model site?','이 모형 장소에서 부족한 것은?'),B('Needs: water and woody plants. The site has trees but no water.','필요 조건: 물과 나무. 이곳에는 나무만 있고 물은 없어요.'),B('Water','물'),B('Trees','나무'),B('Both present','둘 다 있음')],
 [B('What conclusion fits the evidence?','근거에 맞는 결론은?'),B('Two beaver sites both have water and woody plants. We have not checked other needs.','비버 모형의 두 장소 모두 물과 나무가 있어요. 다른 조건은 아직 살펴보지 않았어요.'),B('Both meet the two checked needs','둘 다 확인한 두 조건은 갖췄어요'),B('Both meet the food need but lack water','둘 다 먹이는 있지만 물은 없어요'),B('Neither has water','둘 다 물이 없어요')]]);
bank('pollution3','Pollution Records','오염 기록','S3L2.a',[
 [B('Which material received the pollution directly?','오염 물질이 직접 들어간 곳은?'),B('Practice record: oil spilled into a pond.','연습용 기록: 연못에 기름이 흘러들었어요.'),B('Water','물'),B('Air','공기'),B('Land','땅')],
 [B('Which record describes air pollution?','공기 오염을 나타내는 기록은?'),null,B('Dirty smoke entered the air','더러운 연기가 공기 중에 퍼졌어요'),B('Oil entered a stream','기름이 개울에 들어갔어요'),B('Trash was buried in soil','쓰레기가 흙에 묻혔어요')],
 [B('Which observation directly supports water pollution?','물 오염을 직접 뒷받침하는 관찰은?'),B('Practice notes: oil floats on pond water; a bench is brown; birds sing.','연습용 기록: 연못에 기름이 떠 있어요. 벤치는 갈색이에요. 새가 노래해요.'),B('Oil floats on the water','물에 기름이 떠 있어요'),B('Dust is beside the pond','연못 옆에 먼지가 있어요'),B('Smoke is above the pond','연못 위에 연기가 있어요')]]);
bank('conserve3','Protect Resources','자원 지키기','S3L2.b',[
 [B('Which action reuses an item?','물건을 다시 사용하는 행동은?'),null,B('Use a clean jar to store pencils','깨끗한 통에 연필 보관하기'),B('Throw away the clean jar','깨끗한 통 버리기'),B('Break the jar for recycling','통을 깨뜨려 재활용하기')],
 [B('Which action reduces paper use?','종이를 덜 쓰는 방법은?'),null,B('Use both sides when suitable','쓸 수 있을 때 종이 양면 쓰기'),B('Use a new page for each word','낱말 하나마다 새 종이 쓰기'),B('Throw away unused pages','안 쓴 종이 버리기')],
 [B('Before putting an item in a recycling bin, what should you check?','재활용 통에 넣기 전에 무엇을 확인하나요?'),null,B('Local rules for accepted materials','우리 지역에서 받는 재활용품'),B('The item’s cleanliness','물건이 깨끗한지'),B('The recycling symbol','물건의 재활용 표시')]]);
bank('heatsource3','Sources of Heat','열은 어디에서 올까요?','S3P1.a',[
 [B('What supplies energy that warms a sunlit bench?','햇빛 받는 벤치를 데우는 에너지는 어디서 오나요?'),null,B('The Sun','태양'),B('Nearby air','주변 공기'),B('The cool ground','차가운 땅')],
 [B('What warms your hands as you rub them?','손을 서로 비빌 때 따뜻해지는 까닭은?'),null,B('Friction from rubbing','손을 비빌 때 생긴 마찰'),B('Heat from nearby air','주변 공기에서 온 열'),B('Heat from sunlight alone','햇빛에서만 온 열')],
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
 sr('Which sample is harder in this test?','이 실험에서 더 단단한 표본은?','Same tool: A scratched, B did not.','같은 도구로 긁었어요. A에는 흠집이 나고 B에는 안 났어요.','B','B','A','A','A and B','A와 B'),
 sr('Which test compares luster?','광택을 비교하는 방법은?','','','Use the same light to view reflections','같은 빛에서 반사 비교','Feel the surface texture','표면 질감 비교','Compare resistance to scratches','긁힘에 견디는 정도 비교'),
 sr('What did the test measure?','무엇을 살펴본 실험인가요?','An adult used the same tool to scratch A and B.','어른이 같은 도구로 A와 B를 긁었어요.','Hardness','단단함','Color','색','Weight of the tray','쟁반 무게'),
 sr('Can color alone identify this rock?','색만으로 이 암석 이름을 알 수 있나요?','We only know it is gray.','회색이라는 것만 알아요.','No; more evidence is needed','아니요, 근거가 더 필요해요','Yes, every gray rock is identical','네, 회색 암석은 모두 같아요','Its label decides its type','이름표가 종류를 정해요'),
 sr('An observation says “gray.” Which property was recorded?','관찰 기록에 ‘회색’이라고 썼어요. 어떤 성질을 기록했나요?','','','Color','색','Tray mass','쟁반 질량','Scratch resistance','긁힘에 견디는 정도'),
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
 sr('How can hibernation help?','겨울잠이 도움이 되는 까닭은?','Some bats hibernate when winter food is scarce.','일부 박쥐는 겨울에 먹이가 적을 때 겨울잠을 자요.','It reduces winter energy needs','에너지를 아껴요','It raises winter energy needs','겨울 에너지 필요량을 늘려요','It maintains summer activity','여름 활동량을 유지해요'),
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
 sr('Which reduces waste?','쓰레기를 줄이는 방법은?','','','Refill a reusable bottle','다시 쓰는 물병에 물 채우기','Throw it away after one use','한 번 쓰고 버리기','Recycle the bottle after using it','물병을 쓰고 재활용하기'),
 sr('Which reuses paper?','종이를 다시 쓰는 방법은?','','','Draw on a clean unused side','아직 깨끗한 뒷면에 그리기','Discard an unused sheet','안 쓴 종이 버리기','Use ten sheets for one letter','글자 하나에 열 장 쓰기'),
 sr('Which reuses a box?','상자를 다시 쓰는 방법은?','','','Store game pieces in it','놀이 조각을 보관해요','Throw the usable box away','쓸 수 있는 상자를 버려요','Leave it in a stream','개울에 두어요'),
 sr('Which saves water?','물을 아끼는 방법은?','','','Close the tap when not needed','필요 없을 때 수도꼭지 잠그기','Let water run unused','쓰지 않는 물 계속 틀기','Ignore a leaking tap','새는 수도꼭지 무시하기'),
 sr('What should be checked before recycling a cup?','컵을 재활용하기 전에 확인할 것은?','','','Whether local collection accepts it','지역에서 그 컵을 받는지','Only whether the cup is clean','컵이 물건이 깨끗한지','Only a recycling symbol','물건의 재활용 표시'),
 sr('What is reducing?','덜 쓰기에 해당하는 것은?','','','Use fewer disposable items','일회용품을 덜 사용하기','Buy extra items to discard','버릴 물건 더 사기','Throw away unused supplies','안 쓴 도구 버리기'),
 sr('Which protects a shared stream?','함께 쓰는 개울을 지키는 행동은?','','','Keep trash out of the water','쓰레기가 물에 들어가지 않게 하기','Dump litter into the stream','쓰레기를 개울에 버리기','Hide litter under water','쓰레기를 물속에 숨기기'),
 sr('Which is reuse rather than buying new?','새로 사는 대신 다시 쓰는 것은?','','','Use the same sturdy bag again','튼튼한 가방을 다시 사용하기','Buy a bag each time','매번 가방 새로 사기','Discard the bag before use','쓰기도 전에 가방 버리기')],
heatsource3:[
 ...[['a stone','돌'],['a roof','지붕'],['a road','도로']].map(r=>sr('What supplies the warming energy?','데우는 에너지는 어디서 오나요?',`Sunlight warms ${r[0]}.`,`햇빛으로 ${r[1]}의 온도가 올라가요.`,'The Sun','태양','Nearby air','주변 공기','The cool ground','차가운 땅')),
 sr('Which device is producing heat?','열을 내는 기구는?','A toaster is on; a nearby heater is unplugged.','토스터는 켜져 있고 옆 난방기는 플러그가 빠져 있어요.','The working toaster','켜진 토스터','The unplugged heater','플러그가 빠진 난방기','The switched-off stove','꺼진 전기레인지'),
 sr('Why can rubbing produce warmth?','비비면 따뜻해질 수 있는 까닭은?','Two surfaces rub against each other.','두 표면을 서로 비벼요.','Friction','마찰','Sunlight alone','햇빛만','Warm air alone','따뜻한 공기만'),
 sr('Which is a heat source rather than its effect?','열의 결과 대신 열원인 것은?','Sunlight warms a bench.','햇빛이 벤치를 데워요.','The Sun','태양','The bench','벤치의 따뜻함','The ground','아래의 땅'),
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
 [B('What is this model’s limit?','이 모형의 한계는?'),B('Real temperatures need testing','실제 온도는 실험해야 알아요'),B('It measures temperature without a thermometer','온도계 없이 온도를 측정해요'),B('It tests roof color rather than shade','그늘 대신 가림막 색을 검사해요')],
 [B('What single feature are these designs comparing?','비교하는 설계의 차이는?'),B('The cover’s position','가림막 위치'),B('The block material','블록 재료'),B('The size of the blocks','블록 크기')],
 [B('What would make the comparison unfair?','공정하지 않은 비교는?'),B('Use different measurement times','다른 시간 동안 측정하기'),B('Use identical blocks','똑같은 블록 사용하기'),B('Record both temperatures','두 온도 기록하기')]
];

// P-banks: original additional observations; source ledger in banks-grade3-facts-candidates.md.
const bankGrowthRows={
"rocktest3": {
"1": [
{"ask":{"en":"Which missing entry is needed to compare hardness?","ko":"단단함을 비교하려면 빠진 어떤 기록이 필요한가요?"},"show":{"en":"A record lists each sample’s color and surface feel, but no scratch-test results.","ko":"기록에 표본마다 색과 표면 느낌은 있지만 긁기 검사 결과는 없어요."},"right":{"en":"Scratch resistance","ko":"긁힘에 견디는 정도"},"wrong":[{"en":"Tray position","ko":"쟁반의 위치"},{"en":"Sample label color","ko":"표본 이름표 색"}]},
{"ask":{"en":"Which part of the summary needs correction?","ko":"요약의 어느 항목을 고쳐야 하나요?"},"show":{"en":"Records: P—gray, rough, 20 g; Q—gray, smooth, 20 g. Summary: both are gray, both are smooth, both weigh 20 g.","ko":"기록: P—회색, 거침, 20g. Q—회색, 매끈함, 20g. 요약: 둘 다 회색, 둘 다 매끈함, 둘 다 20g."},"right":{"en":"The texture summary","ko":"질감 요약"},"wrong":[{"en":"The color summary","ko":"색 요약"},{"en":"The mass summary","ko":"질량 요약"}]}
],
"2": [
{"ask":{"en":"Which comparison separates color from scratch resistance?","ko":"색과 긁힘에 견디는 정도를 구별한 비교는?"},"show":{"en":"Practice records: P is red and scratches easily. Q is red and does not scratch with the same tool. R is gray and scratches easily.","ko":"연습 기록: P는 빨강이고 쉽게 긁혀요. Q는 빨강이고 같은 도구로 긁히지 않아요. R은 회색이고 쉽게 긁혀요."},"right":{"en":"P and Q share color but differ in resistance","ko":"P와 Q는 색은 같고 긁힘 저항은 달라요"},"wrong":[{"en":"P and Q differ in color but share resistance","ko":"P와 Q는 색이 다르고 긁힘 저항은 같아요"},{"en":"Q and R share both recorded properties","ko":"Q와 R은 적힌 두 성질이 모두 같아요"}]},
{"ask":{"en":"Which student used evidence to revise a claim?","ko":"근거를 보고 주장을 고친 학생은?"},"show":{"en":"Claim: all shiny samples resist scratches. Test: one shiny sample scratches easily with the tool.","ko":"주장: 반짝이는 표본은 모두 긁힘에 잘 견뎌요. 검사: 반짝이는 표본 하나가 도구에 쉽게 긁혀요."},"right":{"en":"One exception means the claim is too broad","ko":"예외가 있으니 주장이 너무 넓다고 해요"},"wrong":[{"en":"Keep the claim because the sample is shiny","ko":"표본이 반짝이니 주장을 그대로 둬요"},{"en":"Conclude no sample can ever resist scratching","ko":"어떤 표본도 긁힘에 못 견딘다고 해요"}]}
]
},
"erosion3": {
"1": [
{"ask":{"en":"Which route matches the two observations?","ko":"두 관찰에 맞는 이동 경로는?"},"show":{"en":"Before rain: marked grains are at the top of a tray. After rain: those grains are in the lower catch cup.","ko":"비 오기 전 표시한 알갱이는 쟁반 위쪽에 있어요. 비 온 뒤 같은 알갱이가 아래 수거 컵에 있어요."},"right":{"en":"Top → catch cup","ko":"위쪽 → 수거 컵"},"wrong":[{"en":"Catch cup → top","ko":"수거 컵 → 위쪽"},{"en":"Top → top","ko":"위쪽 → 위쪽"}]},
{"ask":{"en":"Which measurement would show how much material left the slope?","ko":"비탈에서 빠져나간 물질의 양을 보여 줄 측정은?"},"show":{"en":"Practice rain model: a cup catches everything carried from the slope. The cup starts empty.","ko":"연습 비 모형: 비탈에서 옮겨진 것을 컵이 모두 받아요. 처음 컵은 비어 있어요."},"right":{"en":"Mass of soil collected in the cup","ko":"컵에 모인 흙의 질량"},"wrong":[{"en":"Mass of soil still on the slope","ko":"비탈에 남아 있는 흙의 질량"},{"en":"Mass of the empty catch cup","ko":"빈 수거 컵의 질량"}]}
],
"2": [
{"ask":{"en":"Which pair of notes is best evidence of erosion?","ko":"침식의 근거로 가장 좋은 기록의 짝은?"},"show":{"en":"A class wants to find out whether rain moved soil from a garden bed.","ko":"학급이 비로 화단의 흙이 옮겨졌는지 알아보려 해요."},"right":{"en":"Before/after soil positions and collected material downhill","ko":"흙의 전후 위치와 아래쪽에 쌓인 물질"},"wrong":[{"en":"Before/after rock color and midday air temperature","ko":"돌의 전후 색과 한낮 공기 온도"},{"en":"Before/after crack width and unchanged soil position","ko":"돌 틈의 전후 너비와 그대로인 흙 위치"}]},
{"ask":{"en":"Which summary accounts for the material that left the slope?","ko":"비탈을 떠난 물질의 양을 맞게 설명한 요약은?"},"show":{"en":"Closed practice tray, no material added: 100 grains start on the slope. Later 70 remain there and 30 are in the catch cup.","ko":"새 물질을 더하지 않은 닫힌 연습 쟁반이에요. 처음 비탈에 알갱이 100개가 있어요. 뒤에 70개는 비탈, 30개는 수거 컵에 있어요."},"right":{"en":"30 moved off the slope and were collected","ko":"30개가 비탈을 떠나 수거됐어요"},"wrong":[{"en":"70 moved off the slope and were collected","ko":"70개가 비탈을 떠나 수거됐어요"},{"en":"100 moved off the slope and were collected","ko":"100개가 비탈을 떠나 수거됐어요"}]}
]
},
"fossilclue3": {
"1": [
{"ask":{"en":"Which folder title covers BOTH specimens?","ko":"두 표본을 모두 포함하는 자료철 제목은?"},"show":{"en":"Specimens: an ancient tooth preserved in rock; an ancient trackway preserved in rock.","ko":"표본: 암석에 보존된 옛 이빨, 암석에 보존된 옛 발자국 길."},"right":{"en":"Body remains and activity traces","ko":"몸의 일부와 활동 흔적"},"wrong":[{"en":"Body remains only","ko":"몸의 일부만"},{"en":"Activity traces only","ko":"활동 흔적만"}]},
{"ask":{"en":"Which detail belongs in a specimen-count record?","ko":"표본 개수를 적는 기록에 알맞은 내용은?"},"show":{"en":"A tray holds three ancient shell fossils with the same visible shape. The collector has not identified species.","ko":"쟁반에 겉모양이 같은 옛 조개 화석 세 개가 있어요. 종류는 아직 확인하지 않았어요."},"right":{"en":"Three specimens were collected","ko":"표본 세 개를 모았어요"},"wrong":[{"en":"Three species were confirmed","ko":"세 종임을 확인했어요"},{"en":"Exactly three animals ever lived there","ko":"그곳에 동물은 정확히 세 마리만 살았어요"}]}
],
"2": [
{"ask":{"en":"Which site has evidence of activity but no collected body parts?","ko":"활동 근거는 있지만 모은 몸의 일부는 없는 곳은?"},"show":{"en":"Practice survey: P—2 fossil teeth, 1 trackway; Q—0 fossil teeth, 4 trackways; R—3 fossil teeth, 0 trackways.","ko":"연습 조사: P—이빨 화석 2개, 발자국 길 1개. Q—이빨 화석 0개, 발자국 길 4개. R—이빨 화석 3개, 발자국 길 0개."},"right":{"en":"Site Q","ko":"장소 Q"},"wrong":[{"en":"Site P","ko":"장소 P"},{"en":"Site R","ko":"장소 R"}]},
{"ask":{"en":"Which summary distinguishes a finding from a conclusion not yet tested?","ko":"발견한 것과 아직 확인하지 않은 결론을 구별한 요약은?"},"show":{"en":"Two trays each contain five shell fossils. Only tray A’s specimens have been identified by a specialist.","ko":"두 쟁반에 조개 화석이 다섯 개씩 있어요. 전문가가 종류를 확인한 것은 A의 표본뿐이에요."},"right":{"en":"The specimen counts match; species counts need more evidence","ko":"표본 수는 같지만 종 수는 근거가 더 필요해요"},"wrong":[{"en":"Matching specimen counts prove matching species","ko":"표본 수가 같으니 종도 같음이 증명돼요"},{"en":"Tray B must contain more species than A","ko":"B에 A보다 더 많은 종이 있어야 해요"}]}
]
},
"fossilorder3": {
"1": [
{"ask":{"en":"Which arrow points backward in the model?","ko":"모형에서 순서를 거꾸로 가리킨 화살표는?"},"show":{"en":"Model cards: A—remains on the bottom; B—sediment covers remains; C—preserved remains in hardened layers.","ko":"모형 카드: A—바닥에 남은 몸. B—퇴적물이 덮음. C—굳은 층 안에 보존됨."},"right":{"en":"C → B","ko":"C → B"},"wrong":[{"en":"A → B","ko":"A → B"},{"en":"B → C","ko":"B → C"}]},
{"ask":{"en":"How many model specimens were NOT preserved?","ko":"모형에서 보존되지 않은 표본은 몇 개일까요?"},"show":{"en":"Practice model: six paper shells start. Four remain visible in the final layer; the rest are removed to represent loss.","ko":"연습 모형: 종이 껍데기 여섯 개로 시작해요. 마지막 층에 네 개가 남고 나머지는 사라짐을 나타내려고 빼요."},"right":{"en":"2","ko":"2"},"wrong":[{"en":"4","ko":"4"},{"en":"6","ko":"6"}]}
],
"2": [
{"ask":{"en":"Which comparison supports a possible benefit of quick covering without guaranteeing it?","ko":"빨리 덮이면 도움 될 수 있음을 보이되 보장하지 않는 비교는?"},"show":{"en":"Practice model: covered group—8 of 10 shapes remain; exposed group—3 of 10 remain. These are made-up model results.","ko":"연습 모형: 덮은 무리 10개 중 8개가 남고 드러낸 무리 10개 중 3개가 남아요. 가상 모형 결과예요."},"right":{"en":"More covered shapes remained, but some were still lost","ko":"덮은 쪽이 더 남았지만 일부는 사라졌어요"},"wrong":[{"en":"Covered shapes lost more pieces than exposed ones","ko":"덮은 쪽이 드러낸 쪽보다 더 많이 사라졌어요"},{"en":"Fewer covered shapes remained than exposed shapes","ko":"덮은 쪽이 드러낸 쪽보다 적게 남았어요"}]},
{"ask":{"en":"Which comparison best tests covering speed without changing the type of remains?","ko":"남은 부분의 종류는 같게 두고 덮이는 속도를 비교한 실험은?"},"show":{"en":"A class wants to compare quick and slow burial in a paper model.","ko":"학급이 종이 모형에서 빨리 묻히기와 천천히 묻히기를 비교하려 해요."},"right":{"en":"Identical paper shells, same layers, different covering speeds","ko":"같은 종이 껍데기와 층, 다른 덮기 속도"},"wrong":[{"en":"Hard shell shapes covered fast, soft leaf shapes covered slowly","ko":"단단한 껍데기는 빨리, 부드러운 잎은 천천히 덮기"},{"en":"Different shapes and different layers, both covered fast","ko":"다른 모양과 다른 층, 둘 다 빨리 덮기"}]}
]
},
"habitat3": {
"1": [
{"ask":{"en":"Which site best fits a walk without climbing a slope?","ko":"비탈을 오르지 않는 산책에 맞는 곳은?"},"show":{"en":"Practice Georgia field notes: site K has a steep rocky trail. Site L has a flat sandy trail.","ko":"조지아 연습 현장 기록: K는 가파른 돌길, L은 평평한 모랫길이에요."},"right":{"en":"Site L","ko":"장소 L"},"wrong":[{"en":"Site K","ko":"장소 K"},{"en":"Both sites","ko":"두 장소 모두"}]},
{"ask":{"en":"Which site would involve repeated gentle climbs and descents?","ko":"완만한 오르막과 내리막을 여러 번 걷게 될 곳은?"},"show":{"en":"Practice Georgia field notes: site M has low rolling hills. Site N has broad level ground.","ko":"조지아 연습 현장 기록: M은 낮고 완만한 언덕, N은 넓고 평평한 땅이에요."},"right":{"en":"Site M","ko":"장소 M"},"wrong":[{"en":"Site N","ko":"장소 N"},{"en":"Both sites","ko":"두 장소 모두"}]}
],
"2": [
{"ask":{"en":"Which comparison uses both notes?","ko":"두 기록을 모두 이용한 비교는?"},"show":{"en":"Practice Georgia field notes: site K has a steep rocky trail. Site L has a flat sandy trail.","ko":"조지아 연습 현장 기록: K는 가파른 돌길, L은 평평한 모랫길이에요."},"right":{"en":"K is steeper; L has a sandier trail","ko":"K가 더 가파르고 L의 길에 모래가 더 많아요"},"wrong":[{"en":"L is steeper; K has a sandier trail","ko":"L이 더 가파르고 K의 길에 모래가 더 많아요"},{"en":"Both have steep rocky trails","ko":"둘 다 가파른 돌길이에요"}]},
{"ask":{"en":"Which claim goes beyond these notes?","ko":"이 기록만으로 알 수 없는 주장은?"},"show":{"en":"Practice Georgia field notes: site M has low rolling hills. Site N has broad level ground.","ko":"조지아 연습 현장 기록: M은 낮고 완만한 언덕, N은 넓고 평평한 땅이에요."},"right":{"en":"The same animals live at both sites","ko":"두 곳에 같은 동물이 살아요"},"wrong":[{"en":"M has more changes in ground height","ko":"M은 땅의 높낮이 변화가 더 있어요"},{"en":"N has a more level surface","ko":"N의 표면이 더 평평해요"}]}
]
},
"adaptation3": {
"1": [
{"ask":{"en":"Which change would most reduce the push in this model?","ko":"이 모형에서 물을 미는 힘을 가장 줄일 변화는?"},"show":{"en":"An adult pulls a model foot through water. A broad sheet connects its toes.","ko":"어른이 모형 발을 물속에서 당겨요. 넓은 막이 발가락 사이를 이어요."},"right":{"en":"Remove the sheet between the toes","ko":"발가락 사이의 막을 없애요"},"wrong":[{"en":"Make the sheet between the toes wider","ko":"발가락 사이의 막을 더 넓혀요"},{"en":"Keep the sheet’s width unchanged","ko":"발가락 사이 막의 너비를 그대로 둬요"}]},
{"ask":{"en":"Which model retained more warmth in this test?","ko":"이 실험에서 따뜻함을 더 잘 유지한 모형은?"},"show":{"en":"Practice fur-cover model, same start: P has thick covering, 30°C → 26°C; Q has thin covering, 30°C → 20°C.","ko":"털 덮개 연습 모형의 처음 온도는 같아요. P는 두꺼운 덮개로 30°C → 26°C, Q는 얇은 덮개로 30°C → 20°C."},"right":{"en":"Model P","ko":"모형 P"},"wrong":[{"en":"Model Q","ko":"모형 Q"},{"en":"Both equally","ko":"둘 다 같아요"}]}
],
"2": [
{"ask":{"en":"Which test best checks the function of the toe webbing?","ko":"발가락 사이 물갈퀴의 쓰임을 가장 잘 살필 검사는?"},"show":{"en":"Two matching model feet have the same shape except that one has a sheet between its toes.","ko":"같은 모양의 모형 발 두 개 중 하나에만 발가락 사이 막이 있어요."},"right":{"en":"Pull both through water the same way and compare resistance","ko":"같은 방법으로 물속에서 당겨 저항을 비교해요"},"wrong":[{"en":"Pull them through different liquids at different speeds","ko":"서로 다른 액체에서 다른 속도로 당겨요"},{"en":"Compare only the two models’ paint colors","ko":"두 모형에 칠한 색만 비교해요"}]},
{"ask":{"en":"Which comparison links both features to the observed functions?","ko":"두 특징을 관찰한 쓰임에 모두 연결한 비교는?"},"show":{"en":"Practice models: wide foot P pushes 3 cups of water; narrow foot Q pushes 1. Thick cover R loses 4°C; thin cover T loses 10°C under matching conditions.","ko":"연습 모형: 넓은 발 P는 물 3컵, 좁은 발 Q는 1컵을 밀어요. 같은 조건에서 두꺼운 덮개 R은 4°C, 얇은 덮개 T는 10°C 내려가요."},"right":{"en":"P moves more water; R retains more warmth","ko":"P가 물을 더 밀고 R이 따뜻함을 더 유지해요"},"wrong":[{"en":"Q moves more water; T retains more warmth","ko":"Q가 물을 더 밀고 T가 따뜻함을 더 유지해요"},{"en":"P moves less water; R loses more warmth","ko":"P가 물을 덜 밀고 R이 따뜻함을 더 잃어요"}]}
]
},
"survival3": {
"1": [
{"ask":{"en":"After the change, which checked need is still missing?","ko":"변화 뒤에도 부족한 필요 조건은?"},"show":{"en":"Practice site needs food, water, and shelter. It starts with water only. A shelter is then added.","ko":"연습 장소에 먹이, 물, 숨을 곳이 필요해요. 처음에는 물만 있고 이후 숨을 곳을 더해요."},"right":{"en":"Food","ko":"먹이"},"wrong":[{"en":"Water","ko":"물"},{"en":"Shelter","ko":"숨을 곳"}]},
{"ask":{"en":"Which checked resource is lost after this change?","ko":"변화 뒤에 사라진 필요 자원은?"},"show":{"en":"Practice site has water and trees. The stream dries up, while the trees remain.","ko":"연습 장소에 물과 나무가 있어요. 개울이 마르고 나무는 남아요."},"right":{"en":"Water","ko":"물"},"wrong":[{"en":"Trees","ko":"나무"},{"en":"Both resources","ko":"두 자원 모두"}]}
],
"2": [
{"ask":{"en":"Which site meets all three listed needs after the changes?","ko":"변화 뒤에 적힌 세 조건을 모두 갖춘 곳은?"},"show":{"en":"Needs: food, water, shelter. P has food and water, then receives shelter. Q has all three, then loses water.","ko":"조건: 먹이, 물, 숨을 곳. P는 먹이와 물이 있고 숨을 곳을 더해요. Q는 셋 다 있다가 물을 잃어요."},"right":{"en":"Site P only","ko":"P만"},"wrong":[{"en":"Site Q only","ko":"Q만"},{"en":"Both sites","ko":"두 곳 모두"}]},
{"ask":{"en":"Which plan fills the missing needs without replacing resources already present?","ko":"있는 자원은 바꾸지 않고 부족한 조건을 채우는 계획은?"},"show":{"en":"Both sites need food and water. P has food only. Q has water only.","ko":"두 곳 모두 먹이와 물이 필요해요. P에는 먹이만, Q에는 물만 있어요."},"right":{"en":"Add water at P and food at Q","ko":"P에 물, Q에 먹이를 더해요"},"wrong":[{"en":"Add food at P and water at Q","ko":"P에 먹이, Q에 물을 더해요"},{"en":"Add only shelter to both sites","ko":"두 곳에 숨을 곳만 더해요"}]}
]
},
"pollution3": {
"1": [
{"ask":{"en":"Where should the next observer check after the spill reaches the drain?","ko":"유출된 물질이 배수구에 닿은 뒤 다음으로 살펴볼 곳은?"},"show":{"en":"Practice route: road → storm drain → pond. A spill has reached the middle step.","ko":"연습 경로: 도로 → 빗물 배수구 → 연못. 유출된 물질이 가운데 단계에 닿았어요."},"right":{"en":"Pond","ko":"연못"},"wrong":[{"en":"Road","ko":"도로"},{"en":"Storm drain","ko":"빗물 배수구"}]},
{"ask":{"en":"Which statement records where particles were actually found?","ko":"입자를 실제로 찾은 곳을 적은 설명은?"},"show":{"en":"Practice pollutant count: near site—18 particles; far site—5 particles. Both were checked using the same method.","ko":"연습 오염 입자 기록: 가까운 곳 18개, 먼 곳 5개. 두 곳을 같은 방법으로 살폈어요."},"right":{"en":"Particles were found at both sites","ko":"두 곳 모두 입자를 찾았어요"},"wrong":[{"en":"Particles were found only near the source","ko":"가까운 곳에서만 입자를 찾았어요"},{"en":"Particles were found only at the far site","ko":"먼 곳에서만 입자를 찾았어요"}]}
],
"2": [
{"ask":{"en":"Which comparison best supports a change after the event?","ko":"사건 뒤 변화를 가장 잘 보여 주는 비교는?"},"show":{"en":"Practice counts, same method: P—2 before, 14 after; Q—3 before, 3 after.","ko":"같은 방법의 연습 기록: P는 전 2개, 후 14개. Q는 전 3개, 후 3개."},"right":{"en":"P increased by 12; Q stayed the same","ko":"P는 12개 늘고 Q는 그대로예요"},"wrong":[{"en":"Both increased by 12","ko":"두 곳 모두 12개 늘었어요"},{"en":"P stayed the same; Q increased by 12","ko":"P는 그대로이고 Q는 12개 늘었어요"}]},
{"ask":{"en":"Which pathway includes both the first exposure and a later transfer?","ko":"처음 닿은 곳과 나중에 옮겨간 곳을 모두 나타낸 경로는?"},"show":{"en":"Practice record: soot first entered the air; later rain carried some soot onto the soil.","ko":"연습 기록: 검댕이 먼저 공기로 들어갔고 나중에 비가 일부를 흙으로 옮겼어요."},"right":{"en":"Air → land","ko":"공기 → 땅"},"wrong":[{"en":"Land → air","ko":"땅 → 공기"},{"en":"Water → air","ko":"물 → 공기"}]}
]
},
"conserve3": {
"1": [
{"ask":{"en":"Which plan reduces single-use materials?","ko":"일회용 재료를 덜 쓰는 계획은?"},"show":{"en":"A class will hang the same sign at six weekly meetings.","ko":"학급이 6주 동안 매주 같은 안내판을 걸 거예요."},"right":{"en":"Keep one sturdy sign for all meetings","ko":"튼튼한 안내판 하나를 계속 써요"},"wrong":[{"en":"Make and discard a new sign each week","ko":"매주 새 안내판을 만들고 버려요"},{"en":"Make six extra signs and discard the unused ones","ko":"여분 6개를 만들고 안 쓴 것을 버려요"}]},
{"ask":{"en":"Which plan meets the need without buying more tools?","ko":"도구를 더 사지 않고 필요를 채우는 계획은?"},"show":{"en":"Three pupils need a ruler at different times. One ruler is available.","ko":"학생 세 명이 서로 다른 시간에 자가 필요해요. 자 하나가 있어요."},"right":{"en":"Take turns using the available ruler","ko":"있는 자를 번갈아 써요"},"wrong":[{"en":"Buy a separate ruler for each pupil","ko":"학생마다 자를 하나씩 사요"},{"en":"Store the available ruler and buy three more","ko":"있는 자는 두고 세 개를 더 사요"}]}
],
"2": [
{"ask":{"en":"Which comparison best shows the material savings?","ko":"재료를 얼마나 덜 썼는지 가장 잘 보여 주는 비교는?"},"show":{"en":"Plan A uses one sign for six meetings. Plan B uses one new sign at every meeting.","ko":"A는 모임 6번에 안내판 하나를 써요. B는 매번 새 안내판 하나를 써요."},"right":{"en":"A uses five fewer signs than B","ko":"A는 B보다 안내판을 5개 덜 써요"},"wrong":[{"en":"A uses six fewer signs than B","ko":"A는 B보다 안내판을 6개 덜 써요"},{"en":"Both plans use six signs","ko":"두 계획 모두 6개를 써요"}]},
{"ask":{"en":"Which comparison explains when sharing one ruler works?","ko":"자 하나를 공유할 수 있는 때를 바르게 비교한 것은?"},"show":{"en":"Group A measures one at a time. Group B must have all three pupils measure at once.","ko":"A는 한 명씩 재요. B는 세 명이 꼭 동시에 재야 해요."},"right":{"en":"One ruler meets A’s timing but not B’s","ko":"자 하나는 A의 시간 조건에 맞지만 B에는 안 맞아요"},"wrong":[{"en":"One ruler meets both groups’ timing equally","ko":"자 하나로 두 모임의 시간 조건을 똑같이 채워요"},{"en":"Both groups need a new ruler for every turn","ko":"두 모임 모두 차례마다 새 자가 필요해요"}]}
]
},
"heatsource3": {
"1": [
{"ask":{"en":"Which setup gives evidence that the powered device warmed the sample?","ko":"기기를 켜서 표본이 따뜻해졌다는 근거가 있는 장치는?"},"show":{"en":"Practice test: matching devices and samples. A: off, 20°C → 20°C. B: on, 20°C → 32°C. C: off, 20°C → 20°C.","ko":"연습 실험: 같은 기기와 표본이에요. A: 끔, 20°C → 20°C. B: 켬, 20°C → 32°C. C: 끔, 20°C → 20°C."},"right":{"en":"Setup B","ko":"장치 B"},"wrong":[{"en":"Setup A","ko":"장치 A"},{"en":"Setup C","ko":"장치 C"}]},
{"ask":{"en":"Which result supports the idea that direct light supplies warming energy?","ko":"빛이 직접 닿아 따뜻해진다는 생각을 뒷받침하는 결과는?"},"show":{"en":"Each trial uses matching blocks starting at 20°C. One receives direct sunlight and one is under an opaque cover. Other conditions stay the same. Compare final temperatures.","ko":"각 실험에서 같은 블록 두 개를 20°C로 시작해요. 하나는 햇빛을 직접 받고 하나는 빛을 막는 덮개 아래 있어요. 다른 조건은 같아요. 끝 온도를 비교해요."},"right":{"en":"Exposed 30°C; covered 21°C","ko":"노출 30°C, 덮음 21°C"},"wrong":[{"en":"Exposed 21°C; covered 30°C","ko":"노출 21°C, 덮음 30°C"},{"en":"Exposed 21°C; covered 21°C","ko":"노출 21°C, 덮음 21°C"}]}
],
"2": [
{"ask":{"en":"Which comparison would help test this explanation?","ko":"이 설명을 확인하는 데 도움이 되는 비교는?"},"show":{"en":"An adult slides two rough surfaces together repeatedly. The contact area gets warmer.","ko":"어른이 거친 두 면을 여러 번 비벼요. 맞닿은 부분이 따뜻해져요."},"right":{"en":"Compare rubbing with resting surfaces in the same place","ko":"같은 곳에서 비빈 면과 가만둔 면 비교"},"wrong":[{"en":"Compare a sunny place with a dark place only","ko":"햇빛 있는 곳과 어두운 곳만 비교"},{"en":"Compare different colors without any rubbing","ko":"비비지 않고 색만 비교"}]},
{"ask":{"en":"Why compare matching tiles at the same starting temperature?","ko":"같은 타일의 처음 온도를 같게 하는 까닭은?"},"show":{"en":"Two matching tiles start equally warm. One sits in direct sunshine; one is shaded. The sunlit tile warms more.","ko":"같은 타일 두 개의 처음 온도는 같아요. 하나는 햇빛에, 하나는 그늘에 두었더니 햇빛 쪽이 더 따뜻해졌어요."},"right":{"en":"To compare the different light exposure fairly","ko":"받는 햇빛의 차이를 공정하게 비교하려고"},"wrong":[{"en":"To make the shaded tile receive more light","ko":"그늘 쪽 타일이 햇빛을 더 받게 하려고"},{"en":"To compare the effect of different tile sizes","ko":"서로 다른 타일 크기의 효과를 비교하려고"}]}
]
},
"sunshade3": {
"1": [
{"ask":{"en":"Which screen is between the incoming light and its block?","ko":"오는 빛과 블록 사이에 있는 가림막은?"},"show":{"en":"New model: light travels horizontally from LEFT. P has a vertical screen left of the block. Q has a screen above the block.","ko":"새 모형: 빛이 왼쪽에서 가로로 와요. P는 블록 왼쪽에 세로 가림막이 있고 Q는 위에 가림막이 있어요."},"right":{"en":"Screen P","ko":"가림막 P"},"wrong":[{"en":"Screen Q","ko":"가림막 Q"},{"en":"Both screens","ko":"두 가림막 모두"}]},
{"ask":{"en":"Which design had the lower final temperature?","ko":"끝 온도가 더 낮았던 설계는?"},"show":{"en":"Practice test: matching blocks start at 20°C and run for the same time. Roof design U ends at 24°C; roof design V ends at 31°C.","ko":"연습 실험: 같은 블록을 20°C에서 같은 시간 실험해요. 지붕 설계 U는 24°C, 설계 V는 31°C로 끝나요."},"right":{"en":"Design U","ko":"설계 U"},"wrong":[{"en":"Design V","ko":"설계 V"},{"en":"Both equally","ko":"둘 다 같아요"}]}
]
}
};
const bankGrowthEscape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const bankGrowthMake=(id,lv,make)=>{const rows=bankGrowthRows[id]?.[lv];if(rows&&rnd(6)===0){const r=pick(rows);const it=q(r.ask,panel(bankGrowthEscape(L(r.show))),r.right,r.wrong);it.bankGrowth=true;it.cls+=' bank-growth-options';return it;}return make(lv);};
})();
