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
// Public-domain geographic base; teaching annotations are not survey boundaries.
const reg=(id,en,ko,code,make)=>registerGame({id,grade:'3',subject:'ss',icon:'🌎',title:B(en,ko),sub:B('Read evidence and compare ideas','자료를 읽고 생각을 비교해요'),area:B(`Grade 3 Social Studies · ${code}`,`3학년 사회 · ${code}`),play(){quiz(this,fresh(id,lvl(id),make));}});
const panel=s=>`<div class="g3-social">${s}</div>`;
const q=(ask,show,r,w,after)=>({ask,show,opts:[r,...w].map((s,i)=>({html:`<span class="word">${typeof s==='object'?L(s):s}</span>`,ok:i===0})),cls:'words g3-social-options',after:after||(typeof r==='object'?r:B(String(r),String(r)))});
const bank=(id,en,ko,code,rows)=>reg(id,en,ko,code,lv=>{const r=pick([...(lv===1?rows.slice(0,2):rows),...moreSocial[id]]);return q(r[0],r[1]?panel(L(r[1])):'',r[2],r.slice(3));});
reg('globe3','Lines around Earth','지구본의 선','SS3G2',lv=>{
 const lat=!!rnd(2),zero=!!rnd(2),value=zero?0:pick([30,-30,60,-60]);
 // Existing Natural Earth public-domain paths, equirectangular lon+180 / 90-lat.
 const outline=Object.values(WORLD_PATHS).map(d=>`<path d="${d}" fill="#d7e7b9" stroke="#62754c" stroke-width=".4"/>`).join('');
 const line=lat?`M0 ${90-value} H360`:`M${180+value} 0 V180`;
 const visual=panel(`<svg viewBox="0 0 360 180" role="img" aria-label="${L(B('World map with one highlighted line','선 하나를 강조한 세계 지도'))}"><rect width="360" height="180" fill="#d9effc"/>${outline}<path d="M0 90 H360 M180 0 V180" stroke="#667" stroke-dasharray="3 3"/><path d="${line}" stroke="#b52f28" stroke-width="3"/><text x="${lat?330:180+value+4}" y="${lat?Math.max(15,90-value-6):20}" font-size="15">${Math.abs(value)}°${value?(lat?(value>0?'N':'S'):(value>0?'E':'W')):''}</text></svg>`);
 if(zero)return q(B('What is the thick red 0° line?','굵은 빨간 0° 선의 이름은?'),visual,lat?B('Equator','적도'):B('Prime meridian','본초자오선'),[lat?B('Prime meridian','본초자오선'):B('Equator','적도'),B('A country border','나라의 경계')]);
 return q(lat?B('The red latitude line tells position north or south of which line?','빨간 위선(latitude line)은 어느 선을 기준으로 남북 위치를 알려 주나요?'):B('The red longitude line tells position east or west of which line?','빨간 경선(longitude line)은 어느 선을 기준으로 동서 위치를 알려 주나요?'),visual,lat?B('Equator','적도'):B('Prime meridian','본초자오선'),[lat?B('Prime meridian','본초자오선'):B('Equator','적도'),B('A highway','고속도로')],B('Latitude measures north/south; longitude measures east/west.','위도는 남북 위치, 경도는 동서 위치를 나타내요.'));
});
bank('nativehomes3','Homes and Environments','환경과 생활','SS3H1.b · SS3G3.a',[
 [B('Which material covered these traditional longhouses?','이 전통 롱하우스의 벽과 지붕을 덮은 재료는?'),B('Haudenosaunee builders used wooden frames and bark coverings for longhouses.','하우데노쇼니 사람들은 나무로 뼈대를 세우고 나무껍질로 롱하우스를 덮었어요.'),B('Bark','나무껍질'),B('Steel sheets','강철판'),B('Glass blocks','유리 블록')],
 [B('What formed the frame of this traditional wetu?','이 전통 웨투의 뼈대는 무엇으로 만들었나요?'),B('In the 1600s, Wampanoag builders bent young trees to frame a wetu. Bark or cattail mats covered it.','1600년대 왐파노아그 사람들은 어린 나무를 휘어 웨투의 틀을 만들고 나무껍질이나 부들 돗자리로 덮었어요.'),B('Young trees','어린 나무'),B('Plastic pipes','플라스틱 관'),B('Brick towers','벽돌 탑')],
 [B('What do these examples show?','이 사례들에서 알 수 있는 것은?'),B('Haudenosaunee longhouses used wood and bark. Wampanoag wetu frames used young trees.','하우데노쇼니 롱하우스에는 나무와 껍질을, 왐파노아그 웨투 틀에는 어린 나무를 썼어요.'),B('Builders used plant materials','식물 재료를 이용했어요'),B('Every Native nation had identical homes','모든 원주민 공동체의 집이 같았어요'),B('Native peoples exist only in the past','원주민은 과거에만 있었어요')]]);
bank('nativetoday3','Living Cultures','오늘도 이어지는 문화','SS3H1.c',[
 [B('What does this modern artist create?','이 현대 예술가는 무엇을 만드나요?'),B('Diné artist DY Begay weaves wool tapestries. Colors of her homeland inspire her work.','디네 예술가 DY 베게이는 양털 실로 태피스트리를 짜요. 고향의 색에서 영감을 얻어요.'),B('Woven art','직물 예술'),B('Space rockets','우주 로켓'),B('Road signs only','도로 표지판만')],
 [B('What connects past and present here?','여기서 과거와 현재를 잇는 활동은?'),B('At Plimoth Patuxet, Native staff demonstrate traditional building methods for visitors today.','오늘날 플리머스 패턱셋의 원주민 직원들은 방문객에게 전통 건축 방법을 보여 줘요.'),B('Teaching traditional skills today','오늘날 전통 기술을 알려요'),B('Claiming Native people no longer exist','원주민이 더는 없다고 말해요'),B('Saying all homes are identical','모든 집이 같다고 말해요')],
 [B('Which statement fits the evidence?','자료에 맞는 설명은?'),B('Jeffrey Gibson is a contemporary artist and a citizen of the Mississippi Band of Choctaw Indians.','제프리 깁슨은 현대 예술가이며 미시시피 밴드 오브 촉토 인디언스의 시민이에요.'),B('Native people contribute to art today','원주민은 오늘날에도 예술에 기여해요'),B('Native art ended long ago','원주민 예술은 오래전에 끝났어요'),B('All Native artists make the same work','모든 원주민 예술가의 작품은 같아요')]]);
bank('explorerwhy3','Voyage Goals','항해의 목적','SS3H2.a · SS3G3.b',[
 [B('What was the goal of this voyage?','이 항해의 목표는 무엇이었나요?'),B('In 1492, Columbus sailed west seeking a sea route to Asia, with support from Spain.','1492년 콜럼버스는 스페인의 지원으로 아시아에 가는 바닷길을 찾으려고 서쪽으로 항해했어요.'),B('A westward sea route to Asia','서쪽으로 가는 아시아 항로'),B('A flight to the Moon','달로 가는 비행'),B('A railway across Europe','유럽을 가로지르는 철도')],
 [B('Which country supported the 1492 voyage?','1492년 항해를 지원한 나라는?'),B('Columbus’s 1492 westward voyage was supported by Spain.','콜럼버스의 1492년 서쪽 항해는 스페인의 지원을 받았어요.'),B('Spain','스페인'),B('Japan','일본'),B('Canada','캐나다')],
 [B('Which statement matches the evidence?','자료에 맞는 설명은?'),B('Columbus sought a route to Asia. The lands he reached already had Native peoples living there.','콜럼버스는 아시아 항로를 찾으려고 했어요. 그가 도착한 땅에는 이미 원주민이 살고 있었어요.'),B('People already lived in those lands','이미 그 땅에 사람들이 살았어요'),B('All the land was empty','땅이 모두 비어 있었어요'),B('Every explorer had an identical goal','모든 탐험가의 목표가 같았어요')]]);
bank('encounter3','More than One Record','만남의 여러 기록','SS3H2.c',[
 [B('Why read accounts from more than one group?','여러 집단의 기록을 읽는 까닭은?'),B('Different people could experience the same encounter differently.','같은 만남을 겪어도 사람마다 경험은 다를 수 있어요.'),B('To compare experiences and evidence','경험과 근거를 비교하려고'),B('To assume one group had no history','한 집단에 역사가 없다고 하려고'),B('To ignore all evidence','모든 근거를 무시하려고')],
 [B('Which description includes the harm?','피해를 빠뜨리지 않은 설명은?'),B('De Soto’s expedition sought wealth and resources and used violence and force against Native communities.','데소토 원정대는 부와 자원을 찾았으며 원주민 공동체에 폭력을 쓰고 힘으로 억눌렀어요.'),B('The expedition harmed Native communities','원정대가 원주민 공동체에 피해를 줬어요'),B('Every encounter was peaceful','모든 만남이 평화로웠어요'),B('The land had no communities','그 땅에 공동체가 없었어요')],
 [B('What should a careful history account include?','역사를 신중히 설명하려면 무엇을 포함해야 하나요?'),B('An expedition’s goal does not tell us how every community experienced it.','원정대의 목표만으로 모든 공동체가 어떤 일을 겪었는지 알 수는 없어요.'),B('Evidence about affected communities too','영향받은 공동체에 관한 근거도'),B('Only the leader’s wishes','지도자가 바란 것만'),B('A claim that no one was harmed','아무도 피해를 입지 않았다는 주장')]]);
bank('colonyregion3','Colonial Regions','식민지 세 지역','SS3H3.b · SS3G3.c',[
 [B('Which region is described in this source card?','자료 카드가 설명하는 지역은?'),B('Early 1700s: New York and Philadelphia were port cities in the Mid-Atlantic colonies.','1700년대 초 뉴욕과 필라델피아는 중부 대서양 식민지의 항구 도시였어요.'),B('Mid-Atlantic','중부 대서양'),B('New England','뉴잉글랜드'),B('Southern','남부')],
 [B('Which region sent ships carrying salted cod?','소금에 절인 대구를 실은 배를 보낸 지역은?'),B('New England ships carried salted cod to Atlantic markets.','뉴잉글랜드 배들은 소금에 절인 대구를 대서양 시장으로 운반했어요.'),B('New England','뉴잉글랜드'),B('Mid-Atlantic','중부 대서양'),B('Southern','남부')],
 [B('How could a port help trade?','항구는 무역에 어떤 도움을 주나요?'),B('Ships carried goods between colonial ports and other Atlantic ports.','배가 식민지 항구와 대서양의 다른 항구 사이로 물건을 실어 날랐어요.'),B('Ships could load and unload goods','배에 물건을 싣고 내릴 수 있어요'),B('Ports made all land flat','항구가 모든 땅을 평평하게 했어요'),B('Ports ended all disagreements','항구가 모든 갈등을 없앴어요')]]);
bank('colonylife3','Colonial Lives','식민지 생활 비교','SS3H3.b',[
 [B('What was grown in this region?','이 지역에서는 무엇을 재배했나요?'),B('In the early 1700s, Mid-Atlantic farms grew grains and vegetables and raised livestock.','1700년대 초 중부 대서양 농장에서는 곡물과 채소를 재배하고 가축을 길렀어요.'),B('Grains and vegetables','곡물과 채소'),B('Plastic toys','플라스틱 장난감'),B('Electric lamps','전등')],
 [B('Who attended this particular school?','이 학교에 다닌 아이들은 누구였나요?'),B('Williamsburg’s Bray School (1760–1774) taught both free and enslaved Black children.','윌리엄스버그 브레이 학교(1760~1774)에는 자유인 흑인 아이들과 노예로 살아야 했던 흑인 아이들이 함께 다녔어요.'),B('Both free and enslaved Black children','자유인과 노예 신분의 흑인 아이들 모두'),B('Only white adults','백인 어른만'),B('No children','아이는 아무도 없었어요')],
 [B('What can we conclude from the Bray School example?','브레이 학교의 사례로 알 수 있는 것은?'),B('Some free and enslaved Black children attended this school in Williamsburg.','윌리엄스버그의 자유인 흑인 아이들과 노예로 살아야 했던 흑인 아이들 중 일부가 이 학교에 다녔어요.'),B('Some children there received schooling','그곳의 일부 아이들이 교육받았어요'),B('Every child in every colony attended','모든 식민지의 모든 아이가 다녔어요'),B('No Black child ever attended school','흑인 아이는 아무도 학교에 못 갔어요')]]);
bank('colonyperspective3','Different Rights and Limits','서로 다른 삶','SS3H3.c',[
 [B('What had already ended when they asked for release?','풀려나게 해 달라고 요청했을 때 이미 끝난 것은?'),B('Some indentured servants in colonial Maryland asked courts for release after their specified service period ended.','식민지 메릴랜드의 일부 계약 노동자(indentured servant)는 정해진 노동 기간이 끝난 뒤 법원에 풀려나게 해 달라고 요청했어요.'),B('Their specified service period','정해진 노동 기간'),B('Every law in the colony','식민지의 모든 법'),B('Every farm’s harvest','모든 농장의 수확')],
 [B('Whose status did this law use?','이 법은 누구의 신분을 따르도록 했나요?'),B('A 1662 Virginia law made a child’s free or enslaved status follow the mother’s status.','1662년 버지니아 법은 아이가 자유인인지 노예인지를 어머니의 신분에 따라 정하게 했어요.'),B('The mother’s','어머니의 신분'),B('A neighbor’s','이웃의 신분'),B('The child’s chosen job','아이가 고른 직업')],
 [B('Why must these experiences be distinguished?','이 경험들을 구별해야 하는 까닭은?'),B('Indentured service had a specified term. Virginia’s 1662 law tied a child’s enslaved status to the mother.','계약 노동에는 정해진 기간이 있었어요. 버지니아의 1662년 법은 아이가 노예 신분인지를 어머니의 신분에 따라 정했어요.'),B('The legal limits were different','법에 따른 제한이 달랐어요'),B('Everyone had equal freedom','모두 똑같이 자유로웠어요'),B('No law limited anyone’s freedom','어떤 법도 사람의 자유를 제한하지 않았어요')]]);
const branches=[
 {role:B('makes laws','법을 만들어요'),kind:B('Legislative','입법부'),f:B('Congress','연방 의회'),s:B('Georgia General Assembly','조지아주 의회')},
 {role:B('carries out laws','법을 집행해요'),kind:B('Executive','행정부'),f:B('President','대통령'),s:B('Governor','주지사')},
 {role:B('interprets laws in court','법원에서 법을 해석해요'),kind:B('Judicial','사법부'),f:B('U.S. Supreme Court','미국 연방 대법원'),s:B('Supreme Court of Georgia','조지아주 대법원')}
];
for(const [id,en,ko,key,code] of [['federal3','Three Federal Branches','연방 정부의 세 부','f','SS3CG1.a/c'],['state3','Three Georgia Branches','조지아주 정부의 세 부','s','SS3CG1.b/c']])reg(id,en,ko,code,lv=>{
 const i=rnd(3),r=branches[i],w=branches.filter((_,j)=>j!==i),mode=rnd(4),which=key==='f'?B('federal','연방'):B('Georgia state','조지아주');
 if(mode===0)return q(B(`Which ${which.en} institution ${r.role.en}?`,`${which.ko} 기관 중 다음 일을 맡은 곳은?`),panel(L(r.role)),r[key],w.map(x=>x[key]));
 if(mode===1)return q(B(`Which branch includes the ${r[key].en}?`,`${r[key].ko}: 어느 부(branch)에 속하나요?`),'',r.kind,w.map(x=>x.kind),r.role);
 if(mode===2)return q(B(`What is the main responsibility of the ${r[key].en}?`,`${r[key].ko}의 주된 역할은?`),'',r.role,w.map(x=>x.role));
 return q(B(`Which institution belongs to the ${which.en} ${r.kind.en.toLowerCase()} branch?`,`${which.ko} ${r.kind.ko}에 속하는 기관은?`),'',r[key],w.map(x=>x[key]));
});
bank('civic3','Community Choices','함께 사는 선택','SS3CG2.a–b',[
 [B('Which action lets both speakers be heard?','두 사람의 말을 모두 들을 수 있는 방법은?'),B('Two neighbors disagree at a meeting.','이웃 두 사람이 모임에서 의견이 달라요.'),B('Give each a turn to explain','차례로 설명할 기회를 줘요'),B('Silence the person who disagrees','의견이 다른 사람의 말을 막아요'),B('Hide the meeting notes','모임 기록을 숨겨요')],
 [B('Which action checks information first?','정보를 먼저 확인하는 행동은?'),B('A rumor says the library will close.','도서관이 문을 닫는다는 소문을 들었어요.'),B('Check the library’s official notice','도서관의 공식 안내 확인'),B('Spread it as certain news','확실한 사실처럼 퍼뜨리기'),B('Invent a closing date','문 닫는 날짜 지어내기')],
 [B('Which action serves a shared need?','여러 사람에게 필요한 일을 돕는 행동은?'),B('Neighbors plan an approved park clean-up.','이웃이 허가받은 공원 청소를 계획해요.'),B('Volunteer with the organized group','청소를 계획한 모임과 함께 봉사하기'),B('Block others from the park','다른 사람이 공원에 못 오게 하기'),B('Hide the shared tools','공동 도구 숨기기')]]);
reg('resources3','Four Production Resources','생산 자원 네 가지','SS3E1.a–d',lv=>{
 const rows=[
 [B('Trees used for lumber','목재로 쓰는 나무'),B('Natural resource','자연 자원')],
 [B('A carpenter’s work','목수의 노동'),B('Human resource','인적 자원')],
 [B('A saw used to make tables','탁자를 만드는 톱'),B('Capital good','자본재(생산 도구)')],
 [B('Organizing resources and taking a risk to start a business','자원을 모으고 위험을 감수해 사업 시작하기'),B('Entrepreneurship','기업가 활동')],
 ...[[B('Land for a farm','농사지을 땅'),0],[B('Water used in production','생산에 쓰는 물'),0],[B('A baker’s work','제빵사의 노동'),1],[B('A driver’s work','운전사의 노동'),1],[B('An oven used to bake bread','빵을 굽는 오븐'),2],[B('A truck used for deliveries','배달에 쓰는 트럭'),2],[B('Planning and risking money to open a bakery','제빵 사업을 계획하고 위험을 감수하기'),3],[B('Combining resources to start a delivery business','자원을 모아 배달 사업 시작하기'),3]].map(([label,k])=>[label,[B('Natural resource','자연 자원'),B('Human resource','인적 자원'),B('Capital good','자본재(생산 도구)'),B('Entrepreneurship','기업가 활동')][k]])
 ];const i=rnd(rows.length),r=rows[i],categories=rows.slice(0,4).map(x=>x[1]);return q(B('Which resource category matches?','어떤 생산 자원에 해당하나요?'),panel(L(r[0])),r[1],shuffle(categories.filter(x=>x.en!==r[1].en)).slice(0,2));
});
bank('publicservice3','Taxes and Services','세금과 서비스','SS3E2',[
 [B('What helps governments pay for public services?','정부가 공공서비스 비용을 마련하는 방법은?'),null,B('Taxes','세금'),B('Wishing for free supplies','물품이 저절로 생기길 바라기'),B('Ignoring every cost','모든 비용 무시하기')],
 [B('Which is a public service in this example?','이 사례의 공공서비스는?'),B('A town uses tax money to run its public library.','마을이 세금으로 공공도서관을 운영해요.'),B('The public library','공공도서관'),B('A family’s private toy box','가족의 개인 장난감 통'),B('A child’s birthday gift','아이의 생일 선물')],
 [B('Which statement fits?','맞는 설명을 골라요.'),B('Different governments help provide schools, roads, and fire protection using taxes.','시·주·나라 정부가 세금으로 학교, 도로, 소방 서비스 제공에 힘을 보태요.'),B('Taxes help pay for shared services','세금은 공공서비스 비용에 쓰여요'),B('Every road is run by one town','모든 도로를 한 마을이 운영해요'),B('Public services never cost money','공공서비스에는 비용이 전혀 안 들어요')]]);
bank('trade3','People Need Each Other','서로가 필요해요','SS3E3.a/c/d',[
 [B('Who is the producer in this example?','이 사례의 생산자는 누구인가요?'),B('A farmer grows apples. A family buys them to eat.','농부가 사과를 기르고 가족이 사서 먹어요.'),B('The farmer growing apples','사과를 기르는 농부'),B('The family buying apples','사과를 사는 가족'),B('The apples themselves','사과 자체')],
 [B('Who is the consumer in this example?','이 사례의 소비자는 누구인가요?'),B('A baker makes bread. Jo buys a loaf for lunch.','제빵사가 빵을 만들고 Jo가 점심으로 사요.'),B('Jo buying bread','빵을 사는 Jo'),B('The baker making bread','빵을 만드는 제빵사'),B('The oven','오븐')],
 [B('How are these places connected?','이 두 지역은 어떻게 연결되나요?'),B('Practice example: One town grows fruit. Another makes boxes. They trade fruit and boxes.','연습 사례: 한 마을은 과일을 기르고 다른 마을은 상자를 만들어요. 두 마을은 과일과 상자를 서로 바꿔요.'),B('They exchange things each wants','각자 원하는 것을 교환해요'),B('They must make everything alone','각자 모든 것을 혼자 만들어야 해요'),B('Trade means neither gets anything','교환하면 둘 다 아무것도 얻지 못해요')]]);
reg('market3','Prices and Exchange','값과 교환','SS3E3.b',lv=>{
 if(lv===1){const price=2+rnd(5),count=2+rnd(4),budget=price*count;return q(B(`Practice shop: one notebook costs $${price}. With $${budget}, how many can you buy at most?`,`연습 가게: 공책 한 권은 ${price}달러예요. ${budget}달러로 최대 몇 권을 살 수 있나요?`),'',count,[count+1,count-1]);}
 const r=pick(exchangeQuestions);return q(r[0],panel(L(r[1])),r[2],r.slice(3),B('A voluntary exchange is agreed to without force.','자발적 교환은 강요 없이 서로 동의한 교환이에요.'));
});
reg('opportunity3','Saving and Opportunity Cost','저축과 기회비용','SS3E4',lv=>{
 const rows=[
 [B('save for a book','책을 사려고 저축하기'),B('buy a snack now','지금 간식 사기'),B('buy a sticker','스티커 사기')],
 [B('save for a ball','공을 사려고 저축하기'),B('buy a comic now','지금 만화책 사기'),B('buy a pencil','연필 사기')],
 [B('save for art supplies','미술 도구를 사려고 저축하기'),B('buy a small toy now','지금 작은 장난감 사기'),B('buy a card','카드 사기')],
 ...[['a puzzle','퍼즐','a juice','주스'],['a kite','연','a notebook','공책'],['a game','놀이 도구','a badge','배지'],['a sketchbook','그림 그리는 공책','a marker','마커'],['a ruler','자','an eraser','지우개'],['a toy car','장난감 자동차','a postcard','엽서'],['a music book','음악책','a ribbon','리본'],['a model kit','조립 도구','a bookmark','책갈피']].map(r=>[B(`save for ${r[0]}`,`저축 목표: ${r[1]}`),B(`buy ${r[2]} now`,`지금 ${r[3]} 사기`),B('buy a sticker','스티커 사기')])
 ];const r=pick(rows);
 const passage=lv===1?B(`Only two choices: ${r[0].en} OR ${r[1].en}. You choose saving.`,`선택은 둘뿐이에요: ${r[0].ko} / ${r[1].ko}. 저축을 골랐어요.`):B(`Your order: 1. ${r[0].en}; 2. ${r[1].en}; 3. ${r[2].en}. You choose #1.`,`내가 원하는 순서: 1. ${r[0].ko} / 2. ${r[1].ko} / 3. ${r[2].ko}. 1번을 골랐어요.`);
 return q(B('What is the next-best choice you gave up?','포기한 것 중 가장 원했던 것은?'),panel(L(passage)),r[1],[r[0],lv===1?B('Nothing','아무것도 없어요'):r[2]],B('Opportunity cost is the next-best alternative given up.','기회비용(opportunity cost)은 하나를 고를 때 포기한 것 중 가장 원했던 것이에요.'));
});
const hr=(en,ko,pEn,pKo,aEn,aKo,bEn,bKo,cEn,cKo)=>[B(en,ko),pEn?B(pEn,pKo):null,B(aEn,aKo),B(bEn,bKo),B(cEn,cKo)];
// Sources for historical cards are listed individually in codex-done-12.md.
const moreSocial={
nativehomes3:[
 hr('What covered this earthlodge?','이 어스롯지를 덮은 재료는?','Mandan, Hidatsa and Arikara earthlodges used wood, grass and earth.','만단·히다차·아리카라의 어스롯지에는 나무, 풀, 흙을 썼어요.','Earth and grass','흙과 풀','Plastic','플라스틱','Steel plates','강철판'),
 hr('Which home was useful during travel?','이동할 때 이용한 집은?','Mandan, Hidatsa and Arikara used earthlodges in villages and tipis during travel or hunts.','만단·히다차·아리카라는 마을에서 어스롯지를, 이동하거나 사냥할 때 티피를 이용했어요.','Tipi','티피','Only an earthlodge','어스롯지만','A brick tower','벽돌 탑'),
 hr('Which wood did these builders use?','이 집에 쓴 나무는?','Traditional Chinook plankhouses used western red cedar boards.','치누크의 전통 플랭크하우스에는 웨스턴 레드 시더 널빤지를 썼어요.','Cedar boards','시더 널빤지','Plastic boards','플라스틱 판','Steel rails','강철 레일'),
 hr('How were these adobe bricks made?','이 어도비 벽돌을 만든 방법은?','Taos Pueblo adobe buildings use mud bricks dried in the sun.','타오스 푸에블로 어도비 건물에는 햇볕에 말린 진흙 벽돌을 써요.','Dry mud bricks in sunlight','진흙 벽돌을 햇볕에 말려요','Freeze plastic','플라스틱을 얼려요','Cut glass sheets','유리판을 잘라요'),
 hr('What helped frame these Arctic homes?','이 북극권 집의 틀에 쓴 재료는?','At the historic Birnirk site, homes had driftwood and whale-bone frames and sod roofs.','옛 번니르크 유적의 집은 물에 떠밀려 온 나무와 고래뼈로 틀을 만들고, 풀과 뿌리가 붙은 흙으로 지붕을 덮었어요.','Driftwood and whale bones','유목과 고래뼈','Plastic pipes','플라스틱 관','Metal roof tiles','금속 기와'),
 hr('Which feature fits this chickee?','이 치키에 맞는 특징은?','In the early 1800s, Seminole chickees had cypress frames, palmetto roofs and no walls.','1800년대 초 세미놀 치키는 사이프러스 틀, 팔메토 잎 지붕을 갖추고 벽이 없었어요.','A roof without walls','벽 없는 지붕','A sealed glass tower','막힌 유리 탑','A home made of ice','얼음으로 만든 집'),
 hr('What differs between these examples?','두 사례의 차이는?','Taos adobe uses mud bricks; Chinook plankhouses use cedar boards.','타오스 어도비에는 진흙 벽돌을, 치누크 플랭크하우스에는 시더 널빤지를 써요.','Building materials','집을 짓는 재료','Both use only glass','둘 다 유리만 써요','Both are identical','둘이 완전히 같아요'),
 hr('What do these housing records show?','이 주거 기록이 보여 주는 것은?','A village earthlodge and a traveling tipi served different uses in the same communities.','같은 공동체에서 마을의 어스롯지와 이동할 때의 티피는 쓰임이 달랐어요.','One community could use different homes','한 공동체도 여러 집을 이용했어요','One nation always used only one home','한 공동체는 항상 집 하나만 썼어요','Native peoples exist only in the past','원주민은 과거에만 있었어요')],
nativetoday3:[
 hr('Which material does this weaver use?','이 직물 예술가가 쓰는 재료는?','Diné artist DY Begay weaves wool tapestries.','디네 예술가 DY 베게이는 양털 실로 태피스트리를 짜요.','Wool','양털 실','Road asphalt','도로 아스팔트','Only glass','유리만'),
 hr('Which activity connects generations?','세대를 잇는 활동은?','Native staff at Plimoth Patuxet teach traditional building today.','플리머스 패턱셋의 원주민 직원들이 오늘날 전통 건축을 알려 줘요.','Sharing building skills','건축 기술 나누기','Saying every home is identical','모든 집이 같다고 말하기','Ignoring traditions','전통을 무시하기'),
 hr('What does contemporary mean in this record?','이 기록의 현대 예술은 무엇인가요?','Jeffrey Gibson is a contemporary Native artist.','제프리 깁슨은 현대 원주민 예술가예요.','Art made in our time','오늘날 만들어지는 예술','Art that ended forever','영원히 끝난 예술','Only ancient drawings','옛 그림만'),
 hr('Which claim fits these artists?','이 예술가들의 자료에 맞는 말은?','DY Begay creates woven art. Jeffrey Gibson creates contemporary art.','DY 베게이는 직물 예술을, 제프리 깁슨은 현대 예술을 만들어요.','Native artists contribute today','원주민 예술가가 오늘도 기여해요','No Native people live today','오늘날 원주민은 없어요','All Native art is identical','모든 원주민 예술은 같아요'),
 hr('Which statement avoids a stereotype?','모두 같다고 단정하지 않는 설명은?','These are examples of particular Native artists, not all artists.','특정 원주민 예술가들의 사례이며 모든 예술가의 모습은 아니에요.','Different artists make different work','예술가마다 작품이 달라요','Every artist makes one identical object','모두 똑같은 물건 하나를 만들어요','All artists lived only in the past','모두 과거에만 살았어요'),
 hr('What is the contribution in this record?','이 기록에 나온 기여는?','Native educators demonstrate traditional skills for visitors today.','원주민 교육자들이 오늘날 방문객에게 전통 기술을 보여 줘요.','Teaching visitors','방문객에게 알려 주기','Erasing all traditions','전통을 모두 없애기','Ending all learning','배움을 모두 끝내기'),
 hr('What should a record name?','문화 사례를 기록할 때 적을 것은?','This record describes a particular artist and community.','이 기록은 특정 예술가와 공동체를 설명해요.','The artist and community','예술가와 공동체','A claim that all communities are the same','모든 공동체가 같다는 말','An invented history','지어낸 역사'),
 hr('What does a modern exhibition demonstrate?','현대 전시가 보여 주는 것은?','A museum displays work by living Native artists.','박물관이 현재 활동하는 원주민 예술가의 작품을 전시해요.','Native art continues in the present','원주민 예술이 오늘날에도 이어져요','Native art stopped long ago','원주민 예술이 오래전에 끝났어요','Artists cannot have different styles','예술가는 서로 다른 작품을 못 만들어요')],
explorerwhy3:[
 hr('What trade route did Cabot seek?','캐벗이 찾으려던 교역길은?','Cabot sailed from Bristol hoping for a direct route to Asian trade.','캐벗은 아시아와 직접 교역할 길을 찾으려고 브리스톨에서 항해했어요.','A route to Asia','아시아로 가는 길','A route to the Moon','달로 가는 길','A modern railway','현대 철도'),
 hr('What did France hope Cartier would find?','프랑스가 카르티에에게 기대한 것은?','Cartier explored for France seeking a route to Asia and sources of wealth.','카르티에는 프랑스의 지원으로 아시아 항로와 부의 원천을 찾았어요.','A route and wealth','항로와 부의 원천','A flight to space','우주 비행','An electric train','전기 기차'),
 hr('What made this winter difficult?','이 겨울에 어려웠던 것은?','Cartier’s crew faced cold and illness in 1535–1536.','1535~1536년 카르티에의 선원들은 추위와 병을 겪었어요.','Cold and illness','추위와 병','Modern traffic lights','현대 신호등','Space travel','우주 여행'),
 hr('What blocked Hudson’s northern route?','허드슨의 북쪽 항로를 막은 것은?','Ice obstructed Hudson’s search for a northern passage.','얼음이 허드슨의 북쪽 항로 탐색을 막았어요.','Ice','얼음','A modern highway','현대 고속도로','A school bell','학교 종'),
 hr('Who supported Hudson’s 1609 voyage?','1609년 허드슨의 항해를 지원한 곳은?','Hudson sought an Asian passage with Dutch support in 1609.','1609년 허드슨은 네덜란드의 지원으로 아시아 항로를 찾았어요.','The Netherlands','네덜란드','Japan','일본','Canada','캐나다'),
 hr('What did de Soto’s expedition seek?','데소토 원정대가 찾으려 한 것은?','De Soto’s expedition sought gold, wealth and conquest.','데소토 원정대는 금과 부를 얻고 땅을 정복하려 했어요.','Gold and wealth','금과 부','A Moon landing','달 착륙','A railroad','철도'),
 hr('Which obstacle appears in this record?','이 기록에 나온 어려움은?','De Soto’s party struggled to cross swollen rivers.','데소토 일행은 불어난 강을 건너기 어려웠어요.','Crossing swollen rivers','불어난 강 건너기','Repairing airplanes','비행기 수리','Crossing a space station','우주 정거장 건너기'),
 hr('What lay across Balboa’s land crossing?','발보아가 육지를 건너 도달한 것은?','Balboa led an expedition across the Isthmus of Panama and reached the Pacific.','발보아는 원정대를 이끌고 파나마 지협을 건너 태평양에 도달했어요.','The Pacific Ocean','태평양','The Moon','달','The Arctic railway','북극 철도')],
encounter3:[
 hr('Which action offered help?','도움을 준 행동은?','The Cofitachequi leader welcomed de Soto’s party with food and gifts.','코피타체키 지도자는 데소토 일행에게 음식과 선물을 주며 맞았어요.','Providing food and gifts','음식과 선물 제공','Taking people captive','사람을 붙잡아 데려가기','Using force','강제로 억누르기'),
 hr('Which action caused harm afterward?','그 뒤 피해를 준 행동은?','After the welcome, de Soto took valuables and held the leader captive.','환대를 받은 뒤 데소토는 귀중품을 빼앗고 지도자를 붙잡았어요.','Taking valuables and a captive','귀중품을 빼앗고 사람을 붙잡기','Sharing food freely','자유롭게 음식 나누기','Accepting a refusal','거절을 받아들이기'),
 hr('Which action helped sick sailors?','아픈 선원들을 도운 행동은?','Domagaya and local people shared treatment knowledge with Cartier’s sick crew.','도마가야와 지역 사람들이 카르티에의 아픈 선원들에게 아픈 사람을 돌보는 지식을 알려 주었어요.','Sharing knowledge and help','지식과 도움 나누기','Hiding every record','기록을 모두 숨기기','Forcing them into a prison','강제로 감옥에 넣기'),
 hr('Which action is coercion rather than cooperation?','협력 대신 강제로 한 행동은?','In 1536 Cartier took Donnacona and others away as captives.','1536년 카르티에는 돈나코나와 다른 사람들을 붙잡아 데려갔어요.','Taking people as captives','사람을 붙잡아 데려가기','A freely agreed trade','서로 동의한 교역','Accepting offered help','받은 도움을 받아들이기'),
 hr('What did these groups exchange?','두 집단이 교환한 것은?','Hudson Valley Native peoples traded furs with Dutch merchants for metal tools, kettles and beads.','허드슨 계곡 원주민들은 네덜란드 상인과 모피를 금속 도구, 주전자, 구슬로 바꾸었어요.','Furs and manufactured goods','모피와 만든 물건','Airplanes and computers','비행기와 컴퓨터','Only empty boxes','빈 상자만'),
 hr('Which describes this trade?','이 교역에 맞는 설명은?','Furs were exchanged for metal tools and other goods.','모피를 금속 도구와 다른 물건으로 바꾸었어요.','Groups exchanged goods','집단들이 물건을 교환했어요','No goods changed hands','아무 물건도 오가지 않았어요','All Native communities disappeared','모든 원주민 공동체가 사라졌어요'),
 hr('What do both records show?','두 기록을 함께 보면 알 수 있는 것은?','One record describes help for sailors. Another describes captives being taken.','한 기록에는 선원을 도운 일, 다른 기록에는 사람을 붙잡아 데려간 일이 있어요.','Encounters included help and harm','도움과 피해가 모두 있었어요','Every encounter was peaceful','모든 만남이 평화로웠어요','Every encounter was identical','모든 만남이 같았어요'),
 hr('Which description fits Mabila?','마빌라에서 있었던 일은?','De Soto’s expedition and Native people fought at Mabila.','마빌라에서 데소토 원정대와 원주민들이 싸웠어요.','Armed conflict','무력 충돌','Only peaceful gifts','평화로운 선물만','A modern school game','현대 학교 놀이')],
colonyregion3:[
 hr('Which cities are named?','어떤 도시들이 나오나요?','Early 1700s Mid-Atlantic ports included New York and Philadelphia.','1700년대 초 중부 대서양 항구에는 뉴욕과 필라델피아가 있었어요.','New York and Philadelphia','뉴욕과 필라델피아','Tokyo and Seoul','도쿄와 서울','Atlanta and Savannah','애틀랜타와 서배너'),
 hr('What work did a port support?','항구가 도운 활동은?','Ships loaded and unloaded goods in colonial ports.','식민지 항구에서 배가 물건을 싣고 내렸어요.','Trade by ship','배를 이용한 무역','Space flight','우주 비행','Electric trains','전기 기차'),
 hr('What goods did New England ships carry in this record?','이 기록에서 뉴잉글랜드 배가 실은 것은?','New England ships carried salted cod to Atlantic markets.','뉴잉글랜드 배들은 소금에 절인 대구를 대서양 시장으로 운반했어요.','Salted cod','소금에 절인 대구','Plastic toys','플라스틱 장난감','Electric lamps','전등'),
 hr('How did coastal access help this activity?','해안에 닿아 있어 이 활동에 유리한 점은?','A port allowed ships to load goods for sea travel.','항구에서 배에 물건을 실어 바닷길로 운반했어요.','Access to sea transport','바닷길 운송 이용','Access to a space station','우주 정거장 이용','Removal of every hill','모든 언덕 제거'),
 hr('Which region is linked to these two ports?','두 항구와 연결된 지역은?','New York and Philadelphia: early Mid-Atlantic ports.','뉴욕과 필라델피아: 옛 중부 대서양 항구.','Mid-Atlantic','중부 대서양','New England','뉴잉글랜드','Southern','남부'),
 hr('What is the geographic feature in this trade record?','이 교역 기록의 지리적 특징은?','Goods moved through a coastal port.','물건이 해안 항구를 통해 이동했어요.','A coast and port','해안과 항구','An orbit in space','우주 궤도','A traffic light','신호등'),
 hr('Which is an economic activity in this record?','이 기록의 경제 활동은?','Ships sold salted cod in Atlantic markets.','배로 운반한 소금에 절인 대구를 대서양 시장에서 팔았어요.','Selling fish','생선 팔기','Naming a cloud','구름 이름 짓기','Drawing a moon','달 그리기'),
 hr('What do these port records NOT prove?','항구 기록만으로 알 수 없는 것은?','Two Mid-Atlantic cities had ports.','중부 대서양 도시 두 곳에 항구가 있었어요.','Every colonial town had a port','모든 식민지 마을에 항구가 있었어요','Some cities supported shipping','일부 도시가 배 운송을 도왔어요','These two cities had ports','두 도시에 항구가 있었어요')],
colonylife3:[
 hr('Which activity is farming?','농사 활동은?','Mid-Atlantic farms grew grain and vegetables.','중부 대서양 농장에서는 곡물과 채소를 재배했어요.','Growing crops','작물 기르기','Building airplanes','비행기 만들기','Using electric lamps','전등 사용하기'),
 hr('What else did those farms raise?','그 농장에서 또 기른 것은?','Early Mid-Atlantic farms grew crops and raised livestock.','옛 중부 대서양 농장은 작물을 재배하고 가축을 길렀어요.','Livestock','가축','Space rockets','우주 로켓','Plastic trees','플라스틱 나무'),
 hr('Which time does this school record name?','학교 기록에 나온 때는?','The Bray School operated in Williamsburg from 1760 to 1774.','브레이 학교는 윌리엄스버그에서 1760~1774년에 운영됐어요.','1760–1774','1760~1774년','2000–2020','2000~2020년','Tomorrow only','내일만'),
 hr('Which place is named?','기록에 나온 장소는?','The Bray School was in Williamsburg.','브레이 학교는 윌리엄스버그에 있었어요.','Williamsburg','윌리엄스버그','The Moon','달','Tokyo','도쿄'),
 hr('Did this school example prove all children were educated?','이 학교 사례가 모든 아이의 교육을 증명하나요?','Some free and enslaved Black children attended the Bray School.','일부 자유인·노예 신분 흑인 아이들이 브레이 학교에 다녔어요.','No, it describes some children at one school','아니요, 한 학교 일부 아이의 사례예요','Yes, every colonial child attended','네, 모든 식민지 아이가 다녔어요','It says no child attended','아무 아이도 안 다녔다고 해요'),
 hr('Which contrast fits the two records?','두 기록의 활동 차이는?','One describes farming. Another describes schooling.','한 기록은 농사, 다른 기록은 학교 교육을 설명해요.','Growing food versus attending school','먹을거리 재배하기와 학교 다니기','Both describe space travel','둘 다 우주 여행이에요','Both describe no work','둘 다 아무 일도 안 해요'),
 hr('What does the schooling record show?','학교 교육 기록이 보여 주는 것은?','Both free and enslaved Black children attended this particular school.','이 학교에는 자유인과 노예 신분 흑인 아이들이 다녔어요.','Students had different legal statuses','학생의 법적 신분이 달랐어요','Every student had identical freedom','모두 똑같이 자유로웠어요','Only adults attended','어른만 다녔어요'),
 hr('Which detail is about the economy?','경제 활동에 관한 내용은?','Farms grew vegetables; the Bray School taught children.','농장은 채소를 재배했고 브레이 학교는 아이들을 가르쳤어요.','Growing vegetables','채소 재배','The school’s name alone','학교 이름만','The spelling of Williamsburg','윌리엄스버그 철자')],
colonyperspective3:[
 hr('What time limit did this indentured service have?','이 계약 노동의 기간은 어떻게 정해져 있었나요?','Indentured service had a specified term. Some people were forced into this service.','계약 노동에는 정해진 기간이 있었어요. 강제로 이 일을 해야 했던 사람들도 있었어요.','A specified period','정해진 기간','Unlimited ownership of all farms','모든 농장을 마음대로 소유하기','A right to make every law','모든 법을 정할 권리'),
 hr('Which institution did some servants ask for release?','일부 계약 노동자가 요청한 곳은?','Some Maryland servants asked courts for release after their term.','일부 메릴랜드 계약 노동자는 기간이 끝난 뒤 법원에 풀려나게 해 달라고 요청했어요.','Courts','법원','A space station','우주 정거장','A modern airline','현대 항공사'),
 hr('Where did this 1662 law apply?','1662년 이 법이 있던 식민지는?','A Virginia law linked a child’s status to the mother.','버지니아 법은 아이 신분을 어머니 신분에 따르게 했어요.','Virginia','버지니아','Every place in the world','세계 모든 곳','Only modern Georgia','현대 조지아만'),
 hr('Could a child simply choose a status under this law?','이 법 아래서 아이가 신분을 마음대로 고를 수 있었나요?','The law made status follow the mother.','법이 어머니의 신분을 따르게 했어요.','No, the law imposed a limit','아니요, 법이 선택을 제한했어요','Yes, any choice was allowed','네, 어떤 선택도 허용했어요','Only a favorite color decided','좋아하는 색만 정했어요'),
 hr('Which record shows a specified time limit?','정해진 기간을 보여 주는 기록은?','A: indentured service had a term. B: a law linked a child’s status to the mother.','A: 계약 노동에는 기간이 있었어요. B: 법이 아이 신분을 어머니 신분에 따르게 했어요.','Record A','기록 A','Record B','기록 B','Neither','둘 다 아니에요'),
 hr('Which record shows inherited legal status?','신분을 물려받게 한 법의 기록은?','A: a service agreement. B: Virginia’s 1662 status law.','A: 노동 계약. B: 버지니아의 1662년 신분 법.','Record B','기록 B','Record A','기록 A','Neither','둘 다 아니에요'),
 hr('Why consider the people affected by laws?','법의 영향을 받은 사람을 살펴보는 까닭은?','The records describe limits on people’s choices.','기록은 사람들의 선택을 제한한 일을 설명해요.','To understand their experiences','그들의 경험을 이해하려고','To assume all lives were identical','모든 삶이 같다고 단정하려고','To ignore every record','모든 기록을 무시하려고'),
 hr('Which is a careful comparison?','신중하게 비교한 설명은?','A service term and an inherited status law imposed different limits.','노동 기간과 신분을 물려받게 한 법은 서로 다른 제한이었어요.','The limits differed','제한이 서로 달랐어요','Everyone had equal freedom','모두 똑같이 자유로웠어요','Neither record involved people','둘 다 사람과 관계없었어요')],
civic3:[
 ...[['A class takes turns sharing views.','학급에서 차례로 의견을 말해요.','Listen to each speaker','각 사람의 말 듣기'],['A library notice gives an opening date.','도서관 안내에 여는 날짜가 있어요.','Read the official notice','공식 안내 읽기'],['Neighbors organize an approved clean-up.','이웃이 허가받은 청소를 계획해요.','Join the organized volunteers','계획한 봉사 모임 참여'],['Residents have a concern about a crossing.','주민들이 횡단보도에 의견이 있어요.','Send a respectful message to officials','공직자에게 정중히 의견 전하기'],['A meeting has a rule for equal turns.','모임에 발언 기회를 나누는 규칙이 있어요.','Follow the turn-taking rule','발언 순서 규칙 지키기'],['Someone disagrees with your opinion.','누군가 내 생각에 동의하지 않아요.','Respect their chance to speak','말할 기회 존중하기'],['A rumor has no named source.','소문에 출처가 없어요.','Check before sharing it','전하기 전에 확인하기'],['A public event needs safe access for all.','공공 행사에서 모두 안전하게 드나들어야 해요.','Keep the shared path clear','함께 쓰는 길 비워 두기']].map(r=>hr('Which action respects rights and shared needs?','권리와 공동의 필요를 존중한 행동은?',...r,'Silence everyone else','다른 사람의 말을 모두 막기','Invent a false notice','거짓 안내 지어내기'))],
publicservice3:[
 ...[['a public school','공립 학교'],['a public library','공공도서관'],['a public road','공공도로'],['fire protection','소방 서비스']].map(r=>hr('Which service receives funding in this example?','이 사례에서 비용을 지원받는 서비스는?',`Practice town: taxes help pay for ${r[0]}.`,`연습 마을: 세금으로 ${r[1]} 비용을 마련해요.`,...r,'A private birthday present','개인 생일 선물','A family’s toy box','가족의 장난감 통')),
 hr('What do taxes help provide?','세금이 제공을 돕는 것은?','City, state and national governments help provide shared services.','시·주·나라 정부가 공공서비스 제공에 힘을 보태요.','Shared public services','공공서비스','Only private toys','개인 장난감만','Only birthday gifts','생일 선물만'),
 hr('Why is this service public?','이 사례의 서비스가 공공서비스인 까닭은?','A town library serves the community using public funds.','마을 도서관이 공공 자금으로 주민을 위해 운영돼요.','It serves the community','주민을 위해 제공돼요','It belongs only to one child','아이 한 명만 쓰는 것이에요','It never costs money','비용이 전혀 안 들어요'),
 hr('What is NOT proved by this road example?','이 도로 사례만으로 알 수 없는 것은?','A state helps fund one road.','주 정부가 도로 하나의 비용을 지원해요.','One state runs every road everywhere','그 주가 모든 곳의 모든 도로를 운영해요','Some roads use public funds','일부 도로는 공공 자금을 써요','Governments can provide services','정부가 서비스를 제공할 수 있어요'),
 hr('Which statement includes costs?','비용을 인정한 설명은?','','','Taxes help pay for services','세금으로 서비스 비용을 마련해요','Every service is costless','모든 서비스는 비용이 없어요','Supplies always appear for free','물품은 늘 저절로 생겨요')],
trade3:[
 hr('Who produces this service?','이 서비스의 생산자는?','A barber cuts hair. A customer pays for the haircut.','이발사가 머리를 자르고 손님이 돈을 내요.','The barber','이발사','The customer','손님','The chair itself','의자 자체'),
 hr('Who consumes this service?','이 서비스의 소비자는?','A driver gives Jo a paid ride.','운전사가 Jo에게 돈을 받고 차를 태워 줘요.','Jo receiving the ride','차를 타는 Jo','The driver providing it','운전을 제공하는 사람','The road itself','도로 자체'),
 hr('Which item is locally made?','우리 지역에서 만든 물건은?','Practice labels: A—Made in our town. B—Made in another country.','연습 이름표: A—우리 마을에서 만듦. B—다른 나라에서 만듦.','Item A','물건 A','Item B','물건 B','Neither','둘 다 아니에요'),
 hr('Which item was made in another country?','다른 나라에서 만든 물건은?','Practice labels: A—Made in our town. B—Made abroad.','연습 이름표: A—우리 마을에서 만듦. B—외국에서 만듦.','Item B','물건 B','Item A','물건 A','Both locally made','둘 다 우리 마을 물건'),
 hr('What is currency?','통화(currency)는 무엇인가요?','','','Money used for buying and selling','사고파는 데 사용하는 돈','Only a road sign','도로 표지판만','A kind of weather','날씨 종류'),
 hr('Which statement about currencies is accurate?','통화에 맞는 설명은?','','','Countries may use different currencies','나라에 따라 쓰는 통화가 다를 수 있어요','Every country must use one identical coin','모든 나라는 똑같은 동전만 써요','Currency is always a tree','통화는 항상 나무예요'),
 hr('How do producers and consumers depend on each other?','생산자와 소비자는 어떻게 서로 필요한가요?','A baker makes bread that families buy.','제빵사가 빵을 만들고 가족들이 사요.','Families get bread; the baker gets payment','가족은 빵을, 제빵사는 돈을 얻어요','Neither receives anything','둘 다 아무것도 못 얻어요','No one needs goods','아무도 물건이 필요 없어요'),
 hr('Which origin differs from both town and foreign goods?','마을·외국 물건과 다른 생산지는?','Practice labels: A—our town; B—another town in our country; C—another country.','연습 이름표: A—우리 마을. B—우리나라 다른 마을. C—다른 나라.','Item B','물건 B','Item A','물건 A','Item C','물건 C')]
};
const exchangeQuestions=[
 ...[['cards','카드'],['marbles','구슬'],['stickers','스티커'],['bookmarks','책갈피'],['pencils','연필']].flatMap(r=>[
 hr('Which exchange is voluntary?','자발적인 교환은?',`Practice: two children want to trade ${r[0]}.`,`연습: 두 아이가 ${r[1]}을 서로 바꾸고 싶어 해요.`,'Both agree without force','강요 없이 둘 다 동의해요','One takes the item by force','한 명이 강제로 가져가요','One says no but is forced','싫다고 했지만 강요받아요'),
 hr('Which exchange is forced?','강제로 한 교환은?',`Practice: two children discuss trading ${r[0]}.`,`연습: 두 아이가 ${r[1]}을 바꾸는 일을 이야기해요.`,'One takes an item despite refusal','거절했는데도 물건을 가져가요','Both freely agree','둘 다 자유롭게 동의해요','Both can choose not to trade','둘 다 안 바꿀 자유가 있어요')])
];
// Broad locations checked against USGS, NPS and Smithsonian; sources in done-49.
const mapCaption49=s=>`<div class="real-map-note">${s}</div>`;
const map49=(rows,a,m,b=-1)=>PeachMaps.north(rows,a,m,b);
const rivers49=[
 {n:B('Mississippi','미시시피강'),p:[[-95,47],[-91,43],[-90,37],[-91,32],[-89,29]]},
 {n:B('Ohio','오하이오강'),p:[[-80,40],[-84,39],[-87,38],[-89,37]]},
 {n:B('Rio Grande','리오그란데강'),p:[[-107,37],[-106,32],[-103,29],[-97,26]]},
 {n:B('Colorado','콜로라도강'),p:[[-106,40],[-110,38],[-114,36],[-115,32]]},
 {n:B('Hudson','허드슨강'),p:[[-74,44],[-74,42],[-74,41]]},
 {n:B('St. Lawrence','세인트로렌스강'),p:[[-76,44],[-72,46],[-67,49]]}
];
rivers49.forEach((r,i)=>{r.p=PeachMaps.riverAnchors[i];});
const regions49=[
 {n:B('Arctic','북극'),p:[[-150,68],[-110,70],[-80,67]]},
 {n:B('Northwest Coast','북서 해안'),p:[[-137,58],[-130,53],[-124,48]]},
 {n:B('Southwest','남서부'),p:[[-113,35],[-108,34],[-105,35]]},
 {n:B('Plains','평원'),p:[[-105,49],[-100,44],[-99,38]]},
 {n:B('Northeast','북동부'),p:[[-80,45],[-74,43],[-70,45]]},
 {n:B('Southeast','남동부'),p:[[-90,34],[-84,33],[-80,35]]}
];
const mountains49=[
 {n:B('Rocky Mountains','로키산맥'),p:[[-115,49],[-113,47],[-111,45],[-109,43],[-107,40],[-106,37]]},
 {n:B('Appalachian Mountains','애팔래치아산맥'),p:[[-69,47],[-73,44],[-77,41],[-80,38],[-83,35],[-86,33]]}
];
const voyages49=[
 {n:B('John Cabot','존 캐벗'),p:[[-2.7,51.45],[-35,53],[-55,50]],c:B('England','잉글랜드'),d:B('North Atlantic coast','북대서양 해안'),y:1497},
 {n:B('Vasco Núñez de Balboa','바스코 누녜스 데 발보아'),p:[[-77.9,9.4],[-78.1,9.1],[-78.3,8.5]],c:B('Spain','스페인'),d:B('Pacific at Panama','파나마의 태평양'),y:1513},
 {n:B('Hernando de Soto','에르난도 데소토'),p:[[-82,28],[-84,34],[-90,35]],c:B('Spain','스페인'),d:B('Southeastern interior','남동부 내륙'),y:1539},
 {n:B('Christopher Columbus','크리스토퍼 콜럼버스'),p:[[-16,28],[-40,27],[-74,24]],c:B('Spain','스페인'),d:B('Caribbean islands','카리브해 섬'),y:1492},
 {n:B('Henry Hudson','헨리 허드슨'),p:[[4.9,52.37],[-1,59],[-10,60],[-50,43],[-74,41],[-74,43]],c:B('The Netherlands','네덜란드'),d:B('Hudson River','허드슨강'),y:1609},
 {n:B('Jacques Cartier','자크 카르티에'),p:[[-2,48.65],[-55,49],[-66,49],[-74,45]],c:B('France','프랑스'),d:B('St. Lawrence River','세인트로렌스강'),y:1535}
];
const mapBank49=(id,en,ko,code,rows,note)=>{
 const banks=[[],[]];
 rows.forEach((r,i)=>{
  for(let m=0;m<(id==='mountains3'?6:2);m++){
   banks[0].push(()=>q(B('Which name matches A?','A가 있는 곳의 이름은?'),map49(rows,i,m)+(note?mapCaption49(L(note)):''),r.n,rows.filter(x=>x.n.en!==r.n.en).slice(0,2).map(x=>x.n)));
   if(id==='explorerroute3'){
    const cs=[B('England','잉글랜드'),B('Spain','스페인'),B('The Netherlands','네덜란드'),B('France','프랑스')];
    banks[1].push(()=>q(m===0?B('Which country backed route A?','A 경로를 지원한 나라는?'):B('Which destination matches route A?','A 경로와 맞는 도착 지역은?'),map49(rows,i,r.p.length-1)+mapCaption49(L(r.n)+' · '+r.y),m===0?r.c:r.d,(m===0?cs:rows.map(x=>x.d)).filter(x=>x.en!==(m===0?r.c:r.d).en).slice(0,2)));
   }else{
    const j=id==='mountains3'?1-i:(i+1+m)%rows.length;
    const west=PeachMaps.location(rows,i,m)[0]<PeachMaps.location(rows,j,m)[0];
    banks[1].push(()=>q(B('Which named marker is farther WEST?','표시한 두 곳 중 더 서쪽에 있는 곳은?'),map49(rows,i,m,j)+mapCaption49('A: '+L(r.n)+' · B: '+L(rows[j].n)),west?r.n:rows[j].n,[west?rows[j].n:r.n],B('Follow the north arrow. Compare the marked places from west to east.','북쪽 화살표를 보고 표시한 곳의 서쪽과 동쪽을 비교해요.')));
   }
  }
 });
 reg(id,en,ko,code,lv=>pick(banks[lv===1?0:1])());
};
mapBank49('rivers3','Rivers of America','미국의 강','SS3G1.a',rivers49);
mapBank49('mountains3','Two Mountain Ranges','두 산맥','SS3G1.b',mountains49);
mapBank49('nativeregions3','Native Homelands','원주민의 지역','SS3H1.a (location practice)',regions49,B('Broad regions, not borders. Native nations live today.','넓은 문화 지역이며 경계가 아니에요. 원주민 공동체는 오늘도 이어져요.'));
mapBank49('explorerroute3','Voyage Records Map','탐험 기록 지도','SS3H2.b (route practice)',voyages49);
})();
