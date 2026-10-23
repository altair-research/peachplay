(() => {
  'use strict';
  // Original fictional town records, not historical claims. GaDOE information skills 6/7.
  const pair = (en, ko) => B(en, ko);
  const fiction = pair('Made-up town records', '가상 마을 기록');
  const listen = pair('Hear this record', '이 기록 듣기');
  const letters = ['A', 'B', 'C'];
  // Each event has a different kind of first-hand evidence and a different research purpose.
  // Later sources explicitly use the older record; media alone never determines the answer.
  const sources = [
    [pair('Town fair', '마을 축제'), pair('Mia: diary, fair day', '미아: 축제 당일 일기'), pair('I felt happy at the fair.', '축제에서 행복했어요.'), pair('Which record gives Mia’s own feelings?', '그날 미아의 느낌을 직접 볼 기록은?'), false],
    [pair('Market day', '장터 날'), pair('Bo: sales book, market day', '보: 장터 당일 장부'), pair('I sold six apples.', '사과 여섯 개를 팔았어요.'), pair('Which record lists that day’s sales?', '그날 판매를 직접 적은 기록은?'), false],
    [pair('Bridge opening', '다리 개통'), pair('Ari: letter, opening day', '아리: 개통 당일 편지'), pair('I walked across the new bridge.', '새 다리를 걸어서 건넜어요.'), pair('Which text compares older records?', '옛 기록을 비교해 설명한 글은?'), true],
    [pair('Garden planting', '정원 심기'), pair('Cia: photo, planting day', '시아: 심은 당일 사진'), pair('My photo shows three planted rows.', '내 사진에 심은 세 줄이 보여요.'), pair('Which record shows the rows that day?', '그날 심은 줄을 직접 보여 주는 기록은?'), false],
    [pair('School play', '학교 연극'), pair('Leo: recording, play day', '레오: 연극 당일 녹음'), pair('I recorded the actors singing.', '배우들의 노래를 녹음했어요.'), pair('Which record lets us hear the actors?', '배우들의 목소리를 직접 들을 기록은?'), false],
    [pair('Bus launch', '버스 첫 운행'), pair('Nia: ticket, first ride', '니아: 첫 운행 때의 표'), pair('I kept my ticket from the first ride.', '첫 운행 때 탄 표를 간직했어요.'), pair('Which text compares older records?', '옛 기록을 비교해 설명한 글은?'), true],
    [pair('Library opening', '도서실 개관'), pair('Ava: news, opening day', '에이바: 개관 당일 기사'), pair('I was there and wrote about the crowd.', '현장에 가서 모인 사람들 기사를 썼어요.'), pair('Which record describes a reporter’s visit?', '기자가 직접 가서 남긴 기록은?'), false],
    [pair('Park cleanup', '공원 청소'), pair('Ben: list, cleanup day', '벤: 청소 당일 목록'), pair('I counted four bags of litter.', '쓰레기 네 봉지를 세었어요.'), pair('Which record gives the helper’s count?', '도운 사람이 직접 센 수를 적은 기록은?'), false],
    [pair('Town parade', '마을 행진'), pair('May: drawing, parade day', '메이: 행진 당일 그림'), pair('I drew the flags I saw.', '내가 본 깃발을 그렸어요.'), pair('Which text compares older records?', '옛 기록을 비교해 설명한 글은?'), true],
    [pair('Pond visit', '연못 방문'), pair('Jay: notes, visit day', '제이: 방문 당일 메모'), pair('I saw two ducks by the pond.', '연못 곁에서 오리 두 마리를 봤어요.'), pair('Which record gives the visitor’s count?', '방문자가 직접 센 수를 적은 기록은?'), false],
    [pair('Town concert', '마을 음악회'), pair('Sam: video, concert day', '샘: 음악회 당일 영상'), pair('I filmed the band playing.', '연주하는 악단을 찍었어요.'), pair('Which record shows the band moving?', '악단의 움직임을 직접 보여 주는 기록은?'), false],
    [pair('Bread sale', '빵 판매'), pair('Kim: recipe, sale day', '김: 판매 당일 조리법'), pair('I wrote down how I baked the bread.', '내가 빵 만든 방법을 적었어요.'), pair('Which text compares older records?', '옛 기록을 비교해 설명한 글은?'), true]
  ];
  const sourceQuestion = pair('Which record is from someone who was there?', '현장에 있던 사람이 남긴 기록은?');
  const laterMedia = [pair('diary', '일기'), pair('book', '책'), pair('letter', '편지'), pair('photo essay', '사진 해설'), pair('recording', '녹음'), pair('book', '책'), pair('news', '기사'), pair('report', '보고서'), pair('picture book', '그림책'), pair('notes', '메모'), pair('video', '영상'), pair('book', '책')];
  const summary = pair('✍️ 2 years later', '✍️ 두 해 뒤');
  const explanation = pair('I compared old records.', '옛 기록들을 비교했어요.');
  const shortened = pair('I shortened that text.', '그 글을 줄였어요.');
  const speech = text => say(text, S.lang === 'ko' ? 'ko-KR' : 'en-US');
  function bindAudio(lines) {
    document.querySelectorAll('[data-g3s-read]').forEach(btn => {
      btn.onclick = () => speech(lines[Number(btn.dataset.g3sRead)]);
    });
  }
  registerGame({
    id: 'sourcecards1', grade: '1', subject: 'ss', icon: '🗂️',
    title: pair('Source Detective', '출처 탐정'), sub: pair('Who made this record?', '누가 남긴 기록일까요?'),
    area: pair('Social studies · Sources', '사회 · 출처'),
    play() {
      const s = pick(sources), level2 = lvl(this.id) === 2;
      const media = laterMedia[sources.indexOf(s)];
      const later = pair(`✍️ ${media.en}, next year`, `✍️ 다음 해 ${media.ko}`);
      const ordered = shuffle([
        {kind: 0, maker: s[1], text: s[2]},
        {kind: 1, maker: later, text: explanation},
        {kind: 2, maker: summary, text: shortened}
      ]);
      const target = level2 && s[4] ? 1 : 0;
      const oldLabel = letters[ordered.findIndex(c => c.kind === 0)];
      const laterLabel = letters[ordered.findIndex(c => c.kind === 1)];
      const lines = ordered.map((c, i) => `${letters[i]}. ${L(c.maker)}. ${L(c.text)}${c.kind === 1 ? ' (' + oldLabel + ')' : c.kind === 2 ? ' (' + laterLabel + ')' : ''}`);
      quiz(this, {
        ask: level2 ? s[3] : sourceQuestion,
        show: `<section class="g3s-stage"><div class="g3s-heading" aria-label="${L(fiction)}">${L(pair('Made-up', '가상'))} · ${L(s[0])}</div><div class="g3s-records">${ordered.map((c, i) => `<article class="g3s-record"><strong>${letters[i]} · ${L(c.maker)}</strong><span>${L(c.text)}${c.kind === 1 ? ' (' + oldLabel + ')' : c.kind === 2 ? ' (' + laterLabel + ')' : ''}</span><button class="say" data-g3s-read="${i}" aria-label="${L(listen)} ${letters[i]}">🔊</button></article>`).join('')}</div></section>`,
        opts: ordered.map((c, i) => ({html: `<span class="word">${letters[i]}</span>`, ok: c.kind === target, category: 'record-card'})),
        cls: 'g3s-options',
        after: target === 0 ? pair('This person made a record of their own visit.', '직접 겪은 사람이 남긴 기록이에요.') : pair('This writer compared older records.', '옛 기록을 비교해서 쓴 글이에요.'),
        onRender() { bindAudio(lines); }
      });
    }
  });
  // [three event names, category membership, target predicate]. Years have no history claims.
  const timelines = [
    [pair('Library opens', '도서실 개관'), pair('Garden planted', '정원 심기'), pair('Bridge fixed', '다리 수리'), [0,1,1], pair('outdoor work', '실외 일')],
    [pair('Bus starts', '버스 운행'), pair('Market opens', '시장 개장'), pair('Park opens', '공원 개장'), [0,1,1], pair('places to visit', '방문할 곳')],
    [pair('Post office opens', '우체국 개관'), pair('Road fixed', '도로 수리'), pair('Clinic opens', '진료소 개관'), [1,0,1], pair('buildings', '건물')],
    [pair('Pool opens', '수영장 개장'), pair('Choir starts', '합창단 시작'), pair('Team starts', '운동팀 시작'), [0,1,1], pair('groups', '모임')],
    [pair('Trees planted', '나무 심기'), pair('Hall painted', '회관 칠하기'), pair('Roof fixed', '지붕 수리'), [0,1,1], pair('building work', '건물 일')],
    [pair('Cafe opens', '찻집 개업'), pair('Trail opens', '산책길 개방'), pair('Bakery opens', '빵집 개업'), [1,0,1], pair('food shops', '음식 가게')],
    [pair('Boat starts', '배 운행'), pair('Train starts', '기차 운행'), pair('School opens', '학교 개관'), [1,1,0], pair('transport', '교통')],
    [pair('Art club starts', '미술 모임 시작'), pair('Shop opens', '가게 개업'), pair('Dance club starts', '춤 모임 시작'), [1,0,1], pair('clubs', '모임')],
    [pair('Bench added', '벤치 놓기'), pair('Fence added', '울타리 세우기'), pair('Mural painted', '벽화 그리기'), [1,1,0], pair('new objects', '새 물건')],
    [pair('Well dug', '우물 파기'), pair('Pipe fixed', '수도관 수리'), pair('Clock fixed', '시계 수리'), [1,1,0], pair('water work', '물 관련 일')],
    [pair('Play staged', '연극 공연'), pair('Books sold', '책 판매'), pair('Concert held', '음악회 열기'), [1,0,1], pair('shows', '공연')],
    [pair('Bus stop added', '버스 정류장 설치'), pair('Bike rack added', '자전거 거치대 설치'), pair('Flower bed added', '꽃밭 만들기'), [1,1,0], pair('travel equipment', '이동 관련 시설')]
  ];
  registerGame({
    id: 'timelinecards1', grade: '1', subject: 'ss', icon: '📅',
    title: pair('Time Detective', '시간 탐정'), sub: pair('Read dates and tables', '날짜와 표 읽기'),
    area: pair('Social studies · Timelines and tables', '사회 · 연표와 표'),
    play() {
      const row = pick(timelines), index = timelines.indexOf(row), level2 = lvl(this.id) === 2;
      const years = [2001, 2003, 2005], mode = index % 3;
      // Each L2 set has exactly two category matches. A time condition separates them.
      const members = row[3].map((v,i) => v ? i : -1).filter(i => i >= 0);
      // Time alone must also leave two candidates: neither condition solves L2 by itself.
      const before = !row[3][0] ? true : !row[3][2] ? false : index % 2 === 0;
      const boundary = before ? 2004 : 2002;
      const target = level2 ? members.find(i => before ? years[i] < boundary : years[i] > boundary) : mode === 0 ? 0 : mode === 1 ? 1 : 2;
      const ask = level2
        ? pair(`Which ${row[4].en} came ${before ? 'before' : 'after'} ${boundary}?`, `${boundary}년 ${before ? '전' : '뒤'}의 ${row[4].ko}에 해당하는 것은?`)
        : mode === 0 ? pair('What happened first?', '가장 먼저 한 일은?') : mode === 1 ? pair('What happened in 2003?', '2003년에 한 일은?') : pair('What happened last?', '가장 나중에 한 일은?');
      // Scrambled rows make date reading necessary; timeline mode uses chronological rows.
      const display = mode === 1 ? shuffle([0,1,2]) : [0,1,2];
      const lines = display.map(i => `${years[i]}. ${L(row[i])}.`);
      if (level2) lines.push(`${L(row[4])}: ${members.map(i => L(row[i])).join(', ')}.`);
      quiz(this, {
        ask,
        show: `<section class="g3s-stage"><div class="g3s-heading">${L(fiction)} · ${L(mode === 1 ? pair('Date table', '날짜 표') : pair('Timeline · order only', '연표 · 순서만 표시'))}</div><div class="g3s-dates ${mode === 1 ? '' : 'g3s-timeline'}">${display.map((i,n) => `<div class="g3s-date"><strong>${years[i]}</strong><span>${L(row[i])}</span><button class="say" data-g3s-read="${n}" aria-label="${L(listen)} ${years[i]}">🔊</button></div>`).join('')}</div>${level2 ? `<table class="g3s-table"><caption>${L(pair('Group table', '분류 표'))}</caption><tbody><tr><th scope="row">${L(row[4])}</th><td>${members.map(i => L(row[i])).join(' · ')}</td></tr></tbody></table><button class="say g3s-group-audio" data-g3s-read="3" aria-label="${L(pair('Hear the group table', '분류 표 듣기'))}">🔊</button>` : ''}</section>`,
        opts: [0,1,2].map(i => ({html: `<span class="word">${L(row[i])}</span>`, ok: i === target, category: 'town-event'})),
        cls: 'g3s-options',
        after: level2 ? pair('The date and group both fit.', '날짜와 분류가 둘 다 맞아요.') : pair(`${years[target]}: ${row[target].en}.`, `${years[target]}년: ${row[target].ko}.`),
        onRender() { bindAudio(lines); }
      });
    }
  });
})();
