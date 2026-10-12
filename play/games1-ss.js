'use strict';
// Grade 1 social studies (Georgia Social Studies GSE, updated 2023): "Our American Heritage".
// SS1H historical figures, SS1G time/place and maps, SS1CG character and patriotism, SS1E economics, map and information-processing skills.
// Figures are shown as simple cartoon icons (never realistic portraits). Facts stay within the standard's list.
const AREA1T = (u) => B(`Grade 1 Social Studies · ${u}`, `1학년 사회 · ${u}`);
const G1T = (g) => registerGame(Object.assign({ grade: '1', subject: 'ss' }, g, { area: AREA1T(g.u) }));
const tOpts = (right, wrongs, cls = 'word') => [right, ...wrongs].map(w => ({ html: `<span class="${cls}">${L(w)}</span>`, ok: w === right }));

// ---------- the six figures ----------
const FIGS = [
  { id: 'franklin', n: B('Benjamin Franklin', '벤저민 프랭클린'), ini: 'BF', c: '#5aa9e6', sym: '⚡', what: B('He was an inventor, author, and statesman.', '발명가, 작가, 정치가였어요.'), short: B('inventor and author', '발명가이자 작가'), grp: 'colonies', trait: 'curious' },
  { id: 'jefferson', n: B('Thomas Jefferson', '토머스 제퍼슨'), ini: 'TJ', c: '#a78bfa', sym: '📜', what: B('He wrote the Declaration of Independence.', '독립선언서를 썼어요.'), short: B('wrote the Declaration of Independence', '독립선언서를 쓴 사람'), grp: 'colonies', trait: 'equality' },
  { id: 'lewis', n: B('Lewis and Clark, with Sacagawea', '루이스와 클라크, 그리고 사카가웨아'), ini: 'LC', c: '#4fd1b8', sym: '🧭', what: B('They explored the American West. Sacagawea helped them as a guide.', '미국 서부를 탐험했어요. 사카가웨아가 길잡이로 도왔어요.'), short: B('explorers of the West', '서부를 탐험한 사람들'), grp: 'frontier', trait: 'courage' },
  { id: 'roosevelt', n: B('Theodore Roosevelt', '시어도어 루스벨트'), ini: 'TR', c: '#7cc95e', sym: '🌲', what: B('He helped protect National Parks and nature.', '국립공원과 자연을 보호하도록 도왔어요.'), short: B('protected National Parks', '국립공원을 보호한 사람'), grp: 'parks', trait: 'environment' },
  { id: 'carver', n: B('George Washington Carver', '조지 워싱턴 카버'), ini: 'GC', c: '#ffb347', sym: '🥜', what: B('He was a scientist who found many uses for peanuts.', '땅콩의 쓰임새를 많이 찾아낸 과학자예요.'), short: B('scientist who studied peanuts', '땅콩을 연구한 과학자'), grp: 'south', trait: 'perseverance' },
  { id: 'bridges', n: B('Ruby Bridges', '루비 브리지스'), ini: 'RB', c: '#f78fb3', sym: '🏫', what: B('As a six-year-old, she bravely helped make schools fair for all children.', '여섯 살에 용감하게 모든 아이를 위한 공평한 학교를 만드는 데 힘을 보탰어요.'), short: B('helped make schools fair for everyone', '모두에게 공평한 학교를 만든 사람'), grp: 'south', trait: 'courage' }
];
const figCard = (f) => `<span class="fig" style="--c:${f.c}"><b>${f.ini}</b><i>${f.sym}</i></span>`;
G1T({
  id: 'figures1', icon: '🦸', title: B('Heroes of America', '미국의 인물들'), sub: B('Six people who made a difference', '큰 일을 한 여섯 사람'), u: 'Historical figures',
  play() {
    const lv = lvl('figures1'), f = pick(FIGS), ds = others(FIGS, f, 2), kind = pick(lv === 1 ? ['who', 'what'] : ['who', 'what', 'who', 'trait']);
    if (kind === 'who') {
      quiz(this, { ask: B(`Who is this? "${L(f.what)}"`, `누구일까요? "${f.what.ko}"`), opts: [f, ...ds].map(x => ({ html: figCard(x), label: x.n, ok: x === f })), cls: 'figs', after: B(`${f.n.en}: ${f.short.en}.`, `${f.n.ko}: ${f.short.ko}.`) });
    } else if (kind === 'what') {
      quiz(this, { ask: B('What did this person do?', '이 사람은 무슨 일을 했을까요?'), askSay: B(`What did ${f.n.en} do?`, `${f.n.ko}: 무슨 일을 했을까요?`), show: `<div class="figbig">${figCard(f)}<b>${L(f.n)}</b></div>`, opts: [f, ...ds].map(x => ({ html: `<span class="word">${L(x.short)}</span>`, ok: x === f })), cls: 'words sents', after: f.what, vocab: f.n.en });
    } else {
      const names = { courage: B('courage', '용기'), perseverance: B('perseverance (not giving up)', '인내 (포기하지 않기)'), environment: B('respect for nature', '자연을 존중하는 마음'), equality: B('equality (being fair to all)', '평등 (모두에게 공평하기)'), curious: B('curiosity', '호기심') }, t = f.trait, ds2 = others(Object.keys(names), t, 2);
      quiz(this, { ask: B(`Which trait fits ${f.n.en}?`, `${f.n.ko}에게 어울리는 품성은?`), show: `<div class="figbig">${figCard(f)}<b>${L(f.n)}</b></div>`, opts: [t, ...ds2].map(k => ({ html: `<span class="word">${L(names[k])}</span>`, ok: k === t })), cls: 'words', after: f.what });
    }
  }
});

// ---------- then and now ----------
const THEN = [[B('light', '불빛'), ['🕯️', B('a candle', '촛불')], ['💡', B('an electric lamp', '전등')]], [B('travel', '이동'), ['🐴', B('a horse and wagon', '말과 마차')], ['🚗', B('a car', '자동차')]], [B('writing', '글쓰기'), ['🪶', B('a feather pen', '깃털 펜')], ['💻', B('a computer', '컴퓨터')]], [B('talking to someone far away', '멀리 있는 사람과 이야기하기'), ['✉️', B('a letter carried by a rider', '말 탄 사람이 전하는 편지')], ['📱', B('a phone', '휴대전화')]], [B('cooking', '요리'), ['🔥', B('a fire in a fireplace', '벽난로 불')], ['🍳', B('a stove', '가스레인지')]], [B('keeping food cold', '음식을 차갑게 보관하기'), ['🧊', B('a cool cellar', '시원한 지하 저장실')], ['❄️', B('a refrigerator', '냉장고')]], [B('washing clothes', '빨래'), ['🪣', B('scrubbing by hand in a tub', '통에 담가 손으로 빨기')], ['🧺', B('a washing machine', '세탁기')]]];
G1T({
  id: 'thennow', icon: '⏳', title: B('Then and Now', '그때와 지금'), sub: B('Long ago and today', '옛날과 오늘날'), u: 'Past and present',
  play() {
    const t = pick(THEN), past = rnd(2) === 0, right = past ? t[1] : t[2], wrong = past ? t[2] : t[1];
    quiz(this, { ask: past ? B(`Long ago, how did people do this? ${L(t[0])}`, `옛날 사람들은 이것을 어떻게 했을까요? ${t[0].ko}`) : B(`Today, how do people do this? ${L(t[0])}`, `오늘날 사람들은 이것을 어떻게 할까요? ${t[0].ko}`), opts: [right, wrong].map(x => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: x === right })), cls: 'shapes', after: past ? B('That is how people did it long ago.', '옛날에는 그렇게 했어요.') : B('That is how people do it now.', '요즘에는 그렇게 해요.') });
  }
});

// ---------- where and when ----------
const GRPS = { colonies: B('the American colonies', '미국의 식민지 시대'), frontier: B('the American frontier', '미국의 개척지(서부)'), parks: B('National Parks', '국립공원'), south: B('the Southern United States', '미국 남부') };
G1T({
  id: 'placetime', icon: '🗺️', title: B('Where and When', '어디서 언제'), sub: B('Time and place shaped their lives', '시대와 장소가 삶을 만들었어요'), u: 'Time and place',
  play() {
    const f = pick(FIGS), ds = others(Object.keys(GRPS), f.grp, 2), names = Object.fromEntries(Object.entries(GRPS));
    quiz(this, { ask: B(`${f.n.en}'s story is connected to...`, `${f.n.ko}의 이야기와 관련 있는 곳과 때는?`), show: `<div class="figbig">${figCard(f)}<b>${L(f.n)}</b></div>`, opts: [f.grp, ...ds].map(k => ({ html: `<span class="word">${L(names[k])}</span>`, ok: k === f.grp })), cls: 'words', after: B(`${f.n.en}: ${GRPS[f.grp].en}.`, `${f.n.ko}: ${GRPS[f.grp].ko}.`) });
  }
});

// ---------- character counts ----------
const TRAITS = { fairness: B('fairness', '공정함'), respect: B('respect', '존중'), courage: B('courage', '용기'), perseverance: B('perseverance', '인내'), kindness: B('kindness', '친절'), tolerance: B('tolerance', '관용'), commitment: B('commitment', '헌신') };
const SCEN = [
  [B('Ana makes sure every friend gets the same number of turns.', '아나는 모든 친구가 같은 횟수로 차례를 갖게 해요.'), 'fairness'], [B('Ben listens when a new friend talks.', '벤은 새 친구가 말할 때 귀 기울여 들어요.'), 'respect'], [B('Mia is scared, but she tells the truth anyway.', '미아는 무섭지만 그래도 사실대로 말해요.'), 'courage'],
  [B('Sam falls off his bike, gets up, and tries again.', '샘은 자전거에서 넘어졌지만 일어나 다시 해 봐요.'), 'perseverance'], [B('Lily helps a classmate who dropped his books.', '릴리는 책을 떨어뜨린 반 친구를 도와줘요.'), 'kindness'], [B('Leo plays with a classmate who speaks a different language.', '레오는 다른 언어를 쓰는 반 친구와 함께 놀아요.'), 'tolerance'],
  [B('Zoe keeps practicing piano every day until the song is perfect.', '조이는 곡이 완벽해질 때까지 매일 피아노를 연습해요.'), 'perseverance'], [B('Max stands up for a friend who is being teased.', '맥스는 놀림받는 친구의 편을 들어 줘요.'), 'courage'], [B('Ava splits the snacks equally for everyone.', '에이바는 간식을 모두에게 똑같이 나눠요.'), 'fairness'], [B('Noah picks up trash at the park to take care of nature.', '노아는 자연을 아끼려고 공원의 쓰레기를 주워요.'), 'respect']
];
G1T({
  id: 'character1', icon: '💛', title: B('Character Counts', '좋은 품성'), sub: B('Fairness, respect, courage, perseverance', '공정, 존중, 용기, 인내'), u: 'Character',
  play() {
    const s = pick(SCEN), ds = others(Object.keys(TRAITS).filter(k => k !== s[1]), '', 2);
    quiz(this, { ask: B('Which good trait does this show?', '어떤 좋은 품성이 보일까요?'), show: `<div class="storytext">${L(s[0])}</div>`, opts: [s[1], ...ds].map(k => ({ html: `<span class="word">${L(TRAITS[k])}</span>`, ok: k === s[1] })), cls: 'words', after: B(`That shows ${TRAITS[s[1]].en}.`, `${TRAITS[s[1]].ko}의 모습이에요.`), vocab: TRAITS[s[1]].en });
  }
});

// ---------- compass rose plus ----------
const DIR8 = [['N', B('North', '북쪽'), 0], ['NE', B('Northeast', '북동쪽'), 45], ['E', B('East', '동쪽'), 90], ['SE', B('Southeast', '남동쪽'), 135], ['S', B('South', '남쪽'), 180], ['SW', B('Southwest', '남서쪽'), 225], ['W', B('West', '서쪽'), 270], ['NW', B('Northwest', '북서쪽'), 315]];
const roseSvg = (deg) => `<svg viewBox="0 0 120 120" class="rose8"><circle cx="60" cy="60" r="50" fill="#fff" stroke="#1d3557" stroke-width="3"/>${DIR8.map(d => { const a = (d[2] - 90) * Math.PI / 180, r = d[0].length === 1 ? 40 : 38; return `<text x="${60 + r * Math.cos(a)}" y="${60 + r * Math.sin(a) + 4}" font-size="${d[0].length === 1 ? 12 : 9}" font-weight="800" text-anchor="middle" fill="${d[0].length === 1 ? '#ef476f' : '#1d3557'}">${d[0]}</text>`; }).join('')}<g transform="rotate(${deg} 60 60)"><polygon points="60,22 66,60 54,60" fill="#118ab2"/><polygon points="60,98 66,60 54,60" fill="#bbb"/></g><circle cx="60" cy="60" r="4" fill="#1d3557"/></svg>`;
G1T({
  id: 'mapdir', icon: '🧭', title: B('Compass Rose Plus', '나침반 중간 방향'), sub: B('NE, NW, SE, SW', '북동, 북서, 남동, 남서'), u: 'Map skills',
  play() {
    const lv = lvl('mapdir'), kind = pick(lv === 1 ? ['arrow', 'arrow', 'between'] : ['arrow', 'between', 'grid', 'grid']), diag = DIR8.filter(d => d[0].length === 2);
    if (kind === 'between') {
      const t = pick(diag), a = t[0][0], b = t[0][1], full = (c) => DIR8.find(d => d[0] === c)[1];
      quiz(this, { ask: B(`Which direction is between ${full(a).en} and ${full(b).en}?`, `${full(a).ko}과 ${full(b).ko} 사이의 방향은?`), show: roseSvg(0), opts: [t, ...others(DIR8, t, 2)].map(d => ({ html: `<span class="num">${d[0]}</span>`, label: d[1], ok: d === t })), cls: 'shapes', after: B(`${t[1].en} (${t[0]}) is between ${full(a).en} and ${full(b).en}.`, `${t[1].ko}(${t[0]})은 ${full(a).ko}과 ${full(b).ko} 사이예요.`), vocab: t[1].en });
    } else if (kind === 'arrow') {
      const pool = lv === 1 ? DIR8 : DIR8, t = pick(pool);
      quiz(this, { ask: B('Which direction does the arrow point?', '화살표는 어느 방향을 가리킬까요?'), show: roseSvg(t[2]), opts: [t, ...others(DIR8, t, 2)].map(d => ({ html: `<span class="num">${d[0]}</span>`, label: d[1], ok: d === t })), cls: 'shapes', after: B(`It points ${t[1].en}.`, `${t[1].ko}을 가리켜요.`), vocab: t[1].en });
    } else {
      const N = 4, items = [['🏠', B('house', '집')], ['🏫', B('school', '학교')], ['🌳', B('tree', '나무')], ['🏪', B('store', '가게')], ['⛲', B('fountain', '분수')], ['🏥', B('hospital', '병원')]], [a, b] = shuffle(items).slice(0, 2); let ax, ay, d, k;
      for (let tries = 0; tries < 60; tries++) { ax = rnd(N); ay = rnd(N); d = pick(diag); k = 1 + rnd(2); const rad = (d[2] - 90) * Math.PI / 180, dx = Math.round(Math.cos(rad)), dy = Math.round(Math.sin(rad)), bx = ax + dx * k, by = ay + dy * k; if (bx >= 0 && bx < N && by >= 0 && by < N) break; }
      const rad = (d[2] - 90) * Math.PI / 180, bx = ax + Math.round(Math.cos(rad)) * k, by = ay + Math.round(Math.sin(rad)) * k, cells = []; for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) cells.push(`<div class="mc">${x === ax && y === ay ? a[0] : x === bx && y === by ? b[0] : ''}</div>`);
      quiz(this, { ask: B(`Which way is the ${b[1].en} from the ${a[1].en}?`, `${a[1].ko}에서 볼 때 ${b[1].ko}의 위치는 어느 쪽일까요?`), show: `<div class="mapwrap"><div class="map n4">${cells.join('')}</div><div class="rose"><span class="rn">N</span><span class="rw">W</span><span class="re">E</span><span class="rs">S</span></div></div>`, opts: [d, ...others(DIR8, d, 2)].map(x => ({ html: `<span class="num">${x[0]}</span>`, label: x[1], ok: x === d })), cls: 'shapes', after: B(`It is to the ${d[1].en}.`, `${d[1].ko}에 있어요.`), vocab: d[1].en });
    }
  }
});

// ---------- where I live ----------
const NEST = [[B('city', '도시'), 1], [B('county', '카운티(군)'), 2], [B('state', '주'), 3], [B('country', '나라'), 4], [B('continent', '대륙'), 5]];
G1T({
  id: 'whereilive', icon: '📍', title: B('Where I Live', '내가 사는 곳 (확장)'), sub: B('City, county, state, country, continent', '도시, 카운티, 주, 나라, 대륙'), u: 'My place on Earth',
  play() {
    const lv = lvl('whereilive'), city = (S.addr && S.addr.city) || pick(GWINNETT_CITIES), kind = pick(lv === 1 ? ['county', 'state', 'country', 'continent'] : ['county', 'biggest', 'order', 'continent', 'country', 'state']);
    const nest = `<div class="nest"><div class="n5"><div class="n4"><div class="n3"><div class="n2"><div class="n1">${city}</div></div></div></div></div></div>`;
    if (kind === 'county') quiz(this, { ask: B(`${city} is a city in ___ County, Georgia.`, `${city} 도시는 조지아 주 ___ 카운티에 있어요.`), show: '', opts: tOpts('Gwinnett', ['Fulton', 'Cobb'].map(x => x), 'word').map(o => o), cls: 'words', after: B('Gwinnett County is a county in Georgia.', 'Gwinnett 카운티는 조지아 주에 있어요.') });
    else if (kind === 'state') quiz(this, { ask: B('Gwinnett County is in the state of ___.', 'Gwinnett 카운티는 ___ 주에 있어요.'), opts: ['Georgia', 'Florida', 'Texas'].map(v => ({ html: `<span class="word">${v}</span>`, ok: v === 'Georgia' })), cls: 'words', after: B('Georgia is our state.', '조지아가 우리가 사는 주예요.') });
    else if (kind === 'country') quiz(this, { ask: B('Georgia is a state in the country of ___.', '조지아는 ___ 나라에 있는 주예요.'), opts: ['the United States', 'Canada', 'Mexico'].map(v => ({ html: `<span class="word">${v}</span>`, ok: v === 'the United States' })), cls: 'words', after: B('Georgia is one of the 50 states of the United States.', '조지아는 미국의 50개 주 중 하나예요.') });
    else if (kind === 'continent') quiz(this, { ask: B('The United States is on the continent of ___.', '미국은 ___ 대륙에 있어요.'), opts: ['North America', 'Europe', 'Asia'].map(v => ({ html: `<span class="word">${v}</span>`, ok: v === 'North America' })), cls: 'words', after: B('We live in North America.', '우리는 북아메리카에 살아요.') });
    else if (kind === 'biggest') { const right = NEST[4]; quiz(this, { ask: B('Which place is the BIGGEST?', '가장 큰 곳은 어디일까요?'), show: nest, opts: [NEST[0], NEST[2], NEST[4]].map(x => ({ html: `<span class="word">${L(x[0])}</span>`, ok: x === right })), cls: 'words', after: B('A continent holds countries, states, counties, and cities.', '대륙 안에 나라, 주, 카운티, 도시가 있어요.') }); }
    else { const right = 'city → county → state → country → continent', cand = [right, 'state → city → county → continent → country', 'continent → city → state → county → country']; quiz(this, { ask: B('Put them from SMALLEST to BIGGEST.', '가장 작은 곳부터 큰 곳 순서로 놓아요.'), show: nest, opts: cand.map(v => ({ html: `<span class="word">${v}</span>`, ok: v === right })), cls: 'words sents', after: B('Small to big: city, county, state, country, continent.', '작은 곳에서 큰 곳으로: 도시, 카운티, 주, 나라, 대륙.') }); }
  }
});

// ---------- continents and oceans ----------
const WORLD = {
  na: { n: B('North America', '북아메리카'), p: [[-168, 65], [-140, 70], [-110, 72], [-85, 70], [-65, 60], [-55, 50], [-67, 44], [-76, 35], [-81, 25], [-90, 29], [-97, 26], [-97, 20], [-87, 21], [-83, 10], [-79, 8], [-92, 15], [-105, 20], [-115, 30], [-124, 40], [-125, 49], [-135, 58], [-150, 60], [-165, 55]] },
  sa: { n: B('South America', '남아메리카'), p: [[-80, 10], [-62, 10], [-50, 0], [-35, -6], [-40, -22], [-58, -38], [-65, -55], [-75, -50], [-72, -30], [-81, -5]] },
  eu: { n: B('Europe', '유럽'), p: [[-10, 36], [0, 43], [-5, 48], [5, 53], [10, 57], [25, 60], [40, 67], [60, 68], [60, 55], [40, 45], [28, 41], [20, 37], [10, 38]] },
  af: { n: B('Africa', '아프리카'), p: [[-17, 15], [-6, 35], [10, 37], [32, 31], [43, 12], [51, 11], [40, -15], [33, -27], [20, -35], [12, -17], [9, 4], [-8, 5]] },
  as: { n: B('Asia', '아시아'), p: [[60, 68], [100, 76], [140, 72], [180, 66], [160, 58], [142, 46], [125, 38], [122, 25], [108, 10], [100, 3], [80, 8], [72, 20], [58, 25], [45, 36], [35, 38], [40, 45], [60, 55]] },
  au: { n: B('Australia', '오스트레일리아'), p: [[113, -22], [130, -12], [142, -11], [153, -27], [146, -39], [135, -35], [116, -35]] },
  an: { n: B('Antarctica', '남극 대륙'), p: [[-180, -66], [180, -66], [180, -90], [-180, -90]] }
};
const OCEANS = { pac: { n: B('Pacific Ocean', '태평양'), at: [[-150, 10]] }, atl: { n: B('Atlantic Ocean', '대서양'), at: [[-35, 20]] }, ind: { n: B('Indian Ocean', '인도양'), at: [[80, -20]] }, arc: { n: B('Arctic Ocean', '북극해'), at: [[0, 84]] }, sou: { n: B('Southern Ocean', '남극해'), at: [[20, -62]] } };
const px = (lon, lat) => `${(lon + 180).toFixed(1)},${(90 - lat).toFixed(1)}`;
const worldSvg = (hl, dot) => `<svg viewBox="0 0 360 180" class="worldsvg"><rect width="360" height="180" fill="#bfe6ff"/>${Object.entries(WORLD).map(([k, c]) => `<polygon points="${c.p.map(q => px(q[0], q[1])).join(' ')}" fill="${k === hl ? '#ef476f' : '#9ad07a'}" stroke="#4d7a3a" stroke-width="1"/>`).join('')}${dot ? `<circle cx="${dot[0] + 180}" cy="${90 - dot[1]}" r="7" fill="#ffd166" stroke="#c9951b" stroke-width="2"/>` : ''}</svg>`;
const LAND = [['🏔️', B('mountain', '산'), B('a very high, rocky area', '아주 높고 바위가 많은 곳')], ['🏜️', B('desert', '사막'), B('a dry place with little rain and lots of sand', '비가 거의 오지 않고 모래가 많은 건조한 곳')], ['🏞️', B('valley', '계곡'), B('low land between hills or mountains', '언덕이나 산 사이의 낮은 땅')], ['🏖️', B('coast', '해안'), B('land that meets the ocean', '바다와 닿아 있는 땅')]];
G1T({
  id: 'worldmap', icon: '🌍', title: B('Continents and Oceans', '대륙과 대양'), sub: B('7 continents, 5 oceans, landforms', '7대륙, 5대양, 지형'), u: 'Earth',
  play() {
    const lv = lvl('worldmap'), kind = pick(lv === 1 ? ['cont', 'cont', 'land'] : ['cont', 'ocean', 'ocean', 'land', 'ga']);
    if (kind === 'cont') { const ks = Object.keys(WORLD), k = pick(ks), ds = others(ks, k, 2); quiz(this, { ask: B('Which continent is colored red?', '빨갛게 칠해진 대륙은 어디일까요?'), show: worldSvg(k), opts: [k, ...ds].map(c => ({ html: `<span class="word">${L(WORLD[c].n)}</span>`, ok: c === k })), cls: 'words', after: B(`That is ${WORLD[k].n.en}.`, `${WORLD[k].n.ko}이에요.`), vocab: WORLD[k].n.en }); }
    else if (kind === 'ocean') { const ks = Object.keys(OCEANS), k = pick(ks), ds = others(ks, k, 2); quiz(this, { ask: B('Which ocean is the yellow dot in?', '노란 점이 있는 대양은?'), show: worldSvg('', OCEANS[k].at[0]), opts: [k, ...ds].map(o => ({ html: `<span class="word">${L(OCEANS[o].n)}</span>`, ok: o === k })), cls: 'words', after: B(`That is the ${OCEANS[k].n.en}.`, `${OCEANS[k].n.ko}이에요.`), vocab: OCEANS[k].n.en }); }
    else if (kind === 'land') { const t = pick(LAND), ds = others(LAND, t, 2); quiz(this, { ask: B(`Which landform is ${L(t[2])}?`, `${t[2].ko}은 어떤 지형일까요?`), opts: [t, ...ds].map(x => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: x === t })), after: B(`A ${t[1].en} is ${t[2].en}.`, `${t[1].ko}은 ${t[2].ko}이에요.`), vocab: t[1].en }); }
    else { const items = [[B('Georgia has mountains in the north. What landform is that?', '조지아 북쪽에는 산이 있어요. 어떤 지형일까요?'), LAND[0]], [B('Georgia has a coast on the Atlantic Ocean. What landform is that?', '조지아는 대서양과 맞닿은 해안이 있어요. 어떤 지형일까요?'), LAND[3]]], it = pick(items), ds = others(LAND, it[1], 2); quiz(this, { ask: it[0], opts: [it[1], ...ds].map(x => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: x === it[1] })), after: B('Georgia has mountains and a coast!', '조지아에는 산과 해안이 있어요!') }); }
  }
});

// ---------- goods and services ----------
const GOODS = [['🍞', B('bread', '빵')], ['👟', B('shoes', '신발')], ['🧸', B('a toy', '장난감')], ['📚', B('a book', '책')], ['🍑', B('a peach', '복숭아')], ['🧢', B('a hat', '모자')]];
const SERVICES = [['🩺', B('a doctor checking you', '진찰해 주는 의사')], ['🚌', B('a bus driver', '버스 기사')], ['💇', B('a barber cutting hair', '머리를 잘라 주는 이발사')], ['📮', B('a mail carrier', '우편 배달부')], ['🧑‍🚒', B('a firefighter', '소방관')], ['👩‍🏫', B('a teacher', '선생님')]];
G1T({
  id: 'goodsservices', icon: '🛍️', title: B('Goods and Services', '물건과 서비스'), sub: B('Things people make and jobs people do', '만든 물건과 해 주는 일'), u: 'Economics',
  play() {
    const lv = lvl('goodsservices'), kind = pick(lv === 1 ? ['gs', 'gs', 'gs'] : ['gs', 'gs', 'pc']);
    if (kind === 'gs') { const good = rnd(2) === 0, t = good ? pick(GOODS) : pick(SERVICES); quiz(this, { ask: B('Is this a GOOD (a thing people make) or a SERVICE (work done for others)?', '이것은 물건(만든 것)일까요, 서비스(남을 위한 일)일까요?'), askSay: B('Is this a good, a thing people make, or a service, work done for others?', '이것은 물건일까요, 서비스일까요?'), show: `<div class="figbig"><span class="emo">${t[0]}</span><b>${L(t[1])}</b></div>`, opts: [['good', B('a good', '물건')], ['service', B('a service', '서비스')]].map(x => ({ html: `<span class="word">${L(x[1])}</span>`, ok: (x[0] === 'good') === good })), cls: 'words', after: good ? B('A good is a thing people make or grow.', '물건은 사람들이 만들거나 기른 것이에요.') : B('A service is work that one person does for others.', '서비스는 한 사람이 다른 사람을 위해 하는 일이에요.') }); }
    else {
      const qs = [[B('A farmer grows peaches to sell. The farmer is a ___.', '농부가 복숭아를 길러서 팔아요. 농부는 ___예요.'), tx2('producer', '생산자'), tx2('consumer', '소비자')], [B('You buy and eat a peach. You are a ___.', '복숭아를 사서 먹어요. 나는 ___예요.'), tx2('consumer', '소비자'), tx2('producer', '생산자')], [B('A baker makes bread to sell. The baker is a ___.', '제빵사가 팔려고 빵을 만들어요. 제빵사는 ___예요.'), tx2('producer', '생산자'), tx2('consumer', '소비자')], [B('A family buys shoes at a store. They are ___.', '가족이 가게에서 신발을 사요. 그들은 ___예요.'), tx2('consumers', '소비자'), tx2('producers', '생산자')]], q = pick(qs);
      quiz(this, { ask: q[0], opts: tOpts(q[1], [q[2]]), cls: 'words', after: B('Producers make goods or give services. Consumers buy and use them. People can be both!', '생산자는 물건을 만들거나 서비스를 해요. 소비자는 사서 써요. 사람은 둘 다일 수 있어요!') });
    }
  }
});
function tx2(a, b) { return B(a, b); }

// ---------- save or spend ----------
G1T({
  id: 'savespend', icon: '🐷', title: B('Save or Spend?', '모을까 쓸까'), sub: B('Wants, needs, and saving', '원하는 것, 필요한 것, 저축'), u: 'Money choices',
  play() {
    const lv = lvl('savespend'), qs = [
      [1, B('Two kids want the last toy, but there is only one. This is called ___.', '아이 둘이 마지막 남은 장난감 하나를 갖고 싶어 해요. 이것을 ___(이)라고 해요.'), tx2('scarcity', '부족(희소성)'), [tx2('a service', '서비스'), tx2('a trade', '교환')]],
      [1, B('People earn money by ___.', '사람들은 ___ 돈을 벌어요.'), tx2('working', '일해서'), [tx2('sleeping', '잠만 자서'), tx2('wishing', '소원을 빌어서')]],
      [1, B('Which one is a NEED?', '꼭 필요한 것은 어느 것일까요?'), tx2('food', '음식'), [tx2('a video game', '게임'), tx2('a new toy', '새 장난감')]],
      [1, B('Which one is a WANT?', '갖고 싶은 것(원하는 것)은 어느 것일까요?'), tx2('a new toy', '새 장난감'), [tx2('water', '물'), tx2('a home', '집')]],
      [1, B('Saving money means ___.', '돈을 저축한다는 것은 ___ 뜻이에요.'), tx2('keeping it for later', '나중을 위해 모아 두는 것'), [tx2('spending it all now', '지금 다 쓰는 것'), tx2('giving it away', '남에게 주는 것')]],
      [2, B('Ben wants a toy that costs $5. He has $3. What can he do?', '벤은 5달러짜리 장난감을 갖고 싶은데 3달러가 있어요. 어떻게 할 수 있을까요?'), tx2('Save more money', '돈을 더 모아요'), [tx2('Spend the $3 on candy', '3달러로 사탕을 사요'), tx2('Forget the toy forever', '장난감을 영영 잊어요')]],
      [2, B('Mia earned $4 helping her neighbor. She can save it or spend it. Who is making a choice?', '미아는 이웃을 도와 4달러를 벌었어요. 저축하거나 쓸 수 있어요. 선택하는 사람은 누구일까요?'), tx2('Mia', '미아'), [tx2('The neighbor', '이웃'), tx2('Nobody', '아무도 아니에요')]],
      [2, B('We cannot have everything we want because ___.', '원하는 것을 다 가질 수 없는 이유는 ___.'), tx2('wants are unlimited, but resources are limited', '원하는 것은 끝이 없지만 가진 것은 한정되어 있어서'), [tx2('stores are closed', '가게가 닫혀 있어서'), tx2('money is heavy', '돈이 무거워서')]]
    ], q = pick(qs.filter(x => x[0] <= lv));
    quiz(this, { ask: q[1], opts: tOpts(q[2], q[3]), cls: 'words sents', after: B('Smart choices help us with the things we need and want.', '현명한 선택은 꼭 필요한 것과 갖고 싶은 것을 잘 고르는 데 도움이 돼요.') });
  }
});

// ---------- fact or opinion ----------
const FACTOP = [
  [B('Atlanta is the capital of Georgia.', '애틀랜타는 조지아의 주도예요.'), 1], [B('A triangle has three sides.', '삼각형은 변이 세 개예요.'), 1], [B('Peaches grow on trees.', '복숭아는 나무에서 자라요.'), 1], [B('Georgia is a state.', '조지아는 미국의 주예요.'), 1], [B('Dogs have four legs.', '개는 다리가 네 개예요.'), 1], [B('The sun gives us light.', '해는 우리에게 빛을 줘요.'), 1], [B('There are seven days in a week.', '일주일은 7일이에요.'), 1],
  [B('Peaches are the yummiest fruit.', '복숭아는 가장 맛있는 과일이에요.'), 0], [B('Blue is the prettiest color.', '파랑은 가장 예쁜 색이에요.'), 0], [B('Dogs are better than cats.', '개가 고양이보다 더 좋아요.'), 0], [B('Summer is the best season.', '여름이 가장 좋은 계절이에요.'), 0], [B('Math is the most fun subject.', '수학이 가장 재미있는 과목이에요.'), 0], [B('The park is the nicest place.', '공원이 가장 멋진 곳이에요.'), 0]
];
const CAUSE_EFFECT = [[B('It rained all morning, so the ground got wet.', '아침 내내 비가 와서 땅이 젖었어요.'), B('It rained.', '비가 왔어요.'), B('The ground got wet.', '땅이 젖었어요.')], [B('Sam forgot his coat, so he felt cold.', '샘이 코트를 안 가져가서 추웠어요.'), B('Sam forgot his coat.', '샘이 코트를 안 가져갔어요.'), B('Sam felt cold.', '샘이 추웠어요.')], [B('Mia studied hard, so she did well on the test.', '미아는 열심히 공부해서 시험을 잘 봤어요.'), B('Mia studied hard.', '미아가 열심히 공부했어요.'), B('Mia did well on the test.', '미아가 시험을 잘 봤어요.')], [B('The ice melted because it got hot.', '더워져서 얼음이 녹았어요.'), B('It got hot.', '더워졌어요.'), B('The ice melted.', '얼음이 녹았어요.')]];
G1T({
  id: 'factopinion', icon: '⚖️', title: B('Fact or Opinion?', '사실일까 생각일까'), sub: B('Facts, opinions, causes and effects', '사실, 의견, 원인과 결과'), u: 'Thinking skills',
  play() {
    const lv = lvl('factopinion'), kind = pick(lv === 1 ? ['fo', 'fo', 'fo'] : ['fo', 'fo', 'cause', 'order']);
    if (kind === 'fo') { const s = pick(FACTOP), fact = s[1] === 1; quiz(this, { ask: B('Is this a FACT (can be checked) or an OPINION (what someone thinks)?', '이것은 사실(확인할 수 있는 것)일까요, 의견(누군가의 생각)일까요?'), askSay: B('Is this a fact, or an opinion?', '이것은 사실일까요, 의견일까요?'), show: `<div class="bigword sent">${L(s[0])}</div>`, opts: [['fact', B('Fact', '사실')], ['opinion', B('Opinion', '의견')]].map(x => ({ html: `<span class="word">${L(x[1])}</span>`, ok: (x[0] === 'fact') === fact })), cls: 'words', after: fact ? B('A fact can be checked and proved.', '사실은 확인하고 증명할 수 있어요.') : B('An opinion is what someone thinks or feels.', '의견은 누군가가 생각하거나 느끼는 것이에요.') }); }
    else if (kind === 'cause') { const c = pick(CAUSE_EFFECT), askCause = rnd(2) === 0; quiz(this, { ask: askCause ? B('What is the CAUSE_EFFECT (why it happened)?', '원인(왜 그랬는지)은 무엇일까요?') : B('What is the EFFECT (what happened)?', '결과(무슨 일이 생겼는지)는 무엇일까요?'), show: `<div class="bigword sent">${L(c[0])}</div>`, opts: [askCause ? c[1] : c[2], askCause ? c[2] : c[1]].map((x, i) => ({ html: `<span class="word">${L(x)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('The cause is why. The effect is what happened.', '원인은 이유이고, 결과는 일어난 일이에요.') }); }
    else { const day = [[B('wake up', '일어나요'), '⏰'], [B('eat breakfast', '아침을 먹어요'), '🥣'], [B('go to school', '학교에 가요'), '🏫'], [B('go to bed', '잠을 자요'), '🛏️']], idx = rnd(3), first = rnd(2) === 0, a = day[idx], b = day[idx + 1]; quiz(this, { ask: first ? B('Which happens FIRST?', '먼저 일어나는 일은?') : B('Which happens NEXT?', '그다음에 일어나는 일은?'), show: first ? '' : `<div class="bigword">${L(a[0])} ${a[1]} → ?</div>`, opts: first ? [a, b].map((x, i) => ({ html: `<span class="word">${x[1]} ${L(x[0])}</span>`, ok: i === 0 })) : [b, a].map((x, i) => ({ html: `<span class="word">${x[1]} ${L(x[0])}</span>`, ok: i === 0 })), cls: 'words', after: B('Think about the order of events.', '일이 일어난 순서를 생각해 봐요.') }); }
  }
});

// ---------- patriotism: America and America the Beautiful ----------
const PATRIOT = [
  [B('"Freedom" means being free to make your own choices.', '"자유(freedom)"는 스스로 선택할 수 있다는 뜻이에요.'), B('Which word means being free to make your own choices?', '스스로 선택할 수 있다는 뜻의 낱말은?'), tx2('freedom', '자유'), [tx2('homework', '숙제'), tx2('traffic', '교통')]],
  [B('"Liberty" is another word for freedom.', '"liberty"는 자유를 뜻하는 또 다른 낱말이에요.'), B('Which word means the same as freedom?', '자유와 뜻이 같은 낱말은?'), tx2('liberty', '자유(liberty)'), [tx2('library', '도서관'), tx2('letter', '편지')]],
  [B('"Pride" is a good feeling about something you care about.', '"자랑스러움(pride)"은 소중한 것에 대해 느끼는 좋은 기분이에요.'), B('Feeling happy and proud of your country is called...', '내 나라를 자랑스럽게 여기는 마음을 무엇이라고 할까요?'), tx2('pride', '자랑스러움'), [tx2('fear', '두려움'), tx2('boredom', '지루함')]],
  [B('"Brotherhood" means people caring for each other like family.', '"형제애(brotherhood)"는 가족처럼 서로를 아끼는 마음이에요.'), B('Caring for each other like family is called...', '가족처럼 서로를 아끼는 마음을 무엇이라고 할까요?'), tx2('brotherhood', '형제애'), [tx2('competition', '경쟁'), tx2('silence', '침묵')]],
  [B('In "America (My Country, \'Tis of Thee)" we sing "sweet land of liberty."', '"America (My Country, \'Tis of Thee)"에서 "sweet land of liberty"라고 노래해요.'), B('In the song, "sweet land of ___"', '노래 가사: "sweet land of ___"'), tx2('liberty', 'liberty(자유)'), [tx2('candy', '사탕'), tx2('chairs', '의자')]],
  [B('"America the Beautiful" says "from sea to shining sea."', '"America the Beautiful"에는 "from sea to shining sea"라는 구절이 있어요.'), B('In the song, "from sea to shining ___"', '노래 가사: "from sea to shining ___"'), tx2('sea', 'sea(바다)'), [tx2('sky', '하늘'), tx2('star', '별')]]
];
G1T({
  id: 'patriot', icon: '🎵', title: B('Patriotic Songs', '애국 노래의 낱말'), sub: B('"America" and "America the Beautiful"', '"America"와 "America the Beautiful"'), u: 'Patriotism',
  play() {
    const p = pick(PATRIOT); quiz(this, { ask: p[1], show: `<div class="storytext">${L(p[0])}</div>`, opts: tOpts(p[2], p[3]), cls: 'words', after: p[0], vocab: p[2].en });
  }
});
