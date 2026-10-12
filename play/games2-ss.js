'use strict';
// Grade 2 social studies (Georgia Standards of Excellence, Social Studies): SS2H1 Georgia leaders and heroes, SS2H2 Creek and Cherokee,
// SS2G1 Georgia map skills, SS2CG citizenship and government, SS2E economics.
const AREA2SS = (u) => B(`Grade 2 Social Studies · ${u}`, `2학년 사회 · ${U_KO[u] || u}`);
const G2SS = (g) => registerGame(Object.assign({ grade: '2', subject: 'ss' }, g, { area: AREA2SS(g.u) }));
const sw = (right, wrongs) => [right, ...wrongs.filter(w => w.en !== right.en)].map((w, i) => ({ html: `<span class="word">${L(w)}</span>`, ok: i === 0 }));

// ---------- 1. People who shaped Georgia and America ----------
const HEROES2 = [
  { id: 'og', e: '⛵', n: B('James Oglethorpe', '제임스 오글소프'), what: B('founded the colony of Georgia in 1733 and started the city of Savannah', '1733년 조지아 식민지를 세우고 서배너라는 도시를 만들었어요'), clue: B('I led the settlers who landed at Savannah in 1733.', '나는 1733년 서배너에 도착한 이주민들을 이끌었어요.') },
  { id: 'to', e: '🪶', n: B('Tomochichi', '토모치치'), what: B('was a Yamacraw Creek leader who welcomed Oglethorpe and helped the settlers', '야마크로 크리크족 지도자로 오글소프를 맞이하고 이주민을 도왔어요'), clue: B('I am a Creek leader. I welcomed the new settlers to my land.', '나는 크리크족 지도자예요. 새로 온 이주민들을 반갑게 맞았어요.') },
  { id: 'mm', e: '🗣️', n: B('Mary Musgrove', '메리 머스그로브'), what: B('was a Creek and English interpreter and trader who helped the two groups talk and trade', '크리크 말과 영어를 통역하고 거래를 도운 사람이에요'), clue: B('I helped the Creek and the English understand each other as an interpreter.', '나는 통역으로 크리크족과 영국인이 서로 이해하도록 도왔어요.') },
  { id: 'sq', e: '✍️', n: B('Sequoyah', '세쿼이아'), what: B('created a writing system (syllabary) for the Cherokee language', '체로키 말을 위한 글자(음절 문자)를 만들었어요'), clue: B('I made a way to write the Cherokee language.', '나는 체로키 말을 적을 수 있는 글자를 만들었어요.') },
  { id: 'jl', e: '🏕️', n: B('Juliette Gordon Low', '줄리엣 고든 로'), what: B('was born in Savannah and started the Girl Scouts in the United States in 1912', '서배너에서 태어나 1912년 미국 걸스카우트를 시작했어요'), clue: B('I was born in Savannah and began the Girl Scouts.', '나는 서배너에서 태어났고 걸스카우트를 시작했어요.') },
  { id: 'jr', e: '⚾', n: B('Jackie Robinson', '재키 로빈슨'), what: B('was born in Georgia and in 1947 became the first African American player in modern Major League Baseball', '조지아에서 태어나 1947년 현대 메이저리그 야구의 첫 흑인 선수가 됐어요'), clue: B('I was born in Georgia and played baseball for the Brooklyn Dodgers.', '나는 조지아에서 태어나 브루클린 다저스에서 야구를 했어요.') },
  { id: 'mk', e: '🕊️', n: B('Martin Luther King Jr.', '마틴 루서 킹 주니어'), what: B('was born in Atlanta and led the fight for fair laws using peaceful, nonviolent protest', '애틀랜타에서 태어나 평화롭고 폭력 없는 방법으로 공정한 법을 만들자는 운동을 이끌었어요'), clue: B('I was born in Atlanta and worked for fairness without using violence.', '나는 애틀랜타에서 태어났고 폭력 없이 공정함을 위해 일했어요.') },
  { id: 'jc', e: '🥜', n: B('Jimmy Carter', '지미 카터'), what: B('grew up on a peanut farm in Plains, Georgia and became the 39th President of the United States', '조지아 플레인스의 땅콩 농장에서 자라 미국 제39대 대통령이 됐어요'), clue: B('I grew up on a peanut farm in Georgia and later became President.', '나는 조지아 땅콩 농장에서 자랐고 나중에 대통령이 됐어요.') }
];
G2SS({
  id: 'heroes2', icon: '🌟', title: B('Georgia Heroes', '조지아의 인물들'), sub: B('Oglethorpe, Sequoyah, Robinson, King and more', '오글소프, 세쿼이아, 로빈슨, 킹 등 여러 인물'), u: 'History',
  play() {
    const lv = lvl('heroes2'), h = pick(lv === 1 ? HEROES2.slice(0, 6) : HEROES2), kind = pick(['who', 'what']);
    if (kind === 'who') {
      quiz(this, { ask: B(`Who am I? ${h.clue.en}`, `나는 누구일까요? ${h.clue.ko}`), askSay: B(`Who am I? ${h.clue.en}`, `나는 누구일까요? ${h.clue.ko}`), opts: [h, ...others(HEROES2, h, 2)].map((x, i) => ({ html: `<span class="word">${x.e} ${L(x.n)}</span>`, label: x.n, ok: i === 0 })), cls: 'words', after: B(`${h.n.en} ${h.what.en}.`, `${h.n.ko}: ${h.what.ko}.`) });
    } else {
      quiz(this, { ask: B(`${h.e} What did ${h.n.en} do?`, `${h.e} ${h.n.ko}: 어떤 일을 했나요?`), opts: [h.what, ...others(HEROES2, h, 2).map(x => x.what)].map((w, i) => ({ html: `<span class="word">${L(w)}</span>`, ok: i === 0 })), cls: 'words sents', after: B(`${h.n.en} ${h.what.en}.`, `${h.n.ko}: ${h.what.ko}.`) });
    }
  }
});

// ---------- 2. Creek and Cherokee peoples ----------
const NATIONS = [
  { q: B('Which statement about Creek and Cherokee people is true today?', '오늘날 크리크족과 체로키족에 대해 맞는 말은?'), r: B('They have communities today.', '오늘날에도 공동체를 이루며 살아요.'), w: [B('They lived only long ago.', '아주 먼 옛날에만 살았어요.'), B('They are imaginary people.', '이야기 속 상상의 사람들이에요.')] },
  { q: B('Which Native American people lived in the mountains of north Georgia?', '조지아 북쪽 산이 많은 곳에 살았던 아메리카 원주민은 누구일까요?'), r: B('The Cherokee', '체로키족'), w: [B('The Creek', '크리크족')] },
  { q: B('Who made a writing system for the Cherokee language?', '체로키 말을 적는 글자를 만든 사람은?'), r: B('Sequoyah', '세쿼이아'), w: [B('Tomochichi', '토모치치'), B('Oglethorpe', '오글소프')] },
  { q: B('Tomochichi was a leader of which people?', '토모치치는 어느 민족의 지도자였나요?'), r: B('The Creek (Yamacraw)', '크리크족(야마크로)'), w: [B('The Cherokee', '체로키족')] },
  { q: B('Which three crops did many Creek and Cherokee farmers grow together?', '크리크족과 체로키족 농부들이 함께 키운 세 가지 작물은?'), r: B('Corn, beans and squash', '옥수수, 콩, 호박'), w: [B('Wheat, rice and oats', '밀, 쌀, 귀리'), B('Cotton, tobacco and sugar', '목화, 담배, 설탕')] },
  { q: B('Long ago, the Creek and Cherokee people got their food and built their homes using what?', '옛날 크리크족과 체로키족은 먹을 것을 얻고 집을 지을 때 무엇을 이용했나요?'), r: B('Things from nature around them (trees, animals, plants)', '주변 자연에서 얻은 것(나무, 동물, 식물)'), w: [B('Factory-made materials', '공장에서 만든 재료')] },
  { q: B('In the 1830s the Cherokee were forced to leave Georgia on a long, sad journey. What is it called?', '1830년대에 체로키족은 조지아에서 강제로 떠나야 했어요. 그 슬픈 긴 여정을 무엇이라 부를까요?'), r: B('The Trail of Tears', '눈물의 길'), w: [B('The Gold Rush', '골드러시'), B('The Great Migration', '대이동')] },
  { q: B('Who was a Creek and English interpreter who helped the two groups talk?', '크리크 말과 영어를 통역해 두 쪽이 대화하도록 도운 사람은?'), r: B('Mary Musgrove', '메리 머스그로브'), w: [B('Jackie Robinson', '재키 로빈슨'), B('Juliette Gordon Low', '줄리엣 고든 로')] }
];
G2SS({
  id: 'nations2', icon: '🪶', title: B('Creek and Cherokee', '크리크족과 체로키족'), sub: B('The first peoples of Georgia', '조지아의 첫 주민들'), u: 'Native Peoples',
  play() {
    const n = pick(NATIONS);
    quiz(this, { ask: n.q, opts: sw(n.r, n.w.length < 2 ? [...n.w, B(n.w[0].en === 'The Creek' ? 'The Spanish' : 'Nobody', n.w[0].en === 'The Creek' ? '스페인 사람들' : '아무도 없어요')] : n.w), cls: 'words sents', after: B(`${n.r.en}.`, `${n.r.ko}.`) });
  }
});

// ---------- 3. Georgia map skills ----------
const GA_OUT = [[-85.61, 34.98], [-83.11, 35.0], [-83.32, 34.72], [-83.1, 34.52], [-82.9, 34.48], [-82.75, 34.15], [-82.2, 33.66], [-81.97, 33.45], [-81.7, 33.15], [-81.45, 32.75], [-81.25, 32.4], [-81.1, 32.08], [-80.87, 32.03], [-80.95, 31.8], [-81.15, 31.45], [-81.3, 31.2], [-81.42, 30.9], [-81.45, 30.71], [-82.2, 30.56], [-84.86, 30.7], [-85.0, 31.0], [-85.1, 31.8], [-85.0, 32.4], [-85.18, 32.87]];
const GA_CITY = [{ k: 'atl', n: B('Atlanta', '애틀랜타'), p: [-84.39, 33.75] }, { k: 'sav', n: B('Savannah', '서배너'), p: [-81.1, 32.08] }, { k: 'aug', n: B('Augusta', '오거스타'), p: [-81.97, 33.47] }, { k: 'col', n: B('Columbus', '콜럼버스'), p: [-84.99, 32.46] }, { k: 'mac', n: B('Macon', '메이컨'), p: [-83.63, 32.84] }];
const GA_RIVER = [{ k: 'cha', n: B('Chattahoochee River', '채터후치강'), pts: [[-83.9, 34.75], [-84.0, 34.3], [-84.4, 33.9], [-84.9, 33.4], [-85.1, 33.0], [-85.0, 32.45], [-85.1, 31.8], [-85.0, 31.0]] },
  { k: 'sv', n: B('Savannah River', '서배너강'), pts: [[-83.1, 34.52], [-82.9, 34.48], [-82.75, 34.15], [-82.2, 33.66], [-81.97, 33.45], [-81.7, 33.15], [-81.45, 32.75], [-81.25, 32.4], [-81.1, 32.08]] },
  { k: 'alt', n: B('Altamaha River', '알타마하강'), pts: [[-82.5, 31.95], [-82.0, 31.65], [-81.6, 31.45], [-81.3, 31.3]] },
  { k: 'fl', n: B('Flint River', '플린트강'), pts: [[-84.45, 33.6], [-84.33, 32.9], [-84.03, 32.3], [-84.16, 31.58], [-84.58, 30.95], [-84.8, 30.72]] }];
const gx = (lon) => 12 + (lon + 85.8) * 42, gy = (lat) => 8 + (35.1 - lat) * 50;
const gaMapSvg = (o = {}) => {
  const pt = (p) => `${gx(p[0]).toFixed(1)},${gy(p[1]).toFixed(1)}`;
  const rivers = GA_RIVER.map(r => `<polyline points="${r.pts.map(pt).join(' ')}" fill="none" stroke="${o.river === r.k ? '#ef476f' : '#4aa3e8'}" stroke-width="${o.river === r.k ? 4 : 2.2}" stroke-linecap="round" stroke-linejoin="round"/>`).join('');
  const cities = GA_CITY.map(c => `<circle cx="${gx(c.p[0]).toFixed(1)}" cy="${gy(c.p[1]).toFixed(1)}" r="${o.city === c.k ? 7 : 4}" fill="${o.city === c.k ? '#ef476f' : '#1d3557'}" stroke="#fff" stroke-width="1.5"/>${o.names ? `<text x="${(gx(c.p[0]) + (c.k === 'sav' || c.k === 'aug' ? -8 : 7)).toFixed(1)}" y="${(gy(c.p[1]) + (c.k === 'sav' ? 14 : 4)).toFixed(1)}" text-anchor="${c.k === 'sav' || c.k === 'aug' ? 'end' : 'start'}" font-size="11" font-weight="800" fill="#1d3557">${L(c.n)}</text>` : ''}`).join('');
  const mtn = [[-84.2, 34.85], [-83.7, 34.85], [-84.65, 34.7]].map(p => `<polygon points="${gx(p[0]) - 6},${gy(p[1]) + 6} ${gx(p[0]) + 6},${gy(p[1]) + 6} ${gx(p[0])},${gy(p[1]) - 5}" fill="#8d6e63"/>`).join('');
  const swamp = `<ellipse cx="${gx(-82.3).toFixed(1)}" cy="${gy(30.85).toFixed(1)}" rx="12" ry="7" fill="#9ccc65" opacity=".85"/>`;
  const dir = o.compass ? `<g transform="translate(205 40)"><circle r="20" fill="#fff" stroke="#1d3557" stroke-width="1.5"/><path d="M0 -17 L5 0 L0 17 L-5 0Z" fill="#ef476f"/><path d="M-17 0 L0 5 L17 0 L0 -5Z" fill="#1d3557"/><text y="-22" font-size="10" font-weight="900" text-anchor="middle" fill="#1d3557">N</text></g>` : '';
  return `<svg viewBox="0 0 240 260" class="gasvg"><rect width="240" height="260" fill="#d7efff"/><rect x="170" y="150" width="70" height="110" fill="#bfe6ff"/><polygon points="${GA_OUT.map(pt).join(' ')}" fill="#f4e6b8" stroke="#1d3557" stroke-width="2.5" stroke-linejoin="round"/>${mtn}${swamp}${rivers}${cities}${dir}${o.states ? [['TN', 70, 9], ['NC', 150, 15], ['SC', 190, 70], ['AL', 18, 112], ['FL', 100, 246]].map(t => `<text x="${t[1]}" y="${t[2]}" font-size="10" font-weight="800" fill="#7a869a" text-anchor="middle">${t[0]}</text>`).join('') : ''}<text x="212" y="236" font-size="10" font-weight="800" fill="#2a6fb0" text-anchor="middle">${S.lang === 'ko' ? '대서양' : 'Atlantic'}</text></svg>`;
};
const dirName = (a) => [B('east', '동쪽'), B('northeast', '북동쪽'), B('north', '북쪽'), B('northwest', '북서쪽'), B('west', '서쪽'), B('southwest', '남서쪽'), B('south', '남쪽'), B('southeast', '남동쪽')][Math.round(((a % 360) + 360) % 360 / 45) % 8];
G2SS({
  id: 'gamap2', icon: '🗺️', title: B('Map of Georgia', '조지아 지도'), sub: B('Cities, rivers, directions and neighbors', '도시, 강, 방향, 이웃 주'), u: 'Map Skills',
  play() {
    const lv = lvl('gamap2'), kind = pick(lv === 1 ? ['city', 'city', 'river', 'nbr'] : ['city', 'river', 'dir', 'dir', 'nbr', 'cap']);
    if (kind === 'city') {
      const c = pick(GA_CITY);
      quiz(this, { ask: B('The red dot is a city of Georgia. Which city is it?', '빨간 점은 조지아의 도시예요. 어느 도시일까요?'), show: gaMapSvg({ city: c.k }), opts: sw(c.n, others(GA_CITY, c, 2).map(x => x.n)), cls: 'words', after: B(`That is ${c.n.en}.`, `정답: ${c.n.ko}`) });
    } else if (kind === 'river') {
      const r = pick(GA_RIVER);
      quiz(this, { ask: B('The red line is a river. Which river is it?', '빨간 선은 강이에요. 어느 강일까요?'), show: gaMapSvg({ river: r.k }), opts: sw(r.n, others(GA_RIVER, r, 2).map(x => x.n)), cls: 'words', after: B(`That is the ${r.n.en}.`, `${r.n.ko}이에요.`) });
    } else if (kind === 'dir') {
      for (let t = 0; t < 40; t++) {
        const [a, b] = shuffle(GA_CITY), dx = (b.p[0] - a.p[0]) * 0.84, dy = b.p[1] - a.p[1], ang = Math.atan2(dy, dx) * 180 / Math.PI, m = ((ang % 90) + 90) % 90, axis = Math.min(m, 90 - m);
        if (Math.hypot(dx, dy) < 0.9 || axis > 28) continue;     // grade 2 uses north, south, east and west: keep pairs that clearly lie along one of them
        const right = dirName(Math.round((((ang % 360) + 360) % 360) / 90) * 90), wrongs = others([0, 90, 180, 270].map(dirName).filter(d => d.en !== right.en), null, 2);
        quiz(this, { ask: B(`On the map, which way is ${b.n.en} from ${a.n.en}? (north, south, east or west)`, `지도에서 ${a.n.ko} 기준으로 ${b.n.ko}은(는) 어느 쪽일까요? (동서남북)`), show: gaMapSvg({ names: true, compass: true }), opts: sw(right, wrongs), cls: 'words', after: B(`${b.n.en} is to the ${right.en} of ${a.n.en}.`, `${b.n.ko}의 위치는 ${a.n.ko}의 ${right.ko}이에요.`) });
        return;
      }
      const c = pick(GA_CITY); quiz(this, { ask: B('Which city is the capital of Georgia?', '조지아의 주도(주 정부가 있는 도시)는 어느 도시일까요?'), show: gaMapSvg({ names: true }), opts: sw(GA_CITY[0].n, [GA_CITY[1].n, GA_CITY[3].n]), cls: 'words', after: B('Atlanta is the capital of Georgia.', '애틀랜타가 조지아의 주도예요.') });
    } else if (kind === 'nbr') {
      const q = pick([[B('Which state is SOUTH of Georgia?', '조지아의 남쪽에 있는 주는?'), B('Florida', '플로리다'), [B('Tennessee', '테네시'), B('Alabama', '앨라배마')]],
        [B('Which state is WEST of Georgia?', '조지아의 서쪽에 있는 주는?'), B('Alabama', '앨라배마'), [B('Florida', '플로리다'), B('South Carolina', '사우스캐롤라이나')]],
        [B('Which state is NORTH of Georgia (along with North Carolina)?', '조지아의 북쪽에 있는 주는? (노스캐롤라이나와 함께)'), B('Tennessee', '테네시'), [B('Florida', '플로리다'), B('Alabama', '앨라배마')]],
        [B('Which state is EAST of Georgia, across the Savannah River?', '서배너강 건너 조지아의 동쪽에 있는 주는?'), B('South Carolina', '사우스캐롤라이나'), [B('Alabama', '앨라배마'), B('Tennessee', '테네시')]],
        [B('Which ocean touches the east side of Georgia?', '조지아의 동쪽 바다는?'), B('Atlantic Ocean', '대서양'), [B('Pacific Ocean', '태평양'), B('Arctic Ocean', '북극해')]]]);
      quiz(this, { ask: q[0], show: gaMapSvg({ compass: true, states: q[1].en !== 'Atlantic Ocean' }), opts: sw(q[1], q[2]), cls: 'words', after: B(`${q[1].en}.`, `${q[1].ko}.`) });
    } else {
      const q = pick([[B('What do the brown triangles on the Georgia map show?', '조지아 지도의 갈색 삼각형은 무엇을 나타낼까요?'), B('Mountains in the north', '북쪽의 산'), [B('Cities', '도시'), B('Rivers', '강')]],
        [B('What do the blue lines on the Georgia map show?', '조지아 지도의 파란 선은 무엇을 나타낼까요?'), B('Rivers', '강'), [B('Mountains', '산'), B('Roads', '도로')]],
        [B('What does the green oval in the south show?', '남쪽의 초록 타원은 무엇을 나타낼까요?'), B('The Okefenokee Swamp', '오키페노키 습지'), [B('A big city', '큰 도시'), B('A mountain', '산')]]]);
      quiz(this, { ask: q[0], show: gaMapSvg({}), opts: sw(q[1], q[2]), cls: 'words', after: B(`${q[1].en}.`, `${q[1].ko}.`) });
    }
  }
});

// ---------- 4. Government and citizens ----------
const GOV = [
  { q: B('Who is the leader of a city or town?', '도시나 마을의 지도자는 누구일까요?'), r: B('The mayor', '시장'), w: [B('The governor', '주지사'), B('The President', '대통령')] },
  { q: B('Who is the leader of the state of Georgia?', '조지아주의 지도자는 누구일까요?'), r: B('The governor', '주지사'), w: [B('The mayor', '시장'), B('The President', '대통령')] },
  { q: B('Who is the leader of the whole United States?', '미국 전체의 지도자는 누구일까요?'), r: B('The President', '대통령'), w: [B('The mayor', '시장'), B('The governor', '주지사')] },
  { q: B('What is the capital city of Georgia, where state leaders work?', '주 지도자들이 일하는 조지아의 주도(주 정부가 있는 도시)는?'), r: B('Atlanta', '애틀랜타'), w: [B('Savannah', '서배너'), B('Macon', '메이컨')] },
  { q: B('Why do we have laws?', '우리에게 법이 있는 까닭은?'), r: B('To keep people safe and treat people fairly', '사람들을 안전하게 지키고 공정하게 대하려고'), w: [B('To make life boring', '생활을 지루하게 하려고'), B('To help only one person', '한 사람만 돕기 위해')] },
  { q: B('Which one is a RESPONSIBILITY of a good citizen?', '좋은 시민의 책임은 무엇일까요?'), r: B('Obey the laws and respect other people', '법을 지키고 다른 사람을 존중하기'), w: [B('Break a rule when no one is looking', '아무도 안 볼 때 규칙 어기기'), B('Take things that are not yours', '내 것이 아닌 물건 가져가기')] },
  { q: B('Which one is a RIGHT that citizens in the United States have?', '미국 시민이 가진 권리는 무엇일까요?'), r: B('Speak freely and share your ideas', '자유롭게 말하고 생각을 나눌 권리'), w: [B('Ignore every rule', '모든 규칙 무시하기'), B('Never go to school', '학교에 가지 않기')] },
  { q: B('Which one is how adult citizens help choose their leaders?', '어른 시민이 지도자를 뽑는 방법은?'), r: B('Voting', '투표'), w: [B('Guessing', '짐작하기'), B('Flipping a coin in class', '교실에서 동전 던지기')] },
  { q: B('Who makes the rules in a classroom or at home so everyone is safe?', '교실이나 집에서 모두가 안전하도록 규칙을 정하는 사람은?'), r: B('Teachers and parents (with the group)', '선생님과 부모님(함께 의논해서)'), w: [B('Nobody', '아무도 없어요')] }
];
G2SS({
  id: 'gov2', icon: '🏛️', title: B('Leaders and Citizens', '지도자와 시민'), sub: B('Mayor, governor, President, laws, rights, responsibilities', '시장, 주지사, 대통령, 법, 권리와 책임'), u: 'Government',
  play() {
    const lv = lvl('gov2'), g = pick(lv === 1 ? GOV.slice(0, 8) : GOV);
    quiz(this, { ask: g.q, opts: sw(g.r, g.w.length < 2 ? [...g.w, B('A stranger', '모르는 사람')] : g.w), cls: 'words sents', after: B(`${g.r.en}.`, `${g.r.ko}.`) });
  }
});

// ---------- 5. Goods, services and producers ----------
const GOODS2 = [['🍎', B('apples', '사과'), 'good'], ['👕', B('a T-shirt', '티셔츠'), 'good'], ['🚲', B('a bicycle', '자전거'), 'good'], ['📚', B('a book', '책'), 'good'], ['🧸', B('a toy', '장난감'), 'good'],
  ['✂️', B('a haircut', '이발'), 'service'], ['🩺', B('a doctor\'s checkup', '의사의 진찰'), 'service'], ['🚌', B('a bus ride', '버스 타기'), 'service'], ['👩‍🏫', B('teaching in a school', '학교에서 가르치기'), 'service'], ['🧹', B('house cleaning', '집 청소'), 'service']];
G2SS({
  id: 'goods2', icon: '🛍️', title: B('Goods and Services', '물건과 서비스'), sub: B('Producers, consumers and resources', '생산자, 소비자, 자원'), u: 'Economics',
  play() {
    const lv = lvl('goods2'), kind = pick(lv === 1 ? ['gs', 'gs', 'role'] : ['gs', 'role', 'role', 'res']);
    if (kind === 'gs') {
      const g = pick(GOODS2);
      quiz(this, { ask: B(`Goods or services? Choose the category for ${g[1].en}.`, `${g[1].ko}: 물건일까요, 서비스일까요?`), show: `<span class="emo">${g[0]}</span>`, opts: [{ html: `<span class="word">${S.lang === 'ko' ? '물건(만져서 가질 수 있어요)' : 'A good (a thing you can hold)'}</span>`, ok: g[2] === 'good' }, { html: `<span class="word">${S.lang === 'ko' ? '서비스(누군가 해 주는 일)' : 'A service (work done for you)'}</span>`, ok: g[2] === 'service' }], cls: 'words sents', after: g[2] === 'good' ? B('A good is a thing that people make or grow.', '물건은 사람들이 만들거나 키운 것이에요.') : B('A service is work that one person does for another.', '서비스는 한 사람이 다른 사람을 위해 해 주는 일이에요.') });
    } else if (kind === 'role') {
      const q = pick([[B('A baker makes bread and sells it. What is the baker?', '빵을 만들어 파는 제빵사는 무엇일까요?'), B('A producer', '생산자'), [B('A consumer', '소비자')], B('A producer makes goods or provides services.', '생산자는 물건을 만들거나 서비스를 해 줘요.')],
        [B('A family buys bread at the bakery. What is the family?', '빵집에서 빵을 사는 가족은 무엇일까요?'), B('Consumers', '소비자'), [B('Producers', '생산자')], B('Consumers buy and use goods and services.', '소비자는 물건과 서비스를 사서 써요.')],
        [B('A farmer grows corn. What is the farmer?', '옥수수를 키우는 농부는 무엇일까요?'), B('A producer', '생산자'), [B('A consumer', '소비자')], B('A producer makes goods or provides services.', '생산자는 물건을 만들거나 서비스를 해 줘요.')]]);
      quiz(this, { ask: q[0], opts: sw(q[1], q[2]), cls: 'words', after: q[3] });
    } else {
      const q = pick([[B('Which one is a natural resource?', '자연 자원은 무엇일까요?'), B('Trees in a forest', '숲의 나무'), [B('A factory machine', '공장 기계'), B('A teacher', '선생님')]],
        [B('Which one is a human resource (people who work)?', '사람 자원(일하는 사람)은 무엇일까요?'), B('A farmer', '농부'), [B('Soil', '흙'), B('A tractor', '트랙터')]],
        [B('Which one is a capital resource (a tool or machine used to make things)?', '자본 자원(물건을 만드는 데 쓰는 도구나 기계)은 무엇일까요?'), B('A tractor', '트랙터'), [B('Rain', '비'), B('A baker', '제빵사')]]]);
      quiz(this, { ask: q[0], opts: sw(q[1], q[2]), cls: 'words', after: B(`${q[1].en}.`, `${q[1].ko}.`) });
    }
  }
});

// ---------- 6. Choices, money and saving ----------
G2SS({
  id: 'choices2', icon: '🪙', title: B('Choices and Saving', '선택과 저축'), sub: B('Scarcity, trade-offs, earning and saving', '부족함, 선택의 대가, 벌기와 저축'), u: 'Economics',
  play() {
    const lv = lvl('choices2'), kind = pick(lv === 1 ? ['scar', 'save', 'earn'] : ['scar', 'trade', 'trade', 'save', 'earn']);
    if (rnd(3) === 0) {
      const price = 5 + rnd(6), saved = 1 + rnd(price - 1), need = price - saved;
      quiz(this, { ask: B(`You are saving for a $${price} toy. You have $${saved}. How many more dollars do you need?`, `${price}달러짜리 장난감을 사려고 ${saved}달러를 모았어요. 몇 달러를 더 모아야 할까요?`), opts: numO(need, [need-1,need+1,price], 0, 12), after: B(`${price} − ${saved} = ${need} more dollars.`, `${price} − ${saved} = ${need}. ${need}달러를 더 모아요.`) }); return;
    }
    const quizOf = (q) => quiz(this, { ask: q[0], opts: sw(q[1], q[2]), cls: 'words sents', after: q[3] || B(`${q[1].en}.`, `${q[1].ko}.`) });
    if (kind === 'scar') quizOf(pick([[B('You want a toy and a snack, but you only have enough money for one. What is this called?', '장난감과 간식을 사고 싶지만 돈이 한 가지만 살 만큼만 있어요. 이것을 무엇이라 할까요?'), B('Scarcity (not enough for everything)', '부족함(모든 것을 가질 수 없음)'), [B('A gift', '선물'), B('A holiday', '휴일')], B('Scarcity means we cannot have everything we want, so we must choose.', '부족하다는 것은 원하는 것을 모두 가질 수 없어서 골라야 한다는 뜻이에요.')],
      [B('Why must people make choices?', '사람들은 왜 선택을 해야 할까요?'), B('Because resources and money are limited', '자원과 돈이 한정되어 있어서'), [B('Because choices are fun', '선택이 재미있어서'), B('Because stores are closed', '가게가 닫혀 있어서')]]]));
    else if (kind === 'trade') {
      const t = pick([[B('You choose a sticker book instead of a ball. What did you give up?', '공 대신 스티커 책을 골랐어요. 포기한 것은?'), B('The ball', '공'), [B('The sticker book', '스티커 책'), B('Nothing', '아무것도 없어요')]],
        [B('You choose to play outside instead of watching TV. What did you give up?', '텔레비전 보는 대신 밖에서 놀기로 했어요. 포기한 것은?'), B('Watching TV', '텔레비전 보기'), [B('Playing outside', '밖에서 놀기'), B('Nothing', '아무것도 없어요')]]]);
      quizOf([t[0], t[1], t[2], B('Giving up the next best choice is called an opportunity cost.', '하나를 고르면서 포기한 다른 선택들 중 가장 좋은 것을 기회비용이라고 해요.')]);
    } else if (kind === 'save') quizOf(pick([[B('What does it mean to save money?', '돈을 저축한다는 것은 무슨 뜻일까요?'), B('To keep it to use later', '나중에 쓰려고 모아 두는 것'), [B('To spend it all today', '오늘 다 쓰는 것'), B('To lose it', '잃어버리는 것')]],
      [B('You want a $20 toy and have $5. What is a smart plan?', '20달러짜리 장난감을 사고 싶은데 5달러가 있어요. 어떤 계획을 세우면 좋을까요?'), B('Save a little each week until you have enough', '매주 조금씩 모아 충분해질 때까지 기다리기'), [B('Spend the $5 on candy right now', '지금 사탕에 5달러 쓰기'), B('Forget the toy and the money', '장난감도 돈도 잊기')]]]));
    else quizOf(pick([[B('Which one is a way to earn money?', '돈을 버는 방법은 무엇일까요?'), B('Working at a job', '일해서 돈 받기'), [B('Wishing for money', '돈이 생기길 바라기'), B('Spending money', '돈 쓰기')]],
      [B('People earn money by ...', '사람들은 무엇을 해서 돈을 벌까요?'), B('doing work or selling goods and services', '일하거나 물건·서비스를 팔기'), [B('only going shopping', '쇼핑만 하기'), B('sleeping', '잠자기')]]]));
  }
});

// ---------- 7. Symbols of Georgia and the United States ----------
const SYMS = [
  { e: '🍑', n: B('the peach', '복숭아'), s: B('the official state fruit of Georgia', '조지아의 주 과일') }, { e: '🌹', n: B('the Cherokee rose', '체로키 장미'), s: B('the state flower of Georgia', '조지아의 주 꽃') },
  { e: '🐦', n: B('the brown thrasher', '브라운 트래셔(갈색 새)'), s: B('the state bird of Georgia', '조지아의 주 새') }, { e: '🌳', n: B('the live oak', '라이브 오크(참나무)'), s: B('the state tree of Georgia', '조지아의 주 나무') },
  { e: '🧅', n: B('the Vidalia onion', '비달리아 양파'), s: B('the state vegetable of Georgia', '조지아의 주 채소') }, { e: '🐝', n: B('the honeybee', '꿀벌'), s: B('the state insect of Georgia', '조지아의 주 곤충') },
  { e: '🦅', n: B('the bald eagle', '흰머리수리'), s: B('the national bird of the United States', '미국을 대표하는 새(국조)') }, { e: '🗽', n: B('the Statue of Liberty', '자유의 여신상'), s: B('a giant statue in New York Harbor that is a symbol of freedom', '뉴욕 항구에 서 있는 자유의 상징 조형물') },
  { e: '🇺🇸', n: B('the American flag (50 stars, 13 stripes)', '미국 국기(별 50개, 줄 13개)'), s: B('the flag of the United States: 50 stars for the states, 13 stripes for the first colonies', '미국 국기: 별 50개는 주를, 줄 13개는 처음의 식민지들을 뜻해요') }
];
G2SS({
  id: 'symbols2', icon: '🦅', title: B('Symbols', '상징'), sub: B('Georgia and United States symbols', '조지아와 미국의 상징'), u: 'Citizenship',
  play() {
    const lv = lvl('symbols2'), s = pick(lv === 1 ? SYMS.slice(0, 8) : SYMS);
    quiz(this, { ask: B(`${s.n.en[0].toUpperCase() + s.n.en.slice(1)} is ...`, `${s.n.ko}: 알맞은 설명을 골라요.`), show: `<span class="emo">${s.e}</span>`, opts: [s, ...others(SYMS, s, 2)].map((x, i) => ({ html: `<span class="word">${L(x.s)}</span>`, ok: i === 0 })), cls: 'words sents', after: B(`${s.n.en[0].toUpperCase() + s.n.en.slice(1)}: ${s.s.en}.`, `${s.n.ko}: ${s.s.ko}.`) });
  }
});

// ---------- 8. Then and now: order of events ----------
const EVENTS = [
  { y: 1733, n: B('Oglethorpe and settlers start Savannah', '오글소프와 이주민들이 서배너를 시작함') }, { y: 1821, n: B('Sequoyah finishes the Cherokee writing system', '세쿼이아가 체로키 글자를 완성함') },
  { y: 1912, n: B('Juliette Gordon Low starts the Girl Scouts', '줄리엣 고든 로가 걸스카우트를 시작함') }, { y: 1947, n: B('Jackie Robinson joins the Brooklyn Dodgers', '재키 로빈슨이 브루클린 다저스에 입단함') },
  { y: 1963, n: B('Dr. King gives the "I Have a Dream" speech', '킹 박사가 "나에게는 꿈이 있습니다" 연설을 함') }, { y: 1977, n: B('Jimmy Carter becomes President', '지미 카터가 대통령이 됨') }
];
G2SS({
  id: 'timeline2', icon: '⏳', title: B('Before and After', '먼저와 나중'), sub: B('Put Georgia and American events in order', '조지아와 미국의 일들을 순서대로'), u: 'History',
  play() {
    const lv = lvl('timeline2'), kind = pick(lv === 1 ? ['first', 'first', 'long'] : ['first', 'last', 'long', 'first']);
    if (kind === 'long') {
      const p = pick([[B('a horse and wagon', '말과 마차'), B('a car', '자동차'), true], [B('a candle', '양초'), B('an electric light', '전등'), true], [B('writing a letter by hand', '손으로 편지 쓰기'), B('sending a text message', '문자 보내기'), true]]);
      const asked = pick([true, false]);
      quiz(this, { ask: asked ? B('Which one is OLDER (people had it first)?', '더 오래전에 생긴 것은?') : B('Which one is NEWER (people got it later)?', '더 나중에 생긴 것은?'), opts: [{ html: `<span class="word">${L(p[0])}</span>`, ok: asked }, { html: `<span class="word">${L(p[1])}</span>`, ok: !asked }], cls: 'words', after: B('Things change over time.', '시간이 지나면서 많은 것이 바뀌어요.') });
      return;
    }
    const a = pick(EVENTS), b = pick(EVENTS.filter(x => x !== a)), early = a.y < b.y ? a : b, late = early === a ? b : a, askFirst = kind !== 'last';
    quiz(this, { ask: askFirst ? B('Which event happened FIRST (earlier)?', '어느 일이 먼저(더 일찍) 일어났을까요?') : B('Which event happened LAST (later)?', '어느 일이 나중에(더 늦게) 일어났을까요?'), opts: [a, b].map(x => ({ html: `<span class="word">${L(x.n)}</span>`, ok: x === (askFirst ? early : late) })), cls: 'words sents', after: B(`${early.y}: ${early.n.en}, then ${late.y}: ${late.n.en}.`, `${early.y}년: ${early.n.ko} → ${late.y}년: ${late.n.ko}`) });
  }
});
