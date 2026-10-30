'use strict';
// Grade 2 reading, writing and language (Georgia's K-12 ELA Standards, 2023, K-2 band; GCPS AKS areas A-F).
// Foundations 2.F.P: vowel patterns, two-syllable words, syllable types, nonsense words, irregular words, spelling.
// Language 2.L: grammar (plurals, nouns, pronouns, verbs, adjectives, adverbs, punctuation), vocabulary (word parts, multiple meanings, homophones).
// Texts 2.T: fables and folktales (message, characters, structure), informational text (main idea, text features, procedures), poems.
const AREA2R = (u) => B(`Grade 2 Reading · ${u}`, `2학년 읽기 · ${U_KO[u] || u}`);
const AREA2W = (u) => B(`Grade 2 Writing · ${u}`, `2학년 쓰기 · ${U_KO[u] || u}`);
const G2R = (g) => registerGame(Object.assign({ grade: '2', subject: 'read' }, g, { area: AREA2R(g.u) }));
const G2W = (g) => registerGame(Object.assign({ grade: '2', subject: 'write' }, g, { area: AREA2W(g.u) }));

// ---------- 1. Vowel patterns: r-controlled, diphthongs, vowel teams ----------
const VPAT = {
  ar: [['car', '🚗'], ['star', '⭐'], ['barn', '🏚️'], ['shark', '🦈'], ['yard', '🏡']],
  or: [['corn', '🌽'], ['fork', '🍴'], ['horse', '🐴'], ['storm', '⛈️']],
  'er/ir/ur': [['bird', '🐦'], ['shirt', '👕'], ['turtle', '🐢'], ['girl', '👧'], ['nurse', '🧑‍⚕️'], ['fern', '🌿']],
  'ow/ou': [['cow', '🐄'], ['house', '🏠'], ['mouse', '🐭'], ['clown', '🤡'], ['owl', '🦉'], ['cloud', '☁️']],
  'oi/oy': [['coin', '🪙'], ['boy', '👦'], ['toy', '🧸'], ['oil', '🛢️'], ['soil', '🌱']],
  'aw/au': [['paw', '🐾'], ['saw', '🪚'], ['claw', '🦀'], ['sauce', '🥫'], ['straw', '🥤']],
  'ai/ay': [['rain', '🌧️'], ['train', '🚂'], ['tray', '🍽️'], ['hay', '🌾'], ['snail', '🐌']],
  'ee/ea': [['tree', '🌳'], ['bee', '🐝'], ['leaf', '🍃'], ['seal', '🦭'], ['peach', '🍑']],
  'oa/ow': [['boat', '⛵'], ['goat', '🐐'], ['snow', '❄️'], ['bowl', '🥣'], ['coat', '🧥']]
};
G2R({
  id: 'vowels2', icon: '🔠', title: B('Vowel Teams and Bossy R', '모음 짝꿍과 R 모음'), sub: B('ar, or, er, ow, oi, aw, ai, ee, oa', 'ar, or, er, ow, oi, aw, ai, ee, oa'), u: 'Vowel patterns',
  play() {
    const lv = lvl('vowels2'), keys = Object.keys(VPAT), k = pick(lv === 1 ? keys.slice(0, 6) : keys), kind = pick(lv === 1 ? ['pic', 'pic', 'letters'] : ['pic', 'letters', 'spell']);
    if (kind === 'pic') { const right = pick(VPAT[k]), others_ = shuffle(keys.filter(x => x !== k)).slice(0, 2).map(x => pick(VPAT[x])); quiz(this, { ask: B(`Which picture has the "${k}" sound in its name?`, `이름에 "${k}" 소리가 들어 있는 그림은?`), show: `<div class="bigword">${k}</div>`, opts: [right, ...others_].map((x, i) => ({ html: `<span class="emo">${x[1]}</span>`, label: x[0], ok: i === 0 })), after: B(`${right[0]} has "${k}".`, `${right[0]}에 들어 있는 소리: "${k}"`), vocab: right[0] }); }
    else if (kind === 'letters') { const w = pick(VPAT[k]), ds = shuffle(keys.filter(x => x !== k)).slice(0, 2); quiz(this, { ask: B(`Which letters make the vowel sound in "${w[0]}"?`, `"${w[0]}"의 모음 소리를 만드는 글자는?`), show: `<span class="emo">${w[1]}</span>`, opts: [k, ...ds].map(x => ({ html: `<span class="num">${x}</span>`, ok: x === k })), cls: 'words', after: B(`${w[0]}: ${k}`, `${w[0]}: ${k}`), vocab: w[0] }); }
    else { const w = pick(VPAT[k]), word = w[0], bad = [...new Set([word.replace(/ar|or|ir|ur|er|ow|ou|oi|oy|aw|au|ai|ay|ee|ea|oa/, m => (m.length === 2 ? m[1] + m[0] : m)), word.slice(0, -1) + (word.endsWith('e') ? '' : 'e'), word.replace(/(.)\1/, '$1')])].filter(x => x !== word && x.length > 2).slice(0, 2); if (bad.length < 2) { this.play(); return; } quiz(this, { ask: B('Which is the correct spelling for the picture?', '그림에 맞는 철자는?'), show: `<span class="emo">${w[1]}</span>`, opts: wordOpts(word, bad), cls: 'words', after: B(`${word}`, `${word}`), vocab: word }); }
  }
});

// ---------- 2. Syllable types ----------
const SYLT = [
  ['rabbit', 'rab-bit', 'closed', '🐰'], ['napkin', 'nap-kin', 'closed', '🧻'], ['basket', 'bas-ket', 'closed', '🧺'], ['pumpkin', 'pump-kin', 'closed', '🎃'], ['picnic', 'pic-nic', 'closed', '🧺'],
  ['tiger', 'ti-ger', 'open', '🐯'], ['robot', 'ro-bot', 'open', '🤖'], ['music', 'mu-sic', 'open', '🎵'], ['paper', 'pa-per', 'open', '📄'], ['spider', 'spi-der', 'open', '🕷️'],
  ['cupcake', 'cup-cake', 'vce', '🧁'], ['inside', 'in-side', 'vce', '🏠'], ['sunshine', 'sun-shine', 'vce', '☀️'], ['homemade', 'home-made', 'vce', '🍞'],
  ['rainbow', 'rain-bow', 'vowelteam', '🌈'], ['teapot', 'tea-pot', 'vowelteam', '🫖'], ['seaweed', 'sea-weed', 'vowelteam', '🌿'], ['playground', 'play-ground', 'vowelteam', '🛝'],
  ['carpet', 'car-pet', 'rcontrolled', '🟥'], ['market', 'mar-ket', 'rcontrolled', '🏪'], ['corner', 'cor-ner', 'rcontrolled', '📐'], ['turkey', 'tur-key', 'rcontrolled', '🦃'],
  ['table', 'ta-ble', 'cle', '🪑'], ['candle', 'can-dle', 'cle', '🕯️'], ['puzzle', 'puz-zle', 'cle', '🧩'], ['bubble', 'bub-ble', 'cle', '🫧']
];
const SYLN = { closed: B('closed (ends in a consonant)', '닫힌 음절(자음으로 끝남)'), open: B('open (ends in a vowel)', '열린 음절(모음으로 끝남)'), vce: B('vowel-consonant-e (magic e)', '모음-자음-e (마법의 e)'), vowelteam: B('vowel team (two vowels, one sound)', '모음 짝꿍(모음 둘, 소리 하나)'), rcontrolled: B('r-controlled (vowel + r)', 'R 모음(모음 + r)'), cle: B('consonant-le (ends in -le)', '자음+le(-le로 끝남)') };
G2R({
  id: 'syllables2', icon: '🧩', title: B('Syllable Types', '음절의 종류'), sub: B('Split, sort and read two-syllable words', '두 음절 낱말을 나누고 읽어요'), u: 'Syllables',
  play() {
    const lv = lvl('syllables2'), t = pick(SYLT), [w, sp, type, e] = t, parts = sp.split('-'), kind = pick(lv === 1 ? ['split', 'count', 'join'] : ['split', 'type', 'type', 'join']);
    if (kind === 'split') { const all = []; for (let i = 1; i < w.length; i++) { const c = w.slice(0, i) + '-' + w.slice(i); if (c !== sp) all.push(c); } quiz(this, { ask: B(`How do you split "${w}" into syllables?`, `"${w}" 낱말을 음절로 나누면?`), show: `<span class="emo">${e}</span>`, opts: wordOpts(sp, shuffle(all).slice(0, 2)), cls: 'words', after: B(sp, sp), vocab: w }); }
    else if (kind === 'count') quiz(this, { ask: B(`How many syllables are in "${w}"?`, `"${w}"의 음절은 몇 개일까요?`), show: `<div class="bigword">${e} ${w}</div>`, opts: numO(2, [1, 3], 1, 4), after: B(sp, sp), vocab: w });
    else if (kind === 'join') quiz(this, { ask: B(`Put the syllables together: ${parts.join(' + ')}`, `음절을 합쳐요: ${parts.join(' + ')}`), show: `<span class="emo">${e}</span>`, opts: wordOpts(w, [parts[1] + parts[0], parts[0] + parts[0]].filter(x => x !== w)), cls: 'words', after: B(`${w}`, `${w}`), vocab: w });
    else { const first = type !== 'cle' && type !== 'vce', syl = first ? parts[0] : parts[1], ds = shuffle(Object.keys(SYLN).filter(x => x !== type)).slice(0, 2); quiz(this, { ask: B(`What kind of syllable is "${syl}" in "${w}"?`, `"${w}"에서 "${syl}" 부분은 어떤 음절일까요?`), show: `<div class="bigword">${parts.map(p => p === syl ? `<u>${p}</u>` : p).join(' · ')}</div>`, opts: [type, ...ds].map(k => ({ html: `<span class="word">${L(SYLN[k])}</span>`, ok: k === type })), cls: 'words sents', after: B(`${syl}: ${SYLN[type].en}`, `${syl}: ${SYLN[type].ko}`) }); }
  }
});

// ---------- 3. Silly two-syllable words ----------
const SILLY2 = ['vabnit', 'kimpet', 'tolden', 'fenlob', 'mapzen', 'sulbig', 'rabnet', 'pogwin', 'dutlam', 'zentab', 'lorkin', 'bipsun', 'canvod', 'hiplet', 'yostel'];
const REAL2 = ['rabbit', 'napkin', 'basket', 'pumpkin', 'picnic', 'magnet', 'pencil', 'kitten', 'sunset', 'window', 'ribbon', 'puppet', 'muffin', 'cactus', 'carpet'];
G2R({
  id: 'silly2', icon: '🤪', title: B('Silly Long Words', '긴 엉터리 낱말'), sub: B('Sound out two-syllable nonsense words', '두 음절 엉터리 낱말 읽기'), u: 'Decoding',
  play() {
    const lv = lvl('silly2'), kind = pick(lv === 1 ? ['which', 'which', 'count'] : ['which', 'count', 'split']), w = pick(SILLY2);
    if (kind === 'which') quiz(this, { ask: B('Sound them out. Which one is a SILLY word (not a real word)?', '소리 내어 읽어 봐요. 진짜 낱말이 아닌 엉터리 낱말은?'), askSay: B('Which one is a silly word, not a real word?', '진짜 낱말이 아닌 엉터리 낱말은?'), opts: wordOpts(w, shuffle(REAL2).slice(0, 2)), cls: 'words', after: B(`"${w}" is a silly word, but you can still read it!`, `"${w}" 같은 엉터리 낱말도 읽을 수 있어요!`), vocab: w });
    else if (kind === 'count') quiz(this, { ask: B(`How many syllables are in the silly word "${w}"?`, `엉터리 낱말 "${w}"의 음절은 몇 개일까요?`), show: `<div class="bigword">${w}</div>`, opts: numO(2, [1, 3], 1, 3), after: B(`${w.slice(0, 3)}-${w.slice(3)}`, `${w.slice(0, 3)}-${w.slice(3)}`), vocab: w });
    else { const sp = w.slice(0, 3) + '-' + w.slice(3), others_ = []; for (let i = 1; i < w.length; i++) { const c = w.slice(0, i) + '-' + w.slice(i); if (c !== sp) others_.push(c); } quiz(this, { ask: B(`Split "${w}" into syllables (between the two consonants).`, `"${w}" 낱말을 두 자음 사이에서 음절로 나눠요.`), show: `<div class="bigword">${w}</div>`, opts: wordOpts(sp, shuffle(others_).slice(0, 2)), cls: 'words', after: B(sp, sp), vocab: w }); }
  }
});

// ---------- 4. Tricky words (grade 2) ----------
const TRICKY2 = [['because', 'I smile ___ it is fun.', '재미있어서 웃어요: ___.', ['becuz', 'becase']], ['thought', 'I ___ about my pet.', '나는 내 반려동물을 ___.', ['thot', 'thougt']], ['through', 'We walked ___ the park.', '우리는 공원을 ___ 걸어갔어요.', ['thru', 'throu']], ['enough', 'I have ___ food.', '음식이 ___.', ['enuf', 'enogh']], ['laugh', 'The clown made us ___.', '광대가 우리를 ___.', ['laf', 'lagh']], ['answer', 'Raise your hand to ___.', '손을 들고 ___.', ['anser', 'anwser']], ['heard', 'I ___ a loud noise.', '큰 소리를 ___.', ['herd', 'hurd']], ['eight', 'I have ___ crayons.', '크레용이 ___ 개 있어요.', ['ate', 'eigt']], ['neighbor', 'My ___ is kind.', '내 ___은 친절해요.', ['nabor', 'neigbor']], ['whole', 'I ate the ___ pie.', '나는 파이를 ___ 먹었어요.', ['hole', 'whol']], ['island', 'An ___ has water all around.', '___은 사방이 물이에요.', ['iland', 'islend']], ['young', 'A puppy is a ___ dog.', '강아지는 ___ 개예요.', ['yung', 'yong']], ['country', 'The United States is a ___.', '미국은 ___예요.', ['cuntry', 'countrey']], ['mountain', 'We hiked up the ___.', '우리는 ___에 올랐어요.', ['mountin', 'mountan']], ['favorite', 'Red is my ___ color.', '빨강은 내가 가장 ___ 색이에요.', ['favrite', 'faverit']], ['listen', 'Please ___ to me.', '내 말을 ___ 주세요.', ['lisen', 'listin']], ['minute', 'Wait one ___.', '1 ___만 기다려요.', ['minit', 'minuet']], ['early', 'We woke up ___.', '우리는 ___ 일어났어요.', ['erly', 'earley']], ['earth', 'We live on ___.', '우리는 ___에 살아요.', ['erth', 'earht']], ['learn', 'I want to ___ to swim.', '나는 수영을 ___ 싶어요.', ['lern', 'learne']], ['pretty', 'The flower is ___.', '꽃이 ___.', ['prity', 'pritty']], ['beautiful', 'What a ___ day!', '정말 ___ 날이에요!', ['beutiful', 'beautifull']], ['busy', 'Mom is ___ today.', '엄마는 오늘 ___.', ['bizzy', 'busey']], ['climb', 'Squirrels ___ trees.', '다람쥐는 나무에 ___.', ['clime', 'clim']], ['knew', 'I ___ the answer.', '나는 답을 ___.', ['new', 'nue']], ['wrote', 'She ___ a letter.', '그녀는 편지를 ___.', ['rote', 'wroat']], ['again', 'Let us play ___.', '___ 놀아요.', ['agen', 'agian']], ['great', 'You did a ___ job.', '___ 해냈어요.', ['grate', 'greit']], ['friend', 'A good ___ shares.', '좋은 ___는 나눠요.', ['frend', 'freind']], ['people', 'Many ___ were there.', '많은 ___이 있었어요.', ['peple', 'peeple']]];
G2R({
  id: 'tricky2', icon: '🪄', title: B('Tricky Words', '까다로운 낱말'), sub: B('Remember the spelling', '철자를 기억해요'), u: 'Sight words',
  play() {
    const lv = lvl('tricky2'), t = pick(lv === 1 ? TRICKY2.slice(0, 18) : TRICKY2), [w, sent, ko, ds] = t, filled = sent.replace('___', '<span class="qbox">?</span>');
    quiz(this, { ask: B('Which word fits? Pick the right spelling.', '문장에 맞는 낱말은? 철자가 맞는 것을 골라요.'), askSay: B('Which word fits? Pick the right spelling.', '문장에 맞는 낱말은? 철자가 맞는 것을 골라요.'), askExtra: { t: sent.replace('___', 'blank'), lang: 'en-US' }, show: `<div class="bigword sent">${filled}</div>`, opts: wordOpts(w, ds), cls: 'words', after: B(sent.replace('___', w), `${sent.replace('___', w)} (${ko.replace('___', '…')})`), vocab: sent.replace('___', w) });
  }
});

// ---------- 5. Spell it (two syllables, tiles) ----------
const SPELL2A = [[['ta', 'ble'], '🪑', B('table', '탁자')], [['can', 'dle'], '🕯️', B('candle', '초')], [['pur', 'ple'], '🟣', B('purple', '보라색')], [['rain', 'bow'], '🌈', B('rainbow', '무지개')], [['tur', 'tle'], '🐢', B('turtle', '거북이')], [['car', 'pet'], '🟥', B('carpet', '카펫')], [['flow', 'er'], '🌸', B('flower', '꽃')], [['pic', 'nic'], '🧺', B('picnic', '소풍')], [['pa', 'per'], '📄', B('paper', '종이')], [['sun', 'shine'], '☀️', B('sunshine', '햇빛')], [['mon', 'key'], '🐵', B('monkey', '원숭이')], [['but', 'ter', 'fly'], '🦋', B('butterfly', '나비')], [['el', 'e', 'phant'], '🐘', B('elephant', '코끼리')], [['hel', 'i', 'cop', 'ter'], '🚁', B('helicopter', '헬리콥터')]];
G2W({
  id: 'spell2', icon: '🔡', title: B('Spell Longer Words', '긴 낱말 철자 쓰기'), sub: B('Build words from syllables', '음절로 낱말 만들기'), u: 'Spelling',
  play() {
    const lv = lvl('spell2'), t = pick(lv === 1 ? SPELL2A.slice(0, 10) : SPELL2A), pool = ['ing', 'er', 'tion', 'ly', 'ful', 'ble', 'ter', 'ment', 'ing', 'ket'].filter(x => !t[0].includes(x));
    tileRound(this, { ask: B('Spell the word. Tap the syllables in order!', '음절을 차례로 눌러 낱말의 철자를 완성해요!'), show: `<span class="emo">${t[1]}</span>`, target: t[0], extra: shuffle(pool).slice(0, 2), speakTiles: false, after: B(`${t[0].join('')}!`, `${t[0].join('')} — ${t[2].ko}!`), vocab: t[0].join('') });
  }
});

// ---------- 6. Word parts: prefixes, suffixes, compounds ----------
const WPARTS = [
  ['un', 'happy', 'unhappy', B('not happy', '행복하지 않은')], ['un', 'lock', 'unlock', B('open the lock', '자물쇠를 열다')], ['un', 'kind', 'unkind', B('not kind', '친절하지 않은')], ['re', 'read', 'reread', B('read again', '다시 읽다')], ['re', 'play', 'replay', B('play again', '다시 놀다')], ['re', 'write', 'rewrite', B('write again', '다시 쓰다')],
  ['pre', 'heat', 'preheat', B('heat before', '미리 데우다')], ['pre', 'school', 'preschool', B('school before kindergarten', '유치원 전의 학교')], ['dis', 'like', 'dislike', B('not like', '좋아하지 않다')], ['dis', 'agree', 'disagree', B('not agree', '동의하지 않다')], ['mis', 'spell', 'misspell', B('spell wrongly', '잘못 쓰다')], ['mis', 'place', 'misplace', B('put in the wrong place', '엉뚱한 곳에 두다')]
];
const WSUFF = [['help', 'ful', 'helpful', B('full of help', '도움이 가득한')], ['care', 'ful', 'careful', B('full of care', '조심하는')], ['joy', 'ful', 'joyful', B('full of joy', '기쁨이 가득한')], ['help', 'less', 'helpless', B('without help', '도움이 없는')], ['care', 'less', 'careless', B('without care', '조심성 없는')], ['fear', 'less', 'fearless', B('without fear', '두려움 없는')], ['quick', 'ly', 'quickly', B('in a quick way', '빠르게')], ['slow', 'ly', 'slowly', B('in a slow way', '느리게')], ['teach', 'er', 'teacher', B('a person who teaches', '가르치는 사람')], ['sing', 'er', 'singer', B('a person who sings', '노래하는 사람')], ['tall', 'est', 'tallest', B('the tallest', '가장 키가 큰')], ['fast', 'est', 'fastest', B('the fastest', '가장 빠른')]];
const COMPD = [['sun', 'flower', 'sunflower'], ['rain', 'coat', 'raincoat'], ['foot', 'ball', 'football'], ['bed', 'room', 'bedroom'], ['butter', 'fly', 'butterfly'], ['cup', 'cake', 'cupcake'], ['snow', 'man', 'snowman'], ['pop', 'corn', 'popcorn'], ['air', 'plane', 'airplane'], ['star', 'fish', 'starfish']];
G2R({
  id: 'wordparts2', icon: '🧱', title: B('Word Parts', '낱말의 부분'), sub: B('Prefixes, endings, compound words', '앞붙임, 뒷붙임, 합친 낱말'), u: 'Word study',
  play() {
    const lv = lvl('wordparts2'), kind = pick(lv === 1 ? ['prefix', 'suffix', 'compound'] : ['prefix', 'suffix', 'meaning', 'meaning', 'compound', 'base']);
    if (kind === 'prefix') { const t = pick(WPARTS), ds = [t[1] + t[0], t[0] + t[0] + t[1]].filter(x => x !== t[2]); quiz(this, { ask: B(`Add the prefix: ${t[0]}- + ${t[1]} = ?`, `앞붙임을 붙여요: ${t[0]}- + ${t[1]} = ?`), show: '', opts: wordOpts(t[2], ds), cls: 'words', after: B(`${t[2]} means ${L(t[3])}.`, `"${t[2]}"의 뜻: ${t[3].ko}`), vocab: t[2] }); }
    else if (kind === 'suffix') { const t = pick(WSUFF), ds = [t[0] + 'e' + t[1], t[1] + t[0]].filter(x => x !== t[2]); quiz(this, { ask: B(`Add the ending: ${t[0]} + -${t[1]} = ?`, `뒷붙임을 붙여요: ${t[0]} + -${t[1]} = ?`), show: '', opts: wordOpts(t[2], ds), cls: 'words', after: B(`${t[2]} means ${L(t[3])}.`, `"${t[2]}"의 뜻: ${t[3].ko}`), vocab: t[2] }); }
    else if (kind === 'meaning') { const t = pick([...WPARTS, ...WSUFF]), others_ = shuffle([...WPARTS, ...WSUFF].filter(x => x !== t)).slice(0, 2); quiz(this, { ask: B(`What does "${t[2]}" mean?`, `"${t[2]}"의 뜻은 무엇일까요?`), show: '', opts: [t, ...others_].map((x, i) => ({ html: `<span class="word">${L(x[3])}</span>`, ok: i === 0 })), cls: 'words sents', after: B(`${t[2]}: ${t[3].en}`, `${t[2]}: ${t[3].ko}`), vocab: t[2] }); }
    else if (kind === 'base') { const t = pick([...WPARTS, ...WSUFF]), ds = shuffle(['ing', 'ed', t[2].slice(0, -1), t[0] === t[2].slice(0, t[0].length) ? t[0] : t[1]]).filter(x => x !== t[0 === 1 ? 0 : 1]).slice(0, 2); const base = t[2].startsWith(t[0]) && WPARTS.includes(t) ? t[1] : t[0]; const opts = [base, ...shuffle([t[2].slice(0, 2), t[2].slice(-3), 'ing', 'ed'].filter(x => x !== base)).slice(0, 2)]; quiz(this, { ask: B(`What is the base (root) word in "${t[2]}"?`, `"${t[2]}"에서 바탕이 되는 낱말은?`), show: '', opts: wordOpts(base, opts.slice(1)), cls: 'words', after: B(`${t[2]} = ${WPARTS.includes(t) ? t[0] + ' + ' + t[1] : t[0] + ' + ' + t[1]}`, `${t[2]} = ${t[0]} + ${t[1]}`), vocab: base }); }
    else { const c = pick(COMPD), ds = shuffle(COMPD.filter(x => x !== c)).slice(0, 2).map(x => x[0] + c[1]).filter(x => x !== c[2]); quiz(this, { ask: B(`Which compound word is made from "${c[0]}" + "${c[1]}"?`, `"${c[0]}" + "${c[1]}"로 만든 합친 낱말은?`), show: '', opts: wordOpts(c[2], ds.length === 2 ? ds : [c[1] + c[0], c[0] + c[0]]), cls: 'words', after: B(`${c[0]} + ${c[1]} = ${c[2]}`, `${c[0]} + ${c[1]} = ${c[2]}`), vocab: c[2] }); }
  }
});

// ---------- 7. Nouns and pronouns ----------
const PLUR = [['mouse', 'mice', 'mouses'], ['foot', 'feet', 'foots'], ['child', 'children', 'childs'], ['man', 'men', 'mans'], ['tooth', 'teeth', 'tooths'], ['goose', 'geese', 'gooses'], ['woman', 'women', 'womans'], ['baby', 'babies', 'babys'], ['puppy', 'puppies', 'puppys'], ['lady', 'ladies', 'ladys'], ['fox', 'foxes', 'foxs'], ['dish', 'dishes', 'dishs']];
const COLL = [['birds', 'flock', ['pack', 'herd']], ['cows', 'herd', ['flock', 'swarm']], ['wolves', 'pack', ['herd', 'bunch']], ['fish', 'school', ['flock', 'team']], ['bees', 'swarm', ['herd', 'pack']], ['players', 'team', ['herd', 'swarm']]];
G2W({
  id: 'grammar2a', icon: '🅰️', title: B('Nouns and Pronouns', '명사와 대명사'), sub: B('Plurals, collective nouns, pronouns', '복수형, 모임 이름, 대명사'), u: 'Grammar',
  play() {
    const lv = lvl('grammar2a'), kind = pick(lv === 1 ? ['plural', 'plural', 'proper', 'pron'] : ['plural', 'collective', 'proper', 'pron', 'reflexive', 'plural']);
    if (kind === 'plural') { const p = pick(lv === 1 ? PLUR.slice(0, 7) : PLUR), n = 2 + rnd(5); quiz(this, { ask: B(`One ${p[0]}, two ___.`, `${p[0]} 하나, ${p[0]} 둘은 ___.`), show: '', opts: wordOpts(p[1], [p[2], p[0]]), cls: 'words', after: B(`${p[0]} → ${p[1]}`, `${p[0]} → ${p[1]}`), vocab: p[1] }); }
    else if (kind === 'collective') { const c = pick(COLL); quiz(this, { ask: B(`A ___ of ${c[0]}`, `${c[0]}의 ___`), show: '', opts: wordOpts(c[1], c[2]), cls: 'words', after: B(`a ${c[1]} of ${c[0]}`, `a ${c[1]} of ${c[0]}`), vocab: `a ${c[1]} of ${c[0]}` }); }
    else if (kind === 'proper') { const s = pick([['We live in Georgia.', 'We live in georgia.', 'we live in Georgia.'], ['Lily visited Atlanta.', 'lily visited atlanta.', 'Lily visited atlanta.'], ['My friend Ben likes soccer.', 'My friend ben likes soccer.', 'my friend Ben likes soccer.'], ['We saw the Chattahoochee River.', 'We saw the chattahoochee river.', 'We saw the Chattahoochee river.'], ['Mia and I went to Lake Lanier.', 'Mia and i went to lake lanier.', 'Mia and I went to lake Lanier.']]); quiz(this, { ask: B('Which sentence uses capital letters correctly for names and places?', '이름과 장소에 대문자를 바르게 쓴 문장은?'), opts: wordOpts(s[0], [s[1], s[2]]), cls: 'words sents', after: B(s[0], s[0]), vocab: s[0] }); }
    else if (kind === 'pron') { const p = pick([['Ben is my friend. ___ likes to run.', 'He', ['Him', 'His']], ['Mia has a kite. ___ kite is red.', 'Her', ['She', 'Hers']], ['The dogs are loud. ___ bark all day.', 'They', ['Them', 'Their']], ['Give the ball to Sam. Give it to ___.', 'him', ['he', 'his']], ['Lily and I play. ___ play together.', 'We', ['Us', 'Our']], ['The book is mine. It is ___ book.', 'my', ['me', 'I']]]); quiz(this, { ask: B('Which pronoun fits?', '어떤 대명사가 알맞을까요?'), show: `<div class="bigword sent">${p[0].replace('___', '<span class="qbox">?</span>')}</div>`, opts: wordOpts(p[1], p[2]), cls: 'words', after: B(p[0].replace('___', p[1]), p[0].replace('___', p[1])), vocab: p[1] }); }
    else { const p = pick([['I made it by ___.', 'myself', ['me', 'mine']], ['Ben hurt ___.', 'himself', ['him', 'his']], ['Mia looked at ___ in the mirror.', 'herself', ['her', 'she']], ['We cleaned the room by ___.', 'ourselves', ['us', 'our']]]); quiz(this, { ask: B('Which reflexive pronoun fits (a "-self" word)?', '"-self"가 붙는 대명사 중 알맞은 것은?'), show: `<div class="bigword sent">${p[0].replace('___', '<span class="qbox">?</span>')}</div>`, opts: wordOpts(p[1], p[2]), cls: 'words', after: B(p[0].replace('___', p[1]), p[0].replace('___', p[1])), vocab: p[1] }); }
  }
});

// ---------- 8. Verbs, adjectives, adverbs ----------
const IRR = [['run', 'ran', 'runned'], ['eat', 'ate', 'eated'], ['see', 'saw', 'seed'], ['go', 'went', 'goed'], ['draw', 'drew', 'drawed'], ['fly', 'flew', 'flied'], ['give', 'gave', 'gived'], ['write', 'wrote', 'writed'], ['swim', 'swam', 'swimmed'], ['take', 'took', 'taked'], ['come', 'came', 'comed'], ['sing', 'sang', 'singed']];
G2W({
  id: 'grammar2b', icon: '🏃', title: B('Verbs, Adjectives, Adverbs', '동사, 형용사, 부사'), sub: B('Past tense, describing words, compare', '과거형, 꾸며 주는 말, 비교'), u: 'Grammar',
  play() {
    const lv = lvl('grammar2b'), kind = pick(lv === 1 ? ['past', 'past', 'adj', 'prep'] : ['past', 'adv', 'compare', 'prep', 'past', 'adj']);
    if (kind === 'past') { const v = pick(lv === 1 ? IRR.slice(0, 6) : IRR); quiz(this, { ask: B(`Yesterday, I ___ . (${v[0]})`, `어제 나는 ___. (${v[0]})`), show: '', opts: wordOpts(v[1], [v[2], v[0]]), cls: 'words', after: B(`${v[0]} → ${v[1]}`, `${v[0]} → ${v[1]}`), vocab: v[1] }); }
    else if (kind === 'adj') { const s = pick([['The ___ cat sleeps.', 'fluffy', ['quickly', 'runs']], ['I ate a ___ peach.', 'juicy', ['slowly', 'eat']], ['We saw a ___ rainbow.', 'bright', ['loudly', 'sing']], ['She wore a ___ hat.', 'red', ['gently', 'jump']]]); quiz(this, { ask: B('Which describing word (adjective) fits the noun?', '명사를 꾸며 주는 낱말(형용사)은?'), show: `<div class="bigword sent">${s[0].replace('___', '<span class="qbox">?</span>')}</div>`, opts: wordOpts(s[1], s[2]), cls: 'words', after: B(s[0].replace('___', s[1]), s[0].replace('___', s[1])), vocab: s[1] }); }
    else if (kind === 'adv') { const s = pick([['The turtle walked ___.', 'slowly', ['slowness', 'slowed']], ['She sang ___.', 'happily', ['happy', 'happier']], ['He ran ___ to school.', 'quickly', ['quickness', 'quicken']], ['Please close the door ___.', 'gently', ['gentle', 'gentler']]]); quiz(this, { ask: B('Which word tells HOW? (adverb)', '"어떻게"를 말해 주는 낱말(부사)은?'), show: `<div class="bigword sent">${s[0].replace('___', '<span class="qbox">?</span>')}</div>`, opts: wordOpts(s[1], s[2]), cls: 'words', after: B(s[0].replace('___', s[1]), s[0].replace('___', s[1])), vocab: s[1] }); }
    else if (kind === 'compare') { const c = pick([['big', 'bigger', 'biggest'], ['tall', 'taller', 'tallest'], ['fast', 'faster', 'fastest'], ['small', 'smaller', 'smallest'], ['happy', 'happier', 'happiest'], ['good', 'better', 'best']]), two = rnd(2) === 0; quiz(this, { ask: two ? B(`Mia is ${c[0]}. Ben is ___ than Mia.`, `미아는 ${c[0]}해요. 벤은 미아보다 ___.`) : B(`Of all three, Sam is the ___.`, `셋 중에서 샘이 가장 ___.`), show: '', opts: wordOpts(two ? c[1] : c[2], [two ? c[2] : c[1], c[0]]), cls: 'words', after: B(`${c[0]}, ${c[1]}, ${c[2]}`, `${c[0]}, ${c[1]}, ${c[2]}`), vocab: two ? c[1] : c[2] }); }
    else { const s = pick([['The cup is ___ the table, right on the top.', 'on', ['in', 'under']], ['A bird sits ___ the tree, high on a branch.', 'in', ['under', 'across']], ['We walked ___ the bridge to get to the other side.', 'across', ['into', 'under']], ['The ball rolled ___ the couch and now I cannot see it.', 'under', ['over', 'across']]]); quiz(this, { ask: B('Which small word shows where? (preposition)', '"어디에"를 말해 주는 작은 낱말(전치사)은?'), show: `<div class="bigword sent">${s[0].replace('___', '<span class="qbox">?</span>')}</div>`, opts: wordOpts(s[1], s[2]), cls: 'words', after: B(s[0].replace('___', s[1]), s[0].replace('___', s[1])), vocab: s[1] }); }
  }
});

// ---------- 9. Punctuation ----------
const PUNCT = [
  [1, 'Can we play outside?', 'Can we play outside.', 'Can we play outside!'], [1, 'Watch out for the car!', 'Watch out for the car?', 'Watch out for the car,'], [1, 'It is time for lunch.', 'It is time for lunch?', 'It is time for lunch,'],
  [1, 'I like apples, pears, and plums.', 'I like apples pears and plums.', 'I like, apples pears, and plums.'], [1, 'It is May 5, 2026.', 'It is May 5 2026.', 'It is, May 5 2026.'], [1, 'I can\'t go today.', 'I cant go today.', 'I can,t go today.'],
  [1, 'Ben\'s dog is brown.', 'Bens dog is brown.', 'Ben\'s\' dog is brown.'], [1, 'She isn\'t here.', 'She isnt here.', 'She is\'nt here.'],
  [1, 'We don\'t have a map.', 'We dont have a map.', 'We do\'nt have a map.'],
  [1, 'The cat\'s bed is soft.', 'The cats bed is soft.', 'The cat\'s\' bed is soft.'],
  [1, 'I got a cup, a pen, and a hat.', 'I got a cup a pen and a hat.', 'I got, a cup a pen and a hat.'],
  [1, 'It is June 8, 2026.', 'It is June 8 2026.', 'It is, June 8 2026.'],
  [1, 'Where is my shoe?', 'Where is my shoe.', 'Where is my shoe,'], [1, 'We can\'t find the ball.', 'We cant find the ball.', 'We ca\'nt find the ball.'],
  [1, 'Sam\'s kite is red.', 'Sams kite is red.', 'Sam\'s\' kite is red.'], [1, 'I see a frog, a fish, and a duck.', 'I see a frog a fish and a duck.', 'I see, a frog a fish and a duck.'],
  [2, '"Come here," said Mom.', 'Come here, said Mom.', '"Come here" said Mom.'], [2, 'Dear Grandma,', 'Dear Grandma.', 'Dear, Grandma'], [2, 'Love, Mia', 'Love Mia.', 'Love; Mia'], [2, 'We live at 12 Oak Street, Lawrenceville, Georgia.', 'We live at 12 Oak Street Lawrenceville Georgia.', 'We live at, 12 Oak Street Lawrenceville, Georgia.'],
  [2, 'The dog\'s bone is big.', 'The dogs bone is big.', 'The dog\'s\' bone is big.'], [2, '"I am happy!" said Lily.', '"I am happy" said Lily.', 'I am happy! said Lily.'], [2, 'We packed shoes, socks, and a hat.', 'We packed shoes socks, and a hat.', 'We packed, shoes, socks and a hat.']
];
G2W({
  id: 'punct2', icon: '❝', title: B('Punctuation Pro', '문장 부호 박사'), sub: B('Commas, apostrophes, quotation marks', '쉼표, 어포스트로피, 따옴표'), u: 'Conventions',
  play() {
    const lv = lvl('punct2'), p = pick(PUNCT.filter(x => x[0] <= lv));
    quiz(this, { ask: B('Which one uses punctuation correctly?', '문장 부호를 바르게 쓴 것은?'), opts: wordOpts(p[1], [p[2], p[3]]), cls: 'words sents', after: B(p[1], p[1]), vocab: p[1] });
  }
});

// ---------- 10. Build longer sentences (tiles) ----------
const SENT2 = [
  [1, ['The', 'small', 'duck', 'swims', 'slowly.'], '🦆', B('The small duck swims slowly.', '작은 오리가 천천히 헤엄쳐요.')],
  [1, ['My', 'friend', 'reads', 'a', 'book.'], '📖', B('My friend reads a book.', '내 친구가 책을 읽어요.')],
  [1, ['We', 'eat', 'lunch', 'at', 'home.'], '🥣', B('We eat lunch at home.', '우리는 집에서 점심을 먹어요.')],
  [1, ['A', 'green', 'frog', 'jumps', 'high.'], '🐸', B('A green frog jumps high.', '초록 개구리가 높이 뛰어요.')],
  [2, ['The', 'happy', 'child', 'carried', 'a', 'blue', 'bag.'], '🎒', B('The happy child carried a blue bag.', '기분 좋은 아이가 파란 가방을 들고 갔어요.')],
  [2, ['Before', 'bed,', 'I', 'brush', 'my', 'teeth.'], '🪥', B('Before bed, I brush my teeth.', '잠자기 전에 이를 닦아요.')],
  [2, ['Our', 'class', 'painted', 'a', 'boat', 'together.'], '⛵', B('Our class painted a boat together.', '우리 반은 함께 배를 그렸어요.')],
  [1, ['The', 'big', 'dog', 'runs', 'fast.'], '🐕', B('The big dog runs fast.', '큰 개가 빨리 달려요.')], [1, ['We', 'play', 'at', 'the', 'park.'], '🛝', B('We play at the park.', '우리는 공원에서 놀아요.')], [1, ['My', 'cat', 'sleeps', 'on', 'the', 'bed.'], '🐱', B('My cat sleeps on the bed.', '내 고양이는 침대에서 자요.')], [1, ['I', 'see', 'a', 'red', 'bird.'], '🐦', B('I see a red bird.', '빨간 새가 보여요.')],
  [2, ['The', 'little', 'frog', 'jumped', 'into', 'the', 'pond.'], '🐸', B('The little frog jumped into the pond.', '작은 개구리가 연못으로 뛰어들었어요.')], [2, ['After', 'school,', 'we', 'ride', 'our', 'bikes.'], '🚲', B('After school, we ride our bikes.', '방과 후에 우리는 자전거를 타요.')], [2, ['Peaches', 'grow', 'on', 'trees', 'in', 'Georgia.'], '🍑', B('Peaches grow on trees in Georgia.', '조지아에서는 복숭아가 나무에서 자라요.')], [2, ['The', 'sun', 'shines', 'brightly', 'in', 'summer.'], '☀️', B('The sun shines brightly in summer.', '여름에는 해가 환하게 빛나요.')], [2, ['Mom', 'and', 'I', 'baked', 'a', 'sweet', 'pie.'], '🥧', B('Mom and I baked a sweet pie.', '엄마와 나는 달콤한 파이를 구웠어요.')]
];
G2W({
  id: 'sentence2', icon: '📝', title: B('Build a Sentence', '문장 만들기'), sub: B('Add describing words and places', '꾸며 주는 말과 장소 넣기'), u: 'Sentences',
  play() {
    const lv = lvl('sentence2'), s = pick(SENT2.filter(x => x[0] === lv)), extraPool = ['and', 'the', 'is', 'very', 'then', 'happy'].filter(x => !s[1].map(w => w.toLowerCase()).includes(x));
    tileRound(this, { ask: B('Put the words in order to build a sentence!', '낱말을 차례로 놓아 문장을 만들어요!'), show: `<span class="emo">${s[2]}</span>`, target: s[1], extra: others(extraPool, '', 1), speakTiles: false, after: s[3], vocab: s[3].en });
  }
});

// ---------- 11. Fables and folktales (original short stories) ----------
const FABLES = [
  { t: B('A hare laughed at a slow turtle and bragged, "I am so fast!" Then the hare took a nap under a tree. The turtle kept walking, step by step. When the hare woke up, the turtle was at the finish line.', '토끼가 느린 거북이를 놀리며 "나는 아주 빨라!" 하고 뽐냈어요. 토끼는 나무 아래에서 낮잠을 잤어요. 거북이는 한 걸음씩 계속 걸었어요. 토끼가 깨어났을 때 거북이는 결승선에 있었어요.'), msg: B('Keep going and do not brag.', '꾸준히 하고, 자랑하지 않아요.'), wrong: [B('Take a nap when you are tired.', '피곤하면 낮잠을 자요.'), B('The fastest runner wins the race.', '가장 빠른 동물이 경주에서 이겨요.')], who: [B('The hare', '토끼'), B('"I can run so fast!"', '"나는 아주 빨리 달릴 수 있어!"')], mid: B('The hare takes a nap.', '토끼가 낮잠을 자요.'), end: B('The turtle reaches the finish line first.', '거북이가 먼저 결승선에 도착해요.') },
  { t: B('A little ant carried a crumb. A grasshopper played music all day and did not store food. When winter came, the grasshopper was hungry. The ant shared a little, and the grasshopper promised to work next summer.', '작은 개미가 부스러기를 날랐어요. 베짱이는 하루 종일 음악만 연주하고 먹이를 모아 두지 않았어요. 겨울이 오자 베짱이는 배가 고팠어요. 개미가 조금 나눠 주었고, 베짱이는 다음 여름에는 일하겠다고 약속했어요.'), msg: B('Prepare and work today for tomorrow.', '내일을 위해 오늘 준비하고 일해요.'), wrong: [B('Wait until winter to gather food.', '겨울까지 기다렸다 먹이를 모아요.'), B('Friends should prepare food for you.', '친구가 내 먹이를 준비해야 해요.')], who: [B('The grasshopper', '베짱이'), B('The grasshopper promised to work next summer.', '베짱이가 다음 여름에는 일하겠다고 약속했어요.')], mid: B('Winter comes.', '겨울이 와요.'), end: B('The ant shares a little food.', '개미가 먹이를 조금 나눠 줘요.') },
  { t: B('A boy shouted, "Wolf, wolf," when there was no wolf. The farmers ran to help, but it was a trick. He did it again and again. One day a real wolf came. The boy shouted, but nobody came because nobody believed him.', '소년이 늑대가 없는데 "늑대다, 늑대다" 하고 외쳤어요. 농부들이 도우러 왔지만 장난이었어요. 소년은 몇 번이나 그랬어요. 어느 날 진짜 늑대가 왔어요. 소년이 외쳤지만 아무도 믿지 않아서 오지 않았어요.'), msg: B('Tell the truth, so people trust you.', '사람들이 믿도록 사실만 말해요.'), wrong: [B('Keep calling until people believe you.', '사람들이 믿을 때까지 계속 불러요.'), B('A funny joke makes people trust you.', '재미있는 농담을 하면 사람들이 믿어 줘요.')], who: [B('The boy', '소년'), B('"Help! A wolf!"', '"도와주세요! 늑대예요!"')], mid: B('The boy tricks the farmers.', '소년이 농부들을 속여요.'), end: B('Nobody comes when the real wolf appears.', '아무도 소년을 도우러 오지 않아요.') },
  { t: B('Two mice found one big piece of cheese. Each mouse pulled it to its own side. They tugged and tugged, but the cheese did not move. Then they pushed it together, and it rolled home.', '생쥐 두 마리가 큰 치즈 한 조각을 찾았어요. 서로 자기 쪽으로 끌어당겼어요. 끌고 또 끌었지만 치즈는 움직이지 않았어요. 그러다 함께 밀자 치즈가 굴러서 집에 도착했어요.'), msg: B('Working together gets things done.', '함께하면 일이 이뤄져요.'), wrong: [B('Cheese is heavy.', '치즈는 무거워요.'), B('Pull harder alone.', '혼자서 더 세게 당겨요.')], who: [B('The mice', '생쥐들'), B('They pushed it together.', '그들은 함께 밀었어요.')], mid: B('The mice pull in opposite ways.', '생쥐들이 각자 반대로 당겨요.'), end: B('The cheese rolls home.', '치즈가 굴러서 집에 가요.') },
  { t: B('A crow found a jug with a little water at the bottom. Her beak could not reach it. She dropped small stones into the jug, one by one. The water rose, and she took a long drink.', '까마귀가 바닥에 물이 조금 있는 병을 찾았어요. 부리가 닿지 않았어요. 까마귀는 작은 돌을 하나씩 병에 떨어뜨렸어요. 물이 올라와서 까마귀는 실컷 마셨어요.'), msg: B('Be clever and keep trying.', '꾀를 내고 계속 시도해요.'), wrong: [B('Wait for the water to rise.', '물이 저절로 오르기를 기다려요.'), B('Give up when the first try fails.', '첫 시도가 실패하면 포기해요.')], who: [B('The crow', '까마귀'), B('She dropped small stones into the jug.', '병에 작은 돌을 떨어뜨렸어요.')], mid: B('She drops stones into the jug.', '병에 돌을 떨어뜨려요.'), end: B('The water rises and she drinks.', '물이 올라와서 마셔요.') },
  { t: B('A tiny mouse ran over a sleeping lion and woke him. The lion was about to eat the mouse, but the mouse said, "Please let me go. I may help you someday." The lion laughed, but he let the mouse go.', '작은 생쥐가 나무 아래에서 자던 사자를 깨웠어요. 사자가 생쥐를 먹으려 하자 생쥐가 말했어요. "제발 보내 주세요. 언젠가 도와 드릴지도 몰라요." 사자는 웃었지만 생쥐를 놓아 주었어요.'), msg: B('Be kind, even to small friends.', '작은 친구에게도 친절하게 대해요.'), wrong: [B('Big animals do not need help.', '큰 동물은 도움이 필요 없어요.'), B('Small friends cannot help big ones.', '작은 친구는 큰 친구를 도울 수 없어요.')], who: [B('The mouse', '생쥐'), B('"Please let me go."', '"제발 보내 주세요."')], mid: B('The mouse asks to be let go.', '생쥐가 놓아 달라고 부탁해요.'), end: B('The lion lets the mouse go.', '사자가 생쥐를 놓아 줘요.') },
  { t: B('A young peach tree wanted to grow tall like the oak. Every day it stretched and complained. The gardener said, "Be patient. Your sweet peaches are your gift." In summer, children came to pick the juicy peaches, and the oak had none.', '어린 복숭아나무는 참나무처럼 크게 자라고 싶었어요. 매일 키를 뻗으며 투덜댔어요. 정원사가 "참을성을 가져라, 네 달콤한 복숭아가 네 선물이란다." 하고 말했어요. 여름이 되자 아이들이 즙이 많은 복숭아를 따러 왔고, 참나무에는 복숭아가 없었어요.'), msg: B('Be proud of what makes you special.', '나만의 특별함을 자랑스러워해요.'), wrong: [B('Tall trees are best.', '키 큰 나무가 최고예요.'), B('Complain until you get your way.', '원하는 걸 얻을 때까지 투덜대요.')], who: [B('The gardener', '정원사'), B('"Be patient. Your sweet peaches are your gift."', '"참을성을 가져라. 네 달콤한 복숭아가 네 선물이란다."')], mid: B('The tree complains about its size.', '나무가 자기 키에 대해 투덜대요.'), end: B('Children pick the juicy peaches in summer.', '여름에 아이들이 복숭아를 따요.') }
];
const localFableChoices = [
 [B('The hare','토끼'),B('The turtle','거북이'),B('The hare and turtle','토끼와 거북이'),B('The hare reaches the finish first.','토끼가 먼저 결승선에 도착해요.')],
 [B('The ant','개미'),B('The grasshopper','베짱이'),B('The ant and grasshopper together','개미와 베짱이가 함께'),B('The grasshopper stores food before winter.','베짱이가 겨울 전에 먹이를 모아요.')],
 [B('The boy','소년'),B('The farmers','농부들'),B('The wolf','늑대'),B('The farmers catch the wolf.','농부들이 늑대를 잡아요.')],
 [B('The mice','생쥐들'),B('The first mouse alone','첫 생쥐 혼자'),B('The second mouse alone','둘째 생쥐 혼자'),B('The mice pull the cheese apart.','생쥐들이 치즈를 둘로 나눠요.')],
 [B('The crow','까마귀'),B('The crow’s friend','까마귀의 친구'),B('The crow and a friend','까마귀와 친구가 함께'),B('The crow tips the jug over.','까마귀가 병을 넘어뜨려요.')],
 [B('The mouse','생쥐'),B('The lion','사자'),B('The lion and mouse together','사자와 생쥐가 함께'),B('The lion keeps the mouse captive.','사자가 생쥐를 계속 붙잡아요.')],
 [B('The gardener','정원사'),B('The peach tree','복숭아나무'),B('The children','아이들'),B('The peach tree outgrows the oak.','복숭아나무가 참나무보다 커져요.')]
];
G2R({
  id: 'fables', icon: '🦊', title: B('Fables and Folktales', '우화와 옛이야기'), sub: B('Lesson, characters, beginning-middle-end', '교훈, 인물, 처음-중간-끝'), u: 'Stories',
  play() {
    const lv = lvl('fables'), f = pick(FABLES), kind = pick(lv === 1 ? ['msg', 'mid', 'end'] : ['msg', 'msg', 'mid', 'end']);
    let ask, right, wrong;
    if (kind === 'msg') { ask = B('What is the lesson (central message) of the story?', '이야기의 교훈(중심 생각)은 무엇일까요?'); right = f.msg; wrong = f.wrong; }
    else if (kind === 'who') { ask = B(`Who says or does this? ${L(f.who[1])}`, `누가 이렇게 말하거나 행동했나요? ${f.who[1].ko}`); right = f.who[0]; wrong = localFableChoices[FABLES.indexOf(f)].slice(0,3).filter(x=>x.en!==right.en).slice(0,2); if (wrong.some(x => x.en === right.en)) { this.play(); return; } }
    else if (kind === 'mid') { ask = B('Which event happens in the MIDDLE?', '이야기 가운데에 일어나는 일은?'); right = f.mid; wrong = [f.end, localFableChoices[FABLES.indexOf(f)][3]]; }
    else { ask = B('How does the story END?', '이야기는 어떻게 끝날까요?'); right = f.end; wrong = [f.mid, localFableChoices[FABLES.indexOf(f)][3]]; }
    quiz(this, { ask, show: `<div class="storytext">${L(f.t)}</div>`, opts: [right, ...wrong].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('Check the story again.', '이야기를 다시 확인해 봐요.') });
  }
});

// ---------- 12. Informational text ----------
const INFO2 = [
  { title: B('How Peaches Grow', '복숭아가 자라는 방법'), t: B('Peach trees start as pits planted in soil. In spring, pink flowers bloom on the branches. After the flowers fall, small green fruit grows. By summer, the fruit turns soft, sweet, and juicy.', '복숭아나무는 씨를 흙에 심으면서 시작해요. 봄에는 가지에 분홍 꽃이 펴요. 꽃이 지면 작고 푸른 열매가 자라요. 여름이 되면 열매가 부드럽고 달콤하고 즙이 많아져요.'), q: [{ ask: B('What is the main idea?', '중심 생각은 무엇일까요?'), r: B('How peaches grow through the year', '복숭아가 한 해 동안 자라는 과정'), w: [B('Why peaches are pink', '복숭아가 왜 분홍색인지'), B('How to cook a pie', '파이 만드는 방법')] }, { ask: B('What happens after the flowers fall?', '꽃이 진 뒤에 무슨 일이 생기나요?'), r: B('Small green fruit grows.', '작고 푸른 열매가 자라요.'), w: [B('The tree turns pink.', '나무가 분홍색이 돼요.'), B('The pit is planted.', '씨를 심어요.')] }] },
  { title: B('The Water Cycle', '물의 순환'), t: B('The sun warms water in oceans and rivers. The water rises into the air as vapor. High up, it cools and forms clouds. Then the water falls as rain or snow and flows back to the ocean.', '해가 바다와 강의 물을 데워요. 물은 수증기가 되어 공기 중으로 올라가요. 높은 곳에서 식어서 구름이 돼요. 그러면 비나 눈이 되어 내리고 다시 바다로 흘러가요.'), q: [{ ask: B('What makes water rise into the air?', '무엇이 물을 공기 중으로 올라가게 할까요?'), r: B('The sun warms it.', '해가 데워 줘요.'), w: [B('The wind pulls it.', '바람이 끌어당겨요.'), B('The moon pushes it.', '달이 밀어 올려요.')] }, { ask: B('What happens right after clouds form?', '구름이 생긴 바로 다음에 무슨 일이 생기나요?'), r: B('Water falls as rain or snow.', '비나 눈이 되어 내려요.'), w: [B('The sun warms the ocean.', '해가 바다를 데워요.'), B('The vapor rises.', '수증기가 올라가요.')] }] },
  { title: B('How to Plant a Seed', '씨앗 심는 방법'), t: B('First, fill a cup with soil. Next, press a seed into the soil with your finger. Then add a little water. Last, put the cup in a sunny spot. In a week, a sprout may appear.', '먼저 컵에 흙을 가득 담아요. 다음에 손가락으로 씨앗을 흙에 눌러 넣어요. 그다음 물을 조금 줘요. 마지막으로 컵을 햇볕이 드는 곳에 둬요. 일주일 뒤에 싹이 날 수도 있어요.'), q: [{ ask: B('What do you do FIRST?', '맨 먼저 무엇을 하나요?'), r: B('Fill a cup with soil.', '컵에 흙을 담아요.'), w: [B('Add water.', '물을 줘요.'), B('Put the cup in the sun.', '컵을 햇볕에 둬요.')] }, { ask: B('What do you do LAST?', '맨 마지막에 무엇을 하나요?'), r: B('Put the cup in a sunny spot.', '컵을 햇볕이 드는 곳에 둬요.'), w: [B('Press the seed into the soil.', '씨앗을 흙에 눌러 넣어요.'), B('Fill the cup with soil.', '컵에 흙을 담아요.')] }] },
  { title: B('Honeybees', '꿀벌'), t: B('Honeybees live in a hive. Each bee has a job. Workers gather nectar from flowers. The queen lays eggs. Bees dance to tell others where the flowers are.', '꿀벌은 벌집에서 살아요. 벌마다 맡은 일이 있어요. 일벌은 꽃에서 꿀을 모아요. 여왕벌은 알을 낳아요. 벌들은 춤으로 꽃이 어디 있는지 알려 줘요.'), q: [{ ask: B('How do bees tell others where flowers are?', '벌은 꽃이 어디 있는지 어떻게 알려 줄까요?'), r: B('They dance.', '춤을 춰요.'), w: [B('They sing.', '노래를 불러요.'), B('They draw a map.', '지도를 그려요.')] }, { ask: B('What does the queen bee do?', '여왕벌은 무엇을 할까요?'), r: B('Lays eggs', '알을 낳아요'), w: [B('Gathers nectar', '꿀을 모아요'), B('Guards the flowers', '꽃을 지켜요')] }] },
  { title: B('Our Moon', '달'), t: B('The moon is a big ball of rock that goes around Earth. It does not make its own light. We see the moon because it reflects sunlight. Its shape seems to change over a month, from a thin crescent to a full circle.', '달은 지구 둘레를 도는 큰 바위 덩어리예요. 스스로 빛을 내지 않아요. 달이 햇빛을 반사해서 우리 눈에 보여요. 한 달 동안 가는 초승달에서 둥근 보름달까지 모양이 달라 보여요.'), q: [{ ask: B('Why can we see the moon?', '우리가 달을 볼 수 있는 이유는?'), r: B('It reflects sunlight.', '햇빛을 반사해요.'), w: [B('It makes its own light.', '스스로 빛을 내요.'), B('It is on fire.', '불타고 있어요.')] }, { ask: B('What does the moon go around?', '달은 무엇의 둘레를 돌까요?'), r: B('Earth', '지구'), w: [B('The sun', '해'), B('Mars', '화성')] }] }
];
const FEATQ = [[B('A picture has words below it that explain it. What are those words called?', '그림 아래에서 그림을 설명하는 글을 무엇이라고 할까요?'), B('caption', '그림 설명'), [B('title', '제목'), B('glossary', '낱말 풀이')]], [B('Which part tells what a word means at the back of a book?', '책 뒤에서 낱말의 뜻을 알려 주는 부분은?'), B('glossary', '낱말 풀이'), [B('index', '찾아보기'), B('caption', '그림 설명')]], [B('Which part lists topics with page numbers so you can find them fast?', '주제와 쪽 번호를 적어 빨리 찾게 해 주는 부분은?'), B('index', '찾아보기'), [B('glossary', '낱말 풀이'), B('title', '제목')]], [B('Words in bold print are often...', '굵은 글씨로 쓴 낱말은 보통...'), B('important vocabulary words', '중요한 낱말'), [B('the title', '제목'), B('a page number', '쪽 번호')]], [B('A subheading tells you...', '소제목은 무엇을 알려 줄까요?'), B('what the next part is about', '다음 부분이 무엇에 대한 내용인지'), [B('who drew the pictures', '누가 그림을 그렸는지'), B('how old the book is', '책이 얼마나 오래됐는지')]]];
G2R({
  id: 'info2', icon: '🔎', title: B('Fact Finder', '정보 탐정'), sub: B('Main idea, details, steps, text features', '중심 생각, 세부 내용, 순서, 글의 특징'), u: 'Informational text',
  play() {
    if(lvl('info2')===2){const r=pick([
 [B('Find a word’s meaning and then a page about it. Which pair helps?','낱말 뜻을 알아본 뒤 관련 쪽을 찾으려면 어느 두 부분을 볼까요?'),B('Glossary → index','낱말 풀이 → 찾아보기'),[B('Index → caption','찾아보기 → 그림 설명'),B('Title → author name','제목 → 지은이 이름')]],
 [B('Find a picture explanation and then the section’s topic. Which pair helps?','그림 설명을 읽고 그 부분의 주제를 알려면 어느 두 부분을 볼까요?'),B('Caption → subheading','그림 설명 → 소제목'),[B('Index → page number','찾아보기 → 쪽 번호'),B('Glossary → author name','낱말 풀이 → 지은이 이름')]],
 [B('A reader needs steps, rather than facts about an animal. Which text fits?','동물 정보 대신 차례대로 할 일을 찾고 있어요. 어떤 글이 알맞나요?'),B('How to Plant a Seed','씨앗 심는 방법'),[B('Honeybees','꿀벌'),B('Our Moon','달')]]]);quiz(this,{ask:r[0],opts:[r[1],...r[2]].map((a,i)=>({html:`<span class="word">${L(a)}</span>`,ok:i===0})),cls:'words sents',after:r[1]});return;}
    if (rnd(4) === 0) { const f = pick(FEATQ); quiz(this, { ask: f[0], opts: [f[1], ...f[2]].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('Text features help you find facts.', '글의 특징이 정보를 찾는 데 도움이 돼요.') }); return; }
    const x = pick(INFO2), q = pick(x.q);
    quiz(this, { ask: q.ask, show: `<div class="storytext"><b>${L(x.title)}</b><br>${L(x.t)}</div>`, opts: [q.r, ...q.w].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('Find the answer in the text.', '글에서 답을 찾아봐요.') });
  }
});

// ---------- 13. Words with more than one meaning, homophones, nuance ----------
const WN2 = [
  [1,B('"The duck swam in the pond." What does duck mean?','"The duck swam in the pond."에서 duck의 뜻은?'),B('a water bird','물새'),[B('lower your head','고개를 숙이다')]],
  [1,B('"Duck under the branch!" What does duck mean?','"Duck under the branch!"에서 duck의 뜻은?'),B('lower your head','고개를 숙이다'),[B('a water bird','물새')]],
  [1,B('"Please park the car here." What does park mean?','"Please park the car here."에서 park의 뜻은?'),B('leave a vehicle in a space','차를 세워 두다'),[B('a place to play outside','밖에서 노는 공원')]],
  [1,B('"We ran at the park." What does park mean?','"We ran at the park."에서 park의 뜻은?'),B('a place to play outside','밖에서 노는 공원'),[B('leave a vehicle in a space','차를 세워 두다')]],
  [1, B('"I wear a ring on my finger." What is a ring here?', '"I wear a ring on my finger."에서 ring은 무엇일까요?'), B('jewelry', '반지'), [B('a bell sound', '종소리')]],
  [1, B('"I heard the bell ring." What does ring mean here?', '"I heard the bell ring."에서 ring은 무슨 뜻일까요?'), B('make a sound', '소리를 내다'), [B('jewelry on a finger', '손가락에 끼는 반지')]],
  [1, B('"The bat flew out of the cave." What is a bat here?', '"The bat flew out of the cave."에서 bat은 무엇일까요?'), B('an animal', '동물'), [B('a baseball tool', '야구 방망이')]], [1, B('"I hit the ball with a bat." What is a bat here?', '"I hit the ball with a bat."에서 bat은 무엇일까요?'), B('a baseball tool', '야구 방망이'), [B('an animal', '동물')]],
  [1, B('"The dog\'s bark is loud." What is bark here?', '"The dog\'s bark is loud."에서 bark는 무엇일까요?'), B('a dog sound', '개가 짖는 소리'), [B('the outside of a tree', '나무껍질')]], [1, B('"The bark of the tree is rough." What is bark here?', '"The bark of the tree is rough."에서 bark는 무엇일까요?'), B('the outside of a tree', '나무껍질'), [B('a dog sound', '개가 짖는 소리')]],
  [1, B('Which word means the same as "shout"?', '"shout"와 뜻이 비슷한 낱말은?'), B('yell', '소리치다'), [B('whisper', '속삭이다'), B('hum', '흥얼거리다')]], [1, B('Which word is the opposite of "whisper"?', '"whisper"의 반대에 가까운 낱말은?'), B('shout', '소리치다'), [B('murmur', '중얼거리다'), B('mumble', '웅얼거리다')]],
  [2, B('Which word is stronger than "big"?', '"big"보다 더 강한 낱말은?'), B('enormous', '아주 거대한'), [B('tiny', '아주 작은'), B('little', '작은')]], [2, B('Which word means a bigger smile?', '"smile"보다 더 큰 웃음은?'), B('grin', '활짝 웃다'), [B('frown', '찡그리다'), B('sigh', '한숨 쉬다')]],
  [2, B('Which list has three words that all sound alike?', '소리가 같은 낱말 짝은?'), B('to, too, two', 'to, too, two'), [B('to, toe, tow', 'to, toe, tow')]], [2, B('I can ___ the ocean from here. (see / sea)', '여기서 바다가 ___. (see / sea)'), B('see', 'see'), [B('sea', 'sea')]], [2, B('The ___ is blue. (see / sea)', '___은(는) 파래요. (see / sea)'), B('sea', 'sea'), [B('see', 'see')]],
  [2, B('I ___ the answer yesterday. (new / knew)', '나는 어제 그 답을 ___. (new / knew)'), B('knew', 'knew'), [B('new', 'new')]], [2, B('Mia will ___ her name on the paper. (right / write)', '미아는 종이에 이름을 ___ 거예요. (right / write)'), B('write', 'write'), [B('right', 'right')]], [2, B('Please come ___ . (hear / here)', '이쪽으로 ___. (hear / here)'), B('here', 'here'), [B('hear', 'hear')]],
  [2, B('"She is as busy as a bee." This means she is...', '"She is as busy as a bee."는 그녀가...'), B('doing many tasks', '여러 일을 하다'), [B('afraid of bees', '벌을 무서워한다'), B('buzzing', '윙윙거린다')]], [2, B('"The snow was as soft as a pillow." What is it like?', '"The snow was as soft as a pillow."는 어떤 모습일까요?'), B('gentle and fluffy', '폭신폭신하다'), [B('hard and packed', '딱딱하게 뭉쳐 있다'), B('rough and gritty', '거칠고 까슬까슬하다')]]
];
G2R({
  id: 'wordnuance2', icon: '🔍', title: B('Word Meanings', '낱말의 뜻'), sub: B('Same spelling, same sound, shades of meaning', '철자가 같은 말, 소리가 같은 말, 미세한 뜻 차이'), u: 'Vocabulary',
  play() {
    const lv = lvl('wordnuance2'), w = pick(WN2.filter(x => x[0] <= lv));
    quiz(this, { ask: w[1], opts: [w[2], ...w[3]].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B(`${L(w[2])}`, `${w[2].ko}`), vocab: w[2].en });
  }
});

// ---------- 14. Paragraph skills ----------
const PARAS = [
  [B('I enjoy making art.', '나는 미술 활동을 좋아해요.'), [B('I draw boats with crayons.', '크레용으로 배를 그려요.'), B('I paint bright flowers.', '화사한 꽃을 색칠해요.')], B('That is why I enjoy making art.', '그래서 나는 미술 활동을 좋아해요.')],
  [B('Dogs make great pets.', '개는 훌륭한 반려동물이에요.'), [B('They are loyal and love to play.', '충직하고 노는 것을 좋아해요.'), B('They need food, water, and walks.', '먹이, 물, 산책이 필요해요.')], B('That is why many families love dogs.', '그래서 많은 가족이 개를 좋아해요.')],
  [B('Recess is my favorite part of school.', '학교에서 쉬는 시간이 가장 좋아요.'), [B('I play tag with my friends.', '친구들과 술래잡기를 해요.'), B('I swing as high as I can.', '그네를 힘껏 높이 타요.')], B('Recess makes my day fun.', '쉬는 시간 덕분에 하루가 즐거워요.')],
  [B('Peaches are a special fruit in Georgia.', '복숭아는 조지아의 특별한 과일이에요.'), [B('Many peach trees grow on farms.', '많은 복숭아나무가 농장에서 자라요.'), B('People pick peaches in summer.', '사람들은 여름에 복숭아를 따요.')], B('Georgia is proud of its peaches.', '조지아는 복숭아를 자랑스러워해요.')],
  [B('I like making paper models.','나는 종이 모형 만들기를 좋아해요.'),[B('I fold paper into boats.','종이를 접어 배를 만들어요.'),B('I glue paper into little houses.','종이를 붙여 작은 집을 만들어요.')],B('So I like making paper models.','그래서 종이 모형 만들기가 좋아요.')],
  [B('I enjoy music class.','나는 음악 수업을 좋아해요.'),[B('I tap a beat on a drum.','북을 두드려 박자를 쳐요.'),B('I sing with my friends.','친구들과 노래해요.')],B('That is why I enjoy music class.','그래서 나는 음악 수업을 좋아해요.')]
];
G2W({
  id: 'paragraph2', icon: '📃', title: B('Paragraph Builder', '문단 만들기'), sub: B('Topic sentence, details, closing', '주제 문장, 뒷받침 문장, 마무리'), u: 'Writing',
  play() {
    const lv = lvl('paragraph2'), p = pick(PARAS), kind = pick(lv === 1 ? ['topic', 'closing'] : ['topic', 'closing', 'detail', 'order']), sentences = [p[0], ...p[1], p[2]];
    if (kind === 'topic') quiz(this, { ask: B('Which sentence is the TOPIC sentence? (It tells the main idea first.)', '주제 문장은 어느 것일까요? (처음에 중심 생각을 말해 줘요.)'), show: `<div class="storytext">${sentences.slice(1).map(L).join(' ')}</div>`, opts: [p[0], p[1][0], p[2]].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('The topic sentence says what the paragraph is about.', '주제 문장은 문단이 무엇에 대한 글인지 말해 줘요.') });
    else if (kind === 'closing') quiz(this, { ask: B('Which sentence is the CLOSING sentence? (It wraps up the paragraph.)', '마무리 문장은 어느 것일까요? (문단을 정리해 줘요.)'), show: `<div class="storytext">${[p[0], ...p[1]].map(L).join(' ')}</div>`, opts: [p[2], p[0], p[1][0]].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('A closing sentence ends the paragraph.', '마무리 문장은 문단을 끝맺어요.') });
    else if (kind === 'detail') { const details=[
 [B('Which detail tells what you draw?','무엇을 그리는지 알려 주는 문장은?'),B('I keep crayons in a box.','크레용을 상자에 보관해요.'),B('I wash my paintbrush.','붓을 씻어요.')],
 [B('Which detail tells how dogs behave?','개가 어떻게 행동하는지 알려 주는 문장은?'),B('Their bowls are beside the door.','개 밥그릇은 문 옆에 있어요.'),B('Their leashes hang on a hook.','개 목줄은 고리에 걸려 있어요.')],
 [B('Which detail tells about a running game?','달리는 놀이를 알려 주는 문장은?'),B('I wait for my turn on the swing.','그네 탈 차례를 기다려요.'),B('I sit on a bench at recess.','쉬는 시간에 벤치에 앉아요.')],
 [B('Which detail tells where peaches grow?','복숭아가 자라는 곳을 알려 주는 문장은?'),B('Peaches are picked in summer.','여름에 복숭아를 따요.'),B('Peaches have a pit inside.','복숭아 속에는 씨가 있어요.')]
 ][PARAS.indexOf(p)] || [B('Which detail tells how the activity is done?','어떻게 활동하는지 알려 주는 문장은?'),B('I keep my supplies in a box.','도구를 상자에 보관해요.'),B('I put my bag by the door.','가방을 문 옆에 둬요.')]; quiz(this, { ask: details[0], show: `<div class="storytext">${L(p[0])}</div>`, opts: [p[1][0], details[1], details[2]].map((a, i) => ({ html: `<span class="word">${L(a)}</span>`, ok: i === 0 })), cls: 'words sents', after: B('Details tell more about the topic.', '뒷받침 문장은 주제를 더 자세히 말해 줘요.') }); }
    else { const right = '1 → 2 → 3 → 4', ord = [p[0], p[1][0], p[1][1], p[2]]; const order = shuffle([0, 1, 2, 3]); const lab = ['A', 'B', 'C', 'D']; const shown = order.map((o, i) => `${lab[i]}) ${L(ord[o])}`); const correct = order.map((o, i) => [o, lab[i]]).sort((a, b) => a[0] - b[0]).map(x => x[1]).join(' → '); const correct2 = order.map((o, i) => [o === 1 ? 2 : o === 2 ? 1 : o, lab[i]]).sort((a, b) => a[0] - b[0]).map(x => x[1]).join(' → '); const wrongs = [shuffle(['A', 'B', 'C', 'D']).join(' → '), shuffle(['A', 'B', 'C', 'D']).join(' → ')].filter(x => x !== correct && x !== correct2); const opts = [correct, ...wrongs].filter((v, i, ar) => ar.indexOf(v) === i); while (opts.length < 3) { const c = shuffle(['A', 'B', 'C', 'D']).join(' → '); if (!opts.includes(c) && c !== correct2) opts.push(c); } quiz(this, { ask: B('Put the sentences in order to make a good paragraph.', '문장을 알맞은 순서로 놓아 좋은 문단을 만들어요.'), show: `<div class="storytext">${shown.join('<br>')}</div>`, opts: opts.slice(0, 3).map(v => ({ html: `<span class="num eq">${v}</span>`, ok: v === correct })), cls: 'words', after: B('Topic first, details next, closing last.', '주제 문장, 뒷받침 문장, 마무리 문장 순서예요.') }); }
  }
});

// ---------- 15. Poems: rhyme, repetition, alliteration ----------
const RHYMEP = [['cat', 'hat', ['dog', 'sun']], ['moon', 'spoon', ['star', 'sky']], ['bee', 'tree', ['fly', 'bug']], ['light', 'night', ['day', 'sun']], ['rain', 'train', ['snow', 'wind']], ['play', 'day', ['night', 'game']], ['fox', 'box', ['dog', 'cat']], ['bell', 'shell', ['ring', 'sound']]];
const ALLIT = [[B('Peter picked purple peaches.', '피터는 보라색 복숭아를 땄어요.'), 'p'], [B('Silly snakes slide slowly.', '엉뚱한 뱀들이 천천히 미끄러져요.'), 's'], [B('Big bears bake brown bread.', '큰 곰들이 갈색 빵을 구워요.'), 'b'], [B('Little lizards leap and laugh.', '작은 도마뱀들이 뛰며 웃어요.'), 'l']];
G2R({
  id: 'poems2', icon: '🎶', title: B('Poem Playground', '시 놀이터'), sub: B('Rhyme, repeating sounds, similes', '끝부분 소리(라임), 반복되는 소리, 비유'), u: 'Poetry',
  play() {
    const lv = lvl('poems2'), kind = pick(lv === 1 ? ['rhyme', 'rhyme', 'finish'] : ['rhyme', 'finish', 'allit', 'simile']);
    if (kind === 'rhyme') { const r = pick(RHYMEP); quiz(this, { ask: B(`Which word rhymes with "${r[0]}"?`, `"${r[0]}" 낱말과 끝부분의 소리(라임)가 같은 낱말은?`), show: '', opts: wordOpts(r[1], r[2]), cls: 'words', after: B(`${r[0]} and ${r[1]} rhyme.`, `두 낱말 ${r[0]}, ${r[1]}의 끝부분 소리(라임)가 같아요.`), vocab: r[1] }); }
    else if (kind === 'finish') { const p = pick([['The cat sat on the mat.', 'It wore a funny ___.', 'mat', 'hat', ['cap', 'scarf']], ['I see a bee up in the tree.', 'It buzzed away from ___.', 'tree', 'me', ['you', 'us']], ['The sun is bright, a lovely sight.', 'We play outside until ___.', 'sight', 'night', ['noon', 'dark']], ['A frog sat on a log.', 'It saw a little ___.', 'log', 'dog', ['cat', 'bird']], ['Rain, rain, go away.', 'Come again another ___.', 'away', 'day', ['week', 'time']]]); quiz(this, { ask: B(`Which word rhymes with "${p[2]}" and finishes the line?`, `"${p[2]}"와(과) 라임이 맞고 줄을 완성하는 낱말은?`), show: `<div class="bigword sent">${p[0]}<br>${p[1].replace('___', '<span class="qbox">?</span>')}</div>`, opts: wordOpts(p[3], p[4]), cls: 'words', after: B(`${p[2]} and ${p[3]} rhyme.`, `${p[2]}와(과) ${p[3]}는 라임이 맞아요.`), vocab: p[1].replace('___', p[3]) }); }
    else if (kind === 'allit') { const a = pick(ALLIT), ds = shuffle(ALLIT.filter(x => x !== a)).slice(0, 2); quiz(this, { ask: B('Which line repeats the same beginning sound?', '같은 첫소리가 되풀이되는 줄은?'), show: '', opts: [a, ...ds, ].slice(0, 3).map((x, i) => ({ html: `<span class="word">${i === 0 ? x[0].en : ['The dog ran home.', 'We eat lunch at noon.', 'My bike is red.'][i - 1]}${S.lang === 'ko' ? `<br><small>${i === 0 ? x[0].ko : ['개가 집에 달려갔어요.', '우리는 점심을 먹어요.', '내 자전거는 빨개요.'][i - 1]}</small>` : ''}</span>`, ok: i === 0 })), cls: 'words sents', after: B(`Many words start with "${a[1]}".`, `"${a[1]}"로 시작하는 낱말이 많아요.`) }); }
    else { const s = pick([['as busy as a ___', 'bee', ['rock', 'chair']], ['as quiet as a ___', 'mouse', ['drum', 'lion']], ['as light as a ___', 'feather', ['truck', 'stone']], ['as brave as a ___', 'lion', ['mouse', 'pillow']]]); quiz(this, { ask: B('Finish the comparison (simile).', '비유 표현(~처럼)을 완성해 봐요.'), show: `<div class="bigword sent">${s[0].replace('___', '<span class="qbox">?</span>')}</div>`, opts: wordOpts(s[1], s[2]), cls: 'words', after: B(s[0].replace('___', s[1]), s[0].replace('___', s[1])), vocab: s[0].replace('___', s[1]) }); }
  }
});

// ---------- 16. ABC order and reference skills ----------
const ABCW = ['apple', 'banana', 'cherry', 'dolphin', 'eagle', 'frog', 'grape', 'horse', 'igloo', 'jelly', 'kite', 'lemon', 'mango', 'nest', 'orange', 'panda', 'queen', 'robot', 'sun', 'tiger', 'umbrella', 'violin', 'whale', 'yak', 'zebra'];
G2R({
  id: 'abc2', icon: '🔤', title: B('Alphabet Order', '알파벳 순서'), sub: B('Dictionary and glossary skills', '사전 찾기 기술'), u: 'Reference skills',
  play() {
    const lv = lvl('abc2'), kind = pick(lv === 1 ? ['first', 'order'] : ['order', 'order', 'guide', 'second']);
    if (kind === 'first') { const w = shuffle(ABCW).slice(0, 3).sort(), ans = w[0]; quiz(this, { ask: B('Which word comes FIRST in alphabetical order?', '알파벳 순서로 가장 먼저 오는 낱말은?'), show: '', opts: shuffle(w).map(x => ({ html: `<span class="word">${x}</span>`, ok: x === ans })), cls: 'words', after: B(`${w.join(', ')}`, `${w.join(', ')}`) }); }
    else if (kind === 'order') { const w = shuffle(ABCW).slice(0, 3).sort(), right = w.join(', '), cand = [right, [...w].reverse().join(', '), [w[1], w[0], w[2]].join(', ')]; quiz(this, { ask: B('Which list is in ABC order?', '알파벳 순서로 놓은 것은?'), show: '', opts: cand.map(v => ({ html: `<span class="word">${v}</span>`, ok: v === right })), cls: 'words sents', after: B(right, right) }); }
    else if (kind === 'second') { const set = [...pick([['bad', 'bag', 'bat'], ['can', 'cap', 'cat'], ['had', 'ham', 'hat'], ['mad', 'map', 'mat'], ['pan', 'pat', 'paw'], ['tag', 'tan', 'tap']])].sort(); quiz(this, { ask: B('The first 2 letters match, so look at the 3rd letter. Which word comes first?', '처음 두 글자가 같아요. 셋째 글자를 보고 가장 먼저 오는 낱말은?'), show: '', opts: shuffle(set).map(x => ({ html: `<span class="word">${x}</span>`, ok: x === set[0] })), cls: 'words', after: B(set.join(', '), set.join(', ')) }); }
    else { const w = shuffle(ABCW).slice(0, 3).sort(), guide = [w[0], w[2]], mid = w[1], outs = ABCW.filter(x => x < guide[0] || x > guide[1]); if (outs.length < 2) { this.play(); return; } const [out, out2] = shuffle(outs); quiz(this, { ask: B(`The guide words are "${guide[0]}" and "${guide[1]}". Which word is on this page?`, `이 페이지의 안내 낱말: "${guide[0]}", "${guide[1]}". 이 페이지에 있는 낱말은?`), show: '', opts: [mid, out, out2].map(x => ({ html: `<span class="word">${x}</span>`, ok: x === mid })), cls: 'words', after: B(`${guide[0]} < ${mid} < ${guide[1]}`, `${guide[0]} < ${mid} < ${guide[1]}`) }); }
  }
});

// 65: combine two different text-feature purposes, without changing the feature names.
(() => {
 const game=GAMES.find(g=>g.id==='info2'),old=game.play;
 const parts=[
  [B('Glossary','낱말 풀이'),B('find a word’s meaning','낱말 뜻을 찾기')],
  [B('Index','찾아보기'),B('find a topic’s page number','주제의 쪽 번호 찾기')],
  [B('Caption','그림 설명'),B('read about a picture','그림의 설명 읽기')],
  [B('Subheading','소제목'),B('find the topic of one section','한 부분의 주제 찾기')],
  [B('Title','제목'),B('find the book’s name','책 전체의 이름 찾기')]
 ];
 game.play=function(){if(lvl(this.id)===1)return old.call(this);const [a,b,c]=shuffle(parts),pair=(x,y)=>B(`${x[0].en} → ${y[0].en}`,`${x[0].ko} → ${y[0].ko}`);
 quiz(this,{ask:B(`First ${a[1].en}, then ${b[1].en}. Which pair helps?`,`먼저 ${a[1].ko}, 다음 ${b[1].ko}. 알맞은 짝은?`),opts:[pair(a,b),pair(b,a),pair(a,c)].map((x,i)=>({html:`<span class="word">${L(x)}</span>`,ok:i===0})),cls:'words sents'});};
})();
