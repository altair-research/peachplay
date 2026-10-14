(() => {
  'use strict';
  // Original, untimed thinking puzzles. Every round has a checked, unique answer.
  // No test items, personal data, ability estimates or grade comparisons.
  const grades = ['K', '1', '2', '3', '4', '5'];
  const tier = id => Math.min(6, grades.indexOf(kidGrade()) + (lvl(id) === 2 ? 1 : 0));
  const seq = n => Array.from({ length: n }, (_, i) => i);
  const permutations = a => a.length ? a.flatMap((x, i) => permutations(a.filter((_, j) => j !== i)).map(p => [x, ...p])) : [[]];
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const text = s => `<span class="z-number">${s}</span>`;
  const grid = (a, n, mark = -1, box = 0) => `<div class="z-grid" style="--z-n:${n}">${a.map((v, i) => `<span class="z-cell ${i === mark ? 'z-mark' : ''} ${box && (i % n + 1) % box === 0 ? 'z-edge' : ''} ${box && (Math.floor(i / n) + 1) % (n / box) === 0 ? 'z-bottom' : ''}">${i === mark ? '?' : v === null ? '·' : v}</span>`).join('')}</div>`;
  const bits = (a, n) => grid(a.map(v => v ? '●' : '·'), n);
  const line = s => `<div class="z-line">${s}</div>`;
  const nums = answer => shuffle([answer, answer + 1, answer + 2, Math.max(0, answer - 1)]).filter((v, i, a) => a.indexOf(v) === i);
  function item(ask, show, candidates, valid, hint, render = text) {
    const options = [...new Map(candidates.map(v => [JSON.stringify(v), v])).values()];
    const answers = options.filter(valid);
    if (options.length < 2 || answers.length !== 1) throw new Error('Puzzle answer is not unique');
    return { ask, show: `<div class="z-board">${show}<div class="z-drop" aria-label="${L(B('Answer here', '여기에 답해요'))}">?</div></div>`,
      opts: options.map(v => ({ html: render(v), ok: valid(v) })), cls: 'z-options',
      after: B('You followed the clues!', '단서를 차근차근 풀었어요!'),
      onRender() {
        const root = view(), board = root.querySelector('.z-board');
        root.querySelector('.opts').style.setProperty('--z-count', options.length);
        const tools = document.createElement('div'); tools.className = 'z-tools';
        const help = document.createElement('button'); help.className = 'z-hint'; help.textContent = L(B('💡 One step', '💡 한 단계 도움'));
        const tip = document.createElement('span'); tip.className = 'z-tip'; tip.setAttribute('role', 'status');
        tools.append(help, tip); board.after(tools);
        help.onclick = () => { tip.textContent = L(hint); say(L(hint)); help.disabled = true; };
        // Pointer drag (including touch) and normal tap/keyboard use the SAME quiz handler.
        // No global event handlers: leaving the game disposes the whole interaction.
        root.querySelectorAll('.opt').forEach(button => {
          button.setAttribute('aria-label', button.textContent.trim() || L(B('Picture option', '그림 보기')));
          let start = null, moved = false;
          button.onpointerdown = e => { if (button.disabled) return; start = [e.clientX, e.clientY]; moved = false; button.setPointerCapture(e.pointerId); };
          button.onpointermove = e => { if (start && Math.hypot(e.clientX - start[0], e.clientY - start[1]) > 10) { moved = true; button.classList.add('z-drag'); } };
          button.onpointerup = e => {
            if (!start) return; start = null; button.classList.remove('z-drag');
            if (moved) { const r = root.querySelector('.z-drop').getBoundingClientRect(); if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) button.click(); }
          };
          button.addEventListener('click', e => { if (moved && e.isTrusted && e.detail > 0) { e.stopImmediatePropagation(); e.preventDefault(); } }, true);
          button.onpointercancel = () => { start = null; moved = false; button.classList.remove('z-drag'); };
        });
      }
    };
  }
  const numberItem = (ask, show, ans, hint) => item(ask, show, nums(ans), x => x === ans, hint);
  function register(id, icon, en, ko, build) {
    registerGame({ id, icon, title: B(en, ko), sub: B('Thinking puzzles · follow the clues', '생각 퍼즐 · 단서를 따라가요'),
      grade: 'both', subject: 'gifted', area: B('Thinking puzzles', '생각 퍼즐'),
      play() { quiz(this, build(tier(id))); } });
  }

  // Count solutions with minimum-remaining-values search; stop after two.
  function sudokuSolutions(board, n, bw, bh) {
    const a = board.slice(), answers = [];
    const rows = Array(n).fill(0), cols = Array(n).fill(0), boxes = Array(n).fill(0), all = (1 << n) - 1;
    const row = i => Math.floor(i / n), col = i => i % n;
    const box = i => Math.floor(row(i) / bh) * (n / bw) + Math.floor(col(i) / bw);
    for (let i = 0; i < a.length; i++) if (a[i]) {
      const bit = 1 << (a[i] - 1), r = row(i), c = col(i), b = box(i);
      if ((rows[r] | cols[c] | boxes[b]) & bit) return [];
      rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
    }
    function search() {
      if (answers.length >= 2) return;
      let at = -1, choices = 0, fewest = n + 1;
      for (let i = 0; i < a.length; i++) if (!a[i]) {
        const cs = all & ~(rows[row(i)] | cols[col(i)] | boxes[box(i)]);
        if (!cs) return;
        let bits = cs, count = 0; while (bits) { bits &= bits - 1; count++; }
        if (count < fewest) { at = i; choices = cs; fewest = count; }
      }
      if (at < 0) { answers.push(a.slice()); return; }
      const r = row(at), c = col(at), b = box(at);
      for (let v = 1; v <= n; v++) if (choices & (1 << (v - 1))) {
        const bit = 1 << (v - 1); a[at] = v; rows[r] |= bit; cols[c] |= bit; boxes[b] |= bit;
        search(); a[at] = 0; rows[r] &= ~bit; cols[c] &= ~bit; boxes[b] &= ~bit;
        if (answers.length >= 2) break;
      }
    }
    search(); return answers;
  }
  register('zsudoku', '🔲', 'Picture Number Grid', '그림 숫자 격자', t => {
    const n = t < 2 ? 4 : t < 5 ? 6 : 9, bw = n === 6 ? 3 : Math.sqrt(n), bh = n / bw;
    const symbols = shuffle(seq(n).map(x => x + 1));
    const full = seq(n * n).map(i => symbols[(Math.floor(i / n) * bw + Math.floor(Math.floor(i / n) / bh) + i % n) % n]);
    const a = full.slice(), order = shuffle(seq(a.length)); let removed = 0;
    const target = Math.min(n * n - n, 3 + t * 4);
    for (const i of order) { const old = a[i]; a[i] = 0; if (sudokuSolutions(a, n, bw, bh).length !== 1) a[i] = old; else removed++; if (removed >= target) break; }
    const at = pick(seq(a.length).filter(i => !a[i])), solution = sudokuSolutions(a, n, bw, bh);
    if (solution.length !== 1) throw new Error('Grid is not unique');
    const glyph = n === 4 ? ['●', '▲', '■', '★'] : seq(n).map(x => String(x + 1));
    const opts = [full[at], ...shuffle(seq(n).map(x => x + 1).filter(v => v !== full[at])).slice(0, 3)];
    return item(B(`Each row, column and ${bw}×${bh} box uses each symbol once. What goes at ?`, `가로·세로·${bw}×${bh} 묶음마다 같은 표시를 한 번씩 써요. ?는 무엇일까요?`), grid(a.map(v => v ? glyph[v - 1] : null), n, at, bw), opts, v => v === solution[0][at], B('Start with a row that has the fewest empty cells.', '빈칸이 가장 적은 줄부터 살펴봐요.'), v => text(glyph[v - 1]));
  });

  const runs = row => { const out = []; let count = 0; for (const v of [...row, 0]) { if (v) count++; else if (count) { out.push(count); count = 0; } } return out.length ? out : [0]; };
  function pictureSolutions(rows, cols, n) {
    const patterns = seq(2 ** n).map(mask => seq(n).map(i => (mask >> i) & 1));
    const choices = rows.map(r => patterns.filter(a => eq(runs(a), r)));
    const columns = cols.map(c => patterns.filter(a => eq(runs(a), c)));
    const out = [], placed = [];
    function search(r) {
      if (out.length >= 2) return;
      if (r === n) { if (cols.every((c, j) => eq(runs(placed.map(a => a[j])), c))) out.push(placed.flat()); return; }
      for (const a of choices[r]) {
        placed.push(a);
        // Prune against all legal column prefixes, not just final counts.
        if (columns.every((patterns, j) => patterns.some(col => placed.every((row, i) => row[j] === col[i])))) search(r + 1);
        placed.pop(); if (out.length >= 2) return;
      }
    }
    search(0); return out;
  }
  register('zpicturelogic', '🎨', 'Pixel Clues', '칸 그림 단서', t => {
    const n = Math.min(5, 3 + Math.floor(t / 2)); let a, rows, cols, solutions;
    for (let attempt = 0; attempt < 80; attempt++) {
      a = seq(n * n).map(() => rnd(2)); rows = seq(n).map(r => runs(a.slice(r * n, (r + 1) * n))); cols = seq(n).map(c => runs(seq(n).map(r => a[r * n + c])));
      solutions = pictureSolutions(rows, cols, n); if (solutions.length === 1) break;
    }
    if (solutions.length !== 1) { a = seq(n * n).map(i => i % n === Math.floor(i / n) ? 1 : 0); a.fill(1, 0, n); rows = seq(n).map(r => runs(a.slice(r * n, (r + 1) * n))); cols = seq(n).map(c => runs(seq(n).map(r => a[r * n + c]))); solutions = pictureSolutions(rows, cols, n); }
    if (solutions.length !== 1) throw new Error('Picture is not unique');
    const candidates = [a, ...shuffle(seq(a.length)).slice(0, 3).map(i => a.map((v, j) => i === j ? 1 - v : v))];
    const clues = `<div class="z-pixel" style="--z-n:${n}"><span></span>${cols.map(c => `<b>${c.join('·')}</b>`).join('')}${rows.map((r, i) => `<b>${r.join('·')}</b>${seq(n).map(() => '<span class="z-cell">?</span>').join('')}`).join('')}</div>`;
    return item(B('Numbers count filled runs. Leave a gap between runs. Which picture fits?', '숫자는 연속으로 칠할 칸 수예요. 묶음 사이는 비워요. 맞는 그림은?'), clues, candidates, v => eq(v, solutions[0]), B('A clue equal to the row width fills that entire row.', '줄의 칸 수와 단서가 같으면 그 줄은 모두 칠해요.'), v => bits(v, n));
  });

  register('zowners', '🧺', 'Who Has It?', '누가 가졌을까요?', t => {
    const n = Math.min(5, 3 + Math.floor(t / 2)), animals = ['🐱', '🐶', '🐰', '🐸', '🐻'].slice(0, n), objects = ['🍎', '⚽', '🌻', '🎈', '🧸'].slice(0, n);
    const answer = shuffle(seq(n)), clues = [], pool = shuffle(seq(n * n).filter(k => answer[Math.floor(k / n)] !== k % n));
    let solutions = permutations(seq(n));
    for (const k of pool) { clues.push(k); solutions = solutions.filter(p => p[Math.floor(k / n)] !== k % n); if (solutions.length === 1) break; }
    if (solutions.length !== 1) throw new Error('Ownership is not unique');
    const at = rnd(n);
    return item(B(`Each friend has a different item. What does ${animals[at]} have?`, `친구마다 서로 다른 물건을 하나씩 가졌어요. ${animals[at]}의 물건은?`), line(animals.join(' ')) + `<div class="z-clues">${clues.map(k => `${animals[Math.floor(k / n)]} ≠ ${objects[k % n]}`).join('　')}</div>`, seq(n), v => v === solutions[0][at], B('Cross out the items a friend cannot have.', '가질 수 없는 물건부터 지워 생각해요.'), v => text(objects[v]));
  });

  register('ztruth', '💬', 'Count True Clues', '참인 단서 세기', t => {
    const n = Math.min(5, 3 + Math.floor(t / 2)), icons = ['🐱', '🐶', '🐰', '🐸', '🐻'].slice(0, n), target = rnd(n);
    // Evaluate all candidate holders; choose a truth count that singles out one.
    const other = seq(n).filter(i => i !== target), claims = [{ who: target, no: false }];
    for (const who of other.slice(0, -1)) claims.push({ who, no: true });
    const evaluate = v => claims.filter(c => c.no ? v !== c.who : v === c.who).length;
    // Choose the truth count by exhaustive evaluation. Reject ambiguous constructions.
    const counts = seq(n).map(evaluate), distinct = seq(n).filter(v => counts.filter(c => c === counts[v]).length === 1);
    const ans = pick(distinct), count = counts[ans];
    return item(B(`One friend has the peach. Exactly ${count} clues are true. Who has it?`, `복숭아를 가진 친구는 한 명이에요. 참인 단서는 ${count}개예요. 누구일까요?`), `<div class="z-clues">${shuffle(claims).map(c => line(`${c.no ? '🍑 ≠' : '🍑 ='} ${icons[c.who]}`)).join('')}</div>`, seq(n), v => evaluate(v) === count, B('Try one friend and count how many clues would be true.', '친구 한 명을 가정하고 참인 단서를 세어 봐요.'), v => text(icons[v]));
  });

  register('zpyramid', '🔺', 'Number Pyramid', '숫자 피라미드', t => {
    const n = 3 + Math.floor(t / 2), rows = [seq(n).map(() => 1 + rnd(3 + t))];
    while (rows[rows.length - 1].length > 1) { const r = rows[rows.length - 1]; rows.push(r.slice(1).map((v, i) => v + r[i])); }
    const at = t < 2 ? rows.length - 1 : rnd(rows.length - 1) + 1, col = rnd(rows[at].length), ans = rows[at][col];
    const visual = rows.slice().reverse().map((r, k) => `<div class="z-pyramid">${r.map((v, j) => `<b>${rows.length - 1 - k === at && j === col ? '?' : v}</b>`).join('')}</div>`).join('');
    return numberItem(B('Each block is the sum of the two below it. Find ?.', '아래 두 칸을 더하면 위 칸이 돼요. ?를 찾아요.'), visual, ans, B('Look at the pair directly under an empty block.', '빈칸 바로 아래 두 칸부터 보세요.'));
  });

  register('zbalance', '⚖️', 'Balance Clues', '저울 단서', t => {
    const x = 1 + rnd(3 + t), y = 1 + rnd(3 + t), a = 1 + Math.floor(t / 2), b = t < 2 ? 0 : 1 + rnd(2), sum = a * x + b * y;
    const valid = seq(50).filter(v => a * v + b * y === sum);
    if (valid.length !== 1) throw new Error('Balance is ambiguous');
    return numberItem(B('Both sides weigh the same. What is one star worth?', '양쪽 무게가 같아요. 별 하나의 무게는?'), line(`⭐${a > 1 ? ` × ${a}` : ''}${b ? ` + ● × ${b}` : ''} = ${sum}`) + (b ? line(`● + ● = ${y * 2}`) : ''), x, B(b ? 'First find one circle by sharing its total equally.' : 'Share the total equally among the stars.', b ? '동그라미 둘의 합을 똑같이 나누어 하나의 무게를 찾아요.' : '별끼리 전체 무게를 똑같이 나누어요.'));
  });

  register('zmagic', '✨', 'Equal Sum Square', '합이 같은 네모', t => {
    const scale = 1 + Math.floor(t / 2), offset = rnd(3 + t), base = [8, 1, 6, 3, 5, 7, 4, 9, 2], a = base.map(v => v * scale + offset), at = rnd(9), target = 15 * scale + 3 * offset;
    return numberItem(B(`Every row, column and diagonal totals ${target}. Find ?.`, `가로·세로·대각선의 합이 모두 ${target}예요. ?는?`), grid(a, 3, at), a[at], B('Add the two known numbers in the row with ?.', '?가 있는 줄의 나머지 두 수부터 더해요.'));
  });

  register('zsymbols', '➕', 'Missing Signs', '빠진 기호', t => {
    const count = t < 2 ? 2 : t < 5 ? 3 : 4, values = seq(count).map(() => 1 + rnd(4 + t));
    const possibilities = seq(2 ** (count - 1)).map(mask => seq(count - 1).map(i => (mask >> i) & 1 ? '−' : '+'));
    const calc = ops => values.slice(1).reduce((v, x, i) => v + (ops[i] === '+' ? x : -x), values[0]);
    const unique = possibilities.filter(p => possibilities.filter(q => calc(p) === calc(q)).length === 1 && calc(p) >= 0);
    const good = pick(unique.length ? unique : possibilities.filter(p => p.every(x => x === '+'))), ans = calc(good);
    const candidates = [good, ...shuffle(possibilities.filter(p => calc(p) !== ans)).slice(0, 3)];
    return item(B('Choose the signs in order. Work from left to right.', '기호를 순서대로 골라요. 왼쪽부터 계산해요.'), line(values.join(' □ ') + ` = ${ans}`), candidates, p => calc(p) === ans, B('Try the first sign, then keep track of the running total.', '첫 기호를 넣고 중간 결과를 기억해요.'), p => text(p.join(' ')));
  });

  register('zrule', '🔢', 'Two Step Rule', '두 단계 수 규칙', t => {
    const start = 1 + rnd(5), a = 1 + rnd(2 + t), b = 1 + rnd(2 + t), times = t >= 4, n = t < 2 ? 4 : 6;
    const values = [start]; for (let i = 1; i < n; i++) values.push(i % 2 ? values[i - 1] + a : times ? values[i - 1] * 2 : values[i - 1] + b);
    const rule = times ? `+${a}, ×2` : `+${a}, +${b}`;
    return numberItem(B(`Repeat these steps: ${rule}. What comes next?`, `${rule} 순서로 반복해요. 다음 수는?`), line(values.slice(0, -1).join(' → ') + ' → ?'), values[n - 1], B('Mark which of the two steps comes next.', '두 단계 중 다음에 쓸 단계를 찾아요.'));
  });

  function distances(a, n) {
    const d = Array(n * n).fill(-1), queue = [0]; d[0] = 0;
    for (let q = 0; q < queue.length; q++) { const i = queue[q], r = Math.floor(i / n), c = i % n; for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const rr = r + dr, cc = c + dc, j = rr * n + cc; if (rr >= 0 && rr < n && cc >= 0 && cc < n && !a[j] && d[j] < 0) { d[j] = d[i] + 1; queue.push(j); } } }
    return d;
  }
  register('zpath', '🗺️', 'Shortest Walk', '가장 짧은 길', t => {
    const n = Math.min(6, 3 + Math.floor(t / 2)); let a, ds;
    do { a = seq(n * n).map(i => i === 0 || i === n * n - 1 ? 0 : rnd(4) === 0 ? 1 : 0); ds = distances(a, n); } while (ds[a.length - 1] < 0);
    return numberItem(B('Walk from peach to flag, up/down/left/right. Fewest steps?', '복숭아에서 깃발까지 상하좌우로 가요. 가장 적은 걸음 수는?'), grid(a.map((v, i) => i === 0 ? '🍑' : i === a.length - 1 ? '🚩' : v ? '■' : '·'), n), ds[a.length - 1], B('Label nearby open cells 1, then their neighbors 2.', '옆의 빈칸에 1, 그다음 빈칸에 2를 붙여 생각해요.'));
  });

  register('zcode', '🔐', 'Shape Code', '모양 암호', t => {
    const n = t < 2 ? 2 : t < 5 ? 3 : 4, icons = ['●', '▲', '■', '★', '◆'], m = n + 1;
    const pool = permutations(seq(m)).map(p => p.slice(0, n));
    const all = [...new Map(pool.map(p => [JSON.stringify(p), p])).values()], answer = pick(all), clues = []; let remaining = all;
    const score = p => p.filter((v, i) => v === answer[i]).length;
    while (remaining.length > 1) {
      const guesses = shuffle(all.filter(p => !eq(p, answer)));
      let best = null, next = remaining;
      for (const guess of guesses) {
        const filtered = remaining.filter(p => p.filter((v, i) => v === guess[i]).length === score(guess));
        if (filtered.length < next.length) { best = guess; next = filtered; }
      }
      if (!best) throw new Error('Code clues cannot determine the answer');
      clues.push({ guess: best, count: score(best) }); remaining = next;
    }
    return item(B('No repeated shapes. Each number counts correct positions. Find the code.', '모양은 겹치지 않아요. 숫자는 자리가 맞는 모양 수예요. 암호는?'), `<div class="z-clues">${clues.map(c => line(c.guess.map(v => icons[v]).join(' ') + ` : ${c.count}`)).join('')}</div>`, [answer, ...shuffle(all.filter(p => !eq(p, answer))).slice(0, 3)], p => clues.every(c => p.filter((v, i) => v === c.guess[i]).length === c.count), B('A zero clue rules out every shown shape in that position.', '0인 단서는 그 자리에 나온 모양을 모두 제외해요.'), p => `<span class="z-code">${p.map(v => icons[v]).join(' ')}</span>`);
  });

  register('zmatrix', '🧩', 'Overlay Grid', '겹쳐 보는 격자', t => {
    const n = t < 3 ? 2 : 3, combine = (a, b) => a.map((v, i) => t >= 4 ? v ^ b[i] : v | b[i]);
    const rows = seq(t < 2 ? 2 : 3).map(() => { const a = seq(n * n).map(() => rnd(2)), b = seq(n * n).map(() => rnd(2)); return [a, b, combine(a, b)]; });
    const ans = rows[rows.length - 1][2], candidates = [ans, ...shuffle(seq(ans.length)).slice(0, 3).map(i => ans.map((v, j) => i === j ? 1 - v : v))];
    return item(B(t >= 4 ? 'In each row, overlap the first two. Dots in both disappear. Complete the last.' : 'In each row, overlap the first two. Keep all dots. Complete the last.', t >= 4 ? '각 줄의 앞 두 그림을 겹쳐요. 겹친 점은 없어져요. 마지막 그림은?' : '각 줄의 앞 두 그림을 겹쳐 점을 모두 남겨요. 마지막 그림은?'), `<div class="z-matrix">${rows.flatMap((r, i) => r.map((v, j) => i === rows.length - 1 && j === 2 ? '<span class="z-cell">?</span>' : bits(v, n))).join('')}</div>`, candidates, v => eq(v, ans), B('Follow one cell through the first two pictures.', '한 칸을 골라 앞 두 그림에서 점이 있는지 보세요.'), v => bits(v, n));
  });

  const turn = (a, n) => seq(a.length).map(i => a[(n - 1 - i % n) * n + Math.floor(i / n)]);
  const mirror = (a, n) => seq(a.length).map(i => a[Math.floor(i / n) * n + n - 1 - i % n]);
  function spatial(t, folded = false, reflected = false) {
    const n = t < 2 ? 3 : t < 5 ? 4 : 5, base = seq(n * n).map(() => rnd(2));
    const steps = t < 2 ? 1 + t : t < 5 ? 2 : 3; let ans = base;
    if (folded) { ans = base.map((v, i) => v | mirror(base, n)[i]); if (t >= 3) ans = ans.map((v, i) => v | ans[(n - 1 - Math.floor(i / n)) * n + i % n]); }
    else if (reflected) { ans = mirror(base, n); if (t >= 3) for (let k = 0; k < steps; k++) ans = turn(ans, n); }
    else for (let k = 0; k < steps; k++) ans = turn(ans, n);
    const candidates = [ans, ...shuffle(seq(ans.length)).slice(0, 3).map(i => ans.map((v, j) => i === j ? 1 - v : v))];
    const ask = folded ? B(t >= 3 ? 'Mirror the punch dots left/right, then top/bottom. What appears?' : 'Mirror the punch dots left/right. What appears?', t >= 3 ? '구멍 표시를 좌우로, 이어 위아래로 펼쳐요. 어떤 모양일까요?' : '구멍 표시를 좌우로 펼쳐요. 어떤 모양일까요?') : reflected ? B(`Mirror left/right${t >= 3 ? `, then turn clockwise ${steps} quarter-turns` : ''}. Which matches?`, `좌우를 뒤집어요${t >= 3 ? `. 이어 시계 방향으로 90도를 ${steps}번 돌아요` : ''}. 맞는 것은?`) : B(`Turn clockwise ${steps} quarter-turns. Which matches?`, `시계 방향으로 90도를 ${steps}번 돌아요. 맞는 것은?`);
    return item(ask, bits(base, n), candidates, v => eq(v, ans), B('Track a dot near a corner before checking the middle.', '모서리 가까운 점 하나가 어디로 가는지 먼저 봐요.'), v => bits(v, n));
  }
  register('zturn', '🔄', 'Turned Tiles', '칸 모양 돌리기', t => spatial(t));
  register('zmirror', '🪞', 'Mirror and Turn', '거울과 회전', t => spatial(t, false, true));
  register('zfold', '📄', 'Unfold the Dots', '구멍 펼치기', t => spatial(t, true));

  register('zcubes', '🧱', 'Hidden Cube Stacks', '쌓인 큐브 세기', t => {
    const n = t < 2 ? 2 : t < 5 ? 3 : 4, heights = seq(n * n).map(() => 1 + rnd(2 + Math.floor(t / 2))), ans = heights.reduce((a, b) => a + b, 0);
    return numberItem(B('Top view: each number is a stack height, with no gaps. How many cubes?', '위에서 본 모습이에요. 숫자는 빈틈 없이 쌓은 높이예요. 큐브는 모두 몇 개?'), grid(heights, n), ans, B('Count one row of stacks first, including cubes underneath.', '한 줄씩, 아래에 가려진 큐브도 함께 세어요.'));
  });
})();
