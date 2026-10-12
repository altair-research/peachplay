'use strict';
// Grade 1 science (Georgia Science GSE, 2016): S1E1 weather, S1P1 light and sound, S1P2 magnets, S1L1 plants and animals.
// The GCPS 1st-grade AKS also names animals and their young; that part is included at level 2 of "Animal Needs".
const AREA1S = (u) => B(`Grade 1 Science · ${u}`, `1학년 과학 · ${u}`);
const G1S = (g) => registerGame(Object.assign({ grade: '1', subject: 'sci' }, g, { area: AREA1S(g.u) }));
const sOpts = (right, wrongs, cls = 'word') => [right, ...wrongs].map(w => ({ html: `<span class="${cls}">${L(w)}</span>`, ok: w === right }));
const tx = (a, b) => B(a, b);

// ---------- 1. Weather watchers ----------
const thermoSvg = (t) => { const y = 150 - t * 1.3; let s = `<rect x="44" y="14" width="22" height="146" rx="11" fill="#fff" stroke="#1d3557" stroke-width="3"/><circle cx="55" cy="168" r="17" fill="#ef476f" stroke="#1d3557" stroke-width="3"/><rect x="50" y="${y}" width="10" height="${160 - y}" fill="#ef476f"/>`; for (let v = 0; v <= 100; v += 10) { const yy = 150 - v * 1.3; s += `<line x1="${v % 20 === 0 ? 68 : 68}" y1="${yy}" x2="${v % 20 === 0 ? 82 : 76}" y2="${yy}" stroke="#1d3557" stroke-width="2"/>${v % 20 === 0 ? `<text x="86" y="${yy + 4}" font-size="11" font-weight="800" fill="#1d3557">${v}</text>` : ''}`; } return `<svg viewBox="0 0 130 190" class="thermo">${s}<text x="10" y="12" font-size="11" font-weight="800" fill="#1d3557">°F</text></svg>`; };
const vaneSvg = (deg) => `<svg viewBox="0 0 100 100" class="toolsvg"><line x1="50" y1="90" x2="50" y2="30" stroke="#6b4e2a" stroke-width="5"/><g transform="rotate(${deg} 50 40)"><polygon points="50,12 62,40 38,40" fill="#ef476f"/><line x1="50" y1="40" x2="50" y2="62" stroke="#1d3557" stroke-width="3"/></g><text x="50" y="98" font-size="9" text-anchor="middle" fill="#1d3557" font-weight="800">N</text></svg>`;
const gaugeSvg = (lvl) => `<svg viewBox="0 0 100 100" class="toolsvg"><rect x="34" y="14" width="32" height="76" rx="6" fill="#e8f6ff" stroke="#1d3557" stroke-width="3"/><rect x="36" y="${90 - lvl}" width="28" height="${lvl}" fill="#5aa9e6"/>${[20, 40, 60].map(h => `<line x1="34" y1="${90 - h}" x2="44" y2="${90 - h}" stroke="#1d3557" stroke-width="2"/>`).join('')}</svg>`;
const WEATHER = [['☀️', B('sunny', '맑음')], ['🌧️', B('rainy', '비')], ['☁️', B('cloudy', '흐림')], ['❄️', B('snowy', '눈')], ['💨', B('windy', '바람')]];
G1S({
  id: 'weather1', icon: '🌡️', title: B('Weather Watchers', '날씨 관찰'), sub: B('Thermometer, wind vane, rain gauge', '온도계, 풍향계, 강수량계'), u: 'Weather',
  play() {
    const lv = lvl('weather1'), kind = pick(lv === 1 ? ['thermo', 'tool', 'tool', 'chart'] : ['thermo', 'feel', 'tool', 'chart', 'chart']);
    if (kind === 'thermo') {
      const t = 10 * (1 + rnd(9));
      quiz(this, { ask: B('What temperature does the thermometer show?', '온도계는 몇 도를 가리킬까요?'), show: thermoSvg(t), opts: numO(t, [t + 10, t - 10, t + 20], 0, 100).map(o => ({ html: o.html.replace(/>(\d+)</, '>$1°<'), ok: o.ok })), after: B(`${t} degrees Fahrenheit.`, `화씨 ${t}도.`), vocab: `${t} degrees` });
    } else if (kind === 'feel') {
      const t = pick([20, 30, 40, 80, 90, 100]), hot = t >= 80;
      quiz(this, { ask: B(`The thermometer shows ${t}°F. What is the weather like?`, `온도계가 ${t}°F를 가리켜요. 날씨는 어떨까요?`), show: thermoSvg(t), opts: sOpts(hot ? tx('hot', '더워요') : tx('cold', '추워요'), [hot ? tx('cold', '추워요') : tx('hot', '더워요')]), cls: 'words', after: B(hot ? 'High numbers mean hot weather.' : 'Low numbers mean cold weather.', hot ? '숫자가 크면 더운 날씨예요.' : '숫자가 작으면 추운 날씨예요.') });
    } else if (kind === 'tool') {
      const tools = [[thermoSvg(70), B('thermometer', '온도계'), B('How warm or cold it is', '얼마나 덥고 추운지')], [vaneSvg(50), B('wind vane', '풍향계'), B('The direction the wind comes from', '바람이 어느 쪽에서 불어오는지')], [gaugeSvg(50), B('rain gauge', '강수량계'), B('How much rain fell', '비가 얼마나 왔는지')]], t = pick(tools);
      quiz(this, { ask: B(`Which tool measures this? ${L(t[2])}`, `어떤 도구로 재나요? ${t[2].ko}`), askSay: B(`Which tool measures this? ${L(t[2])}`, `어떤 도구로 재나요? ${t[2].ko}`), opts: tools.map(x => ({ html: x[0], label: x[1], ok: x === t })), cls: 'shapes tools', after: B(`A ${t[1].en} measures it.`, `${t[1].ko}로 재요.`), vocab: t[1].en });
    } else {
      const days = shuffle([0, 1, 2, 3, 4]).slice(0, 3), seq = Array.from({ length: 5 }, () => WEATHER[days[rnd(3)]]), cnt = {}; seq.forEach(w => cnt[w[0]] = (cnt[w[0]] || 0) + 1);
      const mx = Math.max(...Object.values(cnt)); if (Object.values(cnt).filter(v => v === mx).length > 1) { this.play(); return; }
      const names = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], right = Object.keys(cnt).find(k => cnt[k] === mx), uniq = [...new Set(seq.map(w => w[0]))];
      if (uniq.length < 2) { this.play(); return; }
      quiz(this, { ask: B('Look at the weather chart. Which weather happened the MOST?', '날씨 표를 봐요. 가장 많았던 날씨는?'), show: `<div class="wchart">${seq.map((w, i) => `<div><b>${names[i]}</b><span>${w[0]}</span></div>`).join('')}</div>`, opts: uniq.map(e => ({ html: `<span class="emo">${e}</span>`, ok: e === right })), cls: 'shapes', after: B(`${mx} days.`, `${mx}일.`) });
    }
  }
});

// ---------- 2. Picture weather (S1E1 observations) ----------
// Original SVGs keep rain/snow distinct across platforms. Cloud-only prompts
// explicitly exclude precipitation: a rainy sky also contains clouds.
const PRECIP_PICS = [
  { id: 'rain', n: B('rain', '비'), ask: B('Which picture shows rain falling?', '비가 내리는 그림은?'), clue: B('Drops of water fall from a cloud. Which picture matches?', '구름에서 물방울이 떨어져요. 어떤 그림일까요?'), detail: B('Rain falls as drops of water.', '비는 물방울로 내려요.') },
  { id: 'snow', n: B('snow', '눈'), ask: B('Which picture shows snow falling?', '눈이 내리는 그림은?'), clue: B('Snowflakes fall from a cloud. Which picture matches?', '구름에서 눈송이가 내려요. 어떤 그림일까요?'), detail: B('Snow falls as ice crystals called snowflakes.', '눈은 얼음 결정인 눈송이로 내려요.') },
  { id: 'cloud', n: B('clouds without rain or snow', '비나 눈이 내리지 않는 구름'), ask: B('Which sky has clouds but no rain or snow?', '구름은 있지만 비나 눈은 내리지 않는 하늘은?'), clue: B('Clouds cover the sky. Nothing is falling from them. Which picture matches?', '구름이 하늘을 덮고 있어요. 구름에서 아무것도 내리지 않아요. 어떤 그림일까요?'), detail: B('Clouds do not always bring rain or snow.', '구름이 있어도 비나 눈이 내리지 않을 수 있어요.') },
  { id: 'wind', n: B('wind', '바람'), ask: B('Which picture shows wind blowing a windsock?', '바람이 불어 바람자루가 펴진 그림은?'), clue: B('Moving air stretches out a windsock. Which picture matches?', '움직이는 공기가 바람자루를 쭉 펴요. 어떤 그림일까요?'), detail: B('Wind is moving air. It blows the windsock out.', '바람은 움직이는 공기예요. 바람이 바람자루를 펴 줘요.') },
  { id: 'sun', n: B('sun in a clear sky', '맑은 하늘의 해'), ask: B('Which picture shows the sun in a clear sky?', '맑은 하늘에 해가 떠 있는 그림은?'), clue: B('The sun shines. There are no clouds in this sky. Which picture matches?', '해가 빛나요. 하늘에 구름이 없어요. 어떤 그림일까요?'), detail: B('This sky is clear, with no clouds.', '이 하늘에는 구름이 없고 맑아요.') }
];
const precipPicture = (w) => {
  const cloud = '<path d="M22 52 C8 52 8 30 24 28 C25 9 51 7 59 24 C79 13 99 29 93 43 C111 47 102 64 86 64 H27 C18 64 16 57 22 52Z" fill="#fff" stroke="#526d82" stroke-width="3"/>';
  let drawing;
  if (w.id === 'rain') drawing = cloud + [30, 58, 86].map(x => `<path d="M${x} 72 Q${x - 14} 91 ${x} 94 Q${x + 14} 91 ${x} 72Z" fill="#247bbb"/>`).join('');
  else if (w.id === 'snow') drawing = cloud + [28, 60, 92].map(x => `<g transform="translate(${x} 85)" stroke="#247bbb" stroke-width="3" stroke-linecap="round"><path d="M0 -10V10 M-9 -5L9 5 M-9 5L9 -5"/></g>`).join('');
  else if (w.id === 'cloud') drawing = cloud;
  else if (w.id === 'wind') drawing = '<path d="M28 102V20" stroke="#526d82" stroke-width="5"/><path d="M31 25L103 37V51L31 61Z" fill="#ed694b" stroke="#843d2a" stroke-width="2"/><path d="M51 28V58 M73 32V55" stroke="#fff" stroke-width="9"/><ellipse cx="31" cy="43" rx="6" ry="18" fill="#fff" stroke="#843d2a" stroke-width="2"/><path d="M54 77H104 M43 89H85" stroke="#526d82" stroke-width="3" stroke-linecap="round"/>';
  else drawing = '<g stroke="#e99813" stroke-width="4" stroke-linecap="round"><path d="M60 13V25 M60 85V97 M18 55H30 M90 55H102 M30 25L39 34 M81 76L90 85 M30 85L39 76 M81 34L90 25"/><circle cx="60" cy="55" r="22" fill="#ffd34e"/></g>';
  return `<svg viewBox="0 0 120 115" role="img" aria-label="${L(w.n)}" style="width:clamp(64px,min(22vw,16dvh),130px);height:auto;max-width:100%"><rect x="2" y="2" width="116" height="111" rx="14" fill="#e4f4fc"/>${drawing}</svg>`;
};
G1S({
  id: 'precip', icon: '🌦️', title: B('Weather Pictures', '그림으로 보는 날씨'), sub: B('Rain, snow, clouds, wind, and sunshine', '비, 눈, 구름, 바람, 맑은 하늘'), u: 'Weather',
  play() {
    const w = pick(PRECIP_PICS), choices = [w, ...others(PRECIP_PICS, w, 2)];
    quiz(this, { ask: lvl('precip') === 1 ? w.ask : w.clue, opts: choices.map(x => ({ html: precipPicture(x), ok: x === w })), cls: 'shapes', after: w.detail, vocab: w.n.en });
  }
});

// ---------- 3. Seasons ----------
const SEAS = [['winter', '겨울', '⛄', B('It is cold. Some places get snow.', '추워요. 눈이 오는 곳도 있어요.')], ['spring', '봄', '🌷', B('It is warm. Flowers bloom and it rains.', '따뜻해요. 꽃이 피고 비가 와요.')], ['summer', '여름', '🏖️', B('It is hot. The days are long.', '더워요. 낮이 길어요.')], ['fall', '가을', '🍂', B('It is cool. Leaves change color and fall.', '시원해요. 나뭇잎이 물들고 떨어져요.')]];
G1S({
  id: 'seasons1', icon: '🍂', title: B('Seasonal Patterns', '계절의 변화'), sub: B('What changes through the year?', '1년 동안 무엇이 바뀔까?'), u: 'Seasons',
  play() {
    const lv = lvl('seasons1'), kind = pick(lv === 1 ? ['feature', 'after'] : ['feature', 'after', 'ga', 'month']);
    if (kind === 'feature') { const t = pick(SEAS), ds = others(SEAS, t, 2); quiz(this, { ask: B(`Which season is this? ${L(t[3])}`, `어느 계절일까요? ${t[3].ko}`), opts: [t, ...ds].map(s => ({ html: `<span class="emo">${s[2]}</span>`, label: B(s[0], s[1]), ok: s === t })), cls: 'shapes', after: B(`It is ${t[0]}!`, `${t[1]}이에요!`), vocab: t[0] }); }
    else if (kind === 'after') { const i = rnd(4), ans = SEAS[(i + 1) % 4], pool = SEAS.filter(x => x !== ans && x !== SEAS[i]); quiz(this, { ask: B(`Which season comes after ${SEAS[i][0]}?`, `${SEAS[i][1]} 다음 계절은?`), opts: [ans, ...shuffle(pool).slice(0, 2)].map(x => ({ html: `<span class="emo">${x[2]}</span>`, label: B(x[0], x[1]), ok: x === ans })), cls: 'shapes', after: B(`${ans[0]} comes after ${SEAS[i][0]}.`, `${SEAS[i][1]} 다음은 ${ans[1]}이에요.`) }); }
    else if (kind === 'ga') {
      const facts = [[B('In Georgia, which season is usually the hottest?', '조지아에서 가장 더운 계절은?'), SEAS[2]], [B('In which season do many trees lose their leaves?', '많은 나무가 잎을 떨구는 계절은?'), SEAS[3]], [B('In which season do the peach trees bloom with pink flowers?', '복숭아나무에 분홍 꽃이 피는 계절은?'), SEAS[1]], [B('Which season is the coldest?', '가장 추운 계절은?'), SEAS[0]]], f = pick(facts), ds = others(SEAS, f[1], 2);
      quiz(this, { ask: f[0], opts: [f[1], ...ds].map(s => ({ html: `<span class="emo">${s[2]}</span>`, label: B(s[0], s[1]), ok: s === f[1] })), cls: 'shapes', after: B(`${f[1][0]}!`, `${f[1][1]}!`) });
    } else {
      const m = [[B('December, January, February', '12월, 1월, 2월'), SEAS[0]], [B('March, April, May', '3월, 4월, 5월'), SEAS[1]], [B('June, July, August', '6월, 7월, 8월'), SEAS[2]], [B('September, October, November', '9월, 10월, 11월'), SEAS[3]]], t = pick(m), ds = others(SEAS, t[1], 2);
      quiz(this, { ask: B(`Which season has ${t[0].en}?`, `${t[0].ko}은 어느 계절일까요?`), opts: [t[1], ...ds].map(s => ({ html: `<span class="emo">${s[2]}</span>`, label: B(s[0], s[1]), ok: s === t[1] })), cls: 'shapes', after: B(`${t[1][0]}`, `${t[1][1]}`) });
    }
  }
});

// ---------- 4. Magnet power ----------
const MAG_YES = [['📎', B('paper clip', '클립')], ['🔩', B('nut and bolt', '볼트와 너트')], ['🥫', B('steel can', '철제 캔')], ['🔧', B('wrench', '렌치')]];
const MAG_NO = [['🪵', B('wood', '나무')], ['📄', B('paper', '종이')], ['🧸', B('teddy bear', '곰 인형')], ['🥤', B('plastic cup', '플라스틱 컵')], ['🍎', B('apple', '사과')], ['🧦', B('sock', '양말')], ['🖍️', B('crayon', '크레용')]];
const barMagnet = (dir, x) => `<g transform="translate(${x} 0)"><rect x="0" y="0" width="38" height="22" fill="${dir ? '#ef476f' : '#118ab2'}"/><rect x="38" y="0" width="38" height="22" fill="${dir ? '#118ab2' : '#ef476f'}"/><rect x="0" y="0" width="76" height="22" fill="none" stroke="#1d3557" stroke-width="2"/></g>`;
G1S({
  id: 'magnets1', icon: '🧲', title: B('Magnet Power', '자석의 힘'), sub: B('Attract and repel', '끌어당기고 밀어내요'), u: 'Magnets',
  play() {
    const lv = lvl('magnets1'), kind = pick(lv === 1 ? ['pick', 'pick', 'uses'] : ['pick', 'poles', 'poles', 'uses', 'iron']);
    if (kind === 'pick') {
      const y = pick(MAG_YES), ds = shuffle(MAG_NO).slice(0, 2); quiz(this, { ask: B('Which one will a magnet pick up?', '자석이 끌어당기는 것은?'), show: '<span class="emo">🧲</span>', opts: [y, ...ds].map((x, i) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: i === 0 })), after: B(`A magnet pulls on ${y[1].en}. It has iron in it.`, `자석은 ${y[1].ko}에 붙어요. 철이 들어 있어요.`), vocab: 'attract' });
    } else if (kind === 'iron') {
      quiz(this, { ask: B('A magnet pulls on things made of ___.', '자석은 ___(으)로 만든 물건을 끌어당겨요.'), show: '<span class="emo">🧲</span>', opts: sOpts(tx('iron', '철'), [tx('wood', '나무'), tx('paper', '종이')]), cls: 'words', after: B('Magnets pull on things made of iron.', '자석은 철로 만든 물건을 끌어당겨요.'), vocab: 'iron' });
    } else if (kind === 'poles') {
      const f1 = rnd(2) === 1, f2 = rnd(2) === 1;                       // flip: false = red(N) on the left half, true = blue(S) on the left half
      const bar = (x, flip) => `<g transform="translate(${x} 0)"><rect width="38" height="22" fill="${flip ? '#118ab2' : '#ef476f'}"/><rect x="38" width="38" height="22" fill="${flip ? '#ef476f' : '#118ab2'}"/><rect width="76" height="22" fill="none" stroke="#1d3557" stroke-width="2"/><text x="19" y="16" font-size="14" font-weight="900" text-anchor="middle" fill="#fff">${flip ? 'S' : 'N'}</text><text x="57" y="16" font-size="14" font-weight="900" text-anchor="middle" fill="#fff">${flip ? 'N' : 'S'}</text></g>`;
      const facing1 = f1 ? 'N' : 'S', facing2 = f2 ? 'S' : 'N', attract = facing1 !== facing2;   // right half of the left bar meets the left half of the right bar
      quiz(this, { ask: B('Look at the two ends that face each other (N and S). Do the magnets pull together or push apart?', '마주 보는 두 끝(N극과 S극)을 봐요. 자석은 서로 끌어당길까요, 밀어낼까요?'), show: `<svg viewBox="0 0 220 40" class="magsvg"><g transform="translate(0 9)">${bar(4, f1)}${bar(140, f2)}</g></svg>`, opts: [{ html: `<span class="word">${S.lang === 'ko' ? '끌어당겨요' : 'attract (pull together)'}</span>`, ok: attract }, { html: `<span class="word">${S.lang === 'ko' ? '밀어내요' : 'repel (push apart)'}</span>`, ok: !attract }], cls: 'words', after: attract ? B('Different ends (N and S) attract.', '다른 극(N극과 S극)은 서로 끌어당겨요.') : B('The same ends (N and N, or S and S) repel.', '같은 극(N-N 또는 S-S)은 서로 밀어내요.'), vocab: attract ? 'attract' : 'repel' });
    } else {
      const u = [[B('a refrigerator magnet', '냉장고 자석'), '🧲'], [B('a magnetic toy', '자석 장난감'), '🧩'], [B('a magnetic latch on a cabinet', '찬장의 자석 잠금장치'), '🚪'], [B('a magnetic name tag', '자석 이름표'), '🏷️']], t = pick(u);
      quiz(this, { ask: B('People use magnets every day. Which one uses a magnet to hold something?', '사람들은 매일 자석을 써요. 자석으로 무언가를 붙여 두는 것은?'), opts: [[B('a refrigerator magnet holding a note', '메모를 붙인 냉장고 자석'), true], [B('a spoon in a cup', '컵 속 숟가락'), false], [B('a book on a shelf', '선반 위의 책'), false]].map(x => ({ html: `<span class="word">${L(x[0])}</span>`, ok: x[1] })), cls: 'words sents', after: B('A magnet can hold a note on a refrigerator door.', '자석은 냉장고 문에 메모를 붙여 둘 수 있어요.') });
    }
  }
});

// ---------- 5. Light and shadows ----------
const shadowSvg = (d) => { const lightX = 24, wallX = 250, objH = 40, sh = Math.min(96, objH * (wallX - lightX) / d), ox = lightX + d; return `<svg viewBox="0 0 280 120" class="shsvg"><circle cx="${lightX}" cy="60" r="12" fill="#ffd166" stroke="#c9951b" stroke-width="2"/><rect x="${ox - 5}" y="${60 - objH / 2}" width="10" height="${objH}" rx="3" fill="#5aa9e6" stroke="#1d3557" stroke-width="2"/><rect x="${wallX}" y="${60 - sh / 2}" width="10" height="${sh}" rx="3" fill="#33384d"/><line x1="${wallX}" y1="10" x2="${wallX}" y2="110" stroke="#aab" stroke-width="1"/></svg>`; };
G1S({
  id: 'light1', icon: '🔦', title: B('Light and Shadows', '빛과 그림자'), sub: B('Sources of light, big and small shadows', '빛을 내는 것, 큰 그림자와 작은 그림자'), u: 'Light',
  play() {
    const lv = lvl('light1'), kind = pick(lv === 1 ? ['source', 'source', 'see'] : ['source', 'see', 'shadow', 'shadow', 'dir']);
    if (kind === 'source') {
      const yes = [['☀️', B('sun', '해')], ['💡', B('lamp', '전등')], ['🔦', B('flashlight', '손전등')], ['🕯️', B('candle', '촛불')]], no = [['📖', B('book', '책')], ['🪨', B('rock', '돌')], ['⚽', B('ball', '공')], ['🪑', B('chair', '의자')]], y = pick(yes), ds = shuffle(no).slice(0, 2);
      quiz(this, { ask: B('Which one is a source of light? It makes its own light.', '빛을 내는 것은 어느 것일까요? 스스로 빛을 만들어요.'), opts: [y, ...ds].map((x, i) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: i === 0 })), after: B(`A ${y[1].en} gives off light.`, `${y[1].ko}: 스스로 빛을 내요.`), vocab: 'light' });
    } else if (kind === 'see') {
      quiz(this, { ask: B('You are in a very dark room. Why can you not see the toys?', '아주 깜깜한 방에 있어요. 장난감이 왜 안 보일까요?'), show: '<span class="emo">🌑🧸</span>', opts: sOpts(tx('There is no light.', '빛이 없어요.'), [tx('The toys are quiet.', '장난감이 조용해요.'), tx('The toys are cold.', '장난감이 차가워요.')]), cls: 'words sents', after: B('We need light to see things.', '물건을 보려면 빛이 필요해요.') });
    } else if (kind === 'shadow') {
      const near = rnd(2) === 0, a = 70, b = 190; quiz(this, { ask: near ? B('Where is the shadow BIGGER? When the object is close to the light, or far?', '그림자가 더 큰 때는 언제일까요? 물체가 빛에 가까울 때, 아니면 멀 때?') : B('Which picture has the SMALLER shadow?', '그림자가 더 작은 그림은 어느 것일까요?'), askSay: near ? B('When is the shadow bigger, close to the light or far?', '그림자가 더 큰 때는 빛에 가까울 때일까요, 멀 때일까요?') : B('Which picture has the smaller shadow?', '그림자가 더 작은 그림은 어느 것일까요?'), show: near ? '' : '', opts: near ? [{ html: `<span class="word">${L(B('Close to the light', '빛에 가까울 때'))}</span>`, ok: true }, { html: `<span class="word">${L(B('Far from the light', '빛에서 멀 때'))}</span>`, ok: false }] : [{ html: shadowSvg(a), ok: false }, { html: shadowSvg(b), ok: true }], cls: near ? 'words' : 'groups', after: B('The closer the object is to the light, the bigger the shadow.', '물체가 빛에 가까울수록 그림자가 커져요.') });
    } else {
      const left = rnd(2) === 0; quiz(this, { ask: left ? B('The light is on the LEFT. Which way does the shadow fall?', '빛이 왼쪽에 있어요. 그림자는 어느 쪽으로 생길까요?') : B('The light is on the RIGHT. Which way does the shadow fall?', '빛이 오른쪽에 있어요. 그림자는 어느 쪽으로 생길까요?'), show: `<span class="emo">${left ? '🔦➡️🧍' : '🧍⬅️🔦'}</span>`, opts: sOpts(left ? tx('to the right', '오른쪽') : tx('to the left', '왼쪽'), [left ? tx('to the left', '왼쪽') : tx('to the right', '오른쪽')]), cls: 'words', after: B('A shadow falls on the side away from the light.', '그림자는 빛의 반대쪽에 생겨요.') });
    }
  }
});

// ---------- 6. Sound and vibration ----------
G1S({
  id: 'sound1', icon: '🔔', title: B('Sound and Vibration', '소리와 진동'), sub: B('Shaking makes sound', '떨리면 소리가 나요'), u: 'Sound',
  play() {
    const lv = lvl('sound1'), kind = pick(lv === 1 ? ['vib', 'vib', 'source'] : ['vib', 'source', 'signal', 'signal', 'feel']);
    if (kind === 'vib') {
      quiz(this, { ask: B('Sound is made when something ___ back and forth very fast.', '무언가가 아주 빠르게 앞뒤로 ___ 소리가 만들어져요.'), show: '<span class="emo">🎸〰️</span>', opts: sOpts(tx('vibrates (shakes)', '떨리면 (진동하면)'), [tx('freezes', '얼면'), tx('melts', '녹으면')]), cls: 'words', after: B('A vibration makes sound.', '진동이 소리를 만들어요.'), vocab: 'vibrate' });
    } else if (kind === 'source') {
      const yes = [['🥁', B('a drum being hit', '두드리는 북')], ['🎸', B('a guitar string being plucked', '튕기는 기타 줄')], ['🔔', B('a ringing bell', '울리는 종')]], no = [['🪨', B('a rock sitting still', '가만히 있는 돌')], ['📖', B('a closed book', '덮은 책')], ['🧸', B('a teddy bear on a bed', '침대 위의 곰 인형')]], y = pick(yes), ds = shuffle(no).slice(0, 2);
      quiz(this, { ask: B('Which one makes a sound?', '소리가 나는 것은?'), opts: [y, ...ds].map((x, i) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: i === 0 })), after: B('It vibrates, so it makes a sound.', '진동해서 소리가 나요.') });
    } else if (kind === 'feel') {
      quiz(this, { ask: B('Hum and touch your throat. What do you feel?', '콧노래를 부르며 목을 만져 봐요. 무엇이 느껴질까요?'), show: '<span class="emo">🎶🤚</span>', opts: sOpts(tx('A tiny vibration', '작은 떨림'), [tx('Something cold', '차가운 것'), tx('Something wet', '젖은 것')]), cls: 'words', after: B('Your throat vibrates when you hum.', '콧노래를 부르면 목이 떨려요.') });
    } else {
      const items = [[B('a whistle blown loudly', '크게 부는 호루라기'), true], [B('a flashlight that flashes on and off', '깜빡이는 손전등'), true], [B('a very quiet whisper', '아주 작은 속삭임'), false], [B('a tiny candle in a house', '집 안의 작은 촛불'), false]];
      const good = pick(items.filter(x => x[1])), bad = shuffle(items.filter(x => !x[1]));
      quiz(this, { ask: B('You need a signal for help that people far away can notice. Which is best?', '멀리 있는 사람에게 도움을 청하려고 해요. 가장 좋은 신호는?'), opts: [good, ...bad].map(x => ({ html: `<span class="word">${L(x[0])}</span>`, ok: x === good })), cls: 'words sents', after: B('Loud sounds and bright lights can be seen or heard from far away.', '큰 소리와 밝은 빛은 멀리서도 보이고 들려요.') });
    }
  }
});

// ---------- 7. Plant parts and needs ----------
const plantSvg = () => `<svg viewBox="0 0 120 150" class="plantsvg"><path d="M60 110 L60 60" stroke="#3a8f3a" stroke-width="6" stroke-linecap="round"/><ellipse cx="42" cy="82" rx="16" ry="8" transform="rotate(-30 42 82)" fill="#5cb85c"/><ellipse cx="78" cy="72" rx="16" ry="8" transform="rotate(30 78 72)" fill="#5cb85c"/><circle cx="60" cy="44" r="12" fill="#ffb703" stroke="#e08e00" stroke-width="2"/><g fill="#ff7a8a"><circle cx="60" cy="26" r="9"/><circle cx="78" cy="44" r="9"/><circle cx="60" cy="62" r="9"/><circle cx="42" cy="44" r="9"/></g><circle cx="60" cy="44" r="8" fill="#ffd166"/><path d="M60 110 L45 134 M60 110 L60 140 M60 110 L76 134" stroke="#8b5a2b" stroke-width="4" stroke-linecap="round"/><rect x="8" y="106" width="104" height="5" fill="#8b5a2b" opacity=".35"/><g font-size="12" font-weight="800" fill="#1d3557" text-anchor="middle"><text x="60" y="14">A</text><text x="75" y="101">B</text><text x="22" y="86">C</text><text x="60" y="148">D</text></g></svg>`;
const PLANT_PARTS = { A: B('flower', '꽃'), B: B('stem', '줄기'), C: B('leaf', '잎'), D: B('roots', '뿌리') };
G1S({
  id: 'plants1', icon: '🌱', title: B('Plant Parts and Needs', '식물의 부분과 필요'), sub: B('Root, stem, leaf, flower', '뿌리, 줄기, 잎, 꽃'), u: 'Plants',
  play() {
    const lv = lvl('plants1'), kind = pick(lv === 1 ? ['part', 'part', 'need'] : ['part', 'job', 'need', 'job', 'notneed']);
    if (kind === 'part') {
      const map = { flower: 'A', stem: 'B', leaf: 'C', root: 'D' }, nameEn = { flower: 'flower', stem: 'stem', leaf: 'leaf', root: 'roots' }, nameKo = { flower: '꽃', stem: '줄기', leaf: '잎', root: '뿌리' }, k = pick(Object.keys(map)), right = map[k];
      quiz(this, { ask: B(`Which letter shows the ${nameEn[k].toUpperCase()}?`, `${nameKo[k]}에 해당하는 글자는?`), askSay: B(`Which letter shows the ${nameEn[k]}?`, `${nameKo[k]}에 해당하는 글자는?`), show: plantSvg(), opts: ['A', 'B', 'C', 'D'].map(c => ({ html: `<span class="num">${c}</span>`, ok: c === right })), cls: 'shapes', after: B(`${right} is the ${nameEn[k]}.`, `${right} = ${nameKo[k]}`), vocab: nameEn[k] });
    } else if (kind === 'job') {
      const jobs = [[B('Which part takes in water from the soil?', '흙에서 물을 빨아들이는 부분은?'), 'roots'], [B('Which part holds the plant up?', '식물을 받쳐 주는 부분은?'), 'stem'], [B('Which part uses sunlight to make food?', '햇빛으로 양분을 만드는 부분은?'), 'leaf'], [B('Which part makes seeds and fruit?', '씨앗과 열매를 만드는 부분은?'), 'flower']], j = pick(jobs), names = { roots: B('roots', '뿌리'), stem: B('stem', '줄기'), leaf: B('leaf', '잎'), flower: B('flower', '꽃') };
      const ds = others(Object.keys(names), j[1], 2); quiz(this, { ask: j[0], opts: [j[1], ...ds].map(k => ({ html: `<span class="word">${L(names[k])}</span>`, ok: k === j[1] })), cls: 'words', after: B(`The ${names[j[1]].en} does this job.`, `${names[j[1]].ko}의 일이에요.`), vocab: names[j[1]].en });
    } else if (kind === 'need') {
      const needs = [['💧', B('water', '물')], ['☀️', B('light', '빛')], ['💨', B('air', '공기')], ['🌱', B('nutrients from the soil', '흙 속 양분')]], n = pick(needs), notNeeds = [['🍕', B('pizza', '피자')], ['🍬', B('candy', '사탕')], ['📺', B('television', '텔레비전')], ['🎮', B('video game', '게임')]], ds = shuffle(notNeeds).slice(0, 2);
      quiz(this, { ask: B('Which one does a plant need to live?', '식물이 살아가는 데 필요한 것은?'), opts: [n, ...ds].map(x => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: x === n })), after: B('Plants need air, water, light, and nutrients.', '식물에게는 공기, 물, 빛, 양분이 필요해요.') });
    } else {
      const bad = [['🍕', B('pizza', '피자')], ['🍬', B('candy', '사탕')], ['📺', B('television', '텔레비전')]], b = pick(bad), ds = shuffle([['💧', B('water', '물')], ['☀️', B('light', '빛')], ['💨', B('air', '공기')]]).slice(0, 2);
      quiz(this, { ask: B('Which one does a plant NOT need?', '식물에게 필요 없는 것은?'), opts: [b, ...ds].map((x, i) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: i === 0 })), after: B('Plants make their own food. They do not need pizza or candy.', '식물은 스스로 양분을 만들어요. 피자나 사탕은 필요 없어요.') });
    }
  }
});

// ---------- 8. Animal needs ----------
const YOUNG = [['🐔', B('chicken', '닭'), B('chick', '병아리')], ['🐱', B('cat', '고양이'), B('kitten', '새끼 고양이')], ['🐶', B('dog', '개'), B('puppy', '강아지')], ['🦆', B('duck', '오리'), B('duckling', '새끼 오리')], ['🐸', B('frog', '개구리'), B('tadpole', '올챙이')], ['🐑', B('sheep', '양'), B('lamb', '새끼 양')], ['🐴', B('horse', '말'), B('foal', '망아지')], ['🐄', B('cow', '소'), B('calf', '송아지')], ['🐻', B('bear', '곰'), B('cub', '새끼 곰')], ['🦌', B('deer', '사슴'), B('fawn', '새끼 사슴')]];
G1S({
  id: 'animals1', icon: '🐾', title: B('Animal Needs', '동물에게 필요한 것'), sub: B('Air, water, food, shelter', '공기, 물, 먹이, 집'), u: 'Animals',
  play() {
    const lv = lvl('animals1'), kind = pick(lv === 1 ? ['need', 'need', 'shelter', 'both'] : ['need', 'both', 'solve', 'young', 'young']);
    if (kind === 'need') {
      const needs = [['💨', B('air', '공기')], ['💧', B('water', '물')], ['🍖', B('food', '먹이')], ['🏠', B('shelter (a safe home)', '집 (안전한 곳)')]], bad = [['📺', B('television', '텔레비전')], ['🎮', B('video game', '게임')], ['🪁', B('kite', '연')]], n = pick(needs), b = pick(bad);
      quiz(this, { ask: B('Which one do animals need to live?', '동물이 살아가는 데 필요한 것은?'), opts: [n, ...shuffle(bad).slice(0, 2)].map((x, i) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: i === 0 })), after: B('Animals need air, water, food, and shelter.', '동물에게는 공기, 물, 먹이, 집이 필요해요.') });
    } else if (kind === 'shelter') {
      const homes = [['🐦', B('A bird', '새'), B('a nest', '둥지')], ['🐝', B('Honey bees', '꿀벌'), B('a hive', '벌집')], ['🐻', B('A bear', '곰'), B('a cave', '동굴')], ['🐶', B('A dog', '개'), B('a doghouse', '개집')]], h = pick(homes), ds = shuffle(homes.filter(x => x !== h)).slice(0, 2);
      quiz(this, { ask: B(`Where ${h[0] === '🐝' ? 'do' : 'does'} ${L(h[1]).toLowerCase()} find shelter?`, `${h[1].ko}의 집은 어디일까요?`), show: `<span class="emo">${h[0]}</span>`, opts: [h, ...ds].map((x, i) => ({ html: `<span class="word">${L(x[2])}</span>`, ok: i === 0 })), cls: 'words', after: B(`${L(h[1])} ${h[0] === '🐝' ? 'live' : 'lives'} in ${L(h[2])}.`, `${h[2].ko}: ${h[1].ko}의 집이에요.`) });
    } else if (kind === 'both') {
      const qs = [[B('Both plants and animals need ___.', '식물과 동물이 모두 필요로 하는 것은? ___'), tx('water', '물'), [tx('shelter', '집'), tx('a leash', '목줄')]], [B('Animals need food, but plants make their own food using ___.', '동물에게는 먹이가 필요하지만 식물은 ___(으)로 스스로 양분을 만들어요.'), tx('sunlight', '햇빛'), [tx('shelter', '집'), tx('toys', '장난감')]], [B('Both plants and animals need ___.', '식물과 동물이 모두 필요로 하는 것은? ___'), tx('air', '공기'), [tx('a nest', '둥지'), tx('a pot', '화분')]]], q = pick(qs);
      quiz(this, { ask: q[0], opts: sOpts(q[1], q[2]), cls: 'words', after: B('Plants and animals share some needs and have some different needs.', '식물과 동물은 같은 것도, 다른 것도 필요로 해요.') });
    } else if (kind === 'solve') {
      const ps = [[B('The fish tank water is dirty. What helps the fish?', '어항 물이 더러워요. 물고기에게 무엇이 도움이 될까요?'), tx('Clean the water', '물을 갈아 줘요'), [tx('Add more toys', '장난감을 더 넣어요'), tx('Turn off the light for a week', '일주일 동안 불을 꺼요')]], [B('A pet hamster has no food. What should you do?', '햄스터에게 먹이가 없어요. 어떻게 해야 할까요?'), tx('Give it food', '먹이를 줘요'), [tx('Give it a bath', '목욕을 시켜요'), tx('Let it sleep more', '더 재워요')]], [B('A bird has no safe place to rest. What can you build?', '새가 쉴 안전한 곳이 없어요. 무엇을 만들어 줄 수 있을까요?'), tx('A birdhouse', '새집'), [tx('A swing', '그네'), tx('A slide', '미끄럼틀')]]], p = pick(ps);
      quiz(this, { ask: p[0], opts: sOpts(p[1], p[2]), cls: 'words sents', after: B('Meeting an animal\'s needs keeps it healthy.', '동물에게 필요한 것을 채워 주면 건강하게 자라요.') });
    } else {
      const y = pick(YOUNG), ds = shuffle(YOUNG.filter(x => x !== y)).slice(0, 2);
      quiz(this, { ask: B(`What is a baby ${L(y[1])} called?`, `${y[1].ko}의 새끼는 무엇이라고 부를까요?`), show: `<span class="emo">${y[0]}</span>`, opts: [y, ...ds].map((x, i) => ({ html: `<span class="word">${L(x[2])}</span>`, ok: i === 0 })), cls: 'words', after: B(`A baby ${L(y[1])} is a ${L(y[2])}.`, `${y[1].ko}의 새끼는 ${y[2].ko}이에요.`), vocab: L(y[2]) });
    }
  }
});
