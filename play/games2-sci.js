'use strict';
// Grade 2 science (Georgia Science GSE, 2016): S2E1 star size and brightness; S2E2 Sun/Moon, shadows and day/night; S2E3 environmental changes; S2P1 matter and its changes;
// S2P2 push, pull and motion; S2L1 life cycles, pollination and seed travel.
const AREA2S = (u) => B(`Grade 2 Science · ${u}`, `2학년 과학 · ${U_KO[u] || u}`);
const G2S = (g) => registerGame(Object.assign({ grade: '2', subject: 'sci' }, g, { area: AREA2S(g.u) }));
// one right answer and some wrong ones, all text; wrongs that equal the right answer are dropped
const wOpts = (right, wrongs) => [right, ...wrongs.filter(w => w.en !== right.en)].map((w, i) => ({ html: `<span class="word">${L(w)}</span>`, ok: i === 0 }));

// ---------- 1. Moon phases ----------
const moonSvg = (ph) => {                       // ph: 0 new, 1 crescent, 2 first quarter, 3 gibbous, 4 full (lit side on the right)
  const lit = ph === 0 ? '' : ph === 4 ? '<circle cx="50" cy="50" r="40" fill="#fff6c2"/>'
    : `<path d="M50 10 A40 40 0 0 1 50 90 ${ph === 2 ? 'L50 10' : `A${ph === 1 ? 24 : 24} 40 0 0 ${ph === 1 ? 0 : 1} 50 10`} Z" fill="#fff6c2"/>`;
  return `<svg viewBox="0 0 100 100" class="moonsvg"><rect width="100" height="100" rx="10" fill="#1b2a49"/><circle cx="50" cy="50" r="40" fill="#34415f"/>${lit}<circle cx="50" cy="50" r="40" fill="none" stroke="#8aa0c8" stroke-width="1.5"/></svg>`;
};
const MOON_NAME = [B('new moon', '신월(보이지 않는 달)'), B('crescent moon', '초승달 모양'), B('half moon (quarter)', '반달'), B('gibbous moon', '보름달에 가까운 볼록한 달'), B('full moon', '보름달')];
G2S({
  id: 'moon2', icon: '🌙', title: B('Moon Shapes', '달의 모양'), sub: B('Moon phases and where moonlight comes from', '달의 모양과 달빛'), u: 'Sun, Moon and Stars',
  play() {
    const lv = lvl('moon2'), kind = pick(lv === 1 ? ['name', 'name', 'light'] : ['name', 'name', 'light', 'cycle']);
    if (rnd(3) === 0) {
      const ph = pick([0,2,4]);
      quiz(this, { ask: B(`Which picture shows a ${MOON_NAME[ph].en}?`, `${MOON_NAME[ph].ko}에 알맞은 그림은 무엇일까요?`), opts: [0,2,4].map(p => ({ html: moonSvg(p), ok: p === ph })), cls: 'shapes', after: B('We see different amounts of the sunlit part of the Moon.', '햇빛을 받는 달의 부분이 보이는 정도가 달라요.') }); return;
    }
    if (kind === 'name') {
      const ph = pick(lv === 1 ? [0, 2, 4] : [0, 1, 2, 3, 4]);
      quiz(this, { ask: B('What shape of the Moon do you see?', '이 달은 어떤 모양일까요?'), show: moonSvg(ph), opts: wOpts(MOON_NAME[ph], others(MOON_NAME.filter((_, i) => lv === 2 || [0, 2, 4].includes(i)), MOON_NAME[ph], 2)), cls: 'words', after: B('The Sun always lights half of the Moon. From Earth we see more or less of that lit half.', '해는 늘 달의 반쪽을 비춰요. 지구에서는 그 밝은 쪽이 더 보이거나 덜 보여요.') });
    } else if (kind === 'light') {
      const q = pick([[B('Where does moonlight come from?', '달빛은 어디에서 올까요?'), B('The Moon reflects light from the Sun.', '달이 햇빛을 반사해요.'), [B('The Moon makes its own light.', '달이 스스로 빛을 내요.'), B('The Moon is a star.', '달은 별이에요.')]],
        [B('Why does the Moon look different shapes?', '달은 왜 모양이 달라 보일까요?'), B('We see more or less of its lit side.', '해가 비추는 쪽이 보이는 정도가 달라요.'), [B('The Moon gets bigger and smaller.', '달이 커졌다 작아졌다 해요.'), B('Clouds eat the Moon.', '구름이 달을 먹어요.')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words sents', after: q[1] });
    } else {
      const order = [0, 1, 2, 3, 4], i = pick([0, 1, 2, 3]), ask = B(`The Moon goes from new moon to full moon. Which shape comes after the ${MOON_NAME[order[i]].en}?`, `달은 신월에서 보름달로 변해요. ${MOON_NAME[order[i]].ko} 다음 모양은?`);
      const right = order[i + 1], wr = others([0, 1, 2, 3, 4], right, 4).filter(x => x !== order[i]).slice(0, 2);
      quiz(this, { ask, opts: [right, ...wr].map((p, k) => ({ html: moonSvg(p), label: MOON_NAME[p], ok: k === 0 })), after: B('The Moon changes shape in a pattern that repeats about every month.', '달 모양은 한 달쯤마다 되풀이되는 규칙으로 바뀌어요.') });
    }
  }
});

// ---------- 2. Sun, shadows and stars ----------
const skyShadowSvg = (h) => {                      // h: sun height 1 low .. 3 high; shadow length is long when the sun is low
  const sx = [36, 60, 80][h - 1], sy = [58, 28, 12][h - 1], len = [58, 26, 8][h - 1];
  return `<svg viewBox="0 0 160 110" class="skysvg"><rect width="160" height="110" fill="#d7efff"/><rect y="86" width="160" height="24" fill="#8bc34a"/><circle cx="${sx}" cy="${sy}" r="9" fill="#ffd166"/><rect x="${sx + 30}" y="46" width="6" height="40" fill="#6b4e2a"/><circle cx="${sx + 33}" cy="40" r="14" fill="#4caf50"/><polygon points="${sx + 33},86 ${sx + 33 + len + 6},86 ${sx + 33 + len},92 ${sx + 33 - 3},92" fill="#3d5a2a" opacity=".55"/></svg>`;
};
G2S({
  id: 'sky2', icon: '☀️', title: B('Sun and Stars', '해와 별'), sub: B('Shadows, sunrise, sunset and stars', '그림자, 해 뜨고 해 지는 모습, 별'), u: 'Sun, Moon and Stars',
  play() {
    const lv = lvl('sky2'), kind = pick(lv === 1 ? ['sunstar', 'rise', 'shadow', 'night'] : ['sunstar', 'rise', 'shadow', 'shadow', 'night', 'const']);
    if (rnd(3) === 0) {
      const q = pick([
        [B('Which star is closest to Earth?', '지구에서 가장 가까운 별은 무엇일까요?'), B('The Sun', '해'), [B('The Moon', '달'), B('Mars', '화성')]],
        [B('The Sun is high in the sky. Is a tree shadow shorter or longer than when the Sun is low?', '해가 높이 떠 있어요. 낮게 떠 있을 때보다 나무 그림자가 짧을까요, 길까요?'), B('Shorter', '짧아요'), [B('Longer', '길어요')]]
      ]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words sents', after: q[1] }); return;
    }
    if (kind === 'sunstar') {
      quiz(this, { ask: B('What is the Sun?', '해는 무엇일까요?'), opts: wOpts(B('A star', '별'), [B('A planet', '행성'), B('A moon', '위성(달)')]), cls: 'words', after: B('The Sun is a star. It looks big and bright because it is the closest star to Earth.', '해는 별이에요. 지구에서 가장 가까운 별이라서 크고 밝게 보여요.') });
    } else if (kind === 'rise') {
      const q = pick([[B('In which direction does the Sun rise in the morning?', '아침에 해는 어느 쪽에서 뜰까요?'), B('East', '동쪽'), [B('West', '서쪽'), B('South', '남쪽')]],
        [B('In which direction does the Sun set in the evening?', '저녁에 해는 어느 쪽으로 질까요?'), B('West', '서쪽'), [B('East', '동쪽'), B('North', '북쪽')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words', after: B('The Sun seems to rise in the east and set in the west because Earth spins.', '지구가 돌기 때문에 해는 동쪽에서 뜨고 서쪽으로 지는 것처럼 보여요.') });
    } else if (kind === 'shadow') {
      const h = pick([1, 2, 3]), longest = pick([true, false]);
      if (lv === 1 || longest) {
        quiz(this, { ask: B('The Sun is low in the sky. How is the shadow?', '해가 낮게 떠 있어요. 그림자는 어떨까요?'), show: skyShadowSvg(1), opts: wOpts(B('Long', '길어요'), [B('Short', '짧아요')]), cls: 'words', after: B('When the Sun is low (morning and evening), shadows are long.', '해가 낮을 때(아침, 저녁)는 그림자가 길어요.') });
      } else {
        const ho = shuffle([1, 2, 3]);
        quiz(this, { ask: B('Which picture shows the SHORTEST shadow? (Midday, when the Sun is highest)', '어느 그림의 그림자가 가장 짧을까요? (해가 가장 높이 뜬 한낮)'), opts: ho.map(x => ({ html: skyShadowSvg(x), label: B(`Sun height ${x}`, `해 높이 ${x}`), ok: x === 3 })), after: B('The higher the Sun, the shorter the shadow.', '해가 높을수록 그림자는 짧아요.') });
      }
    } else if (kind === 'night') {
      const q = pick([[B('When can we see most stars in the sky?', '별은 언제 가장 잘 보일까요?'), B('At night, when the sky is dark', '하늘이 어두운 밤'), [B('At noon', '한낮'), B('In the morning sunshine', '아침 햇살 속')]],
        [B('Stars are in the sky during the day too. Why can we not see them?', '낮에도 별은 하늘에 있어요. 왜 안 보일까요?'), B('Sunlight is too bright.', '햇빛이 너무 밝아서요.'), [B('The stars go away.', '별이 사라져서요.'), B('Clouds always cover them.', '구름이 늘 가려서요.')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words sents', after: q[1] });
    } else {
      const q = pick([[B('What is a constellation?', '별자리란 무엇일까요?'), B('A pattern of stars that people gave a name', '사람들이 이름을 붙인 별의 무늬'), [B('A very big planet', '아주 큰 행성'), B('A kind of moon', '달의 한 종류')]],
        [B('Which one is a pattern of stars?', '별의 무늬는 어느 것일까요?'), B('The Big Dipper', '북두칠성(큰 국자 모양)'), [B('The Sun', '해'), B('A cloud', '구름')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words sents', after: q[1] });
    }
  }
});

// ---------- 3. Fast and slow changes to land ----------
const EARTH_CH = [
  { e: '🌋', n: B('a volcano erupts', '화산이 터져요'), fast: true }, { e: '🏚️', n: B('an earthquake shakes the ground', '지진이 땅을 흔들어요'), fast: true },
  { e: '🌊', n: B('a flood covers the land', '홍수가 땅을 덮어요'), fast: true }, { e: '⛰️', n: B('a landslide slides down a hill', '산사태가 비탈을 쓸어내려요'), fast: true },
  { e: '🏞️', n: B('a river carves a canyon over many years', '강이 오랜 세월 협곡을 깎아요'), fast: false }, { e: '🪨', n: B('wind and rain wear down a rock over many years', '여러 해 동안 바람과 비가 바위를 닳게 해요'), fast: false },
  { e: '🧊', n: B('a glacier reshapes land over hundreds of years', '수백 년 동안 빙하가 땅 위를 밀고 가요'), fast: false }, { e: '🏖️', n: B('ocean waves reshape a beach over many years', '여러 해 동안 바닷물결이 해변을 깎아요'), fast: false }
];
G2S({
  id: 'earthchange2', icon: '🌋', title: B('Changing Land', '변하는 땅'), sub: B('Fast changes and slow changes', '빠른 변화와 느린 변화'), u: 'Earth Changes',
  play() {
    const lv = lvl('earthchange2'), kind = pick(lv === 1 ? ['speed'] : ['speed', 'speed', 'agent']);
    if (kind === 'speed') {
      const c = pick(EARTH_CH);
      quiz(this, { ask: B(`Does this change land FAST or SLOWLY? ${c.n.en}`, `땅이 이렇게 변하는 것은 빠를까요, 느릴까요? ${c.n.ko}`), show: `<span class="emo">${c.e}</span>`, opts: [{ html: `<span class="word">${S.lang === 'ko' ? '빠르게' : 'Fast'}</span>`, ok: c.fast }, { html: `<span class="word">${S.lang === 'ko' ? '아주 천천히' : 'Slowly'}</span>`, ok: !c.fast }], cls: 'words', after: c.fast ? B('Volcanoes, earthquakes, floods and landslides change land fast.', '화산, 지진, 홍수, 산사태는 땅을 빠르게 바꿔요.') : B('Wind, water and ice change land slowly, over many years.', '바람, 물, 얼음은 오랜 세월에 걸쳐 땅을 천천히 바꿔요.') });
    } else {
      const q = pick([[B('What can slowly wear down rocks over a long time?', '오랜 시간에 걸쳐 바위를 천천히 닳게 하는 것은?'), B('Wind and water', '바람과 물'), [B('A sneeze', '재채기'), B('A shadow', '그림자')]],
        [B('Which one can change the land FAST?', '땅을 빠르게 바꿀 수 있는 것은?'), B('A flood', '홍수'), [B('A small stream over many years', '오랜 세월 흐르는 작은 시냇물'), B('A little wind each day', '매일 부는 약한 바람')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words sents', after: q[1] });
    }
  }
});

// ---------- 4. Solids, liquids and gases ----------
const MATTER = [
  { e: '🪨', n: B('a rock', '돌'), s: 0 }, { e: '🧊', n: B('an ice cube', '얼음'), s: 0 }, { e: '📕', n: B('a book', '책'), s: 0 }, { e: '🧱', n: B('a brick', '벽돌'), s: 0 },
  { e: '🥛', n: B('milk', '우유'), s: 1 }, { e: '💧', n: B('water', '물'), s: 1 }, { e: '🧃', n: B('juice', '주스'), s: 1 }, { e: '🍯', n: B('honey', '꿀'), s: 1 },
  { e: '🎈', n: B('the helium in a balloon', '풍선 속 헬륨'), s: 2 }, { e: '♨️', n: B('steam (water vapor)', '수증기'), s: 2 }, { e: '💨', n: B('the air you blow out', '내가 내쉬는 공기'), s: 2 }
];
const STATE = [B('solid', '고체'), B('liquid', '액체'), B('gas', '기체')];
G2S({
  id: 'matter2', icon: '🧊', title: B('Solid, Liquid or Gas?', '고체, 액체, 기체'), sub: B('Sort matter by how it behaves', '물질의 성질에 따라 나누어요'), u: 'Matter',
  play() {
    const lv = lvl('matter2'), kind = pick(lv === 1 ? ['sort'] : ['sort', 'sort', 'prop']);
    if (kind === 'sort') {
      const m = pick(lv === 1 ? MATTER.filter(x => x.s < 2 || x.n.en.includes('steam')) : MATTER);
      quiz(this, { ask: B(`Is ${m.n.en} a solid, a liquid or a gas?`, `${m.n.ko}: 고체, 액체, 기체 중 무엇일까요?`), show: `<span class="emo">${m.e}</span>`, opts: STATE.map((s, i) => ({ html: `<span class="word">${L(s)}</span>`, ok: i === m.s })), cls: 'words', after: B('Solids keep their shape. Liquids flow and take the shape of the container. Gases spread out to fill the container.', '고체는 모양이 그대로예요. 액체는 흘러서 그릇 모양이 돼요. 기체는 퍼져서 그릇을 가득 채워요.') });
    } else {
      const q = pick([[B('Which kind of matter keeps its own shape?', '모양을 그대로 유지하는 물질은 무엇일까요?'), STATE[0], [STATE[1], STATE[2]]],
        [B('Which kind of matter pours and settles at the bottom of its container, taking its shape?', '부으면 흘러서 그릇 아래쪽에 고이고 그릇 모양이 되는 물질은?'), STATE[1], [STATE[0], STATE[2]]],
        [B('Which kind of matter spreads out to fill its whole container?', '퍼져서 그릇 전체를 가득 채우는 물질은?'), STATE[2], [STATE[0], STATE[1]]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words', after: B(`${q[1].en[0].toUpperCase() + q[1].en.slice(1)} fits that description.`, `${q[1].ko}가 알맞아요.`) });
    }
  }
});

// ---------- 5. Heating, cooling and properties ----------
const MPROP = [
  { q: B('Which one is flexible (it bends easily)?', '쉽게 휘어지는 것은?'), r: [B('a rubber band', '고무줄')], w: [B('a rock', '돌'), B('a glass cup', '유리컵'), B('a brick', '벽돌')] },
  { q: B('Which one is waterproof, so it is good for a raincoat?', '물이 스며들지 않아 비옷에 알맞은 것은?'), r: [B('plastic', '비닐(플라스틱)')], w: [B('paper', '종이'), B('a sponge', '스펀지'), B('a cotton ball', '솜')] },
  { q: B('Which one will a magnet pick up?', '자석에 붙는 것은?'), r: [B('an iron nail', '쇠못')], w: [B('a wooden spoon', '나무 숟가락'), B('a plastic cup', '플라스틱 컵'), B('a paper clip made of plastic', '플라스틱 클립')] },
  { q: B('Which one is transparent (you can see through it)?', '속이 훤히 보이는 것은?'), r: [B('a clear window', '투명한 유리창')], w: [B('a wooden door', '나무 문'), B('a brick wall', '벽돌 벽'), B('a metal pot', '금속 냄비')] },
  { q: B('Which one is soft?', '부드러운 것은?'), r: [B('a pillow', '베개')], w: [B('a rock', '돌'), B('a metal spoon', '금속 숟가락'), B('a brick', '벽돌')] },
  { q: B('Which one will float on water?', '물에 뜨는 것은?'), r: [B('a wooden block', '나무 블록')], w: [B('a rock', '돌'), B('a coin', '동전'), B('a metal key', '금속 열쇠')] }
];
G2S({
  id: 'matterchange2', icon: '🔥', title: B('Heat, Cool and Change', '열과 변화'), sub: B('Melting, freezing, cooking and material properties', '녹기, 얼기, 요리, 물질의 성질'), u: 'Matter',
  play() {
    const lv = lvl('matterchange2'), kind = pick(lv === 1 ? ['melt', 'prop', 'melt'] : ['melt', 'prop', 'rev', 'rev', 'evap']);
    if (kind === 'melt') {
      const q = pick([[B('What makes an ice cube melt into water?', '얼음이 녹아 물이 되게 하는 것은?'), B('Heating it (making it warmer)', '따뜻하게 하기(열을 주기)'), [B('Cooling it more', '더 차갑게 하기'), B('Nothing changes it', '아무것도 바꾸지 못해요')], B('Heat melts a solid into a liquid.', '열을 주면 고체가 녹아 액체가 돼요.')],
        [B('What makes water freeze into ice?', '물이 얼어 얼음이 되게 하는 것은?'), B('Cooling it (taking heat away)', '차갑게 하기(열을 빼앗기)'), [B('Heating it', '뜨겁게 하기'), B('Stirring it a little', '조금 젓기')], B('Cooling turns a liquid into a solid.', '차갑게 하면 액체가 고체로 변해요.')]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words sents', after: q[3] });
    } else if (kind === 'evap') {
      const q = pick([[B('A puddle slowly disappears on a sunny day. What happened to the water?', '맑은 날 웅덩이가 서서히 사라져요. 물은 어떻게 됐을까요?'), B('It evaporated into water vapor (a gas) in the air.', '증발해서 공기 속 수증기(기체)가 됐어요.'), [B('It turned into a rock.', '돌이 됐어요.'), B('It was destroyed.', '완전히 없어졌어요.')]],
        [B('Water drops form on the outside of a cold glass. Where did they come from?', '찬 컵 바깥에 물방울이 맺혀요. 어디에서 왔을까요?'), B('Water vapor in the air cooled and became liquid.', '공기 속 수증기가 차가워져 액체가 됐어요.'), [B('The water leaked through the glass.', '물이 유리를 통과해 샜어요.'), B('The glass made the water.', '컵이 물을 만들었어요.')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words sents', after: q[1] });
    } else if (kind === 'rev') {
      const it = pick([[B('melting an ice cube', '얼음 녹이기'), true], [B('freezing water to make ice', '물을 얼려 얼음 만들기'), true], [B('baking a cake', '케이크 굽기'), false], [B('burning a piece of wood', '나무 태우기'), false], [B('frying an egg', '달걀 프라이 하기'), false], [B('melting butter', '버터 녹이기'), true]]);
      quiz(this, { ask: B(`Can you change it back to how it was? ${it[0].en}`, `원래대로 되돌릴 수 있을까요? ${it[0].ko}`), opts: [{ html: `<span class="word">${S.lang === 'ko' ? '네, 되돌릴 수 있어요' : 'Yes, it can change back'}</span>`, ok: it[1] }, { html: `<span class="word">${S.lang === 'ko' ? '아니요, 되돌릴 수 없어요' : 'No, it cannot change back'}</span>`, ok: !it[1] }], cls: 'words sents', after: it[1] ? B('Melting and freezing can be undone by heating or cooling.', '녹기와 얼기는 열을 주거나 빼앗으면 되돌릴 수 있어요.') : B('Cooking and burning make new materials. They cannot be undone.', '굽거나 태우면 새로운 물질이 생겨서 원래대로 되돌릴 수 없어요.') });
    } else {
      const p = pick(MPROP), r = p.r[0];
      quiz(this, { ask: p.q, opts: wOpts(r, shuffle(p.w).slice(0, 2)), cls: 'words', after: B(`${r.en[0].toUpperCase() + r.en.slice(1)} is the one.`, `정답: ${r.ko}`) });
    }
  }
});

// ---------- 6. Push, pull and motion ----------
G2S({
  id: 'force2', icon: '🛷', title: B('Push, Pull and Motion', '밀기, 당기기, 움직임'), sub: B('Forces change how things move', '힘이 움직임을 바꿔요'), u: 'Forces and Motion',
  play() {
    const lv = lvl('force2'), kind = pick(lv === 1 ? ['pp', 'pp', 'harder'] : ['pp', 'harder', 'fric', 'fric', 'dir']);
    if (kind === 'pp') {
      const a = pick([['🚪', B('opening a door by its handle toward you', '손잡이를 잡고 문을 내 쪽으로 열기'), true], ['⚽', B('kicking a soccer ball', '축구공 차기'), false], ['🛒', B('moving a shopping cart forward', '장바구니 수레를 앞으로 밀기'), false], ['🪢', B('tug-of-war with a rope', '줄다리기'), true], ['🧲', B('a magnet moving a paper clip toward it', '자석이 클립을 끌어당기기'), true], ['🛴', B('starting a scooter with your foot on the ground', '발로 땅을 밀어 킥보드 출발하기'), false]]);
      quiz(this, { ask: B(`Is it a push or a pull? ${a[1].en}`, `밀기일까요, 당기기일까요? ${a[1].ko}`), show: `<span class="emo">${a[0]}</span>`, opts: [{ html: `<span class="word">${S.lang === 'ko' ? '미는 힘' : 'Push'}</span>`, ok: !a[2] }, { html: `<span class="word">${S.lang === 'ko' ? '당기는 힘' : 'Pull'}</span>`, ok: a[2] }], cls: 'words', after: B('A push moves something away from you. A pull moves something toward you.', '미는 힘은 물체를 나에게서 멀어지게 하고, 당기는 힘은 나에게 가까워지게 해요.') });
    } else if (kind === 'harder') {
      const q = pick([[B('You push a toy car harder. What happens?', '장난감 자동차를 더 세게 밀면 어떻게 될까요?'), B('It goes faster and farther.', '더 빠르고 더 멀리 가요.'), [B('It goes slower.', '더 느리게 가요.'), B('It does not move.', '움직이지 않아요.')]],
        [B('Which push makes a ball go the farthest?', '공이 가장 멀리 가려면 어떻게 밀어야 할까요?'), B('A strong push', '센 힘으로 밀기'), [B('A gentle push', '살살 밀기'), B('No push', '밀지 않기')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words sents', after: B('A bigger force changes motion more.', '힘이 클수록 움직임이 더 많이 바뀌어요.') });
    } else if (kind === 'fric') {
      const q = pick([[B('A toy car rolls across the floor. On which surface does it slow down fastest?', '장난감 자동차가 바닥을 굴러가요. 어느 바닥에서 가장 빨리 느려질까요?'), B('A thick, rough carpet', '두껍고 거친 카펫'), [B('Smooth ice', '매끄러운 얼음'), B('A smooth wood floor', '매끄러운 나무 바닥')]],
        [B('Which surface lets a sled slide the farthest?', '어느 바닥에서 썰매가 가장 멀리 미끄러질까요?'), B('Smooth, slippery ice', '매끄럽고 미끄러운 얼음'), [B('Rough sand', '거친 모래'), B('Thick grass', '풀이 빽빽한 풀밭')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words', after: B('Rough surfaces rub more (friction), so things slow down faster.', '거친 바닥은 마찰(서로 문지르는 힘)이 커서 물체가 더 빨리 느려져요.') });
    } else {
      const q = pick([[B('Which one changes the DIRECTION of a moving ball?', '굴러가는 공의 방향을 바꾸는 것은?'), B('Hitting it from the side', '옆에서 치기'), [B('Looking at it', '쳐다보기'), B('Waiting', '기다리기')]],
        [B('A force can change an object\'s ...', '힘은 물체의 무엇을 바꿀 수 있을까요?'), B('speed and direction', '빠르기와 방향'), [B('name and color', '이름과 색깔'), B('age', '나이')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words', after: q[1] });
    }
  }
});

// ---------- 7. Life cycles ----------
const CYCLES = [
  { n: B('butterfly', '나비'), e: '🦋', st: [['🥚', B('egg', '알')], ['🐛', B('caterpillar (larva)', '애벌레')], ['🫘', B('chrysalis (pupa)', '번데기')], ['🦋', B('butterfly', '나비')]] },
  { n: B('frog', '개구리'), e: '🐸', st: [['🥚', B('egg', '알')], ['🐟', B('tadpole', '올챙이')], ['🦎', B('froglet (tadpole with legs)', '다리가 난 올챙이')], ['🐸', B('adult frog', '다 자란 개구리')]] },
  { n: B('bean plant', '콩'), e: '🌱', st: [['🫘', B('seed', '씨앗')], ['🌱', B('seedling (sprout)', '새싹')], ['🌿', B('grown plant', '다 자란 식물')], ['🌸', B('flower that makes new seeds', '새 씨앗을 만드는 꽃')]] },
  { n: B('chicken', '닭'), e: '🐔', st: [['🥚', B('egg', '알')], ['🐣', B('chick', '병아리')], ['🐥', B('young chicken', '어린 닭')], ['🐔', B('adult chicken', '다 자란 닭')]] }
];
G2S({
  id: 'lifecycle2', icon: '🦋', title: B('Life Cycles', '한살이'), sub: B('How living things grow and change', '생물이 자라고 변하는 과정'), u: 'Life Cycles',
  play() {
    const lv = lvl('lifecycle2'), c = pick(lv === 1 ? CYCLES.slice(0, 3) : CYCLES), kind = pick(lv === 1 ? ['next', 'next', 'first'] : ['next', 'prev', 'first', 'last', 'compare']);
    if (kind === 'compare') {
      const q = pick([[B('Which animal changes its body shape a lot as it grows (a metamorphosis)?', '자라면서 몸 모양이 크게 바뀌는 동물은?'), B('A butterfly', '나비'), [B('A dog', '개'), B('A cat', '고양이')]],
        [B('Which animal starts life as an egg in water and breathes with gills at first?', '물속 알에서 시작해 처음에는 아가미로 숨 쉬는 동물은?'), B('A frog', '개구리'), [B('A chicken', '닭'), B('A puppy', '강아지')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words', after: q[1] });
      return;
    }
    const i = kind === 'next' ? rnd(3) : kind === 'prev' ? 1 + rnd(3) : kind === 'first' ? 0 : 3;
    const askMap = { next: [B(`${c.n.en} life cycle: what comes RIGHT AFTER the ${c.st[i][1].en.replace(/ \(.*\)/,'')}?`, `${c.n.ko}의 한살이: ${c.st[i][1].ko.replace('다리가 난 올챙이','다리가 난 단계')} 바로 다음은?`), c.st[i + 1]], prev: [B(`${c.n.en} life cycle: what comes RIGHT BEFORE the ${c.st[i][1].en.replace(/ \(.*\)/,'')}?`, `${c.n.ko}의 한살이: ${c.st[i][1].ko.replace('다리가 난 올챙이','다리가 난 단계')} 바로 앞은?`), c.st[i - 1]], first: [B(`What is the FIRST stage of a ${c.n.en}'s life?`, `${c.n.ko}의 한살이에서 맨 처음은?`), c.st[0]], last: [B(`What is the LAST stage of a ${c.n.en}'s life cycle?`, `${c.n.ko}의 한살이에서 마지막은?`), c.st[3]] };
    const [ask, right] = askMap[kind], wr = others(c.st, right, 3).slice(0, 2);
    quiz(this, { ask, show: '', opts: [right, ...wr].map((s, k) => ({ html: `<span class="word">${L(s===c.st[3]?B('adult','다 자란 단계'):s[1])}</span>`, ok: k === 0 })), cls: 'words', after: B(`The stages go: ${c.st.map(s => s[1].en).join(' → ')}.`, `순서: ${c.st.map(s => s[1].ko).join(' → ')}.`) });
  }
});

// ---------- 8. Pollination and seed travel ----------
const SEEDS = [
  { e: '🌼', n: B('a dandelion seed', '민들레 씨'), how: B('wind', '바람'), why: B('It has light, fluffy parts that catch the wind.', '가볍고 솜털이 있어서 바람을 타요.') },
  { e: '🍁', n: B('a maple seed with a wing', '날개 달린 단풍나무 씨'), how: B('wind', '바람'), why: B('Its wing helps it spin and fly in the wind.', '날개가 있어 빙글빙글 돌며 바람에 날아가요.') },
  { e: '🥥', n: B('a coconut', '코코넛'), how: B('water', '물'), why: B('It floats on the ocean and lands on a new beach.', '바다에 둥둥 떠서 다른 해변에 닿아요.') },
  { e: '🌳', n: B('an acorn', '도토리'), how: B('animals', '동물'), why: B('Squirrels bury acorns, and some grow into oak trees.', '다람쥐가 묻어 둔 도토리 일부가 참나무로 자라요.') },
  { e: '🐕', n: B('a burr with tiny hooks', '작은 갈고리가 달린 도깨비바늘 씨'), how: B('animals', '동물'), why: B('The hooks stick to fur and clothes and get carried away.', '갈고리로 털과 옷에 붙어 멀리 옮겨져요.') },
  { e: '🍓', n: B('a berry that birds eat', '새가 먹는 열매'), how: B('animals', '동물'), why: B('Birds eat the fruit and drop the seeds far away.', '새가 열매를 먹고 씨를 먼 곳에 떨어뜨려요.') }
];
const HOWS = [B('wind', '바람'), B('water', '물'), B('animals', '동물')];
G2S({
  id: 'pollen2', icon: '🐝', title: B('Bees and Seeds', '벌과 씨앗'), sub: B('Pollination and how seeds travel', '꽃가루받이와 씨앗이 퍼지는 방법'), u: 'Plants',
  play() {
    const lv = lvl('pollen2'), kind = pick(lv === 1 ? ['seed', 'seed', 'bee'] : ['seed', 'seed', 'bee', 'why']);
    if (kind === 'seed') {
      const s = pick(SEEDS);
      quiz(this, { ask: B(`How does ${s.n.en} mostly travel to a new place?`, `${s.n.ko}: 주로 무엇의 도움으로 새로운 곳에 갈까요?`), show: `<span class="emo">${s.e}</span>`, opts: HOWS.map(h => ({ html: `<span class="word">${L(h)}</span>`, ok: h.en === s.how.en })), cls: 'words', after: s.why });
    } else if (kind === 'bee') {
      const q = pick([[B('What do bees do for flowers when they visit them?', '벌이 꽃을 찾아가면 꽃에게 어떤 도움을 줄까요?'), B('They carry pollen from flower to flower.', '꽃가루를 이 꽃에서 저 꽃으로 옮겨요.'), [B('They plant the seeds in soil.', '씨앗을 흙에 심어요.'), B('They give the flower water.', '꽃에 물을 줘요.')]],
        [B('Why do flowers need pollen to move from flower to flower?', '꽃가루가 꽃에서 꽃으로 옮겨져야 하는 까닭은?'), B('So the flowers can make fruit and seeds', '열매와 씨앗을 만들 수 있게 하려고'), [B('So the flowers can change color', '꽃 색이 바뀌게 하려고'), B('So the flowers can walk', '꽃이 걸을 수 있게 하려고')]]]);
      quiz(this, { ask: q[0], opts: wOpts(q[1], q[2]), cls: 'words sents', after: q[1] });
    } else {
      const s = pick(SEEDS);
      quiz(this, { ask: B(`Which sentence tells how this seed travels? ${s.n.en}`, `${s.n.ko}: 어떻게 퍼지는지 알맞게 설명한 문장은 무엇일까요?`), show: `<span class="emo">${s.e}</span>`, opts: wOpts(s.why, others(SEEDS, s, 3).map(x => x.why).filter(w => w.en !== s.why.en).slice(0, 2)), cls: 'words sents', after: s.why });
    }
  }
});

// Request 58: evidence modes; original modes remain on alternate rounds.
(() => {
'use strict';
const turns = {};
const card = s => `<div class="gap58-card storytext">${L(s)}</div>`;
const table = (caption, heads, rows) => `<table class="gap58-table"><caption>${L(caption)}</caption><thead><tr>${heads.map(h=>`<th scope="col">${L(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${typeof v==='object'?L(v):v}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const item = (mode, ask, show, right, wrong, after=right) => ({mode58:mode,ask,askSay:B(ask.en+' '+show.replace(/<[^>]*>/g,' '),ask.ko+' '+show.replace(/<[^>]*>/g,' ')),show,opts:wOpts(right,wrong),cls:'words sents gap58-options',after});
const modes = {
 sky2(lv,i) {
  if(i%2===0) {
   const summer=B('June 21 · summer','6월 21일 · 여름'), winter=B('December 21 · winter','12월 21일 · 겨울');
   const caption=B('Atlanta, 2026 · hours, rounded model','애틀랜타, 2026년 · 시간, 반올림 모형');
   const missing=lv===2&&i%4===0, target=i%4===0?summer:winter;
   const rows=[[summer,14,missing?'?':10],[winter,10,14]];
   const show=table(caption,[B('Date','날짜'),B('Day','낮'),B('Night','밤')],rows);
   if(missing)return item('daynight',B('Complete the table: June night = ? hours.','표를 완성해요. 6월의 밤은 몇 시간일까요?'),show,B('10 hours','10시간'),[B('14 hours','14시간'),B('24 hours','24시간')],B('Day + night = 24 hours. The model rounds each length to whole hours.','낮과 밤을 합하면 24시간이에요. 이 모형은 시간을 정수로 반올림했어요.'));
   if(lv===2)return item('daynight',B('Which conclusion matches both rows?','두 줄의 자료에 맞는 결론은?'),show,B('Summer has more daylight here','이곳은 여름의 낮이 더 길어요'),[B('Winter has more daylight here','이곳은 겨울의 낮이 더 길어요'),B('Day length never changes','낮의 길이는 늘 같아요')]);
   return item('daynight',i%4===0?B('Which date has the longer day?','낮이 더 긴 날은?'):B('Which date has the longer night?','밤이 더 긴 날은?'),show,target,[i%4===0?winter:summer]);
  }
  const show=card(B('Stars differ in true size and light output. Some are smaller and dimmer than the Sun; others are larger and brighter.','별은 실제 크기와 내는 빛이 달라요. 해보다 작고 어두운 별도, 크고 밝은 별도 있어요.'));
  return lv===1?item('star-evidence',B('Why does the Sun look so large and bright?','해가 아주 크고 밝게 보이는 까닭은?'),show,B('It is much closer to Earth','지구에 훨씬 가까워요'),[B('It is the largest of all stars','모든 별 중 가장 커요'),B('Other stars make no light','다른 별은 빛을 안 내요')]):item('star-evidence',B('Which evidence puts the Sun between smaller and larger stars?','해가 작은 별과 큰 별 사이임을 뒷받침하는 근거는?'),show,B('Stars exist on both sides in size and light output','해보다 작고 어두운 별과 크고 밝은 별이 있어요'),[B('Looking biggest proves it is biggest','가장 커 보이면 실제로도 가장 커요'),B('Distance cannot change its appearance','거리는 보이는 모습과 상관없어요')],B('The Sun is between smaller, dimmer stars and larger, brighter stars. Looking brightest does not prove it is biggest.','해보다 작고 어두운 별도, 크고 밝은 별도 있어요. 가장 밝게 보인다고 실제로 가장 큰 별은 아니에요.'));
 },
 matterchange2(lv,i) {
  const n=lv===1?4:6;
  const shape=(kind)=>{const points=kind===2?Array.from({length:n},(_,j)=>[j*1.15,j%2*2]):kind===0?Array.from({length:n},(_,j)=>[j,1]):Array.from({length:n},(_,j)=>[j%2,Math.floor(j/2)]);return `<svg viewBox="0 0 180 72" aria-label="${L(B(`${n} blocks, ${kind===2?'loose pieces':kind===0?'a row':'a tower'}`,`${n}개 블록, ${kind===2?'낱개 조각':kind===0?'가로줄':'탑'}`))}" role="img">${points.map(([x,y])=>`<rect x="${10+x*24}" y="${4+y*20}" width="22" height="18" rx="2" fill="#4385b5" stroke="#163d5b"/>`).join('')}</svg>`;};
  const start=i%2,end=1-start;
  const it=item('rebuild',B(`Use the same ${n} blocks. Take apart, rebuild, then explain.`,`같은 블록 ${n}개를 분해하고 다시 만든 뒤 설명해요.`),`<div class="gap58-build"><div id="gap58-shape">${shape(start)}</div><button id="gap58-step" type="button">${L(B('Take apart','분해하기'))}</button><div id="gap58-count" aria-live="polite">${L(B(`${n} blocks in the structure`, `구조물에 블록 ${n}개`))}</div></div>`,B('Same pieces, different arrangement','같은 조각을 다르게 배치했어요'),[B('New pieces had to appear','새 조각이 생겨야 해요'),B('The pieces disappeared','조각이 사라졌어요')]);
  it.onRender=()=>{let step=0;const options=$$('.opt'),button=$('#gap58-step');options.forEach(b=>b.disabled=true);button.onclick=()=>{step++;if(step===1){$('#gap58-shape').innerHTML=shape(2);$('#gap58-count').textContent=L(B(`${n} loose blocks; none added or lost`, `낱개 블록 ${n}개, 더하거나 뺀 것 없음`));button.textContent=L(B('Rebuild differently','다르게 조립하기'));}else{$('#gap58-shape').innerHTML=shape(end);$('#gap58-count').textContent=L(B(`${n} blocks in the new structure`, `새 구조물에 블록 ${n}개`));button.disabled=true;options.forEach(b=>b.disabled=false);}};};
  return it;
 },
 earthchange2(lv,i) {
  const rows=[
   [B('Practice park: rain fell. Water ran down bare soil; soil collected below.','가상 공원: 비가 내리고 맨흙 위로 물이 흘러 아래에 흙이 쌓였어요.'),B('Flowing rainwater moved soil','빗물이 흙을 옮겼어요'),B('What changed after the rain?','비가 온 뒤 무엇이 변했나요?')],
   [B('Practice park: workers removed trees. Before: shade and nests. After: less shade and fewer nesting places.','가상 공원: 사람이 나무를 베었어요. 전에는 그늘과 새 둥지가 있었고 뒤에는 둘 다 줄었어요.'),B('Removing trees reduced shade and nesting places','나무를 베어 그늘과 둥지 자리가 줄었어요'),B('What changed after trees were removed?','나무를 벤 뒤 무엇이 변했나요?')],
   [B('Practice stream: beavers built a dam. Before: flowing water. After: water pooled behind the dam.','가상 시냇물: 비버가 댐을 만들었어요. 전에는 물이 흘렀고 뒤에는 댐 뒤에 물이 고였어요.'),B('The dam held back water','댐이 물의 흐름을 막았어요'),B('Where did water collect after the dam?','댐을 만든 뒤 어디에 물이 고였나요?')]
  ],r=rows[i%rows.length];
  return lv===1?item('community-question',B('Which question helps investigate this local change?','이 지역 변화를 조사하는 데 도움이 되는 질문은?'),card(r[0]),r[2],[B('What color is my favorite toy?','내가 좋아하는 장난감은 무슨 색일까요?'),B('What is the name of a distant star?','먼 별의 이름은 무엇일까요?')]):item('community-evidence',B('Which cause and effect fits the observations?','관찰에 맞는 원인과 결과는?'),card(r[0]),r[1],[B('The observations show no change','관찰 자료에는 변화가 없어요'),B('A shadow created new soil','그림자가 새 흙을 만들었어요')]);
 },
 force2(lv,i) {
  const a=2+i%3,b=a+2,seconds=2;
  const direction=lv===2&&i%2===1;
  const show=direction?table(B('Practice cart · same push, 3 trials','가상 수레 · 같은 밀기, 3회 실험'),[B('Guide','가이드'),B('Turned left','왼쪽 회전')],[[B('Without','없음'),'0 / 3'],[B('With','있음'),'3 / 3']]):table(B(`Practice cart · same push, ${seconds} seconds each`,`가상 수레 · 같은 밀기, 각 ${seconds}초`),[B('Trial','실험'),B('No ramp (cm)','경사로 없음(cm)'),B('Ramp (cm)','경사로 있음(cm)')],[[1,a,b],[2,a+1,b+1]]);
  return item('design-data',direction?B('Goal: turn left. Did the guide work in these trials?','목표는 왼쪽 회전이에요. 가이드가 효과가 있었나요?'):lv===1?B('Which setup went farther in both trials?','두 실험 모두에서 더 멀리 간 장치는?'):B('Goal: move faster. Which evidence supports using the ramp?','목표는 더 빠르게 이동하기예요. 경사로 사용을 뒷받침하는 근거는?'),show,direction?B('Yes: left turns increased from 0 to 3','네. 왼쪽 회전이 0회에서 3회가 됐어요'):lv===1?B('With the ramp','경사로가 있을 때'):B('It went farther in the same time in both trials','두 실험 모두 같은 시간에 더 멀리 갔어요'),direction?[B('No: it never turned left','아니요. 한 번도 왼쪽으로 안 돌았어요'),B('We measured the color only','색깔만 측정했어요')]:[B('Without the ramp it went farther','경사로가 없을 때 더 멀리 갔어요'),B('We need only the cart color','수레 색깔만 알면 돼요')],B('These are invented practice measurements, not a promise about every device.','만든 연습 측정값이에요. 모든 장치에서 같은 결과를 보장하지 않아요.'));
 }
};
for(const id of Object.keys(modes)) {const g=GAMES.find(x=>x.id===id),old=g.play;g.play=function(){const t=turns[id]||0;turns[id]=t+1;if(t%2)return old.call(this);quiz(this,modes[id](lvl(id),Math.floor(t/2)));};}
})();
