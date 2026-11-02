// Fictional data only. Rendering never swaps, mutates or persists application state.
(() => {
  'use strict';
  let language = 'en';
  const tr = (en, ko) => language === 'ko' ? ko : en;
  const label = () => tr('Example child · Kindergarten · Fictional records', '예시 아이 · 유치원 · 가상 기록');
  const report = [
    ['Counts by tens', '10씩 세기', 'U'], ['Compares numbers', '수 비교하기', 'N'],
    ['Makes ten with pairs', '짝으로 10 만들기', 'N'], ['Matches letters and sounds', '글자와 소리 잇기', 'N'],
    ['Names shapes', '도형 이름 알기', 'S'], ['Retells a story', '이야기 다시 말하기', 'S'],
    ['Observes living things', '살아 있는 것 관찰하기', 'E'], ['Follows classroom rules', '교실 규칙 지키기', 'S']
  ];
  function source() {
    const log = [], now = Math.floor(Date.now() / 1000) - 60;
    for (const back of [0, 1, 2, 4, 5]) for (const [id, correct] of [['count', 2], ['rhyme', 4]])
      for (let i = 0; i < 4; i++) log.push([now - back * 86400 + i, id, 1, i < correct ? 1 : 0, 5000, 0]);
    log.sort((a, b) => a[0] - b[0]);
    return { log, profile: { school: { at: today(), grade: 'K', ir: { num: 'b', ph: 'e' }, miss: [] } } };
  }
  function open(step = 0, lang) {
    language = ['ko', 'en'].includes(lang) ? lang : S.lang;
    document.body.classList.add('grown', 'example-mode');
    const titles = [tr('Result card', '결과 풀이 카드'), tr("Today's 10 minutes", '오늘 10분'), tr('This week', '이번 주')];
    const home = tr('Count snacks in groups of ten. Ask how many more make ten.', '간식을 10개씩 묶어 세어요. 10개가 되려면 몇 개 더 필요한지 물어요.');
    const body = step === 0 ? `<section class="sr-card"><h2>${tr('Start with counting by tens', '10씩 세기부터 함께 해 봐요')}</h2><p>${tr('U means this skill needs support. Try one short game, then count real objects together.', 'U는 도움이 필요한 항목이에요. 짧은 게임 한 판 뒤에 실제 물건을 함께 세어 봐요.')}</p><details><summary>${tr('8 fictional report-card lines', '가상 성적표 8줄 보기')}</summary><table><tbody>${report.map(([en, ko, mark]) => `<tr><td>${tr(en, ko)}</td><td>${mark}</td></tr>`).join('')}</tbody></table><p>${tr('U: Unsatisfactory · N: Needs Development · S: Satisfactory · E: Excellent', 'U: 미흡 · N: 발달 필요 · S: 만족 · E: 우수')}</p></details><p>i-Ready · ${tr('Number and Operations: Below · Phonics: Early on', '수와 연산: 학년 아래 · 파닉스: 학년 초반')}</p></section>`
      : step === 1 ? `<section class="sr-card"><h2>${tr('One topic, in the app and at home', '게임과 집 활동을 한 주제로')}</h2><h3>${tr('Game · about 5 minutes', '게임 · 약 5분')}</h3><p>${tr('Counting by tens · one practice round, with a warm-up and review if needed.', '10씩 세기 · 준비 운동 뒤 연습 한 판, 필요하면 복습해요.')}</p><h3>${tr('At home · 5 minutes', '집에서 · 5분')}</h3><p>${home}</p><p>${tr('Next time: look at the counting-by-tens line on the school report.', '다음 학교 결과에서는 10씩 세기 항목을 다시 봐요.')}</p></section>`
      : Weekly.html(source(), ['num'], pair => pair[language] || pair.en);
    view().innerHTML = `<div id="example"><div class="example-banner" role="note">${tr('Example · Not real child records · Nothing is saved', '예시예요 · 실제 아이 기록이 아니에요 · 저장되지 않아요')}</div><h1>${titles[step]}</h1><nav class="sr-tabs" aria-label="${tr('Example steps', '예시 순서')}">${titles.map((t, i) => `<button class="pill" data-example="${i}" aria-pressed="${i === step}">${i + 1}. ${t}</button>`).join('')}</nav>${body}<div class="example-actions">${step < 2 ? `<button class="next" id="exNext">${tr('Next', '다음')} → ${titles[step + 1]}</button>` : ''}<button class="pill" id="exResults">${tr("Add my child's results", '우리 아이 결과 넣기')}</button><button class="link" id="exPlay">${tr('Just play games', '그냥 게임 하기')}</button></div></div>`;
    const langButton = document.createElement('button'); langButton.className = 'pill'; langButton.textContent = tr('한국어', 'English'); langButton.onclick = () => open(step, language === 'ko' ? 'en' : 'ko'); document.querySelector('#example .sr-tabs').append(langButton);
    document.documentElement.lang = language;
    document.querySelectorAll('[data-example]').forEach(b => b.onclick = () => open(+b.dataset.example, language));
    if ($('#exNext')) $('#exNext').onclick = () => open(step + 1, language);
    const leave = fn => { document.body.classList.remove('example-mode'); fn(); };
    $('#exResults').onclick = () => leave(() => gate(() => SchoolResults.open(grownups)));
    $('#exPlay').onclick = () => leave(homeScreen);
    const copy = $('#wkCopy'); if (copy) copy.remove();
    window.scrollTo(0, 0);
  }
  const homeScreen = () => home();
  window.Example = { open, source, label };
})();
