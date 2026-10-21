(() => {
  'use strict';
  // Original fictional books; K.T.C.2.a. No fixed person/role association.
  const names = [B('Ari', '아리'), B('Bo', '보'), B('Cia', '시아')];
  const jobs = [B('wrote the words', '글을 썼어요'), B('drew the pictures', '그림을 그렸어요'), B('read the book', '책을 읽었어요')];
  const scenes = [
    ['The Red Kite', '빨간 연', '🪁', 'The kite goes up.', '연이 올라가요.'],
    ['A Small Seed', '작은 씨앗', '🌱', 'I plant a seed.', '씨앗을 심어요.'],
    ['Moon Walk', '달빛 산책', '🌙', 'We walk at night.', '밤에 산책해요.'],
    ['My Blue Boat', '파란 배', '⛵', 'My boat can float.', '내 배가 물에 떠요.'],
    ['A Rainy Day', '비 오는 날', '☔', 'We jump in puddles.', '물웅덩이에서 뛰어요.'],
    ['The Little Nest', '작은 둥지', '🪺', 'A bird has a nest.', '새에게 둥지가 있어요.']
  ];
  const orders = [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]];
  // Six genuinely different assignments × two requested roles, at each level.
  const bank = orders.flatMap((order, i) => [0,1].map(target => ({order, target, scene: scenes[i]})));
  const picture = (role, s) => role === 0
    ? `<span class="g3b-work g3b-words">${L(B(s[3], s[4]))}</span>`
    : `<span class="g3b-work" aria-hidden="true">${role === 1 ? '🖍️ ' + s[2] : '📖'}</span>`;
  registerGame({
    id: 'bookmakersK', grade: 'K', subject: 'read', icon: '📚',
    title: B('Book Makers', '책을 만든 사람'), sub: B('Words and pictures', '글과 그림'),
    area: B('Reading · Authors and illustrators', '읽기 · 글 작가와 그림 작가'),
    play() {
      const item = pick(bank), {order, target, scene} = item, swap = lvl('bookmakersK') === 2;
      const person = role => order.indexOf(role);
      const answer = person(swap ? 1 - target : target);
      const question = swap
        ? (target === 0 ? B('Who will write the new book?', '새 책의 글은 누가 쓸까요?') : B('Who will draw the new book?', '새 책의 그림은 누가 그릴까요?'))
        : (target === 0 ? B('Who is the author?', '글 작가는 누구일까요?') : B('Who is the illustrator?', '그림 작가는 누구일까요?'));
      const lines = order.map((role, i) => B(`${names[i].en} ${jobs[role].en}.`, `${names[i].ko}: ${jobs[role].ko}.`));
      const change = B(`${names[person(0)].en} and ${names[person(1)].en} swap jobs for a new book.`, `${names[person(0)].ko}, ${names[person(1)].ko}: 새 책에서는 서로 일을 바꿔요.`);
      const read = (keepQueue = false) => say([...lines.map(L), ...(swap ? [L(change)] : [])].join(' '), S.lang === 'ko' ? 'ko-KR' : 'en-US', keepQueue);
      quiz(this, {
        ask: question,
        show: `<section class="g3b-stage" aria-label="${L(B('Made-up book workshop', '가상 책 작업실'))}">
          <div class="g3b-scenes">${order.map((role, i) => `<div class="g3b-scene"><strong>${L(names[i])}</strong>${picture(role, scene)}<span class="g3b-job">${L(jobs[role])}</span><button class="say g3b-listen" data-g3b="${i}" aria-label="${L(B('Listen to ', '듣기: '))}${L(names[i])}">🔊</button></div>`).join('')}</div>
          <div class="g3b-cover"><span aria-hidden="true">${scene[2]}</span> ${L(B(scene[0], scene[1]))} <span class="g3b-fiction">${L(B('Made-up book', '가상의 책'))}</span></div>
          ${swap ? `<div class="g3b-swap">⇄ ${L(change)}</div>` : ''}
        </section>`,
        opts: names.map((n, i) => ({html: `<span class="word">${L(n)}</span>`, ok: i === answer, category: 'book-person'})),
        cls: 'g3b-options',
        after: B(`${names[answer].en} ${target === 0 ? 'makes the words' : 'makes the pictures'}${swap ? ' in the new book' : ''}.`, `${swap ? '새 책에서 ' : ''}${names[answer].ko}: ${target === 0 ? '글을 써요' : '그림을 그려요'}.`),
        onRender() {
          document.querySelectorAll('[data-g3b]').forEach(button => {
            button.onclick = () => say(L(lines[Number(button.dataset.g3b)]), S.lang === 'ko' ? 'ko-KR' : 'en-US');
          });
          const listen = document.createElement('button');
          listen.className = 'say g3b-all'; listen.textContent = '🔊';
          listen.setAttribute('aria-label', L(B('Hear the workshop', '작업실 이야기 듣기')));
          listen.onclick = () => read(); document.querySelector('.g3b-cover').append(listen);
          read(true);
        }
      });
    }
  });
})();
