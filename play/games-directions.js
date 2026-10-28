'use strict';
// Teacher Words (directions): K school direction words. A K school check asked "Draw a picture to represent 8" and the
// child wrote only "8"; the child could count but did not know the direction word (docs/k-assessment-2026-10.md).
//   level 1: hear one direction word (circle, cross out, trace ...) -> pick the picture that shows that action.
//   level 2: a short school direction ("Circle the biggest one.") -> pick the answer paper that followed it.
//            Wrong papers follow a different direction word, or the right word on the wrong thing (two things to check).
// The answer is always a picture. Emoji and numerals are drawn from data-e attributes by CSS, so the option text is empty
// and nothing written on a paper can give the word away (Q1). Korean mode keeps the English direction word (it is the thing
// to learn), speaks it in English, and shows the Korean meaning after the answer. Original items; no worksheet text copied.
// Design and integration notes: docs/review/impl-directions.md, docs/review/integ-directions.md.
(() => {
  const ID = 'directions';
  const e = (ch, cls = '') => `<span class="dr-e${cls ? ' ' + cls : ''}" data-e="${ch}"></span>`;
  const paper = (inner, cls = '') => `<span class="dr-paper${cls ? ' ' + cls : ''}">${inner}</span>`;
  // bub: '' none, 'o' empty answer bubble under the picture, 'f' filled bubble
  const cell = (ch, mark = '', cls = '', bub = '') => `<span class="dr-c${mark ? ' dr-m-' + mark : ''}${cls ? ' ' + cls : ''}">${e(ch)}${bub ? `<span class="dr-bb${bub === 'f' ? ' on' : ''}"></span>` : ''}</span>`;

  // ---------- picture pools ----------
  const KINDS = {
    animal: { en: 'animal', pl: 'animals', ko: '동물', items: ['🐶', '🐱', '🐰', '🐸', '🐻', '🐮', '🐷', '🐵', '🐔', '🐟'] },
    food: { en: 'food', pl: 'food', ko: '먹는 것', items: ['🍎', '🍌', '🍇', '🍓', '🥕', '🍐', '🍉', '🧀'] },
    toy: { en: 'toy', pl: 'toys', ko: '장난감', items: ['🚗', '⚽', '🧸', '🪀', '🎈', '🚲', '🪁', '🎲'] }
  };
  const ALL = Object.values(KINDS).flatMap(k => k.items);
  const NAMED = [['🐶', 'dog', '개'], ['🐱', 'cat', '고양이'], ['🐰', 'rabbit', '토끼'], ['🐸', 'frog', '개구리'], ['🐻', 'bear', '곰'], ['🐮', 'cow', '소'], ['🐷', 'pig', '돼지'], ['🐟', 'fish', '물고기']];
  const SHAPES = {
    circle: ['circle', '동그라미', '<circle cx="20" cy="20" r="15"/>'],
    square: ['square', '네모', '<rect x="6" y="6" width="28" height="28"/>'],
    triangle: ['triangle', '세모', '<path d="M20 5 L35 34 L5 34 Z"/>'],
    heart: ['heart', '하트', '<path d="M20 34 C7 25 3 17 6 11 C9 5 17 5 20 12 C23 5 31 5 34 11 C37 17 33 25 20 34 Z"/>'],
    star: ['star', '별', '<path d="M20 4 L24.5 15 L36 15 L27 22.5 L30.5 34.5 L20 27.5 L9.5 34.5 L13 22.5 L4 15 L15.5 15 Z"/>']
  };
  const FREEHAND = [   // a child's own drawing: wobbly crayon lines, not a printed shape
    '<path d="M14 36 L14 21 L30 9 L46 21 L46 36 Z M26 36 L26 27 L33 27 L33 36"/>',
    '<path d="M30 24 m-7 0 a7 7 0 1 0 14 0 a7 7 0 1 0 -14 0 M30 8 L30 13 M30 35 L30 40 M14 24 L19 24 M41 24 L46 24 M19 13 L22 16 M38 32 L41 35 M41 13 L38 16 M19 35 L22 32"/>',
    '<path d="M30 40 L30 22 M30 22 m-6 -5 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0 M30 32 C24 28 20 30 18 33 M30 30 C36 26 40 28 42 31"/>'
  ];
  const differ = k => shuffle(ALL).slice(0, k);   // k different pictures from mixed kinds
  const eul = n => n + ([2, 4, 5, 9].includes(n % 10) ? '를' : '을');   // Korean reading of the last digit

  // ---------- shared picture parts ----------
  // Family A: one mark on one picture in a row (circle, cross out, underline, check, fill in, point).
  // bubbles: answer bubbles under every picture (the "fill in" worksheet), also on papers that did something else.
  const markRow = (items, t, mark, sizes, bubbles = mark === 'fill') => paper(`<span class="dr-row${bubbles ? ' dr-bubbles' : ''}">${items.map((ch, i) => {
    const m = i === t && mark !== 'fill' ? mark : '';
    return cell(ch, m, sizes ? 'dr-s' + sizes[i] : '', bubbles ? (i === t && mark === 'fill' ? 'f' : 'o') : '');
  }).join('')}</span>`);
  const shapeSvg = (kind, state) => {
    const d = SHAPES[kind][2];
    if (state === 'colored') return `<svg viewBox="0 0 40 40" class="dr-shp" aria-hidden="true"><g class="dr-colored">${d}</g></svg>`;
    if (state === 'traced') return `<svg viewBox="0 0 40 40" class="dr-shp" aria-hidden="true"><g class="dr-dash">${d}</g><g class="dr-trace">${d.replace(/\/>/g, ' pathLength="100"/>')}</g></svg>`;
    if (state === 'dashed') return `<svg viewBox="0 0 40 40" class="dr-shp" aria-hidden="true"><g class="dr-dash">${d}</g></svg>`;
    return `<svg viewBox="0 0 40 40" class="dr-shp" aria-hidden="true"><g class="dr-print">${d}</g></svg>`;
  };
  const shapeCell = (kind, state, mark = '') => `<span class="dr-c dr-shc${mark ? ' dr-m-' + mark : ''}">${shapeSvg(kind, state)}</span>`;
  const dotsSvg = n => `<svg viewBox="0 0 100 44" class="dr-dots" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<circle cx="${12 + (i % 5) * 19}" cy="${12 + Math.floor(i / 5) * 20}" r="6.5"/>`).join('')}</svg>`;
  const numBox = (n, mark = '') => `<span class="dr-box${mark ? ' dr-m-' + mark : ''}">${e(String(n), 'dr-hand')}</span>`;
  const dotBox = n => `<span class="dr-box">${dotsSvg(n)}</span>`;
  const card = n => `<span class="dr-card">${e(String(n))}</span>`;
  const arrow = `<span class="dr-arrow" aria-hidden="true">➜</span>`;
  const bubble = (inner, cls = '') => `<span class="dr-say${cls ? ' ' + cls : ''}">${e('🗣️', 'dr-face')}<span class="dr-bub">${inner}</span></span>`;
  const countRow = items => `<span class="dr-row dr-wrap">${items.map(ch => cell(ch)).join('')}</span>`;

  // Family B pictures, one per word (level 1). p = shared parameters of the item, so every choice uses the same material.
  const PIC = {
    circle: p => markRow(p.items, p.t, 'circle'),
    crossout: p => markRow(p.items, p.t, 'x'),
    underline: p => markRow(p.items, p.t, 'under'),
    check: p => markRow(p.items, p.t, 'check'),
    fillin: p => markRow(p.items, p.t, 'fill'),
    point: p => markRow(p.items, p.t, 'point'),
    color: p => paper(`<span class="dr-row">${shapeCell(p.shape, 'colored')}</span>${e('🖍️', 'dr-tool')}`),
    trace: p => paper(`<span class="dr-row">${shapeCell(p.shape, 'traced')}</span>${e('✏️', 'dr-tool')}`),
    draw: p => paper(`<span class="dr-box dr-drawbox"><svg viewBox="0 0 60 44" class="dr-free" aria-hidden="true">${p.free}</svg></span>${e('✏️', 'dr-tool')}`),
    write: p => paper(`<span class="dr-lines">${e(p.letters, 'dr-hand')}</span>${e('✏️', 'dr-tool')}`),
    cut: () => paper(`<span class="dr-cut"><span class="dr-half"></span><span class="dr-half dr-half2"></span>${e('✂️', 'dr-scissor')}</span>`),
    match: p => paper(`<span class="dr-match"><svg viewBox="0 0 100 60" preserveAspectRatio="none" class="dr-lines-svg" aria-hidden="true"><line x1="30" y1="15" x2="70" y2="45"/><line x1="30" y1="45" x2="70" y2="15"/></svg>${cell(p.pair[0])}${cell(p.pair[1])}${cell(p.pair[1])}${cell(p.pair[0])}</span>`),
    sort: p => paper(`<span class="dr-bins"><span class="dr-bin">${p.sortA.map(ch => cell(ch)).join('')}</span><span class="dr-bin">${p.sortB.map(ch => cell(ch)).join('')}</span></span>`),
    count: p => paper(`<span class="dr-row">${p.items.map((ch, i) => `<span class="dr-c dr-counted">${e(ch)}${e(String(i + 1), 'dr-n')}</span>`).join('')}</span>`),
    label: p => paper(`<span class="dr-label">${cell(p.named[0])}<span class="dr-tagline" aria-hidden="true"></span><span class="dr-tag">${e(p.named[1])}</span></span>`),
    represent: p => paper(`<span class="dr-rep">${card(p.n)}${arrow}${dotBox(p.n)}</span>`),
    tell: p => paper(bubble(e(p.items[p.t])))
  };
  // Choices that children confuse with each word (same family first). Draw and represent never share an item: drawing
  // a picture IS how you represent, so one of them would also be right (O3).
  const WORDS = {
    circle: { en: 'circle', near: ['crossout', 'underline', 'check', 'fillin', 'point'], mean: B('Circle: draw a ring around it.', 'circle = 둘레에 동그라미를 그려요.') },
    crossout: { en: 'cross out', near: ['circle', 'underline', 'check'], mean: B('Cross out: draw an X on it.', 'cross out = 그 위에 X를 그어요.') },
    underline: { en: 'underline', near: ['circle', 'crossout', 'check'], mean: B('Underline: draw a line under it.', 'underline = 밑에 줄을 그어요.') },
    check: { en: 'check', near: ['crossout', 'circle', 'fillin'], mean: B('Check: make a ✓ mark.', 'check = ✓ 표시를 해요.') },
    fillin: { en: 'fill in', near: ['circle', 'check', 'crossout'], mean: B('Fill in: color the little circle all the way.', 'fill in = 작은 동그라미를 꽉 칠해요.') },
    point: { en: 'point', near: ['circle', 'check', 'underline'], mean: B('Point: show it with your finger.', 'point = 손가락으로 가리켜요.') },
    color: { en: 'color', near: ['trace', 'draw', 'cut'], mean: B('Color: fill the shape with a crayon.', 'color = 크레용으로 색칠해요.') },
    trace: { en: 'trace', near: ['color', 'draw', 'write'], mean: B('Trace: go over the dotted line.', 'trace = 점선 위를 따라 그려요.') },
    draw: { en: 'draw', near: ['write', 'color', 'trace'], mean: B('Draw: make a picture.', 'draw = 그림을 그려요.') },
    write: { en: 'write', near: ['draw', 'tell', 'trace'], mean: B('Write: make letters or numbers.', 'write = 글자나 숫자를 써요.') },
    cut: { en: 'cut', near: ['trace', 'color', 'match'], mean: B('Cut: use scissors on the line.', 'cut = 가위로 선을 따라 잘라요.') },
    match: { en: 'match', near: ['sort', 'count', 'cut'], mean: B('Match: draw a line between the same ones.', 'match = 같은 것끼리 선으로 이어요.') },
    sort: { en: 'sort', near: ['match', 'count'], mean: B('Sort: put the same kinds together.', 'sort = 같은 종류끼리 모아요.') },
    count: { en: 'count', near: ['match', 'sort', 'label'], mean: B('Count: say 1, 2, 3 for each one.', 'count = 하나씩 1, 2, 3 세어요.') },
    label: { en: 'label', near: ['count', 'tell', 'write'], mean: B('Label: put the name next to it.', 'label = 이름을 써서 붙여요.') },
    represent: { en: 'represent', near: ['write', 'count', 'tell'], mean: B('Represent: show the number with a picture.', 'represent = 숫자를 그림으로 나타내요.') },
    tell: { en: 'tell', near: ['write', 'draw', 'label'], mean: B('Tell: say it out loud.', 'tell = 소리 내어 말해요.') }
  };
  const L1_WORDS = Object.keys(WORDS);

  // ---------- level 1: word -> picture ----------
  const params = () => {
    const kinds = shuffle(Object.keys(KINDS));
    return {
      items: differ(3), t: rnd(3), shape: pick(Object.keys(SHAPES)), free: pick(FREEHAND),
      letters: pick(['1 2 3', 'a b c', '4 5 6', 'm o m']), pair: differ(2),
      sortA: shuffle(KINDS[kinds[0]].items).slice(0, 2), sortB: shuffle(KINDS[kinds[1]].items).slice(0, 2),
      named: pick(NAMED), n: 3 + rnd(6)
    };
  };
  const levelOne = (word = pick(L1_WORDS)) => {
    const w = WORDS[word], p = params();
    const wrong = shuffle(w.near).slice(0, 2);
    return {
      word, verb: word,
      ask: B(`Which one shows “${w.en}”?`, `“${w.en}” 한 그림은?`),
      askSay: B(`${w.en}. Which picture shows ${w.en}?`, '이 말대로 한 그림은?'),
      askExtra: { t: w.en, lang: 'en-US' },
      opts: [{ html: PIC[word](p), ok: true, desc: word }, ...wrong.map(x => ({ html: PIC[x](p), ok: false, desc: x }))],
      after: w.mean, vocab: w.en
    };
  };

  // ---------- level 2: a short school direction -> the paper that followed it ----------
  const VERB_A = {   // marks on one picture
    circle: { say: 'Circle', ko: 'circle', mark: 'circle', near: ['crossout', 'underline', 'check'] },
    crossout: { say: 'Cross out', ko: 'cross out', mark: 'x', near: ['circle', 'underline', 'check'] },
    underline: { say: 'Underline', ko: 'underline', mark: 'under', near: ['circle', 'crossout'] },
    check: { say: 'Put a check on', ko: 'check', mark: 'check', near: ['crossout', 'circle'] },
    fillin: { say: 'Fill in the bubble under', ko: 'fill in', mark: 'fill', near: ['circle', 'check'] }
  };
  const TARGETS = {
    biggest: { en: 'the biggest one', ko: '가장 큰 것', size: 3 },
    smallest: { en: 'the smallest one', ko: '가장 작은 것', size: 1 },
    animal: { en: 'the animal', ko: '동물', kind: 'animal' },
    food: { en: 'the food', ko: '먹는 것', kind: 'food' },
    toy: { en: 'the toy', ko: '장난감', kind: 'toy' }
  };
  const obj = (ko, j) => ko + (/[가-힣]$/.test(ko) ? (((ko.charCodeAt(ko.length - 1) - 0xac00) % 28) ? j[0] : j[1]) : j[0]);   // 을/를
  const markItem = () => {
    const vk = pick(Object.keys(VERB_A)), v = VERB_A[vk], tk = pick(Object.keys(TARGETS)), tg = TARGETS[tk];
    let items, sizes = null, t;
    if (tg.size) { const ch = pick(ALL); items = [ch, ch, ch]; sizes = shuffle([1, 2, 3]); t = sizes.indexOf(tg.size); }
    else { const kinds = shuffle(Object.keys(KINDS).filter(k => k !== tg.kind)).slice(0, 2); items = shuffle([tg.kind, ...kinds]).map(k => pick(KINDS[k].items)); t = items.findIndex(ch => KINDS[tg.kind].items.includes(ch)); }
    const other = sizes ? sizes.indexOf(tg.size === 3 ? 1 : 3) : pick([0, 1, 2].filter(i => i !== t));
    const otherVerb = pick(v.near), sentence = `${v.say} ${tg.en}.`, bub = vk === 'fillin';
    return {
      verb: vk, sentence, gloss: `${obj(tg.ko, ['을', '를'])} ${v.ko}`,
      show: markRow(items, -1, '', sizes, bub),
      opts: [
        { html: markRow(items, t, v.mark, sizes, bub), ok: true, desc: `${vk} on ${tk}` },
        { html: markRow(items, t, VERB_A[otherVerb].mark, sizes, bub), ok: false, desc: `${otherVerb} on ${tk}` },
        { html: markRow(items, other, v.mark, sizes, bub), ok: false, desc: `${vk} on another picture` }
      ],
      after: WORDS[vk].mean
    };
  };
  const ro = w => { const c = (w.charCodeAt(w.length - 1) - 0xac00) % 28; return w + (c === 0 || c === 8 ? '로' : '으로'); };   // 동물로, 먹는 것으로
  const nearN = (n, lo, hi) => { const c = [n - 1, n + 1].filter(x => x >= lo && x <= hi); return pick(c); };
  const drawItem = () => {   // Draw N dots / Draw a picture to represent N / Show N with dots: the school mistake is writing the numeral
    const n = 3 + rnd(8), form = rnd(3);
    const sentence = form === 0 ? `Draw ${n} dots.` : form === 1 ? `Draw a picture to represent ${n}.` : `Show ${n} with dots.`;
    const gloss = form === 0 ? `점 ${n}개를 draw` : form === 1 ? `그림을 그려서 ${eul(n)} represent` : `점으로 ${eul(n)} show`;
    return {
      verb: form === 1 ? 'represent' : 'draw', sentence, gloss,
      show: paper(`<span class="dr-box dr-empty"></span>${e('✏️', 'dr-tool')}`),
      opts: [{ html: paper(dotBox(n)), ok: true, desc: `${n} dots` }, { html: paper(numBox(n)), ok: false, desc: `numeral ${n} only` }, { html: paper(dotBox(nearN(n, 1, 10))), ok: false, desc: 'one dot off' }],
      after: form === 1 ? WORDS.represent.mean : form === 2 ? B('Show: make a picture of it.', 'show = 그림으로 보여 줘요.') : WORDS.draw.mean
    };
  };
  const writeCountItem = () => {   // the reverse: "write how many" wants the numeral, not a drawing
    const n = 3 + rnd(5), ch = pick(ALL);
    return {
      verb: 'write', sentence: 'Count. Write how many.', gloss: '세어 보고, 몇 개인지 write',
      show: paper(countRow(Array(n).fill(ch))),
      opts: [{ html: paper(numBox(n)), ok: true, desc: `numeral ${n}` }, { html: paper(dotBox(n)), ok: false, desc: `${n} dots drawn` }, { html: paper(numBox(nearN(n, 1, 9))), ok: false, desc: 'numeral one off' }],
      after: WORDS.write.mean
    };
  };
  const colorItem = () => {
    // No circles here or in trace: "Color 3 circles" would mix the shape word with the direction word circle.
    const shape = pick(['heart', 'star', 'square']), n = 2 + rnd(3), s = SHAPES[shape];
    const row = fn => paper(`<span class="dr-row dr-tight">${Array.from({ length: 5 }, (_, i) => fn(i)).join('')}</span>`);
    const wrongN = nearN(n, 1, 5);
    return {
      verb: 'color', sentence: `Color ${n} ${s[0]}s.`, gloss: `${s[1]} ${n}개를 color`,
      show: row(() => shapeCell(shape, 'plain')),
      opts: [{ html: row(i => shapeCell(shape, i < n ? 'colored' : 'plain')), ok: true, desc: `${n} colored` },
        { html: row(i => shapeCell(shape, 'plain', i < n ? 'circle' : '')), ok: false, desc: `${n} circled` },
        { html: row(i => shapeCell(shape, i < wrongN ? 'colored' : 'plain')), ok: false, desc: `${wrongN} colored` }],
      after: WORDS.color.mean
    };
  };
  const traceItem = () => {
    const kinds = shuffle(['square', 'triangle', 'heart', 'star']).slice(0, 3), t = rnd(3), other = pick([0, 1, 2].filter(i => i !== t)), s = SHAPES[kinds[t]];
    const row = fn => paper(`<span class="dr-row">${kinds.map((k, i) => fn(k, i)).join('')}</span>`);
    return {
      verb: 'trace', sentence: `Trace the ${s[0]}.`, gloss: `${obj(s[1], ['을', '를'])} trace`,
      show: row(k => shapeCell(k, 'dashed')),
      opts: [{ html: row((k, i) => shapeCell(k, i === t ? 'traced' : 'dashed')), ok: true, desc: `${s[0]} traced` },
        { html: row((k, i) => shapeCell(k, 'dashed', i === t ? 'circle' : '')), ok: false, desc: `${s[0]} circled` },
        { html: row((k, i) => shapeCell(k, i === other ? 'traced' : 'dashed')), ok: false, desc: `${kinds[other]} traced` }],
      after: WORDS.trace.mean
    };
  };
  const matchItem = () => {   // two columns of the same pictures in a different order
    const [a, b] = differ(2);
    const grid = (lines, marks = []) => paper(`<span class="dr-match">${lines ? `<svg viewBox="0 0 100 60" preserveAspectRatio="none" class="dr-lines-svg" aria-hidden="true">${lines}</svg>` : ''}${cell(a, marks[0])}${cell(b, marks[1])}${cell(b, marks[2])}${cell(a, marks[3])}</span>`);
    const right = '<line x1="30" y1="15" x2="70" y2="45"/><line x1="30" y1="45" x2="70" y2="15"/>', straight = '<line x1="30" y1="15" x2="70" y2="15"/><line x1="30" y1="45" x2="70" y2="45"/>';
    return {
      verb: 'match', sentence: 'Match the same ones.', gloss: '같은 것끼리 match',
      show: grid(''),
      opts: [{ html: grid(right), ok: true, desc: 'lines join the same pictures' }, { html: grid(straight), ok: false, desc: 'lines join different pictures' }, { html: grid('', ['circle', '', '', 'circle']), ok: false, desc: 'same pictures circled' }],
      after: WORDS.match.mean
    };
  };
  const compareItem = () => {
    const ch = pick(ALL), a = 2 + rnd(4); let b = 2 + rnd(4); if (b === a) b = a === 5 ? 3 : a + 1;
    const more = rnd(2) === 0, t = more ? (a > b ? 0 : 1) : (a < b ? 0 : 1);
    const groups = mark => paper(`<span class="dr-groups">${[a, b].map((k, i) => `<span class="dr-group${mark && mark[i] ? ' dr-m-' + mark[i] : ''}">${countRow(Array(k).fill(ch))}</span>`).join('')}</span>`);
    const m = (i, mk) => i === 0 ? [mk, ''] : ['', mk];
    return {
      verb: 'circle', sentence: `Compare. Circle the group with ${more ? 'more' : 'fewer'}.`, gloss: `compare: ${more ? '더 많은' : '더 적은'} 쪽을 circle`,
      show: groups(null),
      opts: [{ html: groups(m(t, 'circle')), ok: true, desc: `${more ? 'more' : 'fewer'} group circled` }, { html: groups(m(1 - t, 'circle')), ok: false, desc: 'other group circled' }, { html: groups(m(t, 'under')), ok: false, desc: 'right group underlined' }],
      after: B('Compare: look at both groups to find more or fewer.', 'compare = 두 묶음을 견주어 더 많은지 적은지 봐요.')
    };
  };
  const sortItem = () => {
    const [ka, kb] = shuffle(Object.keys(KINDS)).slice(0, 2), A = shuffle(KINDS[ka].items).slice(0, 2), Bs = shuffle(KINDS[kb].items).slice(0, 2);
    const bins = (x, y) => paper(`<span class="dr-bins"><span class="dr-bin">${x.map(ch => cell(ch)).join('')}</span><span class="dr-bin">${y.map(ch => cell(ch)).join('')}</span></span>`);
    const loose = paper(`<span class="dr-row dr-tight">${shuffle([...A, ...Bs]).map(ch => cell(ch)).join('')}</span>`);
    return {
      verb: 'sort', sentence: `Sort: ${KINDS[ka].pl} and ${KINDS[kb].pl}.`, gloss: `${KINDS[ka].ko}과 ${ro(KINDS[kb].ko)} sort`,
      show: loose,
      opts: [{ html: bins(A, Bs), ok: true, desc: 'sorted by kind' }, { html: bins([A[0], Bs[0]], [A[1], Bs[1]]), ok: false, desc: 'mixed bins' }, { html: paper(`<span class="dr-row dr-tight">${[...A, ...Bs].map((ch, i) => cell(ch, i < 2 ? 'circle' : '')).join('')}</span>`), ok: false, desc: 'one kind circled, not sorted' }],
      after: WORDS.sort.mean
    };
  };
  const labelItem = () => {
    const [x, y] = shuffle(NAMED).slice(0, 2);
    const two = (tagOn, mark = '') => paper(`<span class="dr-row">${[x, y].map((nm, i) => `<span class="dr-label">${cell(nm[0], i === 0 ? mark : '')}${tagOn === i ? `<span class="dr-tagline" aria-hidden="true"></span><span class="dr-tag">${e(x[1])}</span>` : ''}</span>`).join('')}</span>`);
    return {
      verb: 'label', sentence: `Label the ${x[1]}.`, gloss: `${x[2]}(${x[1]})에 label`,
      show: two(-1),
      opts: [{ html: two(0), ok: true, desc: `tag on the ${x[1]}` }, { html: two(1), ok: false, desc: `tag on the ${y[1]}` }, { html: two(-1, 'circle'), ok: false, desc: `${x[1]} circled` }],
      after: WORDS.label.mean
    };
  };
  const tellItem = () => {
    const n = 2 + rnd(5), ch = pick(ALL);
    return {
      verb: 'tell', sentence: 'Tell how many.', gloss: '몇 개인지 tell',
      show: paper(countRow(Array(n).fill(ch))),
      opts: [{ html: paper(bubble(e(String(n), 'dr-hand'))), ok: true, desc: `says ${n}` }, { html: paper(`${numBox(n)}${e('✏️', 'dr-tool')}`), ok: false, desc: `writes ${n}` }, { html: paper(bubble(e(String(nearN(n, 1, 9)), 'dr-hand'))), ok: false, desc: 'says one off' }],
      after: WORDS.tell.mean
    };
  };
  const cutItem = () => {
    const pos = pick(['dr-cut-v', 'dr-cut-h']);
    const sheet = (state) => paper(`<span class="dr-cutsheet ${pos} ${state}"><span class="dr-solid"></span><span class="dr-dashed"></span>${state === 'trace' ? '' : e('✂️', 'dr-scissor')}${state === 'trace' ? e('✏️', 'dr-scissor') : ''}</span>`);
    return {
      verb: 'cut', sentence: 'Cut on the dashed line.', gloss: '점선을 따라 cut',
      show: paper(`<span class="dr-cutsheet ${pos}"><span class="dr-solid"></span><span class="dr-dashed"></span></span>`),
      opts: [{ html: sheet('on-dash'), ok: true, desc: 'scissors on the dashed line' }, { html: sheet('on-solid'), ok: false, desc: 'scissors on the solid line' }, { html: sheet('trace'), ok: false, desc: 'pencil on the dashed line' }],
      after: WORDS.cut.mean
    };
  };
  const L2 = [markItem, markItem, markItem, drawItem, drawItem, writeCountItem, colorItem, traceItem, matchItem, compareItem, sortItem, labelItem, tellItem, cutItem];
  const levelTwo = (maker = pick(L2)) => {
    const it = maker();
    return {
      ...it,
      ask: B(`“${it.sentence}”`, `“${it.sentence}” (${it.gloss})`),
      askSay: B(`${it.sentence} Which paper did that?`, `${it.gloss}. 이렇게 한 종이는?`),
      askExtra: { t: it.sentence, lang: 'en-US' },
      show: `<span class="dr-before">${e('👩‍🏫', 'dr-teacher')}${it.show}</span>`,
      vocab: WORDS[it.verb].en
    };
  };

  window.DirectionsGen = { levelOne, levelTwo, words: L1_WORDS, l2: L2.map(f => f.name), makers: { compareItem, sortItem, labelItem, cutItem } };   // QA dump (docs/review/impl-directions.md)

  registerGame({
    id: ID, grade: 'K', subject: 'read', icon: '👩‍🏫', title: B('Teacher Words', '선생님 말 알아듣기'), sub: B('Circle, cross out, draw, trace...', 'circle, cross out, draw 같은 말'),
    area: B('Reading · School directions', '읽기 · 학교 지시어'),
    // A miss twice on a level-2 direction steps down to the single word it uses (core.js step-down), then back.
    stepDown(item) { return item.sentence && WORDS[item.verb] ? levelOne(item.verb) : null; },
    play() {
      const it = lvl(ID) === 1 ? levelOne() : levelTwo();
      quiz(this, { ask: it.ask, askSay: it.askSay, askExtra: it.askExtra, show: it.show, quietShow: true, opts: it.opts, cls: 'dr-choices', after: it.after, vocab: it.vocab, verb: it.verb, sentence: it.sentence });
    }
  });
})();
