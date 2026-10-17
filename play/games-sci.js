'use strict';
// Science (GCPS K AKS: life, earth, physical science)
const AREA_SCI = (u) => B(`Science · ${u}`, `과학 · ${u}`);

const LIVING = [['🐕', B('dog', '강아지'), true], ['🌱', B('seedling', '새싹'), true], ['🦋', B('butterfly', '나비'), true], ['🐟', B('fish', '물고기'), true], ['🌳', B('tree', '나무'), true],
  ['🚗', B('car', '자동차'), false], ['⚽', B('ball', '공'), false], ['🧸', B('teddy bear', '곰 인형'), false], ['📖', B('book', '책'), false], ['⛰️', B('mountain', '산'), false], ['🐈', B('cat', '고양이'), true], ['🌻', B('sunflower plant', '해바라기'), true], ['🪑', B('chair', '의자'), false], ['🚲', B('bicycle', '자전거'), false]];
registerGame({
  id: 'living', subject: 'sci', icon: '🌱', title: B('Living or Not?', '살아 있을까?'), sub: B('Plants, animals, things', '식물, 동물, 물건'),
  area: AREA_SCI('Living things'),
  play() {
    if(lvl('living')===2){
      const t=pick(LIVING), plant=['seedling','tree','sunflower plant'].includes(t[1].en), key=t[2]?(plant?'plant':'animal'):'thing';
      quiz(this,{ask:B('Plant, animal, or nonliving thing?','식물, 동물, 살아 있지 않은 것 중 무엇일까요?'),show:`<span class="emo">${t[0]}</span>`,opts:[['plant',B('Plant','식물')],['animal',B('Animal','동물')],['thing',B('Nonliving','살아 있지 않아요')]].map(([k,n])=>({html:`<span class="word">${L(n)}</span>`,ok:k===key})),cls:'words',vocab:t[1].en});return;
    }
    const t = pick(LIVING);
    quiz(this, {
      ask: B('Is it living or not living?', '살아 있는 것일까요, 아닐까요?'),
      show: `<div class="bigword"><span class="emo">${t[0]}</span></div>`,
      opts: [{ html: '<span class="emo">🌿</span>', label: B('Living', '살아 있어요'), ok: t[2] }, { html: '<span class="emo">🧱</span>', label: B('Not living', '살아 있지 않아요'), ok: !t[2] }], cls: 'groups',
      after: B(`A ${t[1].en} is ${t[2] ? 'living' : 'not living'}.`, `${t[1].ko}은(는) ${t[2] ? '살아 있어요' : '살아 있지 않아요'}.`), vocab: `${t[1].en}`
    });
  }
});

const SKY = [['☀️', B('sun', '해'), true], ['🌞', B('sunny sky', '맑은 낮 하늘'), true], ['🌈', B('rainbow', '무지개'), true], ['🌙', B('moon', '달'), false], ['⭐', B('stars', '별'), false],
  ['🌌', B('night sky', '밤하늘'), false], ['🌠', B('shooting star', '별똥별'), false], ['🌅', B('sunrise', '해돋이'), true]];
registerGame({
  id: 'sky', subject: 'sci', icon: '🌙', title: B('Day Sky, Night Sky', '낮하늘 밤하늘'), sub: B('Sun, moon, stars', '해, 달, 별'),
  area: AREA_SCI('Day and night'),
  play() {
    const t = pick(SKY);
    if (rnd(2) === 0) {                                              // "which one do you see at night / in the day?"
      const day = rnd(2) === 0, good = pick(SKY.filter(x => x[2] === day && x[1].en !== 'moon')), bad = shuffle(SKY.filter(x => x[2] !== day && x[1].en !== 'moon')).slice(0, 2);
      const o = (x) => ({ html: `<span class="emo" data-cq-name="${L(x[1])}" aria-label="${L(x[1])}">${x[0]}</span>`, ok: x === good });
      quiz(this, {
        ask: day ? B('Which one do you see in the DAY sky?', '낮 하늘에서 볼 수 있는 것은?') : B('Which one do you see in the NIGHT sky?', '밤 하늘에서 볼 수 있는 것은?'),
        opts: [o(good), ...bad.map(o)], cls: 'shapes', onRender() { const b=document.createElement('button');b.className='say';b.textContent='🔊';b.setAttribute('aria-label',L(B('Hear picture names','그림 이름 듣기')));b.onclick=()=>$$('.opt [data-cq-name]').forEach((e,i)=>say(e.dataset.cqName,undefined,i>0));$('#sp').after(b); }, after: B(`You see the ${good[1].en} in the ${day ? 'day' : 'night'} sky.`, `${good[1].ko}은(는) ${day ? '낮' : '밤'} 하늘에서 봐요.`), vocab: good[1].en
      });
      return;
    }
    quiz(this, {
      ask: B('Do you see this in the day sky or the night sky?', '낮 하늘에서 볼까요, 밤 하늘에서 볼까요?'),
      show: `<div class="bigword"><span class="emo">${t[0]}</span></div>`,
      opts: [{ html: '<span class="emo">🌤️</span>', label: B('Day', '낮'), ok: t[2] }, { html: '<span class="emo">🌃</span>', label: B('Night', '밤'), ok: !t[2] && t[1].en !== 'moon' }, ...(t[1].en === 'moon' ? [{ html: '<span class="emo">🌤️🌃</span>', label: B('Both', '낮에도 밤에도'), ok: true }] : [])], cls: 'groups',
      after: t[1].en === 'moon' ? B('The Moon can be seen in the day and at night.', '달은 낮에도 밤에도 볼 수 있어요.') : B(`You see the ${t[1].en} in the ${t[2] ? 'day' : 'night'} sky.`, `${t[1].ko}은(는) ${t[2] ? '낮' : '밤'} 하늘에서 봐요.`), vocab: t[1].en
    });
  }
});

const MOTION = [['⚽', B('Kicking a ball', '공을 차요'), 'push'], ['🛒', B('Moving a cart forward', '카트를 밀어요'), 'push'], ['🚪', B('Pushing a door open', '문을 밀어서 열어요'), 'push'],
  ['🧱', B('Pushing a toy block', '장난감 블록을 밀어요'), 'push'], ['🛝', B('Pushing a swing', '그네를 밀어 줘요'), 'push'],
  ['🧲', B('A magnet pulls a paperclip', '자석이 클립을 끌어당겨요'), 'pull'], ['🐕', B('A dog tugs on a leash', '강아지가 줄을 당겨요'), 'pull'], ['🗄️', B('Opening a drawer', '서랍을 당겨서 열어요'), 'pull'],
  ['🛷', B('Pulling a sled', '썰매를 끌어요'), 'pull'], ['🪢', B('Tug of war with a rope', '줄다리기를 해요'), 'pull']];
registerGame({
  id: 'motion', subject: 'sci', icon: '🧲', title: B('Push or Pull?', '밀기 당기기'), sub: B('How things move', '물체가 움직이는 방법'),
  area: AREA_SCI('Motion'),
  play() {
    if(lvl('motion')===2){
      const a=pick(MOTION),b=pick(MOTION.filter(x=>x!==a)),key=a[2]===b[2]?a[2]:'both';
      quiz(this,{ask:B('Which forces appear in these TWO actions?','두 동작에 나타난 힘은?'),show:`<div style="font-size:clamp(16px,3dvh,22px)">${L(a[1])}<br>${L(b[1])}</div>`,opts:[['push',B('Push only','밀기만')],['pull',B('Pull only','당기기만')],['both',B('Push and pull','밀기와 당기기')]].map(([k,n])=>({html:`<span class="word">${L(n)}</span>`,ok:k===key})),cls:'words'});return;
    }
    const t = pick(MOTION);
    if (rnd(2) === 0) {                                              // "which one is a push / a pull?"
      const kind = rnd(2) === 0 ? 'push' : 'pull', good = pick(MOTION.filter(x => x[2] === kind)), bad = shuffle(MOTION.filter(x => x[2] !== kind)).slice(0, 2);
      const o = (x) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: x === good });
      quiz(this, {
        ask: kind === 'push' ? B('Which one is a PUSH?', '미는 것은 어느 것일까요?') : B('Which one is a PULL?', '당기는 것은 어느 것일까요?'),
        opts: [o(good), ...bad.map(o)], cls: 'shapes', after: B(`It is a ${kind}!`, kind === 'push' ? '미는 거예요!' : '당기는 거예요!'), vocab: kind
      });
      return;
    }
    quiz(this, {
      ask: B('Is it a push or a pull?', '미는 걸까요, 당기는 걸까요?'),
      show: `<div class="bigword"><span class="emo">${t[0]}</span> ${L(t[1])}</div>`,
      opts: [{ html: '<span class="emo">👉</span>', label: B('Push', '밀기'), ok: t[2] === 'push' }, { html: '<span class="emo">🤏</span>', label: B('Pull', '당기기'), ok: t[2] === 'pull' }], cls: 'groups',
      after: B(`It is a ${t[2]}!`, t[2] === 'push' ? '미는 거예요!' : '당기는 거예요!'), vocab: t[2]
    });
  }
});
