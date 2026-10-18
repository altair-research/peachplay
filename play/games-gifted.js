'use strict';
// Challenge Zone: original reasoning and enrichment games that practice the same KINDS of thinking that
// gifted screening looks at (verbal reasoning, quantitative reasoning, nonverbal/figural reasoning, creativity).
// No official test items are used. See docs/gifted-research.md. Not a test and no promise of admission.
const AREA_CH = (u) => B(`Challenge · ${u}`, `도전 · ${u}`);
const FIGC = ['#ef476f', '#118ab2', '#06d6a0', '#ffb703'];
const figSvg = (f, px = 64) => {
  const r = 24 * (f.size || 1), c = f.color; let s;
  if (f.shape === 'circle') s = `<circle cx="30" cy="30" r="${r}"`;
  else if (f.shape === 'square') s = `<rect x="${30 - r}" y="${30 - r}" width="${2 * r}" height="${2 * r}" rx="3"`;
  else if (f.shape === 'triangle') s = `<polygon points="30,${30 - r} ${30 + r},${30 + r} ${30 - r},${30 + r}"`;
  else s = `<polygon points="${Array.from({ length: 10 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180, rr = i % 2 ? r * 0.45 : r; return (30 + rr * Math.cos(a)).toFixed(1) + ',' + (31 + rr * Math.sin(a)).toFixed(1); }).join(' ')}"`;
  return `<svg viewBox="0 0 60 60" width="${px}" height="${px}" class="fig">${s} fill="${c}" stroke="#1d3557" stroke-width="2.2" stroke-linejoin="round"/></svg>`;
};
const SHP4 = ['circle', 'square', 'triangle', 'star'];

// ---------- 1. Picture analogies ----------
const ANALOGY = [
  { rel: B('grows into', '자라서 되는 것'), p: [['🌰', '🌳'], ['🥚', '🐔'], ['🐛', '🦋'], ['🌱', '🌻'], ['👶', '🧑']] },
  { rel: B('goes with', '짝이 되는 것'), p: [['🪥', '🦷'], ['👟', '🦶'], ['🧤', '✋'], ['👓', '👀'], ['☂️', '🌧️']] },
  { rel: B('opposite', '반대'), p: [['☀️', '🌙'], ['🔥', '🧊'], ['⬆️', '⬇️'], ['😀', '😢'], ['🐘', '🐭']] },
  { rel: B('lives in', '사는 곳'), p: [['🐟', '🌊'], ['🐦', '☁️'], ['🐝', '🌻'], ['🐒', '🌴'], ['🐧', '❄️']] }
];
registerGame({
  id: 'analogy', subject: 'gifted', icon: '🔗', title: B('Picture Analogies', '그림 짝 찾기'), sub: B('Same relationship', '같은 관계 찾기'),
  area: AREA_CH('Verbal reasoning'),
  play() {
    if (lvl('analogy') === 2) {
      const sh=shuffle(SHP4), co=shuffle(FIGC), a={shape:sh[0],color:co[0],size:1}, b={shape:sh[0],color:co[1],size:.6}, c={shape:sh[1],color:co[0],size:1}, answer={shape:sh[1],color:co[1],size:.6};
      quiz(this,{ask:B('Apply BOTH changes from the first pair to the third picture.','첫 짝에서 달라진 두 속성을 셋째 그림에도 적용해요.'),show:figSvg(a)+' → '+figSvg(b)+'<br>'+figSvg(c)+' → ?',opts:[answer,{...answer,size:1},{...answer,color:co[0]}].map(f=>({html:figSvg(f,58),ok:f===answer})),cls:'shapes'});return;
    }
    const g = pick(ANALOGY), [a, b] = shuffle(g.p).slice(0, 2), others2 = ANALOGY.filter(x => x !== g).flatMap(x => x.p.map(q => q[1])), ds = shuffle([...new Set([a[1], ...others2])]).filter(e => e !== b[1]).slice(0, lvl('analogy') === 2 ? 3 : 2);
    const cell = (e) => `<span class="ac">${e}</span>`;
    quiz(this, {
      ask: B('These two go together. Which picture goes with the third?', '위의 두 그림은 짝이에요. 아래 그림의 짝은?'),
      show: `<div class="ag">${cell(a[0])}${cell(a[1])}${cell(b[0])}<span class="ac q">?</span></div>`,
      opts: [b[1], ...ds].map(e => ({ html: `<span class="emo">${e}</span>`, ok: e === b[1] })), cls: 'shapes', after: B(`${a[0]} goes with ${a[1]}, so ${b[0]} goes with ${b[1]}!`, `${a[0]}-${a[1]}처럼 ${b[0]}-${b[1]}!`),
      onCorrect() { $('.ag .q').outerHTML = cell(b[1]); }
    });
  }
});

// ---------- 2. Figure matrices ----------
registerGame({
  id: 'matrix', subject: 'gifted', icon: '🔲', title: B('Complete the Grid', '빈칸 채우기'), sub: B('Find the pattern', '규칙을 찾아요'),
  area: AREA_CH('Nonverbal reasoning'),
  play() {
    const lv = lvl('matrix'), n = lv === 1 ? 2 : 3, sh = shuffle(SHP4).slice(0, n), co = shuffle(FIGC).slice(0, n), sizes = [0.62, 0.8, 1];
    const cell = (r, c) => lv === 1 ? { shape: sh[c], color: co[r], size: 1 } : { shape: sh[c], color: co[(r + c) % 3], size: sizes[r] };
    const mr = n - 1, mc = lv === 1 ? n - 1 : rnd(n), ans = cell(mr, mc), key = (f) => `${f.shape}${f.color}${f.size}`, seen = new Set([key(ans)]), ds = [];
    let guard = 0; while (ds.length < 2 && guard++ < 80) { const d = { ...ans }, w = pick(['shape', 'color', 'size']); if (w === 'shape') d.shape = pick(SHP4.filter(s => s !== ans.shape)); else if (w === 'color') d.color = pick(FIGC.filter(c => c !== ans.color)); else if (lv === 2) d.size = pick(sizes.filter(s => s !== ans.size)); else continue; if (!seen.has(key(d))) { seen.add(key(d)); ds.push(d); } }
    const cells = []; for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) cells.push(r === mr && c === mc ? '<span class="mxc q">?</span>' : `<span class="mxc">${figSvg(cell(r, c), 50)}</span>`);
    quiz(this, {
      ask: B('Which picture completes the grid?', '빈칸에 들어갈 그림은?'), show: `<div class="mxg" style="--n:${n}">${cells.join('')}</div>`,
      opts: [ans, ...ds].map(f => ({ html: figSvg(f, 58), ok: f === ans })), cls: 'shapes', after: B('You found the pattern!', '규칙을 찾았어요!'),
      onCorrect() { $('.mxg .q').outerHTML = `<span class="mxc">${figSvg(ans, 50)}</span>`; }
    });
  }
});

// ---------- 3. Figure classification ----------
registerGame({
  id: 'classify', subject: 'gifted', icon: '🧩', title: B('Which One Belongs?', '어느 것이 어울릴까?'), sub: B('Same group', '같은 무리 찾기'),
  area: AREA_CH('Nonverbal reasoning'),
  play() {
    if (lvl('classify') === 2) {
      const shape=pick(SHP4), color=pick(FIGC), otherShape=pick(SHP4.filter(x=>x!==shape)), otherColor=pick(FIGC.filter(x=>x!==color));
      const ans={shape,color,size:1}, candidates=[ans,{shape,color:otherColor,size:1},{shape:otherShape,color,size:1}];
      quiz(this,{ask:B('Match BOTH the shape of the first and the color of the second.','첫 그림의 모양과 둘째 그림의 색을 모두 맞춰요.'),show:figSvg({shape,color:otherColor,size:1})+' + '+figSvg({shape:otherShape,color,size:1}),opts:candidates.map(f=>({html:figSvg(f,58),ok:f===ans})),cls:'shapes'});return;
    }
    const rule = pick(lvl('classify') === 1 ? ['shape', 'color'] : ['shape', 'color', 'size']), sizes = [0.6, 1], rv = { shape: pick(SHP4), color: pick(FIGC), size: pick(sizes) };
    const mk = (keep) => { const f = { shape: pick(SHP4), color: pick(FIGC), size: pick(sizes) }; if (keep) f[rule] = rv[rule]; else { const o = rule === 'shape' ? SHP4.filter(s => s !== rv.shape) : rule === 'color' ? FIGC.filter(c => c !== rv.color) : sizes.filter(s => s !== rv.size); f[rule] = pick(o); } return f; };
    const fk = (f) => `${f.shape}${f.color}${f.size}`; let ex, ans, ds, guard = 0;
    do { ex = Array.from({ length: 3 }, () => mk(true)); ans = mk(true); ds = [mk(false), mk(false)]; if (rule === 'shape' || rule === 'color') [ans, ...ds, ...ex].forEach(f => { f.size = 1; }); } while (new Set([ans, ...ds].map(fk)).size < 3 && guard++ < 60);
    quiz(this, {
      ask: B('Look at these three. Which picture belongs with them?', '이 세 그림을 보세요. 어느 그림이 같은 무리일까요?'), show: `<div class="ag">${ex.map(f => `<span class="ac">${figSvg(f, 54)}</span>`).join('')}<span class="ac q">?</span></div>`,
      opts: [ans, ...ds].map(f => ({ html: figSvg(f, 58), ok: f === ans })), cls: 'shapes', after: rule === 'shape' ? B('They all have the same shape!', '모두 같은 모양이에요!') : rule === 'color' ? B('They are all the same color!', '모두 같은 색이에요!') : B('They are all the same size!', '모두 같은 크기예요!')
    });
  }
});

// ---------- 4. Turn the shape (spatial rotation) ----------
const CHIRAL = [[[0, 0], [0, 1], [0, 2], [1, 2]], [[1, 0], [2, 0], [0, 1], [1, 1]], [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]], [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]]];
const normC = (c) => { const mx = Math.min(...c.map(p => p[0])), my = Math.min(...c.map(p => p[1])); return c.map(([x, y]) => [x - mx, y - my]); };
const keyC = (c) => JSON.stringify(normC(c).map(p => p.join(',')).sort());
const flipC = (c) => { const mx = Math.max(...c.map(p => p[0])); return c.map(([x, y]) => [mx - x, y]); };
const rotN = (c, k) => { let r = c; for (let i = 0; i < k; i++) r = rotCells(r); return normC(r); };
const gridC = (c, col, px = 18) => { const n = normC(c), w = Math.max(...n.map(p => p[0])) + 1, h = Math.max(...n.map(p => p[1])) + 1; return `<div class="rotg" style="--w:${w};--h:${h};--px:${px}px">${Array.from({ length: w * h }, (_, i) => n.some(p => p[0] === i % w && p[1] === Math.floor(i / w)) ? `<i style="background:${col}"></i>` : '<b></b>').join('')}</div>`; };
registerGame({
  id: 'rotate', subject: 'gifted', icon: '🔄', title: B('Turn the Shape', '모양 돌리기'), sub: B('Same shape, turned', '같은 모양, 돌려 놓은 것'),
  area: AREA_CH('Spatial reasoning'),
  play() {
    const base = pick(lvl('rotate') === 1 ? CHIRAL.slice(0, 2) : CHIRAL), col = pick(FIGC), k = 1 + rnd(3), good = rotN(base, k), bads = [];
    let guard = 0; while (bads.length < 2 && guard++ < 40) { const m = rotN(flipC(base), rnd(4)); if (keyC(m) !== keyC(good) && !bads.some(b => keyC(b) === keyC(m))) bads.push(m); }
    const o = (c, ok) => ({ html: gridC(c, col, 22), ok });
    quiz(this, { ask: B('Which one is the SAME shape, just turned around?', '같은 모양을 돌려 놓은 것은 어느 것일까요?'), show: gridC(base, col, 26), opts: [o(good, true), ...bads.map(b => o(b, false))], cls: 'shapes', after: B('Turning does not change a shape!', '돌려도 모양은 그대로예요!') });
  }
});

// ---------- 5. Number series ----------
registerGame({
  id: 'numseries', subject: 'gifted', icon: '🔢', title: B('Number Patterns', '숫자 규칙'), sub: B('What comes next?', '다음 숫자는?'),
  area: AREA_CH('Quantitative reasoning'),
  play() {
    const lv = lvl('numseries'), types = lv === 1 ? ['up1', 'up2', 'up5', 'up10', 'down1'] : ['up2', 'up3', 'up5', 'down2', 'dbl', 'alt'];
    const t = pick(types); let seq, ans;
    const run = (s, d, n = 5) => Array.from({ length: n }, (_, i) => s + d * i);
    if (t === 'up1') seq = run(1 + rnd(8), 1); else if (t === 'up2') seq = run(lv === 1 ? 2 * (1 + rnd(3)) : 1 + rnd(8), 2); else if (t === 'up3') seq = run(3 * (1 + rnd(3)), 3);
    else if (t === 'up5') seq = run(5 * (1 + rnd(3)), 5); else if (t === 'up10') seq = run(10 * (1 + rnd(3)), 10); else if (t === 'down1') seq = run(9 + rnd(4), -1); else if (t === 'down2') seq = run(14 + rnd(4) * 2, -2);
    else if (t === 'dbl') { const s = 1 + rnd(2); seq = [s, s * 2, s * 4, s * 8, s * 16]; } else { const s = 1 + rnd(5); seq = [s, s + 1, s + 3, s + 4, s + 6]; }
    ans = seq[4]; const shown = seq.slice(0, 4); const set = new Set([ans]); while (set.size < 3) { const v = ans + pick([-2, -1, 1, 2, 3]); if (v > 0) set.add(v); }
    quiz(this, {
      ask: B('What number comes next?', '다음에 올 숫자는?'), show: `<div class="train">${shown.map(n => `<div class="car"><div class="n">${n}</div></div>`).join('')}<div class="car gap"><div class="n">?</div></div></div>`,
      opts: [...set].map(v => ({ html: `<span class="num">${v}</span>`, ok: v === ans })), after: B(`${seq.join(', ')}`, `${seq.join(', ')}`),
      onCorrect() { const g = $('.car.gap'); g.classList.remove('gap'); g.querySelector('.n').textContent = ans; }
    });
  }
});

// ---------- 6. Number analogies ----------
registerGame({
  id: 'numanalogy', subject: 'gifted', icon: '➗', title: B('Number Pairs', '숫자 짝'), sub: B('Same rule, new numbers', '같은 규칙, 새 숫자'),
  area: AREA_CH('Quantitative reasoning'),
  play() {
    const lv = lvl('numanalogy'), rule = pick(lv === 1 ? [['+1', x => x + 1], ['+2', x => x + 2], ['double', x => x * 2]] : [['+3', x => x + 3], ['-2', x => x - 2], ['double', x => x * 2], ['+5', x => x + 5], ['-1', x => x - 1]]), f = rule[1];
    const a = 2 + rnd(5), c = a + 8; let b = 2 + rnd(6); if (b === a) b++; const ans = f(b); if (ans < 0) return this.play();
    quiz(this, {
      ask: B('Find the rule. What number goes in the box?', '규칙을 찾아요. 빈칸에 들어갈 숫자는?'), show: `<div class="bigword eqline"><span>${a}</span> → <span>${f(a)}</span>, <span>${c}</span> → <span>${f(c)}</span>,<br><span>${b}</span> → <span class="qbox">?</span></div>`,
      opts: numOpts(ans, 0, 40), after: B(`${a} → ${f(a)} and ${b} → ${ans}.`, `${a} → ${f(a)}, ${b} → ${ans}.`)
    });
  }
});

// ---------- 7. Add and subtract past ten (enrichment above K) ----------
registerGame({
  id: 'add20', subject: 'gifted', icon: '➕', title: B('Big Sums', '큰 수 계산'), sub: B('Add and subtract to 20', '20까지 덧셈 뺄셈'),
  area: AREA_CH('Achievement: math'),
  play() {
    const sub = lvl('add20') === 2 && rnd(2) === 0; let a, b, ans, txt;
    if (sub) { a = 11 + rnd(8); b = 2 + rnd(Math.min(8, a - 3)); ans = a - b; txt = `${a} − ${b}`; } else { a = 4 + rnd(6); b = Math.min(9, 11 - a + rnd(6) + (lvl('add20') === 1 ? 0 : 2)); ans = a + b; txt = `${a} + ${b}`; }
    quiz(this, { ask: B('What is the answer?', '답은 얼마일까요?'), show: `<div class="bigword eqline">${txt} = <span class="qbox">?</span></div>`, opts: numOpts(ans, 0, 25), after: B(`${txt} = ${ans}`, `${txt} = ${ans}`) });
  }
});

// ---------- 8. Skip counting ----------
registerGame({
  id: 'skipcount', subject: 'gifted', icon: '🦘', title: B('Skip Counting', '건너뛰어 세기'), sub: B('Count by 2s, 5s, 10s', '2씩, 5씩, 10씩'),
  area: AREA_CH('Achievement: math'),
  play() {
    const lv = lvl('skipcount'), step = pick(lv === 1 ? [2, 5, 10] : [2, 3, 4, 5, 10]), back = lv === 2 && rnd(3) === 0, start = (lv === 1 ? 0 : step * rnd(4)) + step;
    const seq = Array.from({ length: 5 }, (_, i) => back ? start + step * (5 - i) : start + step * i), ans = seq[4], shown = seq.slice(0, 4), set = new Set([ans]);
    while (set.size < 3) { const v = ans + pick([-step, step, -1, 1]); if (v > 0) set.add(v); }
    quiz(this, { ask: back ? B(`Count backward by ${step}s. What comes next?`, `${step}씩 거꾸로 세어요. 다음은?`) : B(`Count by ${step}s. What comes next?`, `${step}씩 세어요. 다음은?`), show: `<div class="train">${shown.map(n => `<div class="car"><div class="n">${n}</div></div>`).join('')}<div class="car gap"><div class="n">?</div></div></div>`,
      opts: [...set].map(v => ({ html: `<span class="num">${v}</span>`, ok: v === ans })), after: B(seq.join(', '), seq.join(', ')), onCorrect() { const g = $('.car.gap'); g.classList.remove('gap'); g.querySelector('.n').textContent = ans; } });
  }
});

// ---------- 9. Who is tallest? (deductive reasoning) ----------
const NAMES = [['Ben', '벤'], ['Mia', '미아'], ['Sam', '샘'], ['Zoe', '조이'], ['Leo', '레오'], ['Ava', '아바']];
const COMP = [['taller', '키가 커요', 'tallest', '키가 가장 큰 사람은'], ['faster', '더 빨라요', 'fastest', '가장 빠른 사람은'], ['older', '나이가 더 많아요', 'oldest', '나이가 가장 많은 사람은']];
registerGame({
  id: 'logic', subject: 'gifted', icon: '🧠', title: B('Who Is It?', '누구일까?'), sub: B('Think it through', '차근차근 생각해요'),
  area: AREA_CH('Verbal reasoning'),
  play() {
    const n = lvl('logic') === 1 ? 3 : 4, ppl = shuffle(NAMES).slice(0, n), c = pick(COMP), lines = ppl.slice(0, n - 1).map((p, i) => [p, ppl[i + 1]]);
    const en = lines.map(([a, b]) => `${a[0]} is ${c[0]} than ${b[0]}.`).join(' '), ko = lines.map(([a, b]) => `${a[1]}는 ${b[1]}보다 ${c[1]}.`).join(' ');
    const ds = ppl.slice(1);
    quiz(this, {
      ask: B(`Who is the ${c[2]}?`, `${c[3]} 누구일까요?`), show: `<div class="logictext">${L(B(en, ko))}</div>`,
      opts: ppl.map(p => ({ html: `<span class="word">${p[0]}${S.lang === 'ko' ? ' · ' + p[1] : ''}</span>`, ok: p === ppl[0] })), cls: 'words', after: B(`${ppl[0][0]} is the ${c[2]}!`, `${ppl[0][1]}!`), vocab: `${ppl[0][0]} is the ${c[2]}!`
    });
  }
});

// ---------- 10. Many uses (creative fluency) ----------
const USES = [
  { o: '🥄', n: B('spoon', '숟가락'), good: [['🏖️', B('dig in sand', '모래 파기')], ['🥁', B('drum stick', '북채')], ['🎤', B('pretend microphone', '마이크 놀이')], ['🪞', B('see your face in it', '얼굴 비춰 보기')]], bad: [['🚀', B('fly to space', '우주로 날아가기')], ['🚗', B('drive on the road', '도로에서 운전하기')], ['🌧️', B('make it rain', '비 내리기')]] },
  { o: '📦', n: B('box', '상자'), good: [['🏠', B('a little house', '작은 집')], ['⛵', B('a boat', '배')], ['🤖', B('robot costume', '로봇 옷')], ['🥁', B('a drum', '북')]], bad: [['🍽️', B('eat it for dinner', '저녁으로 먹기')], ['🌙', B('turn it into the moon', '달로 바꾸기')], ['🐘', B('feed it to an elephant', '코끼리에게 먹이기')]] },
  { o: '🧦', n: B('sock', '양말'), good: [['🧸', B('a hand puppet', '손 인형')], ['🪙', B('hold coins', '동전 넣기')], ['🧽', B('dust a shelf', '먼지 닦기')], ['🎁', B('wrap a small gift', '작은 선물 싸기')]], bad: [['📞', B('call a friend', '친구에게 전화하기')], ['🌳', B('plant it as a tree', '나무로 심기')], ['🚌', B('ride it to school', '타고 학교 가기')]] },
  { o: '🪣', n: B('bucket', '양동이'), good: [['💧', B('carry water', '물 나르기')], ['🎩', B('a funny hat', '우스운 모자')], ['🥁', B('a drum', '북')], ['🌱', B('plant flowers in it', '꽃 심기')]], bad: [['🛁', B('use it as a bath for a whale', '고래 목욕시키기')], ['📱', B('send a text message', '문자 보내기')], ['🌈', B('paint the sky', '하늘 칠하기')]] }
];
registerGame({
  id: 'uses', subject: 'gifted', icon: '💡', title: B('Many Uses', '여러 가지 쓰임'), sub: B('What else can it be?', '또 무엇이 될 수 있을까?'),
  area: AREA_CH('Creativity'), rounds: 3,
  play() {
    const u = pick(USES); if (dup(this, u.o)) return this.play();
    const ask = B(`What else can a ${u.n.en} be used for? Tap ${lvl('uses')===2?4:3} ideas that could work!`, `${u.n.ko}은(는) 또 어디에 쓸 수 있을까요? 쓸 수 있는 생각 ${lvl('uses')===2?4:3}개를 눌러요!`), items = shuffle([...u.good.map(g => ({ g, ok: true })), ...u.bad.map(g => ({ g, ok: false }))]);
    view().innerHTML = `<div class="prompt">${L(ask)}<button class="say" id="sp">🔊</button></div><div class="show"><span class="emo">${u.o}</span></div>
      <div class="opts shapes imagine">${items.map((it, i) => `<button class="opt idea" data-i="${i}"><span class="emo">${it.g[0]}</span><span class="ol">${labelText(it.g[1])}</span></button>`).join('')}</div>
      <div class="fact" id="fact"></div><pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    $('#sp').onclick = () => say(L(ask)); say(L(ask));
    let found = 0, done = false, silly = false;
    $$('.idea').forEach(b => b.onclick = () => {
      if (done || b.classList.contains('picked')) return; const it = items[+b.dataset.i];
      if (it.ok) { b.classList.add('picked'); found++; tone(500 + 90 * found, 120); if (found >= (lvl('uses')===2?4:3)) { done = true; record('uses', !silly); if (!silly) addPeach(); $('#cheer').textContent = L(B('So creative! Can you think of one more?', '정말 창의적이에요! 하나 더 생각해 볼까요?')); nextButton(() => this.play(), { auto: 3000 }); } }
      else { silly = true; b.classList.add('no'); $('#fact').textContent = L(B('Hmm, that one would not really work. Try another!', '음, 그건 어렵겠어요. 다른 생각을 해 봐요!')); setTimeout(() => b.classList.remove('no'), 500); tone(200, 120, 0, 'triangle', 0.1); }
    });
  }
});
