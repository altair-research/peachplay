'use strict';
// Block Puzzle: drag three pieces onto the board and fill rows/columns to clear them.
// Adventure = 6 worlds x 5 levels (stars, a friend hatches per world, block styles to unlock), plus Endless and a Daily puzzle.
// Big clears can trigger an optional Bonus Question (counting, adding, letters...) that wins a Swap or a Bomb.
// Forgiving by design: no timers, nothing is taken away, and if nothing fits Peachy tidies up (adventure).
const BP_SHAPES = {
  dot: [[0, 0]], h2: [[0, 0], [1, 0]], h3: [[0, 0], [1, 0], [2, 0]], l3: [[0, 0], [0, 1], [1, 1]], o: [[0, 0], [1, 0], [0, 1], [1, 1]],
  h4: [[0, 0], [1, 0], [2, 0], [3, 0]], l4: [[0, 0], [0, 1], [0, 2], [1, 2]], t4: [[0, 0], [1, 0], [2, 0], [1, 1]],
  h5: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], r23: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], sq3: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]
};
const BP_SETS = { easy: ['dot', 'h2', 'h3', 'l3', 'o', 'h2', 'h3'], mid: ['dot', 'h2', 'h3', 'l3', 'o', 'h4', 'l4', 't4', 'h2', 'h3', 'l3'], full: ['h2', 'h3', 'l3', 'o', 'h4', 'l4', 't4', 'h5', 'r23', 'sq3', 'l3', 'o', 'h3'] };
const bpVariants = (key) => { const out = []; let c = BP_SHAPES[key]; for (let i = 0; i < 4; i++) { const s = JSON.stringify([...c].sort()); if (!out.some(v => JSON.stringify([...v].sort()) === s)) out.push(c); c = rotCells(c); } return out; };
const GEMS = {
  green: `<svg viewBox="0 0 24 24" class="gemsvg"><polygon points="12,1 15,9 23,12 15,15 12,23 9,15 1,12 9,9" fill="#2fd44a" stroke="#0b6b1c" stroke-width="1.3" stroke-linejoin="round"/><polygon points="12,5 13.6,10.4 19,12 13.6,13.6 12,19 10.4,13.6 5,12 10.4,10.4" fill="#8bf59b" opacity=".6"/></svg>`,
  orange: `<svg viewBox="0 0 24 24" class="gemsvg"><polygon points="12,2 22,9.5 18,21.5 6,21.5 2,9.5" fill="#ff9f1c" stroke="#a65a00" stroke-width="1.3" stroke-linejoin="round"/><polygon points="12,6 18.5,10.6 16.2,18 7.8,18 5.5,10.6" fill="#ffd27a" opacity=".55"/></svg>`
};
// six worlds; each has its own colours, a friend that hatches when the world is finished, and a block style it unlocks
const BP_WORLDS = [
  { e: '🍑', name: B('Peach Orchard', '복숭아 과수원'), bg: ['#ffe9d6', '#ffcfb0'], board: '#f4c9ab', cell: '#fff6ee', bd: '#e0a283', pal: ['#ff7a6b', '#ffa94d', '#f2cf4f', '#7cc95e', '#e8689f'], fx: ['🍑', '✨', '🌸'], friend: { e: '🐝', n: B('Buzzy the Bee', '붕붕 꿀벌') }, skin: 'heart' },
  { e: '🌊', name: B('Sunny Beach', '햇살 해변'), bg: ['#dff6ff', '#a9e3ff'], board: '#8fd0ea', cell: '#effbff', bd: '#5fb3d6', pal: ['#1fb5c4', '#4c9be8', '#ffcf4a', '#ff8a65', '#9a7bff'], fx: ['🫧', '🐚', '✨'], friend: { e: '🐬', n: B('Splashy the Dolphin', '첨벙 돌고래') }, skin: 'flower' },
  { e: '🚀', name: B('Star Space', '별빛 우주'), dark: true, bg: ['#2d3270', '#4b3a96'], board: '#5a55b0', cell: '#f0eeff', bd: '#9a8ff0', pal: ['#ff5d9e', '#ffcf3d', '#4dc3ff', '#9a7bff', '#3be8a0'], fx: ['⭐', '✨', '🌟'], friend: { e: '👽', n: B('Zippy the Alien', '지피 외계인') }, skin: 'star' },
  { e: '🦖', name: B('Dino Forest', '공룡 숲'), bg: ['#e4f7cf', '#b5e48c'], board: '#8fc46a', cell: '#f6fde9', bd: '#6aa645', pal: ['#4bb55b', '#f2a33c', '#9c7a62', '#1fa59a', '#c3cf2f'], fx: ['🍃', '🌿', '✨'], friend: { e: '🦕', n: B('Rexy the Dino', '공룡 렉시') }, skin: 'leaf' },
  { e: '🍭', name: B('Candy Land', '사탕 나라'), bg: ['#ffe3f1', '#ffc2e0'], board: '#f5a8cf', cell: '#fff2f9', bd: '#e57fb2', pal: ['#ff4f9a', '#ffae42', '#8a63d2', '#35c9de', '#8fcf4a'], fx: ['🍬', '🍭', '✨'], friend: { e: '🦄', n: B('Sparkle the Unicorn', '반짝 유니콘') }, skin: 'candy2' },
  { e: '❄️', name: B('Snowy Peak', '눈 덮인 산'), bg: ['#e8f4ff', '#c2dcfa'], board: '#9ec3ee', cell: '#f4faff', bd: '#78a4dc', pal: ['#3d96ff', '#6fc8f5', '#a67cff', '#ff7fa3', '#ffc94a'], fx: ['❄️', '✨', '☃️'], friend: { e: '🐧', n: B('Waddles the Penguin', '뒤뚱 펭귄') }, skin: 'snow' }
];
const BP_SKINS = { plain: { g: '' }, heart: { g: '♥' }, flower: { g: '✿' }, star: { g: '★' }, leaf: { g: '❦' }, candy2: { g: '●' }, snow: { g: '❄' } };
const BP_LEVELS = 30, PER = 5;
const bpWorldOf = (n) => Math.min(BP_WORLDS.length, Math.max(1, Math.ceil(n / PER)));
S.bp = Object.assign({ level: 1, best: 0, stars: {}, friends: [], skin: 'plain', daily: null }, S.bp || {});
function bpLevel(n) {
  const N = n <= 3 ? 6 : n <= 12 ? 7 : 8, set = n <= 3 ? 'easy' : n <= 10 ? 'mid' : 'full', world = bpWorldOf(n);
  if (n <= 2 || n % 3 !== 0) return { n, N, set, world, type: 'lines', goal: { lines: Math.min(8, 3 + Math.floor(n / 4)) } };
  const types = n < 9 ? ['green'] : ['green', 'orange'], cnt = Math.min(14, 4 + Math.floor(n / 2));
  return { n, N, set, world, type: 'gems', goal: Object.fromEntries(types.map(t => [t, cnt])) };
}
function bpTitle(cfg) { return cfg.daily ? B('Today\'s puzzle: clear 6 lines!', '오늘의 퍼즐: 줄 6개를 없애요!') : cfg.type === 'endless' ? B('Endless: get the highest score!', '끝없이! 최고 점수에 도전해요!') : cfg.type === 'lines' ? B(`Clear ${cfg.goal.lines} lines!`, `줄 ${cfg.goal.lines}개를 없애요!`) : B('Collect the gems!', '보석을 모아요!'); }
const bpStarsIn = (w) => Array.from({ length: PER }, (_, i) => S.bp.stars[(w - 1) * PER + i + 1] || 0).reduce((a, b) => a + b, 0);
const bpSkinsOpen = () => ['plain', ...S.bp.friends.map(w => BP_WORLDS[w - 1].skin)];
const bpMul32 = (a) => () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

// ---------- bonus questions (original, tiny, bilingual; wrong answers are never revealed) ----------
const BP_WORDS = [['🍎', 'apple', 'A'], ['🐱', 'cat', 'C'], ['🐶', 'dog', 'D'], ['🐸', 'frog', 'F'], ['🐙', 'octopus', 'O'], ['🌙', 'moon', 'M'], ['🐝', 'bee', 'B'], ['🍑', 'peach', 'P'], ['🦁', 'lion', 'L'], ['🐢', 'turtle', 'T'], ['☀️', 'sun', 'S'], ['🚀', 'rocket', 'R']];
const BP_STUFF = ['🍑', '⭐', '🐝', '🍎', '🌸', '🐟'];
function bpBonus(hard) {
  const kind = pick(hard ? ['count', 'add', 'compare', 'letter', 'after'] : ['count', 'add', 'compare', 'letter']), em = pick(BP_STUFF), num = (n, e) => `<span class="bq">${Array(n).fill(e).join('')}</span>`;
  const three = (ans, lo, hi) => { const s = new Set([ans]); let g = 0; while (s.size < 3 && g++ < 40) { const v = ans + pick([-2, -1, 1, 2]); if (v >= lo && v <= hi) s.add(v); } let v = lo; while (s.size < 3) s.add(v++); return shuffle([...s]); };
  if (kind === 'count') { const n = hard ? 4 + rnd(9) : 1 + rnd(5); return { id: 'count', ask: B('How many?', '몇 개일까요?'), show: num(n, em), opts: three(n, 1, 14).map(v => ({ t: String(v), ok: v === n })) }; }
  if (kind === 'add') { const a = 1 + rnd(hard ? 6 : 3), b = 1 + rnd(hard ? 5 : 2), ans = a + b; return { id: 'addsub', ask: B(`${a} + ${b} = ?`, `${a} + ${b} = ?`), show: num(a, em) + ' + ' + num(b, em), opts: three(ans, 2, 12).map(v => ({ t: String(v), ok: v === ans })) }; }
  if (kind === 'compare') { const a = hard ? 5 + rnd(6) : 1 + rnd(5); let b = a + pick([-2, -1, 1, 2]); if (b < 1) b = a + 1; return { id: 'compare', ask: B('Which has more?', '어느 쪽이 더 많아요?'), show: '', opts: shuffle([a, b]).map(v => ({ h: num(v, em), ok: v === Math.max(a, b) })), wide: true }; }
  if (kind === 'after') { const n = 2 + rnd(17); return { id: 'order', ask: B(`What comes after ${n}?`, `${n} 다음 수는?`), show: '', opts: three(n + 1, 1, 21).map(v => ({ t: String(v), ok: v === n + 1 })) }; }
  const w = pick(BP_WORDS), others = shuffle(BP_WORDS.filter(x => x[2] !== w[2])).slice(0, 2);
  return { id: 'letters', ask: B('Which letter does it start with?', '어떤 글자로 시작할까요?'), show: `<span class="bqe">${w[0]}</span><small>${w[1]}</small>`, opts: shuffle([w, ...others]).map(x => ({ t: x[2], ok: x === w })) };
}

// ---------- adventure map: worlds -> levels ----------
function bpMap() {
  const cur = Math.min(S.bp.level, BP_LEVELS), today = today_();
  view().innerHTML = `<div class="bpmap"><div class="bphead">${L(B('Block Puzzle', '블록 퍼즐'))}</div>
    <div class="bpworlds">${BP_WORLDS.map((w, i) => { const wn = i + 1, open = (wn - 1) * PER + 1 <= cur, fr = S.bp.friends.includes(wn); return `<button class="bpwc ${open ? '' : 'lock'}${w.dark ? ' dk' : ''}" data-w="${wn}" ${open ? '' : 'disabled'} style="--c1:${w.bg[0]};--c2:${w.bg[1]};--cb:${w.bd}"><span class="we">${open ? w.e : '🔒'}</span><b>${L(w.name)}</b><small>${fr ? w.friend.e : '🥚'} · ★ ${bpStarsIn(wn)}/${PER * 3}</small></button>`; }).join('')}</div>
    <div class="bpmodes"><button class="bpgo" id="bpgo">${L(B('Play level', '레벨 시작'))} ${cur}</button>
      <button class="bpend" id="bpdaily">🌟 ${L(B('Today\'s puzzle', '오늘의 퍼즐'))}${S.bp.daily && S.bp.daily.date === today && S.bp.daily.done ? ' ✓' : ''}</button><button class="bpend" id="bpend">♾ ${L(B('Endless', '끝없이'))} · ${S.bp.best}</button></div>
    <div class="bpskins"><span>${L(B('Blocks', '블록 모양'))}</span>${Object.keys(BP_SKINS).map(k => { const open = bpSkinsOpen().includes(k); return `<button class="bpsk ${S.bp.skin === k ? 'on' : ''}" data-k="${k}" ${open ? '' : 'disabled'} aria-label="${k}">${open ? `<i class="sk-${k}"></i>` : '🔒'}</button>`; }).join('')}</div></div>`;
  $$('.bpwc:not(.lock)').forEach(b => b.onclick = () => bpWorld(+b.dataset.w));
  $('#bpgo').onclick = () => bpPlay(cur); $('#bpend').onclick = () => bpPlay('endless'); $('#bpdaily').onclick = () => bpPlay('daily');
  $$('.bpsk:not([disabled])').forEach(b => b.onclick = () => { S.bp.skin = b.dataset.k; save(); bpMap(); });
  say(L(B('Pick a world!', '세계를 골라요!')));
}
const today_ = () => today();
function bpWorld(w) {
  const t = BP_WORLDS[w - 1], cur = Math.min(S.bp.level, BP_LEVELS), done = Math.max(0, Math.min(PER, cur - 1 - (w - 1) * PER)), fr = S.bp.friends.includes(w);
  view().innerHTML = `<div class="bpmap bpwp${t.dark ? ' dk' : ''}" style="--c1:${t.bg[0]};--c2:${t.bg[1]};--cb:${t.bd}"><div class="bpwtop"><button class="bpback" id="bpback" aria-label="${L(B('Back', '뒤로'))}">◀</button><div class="bphead">${t.e} ${L(t.name)}</div><span></span></div>
    <div class="bppath">${Array.from({ length: PER }, (_, i) => { const k = (w - 1) * PER + i + 1, st = S.bp.stars[k] || 0, state = k < cur ? 'done' : k === cur ? 'cur' : 'lock'; return `<button class="bpn ${state}" data-k="${k}" ${k > cur ? 'disabled' : ''} style="--o:${[8, 56, 22, 62, 30][i]}%"><b>${k}</b><small>${state === 'lock' ? '🔒' : '⭐'.repeat(st) || '·'}</small></button>`; }).join('')}</div>
    <div class="bpfriend"><span class="fe ${fr ? 'on' : ''}">${fr ? t.friend.e : '🥚'}</span><span>${fr ? L(t.friend.n) : L(B('Finish this world to hatch a friend!', '이 세계를 끝내면 친구가 태어나요!'))} ${fr ? '' : `(${done}/${PER})`}</span></div></div>`;
  $('#bpback').onclick = bpMap; $$('.bpn:not(.lock)').forEach(b => b.onclick = () => bpPlay(+b.dataset.k));
}

registerGame({
  id: 'blockpuzzle', subject: 'brain', icon: '🧩', title: B('Block Puzzle', '블록 퍼즐'), sub: B('Worlds, friends & bonus questions', '세계 모험, 친구, 보너스 질문'),
  area: AREA_BRAIN('Spatial planning'), rounds: 1,
  play() { bpMap(); }
});

// ---------- playing a level ----------
function bpPlay(which) {
  let cfg;
  if (which === 'endless') cfg = { n: 0, N: 8, set: 'full', type: 'endless', goal: {}, world: bpWorldOf(Math.min(S.bp.level, BP_LEVELS)) };
  else if (which === 'daily') { const d = today_(); cfg = { n: 0, N: 7, set: 'mid', type: 'lines', goal: { lines: 6 }, daily: true, world: 1 + (parseInt(d.replace(/-/g, ''), 10) % BP_WORLDS.length), seed: [...d].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7) }; }
  else cfg = bpLevel(which);
  const th = BP_WORLDS[cfg.world - 1], rng = cfg.seed ? bpMul32(cfg.seed) : Math.random, rr = (n) => Math.floor(rng() * n), pk = (a) => a[rr(a.length)];
  const N = cfg.N, gemTypes = cfg.type === 'gems' ? Object.keys(cfg.goal) : [], skin = BP_SKINS[S.bp.skin] || BP_SKINS.plain;
  const board = Array.from({ length: N }, () => Array(N).fill(null));
  let tray = [], clearing = null, busy = false, lines = 0, score = 0, got = { green: 0, orange: 0 }, rescued = false, done = false, drag = null;
  let combo = 0, moves = 0, lastBonus = -9, bonuses = 0, clears = 0, pow = { swap: 1, bomb: 0 }, bomb = false, pop = new Set(), bonusOpen = false;
  const ask = bpTitle(cfg), reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  view().innerHTML = `<div class="bpscreen${cfg.world === 3 ? ' dark' : ''}" style="--bg1:${th.bg[0]};--bg2:${th.bg[1]};--bb:${th.board};--bcell:${th.cell};--bd:${th.bd};--sk:'${skin.g}'"><div class="bphud" id="bphud"></div>
    <div class="bpboardwrap"><div class="bpboard" id="bpb" style="--n:${N}"></div><div class="bpfx" id="bpfx"></div><div class="bpbox" id="bpbox"></div></div>
    <div class="bptray" id="bptray"></div><div class="bphint" id="bphint"></div></div>`;
  const boardEl = $('#bpb'), trayEl = $('#bptray'), fxEl = $('#bpfx');
  const alive = () => document.body.contains(boardEl);
  const tile = (cell, cls = '') => cell ? `<div class="bpc f${cell.g ? ' gem' : ''} ${cls}" style="--tc:${cell.c}">${cell.g ? GEMS[cell.g] : ''}</div>` : '';
  const mood = (m, bump) => { const e = $('#bpm'); if (!e) return; e.innerHTML = PEACH_SVG(m); if (bump && !reduce) { e.classList.remove('jump'); void e.offsetWidth; e.classList.add('jump'); } };
  const hud = () => {
    const h = $('#bphud'); if (!h) return; const lv = cfg.daily ? '🌟' : cfg.n ? `${L(B('Lv', '레벨'))} ${cfg.n}` : '♾';
    let goals;
    if (cfg.type === 'lines') goals = `<div class="goal"><span class="gi2">🧱</span><b>${Math.max(0, cfg.goal.lines - lines)}</b></div>`;
    else if (cfg.type === 'gems') goals = gemTypes.map(t => `<div class="goal">${GEMS[t]}<b>${Math.max(0, cfg.goal[t] - got[t]) || '✓'}</b></div>`).join('');
    else goals = `<div class="goal"><span class="gi2">👑</span><b>${S.bp.best}</b></div><div class="bigscore2">${score}</div>`;
    h.innerHTML = `<div class="bpm" id="bpm">${PEACH_SVG('happy')}</div><div class="goals">${goals}<div class="lvl">${lv}</div></div>
      <div class="pows"><button class="pw" id="pwSwap" ${pow.swap ? '' : 'disabled'} aria-label="${L(B('Swap pieces', '블록 바꾸기'))}">🔄<i>${pow.swap}</i></button><button class="pw ${bomb ? 'on' : ''}" id="pwBomb" ${pow.bomb ? '' : 'disabled'} aria-label="${L(B('Bomb', '폭탄'))}">💣<i>${pow.bomb}</i></button></div>`;
    $('#pwSwap').onclick = useSwap; $('#pwBomb').onclick = toggleBomb;
  };
  const render = () => {
    if (!alive()) return;
    boardEl.className = 'bpboard' + (bomb ? ' bombing' : '');
    boardEl.innerHTML = board.map((r, y) => r.map((c, x) => { const i = y * N + x, cl = clearing && clearing.has(i); return `<div class="bpcell${cl ? ' clr' : ''}" data-i="${i}" ${cl ? `style="--d:${clearing.get(i)}"` : ''}>${c ? tile(c, pop.has(i) ? 'pop' : '') : ''}</div>`; }).join('')).join('');
    pop = new Set(); trayEl.innerHTML = tray.map((p, i) => `<div class="bpslot" data-i="${i}">${p ? pieceHtml(p, 'mini') : ''}</div>`).join(''); hud();
  };
  const dims = (p) => [Math.max(...p.cells.map(c => c[0])) + 1, Math.max(...p.cells.map(c => c[1])) + 1];
  const pieceHtml = (p, cls) => { const [w, h] = dims(p); return `<div class="bppiece ${cls}" style="--pw:${w};--ph:${h}">${Array.from({ length: w * h }, (_, i) => { const x = i % w, y = Math.floor(i / w), c = p.cells.find(q => q[0] === x && q[1] === y); return c ? tile({ c: p.col, g: c[2] }) : '<span></span>'; }).join('')}</div>`; };
  const fits = (p, col, row) => p.cells.every(([x, y]) => { const bx = col + x, by = row + y; return bx >= 0 && by >= 0 && bx < N && by < N && !board[by][bx]; });
  const anyFit = () => tray.some(p => p && Array.from({ length: N * N }, (_, i) => fits(p, i % N, Math.floor(i / N))).some(Boolean));
  const genPiece = () => {
    const key = pk(BP_SETS[cfg.set]), cells = bpVariants(key)[rr(bpVariants(key).length)].map(c => [c[0], c[1]]);
    if (gemTypes.length && rr(100) < 60) { const k = rr(cells.length); cells[k] = [cells[k][0], cells[k][1], pk(gemTypes)]; if (cells.length > 3 && rr(100) < 25) { const k2 = (k + 1 + rr(cells.length - 1)) % cells.length; cells[k2] = [cells[k2][0], cells[k2][1], pk(gemTypes)]; } }
    return { cells, col: pk(th.pal) };
  };
  const newTray = () => { tray = [genPiece(), genPiece(), genPiece()]; if (!anyFit()) tray[0] = { cells: [[0, 0]], col: pk(th.pal) }; };
  // ---- effects ----
  const cellXY = (idx) => { const b = boardEl.getBoundingClientRect(), w = fxEl.getBoundingClientRect(), cs = (boardEl.children[1].getBoundingClientRect().left - boardEl.children[0].getBoundingClientRect().left) || 30, c0 = boardEl.children[0].getBoundingClientRect(); return [c0.left - w.left + (idx % N + .5) * cs, c0.top - w.top + (Math.floor(idx / N) + .5) * cs]; };
  const burst = (set, cap = 22) => {
    if (reduce || !alive()) return; const ids = [...set], pick_ = ids.length > cap ? shuffle(ids).slice(0, cap) : ids;
    pick_.forEach((idx, k) => { const [x, y] = cellXY(idx), s = document.createElement('span'); s.className = 'bpp'; s.textContent = th.fx[k % th.fx.length]; s.style.cssText = `left:${x}px;top:${y}px;--dx:${(Math.random() - .5) * 120}px;--dy:${-40 - Math.random() * 90}px;--dr:${(Math.random() - .5) * 240}deg;animation-delay:${Math.min(k * 14, 260)}ms`; fxEl.appendChild(s); setTimeout(() => s.remove(), 1100); });
  };
  const popText = (txt, big) => { if (!alive()) return; const s = document.createElement('div'); s.className = 'bpcombo' + (big ? ' big' : ''); s.textContent = txt; fxEl.appendChild(s); setTimeout(() => s.remove(), 1100); };
  const chime = (n) => [0, 4, 7, 12, 16, 19].slice(0, Math.min(6, 2 + n)).forEach((st, i) => tone(523 * Math.pow(2, st / 12), 150, i * 0.075, 'sine', 0.13));
  const shake = () => { if (reduce) return; boardEl.classList.remove('shake'); void boardEl.offsetWidth; boardEl.classList.add('shake'); };
  const praise = (nl, cmb) => nl >= 4 || cmb >= 4 ? B('Peachy!!', '피치피치!!') : nl >= 3 || cmb >= 3 ? B('Awesome!', '최고예요!') : nl >= 2 || cmb >= 2 ? B('Great!', '멋져요!') : B('Nice!', '좋아요!');
  // ---- finish screens ----
  const overlay = (html) => { const o = document.createElement('div'); o.className = 'bpover'; o.innerHTML = html; document.body.appendChild(o); return o; };
  const finishWin = () => {
    done = true; const stars = rescued ? 2 : 3; record('blockpuzzle', true); addPeach(); if (cfg.daily) addPeach(); sfx('win'); confetti(150); mood('happy', true);
    let extra = '', next;
    if (cfg.daily) { S.bp.daily = { date: today_(), done: true }; next = L(B('Back to map', '지도로')); }
    else {
      S.bp.stars[cfg.n] = Math.max(S.bp.stars[cfg.n] || 0, stars); S.bp.level = Math.max(S.bp.level, Math.min(BP_LEVELS + 1, cfg.n + 1));
      const w = cfg.world; if (S.bp.level > w * PER && !S.bp.friends.includes(w)) { S.bp.friends.push(w); const f = BP_WORLDS[w - 1]; extra = `<div class="hatch"><span class="he">🥚</span><span class="hf">${f.friend.e}</span><p>${L(B('A friend hatched!', '친구가 태어났어요!'))}<br><b>${L(f.friend.n)}</b></p><p class="sk">${L(B('New block style unlocked: ', '새 블록 모양: '))}<b>${BP_SKINS[f.skin].g}</b></p></div>`; }
      next = cfg.n < BP_LEVELS ? L(B('Next level', '다음 레벨')) : L(B('Back to map', '지도로'));
    }
    save();
    const o = overlay(`<div class="bpcard"><h2>${L(cfg.daily ? B('Today\'s puzzle done!', '오늘의 퍼즐 완료!') : B('Level complete!', '레벨 완료!'))}</h2><div class="stars">${cfg.daily ? '🌟🌟' : '⭐'.repeat(stars) + '☆'.repeat(3 - stars)}</div>${extra}<button class="bpgo" id="bpnext">${next} ▶</button><button class="link" id="bpmap">${L(B('Map', '지도'))}</button></div>`);
    $('#bpnext').onclick = () => { o.remove(); !cfg.daily && cfg.n < BP_LEVELS ? bpPlay(cfg.n + 1) : bpMap(); }; $('#bpmap').onclick = () => { o.remove(); bpMap(); };
  };
  const finishEndless = () => {
    done = true; const best = score > S.bp.best; if (best) { S.bp.best = score; save(); } record('blockpuzzle', score >= 60); if (score >= 60) addPeach(); sfx(best ? 'win' : 'no'); if (best) confetti(120); mood('oops', true);
    const o = overlay(`<div class="bpcard"><h2>${L(B('No more room!', '자리가 없어요!'))}</h2><div class="bigscore2">${score}</div><p>${best ? L(B('New best score!', '새 최고 점수!')) : L(B('Best', '최고')) + ': ' + S.bp.best}</p><button class="bpgo" id="bpagain">${L(B('Play again', '다시 하기'))}</button><button class="link" id="bpmap">${L(B('Map', '지도'))}</button></div>`);
    $('#bpagain').onclick = () => { o.remove(); bpPlay('endless'); }; $('#bpmap').onclick = () => { o.remove(); bpMap(); };
  };
  const rescue = () => {                                              // nothing fits -> Peachy clears the bottom rows
    rescued = true; mood('oops', true); const hint = $('#bphint'); if (hint) hint.textContent = L(B('No room! Peachy tidies up.', '자리가 없어요! 피치가 정리해 줘요.'));
    const set = new Map(); for (let y = N - 1; y >= Math.ceil(N / 2); y--) for (let x = 0; x < N; x++) if (board[y][x]) set.set(y * N + x, x);
    clearing = set; render(); burst(set.keys(), 14); sfx('ok');
    setTimeout(() => { set.forEach((_, idx) => { board[Math.floor(idx / N)][idx % N] = null; }); clearing = null; render(); }, 460);
    setTimeout(() => { const h = $('#bphint'); if (h) h.textContent = ''; }, 2200);
  };
  // ---- power-ups ----
  const useSwap = () => { if (busy || done || !pow.swap) return; pow.swap--; newTray(); tone(660, 80, 0, 'triangle', 0.1); tone(880, 120, 0.08, 'triangle', 0.1); render(); if (cfg.type === 'endless' && !anyFit()) finishEndless(); };
  const toggleBomb = () => { if (busy || done || !pow.bomb) return; bomb = !bomb; const h = $('#bphint'); if (h) h.textContent = bomb ? L(B('Tap the board to blast a 3x3 spot!', '판을 눌러 3x3 칸을 터뜨려요!')) : L(ask); render(); };
  const blast = (idx) => {
    if (!bomb || busy || done) return; const cx = idx % N, cy = Math.floor(idx / N), set = new Map(); bomb = false; pow.bomb--;
    for (let y = cy - 1; y <= cy + 1; y++) for (let x = cx - 1; x <= cx + 1; x++) if (x >= 0 && y >= 0 && x < N && y < N && board[y][x]) set.set(y * N + x, Math.abs(x - cx) + Math.abs(y - cy));
    busy = true; clearing = set; set.forEach((_, i) => { const c = board[Math.floor(i / N)][i % N]; if (c && c.g) got[c.g]++; }); score += set.size * 2;
    tone(120, 260, 0, 'sawtooth', 0.12); tone(80, 300, 0.05, 'triangle', 0.14); shake(); render(); burst(set.keys(), 20); popText(L(B('Boom!', '펑!')), true); mood('happy', true);
    setTimeout(() => { set.forEach((_, i) => { board[Math.floor(i / N)][i % N] = null; }); clearing = null; busy = false; if (!alive()) return; const h = $('#bphint'); if (h) h.textContent = L(ask);
      if (cfg.type === 'gems' && gemTypes.every(t => got[t] >= cfg.goal[t])) { render(); finishWin(); return; } render(); }, 460);
  };
  boardEl.onclick = (e) => { const c = e.target.closest('.bpcell'); if (c && bomb) blast(+c.dataset.i); };
  // ---- bonus question ----
  const openBonus = () => {
    if (done || bonusOpen || bonuses >= 3 || !alive()) return; bonusOpen = true; busy = true; bonuses++; lastBonus = moves;
    const q = bpBonus(cfg.world >= 3 || lvl('blockpuzzle') >= 2), box = $('#bpbox'); let tries = 0, first = true;
    box.className = 'bpbox on'; box.innerHTML = `<div class="bpq"><div class="bqh">⭐ ${L(B('Bonus question!', '보너스 질문!'))}</div><div class="bqa">${L(q.ask)}</div>${q.show ? `<div class="bqs">${q.show}</div>` : ''}<div class="bqo ${q.wide ? 'wide' : ''}">${q.opts.map((o, i) => `<button class="bqb" data-i="${i}">${o.h || o.t}</button>`).join('')}</div><button class="link" id="bqskip">${L(B('Skip', '건너뛰기'))}</button><div class="bqm" id="bqm"></div></div>`;
    say(L(q.ask)); const close = () => { box.className = 'bpbox'; box.innerHTML = ''; bonusOpen = false; busy = false; };
    $('#bqskip').onclick = close;
    $$('.bqb').forEach(b => b.onclick = () => {
      const o = q.opts[+b.dataset.i], msg = $('#bqm'); if (o.ok) {
        record(q.id, first); sfx('ok'); const r = rr(2) === 0 ? 'bomb' : 'swap'; pow[r]++; confetti(40); mood('happy', true); msg.textContent = (r === 'bomb' ? '💣 ' : '🔄 ') + L(r === 'bomb' ? B('You won a Bomb!', '폭탄을 얻었어요!') : B('You won a Swap!', '바꾸기를 얻었어요!'));
        $$('.bqb').forEach(x => x.disabled = true); setTimeout(() => { close(); render(); }, 1300);
      } else { if (first) record(q.id, false); first = false; tries++; b.disabled = true; sfx('no'); msg.textContent = L(B('Not quite. Try again!', '아쉬워요. 다시 해 봐요!')); if (tries >= 2) { $$('.bqb').forEach(x => x.disabled = true); msg.textContent = L(B('Nice try! Maybe next time.', '잘했어요! 다음에 또 해 봐요.')); setTimeout(close, 1100); } }
    });
  };
  // ---- placing a piece ----
  const place = (i, col, row) => {
    const p = tray[i]; if (!p || busy || done || !fits(p, col, row)) return false;
    p.cells.forEach(([x, y, g]) => { board[row + y][col + x] = { c: p.col, g }; pop.add((row + y) * N + col + x); }); tray[i] = null; score += p.cells.length; moves++; tone(300 + 40 * p.cells.length, 90, 0, 'triangle', 0.1);
    try { navigator.vibrate && navigator.vibrate(12); } catch (e) {}
    const fr = [], fc = []; for (let y = 0; y < N; y++) if (board[y].every(Boolean)) fr.push(y); for (let x = 0; x < N; x++) if (board.every(r => r[x])) fc.push(x);
    const set = new Map(); fr.forEach(y => { for (let x = 0; x < N; x++) set.set(y * N + x, x); }); fc.forEach(x => { for (let y = 0; y < N; y++) if (!set.has(y * N + x)) set.set(y * N + x, y); });
    const after = () => {
      if (!tray.some(Boolean)) newTray();
      render();
      if (cfg.type === 'endless') { if (!anyFit()) finishEndless(); return; }
      if (!anyFit()) rescue();
    };
    if (!set.size) { combo = 0; render(); after(); return true; }
    combo++; clears++; busy = true; clearing = set; const nl = fr.length + fc.length; lines += nl; score += 10 * nl * nl * combo;
    set.forEach((_, idx) => { const c = board[Math.floor(idx / N)][idx % N]; if (c && c.g) { got[c.g]++; tone(1175, 160, 0.05, 'sine', 0.08); } });
    chime(nl + combo - 1); render(); burst(set.keys()); popText(L(praise(nl, combo)) + (combo >= 2 ? ` x${combo}` : ''), nl >= 3 || combo >= 3); mood('happy', true); if (nl >= 2) shake(); if (nl >= 3) confetti(30);
    setTimeout(() => {
      set.forEach((_, idx) => { board[Math.floor(idx / N)][idx % N] = null; }); clearing = null; busy = false; if (!alive()) return;
      const goalDone = cfg.type === 'lines' ? lines >= cfg.goal.lines : cfg.type === 'gems' ? gemTypes.every(t => got[t] >= cfg.goal[t]) : false;
      if (goalDone) { render(); finishWin(); return; }
      after();
      if (!done && (nl >= 2 || clears % 3 === 0) && moves - lastBonus >= 4) setTimeout(openBonus, 350);
    }, 460);
    return true;
  };
  // ---- drag and drop ----
  const geom = () => { const c0 = boardEl.children[0].getBoundingClientRect(), c1 = boardEl.children[1].getBoundingClientRect(); return { left: c0.left, top: c0.top, cs: c1.left - c0.left, size: c0.width }; };
  const clearPreview = () => $$('#bpb .bpcell').forEach(c => c.classList.remove('gv', 'gx', 'gw'));
  const target = (e) => { const g = geom(), p = drag.p, [w, h] = dims(p), left = e.clientX - (w * g.cs) / 2, top = e.clientY - h * g.cs - 54; drag.el.style.left = left + 'px'; drag.el.style.top = top + 'px'; return { col: Math.round((left - g.left) / g.cs), row: Math.round((top - g.top) / g.cs) }; };
  const preview = (col, row) => {
    clearPreview(); const p = drag.p, ok = fits(p, col, row);
    p.cells.forEach(([x, y]) => { const bx = col + x, by = row + y; if (bx >= 0 && by >= 0 && bx < N && by < N) { const el = boardEl.children[by * N + bx]; el.classList.add(ok ? 'gv' : 'gx'); el.style.setProperty('--gc', p.col); } });
    if (ok) {                                                          // glow the lines that would clear
      const t = board.map(r => r.map(Boolean)); p.cells.forEach(([x, y]) => { t[row + y][col + x] = true; });
      for (let y = 0; y < N; y++) if (t[y].every(Boolean)) for (let x = 0; x < N; x++) boardEl.children[y * N + x].classList.add('gw');
      for (let x = 0; x < N; x++) if (t.every(r => r[x])) for (let y = 0; y < N; y++) boardEl.children[y * N + x].classList.add('gw');
    }
  };
  const endDrag = (e, cancel) => {
    if (!drag) return; const d = drag; drag = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onCancel);
    const t = (!cancel && e) ? (() => { drag = d; const r = target(e); drag = null; return r; })() : null; d.el.remove(); clearPreview();
    const slot = trayEl.children[d.i]; if (slot) slot.classList.remove('lift');
    if (t && place(d.i, t.col, t.row)) return; if (t) tone(180, 120, 0, 'triangle', 0.1);
  };
  const onMove = (e) => { if (!drag) return; const t = target(e); preview(t.col, t.row); e.preventDefault(); };
  const onUp = (e) => endDrag(e, false), onCancel = (e) => endDrag(e, true);
  trayEl.onpointerdown = (e) => {
    const slot = e.target.closest('.bpslot'); if (!slot || busy || done || drag) return; const i = +slot.dataset.i, p = tray[i]; if (!p) return;
    if (bomb) { bomb = false; render(); }
    const g = geom(), [w, h] = dims(p), el = document.createElement('div'); el.className = 'bpdrag'; el.style.setProperty('--cs', g.cs + 'px'); el.style.setProperty('--sk', `'${skin.g}'`); el.innerHTML = pieceHtml(p, 'full'); el.style.width = w * g.cs + 'px'; el.style.height = h * g.cs + 'px'; document.body.appendChild(el);
    drag = { i, p, el }; trayEl.children[i].classList.add('lift'); const t = target(e); preview(t.col, t.row); tone(440, 50, 0, 'sine', 0.06);
    window.addEventListener('pointermove', onMove, { passive: false }); window.addEventListener('pointerup', onUp); window.addEventListener('pointercancel', onCancel); e.preventDefault();
  };
  newTray(); render(); say(L(ask)); $('#bphint').textContent = L(ask);
  // short "world x level" splash
  const sp = document.createElement('div'); sp.className = 'bpsplash'; sp.innerHTML = `<span>${th.e}</span><b>${L(th.name)}</b><small>${cfg.daily ? L(B('Today\'s puzzle', '오늘의 퍼즐')) : cfg.n ? L(B('Level', '레벨')) + ' ' + cfg.n : L(B('Endless', '끝없이'))}</small>`; $('.bpboardwrap').appendChild(sp); setTimeout(() => sp.remove(), 1400);
  if (cfg.n === 1) setTimeout(() => { const h = $('#bphint'); if (h && !done && alive() && !bomb) h.textContent = L(B('Drag a block to the board. Fill a whole row or column!', '블록을 판에 끌어다 놓아요. 가로나 세로 한 줄을 채워요!')); }, 1800);
  window.__bp = { cfg, N, board, get tray() { return tray; }, get lines() { return lines; }, get got() { return got; }, get done() { return done; }, get busy() { return busy; }, get pow() { return pow; }, get bonusOpen() { return bonusOpen; }, fits, place, anyFit, render, openBonus, blast, useSwap, toggleBomb };
}
