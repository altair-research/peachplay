'use strict';
// (1) Notice switch: on start, when online, read notice.json from this site (never cached) and show a message.
//     {"id":"...","level":"info"|"block","en":"...","ko":"...","link":"https://...","linkText":{"en":"...","ko":"..."}}
//     info  = a banner that can be closed (remembered per device by id); block = a full screen message (for moving everyone
//     to a new app or address). An empty file or {} shows nothing. Edit src/notice.json and publish to use it.
// (2) Anonymous count: when NOTICE_STATS_URL is set, the app sends one request per device per day with no cookie, no id and
//     no child data (only the page name). It stays off until the owner turns it on and updates the privacy policy.
(() => {
  const NOTICE_STATS_URL = 'https://peachplay.goatcounter.com/count';                      // e.g. 'https://<code>.goatcounter.com/count' (see docs/notice-and-stats.md)
  const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } };
  const txt = (o) => (o && typeof o === 'object' ? (o[S.lang] || o.en || '') : '');
  const esc = (s) => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const safeLink = (u) => (/^https:\/\//.test(u || '') ? u : '');

  function show(n) {
    if (!n || typeof n !== 'object' || !n.id || (n.level !== 'info' && n.level !== 'block')) return;
    const msg = esc(txt({ en: n.en, ko: n.ko })), link = safeLink(n.link), lt = esc(txt(n.linkText)) || (S.lang === 'ko' ? '열기' : 'Open');
    if (!msg) return;
    if (n.level === 'block') {
      const d = document.createElement('div'); d.className = 'pp-notice-block'; d.setAttribute('role', 'alertdialog');
      d.innerHTML = `<div class="pp-nb-card"><p>${msg}</p>${link ? `<a class="next" href="${link}" rel="noopener">${lt}</a>` : ''}
        <p class="note2">${S.lang === 'ko' ? '아이 기록을 옮기려면 보호자 화면의 백업을 먼저 저장해 주세요.' : 'To keep your child\'s progress, save a backup from the grown-ups page first.'}</p>
        <button class="link" id="ppnbBackup">${S.lang === 'ko' ? '백업 저장하러 가기' : 'Go to backup'}</button></div>`;
      document.body.appendChild(d);
      d.querySelector('#ppnbBackup').onclick = () => { d.remove(); if (typeof grownups === 'function') grownups(); };
      return;
    }
    if (ls('pp.notice') === n.id) return;
    const b = document.createElement('div'); b.className = 'pp-notice'; b.setAttribute('role', 'status');
    b.innerHTML = `<span>📢 ${msg}</span>${link ? ` <a href="${link}" rel="noopener">${lt}</a>` : ''}<button aria-label="${S.lang === 'ko' ? '닫기' : 'Close'}">✕</button>`;
    b.querySelector('button').onclick = () => { ls('pp.notice', n.id); b.remove(); };
    document.body.appendChild(b);
  }

  function count() {
    if (!NOTICE_STATS_URL || navigator.doNotTrack === '1' || !navigator.onLine) return;
    const day = new Date().toISOString().slice(0, 10); if (ls('pp.counted') === day) return;
    ls('pp.counted', day);
    try { const i = new Image(); i.referrerPolicy = 'no-referrer'; i.src = `${NOTICE_STATS_URL}?p=${encodeURIComponent('/play/open')}&t=PeachPlay&b=0&rnd=${Date.now()}`; } catch (e) {}
  }

  if (location.protocol.startsWith('http') && navigator.onLine !== false) {
    fetch('notice.json', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).then(show).catch(() => {});
  }
  count();
})();
