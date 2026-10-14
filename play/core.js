'use strict';
// Core: device-local state, speech, helpers, and the shared multiple-choice quiz engine.
// Validators: saved data can come from an old version, a hand-edited file or a restored backup, so it is checked before use.
const GRADE_LIST = ['K', '1', '2', '3', '4', '5'];
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);
const numOr = (v, d = 0) => (Number.isFinite(v) ? v : d);
function cleanProf(p) {                                   // -> { active, list } or null when no valid child remains
  try {
    const seen = new Set(), list = (p && Array.isArray(p.list) ? p.list : []).filter(k => isObj(k) && typeof k.id === 'string' && /^[A-Za-z0-9_-]{1,24}$/.test(k.id) && !seen.has(k.id) && seen.add(k.id)).slice(0, 5)
      .map(k => ({ id: k.id, name: typeof k.name === 'string' ? k.name.slice(0, 16) : '', avatar: typeof k.avatar === 'string' && k.avatar ? k.avatar.slice(0, 8) : '🍑', grade: GRADE_LIST.includes(k.grade) ? k.grade : 'K' }));
    return list.length ? { active: list.some(k => k.id === p.active) ? p.active : list[0].id, list } : null;
  } catch (e) { return null; }
}
function cleanState(s) {                                  // keeps only known, well-typed fields
  const o = {}; if (!isObj(s)) return o;
  if (s.lang === 'en' || s.lang === 'ko') o.lang = s.lang;
  if (Number.isFinite(s.peaches) && s.peaches >= 0) o.peaches = Math.floor(s.peaches);
  if (isObj(s.stats)) { o.stats = {}; Object.entries(s.stats).forEach(([k, v]) => { if (isObj(v)) o.stats[k] = { right: Math.max(0, numOr(v.right)), wrong: Math.max(0, numOr(v.wrong)), streak: Math.max(0, numOr(v.streak)), level: Math.min(3, Math.max(1, numOr(v.level, 1))), recent: typeof v.recent === 'string' && /^[01]{0,6}$/.test(v.recent) ? v.recent : '' }; }); }
  if (isObj(s.addr)) o.addr = { street: typeof s.addr.street === 'string' ? s.addr.street.slice(0, 80) : '', city: typeof s.addr.city === 'string' ? s.addr.city.slice(0, 40) : '' };
  if (s.profile === null || isObj(s.profile)) { o.profile = s.profile; if (isObj(o.profile)) { o.profile = Object.assign({}, o.profile); if ('diag' in o.profile && !(isObj(o.profile.diag) && Array.isArray(o.profile.diag.missed) && o.profile.diag.missed.every(x => typeof x === 'string'))) delete o.profile.diag; if ('report' in o.profile && !(isObj(o.profile.report) && Array.isArray(o.profile.report.picks) && o.profile.report.picks.every(p => isObj(p) && typeof p.id === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(p.id) && Number.isFinite(p.score) && p.score >= 0 && Array.isArray(p.reasons) && p.reasons.every(r => typeof r === 'string')))) delete o.profile.report; } }
  if (Array.isArray(s.checks)) o.checks = s.checks.filter(c => isObj(c) && Array.isArray(c.items)).slice(-40).map(c => {
    const items = c.items.filter(it => isObj(it) && typeof it.id === 'string' && it.id.length <= 40 && typeof it.ok === 'boolean').map(it => ({ id: it.id, lv: Math.min(3, Math.max(1, numOr(it.lv, 1))), ok: it.ok }));
    return { at: typeof c.at === 'string' ? c.at.slice(0, 16) : '', scope: typeof c.scope === 'string' ? c.scope.slice(0, 12) : 'all', ...(Array.isArray(c.est) ? { est: c.est.filter(e => Array.isArray(e) && e.length === 2 && ['num','alg','meas','geo','pa','ph','hfw','voc','lit','inf'].includes(e[0]) && Number.isInteger(e[1]) && e[1] >= 0 && e[1] <= 7) } : {}), grade: GRADE_LIST.includes(c.grade) ? c.grade : 'K', items, ok: items.filter(x => x.ok).length, total: items.length };
  }).filter(c => c.items.length);
  if (Array.isArray(s.stickers)) o.stickers = s.stickers.filter(x => typeof x === 'string').slice(0, 200);
  if (isObj(s.bp)) o.bp = { level: Math.min(31, Math.max(1, Math.floor(numOr(s.bp.level, 1)))), best: Math.max(0, numOr(s.bp.best)), stars: isObj(s.bp.stars) ? Object.fromEntries(Object.entries(s.bp.stars).filter(([, v]) => Number.isFinite(v)).map(([k, v]) => [k, Math.min(3, Math.max(0, v))])) : {}, friends: Array.isArray(s.bp.friends) ? s.bp.friends.filter(Number.isInteger) : [], skin: typeof s.bp.skin === 'string' ? s.bp.skin : 'plain', daily: isObj(s.bp.daily) ? s.bp.daily : null };
  if (typeof s.last === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(s.last)) o.last = s.last;
  if (s.skin === 'peachy' || s.skin === 'explorer') o.skin = s.skin;
  if (['light', 'dark', 'system'].includes(s.theme)) o.theme = s.theme;
  if (Array.isArray(s.fav)) o.fav = s.fav.filter(x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(x)).slice(0, 30);
  if (Array.isArray(s.review)) {
    const seen = new Set();
    o.review = s.review.filter(x => isObj(x) && typeof x.key === 'string' && /^[A-Za-z0-9_-]{1,60}$/.test(x.key) && typeof x.id === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(x.id) && Number.isInteger(x.lv) && x.lv >= 1 && x.lv <= 3 && !seen.has(x.key) && seen.add(x.key)).slice(-50).map(x => ({ key: x.key, id: x.id, lv: x.lv }));
  }
  ['muted', 'introSeen', 'showK', 'sfxOff', 'voiceOff', 'calm', 'readable'].forEach(k => { if (typeof s[k] === 'boolean') o[k] = s[k]; });
  if (isObj(s.hist)) { o.hist = {}; Object.entries(s.hist).forEach(([d, v]) => { if (/^\d{4}-\d{2}-\d{2}$/.test(d) && isObj(v)) { const g = {}; if (isObj(v.g)) Object.entries(v.g).forEach(([id, x]) => { if (Array.isArray(x) && x.length === 2 && x.every(Number.isFinite)) g[id] = [Math.max(0, x[0]), Math.max(0, x[1])]; }); o.hist[d] = { r: Math.max(0, numOr(v.r)), w: Math.max(0, numOr(v.w)), g }; } }); }
  if (isObj(s.metWords)) {
    o.metWords = Object.fromEntries(Object.entries(s.metWords).filter(([word, date]) =>
      /^[a-z]+(?: [a-z]+)*$/.test(word) && word.length <= 40 && typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date) &&
      Number.isFinite(Date.parse(date + 'T00:00:00Z')) && new Date(date + 'T00:00:00Z').toISOString().slice(0, 10) === date &&
      (typeof window.cleanDictionaryHistory !== 'function' || window.cleanDictionaryHistory({ [word]: date })[word])
    ).slice(-300));
  }
  return o;
}
// Children on this device: each has its own saved data (the first child keeps the original key).
const PKEY = 'sag.profiles';
let PROF = { active: 'p1', list: [{ id: 'p1', name: '', avatar: '🍑', grade: 'K' }] };
try { const raw = localStorage.getItem(PKEY); if (raw) PROF = cleanProf(JSON.parse(raw)) || PROF; } catch (e) {}
const KEY = PROF.active === 'p1' ? 'sag.v2' : 'sag.v2.' + PROF.active;
const saveProf = () => { try { localStorage.setItem(PKEY, JSON.stringify(PROF)); } catch (e) {} };
const curKid = () => PROF.list.find(k => k.id === PROF.active) || PROF.list[0];
const today = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const freshStat = () => ({ right: 0, wrong: 0, streak: 0, level: 1 });
let S = { lang: 'en', peaches: 0, stats: {}, addr: { street: '', city: '' } };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, cleanState(JSON.parse(raw))); } catch (e) {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
const T = () => I18N[S.lang];
const L = (o) => (typeof o === 'string' ? o : (o[S.lang] || o.en));
const B = (en, ko) => ({ en, ko });
const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const view = () => $('#view');
const rnd = (n) => Math.floor(Math.random() * n);
const pick = (a) => a[rnd(a.length)];
const shuffle = (a) => { const r = [...a]; for (let i = r.length - 1; i > 0; i--) { const j = rnd(i + 1); [r[i], r[j]] = [r[j], r[i]]; } return r; };
const others = (arr, not, n) => shuffle(arr.filter(x => x !== not)).slice(0, n);
const stat = (id) => (S.stats[id] = S.stats[id] || freshStat());
const DIAG = { active: false };                    // quick-check mode (see profile.js)
const lvl = (id) => (DIAG.active ? (DIAG.lv || 1) : SESSION.review ? SESSION.review[SESSION.n].lv : stat(id).level);

// Speech is always paired with visible text/visuals, so muted devices (and missing voices) still work.
function say(text, lang, keepQueue) {
  try {
    if (S.muted || S.voiceOff || !('speechSynthesis' in window) || !text) return;
    if (!keepQueue) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || T().speech; u.rate = 0.85;
    speechSynthesis.speak(u);
  } catch (e) {}
}

function renderPeaches() {
  const b = Math.floor(S.peaches / 10), r = S.peaches % 10;
  $('#peaches').textContent = (b ? `🧺${b} ` : '') + `🍑${r}`;
  const sc = $('#stkChip'); if (sc) sc.textContent = `🏆${(S.stickers || []).length}`;
}
function addPeach() { S.peaches++; save(); renderPeaches(); }

// 4 clean answers in a row -> level up (max 2); every 3rd miss -> level down.
const MISS = {};                                     // games whose current round already logged a miss (so the finish is not logged twice)
function record(id, ok) {
  if (DIAG.active) return;
  if (SESSION.review) {
    if (ok) reviewSolved();
    else MISS[id] = true;
    return;
  }
  if (!ok && !MISS[id] && id !== 'blockpuzzle') { // puzzle score is not a first-attempt question; its bonus questions use their own IDs
    const list = S.review = S.review || [];
    list.push({ key: Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 12), id, lv: lvl(id) });
    S.review = list.slice(-50);
  }
  if (!ok) MISS[id] = true;
  const s = stat(id);
  if (SESSION.id === id) { SESSION.done = (SESSION.done || 0) + (ok ? 1 : 0); }
  const h = ((S.hist = S.hist || {})[today()] = S.hist[today()] || { r: 0, w: 0, g: {} }), hg = (h.g[id] = h.g[id] || [0, 0]);
  if (ok) { h.r++; hg[0]++; } else { h.w++; hg[1]++; }
  // level follows RECENT play (last 6 rounds): 5 clean answers in a row go up (a 2-option guess does that 1 time in 32), 3 misses in the last 5 go down
  s.recent = ((s.recent || '') + (ok ? '1' : '0')).slice(-6);
  if (ok) { s.right++; s.streak++; if (s.streak >= 5 && s.level < 2) { s.level++; s.streak = 0; s.recent = ''; } }
  else { s.wrong++; s.streak = 0; if (s.level > 1 && (s.recent.slice(-5).match(/0/g) || []).length >= 3) { s.level--; s.recent = ''; } }
  save();
}

// End of a round: a clean first-try finish counts as right; a round that had a miss counts as wrong once (not again if the miss was already logged).
function recordFinal(id, missed) { if (SESSION.review) { reviewSolved(); MISS[id] = false; return; } if (!missed) record(id, true); else if (!MISS[id]) record(id, false); MISS[id] = false; }
// ---- sound effects, mascot, confetti, session bar ----
let audioCtx = null;
function tone(freq, ms, when = 0, type = 'sine', gain = 0.14) {
  try {
    if (S.muted || S.sfxOff) return; audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime + when, o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq; g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.001, t + ms / 1000);
    o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + ms / 1000 + 0.02);
  } catch (e) {}
}
const beep = (freq, ms = 280) => tone(freq, ms);
function sfx(kind) {
  if (kind === 'ok') { tone(523, 150, 0); tone(659, 150, 0.12); tone(784, 280, 0.24); }
  else if (kind === 'no') { tone(220, 260, 0, 'triangle', 0.16); tone(165, 340, 0.18, 'triangle', 0.16); }
  else if (kind === 'win') [523, 659, 784, 1047].forEach((f, i) => tone(f, 300, i * 0.15));
}
function confetti(count = 60) {
  try {
    if (S.calm || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    const c = document.getElementById('fx'); if (!c) return; const ctx = c.getContext('2d'); c.width = innerWidth; c.height = innerHeight;
    const cols = ['#ff7e5f', '#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#8338ec'];
    const ps = Array.from({ length: count }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 140, y: innerHeight * 0.45, vx: (Math.random() - .5) * 10, vy: -Math.random() * 10 - 3, r: 4 + Math.random() * 5, c: cols[rnd(cols.length)], rot: Math.random() * 6, vr: (Math.random() - .5) * .4 }));
    let f = 0; const step = () => { ctx.clearRect(0, 0, c.width, c.height); ps.forEach(p => { p.vy += 0.35; p.x += p.vx; p.y += p.vy; p.rot += p.vr; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); }); if (++f < 85) requestAnimationFrame(step); else ctx.clearRect(0, 0, c.width, c.height); };
    requestAnimationFrame(step);
    setTimeout(() => ctx.clearRect(0, 0, c.width, c.height), 2800);       // safety: never leave confetti on screen
  } catch (e) {}
}
// Peachy, the peach mascot
const PEACH_SVG = (mood = 'happy') => `<svg viewBox="0 0 64 64" class="peachy ${mood}" aria-hidden="true"><defs><radialGradient id="pg" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#ffd9bd"/><stop offset=".55" stop-color="#ff9a76"/><stop offset="1" stop-color="#ef6a58"/></radialGradient></defs>
<path d="M32 12c-14 0-24 10-24 25 0 12 10 20 24 20s24-8 24-20C56 22 46 12 32 12z" fill="url(#pg)"/><path d="M32 14c1-7 6-11 13-11-1 7-6 11-13 11z" fill="#4caf50"/><path d="M32 13c3-3 6-5 9-6" stroke="#2e7d32" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<circle cx="19" cy="40" r="4.2" fill="#ff7f8a" opacity=".55"/><circle cx="45" cy="40" r="4.2" fill="#ff7f8a" opacity=".55"/>
${mood === 'oops' ? '<path d="M20 28l7 2M44 28l-7 2" stroke="#3a2a2a" stroke-width="2" stroke-linecap="round"/><circle cx="24" cy="34" r="3" fill="#3a2a2a"/><circle cx="40" cy="34" r="3" fill="#3a2a2a"/><path d="M25 48q7-6 14 0" stroke="#3a2a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/>' : '<circle cx="24" cy="34" r="3.4" fill="#3a2a2a"/><circle cx="40" cy="34" r="3.4" fill="#3a2a2a"/><circle cx="25.2" cy="32.8" r="1.1" fill="#fff"/><circle cx="41.2" cy="32.8" r="1.1" fill="#fff"/><path d="M24 43q8 9 16 0" stroke="#3a2a2a" stroke-width="2.6" fill="none" stroke-linecap="round"/>'}</svg>`;
// <pk-cheer>: assigning textContent shows the mascot, plays a sound and (for good answers) throws confetti
class PkCheer extends HTMLElement {
  connectedCallback() { this.setAttribute("role", "status"); this.setAttribute("aria-live", "polite"); }
  set textContent(v) {
    this._t = v || ''; this.replaceChildren(); if (!this._t) return;
    const bad = (this._t === T().again || this._t === T().tooMany);
    this.insertAdjacentHTML('beforeend', PEACH_SVG(bad ? 'oops' : 'happy')); const s = document.createElement('span'); s.textContent = this._t; this.appendChild(s);
    if (bad) sfx('no'); else { sfx('ok'); confetti(34); try { navigator.vibrate && navigator.vibrate(25); } catch (e) {} }
  }
  get textContent() { return this._t || ''; }
}
if (!customElements.get('pk-cheer')) customElements.define('pk-cheer', PkCheer);
function updateBar() { const i = document.querySelector('#sbar i'); if (i) i.style.width = Math.min(100, Math.round(100 * SESSION.n / (SESSION.rounds || ROUNDS))) + '%'; }
// a new screen always starts at the top (the home list may have been scrolled)
new MutationObserver((ms) => { if (ms.some(m => [...m.addedNodes].some(n => n.id !== 'nx'))) window.scrollTo(0, 0); }).observe(document.getElementById('view'), { childList: true });
new MutationObserver(() => { const b = document.getElementById('sbar'); if (b) b.style.visibility = (document.querySelector('#view > .prompt') && !DIAG.active) ? 'visible' : 'hidden'; }).observe(document.getElementById('view'), { childList: true });

const ALL_STICKERS = ['🦄', '🐶', '🐱', '🐼', '🦁', '🐯', '🐸', '🐙', '🦋', '🐢', '🐬', '🦖', '🚀', '🏆', '🎈', '🍦', '🎨', '⚽', '🌈', '⭐', '🌻', '🍉', '🚂', '🐝', '🦊', '🐧', '🐘', '🦒', '🦆', '🐞', '🍓', '🎸', '🚁', '🌙', '☀️', '🍩', '🧸', '🎁', '🔔', '🍑'];
S.stickers = S.stickers || [];

// A play session = a few rounds of one game (or a mixed run), so rounds never repeat endlessly.
const ROUNDS = 10;
const SESSION = { id: null, n: 0, mix: false, done: 0 };
// Generated rounds can contain closures and interactive state: store only game + level.
function reviewSolved() {
  const it = SESSION.review[SESSION.n];
  if (!SESSION.reviewAnswered) { SESSION.done++; SESSION.reviewAnswered = true; }
  S.review = (S.review || []).filter(x => x.key !== it.key); save();
}
function startReview() {
  quitDiag();
  const pool = (cleanState({ review: S.review }).review || []).filter(x => gameById(x.id) && !CHECK_SKIP.includes(x.id));
  S.review = pool; save();
  if (!pool.length) return home();
  const items = Array.from({ length: ROUNDS }, (_, i) => pool[i % Math.min(pool.length, ROUNDS)]);
  NEXT_TOK++;
  Object.assign(SESSION, { review: items, n: 0, done: 0, mix: false, rounds: ROUNDS });
  reviewStep();
}
function reviewStep() {
  if (SESSION.n >= SESSION.rounds) {
    SESSION.review = null;
    view().innerHTML = `<h1>🎉 ${T().roundDone}</h1><p class="tag">${T().gotRight(SESSION.done, ROUNDS)}</p><button class="next" id="reviewHome">🏠 ${T().pickAnother}</button>`;
    $('#reviewHome').onclick = home; say(T().roundDone); return;
  }
  const it = SESSION.review[SESSION.n]; SESSION.id = it.id; SESSION.reviewAnswered = false;
  MISS[it.id] = false; updateBar(); gameById(it.id).play();
}
const recent = {};                                   // per game: keys of the last rounds, to avoid repeats
// true if this round's key was seen in the last rounds (caller should regenerate); gives up after 8 tries
function dup(game, key) {
  const r = (recent[game.id] = recent[game.id] || []); game._tries = game._tries || 0;
  if (r.includes(key) && game._tries < 8) { game._tries++; return true; }
  game._tries = 0; r.push(key); if (r.length > 5) r.shift(); return false;
}
function launch(game, mix) {
  SESSION.review = null; NEXT_TOK++;
  if (!DIAG.active && !mix) { S.last = game.id; save(); }                     // for the home screen's Continue button
  Object.keys(MISS).forEach(k => { MISS[k] = false; });
  Object.assign(SESSION, { id: game.id, n: 0, mix: !!mix, done: 0, rounds: mix ? Math.min(3, game.rounds || 3) : (game.rounds || ROUNDS) });
  updateBar(); game.play();
}
function surprise() {                                // mixed run: different game every couple of rounds
  const picks = (typeof currentPicks === 'function' ? currentPicks(3) : []).map(p => p.id);
  const pool = visibleGames().filter(g => g.id !== SESSION.id && !(SESSION.hist || []).slice(-4).includes(g.id));
  const g = (picks.length && rnd(2) === 0 ? GAMES.find(x => x.id === pick(picks)) : null) || pick(pool);
  SESSION.hist = [...(SESSION.hist || []), g.id]; launch(g, true);
}
function sessionEnd(game) {
  const t = T(), good = SESSION.done, free = ALL_STICKERS.filter(s => !S.stickers.includes(s)), sticker = free.length && !SESSION.mix ? pick(free) : null;
  if (sticker) { S.stickers.push(sticker); save(); renderPeaches(); }
  view().innerHTML = `<h1>🎉 ${t.roundDone}</h1><p class="tag">${t.gotRight(good, SESSION.rounds)}</p>
    ${sticker ? `<div class="newsticker"><div class="stk">${sticker}</div><div>${t.newSticker} (${S.stickers.length}/${ALL_STICKERS.length})</div></div>` : ''}
    <div class="menu intro"><button class="big math" id="again"><span class="gi">🔁</span>${t.playAgain}<small>${t.againSub}</small></button>
    <button class="big read" id="mixbtn"><span class="gi">🎲</span>${t.surprise}<small>${t.surpriseSub}</small></button>
    <button class="big ss" id="goHome"><span class="gi">🏠</span>${t.pickAnother}<small>${t.anotherSub}</small></button></div>`;
  $('#again').onclick = () => launch(game); $('#mixbtn').onclick = surprise; $('#goHome').onclick = home;
  say(t.roundDone); sfx('win'); confetti(150);
}
let NEXT_TOK = 0;
// Shows a "Next" button and moves on by itself after a short pause (tap to go sooner).
function nextButton(fn, opts = {}) {
  const tok = ++NEXT_TOK;
  setTimeout(() => {
    const cheer = $('#cheer'); if (!cheer || tok !== NEXT_TOK) return;
    cheer.insertAdjacentHTML('afterend', `<button class="next" id="nx">${T().next}</button>`);
    const btn = $('#nx');
    const go = () => {
      if (tok !== NEXT_TOK || !document.body.contains(btn)) return;
      NEXT_TOK++; SESSION.n++; updateBar();
      if (SESSION.review) return reviewStep();
      Object.keys(MISS).forEach(k => { MISS[k] = false; });
      const g = GAMES.find(x => x.id === SESSION.id);
      if (!g || SESSION.n < SESSION.rounds) return fn();
      return SESSION.mix ? surprise() : sessionEnd(g);
    };
    btn.onclick = go;
    if (opts.auto !== false && !DIAG.active) { const f = $('#fact'); setTimeout(go, opts.auto || Math.min(4200, 1300 + 45 * (f ? f.textContent.length : 0))); }
  }, 450);
}

// Generic multiple-choice round.
// item: { ask, show?, opts:[{html,label?,ok?}], after?, vocab?, onRender?, onCorrect?, cls? }
function quiz(game, item) {
  MISS[game.id] = false;
  const askText = L(item.ask);
  const key = askText + '|' + (item.show || '').replace(/style="[^"]*"/g, '') + '|' + item.opts.map(o => o.html + (o.ok ? '*' : '')).sort().join(',');
  if (dup(game, key)) return game.play();
  const opts = shuffle(item.opts);
  view().innerHTML = `
    <div class="prompt">${askText}<button class="say" id="sp" aria-label="${T().listen}">🔊</button></div>
    ${item.show ? `<div class="show">${item.show}</div>` : ''}
    <div class="opts ${item.cls || ''}">${opts.map((o, i) => `<button class="opt" data-i="${i}">${o.html}${o.label ? `<span class="ol">${labelText(o.label)}</span>` : ''}</button>`).join('')}</div>
    <pk-cheer class="cheer" id="cheer"></pk-cheer><div class="fact" id="fact" role="status"></div>`;
  const ask = () => { say(item.askSay ? L(item.askSay) : askText); if (item.askExtra) say(item.askExtra.t, item.askExtra.lang, true); };
  $('#sp').onclick = ask; ask();
  const optTexts = () => $$('.opt').map(b => (b.querySelector('.word,.num') || b).innerText.replace(/\s+/g, ' ').trim()).filter(t => /[A-Za-zㄱ-힝0-9]{2,}/.test(t));
  if (optTexts().length >= 2 && optTexts().join('').length >= 8 && !$$('.opt svg').length) {      // read the choices aloud (text choices only; pictures have nothing to read)
    const rb = document.createElement('button'); rb.className = 'say'; rb.id = 'spo'; rb.textContent = '🔉'; rb.setAttribute('aria-label', L(B('Read the choices', '보기 읽어 주기')));
    rb.onclick = () => optTexts().forEach((t, i) => say(t, undefined, i > 0));
    $('#sp').after(rb);
  }
  $$('.storytext').forEach(st => { const txt = st.innerText; const b = document.createElement('button'); b.className = 'say rd'; b.setAttribute('aria-label', T().listen); b.textContent = '🔊'; b.onclick = () => say(txt); st.prepend(b); });   // read-aloud for stories and passages
  if (item.onRender) item.onRender();
  let missed = false;
  if (DIAG.active) DIAG.decorate(game);
  $$('.opt').forEach(btn => btn.onclick = () => {
    if (DIAG.active) { DIAG.answer(game, !!opts[+btn.dataset.i].ok, btn); return; }
    if (opts[+btn.dataset.i].ok) {
      btn.classList.add('ok');
      recordFinal(game.id, missed); if (!missed) addPeach();
      $('#cheer').textContent = pick(T().right);
      if (typeof window.rememberDictionaryWords === 'function') window.rememberDictionaryWords(item.vocab);
      if (item.after) $('#fact').textContent = L(item.after);
      say(item.vocab && S.lang !== 'en' ? item.vocab : (item.after ? L(item.after) : ''), item.vocab && S.lang !== 'en' ? 'en-US' : undefined);
      if (item.vocab && S.lang !== 'en' && item.after) say(L(item.after), undefined, true);
      $$('.opt').forEach(o => o.disabled = true);
      if (item.onCorrect) item.onCorrect();
      nextButton(() => game.play());
    } else {
      btn.classList.add('no'); missed = true; record(game.id, false);
      $('#cheer').textContent = T().again; say(T().again);
      setTimeout(() => btn.classList.remove('no'), 400);
    }
  });
}
// Bilingual labels: English mode shows English; Korean mode shows English + Korean (vocabulary help).
function labelText(l) { if (typeof l === 'string') return l; return S.lang === 'en' ? l.en : `${l.en}<br>${l.ko}`; }

// Helpers for building visuals
const emojiRow = (n, e, cls = '') => `<div class="grp ${cls}">${Array.from({ length: n }, () => `<span>${e}</span>`).join('')}</div>`;
const numOpts = (ans, lo, hi, n = 3) => {
  const set = new Set([ans]); let guard = 0;
  while (set.size < n && guard++ < 50) { const v = ans + pick([-2, -1, 1, 2]); if (v >= lo && v <= hi) set.add(v); }
  return [...set].map(v => ({ html: `<span class="num">${v}</span>`, ok: v === ans }));
};

const GAMES = [];
const registerGame = (g) => GAMES.push(g);
// Which games a child sees: K games for K, 1st-grade games for grade 1; thinking games (brain/create/gifted) and handwriting are shared.
const gradeOf = (g) => g.grade || (['brain', 'create', 'gifted'].includes(g.subject) || ['trace', 'draw'].includes(g.id) ? 'both' : 'K');
const GRADES = ['K', '1', '2', '3', '4', '5'];
const kidGrade = () => (GRADES.includes(curKid().grade) ? curKid().grade : 'K');
const prevGrade = (g) => GRADES[GRADES.indexOf(g) - 1] || null;
const visibleGames = () => GAMES.filter(g => { const gr = gradeOf(g); return gr === 'both' || gr === kidGrade() || (S.showK && gr === prevGrade(kidGrade())); });
