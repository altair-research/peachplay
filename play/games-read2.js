'use strict';
(() => {
  'use strict';
  const words=[['sun','flower','sunflower','🌻'],['rain','bow','rainbow','🌈'],['snow','man','snowman','☃️'],['tooth','brush','toothbrush','🪥'],['cup','cake','cupcake','🧁'],['foot','ball','football','🏈'],['pop','corn','popcorn','🍿'],['pan','cake','pancake','🥞'],['butter','fly','butterfly','🦋'],['star','fish','starfish','⭐'],['mail','box','mailbox','📫'],['door','bell','doorbell','🔔']];
  registerGame({id:'compound',grade:'K',subject:'read',icon:'🧁',title:B('Word Sound Partners','낱말 소리 합치기'),sub:B('Join and take apart spoken words','말소리를 합치고 나눠요'),area:B('Reading · Compound words','읽기 · 합성어'),play(){
    const t=pick(words),lv=lvl('compound'),right=lv===1?t[2]:t[1],ds=shuffle(words.filter(x=>x!==t&&(lv===1||x[1]!==right))).filter((x,i,a)=>lv===1||a.findIndex(y=>y[1]===x[1])===i).slice(0,lv===1?2:3);
    const spoken=lv===1?`${t[0]}. ${t[1]}.`:`Say ${t[2]} without ${t[0]}.`;
    quiz(this,{ask:lv===1?B('Listen. Join the two word sounds.','듣고 두 낱말 소리를 합쳐요.'):B('Listen. Take away the first word.','듣고 앞 낱말 소리를 빼요.'),askExtra:{t:spoken,lang:'en-US'},show:`<div style="font-size:clamp(22px,4dvh,30px)" lang="en">${lv===1?`${t[0]} + ${t[1]}`:`${t[2]} − ${t[0]}`}</div>`,opts:[right,...ds.map(x=>lv===1?x[2]:x[1])].map((w,i)=>({html:`<span class="word" lang="en">${w}</span>`,ok:i===0})),cls:'words',vocab:right,
      onRender(){const rb=$('#spo');if(rb)rb.onclick=()=>$$('.opt .word').forEach((e,i)=>say(e.textContent,'en-US',i>0));},after:B(`${t[0]} + ${t[1]} = ${t[2]}`,`${t[0]} + ${t[1]} = ${t[2]}`)});
  }});
  registerGame({id:'bookway',grade:'K',subject:'read',icon:'📖',title:B('Follow the Book','책 읽는 방향'),sub:B('English books: start and follow','영어 책의 시작과 순서'),area:B('Reading · Book direction','읽기 · 책 방향'),play(){
    const lv=lvl('bookway'),rows=3,cols=2+rnd(4),row=rnd(3),col=rnd(cols-1),next=row*cols+col+1;
    const cells=Array.from({length:rows*cols},(_,i)=>{const x=12+(i%cols)*36,y=15+Math.floor(i/cols)*25;return `<rect x="${x}" y="${y}" width="36" height="18" rx="3" fill="${lv===2&&i===row*cols+col?'#ffd166':'#edf3f7'}" stroke="#435269"/><text x="${x+18}" y="${y+13}" text-anchor="middle" font-size="12">${i+1}</text>`;}).join('');
    // L1: row indicated by arrow; L2: next print box after yellow marker.
    const target=lv===1?row*cols:next;
    const right=String(target+1),wrong=shuffle(Array.from({length:rows*cols},(_,i)=>String(i+1)).filter(x=>x!==right)).slice(0,lv===1?2:3);
    quiz(this,{ask:lv===1?B(`English book: start row ${row+1}. Which box?`,`영어 책의 ${row+1}번째 줄은 어디서 시작할까요?`):B('English book: after yellow, which box?','영어 책에서 노란 칸 다음은 어느 칸일까요?'),show:`<svg viewBox="0 0 205 100" style="width:205px;height:min(100px,17dvh)" role="img" aria-label="${L(B('Three rows of numbered print boxes','숫자가 있는 글 칸 세 줄'))}"><rect x="2" y="2" width="200" height="96" rx="4" fill="white" stroke="#435269"/>${cells}${lv===1?`<text x="2" y="${29+row*25}" font-size="12">➜</text>`:''}</svg>`,opts:[right,...wrong].map((x,i)=>({html:`<span class="num">${x}</span>`,ok:i===0})),after:B('In an English book, follow print left to right.','영어 책은 글을 왼쪽에서 오른쪽으로 따라가요.')});
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
      ask: B('Read the word. Which picture matches?', '단어를 읽어 보세요. 어느 그림일까요?'),
      show: `<div class="bigword">${t[0]} <button class="say" id="hear" aria-label="${T().listen}">🔊</button></div>`,
      opts: [o(t), ...ds.map(o)], cls: 'shapes', after: B(`${t[0]}!`, `${t[0]} — ${t[2].ko}!`), vocab: t[0],
      onRender() { $('#hear').onclick = () => say(t[0], 'en-US'); }
    });
  }
});

// ---------- Sight words ----------
const SIGHT1 = ['I', 'a', 'the', 'and', 'to', 'is', 'my', 'we', 'see', 'like', 'can', 'go'];
const SIGHT2 = [...SIGHT1, 'up', 'look', 'you', 'me', 'no', 'it', 'in', 'he', 'she', 'are', 'do', 'at'];
registerGame({
  id: 'sight', subject: 'read', icon: '👁️', title: B('Sight Words', '자주 보는 단어'), sub: B('the, and, see, like...', 'the, and, see, like...'),
  area: AREA_READ('High-frequency words'),
  play() {
    const pool = lvl('sight') === 1 ? SIGHT1 : SIGHT2, t = pick(pool), ds = others(pool, t, 2);
    quiz(this, {
      ask: B('Listen, then tap that word. Silent? Ask an adult.', '듣고 단어를 눌러요. 소리가 안 나면 어른에게 부탁해요.'), askSay: B('Listen.', '들어요.'), askExtra: { t, lang: 'en-US' },
      show: `<button class="say big-say" id="hear">🔊</button>`,
      opts: [t, ...ds].map(w => ({ html: `<span class="num">${w}</span>`, ok: w === t })), cls: 'shapes',
      after: B(`${t}!`, `${t}!`), onRender() { $('#hear').onclick = () => say(t, 'en-US'); }
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
      ask: B('Say the word and clap. How many parts?', '단어를 말하며 박수를 쳐요. 몇 부분일까요?'),
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
    view().innerHTML = `<div class="prompt">${S.lang === 'ko' ? '짝이 되는 큰 글자와 작은 글자를 찾아요!' : 'Find the big and little letter pairs!'}</div>
      <div class="mem">${cards.map((c, i) => `<button class="card" data-i="${i}"><span class="back">🍑</span><span class="face">${c.t}</span></button>`).join('')}</div><pk-cheer class="cheer" id="cheer"></pk-cheer>`;
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
