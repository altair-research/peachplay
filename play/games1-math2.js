'use strict';
// Grade 1 math, part 2: patterns, shapes, fractions (halves and fourths), measurement, time, money, data.
// Standards: PAR.3 (patterns), GSR.4 (shapes and parts), MDR.6 (length, time to the half hour, coins, graphs).

// ---------- 14. Growing and shrinking patterns ----------
G1({
  id: 'growpat', icon: '📈', title: B('Growing Patterns', '커지고 줄어드는 패턴'), sub: B('Skip count and find the rule', '건너뛰어 세고 규칙 찾기'), u: 'Patterns',
  play() {
    const lv = lvl('growpat'), steps = lv === 1 ? [1, 2, 10] : [2, 5, 10, 1, 5], step = pick(steps), shrink = lv === 2 && rnd(3) === 0, kind = pick(lv === 1 ? ['next', 'next', 'rule', 'repeat'] : ['next', 'rule', 'repeat', 'grow', 'next']);
    const O = (ans, bad) => numO(ans, bad, 0, 130);
    if (kind === 'next') {
      const s = shrink ? 40 + step * 4 + rnd(30) : 1 + rnd(30), seq = Array.from({ length: 4 }, (_, i) => shrink ? s - i * step : s + i * step), ans = shrink ? s - 4 * step : s + 4 * step;
      quiz(this, { ask: B('What number comes next?', '다음에 올 수는?'), show: trainHtml([...seq, '?'], 4), opts: O(ans, [ans + 1, ans - 1, ans + step, ans - step]), after: B(`The rule is ${shrink ? 'subtract' : 'add'} ${step}: ${ans}.`, `규칙은 ${step}씩 ${shrink ? '빼기' : '더하기'}: ${ans}.`) });
    } else if (kind === 'rule') {
      const s = 1 + rnd(20), seq = Array.from({ length: 4 }, (_, i) => s + i * step), pool = [1, 2, 5, 10].filter(x => x !== step), ds = shuffle(pool).slice(0, 2), wd = (k) => `+${k}`;
      quiz(this, { ask: B('What is the pattern rule?', '이 패턴의 규칙은 무엇일까요?'), show: trainHtml(seq), opts: [step, ...ds].map(k => ({ html: `<span class="num">${wd(k)}</span>`, label: B(`add ${k}`, `${k}씩 더하기`), ok: k === step })), cls: 'shapes', after: B(`Each number is ${step} more.`, `수가 ${step}씩 커져요.`) });
    } else if (kind === 'repeat') {
      const unit = pick(['AB', 'AAB', 'ABB', 'ABC', 'AABB']), numeric = rnd(2) === 0, pal = numeric ? shuffle(['1', '2', '3', '4', '5']) : shuffle(['🔴', '🔵', '🟢', '🟡', '⭐', '🌙', '🍎', '🐟']), sym = {}; [...new Set(unit)].forEach((c, i) => sym[c] = pal[i]);
      const total = unit.length * 2 + rnd(unit.length), seq = Array.from({ length: total + 1 }, (_, i) => sym[unit[i % unit.length]]), ans = seq[total], pool = pal.slice(0, 5);
      const ds = shuffle(pool.filter(x => x !== ans)).slice(0, 2);
      quiz(this, { ask: B('What comes next in the repeating pattern?', '반복되는 패턴에서 다음에 올 것은?'), show: `<div class="train pat">${seq.slice(0, total).map(s => `<div class="pc">${s}</div>`).join('')}<div class="pc gap">?</div></div>`, opts: [ans, ...ds].map(c => ({ html: `<span class="emo">${c}</span>`, ok: c === ans })), cls: 'shapes', after: B(`The pattern repeats: ${unit}.`, `패턴이 반복돼요: ${unit}.`), onCorrect() { const g = $('.pc.gap'); if (g) { g.classList.remove('gap'); g.textContent = ans; } } });
    } else {
      const g = pick([1, 2]), e = pick(['🟦', '🟩', '🟨']), rows = [1, 2, 3].map(i => g === 1 ? i : i * 2), ans = g === 1 ? 4 : 8;
      quiz(this, { ask: B('The pattern keeps growing. How many in the next one?', '패턴이 계속 커져요. 다음 그림에는 몇 개가 있을까요?'), show: `<div class="growrow">${rows.map(n => `<div class="grow">${Array.from({ length: n }, () => `<span>${e}</span>`).join('')}</div>`).join('')}</div>`, opts: O(ans, [ans - 1, ans + 1, ans + 2]), after: B(`Add ${g === 1 ? 1 : 2} each time: ${ans}.`, `${g === 1 ? 1 : 2}개씩 늘어요: ${ans}.`) });
    }
  }
});

// ---------- 15. Shape detectives ----------
const SH1 = Object.assign({}, SHAPES, {
  half: { n: B('half-circle', '반원'), svg: '<path d="M8 68 A42 42 0 0 1 92 68 Z"/>' },
  quarter: { n: B('quarter-circle', '사분원'), svg: '<path d="M18 86 L18 14 A72 72 0 0 1 90 86 Z"/>' },
  pentagon: { n: B('pentagon', '오각형'), svg: '<polygon points="50,8 92,38 76,88 24,88 8,38"/>' }
});
const sh1 = (k, rot = 0, sc = 1, col = pick(SHAPE_COLORS), flip = false) => `<svg viewBox="0 0 100 100" class="shape" style="transform:rotate(${rot}deg) scale(${flip ? -sc : sc},${sc})" fill="${col}" stroke="#1d3557" stroke-width="3">${SH1[k].svg}</svg>`;
G1({
  id: 'shapeattr', icon: '🔍', title: B('Shape Detectives', '도형 탐정'), sub: B('Sides, corners and faces', '변, 꼭짓점, 면'), u: 'Shapes and attributes',
  play() {
    const lv = lvl('shapeattr'), kind = pick(lv === 1 ? ['name', 'name', 'sides', 'odd'] : ['sides', 'define', 'turn', 'faces', 'odd', 'name']);
    const polys = [['triangle', 3], ['square', 4], ['rectangle', 4], ['pentagon', 5], ['hexagon', 6]];
    if (kind === 'name') {
      const keys = ['circle', 'square', 'triangle', 'rectangle', 'hexagon', 'half', 'quarter'], t = pick(keys), ds = others(keys.filter(k => !((t === 'square' && k === 'rectangle') || (t === 'rectangle' && k === 'square'))), t, 2);
      quiz(this, { ask: B(`Tap the ${SH1[t].n.en.toUpperCase()}.`, `${SH1[t].n.ko} 모양을 눌러요.`), askSay: B(`Tap the ${SH1[t].n.en}.`, `${SH1[t].n.ko} 모양을 눌러요.`), opts: [t, ...ds].map(k => ({ html: sh1(k, rnd(4) * 90 + rnd(2) * 15, 1, pick(SHAPE_COLORS), rnd(2) === 0), ok: k === t })), cls: 'shapes', after: B(`That is a ${SH1[t].n.en}.`, `${SH1[t].n.ko} 모양이에요.`), vocab: SH1[t].n.en });
    } else if (kind === 'sides') {
      const [k, n] = pick(polys), corner = rnd(2) === 0;
      quiz(this, { ask: corner ? B('How many corners does it have?', '꼭짓점(뾰족한 곳)이 몇 개일까요?') : B('How many sides does it have?', '변이 몇 개일까요?'), show: sh1(k, rnd(4) * 45, 1), opts: numO(n, [n - 1, n + 1, n + 2], 3, 8), after: B(`A ${SH1[k].n.en} has ${n} sides and ${n} corners.`, `${SH1[k].n.ko} 모양은 변 ${n}개, 꼭짓점 ${n}개예요.`) });
    } else if (kind === 'define') {
      const facts = { triangle: [B('3 sides and 3 corners', '변 3개, 꼭짓점 3개'), 'triangle'], square: [B('4 equal sides', '길이가 같은 변 4개'), 'square'], rectangle: [B('4 sides and 4 square corners', '변 4개와 직각 꼭짓점 4개'), 'rectangle'], hexagon: [B('6 sides', '변 6개'), 'hexagon'] }, k = pick(Object.keys(facts)), nondef = [B('It is red.', '빨간색이에요.'), B('It is big.', '커요.'), B('It is turned sideways.', '옆으로 돌렸어요.'), B('It is blue.', '파란색이에요.')], ds = shuffle(nondef).slice(0, 2);
      quiz(this, { ask: B(`What makes a shape a ${SH1[k].n.en}?`, `무엇이 ${SH1[k].n.ko} 모양을 만들까요?`), show: sh1(k, 0, 1), opts: [facts[k][0], ...ds].map((v, i) => ({ html: `<span class="word">${L(v)}</span>`, ok: i === 0 })), cls: 'words', after: B('Sides and corners make the shape. Color and size do not.', '변과 꼭짓점이 모양을 정해요. 색과 크기는 상관없어요.') });
    } else if (kind === 'turn') {
      const k = pick(['triangle', 'rectangle', 'hexagon']);
      quiz(this, { ask: B(`This ${SH1[k].n.en} is flipped and turned. Is it still a ${SH1[k].n.en}?`, `${SH1[k].n.ko} 모양을 뒤집고 돌렸어요. 그래도 ${SH1[k].n.ko} 모양일까요?`), show: sh1(k, 90 + rnd(3) * 60, 0.9, '#8338ec', true), opts: [{ html: `<span class="word">${S.lang === 'ko' ? '네, 맞아요' : 'Yes'}</span>`, ok: true }, { html: `<span class="word">${S.lang === 'ko' ? '아니요' : 'No'}</span>`, ok: false }], cls: 'words', after: B('Turning or flipping does not change the shape.', '돌리거나 뒤집어도 모양은 그대로예요.') });
    } else if (kind === 'faces') {
      const info = { cube: 6, cone: 1, cylinder: 2, sphere: 0 }, k = pick(Object.keys(info)), thing = pick(SOLIDS[k].things);
      quiz(this, { ask: B(`How many flat faces does a ${SOLIDS[k].n.en} have?`, `${SOLIDS[k].n.ko}에는 평평한 면이 몇 개 있을까요?`), show: `<span class="emo">${thing[0]}</span>`, opts: numO(info[k], [0, 1, 2, 4, 6, 8].filter(v => v !== info[k]), 0, 8), after: B(`A ${SOLIDS[k].n.en} has ${info[k]} flat ${info[k] === 1 ? 'face' : 'faces'}.`, `${SOLIDS[k].n.ko}의 평평한 면은 ${info[k]}개예요.`), vocab: SOLIDS[k].n.en });
    } else {
      const keys = ['circle', 'square', 'triangle', 'rectangle', 'hexagon'], f = pick(keys), g = pick(keys.filter(x => x !== f && !(['square', 'rectangle'].includes(f) && ['square', 'rectangle'].includes(x)))), oddAt = rnd(4);
      const opts = Array.from({ length: 4 }, (_, i) => ({ html: sh1(i === oddAt ? g : f, rnd(4) * 40, [0.8, 1, 0.9, 1.05][i], SHAPE_COLORS[(i + rnd(3)) % 5], rnd(2) === 0), ok: i === oddAt }));
      quiz(this, { ask: B('Which shape does not belong?', '어느 모양이 다른 모양일까요?'), opts, cls: 'shapes', after: B(`Three are ${SH1[f].n.en}s.`, `세 개는 ${SH1[f].n.ko} 모양이에요.`) });
    }
  }
});

// ---------- 16. Build new shapes ----------
const COMP_COL = ['#ef476f', '#118ab2', '#06d6a0', '#ffb703', '#8338ec', '#ff7e5f'];
const hexPart = (i) => { const p = (j) => { const a = (j * 60 - 90) * Math.PI / 180; return `${(50 + 42 * Math.cos(a)).toFixed(1)},${(50 + 42 * Math.sin(a)).toFixed(1)}`; }; return { pts: `50,50 ${p(i)} ${p(i + 1)}`, c: [50 + 28 * Math.cos(((i + .5) * 60 - 90) * Math.PI / 180), 50 + 28 * Math.sin(((i + .5) * 60 - 90) * Math.PI / 180)] }; };
const COMPS = [
  { shape: 'square', n: B('square', '정사각형'), parts: [{ pts: '8,8 92,8 8,92', c: [36, 36] }, { pts: '92,8 92,92 8,92', c: [64, 64] }], what: B('2 triangles', '삼각형 2개') },
  { shape: 'wide rectangle', n: B('rectangle', '직사각형'), parts: [{ pts: '5,20 95,20 5,80', c: [35, 40] }, { pts: '95,20 95,80 5,80', c: [65, 60] }], what: B('2 triangles', '삼각형 2개') },
  { shape: 'long rectangle', n: B('rectangle', '직사각형'), parts: [{ pts: '8,30 50,30 50,72 8,72', c: [29, 51] }, { pts: '50,30 92,30 92,72 50,72', c: [71, 51] }], what: B('2 squares', '정사각형 2개') },
  { shape: 'longer rectangle', n: B('rectangle', '직사각형'), parts: [{ pts: '5,34 36,34 36,65 5,65', c: [20, 50] }, { pts: '36,34 67,34 67,65 36,65', c: [51, 50] }, { pts: '67,34 98,34 98,65 67,65', c: [82, 50] }], what: B('3 squares', '정사각형 3개') },
  { shape: 'house', n: B('house shape (pentagon)', '집 모양(오각형)'), parts: [{ pts: '24,40 76,40 76,92 24,92', c: [50, 66] }, { pts: '24,40 76,40 50,8', c: [50, 29] }], what: B('a square and a triangle', '정사각형 1개와 삼각형 1개') },
  { shape: 'circle', n: B('circle', '동그라미(원)'), parts: [{ d: 'M10 50 A40 40 0 0 1 90 50 Z', c: [50, 30] }, { d: 'M10 50 A40 40 0 0 0 90 50 Z', c: [50, 70] }], what: B('2 half-circles', '반원 2개') },
  { shape: 'circle4', n: B('circle', '동그라미(원)'), parts: [{ d: 'M50 50 L50 10 A40 40 0 0 1 90 50 Z', c: [68, 32] }, { d: 'M50 50 L90 50 A40 40 0 0 1 50 90 Z', c: [68, 68] }, { d: 'M50 50 L50 90 A40 40 0 0 1 10 50 Z', c: [32, 68] }, { d: 'M50 50 L10 50 A40 40 0 0 1 50 10 Z', c: [32, 32] }], what: B('4 quarter-circles', '사분원 4개'), circle: true },
  { shape: 'hexagon', n: B('hexagon', '육각형'), parts: [0, 1, 2, 3, 4, 5].map(hexPart), what: B('6 triangles', '삼각형 6개') }
];
COMPS[5].circle = true;
const partEl = (p, fill, tf = '') => (p.pts ? `<polygon points="${p.pts}"` : `<path d="${p.d}"`) + ` fill="${fill}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round" ${tf ? `transform="${tf}"` : ''}/>`;
const compWhole = (cp) => `<svg viewBox="0 0 100 100" class="comp">${cp.parts.map((p, i) => partEl(p, COMP_COL[i % 6])).join('')}</svg>`;
const compApart = (cp) => `<svg viewBox="0 0 100 100" class="comp">${cp.parts.map((p, i) => { const [cx, cy] = p.c, tx = (cx - 50) * 0.55, ty = (cy - 50) * 0.55; return partEl(p, COMP_COL[i % 6], `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) translate(${cx} ${cy}) scale(.78) translate(${-cx} ${-cy})`); }).join('')}</svg>`;
G1({
  id: 'shapecompose', icon: '🧩', title: B('Build New Shapes', '도형 합치기'), sub: B('Put shapes together', '도형을 합쳐 새 모양'), u: 'Composing shapes',
  play() {
    const lv = lvl('shapecompose'), cp = pick(lv === 1 ? COMPS.filter(c => c.parts.length <= 2) : COMPS), kind = lv === 1 ? 'make' : pick(['make', 'whatpieces', 'count']);
    const sameShape = (a, b) => a.n.en === b.n.en && ((a.circle ? 1 : 0) === (b.circle ? 1 : 0)) || (a.circle && b.circle) || a.shape === b.shape;
    const other = (n) => shuffle(COMPS.filter(c => !sameShape(c, cp) && c.what.en !== cp.what.en)).filter((c, i, ar) => ar.findIndex(d => d.n.en === c.n.en && d.shape.slice(0, 6) === c.shape.slice(0, 6)) === i).slice(0, n);
    if (kind === 'make') {
      const ds = other(2); quiz(this, { ask: B('What shape can you make with these pieces?', '이 조각들로 어떤 모양을 만들 수 있을까요?'), show: compApart(cp), opts: [cp, ...ds].map((c, i) => ({ html: compWhole(c), ok: i === 0 })), cls: 'shapes', after: B(`${L(cp.what)} make a ${L(cp.n)}.`, `${cp.what.ko}로 ${cp.n.ko}을 만들 수 있어요.`) });
    } else if (kind === 'whatpieces') {
      const ds = other(2); quiz(this, { ask: B('Which pieces make this shape?', '어떤 조각들로 이 모양을 만들까요?'), show: compWhole(cp), opts: [cp, ...ds].map((c, i) => ({ html: compApart(c), ok: i === 0 })), cls: 'shapes', after: B(`${L(cp.what)} make this shape.`, `${cp.what.ko}로 이 모양을 만들어요.`) });
    } else {
      const n = cp.parts.length; quiz(this, { ask: B('How many pieces make this shape?', '이 모양은 조각이 몇 개로 이루어져 있을까요?'), show: compWhole(cp), opts: numO(n, [n - 1, n + 1, 2, 4].filter(v => v !== n && v > 0), 1, 8), after: B(`${n} pieces: ${L(cp.what)}.`, `조각 ${n}개: ${cp.what.ko}.`) });
    }
  }
});

// ---------- 17. Halves and fourths ----------
const partSvg = (shape, n, equal, v = 0) => {
  const st = 'stroke="#1d3557" stroke-width="3" fill="#ffd166"';
  if (shape === 'circle') {
    let lines = '';
    if (n === 2) lines = equal ? '<line x1="50" y1="8" x2="50" y2="92"/>' : '<line x1="30" y1="14" x2="30" y2="86"/>';
    else if (n === 4) lines = equal ? '<line x1="50" y1="8" x2="50" y2="92"/><line x1="8" y1="50" x2="92" y2="50"/>' : '<line x1="50" y1="8" x2="50" y2="92"/><line x1="8" y1="30" x2="92" y2="30"/>';
    else lines = '<line x1="50" y1="50" x2="50" y2="8"/><line x1="50" y1="50" x2="86" y2="71"/><line x1="50" y1="50" x2="14" y2="71"/>';
    return `<svg viewBox="0 0 100 100" class="shape"><circle cx="50" cy="50" r="42" ${st}/><g stroke="#1d3557" stroke-width="3">${lines}</g></svg>`;
  }
  let lines = '';
  if (n === 2) lines = equal ? (v === 0 ? '<line x1="50" y1="14" x2="50" y2="86"/>' : v === 1 ? '<line x1="10" y1="50" x2="90" y2="50"/>' : '<line x1="10" y1="14" x2="90" y2="86"/>') : '<line x1="30" y1="14" x2="30" y2="86"/>';
  else if (n === 4) lines = equal ? (v === 0 ? '<line x1="50" y1="14" x2="50" y2="86"/><line x1="10" y1="50" x2="90" y2="50"/>' : '<line x1="30" y1="14" x2="30" y2="86"/><line x1="50" y1="14" x2="50" y2="86"/><line x1="70" y1="14" x2="70" y2="86"/>') : '<line x1="22" y1="14" x2="22" y2="86"/><line x1="40" y1="14" x2="40" y2="86"/><line x1="72" y1="14" x2="72" y2="86"/>';
  else lines = '<line x1="37" y1="14" x2="37" y2="86"/><line x1="63" y1="14" x2="63" y2="86"/>';
  return `<svg viewBox="0 0 100 100" class="shape"><rect x="10" y="14" width="80" height="72" rx="3" ${st}/><g stroke="#1d3557" stroke-width="3">${lines}</g></svg>`;
};
G1({
  id: 'partition', icon: '🍕', title: B('Halves and Fourths', '반과 4분의 1'), sub: B('Equal shares', '똑같이 나누기'), u: 'Equal shares',
  play() {
    const lv = lvl('partition'), shape = pick(['circle', 'rect']), kind = pick(lv === 1 ? ['which2', 'which2', 'count', 'name'] : ['which4', 'which2', 'count', 'name', 'size', 'whole']), v = rnd(3);
    const word = (n) => (n === 2 ? B('halves', '반(2등분)') : B('fourths (quarters)', '4분의 1(4등분)'));
    if (kind === 'which2' || kind === 'which4') {
      const n = kind === 'which2' ? 2 : 4, opts = [{ html: partSvg(shape, n, true, shape === 'rect' ? v % 2 : 0), ok: true }, { html: partSvg(shape, n, false), ok: false }, { html: partSvg(shape, n === 2 ? 3 : 2, true), ok: false }];
      quiz(this, { ask: n === 2 ? B('Which shows HALVES (2 equal shares)?', '똑같은 2조각(반)으로 나눈 것은?') : B('Which shows FOURTHS (4 equal shares)?', '똑같은 4조각(4분의 1)으로 나눈 것은?'), askSay: n === 2 ? B('Which shows halves, 2 equal shares?', '똑같은 2조각으로 나눈 것은?') : B('Which shows fourths, 4 equal shares?', '똑같은 4조각으로 나눈 것은?'), opts, cls: 'shapes', after: B('Equal shares are exactly the same size.', '똑같은 조각은 크기가 정확히 같아요.') });
    } else if (kind === 'count') {
      const n = pick([2, 4]); quiz(this, { ask: B('How many equal shares?', '똑같은 조각이 몇 개일까요?'), show: partSvg(shape, n, true, shape === 'rect' ? v % 2 : 0), opts: numO(n, [2, 3, 4].filter(x => x !== n), 1, 6), after: B(`${n} equal shares.`, `똑같은 조각 ${n}개.`) });
    } else if (kind === 'name') {
      const n = pick([2, 4]); quiz(this, { ask: B('These equal shares are called...', '이 똑같은 조각을 무엇이라고 부를까요?'), show: partSvg(shape, n, true, shape === 'rect' ? v % 2 : 0), opts: [2, 4].map(k => ({ html: `<span class="word">${L(word(k))}</span>`, ok: k === n })), cls: 'words', after: B(n === 2 ? 'Two equal shares are halves.' : 'Four equal shares are fourths, or quarters.', n === 2 ? '똑같은 2조각은 반(halves)이에요.' : '똑같은 4조각은 4분의 1(fourths, quarters)이에요.'), vocab: n === 2 ? 'halves' : 'fourths' });
    } else if (kind === 'size') {
      quiz(this, { ask: B('Two pizzas are the same size. One is cut in halves and one in fourths. Which shares are bigger?', '크기가 같은 피자 두 판이에요. 하나는 반으로, 하나는 4조각으로 잘랐어요. 어느 조각이 더 클까요?'), show: `<div class="story">${partSvg('circle', 2, true)}<span class="op">vs</span>${partSvg('circle', 4, true)}</div>`, opts: [{ html: `<span class="word">${L(B('Halves (2 shares)', '반 (2조각)'))}</span>`, ok: true }, { html: `<span class="word">${L(B('Fourths (4 shares)', '4분의 1 (4조각)'))}</span>`, ok: false }, { html: `<span class="word">${L(B('The same', '같아요'))}</span>`, ok: false }], cls: 'words', after: B('More equal shares means smaller shares.', '조각 수가 많을수록 한 조각은 작아져요.') });
    } else {
      const n = pick([2, 4]); quiz(this, { ask: B(`How many ${n === 2 ? 'halves' : 'fourths'} make the whole?`, `${n === 2 ? '반' : '4분의 1'}이 몇 개 모여야 전체가 될까요?`), show: partSvg(shape, n, true, shape === 'rect' ? v % 2 : 0), opts: numO(n, [2, 3, 4, 1].filter(x => x !== n), 1, 6), after: B(`${n} ${n === 2 ? 'halves' : 'fourths'} make 1 whole.`, `${n === 2 ? '반' : '4분의 1'}이 ${n}개 모이면 전체가 돼요.`) });
    }
  }
});

// ---------- 18. Measure with cubes ----------
const cubeRow = (L, opts = {}) => { const cs = 26, gap = opts.gap || 0, over = opts.over || 0, off = opts.off || 0; let s = ''; for (let i = 0; i < L; i++) s += `<rect x="${off + i * (cs + gap - over)}" y="34" width="${cs}" height="${cs}" fill="${['#4fd1b8', '#5aa9e6', '#ffc94d', '#f78fb3'][i % 4]}" stroke="#1d3557" stroke-width="1.5"/>`; return s; };
const lenSvg = (name, e, L, opts = {}) => { const W = Math.max(L, opts.cubes || L) * 28 + 20; return `<svg viewBox="0 0 ${W} 68" class="lensvg"><rect x="${opts.off || 0}" y="6" width="${L * 26}" height="22" rx="5" fill="#ffd9a8" stroke="#1d3557" stroke-width="1.5"/><text x="${(opts.off || 0) + 6}" y="22" font-size="14">${e}</text>${cubeRow(opts.cubes || L, opts)}</svg>`; };
const LEN_OBJ = [['pencil', '연필', '✏️'], ['ribbon', '리본', '🎀'], ['crayon', '크레용', '🖍️'], ['carrot', '당근', '🥕'], ['book', '책', '📕'], ['key', '열쇠', '🔑']];
G1({
  id: 'cubelength', icon: '📏', title: B('Measure with Cubes', '블록으로 길이 재기'), sub: B('Count the cubes', '블록 개수로 재요'), u: 'Length',
  play() {
    const lv = lvl('cubelength'), kind = pick(lv === 1 ? ['count', 'count', 'longest'] : ['count', 'correct', 'longest', 'order', 'more']);
    const objs = shuffle(LEN_OBJ), nm = (o) => B(o[0], o[1]);
    if (kind === 'count') {
      const L1 = 2 + rnd(lv === 1 ? 6 : 9), o = objs[0];
      quiz(this, { ask: B(`How many cubes long is the ${o[0]}?`, `${o[1]}의 길이는 블록 몇 개일까요?`), show: lenSvg(o[0], o[2], L1), opts: numO(L1, [L1 - 1, L1 + 1, L1 + 2], 1, 12), after: B(`The ${o[0]} is ${L1} cubes long.`, `${o[1]}의 길이는 블록 ${L1}개예요.`) });
    } else if (kind === 'correct') {
      const L1 = 4 + rnd(4), o = objs[0], right = lenSvg(o[0], o[2], L1), gaps = lenSvg(o[0], o[2], L1, { cubes: L1 - 1, gap: 6 }), over = lenSvg(o[0], o[2], L1, { cubes: L1 + 2, over: 6 });
      quiz(this, { ask: B('Which one measures correctly? (no gaps, no overlaps)', '바르게 잰 것은? (틈도 겹침도 없이)'), askSay: B('Which one measures correctly, with no gaps and no overlaps?', '틈도 겹침도 없이 바르게 잰 것은?'), opts: [{ html: right, ok: true }, { html: gaps, ok: false }, { html: over, ok: false }], cls: 'groups', after: B('Cubes go end to end, with no gaps and no overlaps.', '블록은 틈이나 겹침 없이 끝과 끝을 이어 놓아요.') });
    } else if (kind === 'longest' || kind === 'order') {
      const n = lv === 1 ? 2 : 3, lens = shuffle([2, 3, 4, 5, 6, 7, 8]).slice(0, n), os = objs.slice(0, n), asc = rnd(2) === 0, target = asc ? Math.min(...lens) : Math.max(...lens);
      if (kind === 'order') {
        const idx = os.map((_, i) => i).sort((a, b) => lens[a] - lens[b]), right = idx.map(i => os[i][2]).join(' '), cand = [right, [...idx].reverse().map(i => os[i][2]).join(' '), [idx[1], idx[0], idx[2]].map(i => os[i][2]).join(' ')];
        quiz(this, { ask: B('Put them in order from SHORTEST to LONGEST.', '가장 짧은 것부터 긴 순서로 놓은 것은?'), show: `<div class="lenlist">${os.map((o, i) => lenSvg(o[0], o[2], lens[i])).join('')}</div>`, opts: [...new Set(cand)].map(v => ({ html: `<span class="word">${v}</span>`, ok: v === right })), cls: 'words', after: B(`${lens.slice().sort((a, b) => a - b).join(' < ')} cubes`, `${lens.slice().sort((a, b) => a - b).join(' < ')}개`) });
      } else {
        quiz(this, { ask: asc ? B('Which one is the SHORTEST?', '가장 짧은 것은?') : B('Which one is the LONGEST?', '가장 긴 것은?'), askSay: asc ? B('Which one is the shortest?', '가장 짧은 것은?') : B('Which one is the longest?', '가장 긴 것은?'), show: `<div class="lenlist">${os.map((o, i) => lenSvg(o[0], o[2], lens[i])).join('')}</div>`, opts: os.map((o, i) => ({ html: `<span class="emo">${o[2]}</span>`, label: nm(o), ok: lens[i] === target })), cls: 'shapes', after: B(`${target} cubes.`, `${target}개 길이.`) });
      }
    } else {
      const a = 3 + rnd(5), d = 1 + rnd(4), o1 = objs[0], o2 = objs[1];
      quiz(this, { ask: B(`The ${o2[0]} is ${a + d} cubes. The ${o1[0]} is ${a} cubes. How many more cubes is the ${o2[0]}?`, `${o2[1]}의 길이는 블록 ${a + d}개, ${o1[1]}의 길이는 ${a}개예요. ${o2[1]}의 길이는 ${o1[1]}보다 블록 몇 개 더 길까요?`), show: `<div class="lenlist">${lenSvg(o2[0], o2[2], a + d)}${lenSvg(o1[0], o1[2], a)}</div>`, opts: numO(d, [d + 1, d - 1, a], 0, 9), after: B(`${a + d} − ${a} = ${d}`, `${a + d} − ${a} = ${d}`) });
    }
  }
});

// ---------- 19. Hours and half hours ----------
const clock2 = (h, m, hourOnly = false) => {
  let s = '<circle cx="50" cy="50" r="46" fill="#fff" stroke="#1d3557" stroke-width="3"/>';
  for (let i = 0; i < 60; i += 5) { const a = (i * 6 - 90) * Math.PI / 180; s += `<line x1="${50 + 41 * Math.cos(a)}" y1="${50 + 41 * Math.sin(a)}" x2="${50 + 45 * Math.cos(a)}" y2="${50 + 45 * Math.sin(a)}" stroke="#1d3557" stroke-width="1.6"/>`; }
  for (let i = 1; i <= 12; i++) { const a = (i * 30 - 90) * Math.PI / 180; s += `<text x="${50 + 34 * Math.cos(a)}" y="${50 + 34 * Math.sin(a) + 3.5}" font-size="10" font-weight="800" text-anchor="middle" fill="#1d3557">${i}</text>`; }
  const ha = (((h % 12) + m / 60) * 30 - 90) * Math.PI / 180, ma = (m * 6 - 90) * Math.PI / 180;
  s += `<line x1="50" y1="50" x2="${50 + 20 * Math.cos(ha)}" y2="${50 + 20 * Math.sin(ha)}" stroke="#ef476f" stroke-width="5" stroke-linecap="round"/>`;
  if (!hourOnly) s += `<line x1="50" y1="50" x2="${50 + 30 * Math.cos(ma)}" y2="${50 + 30 * Math.sin(ma)}" stroke="#118ab2" stroke-width="3" stroke-linecap="round"/>`;
  return `<svg viewBox="0 0 100 100" class="clocksvg">${s}<circle cx="50" cy="50" r="3.4" fill="#1d3557"/></svg>`;
};
const timeStr = (h, m) => `${h}:${m === 0 ? '00' : '30'}`;
const numLineHours = (start, hrs) => { let s = '<line x1="10" y1="30" x2="290" y2="30" stroke="#1d3557" stroke-width="3"/>'; const n = hrs + 1; for (let i = 0; i < n; i++) { const x = 20 + i * (260 / hrs); s += `<line x1="${x}" y1="22" x2="${x}" y2="38" stroke="#1d3557" stroke-width="3"/><text x="${x}" y="56" font-size="14" font-weight="800" text-anchor="middle" fill="#1d3557">${i === n - 1 ? '?' : ((start - 1 + i) % 12) + 1}</text>`; } return `<svg viewBox="0 0 300 66" class="nlsvg">${s}</svg>`; };
const AMPM = [[B('wake up for school', '학교에 가려고 일어나요'), 7, 'AM'], [B('eat lunch', '점심을 먹어요'), 12, 'PM'], [B('eat dinner', '저녁을 먹어요'), 6, 'PM'], [B('go to bed', '잠자리에 들어요'), 8, 'PM'], [B('eat breakfast', '아침을 먹어요'), 7, 'AM'], [B('watch the sunrise', '해 뜨는 것을 봐요'), 6, 'AM']];
G1({
  id: 'clock1', icon: '🕒', title: B('Hours and Half Hours', '정각과 30분'), sub: B('Analog and digital clocks', '시계 읽기'), u: 'Time',
  play() {
    const lv = lvl('clock1'), h = 1 + rnd(12), m = lv === 1 ? 0 : pick([0, 30]), kind = pick(lv === 1 ? ['read', 'read', 'match'] : ['read', 'match', 'elapsed', 'read']);
    const wrongTimes = (h, m) => { const set = new Set([timeStr(h, m)]); let g = 0; while (set.size < 3 && g++ < 40) set.add(timeStr(((h - 1 + pick([-2, -1, 1, 2, 3]) + 12) % 12) + 1, pick([0, 30]) * (lv === 1 ? 0 : 1))); if (lv === 2 && m === 30) set.add(timeStr(h, 0)); if (lv === 2 && m === 0) set.add(timeStr(h, 30)); return [...set]; };
    if (kind === 'read') {
      const right = timeStr(h, m), ts = [right, ...shuffle(wrongTimes(h, m).filter(t => t !== right)).slice(0, 2)];
      quiz(this, { ask: B('What time does the clock show?', '시계가 가리키는 시각은?'), show: clock2(h, m), opts: ts.map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === right })), cls: 'shapes', after: B(m === 0 ? `It is ${h} o'clock.` : `It is half past ${h}.`, m === 0 ? `${h}시 정각이에요.` : `${h}시 30분이에요.`), vocab: m === 0 ? `${h} o'clock` : `half past ${h}` });
    } else if (kind === 'match') {
      const right = timeStr(h, m), wrongs = shuffle(wrongTimes(h, m).filter(t => t !== right)).slice(0, 2), spec = (t) => [+t.split(':')[0], t.endsWith('30') ? 30 : 0];
      quiz(this, { ask: B(`Which clock shows ${right}?`, `${right}을 가리키는 시계는?`), opts: [right, ...wrongs].map(t => { const [hh, mm] = spec(t); return { html: clock2(hh, mm), ok: t === right }; }), cls: 'shapes', after: B(`${right} is ${m === 0 ? "o'clock" : 'half past'}.`, `맞아요! ${right}이에요.`) });
    } else if (kind === 'elapsed') {
      const hrs = 2 + rnd(3), start = 1 + rnd(8), ans = ((start - 1 + hrs) % 12) + 1;
      quiz(this, { ask: B(`It is ${start}:00. What time will it be in ${hrs} hours?`, `지금은 ${start}:00이에요. ${hrs}시간 뒤는 몇 시일까요?`), show: numLineHours(start, hrs), opts: numO(ans, [ans + 1, ans - 1, start + hrs + 1, hrs], 1, 12).map(o => ({ html: o.html.replace(/>(\d+)</, (m1, v) => `>${v}:00<`), ok: o.ok })), after: B(`${start}:00 plus ${hrs} hours is ${ans}:00.`, `${start}:00에서 ${hrs}시간 뒤는 ${ans}:00이에요.`) });
    } else {
      const it = pick(AMPM), right = it[2], tm = `${it[1]}:00`;
      quiz(this, { ask: B(`You ${L(it[0])} at ${tm}. Is that AM or PM?`, `${tm}에 ${it[0].ko}. 오전(AM)일까요, 오후(PM)일까요?`), show: clock2(it[1], 0), opts: ['AM', 'PM'].map(v => ({ html: `<span class="word">${v}${S.lang === 'ko' ? (v === 'AM' ? ' (오전)' : ' (오후)') : ''}</span>`, ok: v === right })), cls: 'words', after: B(`${tm} ${right}`, `${tm} ${right === 'AM' ? '오전' : '오후'}`) });
    }
  }
});

// ---------- 20. Pennies, nickels, dimes, quarters ----------
const coinRow = (list) => `<div class="coinrow">${list.map(k => coinSvg(k)).join('')}</div>`;
const coinTotal = (list) => list.reduce((s, k) => s + COINS[k].v, 0);
G1({
  id: 'coins1', icon: '🪙', title: B('Coins and Quarters', '동전과 쿼터'), sub: B('Which is worth more?', '어느 쪽 값이 더 클까?'), u: 'Money',
  play() {
    const lv = lvl('coins1'), kind = pick(lv === 1 ? ['quarter', 'size', 'worth'] : ['compare', 'compare', 'size', 'worth', 'equal']);
    if (kind === 'quarter') {
      quiz(this, { ask: B('How many cents is a QUARTER worth?', '쿼터(quarter)는 몇 센트일까요?'), askSay: B('How many cents is a quarter worth?', '쿼터는 몇 센트일까요?'), show: coinSvg('quarter'), opts: numO(25, [10, 5, 20, 15], 1, 30).map(o => ({ html: o.html.replace(/>(\d+)</, '>$1¢<'), ok: o.ok })), after: B('A quarter is worth 25 cents.', '쿼터는 25센트예요.'), vocab: 'A quarter is worth 25 cents.' });
    } else if (kind === 'size') {
      const pairs = [['dime', 'nickel'], ['nickel', 'penny'], ['quarter', 'dime'], ['dime', 'penny']], [hi, lo] = pick(pairs), bigSize = ['dime', 'nickel', 'quarter', 'penny'].sort((a, b) => COINS[b].r - COINS[a].r)[0];
      const pr = [['dime', 'nickel']]; // size is not value: dime is smaller than a nickel but worth more
      quiz(this, { ask: B('Which coin is worth MORE: a dime or a nickel?', '다임과 니켈 중 어느 동전의 값이 더 클까요?'), askSay: B('Which coin is worth more, a dime or a nickel?', '다임과 니켈 중 어느 동전의 값이 더 클까요?'), show: '<div class="note2">' + L(B('Size does not tell the value!', '동전이 크다고 값이 큰 것은 아니에요!')) + '</div>', opts: ['nickel', 'dime'].map(k => ({ html: coinSvg(k), label: COINS[k].n, ok: k === 'dime' })), cls: 'shapes', after: B('A dime (10¢) is worth more than a nickel (5¢), even though it is smaller.', '다임(10¢)이 니켈(5¢)보다 작아도 값은 더 커요.') });
    } else if (kind === 'worth') {
      const k = pick(['penny', 'nickel', 'dime', 'quarter']);
      quiz(this, { ask: B(`How many cents is a ${COINS[k].n.en.toUpperCase()} worth?`, `${COINS[k].n.ko}의 값은 몇 센트일까요?`), askSay: B(`How many cents is a ${COINS[k].n.en} worth?`, `${COINS[k].n.ko}의 값은 몇 센트일까요?`), show: coinSvg(k), opts: [1, 5, 10, 25].map(v => ({ html: `<span class="num">${v}¢</span>`, ok: v === COINS[k].v })).filter((o, i, ar) => true).slice(0, 4), after: B(`A ${COINS[k].n.en} is ${COINS[k].v} cents.`, `${COINS[k].n.ko}의 값은 ${COINS[k].v}센트예요.`), vocab: COINS[k].n.en });
    } else if (kind === 'equal') {
      const sets = [[['nickel', 'nickel', 'nickel', 'nickel', 'nickel'], ['quarter']], [['dime', 'dime', 'nickel'], ['quarter']], [['penny', 'penny', 'penny', 'penny', 'penny', 'penny', 'penny', 'penny', 'penny', 'penny'], ['dime']], [['dime', 'dime'], ['nickel', 'nickel', 'nickel', 'nickel']], [['dime', 'dime', 'dime'], ['quarter']], [['nickel', 'nickel', 'nickel', 'nickel'], ['quarter']], [['penny', 'penny', 'penny', 'penny', 'penny', 'penny', 'penny', 'penny', 'penny'], ['dime']], [['dime', 'nickel'], ['dime', 'dime']]], [a, b] = pick(sets), same = coinTotal(a) === coinTotal(b);
      quiz(this, { ask: B('Are these worth the SAME amount?', '이 둘은 값이 같을까요?'), show: `<div class="story">${coinRow(a)}<span class="op">=?</span>${coinRow(b)}</div>`, opts: [{ html: `<span class="word">${S.lang === 'ko' ? '네, 같아요' : 'Yes, the same'}</span>`, ok: same }, { html: `<span class="word">${S.lang === 'ko' ? '아니요, 달라요' : 'No, different'}</span>`, ok: !same }], cls: 'words', after: B(`${coinTotal(a)}¢ ${same ? '=' : '≠'} ${coinTotal(b)}¢`, `${coinTotal(a)}¢ ${same ? '=' : '≠'} ${coinTotal(b)}¢`) });
    } else {
      const mk = () => { const pool = ['penny', 'nickel', 'dime', 'quarter'], n = 1 + rnd(3), l = []; for (let i = 0; i < n; i++) l.push(pick(pool)); return l; };
      let a = mk(), b = mk(), g = 0; while ((coinTotal(a) === coinTotal(b) || coinTotal(a) > 60 || coinTotal(b) > 60) && g++ < 60) { a = mk(); b = mk(); }
      if (coinTotal(a) === coinTotal(b)) { a = ['quarter']; b = ['dime', 'dime']; }
      const ta = coinTotal(a), tb = coinTotal(b);
      quiz(this, { ask: B('Which is worth MORE?', '어느 쪽의 값이 더 클까요?'), askSay: B('Which is worth more?', '어느 쪽의 값이 더 클까요?'), opts: [a, b].map(l => ({ html: coinRow(l), ok: coinTotal(l) === Math.max(ta, tb) })), cls: 'groups', after: B(`${ta}¢ and ${tb}¢.`, `${ta}¢와 ${tb}¢.`) });
    }
  }
});

// ---------- 21. Read the graph ----------
G1({
  id: 'graph1', icon: '📊', title: B('Read the Graph', '그래프 읽기'), sub: B('Compare and order', '비교하고 순서 정하기'), u: 'Graphs and data',
  play() {
    const lv = lvl('graph1'), pool = shuffle([['🍎', 'apples', '사과'], ['🍌', 'bananas', '바나나'], ['🍇', 'grapes', '포도'], ['🍑', 'peaches', '복숭아'], ['🍓', 'strawberries', '딸기']]), n = lv === 1 ? 3 : 4, cats = pool.slice(0, n), counts = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n), kind = pick(lv === 1 ? ['most', 'least', 'howmany'] : ['most', 'least', 'more', 'order', 'question']), bar = lv === 2 && (kind === 'question' || rnd(2) === 0);
    const col = (c, v) => `<div class="gcol"><div class="gstack">${Array.from({ length: v }, () => `<span>${c[0]}</span>`).join('')}</div><div class="glabel">${c[0]}</div></div>`;
    const barRow = (c, v) => `<div class="brow"><span class="bl">${c[0]}</span><span class="bar" style="width:${v * 9}%"></span><b>${v}</b></div>`;
    const show = bar ? `<div class="bargraph">${cats.map((c, i) => barRow(c, counts[i])).join('')}</div>` : `<div class="graph">${cats.map((c, i) => col(c, counts[i])).join('')}</div>`;
    const mx = Math.max(...counts), mn = Math.min(...counts);
    if (kind === 'most' || kind === 'least') {
      const t = kind === 'most' ? mx : mn; quiz(this, { ask: kind === 'most' ? B('Which has the MOST?', '가장 많은 것은?') : B('Which has the FEWEST?', '가장 적은 것은?'), askSay: kind === 'most' ? B('Which has the most?', '가장 많은 것은?') : B('Which has the fewest?', '가장 적은 것은?'), show, opts: cats.map((c, i) => ({ html: `<span class="emo">${c[0]}</span>`, ok: counts[i] === t })), cls: 'shapes', after: B(`${t} ${t === 1 ? 'is' : 'are'} the ${kind === 'most' ? 'most' : 'fewest'}.`, `${t}개로 ${kind === 'most' ? '가장 많아요' : '가장 적어요'}.`) });
    } else if (kind === 'howmany') {
      const i = rnd(n); quiz(this, { ask: B(`How many ${cats[i][1]}?`, `${cats[i][2]}는 몇 개일까요?`), show, opts: numO(counts[i], [counts[i] + 1, counts[i] - 1], 0, 10), after: B(`${counts[i]}`, `${counts[i]}`) });
    } else if (kind === 'more') {
      let i = rnd(n), j = (i + 1 + rnd(n - 1)) % n; if (counts[i] < counts[j]) [i, j] = [j, i]; const d = counts[i] - counts[j];
      quiz(this, { ask: B(`How many more ${cats[i][1]} than ${cats[j][1]}?`, `${cats[i][2]}가 ${cats[j][2]}보다 몇 개 더 많을까요?`), show, opts: numO(d, [d + 1, d - 1, counts[i], counts[j]], 0, 9), after: B(`${counts[i]} − ${counts[j]} = ${d}`, `${counts[i]} − ${counts[j]} = ${d}`) });
    } else if (kind === 'order') {
      const idx = cats.map((_, i) => i).sort((a, b) => counts[a] - counts[b]), right = idx.map(i => cats[i][0]).join(' '), cand = [right, [...idx].reverse().map(i => cats[i][0]).join(' '), [idx[1], idx[0], idx[2], idx[3]].map(i => cats[i][0]).join(' ')];
      quiz(this, { ask: B('Which list goes from FEWEST to MOST?', '가장 적은 것부터 많은 순서로 놓은 것은?'), show, opts: [...new Set(cand)].map(v => ({ html: `<span class="word">${v}</span>`, ok: v === right })), cls: 'words', after: B(`${idx.map(i => counts[i]).join(' < ')}`, `${idx.map(i => counts[i]).join(' < ')}`) });
    } else {
      const c = pick(cats), good = B(`How many ${c[1]} are there?`, `${c[2]}는 몇 개 있을까요?`), bad = [B('What color is the sky?', '하늘은 무슨 색일까요?'), B('Who is the tallest?', '누가 가장 키가 클까요?'), B('What time is it?', '지금 몇 시일까요?')];
      quiz(this, { ask: B('Which question can this graph answer?', '이 그래프로 답할 수 있는 질문은?'), show, opts: [good, ...shuffle(bad).slice(0, 2)].map((q, i) => ({ html: `<span class="word">${L(q)}</span>`, ok: i === 0 })), cls: 'words', after: B('A graph answers questions about the things it shows.', '그래프로 답을 알 수 있는 질문은 그래프에 나온 것에 대한 질문이에요.') });
    }
  }
});
