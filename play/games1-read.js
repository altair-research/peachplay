'use strict';
// Grade 1 reading, writing and language (Georgia's K-12 ELA Standards, 2023, K-2 band): phonological awareness, phonics, word study, texts, grammar.
// All words, stories and sentences are original. Hints for the standards: PA.4-6, P.1-3, F.1, T (stories/informational), L.GC.1 (grammar), L.V (word meaning).
const AREA1R = (u) => B(`Grade 1 Reading · ${u}`, `1학년 읽기 · ${u}`);
const AREA1W = (u) => B(`Grade 1 Writing · ${u}`, `1학년 쓰기 · ${u}`);
const G1R = (g) => registerGame(Object.assign({ grade: '1', subject: 'read' }, g, { area: AREA1R(g.u) }));
const G1W = (g) => registerGame(Object.assign({ grade: '1', subject: 'write' }, g, { area: AREA1W(g.u) }));
const wordOpts = (right, wrongs, cls = 'word') => [right, ...wrongs].map(w => ({ html: `<span class="${cls}">${w}</span>`, ok: w === right }));
const picOpt = (e, label, ok) => ({ html: `<span class="emo">${e}</span>`, label, ok });

// ---------- 1. Syllable play ----------
const COMPOUNDS = [['sunset', 'sun', 'set', '🌅'], ['cupcake', 'cup', 'cake', '🧁'], ['rainbow', 'rain', 'bow', '🌈'], ['football', 'foot', 'ball', '🏈'], ['starfish', 'star', 'fish', '⭐'], ['pancake', 'pan', 'cake', '🥞'], ['sunflower', 'sun', 'flower', '🌻'], ['bedtime', 'bed', 'time', '🛏️'], ['baseball', 'base', 'ball', '⚾'], ['goldfish', 'gold', 'fish', '🐠'], ['doghouse', 'dog', 'house', '🐕'], ['playtime', 'play', 'time', '🧸'], ['snowman', 'snow', 'man', '⛄'], ['popcorn', 'pop', 'corn', '🍿'], ['raincoat', 'rain', 'coat', '🧥']];
G1R({
  id: 'sylplay', icon: '🥁', title: B('Syllable Play', '음절 놀이'), sub: B('Take apart and put together words', '낱말을 나누고 합쳐요'), u: 'Syllables',
  play() {
    const kind = pick(['delete', 'delete', 'add', 'swap']), c = pick(COMPOUNDS), [w, a, b, e] = c;
    if (kind === 'delete') {
      const first = rnd(2) === 0, ans = first ? b : a, drop = first ? a : b, ds = shuffle([...new Set(COMPOUNDS.flatMap(x => [x[1], x[2]]).filter(p => p !== ans && p !== drop && p !== a && p !== b))]).slice(0, 2);
      quiz(this, { ask: B(`Say "${w}". Now take away "${drop}". What is left?`, `"${w}"를 말해 봐요. 여기서 "${drop}"를 빼면 무엇이 남을까요?`), show: `<div class="bigword">${e} ${a}·${b}</div>`, opts: wordOpts(ans, ds), cls: 'words', after: B(`${w} without ${drop} is ${ans}.`, `${w}에서 ${drop}를 빼면 ${ans}.`), vocab: ans });
    } else if (kind === 'add') {
      const rev = b + a, ds = [rev, a + a].filter(x => x !== w);
      quiz(this, { ask: B(`Put the word parts together: ${a} + ${b}`, `낱말 조각을 합쳐요: ${a} + ${b}`), show: `<div class="bigword">${a} + ${b} = ?</div>`, opts: wordOpts(w, ds), cls: 'words', after: B(`${a} and ${b} make ${w}!`, `${a}와 ${b}를 합치면 ${w}!`), vocab: w });
    } else {
      const groups = { cake: ['cup', 'pan'], ball: ['foot', 'base', 'basket'], fish: ['star', 'gold', 'jelly'], house: ['dog', 'tree', 'doll'], time: ['bed', 'play', 'lunch'] }, key = pick(Object.keys(groups)), [p, q] = shuffle(groups[key]).slice(0, 2), from = p + key, to = q + key;
      quiz(this, { ask: B(`Change "${p}" in "${from}" to "${q}". What is the new word?`, `"${from}"에서 "${p}"를 "${q}"로 바꾸면 어떤 낱말이 될까요?`), show: `<div class="bigword">${p}·${key} → ${q}·${key}</div>`, opts: wordOpts(to, [key + q, p + q]), cls: 'words', after: B(`${to}!`, `${to}!`), vocab: to });
    }
  }
});

// ---------- 2. Chunks: onsets and rimes ----------
const ONR = [['bl', 'ock', 'block', '🧱'], ['fl', 'ag', 'flag', '🚩'], ['fr', 'og', 'frog', '🐸'], ['dr', 'um', 'drum', '🥁'], ['cr', 'ab', 'crab', '🦀'], ['cl', 'ock', 'clock', '🕒'], ['sw', 'im', 'swim', '🏊'], ['sp', 'oon', 'spoon', '🥄'], ['sn', 'ail', 'snail', '🐌'], ['st', 'ar', 'star', '⭐'], ['sh', 'ip', 'ship', '🚢'], ['ch', 'ip', 'chip', '🍟'], ['th', 'umb', 'thumb', '👍'], ['ch', 'ick', 'chick', '🐥'], ['sh', 'eep', 'sheep', '🐑'], ['sh', 'ell', 'shell', '🐚'], ['br', 'ush', 'brush', '🖌️'], ['tr', 'uck', 'truck', '🚚'], ['tr', 'ain', 'train', '🚂'], ['sk', 'unk', 'skunk', '🦨']];
G1R({
  id: 'onsetrime1', icon: '🧩', title: B('Chunks', '앞소리와 뒷소리'), sub: B('Blend and break words', '합치고 나눠요'), u: 'Onsets and rimes',
  play() {
    const lv = lvl('onsetrime1'), t = pick(ONR), [on, ri, w, e] = t, pool = ONR.filter(x => x !== t);
    if (rnd(2) === 0 || lv === 1) {
      const ds = shuffle(pool.filter(x => x[2] !== w && x[0] !== on && x[1] !== ri)).slice(0, 2);
      quiz(this, { ask: B(`Blend the chunks: ${on} + ${ri}`, `조각을 합쳐요: ${on} + ${ri}`), askSay: B(`${on} ${ri}. What word is it?`, `${on} ${ri}. 어떤 낱말일까요?`), show: `<div class="bigword">${on} + ${ri} = ?</div>`, opts: [t, ...ds].map(x => picOpt(x[3], x[2], x === t)), after: B(`${on} + ${ri} = ${w}`, `${on} + ${ri} = ${w}`), vocab: w });
    } else {
      const o2 = pick(ONR.filter(x => x[0] !== on))[0], r2 = pick(ONR.filter(x => x[1] !== ri))[1], cand = [[on, ri], [o2, ri], [on, r2]].filter((v, i, ar) => ar.findIndex(q => q[0] === v[0] && q[1] === v[1]) === i && (i === 0 || !ONR.some(x => x[0] === v[0] && x[1] === v[1])));
      quiz(this, { ask: B('Which chunks make this word?', '이 낱말은 어떤 조각으로 이루어져 있을까요?'), show: `<span class="emo">${e}</span>`, opts: cand.map((v, i) => ({ html: `<span class="word">${v[0]} + ${v[1]}</span>`, ok: i === 0 })), cls: 'words', after: B(`${w} = ${on} + ${ri}`, `${w} = ${on} + ${ri}`), vocab: w });
    }
  }
});

// ---------- 3. Sound boxes ----------
const PHON = [['ship', ['sh', 'i', 'p'], '🚢'], ['frog', ['f', 'r', 'o', 'g'], '🐸'], ['fish', ['f', 'i', 'sh'], '🐟'], ['stop', ['s', 't', 'o', 'p'], '🛑'], ['tree', ['t', 'r', 'ee'], '🌳'], ['flag', ['f', 'l', 'a', 'g'], '🚩'], ['jump', ['j', 'u', 'm', 'p'], '🦘'], ['hand', ['h', 'a', 'n', 'd'], '✋'], ['cake', ['c', 'a', 'k'], '🎂'], ['bike', ['b', 'i', 'k'], '🚲'], ['chip', ['ch', 'i', 'p'], '🍟'], ['moon', ['m', 'oo', 'n'], '🌙'], ['crab', ['c', 'r', 'a', 'b'], '🦀'], ['sun', ['s', 'u', 'n'], '☀️'], ['drum', ['d', 'r', 'u', 'm'], '🥁'], ['milk', ['m', 'i', 'l', 'k'], '🥛']];
const CHG = [['cat', 'hat', B('Change /k/ in "cat" to /h/.', '"cat"의 첫소리 /k/를 /h/로 바꿔요.'), ['mat', 'cap']], ['map', 'mat', B('Change the last sound /p/ in "map" to /t/.', '"map"의 끝소리 /p/를 /t/로 바꿔요.'), ['cap', 'mop']], ['sit', 'sat', B('Change the middle sound /i/ in "sit" to /a/.', '"sit"의 가운데 소리 /i/를 /a/로 바꿔요.'), ['sip', 'sun']], ['pig', 'big', B('Change /p/ in "pig" to /b/.', '"pig"의 첫소리 /p/를 /b/로 바꿔요.'), ['pin', 'wig']], ['hop', 'hot', B('Change the last sound /p/ in "hop" to /t/.', '"hop"의 끝소리 /p/를 /t/로 바꿔요.'), ['top', 'hat']], ['bed', 'red', B('Change /b/ in "bed" to /r/.', '"bed"의 첫소리 /b/를 /r/로 바꿔요.'), ['bad', 'bud']], ['bus', 'bug', B('Change the last sound /s/ in "bus" to /g/.', '"bus"의 끝소리 /s/를 /g/로 바꿔요.'), ['bun', 'bat']], ['cup', 'pup', B('Change /k/ in "cup" to /p/.', '"cup"의 첫소리 /k/를 /p/로 바꿔요.'), ['cut', 'sup']]];
G1R({
  id: 'phonemes1', icon: '🔈', title: B('Sound Boxes', '소리 상자'), sub: B('Count and change sounds', '소리를 세고 바꿔요'), u: 'Sounds in words',
  play() {
    const lv = lvl('phonemes1'), kind = pick(lv === 1 ? ['count', 'count', 'pos'] : ['count', 'pos', 'pos', 'change']), t = pick(PHON), [w, sn, e] = t;
    if (kind === 'count') {
      quiz(this, { ask: B(`How many sounds do you hear in "${w}"?`, `"${w}"에는 소리가 몇 개 있을까요?`), show: `<div class="story"><span class="emo">${e}</span></div>`, opts: numO(sn.length, [sn.length - 1, sn.length + 1, w.length], 2, 6), after: B(`${w}: ${sn.join(' - ')} (${sn.length} sounds)`, `${w}: ${sn.join(' - ')} (소리 ${sn.length}개)`), vocab: w });
    } else if (kind === 'pos') {
      const idx = rnd(3) === 0 ? 0 : rnd(2) === 0 ? sn.length - 1 : Math.floor(sn.length / 2), name = idx === 0 ? B('FIRST', '첫') : idx === sn.length - 1 ? B('LAST', '끝') : B('MIDDLE', '가운데'), right = sn[idx];
      const pool = [...new Set(PHON.flatMap(x => x[1]))].filter(x => !sn.includes(x) || x === right);
      const ds = shuffle(pool.filter(x => x !== right && (idx === Math.floor(sn.length / 2) && idx !== 0 && idx !== sn.length - 1 ? 'aeiou'.includes(x[0]) : !'aeiou'.includes(x[0])) )).slice(0, 2);
      let g = 0; while (ds.length < 2 && g++ < 20) { const x = pick(pool); if (x !== right && !ds.includes(x)) ds.push(x); }
      quiz(this, { ask: B(`What is the ${L(name)} sound in "${w}"?`, `"${w}"의 ${name.ko} 소리는 무엇일까요?`), askSay: B(`What is the ${L(name).toLowerCase()} sound in ${w}?`, `"${w}"의 ${name.ko} 소리는 무엇일까요?`), show: `<div class="story"><span class="emo">${e}</span><div class="sbox">${sn.map((x, i) => `<i class="${i === idx ? 'on' : ''}">${i === idx ? '?' : ''}</i>`).join('')}</div></div>`, opts: [right, ...ds].map(x => ({ html: `<span class="num">${x}</span>`, ok: x === right })), cls: 'shapes', after: B(`${w}: ${sn.join(' - ')}`, `${w}: ${sn.join(' - ')}`), vocab: w });
    } else {
      const c = pick(CHG);
      quiz(this, { ask: c[2], show: '<div class="bigword">?</div>', opts: wordOpts(c[1], c[3]), cls: 'words', after: B(`${c[0]} → ${c[1]}`, `${c[0]} → ${c[1]}`), vocab: c[1] });
    }
  }
});

// ---------- 4. Blends and digraphs ----------
const INIT_PICS = [['bl', 'block', '🧱'], ['fl', 'flag', '🚩'], ['pl', 'plane', '✈️'], ['gl', 'glove', '🧤'], ['cl', 'clock', '🕒'], ['br', 'brush', '🖌️'], ['cr', 'crab', '🦀'], ['dr', 'drum', '🥁'], ['fr', 'frog', '🐸'], ['gr', 'grapes', '🍇'], ['tr', 'tree', '🌳'], ['sk', 'skunk', '🦨'], ['sn', 'snail', '🐌'], ['sp', 'spider', '🕷️'], ['st', 'star', '⭐'], ['sh', 'ship', '🚢'], ['ch', 'chair', '🪑'], ['th', 'thumb', '👍'], ['wh', 'whale', '🐋']];
const FINAL_PICS = [['nd', 'hand', '✋'], ['nt', 'tent', '⛺'], ['mp', 'lamp', '💡'], ['sk', 'desk', '🪑'], ['st', 'nest', '🪺'], ['ng', 'ring', '💍'], ['ck', 'duck', '🦆'], ['sh', 'fish', '🐟'], ['ch', 'lunch', '🍱'], ['th', 'bath', '🛁'], ['nk', 'skunk', '🦨'], ['ft', 'raft', '🛶']];
G1R({
  id: 'blends', icon: '🔠', title: B('Blends and Digraphs', '합쳐진 소리'), sub: B('sh, ch, th, bl, st...', 'sh, ch, th, bl, st...'), u: 'Blends and digraphs',
  play() {
    const lv = lvl('blends'), finalMode = lv === 2 && rnd(2) === 0, pool = finalMode ? FINAL_PICS : INIT_PICS, t = pick(pool), ds = shuffle(pool.filter(x => x[0] !== t[0])).slice(0, 2);
    if (rnd(2) === 0) {
      quiz(this, { ask: finalMode ? B(`Which letters does "${t[1]}" END with?`, `"${t[1]}"는 어떤 글자로 끝날까요?`) : B(`Which letters does "${t[1]}" START with?`, `"${t[1]}"는 어떤 글자로 시작할까요?`), show: `<span class="emo">${t[2]}</span>`, opts: [t, ...ds].map(x => ({ html: `<span class="num">${x[0]}</span>`, ok: x === t })), cls: 'shapes', after: B(`${t[1]}: ${finalMode ? 'ends with' : 'starts with'} ${t[0]}`, `${t[1]}: ${t[0]}${finalMode ? '로 끝나요' : '로 시작해요'}`), vocab: t[1] });
    } else {
      quiz(this, { ask: finalMode ? B(`Which picture ENDS with "${t[0]}"?`, `"${t[0]}"로 끝나는 그림은?`) : B(`Which picture STARTS with "${t[0]}"?`, `"${t[0]}"로 시작하는 그림은?`), show: `<div class="bigword">${t[0]}</div>`, opts: [t, ...ds].map(x => picOpt(x[2], x[1], x === t)), after: B(`${t[1]}: ${t[0]}`, `${t[1]}: ${t[0]}`), vocab: t[1] });
    }
  }
});

// ---------- 5. Long and short vowels ----------
const VOW = {
  a: { long: [['cake', '🎂'], ['snake', '🐍'], ['rain', '🌧️'], ['train', '🚂'], ['gate', '🚪'], ['plate', '🍽️']], short: [['cat', '🐱'], ['hat', '🎩'], ['bag', '👜'], ['map', '🗺️'], ['van', '🚐'], ['ant', '🐜']] },
  e: { long: [['tree', '🌳'], ['bee', '🐝'], ['leaf', '🍃'], ['feet', '🦶'], ['sheep', '🐑'], ['queen', '👑']], short: [['bed', '🛏️'], ['pen', '🖊️'], ['hen', '🐔'], ['net', '🥅'], ['web', '🕸️'], ['nest', '🪺']] },
  i: { long: [['kite', '🪁'], ['bike', '🚲'], ['pie', '🥧'], ['ice', '🧊'], ['smile', '😊'], ['five', '🖐️']], short: [['pig', '🐷'], ['fish', '🐟'], ['six', '6️⃣'], ['lip', '👄'], ['ship', '🚢'], ['brick', '🧱']] },
  o: { long: [['boat', '⛵'], ['goat', '🐐'], ['nose', '👃'], ['rose', '🌹'], ['bone', '🦴'], ['home', '🏠'], ['coat', '🧥']], short: [['dog', '🐶'], ['fox', '🦊'], ['box', '📦'], ['pot', '🍲'], ['sock', '🧦'], ['frog', '🐸']] },
  u: { long: [['unicorn', '🦄'], ['music', '🎵'], ['tulip', '🌷'], ['cube', '🧊']], short: [['bus', '🚌'], ['sun', '☀️'], ['cup', '🥤'], ['bug', '🐛'], ['duck', '🦆'], ['drum', '🥁']] }
};
const MAGIC = [['cap', 'cape'], ['tap', 'tape'], ['kit', 'kite'], ['hop', 'hope'], ['cub', 'cube'], ['pin', 'pine'], ['rob', 'robe'], ['mad', 'made'], ['not', 'note'], ['slid', 'slide'], ['hat', 'hate'], ['bit', 'bite']];
G1R({
  id: 'longvowels', icon: '🅰️', title: B('Long and Short Vowels', '긴 모음, 짧은 모음'), sub: B('Say the vowel name or its short sound', '모음 이름? 짧은 소리?'), u: 'Vowel sounds',
  play() {
    const lv = lvl('longvowels'), v = pick(Object.keys(VOW)), kind = pick(lv === 1 ? ['findLong', 'findShort', 'sort'] : ['findLong', 'findShort', 'sort', 'magic', 'magic']);
    if (kind === 'findLong' || kind === 'findShort') {
      const wantLong = kind === 'findLong', right = pick(VOW[v][wantLong ? 'long' : 'short']), ds = shuffle(VOW[v][wantLong ? 'short' : 'long']).slice(0, 2);
      quiz(this, { ask: wantLong ? B(`Which word has the LONG ${v} sound? (it says its name)`, `긴 ${v} 소리가 나는 낱말은? (알파벳 이름처럼 소리가 나요)`) : B(`Which word has the SHORT ${v} sound?`, `짧은 ${v} 소리가 나는 낱말은?`), askSay: wantLong ? B(`Which word has the long ${v} sound?`, `긴 ${v} 소리가 나는 낱말은?`) : B(`Which word has the short ${v} sound?`, `짧은 ${v} 소리가 나는 낱말은?`), opts: [right, ...ds].map((x, i) => picOpt(x[1], x[0], i === 0)), after: B(`${right[0]} has a ${wantLong ? 'long' : 'short'} ${v}.`, `${right[0]}은(는) ${wantLong ? '긴' : '짧은'} ${v} 소리예요.`), vocab: right[0] });
    } else if (kind === 'sort') {
      const long = rnd(2) === 0, w = pick(VOW[v][long ? 'long' : 'short']);
      quiz(this, { ask: B(`Is the ${v} in "${w[0]}" long or short?`, `"${w[0]}"의 ${v}는 긴 소리일까요, 짧은 소리일까요?`), show: `<div class="story"><span class="emo">${w[1]}</span></div>`, opts: ['long', 'short'].map(k => ({ html: `<span class="word">${k === 'long' ? L(B('long', '긴 소리')) : L(B('short', '짧은 소리'))} ${v}</span>`, ok: (k === 'long') === long })), cls: 'words', after: B(`${w[0]}: ${long ? 'long' : 'short'} ${v}`, `${w[0]}: ${long ? '긴' : '짧은'} ${v}`), vocab: w[0] });
    } else {
      const [a, b] = pick(MAGIC);
      quiz(this, { ask: B(`Add the magic e to "${a}". What is the new word?`, `"${a}"에 마법의 e를 붙이면 어떤 낱말이 될까요?`), show: `<div class="bigword">${a} + e = ?</div>`, opts: wordOpts(b, [a, a + a.slice(-1)]), cls: 'words', after: B(`${a} + e = ${b}. The magic e makes the vowel say its name.`, `${a} + e = ${b}. 마법의 e가 모음을 긴 소리로 만들어요.`), vocab: b });
    }
  }
});

// ---------- 6. Silly words ----------
const SILLY = { cvc: ['zop', 'vib', 'jud', 'kem', 'lub', 'nep', 'rit', 'wug', 'bap', 'fid', 'hib', 'mep', 'pob', 'sud', 'tib', 'dax', 'zeb', 'quib'], cvce: ['mape', 'tibe', 'sone', 'lupe', 'dibe', 'rike', 'pote', 'zane', 'lete', 'vome'], ccvc: ['blop', 'frem', 'clid', 'stup', 'glan', 'trib', 'plon', 'drit'], cvcc: ['jamp', 'felp', 'nust', 'mamp', 'dilp', 'bimp', 'vunt', 'fonk'] };
const REAL1 = ['cat', 'dog', 'sun', 'hat', 'pig', 'bus', 'cup', 'bed', 'fox', 'hen', 'map', 'sit', 'hop', 'run', 'fan', 'pin', 'log', 'mud', 'tub', 'net', 'jam', 'rug', 'wet', 'ham', 'van', 'pot', 'kid', 'zip', 'frog', 'jump', 'milk', 'flag', 'drum', 'stop'];
const RHYME_SILLY = [['cat', 'zat'], ['dog', 'zog'], ['sit', 'vit'], ['hop', 'zop'], ['bed', 'ked'], ['cup', 'dup'], ['fan', 'yan'], ['pin', 'vin'], ['mud', 'vud'], ['run', 'zun']];
G1R({
  id: 'silly', icon: '🤪', title: B('Silly Words', '이상한 단어'), sub: B('Sound it out!', '소리 내어 읽어요'), u: 'Decoding',
  play() {
    const lv = lvl('silly'), kind = pick(lv === 1 ? ['which', 'which', 'rhyme'] : ['which', 'long', 'rhyme', 'blend']);
    if (kind === 'which') {
      const pool = lv === 1 ? SILLY.cvc : [...SILLY.cvc, ...SILLY.ccvc, ...SILLY.cvcc], silly = pick(pool), reals = shuffle(REAL1.filter(w => w.length === silly.length || lv === 2)).slice(0, 2);
      quiz(this, { ask: B('Sound them out. Which one is a SILLY word (not a real word)?', '소리 내어 읽어 봐요. 진짜 낱말이 아닌 이상한 단어는?'), askSay: B('Which one is a silly word, not a real word?', '진짜 낱말이 아닌 이상한 단어는 어느 것일까요?'), opts: wordOpts(silly, reals), cls: 'words', after: B(`"${silly}" is a silly word. You can still sound it out!`, `"${silly}"는 이상한 단어예요. 그래도 소리 내어 읽을 수 있어요!`), vocab: silly });
    } else if (kind === 'long') {
      const right = pick(SILLY.cvce), ds = shuffle(SILLY.cvc).slice(0, 2);
      quiz(this, { ask: B('Which silly word has a LONG vowel sound (magic e)?', '긴 모음 소리(마법의 e)가 나는 이상한 단어는?'), opts: wordOpts(right, ds), cls: 'words', after: B(`"${right}" ends with a magic e, so the vowel says its name.`, `"${right}"는 마법의 e가 있어서 모음이 긴 소리로 나요.`), vocab: right });
    } else if (kind === 'rhyme') {
      const [real, sil] = pick(RHYME_SILLY), ds = shuffle(RHYME_SILLY.filter(x => x[0] !== real && x[1].slice(1) !== sil.slice(1))).slice(0, 2).map(x => x[1]);
      quiz(this, { ask: B(`Which silly word rhymes with "${real}"?`, `"${real}"와(과) 라임이 맞는 이상한 단어는?`), opts: wordOpts(sil, ds), cls: 'words', after: B(`${real} and ${sil} rhyme.`, `${real}와(과) ${sil}는 라임이 맞아요.`), vocab: sil });
    } else {
      const right = pick(SILLY.ccvc), ds = [pick(SILLY.cvc), pick(SILLY.cvcc)];
      quiz(this, { ask: B('Which silly word starts with two consonants blended together?', '자음 두 개가 붙어서 시작하는 이상한 단어는?'), opts: wordOpts(right, ds), cls: 'words', after: B(`"${right}" starts with ${right.slice(0, 2)}.`, `"${right}"는 ${right.slice(0, 2)}로 시작해요.`), vocab: right });
    }
  }
});

// ---------- 7. Two-syllable words ----------
const SYL2 = [['rabbit', 'rab-bit', '🐰'], ['sunset', 'sun-set', '🌅'], ['pencil', 'pen-cil', '✏️'], ['basket', 'bas-ket', '🧺'], ['butter', 'but-ter', '🧈'], ['kitten', 'kit-ten', '🐱'], ['puppy', 'pup-py', '🐶'], ['magnet', 'mag-net', '🧲'], ['picnic', 'pic-nic', '🧺'], ['tiger', 'ti-ger', '🐯'], ['robot', 'ro-bot', '🤖'], ['music', 'mu-sic', '🎵'], ['paper', 'pa-per', '📄'], ['flower', 'flow-er', '🌸'], ['spider', 'spi-der', '🕷️'], ['window', 'win-dow', '🪟'], ['pumpkin', 'pump-kin', '🎃'], ['candy', 'can-dy', '🍬'], ['monkey', 'mon-key', '🐵'], ['cactus', 'cac-tus', '🌵']];
const SYL3 = [['butterfly', 'but-ter-fly', '🦋'], ['banana', 'ba-na-na', '🍌'], ['elephant', 'el-e-phant', '🐘'], ['dinosaur', 'di-no-saur', '🦖'], ['umbrella', 'um-brel-la', '☂️']];
G1R({
  id: 'twosyl', icon: '✂️', title: B('Two-Syllable Words', '두 음절 낱말'), sub: B('Split, count, join', '나누고 세고 합쳐요'), u: 'Syllables',
  play() {
    const lv = lvl('twosyl'), kind = pick(lv === 1 ? ['split', 'split', 'join'] : ['split', 'join', 'count', 'count']), t = pick(kind === 'count' && lv === 2 ? [...SYL2, ...SYL3] : SYL2), [w, sp, e] = t, parts = sp.split('-');
    if (kind === 'split') {
      const other = (() => { const out = []; for (let i = 1; i < w.length; i++) { const c = w.slice(0, i) + '-' + w.slice(i); if (c !== sp) out.push(c); } return out; })(), ds = shuffle(other).slice(0, 2);
      quiz(this, { ask: B(`How do you split "${w}" into syllables?`, `"${w}"를 음절로 나누면 어떻게 될까요?`), show: `<span class="emo">${e}</span>`, opts: wordOpts(sp, ds), cls: 'words', after: B(`${sp}`, `${sp}`), vocab: w });
    } else if (kind === 'join') {
      quiz(this, { ask: B(`Put the syllables together: ${parts.join(' + ')}`, `음절을 합쳐요: ${parts.join(' + ')}`), show: `<span class="emo">${e}</span>`, opts: wordOpts(w, [parts.slice().reverse().join(''), parts[0] + parts[0]].filter(x => x !== w)), cls: 'words', after: B(`${parts.join(' + ')} = ${w}`, `${parts.join(' + ')} = ${w}`), vocab: w });
    } else {
      quiz(this, { ask: B(`How many syllables are in "${w}"?`, `"${w}"는 음절이 몇 개일까요?`), show: `<div class="bigword">${e} ${w}</div>`, opts: numO(parts.length, [1, 2, 3, 4], 1, 4), after: B(`${sp} (${parts.length})`, `${sp} (${parts.length})`), vocab: w });
    }
  }
});

// ---------- 8. Tricky words ----------
const TRICKY = [['said', 'My mom ___ hello.', '엄마가 안녕이라고 ___.', ['sed', 'sayd']], ['was', 'It ___ a fun day.', '재미있는 날이 ___.', ['wuz', 'woz']], ['they', '___ like to play.', '___ 놀기를 좋아해요.', ['thay', 'thea']], ['there', 'Put it over ___.', '저기에 놓아요: ___.', ['thier', 'ther']], ['where', '___ is my hat?', '내 모자가 ___ 있어요?', ['wear', 'wher']], ['what', '___ is that?', '그건 ___ 이에요?', ['wat', 'whut']], ['who', '___ is at the door?', '문에 ___ 있어요?', ['hoo', 'whoo']], ['come', 'Please ___ here.', '여기로 ___.', ['cum', 'kum']], ['some', 'I want ___ milk.', '우유 ___ 주세요.', ['sum', 'soum']], ['one', 'I have ___ dog.', '강아지가 ___ 마리 있어요.', ['wun', 'won']], ['two', 'I see ___ birds.', '새가 ___ 마리 보여요.', ['too', 'tu']], ['because', 'I smile ___ I am happy.', '행복해서 웃어요: ___.', ['becuz', 'becaus']], ['again', 'Let us try ___!', '___ 해 봐요!', ['agen', 'agan']], ['friend', 'She is my ___.', '그 애는 내 ___예요.', ['frend', 'freind']], ['people', 'Many ___ came.', '많은 ___이 왔어요.', ['peple', 'peeple']], ['would', 'I ___ like a snack.', '간식을 ___ 좋겠어요.', ['wud', 'woud']], ['could', 'I ___ jump high.', '나는 높이 뛸 수 ___.', ['cud', 'coud']], ['very', 'It is ___ hot.', '___ 더워요.', ['verry', 'vary']], ['give', 'Please ___ me a pen.', '펜을 ___ 주세요.', ['giv', 'gif']], ['have', 'We ___ a cat.', '우리는 고양이를 ___.', ['hav', 'haf']], ['are', 'We ___ happy.', '우리는 행복___.', ['ar', 'arr']], ['your', 'Is this ___ coat?', '이것이 ___ 코트예요?', ['yor', 'youre']], ['of', 'A cup ___ milk.', '우유 한 컵 ___.', ['uv', 'ov']], ['do', 'What will you ___?', '무엇을 ___ 거예요?', ['doo', 'du']], ['from', 'A gift ___ Grandma.', '할머니___ 온 선물.', ['frum', 'frm']], ['want', 'I ___ a cookie.', '쿠키를 ___.', ['wont', 'wunt']], ['school', 'I go to ___.', '나는 ___에 가요.', ['skool', 'scool']], ['great', 'That was a ___ game!', '___ 경기였어요!', ['grait', 'greit']], ['away', 'The bird flew ___.', '새가 ___ 날아갔어요.', ['awey', 'awae']], ['love', 'I ___ my dog.', '나는 내 강아지를 ___.', ['luv', 'lov']], ['mother', 'My ___ is kind.', '내 ___는 친절해요.', ['mothur', 'muther']], ['father', 'My ___ reads to me.', '내 ___가 책을 읽어 줘요.', ['fathur', 'fahter']], ['together', 'We play ___.', '우리는 ___ 놀아요.', ['togethur', 'toegether']], ['around', 'Run ___ the tree.', '나무 ___를 달려요.', ['arownd', 'aroud']], ['their', 'That is ___ house.', '저것은 ___ 집이에요.', ['thare', 'thier']], ['many', 'I have ___ toys.', '장난감이 ___ 있어요.', ['meny', 'mani']], ['any', 'Do you have ___ gum?', '껌 ___ 있어요?', ['eny', 'ani']], ['laugh', 'The joke made me ___.', '그 농담에 ___.', ['laf', 'lauf']], ['move', 'Please ___ over.', '옆으로 ___.', ['moov', 'muve']], ['once', '___ I saw a bear.', '___ 곰을 본 적이 있어요.', ['wunce', 'onse']]];
G1R({
  id: 'tricky1', icon: '🪄', title: B('Tricky Words', '까다로운 단어'), sub: B('Words you cannot sound out', '소리 나는 대로 안 쓰는 단어'), u: 'Sight words',
  play() {
    const lv = lvl('tricky1'), t = pick(lv === 1 ? TRICKY.slice(0, 22) : TRICKY), [w, sent, ko, ds] = t, filled = sent.replace('___', `<span class="qbox">?</span>`);
    quiz(this, { ask: B('Which word fits the sentence? Pick the right spelling.', '문장에 맞는 낱말은? 철자가 맞는 것을 골라요.'), askSay: B(sent.replace('___', 'blank'), ko.replace('___', '')), show: `<div class="bigword sent">${filled}</div>`, opts: wordOpts(w, ds), cls: 'words', after: B(sent.replace('___', w), ko.replace('___', w)), vocab: sent.replace('___', w) });
  }
});

// ---------- 9. Spell it (tiles) ----------
const SPELL1 = [[['sh', 'i', 'p'], '🚢', B('ship', '배')], [['ch', 'i', 'p'], '🍟', B('chip', '감자칩')], [['f', 'r', 'o', 'g'], '🐸', B('frog', '개구리')], [['f', 'l', 'a', 'g'], '🚩', B('flag', '깃발')], [['s', 't', 'ar'], '⭐', B('star', '별')], [['d', 'r', 'u', 'm'], '🥁', B('drum', '북')], [['c', 'r', 'a', 'b'], '🦀', B('crab', '게')], [['s', 'w', 'i', 'm'], '🏊', B('swim', '수영')], [['d', 'u', 'ck'], '🦆', B('duck', '오리')], [['t', 'r', 'ai', 'n'], '🚂', B('train', '기차')], [['c', 'a', 'k', 'e'], '🎂', B('cake', '케이크')], [['b', 'i', 'k', 'e'], '🚲', B('bike', '자전거')], [['r', 'ai', 'n'], '🌧️', B('rain', '비')], [['b', 'oa', 't'], '⛵', B('boat', '보트')], [['t', 'r', 'ee'], '🌳', B('tree', '나무')]];
const SPELL2 = [[['rab', 'bit'], '🐰', B('rabbit', '토끼')], [['sun', 'set'], '🌅', B('sunset', '노을')], [['pen', 'cil'], '✏️', B('pencil', '연필')], [['but', 'ter'], '🧈', B('butter', '버터')], [['kit', 'ten'], '🐱', B('kitten', '새끼 고양이')], [['pic', 'nic'], '🧺', B('picnic', '소풍')], [['bas', 'ket'], '🧺', B('basket', '바구니')], [['mag', 'net'], '🧲', B('magnet', '자석')], [['pump', 'kin'], '🎃', B('pumpkin', '호박')], [['win', 'dow'], '🪟', B('window', '창문')]];
G1W({
  id: 'spell1', icon: '🔡', title: B('Spell It', '철자 쓰기'), sub: B('Build the word from sound chunks', '소리 조각으로 낱말 만들기'), u: 'Spelling',
  play() {
    const t = pick(lvl('spell1') === 1 ? SPELL1 : [...SPELL1.slice(8), ...SPELL2]), pool = ['th', 'ay', 'er', 'i', 'a', 'o', 'oo', 'sh', 'ing', 'ou'].filter(x => !t[0].includes(x));
    tileRound(this, { ask: B('Spell the word. Tap the sound chunks in order!', '낱말의 철자를 소리 조각을 차례로 눌러 만들어요!'), show: `<span class="emo">${t[1]}</span>`, target: t[0], extra: shuffle(pool).slice(0, 2), speakTiles: false, after: B(`${t[0].join('')}!`, `${t[0].join('')} — ${t[2].ko}!`), vocab: t[0].join('') });
  }
});

// ---------- 10. Story questions ----------
const READ_STORIES = [
  { t: B('Mia has a red kite. The wind is strong. Her kite flies up, up, up! Then the string breaks. The kite flies away. Mia is sad. Her dad says, "We can make a new kite." Mia smiles.', '미아에게 빨간 연이 있어요. 바람이 세게 불어요. 연이 위로 위로 날아요! 그때 줄이 끊어졌어요. 연이 날아가 버렸어요. 미아는 슬퍼요. 아빠가 말해요. "새 연을 만들자." 미아가 웃어요.'), q: [
    { lv: 1, ask: B('Who is the story about?', '이 이야기의 주인공은 누구일까요?'), right: B('Mia', '미아'), wrong: [B('Dad', '아빠'), B('The wind', '바람')] },
    { lv: 2, ask: B('What is the problem?', '문제는 무엇일까요?'), right: B('The kite string breaks.', '연줄이 끊어져요.'), wrong: [B('It rains.', '비가 와요.'), B('Mia loses her hat.', '미아가 모자를 잃어버려요.')] },
    { lv: 2, ask: B('Who says, "We can make a new kite"?', '"새 연을 만들자"라고 말한 사람은?'), right: B('Dad', '아빠'), wrong: [B('Mia', '미아'), B('The kite', '연')] }] },
  { t: B('Ben and his dog Tag go to the park. Tag sees a squirrel and runs! Ben runs too. "Stop, Tag!" says Ben. Tag stops. Ben gives Tag a hug.', '벤과 강아지 태그가 공원에 가요. 태그가 다람쥐를 보고 달려가요! 벤도 달려요. 벤이 말해요. "멈춰, 태그!" 태그가 멈춰요. 벤이 태그를 안아 줘요.'), q: [
    { lv: 1, ask: B('Who is Tag?', '태그는 누구일까요?'), right: B("Ben's dog", '벤의 강아지'), wrong: [B("Ben's brother", '벤의 동생'), B('A squirrel', '다람쥐')] },
    { lv: 1, ask: B('What does Tag do when he sees the squirrel?', '태그는 다람쥐를 보고 무엇을 할까요?'), right: B('He runs.', '달려가요.'), wrong: [B('He sleeps.', '잠을 자요.'), B('He eats.', '먹어요.')] },
    { lv: 2, ask: B('Who says, "Stop, Tag!"?', '"멈춰, 태그!"라고 말한 사람은?'), right: B('Ben', '벤'), wrong: [B('Tag', '태그'), B('The squirrel', '다람쥐')] }] },
  { t: B('Lily plants a seed in a pot. Every day she gives it water. She puts it in the sun. One day, a tiny green plant pops up! Lily claps.', '릴리가 화분에 씨앗을 심어요. 매일 물을 줘요. 햇볕 아래에 두어요. 어느 날 작은 초록 싹이 쑥 올라와요! 릴리가 손뼉을 쳐요.'), q: [
    { lv: 1, ask: B('What does Lily give the seed every day?', '릴리는 매일 씨앗에게 무엇을 줄까요?'), right: B('Water', '물'), wrong: [B('Candy', '사탕'), B('A hat', '모자')] },
    { lv: 2, ask: B('What happens at the end?', '마지막에 무슨 일이 생길까요?'), right: B('A green plant pops up.', '초록 싹이 올라와요.'), wrong: [B('The pot breaks.', '화분이 깨져요.'), B('It snows.', '눈이 와요.')] },
    { lv: 2, ask: B('What does Lily do first?', '릴리가 맨 처음 한 일은?'), right: B('She plants a seed.', '씨앗을 심어요.'), wrong: [B('She claps.', '손뼉을 쳐요.'), B('She waters the plant.', '식물에 물을 줘요.')] }] },
  { t: B('It is raining. Sam cannot play outside. He builds a fort with blankets. His sister comes inside the fort. They read books together.', '비가 와요. 샘은 밖에서 놀 수 없어요. 담요로 아지트를 만들어요. 동생이 아지트 안으로 들어와요. 둘이 함께 책을 읽어요.'), q: [
    { lv: 1, ask: B('Where does the story happen?', '이야기는 어디에서 일어날까요?'), right: B('Inside the house', '집 안'), wrong: [B('At the beach', '바닷가'), B('At school', '학교')] },
    { lv: 2, ask: B('What is the problem?', '문제는 무엇일까요?'), right: B('Sam cannot play outside.', '샘이 밖에서 놀 수 없어요.'), wrong: [B('Sam is hungry.', '샘이 배가 고파요.'), B('Sam lost his book.', '샘이 책을 잃어버렸어요.')] },
    { lv: 2, ask: B('How does Sam fix the problem?', '샘은 문제를 어떻게 해결할까요?'), right: B('He builds a fort.', '아지트를 만들어요.'), wrong: [B('He goes to sleep.', '잠을 자요.'), B('He calls a friend.', '친구에게 전화해요.')] }] },
  { t: B("Zoe's tooth is loose. She wiggles it. It does not come out. Zoe eats a crunchy apple. Pop! The tooth falls out. Zoe smiles big.", '조이의 이가 흔들려요. 조이가 이를 흔들어 봐요. 이가 빠지지 않아요. 조이가 아삭한 사과를 먹어요. 톡! 이가 빠졌어요. 조이가 활짝 웃어요.'), q: [
    { lv: 1, ask: B('What makes the tooth come out?', '무엇 때문에 이가 빠질까요?'), right: B('Eating a crunchy apple', '아삭한 사과를 먹는 것'), wrong: [B('Drinking milk', '우유를 마시는 것'), B('Taking a nap', '낮잠을 자는 것')] },
    { lv: 2, ask: B('How does Zoe feel at the end?', '조이는 마지막에 기분이 어때요?'), right: B('Happy', '기뻐요'), wrong: [B('Sad', '슬퍼요'), B('Angry', '화나요')] }] },
  { t: B('A little duck cannot find its mom. It looks by the pond. It looks by the tree. "Quack! Quack!" The mom duck hears and swims over.', '아기 오리가 엄마를 찾지 못해요. 연못가를 살펴봐요. 나무 옆도 살펴봐요. "꽥! 꽥!" 엄마 오리가 듣고 헤엄쳐 와요.'), q: [
    { lv: 1, ask: B('Who is the main character?', '주인공은 누구일까요?'), right: B('A little duck', '아기 오리'), wrong: [B('A big dog', '큰 개'), B('A fish', '물고기')] },
    { lv: 2, ask: B('How does the mom duck find the little duck?', '엄마 오리는 어떻게 아기 오리를 찾을까요?'), right: B('She hears it quack.', '꽥꽥 소리를 들어요.'), wrong: [B('She sees a map.', '지도를 봐요.'), B('A cat tells her.', '고양이가 알려 줘요.')] }] },
  { t: B('Max wants to ride a bike. He falls down. He tries again. He falls again. Max does not give up. At last, he rides all the way down the street.', '맥스는 자전거를 타고 싶어요. 넘어졌어요. 다시 해 봐요. 또 넘어졌어요. 맥스는 포기하지 않아요. 마침내 길을 끝까지 타고 내려가요.'), q: [
    { lv: 1, ask: B('What does Max want to do?', '맥스는 무엇을 하고 싶어 할까요?'), right: B('Ride a bike', '자전거 타기'), wrong: [B('Fly a kite', '연 날리기'), B('Bake a cake', '케이크 굽기')] },
    { lv: 2, ask: B('What kind of person is Max?', '맥스는 어떤 사람일까요?'), right: B('Someone who keeps trying', '계속 도전하는 사람'), wrong: [B('Someone who quits', '금방 포기하는 사람'), B('Someone who is sleepy', '졸린 사람')] }] },
  { t: B('Ava and Leo bake a cake. First, they mix the flour and eggs. Next, they pour it in a pan. Last, Mom puts it in the oven. The cake smells good!', '에이바와 레오가 케이크를 구워요. 먼저 밀가루와 달걀을 섞어요. 다음에는 팬에 부어요. 마지막으로 엄마가 오븐에 넣어요. 케이크 냄새가 좋아요!'), q: [
    { lv: 1, ask: B('What do they do FIRST?', '맨 처음 무엇을 할까요?'), right: B('Mix the flour and eggs', '밀가루와 달걀 섞기'), wrong: [B('Put it in the oven', '오븐에 넣기'), B('Eat the cake', '케이크 먹기')] },
    { lv: 2, ask: B('What happens LAST?', '맨 마지막에 무슨 일이 생길까요?'), right: B('Mom puts it in the oven.', '엄마가 오븐에 넣어요.'), wrong: [B('They mix the eggs.', '달걀을 섞어요.'), B('They pour it in a pan.', '팬에 부어요.')] }] },
  { t: B('A bear is hungry. He finds a hive. Bees are inside! The bear is stung. "Ouch!" says the bear. He runs to the river and eats fish instead.', '곰이 배가 고파요. 벌집을 찾았어요. 안에 벌이 있어요! 곰이 벌에 쏘였어요. 곰이 말해요. "아야!" 곰은 강으로 달려가 대신 물고기를 먹어요.'), q: [
    { lv: 1, ask: B('What does the bear eat at the end?', '곰은 마지막에 무엇을 먹을까요?'), right: B('Fish', '물고기'), wrong: [B('Honey', '꿀'), B('Berries', '열매')] },
    { lv: 2, ask: B('Who says, "Ouch!"?', '"아야!"라고 말한 것은?'), right: B('The bear', '곰'), wrong: [B('The bees', '벌'), B('The fish', '물고기')] }] },
  { t: B('Noah is new at school. He sits alone at lunch. A girl named Rose says, "Sit with us!" Noah smiles. Now he has new friends.', '노아는 학교에 처음 왔어요. 점심시간에 혼자 앉아 있어요. 로즈라는 여자아이가 말해요. "우리랑 같이 앉자!" 노아가 웃어요. 이제 새 친구들이 생겼어요.'), q: [
    { lv: 1, ask: B('Who is new at school?', '학교에 처음 온 사람은?'), right: B('Noah', '노아'), wrong: [B('Rose', '로즈'), B('The teacher', '선생님')] },
    { lv: 2, ask: B('How does Rose help Noah?', '로즈는 노아를 어떻게 도와줄까요?'), right: B('She asks him to sit with them.', '같이 앉자고 해요.'), wrong: [B('She gives him a toy.', '장난감을 줘요.'), B('She tells the teacher.', '선생님께 말해요.')] }] },
  { t: B('The moon is bright. A fox looks up. He sees a big round light. "I want the moon!" says the fox. He jumps and jumps. He cannot reach it. The fox laughs and goes home.', '달이 환해요. 여우가 올려다봐요. 크고 둥근 빛이 보여요. 여우가 말해요. "달을 갖고 싶어!" 여우가 폴짝폴짝 뛰어요. 닿을 수 없어요. 여우는 웃으며 집으로 가요.'), q: [
    { lv: 1, ask: B('What does the fox want?', '여우는 무엇을 갖고 싶어 할까요?'), right: B('The moon', '달'), wrong: [B('A fish', '물고기'), B('A hat', '모자')] },
    { lv: 2, ask: B('When does the story happen?', '이 이야기는 언제 일어날까요?'), right: B('At night', '밤'), wrong: [B('At lunch', '점심'), B('In the morning', '아침')] }] },
  { t: B("Lily's cat is stuck in a tree. Dad gets a tall ladder. He climbs up. He gets the cat. Lily hugs her cat.", '릴리의 고양이가 나무 위에서 내려오지 못해요. 아빠가 높은 사다리를 가져와요. 올라가요. 고양이를 데려와요. 릴리가 고양이를 안아 줘요.'), q: [
    { lv: 1, ask: B('What is the problem?', '문제는 무엇일까요?'), right: B('The cat is stuck in a tree.', '고양이가 나무에 갇혔어요.'), wrong: [B('The cat is hungry.', '고양이가 배고파요.'), B('The cat is lost.', '고양이가 길을 잃었어요.')] },
    { lv: 2, ask: B('What tool does Dad use?', '아빠는 어떤 도구를 쓸까요?'), right: B('A ladder', '사다리'), wrong: [B('A rope', '밧줄'), B('A boat', '배')] }] }
];
G1R({
  id: 'storyq', icon: '📚', title: B('Story Questions', '이야기 질문'), sub: B('Characters, problems, solutions', '인물, 문제, 해결'), u: 'Stories',
  play() {
    const lv = lvl('storyq'), s = pick(READ_STORIES), qs = s.q.filter(q => q.lv <= lv), q = pick(qs.length ? qs : s.q);
    quiz(this, { ask: q.ask, show: `<div class="storytext">${L(s.t)}</div>`, opts: [q.right, ...q.wrong].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('Look back at the story to check.', '이야기를 다시 보고 확인해 봐요.') });
  }
});

// ---------- 11. Fact detective ----------
const FACTS = [
  { t: B('Bees are insects. They have six legs and two pairs of wings. Bees make honey from flower nectar. A hive is a bee\'s home.', '벌은 곤충이에요. 다리가 6개, 날개가 두 쌍 있어요. 벌은 꽃의 꿀로 벌꿀을 만들어요. 벌집은 벌의 집이에요.'), q: [{ ask: B('What is this text mostly about?', '이 글은 주로 무엇에 대한 글일까요?'), r: B('Bees', '벌'), w: [B('Flowers', '꽃'), B('Honey jars', '꿀단지')] }, { ask: B('How many legs does a bee have?', '벌은 다리가 몇 개일까요?'), r: B('Six', '6개'), w: [B('Four', '4개'), B('Eight', '8개')] }, { ask: B('Where do bees live?', '벌은 어디에 살까요?'), r: B('In a hive', '벌집'), w: [B('In a nest', '둥지'), B('In a cave', '동굴')] }] },
  { t: B('Peaches grow on trees. Georgia is called the Peach State. Peaches are sweet and juicy. They are ripe in summer.', '복숭아는 나무에서 자라요. 조지아는 복숭아의 주(Peach State)라고 불러요. 복숭아는 달고 즙이 많아요. 여름에 익어요.'), q: [{ ask: B('What is this text mostly about?', '이 글은 주로 무엇에 대한 글일까요?'), r: B('Peaches', '복숭아'), w: [B('Apples', '사과'), B('Summer clothes', '여름 옷')] }, { ask: B('When are peaches ripe?', '복숭아는 언제 익을까요?'), r: B('In summer', '여름'), w: [B('In winter', '겨울'), B('In spring', '봄')] }, { ask: B('Which state is called the Peach State?', '복숭아의 주(Peach State)라고 불리는 곳은?'), r: B('Georgia', '조지아'), w: [B('Texas', '텍사스'), B('Maine', '메인')] }] },
  { t: B('Rain comes from clouds. Tiny drops of water join together. When they get heavy, they fall. Rain helps plants grow.', '비는 구름에서 와요. 작은 물방울들이 모여요. 무거워지면 떨어져요. 비는 식물이 자라도록 도와줘요.'), q: [{ ask: B('Where does rain come from?', '비는 어디에서 올까요?'), r: B('Clouds', '구름'), w: [B('The sun', '해'), B('The ground', '땅')] }, { ask: B('Why is rain helpful?', '비는 왜 도움이 될까요?'), r: B('It helps plants grow.', '식물이 자라도록 도와줘요.'), w: [B('It makes snow.', '눈을 만들어요.'), B('It makes wind.', '바람을 만들어요.')] }] },
  { t: B('A sea turtle lives in the ocean. It has flippers to swim. A mother turtle lays eggs on the sand. Baby turtles hatch and go to the sea.', '바다거북은 바다에 살아요. 헤엄칠 수 있는 지느러미발이 있어요. 엄마 거북은 모래에 알을 낳아요. 아기 거북이 알에서 나와 바다로 가요.'), q: [{ ask: B('Where does a mother turtle lay eggs?', '엄마 거북은 어디에 알을 낳을까요?'), r: B('On the sand', '모래 위'), w: [B('In a tree', '나무 위'), B('In the snow', '눈 속')] }, { ask: B('What helps a sea turtle swim?', '바다거북이 헤엄치는 데 도움이 되는 것은?'), r: B('Flippers', '지느러미발'), w: [B('Wings', '날개'), B('Hooves', '발굽')] }] },
  { t: B('The sun is a star. It gives us light and heat. Plants need the sun to grow. Never look right at the sun.', '해는 별이에요. 우리에게 빛과 열을 줘요. 식물은 자라려면 해가 필요해요. 해를 똑바로 쳐다보면 안 돼요.'), q: [{ ask: B('What does the sun give us?', '해는 우리에게 무엇을 줄까요?'), r: B('Light and heat', '빛과 열'), w: [B('Rain and snow', '비와 눈'), B('Wind and sand', '바람과 모래')] }, { ask: B('What is this text mostly about?', '이 글은 주로 무엇에 대한 글일까요?'), r: B('The sun', '해'), w: [B('The moon', '달'), B('A tree', '나무')] }] },
  { t: B('Dogs are good pets. They need food, water, and a walk each day. A dog can learn tricks. Many dogs love to play fetch.', '개는 좋은 반려동물이에요. 매일 먹이, 물, 산책이 필요해요. 개는 재주를 배울 수 있어요. 많은 개가 공 물어 오기를 좋아해요.'), q: [{ ask: B('What do dogs need each day?', '개는 매일 무엇이 필요할까요?'), r: B('Food, water, and a walk', '먹이, 물, 산책'), w: [B('A bath and a haircut', '목욕과 이발'), B('A new toy', '새 장난감')] }, { ask: B('What can a dog learn?', '개가 배울 수 있는 것은?'), r: B('Tricks', '재주'), w: [B('Reading', '글 읽기'), B('Driving', '운전')] }] },
  { t: B('There are four seasons. Spring is warm and rainy. Summer is hot. Fall has cool days and falling leaves. Winter is cold.', '계절은 네 가지예요. 봄은 따뜻하고 비가 와요. 여름은 더워요. 가을은 시원하고 낙엽이 떨어져요. 겨울은 추워요.'), q: [{ ask: B('How many seasons are there?', '계절은 몇 가지일까요?'), r: B('Four', '4가지'), w: [B('Two', '2가지'), B('Six', '6가지')] }, { ask: B('Which season has falling leaves?', '낙엽이 떨어지는 계절은?'), r: B('Fall', '가을'), w: [B('Summer', '여름'), B('Spring', '봄')] }] },
  { t: B('A map shows where places are. A compass rose shows north, south, east, and west. A map key tells what the pictures mean.', '지도는 장소가 어디에 있는지 보여 줘요. 나침반 장미는 북, 남, 동, 서를 보여 줘요. 지도 범례는 그림이 무슨 뜻인지 알려 줘요.'), q: [{ ask: B('What does a compass rose show?', '나침반 장미는 무엇을 보여 줄까요?'), r: B('Directions', '방향'), w: [B('Colors', '색깔'), B('Names', '이름')] }, { ask: B('What does a map key tell you?', '지도 범례는 무엇을 알려 줄까요?'), r: B('What the pictures mean', '그림이 무슨 뜻인지'), w: [B('How old the map is', '지도가 얼마나 오래됐는지'), B('Who drew the map', '누가 지도를 그렸는지')] }] },
  { t: B('Plants need water, air, light, and food from the soil. The roots take in water. The stem holds the plant up. Leaves make food from sunlight.', '식물은 물, 공기, 빛, 흙 속의 양분이 필요해요. 뿌리는 물을 빨아들여요. 줄기는 식물을 받쳐 줘요. 잎은 햇빛으로 양분을 만들어요.'), q: [{ ask: B('What do roots do?', '뿌리는 무엇을 할까요?'), r: B('Take in water', '물을 빨아들여요'), w: [B('Make flowers', '꽃을 만들어요'), B('Hold up the leaves', '잎을 받쳐요')] }, { ask: B('What holds the plant up?', '식물을 받쳐 주는 것은?'), r: B('The stem', '줄기'), w: [B('The roots', '뿌리'), B('The leaves', '잎')] }] },
  { t: B('Georgia is a state in the United States. Its capital is Atlanta. Many peaches grow in Georgia. The state bird is the brown thrasher.', '조지아는 미국의 한 주예요. 주도는 애틀랜타예요. 조지아에서는 복숭아가 많이 자라요. 주를 상징하는 새는 브라운 트래셔예요.'), q: [{ ask: B('What is the capital of Georgia?', '조지아의 주도는 어디일까요?'), r: B('Atlanta', '애틀랜타'), w: [B('Savannah', '서배너'), B('Macon', '메이컨')] }, { ask: B('What is the state bird?', '조지아의 주 상징 새는?'), r: B('The brown thrasher', '브라운 트래셔'), w: [B('The eagle', '독수리'), B('The robin', '개똥지빠귀')] }] }
];
const TEXTFEAT = [[B('Which part tells the name of a book or story?', '책이나 이야기의 이름을 알려 주는 부분은?'), B('Title', '제목'), [B('Page number', '쪽 번호'), B('Picture', '그림')]], [B('Which part shows what something looks like?', '어떤 것이 어떻게 생겼는지 보여 주는 부분은?'), B('Picture', '그림'), [B('Title', '제목'), B('Page number', '쪽 번호')]], [B('Which part tells what a picture shows?', '그림이 무엇을 보여 주는지 설명하는 글은?'), B('Caption', '그림 설명'), [B('Title', '제목'), B('Page number', '쪽 번호')]], [B('Which part helps you find a chapter?', '어떤 장을 찾도록 도와주는 부분은?'), B('Table of contents', '차례'), [B('Caption', '그림 설명'), B('Picture', '그림')]], [B('Which part tells what a section is about?', '한 부분이 무엇에 대한 내용인지 알려 주는 것은?'), B('Heading', '소제목'), [B('Page number', '쪽 번호'), B('Picture', '그림')]], [B('Which part tells you where you are in a book?', '책에서 내가 어디쯤 있는지 알려 주는 것은?'), B('Page number', '쪽 번호'), [B('Title', '제목'), B('Heading', '소제목')]]];
G1R({
  id: 'factdet', icon: '🕵️', title: B('Fact Detective', '사실 탐정'), sub: B('Main topic, details, text parts', '주제, 세부 내용, 글의 부분'), u: 'Informational text',
  play() {
    if (rnd(4) === 0) { const f = pick(TEXTFEAT); quiz(this, { ask: f[0], opts: [f[1], ...f[2]].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('Text parts help you find and understand facts.', '글의 여러 부분이 정보를 찾고 이해하는 데 도움이 돼요.') }); return; }
    const x = pick(FACTS), q = pick(x.q);
    quiz(this, { ask: q.ask, show: `<div class="storytext">${L(x.t)}</div>`, opts: [q.r, ...q.w].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('Find the answer in the text.', '글에서 답을 찾아봐요.') });
  }
});

// ---------- 12. Fix the sentence ----------
const FIXES = [
  [1, 'The dog can run.', 'the dog can run.', 'The dog can run'], [1, 'I like peaches.', 'i like peaches.', 'I like peaches'], [1, 'Can we play?', 'Can we play.', 'can we play?'], [1, 'Look at that!', 'Look at that.', 'look at that!'],
  [1, 'Mia and I went home.', 'Mia and i went home.', 'mia and I went home.'], [1, 'Where is my hat?', 'Where is my hat.', 'Where is my hat!'], [1, 'I love my cat!', 'I love my cat?', 'I love my cat'],
  [1, 'I see two dogs.', 'I see two dog.', 'I see two dogges.'], [1, 'She has three boxes.', 'She has three boxs.', 'She has three box.'], [1, 'We ate six peaches.', 'We ate six peachs.', 'We ate six peach.'], [1, 'I have two wishes.', 'I have two wishs.', 'I have two wish.'],
  [1, 'Ben is jumping.', 'Ben is jump.', 'Ben is jumpping.'], [1, 'She walked home.', 'She walk home.', 'She walkd home.'], [1, 'The dog barks.', 'The dog bark.', 'The dog barkes.'], [1, 'We are playing.', 'We are play.', 'We are plaing.'], [1, 'He helped me.', 'He help me.', 'He helpd me.'],
  [1, 'The big dog ran.', 'The dog big ran.', 'Big the dog ran.'], [1, 'I have a red hat.', 'I have a hat red.', 'I have red a hat.'],
  [2, 'We live in Georgia.', 'We live in georgia.', 'we live in Georgia.'], [2, 'My name is Ben.', 'My name is ben.', 'my name is Ben.'], [2, 'Sam lives in Atlanta.', 'sam lives in atlanta.', 'Sam lives in atlanta.'], [2, 'We go to Lake Lanier.', 'We go to lake lanier.', 'We go to Lake lanier.'],
  [2, 'On Monday, we play.', 'On monday, we play.', 'on Monday, we play.'], [2, 'Today is Friday.', 'Today is friday.', 'today is Friday.'], [2, 'I like red, blue, and green.', 'I like red blue and green.', 'I like, red blue, and green.'], [2, 'It is May 5, 2025.', 'It is May 5 2025.', 'It is, May 5 2025.'],
  [2, 'Lily ran to the park.', 'lily ran to the park.', 'Lily ran to the park'], [2, 'Did you see the stars?', 'Did you see the stars.', 'did you see the stars?'], [2, 'The cats are sleeping.', 'The cats are sleep.', 'The cat are sleeping.'], [2, 'She jumped over the log.', 'She jump over the log.', 'She jumpd over the log.']
];
G1W({
  id: 'fixsent', icon: '🖍️', title: B('Fix the Sentence', '문장 고치기'), sub: B('Capitals, end marks, plurals, verbs', '대문자, 문장부호, 복수, 동사'), u: 'Grammar',
  play() {
    const lv = lvl('fixsent'), pool = FIXES.filter(f => f[0] <= lv), f = pick(pool);
    quiz(this, { ask: B('Which sentence is written correctly?', '바르게 쓴 문장은 어느 것일까요?'), opts: wordOpts(f[1], [f[2], f[3]]), cls: 'words sents', after: B(f[1], f[1]), vocab: f[1] });
  }
});

// ---------- 13. Word detective ----------
const WORDM = [
  [1, B('Which word means the SAME as "big"?', '"big"와 뜻이 같은 낱말은?'), 'large', ['tiny', 'slow']], [1, B('Which word means the SAME as "happy"?', '"happy"와 뜻이 같은 낱말은?'), 'glad', ['sad', 'angry']], [1, B('Which word is the OPPOSITE of "hot"?', '"hot"의 반대말은?'), 'cold', ['warm', 'wet']], [1, B('Which word is the OPPOSITE of "up"?', '"up"의 반대말은?'), 'down', ['over', 'high']],
  [1, B('Which word means to walk slowly for fun?', '재미로 천천히 걷는다는 뜻의 낱말은?'), 'stroll', ['sprint', 'jump']], [1, B('Which word means to run very fast?', '아주 빨리 달린다는 뜻의 낱말은?'), 'sprint', ['stroll', 'crawl']], [1, B('Which word means to talk very loudly?', '아주 크게 말한다는 뜻의 낱말은?'), 'shout', ['whisper', 'hum']], [1, B('Which word means very small?', '아주 작다는 뜻의 낱말은?'), 'tiny', ['huge', 'tall']],
  [1, B('Which word means very big?', '아주 크다는 뜻의 낱말은?'), 'huge', ['tiny', 'thin']], [1, B('Which word means to look quickly?', '재빨리 본다는 뜻의 낱말은?'), 'glance', ['stare', 'study']], [1, B('Which word means to eat in tiny bites?', '조금씩 베어 먹는다는 뜻의 낱말은?'), 'nibble', ['gobble', 'pour']], [1, B('Which word is the OPPOSITE of "open"?', '"open"의 반대말은?'), 'closed', ['wide', 'broken']],
  [2, B('What does "unhappy" mean?', '"unhappy"는 무슨 뜻일까요?'), 'not happy', ['very happy', 'happy again']], [2, B('What does "unlock" mean?', '"unlock"은 무슨 뜻일까요?'), 'open the lock', ['close the lock', 'lock again']], [2, B('What does "redo" mean?', '"redo"는 무슨 뜻일까요?'), 'do again', ['do not do', 'do first']], [2, B('What does "retell" mean?', '"retell"은 무슨 뜻일까요?'), 'tell again', ['never tell', 'tell first']],
  [2, B('What does "helpful" mean?', '"helpful"은 무슨 뜻일까요?'), 'full of help', ['without help', 'help again']], [2, B('What does "careless" mean?', '"careless"는 무슨 뜻일까요?'), 'without care', ['full of care', 'care again']], [2, B('What does "unkind" mean?', '"unkind"는 무슨 뜻일까요?'), 'not kind', ['very kind', 'kind again']],
  [2, B('What is the base word in "jumping"?', '"jumping"의 기본 낱말은?'), 'jump', ['jumpi', 'ing']], [2, B('What is the base word in "played"?', '"played"의 기본 낱말은?'), 'play', ['playe', 'ed']], [2, B('What is the base word in "walks"?', '"walks"의 기본 낱말은?'), 'walk', ['walks', 'wal']], [2, B('What is the base word in "unhappy"?', '"unhappy"의 기본 낱말은?'), 'happy', ['unhap', 'un']], [2, B('What is the base word in "helpful"?', '"helpful"의 기본 낱말은?'), 'help', ['helpf', 'ful']],
  [2, B('The puppy was tiny. It fit in my hand. What does "tiny" mean?', '강아지는 tiny했어요. 내 손에 쏙 들어갔어요. "tiny"는 무슨 뜻일까요?'), 'very small', ['very loud', 'very fast']], [2, B('It was freezing outside. I wore my warm coat. What does "freezing" mean?', '밖은 freezing했어요. 나는 따뜻한 코트를 입었어요. "freezing"은 무슨 뜻일까요?'), 'very cold', ['very wet', 'very bright']], [2, B('The soup was delicious. I ate it all! What does "delicious" mean?', '수프가 delicious했어요. 다 먹었어요! "delicious"는 무슨 뜻일까요?'), 'tastes very good', ['looks funny', 'feels cold']]
];
G1R({
  id: 'wordmeaning', icon: '🔎', title: B('Word Detective', '단어 탐정'), sub: B('Meanings, opposites, word parts', '뜻, 반대말, 낱말의 부분'), u: 'Word meaning',
  play() {
    const lv = lvl('wordmeaning'), w = pick(WORDM.filter(x => x[0] <= lv));
    quiz(this, { ask: w[1], opts: wordOpts(w[2], w[3]), cls: 'words sents', after: B(`${w[2]}`, `${w[2]}`), vocab: w[2] });
  }
});

// ---------- 14. Join it ----------
const JOINS = [
  ['I like apples ___ I like grapes.', '나는 사과를 좋아해요 ___ 포도도 좋아해요.', 'and', ['but', 'because']], ['Mia ran ___ jumped.', '미아는 달렸어요 ___ 뛰었어요.', 'and', ['but', 'so']], ['The cat is small ___ it is loud.', '고양이는 작아요 ___ 시끄러워요.', 'but', ['so', 'because']], ['I want to play ___ it is raining.', '놀고 싶어요 ___ 비가 와요.', 'but', ['so', 'because']],
  ['It is cold, ___ I wear a coat.', '추워요, ___ 코트를 입어요.', 'so', ['but', 'and']], ['I am hungry, ___ I eat a snack.', '배가 고파요, ___ 간식을 먹어요.', 'so', ['but', 'because']], ['I smile ___ I am happy.', '나는 웃어요 ___ 행복해서요.', 'because', ['so', 'but']], ['We stay inside ___ it is raining.', '우리는 안에 있어요 ___ 비가 오기 때문이에요.', 'because', ['so', 'but']],
  ['Ben is tired, ___ he keeps playing.', '벤은 피곤해요, ___ 계속 놀아요.', 'but', ['so', 'because']], ['I have a dog ___ a cat.', '나는 개 ___ 고양이가 있어요.', 'and', ['but', 'so']], ['The sun came out, ___ we went to the park.', '해가 났어요, ___ 우리는 공원에 갔어요.', 'so', ['but', 'because']], ['I put on my boots ___ the grass was wet.', '장화를 신었어요 ___ 풀이 젖었기 때문이에요.', 'because', ['so', 'but']],
  ['Lily likes pizza, ___ she does not like onions.', '릴리는 피자를 좋아해요, ___ 양파는 싫어해요.', 'but', ['so', 'because']], ['We can swim ___ we can run.', '우리는 수영할 수 있고 ___ 달릴 수도 있어요.', 'and', ['but', 'because']], ['He is sad ___ he lost his toy.', '그는 슬퍼요 ___ 장난감을 잃어버렸기 때문이에요.', 'because', ['so', 'but']], ['The bag is heavy, ___ I ask Dad to help.', '가방이 무거워요, ___ 아빠에게 도와 달라고 해요.', 'so', ['but', 'and']]
];
G1W({
  id: 'joinit', icon: '🔗', title: B('Join It', '문장 잇기'), sub: B('and, but, so, because', 'and, but, so, because'), u: 'Joining ideas',
  play() {
    const j = pick(JOINS), filled = j[0].replace('___', '<span class="qbox">?</span>');
    quiz(this, { ask: B('Which word joins the ideas?', '두 생각을 이어 주는 낱말은?'), askSay: B(j[0].replace('___', 'blank'), j[1].replace('___', '')), show: `<div class="bigword sent">${filled}</div>`, opts: wordOpts(j[2], j[3]), cls: 'words', after: B(j[0].replace('___', j[2]), j[1].replace('___', j[2])), vocab: j[0].replace('___', j[2]) });
  }
});

// ---------- 15. Writing starter (tiles) ----------
const WSTART = [
  [1, ['I', 'like', 'peaches.'], '🍑', B('I like peaches.', '나는 복숭아를 좋아해요.')], [1, ['Dogs', 'can', 'run.'], '🐕', B('Dogs can run.', '개는 달릴 수 있어요.')], [1, ['The', 'sun', 'is', 'hot.'], '☀️', B('The sun is hot.', '해는 뜨거워요.')], [1, ['Bees', 'make', 'honey.'], '🐝', B('Bees make honey.', '벌은 꿀을 만들어요.')], [1, ['I', 'see', 'a', 'bird.'], '🐦', B('I see a bird.', '새가 보여요.')], [1, ['We', 'play', 'at', 'school.'], '🏫', B('We play at school.', '우리는 학교에서 놀아요.')],
  [2, ['I', 'like', 'peaches', 'because', 'they', 'are', 'sweet.'], '🍑', B('I like peaches because they are sweet.', '복숭아는 달아서 좋아해요.')], [2, ['Plants', 'need', 'water', 'and', 'light.'], '🌱', B('Plants need water and light.', '식물은 물과 빛이 필요해요.')], [2, ['First,', 'I', 'ate', 'breakfast.'], '🥣', B('First, I ate breakfast.', '먼저 아침을 먹었어요.')], [2, ['Next,', 'I', 'went', 'to', 'school.'], '🚌', B('Next, I went to school.', '다음에 학교에 갔어요.')], [2, ['I', 'think', 'dogs', 'are', 'fun', 'because', 'they', 'play.'], '🐶', B('I think dogs are fun because they play.', '개는 같이 놀아서 재미있다고 생각해요.')], [2, ['Georgia', 'is', 'called', 'the', 'Peach', 'State.'], '🍑', B('Georgia is called the Peach State.', '조지아는 복숭아의 주라고 불려요.')]
];
G1W({
  id: 'writestarter', icon: '✍️', title: B('Writing Starter', '글쓰기 시작'), sub: B('Build opinion, fact and story sentences', '생각, 사실, 이야기 문장 만들기'), u: 'Sentences',
  play() {
    const lv = lvl('writestarter'), w = pick(WSTART.filter(x => x[0] === lv)), extraPool = ['and', 'the', 'is', 'we', 'big', 'then', 'very'].filter(x => !w[1].includes(x));
    tileRound(this, { ask: B('Put the words in order to build a sentence!', '낱말을 차례로 놓아 문장을 만들어요!'), show: `<span class="emo">${w[2]}</span>`, target: w[1], extra: others(extraPool, '', 1), speakTiles: false, after: w[3], vocab: L(B(w[3].en, w[3].en)) });
  }
});
