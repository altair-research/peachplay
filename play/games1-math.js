'use strict';
// Grade 1 math, part 1: numbers to 120, place value, comparing, addition and subtraction.
// Built from Georgia's K-12 Mathematics Standards (2021), grade 1: NR.1 (counting, place value, comparing), NR.2 (within 20), NR.5 (within 100).
// Notes from the standards: fluency is never timed; unknown numbers appear in every position; no "key word" tricks; words/models before symbols.
const AREA1 = (u) => B(`Grade 1 Math · ${u}`, `1학년 수학 · ${U_KO[u] || u}`);
const G1 = (g) => registerGame(Object.assign({ grade: '1', subject: 'math' }, g, { area: AREA1(g.u) }));
const ONES_W = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS_W = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const numWord = (n) => n < 20 ? ONES_W[n] : n < 100 ? TENS_W[Math.floor(n / 10)] + (n % 10 ? '-' + ONES_W[n % 10] : '') : n < 1000 ? ONES_W[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + numWord(n % 100) : '') : numWord(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + numWord(n % 1000) : '');
const swapDigits = (m) => (m % 10) * 10 + Math.floor(m / 10);
// number options: the right answer plus likely mistakes (bad), topped up with neighbours
const numO = (ans, bad = [], lo = 0, hi = 999, n = 3) => {
  const s = new Set([ans]); for (const v of shuffle(bad)) if (s.size < n && v !== ans && v >= lo && v <= hi && Number.isFinite(v)) s.add(v);
  let g = 0; while (s.size < n && g++ < 80) { const v = ans + pick([-10, -2, -1, 1, 2, 10]); if (v >= lo && v <= hi) s.add(v); }
  g = 0; while (s.size < n && g++ < 80) { const v = lo + rnd(hi - lo + 1); s.add(v); }
  return [...s].map(v => ({ html: `<span class="num">${v}</span>`, ok: v === ans }));
};
const eqO = (list, right) => list.map(t => ({ html: `<span class="num eq">${t}</span>`, ok: t === right }));
const trainHtml = (cards, gapAt = -1) => `<div class="train">${cards.map((c, i) => `<div class="car ${i === gapAt ? 'gap' : ''}"><div class="n">${i === gapAt ? '?' : c}</div></div>`).join('')}</div>`;
const b10 = (n) => `<div class="b10" aria-label="${n}"><div class="rods">${'<i class="rod"></i>'.repeat(Math.floor(n / 10))}</div><div class="cubes">${'<i class="cube"></i>'.repeat(n % 10)}</div></div>`;
const hChart = (r0, rows, gapNum) => { let cells = ''; for (let i = r0 * 10 + 1; i <= (r0 + rows) * 10; i++) cells += `<div class="hc ${i === gapNum ? 'gap' : ''}">${i === gapNum ? '?' : i}</div>`; return `<div class="hchart">${cells}</div>`; };
const frame10 = (n, e) => `<div class="frame mini">${Array.from({ length: 10 }, (_, i) => i < n ? `<div class="cell on">${e}</div>` : '<div class="cell empty"></div>').join('')}</div>`;
const bigEq = (t) => `<div class="bigword eqline">${t}</div>`;

// ---------- 1. Count to 120 ----------
G1({
  id: 'count120', icon: '💯', title: B('Count to 120', '120까지 세기'), sub: B('Number chart and counting on', '숫자판과 이어 세기'), u: 'Counting to 120',
  play() {
    const lv = lvl('count120'), hi = lv === 1 ? 100 : 120, kind = pick(lv === 1 ? ['chart', 'next', 'next', 'tens'] : ['chart', 'next', 'back', 'tens', 'tens', 'around']);
    const O = (ans, bad) => numO(ans, bad, 1, hi + 10);
    if (kind === 'chart') {
      const rows = lv === 1 ? 3 : 4, r0 = rnd(Math.floor(hi / 10) - rows + 1), t = r0 * 10 + 1 + rnd(rows * 10);
      quiz(this, { ask: B('Which number is missing on the chart?', '수 배열표에서 빠진 수는?'), show: hChart(r0, rows, t), opts: O(t, [t - 1, t + 1, t - 10, t + 10]), after: B(`${t}`, `${t}`), onCorrect() { const g = $('.hc.gap'); if (g) { g.classList.remove('gap'); g.textContent = t; } } });
    } else if (kind === 'next') {
      const a = 1 + rnd(hi - 4);
      quiz(this, { ask: B('Count on. What comes next?', '이어서 세어요. 다음 수는?'), show: trainHtml([a, a + 1, a + 2, '?'], 3), opts: O(a + 3, [a + 2, a + 4, a + 13]), after: B(`${a + 3}`, `${a + 3}`) });
    } else if (kind === 'back') {
      const a = 6 + rnd(hi - 5);
      quiz(this, { ask: B('Count backward. What comes next?', '거꾸로 세어요. 다음 수는?'), show: trainHtml([a, a - 1, a - 2, '?'], 3), opts: O(a - 3, [a - 2, a - 4, a - 13]), after: B(`${a - 3}`, `${a - 3}`) });
    } else if (kind === 'tens') {
      const up = lv === 1 || rnd(2) === 0, a = up ? 1 + rnd(hi - 30) : 31 + rnd(hi - 30), seq = up ? [a, a + 10, a + 20, '?'] : [a, a - 10, a - 20, '?'], ans = up ? a + 30 : a - 30;
      quiz(this, { ask: up ? B('Count by tens. What comes next?', '10씩 뛰어 세어요. 다음 수는?') : B('Count back by tens. What comes next?', '10씩 거꾸로 뛰어 세어요. 다음 수는?'), show: trainHtml(seq, 3), opts: O(ans, [ans + (up ? -9 : 9), ans + 1, ans - 1]), after: B(`${ans}`, `${ans}`) });
    } else {
      const n = 99 + rnd(20), after = rnd(2) === 0, ans = after ? n + 1 : n - 1;
      quiz(this, { ask: after ? B(`What number comes just after ${n}?`, `${n} 바로 다음 수는?`) : B(`What number comes just before ${n}?`, `${n} 바로 앞의 수는?`), show: '', opts: O(ans, [ans + 1, ans - 1, ans + 10]), after: B(`${ans}`, `${ans}`) });
    }
  }
});

// ---------- 2. Read and write numbers ----------
G1({
  id: 'numeral120', icon: '🔤', title: B('Read and Write Numbers', '수 읽고 쓰기'), sub: B('Words and numerals', '낱말과 숫자'), u: 'Numbers to 120',
  play() {
    const lv = lvl('numeral120'), n = lv === 2 && rnd(3) === 0 ? 100 + rnd(21) : 11 + rnd(89), kind = pick(['w2n', 'n2w', 'tens']);
    const teenFlip = (m) => (m >= 13 && m <= 19 ? (m % 10) * 10 : m >= 30 && m % 10 === 0 && m < 100 ? m / 10 + 10 : null);
    if (kind === 'w2n') {
      const bad = [n < 100 && n % 10 ? swapDigits(n) : null, teenFlip(n), n + 10, n - 1, n + 1].filter(v => v !== null);
      quiz(this, { ask: B('Which number is this?', '이 수는 어느 것일까요?'), show: `<div class="bigword">${numWord(n)}</div>`, opts: numO(n, bad, 1, 130), after: B(`${numWord(n)} is ${n}.`, `${numWord(n)} = ${n}`), vocab: numWord(n) });
    } else if (kind === 'n2w') {
      const cand = [n, n < 100 && n % 10 ? swapDigits(n) : null, teenFlip(n), n + 10, n - 1].filter(v => v !== null && v > 0), ws = [...new Set(cand.map(numWord))];
      const right = numWord(n), opts = [right, ...shuffle(ws.filter(w => w !== right)).slice(0, 2)];
      let g = 0; while (opts.length < 3 && g++ < 20) { const w = numWord(n + pick([-2, 2, 3, -3, 10])); if (!opts.includes(w)) opts.push(w); }
      quiz(this, { ask: B('Which word matches the number?', '이 숫자에 맞는 낱말은?'), show: `<div class="bigword">${n}</div>`, opts: opts.map(w => ({ html: `<span class="word">${w}</span>`, ok: w === right })), cls: 'words', after: B(`${n} is ${numWord(n)}.`, `${n} = ${numWord(n)}`), vocab: numWord(n) });
    } else {
      const t = Math.floor(n / 10), o = n % 10;
      if (n >= 100) { quiz(this, { ask: B('Which number is one hundred ten?', '백십(one hundred ten)은 어느 수일까요?'), show: '', opts: numO(110, [101, 11, 100], 1, 130), after: B('110', '110') }); return; }
      quiz(this, { ask: B(`${t} tens and ${o} ones. Which number?`, `10개씩 묶음 ${t}개와 낱개 ${o}개. 어느 수일까요?`), show: '', opts: numO(n, [swapDigits(n), n + 10, n - 10].filter(v => v > 0), 1, 99), after: B(`${t} tens and ${o} ones is ${n}.`, `10개씩 묶음 ${t}개와 낱개 ${o}개는 ${n}.`) });
    }
  }
});

// ---------- 3. Tens and ones ----------
G1({
  id: 'tensones', icon: '🧱', title: B('Tens and Ones', '십과 일'), sub: B('Rods and cubes', '막대와 블록'), u: 'Place value',
  play() {
    const lv = lvl('tensones'), hi = lv === 1 ? 39 : 99, n = 11 + rnd(hi - 10), t = Math.floor(n / 10), o = n % 10, kind = pick(lv === 1 ? ['blocks', 'blocks', 'howmany', 'teen'] : ['blocks', 'howmany', 'split', 'tenwords', 'split', 'ones']);
    if (kind === 'blocks') {
      quiz(this, { ask: B('Each rod is 1 ten. Each cube is 1 one. What number is it?', '막대 1개는 십(10), 낱개 블록 1개는 일(1)이에요. 어떤 수일까요?'), show: b10(n), opts: numO(n, [swapDigits(n), n + 10, n - 10, t + o].filter(v => v > 0), 1, 99), after: B(`${t} tens and ${o} ones is ${n}.`, `10개씩 묶음 ${t}개와 낱개 ${o}개는 ${n}.`) });
    } else if (kind === 'howmany') {
      const ask = rnd(2) === 0;
      quiz(this, { ask: ask ? B(`How many TENS are in ${n}?`, `${n}에는 10개씩 묶음이 몇 개 있을까요?`) : B(`How many ONES are in ${n}?`, `${n}에는 낱개가 몇 개 있을까요?`), askSay: ask ? B(`How many tens are in ${n}?`, `${n}에는 10개씩 묶음이 몇 개 있을까요?`) : B(`How many ones are in ${n}?`, `${n}에는 낱개가 몇 개 있을까요?`), show: b10(n), opts: numO(ask ? t : o, [t, o, t + 1, o + 1], 0, 9), after: B(`${n} is ${t} tens and ${o} ones.`, `${n}: 10개씩 묶음 ${t}개, 낱개 ${o}개.`) });
    } else if (kind === 'teen') {
      const m = 11 + rnd(9);
      quiz(this, { ask: B(`Ten and ${m - 10} more. What number is it?`, `십 하나와 낱개 ${m - 10}개. 어떤 수일까요?`), show: `<div class="story">${frame10(10, '🍑')}<span class="op">+</span><div class="grp sm">${'<span>🍑</span>'.repeat(m - 10)}</div></div>`, opts: numO(m, [m - 10, m + 10, m - 1, m + 1], 11, 20), after: B(`Ten and ${m - 10} make ${m}.`, `10 + ${m - 10} = ${m}.`) });
    } else if (kind === 'tenwords') {
      const k = 2 + rnd(8);
      quiz(this, { ask: B(`${k} tens is how many?`, `10이 ${k}개면 모두 얼마일까요?`), show: `<div class="b10"><div class="rods">${'<i class="rod"></i>'.repeat(k)}</div></div>`, opts: numO(k * 10, [k, k * 10 + 1, k * 100], 1, 900), after: B(`${k} tens is ${k * 10}.`, `10이 ${k}개이면 ${k * 10}.`) });
    } else if (kind === 'ones') {
      const k = 10 + 10 * rnd(5);
      quiz(this, { ask: B(`${k} ones is the same as how many tens?`, `낱개 ${k}개는 10개씩 묶음 몇 개와 같을까요?`), show: '', opts: numO(k / 10, [k, k / 10 + 1, k / 10 - 1], 1, 20), after: B(`${k} ones = ${k / 10} ${k / 10 === 1 ? 'ten' : 'tens'}.`, `낱개 ${k}개 = 10개씩 묶음 ${k / 10}개.`) });
    } else {
      const right = `${t} tens ${o} ones`, mk = (a, b) => `${a} tens ${b} ones`, ds = [...new Set([mk(o, t), mk(t + 1, o), mk(t, o + 1), mk(t - 1, o)])].filter(x => x !== right && !/-/.test(x)).slice(0, 2);
      quiz(this, { ask: B(`${n} is the same as...`, `${n}, 이 수와 같은 것은?`), show: '', opts: [right, ...ds].map(v => ({ html: `<span class="word">${v}</span>`, label: S.lang === 'ko' ? B('', '').ko : null, ok: v === right })), cls: 'words', after: B(`${n} is ${t} tens and ${o} ones.`, `${n}: 10개씩 묶음 ${t}개, 낱개 ${o}개.`) });
    }
  }
});

// ---------- 4. Greater, less, equal ----------
G1({
  id: 'compare100', icon: '⚖️', title: B('Greater, Less, Equal', '크다, 작다, 같다'), sub: B('Compare numbers to 100', '100까지 수 비교'), u: 'Comparing numbers',
  play() {
    const lv = lvl('compare100'), a = 10 + rnd(90);
    let b = Math.max(10, Math.min(99, a + pick([-30, -20, -11, -9, -5, -2, 2, 5, 9, 11, 20, 30]))); if (b === a) b = a === 99 ? 98 : a + 1;
    if (lv === 1) {
      const more = rnd(2) === 0, big = Math.max(a, b), small = Math.min(a, b), ans = more ? big : small;
      quiz(this, { ask: more ? B('Which number is GREATER?', '어느 수가 더 클까요?') : B('Which number is LESS?', '어느 수가 더 작을까요?'), askSay: more ? B('Which number is greater?', '어느 수가 더 클까요?') : B('Which number is less?', '어느 수가 더 작을까요?'), show: `<div class="cmpwrap">${b10(a)}<span class="vs">?</span>${b10(b)}</div>`, opts: [a, b].map(v => ({ html: `<span class="num">${v}</span>`, ok: v === ans })), cls: 'groups', after: B(`${big} is greater than ${small}.`, `더 큰 수는 ${big}. (${big} > ${small})`) });
      return;
    }
    const kind = pick(['symbol', 'symbol', 'order', 'less']);
    if (kind === 'symbol') {
      const eq = rnd(5) === 0, x = a, y = eq ? a : b, right = eq ? '=' : x > y ? '>' : '<';
      quiz(this, { ask: B('Which symbol makes it true?', '어느 기호를 넣어야 맞을까요?'), show: bigEq(`${x} <span class="qbox">?</span> ${y}`), opts: ['>', '<', '='].map(s => ({ html: `<span class="num">${s}</span>`, ok: s === right })), cls: 'shapes', after: B(`${x} ${right} ${y}`, `${x} ${right} ${y}`) });
    } else if (kind === 'order') {
      const c = Math.max(10, Math.min(99, b + pick([-13, -7, 7, 13]))); const nums = [...new Set([a, b, c])]; if (nums.length < 3) { this.play(); return; }
      const up = [...nums].sort((p, q) => p - q), right = up.join(', '), cand = [right, [...up].reverse().join(', '), [up[1], up[0], up[2]].join(', ')];
      quiz(this, { ask: B(`Which list goes from least to greatest?`, '가장 작은 수부터 큰 수 순서로 놓은 것은?'), show: `<div class="bigword">${shuffle(nums).join('  ')}</div>`, opts: [...new Set(cand)].map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === right })), cls: 'words', after: B(`${up.join(' < ')}`, `${up.join(' < ')}`) });
    } else {
      const pivot = a, below = pivot - 5 - rnd(Math.max(1, pivot - 10)), above = pivot + 3 + rnd(Math.max(1, 99 - pivot)), ds = [above, Math.min(99, above + 6)];
      const right = Math.max(1, below); const set = [...new Set([right, ...ds.filter(v => v > pivot)])]; while (set.length < 3) set.push(Math.min(99, pivot + 1 + set.length * 3));
      quiz(this, { ask: B(`Which number is less than ${pivot}?`, `${pivot}보다 작은 수는?`), show: '', opts: [...new Set(set)].slice(0, 3).map(v => ({ html: `<span class="num">${v}</span>`, ok: v < pivot })), after: B(`${right} < ${pivot}`, `${right} < ${pivot}`) });
    }
  }
});

// ---------- 5. Make a ten (strategies within 20) ----------
G1({
  id: 'maketen20', icon: '🔟', title: B('Make a Ten', '10 만들기'), sub: B('Add within 20', '20 이내 더하기'), u: 'Addition strategies',
  play() {
    const lv = lvl('maketen20'), e = pick(['🍑', '🍎', '⭐', '🐞']), kind = pick(lv === 1 ? ['move', 'split', 'sum'] : ['move', 'split', 'double', 'three', 'sum']);
    const a = 6 + rnd(4), bmin = 11 - a, b = bmin + rnd(10 - bmin), s = a + b;                       // a + b is always 11..18 (a ten and some more)
    if (kind === 'move') {
      quiz(this, { ask: B(`${a} + ${b}: how many do you move to fill the ten frame?`, `${a} + ${b}: 10칸을 가득 채우려면 몇 개를 옮길까요?`), show: `<div class="story">${frame10(a, e)}<span class="op">+</span>${frame10(Math.min(10, b), e)}</div>`, opts: numO(10 - a, [b, a, 10 - a + 1, 10 - a - 1], 0, 10), after: B(`${a} + ${10 - a} = 10, then 10 + ${b - (10 - a)} = ${s}.`, `${a} + ${10 - a} = 10, 그리고 10 + ${b - (10 - a)} = ${s}.`) });
    } else if (kind === 'split') {
      quiz(this, { ask: B('Fill in the blank.', '빈칸을 채워요.'), show: bigEq(`${a} + ${b} = 10 + <span class="qbox">?</span>`), opts: numO(s - 10, [b, a, s, s - 9], 0, 10), after: B(`${a} + ${b} = ${s}, and ${s} = 10 + ${s - 10}.`, `${a} + ${b} = ${s}, ${s} = 10 + ${s - 10}.`) });
    } else if (kind === 'double') {
      const d = 4 + rnd(5), near = rnd(2) === 0, ans = near ? 2 * d + 1 : 2 * d;
      quiz(this, { ask: near ? B(`Doubles plus one: ${d} + ${d + 1} = ?`, `같은 수 더하기보다 1 더 (더블+1): ${d} + ${d + 1} = ?`) : B(`Doubles: ${d} + ${d} = ?`, `같은 수 더하기 (더블): ${d} + ${d} = ?`), show: `<div class="story">${emojiRow(d, e, 'sm')}<span class="op">+</span>${emojiRow(near ? d + 1 : d, e, 'sm')}</div>`, opts: numO(ans, [ans + 1, ans - 1, ans + 2], 2, 20), after: B(near ? `${d} + ${d} = ${2 * d}, plus 1 is ${ans}.` : `${d} + ${d} = ${ans}.`, near ? `${d} + ${d} = ${2 * d}, 거기에 1을 더하면 ${ans}.` : `${d} + ${d} = ${ans}.`) });
    } else if (kind === 'three') {
      const p = pick([1, 2, 3, 4, 6, 7, 8, 9]), q = 10 - p, r = pick([1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== p && x !== q)), order = shuffle([p, q, r]), right = `${p} and ${q}`;
      const cand = [right, `${p} and ${r}`, `${q} and ${r}`];
      quiz(this, { ask: B(`${order.join(' + ')}: which two numbers make ten?`, `${order.join(' + ')}: 더해서 10이 되는 두 수는?`), show: bigEq(`${order.join(' + ')} = ?`), opts: cand.slice(0, 3).map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === right })), cls: 'words', after: B(`${p} + ${q} = 10, and 10 + ${r} = ${10 + r}.`, `${p} + ${q} = 10, 그리고 10 + ${r} = ${10 + r}.`) });
    } else {
      quiz(this, { ask: B('How many in all?', '모두 몇 개일까요?'), show: `<div class="story">${frame10(a, e)}<span class="op">+</span>${frame10(Math.min(10, b), e)}${b > 10 ? '' : ''}</div>`, opts: numO(s, [s - 1, s + 1, s + 10], 11, 20), after: B(`${a} + ${b} = ${s}`, `${a} + ${b} = ${s}`) });
    }
  }
});

// ---------- 6. Story problems (unknown in every position) ----------
const WP_NAMES = [['Mia', '미아'], ['Ben', '벤'], ['Lily', '릴리'], ['Sam', '샘'], ['Ava', '에이바'], ['Max', '맥스'], ['Zoe', '조이'], ['Leo', '레오']];
const WP_ITEMS = [['peaches', '복숭아', '🍑'], ['stickers', '스티커', '⭐'], ['books', '책', '📚'], ['cookies', '쿠키', '🍪'], ['cards', '카드', '🃏'], ['marbles', '구슬', '🔵']];
G1({
  id: 'wordprob', icon: '📖', title: B('Story Problems', '이야기 문제'), sub: B('Add and take away', '더하고 빼요'), u: 'Word problems',
  play() {
    const lv = lvl('wordprob'), top = lv === 1 ? 10 : 20, [n1, k1] = pick(WP_NAMES), [n2, k2] = pick(WP_NAMES.filter(x => x[0] !== n1)), [it, ik, ie] = pick(WP_ITEMS);
    const kinds = lv === 1 ? ['addR', 'addC', 'subR', 'subC', 'together'] : ['addR', 'addC', 'addS', 'subR', 'subC', 'subS', 'compare', 'together'];
    const kind = pick(kinds); let a, b, c, ask, ansV, ko;
    if (kind === 'addR') { a = 2 + rnd(top - 3); b = 1 + rnd(top - a - 1); c = a + b; ansV = c; ask = B(`${n1} had ${a} ${it}. A friend gave ${n1} ${b} more. How many does ${n1} have now?`, `${k1}에게 ${ik} ${a}개가 있었어요. 친구가 ${b}개를 더 줬어요. 지금 모두 몇 개일까요?`); }
    else if (kind === 'addC') { a = 2 + rnd(top - 4); c = a + 2 + rnd(top - a - 1); b = c - a; ansV = b; ask = B(`${n1} had ${a} ${it}. After getting some more, ${n1} had ${c}. How many did ${n1} get?`, `${k1}에게 ${ik} ${a}개가 있었어요. 몇 개를 더 받아서 ${c}개가 되었어요. 몇 개를 받았을까요?`); }
    else if (kind === 'addS') { b = 2 + rnd(top - 4); c = b + 2 + rnd(top - b - 1); a = c - b; ansV = a; ask = B(`${n1} had some ${it}. Then ${n1} got ${b} more. Now ${n1} has ${c}. How many did ${n1} have at first?`, `${k1}에게 ${ik} 몇 개가 있었어요. ${b}개를 더 받아서 지금 ${c}개예요. 처음에 몇 개 있었을까요?`); }
    else if (kind === 'subR') { a = 3 + rnd(top - 2); b = 1 + rnd(a - 1); c = a - b; ansV = c; ask = B(`${n1} had ${a} ${it}. ${n1} gave ${b} to ${n2}. How many are left?`, `${k1}에게 ${ik} ${a}개가 있었어요. ${k2}에게 ${b}개를 줬어요. 몇 개 남았을까요?`); }
    else if (kind === 'subC') { a = 4 + rnd(top - 3); c = 1 + rnd(a - 2); b = a - c; ansV = b; ask = B(`${n1} had ${a} ${it}. ${n1} gave some to ${n2}. Now ${n1} has ${c}. How many did ${n1} give away?`, `${k1}에게 ${ik} ${a}개가 있었어요. ${k2}에게 몇 개를 줬더니 ${c}개가 남았어요. 몇 개를 줬을까요?`); }
    else if (kind === 'subS') { b = 1 + rnd(top - 4); c = 1 + rnd(top - b - 1); a = b + c; ansV = a; ask = B(`${n1} had some ${it}. ${n1} gave away ${b}. Now ${n1} has ${c}. How many did ${n1} have to start?`, `${k1}에게 ${ik} 몇 개가 있었어요. ${b}개를 줬더니 ${c}개가 남았어요. 처음에 몇 개 있었을까요?`); }
    else if (kind === 'compare') { a = 2 + rnd(top - 4); c = a + 1 + rnd(top - a - 1); ansV = c - a; ask = B(`${n1} has ${a} ${it}. ${n2} has ${c}. How many more does ${n2} have than ${n1}?`, `${k1}에게 ${ik} ${a}개, ${k2}에게 ${c}개가 있어요. ${k2}에게는 ${k1}보다 몇 개 더 많을까요?`); }
    else { a = 2 + rnd(top - 4); b = 2 + rnd(top - a - 2); c = a + b; const unknownPart = rnd(2) === 0; ansV = unknownPart ? b : c; ask = unknownPart ? B(`There are ${c} ${it} in all. ${a} are in a box and the rest are on a table. How many are on the table?`, `${ik} 모두 ${c}개가 있어요. ${a}개는 상자에, 나머지는 탁자에 있어요. 탁자에는 몇 개 있을까요?`) : B(`${a} ${it} are in a box and ${b} are on a table. How many ${it} in all?`, `${ik} ${a}개는 상자에, ${b}개는 탁자에 있어요. 모두 몇 개일까요?`); }
    quiz(this, { ask, show: `<span class="emo">${ie}</span>`, opts: numO(ansV, [ansV + 1, ansV - 1, (a || 0) + (b || 0), Math.abs((a || 0) - (b || 0)), c], 0, top), after: B(`The answer is ${ansV}.`, `답은 ${ansV}.`) });
  }
});

// ---------- 7. Fact families ----------
G1({
  id: 'factfam', icon: '👨‍👩‍👧', title: B('Fact Families', '짝꿍 식'), sub: B('Add and subtract are partners', '더하기와 빼기는 짝'), u: 'Add and subtract',
  play() {
    const lv = lvl('factfam'), top = lv === 1 ? 10 : 20, c = 5 + rnd(top - 4), a = 1 + rnd(c - 1), b = c - a, kind = pick(['think', 'family', 'missing']);
    if (kind === 'think') {
      quiz(this, { ask: B('Think of the partner addition to solve it.', '짝이 되는 덧셈으로 생각해서 풀어요.'), show: bigEq(`${c} − ${a} = <span class="qbox">?</span><br><small>${a} + <span class="qbox">?</span> = ${c}</small>`), opts: numO(b, [a, c, b + 1, b - 1], 0, top), after: B(`${a} + ${b} = ${c}, so ${c} − ${a} = ${b}.`, `${a} + ${b} = ${c}, 그러니까 ${c} − ${a} = ${b}.`) });
    } else if (kind === 'family') {
      const right = `${c} − ${a} = ${b}`, cand = [right, `${c} + ${a} = ${b}`, `${a} − ${b} = ${c}`];
      quiz(this, { ask: B(`Which goes with ${a} + ${b} = ${c}?`, `${a} + ${b} = ${c}, 이 식과 한 가족인 식은?`), show: '', opts: eqO(cand, right), cls: 'words', after: B(`${a} + ${b} = ${c} and ${c} − ${a} = ${b} are partners.`, `${a} + ${b} = ${c}, ${c} − ${a} = ${b}: 한 가족이에요.`) });
    } else {
      quiz(this, { ask: B(`You know ${a} + ${b} = ${c}. What is ${c} − ${a}?`, `${a} + ${b} = ${c}인 걸 알아요. ${c} − ${a}는?`), show: '', opts: numO(b, [a, c, b + 1], 0, top), after: B(`${c} − ${a} = ${b}`, `${c} − ${a} = ${b}`) });
    }
  }
});

// ---------- 8. Facts within 10 (no timer) ----------
G1({
  id: 'facts10', icon: '🧠', title: B('Facts Within 10', '10 이내 계산'), sub: B('Pick a strategy, take your time', '천천히 방법을 골라요'), u: 'Fluency within 10',
  play() {
    const lv = lvl('facts10'), top = lv === 1 ? 6 : 10, e = pick(['🍑', '🍎', '🐥', '⭐']), add = lv === 1 ? rnd(3) > 0 : rnd(2) === 0;
    if (add) {
      const a = 1 + rnd(top - 1), b = 1 + rnd(top - a), s = a + b, tip = a === b ? B('A double!', '같은 수를 더했어요! 더블이에요!') : s === 10 ? B('That makes ten!', '10이 되었어요!') : B('Count on from the bigger number.', '큰 수에서 이어 세어 봐요.');
      quiz(this, { ask: B('How many in all? Take your time.', '모두 몇 개일까요? 천천히 생각해요.'), show: lv === 1 ? `<div class="story">${emojiRow(a, e, 'sm')}<span class="op">+</span>${emojiRow(b, e, 'sm')}</div>` : bigEq(`${a} + ${b} = ?`), opts: numO(s, [s - 1, s + 1, a, b], 0, top + 1), after: B(`${a} + ${b} = ${s}. ${L(tip)}`, `${a} + ${b} = ${s}. ${tip.ko}`) });
    } else {
      const a = 2 + rnd(top - 1), b = 1 + rnd(a - 1), d = a - b;
      quiz(this, { ask: B('How many are left? Take your time.', '몇 개 남았을까요? 천천히 생각해요.'), show: lv === 1 ? `<div class="story">${Array.from({ length: a }, (_, i) => `<span class="${i >= a - b ? 'gone' : ''}">${e}</span>`).join('')}</div>` : bigEq(`${a} − ${b} = ?`), opts: numO(d, [d - 1, d + 1, a, b], 0, top), after: B(`${a} − ${b} = ${d}`, `${a} − ${b} = ${d}`) });
    }
  }
});

// ---------- 9. True or false? (the equal sign) ----------
G1({
  id: 'truefalse', icon: '✅', title: B('True or False?', '맞아요 틀려요'), sub: B('Does the equal sign balance?', '등호(=)가 맞을까요?'), u: 'Equal sign',
  play() {
    const lv = lvl('truefalse'), top = lv === 1 ? 10 : 20, truth = rnd(2) === 0, kind = pick(lv === 1 ? ['same', 'op', 'comm'] : ['op', 'comm', 'two', 'sub']);
    let eq;
    if (kind === 'same') { const n = 1 + rnd(top); eq = truth ? `${n} = ${n}` : `${n} = ${n + (rnd(2) ? 1 : -1) || 2}`; }
    else if (kind === 'op') { const x = 2 + rnd(top - 2), y = 1 + rnd(x - 1), z = x - y, shown = truth ? z : z + pick([-1, 1, 2]); eq = pick([`${Math.max(0, shown)} = ${x} − ${y}`, `${x} − ${y} = ${Math.max(0, shown)}`]); if (Math.max(0, shown) === z && !truth) eq = `${z + 1} = ${x} − ${y}`; }
    else if (kind === 'comm') { const p = 1 + rnd(top - 2), q = 1 + rnd(top - p - 1); eq = truth ? `${p} + ${q} = ${q} + ${p}` : `${p} + ${q} = ${q} + ${p + 1}`; }
    else if (kind === 'two') { const p = 1 + rnd(8), q = 1 + rnd(8), s = p + q, r = 1 + rnd(s - 1), t = s - r + (truth ? 0 : pick([-1, 1, 2])); eq = `${p} + ${q} = ${r} + ${Math.max(0, t)}`; if (!truth && r + Math.max(0, t) === s) eq = `${p} + ${q} = ${r} + ${s - r + 1}`; }
    else { const x = 6 + rnd(top - 5), y = 1 + rnd(Math.min(5, x - 2)), v = x - y, p = 1 + rnd(v - 1), w = truth ? v - p : v - p + 1; eq = `${x} − ${y} = ${p} + ${Math.max(0, w)}`; }
    const parse = (s) => { const [l, r] = s.split(' = '); const ev = (t) => { const m = t.match(/^(\d+)(?: ([+−]) (\d+))?$/); if (!m) return NaN; return m[2] === '+' ? +m[1] + +m[3] : m[2] === '−' ? +m[1] - +m[3] : +m[1]; }; return ev(l) === ev(r); };
    const real = parse(eq), tr = S.lang === 'ko' ? '맞아요 ✅' : 'True ✅', fa = S.lang === 'ko' ? '틀려요 ❌' : 'False ❌';
    quiz(this, { ask: B('Is this equation true or false?', '이 식은 맞을까요, 틀릴까요? 양쪽을 비교해 봐요.'), show: bigEq(eq), opts: [{ html: `<span class="word">${tr}</span>`, ok: real }, { html: `<span class="word">${fa}</span>`, ok: !real }], cls: 'words', after: real ? B('Both sides are the same amount.', '양쪽의 값이 같아요.') : B('The two sides are not the same.', '양쪽의 값이 달라요.') });
  }
});

// ---------- 10. The missing number ----------
G1({
  id: 'missingnum', icon: '❓', title: B('The Missing Number', '빠진 수 찾기'), sub: B('Find the unknown', '모르는 수를 찾아요'), u: 'Unknown numbers',
  play() {
    const lv = lvl('missingnum'), top = lv === 1 ? 10 : 20, sym = pick(['<span class="qbox">?</span>', '△', '□']), form = pick(['a+?=c', '?+b=c', 'c=a+?', 'a-?=c', '?-b=c', 'c=?-b', 'a+b=?']);
    const c = 4 + rnd(top - 3), a = 1 + rnd(c - 1), b = c - a, big = c + 1 + rnd(Math.max(1, top - c)), d = big - c;
    let eq, ans;
    if (form === 'a+?=c') { eq = `${a} + ${sym} = ${c}`; ans = b; }
    else if (form === '?+b=c') { eq = `${sym} + ${b} = ${c}`; ans = a; }
    else if (form === 'c=a+?') { eq = `${c} = ${a} + ${sym}`; ans = b; }
    else if (form === 'a-?=c') { eq = `${big} − ${sym} = ${c}`; ans = d; }
    else if (form === '?-b=c') { eq = `${sym} − ${d} = ${c}`; ans = big; }
    else if (form === 'c=?-b') { eq = `${c} = ${sym} − ${d}`; ans = big; }
    else { eq = `${a} + ${b} = ${sym}`; ans = c; }
    quiz(this, { ask: B('What number makes the equation true?', '식이 맞으려면 어떤 수가 들어가야 할까요?'), show: bigEq(eq), opts: numO(ans, [ans + 1, ans - 1, a + b, Math.abs(a - b), c], 0, 20), after: B(`The missing number is ${ans}.`, `빠진 수는 ${ans}.`) });
  }
});

// ---------- 11. 10 more, 10 less ----------
G1({
  id: 'tenmoreless', icon: '🔺', title: B('10 More, 10 Less', '10 더 큰 수, 10 더 작은 수'), sub: B('Think in tens', '십 단위로 생각해요'), u: 'Tens in your head',
  play() {
    const lv = lvl('tenmoreless'), more = rnd(2) === 0, n = more ? 11 + rnd(80) : 21 + rnd(79), ans = more ? n + 10 : n - 10, kind = lv === 1 ? 'plain' : pick(['plain', 'story', 'story']);
    const bad = [more ? n - 10 : n + 10, ans + 1, ans - 1, ans + 11, swapDigits(ans)].filter(v => v > 0 && v < 110);
    if (kind === 'story') {
      const birds = n; quiz(this, { ask: more ? B(`There were ${birds} birds in the park. 10 more flew in. How many birds now?`, `공원에 새가 ${birds}마리 있었어요. 10마리가 더 날아왔어요. 지금 몇 마리일까요?`) : B(`There were ${birds} birds in the park. 10 flew away. How many birds now?`, `공원에 새가 ${birds}마리 있었어요. 10마리가 날아갔어요. 지금 몇 마리일까요?`), show: '<span class="emo">🐦</span>', opts: numO(ans, bad, 1, 109), after: B(`${birds} ${more ? '+' : '−'} 10 = ${ans}`, `${birds} ${more ? '+' : '−'} 10 = ${ans}`) });
      return;
    }
    quiz(this, { ask: more ? B(`What is 10 MORE than ${n}?`, `${n}보다 10 더 큰 수는?`) : B(`What is 10 LESS than ${n}?`, `${n}보다 10 더 작은 수는?`), askSay: more ? B(`What is 10 more than ${n}?`, `${n}보다 10 더 큰 수는?`) : B(`What is 10 less than ${n}?`, `${n}보다 10 더 작은 수는?`), show: lv === 1 ? b10(n) : '', opts: numO(ans, bad, 1, 109), after: B(`${more ? 'One more ten' : 'One less ten'}: ${ans}.`, `${more ? '10개씩 묶음 1개 더' : '10개씩 묶음 1개 덜'}: ${ans}.`) });
  }
});

// ---------- 12. Add and subtract tens ----------
G1({
  id: 'addtens', icon: '🔟', title: B('Add and Subtract Tens', '몇십 더하고 빼기'), sub: B('30 + 20, 70 − 40', '30 + 20, 70 − 40'), u: 'Multiples of 10',
  play() {
    const lv = lvl('addtens'), top = lv === 1 ? 6 : 10, add = lv === 1 ? true : rnd(2) === 0;
    let x, y, ans, eq, tip;
    if (add) { x = 1 + rnd(top - 1); y = 1 + rnd(top - x); ans = (x + y) * 10; eq = `${x * 10} + ${y * 10}`; tip = B(`${x} tens + ${y} tens = ${x + y} tens = ${ans}`, `10개씩 묶음 ${x}개 + ${y}개 = ${x + y}개 = ${ans}`); }
    else { x = 2 + rnd(top - 1); y = 1 + rnd(x - 1); ans = (x - y) * 10; eq = `${x * 10} − ${y * 10}`; tip = B(`${x} tens − ${y} tens = ${x - y} tens = ${ans}`, `10개씩 묶음 ${x}개 − ${y}개 = ${x - y}개 = ${ans}`); }
    const show = lv === 1 ? `<div class="story">${b10(x * 10)}<span class="op">${add ? '+' : '−'}</span>${b10(y * 10)}</div>` : bigEq(`${eq} = ?`);
    quiz(this, { ask: lv === 1 ? B(`${eq} = ?`, `${eq} = ?`) : B('Add or subtract the tens.', '10개씩 묶음끼리 더하거나 빼요.'), show, opts: numO(ans, [x + y, x - y, ans + 1, ans - 10, ans + 10].filter(v => v >= 0), 0, 100), after: tip });
  }
});

// ---------- 13. Add two-digit numbers ----------
G1({
  id: 'add100', icon: '➕', title: B('Add Within 100', '100 이내 더하고 빼기'), sub: B('Tens with tens, ones with ones', '10개씩 묶음은 묶음끼리, 낱개는 낱개끼리'), u: 'Within 100',
  play() {
    const lv = lvl('add100'), kind = pick(lv === 1 ? ['plus1', 'plus10s', 'minus1'] : ['regroup', 'plus1r', 'twodig', 'minus1', 'minus10s']);
    let eq, ans, tip;
    if (kind === 'plus1') { const t = 1 + rnd(8) * 1, o = 1 + rnd(4), p = 1 + rnd(9 - o), a = t * 10 + o; ans = a + p; eq = `${a} + ${p}`; tip = B(`${o} + ${p} = ${o + p}, so ${t * 10} + ${o + p} = ${ans}.`, `${o} + ${p} = ${o + p}, 그래서 ${t * 10} + ${o + p} = ${ans}.`); }
    else if (kind === 'plus10s') { const t = 1 + rnd(6), o = 1 + rnd(9), k = 1 + rnd(8 - t > 0 ? 8 - t : 1), a = t * 10 + o; ans = a + k * 10; eq = `${a} + ${k * 10}`; tip = B(`${t} tens + ${k} tens = ${t + k} tens. Keep the ${o} ones: ${ans}.`, `10개씩 묶음 ${t}개 + ${k}개 = ${t + k}개, 낱개 ${o}개는 그대로: ${ans}.`); }
    else if (kind === 'minus1') { const t = 2 + rnd(7), o = 3 + rnd(7), p = 1 + rnd(o - 1), a = t * 10 + o; ans = a - p; eq = `${a} − ${p}`; tip = B(`${o} − ${p} = ${o - p}, so ${t * 10} + ${o - p} = ${ans}.`, `${o} − ${p} = ${o - p}, 그래서 ${t * 10} + ${o - p} = ${ans}.`); }
    else if (kind === 'minus10s') { const t = 3 + rnd(6), o = rnd(10), k = 1 + rnd(t - 1), a = t * 10 + o; ans = a - k * 10; eq = `${a} − ${k * 10}`; tip = B(`Take away ${k} tens from ${t} tens. ${ans}.`, `10개씩 묶음 ${t}개에서 ${k}개를 빼요. ${ans}.`); }
    else if (kind === 'twodig') { const t1 = 1 + rnd(4), o1 = 1 + rnd(4), t2 = 1 + rnd(4), o2 = 1 + rnd(9 - o1), a = t1 * 10 + o1, b = t2 * 10 + o2; ans = a + b; eq = `${a} + ${b}`; tip = B(`${t1 * 10} + ${t2 * 10} = ${(t1 + t2) * 10}, ${o1} + ${o2} = ${o1 + o2}, so ${ans}.`, `${t1 * 10} + ${t2 * 10} = ${(t1 + t2) * 10}, ${o1} + ${o2} = ${o1 + o2}, 그래서 ${ans}.`); }
    else { const t = 1 + rnd(7), o = 5 + rnd(5), p = 10 - o + 1 + rnd(o - 1 > 0 ? Math.min(4, o - 1) : 1), a = t * 10 + o; ans = a + p; eq = `${a} + ${p}`; tip = B(`${o} + ${p} = ${o + p}: that is 1 ten and ${o + p - 10} ones. ${ans}.`, `${o} + ${p} = ${o + p}: 10개씩 묶음 1개와 낱개 ${o + p - 10}개. ${ans}.`); }
    quiz(this, { ask: B('Solve it. Use tens and ones.', '10개씩 묶음과 낱개로 나눠서 풀어요.'), show: bigEq(`${eq} = ?`), opts: numO(ans, [ans + 10, ans - 10, ans + 1, ans - 1, ans + 9].filter(v => v >= 0 && v <= 100), 0, 100), after: tip });
  }
});
