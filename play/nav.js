(() => {
  'use strict';
  // 11-11 (user): "the back button leaves the app" and "I want to go back to Challenge and pick another one".
  // The app changed screens without telling the browser, so phone/browser Back closed the app.
  // Now home, a subject list, a game and the other main screens each get a history entry:
  // Back goes game -> subject list -> home, and only Back on home leaves the app. The header ← does the same.
  // Loaded after app.js: it wraps the global screen functions and never changes what they draw.
  if (!window.history || !history.pushState) return;
  let skip = 0, popping = false;
  const cur = () => (history.state && history.state.pp ? history.state : null);
  const depthNow = () => (cur() ? cur().depth || 0 : 0);
  const backBtn = document.getElementById('backBtn'), fwdBtn = document.getElementById('fwdBtn'), crumbs = document.getElementById('crumbs');
  // 11-12 (user): "show what program this is and what it belongs to, let me tap up to each level, and add back AND forward".
  // fwdMax = the deepest entry still kept by the browser after going back, so → shows only when Forward really works.
  let fwdMax = 0;
  const gradeTag = g => g === 'P' ? L(B('Pre-K', '프리케이')) : g === 'K' ? L(B('Kindergarten', '유치원')) : /^\d$/.test(g) ? L(B(`Grade ${g}`, `${g}학년`)) : '';
  function drawCrumbs() {
    if (!crumbs) return;
    const c = cur(), sub = c && (c.pp === 'subj' ? c.sub : c.pp === 'game' ? c.from || (GAMES.find(x => x.id === c.id) || {}).subject : null);
    if (!c || (c.pp !== 'subj' && c.pp !== 'game')) { crumbs.hidden = true; document.body.classList.remove('has-crumbs'); return; }
    const g = c.pp === 'game' ? GAMES.find(x => x.id === c.id) : null, sep = '<span class="cr-sep" aria-hidden="true">›</span>';
    const subName = sub && T().subjects[sub] ? T().subjects[sub] : '';
    let h = `<button class="cr-home" data-cr="home">🏠 ${L(B('Home', '홈'))}</button>`;
    if (subName) h += sep + (g ? `<button class="cr-sub" data-cr="sub">${subName}</button>` : `<span class="cr-here">${subName}</span>`);
    if (g) { const tag = gradeTag(gradeOf(g)); h += sep + `<span class="cr-here cr-game">${L(g.title)}</span>` + (tag ? `<span class="cr-grade">${tag}</span>` : ''); }
    if (g && document.getElementById('prevQ')) h += `<button class="cr-prev" data-cr="prev">⏮️ ${L(B('Previous question', '이전 문제'))}</button>`;
    if (crumbs.innerHTML !== h) crumbs.innerHTML = h;
    crumbs.hidden = false; document.body.classList.add('has-crumbs');
  }
  if (crumbs) crumbs.onclick = e => {
    const b = e.target.closest('[data-cr]'); if (!b) return;
    const c = cur(), sub = c && c.pp === 'game' ? c.from || (GAMES.find(x => x.id === c.id) || {}).subject : null;
    if (b.dataset.cr === 'home') window.home();
    else if (b.dataset.cr === 'sub') { if (c && c.pp === 'game' && c.from && depthNow() >= 2) history.back(); else if (sub) window.subjectScreen(sub); }
    else if (b.dataset.cr === 'prev') document.getElementById('prevQ')?.click();
  };
  function mark() {
    const c = cur(), d = depthNow();
    document.body.classList.toggle('can-back', d > 0);
    document.body.classList.toggle('can-fwd', fwdMax > d);
    drawCrumbs();
    if (!backBtn) return;
    const to = c && c.pp === 'game' && c.from ? T().subjects[c.from] : L(B('Back', '뒤로'));
    backBtn.setAttribute('aria-label', `${L(B('Back to', '돌아가기:'))} ${to}`);
    backBtn.title = to;
  }
  function push(state, replace) {
    if (popping) return;
    if (skip) replace = true;   // a jump back to home is still on its way: never stack entries on top of it
    const d = depthNow();
    if (replace) { state.depth = d; history.replaceState(state, ''); }
    else { state.depth = d + 1; history.pushState(state, ''); fwdMax = d + 1; }
    mark();
  }

  const H = window.home, SS = window.subjectScreen, LA = window.launch;
  const OTHER = { settings: window.settings, stickerBook: window.stickerBook, progressScreen: window.progressScreen, faqScreen: window.faqScreen, profilesScreen: window.profilesScreen };

  window.home = function () {
    const r = H.apply(this, arguments);
    if (!popping && depthNow() > 0) {
      if (skip) history.replaceState({ pp: 'home', depth: 0 }, '');
      else { skip++; history.go(-depthNow()); }
    }
    return r;
  };
  window.subjectScreen = function (sub) {
    const r = SS.apply(this, arguments), c = cur();
    push({ pp: 'subj', sub }, !!(c && c.pp === 'subj'));
    return r;
  };
  window.launch = function (game) {
    const c = cur(), from = c && c.pp === 'game' ? c.from : c && c.pp === 'subj' ? c.sub : null;
    const r = LA.apply(this, arguments);
    // A next game in the same run (mixed play, "play again") replaces the game entry instead of piling up.
    push({ pp: 'game', id: game.id, from }, !!(c && c.pp === 'game'));
    return r;
  };
  Object.keys(OTHER).forEach(name => {
    if (typeof OTHER[name] !== 'function') return;
    window[name] = function () {
      const r = OTHER[name].apply(this, arguments), c = cur();
      push({ pp: 'other', name }, !!(c && c.pp === 'other'));
      return r;
    };
  });
  // The grown-ups gate and the dictionary are screens too; Back from them returns to where the child was.
  const G = window.gate;
  if (typeof G === 'function') window.gate = function () { const r = G.apply(this, arguments), c = cur(); push({ pp: 'other', name: 'gate' }, !!(c && c.pp === 'other')); return r; };

  addEventListener('popstate', e => {
    if (skip) { skip--; mark(); return; }
    const st = e.state && e.state.pp ? e.state : { pp: 'home', depth: 0 };
    popping = true;
    try {
      try { speechSynthesis.cancel(); } catch (_) {}
      if (typeof DIAG !== 'undefined' && DIAG.active && typeof quitDiag === 'function') quitDiag();
      document.querySelector('.prevpeek')?.remove();
      if (st.pp === 'subj') SS(st.sub);
      else if (st.pp === 'game') { const g = GAMES.find(x => x.id === st.id); if (g) LA(g); else H(); }
      else if (st.pp === 'other' && OTHER[st.name]) OTHER[st.name]();
      else H();   // home, or a screen that must not be reopened without its gate
    } finally { popping = false; mark(); }
  });
  if (backBtn) backBtn.onclick = () => history.back();
  if (fwdBtn) { fwdBtn.onclick = () => history.forward(); fwdBtn.setAttribute('aria-label', L(B('Forward', '앞으로'))); }
  // The previous-question button appears inside the game after the first answer; keep the trail in step with it.
  const vw = document.getElementById('view');
  if (vw && typeof MutationObserver === 'function') { let q = 0; new MutationObserver(() => { if (q) return; q = requestAnimationFrame(() => { q = 0; drawCrumbs(); }); }).observe(vw, { childList: true, subtree: true }); }
  // Language changes redraw the screen; the trail follows.
  document.getElementById('langBtn')?.addEventListener('click', () => setTimeout(drawCrumbs, 0));

  // The app has already drawn its first screen (home, or a game from a ?game= link).
  history.replaceState({ pp: 'home', depth: 0 }, '');
  if (document.body.classList.contains('playing') && typeof SESSION !== 'undefined' && SESSION.id) push({ pp: 'game', id: SESSION.id, from: null });
  // The first home screen wired its buttons before this file loaded; draw it again so they use the screens above.
  else if (view().querySelector('#subjtiles')) H();
  mark();
})();
