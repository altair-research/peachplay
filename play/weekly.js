(() => {
  'use strict';
  // Weekly summary for grown-ups (2026-11-01, competitor research: "school result -> 10 minutes at home, in the parent's language").
  // Built on this device from S.log only: days played, school areas going well / to practise, and three things for next week.
  // Thresholds: an area needs 8+ answers this week to be called "going well" (80%+ first try, or +10 points vs last week
  // with 5+ answers then) and 5+ answers under 70% to be "practise more". School results fill in when there is no practice yet.
  const B = (en, ko) => ({ en, ko });
  const TX = {
    title: B('This week at a glance', '이번 주 한눈에'),
    none: B('No practice this week yet. Start with Today\'s 10 minutes on the home screen.', '이번 주 기록이 아직 없어요. 홈의 "오늘 10분"부터 시작해 보세요.'),
    days: (d, q) => B(`Played on ${d} of the last 7 days · ${q} questions`, `최근 7일 중 ${d}일 했어요 · ${q}문제`),
    acc: (p, prev) => B(`Right on the first try: ${p}%${prev === null ? '' : ` (last week ${prev}%)`}`, `한 번에 맞힌 비율: ${p}%${prev === null ? '' : ` (지난주 ${prev}%)`}`),
    good: B('Going well', '잘 되고 있어요'),
    more: B('Practise more', '더 연습해요'),
    school: B('from school results', '학교 결과 기준'),
    next: B('Next week, three things', '다음 주에 할 것 3가지'),
    app: (area, game) => B(`In the app: ${area} — play ${game} (or Today's 10 minutes picks it).`, `앱에서: ${area} — ${game} (오늘 10분이 골라 줘요).`),
    appArea: (area) => B(`In the app: ${area} — Today's 10 minutes picks the game.`, `앱에서: ${area} — 오늘 10분이 게임을 골라 줘요.`),
    home: B('At home', '집에서'),
    talk: B('Ask', '물어보기'),
    copy: B('Copy as text', '글로 복사'),
    copied: B('Copied', '복사했어요'),
    note: B('Made on this device only, from practice records. It is not a school grade.', '이 기기 안에서만 연습 기록으로 만들어요. 학교 성적이 아니에요.'),
  };
  const dayStart = (back) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - back); return Math.floor(d.getTime() / 1000); };
  const acc = rows => rows.length ? rows.filter(r => r[3] === 1).length / rows.length : null;
  const pct = v => Math.round(100 * v);

  function data(source = S, weak = null) {
    const rows = window.LearnLog.clean(source.log).filter(r => !(r[5] & 2) && gameById(r[1]) && gradeOf(gameById(r[1])) !== 'P');
    const from = dayStart(6), prevFrom = dayStart(13);
    const week = rows.filter(r => r[0] >= from), prev = rows.filter(r => r[0] >= prevFrom && r[0] < from);
    const days = new Set(week.map(r => new Date(r[0] * 1000).toDateString())).size;
    const areas = new Map();
    const add = (list, key) => list.forEach(r => {
      const dom = window.Learner.domainFor(r[1]); if (!dom) return;
      if (!areas.has(dom.k)) areas.set(dom.k, { dom, week: [], prev: [] });
      areas.get(dom.k)[key].push(r);
    });
    add(week, 'week'); add(prev, 'prev');
    const list = [...areas.values()].map(a => ({ ...a, now: acc(a.week), then: a.prev.length >= 5 ? acc(a.prev) : null }));
    const good = list.filter(a => a.week.length >= 8 && (a.now >= 0.8 || (a.then !== null && a.now - a.then >= 0.1))).sort((x, y) => y.now - x.now).slice(0, 2);
    let more = list.filter(a => a.week.length >= 5 && a.now < 0.7 && !good.includes(a)).sort((x, y) => x.now - y.now).slice(0, 2).map(a => ({ k: a.dom.k, dom: a.dom, rows: a.week }));
    let fromSchool = false;
    if (!more.length && window.SchoolResults && window.SchoolResults.weakKeys) {
      const doms = Object.values(ADAPT_DOMAINS).flat();
      more = (weak || window.SchoolResults.weakKeys()).map(k => doms.find(d => d.k === k)).filter(Boolean).slice(0, 2).map(dom => ({ k: dom.k, dom, rows: [] }));
      fromSchool = more.length > 0;
    }
    return { week, prev, days, good, more, fromSchool, areas: list };
  }
  // The game in this area missed most this week, if any.
  const missedGame = rows => {
    const count = {}; rows.filter(r => r[3] !== 1).forEach(r => { count[r[1]] = (count[r[1]] || 0) + 1; });
    const id = Object.keys(count).sort((a, b) => count[b] - count[a])[0];
    return id && gameById(id) ? gameById(id) : null;
  };
  function lines(d, translate = L, grade = kidGrade()) {
    const L = translate;
    if (!d.week.length && !d.more.length) return null;
    const out = { head: [], good: d.good.map(a => `${L(a.dom.n)} ${pct(a.now)}%`), more: d.more.map(a => L(a.dom.n)), todo: [] };
    if (d.week.length) {
      out.head.push(L(TX.days(d.days, d.week.length)));
      out.head.push(L(TX.acc(pct(acc(d.week)), d.prev.length >= 5 ? pct(acc(d.prev)) : null)));
    } else out.head.push(L(TX.none));
    const focus = d.more[0];
    if (focus) {
      const g = missedGame(focus.rows);
      out.todo.push(g ? L(TX.app(L(focus.dom.n), `${g.icon} ${L(g.title)}`)) : L(TX.appArea(L(focus.dom.n))));
      if (window.HomeCard && window.HomeCard.ACT[focus.k]) {
        const c = window.HomeCard.card(focus.k, today(), grade);
        out.todo.push(`${L(TX.home)}: ${L(c.home.t)}`);
        out.todo.push(`${L(TX.talk)}: ${L(c.talk.q)}`);
      }
    }
    return out;
  }
  function html(source = S, weak = null, translate = L) {
    const L = translate;
    if (typeof kidGrade !== 'function' || (source === S && kidGrade() === 'P') || !window.LearnLog || !window.Learner) return '';
    const d = data(source, weak), x = lines(d, translate, source === S ? kidGrade() : 'K');
    const kpis = `<div class="grown-kpis"><div class="grown-kpi"><b>${d.days}</b><span>${L(PT.days)}</span></div><div class="grown-kpi"><b>${d.week.length}</b><span>${L(PT.answers)}</span></div><div class="grown-kpi"><b>${d.week.length ? pct(acc(d.week)) + '%' : '–'}</b><span>${L(PT.acc)}</span></div></div>`;
    const steady = a => a.week.length >= 8 && (a.now >= 0.8 || (a.then !== null && a.now - a.then >= 0.1));
    const areaRows = d.areas.filter(a => a.week.length >= 5).map(a => `<tr><td>${L(a.dom.n)}</td><td><span class="grown-meter" aria-hidden="true"><i style="width:${pct(a.now)}%"></i></span>${pct(a.now)}%</td><td><span class="grown-status ${steady(a) ? '' : 'practice'}">${L(steady(a) ? B('Steady', '안정') : B('Practising', '연습 중'))}</span></td></tr>`).join('');
    const areaTable = areaRows ? `<div class="tablewrap"><table><thead><tr><th>${L(B('School area', '학교 영역'))}</th><th>${L(PT.acc)}</th><th>${L(B('Practice', '연습'))}</th></tr></thead><tbody>${areaRows}</tbody></table></div>` : '';
    const body = !x ? `<p>${L(TX.none)}</p>` : `${x.head.map(t => `<p>${t}</p>`).join('')}
      ${x.good.length ? `<p class="wk-good">✅ <b>${L(TX.good)}</b> ${x.good.join(' · ')}</p>` : ''}
      ${x.more.length ? `<p class="wk-more">🌱 <b>${L(TX.more)}</b> ${x.more.join(' · ')}${d.fromSchool ? ` <span class="note2">(${L(TX.school)})</span>` : ''}</p>` : ''}
      ${x.todo.length ? `<h3>📌 ${L(TX.next)}</h3><ol class="wk-todo">${x.todo.map(t => `<li>${t}</li>`).join('')}</ol>` : ''}
      <p class="hc-row"><button class="pill" id="wkCopy">📋 ${L(TX.copy)}</button> <span id="wkCopied"></span></p>`;
    return `<section class="hc-card wk-card" id="weekly"><h2>📅 ${L(TX.title)}</h2>${kpis}${areaTable}${body}${reminderHtml(source, translate)}<p class="note2">${L(TX.note)}</p></section>`;
  }
  function text() {
    const x = lines(data()); if (!x) return L(TX.none) + '\n' + reminder(S).text;
    return [`📅 ${L(TX.title)}`, ...x.head, x.good.length ? `✅ ${L(TX.good)}: ${x.good.join(' · ')}` : '', x.more.length ? `🌱 ${L(TX.more)}: ${x.more.join(' · ')}` : '',
      x.todo.length ? `📌 ${L(TX.next)}` : '', ...x.todo.map((t, i) => `${i + 1}. ${t}`), reminder(S).text].filter(Boolean).join('\n');
  }
  function bind() {
    const add = document.getElementById('wkResults'); if (add) add.onclick = () => SchoolResults.open(grownups);
    const b = document.getElementById('wkCopy'); if (!b) return;
    b.onclick = () => {
      const done = ok => { const s = document.getElementById('wkCopied'); if (s) s.textContent = ok ? L(TX.copied) : ''; };
      try { navigator.clipboard.writeText(text()).then(() => done(true), () => done(false)); } catch (e) { done(false); }
    };
  }
  function reminder(source, translate = L) {
    const L = translate;
    const p = source.profile || {}, has = !!(p.report || p.school);
    const dates = [p.school?.at, p.report?.at].filter(v => typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && Number.isFinite(Date.parse(v))).sort();
    const at = dates.at(-1), old = !!at && Date.now() - new Date(at + 'T00:00:00').getTime() >= 56 * 86400000;
    const date = at ? new Intl.DateTimeFormat(L(B('en-US', 'ko-KR')), {month:'long', day:'numeric'}).format(new Date(at + 'T00:00:00')) : '';
    return { has, old, text: has ? L(B('When the next school result (report card or i-Ready) arrives, add it again.', '다음 학교 결과(성적표·i-Ready)가 나오면 다시 넣어 주세요.')) + (date ? ' · ' + L(B('Last added: ', '마지막으로 넣은 날: ')) + date : '') : L(B('Add school results for more tailored picks.', '학교 결과를 넣으면 더 맞춰 골라 드려요.')) };
  }
  function reminderHtml(source, translate = L) { const L = translate; const r = reminder(source, translate); return `<p class="wk-reminder${r.old ? ' wk-overdue' : ''}">${r.text}${!r.has ? ` <button class="pill" id="wkResults">${L(B('Add school results', '학교 결과 넣기'))}</button>` : ''}</p>`; }
  window.Weekly = { html, bind, text, data, reminder };
})();
