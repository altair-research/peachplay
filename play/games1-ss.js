'use strict';
// Grade 1 social studies (Georgia Social Studies GSE, updated 2023): "Our American Heritage".
// SS1H historical figures, SS1G time/place and maps, SS1CG character and patriotism, SS1E economics, map and information-processing skills.
// Figures are shown as simple cartoon icons (never realistic portraits). Facts stay within the standard's list.
const AREA1T = (u) => B(`Grade 1 Social Studies · ${u}`, `1학년 사회 · ${U_KO[u] || u}`);
const G1T = (g) => registerGame(Object.assign({ grade: '1', subject: 'ss' }, g, { area: AREA1T(g.u) }));
const tOpts = (right, wrongs, cls = 'word') => [right, ...wrongs].map(w => ({ html: `<span class="${cls}">${L(w)}</span>`, ok: w === right }));

// ---------- the six figures ----------
const FIGS = [
  { id: 'franklin', n: B('Benjamin Franklin', '벤저민 프랭클린'), ini: 'BF', c: '#5aa9e6', sym: '⚡', what: B('He was an inventor, author, and statesman.', '발명가, 작가, 정치가였어요.'), short: B('inventor and author', '발명가이자 작가'), grp: 'colonies', trait: 'curious' },
  { id: 'jefferson', n: B('Thomas Jefferson', '토머스 제퍼슨'), ini: 'TJ', c: '#a78bfa', sym: '📜', what: B('He was the main writer of the Declaration of Independence.', '독립선언서를 가장 중심이 되어 쓴 사람이에요.'), short: B('main writer of the Declaration of Independence', '독립선언서를 주로 쓴 사람'), grp: 'colonies', trait: 'curious' },
  { id: 'lewis', n: B('Lewis and Clark, with Sacagawea', '루이스와 클라크, 그리고 사카가웨아'), ini: 'LC', c: '#4fd1b8', sym: '🧭', what: B('They explored the American West. Sacagawea, a Shoshone woman, helped as a guide and interpreter. Many Native American nations helped them too.', '미국 서부를 탐험했어요. 쇼쇼니족 여성 사카가웨아가 길잡이와 통역으로 도왔어요. 여러 원주민 부족도 도와주었어요.'), short: B('explorers of the West', '서부를 탐험한 사람들'), grp: 'frontier', trait: 'courage' },
  { id: 'roosevelt', n: B('Theodore Roosevelt', '시어도어 루스벨트'), ini: 'TR', c: '#7cc95e', sym: '🌲', what: B('He helped protect National Parks and nature.', '국립공원과 자연을 보호하도록 도왔어요.'), short: B('protected National Parks', '국립공원을 보호한 사람'), grp: 'parks', trait: 'environment' },
  { id: 'carver', n: B('George Washington Carver', '조지 워싱턴 카버'), ini: 'GC', c: '#ffb347', sym: '🥜', what: B('He was a scientist and teacher who helped farmers and found many uses for peanuts.', '농부들을 돕고 땅콩의 쓰임새를 많이 찾아낸 과학자이자 선생님이에요.'), short: B('scientist who studied peanuts', '땅콩을 연구한 과학자'), grp: 'south', trait: 'perseverance' },
  { id: 'bridges', n: B('Ruby Bridges', '루비 브리지스'), ini: 'RB', c: '#f78fb3', sym: '🏫', what: B('In 1960, a six-year-old girl bravely became the first Black child at her New Orleans school, helping make schools fair for all children.', '1960년, 여섯 살 소녀가 뉴올리언스의 자기 학교에 다닌 첫 흑인 아이가 되어, 모든 아이를 위한 공평한 학교를 만드는 데 용감하게 힘을 보탰어요.'), short: B('helped make schools fair for everyone', '모두에게 공평한 학교를 만든 사람'), grp: 'south', trait: 'courage' }
];
const figCard = (f) => `<span class="fig" style="--c:${f.c}"><b>${f.ini}</b><i>${f.sym}</i></span>`;
// Specific, independently sourced achievements, not personality judgments.
// Keep these separate from FIGS, which is also used by placetime.
// Sources and the all-pairs distractor review: docs/review/codex-done-1.md.
const FIGURE1_FACTS = [
  { id: 'franklin', who: B('Who invented a lightning rod to help protect buildings?', '건물을 보호하는 피뢰침을 발명한 사람은?'), deed: B('Invented a lightning rod', '피뢰침을 발명했어요'), after: B('Benjamin Franklin designed a lightning rod to help protect buildings from lightning.', '벤저민 프랭클린은 번개로부터 건물을 보호하는 피뢰침을 발명했어요.') },
  { id: 'jefferson', who: B('Who was the main writer of the Declaration of Independence?', '미국 독립선언서의 초안을 주로 쓴 사람은?'), deed: B('Wrote the main draft of the Declaration of Independence', '미국 독립선언서의 초안을 주로 썼어요'), after: B('Thomas Jefferson wrote the main draft. Other people helped revise it.', '토머스 제퍼슨이 초안을 주로 썼고, 다른 사람들이 함께 다듬었어요.') },
  { id: 'lewis', who: B('Which group traveled west to the Pacific Ocean in 1805?', '1805년에 서쪽으로 여행해 태평양에 도착한 탐험대는?'), deed: B('Traveled west to the Pacific in 1805', '1805년에 서쪽으로 여행해 태평양에 도착했어요'), after: B('Lewis and Clark reached the Pacific in 1805. Sacagawea and many Native peoples helped the expedition.', '루이스와 클라크는 1805년에 태평양에 도착했어요. 사카가웨아와 여러 원주민이 탐험대를 도왔어요.') },
  { id: 'roosevelt', who: B('Which president established five national parks?', '국립공원 다섯 곳을 세운 대통령은?'), deed: B('Established five national parks as president', '대통령으로서 국립공원 다섯 곳을 세웠어요'), after: B('Theodore Roosevelt signed laws establishing five national parks while he was president.', '시어도어 루스벨트는 대통령일 때 국립공원 다섯 곳을 세우는 법에 서명했어요.') },
  { id: 'carver', who: B('Who studied uses for peanuts at Tuskegee?', '터스키기에서 땅콩의 여러 쓰임새를 연구한 사람은?'), deed: B('Studied uses for peanuts at Tuskegee', '터스키기에서 땅콩의 쓰임새를 연구했어요'), after: B('George Washington Carver studied many uses for peanuts and helped farmers.', '조지 워싱턴 카버는 땅콩의 여러 쓰임새를 연구하고 농부들을 도왔어요.') },
  { id: 'bridges', who: B('Who became the first Black child at William Frantz School in 1960?', '1960년에 윌리엄 프랜츠 학교에 다닌 첫 흑인 어린이는?'), deed: B('Entered William Frantz School in 1960', '1960년에 윌리엄 프랜츠 학교에 입학했어요'), after: B('At six, Ruby Bridges entered a school that had only allowed white children. She helped end unfair school segregation.', '여섯 살 루비 브리지스는 백인 아이들만 받던 학교에 입학했어요. 피부색으로 학생을 나누는 차별을 없애는 데 힘을 보탰어요.') }
];
G1T({
  id: 'figures1', icon: '🦸', title: B('Heroes of America', '미국의 인물들'), sub: B('Match people with what they did', '인물과 그 사람이 한 일 연결하기'), u: 'Historical figures',
  play() {
    const fact = pick(FIGURE1_FACTS), f = FIGS.find(x => x.id === fact.id), ds = others(FIGURE1_FACTS, fact, lvl('figures1')===2?3:2), kind = pick(['who', 'what']);
    if (kind === 'who') {
      quiz(this, { ask: fact.who, opts: [fact, ...ds].map(x => { const person = FIGS.find(p => p.id === x.id); return { html: `<span class="word">${L(person.n)}</span>`, ok: x === fact }; }), cls: 'words sents', after: fact.after,
        onRender() { document.getElementById('fact').style.marginBottom = 'calc(76px + env(safe-area-inset-bottom))'; }
      });
    } else {
      quiz(this, { ask: B(`What did ${f.n.en} do?`, `${f.n.ko}: 무슨 일을 했을까요?`), opts: [fact, ...ds].map(x => ({ html: `<span class="word">${L(x.deed)}</span>`, ok: x === fact })), cls: 'words sents', after: fact.after,
        // Leave feedback above the engine's fixed Next button, only in this round.
        onRender() { document.getElementById('fact').style.marginBottom = 'calc(76px + env(safe-area-inset-bottom))'; }
      });
    }
  }
});

// ---------- then and now ----------
const THEN = [[B('light', '불빛'), ['🕯️', B('a candle', '촛불')], ['💡', B('an electric lamp', '전등')]], [B('travel', '이동'), ['🐴', B('a horse and wagon', '말과 마차')], ['🚗', B('a car', '자동차')]], [B('writing', '글쓰기'), ['🪶', B('a feather pen', '깃털 펜')], ['💻', B('a computer', '컴퓨터')]], [B('talking to someone far away', '멀리 있는 사람과 이야기하기'), ['✉️', B('a letter carried by a rider', '말 탄 사람이 전하는 편지')], ['📱', B('a phone', '휴대전화')]], [B('cooking', '요리'), ['🔥', B('a fire in a fireplace', '벽난로 불')], ['🍳', B('a stove', '스토브(가스레인지)')]], [B('keeping food cold', '음식을 차갑게 보관하기'), ['🧊', B('a cool cellar', '시원한 지하 저장실')], ['❄️', B('a refrigerator', '냉장고')]], [B('washing clothes', '빨래'), ['🪣', B('scrubbing by hand in a tub', '통에 담가 손으로 빨기')], ['🧺', B('a washing machine', '세탁기')]]];
G1T({
  id: 'thennow', icon: '⏳', title: B('Then and Now', '그때와 지금'), sub: B('Long ago and today', '옛날과 오늘날'), u: 'Past and present',
  play() {
    if(lvl('thennow')===2){
      const t=pick(THEN),other=pick(THEN.filter(x=>x!==t));
      quiz(this,{ask:B('Which modern tool serves the SAME purpose?','같은 일을 하는 오늘날의 도구는?'),show:`<div style="font-size:clamp(16px,3dvh,22px)">${L(t[0])}: ${t[1][0]} ${L(t[1][1])}</div>`,opts:[t[2],t[1],other[2]].map((x,i)=>({html:`<span class="emo">${x[0]}</span>`,label:x[1],ok:i===0})),cls:'shapes'});return;
    }
    const t = pick(THEN), past = rnd(2) === 0, right = past ? t[1] : t[2], wrong = past ? t[2] : t[1];
    quiz(this, { ask: past ? B(`Long ago, how did people do this? ${L(t[0])}`, `옛날 사람들은 이것을 어떻게 했을까요? ${t[0].ko}`) : B(`Today, how do people do this? ${L(t[0])}`, `오늘날 사람들은 이것을 어떻게 할까요? ${t[0].ko}`), opts: [right, wrong].map(x => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: x === right })), cls: 'shapes', after: past ? B('That is how people did it long ago.', '옛날에는 그렇게 했어요.') : B('That is how people do it now.', '요즘에는 그렇게 해요.') });
  }
});

// ---------- where and when ----------
const GRPS = { colonies: B('the American colonies', '미국의 식민지 시대'), frontier: B('the American frontier', '미국의 개척지(서부)'), parks: B('National Parks', '국립공원'), south: B('the Southern United States', '미국 남부') };
G1T({
  id: 'placetime', icon: '🗺️', title: B('Where and When', '어디서 언제'), sub: B('Time and place shaped their lives', '시대와 장소가 삶을 만들었어요'), u: 'Time and place',
  play() {
    const f = pick(FIGS), ds = others(Object.keys(GRPS), f.grp, lvl('placetime')===2?3:2), names = Object.fromEntries(Object.entries(GRPS));
    if (rnd(2) === 0) {
      const wrong = shuffle(FIGS.filter(x => x.grp !== f.grp)).slice(0,lvl('placetime')===2?3:2);
      quiz(this, { ask: B(`Whose story is connected to ${GRPS[f.grp].en}?`, `${GRPS[f.grp].ko}: 이곳이나 시대와 관련 있는 인물은 누구일까요?`), opts: [f,...wrong].map((x,i) => ({ html: `<span class="word">${L(x.n)}</span>`, ok: i === 0 })), cls: 'words sents', after: B(`${f.n.en}: ${GRPS[f.grp].en}.`, `${f.n.ko}: ${GRPS[f.grp].ko}.`) }); return;
    }
    quiz(this, { ask: B(`${f.n.en}'s story is connected to...`, `${f.n.ko}의 이야기와 관련 있는 곳과 때는?`), show: `<div class="figbig">${figCard(f)}<b>${L(f.n)}</b></div>`, opts: [f.grp, ...ds].map(k => ({ html: `<span class="word">${L(names[k])}</span>`, ok: k === f.grp })), cls: 'words', after: B(`${f.n.en}: ${GRPS[f.grp].en}.`, `${f.n.ko}: ${GRPS[f.grp].ko}.`) });
  }
});

// ---------- character counts ----------
const TRAITS = { fairness: B('fairness', '공정함'), respect: B('respect', '존중'), courage: B('courage', '용기'), perseverance: B('perseverance', '인내'), kindness: B('kindness', '친절'), tolerance: B('tolerance', '관용'), commitment: B('commitment', '헌신') };
const SCEN = [
  [B('Ana makes sure every friend gets the same number of turns.', '아나는 모든 친구가 같은 횟수로 차례를 갖게 해요.'), 'fairness'], [B('Ben listens when a new friend talks.', '벤은 새 친구가 말할 때 귀 기울여 들어요.'), 'respect'], [B('Mia is scared, but she tells the truth anyway.', '미아는 무섭지만 그래도 사실대로 말해요.'), 'courage'],
  [B('Sam falls off his bike, gets up, and tries again.', '샘은 자전거에서 넘어졌지만 일어나 다시 해 봐요.'), 'perseverance'], [B('Lily helps a classmate who dropped his books.', '릴리는 책을 떨어뜨린 반 친구를 도와줘요.'), 'kindness'], [B('Leo plays with a classmate who speaks a different language.', '레오는 다른 언어를 쓰는 반 친구와 함께 놀아요.'), 'tolerance'],
  [B('Zoe keeps practicing piano every day until the song is perfect.', '조이는 곡이 완벽해질 때까지 매일 피아노를 연습해요.'), 'perseverance'], [B('Max feels nervous, but he stands up for a friend who is being teased.', '맥스는 떨리지만 놀림받는 친구의 편을 들어 줘요.'), 'courage'], [B('Ava splits the snacks equally for everyone.', '에이바는 간식을 모두에게 똑같이 나눠요.'), 'fairness'], [B('Noah leaves flowers growing and stays on the park path.', '노아는 꽃을 꺾지 않고 공원의 길로 다녀요.'), 'respect'], [B('Ana tries several ways to solve a tricky puzzle.', '아나는 어려운 퍼즐을 여러 방법으로 계속 풀어 봐요.'),'perseverance'], [B('Leo waits until his partner has finished speaking.', '레오는 짝이 말을 마칠 때까지 기다려요.'),'respect']
];
G1T({
  id: 'character1', icon: '💛', title: B('Character Counts', '좋은 품성'), sub: B('Fairness, respect, courage, perseverance', '공정, 존중, 용기, 인내'), u: 'Character',
  play() {
    const s = pick(SCEN), NEAR = { fairness: ['respect', 'kindness', 'tolerance'], respect: ['kindness', 'tolerance', 'fairness'], courage: ['perseverance', 'kindness', 'fairness'], perseverance: ['courage', 'commitment'], kindness: ['respect', 'tolerance', 'fairness'], tolerance: ['respect', 'kindness', 'fairness'] }, ds = others(Object.keys(TRAITS).filter(k => k !== s[1] && !(NEAR[s[1]] || []).includes(k)), '', 2);
    quiz(this, { ask: B('Which good trait does this show?', '어떤 좋은 품성이 보일까요?'), show: `<div class="storytext">${L(s[0])}</div>`, opts: [s[1], ...ds].map(k => ({ html: `<span class="word">${L(TRAITS[k]||B('Carelessness','부주의'))}</span>`, ok: k === s[1] })), cls: 'words', after: B(`That shows ${TRAITS[s[1]].en}.`, `${TRAITS[s[1]].ko}의 모습이에요.`), vocab: TRAITS[s[1]].en });
  }
});

// ---------- compass rose plus ----------
const DIR8 = [['N', B('North', '북쪽'), 0], ['NE', B('Northeast', '북동쪽'), 45], ['E', B('East', '동쪽'), 90], ['SE', B('Southeast', '남동쪽'), 135], ['S', B('South', '남쪽'), 180], ['SW', B('Southwest', '남서쪽'), 225], ['W', B('West', '서쪽'), 270], ['NW', B('Northwest', '북서쪽'), 315]];
const roseSvg = (deg) => `<svg viewBox="0 0 120 120" class="rose8"><circle cx="60" cy="60" r="50" fill="#fff" stroke="#1d3557" stroke-width="3"/>${DIR8.map(d => { const a = (d[2] - 90) * Math.PI / 180, r = d[0].length === 1 ? 40 : 38; return `<text x="${60 + r * Math.cos(a)}" y="${60 + r * Math.sin(a) + 4}" font-size="${d[0].length === 1 ? 12 : 9}" font-weight="800" text-anchor="middle" fill="${d[0].length === 1 ? '#ef476f' : '#1d3557'}">${d[0]}</text>`; }).join('')}<g transform="rotate(${deg} 60 60)"><polygon points="60,22 66,60 54,60" fill="#118ab2"/><polygon points="60,98 66,60 54,60" fill="#bbb"/></g><circle cx="60" cy="60" r="4" fill="#1d3557"/></svg>`;
G1T({
  id: 'mapdir', icon: '🧭', title: B('Compass Rose Plus', '나침반 중간 방향'), sub: B('NE, NW, SE, SW', '북동, 북서, 남동, 남서'), u: 'Map skills',
  play() {
    const lv = lvl('mapdir'), kind = pick(lv === 1 ? ['arrow', 'between', 'grid'] : ['arrow', 'between', 'grid', 'grid']), diag = DIR8.filter(d => d[0].length === 2);
    if (kind === 'between') {
      const t = pick(diag), a = t[0][0], b = t[0][1], full = (c) => DIR8.find(d => d[0] === c)[1];
      quiz(this, { ask: B(`Which direction is between ${full(a).en} and ${full(b).en}?`, `${full(a).ko}과 ${full(b).ko} 사이의 방향은?`), show: roseSvg(0), opts: [t, ...others(DIR8, t, 2)].map(d => ({ html: `<span class="num">${d[0]}</span>`, label: d[1], ok: d === t })), cls: 'shapes', after: B(`${t[1].en} (${t[0]}) is between ${full(a).en} and ${full(b).en}.`, `${t[1].ko}(${t[0]})은 ${full(a).ko}과 ${full(b).ko} 사이예요.`), vocab: t[1].en });
    } else if (kind === 'arrow') {
      const pool = lv === 1 ? DIR8.filter(d => d[0].length === 1) : DIR8, t = pick(pool);
      quiz(this, { ask: B('Which direction does the arrow point?', '화살표는 어느 방향을 가리킬까요?'), show: roseSvg(t[2]), opts: [t, ...others(pool, t, 2)].map(d => ({ html: `<span class="num">${d[0]}</span>`, label: d[1], ok: d === t })), cls: 'shapes', after: B(`It points ${t[1].en}.`, `${t[1].ko}을 가리켜요.`), vocab: t[1].en });
    } else {
      const N = 4, items = [['🏠', B('house', '집')], ['🏫', B('school', '학교')], ['🌳', B('tree', '나무')], ['🏪', B('store', '가게')], ['⛲', B('fountain', '분수')], ['🏥', B('hospital', '병원')]], [a, b] = shuffle(items).slice(0, 2); let ax, ay, d, k;
      for (let tries = 0; tries < 60; tries++) { ax = rnd(N); ay = rnd(N); d = pick(lv===1?DIR8.filter(d=>d[0].length===1):diag); k = 1 + rnd(2); const rad = (d[2] - 90) * Math.PI / 180, dx = Math.round(Math.cos(rad)), dy = Math.round(Math.sin(rad)), bx = ax + dx * k, by = ay + dy * k; if (bx >= 0 && bx < N && by >= 0 && by < N) break; }
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
    const lv = lvl('whereilive'), city = (S.addr && S.addr.city && GWINNETT_CITIES.some(c => c.toLowerCase() === S.addr.city.toLowerCase()) ? S.addr.city : pick(GWINNETT_CITIES)), kind = pick(lv === 1 ? ['county', 'state', 'country', 'continent'] : ['county', 'biggest', 'order', 'continent', 'country', 'state']);
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
  as: { n: B('Asia', '아시아'), p: [[60, 68], [100, 76], [140, 72], [180, 66], [160, 58], [142, 46], [125, 38], [122, 25], [108, 10], [100, 3], [80, 8], [72, 20], [60, 24], [56, 17], [44, 12], [39, 21], [35, 28], [35, 38], [40, 45], [60, 55]] },
  au: { n: B('Australia (Oceania)', '오세아니아'), p: [[113, -22], [130, -12], [142, -11], [153, -27], [146, -39], [135, -35], [116, -35]] },
  an: { n: B('Antarctica', '남극 대륙'), p: [[-180, -66], [180, -66], [180, -90], [-180, -90]] }
};
const OCEANS = { pac: { n: B('Pacific Ocean', '태평양'), at: [[-150, 10]] }, atl: { n: B('Atlantic Ocean', '대서양'), at: [[-35, 20]] }, ind: { n: B('Indian Ocean', '인도양'), at: [[80, -20]] }, arc: { n: B('Arctic Ocean', '북극해'), at: [[0, 84]] }, sou: { n: B('Southern Ocean', '남극해'), at: [[20, -62]] } };
const px = (lon, lat) => `${(lon + 180).toFixed(1)},${(90 - lat).toFixed(1)}`;
const worldSvg = (hl, dot) => `<svg viewBox="0 0 360 180" class="worldsvg"><rect width="360" height="180" fill="#bfe6ff"/>${Object.entries(WORLD).map(([k, c]) => (typeof WORLD_PATHS !== 'undefined' && WORLD_PATHS[k] ? `<path d="${WORLD_PATHS[k]}" fill="${k === hl ? '#ef476f' : '#9ad07a'}" stroke="${k === hl ? '#ef476f' : '#9ad07a'}" stroke-width=".6" stroke-linejoin="round"/>` : `<polygon points="${c.p.map(q => px(q[0], q[1])).join(' ')}" fill="${k === hl ? '#ef476f' : '#9ad07a'}" stroke="#4d7a3a" stroke-width="1"/>`)).join('')}${dot ? `<circle cx="${dot[0] + 180}" cy="${90 - dot[1]}" r="7" fill="#ffd166" stroke="#c9951b" stroke-width="2"/>` : ''}</svg>`;
const LAND = [['🏔️', B('mountain', '산'), B('a very high, rocky area', '아주 높고 바위가 많은 곳')], ['🏜️', B('desert', '사막'), B('a very dry place that gets little rain', '비가 거의 오지 않는 아주 건조한 곳')], ['🏞️', B('valley', '계곡'), B('low land between hills or mountains', '언덕이나 산 사이의 낮은 땅')], ['🏖️', B('coast', '해안'), B('land that meets the ocean', '바다와 닿아 있는 땅')]];
G1T({
  id: 'worldmap', icon: '🌍', title: B('Continents and Oceans', '대륙과 대양'), sub: B('7 continents, 5 oceans, landforms', '7대륙, 5대양, 지형'), u: 'Earth',
  play() {
    const lv = lvl('worldmap'), kind = pick(lv === 1 ? ['cont', 'ocean', 'land'] : ['cont', 'ocean', 'ocean', 'land', 'ga']);
    if (kind === 'cont') { const ks = Object.keys(WORLD), k = pick(ks), ds = others(ks, k, 2); quiz(this, { ask: B('Which continent is colored red?', '빨갛게 칠해진 대륙은 어디일까요?'), show: worldSvg(k), opts: [k, ...ds].map(c => ({ html: `<span class="word">${L(WORLD[c].n)}</span>`, ok: c === k })), cls: 'words', after: B(`That is ${WORLD[k].n.en}.`, `${WORLD[k].n.ko}이에요.`), vocab: WORLD[k].n.en }); }
    else if (kind === 'ocean') { const ks = Object.keys(OCEANS), k = pick(ks), ds = others(ks, k, 2); quiz(this, { ask: B('Which ocean is the yellow dot in?', '노란 점이 있는 대양은?'), show: worldSvg('', OCEANS[k].at[0]), opts: [k, ...ds].map(o => ({ html: `<span class="word">${L(OCEANS[o].n)}</span>`, ok: o === k })), cls: 'words', after: B(`That is the ${OCEANS[k].n.en}.`, `${OCEANS[k].n.ko}이에요.`), vocab: OCEANS[k].n.en }); }
    else if (kind === 'land') { const t = pick(LAND), ds = others(LAND, t, 2); quiz(this, { ask: B(`Which landform is ${L(t[2])}?`, `${t[2].ko}은 어떤 지형일까요?`), opts: [t, ...ds].map(x => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: x === t })), after: B(`A ${t[1].en} is ${t[2].en}.`, `${t[1].ko}은 ${t[2].ko}이에요.`), vocab: t[1].en }); }
    else { const items = [[B('Northern Georgia has very high, rocky land. What landform is that?', '조지아 북쪽에는 아주 높고 바위가 많은 땅이 있어요. 어떤 지형일까요?'), LAND[0]], [B('In Georgia, land meets the Atlantic Ocean. What landform is that?', '조지아에는 대서양과 맞닿은 땅이 있어요. 어떤 지형일까요?'), LAND[3]]], it = pick(items), ds = others(LAND, it[1], 2); quiz(this, { ask: it[0], opts: [it[1], ...ds].map(x => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: x === it[1] })), after: B('Georgia has mountains and a coast!', '조지아에는 산과 해안이 있어요!') }); }
  }
});

// ---------- goods and services ----------
const GOODS = [['🍞', B('bread', '빵')], ['👟', B('shoes', '신발')], ['🧸', B('a toy', '장난감')], ['📚', B('a book', '책')], ['🍑', B('a peach', '복숭아')], ['🧢', B('a hat', '모자')]];
const SERVICES = [['🩺', B('a doctor checking you', '진찰해 주는 의사')], ['🚌', B('a bus driver', '버스 기사')], ['💇', B('a barber cutting hair', '머리를 잘라 주는 이발사')], ['📮', B('a mail carrier', '우편 배달부')], ['🧑‍🚒', B('a firefighter', '소방관')], ['👩‍🏫', B('a teacher', '선생님')]];
G1T({
  id: 'goodsservices', icon: '🛍️', title: B('Goods and Services', '물건과 서비스'), sub: B('Things people make and jobs people do', '만든 물건과 해 주는 일'), u: 'Economics',
  play() {
    const lv = lvl('goodsservices'), kind = pick(lv === 1 ? ['gs', 'gs', 'gs'] : ['gs', 'gs', 'pc']);
    if (kind === 'gs') { const good = rnd(2) === 0, t = good ? pick(GOODS) : pick(SERVICES); quiz(this, { ask: B('Is this a GOOD (a thing people make or grow) or a SERVICE (work done for others)?', '이것은 물건(만들거나 기른 것)일까요, 서비스(남을 위한 일)일까요?'), askSay: B('Is this a good, a thing people make, or a service, work done for others?', '이것은 물건일까요, 서비스일까요?'), show: `<div class="figbig"><span class="emo">${t[0]}</span><b>${L(t[1])}</b></div>`, opts: [['good', B('a good', '물건')], ['service', B('a service', '서비스')]].map(x => ({ html: `<span class="word">${L(x[1])}</span>`, ok: (x[0] === 'good') === good })), cls: 'words', after: good ? B('A good is a thing people make or grow.', '물건은 사람들이 만들거나 기른 것이에요.') : B('A service is work that one person does for others.', '서비스는 한 사람이 다른 사람을 위해 하는 일이에요.') }); }
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
      [1, B('You put a dollar in a jar for a future purchase. Are you saving or spending?', '나중에 물건을 사려고 저금통에 1달러를 넣어요. 모으는 걸까요, 쓰는 걸까요?'), tx2('Saving', '모으기'), [tx2('Spending', '쓰기')]],
      [1, B('You pay for a pencil at a store. Are you saving or spending?', '가게에서 연필 값을 내요. 모으는 걸까요, 쓰는 걸까요?'), tx2('Spending', '쓰기'), [tx2('Saving', '모으기')]],
      [1, B('There are three children but only two seats. What is limited?', '아이는 세 명인데 자리는 두 개예요. 무엇이 부족할까요?'), tx2('Seats', '자리'), [tx2('Children', '아이'), tx2('Choices of color', '고를 수 있는 색')]],
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
  [B('Peaches are the yummiest fruit.', '복숭아는 가장 맛있는 과일이에요.'), 0], [B('Blue is the prettiest color.', '파랑은 가장 예쁜 색이에요.'), 0], [B('Dogs are better than cats.', '개가 고양이보다 더 좋아요.'), 0], [B('Summer is the best season.', '여름이 가장 좋은 계절이에요.'), 0], [B('Math is the most fun subject.', '수학이 가장 재미있는 과목이에요.'), 0], [B('The park is the nicest place.', '공원이 가장 멋진 곳이에요.'), 0], [B('Pizza is yummy.', '피자는 맛있어요.'), 0], [B('That movie was boring.', '그 영화는 지루했어요.'), 0], [B('Cats are scary.', '고양이는 무서워요.'), 0], [B('A cheetah is the fastest land animal.', '치타는 땅에서 가장 빠른 동물이에요.'), 1], [B('The Pacific is the biggest ocean.', '태평양은 가장 큰 바다예요.'), 1], [B('A whale is bigger than a mouse.', '고래는 쥐보다 커요.'), 1], [B('Summer is hotter than winter in Georgia.', '조지아는 여름이 겨울보다 더워요.'), 1]
];
const CAUSE_EFFECT = [[B('It rained all morning, so the ground got wet.', '아침 내내 비가 와서 땅이 젖었어요.'), B('It rained.', '비가 왔어요.'), B('The ground got wet.', '땅이 젖었어요.')], [B('Sam forgot his coat, so he felt cold.', '샘이 코트를 안 가져가서 추웠어요.'), B('Sam forgot his coat.', '샘이 코트를 안 가져갔어요.'), B('Sam felt cold.', '샘이 추웠어요.')], [B('Mia studied hard, so she did well on the test.', '미아는 열심히 공부해서 시험을 잘 봤어요.'), B('Mia studied hard.', '미아가 열심히 공부했어요.'), B('Mia did well on the test.', '미아가 시험을 잘 봤어요.')], [B('The ice melted because it got hot.', '더워져서 얼음이 녹았어요.'), B('It got hot.', '더워졌어요.'), B('The ice melted.', '얼음이 녹았어요.')]];
G1T({
  id: 'factopinion', icon: '⚖️', title: B('Fact or Opinion?', '사실일까 생각일까'), sub: B('Facts, opinions, causes and effects', '사실, 의견, 원인과 결과'), u: 'Thinking skills',
  play() {
    const lv = lvl('factopinion'), kind = pick(lv === 1 ? ['fo', 'fo', 'fo'] : ['fo', 'fo', 'cause', 'order']);
    if (kind === 'fo') { const s = pick(FACTOP), fact = s[1] === 1; quiz(this, { ask: B('Is this a FACT (can be checked) or an OPINION (what someone thinks)?', '이것은 사실(확인할 수 있는 것)일까요, 의견(누군가의 생각)일까요?'), askSay: B('Is this a fact, or an opinion?', '이것은 사실일까요, 의견일까요?'), show: `<div class="bigword sent">${L(s[0])}</div>`, opts: [['fact', B('Fact', '사실')], ['opinion', B('Opinion', '의견')]].map(x => ({ html: `<span class="word">${L(x[1])}</span>`, ok: (x[0] === 'fact') === fact })), cls: 'words', after: fact ? B('A fact can be checked and proved.', '사실은 확인하고 증명할 수 있어요.') : B('An opinion is what someone thinks or feels.', '의견은 누군가가 생각하거나 느끼는 것이에요.') }); }
    else if (kind === 'cause') { const c = pick(CAUSE_EFFECT), askCause = rnd(2) === 0; quiz(this, { ask: askCause ? B('What is the CAUSE (why it happened)?', '원인(왜 그랬는지)은 무엇일까요?') : B('What is the EFFECT (what happened)?', '결과(무슨 일이 생겼는지)는 무엇일까요?'), show: `<div class="bigword sent">${L(c[0])}</div>`, opts: [askCause ? c[1] : c[2], askCause ? c[2] : c[1]].map((x, i) => ({ html: `<span class="word">${L(x)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('The cause is why. The effect is what happened.', '원인은 이유이고, 결과는 일어난 일이에요.') }); }
    else { const day = [[B('wake up', '일어나요'), '⏰'], [B('eat breakfast', '아침을 먹어요'), '🥣'], [B('go to school', '학교에 가요'), '🏫'], [B('go to bed', '잠을 자요'), '🛏️']], idx = rnd(3), first = rnd(2) === 0, a = day[idx], b = day[idx + 1]; quiz(this, { ask: first ? B('Which happens FIRST?', '먼저 일어나는 일은?') : B('Which happens NEXT?', '그다음에 일어나는 일은?'), show: first ? '' : `<div class="bigword">${L(a[0])} ${a[1]} → ?</div>`, opts: first ? [a, b].map((x, i) => ({ html: `<span class="word">${x[1]} ${L(x[0])}</span>`, ok: i === 0 })) : [b, a].map((x, i) => ({ html: `<span class="word">${x[1]} ${L(x[0])}</span>`, ok: i === 0 })), cls: 'words', after: B('Think about the order of events.', '일이 일어난 순서를 생각해 봐요.') }); }
  }
});

// ---------- patriotism: America and America the Beautiful ----------
const PATRIOT = [
  [B('People can show care for each other.', '사람들은 서로를 아끼는 마음을 보여 줄 수 있어요.'), B('Which action shows brotherhood?', '어떤 행동이 형제애를 보여 줄까요?'), tx2('Helping a neighbor', '이웃 돕기'), [tx2('Teasing a neighbor', '이웃 놀리기'), tx2('Leaving someone out', '누군가를 따돌리기')]],
  [B('Liberty means freedom.', 'liberty는 자유라는 뜻이에요.'), B('What does liberty mean?', 'liberty는 무슨 뜻일까요?'), tx2('Freedom', '자유'), [tx2('A place to borrow books', '책을 빌리는 곳'), tx2('A loud noise', '큰 소리')]],
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

// 63a: apply the evidence to a second situation; avoid broad then/now claims.
(() => {
 const o=a=>a.map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0}));
 const now=[
 [B('a letter carried by a rider','말 탄 사람이 전하는 편지'),B('Which tool lets you talk while walking away from home?','집 밖에서 걸으며 통화하는 도구는?'),[B('a mobile phone','휴대전화'),B('a desktop computer','데스크톱 컴퓨터'),B('a typewriter','타자기')]],
 [B('a candle','촛불'),B('Which light can you switch on without a flame?','불꽃 없이 스위치로 켜는 불빛은?'),[B('an electric lamp','전등'),B('an oil lamp','기름등'),B('a candle lantern','촛불 랜턴')]],
 [B('scrubbing clothes by hand','손으로 빨래하기'),B('Which tool washes clothes in a powered spinning drum?','전기로 통을 돌려 빨래하는 도구는?'),[B('a washing machine','세탁기'),B('a washboard','빨래판'),B('a washing tub','빨래통')]]
 ];
 GAMES.find(g=>g.id==='thennow').play=function(){const q=pick(now),lv=lvl(this.id);quiz(this,{ask:q[1],show:lv===2?`<div class="storytext">${L(B('Long ago: ','옛날의 방법: '))}${L(q[0])}</div>`:'',opts:o(q[2]),cls:'words'});};
 const examples={fairness:[B('Share turns equally','차례를 똑같이 나눠요'),B('Keep trying after a mistake','틀려도 다시 해 봐요'),B('Speak up even when afraid','무서워도 나서서 말해요')],respect:[B('Listen without interrupting','말을 끊지 않고 들어요'),B('Keep practicing a song','노래를 계속 연습해요'),B('Divide snacks equally','간식을 똑같이 나눠요')],courage:[B('Tell the truth even when afraid','무서워도 사실을 말해요'),B('Wait for a friend to finish speaking','친구 말이 끝나길 기다려요'),B('Divide turns equally','차례를 똑같이 나눠요')],perseverance:[B('Try again after a mistake','틀려도 다시 해 봐요'),B('Divide snacks equally','간식을 똑같이 나눠요'),B('Welcome a new classmate','새 반 친구를 반겨요')],kindness:[B('Help carry dropped books','떨어진 책을 주워 줘요'),B('Practice after a mistake','틀린 뒤 다시 연습해요'),B('Speak up even when afraid','무서워도 나서서 말해요')],tolerance:[B('Play with a child who uses another language','다른 말을 쓰는 아이와 놀아요'),B('Practice after a mistake','틀린 뒤 다시 연습해요'),B('Divide snacks equally','간식을 똑같이 나눠요')]};
 const ch=GAMES.find(g=>g.id==='character1'),old=ch.play;ch.play=function(){if(lvl(this.id)===1)return old.call(this);const s=pick(SCEN);quiz(this,{ask:B('Which action shows the same trait?','같은 마음을 보여 주는 행동은?'),show:`<div class="storytext">${L(s[0])}</div>`,opts:o(examples[s[1]]),cls:'words'});};
 const patriot=[
 [B('What does liberty mean?','liberty는 무슨 뜻일까요?'),[B('Freedom','자유'),B('Fairness','공정'),B('Duty','의무')]],
 [B('Which action shows care for a neighbor?','이웃을 아끼는 행동은?'),[B('Help carry their bags','이웃의 짐을 들어 줘요'),B('Ask them to carry my bags','내 짐을 들어 달라고 해요'),B('Leave their bags by the door','이웃의 짐을 문 옆에 둬요')]],
 [B('In America, sing: sweet land of ___.','America 노래: sweet land of ___'),[B('liberty','liberty'),B('unity','unity'),B('bravery','bravery')]]
 ];
 GAMES.find(g=>g.id==='patriot').play=function(){const q=pick(patriot);quiz(this,{ask:q[0],opts:o(q[1]),cls:'words'});};
})();

// 63a: L2 compares sourced achievements and their order, rather than adding a name.
(() => {
 const choices=a=>a.map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0}));
 const figures=GAMES.find(g=>g.id==='figures1'),old=figures.play;
 figures.play=function(){if(lvl(this.id)===1)return old.call(this);
 const a=pick(FIGURE1_FACTS),b=pick(FIGURE1_FACTS.filter(x=>x!==a)),c=pick(FIGURE1_FACTS.filter(x=>x!==a&&x!==b));
 const name=x=>FIGS.find(f=>f.id===x.id).n,pair=(x,y)=>B(`${name(x).en} → ${name(y).en}`,`${name(x).ko} → ${name(y).ko}`);
 quiz(this,{ask:B('Which pair matches these deeds in order?','차례로 두 일을 한 인물의 짝은?'),show:`<div class="storytext">1: ${L(a.deed)}<br>2: ${L(b.deed)}</div>`,askExtra:{t:`${L(a.deed)}. ${L(b.deed)}`},opts:choices([pair(a,b),pair(b,a),pair(a,c)]),cls:'words sents'});
 };
 const place=GAMES.find(g=>g.id==='placetime'),prior=place.play;
 const bank=[
 [B('Franklin lived in the 1700s; Bridges entered school in 1960.','프랭클린은 1700년대에 살았고 브리지스는 1960년에 입학했어요.'),B('Who lived earlier?','누가 더 먼저 살았을까요?'),[B('Benjamin Franklin','벤저민 프랭클린'),B('Ruby Bridges','루비 브리지스'),B('They lived at the same time','같은 때에 살았어요')]],
 [B('Lewis and Clark reached the Pacific in 1805; Bridges entered school in 1960.','탐험대는 1805년에 태평양에 닿았고 브리지스는 1960년에 입학했어요.'),B('Which event came first?','어떤 일이 더 먼저 일어났을까요?'),[B('The expedition reached the ocean','탐험대가 바다에 닿았어요'),B('Bridges entered school','브리지스가 입학했어요'),B('Both happened in the same year','같은 해에 일어났어요')]]
 ];
 place.play=function(){if(lvl(this.id)===1)return prior.call(this);const q=pick(bank);quiz(this,{ask:q[1],show:`<div class="storytext">${L(q[0])}</div>`,askExtra:{t:L(q[0])},opts:choices(q[2]),cls:'words sents'});};
 const patriot=GAMES.find(g=>g.id==='patriot'),pold=patriot.play;
 patriot.play=function(){if(lvl(this.id)===1)return pold.call(this);const qs=[
 [B('A child may choose a game; every child gets a turn.','아이가 놀이를 고르고 모두 차례를 가져요.'),[B('Freedom + fairness','자유 + 공정'),B('Freedom + pride','자유 + 자랑스러움'),B('Pride + duty','자랑스러움 + 의무')]],
 [B('A child helps a neighbor, then smiles at the flag of home.','아이가 이웃을 돕고 자기 나라 국기를 보며 뿌듯해해요.'),[B('Care + pride','배려 + 자랑스러움'),B('Freedom + duty','자유 + 의무'),B('Fairness + freedom','공정 + 자유')]]];const q=pick(qs);quiz(this,{ask:B('Which pair of ideas fits in order?','차례로 맞는 마음의 짝은?'),show:`<div class="storytext">${L(q[0])}</div>`,askExtra:{t:L(q[0])},opts:choices(q[1]),cls:'words'});};
})();

// 65: reason about the functions of the existing artifacts, without claiming everyone used them.
(() => {
 const game=GAMES.find(g=>g.id==='thennow');
 const purposes=[B('light','불빛'),B('travel','이동'),B('writing','글쓰기'),B('messages','소식 전하기'),B('cooking','요리'),B('food storage','음식 보관'),B('washing','빨래')];
 const tools=[[B('candle','촛불'),B('electric lamp','전등')],[B('horse and wagon','말과 마차'),B('motor car','자동차')],[B('feather pen','깃털 펜'),B('computer','컴퓨터')],[B('carried letter','배달 편지'),B('mobile phone','휴대전화')],[B('hearth fire','벽난로 불'),B('cooking stove','조리용 스토브')],[B('cool cellar','찬 지하 저장실'),B('refrigerator','냉장고')],[B('wash tub','빨래통'),B('washing machine','세탁기')]];
 game.play=function(){const t=pick(THEN),side=1+rnd(2),other=side===1?2:1,two=lvl(this.id)===2,index=THEN.indexOf(t);
 const purposeWrong=[[1,6],[2,6],[5,6],[5,6],[1,2],[1,2],[1,2]][index],toolWrong=[[5,6],[5,6],[5,6],[5,6],[2,5],[1,2],[2,5]][index];
 const right=two?tools[index][other-1]:purposes[index],wrong=(two?toolWrong:purposeWrong).map(i=>two?tools[i][other-1]:purposes[i]);
 quiz(this,{ask:two?B('Which tool can do the same job?','같은 일을 할 수 있는 도구는?'):B('Which job can this tool do?','이 도구로 어떤 일을 할까요?'),show:`<div class="storytext">${t[side][0]} ${L(tools[index][side-1])}</div>`,askExtra:{t:L(tools[index][side-1])},opts:tOpts(right,wrong),cls:'words'});};
 const place=GAMES.find(g=>g.id==='placetime'),prior=place.play;
 // New dates checked against National Archives and NPS; see banks2.md.
 const dates=[
 [1752,B('Franklin carries out the kite experiment','프랭클린이 연 실험을 함')],
 [1776,B('Jefferson drafts the Declaration','제퍼슨이 독립선언서 초안을 씀')],
 [1805,B('The expedition reaches the Pacific','탐험대가 태평양에 도착함')],
 [1896,B('Carver arrives at Tuskegee','카버가 터스키기에 옴')],
 [1901,B('Roosevelt becomes President','루스벨트가 대통령이 됨')],
 [1960,B('Bridges enters William Frantz School','브리지스가 윌리엄 프랜츠 학교에 입학함')]
 ];
 place.play=function(){if(lvl(this.id)===1&&rnd(2))return prior.call(this);const two=lvl(this.id)===2,chosen=shuffle(dates).slice(0,3),sorted=[...chosen].sort((a,b)=>a[0]-b[0]),last=rnd(2)===0,right=two?sorted[1]:sorted[last?2:0];
 quiz(this,{ask:two?B('Which event is between the other two in time?','시간 순서에서 다른 두 일 사이에 일어난 일은?'):last?B('Which event came later?','더 나중에 일어난 일은?'):B('Which event came earlier?','더 먼저 일어난 일은?'),show:`<div class="storytext" style="font-size:clamp(16px,2.8dvh,21px)">${chosen.map(x=>`${x[0]}: ${L(x[1])}`).join('<br>')}</div>`,opts:tOpts(right[1],chosen.filter(x=>x!==right).map(x=>x[1])),cls:'words sents'});};
})();

// 65: explicit fictional budgets; no personal financial data.
(() => {
 const g=GAMES.find(g=>g.id==='savespend'),old=g.play;
 const easy=[
 [B('You buy a bus ticket with your money. What are you doing?','내 돈으로 버스표를 사요. 무엇을 하나요?'),B('Spending','쓰기')],
 [B('You keep birthday money for a future book. What are you doing?','나중에 책을 사려고 생일에 받은 돈을 보관해요. 무엇을 하나요?'),B('Saving','모으기')],
 [B('You pay for bread at a store. What are you doing?','가게에서 빵 값을 내요. 무엇을 하나요?'),B('Spending','쓰기')],
 [B('You put weekly earnings aside for a bicycle. What are you doing?','자전거를 사려고 매주 번 돈을 따로 둬요. 무엇을 하나요?'),B('Saving','모으기')]
 ];
 g.play=function(){if(lvl(this.id)===1){if(rnd(2))return old.call(this);const q=pick(easy);quiz(this,{ask:q[0],opts:tOpts(q[1],[q[1].en==='Saving'?B('Spending','쓰기'):B('Saving','모으기'),B('Giving it away','남에게 주기')]),cls:'words'});return;}
 const price=5+rnd(6),saved=1+rnd(price-1),earned=1+rnd(3),spent=1+rnd(Math.min(saved+earned,3)),left=saved+earned-spent,need=Math.max(0,price-left);
 const text=B(`Book goal: $${price}. Saved: $${saved}. Earn $${earned}, then spend $${spent}.`,`책 목표: ${price}달러. 모은 돈: ${saved}달러. ${earned}달러를 번 뒤 ${spent}달러를 써요.`);
 quiz(this,{ask:B('How many more dollars must be saved for the goal?','목표를 위해 몇 달러를 더 모아야 할까요?'),askExtra:{t:L(text)},show:`<div class="storytext">${L(text)}</div>`,opts:numO(need,[need+1,price,Math.max(0,price-saved)],0,12),after:B(`$${left} left; $${need} more needed.`,`${left}달러가 남아서 ${need}달러가 더 필요해요.`)});};
})();

// 65: one link in the displayed containment model; no saved home address.
(() => {
 const g=GAMES.find(g=>g.id==='whereilive'),old=g.play;
 g.play=function(){if(lvl(this.id)===2||rnd(2))return old.call(this);const i=rnd(4),right=NEST[i+1][0];
 quiz(this,{ask:B(`In this chart, which type of place directly contains the ${NEST[i][0].en}?`,`이 그림에서 ${NEST[i][0].ko} 바로 바깥의 장소 종류는?`),show:`<div class="storytext">${NEST.map(x=>L(x[0])).join(' → ')}</div>`,opts:tOpts(right,NEST.filter((_,j)=>j!==i+1&&j!==i).slice(0,2).map(x=>x[0])),cls:'words'});};
})();
