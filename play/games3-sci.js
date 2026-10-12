(() => {
'use strict';
// Fact sources and limits are documented in docs/review/codex-done-10.md.
const reg=(id,en,ko,code,make)=>registerGame({id,grade:'3',subject:'sci',icon:'🔬',title:B(en,ko),sub:B('Observe, compare and use evidence','관찰하고 비교하며 근거를 찾아요'),area:B(`Grade 3 Science · ${code}`,`3학년 과학 · ${code}`),play(){quiz(this,make(lvl(id)));}});
const panel=s=>`<div class="g3-science">${s}</div>`;
const opts=(r,w)=>[r,...w].map((s,i)=>({html:`<span class="word">${typeof s==='object'?L(s):s}</span>`,ok:i===0}));
const q=(ask,show,r,w,after)=>({ask,show,opts:opts(r,w),cls:'words g3-science-options',after:after|| (typeof r==='object'?r:B(String(r),String(r)))});
const table=(head,rows)=>panel(`<table><thead><tr>${head.map(s=>`<th>${L(s)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(s=>`<td>${typeof s==='object'?L(s):s}</td>`).join('')}</tr>`).join('')}</tbody></table>`);
const bank=(id,en,ko,code,rows)=>reg(id,en,ko,code,lv=>{const r=pick(lv===1?rows.slice(0,2):rows);return q(r[0],r[1]?panel(L(r[1])):'',r[2],r.slice(3));});
const made=B('Practice observations (made up)','연습용 가상 관찰');
reg('rocksort3','Rock Observations','암석 관찰','S3E1.a',lv=>{
 const labels=shuffle(['A','B','C']),rough=B('rough','거칠어요'),smooth=B('smooth','매끈해요'),red=B('red','빨강'),gray=B('gray','회색');
 return q(lv===1?B('Which sample is rough?','표면이 거친 표본은?'):B('Which sample is BOTH red and smooth?','빨간색이면서 표면이 매끈한 표본은?'),table([made,B('Color','색'),B('Texture','질감')],[[labels[0],red,rough],[labels[1],red,smooth],[labels[2],gray,smooth]]),lv===1?labels[0]:labels[1],lv===1?[labels[1],labels[2]]:[labels[0],labels[2]],B('Describe properties; color alone does not identify a rock.','성질을 관찰해요. 색만으로 암석 이름을 알 수는 없어요.'));
});
bank('rocktest3','Choose an Observation','관찰 방법 고르기','S3E1.a',[
 [B('Which test compares hardness?','단단한 정도를 비교하는 방법은?'),null,B('Compare resistance to scratching','긁힘에 견디는 정도 비교'),B('Compare color in a picture','사진의 색 비교'),B('Compare the names','이름 비교')],
 [B('Which observation describes luster?','광택을 살펴보는 방법은?'),null,B('Look at reflected light','반사되는 빛 살펴보기'),B('Count letters in its name','이름의 글자 수 세기'),B('Weigh the container','통의 무게 재기')],
 [B('How can we compare scratch tests fairly?','긁기 실험을 공정하게 하려면?'),B('An adult tests two samples.','어른이 표본 두 개를 긁어 봐요.'),B('Use the same tool and method','같은 도구와 방법 사용'),B('Use a different tool for each','각각 다른 도구 사용'),B('Guess from color only','색만 보고 짐작')]]);
reg('soil3','Soil Evidence','흙의 성질','S3E1.b',lv=>{
 const sand=40+rnd(20),clay=10+rnd(15),loam=25+rnd(10);
 if(lv===1)return q(B('Which sample has the most sand in this data?','이 자료에서 모래가 가장 많은 표본은?'),...(()=>{const k=shuffle(['A','B','C']);return [table([made,B('Sand parts / 100','모래 양(100 중)')],[[k[0],sand+30],[k[1],clay],[k[2],loam]].sort((x,y)=>x[0].localeCompare(y[0]))),k[0],[k[1],k[2]]];})());
 return q(B('Same plant type and conditions. Which grew tallest in THIS trial?','같은 종류의 식물을 같은 조건에서 길렀어요. 이번 실험에서 가장 크게 자란 것은?'),...(()=>{const k=shuffle(['A','B','C']);return [table([made,B('Height (cm)','키(cm)')],[[k[0],clay],[k[1],sand],[k[2],loam]].sort((x,y)=>x[0].localeCompare(y[0]))),k[1],[k[0],k[2]]];})(),B('This trial does not prove one soil is best for every plant.','한 번의 실험으로 모든 식물에 가장 좋은 흙을 정할 수는 없어요.'));
});
reg('soilwater3','Soil and Water','흙과 물','S3E1.b',lv=>{
 const input=100,a=20+rnd(15),b=60+rnd(15),c=40+rnd(10),rows=[['A',a],['B',b],['C',c]];
 if(lv===1)return q(B('Each dry soil gets 100 mL of water. Water leaves only by draining out. Which soil keeps the most?','마른 흙마다 물 100mL를 부어요. 물은 아래로 빠져나가는 것 말고는 줄지 않아요. 물이 가장 많이 남은 흙은?'),table([made,B('Drained (mL)','빠진 물(mL)')],rows),'A',['B','C'],B('Less drained out, so more remained in this trial.','이번 실험에서는 적게 빠진 쪽에 더 많이 남았어요.'));
 return q(B('Each dry soil gets 100 mL of water. Water leaves only by draining out. How many mL stay in soil A?','마른 흙마다 물 100mL를 부어요. 물은 아래로 빠져나가는 것 말고는 줄지 않아요. 흙 A에 남은 물은 몇 mL일까요?'),table([made,B('Drained (mL)','빠진 물(mL)')],rows),input-a,[a,input-a+10],B(`100 − ${a} = ${100-a} mL`,`100 − ${a} = ${100-a}mL`));
});
bank('erosion3','Moving Earth','흙의 이동','S3E1.c',[
 [B('What moved the sand in this observation?','이 관찰에서 모래를 옮긴 것은?'),B('Wind blew. Sand grains traveled across the tray.','바람이 불자 모래 알갱이가 쟁반을 가로질러 이동했어요.'),B('Wind','바람'),B('A growing root','자라는 뿌리'),B('Freezing water','어는 물')],
 [B('Which observation shows erosion?','침식(erosion)이 일어난 관찰은? 침식은 흙이나 돌이 깎여 옮겨지는 거예요.'),null,B('Flowing water carries soil away','흐르는 물이 흙을 옮겨요'),B('A rock cracks in place','돌이 제자리에서 갈라져요'),B('A pebble stays in a jar','자갈이 통 안에 그대로 있어요')],
 [B('What is the evidence of movement?','이동했다는 근거는?'),B('Before rain: soil on a slope. After rain: soil collected downhill.','비 오기 전에는 비탈에 흙이 있었어요. 비 온 뒤에는 아래쪽에 흙이 쌓였어요.'),B('Soil collected downhill','아래쪽에 흙이 쌓였어요'),B('The slope has a name','비탈에 이름이 있어요'),B('A stone is gray','돌이 회색이에요')]]);
bank('fossilclue3','Fossil Clues','화석 단서','S3E2.a',[
 [B('Which is a trace fossil?','흔적 화석(trace fossil)은 어느 것일까요? 옛 생물이 살면서 남긴 흔적이 굳은 화석이에요.'),null,B('An ancient footprint preserved in rock','암석에 남은 옛 발자국'),B('A footprint made today in mud','오늘 진흙에 찍은 발자국'),B('A plastic toy foot','플라스틱 장난감 발')],
 [B('What can a fossil give evidence about?','화석으로 무엇을 알아볼 수 있나요?'),null,B('Life long ago','아주 오래전 생물'),B('Tomorrow’s exact weather','내일의 정확한 날씨'),B('A person’s favorite color','어떤 사람이 좋아하는 색')],
 [B('What does this evidence support?','이 근거로 알 수 있는 것은?'),B('A marine shell fossil was found in a rock layer on land.','육지의 암석층에서 바다 조개 화석을 찾았어요.'),B('A marine animal lived long ago','오래전에 바다 생물이 살았어요'),B('This spot must be underwater today','이곳은 지금도 바닷속이 분명해요'),B('Every fossil is a dinosaur','모든 화석은 공룡이에요')]]);
bank('fossilorder3','Fossil Model','화석 모형','S3E2.b',[
 [B('In this model, what comes next?','이 모형에서 다음 단계는?'),B('A shell rests on the bottom. Sediment begins to pile up.','조개껍데기가 바닥에 있어요. 퇴적물(흙, 모래 등)이 쌓이기 시작해요.'),B('Sediment covers the shell','퇴적물이 껍데기를 덮어요'),B('The shell turns into a living bird','껍데기가 살아 있는 새가 돼요'),B('The shell becomes a cloud','껍데기가 구름이 돼요')],
 [B('Which can improve the chance of preservation?','보존될 가능성을 높일 수 있는 것은?'),null,B('Rapid burial in sediment','퇴적물에 빨리 묻히기'),B('Complete decay','완전히 썩어 없어지기'),B('Being eaten completely','전부 먹혀 없어지기')],
 [B('Which statement fits the fossil model?','화석 모형에 맞는 설명은?'),null,B('Only some remains are preserved','생물의 일부만 화석으로 남아요'),B('Every dead organism becomes a fossil','죽은 생물은 모두 화석이 돼요'),B('All fossils form in one day','모든 화석은 하루 만에 생겨요')]]);
reg('habitat3','Georgia Habitat Notes','조지아 서식지','S3L1.a',lv=>{
 const region=pick([B('Blue Ridge Mountains','블루리지산맥'),B('Piedmont','피드몬트'),B('Coastal Plains','해안 평야'),B('Valley and Ridge','계곡과 산등성이 지역'),B('Appalachian Plateau','애팔래치아 고원')]);
 const rows=lv===1?[[B('A: forest','A: 숲'),B('Trees and shade','나무와 그늘')],[B('B: pond','B: 연못'),B('Still freshwater','잔잔한 민물')]]:[[B('A: stream','A: 개울'),B('Flowing freshwater','흐르는 민물')],[B('B: pond','B: 연못'),B('Still freshwater','잔잔한 민물')]];
 return q(lv===1?B('Which sample habitat has standing freshwater?','물이 고여 있는 민물 서식지는?'):B('What do these two sample habitats share?','두 서식지의 공통점은?'),panel(`${L(B('Imagined field notes in','가상 관찰 지역:'))} ${L(region)}`)+table([B('Site','장소'),B('Observation','관찰')],rows),lv===1?'B':B('Freshwater','민물'),lv===1?['A']: [B('Both have flowing water','둘 다 물이 흘러요'),B('Both are dry','둘 다 말라 있어요')],B('One region can contain several habitats. These notes are fictional.','한 지역에도 여러 서식지가 있어요. 이 기록은 연습용이에요.'));
});
bank('adaptation3','Features for Living','살아가는 특징','S3L1.b',[
 [B('What helps a beaver push through water?','비버가 물을 밀며 헤엄치도록 돕는 특징은?'),B('Beavers have webbed hind feet.','비버의 뒷발에는 물갈퀴가 있어요.'),B('Webbed hind feet','뒷발의 물갈퀴'),B('A paper hat','종이 모자'),B('A painted rock','색칠한 돌')],
 [B('Which function matches webbed feet?','물갈퀴가 있는 발의 쓰임은?'),null,B('Pushing water while swimming','헤엄칠 때 물을 밀기'),B('Reading trail signs','안내판 읽기'),B('Making sunlight','햇빛 만들기')],
 [B('Which connects a feature with its function?','특징과 쓰임을 바르게 이은 것은?'),null,B('Webbed feet help beavers swim','물갈퀴가 비버의 헤엄을 도와요'),B('A beaver wishes and grows wings','비버가 원하면 날개가 자라요'),B('Webbed feet let beavers fly','물갈퀴가 비버를 날게 해요')]]);
bank('survival3','A Place to Live','살 수 있는 곳','S3L1.c',[
 [B('Which site meets BOTH listed needs?','적힌 두 가지 조건을 모두 갖춘 곳은?'),B('For this beaver model: water and woody plants. Site A has both. Site B is dry.','이 비버 모형의 조건: 물과 나무. A에는 둘 다 있고 B는 말라 있어요.'),B('Site A','장소 A'),B('Site B','장소 B'),B('Neither site','둘 다 아니에요')],
 [B('What is missing at this model site?','이 모형 장소에서 부족한 것은?'),B('Needs: water and woody plants. The site has trees but no water.','필요 조건: 물과 나무. 이곳에는 나무만 있고 물은 없어요.'),B('Water','물'),B('Trees','나무'),B('Both are already there','이미 둘 다 있어요')],
 [B('What conclusion fits the evidence?','근거에 맞는 결론은?'),B('Two beaver sites both have water and woody plants. We have not checked other needs.','비버 모형의 두 장소 모두 물과 나무가 있어요. 다른 조건은 아직 살펴보지 않았어요.'),B('Both meet the two checked needs','둘 다 확인한 두 조건은 갖췄어요'),B('Survival is guaranteed at both','둘 다 생존이 보장돼요'),B('Neither has water','둘 다 물이 없어요')]]);
bank('pollution3','Pollution Records','오염 기록','S3L2.a',[
 [B('Which material received the pollution directly?','오염 물질이 직접 들어간 곳은?'),B('Practice record: oil spilled into a pond.','연습용 기록: 연못에 기름이 흘러들었어요.'),B('Water','물'),B('A sealed food jar','밀봉한 음식 통'),B('A closed book','덮어 둔 책')],
 [B('Which record describes air pollution?','공기 오염을 나타내는 기록은?'),null,B('Dirty smoke entered the air','더러운 연기가 공기 중에 퍼졌어요'),B('Clean books went on a shelf','깨끗한 책을 선반에 놓았어요'),B('A child reused a bag','아이가 봉지를 다시 썼어요')],
 [B('Which observation directly supports water pollution?','물 오염을 직접 뒷받침하는 관찰은?'),B('Practice notes: oil floats on pond water; a bench is brown; birds sing.','연습용 기록: 연못에 기름이 떠 있어요. 벤치는 갈색이에요. 새가 노래해요.'),B('Oil floats on the water','물에 기름이 떠 있어요'),B('The bench is brown','벤치가 갈색이에요'),B('Birds sing','새가 노래해요')]]);
bank('conserve3','Protect Resources','자원 지키기','S3L2.b',[
 [B('Which action reuses an item?','물건을 다시 사용하는 행동은?'),null,B('Use a clean jar to store pencils','깨끗한 통에 연필 보관하기'),B('Throw away the clean jar','깨끗한 통 버리기'),B('Buy a jar and never use it','통을 사서 전혀 안 쓰기')],
 [B('Which action reduces paper use?','종이를 덜 쓰는 방법은?'),null,B('Use both sides when suitable','쓸 수 있을 때 종이 양면 쓰기'),B('Use a new page for each word','낱말 하나마다 새 종이 쓰기'),B('Throw away unused pages','안 쓴 종이 버리기')],
 [B('Before putting an item in a recycling bin, what should you check?','재활용 통에 넣기 전에 무엇을 확인하나요?'),null,B('Local rules for accepted materials','우리 지역에서 받는 재활용품'),B('Only its favorite color','좋아하는 색만'),B('Whether every place has identical rules','모든 지역 규칙이 똑같은지')]]);
bank('heatsource3','Sources of Heat','열은 어디에서 올까요?','S3P1.a',[
 [B('What supplies energy that warms a sunlit bench?','햇빛 받는 벤치를 데우는 에너지는 어디서 오나요?'),null,B('The Sun','태양'),B('The bench’s name','벤치의 이름'),B('The shadow alone','그림자 자체')],
 [B('What warms your hands as you rub them?','손을 서로 비빌 때 따뜻해지는 까닭은?'),null,B('Friction from rubbing','비빌 때 생기는 마찰(friction)'),B('The color of your shirt','옷의 색'),B('The word warm','따뜻하다는 말')],
 [B('Which is producing heat in this scene?','이 장면에서 열을 내는 것은?'),B('An electric heater is on. An unplugged lamp stands nearby.','전기 난방기가 켜져 있어요. 옆의 전등은 플러그가 빠져 있어요.'),B('The working heater','켜진 난방기'),B('The unplugged lamp','플러그가 빠진 전등'),B('The label on the wall','벽에 붙은 이름표')]]);
reg('temperature3','Read a Thermometer','온도 읽기','S3P1.b',lv=>{
 const unit=lv===1?'°C':pick(['°C','°F']),base=unit==='°C'?0:40,step=lv===1?10:5,index=1+rnd(7),value=base+index*step;
 const visual=panel(`<svg viewBox="0 0 250 185" role="img" aria-label="${L(B('Thermometer','온도계'))}"><rect x="80" y="12" width="24" height="152" fill="#fff" stroke="#234"/><rect x="85" y="${160-index*18}" width="14" height="${index*18}" fill="#b84120"/>${Array.from({length:9},(_,i)=>`<path d="M104 ${160-i*18} H118" stroke="#234"/><text x="126" y="${165-i*18}">${base+i*step}</text>`).join('')}<text x="180" y="35">${unit}</text></svg>`);
 return q(B(`What temperature does it show in ${unit}?`,`온도계가 가리키는 온도는 몇 ${unit}일까요?`),visual,`${value}${unit}`,[`${value+step}${unit}`,`${value-step}${unit}`]);
});
reg('sundata3','Sunlight Data','햇빛 실험','S3P1.b',lv=>{
 const start=20+rnd(5),sun=start+8+rnd(7),shade=start+1+rnd(4);
 const show=table([made,B('Start °C','처음 °C'),B('After 10 min °C','10분 뒤 °C')],[[B('Sun','햇빛'),start,sun],[B('Shade','그늘'),start,shade]]);
 return lv===1?q(B('Identical blocks. Which ended warmer in this trial?','똑같은 블록 두 개예요. 이번 실험에서 어느 블록이 더 따뜻해졌나요?'),show,B('Sunlit block','햇빛을 받은 블록'),[B('Shaded block','그늘에 둔 블록'),B('Same temperature','같은 온도')]):q(B('How many °C did the SUNLIT block warm?','햇빛을 받은 블록의 온도는 몇 °C 올랐나요?'),show,sun-start,[sun,sun-start+1],B(`${sun} − ${start} = ${sun-start}°C`,`${sun} − ${start} = ${sun-start}°C`));
});
reg('sunshade3','Shade Design Lab','그늘 설계 실험실','S3P1.c',lv=>{
 const roof=!!rnd(2),correct=roof?'A':'B';
 const visual=panel(`<div>${L(B('Model: sunlight comes straight down.','모형: 햇빛이 바로 위에서 내려와요.'))}</div><svg class="g3-shade" viewBox="0 0 320 120" role="img">${[0,1].map((i)=>{const x=80+i*160,covered=i===(roof?0:1);return `<text x="${x}" y="18" text-anchor="middle">${'AB'[i]} ↓ ☀ ↓</text><path d="M${x-38} ${covered?50:104} H${x+38}" stroke="#234" stroke-width="7"/><rect x="${x-15}" y="75" width="30" height="20" fill="#df713d"/>`;}).join('')}</svg></div>`);
 if(lv===1)return q(B('Which cover blocks light BEFORE it reaches the block?','어느 가림막이 블록에 닿기 전에 햇빛을 막나요?'),visual,correct,[correct==='A'?'B':'A']);
 return q(B('How should we compare these designs fairly?','두 설계를 공정하게 비교하려면?'),visual,B('Same blocks, start temperature and time','같은 블록·처음 온도·시간'),[B('Different blocks and times','서로 다른 블록과 시간'),B('Measure only the prettier design','예쁜 설계만 측정')],B('This light-path model is a plan. Real temperatures need testing.','빛의 경로 모형은 계획이에요. 실제 온도는 실험해야 알아요.'));
});
})();
