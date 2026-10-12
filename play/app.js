'use strict';
// App shell: home menu grouped by school subject, grown-ups panel, language switch.
const SUBJECT_ORDER = ['math', 'read', 'write', 'ss', 'sci', 'life', 'create', 'gifted', 'brain'];
const SUBJECT_ICON = { math: '🔢', read: '📖', write: '✏️', ss: '🍑', sci: '🔬', life: '🌈', create: '🎭', gifted: '🚀', brain: '🧠' };
GAMES.forEach(g => { g.play = g.play.bind(g); });

function home() {
  $('#langBtn').textContent = T().switchTo; renderNav();
  document.documentElement.lang = S.lang;
  view().innerHTML = `
    <div class="hero">${PEACH_SVG('happy')}<div class="bubble">${T().heroHi}</div></div>
    <h1>${T().app}</h1>
    <div class="tag">${T().tagline}</div>
    <div class="toprow"><button class="big surprise" id="surprise"><span class="gi">🎲</span><span class="bt">${T().surprise}<small>${T().surpriseSub}</small></span></button><button class="big surprise" id="stickers"><span class="gi">🏆</span>${T().stickers} ${S.stickers.length}/${ALL_STICKERS.length}</button></div>
    ${continueHtml()}
    ${goalHtml()}
    ${favHtml()}
    ${picksHtml()}
    <div class="searchrow"><input id="gsearch" type="search" autocomplete="off" placeholder="🔍 ${L(B('Search games', '게임 찾기'))}" aria-label="${L(B('Search games', '게임 찾기'))}"></div>
    <div id="gresults"></div>
    <div id="subjtiles" class="menu">${SUBJECT_ORDER.filter(sub => visibleGames().some(g => g.subject === sub)).map(subjTile).join('')}</div>
    ${prevGrade(kidGrade()) ? `<button class="link" id="showk">${S.showK ? L(B(`Hide ${prevGrade(kidGrade()) === 'K' ? 'kindergarten' : 'grade ' + prevGrade(kidGrade())} games`, `${prevGrade(kidGrade()) === 'K' ? '유치원(K)' : prevGrade(kidGrade()) + '학년'} 게임 숨기기`)) : L(B(`Show ${prevGrade(kidGrade()) === 'K' ? 'kindergarten' : 'grade ' + prevGrade(kidGrade())} games too`, `${prevGrade(kidGrade()) === 'K' ? '유치원(K)' : prevGrade(kidGrade()) + '학년'} 게임도 보기`))}</button>` : ''}
    <button class="link" id="find">${T().findStart}</button>
    <button class="link" id="settings">⚙️ ${L(B('Settings', '설정'))}</button>
    <button class="link" id="parent">${T().grownups}</button>
    <p class="note">${T().note}</p><p class="ver">${verText()}</p>`;
  wireGames(); $$('.stile').forEach(b => b.onclick = () => subjectScreen(b.dataset.sub));
  $('#gsearch').oninput = (e) => {
    const q = e.target.value.trim().toLowerCase(), box = $('#gresults');
    if (!q) { box.innerHTML = ''; $('#subjtiles').style.display = ''; return; }
    const hits = visibleGames().filter(g => `${g.title.en} ${g.title.ko} ${g.sub.en} ${g.sub.ko}`.toLowerCase().includes(q));
    $('#subjtiles').style.display = 'none';
    box.innerHTML = hits.length ? `<div class="menu">${hits.map(gameBtn).join('')}</div>` : `<p class="note2">${L(B('No games found.', '찾는 게임이 없어요.'))}</p>`;
    wireGames();
  };
  if ($('#showk')) $('#showk').onclick = () => { S.showK = !S.showK; save(); home(); };
  $('#parent').onclick = () => gate(grownups); $('#settings').onclick = settings; $('#find').onclick = intro;
  $('#surprise').onclick = surprise; $('#stickers').onclick = stickerBook;
  window.scrollTo(0, 0);
}

// ---- home helpers: games are shown per subject (tiles -> subject screen), with continue, picks and search
const isFav = (id) => (S.fav || []).includes(id);
const gameBtn = (g) => `<div class="gwrap"><button class="big ${g.subject}" data-id="${g.id}"><span class="gi">${g.icon}</span>${L(g.title)}<small>${L(g.sub)}</small></button><button class="fav${isFav(g.id) ? ' on' : ''}" data-fav="${g.id}" aria-pressed="${isFav(g.id)}" aria-label="${L(B('Favorite', '즐겨찾기'))}">${isFav(g.id) ? '★' : '☆'}</button></div>`;
const subjTile = (sub) => { const n = visibleGames().filter(g => g.subject === sub).length; return `<button class="big ${sub} stile" data-sub="${sub}"><span class="gi">${SUBJECT_ICON[sub]}</span>${T().subjects[sub]}<small>${L(B(`${n} games`, `게임 ${n}개`))}</small></button>`; };
const wireGames = () => {
  $$('.big[data-id]').forEach(b => b.onclick = () => launch(gameById(b.dataset.id)));
  $$('.fav[data-fav]').forEach(b => b.onclick = () => {
    const id = b.dataset.fav, f = S.fav = (S.fav || []).filter(x => x !== id); if (!b.classList.contains('on')) f.unshift(id); S.fav = f.slice(0, 30); save();
    $$(`.fav[data-fav="${id}"]`).forEach(x => { const on = isFav(id); x.classList.toggle('on', on); x.textContent = on ? '★' : '☆'; x.setAttribute('aria-pressed', on); });
  });
};
function favHtml() {
  const gs = (S.fav || []).map(id => visibleGames().find(g => g.id === id)).filter(Boolean); if (!gs.length) return '';
  return `<section class="subj favs"><h2>⭐ ${L(B('My favorites', '즐겨찾기'))}</h2><div class="menu">${gs.map(gameBtn).join('')}</div></section>`;
}
const GOAL = 20;                                   // answers per day (a gentle target, not a timer)
function goalHtml() {
  const h = (S.hist || {})[today()] || { r: 0, w: 0 }, n = h.r + h.w, st = typeof streakDays === 'function' ? streakDays() : 0, pct = Math.min(100, Math.round(100 * n / GOAL));
  return `<div class="goalrow"><span>🎯 ${L(B(`Today ${Math.min(n, GOAL)}/${GOAL}`, `오늘의 목표 ${Math.min(n, GOAL)}/${GOAL}`))}${n >= GOAL ? ' ✅' : ''}</span><span class="goalbar"><i style="width:${pct}%"></i></span>${st > 1 ? `<span>🔥 ${L(B(`${st} days in a row`, `${st}일 연속`))}</span>` : ''}</div>`;
}
const PREFS = [['sfxOff', '🎵', B('Sound effects', '효과음'), true], ['voiceOff', '🗣️', B('Read-aloud voice', '읽어 주는 목소리'), true], ['calm', '🌙', B('Less motion (no confetti or shaking)', '움직임 줄이기 (색종이·흔들림 없음)'), false], ['readable', '🔤', B('Easy-to-read letters', '읽기 쉬운 글꼴'), false]];
function applyPrefs() { document.body.classList.toggle('calm', !!S.calm); document.body.classList.toggle('readable', !!S.readable); }
function settings() {
  // the first two are stored as "off" switches so that older saves keep sound on
  const on = (p) => (p[3] ? !S[p[0]] : !!S[p[0]]);
  view().innerHTML = `<h1>⚙️ ${L(B('Settings', '설정'))}</h1><p class="tag">${L(B('These settings are saved for this child on this device.', '이 기기에서 이 아이에게만 저장돼요.'))}</p>
    <div class="prefs">${PREFS.map(p => `<button class="pref${on(p) ? ' on' : ''}" data-k="${p[0]}" aria-pressed="${on(p)}"><span class="pi">${p[1]}</span><span class="pt">${L(p[2])}</span><span class="ps">${on(p) ? L(B('On', '켜짐')) : L(B('Off', '꺼짐'))}</span></button>`).join('')}</div>
    <div><button class="next" id="b">${T().back}</button></div>`;
  $$('.pref').forEach(b => b.onclick = () => { const k = b.dataset.k; S[k] = !S[k]; save(); applyPrefs(); if (k === 'voiceOff' && S.voiceOff) { try { speechSynthesis.cancel(); } catch (e) {} } settings(); });
  $('#b').onclick = home; window.scrollTo(0, 0);
}
function continueHtml() {
  const g = S.last && visibleGames().find(x => x.id === S.last); if (!g) return '';
  return `<div class="controw"><button class="big cont ${g.subject}" data-id="${g.id}"><span class="gi">▶️</span>${L(B('Continue', '이어서 하기'))}<small>${g.icon} ${L(g.title)}</small></button></div>`;
}
function subjectScreen(sub) {
  const games = visibleGames().filter(g => g.subject === sub);
  view().innerHTML = `<h1>${SUBJECT_ICON[sub]} ${T().subjects[sub]}</h1>
    ${(sub === 'brain' || sub === 'create') ? '' : `<div class="subjtools"><button class="chk" data-sub="${sub}">📋 ${T().checkBtn}</button></div>`}
    <div class="menu">${games.map(gameBtn).join('')}</div>
    <div><button class="next" id="b">${T().back}</button></div>`;
  wireGames(); $$('.chk').forEach(b => b.onclick = () => startDiag(b.dataset.sub)); $('#b').onclick = home;
  window.scrollTo(0, 0);
}

function stickerBook() {
  view().innerHTML = `<h1>🏆 ${T().stickersTitle}</h1><p class="tag">${T().stickerHint}</p>
    <div class="stickergrid">${ALL_STICKERS.map(s => S.stickers.includes(s) ? `<div class="stk got">${s}</div>` : `<div class="stk lock">🔒</div>`).join('')}</div>
    <div><button class="next" id="b">${T().back}</button></div>`;
  $('#b').onclick = home;
}

function picksHtml() {
  const picks = currentPicks(3); if (!picks.length) return '';
  return `<section class="subj picks"><h2>⭐ ${T().picks}</h2><div class="menu">${picks.map(p => { const g = gameById(p.id); return `<button class="big ${g.subject} pick" data-id="${g.id}"><span class="gi">${g.icon}</span>${L(g.title)}<small>${whyText(p)}</small></button>`; }).join('')}</div></section>`;
}

const gradeTag = (g) => (g === 'K' ? 'K' : S.lang === 'ko' ? g + '학년' : g + ({ 1: 'st', 2: 'nd', 3: 'rd' }[g] || 'th') + ' grade');
function checksTable() {
  if (!S.checks.length) return `<p class="note2">${T().focusNone}</p>`;
  const rows = [...S.checks].reverse().slice(0, 12).map(c => `<tr><td>${c.at.replace('T', ' ')}</td><td>${scopeName(c.scope)} · ${gradeTag(c.grade || 'K')}</td><td>${c.ok}/${c.total}</td><td><span class="bar2"><i style="width:${Math.round(100 * c.ok / c.total)}%"></i></span></td></tr>`).join('');
  return `<table><tr><th>${T().colDate}</th><th>${T().colArea}</th><th>${T().colScore}</th><th></th></tr>${rows}</table>`;
}

const CH_AREAS = [['areaVerbal', ['analogy', 'logic']], ['areaQuant', ['numseries', 'numanalogy', 'add20', 'skipcount']], ['areaNonverbal', ['matrix', 'classify', 'rotate']], ['areaCreative', ['uses', 'imagine', 'scene', 'storyspark']]];
function challengeTable() {
  const rows = CH_AREAS.map(([k, ids]) => { const t = ids.reduce((a, id) => { const s = stat(id); return [a[0] + s.right, a[1] + s.right + s.wrong]; }, [0, 0]); const pct = t[1] ? Math.round(100 * t[0] / t[1]) : 0; return `<tr><td>${T()[k]}</td><td>${t[1]}</td><td>${t[1] ? pct + '%' : '-'}</td><td><span class="bar2"><i style="width:${pct}%"></i></span></td></tr>`; }).join('');
  return `<table><tr><th></th><th>${T().colTried}</th><th>${T().colRight}</th><th></th></tr>${rows}</table><p class="note2">${T().challengeNote}</p>`;
}

// A small question for grown-ups before the settings page (keeps the reset and backup buttons away from small children).
function gate(next) {
  const x = 6 + rnd(4), y = 6 + rnd(4);
  view().innerHTML = `<h1>🔒 ${T().grownups}</h1><p class="tag">${L(B(`Grown-ups only. What is ${x} × ${y}?`, `어른용 화면이에요. ${x} × ${y} = ?`))}</p>
    <div class="form"><input id="gans" inputmode="numeric" autocomplete="off" aria-label="${x} × ${y}"><button class="next" id="gok">OK</button> <span id="gmsg"></span></div>
    <div><button class="next" id="b">${T().back}</button></div>`;
  const check = () => { if (+$('#gans').value.trim() === x * y) next(); else { $('#gmsg').textContent = L(B('Not quite. Try again!', '다시 해 보세요!')); $('#gans').value = ''; } };
  $('#gok').onclick = check; $('#gans').onkeydown = (e) => { if (e.key === 'Enter') check(); }; $('#b').onclick = home;
  window.scrollTo(0, 0);
}

function grownups() {
  const rows = visibleGames().map(g => { const s = stat(g.id); return `<tr><td>${g.icon} ${L(g.title)}</td><td>${L(g.area)}</td><td>${s.right}</td><td>${s.wrong}</td><td>${s.level}</td></tr>`; }).join('');
  const weak = visibleGames().map(g => ({ g, s: stat(g.id) })).filter(x => x.s.right + x.s.wrong >= 5).sort((a, b) => a.s.right / (a.s.right + a.s.wrong) - b.s.right / (b.s.right + b.s.wrong)).slice(0, 3);
  view().innerHTML = `<h1>${T().grownups}</h1>
    <p class="focus"><b>${T().focus}</b> ${weak.length ? weak.map(x => `${x.g.icon} ${L(x.g.title)}`).join(' · ') : T().focusNone}</p>
    <div class="tablewrap"><table><tr><th>${T().colGame}</th><th>${T().colArea}</th><th>${T().colRight}</th><th>${T().colMiss}</th><th>${T().colLevel}</th></tr>${rows}</table></div>
    <h2>${T().challengeTitle}</h2>
    <div class="tablewrap">${challengeTable()}</div>
    <details class="gi"><summary>${T().giftedInfoTitle}</summary><p>${T().giftedInfo}</p></details>
    <h2>${T().progressTitle}</h2>
    <button class="pill" id="gprog">📈 ${L(PT.prog)}</button> <button class="pill" id="gkids">👧👦 ${L(PT.kids)}</button>
    <div class="tablewrap">${checksTable()}</div>
    <h2>${T().addrTitle}</h2>
    <div class="form"><input id="street" placeholder="${T().street}" value="${S.addr.street.replace(/"/g, '&quot;')}"><input id="city" placeholder="${T().city}" value="${S.addr.city.replace(/"/g, '&quot;')}">
    <button class="next" id="saveAddr">${T().save}</button> <span id="savedMsg"></span></div>
    <h2>${L(PT.shareT)}</h2><p class="note2">${L(PT.shareN)}</p>
    <div class="form"><input id="shareUrl" readonly value="${SITE_URL}"><button class="next" id="copyLink">📋 ${L(PT.copy)}</button> <span id="copiedMsg"></span></div>
    ${typeof backupHtml === 'function' ? backupHtml() : ''}
    <button class="link" id="reset">${T().reset}</button>
    <div><button class="next" id="b">${T().back}</button></div><p class="ver">${verText()}</p>`;
  $('#saveAddr').onclick = () => { S.addr = { street: $('#street').value.trim(), city: $('#city').value.trim() }; save(); $('#savedMsg').textContent = T().saved; };
  $('#reset').onclick = () => { if (confirm(T().resetAsk)) { S.stats = {}; S.peaches = 0; S.profile = null; S.checks = []; S.hist = {}; S.stickers = []; S.bp = { level: 1, best: 0, stars: {}, friends: [], skin: 'plain', daily: null }; S.showK = false; S.last = ''; save(); renderPeaches(); grownups(); } };
  $('#copyLink').onclick = () => { const u = $('#shareUrl'), done = (ok) => { $('#copiedMsg').textContent = ok ? L(PT.copied) : ''; };
    const old = () => { try { u.focus(); u.select(); done(document.execCommand('copy')); } catch (e) { done(false); } };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(SITE_URL).then(() => done(true), old); else old(); };
  if (typeof backupBind === 'function') backupBind();
  $('#gprog').onclick = progressScreen; $('#gkids').onclick = profilesScreen;
  $('#b').onclick = home;
}

function renderMute() {
  const b = $('#muteBtn'); b.textContent = S.muted ? '🔇' : '🔊'; b.classList.toggle('off', !!S.muted);
  b.setAttribute('aria-pressed', S.muted ? 'true' : 'false'); document.body.classList.toggle('muted', !!S.muted);
}
$('#muteBtn').onclick = () => { S.muted = !S.muted; save(); try { speechSynthesis.cancel(); } catch (e) {} renderMute(); };
renderMute(); applyPrefs();
$('#homeBtn').onclick = () => { quitDiag(); home(); };
$('#navProg').onclick = () => { quitDiag(); progressScreen(); };
$('#navFaq').onclick = () => { quitDiag(); faqScreen(); };
$('#rotok').onclick = () => document.body.classList.add('landok');
$('#profBtn').onclick = () => { quitDiag(); profilesScreen(); };
$('#stkChip').onclick = () => { quitDiag(); stickerBook(); };
$('#langBtn').onclick = () => { S.lang = S.lang === 'en' ? 'ko' : 'en'; save(); quitDiag(); home(); };
renderPeaches(); renderProfBtn(); S.introSeen ? home() : intro();
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
