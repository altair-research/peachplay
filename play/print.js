(() => {
  'use strict';
  // Read-only, active-child snapshot. No storage writes, uploads or external assets.
  const cssURL = new URL('print.css', document.currentScript ? document.currentScript.src : document.baseURI).href;
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const count = n => Number.isFinite(n) ? Math.max(0, n) : 0;
  window.openPrintReport = function (kind = 'report') {
    const ko = S.lang === 'ko', tr = (en, kr) => ko ? kr : en;
    const label = x => typeof x === 'string' ? x : x && (x[ko ? 'ko' : 'en'] || x.en) || '';
    const kid = curKid(), grade = kid.grade, now = new Date();
    const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const offset = n => { const d = new Date(now); d.setDate(d.getDate() - n); return dateKey(d); };
    const gradeName = g => g === 'P' ? tr('Pre-K','프리케이') : g === 'K' ? tr('Kindergarten', '유치원') : tr(`Grade ${g}`, `${g}학년`);
    const empty = tr('No record yet', '아직 기록이 없어요');
    const percent = (r, n) => n ? `${Math.round(100 * r / n)}%` : '—';
    const subjects = ['math', 'read', 'write', 'sci', 'ss', 'life', 'brain'];
    const subjectName = s => T().subjects[s] || s;
    const game = id => GAMES.find(g => g.id === id);
    const sameGame = g => g && (gradeOf(g) === grade || gradeOf(g) === 'both');
    const checks = (S.checks || []).filter(c => (c.grade || 'K') === grade).slice().sort((a, b) => String(b.at).localeCompare(String(a.at)));
    let right = 0, total = 0, days = 0, goals = 0;
    const mondayOffset = (now.getDay() + 6) % 7;
    for (let i = 0; i < 14; i++) {
      const h = (S.hist || {})[offset(i)] || {}, n = count(h.r) + count(h.w);
      right += count(h.r); total += n; if (n) days++;
      if (i <= mondayOffset && n >= (typeof GOAL === 'number' ? GOAL : 20)) goals++;
    }
    const stickers = (S.stickers || []).length;
    const title = kind === 'certificate' ? tr('A celebration of practice', '꾸준한 연습 칭찬 수료증') : tr('Grown-up practice report', '보호자용 연습 보고서');
    const row = cells => `<tr>${cells.map(c => `<td>${escape(c)}</td>`).join('')}</tr>`;
    const section = (heading, content) => `<section class="p-section"><h2>${escape(heading)}</h2>${content}</section>`;
    const subjectRows = subjects.filter(s => GAMES.some(g => g.subject === s)).map(s => {
      // Latest regular check containing this subject; never mix adaptive or other-grade checks.
      const c = checks.find(c => !/^adapt-/.test(c.scope) && c.items.some(it => { const g = game(it.id); return sameGame(g) && g.subject === s; }));
      const items = c ? c.items.filter(it => { const g = game(it.id); return sameGame(g) && g.subject === s; }) : [];
      return row([subjectName(s), c ? String(c.at).slice(0, 10) : '—', items.length ? `${items.filter(it => it.ok).length}/${items.length}` : empty]);
    }).join('');
    const domains = typeof ADAPT_DOMAINS !== 'undefined' ? ADAPT_DOMAINS : {};
    const domainRows = ['math', 'read'].flatMap(s => {
      const c = checks.find(c => c.scope === 'adapt-' + s && Array.isArray(c.est));
      return (domains[s] || []).map(d => {
        const e = c && c.est.find(e => e[0] === d.k && Number.isInteger(e[1]) && e[1] >= 0 && e[1] <= 7);
        const estimate = e ? `${gradeName(['K', '1', '2', '3'][Math.floor(e[1] / 2)])} · ${e[1] % 2 ? tr('later skills', '후반 연습 영역') : tr('early skills', '초반 연습 영역')}` : empty;
        return row([label(d.n), estimate, c && e ? String(c.at).slice(0, 10) : '—']);
      });
    }).join('');
    // Match currentPicks priorities without calling stat(), which creates saved state entries.
    const need = {}, results = {};
    const reportPicks = (S.profile && S.profile.report && S.profile.report.picks || []).filter(p => p && Number.isFinite(p.score));
    const top = (reportPicks[0] || {}).score || 1;
    reportPicks.forEach(p => { need[p.id] = (need[p.id] || 0) + p.score / top * 3; });
    (S.checks || []).forEach(c => { const per = {}; c.items.forEach(it => { per[it.id] = per[it.id] !== false && it.ok; }); Object.assign(results, per); });
    if (!(S.checks || []).length && S.profile && S.profile.diag) (S.profile.diag.missed || []).forEach(id => { results[id] = false; });
    Object.keys(results).forEach(id => { if (results[id] === false) need[id] = (need[id] || 0) + 3; });
    const visible = visibleGames();
    const picks = Object.keys(need).filter(id => { const g = game(id), st = (S.stats || {})[id] || {}; return g && visible.includes(g) && count(st.right) - count(st.wrong) < 8; }).sort((a, b) => need[b] - need[a]).slice(0, 3);
    const note = tr('Practice on this device only. These are app records and estimates, not official school scores or an i-Ready score. Nothing is sent. A saved PDF may contain the nickname; choose where to keep it.', '이 기기의 앱 연습 기록과 추정이며 학교 공식 점수나 i-Ready 점수가 아니에요. 아무것도 전송하지 않아요. 저장한 PDF에는 별명이 들어갈 수 있으니 보관 위치를 골라 주세요.');
    const identity = `<p class="p-identity">${escape(kid.name || tr('Child', '아이'))} · ${escape(gradeName(grade))} · ${dateKey(now)}</p>`;
    const certificate = `<div class="p-certificate"><div class="p-peach" aria-hidden="true">🍑</div><h1>${escape(title)}</h1>${identity}<p class="p-cheer">${escape(goals ? tr('You kept showing up to practice. Peachy celebrates your effort!', '꾸준히 연습했어요. 피치가 노력한 여러분을 축하해요!') : tr('Every little try is worth celebrating. Keep exploring with Peachy!', '작은 도전도 축하할 일이에요. 피치와 함께 계속 탐험해요!'))}</p><p>${escape(tr(`Goal days this week: ${goals}`, `이번 주 목표 달성: ${goals}일`))}</p><p>${escape(tr(`Stickers collected: ${stickers} (all time)`, `모은 스티커: ${stickers}개 (누적)`))}</p><p class="p-note">${escape(tr(`This week: ${offset(mondayOffset)} – ${offset(0)} · Daily goal: 20 answers`, `이번 주: ${offset(mondayOffset)} ~ ${offset(0)} · 하루 목표: 20문제`))}</p><p>PeachPlay · Peachy</p></div>`;
    const report = `<h1>${escape(title)}</h1>${identity}${section(tr('Last 14 days', '최근 2주'), `<p>${offset(13)} – ${offset(0)} · ${escape(tr(`${total} answers · ${days} practice days · ${percent(right, total)} correct`, `${total}문제 · ${days}일 연습 · 정답률 ${percent(right, total)}`))}</p>`)}${section(tr('Latest check-ups · current grade only (right / tried)', '최근 과목별 점검 · 현재 학년만 (맞은 문제 / 푼 문제)'), `<table><tbody>${subjectRows}</tbody></table>`)}${section(tr('Diagnostic practice estimates · not official scores', '진단 평가 연습 영역별 추정 · 공식 점수 아님'), domainRows ? `<table><tbody>${domainRows}</tbody></table>` : `<p>${escape(empty)}</p>`)}${section(tr("Peachy's picks", '피치의 추천'), `<p>${escape(picks.length ? picks.map(id => label(game(id).title)).join(' · ') : tr('No recommended games yet. Try a check-up together.', '아직 추천 게임이 없어요. 함께 점검을 해 보세요.'))}</p>`)}`;
    document.querySelector('.p-dialog')?.remove();
    const dialog = document.createElement('dialog'); dialog.className = 'p-dialog';
    const toolbar = document.createElement('div'); toolbar.className = 'p-toolbar';
    const print = document.createElement('button'); print.textContent = tr('Print / Save PDF', '인쇄 / PDF 저장'); print.disabled = true;
    const close = document.createElement('button'); close.textContent = tr('Close', '닫기'); close.onclick = () => dialog.close();
    const status = document.createElement('span'); status.textContent = tr('Loading print preview…', '인쇄 미리보기를 불러와요…'); status.setAttribute('role', 'status');
    toolbar.append(print, close, status);
    const frame = document.createElement('iframe'); frame.className = 'p-frame'; frame.title = title;
    frame.setAttribute('sandbox', 'allow-same-origin allow-modals');
    frame.srcdoc = `<!doctype html><html lang="${ko ? 'ko' : 'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; img-src 'none'; font-src 'none'"><title>PeachPlay</title><link rel="stylesheet" href="${escape(cssURL)}"></head><body class="p-document"><main class="p-sheet">${grade === 'P' ? `<h1>${escape(tr(kind === 'certificate' ? 'A celebration of play' : 'Play record',kind === 'certificate' ? '놀이 칭찬 수료증' : '놀이 기록'))}</h1>${identity}<p>${escape(T().prekTogether)}</p><p>${escape(T().prekPolicy)}</p>${kind==='certificate'?'':PK.playRecordHtml()}<p>${escape(tr('Stickers collected: '+stickers,'모은 스티커: '+stickers+'개'))}</p>` : kind === 'certificate' ? certificate : report}<footer class="p-note">${escape(note)}</footer></main></body></html>`;
    frame.onload = () => {
      const loaded = frame.contentDocument.styleSheets.length > 0;
      print.disabled = !loaded;
      status.textContent = loaded ? tr('Ready. Choose Print or Save as PDF in your browser.', '준비됐어요. 브라우저에서 인쇄 또는 PDF 저장을 골라 주세요.') : tr('Print styles could not load. Close and try again.', '인쇄 스타일을 불러오지 못했어요. 닫고 다시 시도해 주세요.');
    };
    print.onclick = () => { frame.contentWindow.focus(); frame.contentWindow.print(); };
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    dialog.append(toolbar, frame); document.body.append(dialog); dialog.showModal(); close.focus();
  };
})();
