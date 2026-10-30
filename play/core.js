'use strict';
// Core: device-local state, speech, helpers, and the shared multiple-choice quiz engine.
// Validators: saved data can come from an old version, a hand-edited file or a restored backup, so it is checked before use.
const GRADE_LIST = ['P', 'K', '1', '2', '3', '4', '5'];
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
  if (isObj(s.demoSeen)) o.demoSeen = Object.fromEntries(Object.entries(s.demoSeen).filter(([k,v]) => /^[A-Za-z0-9_-]{1,40}$/.test(k) && v === true).slice(0, 800));
  if (Array.isArray(s.log)) o.log = window.LearnLog.clean(s.log);
  if (isObj(s.mastery) && window.Learner) o.mastery = window.Learner.cleanMastery(s.mastery);
  if (['slow', 'challenge', 'unknown'].includes(s.learningStyle)) o.learningStyle = s.learningStyle;
  if (Array.isArray(s.pickLog)) o.pickLog = window.Learner.cleanPickLog(s.pickLog);
  if (isObj(s.learnDays)) o.learnDays = window.Learner.cleanDays(s.learnDays);
  if (isObj(s.strongAreas) && GRADE_LIST.includes(s.strongAreas.grade) && s.strongAreas.grade !== 'P' && Array.isArray(s.strongAreas.domains)) o.strongAreas = { grade: s.strongAreas.grade, domains: [...new Set(s.strongAreas.domains.filter(key => ['num', 'alg', 'meas', 'geo', 'pa', 'ph', 'hfw', 'voc', 'lit', 'inf'].includes(key)))] };
  if (s.lang === 'en' || s.lang === 'ko') o.lang = s.lang;
  if (Number.isFinite(s.peaches) && s.peaches >= 0) o.peaches = Math.floor(s.peaches);
  if (isObj(s.stats)) { o.stats = {}; Object.entries(s.stats).forEach(([k, v]) => { if (isObj(v)) o.stats[k] = { right: Math.max(0, numOr(v.right)), wrong: Math.max(0, numOr(v.wrong)), streak: Math.max(0, numOr(v.streak)), level: Math.min(3, Math.max(1, numOr(v.level, 1))), recent: typeof v.recent === 'string' && /^[01]{0,6}$/.test(v.recent) ? v.recent : '' }; }); }
  if (isObj(s.addr)) o.addr = { street: typeof s.addr.street === 'string' ? s.addr.street.slice(0, 80) : '', city: typeof s.addr.city === 'string' ? s.addr.city.slice(0, 40) : '' };
  if (s.profile === null || isObj(s.profile)) { o.profile = s.profile; if (isObj(o.profile)) { o.profile = Object.assign({}, o.profile); if ('diag' in o.profile && !(isObj(o.profile.diag) && Array.isArray(o.profile.diag.missed) && o.profile.diag.missed.every(x => typeof x === 'string'))) delete o.profile.diag; if ('report' in o.profile && !(isObj(o.profile.report) && Array.isArray(o.profile.report.picks) && o.profile.report.picks.every(p => isObj(p) && typeof p.id === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(p.id) && Number.isFinite(p.score) && p.score >= 0 && Array.isArray(p.reasons) && p.reasons.every(r => typeof r === 'string')))) delete o.profile.report; } }
  if (isObj(o.profile) && 'school' in o.profile) { const sc = o.profile.school, IRK = ['pa', 'ph', 'hfw', 'voc', 'lit', 'inf', 'num', 'alg', 'meas', 'geo']; if (isObj(sc)) o.profile.school = { at: typeof sc.at === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(sc.at) ? sc.at : '', grade: ['K', '1', '2', '3', '4', '5'].includes(sc.grade) ? sc.grade : 'K', ir: Object.fromEntries(Object.entries(isObj(sc.ir) ? sc.ir : {}).filter(([k, v]) => IRK.includes(k) && ['m', 'e', 'b'].includes(v))), miss: Array.isArray(sc.miss) ? [...new Set(sc.miss.filter(k => typeof k === 'string' && /^[a-z0-9]{1,20}$/.test(k)))].slice(0, 40) : [] }; else delete o.profile.school; }
  if (Array.isArray(s.checks)) o.checks = s.checks.filter(c => isObj(c) && Array.isArray(c.items)).slice(-40).map(c => {
    const items = c.items.filter(it => isObj(it) && typeof it.id === 'string' && it.id.length <= 40 && typeof it.ok === 'boolean').map(it => ({ id: it.id, lv: Math.min(3, Math.max(1, numOr(it.lv, 1))), ok: it.ok }));
    return { at: typeof c.at === 'string' ? c.at.slice(0, 16) : '', scope: typeof c.scope === 'string' ? c.scope.slice(0, 12) : 'all', ...(Array.isArray(c.est) ? { est: c.est.filter(e => Array.isArray(e) && e.length === 2 && ['num','alg','meas','geo','pa','ph','hfw','voc','lit','inf'].includes(e[0]) && Number.isInteger(e[1]) && e[1] >= 0 && e[1] <= 7) } : {}), grade: GRADE_LIST.includes(c.grade) ? c.grade : 'K', items, ok: items.filter(x => x.ok).length, total: items.length };
  }).filter(c => c.items.length);
  if (Array.isArray(s.stickers)) o.stickers = s.stickers.filter(x => typeof x === 'string').slice(0, 200);
  if (isObj(s.bp)) o.bp = { level: Math.min(31, Math.max(1, Math.floor(numOr(s.bp.level, 1)))), best: Math.max(0, numOr(s.bp.best)), stars: isObj(s.bp.stars) ? Object.fromEntries(Object.entries(s.bp.stars).filter(([, v]) => Number.isFinite(v)).map(([k, v]) => [k, Math.min(3, Math.max(0, v))])) : {}, friends: Array.isArray(s.bp.friends) ? s.bp.friends.filter(Number.isInteger) : [], skin: typeof s.bp.skin === 'string' ? s.bp.skin : 'plain', daily: isObj(s.bp.daily) ? s.bp.daily : null };
  if (typeof s.last === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(s.last)) o.last = s.last;
  o.skin = ['auto', 'peachy', 'explorer'].includes(s.skin) ? s.skin : 'auto';
  o.rounds = isObj(s.rounds) ? Object.fromEntries(Object.entries(s.rounds).filter(([key, value]) => ['math', 'read', 'write', 'ss', 'sci', 'life', 'create', 'gifted', 'brain'].includes(key) && Number.isFinite(value)).map(([key, value]) => [key, Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(value)))])) : {};
  if (['light', 'dark', 'system'].includes(s.theme)) o.theme = s.theme;
  if (Array.isArray(s.fav)) o.fav = s.fav.filter(x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(x)).slice(0, 30);
  if (Array.isArray(s.review)) {
    const seen = new Set();
    o.review = s.review.filter(x => isObj(x) && typeof x.key === 'string' && /^[A-Za-z0-9_-]{1,60}$/.test(x.key) && typeof x.id === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(x.id) && Number.isInteger(x.lv) && x.lv >= 1 && x.lv <= 3 && !seen.has(x.key) && seen.add(x.key)).slice(-50).map(x => ({ key: x.key, id: x.id, lv: x.lv }));
  }
  if (Array.isArray(s.spacing) && window.Spacing) o.spacing = window.Spacing.clean(s.spacing);
  if (isObj(s.today) && window.Today) o.today = window.Today.clean(s.today);
  if (isObj(s.homecard) && window.HomeCard) { const hc = window.HomeCard.clean(s.homecard); if (hc) o.homecard = hc; }
  if (Array.isArray(s.fluency) && window.Fluency) o.fluency = window.Fluency.clean(s.fluency);
  if (isObj(s.ladder)) o.ladder = { r: Math.min(99, Math.max(1, Math.floor(numOr(s.ladder.r, 1)))), low: s.ladder.low === 1 ? 1 : 0, best: Math.min(99, Math.max(1, Math.floor(numOr(s.ladder.best, 1)))), h: (Array.isArray(s.ladder.h) ? s.ladder.h : []).filter(e => Array.isArray(e) && e.length === 6 && /^\d{4}-\d{2}-\d{2}$/.test(e[0]) && e.slice(1).every(Number.isFinite)).slice(-40) };   // Number Ladder rung (games-ladder.js re-checks with Ladder.clean)
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
// Remember bilingual render strings so language changes can preserve live controls,
// closures, drawings, option order and pending answer/next-button state.
const LANGUAGE_PAIRS = new Map();
const LANGUAGE_NODES = new WeakMap();
const L = (o) => {
  if (typeof o === 'string') return o;
  if (o.en && o.ko && o.en !== o.ko) LANGUAGE_PAIRS.set(o.en, o.ko);
  return o[S.lang] || o.en;
};
// Dynamic UI messages also need their original arguments when translated live.
Object.keys(I18N.en).forEach(key => {
  const en = I18N.en[key], ko = I18N.ko[key];
  if (typeof en !== 'function' || typeof ko !== 'function') return;
  for (const language of ['en', 'ko']) I18N[language][key] = (...args) => { const pair = { en: en(...args), ko: ko(...args) }; L(pair); return pair[language]; };
});
function translateLiveScreen(from) {
  const pairs = new Map();
  const add = (en, ko) => {
    if (typeof en !== 'string' || typeof ko !== 'string' || en === ko) return;
    pairs.set(from === 'en' ? en : ko, from === 'en' ? ko : en);
  };
  LANGUAGE_PAIRS.forEach((ko, en) => {
    add(en, ko);
    const enLines = en.split('\n'), koLines = ko.split('\n');
    if (enLines.length === koLines.length && enLines.length > 1) enLines.forEach((line, i) => add(line, koLines[i]));
    if (en.includes('<') || ko.includes('<')) {
      const a = document.createElement('template'), b = document.createElement('template');
      a.innerHTML = en; b.innerHTML = ko;
      const texts = root => { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), out = []; while (w.nextNode()) out.push(w.currentNode.nodeValue); return out; };
      const at = texts(a.content), bt = texts(b.content);
      if (at.length === bt.length) at.forEach((t, i) => add(t, bt[i]));
    }
  });
  const collect = (en, ko) => {
    if (typeof en === 'string') add(en, ko);
    else if (en && ko && typeof en === 'object') Object.keys(en).forEach(k => collect(en[k], ko[k]));
  };
  collect(I18N.en, I18N.ko);
  const current = view().languageRefresh;
  const legacy = current?.root === view().firstElementChild && current.legacyPairs || LANGUAGE_LEGACY[SESSION.id] || [];
  legacy.forEach(([en, ko]) => add(en, ko));
  const fragments = [...pairs].filter(([source]) => source.length > 8 && !source.includes('<')).sort((a, b) => b[0].length - a[0].length);
  // Match whole fragments first, then long phrases embedded beside icons.
  const translate = value => {
    if (pairs.has(value)) return pairs.get(value);
    const trimmed = value.trim();
    if (pairs.has(trimmed)) return value.replace(trimmed, pairs.get(trimmed));
    for (const [source, target] of fragments) {
      if (value.includes(source)) return value.replace(source, target);
    }
    return value;
  };
  const translateNode = (node, key, value) => {
    let records = LANGUAGE_NODES.get(node);
    if (!records) { records = {}; LANGUAGE_NODES.set(node, records); }
    const previous = records[key];
    if (previous && previous[from] === value) return previous[S.lang];
    const translated = translate(value);
    records[key] = { [from]: value, [S.lang]: translated };
    return translated;
  };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement.closest('script,style,textarea') && (!node.parentElement.closest('#view [lang="en"]') || node.parentElement.closest('button'))) node.nodeValue = translateNode(node, 'text', node.nodeValue);
  }
  document.querySelectorAll('[aria-label],[title],[placeholder]').forEach(el => {
    for (const key of ['aria-label', 'title', 'placeholder']) if (el.hasAttribute(key)) el.setAttribute(key, translateNode(el, key, el.getAttribute(key)));
  });
  document.querySelectorAll('[data-pk-en]').forEach(el => el.setAttribute('aria-label', el.getAttribute('data-pk-' + S.lang)));
  const refresh = view().languageRefresh;
  if (refresh && refresh.root === view().firstElementChild) refresh.update();
  else { const prompt = view().querySelector('.prompt'); if (prompt) say(prompt.textContent); }
  // A translated prompt/label can need another line. Keep maps and answers visible.
  const map = view().querySelector('.real-map');
  if (map) {
    map.style.width = '';
    const originalWidth = map.getBoundingClientRect().width;
    for (let i = 0; i < 2; i++) {
      const overflow = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - innerHeight;
      const rect = map.getBoundingClientRect();
      if (overflow <= 1 || !rect.height) break;
      map.style.width = Math.max(originalWidth * 0.8, rect.width * (rect.height - overflow - 2) / rect.height) + 'px';
    }
  }
}

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
const lvl = (id) => (DIAG.active ? (DIAG.lv || 1) : SESSION.review ? SESSION.review[SESSION.n].lv : SESSION.easyLevel ? 1 : stat(id).level);

// Speech is always paired with visible text/visuals, so muted devices (and missing voices) still work.
function say(text, lang, keepQueue) {
  try {
    if (S.muted || S.voiceOff || !('speechSynthesis' in window) || !text) return;
    if (!keepQueue) speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang || T().speech; u.rate = 0.85;
    if (window.Voice) window.Voice.apply(u, u.lang);
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
  window.LearnLog.answer(id, ok ? 1 : 0);
  if (gradeOf(gameById(id) || {}) === 'P') { if (SESSION.review) { if (ok) reviewSolved(); return; } if (ok) { SESSION.done++; const st=stat(id); st.right++; PK.recordPlay(id); save(); } return; }
  if (DIAG.active) return;
  if (SESSION.review) {
    if (ok) reviewSolved();
    else { MISS[id] = true; if (window.Spacing) window.Spacing.missed(SESSION.review[SESSION.n]); }
    return;
  }
  if (window.Spacing && id !== 'blockpuzzle') window.Spacing.note(id, lvl(id), ok, !!MISS[id]);   // 1·3·7-day spaced review
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
  if (ok) { s.right++; s.streak++; if (s.streak >= (SESSION.learnerMode === 'challenge' ? 4 : 5) && s.level < 2 && window.Learner.canRise(id)) { s.level++; s.streak = 0; s.recent = ''; } }
  else { s.wrong++; s.streak = 0; if (s.level > 1 && (s.recent.slice(-5).match(/0/g) || []).length >= 3) { s.level--; window.Learner.holdRise(id); s.recent = '';  } }
  save();
}

// End of a round: a clean first-try finish counts as right; a round that had a miss counts as wrong once (not again if the miss was already logged).
function recordFinal(id, missed) { window.LearnLog.answer(id, missed ? 0 : 1); if (SESSION.review) { if (missed && window.Spacing) window.Spacing.missed(SESSION.review[SESSION.n]); reviewSolved(); MISS[id] = false; return; } if (!missed) record(id, true); else if (!MISS[id]) record(id, false); MISS[id] = false; }
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
  confetti.clear?.();
  try {
    const c = document.getElementById('fx'); if (!c) return;
    const ctx = c.getContext('2d'); let frame;
    confetti.screen = view().firstElementChild;
    if (!confetti.observer) { confetti.observer = new MutationObserver(() => { if (view().firstElementChild !== confetti.screen) confetti.clear?.(); }); confetti.observer.observe(view(), { childList: true }); }
    confetti.clear = () => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, c.width, c.height); };
    if (S.calm || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    c.width = innerWidth; c.height = innerHeight;
    const cols = ['#ff7e5f', '#ffd166', '#06d6a0', '#118ab2', '#ef476f', '#8338ec'];
    const ps = Array.from({ length: count }, () => ({ x: innerWidth / 2 + (Math.random() - .5) * 140, y: innerHeight * .45, vx: (Math.random() - .5) * 10, vy: -Math.random() * 10 - 3, r: 4 + Math.random() * 5, c: pick(cols), rot: Math.random() * 6 }));
    const start = performance.now(); let prev = start;
    const step = now => {
      ctx.clearRect(0, 0, c.width, c.height);
      if (now - start >= 1600 || S.calm || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const dt = Math.min(3, (now - prev) / (1000 / 60)); prev = now;
      ps.forEach(p => { p.vy += .35 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += .1 * dt; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); });
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  } catch (e) {}
}
// Peachy, the peach mascot
const PEACH_SVG = (mood = 'happy') => `<svg viewBox="0 0 64 64" class="peachy ${mood}" aria-hidden="true"><defs><radialGradient id="pg" cx=".35" cy=".3" r=".85"><stop offset="0" stop-color="#ffd9bd"/><stop offset=".55" stop-color="#ff9a76"/><stop offset="1" stop-color="#ef6a58"/></radialGradient></defs>
<path d="M32 12c-14 0-24 10-24 25 0 12 10 20 24 20s24-8 24-20C56 22 46 12 32 12z" fill="url(#pg)"/><path d="M32 14c1-7 6-11 13-11-1 7-6 11-13 11z" fill="#4caf50"/><path d="M32 13c3-3 6-5 9-6" stroke="#2e7d32" stroke-width="1.4" fill="none" stroke-linecap="round"/>
<circle cx="19" cy="40" r="4.2" fill="#ff7f8a" opacity=".55"/><circle cx="45" cy="40" r="4.2" fill="#ff7f8a" opacity=".55"/>
${['oops', 'think'].includes(mood) ? '<path d="M19 27q5-3 9-1M36 26q5-2 9 1" stroke="#3a2a2a" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="25" cy="33" r="3.2" fill="#3a2a2a"/><circle cx="41" cy="33" r="3.2" fill="#3a2a2a"/><circle cx="26.2" cy="31.6" r="1.1" fill="#fff"/><circle cx="42.2" cy="31.6" r="1.1" fill="#fff"/><path d="M28 45q5 2 9-1" stroke="#3a2a2a" stroke-width="2.4" fill="none" stroke-linecap="round"/><text x="50" y="20" font-size="14" font-weight="900" fill="#1d4ed8">?</text>' : mood === 'yay' ? '<path d="M20 35q4-6 8 0M36 35q4-6 8 0" stroke="#3a2a2a" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M23 42q9 12 18 0z" fill="#3a2a2a"/><path d="M27 46q5 4 10 0" fill="#ff7f8a"/>' : '<circle cx="24" cy="34" r="3.4" fill="#3a2a2a"/><circle cx="40" cy="34" r="3.4" fill="#3a2a2a"/><circle cx="25.2" cy="32.8" r="1.1" fill="#fff"/><circle cx="41.2" cy="32.8" r="1.1" fill="#fff"/><path d="M24 43q8 9 16 0" stroke="#3a2a2a" stroke-width="2.6" fill="none" stroke-linecap="round"/>'}</svg>`;
// <pk-cheer>: assigning textContent shows the mascot, plays a sound and (for good answers) throws confetti
class PkCheer extends HTMLElement {
  connectedCallback() { this.setAttribute("role", "status"); this.setAttribute("aria-live", "polite"); }
  set textContent(v) {
    this._t = v || ''; this.classList.remove('is-wrong'); this.replaceChildren(); if (!this._t) return;
    const bad = (this._t === T().again || this._t === T().tooMany);
    this.classList.toggle('is-wrong', bad);
    this.insertAdjacentHTML('beforeend', PEACH_SVG(bad ? 'oops' : 'happy')); const s = document.createElement('span'); s.textContent = this._t; this.appendChild(s);
    if (bad) sfx('no'); else { sfx('ok'); confetti(34); try { navigator.vibrate && navigator.vibrate(25); } catch (e) {} }
  }
  get textContent() { return this._t || ''; }
}
if (!customElements.get('pk-cheer')) customElements.define('pk-cheer', PkCheer);
function updateBar() {
  const bar = $('#sbar'); if (!bar) return;
  const max = SESSION.rounds || ROUNDS, n = Math.min(max, SESSION.n);
  bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-label', L(B('Round progress', '한 판 진행')));
  bar.setAttribute('aria-valuemin', '0'); bar.setAttribute('aria-valuemax', max); bar.setAttribute('aria-valuenow', n);
  const dots = kidGrade() !== 'P' && gradeOf(gameById(SESSION.id) || {}) !== 'P' && max <= 12 && !DIAG.active && !SESSION.review;
  bar.classList.toggle('dots-progress', dots);
  bar.innerHTML = dots ? `<span class="round-dots" aria-hidden="true">${Array.from({ length: max }, (_, i) => `<b class="round-dot${i < n ? ' done' : i === n ? ' current' : ''}"></b>`).join('')}</span><span class="round-count">${n}/${max}</span>` : `<i style="width:${Math.round(100 * n / max)}%"></i>`;
  if (n === 0) { SESSION.startPeaches = S.peaches; SESSION.roundCounted = false; const chip = $('#cleanStreak'); if (chip) { chip.hidden = true; chip.replaceChildren(); } }
}
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
  if (window.Spacing) window.Spacing.solved(it);
}
function startReview() {
  quitDiag();
  const eligible = (cleanState({ review: S.review }).review || []).filter(x => gameById(x.id) && !CHECK_SKIP.includes(x.id));
  const pool = kidGrade() === 'P' ? eligible.filter(x => gradeOf(gameById(x.id)) === 'P' && !gameById(x.id).pkOpen) : eligible.filter(x => gradeOf(gameById(x.id)) !== 'P');
  // Keep other grades' saved review entries intact.
  S.review = eligible; save();
  if (!pool.length) return home();
  const rounds = kidGrade() === 'P' ? 5 : ROUNDS;
  const items = Array.from({ length: rounds }, (_, i) => pool[i % Math.min(pool.length, rounds)]);
  NEXT_TOK++;
  Object.assign(SESSION, { review: items, n: 0, done: 0, mix: false, rounds, prevPeek: null });
  reviewStep();
}
function reviewStep() {
  if (SESSION.n >= SESSION.rounds) {
    window.LearnLog.finish();
    SESSION.review = null;
    view().innerHTML = `<h1>🎉 ${T().roundDone}</h1><p class="tag">${kidGrade() === 'P' ? T().prekDone : T().gotRight(SESSION.done, SESSION.rounds)}</p><button class="next" id="reviewHome">🏠 ${T().pickAnother}</button>`;
    $('#reviewHome').onclick = home; say(T().roundDone); if (window.Today) window.Today.afterReview(); return;
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
  window.LearnLog.leave();
  window.Learner.choose(game);
  SESSION.pkMixed=false;
  document.body.classList.toggle('pk-playing', game.grade === 'P');
  if (game.grade === 'P' && DIAG.active) quitDiag();
  SESSION.review = null; NEXT_TOK++;
  if (!DIAG.active && !mix) { S.last = game.id; save(); }                     // for the home screen's Continue button
  Object.keys(MISS).forEach(k => { MISS[k] = false; });
  Object.assign(SESSION, { id: game.id, n: 0, mix: !!mix, done: 0, rounds: mix ? Math.min(3, game.rounds || 3) : (game.rounds || ROUNDS) });
  SESSION.misses = 0; SESSION.easyNext = false; SESSION.easyLevel = false; SESSION.prevPeek = null;
  SESSION.learnerMode = kidGrade() === 'P' || gradeOf(game) === 'P' ? 'unknown' : window.Learner.style();
  SESSION.styleWeak = kidGrade() !== 'P' && gradeOf(game) !== 'P' && window.Learner.weakDomain(window.Learner.domainFor(game.id));
  SESSION.styleCompleted = false; SESSION.cleanStreak = 0;
  if (SESSION.learnerMode === 'slow') SESSION.rounds = Math.min(5, SESSION.rounds);
  SESSION.easyLevel = kidGrade() !== 'P' && !DIAG.active && currentPicks(3).some(item => item.id === game.id && item.why.includes('__warm__'));
  try { updateBar(); game.play(); } finally { SESSION.easyLevel = false; }
}
function surprise() {
  if (kidGrade() === 'P') { const pool=visibleGames(); if (!pool.length) return home(); SESSION.pkMixed=true; launch(pick(pool)); SESSION.pkMixed=true; return; }
  SESSION.pkMixed=false;                                // mixed run: different game every couple of rounds
  const picks = (typeof currentPicks === 'function' ? currentPicks(3) : []).map(p => p.id);
  const pool = visibleGames().filter(g => g.id !== SESSION.id && !(SESSION.hist || []).slice(-4).includes(g.id));
  const g = window.Learner.mixGame() || (picks.length && rnd(2) === 0 ? GAMES.find(x => x.id === pick(picks)) : null) || pick(pool);
  SESSION.hist = [...(SESSION.hist || []), g.id]; launch(g, true);
}
function sessionEnd(game) {
  window.LearnLog.finish();
  window.Learner.complete();
  const t = T(), pk = game.grade === 'P', free = ALL_STICKERS.filter(s => !S.stickers.includes(s)), sticker = free.length && !SESSION.mix ? pick(free) : null;
  if (sticker) { S.stickers.push(sticker); save(); renderPeaches(); }
  let newly = false;
  if (!pk && !SESSION.roundCounted) {
    S.rounds ||= {}; S.rounds[game.subject] = Math.min(Number.MAX_SAFE_INTEGER, (S.rounds[game.subject] || 0) + 1);
    SESSION.roundCounted = true; newly = ROUND_BADGES.some(([at]) => at === S.rounds[game.subject]); save();
  }
  const reward = sticker ? `<div class="newsticker"><div class="stk">${sticker}</div><div>${t.newSticker} (${S.stickers.length}/${ALL_STICKERS.length})</div></div>` : '';
  const peaches = Math.max(0, S.peaches - (SESSION.startPeaches ?? S.peaches));
  confetti.clear?.();
  view().innerHTML = `${pk ? `<h1>🎉 ${t.roundDone}</h1><p class="tag">${t.prekDone}</p>${reward}` : `<h1 class="round-title">${PEACH_SVG('yay')}${L(B('Round complete! Nice work!', '한 판 끝! 멋져요!'))}</h1><div class="round-rewards"><div class="round-reward" aria-label="${L(B(`${peaches} peaches this round`, `이번 판에 받은 복숭아 ${peaches}개`))}">🍑 +${peaches}</div>${reward}</div>${goalHtml(true)}${document.body.classList.contains('skin-explorer') ? roundBadgeHtml(game.subject, newly) : ''}`}
    <div class="menu intro${pk ? '' : ' round-actions'}"><button class="big math${pk ? '' : ' round-primary'}" id="again"><span class="gi">🔁</span>${t.playAgain}<small>${t.againSub}</small></button>
    <button class="big read" id="mixbtn"><span class="gi">🎲</span>${t.surprise}<small>${t.surpriseSub}</small></button>
    <button class="big ss" id="goHome"><span class="gi">🏠</span>${t.pickAnother}<small>${t.anotherSub}</small></button></div>`;
  $('#again').onclick = () => launch(game); $('#mixbtn').onclick = surprise; $('#goHome').onclick = home;
  say(t.roundDone); sfx('win'); confetti(150);
  if (window.Today) window.Today.afterRound(game);
}
let NEXT_TOK = 0;
// Shows a "Next" button and moves on by itself after a short pause (tap to go sooner).
// Previous question (2026-10-26; all games 2026-10-26 night): nextButton keeps a read-only copy of the solved screen,
// and the next question shows ⏮️ next to 🔊 to look back at it. Canvas drawings are copied as pictures.
function snapPrev() {
  const c = document.createElement('div');
  [...view().children].filter(e => !e.matches('.cheer,.fact,.next,#nx,script,style')).forEach(e => {
    const w = document.createElement('div'); w.append(e.cloneNode(true));
    const src = e.tagName === 'CANVAS' ? [e] : [...e.querySelectorAll('canvas')];
    [...w.querySelectorAll('canvas')].forEach((d, i) => { try { const img = document.createElement('img'); img.src = src[i].toDataURL(); img.style.cssText = `width:${src[i].style.width || src[i].width + 'px'};max-width:100%;height:auto`; img.alt = ''; d.replaceWith(img); } catch (err) { d.remove(); } });
    c.append(...w.childNodes);
  });
  c.querySelectorAll('[id]').forEach(e => e.removeAttribute('id')); c.querySelectorAll('.say,.z-tools,.trace-tools').forEach(e => e.remove()); c.querySelectorAll('button,input').forEach(e => { e.disabled = true; e.tabIndex = -1; }); c.querySelectorAll('.no').forEach(e => e.classList.remove('no'));
  if (c.textContent.trim() || c.querySelector('img,svg,canvas')) SESSION.prevPeek = c.innerHTML;
}
function addPrevButton() {
  const sp = $('#sp');
  if (!SESSION.prevPeek || DIAG.active || !sp || $('#prevQ')) return;
  const pb = document.createElement('button'); pb.className = 'say'; pb.id = 'prevQ'; pb.textContent = '⏮️'; pb.setAttribute('aria-label', L(B('Previous question', '이전 문제')));
  const peek = SESSION.prevPeek;
  pb.onclick = () => {
    try { speechSynthesis.cancel(); } catch (e) {}
    const box = document.createElement('div'); box.className = 'prevpeek'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', L(B('Previous question', '이전 문제')));
    box.innerHTML = `<div class="peektag">⏮️ ${L(B('Previous question', '이전 문제'))}</div><div class="peekbody">${peek}</div><button class="next" id="peekBack">▶ ${L(B('Back to this question', '지금 문제로'))}</button>`;
    document.body.append(box); box.querySelector('#peekBack').onclick = () => box.remove(); box.querySelector('#peekBack').focus();
  };
  sp.before(pb);
}
function nextButton(fn, opts = {}) {
  if (!DIAG.active && SESSION.n + 1 >= SESSION.rounds) window.LearnLog.finish();
  const tok = ++NEXT_TOK;
  if (!DIAG.active) setTimeout(() => { if (tok === NEXT_TOK) snapPrev(); }, 0);   // after the game has filled in the answer
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
      if (g && g.grade === 'P' && SESSION.pkMixed && SESSION.n < SESSION.rounds) { const next=pick(visibleGames()); SESSION.id=next.id; return next.play(); }
      if (!g || SESSION.n < SESSION.rounds) {
        SESSION.easyLevel = !!SESSION.easyNext; SESSION.easyNext = false;
        try { return fn(); } finally { SESSION.easyLevel = false; addPrevButton(); }
      }
      window.LearnLog.finish(); if (SESSION.mix) window.Learner.complete(); return SESSION.mix ? surprise() : sessionEnd(g);
    };
    btn.onclick = go;
    if (opts.auto !== false && !DIAG.active) { const f = $('#fact'); setTimeout(go, opts.auto || Math.min(4200, 1300 + 45 * (f ? f.textContent.length : 0))); }
  }, 450);
}

// Reading-goal games (age-fit §5): hearing these choices/material before answering would replace decoding or spelling with sound matching.
// A game or item can also set readGoal: true | 'both' | 'opts' | 'show'.
// quietShow: the question's 🔊 already reads the material (askSay), so the material gets no second speaker (2026-10-28 samples).
const READ_GOAL = { letters: 'both', sight: 'opts', silly: 'opts', silly2: 'opts', tricky1: 'opts', tricky2: 'opts', twosyl: 'opts', syllables2: 'opts', vowels2: 'opts', spell3: 'opts', spell4: 'opts', spell5: 'opts', decode4: 'opts', decode5: 'opts' };
// Visible words of an element for speech: no pictures/emoji, no buttons' own icons.
function speakable(el) {
  const c = el.cloneNode(true);
  c.querySelectorAll('svg,canvas,img,.say,.sr-only,[aria-hidden="true"],#sps').forEach(e => e.remove());
  c.querySelectorAll('br').forEach(e => e.replaceWith(' ')); c.querySelectorAll('div,p,li,tr,td').forEach(e => e.append(' '));
  const t = c.textContent.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}\u{1F3FB}-\u{1F3FF}]/gu, ' ');
  return t.replace(/(^|\s)(?:\?|_{2,})(?=$|[\s.,!])/g, '$1' + (/[가-힣]/.test(t) ? '빈칸' : 'blank')).replace(/\s+/g, ' ').trim();   // a lone ? or ___ is a fill-in blank, named in the sentence's language
}
const hasReplay = el => [...el.querySelectorAll('button,[role="button"]')].some(e => /🔊|🔉/.test(e.textContent) || e.classList.contains('say')) || !!el.querySelector('[onclick*="say"]');
const speechLang = t => /[가-힣]/.test(t) ? 'ko-KR' : /[A-Za-z]/.test(t) ? 'en-US' : undefined;

// ---- Step-down and picture fading (JUMP Math, 2026-10-28; docs/review/impl-stepdown.md) ----
// Step-down: a game may offer game.stepDown(item) -> a smaller item (or null). On the 2nd miss of the same question,
// quiz shows that smaller step once, then the same question again (re-shuffled). Steps are not scored or logged.
// Off for Pre-K, the quick check (DIAG) and review rounds, which must stay as they were.
const stepDownReady = (game) => typeof game.stepDown === 'function' && !DIAG.active && !SESSION.review && gradeOf(game) !== 'P' && kidGrade() !== 'P';
// Picture fading (a "support step", separate from levels): per game + question type, first-try answers in a row
// move the picture from objects (0) to plain dots (1) to numbers only (2); a miss puts the full picture back.
// In memory only (not saved); full pictures in Pre-K, DIAG and review. Thresholds 2/4 are a starting guess.
const SCAFFOLD = {};
function scaffoldStep(game, type) {
  if (DIAG.active || SESSION.review || gradeOf(game) === 'P' || kidGrade() === 'P') return 0;
  const c = SCAFFOLD[game.id + ':' + type] || 0;
  return c >= 4 ? 2 : c >= 2 ? 1 : 0;
}
function scaffoldNote(game, type, ok) { const k = game.id + ':' + type; SCAFFOLD[k] = ok ? Math.min(9, (SCAFFOLD[k] || 0) + 1) : 0; }

// Generic multiple-choice round.
// item: { ask, show?, opts:[{html,label?,ok?}], after?, vocab?, onRender?, onCorrect?, cls?, fade?, sd? }
// ctx (engine only): { step: originalItem } = the smaller step; { resume: true } = the original question again after it.
function quiz(game, item, ctx = {}) {
  const follow = !!(ctx.step || ctx.resume);         // same question continues: no new dup/log entry, misses kept
  if (!follow && window.PictureDemo?.intercept(game, item)) return;
  confetti.clear?.();
  const pk=game.grade === 'P';
  document.body.classList.toggle('pk-playing', pk);
  if (!follow) MISS[game.id] = false;
  const boss = !ctx.step && !pk && !DIAG.active && !SESSION.review && SESSION.learnerMode === 'challenge' && lvl(game.id) >= 2;
  const askText = (ctx.step ? '👣 ' : '') + (boss ? L(B('🐉 Boss question: ', '🐉 보스 문제: ')) : '') + L(item.ask);
  const key = askText + '|' + (item.show || '').replace(/style="[^"]*"/g, '') + '|' + item.opts.map(o => o.html + (o.ok ? '*' : '')).sort().join(',');
  if (!follow && dup(game, key)) return game.play();
  if (DIAG.confirm) window.Learner.confirmOptions(item.opts.length);
  if (!follow) window.LearnLog.begin(game, lvl(game.id));
  const opts = shuffle(item.opts);
  view().innerHTML = `
    <div class="prompt"${pk ? ` aria-label="${askText.replace(/"/g, '&quot;')}"` : ''}>${pk ? '' : askText}<button class="say" id="sp" aria-label="${T().listen}">🔊</button></div>
    ${pk ? `<div class="pk-adult">${T().prekTogether}</div>` : ''}
    ${item.show ? `<div class="show">${item.show}</div>` : ''}
    <div class="opts ${item.cls || ''}">${opts.map((o, i) => `<button class="opt" data-i="${i}">${o.html}${o.label ? `<span class="ol">${labelText(o.label)}</span>` : ''}</button>`).join('')}</div>
    ${pk ? '<div class="cheer" id="cheer" role="status" aria-live="polite"></div>' : '<pk-cheer class="cheer" id="cheer"></pk-cheer>'}<div class="fact" id="fact" role="status"></div>`;
  const question = value => {
    let text = L(value);
    // Some older English templates interpolated L(action) while Korean was active.
    if (S.lang === 'en') LANGUAGE_PAIRS.forEach((ko, en) => { if (/[가-힣]/.test(ko) && !/[가-힣]/.test(en)) text = text.replaceAll(ko, en); });
    return text;
  };
  const ask = () => { say(item.askSay ? question(item.askSay) : (boss ? L(B('🐉 Boss question: ', '🐉 보스 문제: ')) : '') + question(item.ask)); if (item.askExtra && S.lang === 'ko') say(item.askExtra.t, item.askExtra.lang, true); };
  $('#sp').onclick = ask; ask();
  if (!ctx.step) addPrevButton();
  const root = view().firstElementChild, still = () => view().firstElementChild === root;
  view().languageRefresh = { root: view().firstElementChild,
    legacyPairs: game.id === 'symmetry' ? (item.ask.en.includes('Does it have a line of symmetry?') ? [['Yes', '네, 있어요'], ['No', '아니요, 없어요']] : [['Yes, they match', '네, 맞아요'], ['No, they do not match', '아니요, 안 맞아요']]) : null,
    update: () => {
    const prompt = $('#sp').parentElement;
    const text = (boss ? L(B('🐉 Boss question: ', '🐉 보스 문제: ')) : '') + question(item.ask);
    if (pk) prompt.setAttribute('aria-label', text);
    else { for (const node of [...prompt.childNodes]) if (node.nodeType === Node.TEXT_NODE) node.remove(); prompt.prepend(document.createTextNode(text)); }
    opts.forEach((o, i) => { const label = view().querySelector(`[data-i="${i}"] .ol`); if (label && o.label) label.innerHTML = labelText(o.label); });
    // Older generators conditionally append vocabulary help instead of using labels.
    const hints = game.id === 'days' ? DAYS : game.id === 'logic' ? NAMES : game.id === 'clock1' || game.id === 'clock2g' ? [['AM', '오전'], ['PM', '오후']] : game.id === 'poems2' && item.ask.en === 'Which line repeats the same beginning sound?' ? [...ALLIT.map(row => [row[0].en, row[0].ko]), ['The dog ran home.', '개가 집에 달려갔어요.'], ['We eat lunch at noon.', '우리는 점심을 먹어요.'], ['My bike is red.', '내 자전거는 빨개요.']] : [];
    if (hints.length) opts.forEach((o, i) => {
      const original = document.createElement('div'); original.innerHTML = o.html;
      const word = original.querySelector('.word'); if (!word) return;
      const hint = hints.find(([en]) => word.textContent === en || word.textContent.startsWith(en + ' · ') || word.textContent.startsWith(en + ' (') || word.firstChild?.textContent === en);
      if (!hint) return;
      const button = view().querySelector(`[data-i="${i}"]`), target = button.querySelector('.word');
      if (game.id === 'days') {
        target.textContent = hint[0]; button.querySelector('.ol')?.remove();
        if (S.lang === 'ko') { const label = document.createElement('span'); label.className = 'ol'; label.textContent = hint[1]; button.append(label); }
      } else if (game.id === 'poems2') {
        target.textContent = hint[0];
        if (S.lang === 'ko') { target.append(document.createElement('br')); const small = document.createElement('small'); small.textContent = hint[1]; target.append(small); }
      } else target.textContent = hint[0] + (S.lang === 'ko' ? (game.id === 'logic' ? ' · ' + hint[1] : ' (' + hint[1] + ')') : '');
    });
    if ($('#fact').textContent && item.after) $('#fact').textContent = L(item.after);
    ask();
  } };
  if (pk) {
    $$('[data-pk-en]').forEach(e=>e.setAttribute('aria-label',e.getAttribute('data-pk-'+S.lang)));
    const rb=document.createElement('button'); rb.className='say'; rb.id='pkReadChoices'; rb.textContent='🔉'; rb.setAttribute('aria-label',L(B('Hear the pictures','그림 이름 듣기')));
    rb.onclick=()=>opts.forEach((o,i)=>{ const temp=document.createElement('div'); temp.innerHTML=o.html; const e=temp.querySelector('[aria-label]'); const label=e?.getAttribute('data-pk-'+S.lang)||e?.getAttribute('aria-label'); say(o.say ? L(o.say) : label || L(B('Picture '+(i+1),'그림 '+(i+1))), item.pkChoiceLang, i>0); }); $('#sp').after(rb);
  }
  // Shared read-aloud (age-fit §3): text choices and text material get a small replay button unless the game already has one.
  // Not auto-started; reading-goal games (§5) skip the part that would turn decoding into sound matching.
  const readGoal = item.readGoal || game.readGoal || READ_GOAL[game.id] || '';
  const skipOpts = readGoal === true || readGoal === 'both' || readGoal === 'opts', skipShow = readGoal === true || readGoal === 'both' || readGoal === 'show';
  const optTexts = pk
    ? () => $$('.opt').map(b => (b.querySelector('.word,.num') || b).innerText.replace(/\s+/g, ' ').trim()).filter(t => /[A-Za-zㄱ-힝0-9]{2,}/.test(t))
    : () => $$('.opt').map(b => speakable(b)).filter(Boolean);
  if (pk ? optTexts().length >= 2 && optTexts().join('').length >= 8 && !$$('.opt svg').length : !skipOpts && optTexts().some(t => /\p{L}/u.test(t))) {
    const rb = document.createElement('button'); rb.className = pk ? 'say' : 'say auto-say'; rb.id = 'spo'; rb.textContent = '🔉'; rb.setAttribute('aria-label', L(B('Read the choices', '보기 읽어 주기')));
    rb.onclick = () => optTexts().forEach((t, i) => say(t, speechLang(t), i > 0));
    $('#sp').after(rb);
  }
  $$('.storytext').forEach(st => { const txt = st.innerText; const b = document.createElement('button'); b.className = 'say rd'; b.setAttribute('aria-label', T().listen); b.textContent = '🔊'; b.onclick = () => say(txt); st.prepend(b); });   // read-aloud for stories and passages
  if (item.onRender) item.onRender();
  const showBox = $('.show');
  if (!pk && !skipShow && !item.quietShow && showBox && !hasReplay(showBox) && /\p{L}/u.test(speakable(showBox))) {
    const mb = document.createElement('button'); mb.className = 'say auto-say auto-show'; mb.id = 'sps'; mb.textContent = '🔊'; mb.setAttribute('aria-label', L(B('Read this aloud', '자료 읽어 주기')));
    mb.onclick = e => { e.stopPropagation(); const t = speakable(showBox); if (t) say(t, speechLang(t)); };
    showBox.classList.add('auto-say-host'); showBox.prepend(mb);
  }
  const showStreak = () => {
    const chip = $('#cleanStreak'); if (!chip) return;
    const show = !pk && kidGrade() !== 'P' && !DIAG.active && !SESSION.review && document.body.classList.contains('skin-explorer') && SESSION.cleanStreak >= 3;
    chip.hidden = !show;
    if (!show) chip.replaceChildren();
    else chip.innerHTML = `<span aria-hidden="true">🔥 ${SESSION.cleanStreak}</span><span class="sr-only">${L(B(`${SESSION.cleanStreak} in a row`, `${SESSION.cleanStreak}번 연속`))}</span>`;
  };
  showStreak();
  let missed = !!ctx.resume, wrongs = 0;
  // Sound games remain guided picture practice: browser audio success is not observable reliably.
  const practice = pk && item.pkSound;
  if (DIAG.active) DIAG.decorate(game);
  $$('.opt').forEach(btn => btn.onclick = () => {
    if (DIAG.active) { DIAG.answer(game, !!opts[+btn.dataset.i].ok, btn); return; }
    if (ctx.step) {                                  // the smaller step: feedback only, then back to the question
      if (!opts[+btn.dataset.i].ok) { btn.classList.add('no'); $('#cheer').textContent = T().again; say(T().again); setTimeout(() => btn.classList.remove('no'), 400); return; }
      btn.classList.add('ok'); $$('.opt').forEach(o => o.disabled = true);
      const back = L(B('Good! Now the first question again.', '좋아요! 이제 처음 문제를 다시 풀어요.'));
      $('#cheer').textContent = back; say(back);
      setTimeout(() => { if (still()) quiz(game, ctx.step, { resume: true }); }, 1900);
      return;
    }
    if (item.fade && !pk && kidGrade() !== 'P' && !missed && !SESSION.review) scaffoldNote(game, item.fade, !!opts[+btn.dataset.i].ok);
    if (!pk && kidGrade() !== 'P' && !missed && !SESSION.review) {
      SESSION.cleanStreak = opts[+btn.dataset.i].ok ? (SESSION.cleanStreak || 0) + 1 : 0;
      showStreak();
      if (boss) window.Learner.noteBoss();
      SESSION.misses = opts[+btn.dataset.i].ok ? 0 : (SESSION.misses || 0) + 1;
      if (SESSION.misses >= 3) { SESSION.easyNext = true; SESSION.misses = 0; }
    }
    if (opts[+btn.dataset.i].ok) {
      btn.classList.add('ok');
      if (practice) { if (SESSION.review) reviewSolved(); else SESSION.done++; PK.recordPlay(game.id); } else recordFinal(game.id, pk ? false : missed); if (pk || !missed) addPeach();
      $('#cheer').textContent = pk ? T().prekNice : SESSION.learnerMode === 'slow' ? L(B('Great try!', '잘 도전했어요!')) : pick(T().right) + (SESSION.learnerMode === 'challenge' && !document.body.classList.contains('skin-explorer') && SESSION.cleanStreak ? ` 🏅${SESSION.cleanStreak}` : '');
      if (typeof window.rememberDictionaryWords === 'function') window.rememberDictionaryWords(item.vocab);
      if (item.after) $('#fact').textContent = L(item.after);
      say(item.vocab && S.lang !== 'en' ? item.vocab : (item.after ? L(item.after) : ''), item.vocab && S.lang !== 'en' ? 'en-US' : undefined);
      if (item.vocab && S.lang !== 'en' && item.after) say(L(item.after), undefined, true);
      $$('.opt').forEach(o => o.disabled = true);
      if (item.onCorrect) item.onCorrect();
      nextButton(() => game.play(), pk ? {auto:false} : {});
    } else {
      if (pk) { $('#cheer').textContent=T().prekAgain; say(T().prekAgain); return; }
      SESSION.cleanStreak = 0; showStreak();
      btn.classList.add('no'); missed = true; record(game.id, false);
      $('#cheer').textContent = T().again; say(T().again);
      setTimeout(() => btn.classList.remove('no'), 400);
      if (++wrongs === 2 && !ctx.resume && stepDownReady(game)) {
        let small = null; try { small = game.stepDown(item); } catch (e) { small = null; }
        if (small && small.opts?.length) {
          $$('.opt').forEach(o => o.disabled = true);
          say(L(B("Let's try a smaller step first.", '먼저 작은 단계를 해 봐요.')), undefined, true);
          setTimeout(() => { if (still()) quiz(game, small, { step: item }); }, 1500);
        }
      }
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
const GRADES = ['P', 'K', '1', '2', '3', '4', '5'];
const kidGrade = () => (GRADES.includes(curKid().grade) ? curKid().grade : 'K');
const prevGrade = (g) => GRADES[GRADES.indexOf(g) - 1] || null;
const heldGame = (g) => (g.grade === 'P' && !PREK_READY) || g.grade === '5' && g.subject === 'ss' && !(typeof GRADE5_SS_READY !== 'undefined' && GRADE5_SS_READY);   // opened later; still reachable by ?game= for review
const visibleGames = () => GAMES.filter(g => { const gr = gradeOf(g); return !heldGame(g) && (kidGrade() === 'P' ? gr === 'P' : (gr === 'both' || gr === kidGrade() || (S.showK && gr === prevGrade(kidGrade())))); });
