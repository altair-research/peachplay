'use strict';
// Represent a number with a picture (K math; school check "Draw a picture to represent 8" answered with the numeral only).
// CPA ladder inside the app's two levels (core.js caps levels at 2):
//   level 1, first half of the round  -> step 1a: tap dots onto a mat, 1-5
//   level 1, second half              -> step 1b: same mat, 6-10
//   level 2, first half               -> step 2: choose the picture (incl. ten and some more) / fill a ten frame, alternating
//   level 2, second half              -> step 3: draw your own marks in an empty box (scored by the number of marks)
// Diagnostic practice always uses the choice step, so the game stays a one-question item there.
// The first visit shows an unscored "number only ✗ / picture ✓" example (PF9); the first real question never uses its 7.
(() => {
  const ID = 'represent', DEMO_N = 7;
  const COLORS = ['#ef476f', '#118ab2', '#06a77d', '#f08a00', '#8338ec'];
  const josa = (n, a, b) => ([2, 4, 5, 9].includes(n % 10) ? b : a);       // Korean reading of the last digit: 이(2) 사 오 구 take 를/가
  const eul = n => n + josa(n, '을', '를');
  const half = () => SESSION.n >= Math.ceil((SESSION.rounds || 10) / 2);
  let avoidDemo = false;
  const between = (lo, hi) => { let n = lo + rnd(hi - lo + 1); if (avoidDemo && n === DEMO_N) n = n === hi ? lo : n + 1; return n; };

  const stepFor = lv => {
    if (DIAG.active) return 'choose';
    if (lv === 1) return half() ? 'place2' : 'place1';
    return half() ? 'draw' : (SESSION.n % 2 ? 'frame' : 'choose');
  };

  // ---------- small SVG pictures for the choice step ----------
  const dot = (x, y, c) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}"/>`;
  const frameSvg = (k, c) => {
    let s = '';
    for (let i = 0; i < 10; i++) { const x = 2 + (i % 5) * 20, y = 2 + Math.floor(i / 5) * 20; s += `<rect x="${x}" y="${y}" width="20" height="20" fill="#fff" stroke="#35506f" stroke-width="1.6"/>` + (i < k ? dot(x + 10, y + 10, c) : ''); }
    return s;
  };
  const onesSvg = (k, x0, c) => Array.from({ length: k }, (_, i) => dot(x0 + 10 + Math.floor(i / 2) * 18, 12 + (i % 2) * 20, c)).join('');
  const svgBox = (w, body, label) => `<svg viewBox="0 0 ${w} 44" class="rp-pic" role="img" aria-label="${label}">${body}</svg>`;
  const picFrame = (k, c) => svgBox(104, frameSvg(k, c), k);
  const picTeen = (ones, c, full = 10) => svgBox(112 + Math.ceil(ones / 2) * 18, frameSvg(full, c) + onesSvg(ones, 104, c), full + ones);
  const picSplit = (a, b, c) => svgBox(46 + Math.ceil(b / 2) * 18, onesSvg(a, 0, c) + onesSvg(b, 34, c), `${a} ${b}`);   // "14" read as 1 and 4
  const picScatter = (k, c) => {   // fixed 7x3 slots, shuffled, so the picture is not a ten frame
    const slots = shuffle(Array.from({ length: 21 }, (_, i) => i)).slice(0, k);
    return svgBox(104, slots.map(i => dot(10 + (i % 7) * 14 + (Math.floor(i / 7) % 2) * 4, 9 + Math.floor(i / 7) * 13, c)).join(''), k);
  };
  const picNumeral = n => svgBox(104, `<rect x="30" y="2" width="44" height="40" rx="5" fill="#fffdf4" stroke="#b9a37a" stroke-width="1.6"/><text x="52" y="33" text-anchor="middle" font-size="28" font-weight="700" fill="#4a3a2a" font-family="Comic Sans MS, Chalkboard, sans-serif">${n}</text>`, n);

  // ---------- step 2 (choice): which picture represents n? ----------
  const chooseItem = () => {
    const c = pick(COLORS), teen = rnd(5) < 2;
    let n, opts, after;
    if (teen) {
      n = between(11, 19); const ones = n - 10;
      const near = ones === 9 ? 8 : ones === 1 ? 2 : ones + pick([-1, 1]);
      // Distractors: one ones-dot off, or the digits read as two small groups (1 and 4 for 14) - the usual teen-number mix-up.
      opts = [{ html: picTeen(ones, c), ok: true }, { html: picTeen(near, c), ok: false }, { html: picSplit(1, ones, c), ok: false }];
      after = B(`Ten and ${ones} more represent ${n}.`, `10개와 ${ones}개, 모두 ${n}개예요.`);
    } else {
      n = between(5, 10);
      const fmt = rnd(2) ? picFrame : picScatter;
      // One counting slip either way (n-1 / n+1); n = 10 has only 9 and 8 below it.
      const near = shuffle([n - 1, n + 1].filter(v => v <= 10)), wrong = near.length > 1 ? near : [n - 1, n - 2];
      const numeralOnly = rnd(2) === 0;   // the school mistake: writing the number instead of drawing
      opts = [{ html: fmt(n, c), ok: true }, ...wrong.slice(0, numeralOnly ? 1 : 2).map(v => ({ html: fmt(v, c), ok: false }))];
      if (numeralOnly) opts.push({ html: picNumeral(n), ok: false });
      after = numeralOnly ? B(`${n} dots represent ${n}. A number alone is not a picture.`, `점 ${n}개가 ${eul(n)} 나타내요. 숫자만 쓰면 그림이 아니에요.`) : B(`${n} dots represent ${n}.`, `점 ${n}개가 ${eul(n)} 나타내요.`);
    }
    return {
      step: 'choose', n,
      ask: B(`Which picture represents ${n}?`, `${eul(n)} 나타내는 그림은?`),
      english: `Which picture represents ${n}?`,
      show: `<div class="rp-card rp-card-solo" aria-label="${n}">${n}</div>`,
      opts, cls: 'rp-choices', after
    };
  };

  // ---------- spoken help ----------
  const wordButton = () => `<button class="pill rp-word" id="rpWord" lang="en" aria-label="represent">🔤 represent</button>`;
  const wordSay = () => { say('represent', 'en-US'); say(L(B('Represent means show it with a picture.', '“represent”는 그림으로 나타낸다는 뜻이에요.')), undefined, true); };
  const askNow = it => { say(L(it.askSay || it.ask)); if (S.lang === 'ko') say(it.english, 'en-US', true); };

  // ---------- steps 1, 2 (ten frame), 3: build the picture, then press Done ----------
  const buildItem = step => {
    if (step === 'place1' || step === 'place2') {
      const n = step === 'place1' ? between(1, 5) : between(6, 10);
      return { step, n, ask: B(`Represent ${n}. Tap to put ${n} dot${n > 1 ? 's' : ''}.`, `${eul(n)} 그림으로 나타내요. 점 ${n}개를 놓아요.`), english: `Represent ${n}.`,
        after: B(`${n} dot${n > 1 ? 's' : ''} represent${n > 1 ? '' : 's'} ${n}.`, `점 ${n}개가 ${eul(n)} 나타내요.`) };
    }
    if (step === 'frame') {
      const n = between(6, 10);
      return { step, n, ask: B(`Represent ${n} in the ten frame.`, `10칸 틀에 ${eul(n)} 나타내요.`), english: `Represent ${n} in the ten frame.`,
        after: n === 10 ? B('A full ten frame represents 10.', '10칸이 꽉 차면 10이에요.') : B(`Five and ${n - 5} more represent ${n}.`, `5개와 ${n - 5}개, 모두 ${n}개예요.`) };
    }
    const n = between(3, 10);
    return { step: 'draw', n, ask: B(`Draw a picture to represent ${n}.`, `그림을 그려서 ${eul(n)} 나타내요.`), english: `Draw a picture to represent ${n}.`,
      askSay: B(`Draw a picture to represent ${n}. Draw ${n} things, not the number.`, `그림을 그려서 ${eul(n)} 나타내요. 숫자 말고 ${n}개를 그려요.`),
      after: B(`${n} marks represent ${n}.`, `그린 것 ${n}개가 ${eul(n)} 나타내요.`) };
  };

  const svgPt = (svg, e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const m = svg.getScreenCTM(), q = m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 }; return { x: Math.min(296, Math.max(4, q.x)), y: Math.min(176, Math.max(4, q.y)) }; };

  // Each board returns { html, wire(root, changed) -> { count(), label(on), lock(), clear(), undo?() } }.
  const placeBoard = (it, color) => {
    const spots = Array.from({ length: 12 }, (_, i) => `<button class="rp-spot" data-i="${i}" aria-pressed="false" aria-label="${L(B('Spot', '자리'))} ${i + 1}" style="transform:translate(${rnd(13) - 6}px,${rnd(13) - 6}px)"></button>`).join('');
    return {
      html: `<div class="rp-mat" style="--rp-c:${color}">${spots}</div>`,
      wire(root, changed) {
        const all = [...root.querySelectorAll('.rp-spot,.rp-cell')]; let order = [];
        all.forEach(b => b.onclick = () => {
          if (b.disabled) return;
          const on = b.getAttribute('aria-pressed') !== 'true';
          b.setAttribute('aria-pressed', on); order = on ? [...order, b] : order.filter(x => x !== b);
          if (on) say(String(order.length));
          changed();
        });
        return {
          count: () => order.length,
          label: on => all.forEach(b => { b.textContent = on && order.includes(b) ? order.indexOf(b) + 1 : ''; }),
          lock: () => all.forEach(b => { b.disabled = true; }),
          clear: () => { order = []; all.forEach(b => { b.setAttribute('aria-pressed', 'false'); b.textContent = ''; }); }
        };
      }
    };
  };
  const frameBoard = (it, color) => ({
    html: `<div class="rp-frame" style="--rp-c:${color}">${Array.from({ length: 10 }, (_, i) => `<button class="rp-cell" data-i="${i}" aria-pressed="false" aria-label="${L(B('Box', '칸'))} ${i + 1}"></button>`).join('')}</div>`,
    wire: placeBoard(it, color).wire
  });
  const drawBoard = (it, color) => ({
    html: `<svg class="rp-pad" viewBox="0 0 300 180" style="--rp-c:${color}" aria-label="${L(B('Drawing box', '그림 칸'))}"><rect x="1" y="1" width="298" height="178" rx="12" class="rp-pad-bg"/><g class="rp-marks"></g><g class="rp-labels"></g></svg>`,
    wire(root, changed) {
      const svg = root.querySelector('.rp-pad'), g = svg.querySelector('.rp-marks'), labels = svg.querySelector('.rp-labels');
      const marks = []; let cur = null, pid = null, locked = false;
      const pathOf = pts => pts.length < 2 || Math.hypot(pts.at(-1).x - pts[0].x, pts.at(-1).y - pts[0].y) < 4 && pts.length < 6
        ? `<circle cx="${pts[0].x.toFixed(1)}" cy="${pts[0].y.toFixed(1)}" r="7"/>`
        : `<polyline points="${pts.map(p => p.x.toFixed(1) + ',' + p.y.toFixed(1)).join(' ')}"/>`;
      const redraw = () => { g.innerHTML = [...marks, ...(cur ? [cur] : [])].map(pathOf).join(''); };
      svg.addEventListener('pointerdown', e => { if (locked || pid !== null) return; pid = e.pointerId; cur = [svgPt(svg, e)]; try { svg.setPointerCapture(pid); } catch (x) {} e.preventDefault(); redraw(); });
      svg.addEventListener('pointermove', e => { if (e.pointerId !== pid || !cur) return; const p = svgPt(svg, e), q = cur.at(-1); if (Math.hypot(p.x - q.x, p.y - q.y) > 2) { cur.push(p); redraw(); } e.preventDefault(); });
      const end = e => { if (e.pointerId !== pid) return; pid = null; if (cur) { marks.push(cur); cur = null; redraw(); say(String(marks.length)); changed(); } };
      svg.addEventListener('pointerup', end); svg.addEventListener('pointercancel', end);
      const api = {
        count: () => marks.length,
        label: on => {
          labels.innerHTML = on ? marks.map((m, i) => { const xs = m.map(p => p.x), ys = m.map(p => p.y), x = Math.min(292, Math.max(...xs) + 8), y = Math.max(14, Math.min(...ys) - 2); return `<text x="${x}" y="${y}" class="rp-num">${i + 1}</text>`; }).join('') : '';
        },
        lock: () => { locked = true; },
        clear: () => { marks.length = 0; cur = null; labels.innerHTML = ''; redraw(); },
        undo: () => { marks.pop(); labels.innerHTML = ''; redraw(); },
        // Keyboard / switch access: add one dot at the next free place.
        add: () => { const i = marks.length; marks.push([{ x: 30 + (i % 6) * 48, y: 50 + Math.floor(i / 6) * 60 }]); redraw(); say(String(marks.length)); }
      };
      return api;
    }
  });

  const buildRound = (game, it) => {
    const color = pick(COLORS), board = it.step === 'draw' ? drawBoard(it, color) : it.step === 'frame' ? frameBoard(it, color) : placeBoard(it, color);
    window.LearnLog.begin(game, lvl(game.id));
    MISS[game.id] = false;
    const draw = it.step === 'draw';
    view().innerHTML = `<div class="prompt">${L(it.ask)}<button class="say" id="sp" aria-label="${T().listen}">🔊</button>${wordButton()}</div>
      <div class="show rp-show"><div class="rp-wrap rp-step-${it.step}"><div class="rp-card" aria-label="${it.n}">${it.n}</div>${board.html}</div></div>
      <div class="rp-tools">${draw ? `<button class="pill rp-tool" id="rpUndo" aria-label="${L(B('Undo', '하나 지우기'))}">↶</button><button class="pill rp-tool" id="rpAdd" aria-label="${L(B('Add a dot', '점 하나 더하기'))}">＋●</button>` : ''}<button class="pill rp-tool" id="rpClear" aria-label="${L(B('Clear', '모두 지우기'))}">↺</button><button class="next rp-done" id="rpDone">✓ ${L(B('Done', '다 했어요'))}</button></div>
      <pk-cheer class="cheer" id="cheer"></pk-cheer><div class="fact" id="fact" role="status"></div>`;
    const root = $('.rp-wrap');
    let missed = false, finished = false;
    const changed = () => { api.label(false); if (!finished) $('#fact').textContent = ''; };
    const api = board.wire(root, changed);
    $('#sp').onclick = () => askNow(it); askNow(it);
    $('#rpWord').onclick = wordSay;
    $('#rpClear').onclick = () => { if (!finished) { api.clear(); changed(); } };
    if (draw) { $('#rpUndo').onclick = () => { if (!finished) api.undo(); }; $('#rpAdd').onclick = () => { if (!finished) { api.add(); changed(); } }; }
    $('#rpDone').onclick = () => {
      if (finished) return;
      const c = api.count();
      if (!c) { askNow(it); return; }
      api.label(true);
      const ok = c === it.n;
      if (kidGrade() !== 'P' && !missed && !SESSION.review) { SESSION.misses = ok ? 0 : (SESSION.misses || 0) + 1; if (SESSION.misses >= 3) { SESSION.easyNext = true; SESSION.misses = 0; } }
      if (ok) {
        finished = true; api.lock(); $$('.rp-tools button').forEach(b => { b.disabled = true; }); $('.rp-tools').classList.add('rp-finished');   // room for the fixed Next button
        recordFinal(game.id, missed); if (!missed) addPeach();
        $('#cheer').textContent = pick(T().right); $('#fact').textContent = L(it.after); say(L(it.after));
        nextButton(() => game.play());
      } else {
        missed = true; record(game.id, false);
        const fact = draw && c === 1 && it.n > 1
          ? B(`One mark is one thing. Draw ${it.n} things.`, `하나를 그리면 1개예요. ${it.n}개를 그려요.`)
          : B(`You made ${c}. Count and fix it.`, `지금 ${c}개예요. 세어 보고 고쳐요.`);
        $('#cheer').textContent = T().again; $('#fact').textContent = L(fact); say(L(fact));
      }
    };
  };

  // ---------- first-visit example: the number alone ✗, a picture of 7 things ✓ ----------
  const wantsDemo = () => !(window.__qa && !window.__qa.demo) && !DIAG.active && !SESSION.review && !SESSION.mix && SESSION.n === 0 && !S.demoSeen?.[ID];
  const showDemo = game => {
    const n = DEMO_N, t = (en, ko) => L(B(en, ko));
    view().innerHTML = `<section class="rp-demo" aria-label="${t('Watch first', '먼저 보아요')}">
      <div class="prompt">👀 ${t('Watch first', '먼저 보아요')}<button class="say" id="demoSay" aria-label="${T().listen}">🔊</button>${wordButton()}</div>
      <div class="rp-demo-row"><div class="rp-card">${n}</div><span class="rp-arrow" aria-hidden="true">➜</span>
        <div class="rp-demo-pad"><span class="rp-demo-num" aria-hidden="true">${n}</span><svg viewBox="0 0 300 180" class="rp-demo-dots" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<circle cx="${44 + (i % 4) * 60}" cy="${50 + Math.floor(i / 4) * 80}" r="22"/>`).join('')}</svg>
        <span class="rp-mark rp-no" aria-hidden="true">✗</span><span class="rp-mark rp-yes" aria-hidden="true">✓</span></div></div>
      <div class="rp-demo-caption" aria-live="polite"></div>
      <div class="demo-actions"><button class="pill" id="demoReplay">🔁 ${t('Watch again', '다시 보기')}</button><button class="next" id="demoGo">▶ ${t('My turn', '내 차례')}</button></div></section>`;
    const pad = $('.rp-demo-pad'), dots = [...pad.querySelectorAll('circle')], cap = $('.rp-demo-caption');
    let run = 0;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const speech = () => { say(t(`Represent ${n} means draw a picture of ${n}. Not only the number ${n}. Draw ${n} circles.`, `“represent ${n}”은 ${eul(n)} 그림으로 나타내라는 뜻이에요. 숫자 ${n}만 쓰지 말고 동그라미 ${n}개를 그려요.`)); say(`Draw a picture to represent ${n}.`, 'en-US', true); };
    const play = async () => {
      const me = ++run, calm = S.calm || matchMedia('(prefers-reduced-motion: reduce)').matches;
      pad.className = 'rp-demo-pad'; dots.forEach(d => d.classList.remove('on')); cap.textContent = '';
      if (calm) { pad.classList.add('number', 'nope'); await wait(900); if (me !== run) return; pad.className = 'rp-demo-pad yes'; dots.forEach(d => d.classList.add('on')); cap.textContent = t(`${n} circles ✓`, `동그라미 ${n}개 ✓`); return; }
      pad.classList.add('number'); cap.textContent = t(`Only the number ${n}?`, `숫자 ${n}만?`); await wait(1100); if (me !== run) return;
      pad.classList.add('nope'); cap.textContent = t('Not a picture ✗', '그림이 아니에요 ✗'); await wait(1300); if (me !== run) return;
      pad.className = 'rp-demo-pad';
      for (let i = 0; i < n; i++) { dots[i].classList.add('on'); cap.textContent = String(i + 1); await wait(520); if (me !== run) return; }
      pad.classList.add('yes'); cap.textContent = t(`${n} circles represent ${n} ✓`, `동그라미 ${n}개가 ${eul(n)} 나타내요 ✓`);
    };
    $('#demoSay').onclick = speech; $('#rpWord').onclick = wordSay;
    $('#demoReplay').onclick = () => { play(); };
    $('#demoGo').onclick = () => { run++; S.demoSeen ||= {}; S.demoSeen[ID] = true; save(); avoidDemo = true; try { game.play(); } finally { avoidDemo = false; } };
    speech(); requestAnimationFrame(play); $('#demoGo').focus();
  };

  const make = step => (step === 'choose' ? chooseItem() : buildItem(step));
  window.RepresentGen = { make, steps: ['place1', 'place2', 'choose', 'frame', 'draw'] };   // QA dump (docs/review/impl-represent.md)

  registerGame({
    // roundMenu: the K repeat wrapper in adaptive-extra.js only captures quiz()/tileRound(); with this flag it lets the
    // built rounds (tap, ten frame, draw) and the first-visit example render themselves. See docs/review/integ-represent.md.
    id: ID, grade: 'K', subject: 'math', roundMenu: true, icon: '✏️', title: B('Draw to Show', '그림으로 나타내기'), sub: B('Represent a number with a picture', '숫자를 그림으로'),
    area: B('Math · Represent numbers', '수학 · 수 나타내기'),
    play() {
      if (wantsDemo()) return showDemo(this);
      const step = stepFor(lvl(this.id));
      let it = make(step);
      // quiz() and the K wrapper (adaptive-extra.js) check repeats of choice items; built rounds check here, without re-entering play().
      if (step !== 'choose') { for (let k = 0; k < 9 && dup(this, step + ':' + it.n); k++) it = make(step); return buildRound(this, it); }
      quiz(this, {
        ask: it.ask, askExtra: { t: it.english, lang: 'en-US' }, show: it.show, quietShow: true, opts: it.opts, cls: it.cls, after: it.after,
        onRender() { const sp = $('#sp'); if (sp && !$('#rpWord')) { sp.insertAdjacentHTML('afterend', wordButton()); $('#rpWord').onclick = wordSay; } }
      });
    }
  });
})();
