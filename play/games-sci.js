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
      quiz(this,{ask:B('Plant, animal, or nonliving thing?','식물, 동물, 무생물 중 무엇일까요?'),show:`<span class="emo">${t[0]}</span>`,opts:[['plant','🌿',B('Plant','식물')],['animal','🐾',B('Animal','동물')],['thing','🧱',B('Nonliving','무생물')]].map(([k,e,n])=>({html:`<span class="emo">${e}</span>`,label:n,ok:k===key})),cls:'groups',vocab:t[1].en});return;
    }
    const t = pick(LIVING);
    quiz(this, {
      ask: B('Is it living or not living?', '살아 있는 것일까요, 아닐까요?'),
      show: `<div class="bigword"><span class="emo">${t[0]}</span></div>`,
      opts: [{ html: '<span class="emo">🌿</span>', label: B('Living', '살아 있어요'), ok: t[2] }, { html: '<span class="emo">🧱</span>', label: B('Not living', '아니에요'), ok: !t[2] }], cls: 'groups',
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
        ask: day ? B('Which one is in the DAY sky?', '낮 하늘에서 볼 수 있는 것은?') : B('Which one is in the NIGHT sky?', '밤 하늘에서 볼 수 있는 것은?'),
        opts: [o(good), ...bad.map(o)], cls: 'shapes', onRender() { const b=document.createElement('button');b.className='say';b.textContent='🔊';b.setAttribute('aria-label',L(B('Hear picture names','그림 이름 듣기')));b.onclick=()=>$$('.opt [data-cq-name]').forEach((e,i)=>say(e.dataset.cqName,undefined,i>0));$('#sp').after(b); }, after: B(`You see the ${good[1].en} in the ${day ? 'day' : 'night'} sky.`, `${good[1].ko}은(는) ${day ? '낮' : '밤'} 하늘에서 봐요.`), vocab: good[1].en
      });
      return;
    }
    quiz(this, {
      ask: B('Is this in the day or night sky?', '낮 하늘에서 볼까요, 밤 하늘에서 볼까요?'),
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
    // D7 (2026-10-28, K school test): fair-test choice ("which test tells us?"), best-reason choice and the wheels feature.
    // Every picture keeps the rule from 70a: the pusher is on the left, the arrow shows where the thing goes.
    const lanes=(a,b)=>`<span class="emo" style="display:flex;flex-direction:column;align-items:flex-start;font-size:clamp(12px,min(4.2vw,3.4dvh),26px);line-height:1.3;white-space:nowrap"><span>${a}</span><span>${b}</span></span>`;
    if(lvl('motion')===2&&rnd(3)===0){
      // One thing changes (right), two things change, nothing changes. Same car, same floor unless that is what we test.
      const tests=[
        {q:B('Does a BIGGER push make it go farther?','더 세게 밀면 더 멀리 갈까요?'),cue:'👉 ❓ 👉👉',a:'👉🚗⬜',ok:'👉👉🚗⬜',two:'👉👉🚙⬜',after:B('Only the push changes, so we learn about the push.','미는 힘만 바꿨으니 미는 힘에 대해 알 수 있어요.')},
        {q:B('Does it roll farther on a smooth floor than on grass?','풀밭보다 매끈한 바닥에서 더 멀리 갈까요?'),cue:'⬜ ❓ 🌿',a:'👉🚗🌿',ok:'👉🚗⬜',two:'👉👉🚗⬜',after:B('Only the floor changes, so we learn about the floor.','바닥만 바꿨으니 바닥에 대해 알 수 있어요.')},
        {q:B('Do wheels help a box move?','바퀴가 있으면 상자가 더 잘 움직일까요?'),cue:'📦 ❓ 🛞',a:'👉📦⬜',ok:'👉📦🛞⬜',two:'👉👉📦🛞⬜',after:B('Only the wheels change, so we learn about wheels.','바퀴만 바꿨으니 바퀴에 대해 알 수 있어요.')}];
      const t=pick(tests);
      quiz(this,{ask:B('Which test can tell us?','어떤 실험이 알려 줄까요?'),askSay:B(`${t.q.en} Which test can tell us? Change only one thing.`,`${t.q.ko} 어떤 실험이 알려 줄까요? 한 가지만 바꿔요.`),show:`<div class="emo" style="font-size:clamp(24px,5dvh,36px)">${t.cue}</div>`,
        opts:shuffle([{html:lanes(t.a,t.ok),ok:true},{html:lanes(t.a,t.two),ok:false},{html:lanes(t.a,t.a),ok:false}]),cls:'shapes',after:t.after});return;
    }
    if(lvl('motion')===2&&rnd(2)===0){
      // Best reason: B went farther. The right reason is the one thing that is different; the other reasons are the same in A and B.
      const why=[['push','👉👉',B('a bigger push','더 센 밀기')],['floor','⬜',B('a smooth floor','매끈한 바닥')],['wheels','🛞',B('wheels on the box','상자에 단 바퀴')]];
      const k=pick(why)[0],base={push:'👉',floor:'🌿',wheels:''},thing=k==='wheels'?'📦':'🚗';
      const lane=(far)=>{const push=k==='push'&&far?'👉👉':'👉',floor=k==='floor'&&far?'⬜':(k==='floor'?'🌿':'⬜'),wheel=k==='wheels'&&far?'🛞':'';return `${far?'B':'A'} ${push}${thing}${wheel}${floor}${far?'➡️➡️➡️':'➡️'}`;};
      quiz(this,{ask:B('Why did B go farther?','B가 더 멀리 간 까닭은?'),askSay:B('B went farther than A. What is the best reason?','B가 A보다 더 멀리 갔어요. 가장 알맞은 까닭은?'),show:lanes(lane(false),lane(true)),
        opts:why.map(([key,e,n])=>({html:`<span class="emo">${e}</span>`,label:n,ok:key===k})),cls:'shapes',after:B('The best reason is the one thing that is different.','가장 좋은 까닭은 서로 다른 한 가지예요.')});return;
    }
    if(lvl('motion')===1&&rnd(4)===0){
      const t=pick([['🛒',B('cart','카트')],['🚲',B('bike','자전거')],['🛹',B('skateboard','스케이트보드')],['🚗',B('toy car','장난감 차')]]);
      quiz(this,{ask:B('What helps it roll?','무엇이 굴러가게 도와줄까요?'),show:`<div class="bigword"><span class="emo">${t[0]}</span></div>`,
        opts:[['wheels','🛞',B('round wheels','둥근 바퀴')],['flat','⬛',B('flat sides','평평한 면')],['corner','🔺',B('pointy corners','뾰족한 모서리')]].map(([key,e,n])=>({html:`<span class="emo">${e}</span>`,label:n,ok:key==='wheels'})),cls:'shapes',after:B('Round wheels roll. Flat sides slide.','둥근 바퀴는 굴러가요. 평평한 면은 미끄러져요.'),vocab:'wheels'});return;
    }
    if(lvl('motion')===2){
      const a=pick(MOTION),b=pick(MOTION.filter(x=>x!==a)),key=a[2]===b[2]?a[2]:'both';
      quiz(this,{ask:B('Which forces appear in these TWO actions?','두 동작에 나타난 힘은?'),show:`<div style="display:flex;gap:18px;justify-content:center">${[a,b].map(x=>`<span style="display:flex;flex-direction:column;align-items:center"><span style="font-size:clamp(28px,5dvh,40px);line-height:1.1">${x[0]}</span><small>${L(x[1])}</small></span>`).join('')}</div>`,opts:[['push','👉',B('Only push','밀기만')],['pull','🤏',B('Only pull','당기기만')],['both','👉🤏',B('Both','둘 다')]].map(([k,e,n])=>({html:`<span class="emo">${e}</span>`,label:n,ok:k===key})),cls:'shapes'});return;
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

// 63a: neutral descriptions do not name the force before the child chooses it.
(() => {
 // 70a: K pictures carry the meaning. Hand on the left; the arrow shows where the object goes
 // (away from the hand = push, toward the hand = pull). Labels are two words and never name the force.
 const descriptions=[
 ['🦶⚽➡️',B('kick ball','공 차기'),'push'],
 ['🙌🛒➡️',B('move cart','카트 옮기기'),'push'],
 ['✋🚪➡️',B('open door','문 열기'),'push'],
 ['🙌📦➡️',B('move box','상자 옮기기'),'push'],
 ['✋🧱➡️',B('slide block','블록 보내기'),'push'],
 ['✋🚗➡️',B('toy car','장난감 차'),'push'],
 ['🙌⬅️🛷',B('sled rope','썰매 줄'),'pull'],
 ['✋⬅️🗄️',B('open drawer','서랍 열기'),'pull'],
 ['🧲⬅️📎',B('magnet clip','자석 클립'),'pull'],
 ['🙌⬅️🪢',B('tug rope','줄다리기'),'pull'],
 ['✋⬅️🌱',B('pick weed','풀 뽑기'),'pull']];
 MOTION.splice(0,MOTION.length,...descriptions);
 const sky=GAMES.find(g=>g.id==='sky'),old=sky.play;
 sky.play=function(){if(lvl(this.id)===1)return old.call(this);
 const day=!!rnd(2),light=['☀️','🌞','🌅'],dark=['⭐','🌌','🌠'],yes=day?light:dark,no=day?dark:light,items=shuffle([{e:pick(yes),ok:true},{e:pick(yes),ok:true},{e:pick(no),ok:false}]),pairs=[[0,1],[0,2],[1,2]];
 quiz(this,{ask:day?B('Which TWO show daytime skies?','낮 하늘을 보여 주는 두 그림은?'):B('Which TWO show dark night skies?','어두운 밤하늘을 보여 주는 두 그림은?'),show:`<div style="font-size:clamp(24px,5dvh,36px)">${items.map((x,i)=>`${'ABC'[i]}: ${x.e}`).join('　')}</div>`,opts:pairs.map(([a,b])=>({html:`<span class="word">${'ABC'[a]} + ${'ABC'[b]}</span>`,ok:items[a].ok&&items[b].ok})),cls:'words'});
 };
})();
