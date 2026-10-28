'use strict';
(() => {
  'use strict';
  const words=[['sun','flower','sunflower','🌻'],['rain','bow','rainbow','🌈'],['snow','man','snowman','☃️'],['tooth','brush','toothbrush','🪥'],['cup','cake','cupcake','🧁'],['foot','ball','football','🏈'],['pop','corn','popcorn','🍿'],['pan','cake','pancake','🥞'],['butter','fly','butterfly','🦋'],['star','fish','starfish','⭐'],['mail','box','mailbox','📫'],['door','bell','doorbell','🔔']];
  registerGame({id:'compound',grade:'K',subject:'read',icon:'🧁',title:B('Word Sound Partners','낱말 소리 합치기'),sub:B('Join and take apart spoken words','말소리를 합치고 나눠요'),area:B('Reading · Compound words','읽기 · 합성어'),play(){
    const t=pick(words),lv=lvl('compound'),right=lv===1?t[2]:t[1],ds=shuffle(words.filter(x=>x!==t&&(lv===1||x[1]!==right))).filter((x,i,a)=>lv===1||a.findIndex(y=>y[1]===x[1])===i).slice(0,lv===1?2:3);
    const spoken=lv===1?`${t[0]}. ${t[1]}.`:`Say ${t[2]} without ${t[0]}.`;
    quiz(this,{ask:lv===1?B('Listen and join the two word sounds.','듣고 두 낱말 소리를 합쳐요.'):B('Listen and take away the first word.','듣고 앞 낱말 소리를 빼요.'),askExtra:{t:spoken,lang:'en-US'},show:`<div style="font-size:clamp(22px,4dvh,30px)" lang="en">${lv===1?`${t[0]} + ${t[1]}`:`${t[2]} − ${t[0]}`}</div>`,opts:[right,...ds.map(x=>lv===1?x[2]:x[1])].map((w,i)=>({html:`<span class="word" lang="en">${w}</span>`,ok:i===0})),cls:'words',vocab:right,
      onRender(){const rb=$('#spo');if(rb)rb.onclick=()=>$$('.opt .word').forEach((e,i)=>say(e.textContent,'en-US',i>0));},after:B(`${t[0]} + ${t[1]} = ${t[2]}`,`${t[0]} + ${t[1]} = ${t[2]}`)});
  }});
  registerGame({id:'bookway',grade:'K',subject:'read',icon:'📖',title:B('Follow the Book','책 읽는 방향'),sub:B('English books: start and follow','영어 책의 시작과 순서'),area:B('Reading · Book direction','읽기 · 책 방향'),play(){
    const lv=lvl('bookway'),rows=3,cols=2+rnd(4),row=rnd(3),col=rnd(cols-1),next=row*cols+col+1;
    const cells=Array.from({length:rows*cols},(_,i)=>{const x=12+(i%cols)*36,y=15+Math.floor(i/cols)*25;return `<rect x="${x}" y="${y}" width="36" height="18" rx="3" fill="${lv===2&&i===row*cols+col?'#ffd166':'#edf3f7'}" stroke="#435269"/><text x="${x+18}" y="${y+13}" text-anchor="middle" font-size="12">${i+1}</text>`;}).join('');
    // L1: row indicated by arrow; L2: next print box after yellow marker.
    const target=lv===1?row*cols:next;
    const right=String(target+1),wrong=shuffle(Array.from({length:rows*cols},(_,i)=>String(i+1)).filter(x=>x!==right)).slice(0,lv===1?2:3);
    quiz(this,{ask:lv===1?B(`English book: where does row ${row+1} start?`,`영어 책의 ${row+1}번째 줄은 어디서 시작할까요?`):B('English book: after yellow, which box?','영어 책: 노란 칸 다음 칸은?'),show:`<svg viewBox="0 0 205 100" style="width:205px;height:min(100px,17dvh)" role="img" aria-label="${L(B('Three rows of numbered print boxes','숫자가 있는 글 칸 세 줄'))}"><rect x="2" y="2" width="200" height="96" rx="4" fill="white" stroke="#435269"/>${cells}${lv===1?`<text x="2" y="${29+row*25}" font-size="12">➜</text>`:''}</svg>`,opts:[right,...wrong].map((x,i)=>({html:`<span class="num">${x}</span>`,ok:i===0})),after:B('In an English book, follow print left to right.','영어 책은 글을 왼쪽에서 오른쪽으로 따라가요.')});
  }});
})();
// Reading extension: read & match, sight words, syllables, letter memory.
// Uses CVC / BIGGER word lists from games-write.js.

// ---------- Read and match (decode a word, pick the picture) ----------
registerGame({
  id: 'readmatch', subject: 'read', icon: '👀', title: B('Read & Match', '읽고 짝 맞추기'), sub: B('Read the word, find the picture', '단어를 읽고 그림 찾기'),
  area: AREA_READ('Decoding'),
  play() {
    const pool = lvl('readmatch') === 1 ? CVC : [...CVC, ...BIGGER], t = pick(pool), ds = others(pool, t, 2);
    const o = (w) => ({ html: `<span class="emo">${w[1]}</span>`, ok: w === t });
    quiz(this, {
      ask: B('Read the word: which picture matches?', '단어를 읽고 어느 그림인지 골라요.'),
      show: `<div class="bigword">${t[0]} <button class="say" id="hear" aria-label="${T().listen}">🔊</button></div>`,
      opts: [o(t), ...ds.map(o)], cls: 'shapes', after: B(`${t[0]}!`, `${t[0]} — ${t[2].ko}!`), vocab: t[0],
      onRender() { $('#hear').onclick = () => say(t[0], 'en-US'); }
    });
  }
});

// ---------- Sight words (school list + UFLI-style heart words, docs/worksheets/ufli-foundations.md) ----------
// Sound boxes per word: '|' separates sounds, '*' marks a heart part (spelled in a way a K child cannot sound out yet).
// No '*' = the whole word can be sounded out (shown as "Sound it out").
// AI decision: s=/z/ (is, as, his) and 'and' count as sound-it-out, so the same letter is never a heart in one word and plain in another.
const SIGHT_PARTS = {
  a: 'a*', no: 'n|o*', go: 'g|o*', to: 't|o*', am: 'a|m', I: 'I*', of: 'o*|f*', an: 'a|n', into: 'i|n|t|o*', said: 's|ai*|d', and: 'a|n|d', is: 'i|s', so: 's|o*', do: 'd|o*', my: 'm|y*', the: 'th|e*',
  his: 'h|i|s', that: 'th|a|t', was: 'w|a*|s', are: 'are*', her: 'h|er*', see: 's|ee*', you: 'y|ou*', as: 'a|s', or: 'or*', she: 'sh|e*', your: 'y|our*', he: 'h|e*', me: 'm|e*', with: 'w|i|th', for: 'f|or*', not: 'n|o|t', this: 'th|i|s'
};
const SIGHT1 = ['a', 'no', 'go', 'to', 'am', 'I', 'of', 'an', 'into', 'said', 'and', 'is', 'so', 'do', 'my', 'the'];
const SIGHT2 = ['his', 'that', 'was', 'are', 'her', 'see', 'you', 'as', 'or', 'she', 'your', 'he', 'me', 'with', 'for', 'not', 'this'];
window.SCHOOL_SIGHT = Object.freeze({ L1: Object.freeze(SIGHT1.slice()), L2: Object.freeze(SIGHT2.slice()) });
window.SIGHT_PARTS = SIGHT_PARTS;
// Look-alike words (O1): same length class, shared letters, reversals (no/on, was/saw). No homophones of the target (see/sea, to/two, for/four).
const SIGHT_LOOK = {
  a: ['an', 'am', 'as'], no: ['on', 'so', 'go'], go: ['so', 'no', 'do'], to: ['do', 'so', 'go'], am: ['an', 'as', 'me'], I: ['a', 'it', 'is'], of: ['or', 'on', 'if'], an: ['am', 'as', 'and'],
  into: ['onto', 'in', 'and'], said: ['sad', 'sand', 'sail'], and: ['end', 'an', 'had'], is: ['as', 'his', 'it'], so: ['no', 'go', 'to'], do: ['to', 'no', 'go'], my: ['me', 'by', 'may'], the: ['he', 'then', 'she'],
  his: ['is', 'has', 'her'], that: ['this', 'than', 'hat'], was: ['saw', 'as', 'has'], are: ['ear', 'ate', 'or'], her: ['he', 'here', 'his'], see: ['she', 'bee', 'so'], you: ['your', 'yes', 'our'], as: ['is', 'an', 'has'],
  or: ['on', 'of', 'for'], she: ['he', 'see', 'the'], your: ['you', 'our', 'four'], he: ['she', 'her', 'the'], me: ['my', 'he', 'we'], with: ['will', 'this', 'wish'], for: ['of', 'or', 'from'], not: ['no', 'net', 'nut'], this: ['that', 'his', 'thin']
};
// Extra letter tiles for writing: letters a child really swaps in (said→sed, was→wuz, b/d, th→t).
const SIGHT_EXTRA = {
  no: ['u', 'm'], go: ['q', 'u'], to: ['d', 'u'], am: ['n', 'e'], of: ['v', 'u'], an: ['m', 'e'], into: ['e', 'u'], said: ['e', 'y'], and: ['e', 'b'], is: ['z', 'e'], so: ['c', 'u'], do: ['b', 'u'], my: ['i', 'n'], the: ['a', 'u'],
  his: ['z', 'e'], that: ['e', 'd'], was: ['u', 'z'], are: ['o', 'u'], her: ['u', 'i'], see: ['a', 'c'], you: ['w', 'e'], as: ['z', 'e'], or: ['a', 'u'], she: ['c', 'i'], your: ['e', 'a'], he: ['i', 'a'], me: ['n', 'i'], with: ['e', 'v'], for: ['v', 'u'], not: ['u', 'm'], this: ['e', 'z']
};
const sightParts = w => SIGHT_PARTS[w].split('|').map(p => ({ g: p.replace('*', ''), heart: p.endsWith('*') }));
// Sound boxes under the word; heart parts are red with ❤️, plain sounds blue. Boxes light up one by one.
function sightMap(w) {
  const parts = sightParts(w), hearts = parts.some(p => p.heart);
  const note = hearts ? B('❤️ = remember by heart', '❤️ = 마음으로 외워요') : B('🔤 Sound it out!', '🔤 소리로 읽어 봐요!');
  return `<div class="sight-map" lang="en" style="display:flex;flex-direction:column;align-items:center;gap:.3em">
    <div style="display:flex;gap:.25em;align-items:flex-end">${parts.map((p, i) => `<span class="sm-part" data-i="${i}" style="display:inline-flex;flex-direction:column;align-items:center;gap:.15em">
      <span style="font-size:clamp(30px,7dvh,52px);font-weight:700;line-height:1;color:${p.heart ? '#c2334d' : '#24456e'}">${p.g}</span>
      <span class="sm-box" style="display:inline-flex;align-items:center;justify-content:center;min-width:1.6em;height:1.6em;border-radius:6px;font-size:clamp(14px,3dvh,22px);${p.heart ? 'background:#ffe3e8;border:2px solid #e0475b' : 'background:#dceaff;border:2px solid #4a7bd0'}">${p.heart ? '❤️' : ''}</span></span>`).join('')}</div>
    <div class="sm-note" style="font-size:clamp(14px,2.6dvh,19px)">${L(note)}</div></div>`;
}
function showSightMap(w, box) {
  if (!box) return;
  box.innerHTML = sightMap(w);
  box.querySelectorAll('.sm-box').forEach((b, i) => { try { b.animate([{ transform: 'scale(.6)', opacity: .3 }, { transform: 'scale(1.15)', opacity: 1 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, delay: 250 + i * 380, fill: 'backwards' }); } catch (e) {} });
}
// Tile rounds have no onRender/onCorrect hooks: when a sight tile round appears in #view, speak the word, wire 🔊 and show the sound boxes once the word is spelled.
(() => {
  const v = document.getElementById('view'); if (!v || typeof MutationObserver !== 'function') return;
  new MutationObserver(() => {
    const h = v.querySelector('.show [data-sight]'); if (!h || h.dataset.wired) return;
    h.dataset.wired = '1'; const t = h.dataset.sight, slots = v.querySelector('.slots');
    h.onclick = () => say(t, 'en-US');
    say(t, 'en-US', true);   // the word is only heard, never written (Q1)
    const sp = v.querySelector('#sp'); if (sp) { const old = sp.onclick; sp.onclick = () => { if (old) old(); say(t, 'en-US', true); }; }
    if (slots) { const mo = new MutationObserver(() => { if (!slots.isConnected) return mo.disconnect(); if (slots.querySelectorAll('.slot.filled').length === t.length) { mo.disconnect(); showSightMap(t, v.querySelector('.show')); } }); mo.observe(slots, { subtree: true, attributes: true, attributeFilter: ['class'] }); }
  }).observe(v, { childList: true });
})();
registerGame({
  id: 'sight', subject: 'read', icon: '👁️', title: B('Sight Words', '자주 보는 단어'), sub: B('said, was, the, you...', 'said, was, the, you...'),
  area: AREA_READ('High-frequency words'),
  play() {
    const lv = lvl('sight');
    // L1: middle list, listen and find. L2: late list (+ about 1 in 4 from L1 for review), half find, half write with letter tiles.
    const t = lv === 1 ? pick(SIGHT1) : Math.random() < 0.25 ? pick(SIGHT1) : pick(SIGHT2);
    const write = lv >= 2 && t.length >= 2 && Math.random() < 0.5;
    if (write) {
      // K rounds are generated first and rendered later (adaptive-extra.js), so the wiring lives in the show markup (data-sight) and the #view observer above.
      return tileRound(this, {
        ask: B('Listen. Spell it!', '듣고 그 낱말을 글자로 써요.'),
        show: `<button class="say big-say" id="hear" data-sight="${t}" aria-label="${T().listen}">🔊</button>`, target: t.split(''), extra: SIGHT_EXTRA[t].filter(c => !t.includes(c)), speakTiles: false, oneRow: true, after: B(`${t}!`, `${t}!`), vocab: t
      });
    }
    const hear = `<button class="say big-say" id="hear" aria-label="${T().listen}">🔊</button>`;
    // Two look-alike words: only the whole spelling tells them apart.
    const ds = shuffle(SIGHT_LOOK[t].filter(w => w !== t)).slice(0, 2);
    quiz(this, {
      ask: B('Listen. Find it!', '듣고 그 낱말을 눌러요.'), askExtra: { t, lang: 'en-US' },
      show: hear,
      opts: [t, ...ds].map(w => ({ html: `<span class="num" lang="en">${w}</span>`, ok: w === t })), cls: 'shapes',
      after: B(`${t}!`, `${t}!`),
      onRender() {
        // quiz() speaks askExtra only in Korean; English needs the word queued too (on start and on 🔊 replay).
        $('#hear').onclick = () => say(t, 'en-US');
        if (S.lang === 'en') { say(t, 'en-US', true); const sp = $('#sp'), old = sp.onclick; sp.onclick = () => { old(); say(t, 'en-US', true); }; }
      },
      onCorrect() { showSightMap(t, $('.show')); }
    });
  }
});

// ---------- Count the syllables ----------
const SYL = [['dog', '🐶', 1], ['sun', '☀️', 1], ['fish', '🐟', 1], ['apple', '🍎', 2], ['monkey', '🐵', 2], ['tiger', '🐯', 2], ['rabbit', '🐰', 2], ['cat', '🐱', 1], ['pig', '🐷', 1], ['hat', '🎩', 1], ['bus', '🚌', 1], ['pencil', '✏️', 2],
  ['banana', '🍌', 3], ['butterfly', '🦋', 3], ['elephant', '🐘', 3], ['umbrella', '☂️', 3], ['dinosaur', '🦖', 3]];
registerGame({
  id: 'syllable', subject: 'read', icon: '👏', title: B('Clap the Parts', '박수로 음절 세기'), sub: B('How many parts?', '몇 개로 나뉠까?'),
  area: AREA_READ('Syllables'),
  play() {
    const pool = lvl('syllable') === 1 ? SYL.filter(x => x[2] <= 2) : SYL, t = pick(pool);
    quiz(this, {
      ask: B('Say the word and clap: how many parts?', '말하며 박수 치면 몇 부분일까요?'),
      show: `<div class="bigword"><span class="emo">${t[1]}</span> ${t[0]} <button class="say" id="hear">🔊</button></div><button class="pill" id="clap">👏 <span id="cl">0</span></button>`,
      opts: [1, 2, 3].map(n => ({ html: `<span class="num">${n}</span>`, label: '👏'.repeat(n), ok: n === t[2] })), cls: 'shapes',
      after: B(`${t[0]} has ${t[2]} ${t[2] === 1 ? 'part' : 'parts'}!`, `${t[0]}는 ${t[2]}부분이에요!`), vocab: t[0],
      onRender() { let c = 0; $('#hear').onclick = () => say(t[0], 'en-US'); $('#clap').onclick = () => { c++; $('#cl').textContent = c; }; }
    });
  }
});

// ---------- Memory match: big and little letters (flip cards) ----------
registerGame({
  id: 'memory', subject: 'read', icon: '🃏', title: B('Letter Memory', '글자 기억 게임'), sub: B('Flip cards, match A with a', '카드를 뒤집어 A와 a 찾기'),
  area: AREA_READ('Alphabet'),
  play() {
    const pairs = lvl('memory') === 1 ? 4 : 6, alphabet = 'ABCDEFGHIJKLMNOP'.split('');
    const history = (this._kBoards ||= { 4: [], 6: [] })[pairs];
    let ls = shuffle(alphabet).slice(0, pairs), key = ls.slice().sort().join('');
    for (let attempt = 0; history.includes(key); attempt++) {
      // Sixteen distinct consecutive-letter sets provide a deterministic fallback.
      ls = attempt < 32 ? shuffle(alphabet).slice(0, pairs) : Array.from({ length: pairs }, (_, i) => alphabet[(attempt + i) % 16]);
      key = ls.slice().sort().join('');
    }
    history.push(key); if (history.length > 9) history.shift();
    const cards = shuffle(ls.flatMap(c => [{ k: c, t: c }, { k: c, t: c.toLowerCase() }]));
    // 70a: the instruction is read aloud on start and can be replayed (K cannot be expected to read it).
    const instruction = L(B('Find the big and little letter pairs!', '짝이 되는 큰 글자와 작은 글자를 찾아요!'));
    view().innerHTML = `<div class="prompt">${instruction}<button class="say" id="sp" aria-label="${T().listen}">🔊</button></div>
      <div class="mem">${cards.map((c, i) => `<button class="card" data-i="${i}"><span class="back">🍑</span><span class="face">${c.t}</span></button>`).join('')}</div><pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    $('#sp').onclick = () => say(instruction); say(instruction);
    let open = [], lock = false, misses = 0, matched = 0;
    const finish = () => { const ok = misses <= pairs; record('memory', ok); if (ok) addPeach(); $('#cheer').textContent = pick(T().right); nextButton(() => this.play()); };
    $$('.card').forEach(b => b.onclick = () => {
      if (lock || b.classList.contains('flip') || b.classList.contains('gone')) return;
      b.classList.add('flip'); const c = cards[+b.dataset.i]; say(c.t, 'en-US'); open.push(b);
      if (open.length < 2) return;
      lock = true; const [x, y] = open; open = [];
      if (cards[+x.dataset.i].k === cards[+y.dataset.i].k) {
        matched++; setTimeout(() => { x.classList.add('gone'); y.classList.add('gone'); lock = false; if (matched === pairs) finish(); }, 500);
      } else { misses++; setTimeout(() => { x.classList.remove('flip'); y.classList.remove('flip'); lock = false; }, 800); }
    });
  }
});

// 63a: L2 compares spoken word lengths.
(() => {
 const replace=(id,make)=>{const g=GAMES.find(g=>g.id===id),old=g.play;g.play=function(){if(lvl(id)===1)return old.call(this);quiz(this,make());};};
 // sight L2 sentence fill removed (2026-10-28): L2 is now listen-and-write with letter tiles (see sight above).
 replace('syllable',()=>{const a=pick(SYL),b=pick(SYL.filter(x=>x[2]!==a[2])),r=a[2]>b[2]?a:b,short=a[2]<b[2]?a:b;return {ask:B('Which word needs MORE claps?','박수를 더 많이 치는 낱말은?'),askExtra:{t:`${a[0]}. ${b[0]}.`,lang:'en-US'},show:`<div class="bigword">${a[0]} · ${b[0]}</div>`,opts:[r[0],short[0],L(B('The same','똑같아요'))].map((x,i)=>({html:`<span class="word">${x}</span>`,ok:i===0})),cls:'words'};});
})();
