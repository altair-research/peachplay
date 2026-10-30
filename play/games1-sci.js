'use strict';
// Grade 1 science (Georgia Science GSE, 2016): S1E1 weather, S1P1 light and sound, S1P2 magnets, S1L1 plants and animals.
// The GCPS 1st-grade AKS also names animals and their young; that part is included at level 2 of "Animal Needs".
const AREA1S = (u) => B(`Grade 1 Science · ${u}`, `1학년 과학 · ${U_KO[u] || u}`);
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
  { id: 'cloud', n: B('dry clouds', '비 없는 구름'), ask: B('Which sky has clouds but no rain or snow?', '구름은 있지만 비나 눈은 내리지 않는 하늘은?'), clue: B('Clouds cover the sky. Nothing is falling from them. Which picture matches?', '구름이 하늘을 덮고 있어요. 구름에서 아무것도 내리지 않아요. 어떤 그림일까요?'), detail: B('Clouds do not always bring rain or snow.', '구름이 있어도 비나 눈이 내리지 않을 수 있어요.') },
  { id: 'wind', n: B('wind', '바람'), ask: B('Which picture shows wind blowing a windsock?', '바람이 불어 바람자루가 펴진 그림은?'), clue: B('Moving air stretches out a windsock. Which picture matches?', '움직이는 공기가 바람자루를 쭉 펴요. 어떤 그림일까요?'), detail: B('Wind is moving air. It blows the windsock out.', '바람은 움직이는 공기예요. 바람이 바람자루를 펴 줘요.') },
  { id: 'sun', n: B('sunny sky', '맑은 하늘'), ask: B('Which picture shows the sun in a clear sky?', '맑은 하늘에 해가 떠 있는 그림은?'), clue: B('The sun shines. There are no clouds in this sky. Which picture matches?', '해가 빛나요. 하늘에 구름이 없어요. 어떤 그림일까요?'), detail: B('This sky is clear, with no clouds.', '이 하늘에는 구름이 없고 맑아요.') }
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
    if(rnd(3)===0){const a=pick(PRECIP_PICS.filter(x=>x!==w)),pair=(x,y)=>B(`${x.n.en} → ${y.n.en}`,`${x.n.ko} → ${y.n.ko}`),two=lvl(this.id)===2;
      quiz(this,{ask:two?B('Which pair names the two observations in order?','두 관찰을 차례로 나타내는 짝은?'):B('What weather is shown in picture 2?','2번 그림에 나타난 날씨는?'),show:`<div class="story">1 ${precipPicture(a)} → 2 ${precipPicture(w)}</div>`,opts:sOpts(two?pair(a,w):w.n,two?[pair(w,a),pair(a,choices[1])]:[a.n,choices.find(x=>x!==a&&x!==w).n]),cls:'words'});return;}
    if (rnd(2) === 0) {
      quiz(this, { ask: B('What weather does this picture show?', '그림에 나타난 날씨는 무엇일까요?'), show: precipPicture(w), opts: choices.map(x => ({ html: `<span class="word">${L(x.n)}</span>`, ok: x === w })), cls: 'words', after: w.detail, vocab: w.n.en }); return;
    }
    quiz(this, { ask: lvl('precip') === 1 ? w.ask : w.clue, opts: choices.map(x => ({ html: precipPicture(x), ok: x === w })), cls: 'shapes', after: w.detail, vocab: w.n.en,
      // Reserve space for the engine's fixed Next button; this node is round-local.
      onRender() { document.getElementById('fact').style.marginBottom = 'calc(76px + env(safe-area-inset-bottom))'; }
    });
  }
});

// ---------- 3. Seasons ----------
const SEAS = [['winter', '겨울', '⛄', B('It is cold. Some places get snow.', '추워요. 눈이 오는 곳도 있어요.')], ['spring', '봄', '🌷', B('It is warm. Flowers bloom and it rains.', '따뜻해요. 꽃이 피고 비가 와요.')], ['summer', '여름', '🏖️', B('It is hot. The days are long.', '더워요. 낮이 길어요.')], ['fall', '가을', '🍂', B('It is cool. Leaves change color and drop to the ground.', '시원해요. 나뭇잎이 물들고 떨어져요.')]];
G1S({
  id: 'seasons1', icon: '🍂', title: B('Seasonal Patterns', '계절의 변화'), sub: B('What changes through the year?', '1년 동안 무엇이 바뀔까?'), u: 'Seasons',
  play() {
    const lv = lvl('seasons1'), kind = pick(lv === 1 ? ['feature', 'after', 'before'] : ['feature', 'after', 'ga', 'month']);
    if(kind==='before'){const i=rnd(4),ans=SEAS[(i+3)%4];quiz(this,{ask:B(`Which season comes just before ${SEAS[i][0]}?`,`${SEAS[i][1]} 바로 전 계절은?`),opts:[ans,...others(SEAS,ans,2)].map(x=>({html:`<span class="emo">${x[2]}</span>`,label:B(x[0],x[1]),ok:x===ans})),cls:'shapes'});return;}
    if (kind === 'feature') { const t = pick(SEAS), ds = others(SEAS, t, 2); quiz(this, { ask: B(`Which season is this? ${L(t[3])}`, `어느 계절일까요? ${t[3].ko}`), opts: [t, ...ds].map(s => ({ html: `<span class="emo">${s[2]}</span>`, label: B(s[0], s[1]), ok: s === t })), cls: 'shapes', after: B(`It is ${t[0]}!`, `${t[1]}이에요!`), vocab: t[0] }); }
    else if (kind === 'after') { const i = rnd(4), ans = SEAS[(i + 1) % 4], pool = SEAS.filter(x => x !== ans && x !== SEAS[i]); quiz(this, { ask: B(`Which season comes after ${SEAS[i][0]}?`, `${SEAS[i][1]} 다음 계절은?`), opts: [ans, ...shuffle(pool).slice(0, 2)].map(x => ({ html: `<span class="emo">${x[2]}</span>`, label: B(x[0], x[1]), ok: x === ans })), cls: 'shapes', after: B(`${ans[0]} comes after ${SEAS[i][0]}.`, `${SEAS[i][1]} 다음은 ${ans[1]}이에요.`) }); }
    else if (kind === 'ga') {
      const facts = [[B('In Georgia, which season is usually the hottest?', '조지아에서 가장 더운 계절은?'), SEAS[2]], [B('In which season do many trees lose their leaves?', '많은 나무가 잎을 떨구는 계절은?'), SEAS[3]], [B('When do peach trees bloom with pink flowers?', '복숭아나무에 분홍 꽃이 피는 계절은?'), SEAS[1]], [B('Which season is the coldest?', '가장 추운 계절은?'), SEAS[0]]], f = pick(facts), ds = others(SEAS, f[1], 2);
      quiz(this, { ask: f[0], opts: [f[1], ...ds].map(s => ({ html: `<span class="emo">${s[2]}</span>`, label: B(s[0], s[1]), ok: s === f[1] })), cls: 'shapes', after: B(`${f[1][0]}!`, `${f[1][1]}!`) });
    } else {
      const m = [[B('December, January, February', '12월, 1월, 2월'), SEAS[0]], [B('March, April, May', '3월, 4월, 5월'), SEAS[1]], [B('June, July, August', '6월, 7월, 8월'), SEAS[2]], [B('September, October, November', '9월, 10월, 11월'), SEAS[3]]], t = pick(m), ds = others(SEAS, t[1], 2);
      quiz(this, { ask: B(`Which season has ${t[0].en}?`, `${t[0].ko}은 어느 계절일까요?`), opts: [t[1], ...ds].map(s => ({ html: `<span class="emo">${s[2]}</span>`, label: B(s[0], s[1]), ok: s === t[1] })), cls: 'shapes', after: B(`${t[1][0]}`, `${t[1][1]}`) });
    }
  }
});

// ---------- 4. Magnet power ----------
const MAG_YES = [['📎', B('steel paper clip', '철제 클립')], ['🔩', B('iron bolt', '쇠 볼트')], ['🥫', B('steel can', '철제 캔')], ['🔧', B('steel wrench', '철제 렌치')], ['🔩',B('iron nail','쇠못')], ['🧷', B('steel safety pin', '철제 옷핀')], ['🪛', B('steel screwdriver', '철제 드라이버')]];
const MAG_NO = [['🪵', B('wooden log', '나무 통나무')], ['📄', B('paper sheet', '종이 한 장')], ['🧸', B('cloth teddy bear', '천 곰 인형')], ['🥤', B('plastic cup', '플라스틱 컵')], ['🍎', B('red apple', '빨간 사과')], ['🧦', B('cotton sock', '면 양말')], ['🖍️', B('wax crayon', '밀랍 크레용')]];   // material names too, so 'steel/iron' on the answer is not a length cue (O2)
const barMagnet = (dir, x) => `<g transform="translate(${x} 0)"><rect x="0" y="0" width="38" height="22" fill="${dir ? '#ef476f' : '#118ab2'}"/><rect x="38" y="0" width="38" height="22" fill="${dir ? '#118ab2' : '#ef476f'}"/><rect x="0" y="0" width="76" height="22" fill="none" stroke="#1d3557" stroke-width="2"/></g>`;
G1S({
  id: 'magnets1', icon: '🧲', title: B('Magnet Power', '자석의 힘'), sub: B('Attract and repel', '끌어당기고 밀어내요'), u: 'Magnets',
  play() {
    const lv = lvl('magnets1'), kind = pick(lv === 1 ? ['pick', 'pick', 'uses'] : ['pick', 'poles', 'poles', 'uses', 'iron']);
    if (rnd(3) === 0) {
      const material = pick([B('wood', '나무'), B('paper', '종이'), B('plastic', '플라스틱'), B('glass', '유리'), B('rubber', '고무')]);
      quiz(this, { ask: B(`Which material will a magnet pull on: iron or ${material.en}?`, `철과 ${material.ko} 중 자석이 끌어당기는 재료는 무엇일까요?`), opts: sOpts(B('iron', '철'), [material]), cls: 'words', after: B('A magnet attracts iron.', '자석은 철을 끌어당겨요.') }); return;
    }
    if (kind === 'pick') {
      const y = pick(MAG_YES), ds = shuffle(MAG_NO).slice(0, 2); quiz(this, { ask: B('Which one will a magnet pick up?', '자석이 끌어당기는 것은?'), show: '<span class="emo">🧲</span>', opts: [y, ...ds].map((x, i) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: i === 0 })), after: B(`A magnet pulls on ${y[1].en}. It has iron in it.`, `자석은 ${y[1].ko}에 붙어요. 철이 들어 있어요.`), vocab: 'attract' });
    } else if (kind === 'iron') {
      quiz(this, { ask: B('A magnet pulls on things made of ___.', '자석은 ___(으)로 만든 물건을 끌어당겨요.'), show: '<span class="emo">🧲</span>', opts: sOpts(tx('iron', '철'), [tx('wood', '나무'), tx('paper', '종이')]), cls: 'words', after: B('Magnets pull on things made of iron.', '자석은 철로 만든 물건을 끌어당겨요.'), vocab: 'iron' });
    } else if (kind === 'poles') {
      const f1 = rnd(2) === 1, f2 = rnd(2) === 1;                       // flip: false = red(N) on the left half, true = blue(S) on the left half
      const bar = (x, flip) => `<g transform="translate(${x} 0)"><rect width="38" height="22" fill="${flip ? '#118ab2' : '#ef476f'}"/><rect x="38" width="38" height="22" fill="${flip ? '#ef476f' : '#118ab2'}"/><rect width="76" height="22" fill="none" stroke="#1d3557" stroke-width="2"/><text x="19" y="16" font-size="14" font-weight="900" text-anchor="middle" fill="#fff">${flip ? 'S' : 'N'}</text><text x="57" y="16" font-size="14" font-weight="900" text-anchor="middle" fill="#fff">${flip ? 'N' : 'S'}</text></g>`;
      const facing1 = f1 ? 'N' : 'S', facing2 = f2 ? 'S' : 'N', attract = facing1 !== facing2;   // right half of the left bar meets the left half of the right bar
      quiz(this, { ask: B('Look at the two ends that face each other. Do the magnets pull together or push apart?', '마주 보는 두 끝을 봐요. 자석은 서로 끌어당길까요, 밀어낼까요?'), show: `<svg viewBox="0 0 220 40" class="magsvg"><g transform="translate(0 9)">${bar(4, f1)}${bar(140, f2)}</g></svg>`, opts: [{ html: `<span class="word">${S.lang === 'ko' ? '끌어당겨요' : 'attract (pull together)'}</span>`, ok: attract }, { html: `<span class="word">${S.lang === 'ko' ? '밀어내요' : 'repel (push apart)'}</span>`, ok: !attract }], cls: 'words', after: attract ? B('Different ends (N and S) attract.', '다른 극(N극과 S극)은 서로 끌어당겨요.') : B('The same ends (N and N, or S and S) repel.', '같은 극(N-N 또는 S-S)은 서로 밀어내요.'), vocab: attract ? 'attract' : 'repel' });
    } else {
      const u = [[B('a refrigerator magnet', '냉장고 자석'), '🧲'], [B('a magnetic toy', '자석 장난감'), '🧩'], [B('a magnetic latch on a cabinet', '찬장의 자석 잠금장치'), '🚪'], [B('a magnetic name tag', '자석 이름표'), '🏷️']], t = pick(u);
      const uses=[B('An iron paper clip moves toward a hidden tool before touching it. What could pull it?','쇠 클립이 닿기도 전에 숨긴 도구 쪽으로 움직여요. 어떤 도구일까요?'),B('An iron bolt moves toward a hidden tool before touching it. What could pull it?','쇠 볼트가 닿기도 전에 숨긴 도구 쪽으로 움직여요. 어떤 도구일까요?'),B('A steel can moves toward a hidden tool before touching it. What could pull it?','철제 캔이 닿기도 전에 숨긴 도구 쪽으로 움직여요. 어떤 도구일까요?'),B('A steel wrench moves toward a hidden tool before touching it. What could pull it?','철제 렌치가 닿기도 전에 숨긴 도구 쪽으로 움직여요. 어떤 도구일까요?')];
      quiz(this,{ask:uses[u.indexOf(t)],opts:sOpts(B('A magnet','자석'),[B('A string','끈'),B('A clip','집게')]),cls:'words'});
    }
  }
});

// ---------- 5. Light and shadows ----------
const shadowSvg = (d) => { const lightX = 24, wallX = 250, objH = 40, sh = Math.min(96, objH * (wallX - lightX) / d), ox = lightX + d; return `<svg viewBox="0 0 280 120" class="shsvg"><circle cx="${lightX}" cy="60" r="12" fill="#ffd166" stroke="#c9951b" stroke-width="2"/><rect x="${ox - 5}" y="${60 - objH / 2}" width="10" height="${objH}" rx="3" fill="#5aa9e6" stroke="#1d3557" stroke-width="2"/><rect x="${wallX}" y="${60 - sh / 2}" width="10" height="${sh}" rx="3" fill="#33384d"/><line x1="${wallX}" y1="10" x2="${wallX}" y2="110" stroke="#aab" stroke-width="1"/></svg>`; };
G1S({
  id: 'light1', icon: '🔦', title: B('Light and Shadows', '빛과 그림자'), sub: B('Sources of light, big and small shadows', '빛을 내는 것, 큰 그림자와 작은 그림자'), u: 'Light',
  play() {
    const lv = lvl('light1'), kind = pick(lv === 1 ? ['source', 'source', 'see'] : ['source', 'see', 'shadow', 'shadow', 'dir']);
    if (rnd(3) === 0) {
      const object = pick([B('a book', '책'), B('a ball', '공'), B('a chair', '의자')]);
      quiz(this, { ask: B(`Can you see ${object.en} in total darkness?`, `아주 깜깜하면 ${object.ko}이(가) 보일까요?`), opts: sOpts(B('No, light is needed.', '아니요, 빛이 필요해요.'), [B('Yes, even in darkness.', '네, 어두워도 보여요.')]), cls: 'words sents', after: B('Light must reach our eyes for us to see an object.', '물체를 보려면 빛이 우리 눈에 들어와야 해요.') }); return;
    }
    if (kind === 'source') {
      const yes = [['☀️', B('sun', '해')], ['💡', B('lamp', '전등')], ['🔦', B('flashlight', '손전등')], ['🕯️', B('candle', '촛불')]], no = [['📖', B('book', '책')], ['🪨', B('rock', '돌')], ['⚽', B('ball', '공')], ['🪑', B('chair', '의자')]], y = pick(yes), ds = shuffle(no).slice(0, 2);
      quiz(this, { ask: B('Which one is a source of light? It makes its own light.', '빛을 내는 것은 어느 것일까요? 스스로 빛을 만들어요.'), opts: [y, ...ds].map((x, i) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: i === 0 })), after: B(`A ${y[1].en} gives off light.`, `${y[1].ko}: 스스로 빛을 내요.`), vocab: 'light' });
    } else if (kind === 'see') {
      quiz(this, { ask: B('You are in a very dark room. Why can you not see the toys?', '아주 깜깜한 방에 있어요. 장난감이 왜 안 보일까요?'), show: '<span class="emo">🌑🧸</span>', opts: sOpts(tx('There is no light.', '빛이 없어요.'), [tx('The toys are quiet.', '장난감이 조용해요.'), tx('The toys are cold.', '장난감이 차가워요.')]), cls: 'words sents', after: B('We need light to see things.', '물건을 보려면 빛이 필요해요.') });
    } else if (kind === 'shadow') {
      const near = rnd(2) === 0, a = 70, b = 190; quiz(this, { ask: near ? B('Is the shadow BIGGER close to the light, or far?', '그림자가 더 큰 때는 가까울 때, 멀 때?') : B('Which picture has the SMALLER shadow?', '그림자가 더 작은 그림은 어느 것일까요?'), askSay: near ? B('When is the shadow bigger, close to the light or far?', '그림자가 더 큰 때는 빛에 가까울 때일까요, 멀 때일까요?') : B('Which picture has the smaller shadow?', '그림자가 더 작은 그림은 어느 것일까요?'), show: near ? '' : '', opts: near ? [{ html: `<span class="word">${L(B('Close to the light', '빛에 가까울 때'))}</span>`, ok: true }, { html: `<span class="word">${L(B('Far from the light', '빛에서 멀 때'))}</span>`, ok: false }] : [{ html: shadowSvg(a), ok: false }, { html: shadowSvg(b), ok: true }], cls: near ? 'words' : 'groups', after: B('The closer the object is to the light, the bigger the shadow.', '물체가 빛에 가까울수록 그림자가 커져요.') });
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
    if (rnd(2) === 0) {
      const source = pick([B('a drum being hit', '두드리는 북'), B('a plucked guitar string', '튕긴 기타 줄'), B('a ringing bell', '울리는 종'), B('a plucked rubber band', '튕긴 고무줄')]);
      quiz(this, { ask: B(`What makes the sound in ${source.en}?`, `${source.ko}: 무엇 때문에 소리가 날까요?`), opts: sOpts(B('Vibration', '진동(떨림)'), [B('Air moving past it', '옆을 지나는 바람'), B('Hands warming it', '손으로 데우기')]), cls: 'words', after: B('Vibrating objects can make sounds.', '물체가 떨리면 소리가 날 수 있어요.') }); return;
    }
    if (kind === 'vib') {
      quiz(this, { ask: B('Sound is made when something ___ back and forth very fast.', '무언가가 아주 빠르게 앞뒤로 ___ 소리가 만들어져요.'), show: '<span class="emo">🎸〰️</span>', opts: sOpts(tx('vibrates (shakes)', '떨리면 (진동하면)'), [tx('stays still', '가만히 있으면'), tx('gets warmer', '따뜻해지면')]), cls: 'words', after: B('A vibration makes sound.', '진동이 소리를 만들어요.'), vocab: 'vibrate' });
    } else if (kind === 'source') {
      const yes = [['🥁', B('a drum being hit', '두드리는 북')], ['🎸', B('a guitar string being plucked', '튕기는 기타 줄')], ['🔔', B('a ringing bell', '울리는 종')]], no = [['🪨', B('a rock sitting still', '가만히 있는 돌')], ['📖', B('a closed book', '덮은 책')], ['🧸', B('a teddy bear on a bed', '침대 위의 곰 인형')]], y = pick(yes), ds = shuffle(no).slice(0, 2);
      quiz(this, { ask: B('Which one makes a sound?', '소리가 나는 것은?'), opts: [y, ...ds].map((x, i) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: i === 0 })), after: B('It vibrates, so it makes a sound.', '진동해서 소리가 나요.') });
    } else if (kind === 'feel') {
      quiz(this, { ask: B('Hum and touch your throat. What do you feel?', '콧노래를 부르며 목을 만져 봐요. 무엇이 느껴질까요?'), show: '<span class="emo">🎶🤚</span>', opts: sOpts(tx('A tiny vibration', '작은 떨림'), [tx('Something cold', '차가운 것'), tx('Something wet', '젖은 것')]), cls: 'words', after: B('Your throat vibrates when you hum.', '콧노래를 부르면 목이 떨려요.') });
    } else {
      const items = [[B('a loud whistle', '크게 부는 호루라기'), true], [B('a flashing flashlight', '깜빡이는 손전등'), true], [B('a quiet whisper', '아주 작은 속삭임'), false], [B('a tiny candle indoors', '집 안의 작은 촛불'), false]];
      const good = pick(items.filter(x => x[1])), bad = shuffle(items.filter(x => !x[1]));
      quiz(this, { ask: B('Which help signal can people far away notice?', '멀리 있는 사람이 알아챌 도움 신호는?'), opts: [good, ...bad].map(x => ({ html: `<span class="word">${L(x[0])}</span>`, ok: x === good })), cls: 'words sents', after: B('Loud sounds and bright lights can be seen or heard from far away.', '큰 소리와 밝은 빛은 멀리서도 보이고 들려요.') });
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
    } else {
      return this.careNeed();
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
      return this.careNeed();
    } else if (kind === 'shelter') {
      const homes = [['🐦', B('A bird', '새'), B('a nest', '둥지')], ['🐝', B('Honey bees', '꿀벌'), B('a hive', '벌집')], ['🐻', B('A bear', '곰'), B('a cave', '동굴')], ['🐶', B('A dog', '개'), B('a doghouse', '개집')]], h = pick(homes), ds = shuffle(homes.filter(x => x !== h)).slice(0, 2);
      quiz(this, { ask: B(`Where ${h[0] === '🐝' ? 'do' : 'does'} ${L(h[1]).toLowerCase()} find shelter?`, `${h[1].ko}의 집은 어디일까요?`), show: `<span class="emo">${h[0]}</span>`, opts: [h, ...ds].map((x, i) => ({ html: `<span class="word">${L(x[2])}</span>`, ok: i === 0 })), cls: 'words', after: B(`${L(h[1])} ${h[0] === '🐝' ? 'live' : 'lives'} in ${L(h[2])}.`, `${h[2].ko}: ${h[1].ko}의 집이에요.`) });
    } else if (kind === 'both' || kind === 'solve') {
      return this.careNeed();
    } else {
      const y = pick(YOUNG), ds = shuffle(YOUNG.filter(x => x !== y)).slice(0, 2);
      quiz(this, { ask: B(`What is a baby ${L(y[1])} called?`, `${y[1].ko}의 새끼는 무엇이라고 부를까요?`), show: `<span class="emo">${y[0]}</span>`, opts: [y, ...ds].map((x, i) => ({ html: `<span class="word">${L(x[2])}</span>`, ok: i === 0 })), cls: 'words', after: B(`A baby ${L(y[1])} is a ${L(y[2])}.`, `${y[1].ko}의 새끼는 ${y[2].ko}이에요.`), vocab: L(y[2]) });
    }
  }
});

// 63a: care choices address the observed condition, not toys versus essentials.
(() => {
 const bank=[
  [B('The soil feels dry.','흙이 말랐어요.'),B('The soil is dry; the plant already gets light.','빛을 받는 식물의 흙이 말랐어요.'),[B('Water the soil','흙에 물을 줘요'),B('Move it to light','더 밝은 곳으로 옮겨요'),B('Add more soil','흙을 더 넣어요')]],
  [B('The plant is in a dark cupboard.','식물이 어두운 찬장 안에 있어요.'),B('The soil is damp; the plant is in a dark cupboard.','흙이 촉촉한 식물이 어두운 찬장 안에 있어요.'),[B('Move it into daylight','빛이 드는 곳으로 옮겨요'),B('Water the soil again','흙에 물을 더 줘요'),B('Add more soil','흙을 더 넣어요')]]
 ];
 const animals=[
  [B('The drinking bowl is empty.','마실 그릇이 비었어요.'),B('The rabbit has hay to eat but an empty drinking bowl.','먹을 건초가 있는 토끼의 마실 그릇이 비었어요.'),[B('Fill its drinking bowl','마실 그릇을 채워요'),B('Add more hay','건초를 더 줘요'),B('Add bedding','깔짚을 더 넣어요')]],
  [B('The food bowl is empty.','먹이 그릇이 비었어요.'),B('The dog has a bed and water but an empty food bowl.','집과 물이 있는 강아지의 먹이 그릇이 비었어요.'),[B('Fill its food bowl','먹이 그릇을 채워요'),B('Fill its drinking bowl','마실 그릇을 채워요'),B('Make its bed softer','잠자리를 푹신하게 해요')]]
 ];
 for(const [id,qs]of [['plants1',bank],['animals1',animals]]){
  const g=GAMES.find(g=>g.id===id);
  g.careNeed=function(){const q=pick(qs);quiz(this,{ask:B('Which care helps now?','지금 어떤 돌봄이 도움이 될까요?'),show:`<div class="storytext">${L(q[lvl(id)-1])}</div>`,askExtra:{t:L(q[lvl(id)-1])},opts:q[2].map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0})),cls:'words'});};
 }
})();

// 65: additional observations use the existing light, vibration and care concepts.
(() => {
 const round=(g,ask,text,right,wrong)=>quiz(g,{ask,askExtra:{t:L(text)},show:`<div class="storytext">${L(text)}</div>`,opts:sOpts(right,wrong),cls:'words'});
 const light=GAMES.find(g=>g.id==='light1'),oldLight=light.play;
 light.play=function(){if(rnd(2))return oldLight.call(this);const obj=pick([B('book','책'),B('ball','공'),B('chair','의자'),B('rock','돌')]),on=rnd(2)===0;
 if(lvl(this.id)===2){const hidden=B('Hidden → visible → hidden','안 보임 → 보임 → 안 보임'),visible=B('Visible → hidden → visible','보임 → 안 보임 → 보임');round(this,B('Which sequence matches what you can see?','보이는 모습의 순서에 맞는 것은?'),B(`Only one lamp lights a ${obj.en}. It starts ${on?'off':'on'}. Switch it ${on?'on, then off':'off, then on'}.`,`${obj.ko} 옆에 전등 하나만 있어요. 처음에는 ${on?'꺼져':'켜져'} 있어요. ${on?'켠 다음 꺼요':'끈 다음 켜요'}.`),on?hidden:visible,[on?visible:hidden,on?B('Hidden → hidden → visible','안 보임 → 안 보임 → 보임'):B('Visible → visible → hidden','보임 → 보임 → 안 보임')]);return;}
 round(this,B('What changes in what you can see?','보이는 모습은 어떻게 바뀔까요?'),B(`In a room with no other light, a lamp is turned ${on?'on':'off'} beside a ${obj.en}.`,`다른 빛이 없는 방에서 ${obj.ko} 옆 전등을 ${on?'켜요':'꺼요'}.`),on?B('We can see it','모습이 보여요'):B('We cannot see it','모습이 안 보여요'),[on?B('We cannot see it','모습이 안 보여요'):B('We can see it','모습이 보여요'),B('Its shape changes','모양이 바뀌어요')]);};
 const sound=GAMES.find(g=>g.id==='sound1'),oldSound=sound.play;
 sound.play=function(){if(rnd(2))return oldSound.call(this);const obj=pick([B('drum skin','북의 가죽'),B('guitar string','기타 줄'),B('bell','종'),B('rubber band','고무줄')]);
 if(lvl(this.id)===2){round(this,B('Which sound sequence follows both actions?','두 행동에 맞는 소리의 순서는?'),B(`A ${obj.en} makes a sound. Stop its movement, then set it moving again.`,`${obj.ko}에서 소리가 나요. 움직임을 멈췄다가 다시 움직이게 해요.`),B('Sound → quiet → sound','소리 → 조용 → 소리'),[B('Sound → sound → quiet','소리 → 소리 → 조용'),B('Quiet → sound → quiet','조용 → 소리 → 조용')]);return;}
 round(this,B('What happens to the sound?','소리는 어떻게 될까요?'),B(`A ${obj.en} makes a sound. Its movement is completely stopped.`,`${obj.ko}에서 소리가 나요. 움직임을 완전히 멈춰요.`),B('It stops','소리가 멈춰요'),[B('It gets louder','소리가 더 커져요'),B('It stays the same','같은 소리가 나요')]);};
 const plant=GAMES.find(g=>g.id==='plants1'),oldPlant=plant.play;
 plant.play=function(){if(rnd(2))return oldPlant.call(this);const letter=pick(Object.keys(PLANT_PARTS)),names=Object.values(PLANT_PARTS);
 quiz(this,{ask:B(`What part is marked ${letter}?`,`${letter}로 표시한 부분은?`),show:plantSvg(),opts:sOpts(PLANT_PARTS[letter],others(names,PLANT_PARTS[letter],2)),cls:'words'});};
 // Independent conditions: identifying the missing provision is different from a toy foil.
 const care=[
 [B('A seedling has light and damp soil, but its roots have outgrown a tiny pot.','빛과 촉촉한 흙이 있지만 새싹 뿌리가 작은 화분을 꽉 채웠어요.'),B('Give roots more room','뿌리 자리를 넓혀 줘요'),[B('Add more water','물을 더 줘요'),B('Move it into shade','그늘로 옮겨요')]],
 [B('A plant has damp soil and room, but a cover blocks the daylight.','흙이 촉촉하고 자리도 있지만 덮개가 빛을 막아요.'),B('Remove the cover','덮개를 치워요'),[B('Add more water','물을 더 줘요'),B('Use a larger pot','큰 화분으로 옮겨요')]],
 [B('A plant has daylight and room, but no water has reached its dry roots.','빛과 자리는 있지만 마른 뿌리에 물이 닿지 않았어요.'),B('Water the roots','뿌리에 물을 줘요'),[B('Use a larger pot','큰 화분으로 옮겨요'),B('Add a cover','덮개를 씌워요')]],

 ];
 const oldCare=plant.careNeed;plant.careNeed=function(){if(rnd(2))return oldCare.call(this);const q=pick(lvl(this.id)===1?care.slice(0,2):care);round(this,B('Which change meets the missing need?','부족한 것을 채우는 방법은?'),q[0],q[1],q[2]);};
 const animal=GAMES.find(g=>g.id==='animals1'),oldAnimal=animal.play;
 animal.play=function(){if(rnd(2))return oldAnimal.call(this);const y=pick(YOUNG);quiz(this,{ask:B(`What is a baby ${y[1].en} called?`,`${y[1].ko}의 새끼 이름은?`),show:`<span class="emo">${y[0]}</span>`,opts:sOpts(y[2],others(YOUNG,y,2).map(x=>x[2])),cls:'words'});};
})();

// 70a: grade-1 questions are one sentence. Extra clue sentences in a question move to the read-aloud
// material (storytext gets core's 🔊); the sentence with "?" (or the last one) stays as the question.
(() => {
 const sentences = t => String(t).split(/(?<=[.!?])\s+(?=[A-Z가-힣"'(])/).filter(Boolean);
 const cut = t => { const all = sentences(t); if (all.length < 2) return ['', t]; const q = all.filter(x => /\?/.test(x)); if (q.length > 1) return ['', t]; const ask = q.length ? q[0] : all[all.length - 1]; return [all.filter(x => x !== ask).join(' '), ask]; };
 const split = item => {
  if (!item || !item.ask || typeof item.ask !== 'object') return item;
  const en = cut(item.ask.en), ko = cut(item.ask.ko);
  if (!en[0] && !ko[0]) return item;
  const ctx = B(en[0], ko[0]);
  return { ...item, ask: B(en[1], ko[1]), askSay: item.askSay || item.ask, show: `<div class="storytext">${L(ctx)}</div>` + (item.show || '') };
 };
 for (const id of ["weather1","seasons1","magnets1","light1","sound1","precip","plants1"]) {
  const game = GAMES.find(g => g.id === id), play = game.play;
  game.play = function () { const raw = window.quiz; window.quiz = (g, item) => { window.quiz = raw; return raw(g, split(item)); }; try { return play.apply(this, arguments); } finally { window.quiz = raw; } };
 }
})();
