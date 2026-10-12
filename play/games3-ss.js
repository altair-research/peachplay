(() => {
'use strict';
// Four map-dependent candidates are deferred; see codex-done-11.md.
const reg=(id,en,ko,code,make)=>registerGame({id,grade:'3',subject:'ss',icon:'🌎',title:B(en,ko),sub:B('Read evidence and compare ideas','자료를 읽고 생각을 비교해요'),area:B(`Grade 3 Social Studies · ${code}`,`3학년 사회 · ${code}`),play(){quiz(this,make(lvl(id)));}});
const panel=s=>`<div class="g3-social">${s}</div>`;
const q=(ask,show,r,w,after)=>({ask,show,opts:[r,...w].map((s,i)=>({html:`<span class="word">${typeof s==='object'?L(s):s}</span>`,ok:i===0})),cls:'words g3-social-options',after:after||(typeof r==='object'?r:B(String(r),String(r)))});
const bank=(id,en,ko,code,rows)=>reg(id,en,ko,code,lv=>{const r=pick(lv===1?rows.slice(0,2):rows);return q(r[0],r[1]?panel(L(r[1])):'',r[2],r.slice(3));});
reg('globe3','Lines around Earth','지구본의 선','SS3G2',lv=>{
 const lat=!!rnd(2),zero=lv===1||!!rnd(2),value=zero?0:pick([30,-30,60,-60]);
 // Existing Natural Earth public-domain paths, equirectangular lon+180 / 90-lat.
 const outline=Object.values(WORLD_PATHS).map(d=>`<path d="${d}" fill="#d7e7b9" stroke="#62754c" stroke-width=".4"/>`).join('');
 const line=lat?`M0 ${90-value} H360`:`M${180+value} 0 V180`;
 const visual=panel(`<svg viewBox="0 0 360 180" role="img" aria-label="${L(B('World map with one highlighted line','선 하나를 강조한 세계 지도'))}"><rect width="360" height="180" fill="#d9effc"/>${outline}<path d="M0 90 H360 M180 0 V180" stroke="#667" stroke-dasharray="3 3"/><path d="${line}" stroke="#b52f28" stroke-width="3"/><text x="${lat?330:180+value+4}" y="${lat?Math.max(15,90-value-6):20}" font-size="15">${Math.abs(value)}°</text></svg>`);
 if(zero)return q(B('What is the thick red 0° line?','굵은 빨간 0° 선의 이름은?'),visual,lat?B('Equator','적도'):B('Prime meridian','본초자오선'),[lat?B('Prime meridian','본초자오선'):B('Equator','적도'),B('A country border','나라의 경계')]);
 return q(lat?B('The red latitude line tells position north or south of which line?','빨간 위선은 어느 선을 기준으로 남북 위치를 알려 주나요?'):B('The red longitude line tells position east or west of which line?','빨간 경선은 어느 선을 기준으로 동서 위치를 알려 주나요?'),visual,lat?B('Equator','적도'):B('Prime meridian','본초자오선'),[lat?B('Prime meridian','본초자오선'):B('Equator','적도'),B('A highway','고속도로')],B('Latitude measures north/south; longitude measures east/west.','위도는 남북 위치, 경도는 동서 위치를 나타내요.'));
});
bank('nativehomes3','Homes and Environments','환경과 생활','SS3H1.b · SS3G3.a',[
 [B('Which material covered these traditional longhouses?','이 전통 롱하우스의 벽과 지붕을 덮은 재료는?'),B('Haudenosaunee builders used wooden frames and bark coverings for longhouses.','하우데노쇼니 사람들은 나무로 뼈대를 세우고 나무껍질로 롱하우스를 덮었어요.'),B('Bark','나무껍질'),B('Steel sheets','강철판'),B('Glass blocks','유리 블록')],
 [B('What formed the frame of this traditional wetu?','이 전통 웨투의 뼈대는 무엇으로 만들었나요?'),B('In the 1600s, Wampanoag builders bent young trees to frame a wetu. Bark or cattail mats covered it.','1600년대 왐파노아그 사람들은 어린 나무를 휘어 웨투의 틀을 만들고 나무껍질이나 부들 돗자리로 덮었어요.'),B('Young trees','어린 나무'),B('Plastic pipes','플라스틱 관'),B('Brick towers','벽돌 탑')],
 [B('What do these examples show?','이 사례들에서 알 수 있는 것은?'),B('Haudenosaunee longhouses used wood and bark. Wampanoag wetu frames used young trees.','하우데노쇼니 롱하우스에는 나무와 껍질을, 왐파노아그 웨투 틀에는 어린 나무를 썼어요.'),B('Builders used plant materials','식물 재료를 이용했어요'),B('Every Native nation had identical homes','모든 원주민 공동체의 집이 같았어요'),B('Native peoples exist only in the past','원주민은 과거에만 있었어요')]]);
bank('nativetoday3','Living Cultures','오늘의 기여','SS3H1.c',[
 [B('What does this modern artist create?','이 현대 예술가는 무엇을 만드나요?'),B('Diné artist DY Begay weaves wool tapestries. Colors of her homeland inspire her work.','디네 예술가 DY 베게이는 양털 실로 태피스트리를 짜요. 고향의 색에서 영감을 얻어요.'),B('Woven art','직물 예술'),B('Space rockets','우주 로켓'),B('Road signs only','도로 표지판만')],
 [B('What connects past and present here?','여기서 과거와 현재를 잇는 활동은?'),B('At Plimoth Patuxet, Native staff demonstrate traditional building methods for visitors today.','오늘날 플리머스 패턱셋의 원주민 직원들은 방문객에게 전통 건축 방법을 보여 줘요.'),B('Teaching traditional skills today','오늘날 전통 기술을 알려요'),B('Claiming Native people no longer exist','원주민이 더는 없다고 말해요'),B('Saying all homes are identical','모든 집이 같다고 말해요')],
 [B('Which statement fits the evidence?','자료에 맞는 설명은?'),B('Jeffrey Gibson is a contemporary artist and a citizen of the Mississippi Band of Choctaw Indians.','제프리 깁슨은 현대 예술가이며 미시시피 밴드 오브 촉토 인디언스의 시민이에요.'),B('Native people contribute to art today','원주민은 오늘날에도 예술에 기여해요'),B('Native art ended long ago','원주민 예술은 오래전에 끝났어요'),B('All Native artists make the same work','모든 원주민 예술가의 작품은 같아요')]]);
bank('explorerwhy3','Voyage Goals','탐험의 목적과 어려움','SS3H2.a · SS3G3.b',[
 [B('What was the goal of this voyage?','이 항해의 목표는 무엇이었나요?'),B('In 1492, Columbus sailed west seeking a sea route to Asia, with support from Spain.','1492년 콜럼버스는 스페인의 지원으로 아시아에 가는 바닷길을 찾으려고 서쪽으로 항해했어요.'),B('A westward sea route to Asia','서쪽으로 가는 아시아 항로'),B('A flight to the Moon','달로 가는 비행'),B('A railway across Europe','유럽을 가로지르는 철도')],
 [B('Which country supported the 1492 voyage?','1492년 항해를 지원한 나라는?'),B('Columbus’s 1492 westward voyage was supported by Spain.','콜럼버스의 1492년 서쪽 항해는 스페인의 지원을 받았어요.'),B('Spain','스페인'),B('Japan','일본'),B('Canada','캐나다')],
 [B('Which statement matches the evidence?','자료에 맞는 설명은?'),B('Columbus sought a route to Asia. The lands he reached already had Native peoples living there.','콜럼버스는 아시아 항로를 찾으려고 했어요. 그가 도착한 땅에는 이미 원주민이 살고 있었어요.'),B('People already lived in those lands','이미 그 땅에 사람들이 살았어요'),B('All the land was empty','땅이 모두 비어 있었어요'),B('Every explorer had an identical goal','모든 탐험가의 목표가 같았어요')]]);
bank('encounter3','More than One Record','만남의 여러 기록','SS3H2.c',[
 [B('Why read accounts from more than one group?','여러 집단의 기록을 읽는 까닭은?'),B('Different people could experience the same encounter differently.','같은 만남을 겪어도 사람마다 경험은 다를 수 있어요.'),B('To compare experiences and evidence','경험과 근거를 비교하려고'),B('To assume one group had no history','한 집단에 역사가 없다고 하려고'),B('To ignore all evidence','모든 근거를 무시하려고')],
 [B('Which description includes the harm?','피해를 빠뜨리지 않은 설명은?'),B('De Soto’s expedition sought wealth and resources and used violence and force against Native communities.','데소토 원정대는 부와 자원을 찾았으며 원주민 공동체에 폭력과 강제를 가했어요.'),B('The expedition harmed Native communities','원정대가 원주민 공동체에 피해를 줬어요'),B('Every encounter was peaceful','모든 만남이 평화로웠어요'),B('The land had no communities','그 땅에 공동체가 없었어요')],
 [B('What should a careful history account include?','역사를 신중히 설명하려면 무엇을 포함해야 하나요?'),B('An expedition’s goal does not tell us how every community experienced it.','원정대의 목표만으로 모든 공동체가 어떤 일을 겪었는지 알 수는 없어요.'),B('Evidence about affected communities too','영향받은 공동체에 관한 근거도'),B('Only the leader’s wishes','지도자가 바란 것만'),B('A claim that no one was harmed','아무도 피해받지 않았다는 단정')]]);
bank('colonyregion3','Colonial Regions','식민지 세 지역','SS3H3.a · SS3G3.c',[
 [B('Which region is described in this source card?','자료카드가 설명하는 지역은?'),B('Early 1700s: New York and Philadelphia were port cities in the Mid-Atlantic colonies.','1700년대 초 뉴욕과 필라델피아는 중부 대서양 식민지의 항구 도시였어요.'),B('Mid-Atlantic','중부 대서양'),B('New England','뉴잉글랜드'),B('Southern','남부')],
 [B('Which region sent ships carrying salted cod?','소금에 절인 대구를 실은 배를 보낸 지역은?'),B('New England ships carried salted cod to Atlantic markets.','뉴잉글랜드 배들은 소금에 절인 대구를 대서양 시장으로 운반했어요.'),B('New England','뉴잉글랜드'),B('Mid-Atlantic','중부 대서양'),B('Southern','남부')],
 [B('How could a port help trade?','항구는 무역에 어떤 도움을 주나요?'),B('Ships carried goods between colonial ports and other Atlantic ports.','배가 식민지 항구와 대서양의 다른 항구 사이로 물건을 실어 날랐어요.'),B('Ships could load and unload goods','배에서 물건을 싣고 내렸어요'),B('Ports made all land flat','항구가 모든 땅을 평평하게 했어요'),B('Ports ended all disagreements','항구가 모든 갈등을 없앴어요')]]);
bank('colonylife3','Colonial Lives','식민지 생활 비교','SS3H3.b',[
 [B('What was grown in this region?','이 지역에서는 무엇을 재배했나요?'),B('In the early 1700s, Mid-Atlantic farms grew grains and vegetables and raised livestock.','1700년대 초 중부 대서양 농장에서는 곡물과 채소를 재배하고 가축을 길렀어요.'),B('Grains and vegetables','곡물과 채소'),B('Plastic toys','플라스틱 장난감'),B('Electric lamps','전등')],
 [B('Who attended this particular school?','이 학교에 다닌 아이들은 누구였나요?'),B('Williamsburg’s Bray School (1760–1774) taught both free and enslaved Black children.','윌리엄스버그 브레이 학교(1760~1774)에는 자유로운 신분과 노예로 강제된 신분의 흑인 아이들이 다녔어요.'),B('Both free and enslaved Black children','두 신분의 흑인 아이들'),B('Only white adults','백인 어른만'),B('No children','아이는 아무도 없었어요')],
 [B('What can we conclude from the Bray School example?','브레이 학교의 사례로 알 수 있는 것은?'),B('Some free and enslaved Black children attended this school in Williamsburg.','자유로운 신분과 노예로 강제된 신분의 흑인 아이들 중 일부가 이 학교에 다녔어요.'),B('Some children there received schooling','그곳의 일부 아이들이 교육받았어요'),B('Every child in every colony attended','모든 식민지의 모든 아이가 다녔어요'),B('No Black child ever attended school','흑인 아이는 아무도 학교에 못 갔어요')]]);
bank('colonyperspective3','Different Rights and Limits','서로 다른 삶','SS3H3.c',[
 [B('Which limit on choice is described?','어떤 선택의 제한을 설명하나요?'),B('Some indentured servants in colonial Maryland asked courts for release after their agreed service period ended.','식민지 메릴랜드의 일부 계약 노동자는 약속한 노동 기간 뒤에도 풀려나지 못해 법원에 호소했어요.'),B('They were kept beyond the agreed period','약속한 기간 뒤에도 붙잡혀 있었어요'),B('They chose everyone’s laws','모든 사람의 법을 정했어요'),B('They owned every farm','모든 농장을 소유했어요')],
 [B('Whose status did this law use?','이 법은 누구의 신분을 따르도록 했나요?'),B('A 1662 Virginia law made a child’s free or enslaved status follow the mother’s status.','1662년 버지니아 법은 아이가 자유로운 신분인지 노예로 강제된 신분인지를 어머니의 신분에 따르게 했어요.'),B('The mother’s','어머니의 신분'),B('A neighbor’s','이웃의 신분'),B('The child’s chosen job','아이가 고른 직업')],
 [B('Why must these experiences be distinguished?','이 경험들을 구별해야 하는 까닭은?'),B('Indentured service had an agreed term. Virginia’s 1662 law tied a child’s enslaved status to the mother.','계약 노동에는 약속한 기간이 있었어요. 버지니아의 1662년 법은 아이의 노예 신분을 어머니와 연결했어요.'),B('The legal limits were different','법에 따른 제한이 달랐어요'),B('Everyone had equal freedom','모두 똑같이 자유로웠어요'),B('Forced labor was just a game','강제 노동은 놀이였어요')]]);
const branches=[
 {role:B('makes laws','법을 만들어요'),kind:B('Legislative','입법'),f:B('Congress','연방 의회'),s:B('Georgia General Assembly','조지아 주 의회')},
 {role:B('carries out laws','법을 집행해요'),kind:B('Executive','행정'),f:B('President','대통령'),s:B('Governor','주지사')},
 {role:B('interprets laws in court','법원에서 법을 해석해요'),kind:B('Judicial','사법'),f:B('U.S. Supreme Court','미국 연방 대법원'),s:B('Supreme Court of Georgia','조지아주 대법원')}
];
for(const [id,en,ko,key,code] of [['federal3','Three Federal Branches','연방의 세 기관','f','SS3CG1.a/c'],['state3','Three Georgia Branches','조지아의 세 기관','s','SS3CG1.b/c']])reg(id,en,ko,code,lv=>{
 const i=rnd(3),r=branches[i],w=branches.filter((_,j)=>j!==i);
 return lv===1?q(B(`Which ${key==='f'?'federal':'Georgia state'} institution ${r.role.en}?`,`${key==='f'?'연방':'조지아주'} 기관 중 다음 일을 맡은 곳은?`),panel(L(r.role)),r[key],w.map(x=>x[key])):q(B(`Which branch includes the ${r[key].en}?`,`${r[key].ko}: 어느 부문에 속하나요?`),'',r.kind,w.map(x=>x.kind),r.role);
});
bank('civic3','Community Choices','함께 사는 선택','SS3CG2.a–b',[
 [B('Which action lets both speakers be heard?','두 사람의 말을 모두 들을 수 있는 방법은?'),B('Two neighbors disagree at a meeting.','이웃 두 사람이 모임에서 의견이 달라요.'),B('Give each a turn to explain','차례로 설명할 기회를 줘요'),B('Silence the person who disagrees','다른 의견인 사람을 막아요'),B('Hide the meeting notes','모임 기록을 숨겨요')],
 [B('Which action checks information first?','정보를 먼저 확인하는 행동은?'),B('A rumor says the library will close.','도서관이 문을 닫는다는 소문을 들었어요.'),B('Check the library’s official notice','도서관의 공식 안내 확인'),B('Spread it as certain news','확실한 사실처럼 퍼뜨리기'),B('Invent a closing date','문 닫는 날짜 지어내기')],
 [B('Which action serves a shared need?','여러 사람에게 필요한 일을 돕는 행동은?'),B('Neighbors plan an approved park clean-up.','이웃이 허가받은 공원 청소를 계획해요.'),B('Volunteer with the organized group','계획한 모둠과 함께 봉사'),B('Block others from the park','다른 사람이 공원에 못 오게 하기'),B('Hide the shared tools','공동 도구 숨기기')]]);
reg('resources3','Four Production Resources','생산 자원 네 가지','SS3E1.a–d',lv=>{
 const rows=[
 [B('Trees used for lumber','목재로 쓰는 나무'),B('Natural resource','자연 자원')],
 [B('A carpenter’s work','목수의 노동'),B('Human resource','인적 자원')],
 [B('A saw used to make tables','탁자를 만드는 톱'),B('Capital good','자본재(생산 도구)')],
 [B('A person organizing a new table-making business','탁자 사업을 새로 계획하는 사람'),B('Entrepreneur','기업가')]
 ];const i=rnd(lv===1?3:4),r=rows[i];return q(B('Which resource category matches?','어떤 생산 자원에 해당하나요?'),panel(L(r[0])),r[1],shuffle(rows.filter((_,j)=>j!==i)).slice(0,2).map(x=>x[1]));
});
bank('publicservice3','Taxes and Services','세금과 서비스','SS3E2',[
 [B('What helps governments pay for public services?','정부가 공공서비스 비용을 마련하는 방법은?'),null,B('Taxes','세금'),B('Wishing for free supplies','물품이 저절로 생기길 바라기'),B('Ignoring every cost','모든 비용 무시하기')],
 [B('Which is a public service in this example?','이 사례의 공공서비스는?'),B('A town uses tax money to run its public library.','마을이 세금으로 공공도서관을 운영해요.'),B('The public library','공공도서관'),B('A family’s private toy box','가족의 개인 장난감 통'),B('A child’s birthday gift','아이의 생일 선물')],
 [B('Which statement fits?','맞는 설명을 골라요.'),B('Different governments help provide schools, roads, and fire protection using taxes.','여러 정부가 세금으로 학교, 도로, 소방 서비스를 제공하는 데 힘을 보태요.'),B('Taxes help pay for shared services','세금은 공공서비스 비용에 쓰여요'),B('Every road is run by one town','모든 도로를 한 마을이 운영해요'),B('Public services never cost money','공공서비스에는 비용이 전혀 안 들어요')]]);
bank('trade3','People Need Each Other','서로 필요한 것','SS3E3.a/c/d',[
 [B('Who is the producer in this example?','이 사례의 생산자는 누구인가요?'),B('A farmer grows apples. A family buys them to eat.','농부가 사과를 기르고 가족이 사서 먹어요.'),B('The farmer growing apples','사과를 기르는 농부'),B('The family buying apples','사과를 사는 가족'),B('The apples themselves','사과 자체')],
 [B('Who is the consumer in this example?','이 사례의 소비자는 누구인가요?'),B('A baker makes bread. Jo buys a loaf for lunch.','제빵사가 빵을 만들고 Jo가 점심으로 사요.'),B('Jo buying bread','빵을 사는 Jo'),B('The baker making bread','빵을 만드는 제빵사'),B('The oven','오븐')],
 [B('How are these places connected?','이 두 지역은 어떻게 연결되나요?'),B('Practice example: One town grows fruit. Another makes boxes. They trade fruit and boxes.','연습 사례: 한 마을은 과일을 기르고 다른 마을은 상자를 만들어요. 서로 교환해요.'),B('They exchange things each wants','각자 원하는 것을 교환해요'),B('They must make everything alone','각자 모든 것을 혼자 만들어야 해요'),B('Trade means neither gets anything','무역하면 아무것도 얻지 못해요')]]);
reg('market3','Prices and Exchange','값과 교환','SS3E3.b',lv=>{
 if(lv===1){const price=2+rnd(5),count=2+rnd(4),budget=price*count;return q(B(`Practice shop: one notebook costs $${price}. With $${budget}, how many can you buy at most?`,`연습 가게: 공책 한 권은 ${price}달러예요. ${budget}달러로 최대 몇 권을 살 수 있나요?`),'',count,[count+1,count-1]);}
 return q(B('Which exchange is voluntary?','서로 원해서 하는 교환은?'),panel(L(B('Ari wants a blue card; Bo wants a red one. Each has the other color.','Ari는 파랑 카드를, Bo는 빨강 카드를 원해요. 서로 상대가 원하는 색을 갖고 있어요.'))),B('Both agree to swap','둘 다 바꾸는 데 동의해요'),[B('Ari takes Bo’s card by force','Ari가 Bo의 카드를 강제로 가져가요'),B('Bo says no, but the swap is forced','Bo가 싫다고 해도 억지로 바꿔요')],B('Both expect a benefit; neither is forced.','둘 다 도움이 될 것으로 기대하며 강요받지 않아요.'));
});
reg('opportunity3','Saving and Opportunity Cost','저축과 기회비용','SS3E4',lv=>{
 const rows=[
 [B('save for a book','책을 사려고 저축하기'),B('buy a snack now','지금 간식 사기'),B('buy a sticker','스티커 사기')],
 [B('save for a ball','공을 사려고 저축하기'),B('buy a comic now','지금 만화책 사기'),B('buy a pencil','연필 사기')],
 [B('save for art supplies','미술 도구를 사려고 저축하기'),B('buy a small toy now','지금 작은 장난감 사기'),B('buy a card','카드 사기')]
 ];const r=pick(rows);
 const passage=lv===1?B(`Only two choices: ${r[0].en} OR ${r[1].en}. You choose saving.`,`선택은 둘뿐이에요: ${r[0].ko} / ${r[1].ko}. 저축을 골랐어요.`):B(`Your order: 1. ${r[0].en}; 2. ${r[1].en}; 3. ${r[2].en}. You choose #1.`,`선호 순서: 1. ${r[0].ko} / 2. ${r[1].ko} / 3. ${r[2].ko}. 1번을 골랐어요.`);
 return q(B('What is the next-best choice you gave up?','포기한 선택 중 다음으로 원했던 것은?'),panel(L(passage)),r[1],[r[0],lv===1?B('Nothing','아무것도 없어요'):r[2]],B('Opportunity cost is the next-best alternative given up.','기회비용은 포기한 대안 중 다음으로 가장 원했던 것이에요.'));
});
})();
