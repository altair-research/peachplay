(() => {
  'use strict';
  const seconds = () => Math.floor(Date.now() / 1000);
  const clean = (rows, now = seconds()) => (Array.isArray(rows) ? rows : []).filter(row =>
    Array.isArray(row) && row.length === 6 && Number.isInteger(row[0]) && row[0] >= now - 60 * 86400 && row[0] <= now &&
    typeof row[1] === 'string' && /^[A-Za-z0-9_-]{1,40}$/.test(row[1]) && Number.isInteger(row[2]) && row[2] >= 1 && row[2] <= 3 &&
    [0, 1, 2].includes(row[3]) && Number.isFinite(row[4]) && row[4] >= 0 && row[4] <= 600000 && Number.isInteger(row[5]) && row[5] >= 0 && row[5] <= 7
  ).map(row => row.slice()).sort((left, right) => left[0] - right[0]).slice(-1500);
  const sessions = rows => {
    const result = [];
    rows.forEach(row => {
      const last = result[result.length - 1];
      if (!last || row[0] - last[last.length - 1][0] > 600) result.push([row]); else last.push(row);
    });
    return result;
  };
  const median = values => {
    if (!values.length) return null;
    const sorted = values.slice().sort((left, right) => left - right), middle = Math.floor(sorted.length / 2);
    return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
  };
  const accuracy = rows => rows.length ? rows.filter(row => row[3] === 1).length / rows.length : null;
  const change = rows => {
    if (rows.length < 5) return null;
    const middle = Math.floor(rows.length / 2);
    return accuracy(rows.slice(middle)) - accuracy(rows.slice(0, middle));
  };
  const summary = (rows, history = rows) => {
    const count = rows.length, typical = median(history.map(row => row[4]));
    // Compare only like questions, with at least ten observations in each half.
    const groups = new Map();
    rows.forEach(row => { const key = row[1] + ':' + row[2]; if (!groups.has(key)) groups.set(key, []); groups.get(key).push(row); });
    const declines = [...groups.values()].filter(own => own.length >= 20 && change(own) <= -0.25);
    // A decline is contextual information, never independent attention evidence.
    const signals = rows.filter(row => (row[3] === 0 && (row[4] < 1500 || row[4] < typical / 3)) || (row[5] & 4));
    const signalRatio = count ? signals.length / count : 0;
    const start = count ? rows[0][0] : 0;
    const previous = history.filter(row => row[0] < start && row[0] >= start - 7 * 86400);
    const games = [...new Set(rows.map(row => row[1]))].map(id => {
      const own = rows.filter(row => row[1] === id), past = previous.filter(row => row[1] === id);
      return { id, count: own.length, accuracy: accuracy(own), median: median(own.map(row => row[4])), firstTry: accuracy(own), unknown: own.filter(row => row[3] === 2).length, review: own.filter(row => row[5] & 1).length, improvement: change(own), weekChange: own.length >= 5 && past.length >= 5 ? accuracy(own) - accuracy(past) : null };
    });
    return { count, longResponses: rows.filter(row => row[4] >= 60000).length, declines: declines.map(own => ({ id: own[0][1], level: own[0][2], count: own.length, change: change(own) })), accuracy: accuracy(rows), firstTry: accuracy(rows), median: median(rows.map(row => row[4])), unknown: rows.filter(row => row[3] === 2).length, review: rows.filter(row => row[5] & 1).length, signalRatio, focus: count < 5 ? null : signalRatio < 0.1 ? 'steady' : signalRatio < 0.25 ? 'mixed' : 'wobbly', games };
  };
  let current = null, lastRow = null;
  const eligible = game => kidGrade() !== 'P' && game && gradeOf(game) !== 'P';
  const begin = (game, level) => {
    current = eligible(game) ? { id: game.id, level, start: performance.now(), row: null } : null;
  };
  const answer = (id, result) => {
    if (!current || current.id !== id || current.row || !eligible(gameById(id))) return;
    const flags = (SESSION.review ? 1 : 0) | (DIAG.confirm ? 2 : 0);
    const row = [seconds(), id, current.level, result, Math.min(600000, Math.max(0, Math.round(performance.now() - current.start))), flags];
    S.log = clean(S.log); S.log.push(row); S.log = S.log.slice(-1500);
    current.row = row; lastRow = row;
    save();
  };
  const leave = () => {
    if (lastRow && kidGrade() !== 'P' && (S.log || []).includes(lastRow)) { lastRow[5] |= 4; save(); }
    current = null; lastRow = null;
  };
  const finish = () => { current = null; lastRow = null; };
  window.LearnLog = { clean, sessions, summary, median, accuracy, begin, answer, leave, finish };
})();
