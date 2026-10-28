'use strict';
// Math games, following GCPS kindergarten units (Georgia Reveal Math K):
// U1 within 10, U2 shapes, U3 numbers to 20, U4 3-D shapes, U5 patterns/add-subtract, U6 within 20, U7 data.
const AREA_MATH = (u) => B(`Math · ${u}`, `수학 · ${u}`);

// ---------- 1. Count by tens ----------
registerGame({
  id: 'tens', subject: 'math', icon: '🚂', title: B('Count by Tens', '10씩 세기'), sub: B('10, 20, 30...', '10, 20, 30...'),
  area: AREA_MATH('Counting'),
  play() {
    const lv = lvl('tens'), maxK = lv === 1 ? 5 : 10;
    const kind = lv === 1 ? pick(['gap', 'gap', 'total']) : pick(['gap', 'back', 'total', 'gap']);
    const dots = '<span>🔵</span>'.repeat(10);
    const near = (ans) => { const set = new Set([ans]); while (set.size < 3) { const v = ans + pick([-20, -10, 10, 20]); if (v >= 10 && v <= 100) set.add(v); } return [...set].map(v => ({ html: `<span class="num">${v}</span>`, ok: v === ans })); };
    if (kind === 'total') {
      const k = 2 + rnd(maxK - 1), ans = k * 10, seq = Array.from({ length: k }, (_, i) => (i + 1) * 10);
      quiz(this, {
        ask: B('Count by tens: how many in all?', '10씩 세어요: 모두 몇 개일까요?'),
        show: `<div class="train sm">${seq.map(() => `<div class="car"><div class="dots">${dots}</div></div>`).join('')}</div>`,
        opts: near(ans), after: B(seq.join(', '), seq.join(', '))
      });
      return;
    }
    const len = lv === 1 ? 4 : 5, startIdx = rnd(maxK - len + 1);
    let seq = Array.from({ length: len }, (_, i) => (startIdx + i + 1) * 10);
    if (kind === 'back') seq = seq.reverse();
    const gapAt = rnd(len), ans = seq[gapAt];
    quiz(this, {
      ask: kind === 'back' ? B('Counting back by tens, which number is missing?', '10씩 거꾸로 셀 때 빠진 숫자는?') : B('Which number is missing?', '빠진 숫자는 뭘까요?'),
      show: `<div class="train">${seq.map((n, i) => `<div class="car ${i === gapAt ? 'gap' : ''}"><div class="n">${i === gapAt ? '?' : n}</div><div class="dots">${i === gapAt ? '' : dots}</div></div>`).join('')}</div>`,
      opts: near(ans), after: B(seq.join(', '), seq.join(', ')),
      onCorrect() { const g = $('.car.gap'); g.classList.remove('gap'); g.querySelector('.n').textContent = ans; g.querySelector('.dots').innerHTML = dots; }
    });
  }
});

// ---------- 2. Make a number (number bonds: parts that make 5..10) ----------
const frameHtml = (n, e, T) => `<div class="frame big10">${Array.from({ length: T }, (_, i) => i < n ? `<div class="cell on">${e}</div>` : `<div class="cell empty"></div>`).join('')}</div>`;
// Picture fading (core.js scaffoldStep): 0 = objects, 1 = plain dots, 2 = numbers only. FADE_DOT is the "dot" counter.
const FADE_DOT = '🔵';
const tenMoreAsk = (n, T) => B(`${n} here: how many more to make ${T}?`, `${n}개에서 ${T}${[5, 9].includes(T) ? '가' : '이'} 되려면 몇 개 더?`);
registerGame({
  id: 'ten', subject: 'math', icon: '🍎', title: B('Make a Number', '수 만들기'), sub: B('How many more to make it?', '몇 개 더 필요할까?'),
  area: AREA_MATH('Within 10'),
  play() {
    const lv = lvl('ten'), e = pick(['🍑', '🍎', '🍓', '🍊', '⭐']), mode = lv === 1 ? 'more' : pick(['more', 'pair', 'missing', 'more']);
    const T = pick(lv === 1 ? [10, 10, 5, 6, 7, 8, 9] : [10, 10, 5, 6, 7, 8, 9]), word = (x) => (x === 10 && S.lang === 'ko' ? '십' : x);
    const koPair = (a, b) => `${a}와 ${b}를 합치면 ${word(T)}!`;
    if (mode === 'pair') {
      const a = 1 + rnd(T - 1), bad = [];
      let guard = 0; while (bad.length < 2 && guard++ < 60) { const y = Math.max(0, Math.min(T, T - a + pick([-3, -2, -1, 1, 2, 3]))); if (a + y !== T && !bad.some(b => b[1] === y)) bad.push([a, y]); }
      const o = (p, ok) => ({ html: `<span class="num eq">${p[0]} + ${p[1]}</span>`, ok });
      quiz(this, { ask: B(`Which pair makes ${T}?`, `더해서 ${T}이(가) 되는 짝은?`), opts: [o([a, T - a], true), ...bad.map(p => o(p, false))], cls: 'words', after: B(`${a} and ${T - a} make ${T}!`, koPair(a, T - a)), sd: { n: a, T, e } });
      return;
    }
    const n = lv === 1 ? Math.max(1, T - 5) + rnd(Math.min(5, T - 1)) : 1 + rnd(T - 1), ans = T - n, after = B(`${n} and ${ans} make ${T}!`, koPair(n, ans));
    if (mode === 'missing') {
      quiz(this, { ask: B(`What number makes ${T}?`, `${T}이(가) 되려면 어떤 수가 필요할까요?`), show: `<div class="bigword eqline"><span class="qbox">?</span> + ${n} = ${T}</div>`, opts: numOpts(ans, 0, T), after, sd: { n, T, e } });
      return;
    }
    const fs = scaffoldStep(this, 'more'), dot = fs ? FADE_DOT : e;
    quiz(this, {
      ask: tenMoreAsk(n, T), show: fs < 2 ? frameHtml(n, dot, T) : `<div class="bigword eqline">${n} + <span class="qbox">?</span> = ${T}</div>`,
      opts: numOpts(ans, 0, T - 1), after, fade: 'more', sd: { n, T, e, fs, more: true },
      onCorrect: fs < 2 ? () => $$('.show .cell:not(.on)').forEach(c => { c.classList.add('on', 'new'); c.textContent = dot; }) : null
    });
  },
  // Step-down: numbers with no frame (or a faded frame) get the full ten-frame back; a full frame gets a smaller total.
  stepDown(item) {
    const d = item.sd; if (!d) return null;
    let { n, T } = d;
    if (d.more && !d.fs) { const ans = T - n; T = T > 5 ? 5 : 3; n = T - (1 + rnd(Math.min(T - 1, Math.max(1, ans - 1)))); }   // smaller total, and no more to add than before
    return { ask: tenMoreAsk(n, T), show: frameHtml(n, d.e, T), opts: numOpts(T - n, 0, T - 1) };
  }
});

// ---------- 3. Count the objects (one-to-one correspondence) ----------
registerGame({
  id: 'count', subject: 'math', icon: '🔢', title: B('Count Peaches', '복숭아 세기'), sub: B('Tap and count', '눌러서 세어요'),
  area: AREA_MATH('Counting objects'),
  play() {
    const lv = lvl('count'), n = lv === 1 ? 2 + rnd(9) : 8 + rnd(13), e = pick(['🍑', '🍑', '🍎', '🐞', '⭐', '🦆']);
    quiz(this, {
      ask: B('Tap each one: how many are there?', '하나씩 눌러 세면 모두 몇 개일까요?'),
      show: `<div class="scatter">${Array.from({ length: n }, () => `<button class="obj" style="transform:translate(${rnd(21) - 10}px,${rnd(21) - 10}px) rotate(${rnd(41) - 20}deg)">${e}</button>`).join('')}</div>`,
      opts: numOpts(n, 1, 20),
      after: B(`${n}`, `${n}`), sd: { n, e }, onRender: countTaps
    });
  },
  // Step-down: fewer objects in one straight row (the 2-level "how many more" step uses smaller sets, lined up).
  stepDown(item) {
    const d = item.sd; if (!d) return null;
    if (d.more) { const b = 1 + rnd(2), a = b + 1 + rnd(2); return { ask: B('How many more peaches are in A?', 'A의 복숭아는 몇 개 더 많을까요?'), show: lineSets(a, b), quietShow: true, opts: numOpts(a - b, 0, 4) }; }
    const n = d.n <= 4 ? d.n : Math.max(3, Math.ceil(d.n / 2));
    return { ask: B('Tap each one: how many are there?', '하나씩 눌러 세면 모두 몇 개일까요?'), show: `<div class="scatter">${`<button class="obj">${d.e}</button>`.repeat(n)}</div>`, opts: numOpts(n, 1, 10), onRender: countTaps };
  }
});
function countTaps() { let c = 0; $$('.obj').forEach(b => b.onclick = () => { if (b.classList.contains('counted')) return; c++; b.classList.add('counted'); b.dataset.n = c; say(String(c)); }); }
// Two rows lined up one under the other (one-to-one), A on top, for the smaller "how many more" step.
const lineSets = (a, b) => `<div style="display:grid;gap:6px;justify-content:center;font-size:clamp(26px,5.5dvh,42px);line-height:1.1">${[[a, 'A'], [b, 'B']].map(([n, name]) => `<div style="display:flex;align-items:center;gap:6px"><b style="color:#c4552b;width:1.2em">${name}</b>${'<span>🍑</span>'.repeat(n)}</div>`).join('')}</div>`;

// ---------- 4. Number order: next / before / counting back ----------
registerGame({
  id: 'order', subject: 'math', icon: '🔟', title: B('What Comes Next?', '다음 숫자는?'), sub: B('Count forward and back', '앞으로 뒤로 세어요'),
  area: AREA_MATH('Counting to 100'),
  play() {
    const lv = lvl('order'), hi = lv === 1 ? 20 : 100;
    const kind = lv === 1 ? pick(['next', 'next', 'before']) : pick(['next', 'before', 'back', 'mid']);
    let cards, ans, ask;
    if (kind === 'next') { const a = 1 + rnd(hi - 4); cards = [a, a + 1, a + 2, '?']; ans = a + 3; ask = B('What comes next?', '다음 숫자는 뭘까요?'); }
    else if (kind === 'before') { const a = 2 + rnd(hi - 4); cards = ['?', a, a + 1, a + 2]; ans = a - 1; ask = B('What comes before?', '앞에 올 숫자는 뭘까요?'); }
    else if (kind === 'back') { const a = 4 + rnd(hi - 4); cards = [a, a - 1, a - 2, '?']; ans = a - 3; ask = B('Counting backward, what comes next?', '거꾸로 세면 다음은 뭘까요?'); }
    else { const a = 1 + rnd(hi - 4); cards = [a, a + 1, '?', a + 3]; ans = a + 2; ask = B('Which number is missing?', '빠진 숫자는 뭘까요?'); }
    quiz(this, { ask, show: `<div class="train">${cards.map(c => `<div class="car ${c === '?' ? 'gap' : ''}"><div class="n">${c}</div></div>`).join('')}</div>`, opts: numOpts(ans, 0, hi), after: B(`${ans}`, `${ans}`) });
  }
});

// ---------- 5. Compare groups: more / fewer / same ----------
registerGame({
  id: 'compare', subject: 'math', icon: '⚖️', title: B('More or Fewer?', '더 많이? 더 적게?'), sub: B('Compare groups', '묶음 비교하기'),
  area: AREA_MATH('Comparing sets'),
  play() {
    const lv = lvl('compare'), e = pick(['🍑', '🍎', '🐟', '⭐']);
    const same = lv === 2 && rnd(4) === 0;
    let a = 1 + rnd(10), b = same ? a : 1 + rnd(10);
    if (!same && a === b) b = a === 10 ? 9 : a + 1;
    const more = lv === 1 ? rnd(2) === 0 : true;
    const askMore = lv === 2 ? B('Which has MORE, or are they the SAME?', '어느 쪽이 더 많을까요, 같을까요?') : more ? B('Which group has MORE?', '어느 쪽이 더 많을까요?') : B('Which group has FEWER?', '어느 쪽이 더 적을까요?');
    const opts = [{ html: '<small>A</small>' + emojiRow(a, e, 'sm'), ok: !same && (more ? a > b : a < b) || false }, { html: '<small>B</small>' + emojiRow(b, e, 'sm'), ok: !same && (more ? b > a : b < a) || false }];
    if (lv === 2) opts.push({ html: '<span class="num">=</span>', label: B('Same', '같아요'), ok: same });
    quiz(this, { ask: askMore, opts, cls: 'groups', after: B(same ? `${a} and ${b} are the same.` : `${a} and ${b}.`, same ? `${a}와 ${b}는 같아요.` : `${a}와 ${b}.`), sd: { e, more: lv === 2 || more } });
  },
  // Step-down: smaller groups (1 to 5, at least 2 apart) and only two choices (the "Same" choice is taken away).
  stepDown(item) {
    const d = item.sd; if (!d) return null;
    const a = 1 + rnd(3), b = a + 2 + rnd(4 - a), [x, y] = rnd(2) ? [a, b] : [b, a];
    return { ask: d.more ? B('Which group has MORE?', '어느 쪽이 더 많을까요?') : B('Which group has FEWER?', '어느 쪽이 더 적을까요?'), cls: 'groups',
      opts: [{ html: '<small>A</small>' + emojiRow(x, d.e, 'sm'), ok: d.more ? x > y : x < y }, { html: '<small>B</small>' + emojiRow(y, d.e, 'sm'), ok: d.more ? y > x : y < x }] };
  }
});

// ---------- 6. Add and take away (within 5 / 10) ----------
registerGame({
  id: 'addsub', subject: 'math', icon: '➕', title: B('Peach Stories', '복숭아 이야기'), sub: B('Put together, take away', '더하고 빼요'),
  area: AREA_MATH('Add & subtract'),
  play() {
    const lv = lvl('addsub'), top = lv === 1 ? 5 : 10, e = pick(['🍑', '🍎', '🐥', '🍪']);
    const add = rnd(2) === 0;
    if (add) { const a = 1 + rnd(top - 1), b = 1 + rnd(top - a); quiz(this, { ...addsubItem(true, a, b, e, scaffoldStep(this, 'add')), opts: numOpts(a + b, 0, top) }); }
    else { const a = 2 + rnd(top - 1), b = 1 + rnd(a - 1); quiz(this, { ...addsubItem(false, a, b, e, scaffoldStep(this, 'take')), opts: numOpts(a - b, 0, top) }); }
  },
  // Step-down: a faded picture comes back with the same numbers; a full picture gets smaller numbers;
  // the 2-level "a + b - c" story first asks only the "a + b" part, with pictures.
  stepDown(item) {
    const d = item.sd; if (!d) return null;
    if (d.l2) return { ...addsubItem(true, d.a, d.b, '🍑', 0), opts: numOpts(d.a + d.b, 0, 10) };
    let { a, b } = d;
    if (!d.fs) { if (d.add) { a = 1 + rnd(2); b = 1; } else { a = 2 + rnd(2); b = 1; } }
    return { ...addsubItem(d.add, a, b, d.e, 0), opts: numOpts(d.add ? a + b : a - b, 0, 5) };
  }
});
// One add/take-away story at a picture-fading step (0 objects, 1 dots, 2 numbers only).
function addsubItem(add, a, b, e, fs) {
  const c = fs ? FADE_DOT : e, ans = add ? a + b : a - b, sd = { add, a, b, e, fs };
  if (add) return {
    ask: B(`${a} and ${b} more makes how many?`, `${a}개에 ${b}개를 더하면 모두 몇 개일까요?`),
    show: fs < 2 ? `<div class="story">${emojiRow(a, c, 'sm')}<span class="op">+</span>${emojiRow(b, c, 'sm')}</div>` : `<div class="bigword">${a} + ${b} = ?</div>`,
    after: B(`${a} plus ${b} is ${ans}.`, `${a} 더하기 ${b}는 ${ans}.`), fade: 'add', sd };
  return {
    ask: fs < 2 ? B('How many are left without the crossed ones?', '지워진 것을 빼면 몇 개 남을까요?') : B(`${a} take away ${b}: how many are left?`, `${a}개에서 ${b}개를 빼면 몇 개 남을까요?`),
    // One row only: the ones that stay first, then the crossed-out ones together in a dashed box, so nothing wraps to a second line.
    show: fs < 2 ? `<div class="story takeaway"><span class="keep">${c.repeat(a - b)}</span><span class="gonebox">${Array.from({ length: b }, () => `<span class="gone"><i>${c}</i></span>`).join('')}</span></div>` : `<div class="bigword">${a} − ${b} = ?</div>`,
    after: B(`${a} minus ${b} is ${ans}.`, `${a} 빼기 ${b}는 ${ans}.`), fade: 'take', sd };
}

// ---------- 7. Teen numbers (ten and some more) ----------
registerGame({
  id: 'teens', subject: 'math', icon: '🧱', title: B('Ten and More', '10과 더'), sub: B('11 to 19', '11부터 19까지'),
  area: AREA_MATH('Numbers to 20'),
  play() {
    const lv = lvl('teens'), n = lv === 1 ? 11 + rnd(5) : 11 + rnd(9), e = pick(['🍑', '🍎', '⭐']), fs = scaffoldStep(this, 'teen');
    quiz(this, {
      ask: B('Ten and some more: how many in all?', '10과 조금 더: 모두 몇 개일까요?'),
      show: fs === 0 ? teenShow(n, e) : fs === 1 ? `<div class="story"><span class="bigword" style="border:3px solid #f2b28c;border-radius:12px;padding:0 .3em">10</span><span class="op">+</span>${emojiRow(n - 10, e, 'sm')}</div>` : `<div class="bigword">10 + ${n - 10}</div>`,
      opts: numOpts(n, 11, 20), after: B(`Ten and ${n - 10} make ${n}.`, `10과 ${n - 10}를 합치면 ${n}.`), fade: 'teen', sd: { n, e, fs }
    });
  },
  // Fading: 0 = full ten-frame + objects, 1 = the ten as the number 10 + objects, 2 = numbers only.
  // Step-down: a faded picture comes back; with the full picture, first count only the ones next to the ten.
  // The 2-level "10 + a + ? = total" asks the within-10 part on a ten-frame.
  stepDown(item) {
    const d = item.sd; if (!d) return null;
    if (d.l2) return { ask: tenMoreAsk(d.a, d.a + d.b), show: frameHtml(d.a, '🍑', d.a + d.b), opts: numOpts(d.b, 0, d.a + d.b - 1) };
    if (d.fs) return { ask: B('Ten and some more: how many in all?', '10과 조금 더: 모두 몇 개일까요?'), show: teenShow(d.n, d.e), opts: numOpts(d.n, 11, 20) };
    return { ask: B('How many are next to the ten?', '10 옆에는 몇 개 있을까요?'), show: teenShow(d.n, d.e), opts: numOpts(d.n - 10, 1, 9) };
  }
});
const teenShow = (n, e) => `<div class="story"><div class="frame mini">${Array.from({ length: 10 }, () => `<div class="cell on">${e}</div>`).join('')}</div><span class="op">+</span>${emojiRow(n - 10, e, 'sm')}</div>`;

// ---------- 8. 2-D shapes (SVG, random rotation) ----------
const SHAPES = {
  circle: { n: B('circle', '동그라미'), svg: '<circle cx="50" cy="50" r="40"/>' },
  square: { n: B('square', '네모(정사각형)'), svg: '<rect x="14" y="14" width="72" height="72"/>' },
  triangle: { n: B('triangle', '세모'), svg: '<polygon points="50,10 92,86 8,86"/>' },
  rectangle: { n: B('rectangle', '직사각형'), svg: '<rect x="6" y="26" width="88" height="48"/>' },
  hexagon: { n: B('hexagon', '육각형'), svg: '<polygon points="50,6 87,28 87,72 50,94 13,72 13,28"/>' }
};
const SHAPE_COLORS = ['#ef476f', '#118ab2', '#06d6a0', '#ffb703', '#8338ec'];
const shapeSvg = (k, rot) => `<svg viewBox="0 0 100 100" class="shape" style="transform:rotate(${rot}deg)" fill="${pick(SHAPE_COLORS)}" stroke="#1d3557" stroke-width="3">${SHAPES[k].svg}</svg>`;
const SHAPE_FACTS = {
  circle: B('Which shape is round, with no corners?', '둥글고 뾰족한 곳이 없는 모양은?'),
  triangle: B('Which shape has 3 sides?', '변이 3개인 모양은?'),
  square: B('Which shape has 4 sides all the same?', '변 4개가 모두 같은 모양은?'),
  rectangle: B('Which shape has 4 sides, with 2 long and 2 short?', '긴 변과 짧은 변이 2개씩인 모양은?'),
  hexagon: B('Which shape has 6 sides?', '변이 6개인 모양은?')
};
registerGame({
  id: 'shapes2d', subject: 'math', icon: '🔺', title: B('Shape Finder', '모양 찾기'), sub: B('Circles, squares, triangles...', '동그라미, 네모, 세모...'),
  area: AREA_MATH('Shapes'),
  play() {
    const lv = lvl('shapes2d'), pool = lv === 1 ? ['circle', 'square', 'triangle', 'rectangle'] : Object.keys(SHAPES);
    const t = pick(pool), ds = others(pool, t, 2), byFact = rnd(2) === 0;
    const rot = () => (lv === 1 ? rnd(2) * 15 : rnd(61) - 30);
    quiz(this, {
      ask: byFact ? SHAPE_FACTS[t] : B(`Tap the ${SHAPES[t].n.en.toUpperCase()}.`, `${SHAPES[t].n.ko}을(를) 눌러요.`),
      askSay: byFact ? SHAPE_FACTS[t] : B(`Tap the ${SHAPES[t].n.en}.`, `${SHAPES[t].n.ko}을 눌러요.`),
      askExtra: S.lang === 'ko' && !byFact ? { t: SHAPES[t].n.en, lang: 'en-US' } : null,
      opts: [t, ...ds].map(k => ({ html: shapeSvg(k, rot()), ok: k === t })), cls: 'shapes',
      after: B(`That is a ${SHAPES[t].n.en}.`, `${SHAPES[t].n.ko}이에요.`), vocab: SHAPES[t].n.en
    });
  }
});

// ---------- 9. 3-D shapes in my world ----------
const SOLIDS = {
  sphere: { n: B('sphere', '구'), things: [['🏀', B('basketball', '농구공')], ['⚽', B('soccer ball', '축구공')], ['🌍', B('globe', '지구본')]] },
  cube: { n: B('cube', '정육면체'), things: [['🎲', B('dice', '주사위')], ['🧊', B('ice', '얼음')]] },
  cone: { n: B('cone', '원뿔'), things: [['🍦', B('ice cream', '아이스크림')], ['🥳', B('party hat', '고깔모자')]] },
  cylinder: { n: B('cylinder', '원기둥'), things: [['🥫', B('can', '캔')], ['🔋', B('battery', '건전지')]] }
};
registerGame({
  id: 'shapes3d', subject: 'math', icon: '🧊', title: B('Shapes Around Me', '내 주변의 모양'), sub: B('Spheres, cubes, cones...', '공, 상자, 원뿔...'),
  area: AREA_MATH('3-D shapes'),
  play() {
    const keys = Object.keys(SOLIDS), t = pick(keys), ds = others(keys, t, 2);
    const mk = (k, ok) => { const [html, label] = pick(SOLIDS[k].things); return { html: `<span class="emo">${html}</span>`, label, ok }; };
    quiz(this, {
      ask: B(`Which one looks like a ${SOLIDS[t].n.en.toUpperCase()}?`, `${SOLIDS[t].n.ko} 모양은 어느 것일까요?`),
      askSay: B(`Which one looks like a ${SOLIDS[t].n.en}?`, `${SOLIDS[t].n.ko} 모양은 어느 것일까요?`),
      opts: [mk(t, true), ...ds.map(k => mk(k, false))],
      after: B(`A ${SOLIDS[t].n.en}!`, `${SOLIDS[t].n.ko}!`), vocab: SOLIDS[t].n.en
    });
  }
});

// ---------- 10. Patterns ----------
registerGame({
  id: 'pattern', subject: 'math', icon: '🎨', title: B('Pattern Parade', '무늬 퍼레이드'), sub: B('What comes next?', '다음에 올 것은?'),
  area: AREA_MATH('Patterns'),
  play() {
    const lv = lvl('pattern');
    const units = lv === 1 ? ['AB', 'AB', 'AAB'] : ['ABB', 'AABB', 'ABC', 'AAB', 'ABCC'];
    const unit = pick(units), pal = shuffle(['🔴', '🔵', '🟢', '🟡', '🐶', '🐱', '🍎', '🍌', '⭐', '🌙', '🦋', '🌸']);
    const sym = {}; [...new Set(unit)].forEach((c, i) => sym[c] = pal[i]);
    const total = unit.length * 2 + rnd(unit.length), seq = Array.from({ length: total + 1 }, (_, i) => sym[unit[i % unit.length]]);
    const ans = seq[total], shown = seq.slice(0, total);
    const choices = [ans, ...others(pal.slice(0, 6).filter(x => x !== ans), ans, 2)];
    quiz(this, {
      ask: B('What comes next in the pattern?', '무늬의 다음에 올 것은 뭘까요?'),
      show: `<div class="train pat">${shown.map(s => `<div class="pc">${s}</div>`).join('')}<div class="pc gap">?</div></div>`,
      opts: choices.map(c => ({ html: `<span class="emo">${c}</span>`, ok: c === ans })), cls: 'shapes',
      onCorrect() { const g = $('.pc.gap'); g.classList.remove('gap'); g.textContent = ans; }
    });
  }
});

// ---------- 11. Graphs ----------
registerGame({
  id: 'graph', subject: 'math', icon: '📊', title: B('Read the Graph', '그래프 읽기'), sub: B('Which has the most?', '어느 것이 가장 많을까?'),
  area: AREA_MATH('Data'),
  play() {
    const lv = lvl('graph'), cats = shuffle(['🍎', '🍌', '🍇', '🍑']).slice(0, lv === 1 ? 2 : 3);
    const counts = shuffle([1, 2, 3, 4, 5, 6]).slice(0, cats.length);
    // The label under the line is a small word, not another copy of the picture, so the only pictures to count are in the column (2026-10-26).
    const NAME = { '🍎': B('apple', '사과'), '🍌': B('banana', '바나나'), '🍇': B('grapes', '포도'), '🍑': B('peach', '복숭아') };
    const col = (c, n) => `<div class="gcol"><div class="gstack">${Array.from({ length: n }, () => `<span>${c}</span>`).join('')}</div><div class="glabel gword">${L(NAME[c])}</div></div>`;
    const show = `<div class="graph">${cats.map((c, i) => col(c, counts[i])).join('')}</div>`;
    const mode = rnd(2) === 0 ? 'most' : 'howmany';
    if (mode === 'most') {
      const top = Math.max(...counts);
      quiz(this, { ask: B('Which one has the MOST?', '가장 많은 것은 어느 것일까요?'), show, opts: cats.map((c, i) => ({ html: `<span class="emo">${c}</span>`, ok: counts[i] === top })), cls: 'shapes' });
    } else {
      const i = rnd(cats.length);
      quiz(this, { ask: B(`How many ${cats[i]} are there?`, `${cats[i]}는 몇 개일까요?`), show, opts: numOpts(counts[i], 1, 7), after: B(`${counts[i]}`, `${counts[i]}`) });
    }
  }
});

(() => {
  const game = GAMES.find(g => g.id === 'shapes3d'), original = game.play;
  game.play = function () {
    if (!rnd(2)) return original.call(this);
    const keys = Object.keys(SOLIDS), t = pick(keys), [e, name] = pick(SOLIDS[t].things);
    quiz(this, { ask: B('What solid shape does this look like?', '어떤 입체 모양과 닮았을까요?'), askExtra: { t: L(name) }, show: '<span class="emo">' + e + '</span><div style="font-size:clamp(16px,3dvh,22px)">' + L(name) + '</div>', opts: [t, ...others(keys, t, 2)].map(k => ({ html: '<span class="word">' + L(SOLIDS[k].n) + '</span>', ok: k === t })), cls: 'words', after: name, vocab: name.en });
  };
})();

// L2 transfers a familiar object's solid shape to a different object.
(() => {
  const game = GAMES.find(g => g.id === 'shapes3d'), original = game.play;
  game.play = function () {
    if (lvl(this.id) === 1) return original.call(this);
    const keys=Object.keys(SOLIDS), k=pick(keys), pair=shuffle(SOLIDS[k].things), source=pair[0];
    const items=[{x:pair[1],ok:true},...keys.filter(j=>j!==k).map(j=>({x:pick(SOLIDS[j].things),ok:false}))];
    quiz(this,{ask:B('Which other object has the same solid shape?','입체 모양이 같은 다른 물건을 찾아요.'),
      askExtra:{t:L(source[1])},
      show:'<span class="emo">'+source[0]+'</span><div style="font-size:18px">'+L(source[1])+'</div>',
      opts:items.map(v=>({html:'<span class="emo">'+v.x[0]+'</span>',label:v.x[1],ok:v.ok})),cls:'shapes'});
  };
})();

// 63a: L2 adds a comparison or a missing-part decision, within K quantities.
(() => {
 const upgrade=(id,make)=>{const g=GAMES.find(g=>g.id===id),old=g.play;g.play=function(){if(lvl(id)===1)return old.call(this);quiz(this,make());};};
 // 2026-10-28 sample S1: A and B sit apart, left and right, each named above its box, so the extra peaches stand out.
 const moreSets=(a,b)=>{const box=(n,name)=>`<div style="flex:0 1 auto;border:3px solid #f2b28c;border-radius:16px;padding:6px 10px;background:#fff"><div style="font-weight:800;font-size:clamp(22px,4.5dvh,34px);color:#c4552b">${name}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;font-size:clamp(22px,min(5dvh,8.5vw),38px);line-height:1.1">${'<span>🍑</span>'.repeat(n)}</div></div>`;return `<div style="display:flex;gap:clamp(24px,8vw,72px);justify-content:center;align-items:flex-start">${box(a,'A')}${box(b,'B')}</div>`;};
 upgrade('count',()=>{const a=2+rnd(5),b=1+rnd(a-1);return {ask:B('How many more peaches are in A?','A의 복숭아는 몇 개 더 많을까요?'),show:moreSets(a,b),quietShow:true,opts:numO(a-b,[a,b,a-b+1],0,10),sd:{more:true}};});
 upgrade('addsub',()=>{const a=2+rnd(4),b=1+rnd(3),c=1+rnd(a),ans=a+b-c;return {ask:B('How many peaches are left?','복숭아가 몇 개 남을까요?'),askSay:B(`${a} peaches. Get ${b} more, then give away ${c}. How many left?`,`${a}개에서 ${b}개를 받고 ${c}개를 주면 몇 개 남을까요?`),show:`<div class="bigword">${a} + ${b} − ${c} = ?</div>`,opts:numO(ans,[a+b,a-c,ans+1],0,10),sd:{l2:true,a,b}};});
 upgrade('teens',()=>{const a=1+rnd(7),b=1+rnd(9-a),ans=10+a+b;return {ask:B('How many more to reach the total?','모두가 되려면 몇 개 더 필요할까요?'),askSay:B(`Ten and ${a} are here. The total will be ${ans}. How many more?`,`10개와 ${a}개가 있어요. 모두 ${ans}개가 되려면 몇 개 더 필요할까요?`),show:`<div class="bigword">10 + ${a} + ? = ${ans}</div>`,opts:numO(b,[a,a+b,b+1],0,10),sd:{l2:true,a,b}};});
})();
