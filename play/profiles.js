'use strict';
// Children on this device (each has separate saved progress) and the progress/history screen.
const PT = {
  prog: B('My Progress', '내 기록'), kids: B('Who is playing?', '누가 하나요?'),
  add: B('Add a child', '아이 추가'), edit: B('Edit', '수정'), del: B('Remove', '삭제'), name: B('Name or nickname', '이름 또는 별명'),
  grade: B('Grade', '학년'), gK: B('Kindergarten', '유치원(K)'), g1: B('1st grade', '1학년'), save: B('Save', '저장'), cancel: B('Cancel', '취소'),
  kidsNote: B('Each child keeps their own peaches, stickers, levels and history on this device. Nothing is sent anywhere. 1st-grade games are still being prepared, so for now every child plays the same set.', '아이마다 복숭아, 스티커, 단계, 기록이 이 기기에 따로 저장돼요. 어디로도 전송되지 않아요. 1학년 게임은 아직 준비 중이라 지금은 모두 같은 게임을 해요.'),
  delAsk: B('Remove this child and all of their saved progress on this device?', '이 아이와 이 기기에 저장된 기록을 모두 지울까요?'),
  today: B('Today', '오늘'), week: B('Last 7 days', '최근 7일'), streak: B('Days in a row', '연속 일수'), acc: B('Correct (7 days)', '정답률(7일)'),
  answers: B('answers', '문제'), days: B('days', '일'),
  chart: B('Answers per day (last 14 days)', '하루 문제 수 (최근 14일)'), right: B('Right', '맞은 것'), miss: B('Missed', '틀린 것'),
  bySubj: B('By subject: last 7 days vs. the 7 days before', '과목별: 최근 7일과 그 전 7일 비교'),
  colSubj: B('Subject', '과목'), colNow: B('Last 7', '최근 7일'), colPrev: B('Before', '그 전'), colTrend: B('Trend', '변화'),
  none: B('No answers yet. Play a game and the chart will fill in.', '아직 기록이 없어요. 게임을 하면 그래프가 채워져요.'),
  note: B('These numbers only count answers in this app on this device. They are a practice record, not a test score. A subject needs 5+ answers in a week to show a trend.', '이 앱에서 이 기기로 푼 문제만 센 연습 기록이에요. 시험 점수가 아니에요. 한 과목에서 일주일에 5문제 이상 풀어야 변화가 보여요.'),
  shareT: B('Share Peachy K', 'Peachy K 공유하기'), shareN: B('Copy the link and send it to other parents or teachers.', '링크를 복사해서 다른 부모님이나 선생님께 보내 주세요.'), copy: B('Copy link', '링크 복사'), copied: B('Link copied!', '링크가 복사됐어요!'),
  back: B('Back', '뒤로'), who: B('Playing now', '지금 하는 아이'),
  cheer0: B('Play a game to start your streak!', '게임을 하면 연속 기록이 시작돼요!'), cheerN: (n) => B(`${n} days in a row. Great job!`, `${n}일 연속! 잘했어요!`)
};
const SITE_URL = 'https://altair-research.github.io/peachy-k/';
const AVATARS = ['🍑', '🦄', '🐶', '🐱', '🐼', '🦁', '🐯', '🐸', '🐙', '🦋', '🐢', '🚀'];
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// the quick links under the header are hidden while a game is on screen (games must fit one screen)
function renderNav() { const p = $('#navProg'), f = $('#navFaq'); if (p) { p.textContent = '📈 ' + L(PT.prog); f.textContent = '❓ ' + T().faqBtn; } }
new MutationObserver(() => { const v = view(); document.body.classList.toggle('playing', !!(v && v.firstElementChild && !v.querySelector(':scope > h1, :scope > .hero'))); }).observe(view(), { childList: true });
function renderProfBtn() { const b = $('#profBtn'); if (b) b.textContent = curKid().avatar; }
function kidLabel(k) { return k.name ? esc(k.name) : (k.id === 'p1' ? L(B('Me', '나')) : L(B('Child', '아이'))); }
function switchKid(id) { save(); PROF.active = id; saveProf(); location.reload(); }

function profilesScreen(editId) {
  const cards = PROF.list.map(k => `<div class="kid ${k.id === PROF.active ? 'on' : ''}">
      <button class="kidgo" data-id="${k.id}"><span class="kav">${k.avatar}</span><span class="kn">${kidLabel(k)}<small>${k.grade === '1' ? L(PT.g1) : L(PT.gK)}${k.id === PROF.active ? ' · ' + L(PT.who) : ''}</small></span></button>
      <button class="link kedit" data-id="${k.id}">✏️ ${L(PT.edit)}</button></div>`).join('');
  view().innerHTML = `<h1>👧👦 ${L(PT.kids)}</h1><div class="kids">${cards}</div>
    ${PROF.list.length < 5 ? `<div><button class="pill" id="kadd">➕ ${L(PT.add)}</button></div>` : ''}
    <div id="kform"></div><p class="note2">${L(PT.kidsNote)}</p><div><button class="next" id="b">${L(PT.back)}</button></div>`;
  $$('.kidgo').forEach(b => b.onclick = () => (b.dataset.id === PROF.active ? home() : switchKid(b.dataset.id)));
  $$('.kedit').forEach(b => b.onclick = () => kidForm(b.dataset.id));
  if ($('#kadd')) $('#kadd').onclick = () => kidForm(null);
  $('#b').onclick = home;
  if (editId) kidForm(editId);
}

function kidForm(id) {
  const k = id ? PROF.list.find(x => x.id === id) : { name: '', avatar: AVATARS[PROF.list.length % AVATARS.length], grade: 'K' }; let av = k.avatar;
  $('#kform').innerHTML = `<div class="form kf"><input id="kname" maxlength="16" placeholder="${L(PT.name)}" value="${esc(k.name)}">
    <div class="avs">${AVATARS.map(a => `<button class="av ${a === av ? 'on' : ''}" data-a="${a}">${a}</button>`).join('')}</div>
    <div class="grades"><label><input type="radio" name="gr" value="K" ${k.grade !== '1' ? 'checked' : ''}> ${L(PT.gK)}</label><label><input type="radio" name="gr" value="1" ${k.grade === '1' ? 'checked' : ''}> ${L(PT.g1)}</label></div>
    <button class="next" id="ksave">${L(PT.save)}</button> <button class="link" id="kcancel">${L(PT.cancel)}</button>${id && PROF.list.length > 1 ? ` <button class="link" id="kdel">🗑 ${L(PT.del)}</button>` : ''}</div>`;
  $$('.av').forEach(b => b.onclick = () => { av = b.dataset.a; $$('.av').forEach(x => x.classList.toggle('on', x === b)); });
  $('#kcancel').onclick = () => { $('#kform').innerHTML = ''; };
  $('#ksave').onclick = () => {
    const name = $('#kname').value.trim(), grade = (document.querySelector('input[name=gr]:checked') || {}).value || 'K';
    if (id) Object.assign(k, { name, avatar: av, grade });
    else { const nid = 'p' + Date.now().toString(36); PROF.list.push({ id: nid, name, avatar: av, grade }); saveProf(); return switchKid(nid); }
    saveProf(); renderProfBtn(); profilesScreen();
  };
  if ($('#kdel')) $('#kdel').onclick = () => {
    if (!confirm(L(PT.delAsk))) return;
    try { localStorage.removeItem(id === 'p1' ? 'sag.v2' : 'sag.v2.' + id); } catch (e) {}
    PROF.list = PROF.list.filter(x => x.id !== id);
    if (PROF.active === id) { PROF.active = PROF.list[0].id; saveProf(); location.reload(); return; }
    saveProf(); profilesScreen();
  };
  $('#kform').scrollIntoView({ block: 'nearest' });
}

// ---- progress screen ----
function dayKey(offset) { const d = new Date(); d.setDate(d.getDate() - offset); return today(d); }
function sumDays(from, to) {      // offsets: from (older) .. to (newer), inclusive; returns {r,w,g}
  const out = { r: 0, w: 0, g: {} };
  for (let o = from; o >= to; o--) { const h = (S.hist || {})[dayKey(o)]; if (!h) continue; out.r += h.r; out.w += h.w; Object.entries(h.g).forEach(([id, v]) => { const x = (out.g[id] = out.g[id] || [0, 0]); x[0] += v[0]; x[1] += v[1]; }); }
  return out;
}
function streakDays() { let n = 0, o = (S.hist || {})[dayKey(0)] ? 0 : 1; while ((S.hist || {})[dayKey(o)]) { n++; o++; } return n; }
function subjectTotals(sum) {
  const t = {}; Object.entries(sum.g).forEach(([id, v]) => { const g = GAMES.find(x => x.id === id); if (!g) return; const x = (t[g.subject] = t[g.subject] || [0, 0]); x[0] += v[0]; x[1] += v[1]; });
  return t;
}
function chartSvg() {
  const W = 336, H = 150, base = 124, n = 14, bw = 17, gap = (W - n * bw) / (n + 1), days = Array.from({ length: n }, (_, i) => dayKey(n - 1 - i));
  const tot = days.map(d => { const h = (S.hist || {})[d]; return h ? [h.r, h.w] : [0, 0]; }), max = Math.max(10, ...tot.map(t => t[0] + t[1])), sc = (base - 14) / max;
  const bars = tot.map((t, i) => {
    const x = gap + i * (bw + gap), hr = t[0] * sc, hw = t[1] * sc, d = new Date(days[i] + 'T00:00:00'), total = t[0] + t[1];
    return `<rect x="${x}" y="${base - hr}" width="${bw}" height="${hr}" rx="3" fill="#06d6a0"/><rect x="${x}" y="${base - hr - hw}" width="${bw}" height="${hw}" rx="3" fill="#ffb4a2"/>
      ${total ? `<text x="${x + bw / 2}" y="${base - hr - hw - 3}" text-anchor="middle" font-size="9" fill="#7a5a4a">${total}</text>` : `<circle cx="${x + bw / 2}" cy="${base - 3}" r="2" fill="#e8cdbd"/>`}
      <text x="${x + bw / 2}" y="${base + 14}" text-anchor="middle" font-size="9.5" fill="${i === n - 1 ? '#ef6a58' : '#7a5a4a'}" font-weight="${i === n - 1 ? 800 : 400}">${d.getDate()}</text>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="hchart" role="img" aria-label="${L(PT.chart)}"><line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="#e8cdbd"/>${bars}</svg>`;
}
function progressScreen() {
  const k = curKid(), t = sumDays(0, 0), w = sumDays(6, 0), p = sumDays(13, 7), wt = w.r + w.w, acc = wt ? Math.round(100 * w.r / wt) : null, st = streakDays();
  const a = subjectTotals(w), b = subjectTotals(p), pc = (x) => (x && x[0] + x[1] >= 5 ? Math.round(100 * x[0] / (x[0] + x[1])) : null);
  const rows = SUBJECT_ORDER.filter(s => a[s] || b[s]).map(s => {
    const n = pc(a[s]), o = pc(b[s]), tr = n == null || o == null ? '–' : n - o >= 5 ? '▲' : o - n >= 5 ? '▼' : '＝';
    return `<tr><td>${SUBJECT_ICON[s]} ${T().subjects[s]}</td><td>${a[s] ? `${n == null ? '-' : n + '%'} <small>(${a[s][0] + a[s][1]})</small>` : '-'}</td><td>${b[s] ? `${o == null ? '-' : o + '%'} <small>(${b[s][0] + b[s][1]})</small>` : '-'}</td><td class="tr ${tr === '▲' ? 'up' : tr === '▼' ? 'dn' : ''}">${tr}</td></tr>`;
  }).join('');
  view().innerHTML = `<h1>${k.avatar} ${kidLabel(k)} · ${L(PT.prog)}</h1>
    <p class="tag">${st ? L(PT.cheerN(st)) : L(PT.cheer0)}</p>
    <div class="tiles"><div class="tile"><b>${t.r + t.w}</b><span>${L(PT.today)}</span></div><div class="tile"><b>${wt}</b><span>${L(PT.week)}</span></div><div class="tile"><b>${st}</b><span>${L(PT.streak)}</span></div><div class="tile"><b>${acc == null ? '-' : acc + '%'}</b><span>${L(PT.acc)}</span></div></div>
    <h2>${L(PT.chart)}</h2>${wt || p.r + p.w ? chartSvg() : `<p class="note2">${L(PT.none)}</p>`}
    <div class="legend"><span><i style="background:#06d6a0"></i>${L(PT.right)}</span><span><i style="background:#ffb4a2"></i>${L(PT.miss)}</span></div>
    ${rows ? `<h2>${L(PT.bySubj)}</h2><div class="tablewrap"><table><tr><th>${L(PT.colSubj)}</th><th>${L(PT.colNow)}</th><th>${L(PT.colPrev)}</th><th>${L(PT.colTrend)}</th></tr>${rows}</table></div>` : ''}
    <p class="note2">${L(PT.note)}</p>
    <div><button class="next" id="b">${L(PT.back)}</button></div>`;
  $('#b').onclick = home;
}
