'use strict';
// Reliability helpers: "new version" banner, blocked/full storage warning, console-only error logging. No network calls.
(function () {
  const lang = () => { try { return S.lang; } catch (e) { return 'en'; } };
  const TXT = { upd: { en: 'A new version is ready.', ko: '새 버전이 준비됐어요.' }, reload: { en: 'Reload', ko: '새로고침' }, later: { en: 'Later', ko: '나중에' },
    store: { en: 'Progress cannot be saved in this browser (private mode, blocked or full storage). Please use a normal window.', ko: '이 브라우저에서는 기록을 저장할 수 없어요(사생활 보호 모드, 차단 또는 저장 공간 부족). 일반 창에서 열어 주세요.' } };
  const bar = (id, html) => { if (document.getElementById(id)) return null; const d = document.createElement('div'); d.id = id; d.className = 'sbar2'; d.setAttribute('role', 'status'); d.innerHTML = html; document.body.appendChild(d); return d; };
  const offline = state => {
    window.peachOfflineState = state;
    document.querySelectorAll('[data-offline-status]').forEach(el => {
      const value = T()[state];
      if (el.textContent !== value) el.textContent = value;
    });
  };
  offline('offlinePreparing');

  // A waiting worker activates only when Reload is selected.
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    let approved = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (approved) location.reload(); });
    const offer = r => {
      if (!r || !r.waiting || !navigator.serviceWorker.controller) return;
      const d = bar('updbar', `<span>${TXT.upd[lang()]}</span><button class="pill" id="updGo">${TXT.reload[lang()]}</button><button class="pill" id="updLater">${TXT.later[lang()]}</button>`);
      if (d) { d.querySelector('#updGo').onclick = () => { if (r.waiting) { approved = true; r.waiting.postMessage({ type: 'ACTIVATE_UPDATE' }); } else location.reload(); }; d.querySelector('#updLater').onclick = () => d.remove(); }
    };
    const inspect = w => {
      if (!w || w.state !== 'activated') return;
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); offline('offlineFailed'); }, 10000);
      channel.port1.onmessage = e => { clearTimeout(timer); channel.port1.close(); offline(e.data.ready ? 'offlineReady' : 'offlineFailed'); };
      w.postMessage({ type: 'OFFLINE_STATUS' }, [channel.port2]);
    };
    const watch = r => {
      offer(r);
      inspect(r.active);
      const track = () => {
        const w = r.installing;
        if (!w) return;
        if (!r.active) offline('offlinePreparing');
        w.addEventListener('statechange', () => {
          if (w.state === 'installed') offer(r);
          if (w.state === 'activated') inspect(w);
          if (w.state === 'redundant' && !r.active) offline('offlineFailed');
        });
      };
      track();
      r.addEventListener('updatefound', track);
    };
    // Register on every launch: a rejected first install is retried without
    // storing a success flag or unregistering the working previous version.
    navigator.serviceWorker.register('sw.js').then(watch).catch(() => offline('offlineFailed'));
    navigator.serviceWorker.addEventListener('controllerchange', () => inspect(navigator.serviceWorker.controller));
    const check = () => navigator.serviceWorker.getRegistration().then(r => { offer(r); return r && r.update(); }).catch(() => {});
    document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    setInterval(check, 30 * 60 * 1000);
  } else offline('offlineUnavailable');

  // 2) Storage warning: shown once if localStorage is unavailable or a write fails.
  const warn = () => { const d = bar('storbar', `<span>${TXT.store[lang()]}</span><button class="pill" id="storOk">OK</button>`); if (d) d.querySelector('#storOk').onclick = () => d.remove(); };
  try { localStorage.setItem('sag.probe', '1'); localStorage.removeItem('sag.probe'); } catch (e) { console.warn('[peachy] storage unavailable', e); setTimeout(warn, 800); }
  try {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) { try { return orig.call(this, k, v); } catch (e) { console.warn('[peachy] storage write failed', k, e); warn(); throw e; } };
  } catch (e) {}

  // Give new screens a predictable reading/focus start after their DOM is built.
  const root = document.querySelector('#view');
  if (root) new MutationObserver(records => {
    if (!records.some(r => r.type === 'childList' && r.target === root)) return;
    root.classList.toggle('settings-screen', !!root.querySelector('.prefs'));
    root.querySelectorAll('.fact').forEach(el => el.setAttribute('role', 'status'));
    if (root.contains(document.activeElement)) return;
    const heading = root.querySelector('.prompt, h1, .bphead');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }).observe(root, { childList: true });

  // 3) Errors go to the console only.
  addEventListener('error', e => console.error('[peachy] error', e.message, e.filename + ':' + e.lineno));
  addEventListener('unhandledrejection', e => console.error('[peachy] rejection', e.reason));
})();
