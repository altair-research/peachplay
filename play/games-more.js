'use strict';
// More games, modeled on common K workbook problem types (original content; see docs/workbook-research.md):
// quantity matching, number line hops, clocks, coins, opposites, ending sounds, story order, cause & effect,
// color mixing, feelings, days/seasons, and a robot-directions coding puzzle.

// ---------- SVG helpers ----------
const tfSvg = (n, col = '#ef476f') => `<svg viewBox="0 0 110 46" class="qsvg"><rect x="1" y="1" width="108" height="44" rx="6" fill="#fff" stroke="#1d3557" stroke-width="2"/>${Array.from({ length: 10 }, (_, i) => { const r = Math.floor(i / 5), c = i % 5; return `<rect x="${4 + c * 21}" y="${4 + r * 20}" width="19" height="19" rx="3" fill="#eef" stroke="#99a" stroke-width=".8"/>${i < n ? `<circle cx="${13.5 + c * 21}" cy="${13.5 + r * 20}" r="6.5" fill="${col}"/>` : ''}`; }).join('')}</svg>`;
const DICE = { 1: [[1, 1]], 2: [[0, 0], [2, 2]], 3: [[0, 0], [1, 1], [2, 2]], 4: [[0, 0], [2, 0], [0, 2], [2, 2]], 5: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 6: [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]] };
const diceSvg = (n, col = '#118ab2') => `<svg viewBox="0 0 50 50" class="qsvg die"><rect x="2" y="2" width="46" height="46" rx="9" fill="#fff" stroke="#1d3557" stroke-width="2.4"/>${DICE[n].map(p => `<circle cx="${12 + p[0] * 13}" cy="${12 + p[1] * 13}" r="5" fill="${col}"/>`).join('')}</svg>`;
const SPOTS = [[14, 12], [46, 9], [80, 14], [26, 32], [60, 30], [94, 32], [12, 52], [44, 50], [76, 50], [98, 52]];
const scatterSvg = (n, col = '#06d6a0') => `<svg viewBox="0 0 110 62" class="qsvg"><rect x="1" y="1" width="108" height="60" rx="8" fill="#fff" stroke="#1d3557" stroke-width="2"/>${shuffle(SPOTS).slice(0, n).map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="6" fill="${col}"/>`).join('')}</svg>`;
const AREA_LIFE = (u) => B(`Me & My World · ${u}`, `나와 우리 주변 · ${u}`);

// ---------- 1. Quantity: which picture shows this number? ----------
registerGame({
  id: 'quantity', subject: 'math', icon: '🎲', title: B('Show Me the Number', '수만큼 찾기'), sub: B('Match numbers to dots', '숫자와 점 짝 맞추기'),
  area: AREA_MATH('Counting & cardinality'),
  play() {
    if(lvl('quantity')===2){const a=1+rnd(4),b=1+rnd(5),n=a+b;quiz(this,{ask:B(`Which dots make ${n} in all?`,`모두 ${n}개가 되게 하는 점은?`),askSay:B(`There are ${n} dots in all. Which picture shows the hidden dots?`,`점은 모두 ${n}개예요. 가린 점은 어느 그림일까요?`),show:tfSvg(a)+` + ? = <span class="num">${n}</span>`,opts:[b,b+1,b===1?3:b-1].map(v=>({html:tfSvg(v),ok:v===b})),cls:'groups'});return;}
    const lv = lvl('quantity'), n = lv === 1 ? 1 + rnd(8) : 3 + rnd(8), set = new Set([n]);
    while (set.size < 3) { const v = n + pick([-2, -1, 1, 2]); if (v >= 1 && v <= 10) set.add(v); }
    const maker = (v) => { const kinds = [() => tfSvg(v), () => scatterSvg(v)]; if (v <= 6) kinds.push(() => diceSvg(v)); return pick(kinds)(); };
    quiz(this, {
      ask: B(`Which one shows ${n}?`, `${n}을(를) 나타내는 것은 어느 것일까요?`), show: `<span class="num bignum">${n}</span>`,
      opts: [...set].map(v => ({ html: maker(v), ok: v === n })), cls: 'groups', after: B(`${n}!`, `${n}!`)
    });
  }
});

// ---------- 2. Number line hops ----------
const nlSvg = (at, arcFrom) => {
  const x = (i) => 6 + i * 10.8;
  let s = `<line x1="${x(0)}" y1="22" x2="${x(10)}" y2="22" stroke="#1d3557" stroke-width="1.6"/>`;
  for (let i = 0; i <= 10; i++) s += `<line x1="${x(i)}" y1="19" x2="${x(i)}" y2="25" stroke="#1d3557" stroke-width="1.2"/><text x="${x(i)}" y="32" font-size="5.6" text-anchor="middle" fill="#1d3557" font-weight="700">${i}</text>`;
  if (arcFrom !== undefined) s += `<path d="M${x(arcFrom)} 17 Q${(x(arcFrom) + x(at)) / 2} ${3} ${x(at)} 17" fill="none" stroke="#06d6a0" stroke-width="1.6" stroke-dasharray="2.5 2" marker-end="none"/>`;
  s += `<text x="${x(at)}" y="15" font-size="10" text-anchor="middle">🐸</text>`;
  return `<svg viewBox="0 0 120 36" class="nlsvg">${s}</svg>`;
};
registerGame({
  id: 'numline', subject: 'math', icon: '🐸', title: B('Frog Hops', '개구리 뛰기'), sub: B('Hop on the number line', '수직선에서 뛰어요'),
  area: AREA_MATH('Add & subtract'),
  play() {
    const lv = lvl('numline'), back = lv === 2 && rnd(2) === 0;
    let a, b, ans;
    if (back) { a = 3 + rnd(8); b = 1 + rnd(Math.min(3, a)); ans = a - b; } else { a = rnd(8); b = 1 + rnd(Math.min(lv === 1 ? 3 : 5, 10 - a)); ans = a + b; }
    quiz(this, {
      ask: back ? B(`The frog hops ${b} back—where does it land?`, `개구리가 뒤로 ${b}칸 뛰면 어디일까요?`) : B(`The frog hops ${b} forward—where does it land?`, `개구리가 앞으로 ${b}칸 뛰면 어디일까요?`),
      askSay: back ? B(`The frog is on ${a}. It hops ${b} back. Where does it land?`, `개구리는 ${a}에 있어요. 뒤로 ${b}칸 뛰면 어디에 도착할까요?`) : B(`The frog is on ${a}. It hops ${b} forward. Where does it land?`, `개구리는 ${a}에 있어요. 앞으로 ${b}칸 뛰면 어디에 도착할까요?`),
      show: nlSvg(a), opts: numOpts(ans, 0, 10), after: back ? B(`${a} minus ${b} is ${ans}.`, `${a} 빼기 ${b}는 ${ans}.`) : B(`${a} plus ${b} is ${ans}.`, `${a} 더하기 ${b}는 ${ans}.`),
      onCorrect() { $('.show').innerHTML = nlSvg(ans, a); }
    });
  }
});

// ---------- 3. Clock (o'clock) ----------
const clockSvg = (h) => { let s = '<circle cx="50" cy="50" r="46" fill="#fff" stroke="#1d3557" stroke-width="3"/>'; for (let i = 1; i <= 12; i++) { const a = (i * 30 - 90) * Math.PI / 180; s += `<text x="${50 + 36 * Math.cos(a)}" y="${50 + 36 * Math.sin(a) + 3.5}" font-size="10" font-weight="800" text-anchor="middle" fill="#1d3557">${i}</text>`; }
  const ha = (h * 30 - 90) * Math.PI / 180; s += `<line x1="50" y1="50" x2="${50 + 22 * Math.cos(ha)}" y2="${50 + 22 * Math.sin(ha)}" stroke="#ef476f" stroke-width="5" stroke-linecap="round"/><line x1="50" y1="50" x2="50" y2="14" stroke="#118ab2" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="3.4" fill="#1d3557"/>`;
  return `<svg viewBox="0 0 100 100" class="clocksvg">${s}</svg>`; };
registerGame({
  id: 'clock', subject: 'math', icon: '🕒', title: B('What Time Is It?', '몇 시일까?'), sub: B("O'clock times", '정각 읽기'),
  area: AREA_MATH('Time (enrichment)'),
  play() {
    if(lvl('clock')===2){const h=1+rnd(12),step=1+rnd(2),a=(h+step-1)%12+1;quiz(this,{ask:B(`What time is it ${step} hour${step>1?'s':''} later?`,`${step}시간 뒤는 몇 시일까요?`),askSay:B(`Look at the clock. What time is it ${step} hour${step>1?'s':''} later?`,`시계를 보세요. ${step}시간 뒤는 몇 시일까요?`),show:clockSvg(h),opts:[a,h,(h-step+11)%12+1].map(v=>({html:`<span class="num eq">${v}:00</span>`,ok:v===a})),cls:'shapes'});return;}
    const h = 1 + rnd(12), set = new Set([h]); while (set.size < (lvl('clock') === 2 ? 4 : 3)) { const v = ((h - 1 + pick([-2, -1, 1, 2, 3])) % 12 + 12) % 12 + 1; set.add(v); }
    quiz(this, {
      ask: B('What time does the clock show?', '시계가 가리키는 시각은?'), show: clockSvg(h),
      opts: [...set].map(v => ({ html: `<span class="num eq">${v}:00</span>`, ok: v === h })), cls: 'shapes', after: B(`It is ${h} o'clock.`, `${h}시예요.`), vocab: `${h} o'clock`
    });
  }
});

// ---------- 4. Days of the week and seasons ----------
const DAYS = [['Sunday', '일요일'], ['Monday', '월요일'], ['Tuesday', '화요일'], ['Wednesday', '수요일'], ['Thursday', '목요일'], ['Friday', '금요일'], ['Saturday', '토요일']];
const SEASONS = [['winter', '겨울', '⛄', B('It is cold and snowy.', '춥고 눈이 와요.')], ['spring', '봄', '🌷', B('Flowers bloom.', '꽃이 피어요.')], ['summer', '여름', '🏖️', B('It is hot and sunny.', '덥고 햇살이 강해요.')], ['fall', '가을', '🍂', B('Leaves turn orange and drop from trees.', '나뭇잎이 떨어져요.')]];
registerGame({
  id: 'days', subject: 'life', icon: '📅', title: B('Days & Seasons', '요일과 계절'), sub: B('What comes next?', '다음은 무엇일까?'),
  area: AREA_LIFE('Calendar'),
  play() {
    if (rnd(2) === 0 && lvl('days') === 2 || rnd(3) === 0) {                         // seasons
      const t = pick(SEASONS), ds = others(SEASONS, t, 2), o = (s) => ({ html: `<span class="emo">${s[2]}</span>`, label: B(s[0], s[1]), ok: s === t });
      quiz(this, { ask: B('Which season is this?', '어느 계절일까요?'), askSay: B(`${t[3].en} Which season is this?`, `${t[3].ko} 어느 계절일까요?`), show: `<div class="bigword" style="font-size:clamp(18px,3dvh,24px)">${L(t[3])}</div>`, opts: [o(t), ...ds.map(o)], cls: 'shapes', after: B(`It is ${t[0]}!`, `${t[1]}이에요!`), vocab: t[0] });
      return;
    }
    const i = rnd(7), kind = pick(lvl('days') === 1 ? ['after', 'after', 'weekend'] : ['after', 'before', 'weekend']);
    if (kind === 'weekend') {
      const good = pick([0, 6]), bad = others([1, 2, 3, 4, 5], -1, 2), o = (d, ok) => ({ html: `<span class="word">${DAYS[d][0]}</span>`, label: S.lang === 'ko' ? DAYS[d][1] : null, ok });
      quiz(this, { ask: B('Which day is part of the weekend?', '주말인 요일은 무엇일까요?'), opts: [o(good, true), ...bad.map(d => o(d, false))], cls: 'words', after: B('Saturday and Sunday are the weekend.', '토요일과 일요일이 주말이에요.') });
      return;
    }
    const ans = kind === 'after' ? (i + 1) % 7 : (i + 6) % 7, ds = others([0, 1, 2, 3, 4, 5, 6].filter(d => d !== ans && d !== i), -1, 2);
    quiz(this, {
      ask: kind === 'after' ? B(`What day comes after ${DAYS[i][0]}?`, `${DAYS[i][1]} 다음 요일은?`) : B(`What day comes before ${DAYS[i][0]}?`, `${DAYS[i][1]} 전 요일은?`),
      opts: [ans, ...ds].map(d => ({ html: `<span class="word">${DAYS[d][0]}</span>`, label: S.lang === 'ko' ? DAYS[d][1] : null, ok: d === ans })), cls: 'words', after: B(`${DAYS[ans][0]}!`, `${DAYS[ans][1]}!`), vocab: DAYS[ans][0]
    });
  }
});

// ---------- 5. Coins (personal finance) ----------
const COINS = { penny: { v: 1, r: 22, f: '#c47a43', s: '#8a4f23', t: 'ONE CENT', n: B('penny', '페니') }, nickel: { v: 5, r: 26, f: '#d6dbe0', s: '#8e99a4', t: 'FIVE CENTS', n: B('nickel', '니켈') },
  dime: { v: 10, r: 19, f: '#dfe4e8', s: '#8e99a4', t: 'ONE DIME', n: B('dime', '다임') }, quarter: { v: 25, r: 30, f: '#cfd5da', s: '#7d8893', t: 'QUARTER', n: B('quarter', '쿼터') } };
const coinSvg = (k) => { const c = COINS[k]; return `<svg viewBox="0 0 64 64" class="coinsvg"><circle cx="32" cy="32" r="${c.r}" fill="${c.f}" stroke="${c.s}" stroke-width="3"/><circle cx="32" cy="32" r="${c.r - 5}" fill="none" stroke="${c.s}" stroke-width="1" stroke-dasharray="2 2"/><text x="32" y="${k === 'dime' ? 34 : 35}" font-size="${k === 'quarter' ? 6.4 : 5.6}" font-weight="800" text-anchor="middle" fill="${c.s}">${c.t.split(' ')[0]}</text>${c.t.split(' ')[1] ? `<text x="32" y="${k === 'dime' ? 40 : 41}" font-size="5.6" font-weight="800" text-anchor="middle" fill="${c.s}">${c.t.split(' ')[1]}</text>` : ''}</svg>`; };
registerGame({
  id: 'coins', subject: 'ss', icon: '🪙', title: B('Coins', '동전'), sub: B('Penny, nickel, dime, quarter', '페니, 니켈, 다임, 쿼터'),
  area: AREA_SS('Personal finance'),
  play() {
    const lv = lvl('coins'), keys = Object.keys(COINS), mode = lv === 1 ? pick(['value', 'coin', 'pennies']) : pick(['value', 'coin', 'pennies', 'mixed']);
    if (mode === 'value') {
      const k = pick(keys), vals = [1, 5, 10, 25], set = new Set([COINS[k].v]); while (set.size < 3) set.add(pick(vals));
      quiz(this, { ask: B(`How many cents is a ${COINS[k].n.en.toUpperCase()} worth?`, `${COINS[k].n.ko}은(는) 몇 센트일까요?`), askSay: B(`How many cents is a ${COINS[k].n.en} worth?`, `${COINS[k].n.ko}은(는) 몇 센트일까요?`), show: coinSvg(k),
        opts: [...set].map(v => ({ html: `<span class="num">${v}¢</span>`, ok: v === COINS[k].v })), after: B(`A ${COINS[k].n.en} is worth ${COINS[k].v} cents.`, `${COINS[k].n.ko}은(는) ${COINS[k].v}센트예요.`), vocab: `A ${COINS[k].n.en} is worth ${COINS[k].v} cents.` });
    } else if (mode === 'coin') {
      const t = pick(keys), ds = others(keys, t, 2), o = (k) => ({ html: coinSvg(k), label: lv === 1 ? COINS[k].n : null, ok: k === t });
      quiz(this, { ask: B(`Which coin is worth ${COINS[t].v} cents?`, `${COINS[t].v}센트인 동전은 어느 것일까요?`), opts: [o(t), ...ds.map(o)], cls: 'shapes', after: B(`The ${COINS[t].n.en} is worth ${COINS[t].v} cents.`, `${COINS[t].n.ko}이(가) ${COINS[t].v}센트예요.`), vocab: COINS[t].n.en });
    } else {
      const n = 1 + rnd(mode === 'pennies' ? 9 : 4), nk = mode === 'mixed' ? 1 + rnd(2) : 0, total = n + nk * 5;
      const show = `<div class="coinrow">${Array.from({ length: nk }, () => coinSvg('nickel')).join('')}${Array.from({ length: n }, () => coinSvg('penny')).join('')}</div>`;
      quiz(this, { ask: B('How many cents in all?', '모두 몇 센트일까요?'), show, opts: numOpts(total, 1, 25), after: B(`${total} cents!`, `${total}센트!`) });
    }
  }
});

// ---------- 6. Opposites ----------
const OPP = [[['hot', '뜨거워요', '🔥'], ['cold', '차가워요', '🧊']], [['up', '위', '⬆️'], ['down', '아래', '⬇️']], [['day', '낮', '☀️'], ['night', '밤', '🌙']], [['happy', '기뻐요', '😀'], ['sad', '슬퍼요', '😢']],
  [['big', '커요', '🐘'], ['small', '작아요', '🐭']], [['fast', '빨라요', '🐇'], ['slow', '느려요', '🐢']], [['wet', '젖었어요', '💧'], ['dry', '말랐어요', '🏜️']], [['old', '나이 들었어요', '👴'], ['young', '어려요', '👶']],
  [['tall', '키가 커요', '🦒'], ['short', '키가 작아요', '🐁']], [['open', '열려 있어요', '📖'], ['closed', '닫혀 있어요', '📕']]];
registerGame({
  id: 'opposites', subject: 'read', icon: '↔️', title: B('Opposites', '반대말'), sub: B('Hot and cold, up and down', '뜨겁다와 차갑다'),
  area: AREA_READ('Vocabulary'),
  play() {
    // [word, opposite, look-alike for L1, picture, story where the opposite is the missing word (L2), other-pair word for L2]
    const rows=[
     ['hot','cold','warm','🔥',B('The cold soup was heated. Now it is ___.','차가운 수프를 데웠어요. 이제 수프는 ___.'),'slow'],
     ['big','small','huge','🐘',B('The small balloon got more air. Now it is ___.','작은 풍선에 바람을 더 넣었어요. 이제 ___.'),'quiet'],
     ['up','down','high','⬆️',B('The kite was down. The wind lifted it ___.','연이 아래에 있었어요. 바람이 연을 ___ 올렸어요.'),'small'],
     ['wet','dry','rainy','💧',B('The dry towel fell in the bath. Now it is ___.','마른 수건이 욕조에 빠졌어요. 이제 ___.'),'tall'],
     ['fast','slow','quick','🐇',B('The slow toy car got new wheels. Now it is ___.','느린 장난감 차에 새 바퀴를 달았어요. 이제 ___.'),'quiet'],
     ['open','closed','wide','📖',B('I pushed the closed door. Now it is ___.','닫힌 문을 밀었어요. 이제 문이 ___.'),'full'],
     ['tall','short','big','🦒',B('The short plant grew and grew. Now it is ___.','키 작은 식물이 쑥쑥 자랐어요. 이제 ___.'),'empty'],
     ['full','empty','heavy','🥛',B('The empty cup got milk to the top. Now it is ___.','빈 컵에 우유를 가득 부었어요. 이제 컵이 ___.'),'slow'],
     ['heavy','light','big','🎒',B('I put books in my light bag. Now it is ___.','가벼운 가방에 책을 넣었어요. 이제 가방이 ___.'),'short'],
     ['loud','quiet','noisy','📢',B('I turned up the quiet music. Now it is ___.','조용한 음악 소리를 키웠어요. 이제 ___.'),'wet'],
     ['near','far','close','🏠',B('We walked to the far park. Now it is ___.','먼 공원까지 걸어갔어요. 이제 공원이 ___.'),'tall'],
     ['inside','outside','under','🏡',B('We were outside. Rain came, so we went ___.','밖에 있었어요. 비가 와서 ___ 들어갔어요.'),'empty']];
    const r=pick(rows),lv=lvl('opposites');
    if(lv===1){quiz(this,{ask:B(`Which word is opposite to ${r[0]}?`,`영어 낱말 ${r[0]}의 반대말은?`),askExtra:{t:r[0],lang:'en-US'},show:`<div class="bigword"><span class="emo" role="img" aria-label="${r[0]}">${r[3]}</span> ${r[0]}</div>`,opts:r.slice(0,3).map((w,i)=>({html:`<span class="word">${w}</span>`,ok:i===1})),cls:'words',vocab:`${r[0]} – ${r[1]}`});return;}
    quiz(this,{ask:B('Which opposite word finishes the story?','이야기를 끝내는 반대말 영어 낱말은?'),askSay:B(`${r[4].en.replace('___','blank')} Which opposite word finishes the story?`,`${r[4].ko.replace('___','빈칸')} 이야기를 끝내는 반대말 영어 낱말은?`),show:`<div class="bigword" style="font-size:clamp(18px,3dvh,24px)">${L(r[4])}</div>`,opts:[r[0],r[1],r[5]].map((w,i)=>({html:`<span class="word">${w}</span>`,ok:i===0})),cls:'words'});
  }
});

// ---------- 7. Ending sounds ----------
registerGame({
  id: 'endsound', subject: 'read', icon: '🔚', title: B('Last Sound', '끝소리 찾기'), sub: B('cat ends with t', 'cat은 t로 끝나요'),
  area: AREA_READ('Phonemic awareness'),
  play() {
    if(lvl('endsound')===2){const words=['cat','hat','bat','mat','dog','log','fog','pig','wig','sun','run','fan','pen','hen','bus','gas','cup','map','cap','bed','red','mud','duck','back','rock'].map(w=>[w]),w=pick(words),last=w[0].slice(-1),good=pick(words.filter(x=>x!==w&&x[0].endsWith(last))),wrong=shuffle(words.filter(x=>!x[0].endsWith(last))).slice(0,2);quiz(this,{ask:B(`Which word ends like ${w[0]}?`,`${w[0]}와 끝소리가 같은 낱말은?`),askExtra:{t:w[0],lang:'en-US'},opts:[good,...wrong].map(x=>({html:`<span class="word">${x[0]}</span>`,ok:x===good})),cls:'words'});return;}
    const w = pick(CVC), last = w[0][w[0].length - 1], ds = others(ALPHA.filter(c => c !== last), '', lvl('endsound') === 2 ? 3 : 2);
    quiz(this, {
      ask: B(`Which letter does "${w[0]}" end with?`, `"${w[0]}"는 어떤 글자로 끝날까요?`), askSay: B(`Which letter does the word end with?`, `이 단어는 어떤 글자로 끝날까요?`), askExtra: { t: w[0], lang: 'en-US' },
      show: `<div class="bigword"><span class="emo">${w[1]}</span> ${w[0]}</div>`, opts: [last, ...ds].map(c => ({ html: `<span class="num">${c}</span>`, ok: c === last })), cls: 'shapes',
      after: B(`${w[0]} ends with ${last}.`, `${w[0]}는 ${last}로 끝나요.`), vocab: `${w[0]} ends with ${last}.`
    });
  }
});

// ---------- 8. Story order ----------
const STORIES = [
  { s: ['🌰', '🌱', '🌻'], a: B('A seed grows into a sprout, then a flower.', '씨앗이 싹이 되고, 그다음 꽃이 돼요.') }, { s: ['🥚', '🐣', '🐔'], a: B('An egg hatches into a chick, and the chick grows into a hen.', '알에서 병아리가 나오고, 병아리는 닭으로 자라요.') },
  { s: ['🌅', '☀️', '🌙'], a: B('Morning comes first, then noon, then night.', '아침, 낮, 밤 순서예요.') }, { s: ['🍞', '🥪', '😋'], a: B('Get bread, make a sandwich, then eat it.', '빵을 꺼내고, 샌드위치를 만들고, 먹어요.') },
  { s: ['👶', '🧒', '🧑'], a: B('A baby grows into a child, then a grown-up.', '아기가 어린이가 되고, 어른이 돼요.') }, { s: ['🪥', '🦷', '😁'], a: B('Brush your teeth, get them clean, and smile!', '이를 닦으면 깨끗해지고 활짝 웃어요!') },
  { s: ['🌰', '🌱', '🌳', '🍎'], a: B('A seed grows into a tree that gives apples.', '씨앗이 자라 나무가 되고 사과가 열려요.') }, { s: ['🥚', '🍳', '🍽️', '😋'], a: B('Crack the egg, cook it, serve it, and eat!', '알을 깨서 익히고, 담아서, 먹어요!') }
];
registerGame({
  id: 'story', subject: 'brain', icon: '🔢', title: B('What Happens First?', '무엇이 먼저일까?'), sub: B('Put pictures in order', '그림을 순서대로'),
  area: AREA_BRAIN('Sequencing'),
  play() {
    const pool = lvl('story') === 1 ? STORIES.filter(x => x.s.length === 3) : STORIES, st = pick(pool);
    tileRound(this, { ask: B('Put the pictures in order: first, next, last!', '그림을 순서대로 눌러요: 먼저, 그다음, 마지막!'), target: st.s, extra: [], after: st.a, vocab: L(B(st.a.en, st.a.en)) });
  }
});

// ---------- 9. Cause and effect ----------
const CAUSE = [
  [['🌧️', B('It rains.', '비가 와요.')], ['💦', B('puddles', '물웅덩이')]], [['🧊', B('An ice cube sits in the hot sun.', '얼음이 뜨거운 햇볕에 있어요.')], ['💧', B('it melts', '녹아요')]],
  [['🌱', B('A plant gets water and sun.', '식물이 물과 햇빛을 받아요.')], ['🌻', B('it grows', '자라요')]], [['⚽', B('You kick a ball.', '공을 차요.')], ['💨', B('it rolls away', '굴러가요')]],
  [['😴', B('You are very sleepy.', '아주 졸려요.')], ['🛏️', B('go to bed', '자러 가요')]], [['🦷', B('You brush your teeth.', '이를 닦아요.')], ['😁', B('clean teeth', '깨끗한 이')]],
  [['🥶', B('It is very cold outside.', '밖이 아주 추워요.')], ['🧥', B('put on a coat', '외투를 입어요')]], [['🔔', B('You ring a bell.', '종을 울려요.')], ['🎵', B('it makes a sound', '소리가 나요')]]
];
registerGame({
  id: 'cause', subject: 'brain', icon: '➡️', title: B('Cause and Effect', '왜 그럴까?'), sub: B('What happens next?', '그러면 어떻게 될까?'),
  area: AREA_BRAIN('Cause & effect'),
  play() {
    const t = pick(CAUSE), ds = others(CAUSE, t, 2), o = (c, ok) => ({ html: `<span class="emo">${c[1][0]}</span>`, label: c[1][1], ok });
    quiz(this, { ask: B('What happens next?', '그다음에는 어떻게 될까요?'), show: `<div class="bigword"><span class="emo">${t[0][0]}</span> ${L(t[0][1])}</div>`, opts: [o(t, true), ...ds.map(c => o(c, false))], cls: 'shapes', after: B(`${t[0][1].en} So ${t[1][1].en}!`, `${t[0][1].ko} 그래서 ${t[1][1].ko}!`) });
  }
});

// ---------- 10. Color mixing ----------
const CDOT = (c) => `<span class="cdot" style="background:${c}"></span>`;
const MIX = [['#e63946', '#ffd166', '#ff8c42', B('red', '빨강'), B('yellow', '노랑'), B('orange', '주황')], ['#118ab2', '#ffd166', '#2dc653', B('blue', '파랑'), B('yellow', '노랑'), B('green', '초록')],
  ['#e63946', '#118ab2', '#8338ec', B('red', '빨강'), B('blue', '파랑'), B('purple', '보라')], ['#e63946', '#ffffff', '#ffb3c1', B('red', '빨강'), B('white', '하양'), B('pink', '분홍')], ['#118ab2', '#ffffff', '#a8dadc', B('blue', '파랑'), B('white', '하양'), B('sky-blue', '하늘색')]];
registerGame({
  id: 'colors', subject: 'sci', icon: '🎨', title: B('Mix the Colors', '색 섞기'), sub: B('Red + yellow = ?', '빨강 + 노랑 = ?'),
  area: AREA_SCI('Colors & art'),
  play() {
    const t = pick(MIX), ds = others(MIX, t, 2), o = (m, ok) => ({ html: CDOT(m[2]), label: m[5], ok });
    quiz(this, { ask: B(`${t[3].en[0].toUpperCase() + t[3].en.slice(1)} and ${t[4].en} make what color?`, `${t[3].ko}과 ${t[4].ko}을 섞으면 무슨 색?`), show: `<div class="mixrow">${CDOT(t[0])}<span class="op">+</span>${CDOT(t[1])}<span class="op">=</span><span class="qbox">?</span></div>`,
      opts: [o(t, true), ...ds.map(m => o(m, false))], cls: 'shapes', after: B(`${t[3].en} and ${t[4].en} make ${t[5].en}!`, `${t[3].ko}과 ${t[4].ko}을 섞으면 ${t[5].ko}!`), vocab: t[5].en, onCorrect() { $('.mixrow .qbox').outerHTML = CDOT(t[2]); } });
  }
});

// ---------- 11. Feelings ----------
const FEEL = { happy: ['😀', B('happy', '기뻐요')], sad: ['😢', B('sad', '슬퍼요')], scared: ['😨', B('scared', '무서워요')], excited: ['🤩', B('excited', '신나요')], angry: ['😠', B('angry', '화나요')], tired: ['😴', B('tired', '피곤해요')] };
const FEEL_Q = [['🎂', B('It is your birthday party!', '생일 파티예요!'), 'happy'], ['🍦', B('Your ice cream fell on the ground.', '아이스크림을 땅에 떨어뜨렸어요.'), 'sad'], ['🌑', B('It is very dark and you hear a loud noise.', '아주 깜깜한데 큰 소리가 나요.'), 'scared'],
  ['🎁', B('You get a surprise present!', '깜짝 선물을 받았어요!'), 'excited'], ['🧸', B('A friend took your toy without asking.', '친구가 허락 없이 장난감을 가져갔어요.'), 'angry'], ['🛏️', B('You played all day. Now it is bedtime.', '하루 종일 놀았어요. 이제 잘 시간이에요.'), 'tired']];
registerGame({
  id: 'feelings', subject: 'life', icon: '😊', title: B('How Do They Feel?', '어떤 기분일까?'), sub: B('Happy, sad, scared...', '기쁨, 슬픔, 무서움...'),
  area: AREA_LIFE('Feelings'),
  play() {
    const t = pick(FEEL_Q), keys = Object.keys(FEEL), ds = others(keys, t[2], 2), o = (k) => ({ html: `<span class="emo">${FEEL[k][0]}</span>`, label: FEEL[k][1], ok: k === t[2] });
    quiz(this, { ask: B('How would you feel?', '어떤 기분이 들까요?'), show: `<div class="bigword"><span class="emo">${t[0]}</span> ${L(t[1])}</div>`, opts: [o(t[2]), ...ds.map(o)], cls: 'shapes', after: B(`You would feel ${FEEL[t[2]][1].en}.`, `${FEEL[t[2]][1].ko}.`), vocab: FEEL[t[2]][1].en });
  }
});

// ---------- 12. Code the robot (directions) ----------
registerGame({
  id: 'robot', subject: 'brain', icon: '🤖', title: B('Code the Robot', '로봇 코딩'), sub: B('Give the robot directions', '로봇에게 길을 알려 줘요'),
  area: AREA_BRAIN('Coding & directions'),
  play() {
    const lv = lvl('robot'), N = lv === 1 ? 3 : 4, K = lv === 1 ? 2 + rnd(2) : 3 + rnd(3), D = { u: [0, -1], d: [0, 1], l: [-1, 0], r: [1, 0] };
    let tx = 0, ty = 0, guard = 0;
    while ((tx === 0 && ty === 0) && guard++ < 50) { tx = 0; ty = 0; for (let i = 0; i < K; i++) { const d = D[pick(['d', 'r', 'r', 'd', 'u', 'l'])]; const nx = tx + d[0], ny = ty + d[1]; if (nx >= 0 && ny >= 0 && nx < N && ny < N) { tx = nx; ty = ny; } } }
    const ask = B('Tell the robot how to get to the star!', '로봇이 별에 가도록 길을 알려 줘요!'), cells = [];
    view().innerHTML = `<div class="prompt">${L(ask)}<button class="say" id="sp">🔊</button></div>
      <div class="rgrid" style="--n:${N}">${Array.from({ length: N * N }, (_, i) => `<div class="rc" data-x="${i % N}" data-y="${Math.floor(i / N)}"></div>`).join('')}</div>
      <div class="rprog" id="rprog"></div>
      <div class="rkeys">${[['u', '⬆️'], ['l', '⬅️'], ['d', '⬇️'], ['r', '➡️']].map(k => `<button class="pill" data-k="${k[0]}">${k[1]}</button>`).join('')}</div>
      <div><button class="pill" id="rrun">▶ ${T().run}</button> <button class="pill" id="rclr">🗑 ${T().clear}</button></div><pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    $('#sp').onclick = () => say(L(ask)); say(L(ask));
    const cell = (x, y) => document.querySelector(`.rc[data-x="${x}"][data-y="${y}"]`);
    let prog = [], x = 0, y = 0, busy = false, solved = false, missed = false; const arrows = { u: '⬆️', d: '⬇️', l: '⬅️', r: '➡️' };
    const paint = () => { $$('.rc').forEach(c => { c.textContent = ''; }); cell(tx, ty).textContent = '⭐'; cell(x, y).textContent = '🤖'; };
    const showProg = () => { $('#rprog').innerHTML = prog.map(k => `<span>${arrows[k]}</span>`).join('') || `<em>${T().addArrows}</em>`; };
    paint(); showProg();
    $$('.rkeys .pill').forEach(b => b.onclick = () => { if (busy || solved || prog.length >= 10) return; prog.push(b.dataset.k); showProg(); say('', 'en-US'); });
    $('#rclr').onclick = () => { if (busy || solved) return; prog = []; x = 0; y = 0; paint(); showProg(); $('#cheer').textContent = ''; };
    $('#rrun').onclick = async () => {
      if (busy || solved || !prog.length) return; busy = true; x = 0; y = 0; paint();
      const alive = () => !!document.getElementById('rrun');
      for (const k of prog) { await new Promise(r => setTimeout(r, 380)); if (!alive()) return; const nx = x + D[k][0], ny = y + D[k][1]; if (nx >= 0 && ny >= 0 && nx < N && ny < N) { x = nx; y = ny; paint(); } }
      busy = false; if (!alive()) return;
      if (x === tx && y === ty) { solved = true; recordFinal('robot', missed); if (!missed) addPeach(); $('#cheer').textContent = pick(T().right); nextButton(() => this.play()); }
      else { missed = true; $('#cheer').textContent = T().again; setTimeout(() => { if (alive()) { x = 0; y = 0; paint(); } }, 700); }
    };
    window.__robot = { tx, ty, N, D, press: (k) => document.querySelector(`.rkeys .pill[data-k="${k}"]`).click(), run: () => $('#rrun').click() };
  }
});
// Missing-ingredient retrieval complements the original five color mixes.
(() => {
  const game = GAMES.find(g => g.id === 'colors'), original = game.play;
  game.play = function () {
    if (lvl('colors')===1 && !rnd(3)) return original.call(this);
    const t = pick(MIX), i = rnd(2), shown = 1 - i;
    const colors = [...new Map(MIX.flatMap(m => [[m[0], m[3]], [m[1], m[4]]])).entries()];
    const wrong = shuffle(colors.filter(c => c[0] !== t[i])).slice(0, 2);
    quiz(this, { ask: B('Which color fills the empty spot?', '빈칸에 들어갈 색은?'), askSay: B('Look at the paint mix. Which color fills the empty spot?', '물감 섞기 그림을 보세요. 빈칸에 들어갈 색은?'), show: `<div class="mixrow">${CDOT(t[shown])}<span>+</span><span>?</span><span>=</span>${CDOT(t[2])}</div>`, opts: [[t[i], t[i + 3]], ...wrong].map((c, j) => ({ html: CDOT(c[0]), label: c[1], ok: j === 0 })), cls: 'shapes', vocab: t[i + 3].en });
  };
  // A child's stated feeling, rather than an assumed reaction, is the evidence.
  const feeling = GAMES.find(g => g.id === 'feelings');
  const scenes = [
    ['🎂', B('At my party I say, "I feel happy."', '생일 파티에서 “기뻐요”라고 말해요.'), 'happy'],
    ['🧸', B('With my friend I say, "I feel happy."', '친구와 놀며 “기뻐요”라고 말해요.'), 'happy'],
    ['🍦', B('My treat fell. I say, "I feel sad."', '간식을 떨어뜨리고 “슬퍼요”라고 말해요.'), 'sad'],
    ['👋', B('I miss my friend. I say, "I feel sad."', '친구가 보고 싶어서 “슬퍼요”라고 말해요.'), 'sad'],
    ['🌑', B('In the dark I say, "I feel scared."', '어두운 곳에서 “무서워요”라고 말해요.'), 'scared'],
    ['🔊', B('After a loud noise I say, "I feel scared."', '큰 소리를 듣고 “무서워요”라고 말해요.'), 'scared'],
    ['🎁', B('Before opening a gift I say, "I feel excited."', '선물을 열기 전에 “신나요”라고 말해요.'), 'excited'],
    ['🚌', B('Before our trip I say, "I feel excited."', '소풍 가기 전에 “신나요”라고 말해요.'), 'excited'],
    ['🧩', B('Someone broke my puzzle. I say, "I feel angry."', '누군가 내 퍼즐을 망가뜨려서 “화나요”라고 말해요.'), 'angry'],
    ['🧱', B('My tower was knocked down. I say, "I feel angry."', '누군가 내 탑을 무너뜨려서 “화나요”라고 말해요.'), 'angry'],
    ['🛏️', B('At bedtime I say, "I feel tired."', '잘 시간에 “피곤해요”라고 말해요.'), 'tired'],
    ['🏃', B('After running I say, "I feel tired."', '달리기를 하고 “피곤해요”라고 말해요.'), 'tired']
  ];
  feeling.play = function () {
    const t = pick(scenes), keys = Object.keys(FEEL);
    quiz(this, { ask: B('Find the face for this feeling.', '이 기분에 맞는 얼굴을 찾아요.'), askSay: B(`${t[1].en} Find the face for this feeling.`, `${t[1].ko} 이 기분에 맞는 얼굴을 찾아요.`), show: `<div style="font-size:clamp(16px,3dvh,22px);line-height:1.3">${t[0]} ${L(t[1])}</div>`, opts: [t[2], ...others(keys, t[2], lvl('feelings') === 2 ? 3 : 2)].map(k => ({ html: `<span class="emo" role="img" aria-label="${L(FEEL[k][1])}">${FEEL[k][0]}</span>`, ok: k === t[2] })), cls: 'shapes', after: B(`${FEEL[t[2]][1].en}: ${FEEL[t[2]][0]}`, `${FEEL[t[2]][1].ko}: ${FEEL[t[2]][0]}`), vocab: FEEL[t[2]][1].en });
  };
})();

// Controlled scenarios keep all alternatives about the same object and hide the outcome.
(() => {
 const game=GAMES.find(g=>g.id==='cause');
 const rows=[
  [B('A toy ball is still. A hand pushes it across a smooth floor.','장난감 공이 멈춰 있어요. 손으로 매끈한 바닥 위에서 밀어요.'),B('It starts moving.','움직이기 시작해요.'),B('It stays in the same spot.','같은 자리에 있어요.'),B('It moves toward the hand.','손 쪽으로 움직여요.')],
  [B('A room is dark. Its working lamp is switched on.','방이 어두워요. 잘 작동하는 전등을 켜요.'),B('The room gets brighter.','방이 더 밝아져요.'),B('The room gets darker.','방이 더 어두워져요.'),B('The light stays off.','전등이 꺼진 채예요.')],
  [B('Water is poured into an empty cup with no holes.','구멍 없는 빈 컵에 물을 부어요.'),B('The water level rises.','물 높이가 올라가요.'),B('The water level falls.','물 높이가 내려가요.'),B('The cup stays empty.','컵이 빈 채로 있어요.')],
  [B('A flat sheet of paper is folded in half.','평평한 종이를 반으로 접어요.'),B('The paper has a fold.','종이에 접힌 자국이 생겨요.'),B('The paper stays flat.','종이가 평평한 채예요.'),B('The paper is cut in two.','종이가 두 조각으로 잘려요.')],
  [B('A closed unlocked door is pushed open.','닫힌 문은 잠겨 있지 않아요. 밀어서 열어요.'),B('The doorway opens.','문이 열려요.'),B('The door stays shut.','문이 닫힌 채예요.'),B('The door becomes locked.','문이 잠겨요.')],
  [B('One block is taken off the top of a stack.','쌓은 블록 맨 위에서 한 개를 꺼내요.'),B('The stack becomes shorter.','블록 더미가 낮아져요.'),B('The stack becomes taller.','블록 더미가 높아져요.'),B('The stack stays the same height.','블록 더미 높이가 같아요.')],
  [B('A working tap is turned on over a sink.','잘 작동하는 수도꼭지를 세면대 위에서 틀어요.'),B('Water starts flowing.','물이 흐르기 시작해요.'),B('Water stops flowing.','물이 흐르지 않아요.'),B('The tap stays closed.','수도꼭지가 닫힌 채예요.')],
  [B('A crayon is pressed and moved across plain paper.','빈 종이에 크레용을 대고 눌러서 움직여요.'),B('A colored line appears.','색 선이 생겨요.'),B('The paper stays unmarked.','종이에 표시가 없는 채예요.'),B('An old line is erased.','원래 있던 선이 지워져요.')]

 ];
 game.play=function(){const r=pick(rows),lv=lvl(this.id);
 if(lv===1){quiz(this,{ask:B('Which result follows this action?','이 행동 다음에 어떤 결과가 생길까요?'),show:`<div class="bigword" style="font-size:clamp(18px,3dvh,24px)">${L(r[0])}</div>`,opts:r.slice(1).map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0})),cls:'words'});return;}
 const i=rows.indexOf(r),stops=[B('An equal opposite push stops the moving ball.','같은 크기의 반대 힘으로 움직이던 공을 멈춰요.'),B('The lamp is switched off again.','전등을 다시 꺼요.'),B('All the water is poured back out.','물을 모두 다시 따라내요.'),B('The paper is unfolded again.','종이를 다시 펼쳐요.'),B('The door is pulled shut again.','문을 다시 당겨서 닫아요.'),B('The same block is put back on top.','같은 블록을 맨 위에 다시 놓아요.'),B('The tap is turned off again.','수도꼭지를 다시 잠가요.'),B('A second colored line is drawn.','색 선을 하나 더 그어요.')],endings=[B('Still → moving → still','멈춤 → 움직임 → 멈춤'),B('Dark → bright → dark','어두움 → 밝음 → 어두움'),B('Empty → filled → empty','빈 컵 → 물 찬 컵 → 빈 컵'),B('Flat → folded → unfolded','평평함 → 접힘 → 펼침'),B('Closed → open → closed','닫힘 → 열림 → 닫힘'),B('Tall → shorter → original height','높음 → 낮아짐 → 원래 높이'),B('No flow → flowing → no flow','안 흐름 → 흐름 → 안 흐름'),B('No lines → one line → two lines','선 없음 → 한 선 → 두 선')],wrong=[B('Still → still → moving','멈춤 → 멈춤 → 움직임'),B('Dark → dark → bright','어두움 → 어두움 → 밝음'),B('Empty → empty → filled','빈 컵 → 빈 컵 → 물 찬 컵'),B('Flat → flat → folded','평평함 → 평평함 → 접힘'),B('Closed → closed → open','닫힘 → 닫힘 → 열림'),B('Tall → taller → shorter','높음 → 더 높아짐 → 낮아짐'),B('No flow → no flow → flowing','안 흐름 → 안 흐름 → 흐름'),B('No lines → two lines → one line','선 없음 → 두 선 → 한 선')],other=[B('Moving → still → moving','움직임 → 멈춤 → 움직임'),B('Bright → dark → bright','밝음 → 어두움 → 밝음'),B('Filled → empty → filled','물 찬 컵 → 빈 컵 → 물 찬 컵'),B('Folded → flat → folded','접힘 → 평평함 → 접힘'),B('Open → closed → open','열림 → 닫힘 → 열림'),B('Tall → same height → taller','높음 → 같은 높이 → 더 높음'),B('Flowing → no flow → flowing','흐름 → 안 흐름 → 흐름'),B('One line → no lines → two lines','한 선 → 선 없음 → 두 선')];
 quiz(this,{ask:B('Follow BOTH actions. Which sequence fits?','두 행동을 모두 보고 변화 순서를 골라요.'),show:`<div style="font-size:clamp(16px,3dvh,22px)">${L(r[0])} ${L(stops[i])}</div>`,opts:[endings[i],wrong[i],other[i]].map((x,j)=>({html:`<span class="word">${L(x)}</span>`,ok:j===0})),cls:'words'});
 };
 const feelings=GAMES.find(g=>g.id==='feelings'),original=feelings.play;
 feelings.play=function(){if(lvl(this.id)===1)return original.call(this);const keys=shuffle(Object.keys(FEEL)),a=keys[0],b=keys[1],c=keys[2];quiz(this,{ask:B('Which faces match the two feelings?','두 기분에 맞는 얼굴은?'),askSay:B(`First ${FEEL[a][1].en}, then ${FEEL[b][1].en}. Which faces match, in order?`,`먼저 ${FEEL[a][1].ko}, 그다음 ${FEEL[b][1].ko}. 순서에 맞는 얼굴은?`),show:`<div class="bigword" style="font-size:clamp(18px,3dvh,24px)">${L(FEEL[a][1])} → ${L(FEEL[b][1])}</div>`,opts:[[a,b],[b,a],[a,c]].map((ks,i)=>({html:ks.map(k=>`<span class="emo" role="img" aria-label="${L(FEEL[k][1])}">${FEEL[k][0]}</span>`).join(' → '),ok:i===0})),cls:'shapes'});};
})();

// 65: use two existing recipes as joint evidence; no new paint formula.
(() => {
 const game=GAMES.find(g=>g.id==='colors'),old=game.play;
 game.play=function(){if(lvl(this.id)===1)return old.call(this);const [a,b]=shuffle(MIX),ia=rnd(2),ib=rnd(2),other=pick(MIX.filter(x=>x!==a&&x!==b)),pair=(x,y)=>B(`${x.en} → ${y.en}`,`${x.ko} → ${y.ko}`);
 const row=(t,i)=>`${CDOT(t[1-i])} + ? = ${CDOT(t[2])}`;
 quiz(this,{ask:B('Which two colors fill the blanks?','두 빈칸에 차례로 들어갈 색은?'),askSay:B('Look at paint mix 1, then paint mix 2. Which two colors fill the blanks, in order?','물감 섞기 1과 2를 차례로 보세요. 두 빈칸에 들어갈 색은?'),show:`<div class="mixrow">1: ${row(a,ia)}</div><div class="mixrow">2: ${row(b,ib)}</div>`,opts:[[a[ia],a[ia+3],b[ib],b[ib+3]],[a[ia],a[ia+3],other[2],other[5]],[other[2],other[5],b[ib],b[ib+3]]].map(([c1,n1,c2,n2],i)=>({html:`<span style="white-space:nowrap">${CDOT(c1).replace('style="','style="width:min(8vw,5dvh);height:min(8vw,5dvh);')}→${CDOT(c2).replace('style="','style="width:min(8vw,5dvh);height:min(8vw,5dvh);')}</span>`,label:pair(n1,n2),ok:i===0})),cls:'shapes'});};
 // 2026-10-28 (sample S5 verdict): the answers are paint dots with names under them, not words to read.
 const cause=GAMES.find(g=>g.id==='cause'),prior=cause.play;
 const rows=[
  [B('An uninflated balloon gets air from a pump.','부풀지 않은 풍선에 펌프로 공기를 넣어요.'),B('The air is let out again.','공기를 다시 빼요.'),B('Flat','납작함'),B('Inflated','부풀음'),B('Flat again','다시 납작함')],
  [B('A dry sponge is dipped into water.','마른 스펀지를 물에 담가요.'),B('It is squeezed to remove some water.','짜서 물을 조금 빼요.'),B('Dry','마름'),B('Wet','젖음'),B('Less water','물이 줄어듦')],
  [B('A working fan is switched on.','잘 작동하는 선풍기를 켜요.'),B('The fan is switched off and allowed to stop.','선풍기를 끄고 멈출 때까지 기다려요.'),B('Stopped','멈춤'),B('Turning','돌아감'),B('Stopped again','다시 멈춤')],
  [B('A small spring is pulled gently at both ends.','작은 용수철 양끝을 살살 당겨요.'),B('It is released without damage.','망가지지 않게 놓아요.'),B('Short','짧음'),B('Stretched','늘어남'),B('Short again','다시 짧음')]
 ];
 cause.play=function(){if(rnd(2))return prior.call(this);const r=pick(rows),two=lvl(this.id)===2,pair=(a,b,c)=>B(`${a.en} → ${b.en} → ${c.en}`,`${a.ko} → ${b.ko} → ${c.ko}`),right=two?pair(r[2],r[3],r[4]):r[3];
 quiz(this,{ask:two?B('Which sequence follows both actions?','두 행동에 맞는 변화 순서는?'):B('What happens after this action?','이 행동 뒤 어떻게 될까요?'),show:`<div class="storytext" style="font-size:clamp(17px,3dvh,22px)">${L(r[0])}${two?' '+L(r[1]):''}</div>`,askExtra:{t:L(r[0])+(two?' '+L(r[1]):'')},opts:(two?[right,pair(r[3],r[2],r[4]),pair(r[2],r[4],r[3])]:[right,r[2]]).map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0})),cls:'words'});};
})();

// Keep all cause-and-effect sequences readable within the short K viewport.
(() => {
 const game=GAMES.find(g=>g.id==='cause'),old=game.play;
 game.play=function(){const render=window.quiz;try{window.quiz=(g,q)=>{const before=q.onRender;q={...q,cls:(q.cls||'')+' sents',onRender(){if(before)before();for(const el of document.querySelectorAll('.show>div')){el.style.fontSize='clamp(16px,2.65dvh,20px)';el.style.lineHeight='1.15';}}};render(g,q);};return old.call(this);}finally{window.quiz=render;}};
})();

// 2026-10-29 (picture-first, S5 bundle): cause shows the thing and the action as pictures and the answers are result pictures with names.
// Distractors stay about the same object (it stays the same / the opposite change). L2 follows two actions on one object as 3-box strips.
(() => {
 const game=GAMES.find(g=>g.id==='cause');
 const big=e=>`<span style="font-size:1.25em">${e}</span>`,small=e=>`<span style="font-size:.6em">${e}</span>`;
 const stack=n=>`<svg viewBox="0 0 22 46" style="height:clamp(30px,6.5dvh,52px);width:auto" aria-hidden="true">${Array.from({length:n},(_,i)=>`<rect x="2" y="${37-i*9}" width="18" height="8" rx="1.5" fill="#c9773e" stroke="#7a4524"/>`).join('')}</svg>`;
 const ON='👆⬆️',OFF='👆⬇️',TAPON='🤚↪️',TAPOFF='🤚↩️';
 // [before, action, sentence, [result pic, name] correct first]
 const rows=[
  ['⚽','🤚➡️',B('A ball is still. A hand pushes it.','공이 멈춰 있어요. 손으로 밀어요.'),[['⚽💨',B('It rolls','굴러가요')],['⚽',B('It stays still','그대로 있어요')]]],
  ['⬛',ON,B('The room is dark. The light is switched on.','방이 어두워요. 불을 켜요.'),[['🔆',B('Bright','밝아져요')],['⬛',B('Still dark','그대로 어두워요')]]],
  ['🚰',TAPON,B('A tap is closed. It is turned on.','수도꼭지가 잠겨 있어요. 틀어요.'),[['🚰💧',B('Water comes out','물이 나와요')],['🚰',B('No water','물이 안 나와요')]]],
  [small('🎈'),'🫁💨',B('A small balloon. Air is blown in.','작은 풍선이에요. 바람을 불어 넣어요.'),[[big('🎈'),B('Bigger','커져요')],[small('🎈'),B('Same size','그대로예요')]]],
  [stack(4),'✋⬆️',B('Four blocks. One is taken off the top.','블록 네 개예요. 맨 위 하나를 빼요.'),[[stack(3),B('Shorter','낮아져요')],[stack(5),B('Taller','높아져요')],[stack(4),B('Same height','그대로예요')]]],
  ['🔕','👋',B('A bell is quiet. You shake it.','종이 조용해요. 흔들어요.'),[['🔔🎵',B('It rings','소리가 나요')],['🔕',B('Still quiet','조용해요')]]],
  ['🧊','☀️',B('An ice cube sits in the hot sun.','얼음이 뜨거운 햇볕에 있어요.'),[['💧',B('It melts','녹아요')],['🧊',B('Stays ice','그대로 얼음')]]],
  ['🌱','💧☀️',B('A sprout gets water and sun.','새싹이 물과 햇빛을 받아요.'),[['🌻',B('It grows','자라요')],['🥀',B('It wilts','시들어요')],['🌱',B('Stays small','그대로예요')]]],
  ['🧽','💧',B('A dry sponge goes into water.','마른 스펀지를 물에 넣어요.'),[['🧽💦',B('Wet','젖어요')],['🧽',B('Still dry','그대로 말라 있어요')]]],
  ['🌽','🔥',B('Corn kernels are heated.','옥수수 알을 뜨겁게 데워요.'),[['🍿',B('Popcorn','팝콘이 돼요')],['🌽',B('Stays corn','그대로예요')]]],
  ['🌧️','⏳',B('It rains for a long time.','비가 오래 와요.'),[['💦',B('Puddles','물웅덩이')],['🏜️',B('Dry ground','땅이 말라요')]]],
  ['🥚','🍳🔥',B('An egg is cooked in a pan.','달걀을 프라이팬에 익혀요.'),[['🍳',B('Fried egg','달걀 프라이')],['🥚',B('Stays raw','그대로 날달걀')],['🐣',B('A chick','병아리')]]]
 ];
 // [state A, state B, action A→B, action B→A, names]
 const two=[
  ['⚽','⚽💨','🤚➡️','✋',B('push','밀기'),B('stop','멈추기'),B('still','멈춤'),B('rolling','굴러감')],
  ['⬛','🔆',ON,OFF,B('switch on','켜기'),B('switch off','끄기'),B('dark','어두움'),B('bright','밝음')],
  ['🚰','🚰💧',TAPON,TAPOFF,B('turn on','틀기'),B('turn off','잠그기'),B('no water','물 없음'),B('water','물 나옴')],
  ['🧊','💧','☀️','❄️',B('warm it in the sun','햇볕에 두기'),B('put it in the freezer','얼리기'),B('ice','얼음'),B('water','물')],
  ['🧽','🧽💦','💧','✊',B('dip in water','물에 담그기'),B('squeeze','꼭 짜기'),B('dry','마름'),B('wet','젖음')],
  ['🔕','🔔🎵','👋','✋',B('shake','흔들기'),B('hold still','잡기'),B('quiet','조용함'),B('ringing','소리 남')]
 ];
 const pic=(e,label,ok)=>({html:/^</.test(e)?e:`<span class="emo" style="white-space:nowrap;font-size:clamp(20px,min(${[...e].length>2?'6.5vw':'9vw'},5.5dvh),44px)">${e}</span>`,label,ok});
 const box=e=>`<span style="display:inline-grid;place-items:center;min-width:clamp(20px,min(6vw,5dvh),40px);height:clamp(28px,min(8vw,6dvh),46px);padding:0 1px;border:2px solid #b9a27f;border-radius:6px;background:#fff;font-size:clamp(10px,min(3.3vw,3dvh),22px);letter-spacing:-2px;white-space:nowrap">${e}</span>`;
 const strip=s=>`<span style="display:inline-flex;gap:1px;align-items:center">${s.map(box).join('')}</span>`;
 const scene=(parts)=>`<div class="mixrow" style="flex-wrap:nowrap;gap:clamp(4px,1.5vw,10px);font-size:clamp(28px,min(10vw,7dvh),56px);line-height:1">${parts.join('<span class="op">➜</span>')}</div>`;
 const line=t=>`<div style="font-size:clamp(15px,2.5dvh,19px);line-height:1.2;margin-top:4px">${L(t)}</div>`;
 game.play=function(){
  if(lvl(this.id)!==2){const r=pick(rows);
   quiz(this,{ask:B('What happens next?','그다음에는 어떻게 될까요?'),askSay:B(`${r[2].en} What happens next?`,`${r[2].ko} 그다음에는 어떻게 될까요?`),show:scene([r[0],r[1],'<span class="qbox">?</span>'])+line(r[2]),quietShow:true,
    opts:r[3].map((x,i)=>pic(x[0],x[1],i===0)),cls:'shapes',after:B(`${r[2].en} ${r[3][0][1].en}!`,`${r[2].ko} ${r[3][0][1].ko}!`)});return;}
  const t=pick(two),flip=rnd(2),[a,b,go,back]=flip?[t[1],t[0],t[3],t[2]]:[t[0],t[1],t[2],t[3]],[n1,n2]=flip?[t[5],t[4]]:[t[4],t[5]],[sa,sb]=flip?[t[7],t[6]]:[t[6],t[7]];
  const seqs=[[a,b,a],[a,a,b],[b,a,b]];
  quiz(this,{ask:B('Which picture row shows both changes?','두 번 바뀌는 순서에 맞는 그림 줄은?'),askSay:B(`First ${n1.en}, then ${n2.en}. Which picture row shows the changes, in order?`,`먼저 ${n1.ko}, 그다음 ${n2.ko}. 바뀌는 순서에 맞는 그림 줄은?`),
   show:scene([a,go,back,'<span class="qbox">?</span>'])+line(B(`${n1.en} → ${n2.en}`,`${n1.ko} → ${n2.ko}`)),quietShow:true,
   opts:seqs.map((s,i)=>({html:strip(s),ok:i===0})),cls:'shapes',after:B(`${sa.en} → ${sb.en} → ${sa.en}`,`${sa.ko} → ${sb.ko} → ${sa.ko}`)});
 };
})();

// 2026-10-29 (picture-first PF3: one unknown per screen): colors L2 no longer shows two blanks.
// Kind A asks for the pair of paints behind one mixed color (the pair is the single unknown; wrong pairs share one paint or come from another recipe).
// Kind B chains two mixes: the first is solved on screen, its result is mixed with white, and only the last color is blank.
(() => {
 const game=GAMES.find(g=>g.id==='colors'),old=game.play;
 const dot=c=>CDOT(c).replace('style="','style="width:min(8vw,5dvh);height:min(8vw,5dvh);');
 const R='margin:2px auto;gap:6px;font-size:min(7vw,4.5dvh)';
 const W=['#ffffff',B('white','하양')],K2=['#222222',B('black','검정')];
 const extra=[[K2[0],W[0],'#9a9a9a',K2[1],W[1],B('gray','회색')],['#ffd166',W[0],'#fff1b0',B('yellow','노랑'),W[1],B('light yellow','연노랑')],['#8338ec',W[0],'#cdb4f0',B('purple','보라'),W[1],B('light purple','연보라')]];
 const ALL=[...MIX,...extra];
 const chains=[[MIX[0],'#ffc59a',B('light orange','연주황')],[MIX[1],'#a8e6b8',B('light green','연초록')],[MIX[2],'#cdb4f0',B('light purple','연보라')]];
 game.play=function(){if(lvl(this.id)!==2)return old.call(this);
  if(!rnd(3)){const [m,light,name]=pick(chains),others=shuffle(ALL.filter(x=>x[2]!==light&&x[2]!==m[2])).slice(0,2);
   const o=(c,n,ok)=>({html:CDOT(c),label:n,ok});
   quiz(this,{ask:B('Mix again with white. Which color comes out?','그 색에 하양을 또 섞으면 무슨 색?'),askSay:B(`${m[3].en} and ${m[4].en} make ${m[5].en}. Then add white. Which color comes out?`,`${m[3].ko}과 ${m[4].ko}을 섞으면 ${m[5].ko}. 여기에 하양을 섞으면 무슨 색?`),
    show:`<div class="mixrow" style="${R}">${dot(m[0])}<span class="op">+</span>${dot(m[1])}<span class="op">=</span>${dot(m[2])}</div><div class="mixrow" style="${R}">${dot(m[2])}<span class="op">+</span>${dot(W[0])}<span class="op">=</span><span class="qbox" style="width:min(9vw,6dvh);height:min(9vw,6dvh);font-size:min(6vw,4dvh)">?</span></div>`,
    opts:[o(light,name,true),o(m[2],m[5],false),o(others[0][2],others[0][5],false)],cls:'shapes',after:B(`${m[5].en} and white make ${name.en}!`,`${m[5].ko}과 하양을 섞으면 ${name.ko}!`)});return;}
  const t=pick(ALL),paints=[...new Map(ALL.flatMap(m=>[[m[0],m[3]],[m[1],m[4]]])).entries()],flip=rnd(2);
  const keep=rnd(2),swap=pick(paints.filter(p=>p[0]!==t[0]&&p[0]!==t[1])),near=keep?[t[0],t[3],swap[0],swap[1]]:[swap[0],swap[1],t[1],t[4]];
  const far=pick(ALL.filter(m=>m[2]!==t[2]&&!(m[0]===near[0]&&m[1]===near[2])&&!(m[0]===near[2]&&m[1]===near[0])));
  const opt=([c1,n1,c2,n2],ok)=>({html:`<span style="white-space:nowrap">${dot(c1)}+${dot(c2)}</span>`,label:B(`${n1.en} + ${n2.en}`,`${n1.ko} + ${n2.ko}`),ok});
  quiz(this,{ask:B('Which two paints make this color?','이 색은 어떤 두 물감을 섞었을까요?'),askSay:B(`Look at the color. Which two paints mix to make ${t[5].en}?`,`이 색을 보세요. 어떤 두 물감을 섞으면 ${t[5].ko}이 될까요?`),
   show:`<div class="mixrow"><span class="qbox">?</span><span class="op">=</span>${CDOT(t[2])}</div>`,
   opts:[opt(flip?[t[1],t[4],t[0],t[3]]:[t[0],t[3],t[1],t[4]],true),opt(near,false),opt([far[0],far[3],far[1],far[4]],false)],cls:'shapes',after:B(`${t[3].en} and ${t[4].en} make ${t[5].en}!`,`${t[3].ko}과 ${t[4].ko}을 섞으면 ${t[5].ko}!`)});
 };
})();
