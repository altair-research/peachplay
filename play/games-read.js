'use strict';
// Reading games (EL Education K / Georgia ELA foundations: alphabet knowledge, letter sounds, rhyme).
const AREA_READ = (u) => B(`Reading · ${u}`, `읽기 · ${u}`);
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// ---------- 1. Big and little letters ----------
registerGame({
  id: 'letters', subject: 'read', icon: '🔤', title: B('Big & Little Letters', '큰 글자 작은 글자'), sub: B('Match A with a', 'A와 a 짝 맞추기'),
  area: AREA_READ('Alphabet'),
  play() {
    const lv = lvl('letters'), pool = lv === 1 ? 'ABCDEFGHIJKLMNOP'.split('') : LETTERS;
    const t = pick(pool), up = rnd(2) === 0;                   // show uppercase -> pick lowercase, or reverse
    const f = (c) => (up ? c.toLowerCase() : c);
    // 11-20 (i-Ready K practice): level 2 wrong letters are look-alikes in the case the child picks (b/d/p/q, m/n/w/u, E/F, O/Q/C).
    // Uppercase I and lowercase l look the same in the app font, so I and L are never each other's wrong choice.
    const LOOK = { B: 'DPR', D: 'BPQ', P: 'BDQR', Q: 'OPDG', M: 'NWH', N: 'MHU', W: 'MVU', U: 'NVY', H: 'NKM', E: 'FCO', F: 'ETP', O: 'QCD', C: 'OGE', G: 'CQJ', I: 'JTH', J: 'IGY', L: 'TJK', T: 'FJL', V: 'UWY', Y: 'VJT', A: 'OEH', K: 'HXR', R: 'PBK', S: 'ZCG', Z: 'SNX', X: 'KYZ' };
    const okD = c => c !== t && !(c + t === 'IL' || c + t === 'LI');
    const ds = lv === 2 ? [...shuffle(LOOK[t].split('')), ...shuffle(pool)].filter((c, i, a) => a.indexOf(c) === i && okD(c)).slice(0, 2) : shuffle(pool.filter(okD)).slice(0, 2);
    if (rnd(3) === 0) {
      // Hear the letter name (not shown), find it. Big or little letters as choices.
      const big = rnd(2) === 0, g = c => (big ? c : c.toLowerCase());
      return quiz(this, {
        ask: big ? B('Listen. Find the BIG letter!', '듣고 그 큰 글자를 찾아요!') : B('Listen. Find the little letter!', '듣고 그 작은 글자를 찾아요!'), askExtra: { t, lang: 'en-US' },
        show: `<button class="say big-say" id="hear" aria-label="${T().listen}">🔊</button>`,
        opts: [t, ...ds].map(c => ({ html: `<span class="num">${g(c)}</span>`, ok: c === t })),
        after: B(`${t} and ${t.toLowerCase()}`, `${t}, ${t.toLowerCase()}`), vocab: t,
        onRender() { $('#hear').onclick = () => say(t, 'en-US'); if (S.lang === 'en') { say(t, 'en-US', true); const sp = $('#sp'), old = sp.onclick; sp.onclick = () => { old(); say(t, 'en-US', true); }; } }
      });
    }
    quiz(this, {
      ask: up ? B('Find the little letter that matches!', '짝이 되는 작은 글자를 찾아요!') : B('Find the BIG letter that matches!', '짝이 되는 큰 글자를 찾아요!'),
      show: `<div class="letter">${up ? t : t.toLowerCase()}</div>`,
      opts: [t, ...ds].map(c => ({ html: `<span class="num">${f(c)}</span>`, ok: c === t })),
      after: B(`${t} and ${t.toLowerCase()}`, `${t}, ${t.toLowerCase()}`), vocab: t,
      onRender() { say(t, 'en-US', true); }
    });
  }
});

// ---------- 2. Beginning sounds ----------
const WORDS = {
  A: ['🍎', 'apple', '사과'], B: ['🏀', 'ball', '공'], C: ['🐱', 'cat', '고양이'], D: ['🐶', 'dog', '강아지'], E: ['🥚', 'egg', '달걀'],
  F: ['🐟', 'fish', '물고기'], G: ['🐐', 'goat', '염소'], H: ['🎩', 'hat', '모자'], I: ['🍦', 'ice cream', '아이스크림'], J: ['🧥', 'jacket', '재킷'],
  K: ['🔑', 'key', '열쇠'], L: ['🦁', 'lion', '사자'], M: ['🌙', 'moon', '달'], N: ['🥜', 'nut', '견과'], O: ['🐙', 'octopus', '문어'],
  P: ['🐷', 'pig', '돼지'], Q: ['👑', 'queen', '여왕'], R: ['🐰', 'rabbit', '토끼'], S: ['☀️', 'sun', '해'], T: ['🐯', 'tiger', '호랑이'],
  U: ['☂️', 'umbrella', '우산'], V: ['🚐', 'van', '밴'], W: ['⌚', 'watch', '손목시계'], Y: ['🧶', 'yarn', '털실'], Z: ['🦓', 'zebra', '얼룩말']
};
// 11-20 (i-Ready K practice, parent: "many rounds without the same question"): several pictures per letter and three kinds of
// question. Level 1 (12 easy letters): see the letter -> find the picture, or hear the picture name -> find its letter.
// Level 2 (all letters): the same two kinds with look-alike / sound-alike letters as the wrong choices (b/d/p, m/n, f/v),
// plus "which picture starts with the same sound?" with no letter on screen (sound comparison only).
// Entry: [emoji, word, Korean, alt, blend] — alt = letters a child may hear in another name for the picture (puppy, bunny,
// crown), so a picture is never a wrong choice for a letter it could fairly start with (O3). blend = starts with fr, tr, sn...
// (left out of the same-sound kind).
const SOUND_ALT0 = { C: 'K', D: 'P', I: 'C', J: 'C', N: 'P', Q: 'CK', R: 'B', V: 'B', W: 'C', Y: 'B' };
const SOUND_MORE = {
  A: [['🐜', 'ant', '개미', 'B'], ['🐊', 'alligator', '악어', 'C'], ['🪓', 'ax', '도끼']],
  B: [['🐝', 'bee', '벌'], ['🚌', 'bus', '버스'], ['🍌', 'banana', '바나나'], ['🐻', 'bear', '곰'], ['🛏️', 'bed', '침대']],
  C: [['🎂', 'cake', '케이크'], ['🚗', 'car', '자동차'], ['🐄', 'cow', '소'], ['🌽', 'corn', '옥수수']],
  D: [['🦆', 'duck', '오리'], ['🚪', 'door', '문'], ['🥁', 'drum', '북', '', 1], ['🦖', 'dinosaur', '공룡', 'T']],
  E: [['🐘', 'elephant', '코끼리']],
  F: [['🐸', 'frog', '개구리', '', 1], ['🦊', 'fox', '여우'], ['🍴', 'fork', '포크'], ['🦶', 'foot', '발'], ['🔥', 'fire', '불', 'H']],
  G: [['👧', 'girl', '여자아이'], ['🎸', 'guitar', '기타'], ['🦍', 'gorilla', '고릴라', 'M'], ['🍇', 'grapes', '포도', '', 1]],
  H: [['🐴', 'horse', '말'], ['🏠', 'house', '집'], ['❤️', 'heart', '하트', 'L'], ['✋', 'hand', '손']],
  I: [['🏝️', 'island', '섬']],
  J: [['🧃', 'juice', '주스']],
  K: [['🪁', 'kite', '연'], ['🤴', 'king', '왕'], ['🦘', 'kangaroo', '캥거루'], ['🐨', 'koala', '코알라', 'B']],
  L: [['🍃', 'leaf', '잎'], ['🍋', 'lemon', '레몬'], ['🔒', 'lock', '자물쇠'], ['🐞', 'ladybug', '무당벌레', 'B']],
  M: [['🐭', 'mouse', '쥐', 'R'], ['🐵', 'monkey', '원숭이'], ['🥛', 'milk', '우유'], ['🍄', 'mushroom', '버섯'], ['🗺️', 'map', '지도']],
  N: [['👃', 'nose', '코'], ['9️⃣', 'nine', '아홉']],
  O: [['🦦', 'otter', '수달']],
  P: [['🍕', 'pizza', '피자'], ['🍐', 'pear', '배'], ['🖊️', 'pen', '펜'], ['🐼', 'panda', '판다', 'B'], ['🐧', 'penguin', '펭귄'], ['🍿', 'popcorn', '팝콘']],
  R: [['💍', 'ring', '반지'], ['🤖', 'robot', '로봇'], ['🚀', 'rocket', '로켓'], ['🌈', 'rainbow', '무지개']],
  S: [['🧦', 'sock', '양말'], ['🐍', 'snake', '뱀', '', 1], ['⭐', 'star', '별', '', 1], ['🦭', 'seal', '물개'], ['🧼', 'soap', '비누'], ['🥄', 'spoon', '숟가락', '', 1]],
  T: [['🐢', 'turtle', '거북'], ['🦷', 'tooth', '이'], ['⛺', 'tent', '텐트'], ['🍅', 'tomato', '토마토'], ['🌳', 'tree', '나무', '', 1]],
  V: [['🎻', 'violin', '바이올린'], ['🌋', 'volcano', '화산', 'M']],
  W: [['🐳', 'whale', '고래'], ['🪱', 'worm', '지렁이'], ['🕸️', 'web', '거미줄', 'S'], ['🐺', 'wolf', '늑대', 'D'], ['🍉', 'watermelon', '수박']],
  Y: [['🪀', 'yo-yo', '요요']]
};
const SOUND_BANK = {};
Object.keys(WORDS).forEach(k => { SOUND_BANK[k] = [[...WORDS[k], SOUND_ALT0[k] || ''], ...(SOUND_MORE[k] || [])].map(x => ({ k, e: x[0], w: x[1], ko: x[2], alt: x[3] || '', blend: !!x[4] })); });
// Wrong letters a K child really mixes up: flipped shapes (b/d/p, m/w, n/h) and close sounds (f/v, s/z, short vowels).
const SOUND_CONFUSE = { A: 'EOU', B: 'DP', C: 'SG', D: 'BPT', E: 'AI', F: 'VST', G: 'JD', H: 'NM', I: 'EL', J: 'GY', K: 'GT', L: 'IR', M: 'NW', N: 'MH', O: 'AU', P: 'BD', Q: 'OG', R: 'LW', S: 'ZF', T: 'DF', U: 'OA', V: 'FW', W: 'VMY', Y: 'WV', Z: 'S' };
const soundGroup = L => 'CKQ'.includes(L) ? 'CKQ' : L;   // c, k and q all start with /k/
const soundClash = (x, L) => soundGroup(L).includes(x.k) || [...soundGroup(L)].some(c => x.alt.includes(c));
registerGame({
  id: 'sounds', subject: 'read', icon: '🔊', title: B('First Sound', '첫 소리 찾기'), sub: B('Which starts with B?', '어느 것이 B로 시작할까?'),
  area: AREA_READ('Letter sounds'),
  play() {
    const lv = lvl('sounds'), keys = Object.keys(WORDS), pool = lv === 1 ? 'ABCDEFGHMPST'.split('') : keys;
    const ow = (x, ok) => ({ html: `<span class="emo">${x.e}</span><span class="word ow-say" lang="en">${x.w}</span>`, ok });   // 11-20 (서연): the word is spoken (🔉), not written — a written "tiger" let a child match the letter without listening
    // Wrong pictures: level 2 takes them from look-alike letters first.
    const wrongWords = (L, n, avoid, ban = '') => {
      const bad = c => soundGroup(L).includes(c) || [...soundGroup(c)].some(g => ban.includes(g));
      const letters = [...(lv === 2 ? shuffle(SOUND_CONFUSE[L].split('')) : []), ...shuffle(keys)].filter((c, i, a) => a.indexOf(c) === i && !bad(c));
      const out = [];
      for (const c of letters) {
        if (out.length >= n) break;
        const ok = SOUND_BANK[c].filter(y => !soundClash(y, L) && !avoid.includes(y.e) && !out.some(o => o.e === y.e));
        if (ok.length) out.push(pick(ok));
      }
      return out;
    };
    const hear = `<button class="say" id="hear" aria-label="${T().listen}">🔊</button>`;
    const kind = lv === 1 ? pick(['letter', 'picture']) : pick(['letter', 'picture', 'same']);
    if (kind === 'picture') {
      // Hear the picture name, find the letter it starts with (the picture's word is never written on screen).
      const L = pick(pool), x = pick(SOUND_BANK[L]);
      const cand = [...(lv === 2 ? shuffle(SOUND_CONFUSE[L].split('')) : []), ...shuffle(pool)].filter((c, i, a) => a.indexOf(c) === i && !soundGroup(L).includes(c) && ![...soundGroup(c)].some(g => x.alt.includes(g)));
      return quiz(this, {
        ask: B('Which letter does the picture start with?', '그림 이름은 어떤 글자로 시작할까요?'),
        askSay: B(`Listen: ${x.w}. Which letter does ${x.w} start with?`, '그림 이름을 들어요. 어떤 글자로 시작할까요?'), askExtra: { t: x.w, lang: 'en-US' },
        show: `<div class="bigword"><span class="emo">${x.e}</span> ${hear}</div>`,
        opts: [L, ...cand.slice(0, 2)].map(c => ({ html: `<span class="num">${c}${c.toLowerCase()}</span>`, ok: c === L })), cls: 'shapes', readGoal: 'opts',
        after: B(`${x.w} starts with ${L}.`, `${x.w}, ${L}로 시작해요.`), vocab: `${x.w} starts with ${L}.`,
        onRender() { $('#hear').onclick = () => say(x.w, 'en-US'); }
      });
    }
    if (kind === 'same') {
      // No letter on screen: hear the picture name, find the picture that starts with the same sound.
      const L = pick(keys.filter(c => !'AEIOU'.includes(c) && SOUND_BANK[c].filter(y => !y.blend).length >= 2));
      const [x, r] = shuffle(SOUND_BANK[L].filter(y => !y.blend));
      const ds = wrongWords(L, 2, [x.e, r.e], x.alt + r.alt);   // 🐶 may be "puppy": no p-picture as a wrong choice
      return quiz(this, {
        ask: B('Which picture starts with the same sound?', '첫소리가 같은 그림은 어느 것일까요?'),
        askSay: B(`Listen: ${x.w}. Which picture starts with the same sound as ${x.w}?`, '그림 이름을 들어요. 첫소리가 같은 그림은 어느 것일까요?'), askExtra: { t: x.w, lang: 'en-US' },
        show: `<div class="bigword"><span class="emo">${x.e}</span> ${hear}</div>`,
        opts: [ow(r, true), ...ds.map(d => ow(d, false))],
        after: B(`${x.w} and ${r.w} start with the same sound.`, `${x.w}, ${r.w} 첫소리가 같아요.`), vocab: `${x.w}, ${r.w}`,
        onRender() { $('#hear').onclick = () => say(x.w, 'en-US'); }
      });
    }
    const t = pick(pool), x = pick(SOUND_BANK[t]), ds = wrongWords(t, 2, [x.e]);
    quiz(this, {
      ask: B(`Which picture starts with the letter ${t}?`, `${t}로 시작하는 그림을 찾아요!`),
      show: `<div class="letter">${t}${t.toLowerCase()}</div>`,
      opts: [ow(x, true), ...ds.map(d => ow(d, false))],
      after: B(`${x.w} starts with ${t}.`, `${x.w}, ${t}로 시작해요.`), vocab: `${x.w} starts with ${t}.`
    });
  }
});

// ---------- 3. Rhymes ----------
// 11-20 (i-Ready K practice): 17 more rhyme families (rat, rock and 49 new picture words). No word is written inside another
// word of its family (rain/train, lock/clock), so the answer is never spelled inside the question word (Q1).
const RHYMES = [
  [['🐱', 'cat'], ['🎩', 'hat'], ['🦇', 'bat'], ['🐀', 'rat']], [['🐶', 'dog'], ['🐸', 'frog'], ['🌫️', 'fog']],
  [['🐝', 'bee'], ['🌳', 'tree'], ['🔑', 'key']], [['🌙', 'moon'], ['🥄', 'spoon']],
  [['🎂', 'cake'], ['🐍', 'snake']], [['🐭', 'mouse'], ['🏠', 'house']],
  [['⏰', 'clock'], ['🧦', 'sock'], ['🪨', 'rock']], [['🐟', 'fish'], ['🍽️', 'dish']], [['⭐', 'star'], ['🚗', 'car'], ['🎸', 'guitar']],
  [['🐐', 'goat'], ['⛵', 'boat'], ['🧥', 'coat']], [['🐻', 'bear'], ['🍐', 'pear'], ['🪑', 'chair']],
  [['🤴', 'king'], ['💍', 'ring']], [['🦴', 'bone'], ['📱', 'phone']], [['🔔', 'bell'], ['🐚', 'shell']],
  [['👃', 'nose'], ['🌹', 'rose']], [['🐔', 'hen'], ['🔟', 'ten'], ['🖊️', 'pen']], [['☀️', 'sun'], ['1️⃣', 'one'], ['🏃', 'run']],
  [['🚆', 'train'], ['✈️', 'plane']], [['🛏️', 'bed'], ['🛷', 'sled'], ['🍞', 'bread']], [['📦', 'box'], ['🦊', 'fox']],
  [['🪁', 'kite'], ['💡', 'light']], [['🏀', 'ball'], ['🧱', 'wall']], [['🐌', 'snail'], ['🐳', 'whale']],
  [['🦆', 'duck'], ['🚚', 'truck']], [['🥚', 'egg'], ['🦵', 'leg']], [['🥜', 'nut'], ['🛖', 'hut']]
];
registerGame({
  id: 'rhyme', subject: 'read', icon: '🎵', title: B('Rhyme Time', '운율 맞추기'), sub: B('cat, hat, bat', 'cat, hat, bat'),
  area: AREA_READ('Rhyming'),
  play() {
    if(lvl('rhyme')===2){
      const gi=rnd(RHYMES.length),good=shuffle(RHYMES[gi]).slice(0,2),other=pick(RHYMES.filter((_,i)=>i!==gi)),wrong=pick(RHYMES.filter((_,i)=>i!==gi));
      const pairs=[good,[good[0],other[0]],[good[1],wrong[1]]];
      quiz(this,{ask:B('Which pair has the same ending sound?','끝소리가 같은 낱말 짝은?'),askExtra:{t:pairs.map(p=>p.map(x=>x[1]).join(', ')).join('. '),lang:'en-US'},opts:pairs.map((p,i)=>({html:`<span class="emo" style="font-size:clamp(26px,5dvh,40px)" aria-hidden="true">${p.map(x=>x[0]).join(' + ')}</span><span class="word ow-say" lang="en">${p.map(x=>x[1]).join(', ')}</span>`,ok:i===0})),cls:'words'});return;
    }
    const gi = rnd(RHYMES.length), g = shuffle(RHYMES[gi]), t = g[0], r = g[1];
    const pool = RHYMES.flatMap((x, i) => i === gi ? [] : x);
    const ds = shuffle(pool).slice(0, lvl('rhyme') === 2 ? 3 : 2);
    const o = (w, ok) => ({ html: `<span class="emo">${w[0]}</span><span class="word ow-say" lang="en">${w[1]}</span>`, ok });   // 11-20 (서연): spoken, not written — sock/clock matched by spelling
    quiz(this, {
      ask: B(`Which word rhymes with ${t[1].toUpperCase()}?`, `${t[1]}처럼 끝나는 단어는?`),
      askSay: B(`Which word rhymes with ${t[1]}?`, `${t[1]}처럼 소리가 끝나는 단어는?`),
      show: `<div class="bigword"><span class="emo">${t[0]}</span> ${t[1]}</div>`,
      opts: [o(r, true), ...ds.map(d => o(d, false))],
      after: B(`${t[1]} and ${r[1]} rhyme!`, `${t[1]}, ${r[1]} 소리가 비슷해요!`), vocab: `${t[1]} and ${r[1]} rhyme!`
    });
  }
});
