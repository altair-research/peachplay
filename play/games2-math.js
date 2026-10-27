'use strict';
// Grade 2 math (Georgia's K-12 Mathematics Standards, 2021): NR.1 numbers to 1000, NR.2 add/subtract within 1000, NR.3 equal groups,
// PAR.4 patterns, MDR.5 length and data, MDR.6 time and money, GSR.7 shapes, symmetry and equal shares.
// Principles kept from grade 1: no timers, unknown number in every position, models before symbols, no key-word tricks, original content.
const AREA2 = (u) => B(`Grade 2 Math · ${u}`, `2학년 수학 · ${U_KO[u] || u}`);
const G2 = (g) => registerGame(Object.assign({ grade: '2', subject: 'math' }, g, { area: AREA2(g.u) }));
const b100 = (n) => `<div class="b10 b100" aria-label="${n}"><div class="flats">${'<i class="flat"></i>'.repeat(Math.floor(n / 100))}</div><div class="rods">${'<i class="rod"></i>'.repeat(Math.floor(n / 10) % 10)}</div><div class="cubes">${'<i class="cube"></i>'.repeat(n % 10)}</div></div>`;
const digits3 = (n) => [Math.floor(n / 100), Math.floor(n / 10) % 10, n % 10];

// ---------- 1. Count to 1000 ----------
G2({
  id: 'count1000', icon: '💯', title: B('Count to 1000', '1000까지 세기'), sub: B('By 1s, 5s, 10s, 25s and 100s', '1, 5, 10, 25, 100씩'), u: 'Counting',
  play() {
    const lv = lvl('count1000'), kinds = lv === 1 ? ['one', 'five', 'ten', 'five'] : ['one', 'back', 'five', 'ten', 'hundred', 'back10', 'q25'], kind = pick(kinds), hi = lv === 1 ? 300 : 990;
    let seq, ans, rule;
    if (kind === 'one') { const a = 1 + rnd(hi - 5); seq = [a, a + 1, a + 2]; ans = a + 3; rule = B('by 1s', '1씩'); }
    else if (kind === 'back') { const a = 6 + rnd(hi - 6); seq = [a, a - 1, a - 2]; ans = a - 3; rule = B('backward by 1s', '1씩 거꾸로'); }
    else if (kind === 'five') { const a = 5 * (1 + rnd(Math.floor(hi / 5) - 5)); seq = [a, a + 5, a + 10]; ans = a + 15; rule = B('by 5s', '5씩'); }
    else if (kind === 'ten') { const a = 1 + rnd(hi - 40); seq = [a, a + 10, a + 20]; ans = a + 30; rule = B('by 10s', '10씩'); }
    else if (kind === 'back10') { const a = 41 + rnd(hi - 40); seq = [a, a - 10, a - 20]; ans = a - 30; rule = B('backward by 10s', '10씩 거꾸로'); }
    else if (kind === 'hundred') { const a = 1 + rnd(500); seq = [a, a + 100, a + 200]; ans = a + 300; rule = B('by 100s', '100씩'); }
    else { const a = 25 * rnd(6); seq = [a, a + 25, a + 50]; ans = a + 75; rule = B('by 25s', '25씩'); }
    const step = Math.abs(seq[1] - seq[0]);
    quiz(this, { ask: B(`Count ${L(rule)}. What comes next?`, `${rule.ko} 세어요. 다음 수는?`), show: trainHtml([...seq, '?'], 3), opts: numO(ans, [ans + (kind === 'back' || kind === 'back10' ? 1 : -1), ans + step, ans - step, ans + 1, ans - 1, ans + 10].filter(v => v > 0 && v <= 1100), 1, 1100), after: B(`${seq.join(', ')}, ${ans}`, `${seq.join(', ')}, ${ans}`) });
  }
});

// ---------- 2. Place value to 1000 ----------
G2({
  id: 'place1000', icon: '🧱', title: B('Hundreds, Tens, Ones', '100씩, 10씩, 낱개로'), sub: B('Show a number many ways', '한 수를 여러 방법으로'), u: 'Place value',
  play() {
    const lv = lvl('place1000'), n = lv === 1 ? 101 + rnd(399) : 101 + rnd(899), [h, t, o] = digits3(n), kind = pick(lv === 1 ? ['blocks', 'expand', 'digit'] : ['blocks', 'expand', 'digit', 'tens', 'zero', 'words']);
    const bad = [swapDigits(n) > 99 ? Math.floor(n / 100) * 100 + o * 10 + t : n + 10, n + 100, n - 10, h + t + o].filter(v => v > 0 && v !== n);
    if (kind === 'blocks') quiz(this, { ask: B('Flat = 100, rod = 10, cube = 1. What number?', '판은 100, 막대는 10, 블록은 1이에요. 어떤 수일까요?'), show: b100(n), opts: numO(n, bad, 100, 999), after: B(`${h} hundreds, ${t} tens, ${o} ones = ${n}`, `100이 ${h}개, 10이 ${t}개, 1이 ${o}개 = ${n}`) });
    else if (kind === 'expand') quiz(this, { ask: B('Add the parts. What number?', '더해서 어떤 수가 될까요?'), show: bigEq(`${h * 100} + ${t * 10} + ${o} = ?`), opts: numO(n, bad, 100, 999), after: B(`${n}`, `${n}`) });
    else if (kind === 'digit') { const pos = rnd(3), d = [h, t, o][pos], val = d * [100, 10, 1][pos]; if (val === n) return this.play();   // e.g. 300: the answer would be the number itself (Q1)
      const un = `${String(n).slice(0, pos)}<u class="ul">${d}</u>${String(n).slice(pos + 1)}`, plain = ['hundreds', 'tens', 'ones'][pos]; quiz(this, { ask: B(`What is the value of the underlined digit in ${un}?`, `${un}에서 밑줄 친 숫자의 값은 얼마일까요?`), askSay: B(`What is the value of the digit in the ${plain} place of ${n}?`, `${n}에서 ${['백', '십', '일'][pos]}의 자리 숫자의 값은 얼마일까요?`), show: '', opts: numO(val, [d, d * 10, d * 100, d * 1].filter(v => v !== val && v > 0), 0, 900).map(o2 => o2), after: B(`The ${d} is in the ${['hundreds', 'tens', 'ones'][pos]} place, so it is worth ${val}.`, `${['백', '십', '일'][pos]}의 자리 숫자 ${d}: ${val}만큼을 나타내요.`) }); }
    else if (kind === 'tens') { const tt = Math.floor(n / 10); quiz(this, { ask: B(`${n} is ${tt} tens and ___ ones.`, `${n}에는 10이 ${tt}개, 1이 ___개 있어요.`), show: '', opts: numO(o, [t, h, o + 1, 10 - o].filter(v => v !== o && v >= 0 && v <= 9), 0, 9), after: B(`${n} = ${tt} tens and ${o} ones`, `${n} = 10이 ${tt}개, 1이 ${o}개`) }); }
    else if (kind === 'zero') { const m = 100 * (1 + rnd(9)) + (rnd(2) ? o : 0) + (rnd(2) ? 10 * t : 0), [h2, t2, o2] = digits3(m); quiz(this, { ask: B(`How many tens are in ${m}'s tens place?`, `${m}의 십의 자리 숫자는?`), show: '', opts: numO(t2, [h2, o2, t2 + 1, 0].filter(v => v !== t2 && v >= 0 && v <= 9), 0, 9), after: B(`${m}: ${h2} hundreds, ${t2} tens, ${o2} ones.`, `${m}: 100이 ${h2}개, 10이 ${t2}개, 1이 ${o2}개예요.`) }); }
    else { const right = numWord(n), cand = [right, numWord(swapDigits(n) > 99 ? h * 100 + o * 10 + t : n + 10), numWord(n + 100)].filter((v, i, ar) => ar.indexOf(v) === i); quiz(this, { ask: B('Which words match the number?', '이 수를 영어로 쓴 것은 무엇일까요?'), show: `<div class="bigword">${n}</div>`, opts: cand.slice(0, 3).map(w => ({ html: `<span class="word">${w}</span>`, ok: w === right })), cls: 'words sents', after: B(`${n} is ${right}.`, `${n} = ${right}`), vocab: right }); }
  }
});

// ---------- 3. Compare and order to 1000 ----------
G2({
  id: 'compare1000', icon: '⚖️', title: B('Greater, Less, Equal', '크다, 작다, 같다'), sub: B('Compare numbers to 1000', '1000까지 수 비교'), u: 'Comparing',
  play() {
    const lv = lvl('compare1000'), top = lv === 1 ? 500 : 999, a = 100 + rnd(top - 99), kind = pick(lv === 1 ? ['symbol', 'symbol', 'order'] : ['symbol', 'order', 'greatest', 'between', 'symbol']);
    let b = a + pick([-300, -120, -40, -9, -1, 1, 9, 40, 120, 300]); b = Math.max(100, Math.min(top, b)); if (b === a) b = a === top ? a - 1 : a + 1;
    if (kind === 'symbol') { const eq = rnd(6) === 0, y = eq ? a : b, right = a === y ? '=' : a > y ? '>' : '<'; quiz(this, { ask: B('Which symbol makes it true? Compare the hundreds first.', '어느 기호가 맞을까요? 백의 자리부터 비교해요.'), show: bigEq(`${a} <span class="qbox">?</span> ${y}`), opts: ['>', '<', '='].map(s => ({ html: `<span class="num">${s}</span>`, ok: s === right })), cls: 'shapes', after: B(`${a} ${right} ${y}`, `${a} ${right} ${y}`) }); }
    else if (kind === 'order') { let c = Math.max(100, Math.min(top, b + pick([-150, -17, 17, 150]))); const nums = [...new Set([a, b, c])]; if (nums.length < 3) { this.play(); return; } const up = [...nums].sort((p, q) => p - q), right = up.join(', '), cand = [right, [...up].reverse().join(', '), [up[1], up[0], up[2]].join(', ')]; quiz(this, { ask: B('Which list goes from least to greatest?', '가장 작은 수부터 큰 수 순서로 놓은 것은?'), show: `<div class="bigword">${shuffle(nums).join('  ')}</div>`, opts: [...new Set(cand)].map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === right })), cls: 'words', after: B(up.join(' < '), up.join(' < ')) }); }
    else if (kind === 'greatest') { const c = Math.max(100, Math.min(top, a + pick([-200, 33, 77, 205]))), nums = [...new Set([a, b, c])]; if (nums.length < 3) { this.play(); return; } const mx = Math.max(...nums); quiz(this, { ask: B('Which number is the GREATEST?', '가장 큰 수는?'), show: '', opts: nums.map(v => ({ html: `<span class="num">${v}</span>`, ok: v === mx })), after: B(`${mx} is greatest.`, `가장 큰 수: ${mx}`) }); }
    else { const lo = Math.min(a, b), hi2 = Math.max(a, b); if (hi2 - lo < 12) { this.play(); return; } const mid = lo + 3 + rnd(hi2 - lo - 5), ds = [lo - 4 > 99 ? lo - 4 : hi2 + 4, hi2 + 3 + rnd(20)]; if (ds[0] === ds[1]) ds[1] += 7; quiz(this, { ask: B(`Which number is between ${lo} and ${hi2}?`, `두 수 ${lo}, ${hi2} 사이에 있는 수는 무엇일까요?`), show: '', opts: [mid, ...ds.filter(v => v !== mid)].slice(0, 3).map(v => ({ html: `<span class="num">${v}</span>`, ok: v === mid })), after: B(`${lo} < ${mid} < ${hi2}`, `${lo} < ${mid} < ${hi2}`) }); }
  }
});

// ---------- 4. 10 and 100 more or less ----------
G2({
  id: 'tenhundred', icon: '🔼', title: B('10 or 100 More, Less', '10 또는 100만큼 큰 수와 작은 수'), sub: B('Jump by tens and hundreds', '10, 100씩 뛰어요'), u: 'Mental math',
  play() {
    const lv = lvl('tenhundred'), step = lv === 1 ? 10 : pick([10, 100, 10, 100]), more = rnd(2) === 0, n = step === 10 ? (lv === 1 ? 110 + rnd(790) : 105 + rnd(880)) : 150 + rnd(750), ans = more ? n + step : n - step, wrong = more ? n - step : n + step;
    quiz(this, { ask: more ? B(`What is ${step} MORE than ${n}?`, `${n}보다 ${step} 큰 수는?`) : B(`What is ${step} LESS than ${n}?`, `${n}보다 ${step} 작은 수는?`), askSay: more ? B(`What is ${step} more than ${n}?`, `${n}보다 ${step} 큰 수는?`) : B(`What is ${step} less than ${n}?`, `${n}보다 ${step} 작은 수는?`), show: '', opts: numO(ans, [wrong, ans + 1, ans - 1, ans + (step === 10 ? 100 : 10), swapDigits(ans % 100) + Math.floor(ans / 100) * 100].filter(v => v > 0 && v < 1100), 1, 1100), after: B(`${n} ${more ? '+' : '−'} ${step} = ${ans}`, `${n} ${more ? '+' : '−'} ${step} = ${ans}`) });
  }
});

// ---------- 5. Facts within 20 (fluent, no timer) ----------
G2({
  id: 'facts20', icon: '🧠', title: B('Facts Within 20', '20 이내 계산'), sub: B('Pick a smart strategy', '똑똑한 방법을 골라요'), u: 'Fluency within 20',
  play() {
    const lv = lvl('facts20'), kind = pick(lv === 1 ? ['add', 'sub', 'add', 'miss'] : ['add', 'sub', 'miss', 'miss', 'tf']);
    if (kind === 'add') { const a = 3 + rnd(9), b = 3 + rnd(Math.min(9, 20 - a) - 2), s = a + b, tip = a === b ? B('A double!', '같은 수 더하기(더블)예요!') : a + b > 10 && (a >= 7 || b >= 7) ? B('Make a ten first.', '먼저 10을 만들어 봐요.') : B('Count on from the bigger number.', '큰 수에서 이어 세어 봐요.'); quiz(this, { ask: B(`${a} + ${b} = ?`, `${a} + ${b} = ?`), show: '', opts: numO(s, [s + 1, s - 1, s + 10, a, b].filter(v => v > 0 && v <= 21), 1, 21), after: B(`${s}. ${L(tip)}`, `${s}. ${tip.ko}`) }); }
    else if (kind === 'sub') { const a = 10 + rnd(10), b = 3 + rnd(Math.min(9, a - 2)), d = a - b; quiz(this, { ask: B(`${a} − ${b} = ?`, `${a} − ${b} = ?`), show: '', opts: numO(d, [d + 1, d - 1, a + b, d + 10].filter(v => v >= 0 && v <= 21), 0, 20), after: B(`${d}. Think: ${b} + ${d} = ${a}.`, `${d}. 생각해 봐요: ${b} + ${d} = ${a}.`) }); }
    else if (kind === 'miss') { const c = 11 + rnd(10), a = 3 + rnd(c - 6), b = c - a, form = pick(['a+?', '?+b', 'c-?']); const ans = form === 'c-?' ? a : form === 'a+?' ? b : a; const eq = form === 'a+?' ? `${a} + <span class="qbox">?</span> = ${c}` : form === 'c-?' ? `${c} − <span class="qbox">?</span> = ${b}` : `<span class="qbox">?</span> + ${b} = ${c}`; quiz(this, { ask: B('What number makes it true?', '어떤 수가 들어가야 할까요?'), show: bigEq(eq), opts: numO(ans, [ans + 1, ans - 1, c, a + b - ans].filter(v => v >= 0 && v <= 20 && v !== ans), 0, 20), after: B(`The missing number is ${ans}.`, `빠진 수: ${ans}`) }); }
    else { const a = 4 + rnd(8), b = 4 + rnd(Math.min(8, 17 - a)), real = a + b, truth = rnd(2) === 0, shown = truth ? real : real + pick([-1, 1, 2]); quiz(this, { ask: B('Is this true or false?', '맞을까요, 틀릴까요?'), show: bigEq(`${a} + ${b} = ${shown}`), opts: [{ html: `<span class="word">${S.lang === 'ko' ? '맞아요 ✅' : 'True ✅'}</span>`, ok: truth }, { html: `<span class="word">${S.lang === 'ko' ? '틀려요 ❌' : 'False ❌'}</span>`, ok: !truth }], cls: 'words', after: B(`${a} + ${b} = ${real}`, `${a} + ${b} = ${real}`) }); }
  }
});

// ---------- 6. Add two-digit numbers ----------
G2({
  id: 'add2dig', icon: '➕', title: B('Add Two-Digit Numbers', '두 자리 수 더하기'), sub: B('Tens and ones, regroup when needed', '10씩 묶음과 낱개, 필요하면 받아올림'), u: 'Addition within 100',
  play() {
    const lv = lvl('add2dig'), regroup = lv === 2 && rnd(3) > 0;
    const pairs = []; for (let x = 11; x <= 89; x++) for (let y = 11; y <= 89; y++) { if (x + y > 100) continue; const carry = x % 10 + y % 10 >= 10; if (carry === regroup) pairs.push([x, y]); }
    const [a, b] = pick(pairs);
    const s = a + b, ta = Math.floor(a / 10) * 10, tb = Math.floor(b / 10) * 10, oa = a % 10, ob = b % 10, onesSum = oa + ob;
    const tip = onesSum >= 10 ? B(`${ta} + ${tb} = ${ta + tb}; ${oa} + ${ob} = ${onesSum}; ${ta + tb} + ${onesSum} = ${s}`, `${ta} + ${tb} = ${ta + tb}; ${oa} + ${ob} = ${onesSum}; ${ta + tb} + ${onesSum} = ${s}`) : B(`${ta} + ${tb} = ${ta + tb}; ${oa} + ${ob} = ${onesSum}; ${s}`, `${ta} + ${tb} = ${ta + tb}; ${oa} + ${ob} = ${onesSum}; ${s}`);
    quiz(this, { ask: B('Add. Try tens and ones.', '더해 봐요. 10씩 묶음과 낱개로 나누어 봐요.'), show: bigEq(`${a} + ${b} = ?`), opts: numO(s, [s - 10, s + 10, ta + tb + Math.max(oa, ob), s + 1, s - 1].filter(v => v > 0 && v <= 110), 0, 110), after: tip });
  }
});

// ---------- 7. Subtract two-digit numbers ----------
G2({
  id: 'sub2dig', icon: '➖', title: B('Subtract Two-Digit Numbers', '두 자리 수 빼기'), sub: B('Take away or count up', '빼기 또는 이어 세기'), u: 'Subtraction within 100',
  play() {
    const lv = lvl('sub2dig'), regroup = lv === 2 && rnd(3) > 0; let a, b, g = 0;
    do { a = 30 + rnd(70); b = 11 + rnd(a - 15); g++; } while (((regroup ? b % 10 <= a % 10 : b % 10 > a % 10) || b >= a) && g < 200);
    const d = a - b, tb = Math.floor(b / 10) * 10, ob = b % 10;
    quiz(this, { ask: B('Subtract. You can count up from the small number too.', '빼 봐요. 작은 수에서 큰 수까지 이어 세어도 좋아요.'), show: bigEq(`${a} − ${b} = ?`), opts: numO(d, [d + 10, d - 10, Math.abs(a % 10 - ob) + Math.floor((a - b) / 10) * 10, d + 1, d - 1].filter(v => v >= 0 && v < 100), 0, 99), after: B(`${b} + ${d} = ${a}, so ${a} − ${b} = ${d}.`, `${b} + ${d} = ${a}. 그러니까 ${a} − ${b} = ${d}.`) });
  }
});

// ---------- 8. Story problems ----------
const WP2 = [['Mia', '미아'], ['Ben', '벤'], ['Lily', '릴리'], ['Sam', '샘'], ['Ava', '에이바'], ['Max', '맥스'], ['Zoe', '조이'], ['Leo', '레오']];
const WI2 = [['stickers', '스티커', '⭐', '장'], ['marbles', '구슬', '🔵', '개'], ['books', '책', '📚', '권'], ['cards', '카드', '🃏', '장'], ['peaches', '복숭아', '🍑', '개'], ['coins', '동전', '🪙', '개']];       // 4th: Korean counting unit
G2({
  id: 'wordprob2', icon: '📖', title: B('Story Problems', '이야기 문제'), sub: B('One- and two-step stories', '한 단계, 두 단계 이야기'), u: 'Word problems',
  play() {
    const lv = lvl('wordprob2'), [n1, k1] = pick(WP2), [n2, k2] = pick(WP2.filter(x => x[0] !== n1)), [it, ik, ie, un] = pick(WI2), ga = un === '개' ? '가' : '이', eul = un === '개' ? '를' : '을', kinds = lv === 1 ? ['addR', 'addC', 'subR', 'subC', 'addS', 'subS', 'compare'] : ['two1', 'two2', 'addR3', 'subR3', 'two1', 'compare3'], kind = pick(kinds);
    let ask, ans, bad = [];
    if (kind === 'addR') { const a = 20 + rnd(50), b = 11 + rnd(Math.min(40, 90 - a)); ans = a + b; ask = B(`${n1} had ${a} ${it}, then a friend gave ${n1} ${b} more. How many now?`, `${k1}에게 ${ik} ${a}${un}${ga} 있었는데 친구가 ${b}${un}${eul} 더 줬어요. 지금 몇 ${un}일까요?`); bad = [a + b + 10, a + b - 10, Math.abs(a - b)]; }
    else if (kind === 'addC') { const a = 20 + rnd(40), c = a + 11 + rnd(Math.min(40, 90 - a)); ans = c - a; ask = B(`${n1} had ${a} ${it}, then got some more and had ${c}. How many did ${n1} get?`, `${k1}에게 ${ik} ${a}${un}${ga} 있었는데 더 받아서 ${c}${un}${ga} 되었어요. 몇 ${un}${eul} 받았을까요?`); bad = [c + a, ans + 10, ans - 10]; }
    else if (kind === 'addS') { const b = 11 + rnd(30), c = b + 15 + rnd(Math.min(45, 98 - b - 15)); ans = c - b; ask = B(`${n1} had some ${it}, got ${b} more, and now has ${c}. How many did ${n1} start with?`, `${k1}에게 ${ik} ${b}${un}${ga} 더 생겨 ${c}${un}${ga} 됐어요. 처음에 몇 ${un} 있었을까요?`); bad = [c + b, ans + 10, ans - 10]; }
    else if (kind === 'subR') { const a = 40 + rnd(55), b = 11 + rnd(a - 20); ans = a - b; ask = B(`${n1} had ${a} ${it} and gave ${b} to ${n2}. How many are left?`, `${k1}에게 ${ik} ${a}${un}${ga} 있었는데 ${k2}에게 ${b}${un}${eul} 줬어요. 몇 ${un} 남았을까요?`); bad = [a + b, ans + 10, ans - 10]; }
    else if (kind === 'subC') { const a = 40 + rnd(55), c = 11 + rnd(a - 20); ans = a - c; ask = B(`${n1} had ${a} ${it}, gave some away, and has ${c} left. How many were given away?`, `${k1}에게 ${ik} ${a}${un}${ga} 있었는데 몇 ${un}${eul} 줬더니 ${c}${un}${ga} 남았어요. 몇 ${un}${eul} 줬을까요?`); bad = [a + c, ans + 10, ans - 10]; }
    else if (kind === 'subS') { const b = 11 + rnd(30), c = 11 + rnd(40); ans = b + c; ask = B(`${n1} gave away ${b} ${it} and has ${c} left. How many did ${n1} have at first?`, `${k1}의 ${ik} 중 ${b}${un}${eul} 줬더니 ${c}${un}${ga} 남았어요. 처음에 몇 ${un} 있었을까요?`); bad = [Math.abs(c - b), ans + 10, ans - 10]; }
    else if (kind === 'compare') { const a = 20 + rnd(40), c = a + 11 + rnd(30); ans = c - a; ask = B(`${n1} has ${a} ${it} and ${n2} has ${c}. How many more does ${n2} have?`, `${k1}에게는 ${ik} ${a}${un}, ${k2}에게는 ${c}${un}${ga} 있어요. ${k2}에게는 ${k1}보다 몇 ${un} 더 있을까요?`); bad = [a + c, ans + 10, ans - 10]; }
    else if (kind === 'two1') { const a = 30 + rnd(30), b = 10 + rnd(20), c = 5 + rnd(20); ans = a + b - c; ask = B(`${n1} had ${a} ${it}, got ${b} more, then gave away ${c}. How many does ${n1} have now?`, `${k1}에게 ${ik} ${a}${un}${ga} 있었는데 ${b}${un}${eul} 더 받고 ${c}${un}${eul} 줬어요. 지금 몇 ${un}일까요?`); bad = [a + b + c, a + b, a - b + c].filter(v => v !== ans); }
    else if (kind === 'two2') { const a = 65 + rnd(35), b = 10 + rnd(20), c = 5 + rnd(20); ans = a - b - c; ask = B(`${n1} had ${a} ${it} and gave ${b} to ${n2} and ${c} to a friend. How many are left?`, `${k1}에게 ${ik} ${a}${un}${ga} 있었는데 ${k2}에게 ${b}${un}, 친구에게 ${c}${un}${eul} 줬어요. 몇 ${un} 남았을까요?`); bad = [a - b, a - c, a - b + c].filter(v => v !== ans); }
    else if (kind === 'addR3') { const a = 120 + rnd(500), b = 100 + rnd(200); ans = a + b; ask = B(`A store had ${a} ${it} and got ${b} more. How many ${it} in all?`, `가게에 ${ik} ${a}${un}${ga} 있었는데 ${b}${un}${ga} 더 왔어요. 모두 몇 ${un}일까요?`); bad = [ans + 100, ans - 100, ans + 10]; }
    else if (kind === 'subR3') { const a = 400 + rnd(500), b = 100 + rnd(250); ans = a - b; ask = B(`A store had ${a} ${it} and sold ${b}. How many are left?`, `가게에 ${ik} ${a}${un}${ga} 있었는데 ${b}${un}${eul} 팔았어요. 몇 ${un} 남았을까요?`); bad = [a + b, ans + 100, ans - 10]; }
    else { const a = 150 + rnd(300), c = a + 100 + rnd(200); ans = c - a; ask = B(`A red box has ${a} ${it} and a blue box has ${c}. How many more in blue?`, `빨간 상자에 ${ik} ${a}${un}, 파란 상자에 ${c}${un}${ga} 있어요. 차이는 몇 ${un}일까요?`); bad = [a + c, ans + 100, ans - 10]; }
    quiz(this, { ask, show: `<span class="emo">${ie}</span>`, opts: numO(ans, bad.filter(v => v > 0 && v !== ans), 1, 1100), after: B(`The answer is ${ans}.`, `답: ${ans}`) });
  }
});

// ---------- 9. Add and subtract three-digit numbers ----------
G2({
  id: 'addsub1000', icon: '🔢', title: B('Add and Subtract to 1000', '1000까지 더하고 빼기'), sub: B('Hundreds, tens and ones', '100씩, 10씩, 낱개로'), u: 'Within 1000',
  play() {
    const lv = lvl('addsub1000'), add = rnd(2) === 0; let a, b, ans, eq, tip;
    if (lv === 1) { a = 100 * (1 + rnd(5)) + 10 * rnd(5); b = 100 * (1 + rnd(3)) + 10 * rnd(4); }
    else { a = 120 + rnd(560); b = 31 + rnd(250); }
    if (add) { if (a + b > 999) { this.play(); return; } ans = a + b; eq = `${a} + ${b}`; const [ha, ta, oa] = digits3(a), [hb, tb, ob] = digits3(b); tip = B(`Add the hundreds, then the tens, then the ones: ${ans}.`, `100씩 묶음, 10씩 묶음, 낱개를 차례로 더해요. 답: ${ans}`); }
    else { if (a < b) [a, b] = [b, a]; if (a === b) { this.play(); return; } ans = a - b; eq = `${a} − ${b}`; tip = B(`Count up from ${b} to ${a}, or take away by place value: ${ans}.`, `${b}에서 ${a}까지 이어 세거나 자리별로 빼요: ${ans}.`); }
    const hund = (v) => Math.floor(v / 100) * 100, noCarry = add ? hund(a) + hund(b) + (a % 100) + (b % 100) % 100 : ans + 100;
    quiz(this, { ask: B('Solve it. Use hundreds, tens and ones.', '100씩 묶음, 10씩 묶음, 낱개로 나누어서 풀어요.'), show: bigEq(`${eq} = ?`), opts: numO(ans, [ans + 100, ans - 100, ans + 10, ans - 10, noCarry].filter(v => v > 0 && v < 1100 && v !== ans), 1, 1100), after: tip });
  }
});

// ---------- 10. Odd and even ----------
G2({
  id: 'oddeven', icon: '🍑', title: B('Odd or Even?', '홀수일까요, 짝수일까요?'), sub: B('Pairs with nobody left over', '짝을 지어 봐요'), u: 'Odd and even',
  play() {
    const lv = lvl('oddeven'), n = 2 + rnd(lv === 1 ? 11 : 19), e = pick(['🍑', '⭐', '🍎', '🐞']), even = n % 2 === 0, kind = pick(lv === 1 ? ['pairs', 'pairs', 'number'] : ['pairs', 'number', 'eq', 'eq', 'number']);
    const pairsHtml = `<div class="pairs">${Array.from({ length: Math.ceil(n / 2) }, (_, i) => `<span class="pr">${e}${i * 2 + 1 < n ? e : '<i class="gap">·</i>'}</span>`).join('')}</div>`;
    const opts = [['even', B('even', '짝수')], ['odd', B('odd', '홀수')]].map(x => ({ html: `<span class="word">${L(x[1])}</span>`, ok: (x[0] === 'even') === even }));
    if (kind === 'pairs') quiz(this, { ask: B('Look at the pairs. Is the number odd or even?', '짝을 지었어요. 홀수일까요, 짝수일까요?'), show: pairsHtml, opts, cls: 'words', after: even ? B(`${n} is even. Everyone has a partner.`, `${n}: 짝수예요. 모두 짝이 있어요.`) : B(`${n} is odd. One is left over.`, `${n}: 홀수예요. 하나가 남아요.`) });
    else if (kind === 'number') { const m = 11 + rnd(lv === 1 ? 40 : 190), ev = m % 2 === 0; quiz(this, { ask: B(`Is ${m} odd or even? Look at the ones digit.`, `${m}: 홀수일까요, 짝수일까요? 일의 자리 숫자를 봐요.`), show: '', opts: [['even', B('even', '짝수')], ['odd', B('odd', '홀수')]].map(x => ({ html: `<span class="word">${L(x[1])}</span>`, ok: (x[0] === 'even') === ev })), cls: 'words', after: ev ? B(`${m} ends in ${m % 10}, so it is even.`, `${m}: 일의 자리 숫자는 ${m % 10}. 그래서 짝수예요.`) : B(`${m} ends in ${m % 10}, so it is odd.`, `${m}: 일의 자리 숫자는 ${m % 10}. 그래서 홀수예요.`) }); }
    else { const k = 2 + rnd(9), m = 2 * k; quiz(this, { ask: B(`Which equation shows that ${m} is even?`, `${m}: 짝수라는 것을 보여 주는 식은 무엇일까요?`), show: '', opts: eqO([`${k} + ${k} = ${m}`, `${k} + ${k + 1} = ${m}`, `${k} + ${k - 1} = ${m}`], `${k} + ${k} = ${m}`), cls: 'words', after: B(`Two equal addends: ${k} + ${k} = ${m}.`, `같은 수 두 개의 합: ${k} + ${k} = ${m}.`) }); }
  }
});

// ---------- 11. Arrays ----------
G2({
  id: 'arrays', icon: '🔳', title: B('Rows and Columns', '가로줄과 세로줄'), sub: B('Arrays and repeated addition', '배열과 같은 수 더하기'), u: 'Arrays',
  play() {
    const lv = lvl('arrays'), r = 2 + rnd(lv === 1 ? 3 : 4), c = 2 + rnd(lv === 1 ? 3 : 4), e = pick(['🍑', '🍎', '⭐', '🟦']), total = r * c, grid = `<div class="arr" style="--cols:${c}">${Array.from({ length: r * c }, () => `<span>${e}</span>`).join('')}</div>`, kind = pick(lv === 1 ? ['total', 'eq'] : ['total', 'eq', 'rows', 'cols']);
    if (lv === 2) { const lost = 1 + rnd(c - 1), ans = total - lost; quiz(this, { ask: B(`${lost} counters are removed from this array. How many remain?`, `이 배열에서 ${lost}개를 빼요. 몇 개가 남을까요?`), show: grid, opts: numO(ans, [total, total - lost - 1, total - c], 1, 40), after: B(`${r} × ${c} − ${lost} = ${ans}`, `${r} × ${c} − ${lost} = ${ans}`) }); return; }
    const addEq = Array(r).fill(c).join(' + '), colEq = Array(c).fill(r).join(' + ');
    if (kind === 'total') quiz(this, { ask: B(`${r} rows of ${c}. How many in all?`, `가로줄 ${r}개에 ${c}개씩이에요. 모두 몇 개일까요?`), show: grid, opts: numO(total, [r + c, total + c, total - c, total + r].filter(v => v !== total && v > 0), 2, 30), after: B(`${addEq} = ${total}`, `${addEq} = ${total}`) });
    else if (kind === 'eq') { const right = `${addEq} = ${total}`, cand = [right, `${colEq} = ${total}`, `${r} + ${c} = ${r + c}`].filter((v, i, ar) => ar.indexOf(v) === i); if (cand.length < 3) cand.push(`${Array(r + 1).fill(c).join(' + ')} = ${total + c}`); quiz(this, { ask: B('Which equation matches the rows?', '가로줄마다 같은 수를 더한 식은?'), show: grid, opts: cand.slice(0, 3).map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === right })), cls: 'words sents', after: B(`${r} rows of ${c}: ${right}`, `가로줄 ${r}개, 한 줄에 ${c}개: ${right}`) }); }
    else if (kind === 'rows') quiz(this, { ask: B('How many rows are there?', '가로줄이 몇 개일까요?'), show: grid, opts: numO(r, [c, r + 1, r - 1].filter(v => v !== r && v > 0), 1, 7), after: B(`${r} rows`, `가로줄 ${r}개`) });
    else quiz(this, { ask: B('How many are in each row?', '가로줄 하나에 몇 개씩 있을까요?'), show: grid, opts: numO(c, [r, c + 1, c - 1].filter(v => v !== c && v > 0), 1, 7), after: B(`${c} in each row`, `가로줄 하나에 ${c}개`) });
  }
});

// ---------- 12. Equal groups ----------
G2({
  id: 'equalgroups', icon: '🍪', title: B('Equal Groups', '똑같은 묶음'), sub: B('Groups of the same size', '같은 크기의 묶음'), u: 'Equal groups',
  play() {
    const lv = lvl('equalgroups'), g = 2 + rnd(4), each = 2 + rnd(lv === 1 ? 3 : 4), [e, un] = pick([['🍪', '개'], ['🍑', '개'], ['⭐', '개'], ['🐟', '마리']]), total = g * each, kind = pick(['total', 'total', 'each']);
    const plates = `<div class="plates">${Array.from({ length: g }, () => `<span class="plate">${e.repeat(each)}</span>`).join('')}</div>`;
    if (lv === 2) { const extra = 1 + rnd(each - 1), ans = total + extra; quiz(this, { ask: B(`${g} plates hold ${each} each. Add ${extra} to one plate; how many now?`, `접시 ${g}개에 ${each}개씩 있어요. 한 접시에 ${extra}개를 더 놓으면 모두 몇 개일까요?`), show: plates, opts: numO(ans, [total, total + g, total + each], 1, 40), after: B(`${g} × ${each} + ${extra} = ${ans}`, `${g} × ${each} + ${extra} = ${ans}`) }); return; }
    if (kind === 'total') quiz(this, { ask: B(`${g} plates with ${each} each. How many in all?`, `접시 ${g}개에 ${e}가 ${each}${un}씩 있어요. 모두 몇 ${un}일까요?`), show: plates, opts: numO(total, [g + each, total + each, total - each].filter(v => v !== total && v > 0), 2, 40), after: B(`${Array(g).fill(each).join(' + ')} = ${total}`, `${Array(g).fill(each).join(' + ')} = ${total}`) });
    else quiz(this, { ask: B(`${total} ${e} are shared equally on ${g} plates. How many on each plate?`, `${e} ${total}${un}를 접시 ${g}개에 똑같이 나누면 접시마다 몇 ${un}일까요?`), show: '', opts: numO(each, [total - g, g, each + 1, each - 1].filter(v => v !== each && v > 0), 1, 12), after: B(`${g} groups of ${each} make ${total}.`, `${each}${un}씩 ${g}묶음이면 모두 ${total}${un}예요.`) });
  }
});

// ---------- 13. Number patterns ----------
G2({
  id: 'growpat2', icon: '📈', title: B('Pattern Rules', '수의 규칙'), sub: B('Add or subtract the same number', '같은 수를 더하거나 빼요'), u: 'Patterns',
  play() {
    const lv = lvl('growpat2'), kind = pick(lv === 1 ? ['next', 'rule', 'next'] : ['next', 'rule', 'table', 'table', 'shrink']);
    const step = pick(lv === 1 ? [2, 3, 5, 10] : [2, 3, 4, 5, 6, 10, 20, 25]);
    if (kind === 'next') { const s = rnd(30), seq = [0, 1, 2, 3].map(i => s + i * step); quiz(this, { ask: B('What comes next?', '다음에 올 수는?'), show: trainHtml([...seq, '?'], 4), opts: numO(seq[3] + step, [seq[3] + 1, seq[3] + step + 1, seq[3] + step - 1, seq[3] + 2 * step], 0, 300), after: B(`Add ${step} each time.`, `${step}씩 더해요.`) }); }
    else if (kind === 'shrink') { const s = Math.max(80, 4 * step) + rnd(100), seq = [0, 1, 2, 3].map(i => s - i * step); quiz(this, { ask: B('The numbers get smaller. What comes next?', '수가 작아져요. 다음에 올 수는?'), show: trainHtml([...seq, '?'], 4), opts: numO(seq[3] - step, [seq[3] - 1, seq[3] - step + 1, seq[3] - step - 1, seq[3] + step].filter(v => v >= 0), 0, 300), after: B(`Subtract ${step} each time.`, `${step}씩 빼요.`) }); }
    else if (kind === 'rule') { const s = rnd(25), seq = [0, 1, 2, 3].map(i => s + i * step), pool = [2, 3, 5, 10, 4].filter(x => x !== step), ds = shuffle(pool).slice(0, 2); quiz(this, { ask: B('What is the rule?', '규칙은 무엇일까요?'), show: trainHtml(seq), opts: [step, ...ds].map(k => ({ html: `<span class="num">+${k}</span>`, label: B(`add ${k}`, `${k}씩 더하기`), ok: k === step })), cls: 'shapes', after: B(`Each number is ${step} more.`, `${step}씩 커져요.`) }); }
    else { const add = rnd(2) === 0, k = 2 + rnd(8), ins = [1 + rnd(8), 3 + rnd(8), 5 + rnd(10)], q = rnd(3), outs = ins.map(v => (add ? v + k : v - k)); if (!add) { for (let i = 0; i < 3; i++) ins[i] += 12; ins.forEach((_, i) => outs[i] = ins[i] - k); }
      quiz(this, { ask: B('Find the output. Use the rule.', '규칙을 써서 나오는 수를 찾아요.'), show: `<div class="inout"><div class="rule">${L(B('Rule', '규칙'))}: ${add ? '+' : '−'}${k}</div><table><tr><th>${L(B('In', '넣는 수'))}</th><th>${L(B('Out', '나오는 수'))}</th></tr>${ins.map((v, i) => `<tr><td>${v}</td><td>${i === q ? '?' : outs[i]}</td></tr>`).join('')}</table></div>`, opts: numO(outs[q], [outs[q] + 1, outs[q] - 1, ins[q] + (add ? -k : k)].filter(v => v >= 0), 0, 60), after: B(`${ins[q]} ${add ? '+' : '−'} ${k} = ${outs[q]}`, `${ins[q]} ${add ? '+' : '−'} ${k} = ${outs[q]}`) }); }
  }
});

// ---------- 14. Measure with a ruler ----------
const rulerSvg = (len, unit = 'in', maxU = 8) => { const W = 30 * maxU + 30; let s = `<rect x="6" y="40" width="${30 * maxU + 12}" height="26" rx="3" fill="#ffe8a8" stroke="#8a6a1c" stroke-width="2"/>`; for (let i = 0; i <= maxU; i++) s += `<line x1="${12 + i * 30}" y1="40" x2="${12 + i * 30}" y2="${i % 1 === 0 ? 56 : 50}" stroke="#8a6a1c" stroke-width="2"/><text x="${12 + i * 30}" y="76" font-size="11" font-weight="800" text-anchor="middle" fill="#5a4210">${i}</text>`; s += `<rect x="12" y="10" width="${len * 30}" height="22" rx="5" fill="#a78bfa" stroke="#4b3a96" stroke-width="2"/>`; return `<svg viewBox="0 0 ${W} 86" class="rulersvg">${s}</svg>`; };
G2({
  id: 'ruler', icon: '📏', title: B('Use a Ruler', '자로 재기'), sub: B('Measure to the nearest inch', '가장 가까운 인치 눈금으로 재요'), u: 'Length',
  play() {
    if (this.gap50Turn === undefined) this.gap50Turn = 0;
    if (this.gap50Turn++ % 2 === 0) return this.buildUnits50();
    const lv = lvl('ruler'), len = 2 + rnd(lv === 1 ? 5 : 6), kind = pick(lv === 1 ? ['read', 'read', 'choose'] : ['read', 'choose', 'diff', 'estimate']);
    if (kind === 'read') quiz(this, { ask: B('How long is the purple strip? Use the ruler (inches).', '보라색 띠의 길이는? 자(인치)를 봐요.'), show: rulerSvg(len), opts: numO(len, [len + 1, len - 1, len + 2], 1, 9).map(o => ({ html: o.html.replace(/>(\d+)</, '>$1 in<'), ok: o.ok })), after: B(`It is ${len} inches long.`, `길이는 ${len}인치예요.`), vocab: `${len} inches` });
    else if (kind === 'choose') { const items = [[B('a pencil', '연필'), 'in'], [B('a paper clip', '클립'), 'in'], [B('a door', '문'), 'ft'], [B('a school desk', '책상'), 'ft'], [B('a football field', '미식축구장'), 'yd'], [B('a school bus', '스쿨버스'), 'yd']], it = pick(items), unit = { in: B('inches', '인치'), ft: B('feet', '피트'), yd: B('yards', '야드') }; quiz(this, { ask: B(`Which unit is best to measure ${L(it[0])}?`, `${it[0].ko}의 길이를 재기에 가장 알맞은 단위는 무엇일까요?`), show: '', opts: Object.keys(unit).map(k => ({ html: `<span class="word">${L(unit[k])}</span>`, ok: k === it[1] })), cls: 'words', after: B(`Use ${unit[it[1]].en} for ${it[0].en}.`, `${it[0].ko}의 길이는 ${unit[it[1]].ko}로 재요.`) }); }
    else if (kind === 'diff') { const a = 3 + rnd(3), d = 1 + rnd(3); quiz(this, { ask: B(`Red is ${a + d} inches and blue is ${a} inches. How much longer is red?`, `빨간 띠는 ${a + d}인치, 파란 띠는 ${a}인치예요. 빨간 띠가 몇 인치 더 길까요?`), show: `<div class="lenlist">${rulerSvg(a + d, 'in', 8).replace('#a78bfa', '#ef476f')}${rulerSvg(a, 'in', 8).replace('#a78bfa', '#118ab2')}</div>`, opts: numO(d, [d + 1, d - 1, a], 0, 9).map(o => ({ html: o.html.replace(/>(\d+)</, '>$1 in<'), ok: o.ok })), after: B(`${a + d} − ${a} = ${d}`, `${a + d} − ${a} = ${d}`) }); }
    else { const ests = [[B('A pencil is about 7 ___ long.', '연필의 길이는 약 7 ___예요.'), 'inches', ['feet', 'yards'], B('inches', '인치')], [B('A classroom door is about 7 ___ tall.', '교실 문의 높이는 약 7 ___예요.'), 'feet', ['inches', 'yards'], B('feet', '피트')], [B('A football field is about 100 ___ long.', '미식축구장의 길이는 약 100 ___예요.'), 'yards', ['inches', 'feet'], B('yards', '야드')]], q = pick(ests), nm = { inches: B('inches', '인치'), feet: B('feet', '피트'), yards: B('yards', '야드') }; quiz(this, { ask: q[0], show: '', opts: [q[1], ...q[2]].map(k => ({ html: `<span class="word">${L(nm[k])}</span>`, ok: k === q[1] })), cls: 'words', after: B('A good estimate uses a sensible unit.', '알맞은 단위로 어림해요.') }); }
  }
});

// ---------- 15. Number line jumps (add and subtract lengths) ----------
const jumpLine = (start, jumps) => { let s = '<line x1="10" y1="40" x2="310" y2="40" stroke="#1d3557" stroke-width="3"/>'; const lo = Math.min(start, start + jumps) - 2, hi = Math.max(start, start + jumps) + 2, sc = 280 / (hi - lo); for (let v = Math.ceil(lo); v <= hi; v++) { const x = 20 + (v - lo) * sc; s += `<line x1="${x}" y1="32" x2="${x}" y2="48" stroke="#1d3557" stroke-width="2"/><text x="${x}" y="64" font-size="11" font-weight="800" text-anchor="middle" fill="#1d3557">${v}</text>`; } const x0 = 20 + (start - lo) * sc, x1 = 20 + (start + jumps - lo) * sc; s += `<path d="M${x0} 36 Q${(x0 + x1) / 2} 6 ${x1} 36" fill="none" stroke="#ef476f" stroke-width="3"/><circle cx="${x0}" cy="40" r="5" fill="#118ab2"/>`; return `<svg viewBox="0 0 320 72" class="nlsvg">${s}</svg>`; };
G2({
  id: 'numberline2', icon: '↔️', title: B('Number Line Jumps', '수직선 뛰어 세기'), sub: B('Add and subtract on a line', '수직선에서 더하고 빼기'), u: 'Number line',
  play() {
    const lv = lvl('numberline2'), add = rnd(2) === 0, a = lv === 1 ? 4 + rnd(10) : 8 + rnd(14), d = 2 + rnd(Math.min(9, a - 2)), ans = add ? a + d : a - d;
    quiz(this, { ask: add ? B(`Start at ${a} and jump ${d} to the right. Where do you land?`, `${a}에서 오른쪽으로 ${d}칸 뛰어요. 어디에 도착할까요?`) : B(`Start at ${a} and jump ${d} to the left. Where do you land?`, `${a}에서 왼쪽으로 ${d}칸 뛰어요. 어디에 도착할까요?`), show: jumpLine(a, add ? d : -d), opts: numO(ans, [ans + 1, ans - 1, add ? a - d : a + d].filter(v => v > 0), 0, 40), after: B(`${a} ${add ? '+' : '−'} ${d} = ${ans}`, `${a} ${add ? '+' : '−'} ${d} = ${ans}`) });
  }
});

// ---------- 16. Graphs with a scale ----------
G2({
  id: 'graph2', icon: '📊', title: B('Read the Graph', '그래프 읽기'), sub: B('Pictures and bars with a key', '범례가 있는 그림·막대 그래프'), u: 'Data',
  play() {
    const lv = lvl('graph2'), cats = shuffle([['🍎', 'apples', '사과'], ['🍌', 'bananas', '바나나'], ['🍇', 'grapes', '포도'], ['🍑', 'peaches', '복숭아'], ['🍓', 'strawberries', '딸기']]).slice(0, lv === 1 ? 3 : 4), each = lv === 1 ? 2 : pick([2, 5, 10]), counts = cats.map(() => (1 + rnd(7)) * each), pict = rnd(2) === 0, kind = pick(['most', 'more', 'total', 'howmany']);
    const show = pict ? `<div class="pict"><div class="pkey">${L(B('Key', '범례'))}: ${cats[0][0]} = ${each}</div>${cats.map((c, i) => `<div class="prow"><span class="pl">${c[0]}</span><span class="pc">${c[0].repeat(counts[i] / each)}</span></div>`).join('')}</div>` : `<div class="bargraph">${cats.map((c, i) => `<div class="brow"><span class="bl">${c[0]}</span><span class="bar" style="width:${counts[i] / (8 * each) * 78}%"></span><b>${counts[i]}</b></div>`).join('')}</div>`;
    const sorted = counts.map((v, i) => [v, i]).sort((x, y) => y[0] - x[0]);
    if (counts.some((v, i) => counts.indexOf(v) !== i)) { this.play(); return; }
    if (kind === 'most') quiz(this, { ask: B('Which has the MOST?', '가장 많은 것은?'), show, opts: cats.map((c, i) => ({ html: `<span class="emo">${c[0]}</span>`, ok: i === sorted[0][1] })), cls: 'shapes', after: B(`${sorted[0][0]}`, `${sorted[0][0]}`) });
    else if (kind === 'more') { const i = sorted[0][1], j = sorted[1][1], d = counts[i] - counts[j]; quiz(this, { ask: B(`How many more ${cats[i][1]} than ${cats[j][1]}?`, `${cats[i][2]}가 ${cats[j][2]}보다 몇 개 더 많을까요?`), show, opts: numO(d, [d + each, d - each, counts[i], counts[j]].filter(v => v > 0 && v !== d), 0, 80), after: B(`${counts[i]} − ${counts[j]} = ${d}`, `${counts[i]} − ${counts[j]} = ${d}`) }); }
    else if (kind === 'total') { const i = 0, j = 1, s = counts[i] + counts[j]; quiz(this, { ask: B(`How many ${cats[i][1]} and ${cats[j][1]} in all?`, `${cats[i][2]}와 ${cats[j][2]}는 모두 몇 개일까요?`), show, opts: numO(s, [s + each, s - each, counts[i], counts[j]].filter(v => v > 0 && v !== s), 0, 160), after: B(`${counts[i]} + ${counts[j]} = ${s}`, `${counts[i]} + ${counts[j]} = ${s}`) }); }
    else { const i = rnd(cats.length); quiz(this, { ask: B(`How many ${cats[i][1]}?`, `${cats[i][2]}는 몇 개일까요?`), show, opts: numO(counts[i], [counts[i] + each, counts[i] - each, counts[i] / each].filter(v => v > 0 && v !== counts[i]), 0, 90), after: B(`${counts[i]}`, `${counts[i]}`) }); }
  }
});

// ---------- 17. Time to five minutes ----------
const digitalT = (h, m) => `${h}:${String(m).padStart(2, '0')}`;
G2({
  id: 'clock2g', icon: '🕒', title: B('Telling Time', '시각 읽기'), sub: B('To the nearest five minutes', '5분 단위로'), u: 'Time',
  play() {
    const lv = lvl('clock2g'), h = 1 + rnd(12), m = 5 * rnd(12), kind = pick(lv === 1 ? ['read', 'read', 'match'] : ['read', 'match', 'elapsed', 'ampm', 'later']);
    const wrong = (hh, mm) => { const set = new Set([digitalT(hh, mm)]); let g = 0; while (set.size < 3 && g++ < 60) set.add(digitalT(((hh - 1 + pick([-1, 1, 2]) + 12) % 12) + 1, pick([mm, (mm + 5) % 60, (mm + 55) % 60, (60 - mm) % 60]))); return [...set]; };
    if (kind === 'read') { const right = digitalT(h, m), ts = shuffle(wrong(h, m)).slice(0, 3); if (!ts.includes(right)) ts[0] = right; quiz(this, { ask: B('What time is it?', '몇 시 몇 분일까요?'), show: clock2(h, m), opts: [...new Set(ts)].map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === right })), cls: 'shapes', after: B(`It is ${right}.`, `${right}이에요.`), vocab: right }); }
    else if (kind === 'match') { const right = digitalT(h, m), ws = wrong(h, m).filter(t => t !== right).slice(0, 2); quiz(this, { ask: B(`Which clock shows ${right}?`, `시각이 ${right}인 시계는 무엇일까요?`), opts: [right, ...ws].map(t => { const [hh, mm] = t.split(':').map(Number); return { html: clock2(hh, mm), ok: t === right }; }), cls: 'shapes', after: B(`${right}`, `${right}`) }); }
    else if (kind === 'elapsed') { const start = 1 + rnd(8), hrs = 1 + rnd(3), half = rnd(2) === 0, endH = start + hrs, endM = half ? 30 : 0, startM = half ? 30 : 0, right = digitalT(endH, endM); const cand = [right, digitalT(endH + 1, endM), digitalT(start + hrs - 1 > 0 ? start + hrs - 1 : 12, endM)].filter((v, i, ar) => ar.indexOf(v) === i); quiz(this, { ask: B(`It is ${digitalT(start, startM)}. What time will it be in ${hrs} hour${hrs > 1 ? 's' : ''}?`, `지금은 ${digitalT(start, startM)}이에요. ${hrs}시간 뒤는 몇 시일까요?`), show: clock2(start, startM), opts: cand.slice(0, 3).map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === right })), cls: 'shapes', after: B(`${digitalT(start, startM)} plus ${hrs} hour${hrs > 1 ? 's' : ''} is ${right}.`, `${digitalT(start, startM)}에서 ${hrs}시간 뒤는 ${right}이에요.`) }); }
    else if (kind === 'later') { const start = 1 + rnd(10), add = pick([30, 60]), right = add === 30 ? digitalT(start, 30) : digitalT(start + 1, 0); quiz(this, { ask: B(`It is ${start}:00. What time will it be in ${add === 30 ? 'half an hour' : 'one hour'}?`, `지금은 ${start}:00이에요. ${add === 30 ? '30분' : '1시간'} 뒤는 몇 시일까요?`), show: clock2(start, 0), opts: [right, digitalT(start, 0), digitalT(start + 2, add === 30 ? 30 : 0)].map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === right })), cls: 'shapes', after: B(right, right) }); }
    else { const acts = [[B('eat breakfast', '아침을 먹어요'), 7, 'AM'], [B('eat lunch', '점심을 먹어요'), 12, 'PM'], [B('eat dinner', '저녁을 먹어요'), 6, 'PM'], [B('go to bed', '잠자리에 들어요'), 8, 'PM'], [B('get on the school bus', '스쿨버스를 타요'), 7, 'AM'], [B('play outside after school', '방과 후에 밖에서 놀아요'), 4, 'PM']], it = pick(acts), t = `${it[1]}:${String(5 * rnd(12)).padStart(2, '0')}`; quiz(this, { ask: B(`You ${L(it[0])} at ${t}. Is that AM or PM?`, `${t}에 ${it[0].ko}. 오전(AM)일까요, 오후(PM)일까요?`), show: '', opts: ['AM', 'PM'].map(v => ({ html: `<span class="word">${v}${S.lang === 'ko' ? (v === 'AM' ? ' (오전)' : ' (오후)') : ''}</span>`, ok: v === it[2] })), cls: 'words', after: B(`${t} ${it[2]}`, `${it[2] === 'AM' ? '오전' : '오후'} ${t}`) }); }
  }
});

// ---------- 18. Money ----------
const billSvg = (v) => `<svg viewBox="0 0 120 56" class="billsvg"><rect x="2" y="2" width="116" height="52" rx="6" fill="#bfe8b0" stroke="#3b7a2a" stroke-width="3"/><circle cx="60" cy="28" r="17" fill="#e2f6d8" stroke="#3b7a2a" stroke-width="2"/><text x="60" y="35" font-size="22" font-weight="900" text-anchor="middle" fill="#2f6320">$${v}</text><text x="14" y="18" font-size="11" font-weight="800" fill="#2f6320">${v}</text><text x="106" y="48" font-size="11" font-weight="800" text-anchor="end" fill="#2f6320">${v}</text></svg>`;
G2({
  id: 'money2', icon: '💵', title: B('Coins and Dollars', '동전과 달러'), sub: B('Count, make and compare amounts', '금액을 세고 만들어요'), u: 'Money',
  play() {
    const lv = lvl('money2'), kind = pick(lv === 1 ? ['count', 'count', 'make', 'dollar'] : ['count', 'make', 'make', 'dollar', 'symbol', 'pay']);
    const mkset = (max) => { const l = []; const q = rnd(3), d = rnd(4), n = rnd(3), p = rnd(5); for (let i = 0; i < q; i++) l.push('quarter'); for (let i = 0; i < d; i++) l.push('dime'); for (let i = 0; i < n; i++) l.push('nickel'); for (let i = 0; i < p; i++) l.push('penny'); return l; };
    if (kind === 'count') { let l, g = 0; do { l = mkset(); g++; } while ((l.length < 2 || l.length > 7 || coinTotal(l) >= 100) && g < 100); const t = coinTotal(l); quiz(this, { ask: B('How many cents in all? Count the coins worth the most first.', '모두 몇 센트일까요? 값이 큰 동전부터 세어요.'), show: coinRow([...l].sort((a, b) => COINS[b].v - COINS[a].v)), opts: numO(t, [t + 5, t - 5, t + 10, t - 1, t + 1].filter(v => v > 0), 1, 110).map(o => ({ html: o.html.replace(/>(\d+)</, '>$1¢<'), ok: o.ok })), after: B(`${t}¢`, `${t}¢`) }); }
    else if (kind === 'make') { const amt = pick([30, 35, 40, 45, 55, 60, 65, 70, 75, 85, 90]); const right = amt >= 75 ? ['quarter', 'quarter', 'quarter', ...(amt - 75 === 10 ? ['dime'] : amt - 75 === 15 ? ['dime', 'nickel'] : [])] : null; let ans; if (amt === 30) ans = ['quarter', 'nickel']; else if (amt === 35) ans = ['quarter', 'dime']; else if (amt === 40) ans = ['quarter', 'dime', 'nickel']; else if (amt === 45) ans = ['quarter', 'dime', 'dime']; else if (amt === 55) ans = ['quarter', 'quarter', 'nickel']; else if (amt === 60) ans = ['quarter', 'quarter', 'dime']; else if (amt === 65) ans = ['quarter', 'quarter', 'dime', 'nickel']; else if (amt === 70) ans = ['quarter', 'quarter', 'dime', 'dime']; else if (amt === 75) ans = ['quarter', 'quarter', 'quarter']; else if (amt === 85) ans = ['quarter', 'quarter', 'quarter', 'dime']; else ans = ['quarter', 'quarter', 'quarter', 'dime', 'nickel'];
      const wrongs = [[...ans, 'penny'], ans.slice(0, -1).concat(['penny', 'penny'])].filter(w => coinTotal(w) !== amt); const opts = [ans, ...wrongs.slice(0, 2)]; if (opts.length < 3) opts.push([...ans, 'nickel']); quiz(this, { ask: B(`Which coins make ${amt}¢?`, `${amt}¢가 되는 동전은?`), show: '', opts: opts.map((l, i) => ({ html: coinRow([...l].sort((a, b) => COINS[b].v - COINS[a].v)), ok: coinTotal(l) === amt })), cls: 'groups', after: B(`${amt}¢`, `${amt}¢`) }); }
    else if (kind === 'dollar') { const qs = [[B('How many quarters make 1 dollar?', '쿼터 몇 개가 1달러일까요?'), 4], [B('How many dimes make 1 dollar?', '다임 몇 개가 1달러일까요?'), 10], [B('How many nickels make 1 dollar?', '니켈 몇 개가 1달러일까요?'), 20], [B('1 dollar is how many cents?', '1달러는 몇 센트일까요?'), 100]], q = pick(qs); quiz(this, { ask: q[0], show: billSvg(1), opts: numO(q[1], [4, 10, 20, 25, 50, 100].filter(v => v !== q[1]), 1, 100), after: B('1 dollar = 100¢', '1달러 = 100¢') }); }
    else if (kind === 'symbol') { const c = 5 * (2 + rnd(17)), right = `$0.${String(c).padStart(2, '0')}`, cand = [right, `$${c}.00`, `$0.${String(c + 5).padStart(2, '0')}`]; quiz(this, { ask: B(`${c}¢ can also be written as...`, `${c}¢는 이렇게도 쓸 수 있어요...`), show: '', opts: cand.map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === right })), cls: 'words', after: B(`${c}¢ = ${right}`, `${c}¢ = ${right}`) }); }
    else { const price = pick([25, 30, 35, 40, 50, 60, 65, 75]), bill = pick([1]), ch = 100 - price; quiz(this, { ask: B(`A snack costs ${price}¢ and you pay $1. How much change?`, `간식이 ${price}¢예요. 1달러로 내면 거스름돈은 얼마일까요?`), show: billSvg(1), opts: numO(ch, [price, ch + 10, ch - 10, ch + 5].filter(v => v > 0 && v !== ch), 5, 100).map(o => ({ html: o.html.replace(/>(\d+)</, '>$1¢<'), ok: o.ok })), after: B(`${price} + ${ch} = 100`, `${price} + ${ch} = 100`) }); }
  }
});

// ---------- 19. Shape attributes ----------
const SH2 = { triangle: [B('triangle', '삼각형'), 3], square: [B('square', '정사각형'), 4], rectangle: [B('rectangle', '직사각형'), 4], pentagon: [B('pentagon', '오각형'), 5], hexagon: [B('hexagon', '육각형'), 6] };
const rhombusSvg = '<polygon points="50,8 90,50 50,92 10,50"/>', trapSvg = '<polygon points="26,24 74,24 94,76 6,76"/>';
G2({
  id: 'shapes2', icon: '🔷', title: B('Polygons and Solids', '다각형과 입체도형'), sub: B('Sides, corners, faces', '변, 꼭짓점, 면'), u: 'Shapes',
  play() {
    const lv = lvl('shapes2'), kind = pick(lv === 1 ? ['sides', 'name', 'quad'] : ['sides', 'quad', 'notquad', 'solid', 'name']);
    if (kind === 'sides') { const k = pick(Object.keys(SH2)), n = SH2[k][1]; quiz(this, { ask: B('How many sides and corners does this polygon have?', '이 다각형은 변과 꼭짓점이 몇 개일까요?'), show: sh1(k, rnd(4) * 45, 1), opts: numO(n, [n - 1, n + 1, n + 2], 3, 8), after: B(`A ${SH2[k][0].en} has ${n} sides and ${n} corners.`, `${SH2[k][0].ko}은 변 ${n}개, 꼭짓점 ${n}개예요.`), vocab: SH2[k][0].en }); }
    else if (kind === 'name') { const sides = pick([3, 4, 5, 6]), names = { 3: B('triangle', '삼각형'), 4: B('quadrilateral', '사각형'), 5: B('pentagon', '오각형'), 6: B('hexagon', '육각형') }, ds = others([3, 4, 5, 6], sides, 2); quiz(this, { ask: B(`A polygon with ${sides} sides is called a...`, `변이 ${sides}개인 다각형의 이름은?`), show: '', opts: [sides, ...ds].map(k => ({ html: `<span class="word">${L(names[k])}</span>`, ok: k === sides })), cls: 'words', after: B(`${sides} sides: ${names[sides].en}`, `변 ${sides}개: ${names[sides].ko}`), vocab: names[sides].en }); }
    else if (kind === 'quad') { const quads = [['square', sh1('square', 0, 1)], ['rectangle', sh1('rectangle', 0, 1)], ['rhombus', `<svg viewBox="0 0 100 100" class="shape" fill="${pick(SHAPE_COLORS)}" stroke="#1d3557" stroke-width="3">${rhombusSvg}</svg>`], ['trapezoid', `<svg viewBox="0 0 100 100" class="shape" fill="${pick(SHAPE_COLORS)}" stroke="#1d3557" stroke-width="3">${trapSvg}</svg>`]], non = [['triangle', sh1('triangle', 0, 1)], ['pentagon', sh1('pentagon', 0, 1)], ['hexagon', sh1('hexagon', 0, 1)]], q = pick(quads), ds = shuffle(non).slice(0, 2); quiz(this, { ask: B('Which shape is a quadrilateral (4 sides)?', '사각형(변 4개)은 어느 것일까요?'), opts: [q, ...ds].map((x, i) => ({ html: x[1], ok: i === 0 })), cls: 'shapes', after: B('A quadrilateral has 4 sides.', '사각형은 변이 4개예요.'), vocab: 'quadrilateral' }); }
    else if (kind === 'notquad') { const quads = [sh1('square', 0, 1), sh1('rectangle', 0, 1), `<svg viewBox="0 0 100 100" class="shape" fill="${pick(SHAPE_COLORS)}" stroke="#1d3557" stroke-width="3">${rhombusSvg}</svg>`, `<svg viewBox="0 0 100 100" class="shape" fill="${pick(SHAPE_COLORS)}" stroke="#1d3557" stroke-width="3">${trapSvg}</svg>`], non = pick([sh1('triangle', 0, 1), sh1('pentagon', 0, 1), sh1('hexagon', 0, 1)]); quiz(this, { ask: B('Which shape is NOT a quadrilateral?', '사각형이 아닌 것은?'), opts: [non, ...shuffle(quads).slice(0, 2)].map((x, i) => ({ html: x, ok: i === 0 })), cls: 'shapes', after: B('A quadrilateral has exactly 4 sides.', '사각형은 변이 꼭 4개예요.') }); }
    else { const info = { 'rectangular prism': [B('rectangular prism', '직육면체'), 6, '📦'], cube: [B('cube', '정육면체'), 6, '🎲'], cone: [B('cone', '원뿔'), 1, '🍦'], cylinder: [B('cylinder', '원기둥'), 2, '🥫'] }, k = pick(Object.keys(info)), v = info[k]; quiz(this, { ask: B(`How many flat faces does a ${v[0].en} have?`, `${v[0].ko}의 평평한 면은 몇 개일까요?`), show: `<span class="emo">${v[2]}</span>`, opts: numO(v[1], [0, 1, 2, 4, 6, 8].filter(x => x !== v[1]), 0, 8), after: B(`A ${v[0].en} has ${v[1]} flat ${v[1] === 1 ? 'face' : 'faces'}.`, `${v[0].ko}에는 평평한 면이 ${v[1]}개 있어요.`), vocab: v[0].en }); }
  }
});

// ---------- 20. Lines of symmetry ----------
const SYM = [
  ['heart', true, '<path d="M50 88 L14 48 C2 30 22 8 50 30 C78 8 98 30 86 48 Z"/>', 'v'],
  ['butterfly', true, '<path d="M50 20 L50 80"/><path d="M50 50 C20 10 5 40 30 55 C10 70 30 90 50 60 C70 90 90 70 70 55 C95 40 80 10 50 50 Z"/>', 'v'],
  ['letter A', true, '<text x="50" y="76" font-size="78" font-weight="900" text-anchor="middle">A</text>', 'v'],
  ['letter M', true, '<text x="50" y="76" font-size="78" font-weight="900" text-anchor="middle">M</text>', 'v'],
  ['letter H', true, '<text x="50" y="76" font-size="78" font-weight="900" text-anchor="middle">H</text>', 'v'],
  ['letter F', false, '<text x="50" y="76" font-size="78" font-weight="900" text-anchor="middle">F</text>', 'v'],
  ['letter R', false, '<text x="50" y="76" font-size="78" font-weight="900" text-anchor="middle">R</text>', 'v'],
  ['letter G', false, '<text x="50" y="76" font-size="78" font-weight="900" text-anchor="middle">G</text>', 'v'],
  ['star', true, '<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38"/>', 'v'],
  ['circle', true, '<circle cx="50" cy="50" r="40"/>', 'v'],
  ['scalene triangle', false, '<polygon points="10,88 34,14 92,88"/>', 'v'],
  ['leaf', true, '<path d="M50 8 C90 30 90 70 50 92 C10 70 10 30 50 8 Z"/>', 'v']
];
G2({
  id: 'symmetry', icon: '🦋', title: B('Lines of Symmetry', '대칭선'), sub: B('Would it fold into matching halves?', '반으로 접으면 딱 맞을까요?'), u: 'Symmetry',
  play() {
    const lv = lvl('symmetry'), kind = pick(lv === 1 ? ['has', 'has'] : ['has', 'line', 'which']), t = pick(SYM);
    const draw = (item, line) => `<svg viewBox="0 0 100 100" class="shape symsvg" fill="${pick(SHAPE_COLORS)}" stroke="#1d3557" stroke-width="3">${item[2]}${line ? '<line x1="50" y1="4" x2="50" y2="96" stroke="#ef476f" stroke-width="3" stroke-dasharray="5 4"/>' : ''}</svg>`;
    if (kind === 'has') quiz(this, { ask: B('Can you fold this shape into two matching halves? (Does it have a line of symmetry?)', '이 모양을 반으로 접으면 두 쪽이 딱 맞을까요? (대칭선이 있을까요?)'), askSay: B('Does this shape have a line of symmetry?', '이 모양에는 대칭선이 있을까요?'), show: draw(t, false), opts: [true, false].map(v => ({ html: `<span class="word">${v ? (S.lang === 'ko' ? '네, 있어요' : 'Yes') : (S.lang === 'ko' ? '아니요, 없어요' : 'No')}</span>`, ok: v === t[1] })), cls: 'words', after: t[1] ? B('The two sides match when it is folded on the line.', '선을 따라 접으면 두 쪽이 맞아요.') : B('The two sides do not match, so there is no line of symmetry.', '두 쪽이 맞지 않아서 대칭선이 없어요.') });
    else if (kind === 'line') { const t2 = pick(SYM); quiz(this, { ask: B('Fold along the dashed line. Would the two sides match?', '점선을 따라 접으면 양쪽이 딱 맞을까요?'), show: draw(t2, true), opts: [{ html: `<span class="word">${S.lang === 'ko' ? '네, 맞아요' : 'Yes, they match'}</span>`, ok: t2[1] }, { html: `<span class="word">${S.lang === 'ko' ? '아니요' : 'No'}</span>`, ok: !t2[1] }], cls: 'words', after: B('A line of symmetry makes two matching halves.', '대칭선은 똑같은 두 쪽으로 나눠 줘요.') }); }
    else { const yes = pick(SYM.filter(x => x[1])), no = shuffle(SYM.filter(x => !x[1])).slice(0, 2); quiz(this, { ask: B('Which one has a line of symmetry?', '대칭선이 있는 것은?'), opts: [yes, ...no].map((x, i) => ({ html: draw(x, false), ok: i === 0 })), cls: 'shapes', after: B('Fold it in half: the sides match.', '반으로 접으면 양쪽이 맞아요.') }); }
  }
});

// ---------- 21. Halves, thirds and fourths ----------
const partSvg2 = (shape, n, equal = true, v = 0) => {
  const st = 'stroke="#1d3557" stroke-width="3" fill="#ffd166"';
  if (shape === 'circle') { let lines = ''; if (n === 2) lines = equal ? '<line x1="50" y1="8" x2="50" y2="92"/>' : '<line x1="28" y1="14" x2="28" y2="86"/>'; else if (n === 3) lines = equal ? '<line x1="50" y1="50" x2="50" y2="8"/><line x1="50" y1="50" x2="86.4" y2="71"/><line x1="50" y1="50" x2="13.6" y2="71"/>' : '<line x1="50" y1="50" x2="50" y2="8"/><line x1="50" y1="50" x2="92" y2="50"/><line x1="50" y1="50" x2="30" y2="88"/>'; else lines = equal ? '<line x1="50" y1="8" x2="50" y2="92"/><line x1="8" y1="50" x2="92" y2="50"/>' : '<line x1="50" y1="8" x2="50" y2="92"/><line x1="8" y1="30" x2="92" y2="30"/>'; return `<svg viewBox="0 0 100 100" class="shape"><circle cx="50" cy="50" r="42" ${st}/><g stroke="#1d3557" stroke-width="3">${lines}</g></svg>`; }
  let lines = ''; if (n === 2) lines = equal ? (v === 0 ? '<line x1="50" y1="14" x2="50" y2="86"/>' : v === 1 ? '<line x1="10" y1="50" x2="90" y2="50"/>' : '<line x1="10" y1="14" x2="90" y2="86"/>') : '<line x1="30" y1="14" x2="30" y2="86"/>'; else if (n === 3) lines = equal ? (v === 1 ? '<line x1="10" y1="38" x2="90" y2="38"/><line x1="10" y1="62" x2="90" y2="62"/>' : '<line x1="37" y1="14" x2="37" y2="86"/><line x1="63" y1="14" x2="63" y2="86"/>') : '<line x1="25" y1="14" x2="25" y2="86"/><line x1="70" y1="14" x2="70" y2="86"/>'; else lines = equal ? (v === 0 ? '<line x1="50" y1="14" x2="50" y2="86"/><line x1="10" y1="50" x2="90" y2="50"/>' : '<line x1="30" y1="14" x2="30" y2="86"/><line x1="50" y1="14" x2="50" y2="86"/><line x1="70" y1="14" x2="70" y2="86"/>') : '<line x1="22" y1="14" x2="22" y2="86"/><line x1="40" y1="14" x2="40" y2="86"/><line x1="72" y1="14" x2="72" y2="86"/>';
  return `<svg viewBox="0 0 100 100" class="shape"><rect x="10" y="14" width="80" height="72" rx="3" ${st}/><g stroke="#1d3557" stroke-width="3">${lines}</g></svg>`;
};
G2({
  id: 'fractions2', icon: '🍕', title: B('Halves, Thirds, Fourths', '반, 3분의 1, 4분의 1'), sub: B('Equal shares of a whole', '똑같이 나눈 조각'), u: 'Equal shares',
  play() {
    const lv = lvl('fractions2'), shape = pick(['circle', 'rect']), n = pick([2, 3, 4]), nm = { 2: B('halves', '반(2등분)'), 3: B('thirds', '3분의 1(3등분)'), 4: B('fourths (quarters)', '4분의 1(4등분)') }, kind = pick(lv === 1 ? ['which', 'name', 'count'] : ['which', 'name', 'differ', 'whole', 'one']);
    if (kind === 'which') { const opts = [{ html: partSvg2(shape, n, true, rnd(2) * (shape === 'rect' && n !== 4 ? 1 : 0)), ok: true }, { html: partSvg2(shape, n, false), ok: false }, { html: partSvg2(shape, n === 4 ? 3 : 4, true), ok: false }]; quiz(this, { ask: B(`Which shows ${nm[n].en.toUpperCase()}? All shares must be equal.`, `${nm[n].ko}으로 나눈 것은? 모든 조각이 똑같아야 해요.`), askSay: B(`Which shows ${nm[n].en}? All shares must be equal.`, `${nm[n].ko}으로 나눈 것은? 모든 조각이 똑같아야 해요.`), opts, cls: 'shapes', after: B('Equal shares are the same size.', '똑같은 조각은 크기가 같아요.') }); }
    else if (kind === 'name') quiz(this, { ask: B('What are these equal shares called?', '이 똑같은 조각들을 뭐라고 부를까요?'), show: partSvg2(shape, n, true), opts: [2, 3, 4].map(k => ({ html: `<span class="word">${L(nm[k])}</span>`, ok: k === n })), cls: 'words', after: B(`${n} equal shares: ${nm[n].en}.`, `같은 크기로 나눈 ${n}조각: ${nm[n].ko}`), vocab: nm[n].en });
    else if (kind === 'count') quiz(this, { ask: B('How many equal shares?', '똑같은 조각은 몇 개일까요?'), show: partSvg2(shape, n, true), opts: numO(n, [2, 3, 4].filter(x => x !== n), 1, 6), after: B(`${n} equal shares.`, `같은 크기의 조각이 ${n}개예요.`) });
    else if (kind === 'differ') quiz(this, { ask: B('Two same-size rectangles are cut in half. Are all the halves the same size?', '같은 크기 직사각형 두 개를 반으로 잘랐어요. 반 조각 크기가 모두 같을까요?'), show: `<div class="story">${partSvg2('rect', 2, true, 0)}<span class="op">&amp;</span>${partSvg2('rect', 2, true, 1)}</div>`, opts: [{ html: `<span class="word">${S.lang === 'ko' ? '네' : 'Yes'}</span>`, ok: true }, { html: `<span class="word">${S.lang === 'ko' ? '아니요' : 'No'}</span>`, ok: false }], cls: 'words', after: B('Equal shares of identical wholes can look different but still be the same size.', '똑같은 전체의 똑같은 조각은 모양이 달라도 크기는 같아요.') });
    else if (kind === 'whole') quiz(this, { ask: B(`How many ${nm[n].en} make 1 whole?`, `${nm[n].ko} 조각이 몇 개 모여야 전체가 될까요?`), show: partSvg2(shape, n, true), opts: numO(n, [2, 3, 4].filter(x => x !== n), 1, 6), after: B(`${n} ${nm[n].en} make 1 whole.`, `${nm[n].ko} ${n}개가 전체 1개예요.`) });
    else quiz(this, { ask: B(`Which is bigger: one half or one fourth of the same pizza?`, `같은 피자에서 반 조각과 4분의 1 조각 중 어느 것이 더 클까요?`), show: `<div class="story">${partSvg2('circle', 2, true)}<span class="op">vs</span>${partSvg2('circle', 4, true)}</div>`, opts: [{ html: `<span class="word">${L(B('one half', '반 조각'))}</span>`, ok: true }, { html: `<span class="word">${L(B('one fourth', '4분의 1 조각'))}</span>`, ok: false }, { html: `<span class="word">${L(B('the same', '같아요'))}</span>`, ok: false }], cls: 'words', after: B('Fewer equal shares means bigger shares.', '조각 수가 적을수록 한 조각이 커요.') });
  }
});
(() => {
'use strict';
const game=GAMES.find(g=>g.id==='ruler');
game.buildUnits50=function(){
 const lv=lvl(this.id),n=(lv===1?2:4)+rnd(lv===1?4:5),start=lv===1?0:rnd(3),unit=L(B('1-inch model','1인치 모형'));
 const draw=count=>`<svg viewBox="0 0 300 90" style="width:100%;height:min(11dvh,70px)" role="img" aria-label="${count} ${unit}">${Array.from({length:n},(_,i)=>`<rect x="${15+i*270/n}" y="8" width="${270/n}" height="24" fill="${i<count?'#bca4ec':'#fff'}" stroke="#493574"/><text x="${15+(i+.5)*270/n}" y="25" text-anchor="middle" font-size="10">${i<count?1:''}</text>`).join('')}${Array.from({length:n+1},(_,i)=>`<path d="M${15+i*270/n} 43 v18" stroke="#684c14"/><text x="${15+i*270/n}" y="78" font-size="12" text-anchor="middle">${start+i}</text>`).join('')}<path d="M15 43 H285" stroke="#684c14"/></svg>`;
 quiz(this,{ask:B(`Join ${n} 1-inch models. Compare: how long?`,`1인치 모형 ${n}개를 이어요. 자와 비교하면 길이는?`),show:`<div style="font-size:14px"><div id="g50units">${draw(0)}</div><button id="g50add" style="min-height:44px">＋ ${unit}</button> <button id="g50undo" style="min-height:44px">↶ ${L(B('Undo','되돌리기'))}</button><div>${L(B('Model picture, not actual size.','실물 크기가 아닌 모형 그림이에요.'))}</div><div id="g50count" aria-live="polite">0 / ${n}</div></div>`,opts:[n,n-1,n+1].map((v,i)=>({html:`<span class="word">${v} ${L(B('inches','인치'))}</span>`,ok:i===0})),cls:'words',after:B(`${start+n} − ${start} = ${n} inches. Equal pieces meet with no gaps or overlaps.`,`${start+n} − ${start} = ${n}인치예요. 같은 조각을 틈이나 겹침 없이 이어요.`),onRender(){let count=0;const buttons=$$('.opt');buttons.forEach(b=>{b.disabled=true;b.addEventListener('click',()=>{['#g50add','#g50undo'].forEach(sel=>$(sel).disabled=true);});});const update=()=>{$('#g50units').innerHTML=draw(count);$('#g50count').textContent=`${count} / ${n}`;$('#g50add').disabled=count===n;$('#g50undo').disabled=count===0;buttons.forEach(b=>b.disabled=count!==n);};$('#g50add').onclick=()=>{if(count<n)count++;update();};$('#g50undo').onclick=()=>{if(count)count--;update();};update();}});
};
})();
