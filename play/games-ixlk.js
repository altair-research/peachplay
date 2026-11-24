'use strict';
// Kindergarten skill types added after the IXL K comparison (plans/2026-11-22-ixl-k-plan.html, stage 2, 2026-11-23).
// Only the skill TYPES were used; every picture, sentence and choice here is our own.
//  positions - position words (on, under, next to, in, behind, in front of, between, above, below)
//  sortbox   - which box does it go in? / which one also belongs in this box?
//  listenpic - hear a sentence, pick the one picture that fits (each wrong picture differs in one place)
// plus new question shapes in older games: sounds (a pair with the same first sound), pattern (a gap inside),
// quantity (hear a number; number words), feelings (face -> feeling word).
(() => {
  const emo = (e, x, y, s) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle">${e}</text>`;
  const svg = (body, cls = '') => `<svg viewBox="0 0 120 100" class="ix-svg ${cls}" aria-hidden="true">${body}</svg>`;

  // ---- 1. positions ----
  const WHO = [['🐱', B('cat', '고양이')], ['🐶', B('dog', '강아지')], ['🐰', B('bunny', '토끼')], ['🐻', B('bear', '곰')], ['🐸', B('frog', '개구리')], ['🐭', B('mouse', '쥐')], ['🐷', B('pig', '돼지')], ['🐔', B('chicken', '닭')], ['⚽', B('ball', '공')], ['🐵', B('monkey', '원숭이')]];
  const FLY = [['🐦', B('bird', '새')], ['🦋', B('butterfly', '나비')], ['🎈', B('balloon', '풍선')], ['🐝', B('bee', '벌')], ['🪁', B('kite', '연')], ['✈️', B('plane', '비행기')]];
  const table = '<rect x="30" y="46" width="60" height="8" rx="2" fill="#b9772f"/><rect x="34" y="54" width="6" height="38" fill="#9a5f22"/><rect x="80" y="54" width="6" height="38" fill="#9a5f22"/>';
  const boxBack = '<path d="M34 54h52l-7-11H41z" fill="#8a5a24"/>', boxFront = '<rect x="34" y="54" width="52" height="38" rx="2" fill="#d9a05b" stroke="#8a5a24" stroke-width="2"/>', boxLid = '<rect x="31" y="46" width="58" height="9" rx="2" fill="#c98b43" stroke="#8a5a24" stroke-width="2"/>';
  const tree = x => `<rect x="${x - 9}" y="36" width="18" height="56" fill="#8d5a2b"/><circle cx="${x}" cy="25" r="23" fill="#4f9d4a"/>`;
  const cloud = '<path d="M36 62h48a9 9 0 0 0 2-18a11 11 0 0 0-17-6a13 13 0 0 0-23 3a10 10 0 0 0-11 9a7 7 0 0 0 1 12z" fill="#cfe3f5" stroke="#8db4d8" stroke-width="2"/>';
  const ground = '<rect x="0" y="92" width="120" height="4" rx="2" fill="#d8c3a5"/>';
  const SETS = [
    { lv: 1, ref: B('table', '탁자'), who: WHO, pos: { on: e => ground + table + emo(e, 60, 43, 30), under: e => ground + table + emo(e, 60, 89, 27), next: (e, m) => ground + table + emo(e, m ? 15 : 105, 89, 27) } },
    { lv: 1, ref: B('box', '상자'), who: WHO, pos: { in: e => ground + boxBack + emo(e, 60, 62, 36) + boxFront, on: e => ground + boxFront + boxLid + emo(e, 60, 43, 30), next: (e, m) => ground + boxFront + boxLid + emo(e, m ? 16 : 104, 89, 27) } },
    { lv: 1, ref: B('cloud', '구름'), who: FLY, pos: { above: e => cloud + emo(e, 60, 26, 24), below: e => cloud + emo(e, 60, 92, 26), next: (e, m) => cloud + emo(e, m ? 16 : 104, 59, 26) } },
    { lv: 2, ref: B('tree', '나무'), who: WHO, pos: { behind: (e, m) => ground + emo(e, m ? 46 : 74, 89, 34) + tree(60), front: e => ground + tree(60) + emo(e, 60, 92, 34), next: (e, m) => ground + tree(60) + emo(e, m ? 16 : 104, 90, 26) } },
    { lv: 2, ref: B('tree', '나무'), two: 1, who: WHO, pos: { between: e => ground + tree(24) + tree(96) + emo(e, 60, 90, 28), front: (e, m) => ground + tree(24) + tree(96) + emo(e, m ? 24 : 96, 92, 32), behind: (e, m) => ground + emo(e, m ? 12 : 108, 89, 30) + tree(24) + tree(96) } }
  ];
  const PW = { on: ['on', '위에'], under: ['under', '아래에'], next: ['next to', '옆에'], in: ['in', '안에'], above: ['above', '위에'], below: ['below', '아래에'], behind: ['behind', '뒤에'], front: ['in front of', '앞에'], between: ['between', '사이에'] };
  const refEn = (s, p) => p === 'between' ? 'the two trees' : (s.two ? 'a ' : 'the ') + s.ref.en;
  const refKo = (s, p) => p === 'between' ? '두 나무 사이에' : `${s.ref.ko} ${PW[p][1]}`;
  const hasEnd = w => (w.charCodeAt(w.length - 1) - 0xac00) % 28 > 0;
  const iga = w => w + (hasEnd(w) ? '이' : '가'), eul = w => w + (hasEnd(w) ? '을' : '를');
  // Small sign for the place word (a dot and a square), so a child who cannot read or hear still sees which place is meant.
  const dot = (x, y) => `<circle cx="${x}" cy="${y}" r="8" fill="#e4572e"/>`, sq = '<rect x="30" y="26" width="40" height="32" rx="4" fill="#fff" stroke="#1d3557" stroke-width="4"/>';
  const SIGN = { on: sq + dot(50, 16), above: sq + dot(50, 9), under: sq + dot(50, 69), below: sq + dot(50, 71), next: sq + dot(84, 46), in: sq + dot(50, 42), behind: '<circle cx="68" cy="34" r="17" fill="#e4572e"/>' + sq + '<circle cx="68" cy="34" r="17" fill="none" stroke="#e4572e" stroke-width="2" stroke-dasharray="4 4"/>', front: sq + '<circle cx="50" cy="46" r="17" fill="#e4572e" stroke="#fff" stroke-width="3"/>', between: '<rect x="6" y="26" width="26" height="32" rx="4" fill="#fff" stroke="#1d3557" stroke-width="4"/><rect x="68" y="26" width="26" height="32" rx="4" fill="#fff" stroke="#1d3557" stroke-width="4"/>' + dot(50, 42) };
  // The side in the sign follows the side in the picture.
  const sign = (p, m) => `<svg viewBox="0 0 100 80" class="ix-sign" aria-hidden="true">${m && (p === 'next' || p === 'behind') ? `<g transform="translate(100 0) scale(-1 1)">${SIGN[p]}</g>` : SIGN[p]}</svg>`;
  registerGame({
    id: 'positions', grade: 'K', subject: 'math', icon: '📍', title: B('Where Is It?', '어디에 있을까?'), sub: B('on, under, next to', '위, 아래, 옆'),
    area: AREA_MATH('Position words'),
    play() {
      const lv = lvl('positions') > 1 ? 2 : 1, s = pick(SETS.filter(x => x.lv === lv)), [e, n] = pick(s.who), keys = Object.keys(s.pos), p = pick(keys), m = rnd(2), reverse = rnd(2) === 1;
      const key = `positions:${lv}:${reverse}:${s.ref.en}${s.two || ''}:${e}:${p}`;
      const after = B(`The ${n.en} is ${PW[p][0]} ${refEn(s, p)}.`, `${iga(n.ko)} ${refKo(s, p)} 있어요.`);
      if (reverse) return quiz(this, { itemKey: key, ask: B(`Where is the ${n.en}?`, `${iga(n.ko)} 어디에 있나요?`), show: svg(s.pos[p](e, m), 'big'), quietShow: true,
        opts: keys.map(k => ({ html: `${sign(k, m)}<span class="word">${L(B(PW[k][0], PW[k][1]))}</span>`, ok: k === p })), cls: 'shapes ix-pos', after, vocab: after.en });
      return quiz(this, { itemKey: key, ask: B(`Find the ${n.en} ${PW[p][0]} ${refEn(s, p)}.`, `${refKo(s, p)} 있는 ${eul(n.ko)} 찾아요.`),
        show: `<div class="ix-cue"><span class="emo">${e}</span>${sign(p, m)}</div>`, quietShow: true,
        opts: keys.map(k => ({ html: svg(s.pos[k](e, m)), ok: k === p })), cls: 'shapes ix-scenes', after, vocab: after.en });
    }
  });

  // ---- 2. sortbox ----
  const CAT = [
    [B('animals', '동물'), '🐶 🐱 🐰 🐻 🐷 🐮 🐴 🐘'], [B('food', '음식'), '🍎 🍞 🍕 🧀 🥕 🍌 🍇 🍪'], [B('clothes', '옷'), '👕 👖 🧦 🧥 👗 🧤 🧣'],
    [B('things to ride', '탈것'), '🚗 🚌 🚂 ✈️ 🚁 🚕 ⛵ 🚚'], [B('school tools', '학용품'), '✏️ 🖍️ ✂️ 📏 📓 🖊️'], [B('toys', '장난감'), '🧸 🪀 🎲 🧩 🪆'],
    [B('plants', '식물'), '🌳 🌻 🌷 🌵 🍀 🌲'], [B('music makers', '악기'), '🎸 🥁 🎹 🎺 🎻']
  ];
  // Level 2: the three boxes are near each other, so the child has to think about the rule.
  const NEAR = [
    [[B('in the water', '물속'), '🐟 🐙 🦈 🐬 🦑 🐳'], [B('in the sky', '하늘'), '🦅 🦋 🐝 🦉 🦇 🦜'], [B('on the land', '땅 위'), '🐴 🐮 🐘 🦁 🐑 🦒']],
    [[B('fruit', '과일'), '🍎 🍌 🍇 🍓 🍊 🍉'], [B('vegetables', '채소'), '🥕 🥦 🌽 🥬 🧅 🥔'], [B('cookies and candy', '과자·사탕'), '🍪 🍩 🍰 🍭 🍫 🧁']],
    [[B('on the road', '길'), '🚗 🚌 🚚 🚕 🚲 🛵'], [B('on the water', '물 위'), '⛵ 🚢 🛶 🚤 ⛴️'], [B('in the sky', '하늘'), '✈️ 🚁 🚀 🛩️']],
    [[B('cold days', '추운 날'), '🧤 🧣 🧥 ⛄ 🛷'], [B('hot days', '더운 날'), '🩳 🕶️ 🩴 🍦'], [B('rainy days', '비 오는 날'), '☂️ 🌧️ ☔']],
    [[B('to eat with', '먹을 때'), '🥄 🍴 🥣 🥢 🍽️'], [B('to fix with', '고칠 때'), '🔨 🪛 🔧 🪚 🪜'], [B('to wash with', '씻을 때'), '🧼 🪥 🧽 🛁 🚿']],
    [[B('for feet', '발'), '👟 🧦 🥾 👠 🩴'], [B('for the head', '머리'), '🧢 👒 🎩 👑 ⛑️'], [B('for hands', '손'), '🧤 💍 🥊']]
  ];
  const things = t => t.split(' ');
  const box = (name, two) => `<span class="ix-box"><span class="ix-in" aria-hidden="true">${two.join('')}</span><span class="word">${L(name)}</span></span>`;
  registerGame({
    id: 'sortbox', grade: 'K', subject: 'sci', icon: '🗃️', title: B('Sort the Boxes', '분류 상자'), sub: B('Which box does it go in?', '어느 상자에 넣을까?'),
    area: B('Science · Sorting and grouping', '과학 · 나누고 모으기'),
    play() {
      const lv = lvl('sortbox') > 1 ? 2 : 1, boxes = shuffle(lv === 1 ? CAT : pick(NEAR)).slice(0, 3), [name, list] = boxes[0], all = shuffle(things(list)), t = all[0];
      if (lv === 2 && all.length > 3 && rnd(2)) return quiz(this, { itemKey: 'sortbox:2:more:' + t + name.en, ask: B('Which one also goes in this box?', '이 상자에 또 들어갈 것은?'),
        show: `<div class="ix-bigbox">${all.slice(1, 4).map(x => `<span class="emo">${x}</span>`).join('')}</div>`, quietShow: true,
        opts: [t, ...boxes.slice(1).map(b => pick(things(b[1])))].map((x, i) => ({ html: `<span class="emo">${x}</span>`, ok: i === 0 })), cls: 'shapes', after: B(`This box: ${name.en}.`, `이 상자: ${name.ko}.`), vocab: name.en });
      return quiz(this, { itemKey: `sortbox:${lv}:${t}:${name.en}`, ask: B('Which box does it go in?', '어느 상자에 넣을까요?'), show: `<div class="ix-cue"><span class="emo">${t}</span><span aria-hidden="true">➜ ?</span></div>`, quietShow: true,
        opts: boxes.map((b, i) => ({ html: box(b[0], i === 0 ? all.slice(1, 3) : shuffle(things(b[1])).slice(0, 2)), ok: i === 0 })), cls: 'shapes ix-boxes', after: B(`It goes with: ${name.en}.`, `${name.ko} 상자에 들어가요.`), vocab: name.en });
    }
  });

  // ---- 3. listenpic ----
  const COL = { red: ['#e63946', '빨간'], blue: ['#2f7fd1', '파란'], yellow: ['#f4c430', '노란'], green: ['#3a9d5d', '초록'] };
  const A = [['🐱', 'cat', '고양이'], ['🐶', 'dog', '강아지'], ['🐻', 'bear', '곰'], ['🐰', 'bunny', '토끼'], ['🐷', 'pig', '돼지'], ['🐸', 'frog', '개구리']];
  const THING = {
    ball: ['ball', '공', c => `<circle cx="94" cy="74" r="18" fill="${c}" stroke="#0005" stroke-width="2"/><path d="M78 68q16 10 32 0" fill="none" stroke="#fffb" stroke-width="3"/>`],
    hat: ['hat', '모자', c => `<path d="M70 82h48v8H70zM80 56h28v26H80z" fill="${c}" stroke="#0005" stroke-width="2"/>`],
    kite: ['kite', '연', c => `<path d="M94 34l19 22-19 24-19-24z" fill="${c}" stroke="#0005" stroke-width="2"/><path d="M94 80q-10 7 0 15" fill="none" stroke="#555" stroke-width="2"/>`],
    cup: ['cup', '컵', c => `<path d="M76 56h30l-4 36H80z" fill="${c}" stroke="#0005" stroke-width="2"/><path d="M105 63q13 5 -2 19" fill="none" stroke="${c}" stroke-width="5"/>`]
  };
  const draw = d => svg(emo(d.a[0], 38, d.big ? 88 : 90, d.big ? 60 : 30) + THING[d.t][2](COL[d.c][0]));
  const sent = d => `The ${d.sized ? (d.big ? 'big ' : 'little ') : ''}${d.a[1]} has a ${d.c} ${THING[d.t][0]}.`;
  const sentKo = d => `${d.sized ? (d.big ? '큰 ' : '작은 ') : ''}${d.a[2]}에게 ${COL[d.c][1]} ${iga(THING[d.t][1])} 있어요.`;
  registerGame({
    id: 'listenpic', grade: 'K', subject: 'read', icon: '🎧', title: B('Listen and Find', '듣고 그림 찾기'), sub: B('Which picture fits?', '문장에 맞는 그림은?'),
    area: AREA_READ('Listening'),
    play() {
      const lv = lvl('listenpic') > 1 ? 2 : 1, d = { a: pick(A), t: pick(Object.keys(THING)), c: pick(Object.keys(COL)), big: lv === 2 ? rnd(2) === 1 : true, sized: lv === 2 };
      const alt = { a: () => ({ ...d, a: pick(A.filter(x => x !== d.a)) }), t: () => ({ ...d, t: pick(Object.keys(THING).filter(x => x !== d.t)) }), c: () => ({ ...d, c: pick(Object.keys(COL).filter(x => x !== d.c)) }), z: () => ({ ...d, big: !d.big }) };
      // Level 1: two wrong pictures, each different in one place (one is always the color). Level 2: three (size, color, and the thing or the animal).
      const wrong = (lv === 1 ? ['c', pick(['a', 't'])] : ['z', 'c', pick(['a', 't'])]).map(k => alt[k]()), en = sent(d);
      const askB = B('Listen. Which picture fits?', '영어 문장을 들어요. 맞는 그림은?');
      return quiz(this, { itemKey: `listenpic:${lv}:${en}`, ask: askB, askExtra: { t: en, lang: 'en-US' }, quietShow: true,
        show: `<div class="ix-sent"><button class="say" id="ixHear" aria-label="${T().listen}">🔊</button><span lang="en">${en}</span></div>`, opts: [d, ...wrong].map((x, i) => ({ html: draw(x), ok: i === 0 })), cls: lv === 2 ? 'four ix-scenes' : 'shapes ix-scenes', after: B(en, `${en} ${sentKo(d)}`), vocab: en,
        onRender() { $('#ixHear').onclick = () => say(en, 'en-US'); if (S.lang !== 'ko') say(en, 'en-US', true); } });
    }
  });

  // ---- 3b. soundteam (stage 3, 2026-11-23): a kindergarten challenge with grade 1 sounds. Level 1: sh, ch, th.
  // Level 2: two letters that start a word (st, fr, ...) and the long vowel heard in a word. Pictures are spoken, never written.
  const TEAM = { sh: '🚢ship 🐚shell 👟shoe 🐑sheep 🦈shark 👕shirt', ch: '🧀cheese 🪑chair 🐥chick 🍒cherry ⛓️chain 🍫chocolate', th: '👍thumb 3️⃣three 🛁bath 🦷tooth 👄mouth' };
  const TEAM_END = { sh: '🐟fish', th: '🛁bath 🦷tooth 👄mouth', ch: '⌚watch 🥪sandwich' };
  const BLEND = { st: '⭐star 🛑stop', sp: '🥄spoon 🕷️spider', sn: '🐍snake 🐌snail ⛄snowman', sl: '🛷sled', fr: '🐸frog 🍟fries', fl: '🚩flag 🌸flower', tr: '🌳tree 🚂train 🚚truck', dr: '🥁drum 🐉dragon 👗dress', cl: '🕰️clock ☁️cloud 🤡clown', cr: '🦀crab 👑crown 🖍️crayon', br: '🍞bread 🧹broom 🥦broccoli', gr: '🍇grapes', pl: '✈️plane', bl: '🫐blueberries' };
  const LONGV = { a: '🎂cake 🌧️rain 🐳whale 🚂train', e: '🐝bee 🌳tree 🔑key 🐑sheep', i: '🪁kite 🚲bike 🧊ice 5️⃣five', o: '🦴bone 🌹rose 👃nose ⛵boat 🐐goat' };
  const parse = o => Object.entries(o).flatMap(([k, t]) => t.split(' ').map(x => { const m = x.match(/^(.*?)([a-z]+)$/u); return { k, e: m[1], w: m[2] }; }));
  const SHARE = k => Object.keys(BLEND).filter(x => x !== k && (x[0] === k[0] || x[1] === k[1]));
  registerGame({
    id: 'soundteam', grade: 'K', subject: 'read', icon: '👯', title: B('Letter Teams', '짝꿍 글자'), sub: B('sh, ch, th (challenge)', 'sh, ch, th (도전)'),
    area: B('Reading · Phonics (grade 1 challenge)', '읽기 · 파닉스 (1학년 도전)'),
    play() {
      const lv = lvl('soundteam') > 1 ? 2 : 1, kind = lv === 1 ? pick(['start', 'start', 'pic', 'end']) : pick(['blend', 'blend', 'long']);
      const x = pick(parse(kind === 'end' ? TEAM_END : kind === 'blend' ? BLEND : kind === 'long' ? LONGV : TEAM).filter(v => kind === 'end' || kind === 'blend' || kind === 'long' || (!['bath', 'tooth', 'mouth'].includes(v.w) && !(kind === 'pic' && ['shoe', 'chick'].includes(v.w)))));
      const hear = { askExtra: { t: x.w, lang: 'en-US' }, quietShow: true, show: `<div class="bigword"><span class="emo">${x.e}</span> <button class="say" id="ixHear" aria-label="${T().listen}">🔊</button></div>`, readGoal: 'opts', onRender() { $('#ixHear').onclick = () => say(x.w, 'en-US'); if (S.lang !== 'ko') say(x.w, 'en-US', true); } };
      const letters = ks => ks.map((k, i) => ({ html: `<span class="num" lang="en">${k}</span>`, ok: i === 0 })), key = `soundteam:${kind}:${x.w}`;
      if (kind === 'pic') {
        const ds = shuffle(Object.keys(TEAM).filter(k => k !== x.k)).map(k => pick(parse(TEAM).filter(v => v.k === k && !['bath', 'tooth', 'mouth', 'shoe', 'chick'].includes(v.w))));
        return quiz(this, { itemKey: key, ask: B(`Which word starts with ${x.k}?`, `${x.k} 소리로 시작하는 그림은?`), quietShow: true, show: `<div class="letter">${x.k}</div>`,
          opts: [x, ...ds].map((v, i) => ({ html: `<span class="emo">${v.e}</span><span class="word ow-say" lang="en">${v.w}</span>`, ok: i === 0 })), cls: 'shapes', after: B(`${x.w} starts with ${x.k}.`, `${x.w}, ${x.k}로 시작해요.`), vocab: x.w });
      }
      const ask = kind === 'end' ? B('Which letters end this word?', '이 낱말은 어떤 글자로 끝날까요?') : kind === 'long' ? B('Which letter says its name in this word?', '이 낱말에서 이름 그대로 소리 나는 글자는?') : B('Which letters start this word?', '이 낱말은 어떤 글자로 시작할까요?');
      const wrong = kind === 'blend' ? shuffle(SHARE(x.k)) : shuffle(Object.keys(kind === 'long' ? LONGV : TEAM).filter(k => k !== x.k));
      return quiz(this, { itemKey: key, ask, ...hear, opts: letters([x.k, ...wrong.slice(0, 2)]), cls: 'shapes', after: B(`${x.w}: ${x.k}`, `${x.w}: ${x.k}`), vocab: x.w });
    }
  });

  // ---- new shapes in older games ----
  const wrap = (id, chance, make) => { const g = GAMES.find(x => x.id === id), old = g.play; g.play = function () { return rnd(chance) === 0 ? make.call(this, lvl(id) > 1 ? 2 : 1) : old.call(this); }; };
  // sounds: which two start with the same sound? (three pairs; words are spoken, not written)
  wrap('sounds', 5, function (lv) {
    const bank = k => shuffle(SOUND_BANK[k].filter(x => !x.alt && !x.blend)), ks = shuffle(Object.keys(SOUND_BANK).filter(k => !'AEIOUCKQG'.includes(k) && bank(k).length > 1));
    const k0 = ks[0], mine = bank(k0), good = mine.slice(0, 2), close = (lv === 2 && ks.find(k => k !== k0 && (SOUND_CONFUSE[k0] || '').includes(k))) || ks[1], rest = ks.filter(k => k !== k0 && k !== close);
    const pairs = [good, [mine[2] || mine[0], bank(close)[0]], [bank(rest[0])[0], bank(rest[1])[0]]];
    return quiz(this, { itemKey: 'sounds:pair:' + good.map(x => x.w).sort().join(), ask: B('Which two start with the same sound?', '첫소리가 같은 두 그림은?'), askExtra: { t: pairs.map(p => p.map(x => x.w).join(', ')).join('. '), lang: 'en-US' },
      opts: pairs.map((p, i) => ({ html: `<span class="ix-pair"><span class="emo">${p[0].e}</span><span class="emo">${p[1].e}</span></span><span class="word ow-say" lang="en">${p[0].w}, ${p[1].w}</span>`, ok: i === 0 })), cls: 'groups',
      after: B(`${good[0].w} and ${good[1].w} start with the same sound.`, `${good[0].w}, ${good[1].w} 첫소리가 같아요.`), vocab: `${good[0].w}, ${good[1].w}` });
  });
  // pattern: a gap inside the row, not at its end
  wrap('pattern', 4, function (lv) {
    const unit = pick(lv === 1 ? ['AB', 'AAB', 'ABB'] : ['ABC', 'AABB', 'ABCC', 'ABBC']), pal = shuffle(['🔴', '🔵', '🟢', '🟡', '🐶', '🐱', '🍎', '🍌', '⭐', '🌙', '🦋', '🌸']), sym = {};
    [...new Set(unit)].forEach((c, i) => { sym[c] = pal[i]; });
    const total = unit.length < 3 ? 6 : unit.length === 3 ? 7 : 8, seq = Array.from({ length: total }, (_, i) => sym[unit[i % unit.length]]), at = unit.length + rnd(total - unit.length - 1), ans = seq[at];
    const ch = [ans, ...shuffle(Object.values(sym).filter(x => x !== ans)).slice(0, 2)];
    while (ch.length < 3) ch.push(pal.find(x => !Object.values(sym).includes(x) && !ch.includes(x)));
    return quiz(this, { ask: B('What goes in the empty spot?', '빈칸에 들어갈 것은?'), show: `<div class="train pat one">${seq.map((s, i) => `<div class="pc${i === at ? ' gap' : ''}">${i === at ? '?' : s}</div>`).join('')}</div>`,
      opts: ch.map((c, i) => ({ html: `<span class="emo">${c}</span>`, ok: i === 0 })), cls: 'shapes', onCorrect() { const g = $('.pc.gap'); if (g) { g.classList.remove('gap'); g.textContent = ans; } } });
  });
  // quantity: hear a number and find it (level 1: 1-10, level 2: 11-20), or count and find the number word
  const NUMW = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  wrap('quantity', 4, function (lv) {
    if (rnd(2)) {
      const n = lv === 1 ? 1 + rnd(10) : 11 + rnd(10);
      return quiz(this, { itemKey: `quantity:hear:${n}`, ask: B('Listen. Which number do you hear?', '영어로 들은 수는 어느 것일까요?'), askExtra: { t: NUMW[n], lang: 'en-US' }, quietShow: true,
        show: `<button class="say ix-hear" id="ixHear" aria-label="${T().listen}">🔊</button>`, opts: numOpts(n, lv === 1 ? 1 : 11, lv === 1 ? 10 : 20), after: B(`${NUMW[n]}: ${n}`, `${NUMW[n]}: ${n}`), vocab: NUMW[n],
        onRender() { $('#ixHear').onclick = () => say(NUMW[n], 'en-US'); if (S.lang !== 'ko') say(NUMW[n], 'en-US', true); } });
    }
    const n = lv === 1 ? 1 + rnd(5) : 4 + rnd(7), hi = lv === 1 ? 6 : 10, near = shuffle([n - 1, n + 1, n - 2, n + 2].filter(v => v >= 1 && v <= hi)).slice(0, 2), e = pick(['🍎', '⭐', '🐞', '🐟', '🌸']);
    return quiz(this, { itemKey: `quantity:word:${n}:${e}`, ask: B('Count. Which word is the number?', '세어 봐요. 수를 나타내는 영어 낱말은?'), show: emojiRow(n, e, 'sm'), quietShow: true,
      opts: [n, ...near].map((v, i) => ({ html: `<span class="word" lang="en">${NUMW[v]}</span>`, ok: i === 0 })), cls: 'words', after: B(`${n}: ${NUMW[n]}`, `${n}: ${NUMW[n]}`), vocab: NUMW[n] });
  });
  // feelings: see the face, pick the feeling word (🔉 reads the words)
  wrap('feelings', 4, function () {
    const keys = shuffle(Object.keys(FEEL)), k = keys[0], glad = ['happy', 'excited'], bad = keys.filter(x => x !== k && !(glad.includes(x) && glad.includes(k))).slice(0, 2);
    return quiz(this, { itemKey: 'feelings:word:' + k, ask: B('Which word fits this face?', '이 얼굴에 맞는 기분 낱말은?'), show: `<div class="bigword"><span class="emo">${FEEL[k][0]}</span></div>`, quietShow: true,
      opts: [k, ...bad].map((x, i) => ({ html: `<span class="word">${L(FEEL[x][1])}</span>`, ok: i === 0 })), cls: 'words', after: B(`This face feels ${FEEL[k][1].en}.`, FEEL[k][1].ko), vocab: FEEL[k][1].en });
  });
})();
