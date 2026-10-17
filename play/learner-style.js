(() => {
  'use strict';
  // Per-profile, per-grade runtime decisions. Reloads conservatively restart observation.
  const decisions = new WeakMap();
  const decision = () => {
    let grades = decisions.get(S); if (!grades) { grades = {}; decisions.set(S, grades); }
    return grades[kidGrade()] ||= { bands: null, candidate: 'unknown', observed: 'unknown', held: new Set() };
  };
  const tuneFlags = { holdLevelRise: true };
  const holdRise = id => { if (tuneFlags.holdLevelRise) decision().held.add(id); };
  const canRise = id => !tuneFlags.holdLevelRise || !decision().held.has(id);
  const now = () => Math.floor(Date.now() / 1000);
  const days30 = 30 * 86400;
  const domainKeys = ['num', 'alg', 'meas', 'geo', 'pa', 'ph', 'hfw', 'voc', 'lit', 'inf', 'sci_life', 'sci_earth', 'sci_physical', 'ss_history', 'ss_geography', 'ss_civics', 'ss_economics'];
  const domainList = () => Object.values(ADAPT_DOMAINS).flat();
  const domainFor = id => domainList().find(domain => Object.values(domain.g).some(ids => ids.includes(id)));
  const domainKey = domain => kidGrade() + '_' + domain.k;
  const cleanMastery = value => Object.fromEntries(Object.entries(isObj(value) ? value : {}).filter(([key, entry]) => /^[K1-5]_/.test(key) && domainKeys.includes(key.slice(2)) && isObj(entry) && Number.isInteger(entry.at) && entry.at > 0 && entry.at <= now() && [5, 8].includes(entry.total) && Number.isInteger(entry.right) && entry.right >= 0 && entry.right <= entry.total).map(([key, entry]) => [key, { at: entry.at, right: entry.right, total: entry.total, approved: Number.isInteger(entry.approved) && entry.approved >= entry.at && entry.approved <= now() ? entry.approved : 0 }]));
  const passed = (right, total) => total === 5 ? right >= 4 : total === 8 && right >= 7;
  const excluded = (domain, time = now()) => {
    if (domain.reviewOnly) return false;
    const entry = (S.mastery || {})[domainKey(domain)];
    return !!(entry && passed(entry.right, entry.total) && entry.approved && time - entry.approved < days30);
  };
  const domainRows = domain => window.LearnLog.clean(S.log).filter(row => Object.values(domain.g).some(ids => ids.includes(row[1])) && !(row[5] & 2) && (!domain.reviewOnly || (domain.g[kidGrade()] || []).includes(row[1]) && gameById(row[1]) && gradeOf(gameById(row[1])) === kidGrade() && !heldGame(gameById(row[1])) && !CHECK_SKIP.includes(row[1])));
  // Recent evidence is kept within the current grade and topic. Reuse the last played game, not an unplayed unit.
  const reviewBands = domain => {
    const history = domainRows(domain);
    return (domain.topics || []).flatMap(ids => {
      const rows = history.filter(row => ids.includes(row[1])).slice(-20);
    return rows.length === 20 && window.LearnLog.accuracy(rows) < 0.7 ? [{ id: rows[rows.length - 1][1], need: 7, why: ['__review__'] }] : [];
    });
  };
  const candidates = () => kidGrade() === 'P' ? [] : domainList().filter(domain => {
    if (domain.reviewOnly || excluded(domain) || !(domain.g[kidGrade()] || []).some(id => gameById(id) && !heldGame(gameById(id)) && !CHECK_SKIP.includes(id))) return false;
    const rows = domainRows(domain).slice(-30), report = S.strongAreas;
    const entry = (S.mastery || {})[domainKey(domain)];
    return !!(entry && entry.approved && now() - entry.approved >= days30) || !!(report && report.grade === kidGrade() && report.domains.includes(domain.k)) || rows.length === 30 && window.LearnLog.accuracy(rows) >= 0.9;
  });
  const calculateBands = () => {
    if (kidGrade() === 'P') return [];
    return domainList().flatMap(domain => {
      if (domain.reviewOnly) return reviewBands(domain);
      if (excluded(domain)) return [];
      const rows = domainRows(domain).slice(-20);
      if (rows.length < 20) return [];
      const current = rows[rows.length - 1][1], rate = window.LearnLog.accuracy(rows);
      const ladder = ['K', '1', '2', '3', '4', '5'].flatMap(grade => domain.g[grade] || []).filter(id => {
        const game = gameById(id);
        return game && !heldGame(game) && ['K', '1', '2', '3', '4', '5'].indexOf(gradeOf(game)) <= Math.min(5, ['K', '1', '2', '3', '4', '5'].indexOf(kidGrade()) + 1);
      });
      const position = ladder.indexOf(current);
      if (position < 0) return [];
      if (rate > 0.85 && ((S.stats[current] || {}).level || rows[rows.length - 1][2]) >= 2 && ladder[position + 1]) return [{ id: ladder[position + 1], need: 7, why: ['__up__'] }];
      if (rate < 0.7) return [{ id: ladder[Math.max(0, position - 1)], need: 7, why: ['__warm__'] }];
      return [];
    });
  };
  const bands = () => kidGrade() === 'P' ? [] : (decision().bands ?? calculateBands()).filter(item => {
    const game = gameById(item.id), domain = domainFor(item.id);
    return game && !heldGame(game) && (!domain || !excluded(domain)) && (!domain || !domain.reviewOnly || gradeOf(game) === kidGrade());
  });
  const refresh = () => {
    if (kidGrade() === 'P') return;
    const state = decision(), candidate = evidence().candidate;
    state.observed = candidate !== 'unknown' && candidate === state.candidate ? candidate : 'unknown';
    state.candidate = candidate; state.bands = calculateBands(); state.held.clear();
  };
  const recommendations = (base, max) => {
    const merged = new Map();
    bands().concat(base).forEach(item => {
      const game = gameById(item.id);
      if (!game || heldGame(game)) return;
      const domain = domainFor(item.id);
      if (domain && domain.reviewOnly && gradeOf(game) !== kidGrade()) return;
      if (!domain || !excluded(domain)) {
        const old = merged.get(item.id);
        merged.set(item.id, old ? { ...old, need: Math.max(old.need || 0, item.need || 0), why: [...new Set(old.why.concat(item.why))] } : item);
      }
    });
    return arrange([...merged.values()].sort((left, right) => (right.need || 0) - (left.need || 0)), max);
  };
  const saveStrong = parsed => {
    S.strongAreas = { grade: kidGrade(), domains: [...new Set(parsed.items.filter(item => ['E', 'S'].includes(item.grade)).flatMap(item => gamesFor(item).games.map(domainFor).filter(Boolean).map(domain => domain.k)))] };
  };
  const startConfirm = key => {
    if (kidGrade() === 'P') return home();
    const domain = candidates().find(item => item.k === key);
    if (!domain) return;
    const games = (domain.g[kidGrade()] || []).filter(id => gameById(id) && !heldGame(gameById(id)) && !CHECK_SKIP.includes(id));
    if (!games.length) return;
    quitDiag(); DIAG.run = (DIAG.run || 0) + 1; DIAG.confirm = domain.k; DIAG.confirmBinary = false;
    DIAG.items = Array.from({ length: 5 }, (_, index) => ({ id: games[index % games.length], lv: 2 }));
    DIAG.active = true; DIAG.i = 0; DIAG.res = []; DIAG.busy = false; diagStep();
  };
  const confirmOptions = count => {
    if (!DIAG.confirm || count > 2 || DIAG.confirmBinary) return;
    DIAG.confirmBinary = true;
    const original = DIAG.items.slice();
    while (DIAG.items.length < 8) DIAG.items.push({ ...original[DIAG.items.length % original.length] });
  };
  const finishConfirm = () => {
    const domain = domainList().find(item => item.k === DIAG.confirm), total = DIAG.res.length, right = DIAG.res.filter(item => item.ok).length;
    S.mastery = cleanMastery(S.mastery); S.mastery[domainKey(domain)] = { at: now(), right, total, approved: 0 }; save();
    DIAG.confirm = null; DIAG.confirmBinary = false;
    view().innerHTML = `<h1>${L(B('Check complete!', '확인 끝!'))}</h1><p>${L(B('Thank you for trying. Keep exploring with Peachy!', '도전해 줘서 고마워요. 피치와 계속 둘러봐요!'))}</p><button class="next" id="confirmHome">${T().pickAnother}</button>`;
    $('#confirmHome').onclick = home;
  };
  const panel = () => {
    if (kidGrade() === 'P') return '';
    return `<section><h2>${L(B('Skill confirmation', '영역 확인 테스트'))}</h2><p class="note2">${L(B('Level 2: 4 of 5, or 7 of 8 when a two-choice question appears. A grown-up approves a pass candidate. Approved areas leave recommendations for 30 days, then we suggest checking again.', '레벨 2에서 5문제 중 4개, 2지선다 문제가 있으면 8문제 중 7개가 기준이에요. 통과 후보는 보호자가 승인해요. 승인한 영역은 30일간 추천에서 빠지고, 이후 재확인을 제안해요.'))}</p>${domainList().filter(domain => !domain.reviewOnly).map(domain => {
      const entry = (S.mastery || {})[domainKey(domain)], candidate = candidates().includes(domain), approved = excluded(domain);
      if (!entry && !candidate) return '';
      return `<p>${L(domain.n)} ${approved ? L(B('Approved · practice remains available', '승인됨 · 직접 연습은 가능해요')) : entry && passed(entry.right, entry.total) && !entry.approved ? `${L(B('Pass candidate', '통과 후보'))} ${entry.right}/${entry.total} <button class="pill" data-approve="${domain.k}">${L(B('Approve for 30 days', '30일 통과 승인'))}</button>` : ''} ${candidate ? `<button class="pill" data-confirm="${domain.k}">${L(entry && entry.approved ? B('Check again', '다시 확인') : B('Try confirmation', '확인 테스트 시작'))}</button>` : ''}</p>`;
    }).join('')}</section>`;
  };
  const bind = () => {
    $$('[data-confirm]').forEach(button => button.onclick = () => startConfirm(button.dataset.confirm));
    $$('[data-approve]').forEach(button => button.onclick = () => {
      const domain = domainList().find(item => item.k === button.dataset.approve), entry = (S.mastery || {})[domainKey(domain)];
      if (kidGrade() !== 'P' && !domain.reviewOnly && entry && passed(entry.right, entry.total)) { entry.approved = now(); save(); grownups(); }
    });
  };
  const cleanPickLog = value => (Array.isArray(value) ? value : []).filter(row => Array.isArray(row) && row.length === 3 && Number.isInteger(row[0]) && row[0] >= now() - 60 * 86400 && row[0] <= now() && domainKeys.includes(row[1]) && [0, 1].includes(row[2])).map(row => row.slice()).sort((left, right) => left[0] - right[0]).slice(-1500);
  const cleanDays = value => Object.fromEntries(Object.entries(isObj(value) ? value : {}).filter(([date, entry]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date && date >= new Date((now() - 60 * 86400) * 1000).toISOString().slice(0, 10) && date <= new Date().toISOString().slice(0, 10) && isObj(entry)).sort(([left], [right]) => left.localeCompare(right)).slice(-60).map(([date, entry]) => [date, { weak: Math.max(0, Math.min(1000, Math.floor(Number.isFinite(entry.weak) ? entry.weak : 0))), boss: Math.max(0, Math.min(1000, Math.floor(Number.isFinite(entry.boss) ? entry.boss : 0))) }]));
  const weakDomain = domain => {
    if (!domain) return false;
    if (domain.reviewOnly) return reviewBands(domain).length > 0;
    const rows = domainRows(domain).slice(-20);
    if (rows.length >= 20 && window.LearnLog.accuracy(rows) < 0.7) return true;
    const ids = Object.values(domain.g).flat();
    const report = S.profile && S.profile.report;
    if (report && report.picks.some(item => ids.includes(item.id) && item.reasons.some(reason => /\((?:N|U)\)/.test(reason)))) return true;
    return typeof latestResults === 'function' && Object.entries(latestResults()).some(([id, right]) => ids.includes(id) && right === false);
  };
  const weakGame = game => {
    const domain = domainFor(game.id);
    return domain && domain.reviewOnly ? reviewBands(domain).some(item => (domain.topics.find(ids => ids.includes(item.id)) || []).includes(game.id)) && gradeOf(game) === kidGrade() && !heldGame(game) : weakDomain(domain);
  };
  const evidence = () => {
    if (kidGrade() === 'P') return { candidate: 'unknown', total: 0, wrong: 0, offered: 0 };
    const weak = domainList().filter(weakDomain);
    const weakIds = new Set(weak.flatMap(domain => domain.reviewOnly
      ? reviewBands(domain).flatMap(item => domain.topics.find(ids => ids.includes(item.id)) || []).filter(id => gameById(id) && gradeOf(gameById(id)) === kidGrade() && !heldGame(gameById(id)))
      : Object.values(domain.g).flat()));
    const rows = window.LearnLog.clean(S.log).filter(row => row[0] >= now() - 14 * 86400 && !(row[5] & 2) && weakIds.has(row[1]));
    const wrong = rows.filter(row => row[3] === 0), offered = cleanPickLog(S.pickLog).filter(row => row[0] >= now() - 14 * 86400 && weak.some(domain => domain.k === row[1]));
    const rates = [wrong.length >= 10 ? wrong.filter(row => row[5] & 4).length / wrong.length : null, rows.filter(row => row[3] === 2).length / rows.length, offered.length >= 10 ? offered.filter(row => row[2] === 0).length / offered.length : null];
    const result = candidate => ({ candidate, total: rows.length, wrong: wrong.length, offered: offered.length, rates });
    if (rows.length < 30) return result('unknown');
    if (rates.filter(rate => rate !== null && rate >= 0.3).length >= 2) return result('slow');
    const advanced = [...new Set(rows.map(row => row[1]))].some(id => {
      const own = rows.filter(row => row[1] === id), first = own.findIndex(row => row[2] >= 2);
      return first > 0 && first < 10 && own.slice(0, first).some(row => row[2] === 1);
    });
    return result(rates.every(rate => rate !== null && rate < 0.3) && advanced ? 'challenge' : 'unknown');
  };
  const behavior = () => kidGrade() === 'P' || evidence().candidate !== decision().observed ? 'unknown' : decision().observed;
  const style = () => kidGrade() === 'P' ? 'unknown' : ['slow', 'challenge'].includes(S.learningStyle) ? S.learningStyle : behavior();
  const pattern = mode => mode === 'slow' ? ['confident', 'confident', 'weak'] : mode === 'challenge' ? ['weak', 'confident'] : [];
  const confident = game => {
    const domain = domainFor(game.id);
    if (domain && domain.reviewOnly && (gradeOf(game) !== kidGrade() || heldGame(game))) return false;
    if (weakGame(game)) return false;
    const rows = window.LearnLog.clean(S.log).filter(row => row[1] === game.id && !(row[5] & 2)).slice(-20), saved = S.stats[game.id] || {};
    return rows.length >= 5 ? window.LearnLog.accuracy(rows) >= 0.85 : (saved.right || 0) + (saved.wrong || 0) >= 5 && saved.right / (saved.right + (saved.wrong || 0)) >= 0.85;
  };
  const arrange = (base, max) => {
    const mode = style(), order = pattern(mode);
    if (!order.length) return base.slice(0, max);
    const weak = base.filter(item => gameById(item.id) && weakGame(gameById(item.id))), familiar = visibleGames().filter(game => confident(game) && !excludedGame(game));
    if (!weak.length || !familiar.length) return base.slice(0, max);
    const chosen = [], seen = new Set();
    for (let index = 0; index < max; index++) {
      const item = order[index % order.length] === 'weak' ? weak.find(item => !seen.has(item.id)) : familiar.filter(game => !seen.has(game.id)).map(game => base.find(item => item.id === game.id) || { id: game.id, need: 0, why: ['__style__'] })[0];
      if (item) { chosen.push(item); seen.add(item.id); }
    }
    base.forEach(item => { if (!seen.has(item.id)) { chosen.push(item); seen.add(item.id); } });
    return chosen.slice(0, max);
  };
  const excludedGame = game => { const domain = domainFor(game.id); return domain && excluded(domain); };
  const mixGame = () => {
    if (kidGrade() === 'P') return null;
    const order = pattern(style()); if (!order.length) return null;
    const slot = order[(SESSION.styleTurn || 0) % order.length]; SESSION.styleTurn = (SESSION.styleTurn || 0) + 1;
    const games = visibleGames().filter(game => !excludedGame(game) && (slot === 'weak' ? weakGame(game) : confident(game)));
    const different = games.filter(game => game.id !== SESSION.id);
    return (different.length || games.length) ? pick(different.length ? different : games) : null;
  };
  let offers = [];
  const offer = picks => { offers = kidGrade() === 'P' ? [] : [...new Set(picks.filter(item => gameById(item.id) && weakGame(gameById(item.id))).map(item => domainFor(item.id)).filter(weakDomain).map(domain => domain.k))]; };
  const choose = game => {
    if (kidGrade() === 'P' || gradeOf(game) === 'P') { offers = []; return; }
    decision().bands ??= calculateBands();
    if (offers.length) {
      S.pickLog = cleanPickLog(S.pickLog).concat(offers.map(key => [now(), key, Object.values(domainList().find(domain => domain.k === key).g).some(ids => ids.includes(game.id)) ? 1 : 0])).slice(-1500);
      offers = []; save();
    }
  };
  const dayCounts = () => { S.learnDays = cleanDays(S.learnDays); return S.learnDays[today()] = S.learnDays[today()] || { weak: 0, boss: 0 }; };
  const noteBoss = () => { if (kidGrade() !== 'P' && SESSION.learnerMode === 'challenge') { dayCounts().boss++; save(); } };
  const complete = () => {
    if (kidGrade() === 'P' || SESSION.styleCompleted) return;
    SESSION.styleCompleted = true;
    refresh();
    if (SESSION.styleWeak) { dayCounts().weak++; save(); }
  };
  const goal = () => {
    const mode = style(); if (mode === 'unknown' || kidGrade() === 'P') return '';
    const counts = (S.learnDays || {})[today()] || { weak: 0, boss: 0 };
    return `<p class="note2">🎯 ${mode === 'slow' ? L(B(`One little step: a practice game ${Math.min(counts.weak, 1)}/1`, `조금만 해 보자: 연습 게임 ${Math.min(counts.weak, 1)}/1판`)) : L(B(`Today: practice games ${Math.min(counts.weak, 2)}/2 · 🐉 Boss question ${Math.min(counts.boss, 1)}/1`, `오늘: 연습 게임 ${Math.min(counts.weak, 2)}/2판 · 🐉 보스 문제 ${Math.min(counts.boss, 1)}/1개`))}</p>`;
  };
  const labels = () => ({ slow: L(B('Take small steps', '천천히 다가가기')), challenge: L(B('Enjoy challenges', '도전 좋아하기')), unknown: L(B('Not sure yet', '잘 모르겠어요')) });
  const stylePanel = () => {
    if (kidGrade() === 'P') return '';
    const selected = ['slow', 'challenge'].includes(S.learningStyle) ? S.learningStyle : 'unknown', observed = behavior(), basis = evidence();
    return `<section><h2>${L(B('Approach to learning', '학습 접근 방식'))}</h2><p>${labels()[selected]}</p><p class="note2">${L(B('Automatic observation', '자동 관찰'))}: ${observed === 'unknown' ? L(B('Insufficient observation', '관찰 부족')) : labels()[observed]}</p>${selected !== 'unknown' && observed !== 'unknown' && observed !== selected ? `<p>${L(B(`Recent play looks closer to: ${labels()[observed]}. Your answer still takes priority.`, `요즘은 ${labels()[observed]} 쪽으로 보여요. 보호자 답을 우선 유지해요.`))}</p>` : ''}<p class="note2">${L(B('Behavior estimates start after 30 questions in areas needing practice over 14 days. With too little evidence, we keep the default. A chosen alternative counts as a skipped recommendation; simply leaving the menu does not.', '최근 14일 동안 연습할 영역의 문제가 30개 이상일 때 행동을 참고해요. 자료가 적으면 기본 방식을 유지해요. 다른 게임을 고르면 추천 넘김으로 세며, 메뉴를 나가기만 한 경우는 세지 않아요.'))}</p><p class="note2">${L(B(`Behavior estimate, not a measurement. Last 14 days: ${basis.total} weak-area answers (minimum 30); wrong answers ${basis.wrong} (minimum 10); recommendations offered ${basis.offered} (minimum 10). Ratios below their minimum are unavailable. Entry requires two consecutive completed rounds. No weakness evidence means insufficient observation.`, `측정이 아닌 행동 추정이에요. 최근 14일: 연습할 영역 ${basis.total}문제(최소 30), 오답 ${basis.wrong}개(최소 10), 추천 제시 ${basis.offered}회(최소 10). 최소 분모 미달 비율은 사용하지 않아요. 연속 2개 완료 판에서 같은 판정일 때 반영해요. 약함 근거가 없으면 관찰 부족이에요.`))}</p><button class="pill" id="styleEdit">${L(B('Child profile: learning approach', '아이 프로필: 학습 접근 방식'))}</button></section>`;
  };
  const styleSettings = () => {
    if (kidGrade() === 'P') return home();
    const selected = ['slow', 'challenge'].includes(S.learningStyle) ? S.learningStyle : 'unknown';
    view().innerHTML = `<h1>${L(B('Child profile', '아이 프로필'))}</h1><p>${L(B('When a subject feels hard?', '어려운 과목을 만나면?'))}</p><div class="menu">${['slow', 'challenge', 'unknown'].map(mode => `<button class="pill" data-style="${mode}" aria-pressed="${selected === mode}">${labels()[mode]}</button>`).join('')}</div><button class="next" id="styleBack">${T().back}</button>`;
    $$('[data-style]').forEach(button => button.onclick = () => { S.learningStyle = button.dataset.style; save(); styleSettings(); });
    $('#styleBack').onclick = settings;
  };
  const bindStyle = () => { if ($('#styleEdit')) $('#styleEdit').onclick = styleSettings; };
  window.Learner = { evidence, refresh, tuneFlags, holdRise, canRise, domainFor, domainList, domainKey, cleanMastery, passed, excluded, candidates, bands, recommendations, saveStrong, startConfirm, confirmOptions, finishConfirm, panel, bind, cleanPickLog, cleanDays, weakDomain, weakGame, behavior, style, pattern, arrange, mixGame, offer, choose, noteBoss, complete, goal, stylePanel, styleSettings, bindStyle };
})();
