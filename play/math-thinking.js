// Optional, original math questions. Only the quiz engine schedules them; ordinary generators stay intact.
(() => {
  'use strict';
  const V = window.PuzzleVisuals;
  const seq = n => Array.from({ length: n }, (_, i) => i);
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const blank = '<span class="mt-empty">?</span>';
  const number = n => `<span class="z-number">${n}</span>`;
  const shapePaths = [
    '<circle cx="30" cy="30" r="24"/>', '<rect x="7" y="7" width="46" height="46"/>',
    '<path d="M30 4 57 54H3Z"/>', '<path d="M16 5H44L58 30 44 55H16L2 30Z"/>',
    '<rect x="3" y="13" width="54" height="34"/>', '<path d="M30 3 57 30 30 57 3 30Z"/>'
  ];
  const shape = (s, dots = 0) => `<svg viewBox="0 0 60 60" aria-hidden="true"><g fill="#c4e3f5" stroke="#173c59" stroke-width="2">${shapePaths[s]}</g>${seq(dots).map(i => `<circle cx="${30 + (i - (dots - 1) / 2) * 10}" cy="32" r="3.5" fill="#173c59"/>`).join('')}</svg>`;
  const row = html => `<div class="mt-row">${html}</div>`;
  const tile = a => V.grid(a.map(v => v ? '<span class="mt-tile"></span>' : ''), 3);
  // A quarter arc, with its starting radius and ending radius visible: never an unspecified circular arrow.
  const arrow = clockwise => `<svg class="mt-turn" viewBox="0 0 70 70" aria-hidden="true"><g ${clockwise ? '' : 'transform="translate(70 0) scale(-1 1)"'} fill="none" stroke="#173c59"><path d="M22 12V48H58" stroke-width="2" stroke-dasharray="3 3"/><circle cx="22" cy="12" r="4" fill="#173c59"/><path d="M22 12A36 36 0 0 1 58 48M48 39 58 49 67 38" stroke-width="4"/><path d="M22 39H31V48" stroke-width="2"/></g></svg>`;
  const unique = a => [...new Map(a.map(v => [JSON.stringify(v), v])).values()];
  function item(ask, show, answers, correct, render, model, askSay) {
    const options = unique(answers);
    if (options.length !== 3 || options.filter(v => equal(v, correct)).length !== 1) throw Error('Thinking options must have one answer');
    return { thinking: true, ask, askSay, show: `<div class="mt-board">${show}</div>`, cls: 'mt-options',
      opts: options.map(v => ({ html: render(v), ok: equal(v, correct) })),
      // Content identity does not depend on language, option order or incidental styling.
      itemKey: 'thinking:' + JSON.stringify(model), thinkingModel: model,
      onRender() {
        const board = view().querySelector('.mt-board'); board.dataset.thinking = 'true';
        if (this.materialSay) {
          const button = document.createElement('button'); button.className = 'say'; button.id = 'mtMaterial'; button.textContent = '🔊';
          button.setAttribute('aria-label', L(B('Read this aloud', '자료 읽어 주기')));
          button.onclick = () => say(L(this.materialSay)); board.append(button);
        }
        if (render === number && !$('#spo')) {
          const button = document.createElement('button'); button.className = 'say'; button.id = 'mtChoices'; button.textContent = '🔉';
          button.setAttribute('aria-label', L(B('Read the choices', '보기 읽어 주기')));
          button.onclick = () => $$('.mt-options .opt').forEach((el,i) => say(el.textContent.trim(), undefined, i > 0)); $('#sp').after(button);
        }
      }
    };
  }
  const numeric = (ask, show, ans, wrong, model, askSay, materialSay) => ({ ...item(ask, show, [ans, ...unique(wrong).filter(x => x >= 0 && x !== ans).slice(0, 2)], ans, number, model, askSay), materialSay });
  const builders = {};

  // Every row has one outline; every column has one dot count. The missing combination never appears elsewhere.
  builders.pattern = () => {
    const shapes = shuffle(seq(6)).slice(0, 3), dots = shuffle([1, 2, 3]), at = rnd(9), r = Math.floor(at / 3), c = at % 3;
    const ans = [shapes[r], dots[c]], wrong = [[shapes[(r + 1) % 3], dots[c]], [shapes[r], dots[(c + 1) % 3]]];
    return item(B('Fill the gap.', '빈칸을 채워요.'), V.grid(seq(9).map(i => shape(shapes[Math.floor(i / 3)], dots[i % 3])), 3, at),
      [ans, ...wrong], ans, v => shape(...v), { type: 'matrix', shapes, dots, at });
  };

  // Connected square pieces with no rotational symmetry: all distractors have the same number of squares.
  const pieces = [
    [1,1,0,1,0,0,1,0,0], [1,1,1,0,1,0,0,0,0], [1,1,0,0,1,1,0,0,0],
    [1,1,1,1,0,0,0,0,0], [1,1,1,1,1,0,0,0,0], [1,1,0,1,0,0,1,1,0],
    [1,1,1,0,1,1,0,0,0], [1,1,0,1,1,0,1,0,0]
  ];
  builders.shapes2d = () => {
    let base = pick(pieces).slice(); for (let n = rnd(4); n; n--) base = V.turn(base, 3);
    const clockwise = !!rnd(2), once = V.turn(base, 3), twice = V.turn(once, 3), thrice = V.turn(twice, 3), ans = clockwise ? once : thrice;
    return item(B('Make the quarter-turn.', '화살표만큼 돌려요.'), row(tile(base) + arrow(clockwise) + blank),
      [ans, base, twice], ans, tile, { type: 'turn', base, clockwise });
  };

  // Shape tokens denote objects, not real-world weights. Lower pans and downward arrows supply the comparison cues.
  const token = s => `<svg x="-19" y="-38" width="38" height="38" viewBox="0 0 60 60">${shape(s).replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`;
  const scale = (left, right, leftHeavy) => {
    const ly = leftHeavy ? 77 : 45, ry = leftHeavy ? 45 : 77;
    return `<svg class="mt-scale" viewBox="0 0 180 110" aria-hidden="true"><g stroke="#173c59" stroke-width="3" fill="none"><path d="M90 50V103M65 103h50M25 ${ly - 7} 155 ${ry - 7}"/><path d="M7 ${ly}q18 20 36 0M137 ${ry}q18 20 36 0"/></g><g transform="translate(25 ${ly})">${token(left)}</g><g transform="translate(155 ${ry})">${token(right)}</g><text x="${leftHeavy ? 25 : 155}" y="108" text-anchor="middle" font-size="21" fill="#173c59">↓</text></svg>`;
  };
  builders.compare = () => {
    const order = shuffle(seq(6)).slice(0, 3), flips = [!!rnd(2), !!rnd(2)], pairs = shuffle([0, 1]);
    const clues = pairs.map(i => flips[i] ? scale(order[i + 1], order[i], false) : scale(order[i], order[i + 1], true));
    return item(B('Which is heaviest?', '가장 무거운 것은?'), row(clues.join('')) + '<div class="mt-heavy" aria-hidden="true">↓ <span class="mt-pan">?</span></div>',
      order, order[0], v => shape(v), { type: 'balance', order, flips, pairs });
  };

  builders.growpat = () => {
    const start = rnd(10), steps = pick([[1,2], [2,1], [2,3], [3,2], [2,5], [5,2]]), values = [start];
    for (let i = 0; i < 5; i++) values.push(values.at(-1) + steps[i % 2]);
    const ans = values[5], show = row(values.map((n, i) => (i ? `<span class="mt-hop mt-hop-${i % 2}">→</span>` : '') + (i === 5 ? blank : number(n))).join(''));
    return numeric(B('Two jumps take turns; what comes next?', '번갈아 뛰면 다음 수는?'), show, ans,
      [values[4] + steps[1], values[4], ans + 1], { type: 'alternating', start, steps }, undefined,
      B(values.slice(0,5).join(', ') + ', empty.', values.slice(0,5).join(', ') + ', 빈칸.'));
  };

  const connected = a => {
    const cells = seq(9).filter(i => a[i]), seen = new Set(cells.slice(0, 1)), queue = [...seen];
    while (queue.length) { const i = queue.shift(); for (const j of cells) if (!seen.has(j) && Math.abs(i % 3 - j % 3) + Math.abs(Math.floor(i / 3) - Math.floor(j / 3)) === 1) { seen.add(j); queue.push(j); } }
    return cells.length > 0 && seen.size === cells.length;
  };
  const joins = [];
  for (let mask = 1; mask < 512; mask++) {
    const full = seq(9).map(i => mask >> i & 1), cells = seq(9).filter(i => full[i]);
    if (cells.length < 4 || cells.length > 6 || !connected(full)) continue;
    for (const i of cells) for (const j of cells.filter(j => j > i)) {
      const first = seq(9).map(k => +(k === i || k === j)), second = full.map((v, k) => v && !first[k] ? 1 : 0);
      if (connected(first) && connected(second)) joins.push([first, second]);
    }
  }
  builders.shapecompose = () => {
    const [a, b] = pick(joins), ans = a.map((v, i) => v | b[i]);
    const filled = shuffle(seq(9).filter(i => ans[i])), empty = shuffle(seq(9).filter(i => !ans[i]));
    const wrong = [0,1].map(k => ans.map((v, i) => i === filled[k] ? 0 : i === empty[k % empty.length] ? 1 : v));
    return item(B('Join the pieces in their grid spaces.', '칸에 맞춰 조각을 합쳐요.'), row(tile(a) + '<span>+</span>' + tile(b) + '<span>→</span>' + blank),
      [ans, ...wrong], ans, tile, { type: 'join', a, b });
  };

  builders.missingnum = () => {
    const base = seq(3).map(() => rnd(5)), [a,b,c] = base, ans = a + 2*b + c;
    // Expressions are given information, not additional unknown boxes. Only the top block is empty.
    const rows = [base, [`${a}+${b}`, `${b}+${c}`], [ans]];
    return numeric(B('Add up to the empty block.', '더해서 빈칸까지 올라가요.'), V.pyramid(rows, 2, 0), ans,
      [a+b+c, a+b, ans+1, ans+2], { type: 'pyramid', base },
      B('Add each pair below to make the block above. Fill the top block.', '아래 두 칸을 더하면 위 칸이 돼요. 맨 위 빈칸을 채워요.'),
      B(`Bottom: ${a}, ${b}, ${c}. Middle: ${a} plus ${b}, and ${b} plus ${c}. Top: empty.`, `아래: ${a}, ${b}, ${c}. 가운데: ${a} 더하기 ${b}, ${b} 더하기 ${c}. 맨 위: 빈칸.`));
  };

  builders.growpat2 = () => {
    const start = 10 + rnd(61), add = 2 + rnd(9), take = 1 + rnd(9), end = start + add - take;
    return numeric(B('Two rules change the number. What was the starting number?', '두 규칙을 지나며 수가 바뀌어요. 처음 수는?'),
      row(blank + `<span>→</span><b class="mt-machine">+ ${add}</b><span>→</span><b class="mt-machine">− ${take}</b><span>→</span>` + number(end)), start,
      [end + add - take, end - add - take, end + add + take, start + 1], { type: 'machine', start, add, take }, undefined,
      B(`Start with the empty box. Add ${add}, then subtract ${take}, to get ${end}.`, `빈칸에서 시작해요. 더하기 ${add}, 빼기 ${take}, 결과는 ${end}.`));
  };

  const arraySvg = ([r,c,mark]) => `<svg class="mt-array" viewBox="0 0 ${c*20+8} ${r*20+8}" aria-hidden="true">${seq(r*c).map(i => `<circle cx="${18+i%c*20}" cy="${18+Math.floor(i/c)*20}" r="7" fill="${i === mark ? '#b54820' : '#2778a7'}"/>${i === mark ? `<path d="m${15+i%c*20} ${18+Math.floor(i/c)*20}h6" stroke="white" stroke-width="2"/>` : ''}`).join('')}</svg>`;
  builders.arrays = () => {
    const r = 2+rnd(4), c = pick([2,3,4,5].filter(c => c !== r)), mark = pick([0,c-1,(r-1)*c,r*c-1]);
    const mr = Math.floor(mark/c), mc = mark%c, ans = [c,r,mc*r + r-1-mr];
    return item(B('Make the quarter-turn. Which array matches?', '화살표만큼 배열을 돌려요. 맞는 그림은?'), row(arraySvg([r,c,mark]) + arrow(true) + blank),
      [ans, [c,r,(c-1-mc)*r+mr], [r,c,mark]], ans, arraySvg, { type: 'array', r,c,mark });
  };

  builders.symmetry = () => {
    const n = 4, positions = shuffle([0,1,4,5,8,9,12,13]).slice(0, pick([2,3])), base = seq(16).map(i => +positions.includes(i));
    const reflected = V.mirror(base, n), ans = base.map((v,i) => v | reflected[i]);
    const filled = seq(16).filter(i => reflected[i]), empty = seq(16).filter(i => i%4 >= 2 && !ans[i]);
    const wrong = [0,1].map(k => ans.map((v,i) => i === filled[k] ? 0 : i === empty[k] ? 1 : v));
    return item(B('Unfold across the dotted line. Which dots appear?', '점선을 따라 펼치면 점이 어떻게 보일까요?'),
      row(`<div class="mt-fold">${V.bits(base,n)}</div><span class="mt-unfold">↔</span>${blank}`),
      [ans, ...wrong], ans, v => V.bits(v,n), { type: 'fold', positions: positions.sort((a,b) => a-b) });
  };
  function eligible(game) {
    if (!builders[game.id] || lvl(game.id) !== 2 || kidGrade() === 'P' || gradeOf(game) === 'P' || DIAG.active || SESSION.review || SESSION.learnerMode === 'slow') return false;
    return (SESSION.learnerMode === 'challenge' && SESSION.n % 3 === 2) || (!SESSION.mix && SESSION.rounds === ROUNDS && SESSION.n === ROUNDS-1);
  }
  window.MathThinking = { eligible, build: game => builders[typeof game === 'string' ? game : game.id]?.(), ids: Object.keys(builders) };
})();
