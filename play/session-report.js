(() => {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const text = (en, ko) => L(B(en, ko));
  const percent = value => value === null ? '—' : Math.round(100 * value) + '%';
  const delta = value => value === null ? text('Not enough data', '자료 부족') : (value > 0 ? '+' : '') + Math.round(100 * value) + text(' pp', '%p');
  const duration = value => value === null ? '—' : (value / 1000).toFixed(1) + text(' s', '초');
  const ranges = () => [['session', text('Latest session', '최근 세션')], ['today', text('Today', '오늘')], ['week', text('7 days', '7일')]];
  const select = (range, now = new Date()) => {
    const history = window.LearnLog.clean(S.log).filter(row => { const game = gameById(row[1]); return game && gradeOf(game) !== 'P'; });
    let rows;
    if (range === 'session') rows = window.LearnLog.sessions(history).slice(-1)[0] || [];
    else {
      const start = new Date(now); start.setHours(0, 0, 0, 0);
      if (range === 'week') start.setDate(start.getDate() - 6);
      rows = history.filter(row => row[0] >= start.getTime() / 1000);
    }
    return window.LearnLog.summary(rows, history);
  };
  const html = (range = 'session', controls = true) => {
    if (kidGrade() === 'P') return '';
    const report = select(range), focus = { steady: text('Steady', '안정'), mixed: text('Mixed', '보통'), wobbly: text('Needs a break', '흔들림') };
    const recommendations = [];
    if (report.focus === 'wobbly') recommendations.push(text('Try a short break, then a familiar game together.', '잠깐 쉬고 익숙한 게임을 함께 해 보세요.'));
    const improved = report.games.find(game => game.improvement > 0);
    if (improved) recommendations.push(text(`${L(gameById(improved.id).title)}: more first-try answers in the later half.`, `${L(gameById(improved.id).title)}: 뒤쪽 절반에서 한 번에 맞힌 비율이 높아졌어요.`));
    const weak = report.games.find(game => game.count >= 5 && game.accuracy < 0.7);
    if (weak) recommendations.push(text(`${L(gameById(weak.id).title)}: try it slowly together.`, `${L(gameById(weak.id).title)}: 함께 천천히 다시 해 보세요.`));
    if (!recommendations.length && report.count) recommendations.push(text('Keep exploring together, one short game at a time.', '함께 짧게 한 판씩 둘러보세요.'));
    const rows = report.games.map(game => {
      const registered = gameById(game.id);
      return `<tr>${[L(registered.title), T().subjects[registered.subject] || L(registered.area), game.count, percent(game.accuracy), duration(game.median), percent(game.firstTry), game.unknown, game.review, delta(game.improvement), delta(game.weekChange)].map(value => `<td>${escape(value)}</td>`).join('')}</tr>`;
    }).join('');
    return `<section><h2>📋 ${text('Recent play report', '최근 놀이 리포트')}</h2>${controls ? `<label>${text('Period', '기간')} <select id="learnRange">${ranges().map(([key, label]) => `<option value="${key}"${key === range ? ' selected' : ''}>${label}</option>`).join('')}</select></label>` : `<p>${ranges().find(([key]) => key === range)[1]}</p>`}
      <p>${text('Questions', '문제 수')}: ${report.count} · ${text('First-try accuracy', '첫 응답 정답률')}: ${percent(report.accuracy)} · ${text('Median response', '응답 시간 중앙값')}: ${duration(report.median)} · ${text('I don’t know', '잘 모르겠어요')}: ${report.unknown} · ${text('Review', '복습')}: ${report.review}</p>
      <p>${text('Focus estimate', '집중 추정')}: ${focus[report.focus] || text('Not enough data', '자료 부족')}</p><p class="note2">${text('An estimate from play behavior, not a measurement of attention. Only supported question games are included. Accuracy counts the first answer; later retries do not add questions. Fewer than five questions: not enough data.', '놀이 행동에 따른 추정이며 집중력을 측정한 결과가 아니에요. 기록 가능한 문제 게임만 포함해요. 정답률은 첫 응답 기준이며 재시도로 문제 수가 늘어나지 않아요. 5문제 미만은 자료 부족이에요.')}</p>
      ${report.count ? `<div class="tablewrap"><table><thead><tr>${[text('Game', '게임'), text('Subject', '과목'), text('Questions', '문제 수'), text('Accuracy', '정답률'), text('Median response', '응답 중앙값'), text('First try', '한 번에 맞힘'), text('Don’t know', '모르겠어요'), text('Review', '복습'), text('Later vs earlier half', '뒤/앞 절반 향상도'), text('vs prior 7 days', '지난 7일 대비')].map(label => `<th>${label}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>` : `<p>${text('No question records yet.', '아직 문제 기록이 없어요.')}</p>`}
      ${recommendations.slice(0, 2).map(recommendation => `<p>${escape(recommendation)}</p>`).join('')}</section>`;
  };
  const bind = () => {
    const control = $('#learnRange');
    if (control) control.onchange = () => { window.SessionReport.range = control.value; $('#learnReport').innerHTML = html(control.value); bind(); };
  };
  window.SessionReport = { range: 'session', html, bind, select };
  window.addEventListener('pagehide', () => window.LearnLog.leave());
})();
