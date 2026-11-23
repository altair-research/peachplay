'use strict';
// Math games, following GCPS kindergarten units (Georgia Reveal Math K):
// U1 within 10, U2 shapes, U3 numbers to 20, U4 3-D shapes, U5 patterns/add-subtract, U6 within 20, U7 data.
const AREA_MATH = (u) => B(`Math · ${u}`, `수학 · ${u}`);

// ---------- 1. Count by tens ----------
registerGame({
  id: 'tens', subject: 'math', icon: '🚂', title: B('Count by Tens', '10씩 세기'), sub: B('10, 20, 30...', '10, 20, 30...'),
  area: AREA_MATH('Counting'),
  play() {
    // 2026-11-20 (i-Ready K practice, more questions): L1 counts forward by tens to 100 (K standard), with 3- or 4-car trains
    // and "what comes after"; L2 keeps the longer trains, counting back, totals to 100 and "what comes before/after".
    const lv = lvl('tens'), maxK = lv === 1 ? 5 : 10;
    const kind = lv === 1 ? pick(['gap', 'gap', 'gap', 'total', 'after']) : pick(['gap', 'back', 'total', 'gap', 'back', 'after', 'before']);
    const dots = '<span>🔵</span>'.repeat(10);
    const near = (ans) => { const set = new Set([ans]); while (set.size < 3) { const v = ans + pick([-20, -10, 10, 20]); if (v >= 10 && v <= 100) set.add(v); } return [...set].map(v => ({ html: `<span class="num">${v}</span>`, ok: v === ans })); };
    if (kind === 'after' || kind === 'before') {
      // One full car with its number, then an empty car on the side we count toward (arrow shows the direction).
      const after = kind === 'after', k = after ? 1 + rnd(9) : 2 + rnd(9), ans = after ? (k + 1) * 10 : (k - 1) * 10;
      const full = `<div class="car"><div class="n">${k * 10}</div><div class="dots">${dots}</div></div>`, gap = `<div class="car gap"><div class="n">?</div><div class="dots"></div></div>`;
      quiz(this, {
        ask: after ? B(`Count by tens. What comes after ${k * 10}?`, `10씩 세요. ${k * 10} 다음은?`) : B(`Count by tens. What comes before ${k * 10}?`, `10씩 세요. ${k * 10} 앞은?`),
        show: `<div class="train">${after ? full + '<div class="n" style="align-self:center;font-size:28px">➡️</div>' + gap : gap + '<div class="n" style="align-self:center;font-size:28px">⬅️</div>' + full}</div>`,
        opts: near(ans), after: B(after ? `${k * 10}, ${ans}` : `${ans}, ${k * 10}`, after ? `${k * 10}, ${ans}` : `${ans}, ${k * 10}`),
        onCorrect() { const g = $('.car.gap'); if (!g) return; g.classList.remove('gap'); g.querySelector('.n').textContent = ans; g.querySelector('.dots').innerHTML = dots; }
      });
      return;
    }
    if (kind === 'total') {
      const k = 2 + rnd(maxK - 1), ans = k * 10, seq = Array.from({ length: k }, (_, i) => (i + 1) * 10);
      quiz(this, {
        ask: B('Count by tens: how many in all?', '10씩 세어요: 모두 몇 개일까요?'),
        show: `<div class="train sm">${seq.map(() => `<div class="car"><div class="dots">${dots}</div></div>`).join('')}</div>`,
        opts: near(ans), after: B(seq.join(', '), seq.join(', '))
      });
      return;
    }
    const len = lv === 1 ? pick([3, 4]) : 5, startIdx = rnd((lv === 1 ? 10 : maxK) - len + 1);
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
    if (rnd(4) === 0) { quiz(this, takeApartItem(lv)); return; }
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

// 2026-11-22 (IXL K skill types, P-ixl118): take a number apart in different ways - "which one makes 5?" with each choice drawn
// as two small groups. One choice makes the number; the others keep one group and change the other by one or two, so they make
// a nearby number (4 or 6 for 5) and only counting tells them apart. L1: totals 3-5 under an empty frame of that many cells.
// L2: totals 6-10 as the number alone (no frame to match against).
const koDigitK = (n) => ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구', '십'][n] || '';
const koBatchim = (n) => !['이', '사', '오', '구'].includes(koDigitK(n % 10 || 10));      // 일·삼·육·칠·팔·십 end in a consonant
function takeApartItem(lv) {
  const T = lv === 1 ? 3 + rnd(3) : 6 + rnd(5), e = pick(['🍎', '🍓', '🍊', '⭐', '🐞', '🌸', '🐟', '🎈']);
  const a = 1 + rnd(T - 1), b = T - a, bad = [], seen = new Set([a + ',' + b]);
  let guard = 0;
  while (bad.length < 2 && guard++ < 80) {
    const d = pick(bad.length ? [-2, -1, 1, 2] : [-1, 1]), side = rnd(2), p = side ? [a, b + d] : [a + d, b];
    if (p[0] < 1 || p[1] < 1 || p[0] + p[1] === T || seen.has(p.join(','))) continue;
    if (bad.length && bad[0][0] + bad[0][1] === p[0] + p[1]) continue;              // the two wrong ones make different numbers
    seen.add(p.join(',')); bad.push(p);
  }
  // Each group sits in its own box, 5 to a row (like half a ten-frame), so 7 reads as 5 and 2 instead of a long line to count.
  const grp = (k) => `<span style="display:inline-grid;grid-template-columns:repeat(${Math.min(k, 5)},1.2em);justify-items:center;line-height:1.2;letter-spacing:0;border:2px solid #f2b28c;border-radius:10px;padding:1px 3px">${`<span>${e}</span>`.repeat(k)}</span>`;
  const o = (p, ok) => ({ html: `<span style="display:inline-flex;align-items:center;gap:6px;flex-wrap:nowrap;white-space:nowrap;font-size:clamp(16px,min(5.4vw,3.6dvh),30px)">${grp(p[0])}<b style="color:#c4552b">+</b>${grp(p[1])}</span>`, ok });
  const tj = koBatchim(T) ? '이' : '가', aj = koBatchim(a) ? '과' : '와', bj = koBatchim(b) ? '을' : '를';
  return {
    ask: B(`Which one makes ${T}?`, `${T}${tj} 되는 것은 어느 것일까요?`),
    show: `<div class="bigword" style="text-align:center">${T}</div>` + (lv === 1 ? `<div class="frame mini" style="max-width:${T * 52}px;margin:4px auto 0;grid-template-columns:repeat(${T},1fr)">${'<div class="cell empty"></div>'.repeat(T)}</div>` : ''),
    quietShow: true, opts: [o([a, b], true), ...bad.map(p => o(p, false))], cls: 'words',
    itemKey: `ten|apart|${lv}|${e}|${a},${b}`,
    after: B(`${a} and ${b} make ${T}!`, `${a}${aj} ${b}${bj} 합치면 ${T}!`)
  };
}

// ---------- 3. Count the objects (one-to-one correspondence) ----------
registerGame({
  id: 'count', subject: 'math', icon: '🔢', title: B('Count Peaches', '복숭아 세기'), sub: B('Tap and count', '눌러서 세어요'),
  area: AREA_MATH('Counting objects'),
  play() {
    // 2026-11-20 (i-Ready K practice): more kinds of things to count, and "one more" (one new thing joins the group).
    const lv = lvl('count'), n = lv === 1 ? 2 + rnd(9) : 8 + rnd(13), e = pick(['🍑', '🍑', '🍎', '🐞', '⭐', '🦆', '🐟', '🌸', '🚗', '🎈', '🐢']);
    if (lv === 1 && rnd(4) === 0) {
      const m = 1 + rnd(9);
      quiz(this, {
        ask: B('One more comes. How many now?', '하나 더 와요. 이제 몇 개?'),
        show: `<div class="story">${emojiRow(m, e, 'sm')}<span class="op">+</span><div class="grp sm" style="border:3px dashed #f2b28c;border-radius:12px;padding:2px 6px"><span>${e}</span></div></div>`,
        opts: numOpts(m + 1, 1, 10), after: B(`${m} and one more is ${m + 1}.`, `${m}보다 하나 더 많으면 ${m + 1}.`)
      });
      return;
    }
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
    // 2026-11-20 (i-Ready K practice): L1 also fills a missing middle card (to 20) and counts back from 10.
    const kind = lv === 1 ? pick(['next', 'next', 'before', 'mid', 'mid2', 'back10', 'ord', 'oml']) : pick(['next', 'before', 'back', 'mid', 'ord', 'oml']);
    if (kind === 'ord') { quiz(this, ordinalItem(lv)); return; }
    if (kind === 'oml') { quiz(this, oneMoreLessItem(lv)); return; }
    let cards, ans, ask;
    if (kind === 'mid2') { const a = 1 + rnd(hi - 3); cards = [a, '?', a + 2, a + 3]; ans = a + 1; ask = B('Which number is missing?', '빠진 숫자는 뭘까요?'); }
    else if (kind === 'back10') { const a = 4 + rnd(7); cards = [a, a - 1, a - 2, '?']; ans = a - 3; ask = B('Counting backward, what comes next?', '거꾸로 세면 다음은 뭘까요?'); }
    else if (kind === 'next') { const a = 1 + rnd(hi - 4); cards = [a, a + 1, a + 2, '?']; ans = a + 3; ask = B('What comes next?', '다음 숫자는 뭘까요?'); }
    else if (kind === 'before') { const a = 2 + rnd(hi - 4); cards = ['?', a, a + 1, a + 2]; ans = a - 1; ask = B('What comes before?', '앞에 올 숫자는 뭘까요?'); }
    else if (kind === 'back') { const a = 4 + rnd(hi - 4); cards = [a, a - 1, a - 2, '?']; ans = a - 3; ask = B('Counting backward, what comes next?', '거꾸로 세면 다음은 뭘까요?'); }
    else { const a = 1 + rnd(hi - 4); cards = [a, a + 1, '?', a + 3]; ans = a + 2; ask = B('Which number is missing?', '빠진 숫자는 뭘까요?'); }
    quiz(this, { ask, show: `<div class="train">${cards.map(c => `<div class="car ${c === '?' ? 'gap' : ''}"><div class="n">${c}</div></div>`).join('')}</div>`, opts: numOpts(ans, 0, hi), after: B(`${ans}`, `${ans}`) });
  }
});

// 2026-11-22 (IXL K skill types, P-ixl118; types only, our own content): ordinal numbers and one more / one less with pictures.
// Ordinals: a row of different animals with a 🏁 at the start; "which is third?" with animal pictures. Wrong choices are the
// neighbours (counted one too far / not far enough) and the one counted from the wrong end. L1: 5 animals, first-fifth, flag on
// the left. L2: 7-10 animals, third to tenth, and the flag may be on the right (count from the other side) - two things at once.
// The answer animal is in the row on purpose (finding it by position is the skill; PF2 exception like 'pattern').
const ORD_ANIMALS = ['🐶', '🐱', '🐰', '🐻', '🐸', '🐷', '🐵', '🐔', '🦊', '🐼', '🐯', '🦁', '🐮', '🐭', '🐨', '🐧', '🦆', '🐢'];
const ORD_EN = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];
const ORD_KO = ['첫 번째', '두 번째', '세 번째', '네 번째', '다섯 번째', '여섯 번째', '일곱 번째', '여덟 번째', '아홉 번째', '열 번째'];
const ORD_COUNT_KO = ['하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
function ordinalItem(lv) {
  const n = lv === 1 ? 5 : 7 + rnd(4), k = lv === 1 ? 1 + rnd(5) : 3 + rnd(n - 2), right = lv === 2 && rnd(2) === 0;
  const row = shuffle(ORD_ANIMALS.slice()).slice(0, n), at = (p) => row[p - 1];      // position 1 = next to the flag
  const bad = new Set(), mirror = n + 1 - k;
  if (mirror !== k) bad.add(mirror);
  for (const p of shuffle([k - 1, k + 1])) if (p >= 1 && p <= n && bad.size < 2) bad.add(p);
  if (bad.size < 2) bad.add(k + 2 <= n ? k + 2 : k - 2);
  const fs = `display:grid;grid-template-columns:repeat(${n + 1},minmax(0,1fr));justify-items:center;width:100%;max-width:${(n + 1) * 64}px;margin:0 auto;font-size:clamp(14px,min(calc((100vw - 56px) / ${n + 1} * .74),6dvh),46px)`;
  const flag = `<span style="display:inline-flex;flex-direction:column;align-items:center;line-height:1">🏁<span style="font-size:.5em">${right ? '⬅️' : '➡️'}</span></span>`;
  const cells = row.map(a => `<span>${a}</span>`), line = right ? [...cells].reverse().join('') + flag : flag + cells.join('');
  const ord = { en: ORD_EN[k - 1], ko: ORD_KO[k - 1] }, counts = { en: Array.from({ length: k }, (_, i) => i + 1).join(', '), ko: ORD_COUNT_KO.slice(0, k).join(', ') };
  return {
    ask: B(`Count from the 🏁. Which animal is ${ord.en}?`, `🏁부터 세어요. ${ord.ko} 동물은?`),
    askSay: B(`Count from the flag. Which animal is ${ord.en}?`, `깃발부터 세어요. ${ord.ko} 동물은?`),
    show: `<div class="ordrow" style="align-items:end;gap:2px;${fs};line-height:1.1">${line}</div>`,
    opts: [k, ...bad].map(p => ({ html: `<span class="emo">${at(p)}</span>`, ok: p === k })), quietShow: true,
    itemKey: `order|ord|${lv}|${right}|${row.join('')}|${k}`,
    after: B(`${counts.en}: ${ord.en}!`, `${counts.ko}: ${ord.ko}!`)
  };
}
// One more / one less: L1 a ten-frame with 1-9 things (one more up to 10, one less down to 0); L2 a teen number drawn as a full ten
// and some more (11-19), so the child sees "ten and 4, one more is ten and 5" instead of counting all again.
// The + / - beside the picture shows one thing coming or going, so it can be followed with the sound off.
function oneMoreLessItem(lv) {
  const e = pick(['🍎', '🍓', '🐟', '⭐', '🐞', '🌸', '🚗', '🎈', '🦆', '🍪']), more = rnd(2) === 0;
  const n = lv === 1 ? 1 + rnd(9) : 11 + rnd(9), ans = more ? n + 1 : n - 1;
  const pic = lv === 1 ? frameHtml(n, e, 10) : teenShow(n, e);
  const sign = more ? `<span style="border:3px dashed #f2b28c;border-radius:12px;padding:0 6px">＋ ${e}</span>` : `<span style="border:3px dashed #c1121f;border-radius:12px;padding:0 6px">－ ${e}</span>`;
  return {
    ask: more ? B('One more than this is how many?', '이것보다 하나 더 많으면 몇 개?') : B('One less than this is how many?', '이것보다 하나 적으면 몇 개?'),
    show: `${pic}<div style="text-align:center;font-size:clamp(22px,min(7vw,5dvh),36px);margin-top:6px">${sign}</div>`, quietShow: true,
    opts: numOpts(ans, 0, 20), itemKey: `order|oml|${lv}|${more}|${n}|${e}`,
    after: more ? B(`${n} and one more is ${ans}.`, `${n}보다 하나 더 많으면 ${ans}.`) : B(`One less than ${n} is ${ans}.`, `${n}보다 하나 적으면 ${ans}.`)
  };
}

// ---------- 5. Compare groups: more / fewer / same ----------
registerGame({
  id: 'compare', subject: 'math', icon: '⚖️', title: B('More or Fewer?', '더 많이? 더 적게?'), sub: B('Compare groups', '묶음 비교하기'),
  area: AREA_MATH('Comparing sets'),
  play() {
    // 2026-11-20 (i-Ready K practice): more kinds of things; L2 also compares two written numbers (within 10).
    const lv = lvl('compare'), e = pick(['🍑', '🍎', '🐟', '⭐', '🐞', '🌸', '🚗', '🦆']);
    // 2026-11-22 (IXL K skill types, P-ixl118): three numbers, which is the greatest / the least.
    // L1: 1-5, each number with its own group of things under it. L2: 1-10 as numbers only, often close together (a run like 6, 7, 8).
    if (rnd(4) === 0) {
      const top = lv === 1 ? 5 : 10, set = new Set();
      if (lv === 2 && rnd(2) === 0) { const a = 1 + rnd(top - 2); [a, a + 1, a + 2].forEach(v => set.add(v)); }
      while (set.size < 3) set.add(1 + rnd(top));
      const vals = [...set], big = rnd(2) === 0, right = big ? Math.max(...vals) : Math.min(...vals), j = [2, 4, 5, 9].includes(right % 10);
      quiz(this, { ask: big ? B('Which number is the greatest?', '어느 수가 가장 클까요?') : B('Which number is the least?', '어느 수가 가장 작을까요?'),
        opts: vals.map(v => ({ html: `<span class="num">${v}</span>` + (lv === 1 ? emojiRow(v, e, 'sm') : ''), ok: v === right })), cls: 'shapes',
        itemKey: `compare|three|${lv}|${big}|${lv === 1 ? e : ''}|${vals.slice().sort((a, b) => a - b).join(',')}`,
        after: B(`${right} is the ${big ? 'greatest' : 'least'}.`, `${right}${j ? '가' : '이'} 가장 ${big ? '커요' : '작아요'}.`) });
      return;
    }
    if (lv === 2 && rnd(4) === 0) {
      const x = 1 + rnd(10); let y = 1 + rnd(10); if (y === x) y = x === 10 ? 9 : x + 1;
      const big = !!rnd(2), right = big ? Math.max(x, y) : Math.min(x, y);
      quiz(this, { ask: big ? B('Which number is MORE?', '어느 수가 더 클까요?') : B('Which number is LESS?', '어느 수가 더 작을까요?'),
        opts: [x, y].map(v => ({ html: `<span class="num">${v}</span>`, ok: v === right })), cls: 'shapes', itemKey: `compare|num|${big}|${Math.min(x, y)},${Math.max(x, y)}`,
        after: B(`${right} is ${big ? 'more' : 'less'}.`, `${right}${[2, 4, 5, 9].includes(right % 10) ? '가' : '이'} 더 ${big ? '커요' : '작아요'}.`) });
      return;
    }
    const same = lv === 2 && rnd(4) === 0;
    let a = 1 + rnd(10), b = same ? a : 1 + rnd(10);
    if (!same && a === b) b = a === 10 ? 9 : a + 1;
    const more = lv === 1 ? rnd(2) === 0 : true;
    const askMore = lv === 2 ? B('Which has MORE, or are they the SAME?', '어느 쪽이 더 많을까요, 같을까요?') : more ? B('Which group has MORE?', '어느 쪽이 더 많을까요?') : B('Which group has FEWER?', '어느 쪽이 더 적을까요?');
    const opts = [{ html: '<small>A</small>' + emojiRow(a, e, 'sm'), ok: !same && (more ? a > b : a < b) || false }, { html: '<small>B</small>' + emojiRow(b, e, 'sm'), ok: !same && (more ? b > a : b < a) || false }];
    if (lv === 2) opts.push({ html: '<span class="num">=</span>', label: B('Same', '같아요'), ok: same });
    quiz(this, { ask: askMore, opts, cls: 'groups', itemKey: `compare|grp|${lv}|${more}|${e}|${a},${b}`, after: B(same ? `${a} and ${b} are the same.` : `${a} and ${b}.`, same ? `${a}와 ${b}는 같아요.` : `${a}와 ${b}.`), sd: { e, more: lv === 2 || more } });
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
    // 2026-11-20 (i-Ready K practice): more kinds of things, and the other direction (a teen number is ten and how many more?).
    const lv = lvl('teens'), n = lv === 1 ? 11 + rnd(5) : 11 + rnd(9), e = pick(['🍑', '🍎', '⭐', '🐟', '🌸', '🐞', '🚗', '🎈']);
    if (rnd(3) === 0) {
      quiz(this, {
        ask: B(`${n} is ten and how many more?`, `${n}${[2, 4, 5, 9].includes(n % 10) ? '는' : '은'} 10과 얼마일까요?`),
        show: `<div class="story">${teenTen(e)}<span class="op">+</span>${teenOnes(n - 10, e)}<span class="op">=</span><span class="bigword">${n}</span></div>`,   // 서연 11-21: the ones are drawn beside the full ten, so a K child counts "ten and 2" instead of computing 12 − 10
        opts: numOpts(n - 10, 1, 9), after: B(`${n} is ten and ${n - 10}.`, `${n}${[2, 4, 5, 9].includes(n % 10) ? '는' : '은'} 10과 ${n - 10}.`)
      });
      return;
    }
    const fs = scaffoldStep(this, 'teen');
    quiz(this, {
      ask: B('Ten and some more: how many in all?', '10과 조금 더: 모두 몇 개일까요?'),
      show: fs === 0 ? teenShow(n, e) : fs === 1 ? `<div class="story"><span class="bigword" style="border:3px solid #f2b28c;border-radius:12px;padding:0 .3em">10</span><span class="op">+</span>${teenOnes(n - 10, e)}</div>` : `<div class="bigword">10 + ${n - 10}</div>`,
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
// 서연 v5.17 (P-teens114): the loose ones are drawn in cells of the same size as the ten-frame cells (up to 5 in a row,
// like a second ten-frame without its empty cells), so the ten and the ones look like the same kind of thing.
const teenTen = (e) => `<div class="frame mini teen">${Array.from({ length: 10 }, () => `<div class="cell on">${e}</div>`).join('')}</div>`;
const teenOnes = (k, e) => `<div class="frame mini teen ones" style="--k:${Math.min(k, 5)}">${Array.from({ length: k }, () => `<div class="cell on">${e}</div>`).join('')}</div>`;
const teenShow = (n, e) => `<div class="story">${teenTen(e)}<span class="op">+</span>${teenOnes(n - 10, e)}</div>`;

// ---------- 8. 2-D shapes (SVG, random rotation) ----------
const SHAPES = {
  circle: { n: B('circle', '동그라미'), svg: '<circle cx="50" cy="50" r="40"/>' },
  square: { n: B('square', '네모(정사각형)'), svg: '<rect x="14" y="14" width="72" height="72"/>' },
  triangle: { n: B('triangle', '세모'), svg: '<polygon points="50,10 92,86 8,86"/>' },
  rectangle: { n: B('rectangle', '직사각형'), svg: '<rect x="6" y="26" width="88" height="48"/>' },
  hexagon: { n: B('hexagon', '육각형'), svg: '<polygon points="50,6 87,28 87,72 50,94 13,72 13,28"/>' },
  // D7 (2026-10-28): the K school test asked for an octagon (stop sign); the child colored it as a hexagon.
  octagon: { n: B('octagon', '팔각형'), svg: '<polygon points="90.7,66.8 66.8,90.7 33.2,90.7 9.3,66.8 9.3,33.2 33.2,9.3 66.8,9.3 90.7,33.2"/>' }
};
// Side-count distractors only (not taught as names in K): a wrong answer one or two sides away.
const NEAR_SHAPES = {
  pentagon: { n: 5, svg: '<polygon points="50,6 91.8,36.4 75.9,85.6 24.1,85.6 8.2,36.4"/>' },
  hexagon: { n: 6, svg: SHAPES.hexagon.svg },
  heptagon: { n: 7, svg: '<polygon points="50,6 84.4,22.6 92.9,59.8 69.1,89.6 30.9,89.6 7.1,59.8 15.6,22.6"/>' },
  octagon: { n: 8, svg: SHAPES.octagon.svg }
};
const SHAPE_COLORS = ['#ef476f', '#118ab2', '#06d6a0', '#ffb703', '#8338ec'];
const shapeSvg = (k, rot) => `<svg viewBox="0 0 100 100" class="shape" style="transform:rotate(${rot}deg)" fill="${pick(SHAPE_COLORS)}" stroke="#1d3557" stroke-width="3">${SHAPES[k].svg}</svg>`;
const SHAPE_FACTS = {
  circle: B('Which shape is round, with no corners?', '둥글고 뾰족한 곳이 없는 모양은?'),
  triangle: B('Which shape has 3 sides?', '변이 3개인 모양은?'),
  square: B('Which shape has 4 sides all the same?', '변 4개가 모두 같은 모양은?'),
  rectangle: B('Which shape has 4 sides, with 2 long and 2 short?', '긴 변과 짧은 변이 2개씩인 모양은?'),
  hexagon: B('Which shape has 6 sides?', '변이 6개인 모양은?'),
  octagon: B('Which shape has 8 sides?', '변이 8개인 모양은?')
};
const sideSticks = (n) => `<div style="display:flex;gap:6px;justify-content:center;align-items:center;font-size:clamp(16px,3dvh,24px);font-weight:800;line-height:1">${Array.from({ length: n }, () => '<span style="display:inline-block;width:6px;height:clamp(16px,3.2dvh,26px);background:#1d3557;border-radius:3px"></span>').join('')}<span style="margin-left:8px">${n}</span></div>`;
registerGame({
  id: 'shapes2d', subject: 'math', icon: '🔺', title: B('Shape Finder', '모양 찾기'), sub: B('Circles, squares, triangles...', '동그라미, 네모, 세모...'),
  area: AREA_MATH('Shapes'),
  play() {
    const lv = lvl('shapes2d'), pool = lv === 1 ? ['circle', 'square', 'triangle', 'rectangle'] : Object.keys(SHAPES);
    // D7: level 2 compares the many-sided shapes by counting sides. The clue is a row of side sticks (works with sound off);
    // wrong answers are one or two sides away (6 vs 8, 7 vs 8, 5 vs 6).
    if (lv === 2 && rnd(3) === 0) {
      const t = pick(['hexagon', 'octagon']), near = t === 'octagon' ? ['hexagon', 'heptagon'] : ['pentagon', 'octagon'], k = NEAR_SHAPES[t].n;
      const svg = (key) => `<svg viewBox="0 0 100 100" class="shape" style="transform:rotate(${rnd(31) - 15}deg)" fill="${pick(SHAPE_COLORS)}" stroke="#1d3557" stroke-width="3">${NEAR_SHAPES[key].svg}</svg>`;
      quiz(this, {
        ask: B(`Which shape has ${k} sides?`, `변이 ${k}개인 모양은?`),
        show: sideSticks(k),
        opts: [t, ...near].map(key => ({ html: svg(key), ok: key === t })), cls: 'shapes',
        after: t === 'octagon' ? B('An octagon has 8 sides, like a stop sign 🛑.', '팔각형은 변이 8개예요. 정지 표지판 🛑처럼요.') : B('A hexagon has 6 sides.', '육각형은 변이 6개예요.'),
        vocab: SHAPES[t].n.en
      });
      return;
    }
    const t = pick(pool), ds = others(pool, t, 2), byFact = rnd(2) === 0;
    const rot = () => (lv === 1 ? rnd(2) * 15 : rnd(61) - 30);
    quiz(this, {
      ask: byFact ? SHAPE_FACTS[t] : B(`Tap the ${SHAPES[t].n.en.toUpperCase()}.`, `${SHAPES[t].n.ko}을(를) 눌러요.`),
      askSay: byFact ? SHAPE_FACTS[t] : B(`Tap the ${SHAPES[t].n.en}.`, `${SHAPES[t].n.ko}을 눌러요.`),
      askExtra: S.lang === 'ko' && !byFact ? { t: SHAPES[t].n.en, lang: 'en-US' } : null,
      opts: [t, ...ds].map(k => ({ html: shapeSvg(k, rot()), ok: k === t })), cls: 'shapes',
      after: t === 'octagon' ? B('That is an octagon, like a stop sign 🛑.', '팔각형이에요. 정지 표지판 🛑 모양이에요.') : B(`That is a ${SHAPES[t].n.en}.`, `${SHAPES[t].n.ko}이에요.`), vocab: SHAPES[t].n.en
    });
  }
});

// ---------- 9. 3-D shapes in my world ----------
// 2026-11-20 (i-Ready K practice): more everyday things per solid (each one clearly that shape).
const SOLIDS = {
  sphere: { n: B('sphere', '구'), things: [['🏀', B('basketball', '농구공')], ['⚽', B('soccer ball', '축구공')], ['🌍', B('globe', '지구본')], ['🍊', B('orange', '오렌지')], ['⚾', B('baseball', '야구공')], ['🎾', B('tennis ball', '테니스공')], ['🎱', B('pool ball', '당구공')]] },
  cube: { n: B('cube', '정육면체'), things: [['🎲', B('game die', '주사위')], ['🧊', B('ice block', '얼음덩이')], ['🎁', B('gift box', '선물 상자')]] },
  cone: { n: B('cone', '원뿔'), things: [['🍦', B('ice cream', '아이스크림')], ['🥳', B('party hat', '고깔모자')], ['🎉', B('party popper', '파티 폭죽')], ['🥕', B('carrot', '당근')]] },
  cylinder: { n: B('cylinder', '원기둥'), things: [['🥫', B('tin can', '깡통')], ['🔋', B('battery', '건전지')], ['🧻', B('paper roll', '휴지 심')], ['🥁', B('drum', '북')], ['🪵', B('log', '통나무')], ['🕯️', B('candle', '양초')]] }
};
// 11-20 (서연: "또 당근이야" — the same objects came back within one round): prefer objects not used in the last few questions.
const SOLID_RECENT = [];
function solidThing(list) { const fresh = list.filter(x => !SOLID_RECENT.includes(x[0])), x = pick(fresh.length ? fresh : list); SOLID_RECENT.push(x[0]); if (SOLID_RECENT.length > 8) SOLID_RECENT.shift(); return x; }
function solidPair(list) { const a = solidThing(list), rest = list.filter(x => x !== a), b = rest.length ? solidThing(rest) : a; return [a, b, ...shuffle(list.filter(x => x !== a && x !== b))]; }
// Plain line drawings of the four solids (no real object), used where the answer is the shape itself.
function solidSvg(k) {
  const s = 'fill="#ffd9b8" stroke="#8a4b2a" stroke-width="3" stroke-linejoin="round"';
  const d = {
    sphere: `<circle cx="40" cy="40" r="30" ${s}/><ellipse cx="40" cy="40" rx="30" ry="9" fill="none" stroke="#8a4b2a" stroke-width="2" stroke-dasharray="4 4"/><circle cx="30" cy="28" r="6" fill="#fff" opacity=".7"/>`,
    cube: `<path d="M14 26L40 14L66 26L66 56L40 68L14 56Z" ${s}/><path d="M14 26L40 38L66 26M40 38V68" fill="none" stroke="#8a4b2a" stroke-width="3"/>`,
    cone: `<path d="M40 8L66 60Q40 76 14 60Z" ${s}/><ellipse cx="40" cy="60" rx="26" ry="8" fill="none" stroke="#8a4b2a" stroke-width="2"/>`,
    cylinder: `<path d="M16 18V62Q40 76 64 62V18" ${s}/><ellipse cx="40" cy="18" rx="24" ry="8" ${s}/>`
  }[k];
  return `<svg viewBox="0 0 80 80" style="width:clamp(56px,11dvh,84px);height:auto" role="img" aria-label="${L(SOLIDS[k].n)}">${d}</svg>`;
}
registerGame({
  id: 'shapes3d', subject: 'math', icon: '🧊', title: B('Shapes Around Me', '내 주변의 모양'), sub: B('Spheres, cubes, cones...', '공, 상자, 원뿔...'),
  area: AREA_MATH('3-D shapes'),
  play() {
    const keys = Object.keys(SOLIDS), t = pick(keys), ds = others(keys, t, 2);
    const mk = (k, ok) => { const [html, label] = solidThing(SOLIDS[k].things); return { html: `<span class="emo">${html}</span>`, label, ok }; };
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
    // A familiar wrong symbol requires following the pattern, not spotting the only familiar picture.
    const familiar = pick(Object.values(sym).filter(x => x !== ans));
    const choices = [ans, familiar, pick(pal.slice(0, 6).filter(x => x !== ans && x !== familiar))];
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
    const col = (c, n, selected = false) => `<div class="gcol"${selected ? ' style="outline:3px solid #a64b26;outline-offset:3px;border-radius:8px;background:#fff4d8"' : ''}><div class="gstack">${Array.from({ length: n }, () => `<span>${c}</span>`).join('')}</div><div class="glabel gword">${L(NAME[c])}</div></div>`;
    const show = `<div class="graph">${cats.map((c, i) => col(c, counts[i])).join('')}</div>`;
    const mode = rnd(2) === 0 ? 'most' : 'howmany';
    if (mode === 'most') {
      const top = Math.max(...counts);
      quiz(this, { ask: B('Which one has the MOST?', '가장 많은 것은 어느 것일까요?'), show, opts: cats.map((c, i) => ({ html: `<span class="emo">${c}</span>`, ok: counts[i] === top })), cls: 'shapes' });
    } else {
      const i = rnd(cats.length);
      quiz(this, { ask: B('Count the outlined group.', '테두리 안의 그림은 몇 개일까요?'), askSay: B(`How many ${NAME[cats[i]].en} pictures are in the outlined group?`, `테두리 안의 ${NAME[cats[i]].ko} 그림은 몇 개일까요?`), show: `<div class="graph">${cats.map((c, j) => col(c, counts[j], j === i)).join('')}</div>`, opts: numOpts(counts[i], 1, 7), after: B(`${counts[i]}`, `${counts[i]}`) });
    }
  }
});

(() => {
  const game = GAMES.find(g => g.id === 'shapes3d'), original = game.play;
  game.play = function () {
    if (!rnd(2)) return original.call(this);
    const keys = Object.keys(SOLIDS), t = pick(keys), [e, name] = solidThing(SOLIDS[t].things);
    // 2026-10-28 (sample S5 verdict): K cannot read shape names, so each answer is a drawn solid with its name under it.
    quiz(this, { ask: B('What solid shape does this look like?', '어떤 입체 모양과 닮았을까요?'), askExtra: { t: L(name) }, show: '<span class="emo">' + e + '</span><div style="font-size:clamp(16px,3dvh,22px)">' + L(name) + '</div>', opts: [t, ...others(keys, t, 2)].map(k => ({ html: solidSvg(k), label: SOLIDS[k].n, ok: k === t })), cls: 'shapes', after: name, vocab: name.en });
  };
})();

// 2026-11-20 (i-Ready K practice): L1 also shows a drawn solid and asks which everyday thing has that shape.
(() => {
  const game = GAMES.find(g => g.id === 'shapes3d'), original = game.play;
  game.play = function () {
    if (lvl(this.id) !== 1 || rnd(3)) return original.call(this);
    const keys = Object.keys(SOLIDS), t = pick(keys), right = solidThing(SOLIDS[t].things);
    const opts = [{ x: right, ok: true }, ...others(keys, t, 2).map(k => ({ x: solidThing(SOLIDS[k].things), ok: false }))];
    quiz(this, { ask: B('Which thing has this shape?', '이 모양인 물건은 어느 것일까요?'), show: solidSvg(t),
      opts: opts.map(o => ({ html: '<span class="emo">' + o.x[0] + '</span>', label: o.x[1], ok: o.ok })), cls: 'shapes',
      after: B(`The ${right[1].en} looks like a ${SOLIDS[t].n.en}.`, `${right[1].ko}: ${SOLIDS[t].n.ko} 모양이에요.`), vocab: SOLIDS[t].n.en });
  };
})();

// L2 transfers a familiar object's solid shape to a different object.
(() => {
  const game = GAMES.find(g => g.id === 'shapes3d'), original = game.play;
  game.play = function () {
    if (lvl(this.id) === 1) return original.call(this);
    const keys=Object.keys(SOLIDS), k=pick(keys), pair=solidPair(SOLIDS[k].things), source=pair[0];
    const items=[{x:pair[1],ok:true},...keys.filter(j=>j!==k).map(j=>({x:solidThing(SOLIDS[j].things),ok:false}))];
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
 const moreSets=(a,b,e='🍑')=>{const box=(n,name)=>`<div style="flex:0 1 auto;border:3px solid #f2b28c;border-radius:16px;padding:6px 10px;background:#fff"><div style="font-weight:800;font-size:clamp(22px,4.5dvh,34px);color:#c4552b">${name}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px;font-size:clamp(22px,min(5dvh,8.5vw),38px);line-height:1.1">${`<span>${e}</span>`.repeat(n)}</div></div>`;return `<div style="display:flex;gap:clamp(24px,8vw,72px);justify-content:center;align-items:flex-start">${box(a,'A')}${box(b,'B')}</div>`;};
 // 2026-11-20 (i-Ready K practice): the "how many more" question also uses other things (and "how many fewer in B"),
 // and a third of L2 rounds count a big scattered group (11 to 20).
 const MORE_THINGS=[['🍎',B('apples','사과는')],['⭐',B('stars','별은')],['🐟',B('fish','물고기는')],['🐞',B('ladybugs','무당벌레는')],['🌸',B('flowers','꽃은')],['🚗',B('cars','자동차는')],['🎈',B('balloons','풍선은')]];
 upgrade('count',()=>{
  if(!rnd(3)){const n=11+rnd(10),e=pick(['🍑','🍎','🐞','⭐','🦆','🐟','🌸','🚗','🎈','🐢']);return {ask:B('Tap each one: how many are there?','하나씩 눌러 세면 모두 몇 개일까요?'),show:`<div class="scatter">${Array.from({length:n},()=>`<button class="obj" style="transform:translate(${rnd(21)-10}px,${rnd(21)-10}px) rotate(${rnd(41)-20}deg)">${e}</button>`).join('')}</div>`,opts:numOpts(n,1,20),after:B(`${n}`,`${n}`),sd:{n,e},onRender:countTaps};}
  const a=2+rnd(9),b=1+rnd(a-1);
  if(!rnd(3))return {ask:B('How many more peaches are in A?','A의 복숭아는 몇 개 더 많을까요?'),show:moreSets(a,b),quietShow:true,opts:numO(a-b,[a,b,a-b+1],0,10),sd:{more:true}};
  const [e,name]=pick(MORE_THINGS),fewer=!rnd(3);
  return {ask:fewer?B('How many fewer are in B?','B는 몇 개 더 적을까요?'):B('How many more are in A?','A는 몇 개 더 많을까요?'),
   askSay:fewer?B(`How many fewer ${name.en} are in B than in A?`,`B의 ${name.ko} A보다 몇 개 더 적을까요?`):B(`How many more ${name.en} are in A than in B?`,`A의 ${name.ko} B보다 몇 개 더 많을까요?`),
   show:moreSets(a,b,e),quietShow:true,opts:numO(a-b,[a,b,a-b+1],0,10),sd:{more:true}};});
 upgrade('addsub',()=>{const a=2+rnd(4),b=1+rnd(3),c=1+rnd(a),ans=a+b-c;return {ask:B('How many peaches are left?','복숭아가 몇 개 남을까요?'),askSay:B(`${a} peaches. Get ${b} more, then give away ${c}. How many left?`,`${a}개에서 ${b}개를 받고 ${c}개를 주면 몇 개 남을까요?`),show:`<div class="bigword">${a} + ${b} − ${c} = ?</div>`,opts:numO(ans,[a+b,a-c,ans+1],0,10),sd:{l2:true,a,b}};});
 // 2026-11-20 (i-Ready K practice): the same two-step question also comes as a picture (full ten-frame + some + a dashed box),
 // and as 10 + ? = a teen number.
 upgrade('teens',()=>{const a=1+rnd(7),b=1+rnd(9-a),ans=10+a+b,r=rnd(5);
  if(r<2){const e=pick(['🍑','🍎','⭐','🐟','🌸','🐞','🚗','🎈']);return {ask:B('How many more to reach the total?','모두가 되려면 몇 개 더 필요할까요?'),askSay:B(`Ten and ${a} are here. The total will be ${ans}. How many more?`,`10개와 ${a}개가 있어요. 모두 ${ans}개가 되려면 몇 개 더 필요할까요?`),show:`<div class="story"><div class="frame mini">${Array.from({length:10},()=>`<div class="cell on">${e}</div>`).join('')}</div><span class="op">+</span>${emojiRow(a,e,'sm')}<span class="op">+</span><span class="bigword qbox">?</span><span class="op">=</span><span class="bigword">${ans}</span></div>`,opts:numO(b,[a,a+b,b+1],0,10),sd:{l2:true,a,b}};}
  if(r===2){const t=11+rnd(9);return {ask:B('What number makes it true?','어떤 수가 들어갈까요?'),askSay:B(`Ten and what make ${t}?`,`10과 몇을 합치면 ${t}${[2, 4, 5, 9].includes(t % 10) ? '가' : '이'} 될까요?`),show:`<div class="bigword eqline">10 + <span class="qbox">?</span> = ${t}</div>`,opts:numO(t-10,[t,t-9,t-11],0,19)};}
  return {ask:B('How many more to reach the total?','모두가 되려면 몇 개 더 필요할까요?'),askSay:B(`Ten and ${a} are here. The total will be ${ans}. How many more?`,`10개와 ${a}개가 있어요. 모두 ${ans}개가 되려면 몇 개 더 필요할까요?`),show:`<div class="bigword">10 + ${a} + ? = ${ans}</div>`,opts:numO(b,[a,a+b,b+1],0,10),sd:{l2:true,a,b}};});
})();
