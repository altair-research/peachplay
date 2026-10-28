'use strict';
// Kindergarten phonemic awareness and phonics (2026-10-28; docs/review/impl-phoneme.md):
//  phoneme   - L1 blend 2-3 sounds -> picture; L2 alternates Elkonin sound boxes (how many sounds) and letters in boxes.
//  wordchain - UFLI-style word chain: change one letter (read turn: new tiles -> picture; write turn: picture -> letter).
//  soundplay - Heggerty-style daily routine: word -> syllable -> rhyme -> first/last sound -> blend -> segment.
// Word lists are our own picks (emoji pictures + common CVC words); nothing is copied from a published program.
// Speech: browsers cannot say an isolated phoneme reliably. We speak short approximations ("mmm", "kuh") one at a time
// with pauses, light the matching box while each one plays, and always say the whole word in the feedback.
(() => {
  // word emoji phonemes(.) graphemes(. or - when the spelling does not map one letter group per box)
  const RAW = `cat 🐱 k.a.t c.a.t|hat 🎩 h.a.t h.a.t|bat 🦇 b.a.t b.a.t|rat 🐀 r.a.t r.a.t|cap 🧢 k.a.p c.a.p|map 🗺️ m.a.p m.a.p
van 🚐 v.a.n v.a.n|can 🥫 k.a.n c.a.n|pan 🍳 p.a.n p.a.n|man 👨 m.a.n m.a.n|bag 👜 b.a.g b.a.g|ant 🐜 a.n.t a.n.t
pig 🐷 p.i.g p.i.g|pin 📌 p.i.n p.i.n|fish 🐟 f.i.sh f.i.sh|dish 🍽️ d.i.sh d.i.sh|ship 🚢 sh.i.p sh.i.p
dog 🐶 d.o.g d.o.g|log 🪵 l.o.g l.o.g|box 📦 b.o.ks b.o.x|fox 🦊 f.o.ks f.o.x|sock 🧦 s.o.k s.o.ck|rock 🪨 r.o.k r.o.ck|lock 🔒 l.o.k l.o.ck
sun ☀️ s.u.n s.u.n|run 🏃 r.u.n r.u.n|bus 🚌 b.u.s b.u.s|bug 🐛 b.u.g b.u.g|mug ☕ m.u.g m.u.g|nut 🥜 n.u.t n.u.t|hut 🛖 h.u.t h.u.t
cup 🥤 k.u.p c.u.p|tub 🛁 t.u.b t.u.b|duck 🦆 d.u.k d.u.ck
bed 🛏️ b.e.d b.e.d|pen 🖊️ p.e.n p.e.n|hen 🐔 h.e.n h.e.n|ten 🔟 t.e.n t.e.n|net 🥅 n.e.t n.e.t|web 🕸️ w.e.b w.e.b|leg 🦵 l.e.g l.e.g
bell 🔔 b.e.l b.e.ll|shell 🐚 sh.e.l sh.e.ll|egg 🥚 e.g e.gg
bee 🐝 b.ee b.ee|key 🔑 k.ee k.ey|tree 🌳 t.r.ee t.r.ee|pie 🥧 p.ie p.ie|tie 👔 t.ie t.ie|cow 🐄 k.ow c.ow|shoe 👟 sh.oo sh.oe|ice 🧊 ie.s -
moon 🌙 m.oo.n m.oo.n|spoon 🥄 s.p.oo.n s.p.oo.n|boat ⛵ b.oa.t b.oa.t|goat 🐐 g.oa.t g.oa.t|soap 🧼 s.oa.p s.oa.p|nose 👃 n.oa.z -
kite 🪁 k.ie.t -|bike 🚲 b.ie.k -|cake 🎂 k.ai.k -|snake 🐍 s.n.ai.k -|rain 🌧️ r.ai.n r.ai.n|snail 🐌 s.n.ai.l s.n.ai.l|whale 🐳 w.ai.l -
mouse 🐭 m.ow.s -|house 🏠 h.ow.s -|car 🚗 k.ar c.ar|star ⭐ s.t.ar s.t.ar
frog 🐸 f.r.o.g f.r.o.g|crab 🦀 k.r.a.b c.r.a.b|drum 🥁 d.r.u.m d.r.u.m|flag 🚩 f.l.a.g f.l.a.g|tent ⛺ t.e.n.t t.e.n.t
hand ✋ h.a.n.d h.a.n.d|milk 🥛 m.i.l.k m.i.l.k|sled 🛷 s.l.e.d s.l.e.d|gift 🎁 g.i.f.t g.i.f.t|clock 🕰️ k.l.o.k c.l.o.ck`;
  const W = RAW.split(/\||\n/).map(s => s.trim()).filter(Boolean).map(s => { const [w, e, ph, gr] = s.split(/\s+/); return { w, e, ph: ph.split('.'), gr: gr === '-' ? null : gr.split('.') }; });
  const VOW = new Set(['a', 'e', 'i', 'o', 'u', 'ee', 'ie', 'oa', 'ai', 'oo', 'ow', 'ar']), SHORT = new Set(['a', 'e', 'i', 'o', 'u']);
  // Spoken stand-ins for single sounds. Continuous sounds are stretched, stop sounds get a short "uh" (a known limit).
  // One table so a listening test can tune it (or swap in recorded clips later).
  const SAYS = { b: 'buh', d: 'duh', f: 'fff', g: 'guh', h: 'huh', j: 'juh', k: 'kuh', l: 'lll', m: 'mmm', n: 'nnn', p: 'puh', r: 'rrr', s: 'sss', t: 'tuh', v: 'vvv', w: 'wuh', z: 'zzz',
    sh: 'shhh', ch: 'chuh', ks: 'ks', a: 'aah', e: 'eh', i: 'ih', o: 'aw', u: 'uh', ee: 'ee', ie: 'eye', oa: 'oh', ai: 'ay', oo: 'oo', ow: 'ow', ar: 'ar' };
  const cue = p => SAYS[p] || p;
  const rime = w => w.ph.slice(w.ph.findIndex(p => VOW.has(p))).join('.');
  const list = f => W.filter(f);
  const noX = w => !w.ph.includes('ks');

  // ---- speech: one queue of English parts, played after the question; a newer call stops an older one ----
  let TOK = 0;
  function talk(parts, { fresh = false, gap = 330, onStart } = {}) {
    const my = ++TOK;
    if (S.muted || S.voiceOff || !('speechSynthesis' in window)) return;
    try { if (fresh) speechSynthesis.cancel(); } catch (e) { return; }
    let i = 0;
    const next = () => {
      if (my !== TOK || i >= parts.length) return;
      const k = i++, [t, rate] = Array.isArray(parts[k]) ? parts[k] : [parts[k], 0.75];
      try {
        const u = new SpeechSynthesisUtterance(t); u.lang = 'en-US'; u.rate = rate;
        if (window.Voice?.apply) window.Voice.apply(u, 'en-US');
        u.onstart = () => { if (my === TOK && onStart) onStart(k); };
        u.onend = () => setTimeout(next, gap);
        speechSynthesis.speak(u);
      } catch (e) {}
    };
    next();
  }
  const stopTalk = () => { TOK++; };

  // ---- small view pieces ----
  const pic = (x, cls = '') => `<span class="emo ${cls}" role="img" aria-label="${x.w}">${x.e}</span>`;
  const boxes = (n, fill = [], q = -1, cls = '') => `<span class="ph-boxes ${cls}">${Array.from({ length: n }, (_, i) => `<span class="ph-box${i === q ? ' q' : ''}">${i === q ? '?' : (fill[i] || '')}</span>`).join('')}</span>`;
  const tiles = (gr, hi = -1, q = -1) => `<span class="ph-tiles" lang="en">${gr.map((g, i) => `<span class="ph-tile${i === hi ? ' hi' : ''}${i === q ? ' q' : ''}">${i === q ? '?' : g}</span>`).join('')}</span>`;
  const HEAR = () => `<button class="say ph-hear" id="phHear" aria-label="${L(B('Hear the sounds', '소리 듣기'))}">🔊</button>`;
  const lightIn = sel => i => { $$(sel).forEach((b, k) => b.classList.toggle('lit', k === i)); };
  // 🔊 replays the sounds; the prompt's 🔊 says the question and then the sounds again.
  function wire(play) {
    const h = $('#phHear'); if (h) h.onclick = e => { e.stopPropagation(); play(true); };
    const sp = $('#sp'); if (sp) { const ask = sp.onclick; sp.onclick = () => { if (ask) ask(); play(false); }; }
    play(false);
  }
  // 🔉 names the picture choices (in their shown order): naming is not the skill, hearing the sounds inside is.
  function picNames() {
    const sp = $('#sp'); if (!sp || $('#phPics') || !$$('.opt .emo[aria-label]').length) return;
    const b = document.createElement('button'); b.className = 'say'; b.id = 'phPics'; b.textContent = '🔉'; b.setAttribute('aria-label', L(B('Hear the pictures', '그림 이름 듣기')));
    b.onclick = () => talk($$('.opt .emo[aria-label]').map(e => [e.getAttribute('aria-label'), 0.8]), { fresh: true, gap: 250 });
    sp.after(b);
  }
  // Similar-sounding pictures: same sounds in the same places first (O1: plausible distractors).
  const sim = (a, b) => a.ph.reduce((s, p, i) => s + (b.ph[i] === p ? 1 : 0), 0) + (a.ph.at(-1) === b.ph.at(-1) ? 0.5 : 0) + (a.ph.length === b.ph.length ? 0.5 : 0);
  const near = (t, pool, n) => { const c = shuffle(pool.filter(x => x !== t && x.e !== t.e)).sort((x, y) => sim(t, y) - sim(t, x)); return shuffle(c.slice(0, n + 2)).slice(0, n); };
  const picOpts = (right, wrong) => [right, ...wrong].map(x => ({ html: pic(x), ok: x === right }));

  // ---- shared item builders (used by phoneme and soundplay) ----
  // Blend: hear the parts one by one, pick the picture. parts = [{say, show}] (phonemes, or onset + rime).
  function blendItem(game, t, pool, parts, extra = {}) {
    const wide = parts.length === 2 && parts.some(p => p.show.length > 1);
    return quiz(game, {
      ask: B('Put the sounds together. Which picture?', '소리를 합치면 어떤 그림일까요?'),
      show: `${extra.top || ''}<div class="ph-stage">${HEAR()}${boxes(parts.length, [], -1, wide ? 'wide' : '')}</div>`,
      opts: picOpts(t, near(t, pool, 2)), cls: 'shapes', vocab: t.w,
      after: B(`${parts.map(p => p.show).join(' · ')} → ${t.w}!`, `${parts.map(p => p.show).join(' · ')} → ${t.w}!`),
      onRender() { wire(fresh => talk(parts.map(p => p.say), { fresh, onStart: lightIn('.show .ph-box') })); picNames(); },
      onCorrect() { $$('.show .ph-box').forEach((b, i) => { b.textContent = parts[i].show; }); talk([...parts.map(p => p.say), [t.w, 0.8]], { gap: 160, onStart: lightIn('.show .ph-box') }); }
    });
  }
  const phParts = t => t.ph.map((p, i) => ({ say: cue(p), show: t.gr && t.gr.length === t.ph.length ? t.gr[i] : '•' }));
  // Segment: see the picture, hear the word, pick the row with one box per sound (Elkonin boxes).
  function segItem(game, t, extra = {}) {
    const n = t.ph.length, fill = t.gr && t.gr.length === n ? t.gr : t.ph.map(() => '•');
    return quiz(game, {
      ask: B('How many sounds? Pick the boxes.', '소리가 몇 개예요? 상자를 골라요.'),
      show: `${extra.top || ''}<div class="ph-row">${pic(t, 'ph-pic')}${HEAR()}<button class="pill ph-tap" id="phTap" aria-label="${L(B('Tap once for each sound', '소리마다 한 번 눌러요'))}">👆<span class="ph-chips" id="phChips"></span></button></div>`,
      opts: [2, 3, 4].map(k => ({ html: boxes(k, [], -1, 'sm') + `<span class="sr-only">${k}</span>`, ok: k === n })), cls: 'ph-strips',
      after: B(`${t.w}: ${n} sounds.`, `${t.w}: 소리 ${n}개.`), vocab: t.w,
      onRender() {
        wire(fresh => talk([[t.w, 0.6]], { fresh }));
        let c = 0; $('#phTap').onclick = () => { c = c >= 5 ? 1 : c + 1; $('#phChips').textContent = '●'.repeat(c); };
      },
      onCorrect() { const bx = $$('.opt.ok .ph-box'); bx.forEach((b, i) => { b.textContent = fill[i]; }); talk([...t.ph.map(cue), [t.w, 0.8]], { gap: 160, onStart: lightIn('.opt.ok .ph-box') }); }
    });
  }

  // ---- 1. phoneme: sound boxes ----
  // Letters that sound alike (never a letter that makes the same sound, e.g. c/k, so the wrong tile is surely wrong: O3).
  const CONF = { b: ['d', 'p'], d: ['b', 't'], p: ['b', 't'], t: ['d', 'p'], g: ['c', 'd'], c: ['g', 't'], k: ['g', 't'], m: ['n', 'w'], n: ['m', 'l'], f: ['v', 't'], v: ['f', 'b'],
    s: ['z', 'f'], z: ['s', 'v'], l: ['r', 'n'], r: ['l', 'w'], h: ['f', 'w'], w: ['r', 'v'], j: ['g', 'd'], a: ['e', 'i'], e: ['i', 'a'], i: ['e', 'a'], o: ['u', 'a'], u: ['o', 'a'] };
  const BLEND1 = list(w => noX(w) && w.ph.length <= 3), SEG = list(w => noX(w) && w.ph.length >= 2 && w.ph.length <= 4);
  const MAP = list(w => w.gr && w.gr.length === w.ph.length && w.gr.length >= 3 && w.gr.some(g => CONF[g]));
  function mapItem(game, t) {
    const q = pick(t.gr.map((g, i) => CONF[g] ? i : -1).filter(i => i >= 0)), right = t.gr[q];
    return quiz(game, {
      ask: B('Which letter goes in the empty box?', '빈 상자에 들어갈 글자는?'), readGoal: 'opts',
      show: `<div class="ph-row">${pic(t, 'ph-pic')}${HEAR()}</div>${boxes(t.gr.length, t.gr, q)}`,
      opts: [right, ...CONF[right]].map((l, i) => ({ html: `<span class="num ph-letter" lang="en">${l}</span>`, ok: i === 0 })), cls: 'shapes',
      after: B(`${t.gr.join(' · ')} → ${t.w}`, `${t.gr.join(' · ')} → ${t.w}`), vocab: t.w,
      onRender() { wire(fresh => talk([[t.w, 0.7], ...t.ph.map(cue)], { fresh, onStart: k => lightIn('.show .ph-box')(k - 1) })); },
      onCorrect() { const b = $$('.show .ph-box')[q]; if (b) { b.textContent = right; b.classList.remove('q'); } talk([[t.w, 0.8]]); }
    });
  }
  registerGame({
    id: 'phoneme', grade: 'K', subject: 'read', icon: '🔲', title: B('Sound Boxes', '소리 상자'), sub: B('Blend and split word sounds', '낱말 소리 합치고 나누기'),
    area: AREA_READ('Phonemic awareness'),
    play() {
      if (lvl('phoneme') === 1) { const t = pick(BLEND1); return blendItem(this, t, BLEND1, phParts(t)); }
      // L2 (the engine has two levels): split into boxes and letters in boxes take turns (Ehri: letters join from step 3).
      this._k = (this._k || 0) + 1;
      return this._k % 2 ? segItem(this, pick(SEG)) : mapItem(this, pick(MAP));
    }
  });

  // ---- 2. wordchain: change one letter ----
  const CH = list(w => w.gr && w.gr.length === 3 && w.ph.length === 3 && SHORT.has(w.gr[1]));
  const diffAt = (a, b) => { const d = a.gr.map((g, i) => g !== b.gr[i] ? i : -1).filter(i => i >= 0); return d.length === 1 ? d[0] : -1; };
  const vowelOf = w => w.gr[1];
  const L1POOL = CH.filter(w => ['a', 'i'].includes(vowelOf(w)));
  const pairs = (lv, from) => (lv === 1 ? L1POOL : CH).filter(t => t !== from && (lv === 1 ? L1POOL.includes(from) : true)).map(t => ({ t, pos: diffAt(from, t) }))
    .filter(p => p.pos >= 0 && (lv === 1 ? p.pos !== 1 : true));
  const swap = (gr, pos, l) => gr.map((g, i) => i === pos ? l : g);
  registerGame({
    id: 'wordchain', grade: 'K', subject: 'read', icon: '🔗', title: B('Word Chain', '한 글자 바꾸기'), sub: B('cat → hat → hot', 'cat → hat → hot'),
    area: AREA_READ('Phonics'),
    play() {
      const lv = lvl('wordchain'), pool = lv === 1 ? L1POOL : CH;
      // The chain goes on from the last new word when it can (sit → lit → lot), as in a classroom word chain.
      // A chain is 3 links; then a fresh start word so other word families come up too.
      this._len = (this._len || 0) + 1;
      const keep = this._len % 3 !== 1 && pool.includes(this._cur) && pairs(lv, this._cur).length;
      let s = keep ? this._cur : pick(pool.filter(w => w !== this._cur && pairs(lv, w).length));
      let ps = pairs(lv, s).filter(p => p.t !== this._prev);
      if (!ps.length) ps = pairs(lv, s);
      // Level 2: vowel order a, i -> o -> u -> e; most turns use o/u/e words or change the middle vowel.
      if (lv === 2) { const hard = ps.filter(p => p.pos === 1 || ['o', 'u', 'e'].includes(vowelOf(p.t))); if (hard.length && rnd(4)) ps = hard; }
      const { t, pos } = pick(ps); this._prev = s; this._cur = t;
      this._turn = (this._turn || 0) + 1;
      const read = this._turn % 2 === 1;
      const cues = fresh => talk(read ? [[s.w, 0.7]] : [[s.w, 0.7], [t.w, 0.7]], { fresh, gap: 500 });
      const common = { vocab: t.w, after: B(`${s.w} → ${t.w}`, `${s.w} → ${t.w}`), onCorrect() { talk([[s.w, 0.8], [t.w, 0.8]], { gap: 300 }); } };
      if (read) {
        // Read turn: the changed tile is marked; decode the new word and find its picture.
        const other = pick(pairs(2, t).map(p => p.t).filter(x => x !== s)) || pick(pairs(2, s).map(p => p.t).filter(x => x !== t)) || pick(CH.filter(x => x !== s && x !== t));
        return quiz(this, { ...common,
          ask: B('One letter changed. Which picture now?', '글자 하나가 바뀌었어요. 이제 어떤 그림?'),
          show: `<div class="ph-row">${pic(s, 'ph-pic')}${HEAR()}</div><div class="ph-chain">${tiles(s.gr)}<span class="ph-arrow">➜</span>${tiles(t.gr, pos)}</div>`,
          opts: picOpts(t, [s, other]), cls: 'shapes',
          onRender() { wire(cues); picNames(); }
        });
      }
      if (lv === 1) {
        // Write turn, L1: the box to change is marked with ?; pick the letter for the picture.
        const right = t.gr[pos], wrong = [s.gr[pos], ...(CONF[right] || []), ...'bdfhmnprst'].filter((l, i, a) => l !== right && a.indexOf(l) === i).slice(0, 2);
        return quiz(this, { ...common, readGoal: 'opts',
          ask: B('Which letter makes the new picture?', '새 그림이 되려면 어떤 글자?'),
          show: `<div class="ph-row">${pic(t, 'ph-pic')}${HEAR()}</div><div class="ph-chain">${tiles(s.gr)}<span class="ph-arrow">➜</span>${tiles(t.gr, -1, pos)}</div>`,
          opts: [right, ...wrong].map((l, i) => ({ html: `<span class="num ph-letter" lang="en">${l}</span>`, ok: i === 0 })), cls: 'shapes',
          onRender() { wire(cues); }
        });
      }
      // Write turn, L2: nothing is marked; find which letter to change AND which letter to use (two steps).
      const asWord = gr => gr.join('');
      const cands = [...pairs(2, s).map(p => p.t.gr).filter(g => asWord(g) !== asWord(t.gr)), ...(CONF[t.gr[pos]] || []).map(l => swap(t.gr, pos, l)), ...[0, 1, 2].filter(i => i !== pos).flatMap(i => (CONF[t.gr[i]] || []).map(l => swap(t.gr, i, l)))];
      const seen = new Set([asWord(t.gr), asWord(s.gr)]), wrong = [];
      for (const g of cands) { if (wrong.length < 2 && !seen.has(asWord(g))) { seen.add(asWord(g)); wrong.push(g); } }
      return quiz(this, { ...common, readGoal: 'opts',
        ask: B('Change one letter to make the picture.', '글자 하나를 바꿔 그림 낱말을 만들어요.'),
        show: `<div class="ph-chain">${tiles(s.gr)}<span class="ph-arrow">➜</span>${pic(t, 'ph-pic')}${HEAR()}</div>`,
        opts: [t.gr, ...wrong].map((g, i) => ({ html: tiles(g), ok: i === 0 })), cls: 'words',
        onRender() { wire(cues); }
      });
    }
  });

  // ---- 3. soundplay: daily sound routine ----
  // compound, first part, second part, (part pictures; null = no clear picture)
  const COMP = [['sunflower', '🌻', '☀️', '🌸'], ['rainbow', '🌈', '🌧️', '🎀'], ['snowman', '⛄', '❄️', '👨'], ['cupcake', '🧁', '🥤', '🎂'], ['football', '🏈', '🦶', '⚽'],
    ['ladybug', '🐞', '👩', '🐛'], ['mailbox', '📫', '✉️', '📦'], ['cowboy', '🤠', '🐄', '👦'], ['pancake', '🥞', '🍳', '🎂'], ['butterfly', '🦋', '🧈', '🪰'], ['popcorn', '🍿', null, '🌽'], ['toothbrush', '🪥', '🦷', null]];
  const PARTS = { sunflower: ['sun', 'flower'], rainbow: ['rain', 'bow'], snowman: ['snow', 'man'], cupcake: ['cup', 'cake'], football: ['foot', 'ball'], ladybug: ['lady', 'bug'], mailbox: ['mail', 'box'], cowboy: ['cow', 'boy'], pancake: ['pan', 'cake'], butterfly: ['butter', 'fly'], popcorn: ['pop', 'corn'], toothbrush: ['tooth', 'brush'] };
  const cw = c => ({ w: c[0], e: c[1] });
  // word, picture, written syllables, spoken syllables
  const SYLRAW = `tiger 🐯 ti-ger tie-gur|rabbit 🐰 rab-bit rab-bit|monkey 🐵 mon-key mun-kee|pencil ✏️ pen-cil pen-sill|apple 🍎 ap-ple ap-pull|pumpkin 🎃 pump-kin pump-kin
zebra 🦓 ze-bra zee-bruh|turtle 🐢 tur-tle tur-tull|robot 🤖 ro-bot row-bot|lemon 🍋 lem-on lem-un|carrot 🥕 car-rot care-rut|rocket 🚀 rock-et rock-it|panda 🐼 pan-da pan-duh
banana 🍌 ba-na-na buh-nan-nuh|elephant 🐘 el-e-phant el-uh-fant|dinosaur 🦖 di-no-saur die-nuh-sore|umbrella ☂️ um-brel-la um-brell-uh|tomato 🍅 to-ma-to tuh-may-toe
potato 🥔 po-ta-to puh-tay-toe|octopus 🐙 oc-to-pus ock-tuh-puss|kangaroo 🦘 kan-ga-roo kang-guh-roo|hamburger 🍔 ham-bur-ger ham-bur-gur|computer 💻 com-pu-ter cum-pew-ter`;
  const SYL = SYLRAW.split(/\||\n/).map(s => s.trim().split(/\s+/)).map(([w, e, sh, sy]) => ({ w, e, show: sh.split('-'), say: sy.split('-') }));
  const ONE = list(w => ['cat', 'dog', 'sun', 'fish', 'duck', 'bed', 'pig', 'frog', 'moon', 'cake', 'bus', 'hand'].includes(w.w)).map(x => ({ ...x, show: [x.w], say: [x.w] }));
  const RIMES = new Set(['a.t', 'a.n', 'a.p', 'i.g', 'i.n', 'i.sh', 'o.g', 'o.k', 'u.n', 'u.g', 'u.t', 'e.d', 'e.n', 'e.t', 'e.l']);
  const OR = list(w => w.gr && w.ph.length === 3 && !VOW.has(w.ph[0]) && RIMES.has(rime(w)) && w.gr.length === 3);
  const RHY = list(w => W.some(x => x !== w && rime(x) === rime(w)));
  const STEPS = ['word', 'syl', 'syl', 'rhyme', 'rhyme', 'first', 'first', 'blend', 'blend', 'seg'];
  const top = i => `<div class="ph-steps" aria-hidden="true">${STEPS.map((_, k) => `<span class="${k < i ? 'done' : k === i ? 'on' : ''}"></span>`).join('')}</div>`;
  function soundItem(game, kind, lv, i) {
    const tp = top(i);
    if (kind === 'word') {
      const both = COMP.filter(c => c[2] && c[3]), c = pick(both), [a, b] = PARTS[c[0]];
      if (lv === 1) {
        const ds = shuffle(COMP.filter(x => x !== c)).sort((x, y) => (PARTS[y[0]].some(p => PARTS[c[0]].includes(p)) ? 1 : 0) - (PARTS[x[0]].some(p => PARTS[c[0]].includes(p)) ? 1 : 0)).slice(0, 2);
        return quiz(game, { ask: B('Put the two words together. Which picture?', '두 낱말을 합치면 어떤 그림?'),
          show: `${tp}<div class="ph-eq"><span role="img" aria-label="${a}">${c[2]}</span><b>+</b><span role="img" aria-label="${b}">${c[3]}</span><b>=</b><span class="ph-box q">?</span></div>${HEAR()}`,
          opts: [c, ...ds].map(x => ({ html: pic(cw(x)), ok: x === c })), cls: 'shapes', vocab: c[0], after: B(`${a} + ${b} = ${c[0]}`, `${a} + ${b} = ${c[0]}`),
          onRender() { wire(fresh => talk([a, b], { fresh, gap: 500 })); picNames(); } });
      }
      const PEOPLE = ['👨', '👦', '👩'], other = pick(COMP.filter(x => x !== c && x[3] && x[3] !== c[3] && !(PEOPLE.includes(x[3]) && [c[2], c[3]].some(e => PEOPLE.includes(e)))));   // boy/man/lady faces look alike: never two in one item (O3)
      return quiz(game, { ask: B('Take one part away. What is left?', '한 부분을 빼면 무엇이 남을까요?'),
        show: `${tp}<div class="ph-eq"><span role="img" aria-label="${c[0]}">${c[1]}</span><b>−</b><span role="img" aria-label="${a}">${c[2]}</span><b>=</b><span class="ph-box q">?</span></div>${HEAR()}`,
        opts: [[b, c[3]], [a, c[2]], [PARTS[other[0]][1], other[3]]].map(([w, e], k) => ({ html: pic({ w, e }), ok: k === 0 })), cls: 'shapes', vocab: b, after: B(`${c[0]} − ${a} = ${b}`, `${c[0]} − ${a} = ${b}`),
        onRender() { wire(fresh => talk([c[0], `take away ${a}`], { fresh, gap: 500 })); picNames(); } });
    }
    if (kind === 'syl') {
      if (lv === 1) { const t = pick(SYL), n = t.say.length, ds = shuffle(SYL.filter(x => x !== t && x.say.length === n)).slice(0, 2);
        return quiz(game, { ask: B('Put the parts together. Which picture?', '부분을 합치면 어떤 그림?'),
          show: `${tp}<div class="ph-stage">${HEAR()}${boxes(n, [], -1, 'wide')}</div>`, opts: picOpts(t, ds), cls: 'shapes', vocab: t.w, after: B(`${t.show.join(' · ')} → ${t.w}`, `${t.show.join(' · ')} → ${t.w}`),
          onRender() { wire(fresh => talk(t.say, { fresh, gap: 420, onStart: lightIn('.show .ph-box') })); picNames(); },
          onCorrect() { $$('.show .ph-box').forEach((b, k) => { b.textContent = t.show[k]; }); } }); }
      const t = pick([...SYL, ...ONE]), n = t.say.length;
      return quiz(game, { ask: B('Clap the parts. How many claps?', '박수로 나눠요. 몇 번일까요?'),
        show: `${tp}<div class="ph-row">${pic(t, 'ph-pic')}${HEAR()}</div>`, opts: [1, 2, 3].map(k => ({ html: `<span class="ph-claps" aria-hidden="true">${'👏'.repeat(k)}</span><span class="sr-only">${k}</span>`, ok: k === n })), cls: 'shapes',
        vocab: t.w, after: B(`${t.show.join(' · ')}: ${n}`, `${t.show.join(' · ')}: ${n}`),
        onRender() { wire(fresh => talk([[t.w, 0.65]], { fresh })); }, onCorrect() { talk(t.say, { gap: 380 }); } });
    }
    if (kind === 'rhyme') {
      const t = pick(RHY), r = pick(W.filter(x => x !== t && rime(x) === rime(t))), not = W.filter(x => rime(x) !== rime(t) && x.e !== t.e);
      // L1: clearly different words. L2: words that share the first sound or the vowel (look-alike traps).
      const ds = lv === 1 ? shuffle(not.filter(x => x.ph[0] !== t.ph[0])).slice(0, 2)
        : [pick(not.filter(x => x.ph[0] === t.ph[0])) || pick(not), pick(not.filter(x => x.ph[0] !== t.ph[0] && x.ph.some(p => VOW.has(p) && t.ph.includes(p))))].filter(Boolean);
      while (ds.length < 2) ds.push(pick(not.filter(x => !ds.includes(x))));
      return quiz(game, { ask: B(`Which one rhymes with ${t.w}?`, `${t.w}와 라임이 맞는 그림은?`),
        show: `${tp}<div class="ph-row">${pic(t, 'ph-pic')}${HEAR()}</div>`, opts: picOpts(r, ds), cls: 'shapes', vocab: r.w, after: B(`${t.w}, ${r.w}`, `${t.w}, ${r.w}`),
        onRender() { wire(fresh => talk([[t.w, 0.7]], { fresh })); picNames(); } });
    }
    if (kind === 'first') {
      // L1 first sound (trap: a rhyme); L2 last sound (trap: same first sound).
      const at = lv === 1 ? 0 : -1, s = w => w.ph.at(at), pool = list(noX);
      const t = pick(pool.filter(w => pool.some(x => x !== w && s(x) === s(w) && rime(x) !== rime(w))));
      const r = pick(pool.filter(x => x !== t && s(x) === s(t) && rime(x) !== rime(t)));
      const no = pool.filter(x => s(x) !== s(t) && x.e !== t.e);
      const trap = lv === 1 ? pick(no.filter(x => rime(x) === rime(t))) : pick(no.filter(x => x.ph[0] === t.ph[0]));
      const ds = [trap || pick(no)]; ds.push(pick(no.filter(x => !ds.includes(x))));
      return quiz(game, { ask: lv === 1 ? B(`Which one starts like ${t.w}?`, `${t.w}와 첫소리가 같은 그림은?`) : B(`Which one ends like ${t.w}?`, `${t.w}와 마지막 소리가 같은 그림은?`),
        show: `${tp}<div class="ph-row">${pic(t, 'ph-pic')}${HEAR()}</div>`, opts: picOpts(r, ds), cls: 'shapes', vocab: r.w, after: B(`${t.w}, ${r.w}: ${cue(s(t))}`, `${t.w}, ${r.w}: ${cue(s(t))}`),
        onRender() { wire(fresh => talk([[t.w, 0.7]], { fresh })); picNames(); }, onCorrect() { talk([cue(s(t)), [r.w, 0.8]], { gap: 250 }); } });
    }
    if (kind === 'blend') {
      if (lv === 1) { const t = pick(OR); return blendItem(game, t, OR, [{ say: cue(t.ph[0]), show: t.gr[0] }, { say: t.gr.slice(1).join(''), show: t.gr.slice(1).join('') }], { top: tp }); }
      const pool = list(w => noX(w) && w.ph.length >= 3), t = pick(pool); return blendItem(game, t, pool, phParts(t), { top: tp });
    }
    const pool = list(w => noX(w) && (lv === 1 ? w.ph.length <= 3 : w.ph.length >= 3));
    return segItem(game, pick(pool), { top: tp });
  }
  registerGame({
    id: 'soundplay', grade: 'K', subject: 'read', icon: '👂', title: B('Daily Sound Play', '매일 소리 놀이'), sub: B('Five minutes of sound games', '5분 소리 놀이'),
    area: AREA_READ('Phonological awareness'),
    play() {
      // A real round walks the routine in order (big units to small); other calls (mixed play, review, checks) step through it.
      const real = SESSION.id === 'soundplay' && !SESSION.review && !SESSION.mix;
      const i = real ? Math.min(STEPS.length - 1, Math.floor(SESSION.n * STEPS.length / (SESSION.rounds || STEPS.length))) : (this._i = ((this._i ?? -1) + 1) % STEPS.length);
      stopTalk();
      return soundItem(this, STEPS[i], lvl('soundplay'), i);
    }
  });
})();
