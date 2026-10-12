'use strict';
// Grown-ups tools: back up / restore progress (JSON file or copy code) and send feedback by e-mail.
// Self-contained; app.js only calls backupHtml() and backupBind() from the grown-ups screen. Nothing is sent anywhere automatically.
const FEEDBACK_EMAIL = 'altair.research.lab@gmail.com';
const BK = {
  title: B('Backup & restore', '백업과 복원'),
  note: B("Progress lives only on this device. Save a backup file (or code) to move it to another device or keep it safe. The file contains your children's names and progress, so keep it private.", '기록은 이 기기에만 저장돼요. 다른 기기로 옮기거나 안전하게 보관하려면 백업 파일(또는 코드)을 저장하세요. 파일에는 아이 이름과 기록이 들어 있으니 다른 사람에게 보내지 마세요.'),
  readFail: B('Could not read progress. No backup was created. Please try again in a normal browser window.', '기록을 읽지 못해 백업을 만들지 않았어요. 일반 브라우저 창에서 다시 시도해 주세요.'),
  save: B('Save backup file', '백업 파일 저장'), copy: B('Copy backup code', '백업 코드 복사'), copied: B('Copied!', '복사됐어요!'),
  load: B('Restore from file', '파일에서 복원'), paste: B('Restore from code', '코드로 복원'), pasteHint: B('Paste backup code here', '백업 코드를 여기에 붙여넣기'),
  ask: B('Replace ALL progress on this device with the backup? This cannot be undone.', '이 기기의 모든 기록을 백업 내용으로 바꿀까요? 되돌릴 수 없어요.'),
  ok: B('Restored! Reloading…', '복원했어요! 다시 불러옵니다…'), bad: B('That does not look like a PeachPlay backup.', 'PeachPlay 백업이 아니에요.'), full: B('Could not save on this device (storage full or blocked). Your old progress was kept.', '이 기기에 저장하지 못했어요(저장 공간 부족 또는 차단). 기존 기록은 그대로예요.'), rollbackFail: B('Restore failed and the old progress could not be fully put back. Please save a backup of what is left and contact us.', '복원에 실패했고 기존 기록을 완전히 되돌리지 못했어요. 남은 기록을 백업해 두고 문의해 주세요.'),
  fbTitle: B('Send feedback', '의견 보내기'), fbNote: B('Opens your e-mail app with a draft to the app maker. Nothing is sent until you press Send in your mail app. No tracking.', '이메일 앱에 초안이 열려요. 메일 앱에서 보내기를 누르기 전에는 아무것도 전송되지 않고, 추적도 없어요.'),
  fbKind: B('Type', '종류'), kinds: [B('Bug / something broke', '오류 / 고장'), B('Idea / request', '아이디어 / 요청'), B('Question', '질문'), B('Other', '기타')],
  fbMsg: B('What happened? What would you like?', '무슨 일이 있었나요? 바라는 점은요?'),
  fbDev: B('Include device info (browser, screen size, language)', '기기 정보 포함(브라우저, 화면 크기, 언어)'),
  fbProg: B('Include a progress summary (totals only, no names)', '기록 요약 포함(합계만, 이름 없음)'),
  fbSend: B('Open e-mail draft', '이메일 초안 열기'), fbCopy: B('Copy message', '내용 복사'), fbTo: B('Or write to', '직접 보내기:'), legal: [B('Privacy Policy', '개인정보 처리방침'), B('Terms of Use', '이용 약관')],
};
const BK_RE = /^sag\.(profiles|v2(\.[A-Za-z0-9_-]+)?)$/;
function backupCollect() {
  const data = {};
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (BK_RE.test(k)) data[k] = localStorage.getItem(k); } } catch (e) { throw new Error('backup read failed', { cause: e }); }
  if (!Object.keys(data).length || Object.values(data).some(v => typeof v !== 'string')) throw new Error('backup is empty or incomplete');
  return { app: 'peachy', format: 1, appVersion: APP_VERSION, exported: new Date().toISOString(), data };
}
function backupParse(text) {
  let o; try { o = JSON.parse(String(text).trim()); } catch (e) { return null; }
  if (!isObj(o) || (o.app !== 'peachy' && o.app !== 'peachplay') || o.format !== 1 || !isObj(o.data)) return null;
  const ks = Object.keys(o.data); if (!ks.length || ks.length > 12) return null;
  const parsed = {};
  for (const k of ks) { if (!BK_RE.test(k) || typeof o.data[k] !== 'string') return null; try { parsed[k] = JSON.parse(o.data[k]); } catch (e) { return null; } if (!isObj(parsed[k])) return null; }
  // children: every entry must be valid (not silently repaired), and the active child must exist
  let prof = null;
  if ('sag.profiles' in parsed) {
    prof = cleanProf(parsed['sag.profiles']); const raw = parsed['sag.profiles'];
    if (!prof || !Array.isArray(raw.list) || raw.list.length !== prof.list.length || raw.active !== prof.active || raw.list.some((k, i) => k.id !== prof.list[i].id || k.grade !== prof.list[i].grade)) return null;
  } else if ('sag.v2' in parsed) prof = { active: 'p1', list: [{ id: 'p1', name: '', avatar: '🍑', grade: 'K' }] };
  else return null;
  const ids = new Set(prof.list.map(k => k.id)), data = {};
  for (const k of ks) {
    if (k === 'sag.profiles') { data[k] = JSON.stringify(prof); continue; }
    const id = k === 'sag.v2' ? 'p1' : k.slice('sag.v2.'.length);
    if (!ids.has(id)) return null;                                       // data for a child that is not in the list
    data[k] = JSON.stringify(cleanState(parsed[k]));
  }
  return { app: o.app, format: 1, data };
}
function backupApply(o, say2) {
  const snap = {};                                                       // exact copy of what is stored now
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (BK_RE.test(k)) snap[k] = localStorage.getItem(k); } } catch (e) { return say2(L(BK.full)); }
  const written = [];
  const rollback = () => { let ok = true; try { written.forEach(k => { if (!(k in snap)) localStorage.removeItem(k); }); Object.entries(snap).forEach(([k, v]) => { if (localStorage.getItem(k) !== v) localStorage.setItem(k, v); }); } catch (e) { ok = false; } return ok; };
  try {
    const keys = Object.keys(o.data).sort((a, b) => (a === 'sag.profiles') - (b === 'sag.profiles'));   // the child list is written last
    keys.forEach(k => { localStorage.setItem(k, o.data[k]); written.push(k); });
    Object.keys(snap).forEach(k => { if (!(k in o.data)) localStorage.removeItem(k); });                  // drop children that are not in the backup
    say2(L(BK.ok)); setTimeout(() => location.reload(), 700);
  } catch (e) { console.warn('[peachy] restore failed', e); say2(rollback() ? L(BK.full) : L(BK.rollbackFail)); }
}
function feedbackBody(msg, dev, prog) {
  const lines = [msg.trim(), '', '---', `PeachPlay v${APP_VERSION} (${APP_BUILD})`];
  if (dev) lines.push(`Browser: ${navigator.userAgent}`, `Screen: ${screen.width}x${screen.height} @${window.devicePixelRatio || 1}, window ${innerWidth}x${innerHeight}`, `Language: ${navigator.language} / app ${S.lang}`, `Installed app: ${(matchMedia('(display-mode: standalone)').matches || navigator.standalone) ? 'yes' : 'no'}`);
  if (prog) { let r = 0, w = 0, g = 0; Object.values(S.stats || {}).forEach(s => { r += s.right; w += s.wrong; if (s.right + s.wrong) g++; }); lines.push(`Progress (current child): ${g} games tried, ${r} right, ${w} missed`); }
  return lines.join('\n');
}
function backupHtml() {
  const kinds = BK.kinds.map((k, i) => `<option value="${i}">${L(k)}</option>`).join('');
  return `<section class="bk"><h2>💾 ${L(BK.title)}</h2><p class="note2">${L(BK.note)}</p>
    <div class="form"><button class="pill" id="bkSave">${L(BK.save)}</button><button class="pill" id="bkCopy">${L(BK.copy)}</button>
    <button class="pill" id="bkLoad">${L(BK.load)}</button><input type="file" id="bkFile" accept="application/json,.json" hidden></div>
    <div class="form"><textarea id="bkText" rows="2" placeholder="${L(BK.pasteHint)}"></textarea><button class="pill" id="bkPaste">${L(BK.paste)}</button></div>
    <p class="bkmsg" id="bkMsg" role="status" aria-live="polite"></p>
    <h2>✉️ ${L(BK.fbTitle)}</h2><p class="note2">${L(BK.fbNote)}</p>
    <div class="form fb"><label>${L(BK.fbKind)} <select id="fbKind">${kinds}</select></label>
    <textarea id="fbMsg" rows="4" placeholder="${L(BK.fbMsg)}"></textarea>
    <label class="chkl"><input type="checkbox" id="fbDev"> ${L(BK.fbDev)}</label>
    <label class="chkl"><input type="checkbox" id="fbProg"> ${L(BK.fbProg)}</label>
    <button class="next" id="fbSend">${L(BK.fbSend)}</button><button class="pill" id="fbCopy">${L(BK.fbCopy)}</button></div>
    <p class="note2">${L(BK.fbTo)} ${FEEDBACK_EMAIL}</p>
    <p class="note2"><a href="../privacy.html" target="_blank" rel="noopener">${L(BK.legal[0])}</a> · <a href="../terms.html" target="_blank" rel="noopener">${L(BK.legal[1])}</a></p></section>`;
}
function backupBind() {
  const msg = (t) => { const m = $('#bkMsg'); if (m) m.textContent = t; };
  const json = () => JSON.stringify(backupCollect());
  const restore = (text) => { const o = backupParse(text); if (!o) return msg(L(BK.bad)); if (confirm(L(BK.ask))) backupApply(o, msg); };
  const copyText = (t, done) => {
    const old = () => { const ta = document.createElement('textarea'); ta.value = t; document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (e) {} ta.remove(); done(ok); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(() => done(true), old); else old();
  };
  $('#bkSave').onclick = () => { try { const b = new Blob([json()], { type: 'application/json' }), a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `peachy-backup-${today()}.json`; document.body.appendChild(a); a.click(); setTimeout(() => { a.remove(); URL.revokeObjectURL(a.href); }, 1500); } catch (e) { console.warn('[peachy] backup save', e); msg(L(BK.readFail)); } };
  $('#bkCopy').onclick = () => { try { copyText(json(), ok => msg(ok ? L(BK.copied) : L(BK.readFail))); } catch (e) { msg(L(BK.readFail)); } };
  $('#bkLoad').onclick = () => $('#bkFile').click();
  $('#bkFile').onchange = (e) => { const f = e.target.files[0]; if (!f) return; if (f.size > 5e6) return msg(L(BK.bad)); const r = new FileReader(); r.onload = () => restore(r.result); r.onerror = () => msg(L(BK.bad)); r.readAsText(f); e.target.value = ''; };
  $('#bkPaste').onclick = () => restore($('#bkText').value);
  const draft = () => `${L(BK.kinds[+$('#fbKind').value])}\n\n${feedbackBody($('#fbMsg').value, $('#fbDev').checked, $('#fbProg').checked)}`;
  $('#fbSend').onclick = () => { location.href = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent('PeachPlay feedback v' + APP_VERSION)}&body=${encodeURIComponent(draft())}`; };
  $('#fbCopy').onclick = () => copyText(draft(), ok => msg(ok ? L(BK.copied) : ''));
}
