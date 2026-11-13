(() => {
  'use strict';
  // Independent, ephemeral workbenches. No quiz scores, timers or new globals.
  const text = v => L(v);
  const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const copy = v => JSON.parse(JSON.stringify(v));
  const words = {
    free: B('Free play', '자유 놀이'), one: B('Level 1', '레벨 1'), two: B('Level 2', '레벨 2'),
    undo: B('Undo', '되돌리기'), reset: B('Reset', '처음으로'), check: B('Check', '확인'),
    remove: B('Remove', '빼기'), listen: B('Listen', '듣기'),
    help: B('Drag, or tap a tool then a place.', '끌거나, 도구를 누른 뒤 놓을 곳을 눌러요.'),
    retry: B('Look again. You can change your work.', '다시 살펴봐요. 만든 것을 바꿔 봐요.'),
    good: B('You made it! Keep exploring.', '해냈어요! 계속 바꿔 보아도 좋아요.'),
    full: B('No room here. Try another place.', '여기는 자리가 없어요. 다른 곳에 놓아요.')
  };
  const btn = (key, label, attrs = '', body = '') => `<button type="button" class="m-btn" data-key="${key}" ${attrs}>${body || esc(text(label))}</button>`;
  const act = (key, label, attrs = '', body = '') => btn(key, label, `data-action="${key}" ${attrs}`, body);
  const source = (key, label, body = '', selected = false) => btn(`src-${key}`, label, `data-source="${key}" aria-label="${esc(text(label))}" aria-pressed="${selected}"`, body);
  const target = (key, label, body = '', attrs = '') => btn(`drop-${key}`, label, `data-drop="${key}" aria-label="${esc(text(label))}" ${attrs}`, body);
  const svg = (body, box = '0 0 264 176') => `<svg viewBox="${box}" aria-hidden="true">${body}</svg>`;
  const sum = a => a.reduce((s, x) => s + x, 0);
  const colors = ['#b9dce5', '#ead5a7', '#d6c7ef', '#b9ddc4'];
  const marks = ['●', '✦', '▤', '◇'];

  function mount(tool, game) {
    const topic = tool.topics ? pick(tool.topics) : null;
    let task = null;
    const prompt = mode => !mode && topic ? topic : tool.prompt(mode, task);
    let mode = 0, state = tool.init(0), chosen = null, history = [], feedback = '', drag = null, swallowClick = false;
    // cbn93: a picture idea that carries a number map (color by number) travels in the free state, so reset/undo keep it.
    if (topic?.pic) state.pic = topic.pic;
    const helpFor = () => (!mode && state.pic || mode && tool.levelPic) && tool.picHelp ? tool.picHelp : tool.help || words.help;
    const initial = copy(state);
    const keyFor = m => JSON.stringify([tool.id, m, m ? task.id : topic?.en || tool.prompt(0).en, !m ? state : null]);
    if (dup(game, keyFor(0))) return mount(tool, game);
    const visited = new Set(), recentTasks = { 1: [], 2: [] };
    function challenge(m) {
      if (!m) { task = null; state = copy(initial); return; }
      const bank = tool.challenges[m];
      const fresh = bank.filter(t => !recentTasks[m].includes(t.id)), pool = fresh.length ? fresh : bank;
      task = visited.has(m) ? pick(pool) : bank[0];
      // Register the actual task, never a newly generated prompt or mutable construction.
      for (let tries = 0; dup(game, keyFor(m)) && tries < 80; tries++) task = pick(pool);
      recentTasks[m].push(task.id); if (recentTasks[m].length > 5) recentTasks[m].shift();
      visited.add(m); state = tool.init(m, task);
    }
    const root = document.createElement('section'); root.className = 'm-play';
    root.setAttribute('aria-label', text(tool.title));
    view().replaceChildren(root);
    const ctx = () => ({ state, mode, chosen });
    function message(v) { feedback = text(v); }
    function change(fn) {
      const before = copy(state);
      feedback = '';
      fn();
      if (JSON.stringify(before) !== JSON.stringify(state)) { history.push(before); if (history.length > 60) history.shift(); }
    }
    function draw(focusKey) {
      root.innerHTML = `<div class="m-heading"><strong>${esc(text(tool.title))}</strong>${act('listen', words.listen, '', '🔊')}</div>
        <div class="m-modes">${[tool.freeLabel || words.free, words.one, words.two].map((w, i) => act(`mode-${i}`, w, `aria-pressed="${mode === i}"`)).join('')}</div>
        <p class="m-prompt">${esc(text(prompt(mode))).replace(/\s(\p{Extended_Pictographic}\S*)$/u, ' <span class="m-topic-pic">$1</span>')}</p>
        <div class="m-work">${tool.render(ctx())}</div>
        <p class="m-feedback" role="status" aria-live="polite">${esc(feedback || text(!mode && state.pic || mode && tool.levelPic ? helpFor() : words.help))}</p>
        <div class="m-footer">${act('undo', words.undo, history.length ? '' : 'disabled')}${act('reset', words.reset)}${mode ? act('check', words.check) : act('help', B('How to', '사용법'))}</div>`;
      // Glow the one button that moves toward the goal, so a child who cannot read the labels still sees what to press.
      const hint = tool.hint?.(state, mode, chosen, prompt(mode));
      if (hint) [...root.querySelectorAll('[data-key]')].find(b => b.dataset.key === hint)?.classList.add('m-next');
      if (focusKey) [...root.querySelectorAll('[data-key]')].find(b => b.dataset.key === focusKey)?.focus({ preventScroll: true });
    }
    function put(src, dest) {
      change(() => tool.drop(state, src, dest, message));
      chosen = null;
    }
    root.onclick = e => {
      if (swallowClick) { swallowClick = false; if (e.detail !== 0) return; }
      const b = e.target.closest('button'); if (!b || !root.contains(b)) return;
      const key = b.dataset.key, action = b.dataset.action;
      if (action?.startsWith('mode-')) {
        mode = +action.slice(5); challenge(mode); chosen = null; history = []; feedback = ''; draw(key); say(text(prompt(mode))); return;
      }
      if (action === 'listen' || action === 'help') { message(helpFor()); say(`${text(prompt(mode))} ${text(helpFor())}`); }
      else if (action === 'undo') { if (history.length) state = history.pop(); chosen = null; feedback = ''; }
      else if (action === 'reset') { change(() => { state = mode ? tool.init(mode, task) : copy(initial); }); chosen = null; }
      else if (action === 'check') { message(tool.check(state, mode) ? words.good : words.retry); say(feedback); }
      else if (action) {
        change(() => tool.action?.(state, action, chosen, message));
        if (action === 'remove') chosen = null;
        if (action === 'nextpiece') chosen = tool.select(state, '');
      }
      else if (b.dataset.source !== undefined) { chosen = chosen === b.dataset.source ? null : b.dataset.source; feedback = chosen ? b.getAttribute('aria-label') : ''; }
      else if (b.dataset.drop !== undefined) {
        if (chosen !== null) put(chosen, b.dataset.drop);
        else if (tool.tap && b.dataset.drop.startsWith('board')) change(() => tool.tap(state, b.dataset.drop));
        else if (tool.select) { chosen = tool.select(state, b.dataset.drop); feedback = chosen ? text(B('Selected. Move it or use a tool.', '골랐어요. 옮기거나 도구를 눌러요.')) : text(words.help); }
      }
      draw(key);
    };
    // Pointer capture stays on the stable root; no window-level drag listeners.
    root.onpointerdown = e => {
      if (drag || !e.isPrimary || e.button !== 0) return;
      swallowClick = false;
      const b = e.target.closest('[data-source],[data-drop],[data-clock]'); if (!b) return;
      if (b.hasAttribute('data-clock')) {
        drag = { id: e.pointerId, x: e.clientX, y: e.clientY, clock: true, before: copy(state), angle: tool.angle(b, e), value: state.minutes, moved: false };
      } else {
        const src = b.dataset.source ?? tool.select?.(state, b.dataset.drop);
        if (src == null) return;
        drag = { id: e.pointerId, x: e.clientX, y: e.clientY, src, moved: false, label: b.getAttribute('aria-label') };
      }
    };
    root.onpointermove = e => {
      if (!drag || drag.id !== e.pointerId) return;
      if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 8) drag.moved = true;
      if (!drag.moved) return;
      if (!root.hasPointerCapture(e.pointerId)) root.setPointerCapture(e.pointerId);
      if (drag.clock) {
        const angle = tool.angle(root.querySelector('[data-clock]'), e);
        const delta = (angle - drag.angle + 540) % 360 - 180;
        drag.value += delta / 6; drag.angle = angle;
        state.minutes = ((Math.round(drag.value / state.step) * state.step) % 720 + 720) % 720;
        feedback = ''; draw();
      } else {
        let ghost = root.querySelector('.m-ghost');
        if (!ghost) { ghost = document.createElement('div'); ghost.className = 'm-ghost'; ghost.setAttribute('aria-hidden', 'true'); ghost.textContent = drag.label; root.append(ghost); }
        ghost.style.left = `${e.clientX}px`; ghost.style.top = `${e.clientY}px`;
      }
    };
    function endDrag(e, cancel) {
      if (!drag || drag.id !== e.pointerId) return;
      const d = drag; drag = null;
      if (root.hasPointerCapture(e.pointerId)) root.releasePointerCapture(e.pointerId);
      root.querySelector('.m-ghost')?.remove();
      if (d.clock) {
        if (cancel) state = d.before;
        else if (state.minutes !== d.before.minutes) { history.push(d.before); if (history.length > 60) history.shift(); }
      } else if (d.moved && !cancel) {
        const dest = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-drop]');
        if (dest && root.contains(dest)) put(d.src, dest.dataset.drop);
      }
      if (d.moved || cancel) { swallowClick = !cancel; draw(); }
    }
    root.onpointerup = e => endDrag(e, false);
    root.onpointercancel = e => endDrag(e, true);
    root.onlostpointercapture = e => { if (e.target === root && drag?.id === e.pointerId && !root.hasPointerCapture(e.pointerId)) endDrag(e, true); };
    root.onkeydown = e => {
      if (e.key === 'Escape') { chosen = null; if (drag) endDrag({ pointerId: drag.id }, true); feedback = ''; draw(e.target.dataset.key); }
    };
    // Preserve the current construction on the app's language button. Remove this
    // scoped override immediately when home/profile/another game removes the root.
    const languageButton = document.getElementById('langBtn');
    const language = e => {
      if (!root.isConnected) return;
      e.stopImmediatePropagation();
      if (drag) endDrag({ pointerId: drag.id }, true);
      swallowClick = false;
      S.lang = S.lang === 'en' ? 'ko' : 'en'; keptLang = null; save();
      languageButton.textContent = S.lang === 'en' ? '한국어' : 'English';
      feedback = ''; root.setAttribute('aria-label', text(tool.title)); draw(); say(text(prompt(mode)));
    };
    languageButton.addEventListener('click', language, true);
    const observer = new MutationObserver(() => {
      if (!root.isConnected) { languageButton.removeEventListener('click', language, true); observer.disconnect(); drag = null; try { speechSynthesis.cancel(); } catch (_) {} }
    });
    observer.observe(view(), { childList: true });
    draw(); say(`${text(prompt(mode))} ${text(helpFor())}`);
  }

  function groups(cells) {
    const seen = new Set(); let count = 0;
    cells.forEach((c, i) => {
      if (!c || seen.has(i)) return;
      count++; const queue = [i]; seen.add(i);
      while (queue.length) {
        const p = queue.pop(), a = cells[p];
        [p - 5, p + 5, p % 5 ? p - 1 : -1, p % 5 < 4 ? p + 1 : -1].forEach(q => {
          const b = cells[q]; if (q >= 0 && q < 20 && b && !seen.has(q) && !a.split && !b.split && a.color === b.color) { seen.add(q); queue.push(q); }
        });
      }
    }); return count;
  }
  const cubes = {
    id: 'mcubes', icon: '🧊', title: B('Linking Cubes', '연결 큐브'),
    sub: B('Build, connect and count', '만들고 연결하고 세어요'),
    help: B('Matching neighbors connect. Tap a cube to move, split or remove it.', '같은 무늬끼리 이웃하면 이어져요. 골라서 옮기거나 떼요.'),
    init: () => ({ cells: Array(20).fill(null) }),
    prompt: m => m === 1 ? B('Make 7 cubes in 2 connected groups.', '큐브 7개를 이어서 두 묶음으로 만들어요.') : m === 2 ? B('Make 3 rows of 4 cubes: a rectangle.', '4개씩 3줄인 직사각형을 만들어요.') : B('Build your own cube picture.', '큐브로 자유롭게 만들어요.'),
    render({ state: s, mode, chosen }) {
      const n = s.cells.filter(Boolean).length, goal = mode && s.task ? cubeGoal(s.task, mode) : null;
      return `<div class="m-meter">${text(B('Cubes', '큐브'))}: ${n} · ${text(B('Groups', '묶음'))}: ${groups(s.cells)}</div><div class="m-cubes">${s.cells.map((c, i) => {
        const linked = q => c && !c.split && s.cells[q] && !s.cells[q].split && s.cells[q].color === c.color;
        // fix91: an empty goal cell shows its pattern faintly, so the child fills the outline in place.
        const g = goal?.[i] ?? null, ghost = !c && g !== null;
        return target(`c${i}`, B(`Place ${i + 1}${c ? ', cube ' + marks[c.color] : ghost ? ', goal ' + marks[g] : ', empty'}`, `${i + 1}번 칸${c ? ', 큐브 ' + marks[c.color] : ghost ? ', 목표 ' + marks[g] : ', 빈칸'}`), c ? `<span>${marks[c.color]}</span>` : ghost ? `<span class="m-ghost-mark">${marks[g]}</span>` : '·', `style="--m-color:${c ? colors[c.color] : ghost ? `color-mix(in srgb,${colors[g]} 40%,#fff)` : '#fff'}" aria-pressed="${chosen === `c${i}`}" data-filled="${!!c}" data-east="${i % 5 < 4 && linked(i + 1)}" data-south="${i < 15 && linked(i + 5)}"`);
      }).join('')}${goal ? goalOutline(goal) : ''}</div><div class="m-tray">${colors.map((_, i) => source(`color${i}`, B(`Cube ${marks[i]}`, `${marks[i]} 큐브`), `<span style="background:${colors[i]}">${marks[i]}</span>`, chosen === `color${i}`)).join('')}</div><div class="m-tools">${act('join', B('Connect', '연결'))}${act('split', B('Separate', '떼기'))}${act('remove', words.remove)}</div>`;
    },
    select: (s, d) => d?.startsWith('c') && s.cells[+d.slice(1)] ? d : null,
    drop(s, src, dest) {
      const i = +dest.slice(1); if (!dest.startsWith('c') || !Number.isInteger(i) || i < 0 || i >= 20) return;
      if (src.startsWith('color')) s.cells[i] = { color: +src.slice(5), split: false };
      else { const j = +src.slice(1); [s.cells[i], s.cells[j]] = [s.cells[j], s.cells[i]]; }
    },
    action(s, a, chosen) { if (!chosen?.match(/^c\d+$/)) return; const i = +chosen.slice(1); if (!s.cells[i]) return; if (a === 'remove') s.cells[i] = null; else s.cells[i].split = a === 'split'; },
    check(s, m) {
      const occupied = s.cells.map((c, i) => c ? i : -1).filter(i => i >= 0);
      if (m === 1) return occupied.length === 7 && groups(s.cells) === 2;
      const xs = occupied.map(i => i % 5), ys = occupied.map(i => Math.floor(i / 5));
      return occupied.length === 12 && Math.max(...xs) - Math.min(...xs) === 3 && Math.max(...ys) - Math.min(...ys) === 2;
    }
  };

  // Convex polygons: exact containment and intersection area, not color/pixel guesses.
  const shapes = [
    { n: B('Triangle', '삼각형'), p: [[0, 0], [2, 0], [0, 2]] },
    { n: B('Square', '정사각형'), p: [[0, 0], [2, 0], [2, 2], [0, 2]] },
    { n: B('Rectangle', '직사각형'), p: [[0, 0], [2, 0], [2, 1], [0, 1]] },
    { n: B('Parallelogram', '평행사변형'), p: [[0, 0], [1, 0], [2, 1], [1, 1]] },
    { n: B('Trapezoid', '사다리꼴'), p: [[0, 0], [1, 0], [2, 1], [0, 1]] },
    { n: B('Hexagon', '육각형'), p: [[.5, 0], [1.5, 0], [2, 1], [1.5, 2], [.5, 2], [0, 1]] }
  ];
  const area = p => Math.abs(p.reduce((v, a, i) => { const b = p[(i + 1) % p.length]; return v + a[0] * b[1] - a[1] * b[0]; }, 0)) / 2;
  const cross = (a, b, p) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
  function intersection(subject, clip) {
    let out = subject;
    clip.forEach((a, i) => {
      const b = clip[(i + 1) % clip.length], input = out; out = [];
      input.forEach((p, j) => {
        const q = input[(j + 1) % input.length], dp = cross(a, b, p), dq = cross(a, b, q);
        if (dp >= -1e-8) out.push(p);
        if ((dp >= -1e-8) !== (dq >= -1e-8)) { const t = dp / (dp - dq); out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])]); }
      });
    }); return out;
  }
  function polygon(piece) {
    let p = shapes[piece.kind].p.map(([x, y]) => [piece.flip ? -x : x, y]);
    for (let i = 0; i < piece.turn; i++) p = p.map(([x, y]) => [-y, x]);
    const minX = Math.min(...p.map(q => q[0])), minY = Math.min(...p.map(q => q[1]));
    p = p.map(([x, y]) => [x - minX + piece.x, y - minY + piece.y]);
    if (piece.flip) p.reverse(); return p;
  }
  const fits = piece => polygon(piece).every(([x, y]) => x >= 0 && y >= 0 && x <= 6 && y <= 4);
  const shapeSVG = (kind, color) => svg(`<polygon points="${shapes[kind].p.map(([x, y]) => `${x * 20 + 4},${y * 20 + 4}`).join(' ')}" fill="${color}" stroke="#344958" stroke-width="2"/>`, '0 0 48 48');
  const patterns = {
    id: 'mpatterns', icon: '🔷', title: B('Pattern Blocks', '패턴 블록'), sub: B('Move, turn and combine shapes', '도형을 옮기고 돌리고 합쳐요'),
    help: B('Shape, then square to place. Next piece selects a piece to move or turn.', '도형과 놓을 칸을 눌러요. 다음 조각으로 골라 옮기거나 돌려요.'),
    init: () => ({ pieces: [], selected: -1 }),
    prompt: m => m === 1 ? B('Fill the outline with 2 triangles.', '삼각형 2개로 점선 안을 채워요.') : m === 2 ? B('Fill the rectangle with 2 or more pieces.', '조각 2개 이상으로 직사각형을 채워요.') : B('Make a mosaic. Try turning the shapes.', '도형을 돌려 모자이크를 만들어요.'),
    render({ state: s, mode, chosen }) {
      const t = s.task;
      const outline = mode ? `<rect x="${t.x * 44}" y="${t.y * 44}" width="${t.w * 44}" height="${t.h * 44}" fill="#fff4e6" stroke="#e8590c" stroke-width="3" stroke-dasharray="7 5"/>` : '';
      // fix91: thin dashed lines show where the guided pieces go inside the outline, at full board size.
      const guide = mode && t ? patternPlan(t, mode).map(p => `<polygon points="${polygon(p).map(([x, y]) => `${x * 44},${y * 44}`).join(' ')}" fill="none" stroke="#e8590c" stroke-opacity=".55" stroke-width="1.5" stroke-dasharray="4 4"/>`).join('') : '';
      return `<div class="m-meter">${text(B('Pieces', '조각'))}: ${s.pieces.length}/12 ${s.selected >= 0 ? `· ${s.selected + 1}` : ''}</div><div class="m-pattern-board">${svg(outline + guide + s.pieces.map((p, i) => `<polygon points="${polygon(p).map(([x, y]) => `${x * 44},${y * 44}`).join(' ')}" fill="${colors[p.kind % 4]}" fill-opacity=".85" stroke="${i === s.selected ? '#1d4ed8' : '#344958'}" stroke-width="${i === s.selected ? 4 : 2}"/>`).join(''))}<div class="m-grid">${Array.from({ length: 24 }, (_, i) => target(`p${i}`, B(`Place at row ${Math.floor(i / 6) + 1}, column ${i % 6 + 1}`, `${Math.floor(i / 6) + 1}행 ${i % 6 + 1}열에 놓기`), '·')).join('')}</div></div><div class="m-tray">${shapes.map((s, i) => source(`shape${i}`, s.n, shapeSVG(i, colors[i % 4]), chosen === `shape${i}`)).join('')}</div><div class="m-tools">${act('nextpiece', B('Next piece', '다음 조각'))}${act('turn', B('Turn', '돌리기'))}${act('flip', B('Flip', '뒤집기'))}${act('remove', words.remove)}</div>`;
    },
    select: s => s.selected >= 0 ? `piece${s.selected}` : null,
    drop(s, src, dest, msg) {
      if (!dest.startsWith('p')) return; const i = +dest.slice(1);
      const adding = src.startsWith('shape'), index = adding ? s.pieces.length : +src.slice(5);
      if (adding && index >= 12) return msg(words.full);
      const p = adding ? { kind: +src.slice(5), x: i % 6, y: Math.floor(i / 6), turn: 0, flip: false } : { ...s.pieces[index], x: i % 6, y: Math.floor(i / 6) };
      if (!fits(p)) return msg(words.full);
      s.pieces[index] = p; s.selected = index;
    },
    action(s, a, _, msg) {
      if (a === 'nextpiece') { s.selected = s.pieces.length ? (s.selected + 1) % s.pieces.length : -1; return; }
      if (s.selected < 0) return;
      if (a === 'remove') { s.pieces.splice(s.selected, 1); s.selected = s.pieces.length - 1; return; }
      const p = { ...s.pieces[s.selected] };
      if (a === 'turn') p.turn = (p.turn + 1) % 4; if (a === 'flip') p.flip = !p.flip;
      if (fits(p)) s.pieces[s.selected] = p; else msg(words.full);
    },
    check(s, mode) {
      if (mode === 1 && (s.pieces.length !== 2 || s.pieces.some(p => p.kind !== 0))) return false;
      if (s.pieces.length < 2) return false;
      const x = mode === 1 ? 2 : 1, w = mode === 1 ? 2 : 4, polys = s.pieces.map(polygon);
      if (polys.some(p => p.some(([px, py]) => px < x || px > x + w || py < 1 || py > 3))) return false;
      if (Math.abs(sum(polys.map(area)) - w * 2) > 1e-7) return false;
      return polys.every((p, i) => polys.slice(i + 1).every(q => area(intersection(p, q)) < 1e-7));
    }
  };

  const unitNames = [B('Ones', '일'), B('Tens', '십'), B('Hundreds', '백')];
  const value = s => s.counts[0] + 10 * s.counts[1] + 100 * s.counts[2];
  function blockPic(i) {
    const n = [1, 10, 100][i];
    return svg(Array.from({ length: n }, (_, k) => `<rect x="${(k % 10) * 8 + 1}" y="${Math.floor(k / 10) * 8 + 1}" width="7" height="7" fill="#b9dce5" stroke="#344958" stroke-width=".6"/>`).join(''), '0 0 82 82');
  }
  const baseten = {
    id: 'mbaseten', icon: '🧱', title: B('Base-Ten Blocks', '십진 블록'), sub: B('Trade ten for one', '열 개를 하나로 바꿔요'),
    help: B('Choose 1, 10 or 100, then its column. Trade buttons keep the total the same.', '1, 10, 100을 골라 같은 열에 놓아요. 묶고 풀어도 합계는 같아요.'),
    init: () => ({ counts: [0, 0, 0], selected: 0 }),
    prompt: m => m === 1 ? B('Make 14 with 1 ten and 4 ones.', '십 1개와 일 4개로 14를 만들어요.') : m === 2 ? B('Make 126 with 16 ones.', '일 16개를 포함해서 126을 만들어요.') : B('Build a number. Bundle and unbundle.', '수를 만들고 묶거나 풀어 봐요.'),
    render({ state: s, chosen }) {
      return `<div class="m-meter">${text(B('Total', '합계'))}: ${value(s)} / 999</div><div class="m-columns">${[2, 1, 0].map(i => target(`unit${i}`, B(`${unitNames[i].en}: ${s.counts[i]}`, `${unitNames[i].ko}: ${s.counts[i]}개`), `<b>${text(unitNames[i])}</b>${blockPic(i)}<strong>× ${s.counts[i]}</strong>`, `aria-pressed="${s.selected === i}"`)).join('')}</div><div class="m-tray">${[0, 1, 2].map(i => source(`unit${i}`, B(`Add ${10 ** i}`, `${10 ** i} 추가`), `+${10 ** i}`, chosen === `unit${i}`)).join('')}${act('remove', words.remove)}</div><div class="m-tools m-trades">${act('bundle0', B('10 ones → 1 ten', '일 10 → 십 1'))}${act('split1', B('1 ten → 10 ones', '십 1 → 일 10'))}${act('bundle1', B('10 tens → 1 hundred', '십 10 → 백 1'))}${act('split2', B('1 hundred → 10 tens', '백 1 → 십 10'))}</div>`;
    },
    select(s, dest) { s.selected = +dest.slice(4); return null; },
    drop(s, src, dest, msg) { if (src !== dest) return msg(B('Use the matching column.', '같은 단위의 열에 놓아요.')); const i = +src.slice(4); if (value(s) + 10 ** i > 999) return msg(words.full); s.counts[i]++; s.selected = i; },
    action(s, a, _, msg) {
      if (a === 'remove') { s.counts[s.selected] = Math.max(0, s.counts[s.selected] - 1); return; }
      const i = +a.slice(-1);
      if (a.startsWith('bundle')) { if (s.counts[i] < 10) return msg(B('Collect ten of this unit first.', '이 단위를 열 개 모아 봐요.')); s.counts[i] -= 10; s.counts[i + 1]++; }
      if (a.startsWith('split')) { if (!s.counts[i]) return msg(B('Add a block of this unit first.', '풀어 볼 블록을 먼저 놓아요.')); s.counts[i]--; s.counts[i - 1] += 10; }
    },
    check: (s, m) => m === 1 ? s.counts.join(',') === '4,1,0' : value(s) === 126 && s.counts[0] === 16,
    // Next step toward the goal: choose a block, put it in its column, trade ten, take one out, then Check.
    hint(s, m, chosen, p) {
      if (chosen) return `drop-${chosen}`;
      const n = +(p.en.match(/\d+/) || [0])[0];
      const goal = m === 1 ? [4, 1, 0] : m === 2 ? [16, 1, 1] : [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100) % 10];
      if (!m && !n) return null;
      for (const i of [0, 1]) if (s.counts[i] >= 10 && goal[i] < 10) return `bundle${i}`;
      for (const i of [2, 1, 0]) {
        if (s.counts[i] < goal[i]) return `src-unit${i}`;
        if (s.counts[i] > goal[i]) return s.selected === i ? 'remove' : `drop-unit${i}`;
      }
      return m ? 'check' : null;
    }
  };

  const timeText = mins => `${Math.floor(mins / 60) || 12}:${String(mins % 60).padStart(2, '0')}`;
  const clock = {
    id: 'mclock', icon: '🕰️', title: B('Moving Clock', '움직이는 시계'), sub: B('Move both hands together', '두 바늘이 함께 움직여요'),
    help: B('Drag around the clock, or use hour and minute buttons. Both hands move together.', '시계를 둥글게 끌거나 시간·분 버튼을 눌러요. 두 바늘이 함께 움직여요.'),
    init: m => ({ minutes: 0, step: m === 1 ? 30 : 5, digital: true }),
    prompt: m => m === 1 ? B('Set the clock to 4:30.', '4시 30분을 만들어요.') : m === 2 ? B('Set the clock to 7:35.', '7시 35분을 만들어요.') : B('Turn the hands. What time did you make?', '바늘을 돌려 시각을 만들어요.'),
    angle(el, e) { const r = el.getBoundingClientRect(); return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 180 / Math.PI; },
    render({ state: s }) {
      const ticks = Array.from({ length: 60 }, (_, i) => `<line x1="100" y1="${i % 5 ? 14 : 10}" x2="100" y2="${i % 5 ? 18 : 21}" transform="rotate(${i * 6} 100 100)" stroke="#526477" stroke-width="${i % 5 ? 1 : 2}"/>`).join('');
      const nums = Array.from({ length: 12 }, (_, i) => { const a = (i + 1) * Math.PI / 6; return `<text x="${100 + 66 * Math.sin(a)}" y="${100 - 66 * Math.cos(a) + 5}" text-anchor="middle">${i + 1}</text>`; }).join('');
      return `<div class="m-clock" data-clock="true" aria-label="${esc(text(B('Clock face', '시계판')))}">${svg(`<circle cx="100" cy="100" r="96" fill="#fff" stroke="#344958" stroke-width="3"/>${ticks}${nums}<line class="m-hour" x1="100" y1="100" x2="100" y2="54" transform="rotate(${s.minutes * .5} 100 100)" stroke="#334155" stroke-width="8" stroke-linecap="round"/><line class="m-minute" x1="100" y1="100" x2="100" y2="28" transform="rotate(${s.minutes * 6} 100 100)" stroke="#a84022" stroke-width="4" stroke-linecap="round"/><circle cx="100" cy="100" r="5" fill="#334155"/>`, '0 0 200 200')}</div><div class="m-meter">${s.digital ? timeText(s.minutes) : '— : —'}</div><div class="m-tools">${act('hourminus', B('−1 hour', '−1시간'))}${act('hourplus', B('+1 hour', '+1시간'))}${act('minminus', B(`−${s.step} min`, `−${s.step}분`))}${act('minplus', B(`+${s.step} min`, `+${s.step}분`))}</div><div class="m-tray">${[1, 5, 30].map(n => act(`step${n}`, B(`${n} min`, `${n}분씩`), `aria-pressed="${s.step === n}"`)).join('')}${act('digital', B('Digits', '숫자'), `aria-pressed="${s.digital}"`)}</div>`;
    },
    drop() {},
    action(s, a) { if (a.startsWith('step')) s.step = +a.slice(4); else if (a === 'digital') s.digital = !s.digital; else s.minutes = (s.minutes + ({ hourminus: -60, hourplus: 60, minminus: -s.step, minplus: s.step }[a] || 0) + 720) % 720; },
    check: (s, m) => s.minutes === (m === 1 ? 270 : 455)
  };

  const balance = {
    id: 'mbalance', icon: '⚖️', title: B('Balance Scale', '양팔 저울'), sub: B('Explore equal amounts', '같은 양을 만들어요'),
    help: B('These are number weights. Choose a weight and a pan. The bigger total goes down.', '수로 표시한 추예요. 추와 접시를 눌러요. 합계가 큰 쪽이 내려가요.'),
    init: m => ({ pans: m === 1 ? [[2, 1], []] : m === 2 ? [[5, 2], [5]] : [[], []], selected: 1 }),
    prompt: m => m === 1 ? B('Keep the left side. Balance the right.', '왼쪽은 두고 오른쪽을 같게 만들어요.') : m === 2 ? B('Match the left using 2 weights on the right.', '오른쪽 추 2개로 왼쪽과 같게 만들어요.') : B('Try different weights on each side.', '양쪽에 여러 추를 놓아 보아요.'),
    render({ state: s, chosen, mode }) {
      const a = sum(s.pans[0]), b = sum(s.pans[1]), tilt = Math.sign(b - a) * 10;
      return `<div class="m-meter">${a} ${a === b ? '=' : a > b ? '>' : '<'} ${b} · ${text(a === b ? B('Equal', '같아요') : a > b ? B('Left goes down', '왼쪽이 내려가요') : B('Right goes down', '오른쪽이 내려가요'))}</div><div class="m-scale">${svg(`<path d="M115 135 L149 135 L132 55 Z" fill="#d6c7ef" stroke="#344958" stroke-width="2"/><path d="M32 55 L232 55" transform="rotate(${tilt} 132 55)" stroke="#344958" stroke-width="6"/><path d="M12 155 H252" stroke="#526477" stroke-dasharray="4 4"/>`)}<div class="m-pans">${s.pans.map((p, i) => target(`pan${i}`, i ? B('Right pan', '오른쪽 접시') : B('Left pan', '왼쪽 접시'), `<b>${text(i ? B('Right', '오른쪽') : B('Left', '왼쪽'))}${mode && !i ? ' 🔒' : ''}</b><span class="m-weights">${p.map(w => `<i>${w}</i>`).join('') || '·'}</span>`, `style="transform:translateY(${i ? tilt : -tilt}px)" aria-pressed="${s.selected === i}"`)).join('')}</div></div><div class="m-tray">${[1, 2, 5].map(n => source(`weight${n}`, B(`Weight ${n}`, `추 ${n}`), `${n}`, chosen === `weight${n}`)).join('')}</div><div class="m-tools">${act('leftremove', B('Remove left', '왼쪽 빼기'), mode ? 'disabled' : '')}${act('rightremove', B('Remove right', '오른쪽 빼기'))}</div>`;
    },
    select(s, d) { s.selected = +d.slice(3); return null; },
    drop(s, src, dest, msg) {
      const i = +dest.slice(3); if (s.locked && i === 0) return msg(B('Try the right pan.', '오른쪽 접시에 놓아 보아요.'));
      if (s.pans[i].length >= 8) return msg(words.full); s.pans[i].push(+src.slice(6)); s.selected = i;
    },
    action(s, a) { if (a === 'leftremove' && !s.locked) s.pans[0].pop(); if (a === 'rightremove') s.pans[1].pop(); },
    check: (s, m) => sum(s.pans[0]) === sum(s.pans[1]) && (m === 1 || s.pans[1].length === 2)
  };
  const balanceInit = balance.init;
  balance.init = m => ({ ...balanceInit(m), locked: !!m });

  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const letters = {
    id: 'mletters', icon: '🔤', title: B('Letter Tiles', '글자 타일'), sub: B('Build and change English words', '영어 낱말을 만들고 바꿔요'),
    help: B('Choose a letter, then a space. Listen reads a whole word, not separate sounds.', '글자와 놓을 칸을 눌러요. cat 듣기는 cat을 통째로 읽어 줘요. 글자 하나씩 소리를 내지는 않아요.'),
    init: m => ({ slots: m === 2 ? ['c', 'a', 'p', '', ''] : ['', '', '', '', ''], page: 0, upper: false, selected: -1 }),
    prompt: m => m === 1 ? B('🐱 Build cat. Listen or use the word.', '🐱 cat을 만들어요. 듣거나 낱말을 보아요.') : m === 2 ? B('🧢 cap → 🐱 cat. Change one letter.', '🧢 cap → 🐱 cat. 글자 하나를 바꿔요.') : B('Make English words with letter tiles.', '글자 타일로 영어 낱말을 만들어요.'),
    render({ state: s, mode, chosen }) {
      const pool = mode ? [...new Set((s.task.from || '') + s.task.word + 'catpms')].slice(0, 6).join('') : alphabet.slice(s.page * 6, s.page * 6 + 6);
      return `<div class="m-letter-art" aria-hidden="true">${mode ? (s.task.from ? s.task.fromIcon + ' → ' : '') + s.task.icon : 'a b c'}</div><div class="m-slots">${s.slots.map((ch, i) => target(`slot${i}`, B(`Space ${i + 1}: ${ch || 'empty'}`, `${i + 1}번 칸: ${ch || '빈칸'}`), ch ? (s.upper ? ch.toUpperCase() : ch) : '·', `aria-pressed="${s.selected === i}"`)).join('')}</div><div class="m-tray">${[...pool].map(ch => source(`letter${ch}`, B(`Letter ${ch}`, `글자 ${ch}`), s.upper ? ch.toUpperCase() : ch, chosen === `letter${ch}`)).join('')}</div><div class="m-tools">${mode ? act('word', B(`Hear ${s.task.word}`, `${s.task.word} 듣기`)) : act('page', B('More letters', '다른 글자'))}${act('case', B('Aa', 'Aa'), `aria-label="${esc(text(B('Switch letter case', '대소문자 바꾸기')))}"`)}${act('remove', words.remove)}</div>`;
    },
    select(s, d) { s.selected = +d.slice(4); return s.slots[s.selected] ? `move${s.selected}` : null; },
    drop(s, src, dest) { const i = +dest.slice(4); if (src.startsWith('letter')) s.slots[i] = src.slice(6); else { const j = +src.slice(4); [s.slots[i], s.slots[j]] = [s.slots[j], s.slots[i]]; } s.selected = i; },
    action(s, a) { if (a === 'page') s.page = (s.page + 1) % 5; if (a === 'case') s.upper = !s.upper; if (a === 'remove' && s.selected >= 0) s.slots[s.selected] = ''; if (a === 'word') say(s.task.word, 'en-US'); },
    check: s => s.slots.join('|') === 'c|a|t||'
  };

  // Integer units (LCM 2,3,4,6,8 = 24) keep every comparison exact.
  const denominators = [2, 3, 4, 6, 8];
  const fractions = {
    id: 'mfractions', icon: '◔', title: B('Fraction Models', '분수 타일과 원'), sub: B('Parts of the same whole', '같은 전체를 나눠요'),
    help: B('Choose a piece, then a row. Remove takes off the last piece. Bars and circles show the same whole.', '조각을 골라 줄에 놓아요. 빼기는 마지막 조각을 빼요. 두 줄의 전체는 같은 양을 나타내요.'),
    init: () => ({ rows: [[], []], selected: 0, circle: false }),
    prompt: m => m === 1 ? B('Fill row A with two halves.', '반 조각 두 개로 A줄 전체를 채워요.') : m === 2 ? B('Make one half in A and the same amount with fourths in B.', 'A줄에 반 조각 하나, B줄에 같은 양의 4분의 1 조각을 놓아요.') : B('Explore equal parts of a whole.', '전체를 같은 크기 조각으로 나눠 보아요.'),
    render({ state: s, chosen }) {
      const model = s.rows.map((row, i) => {
        let start = 0;
        const parts = row.map((d, j) => {
          const from = start; start += 24 / d;
          if (!s.circle) return `<rect x="${from * 10}" y="0" width="${240 / d}" height="48" fill="${colors[j % 4]}" stroke="#344958"/><text x="${(from + 12 / d) * 10}" y="29" text-anchor="middle" font-size="14">1/${d}</text>`;
          const point = u => [70 + 60 * Math.sin(u * Math.PI / 12), 70 - 60 * Math.cos(u * Math.PI / 12)];
          const a = point(from), b = point(start);
          return `<path d="M70 70 L${a.join(' ')} A60 60 0 0 1 ${b.join(' ')} Z" fill="${colors[j % 4]}" stroke="#344958"/>`;
        }).join('');
        const image = s.circle ? svg(`<circle cx="70" cy="70" r="60" fill="#fff" stroke="#344958"/>${parts}`, '0 0 140 140') : svg(`<rect width="240" height="48" fill="#fff" stroke="#344958"/>${parts}`, '0 0 240 48');
        return target(`fraction${i}`, B(`Row ${i ? 'B' : 'A'}, ${sum(row.map(d => 24 / d))} of 24 equal units`, `${i ? 'B' : 'A'}줄, 같은 크기 24칸 중 ${sum(row.map(d => 24 / d))}칸`), `<b>${i ? 'B' : 'A'}</b>${image}`, `aria-pressed="${s.selected === i}"`);
      }).join('');
      return `<div class="m-fraction-model ${s.circle ? 'm-circles' : ''}">${model}</div><div class="m-tray">${denominators.map(d => source(`fractionpiece${d}`, B(`One ${d === 2 ? 'half' : 'piece: 1/' + d}`, `${d}분의 1 조각`), `1/${d}`, chosen === `fractionpiece${d}`)).join('')}</div><div class="m-tools">${act('model', s.circle ? B('Bars', '막대') : B('Circles', '원'))}${act('remove', words.remove)}</div>`;
    },
    select(s, d) { s.selected = +d.slice(8); return null; },
    drop(s, src, dest, msg) {
      if (!/^fraction[01]$/.test(dest) || !src.startsWith('fractionpiece')) return;
      const d = +src.slice(13), i = +dest.slice(8);
      if (!denominators.includes(d)) return;
      if (sum(s.rows[i].map(n => 24 / n)) + 24 / d > 24) return msg(words.full);
      s.rows[i].push(d); s.selected = i;
    },
    action(s, a) { if (a === 'model') s.circle = !s.circle; if (a === 'remove') s.rows[s.selected].pop(); },
    check: (s, m) => m === 1 ? s.rows[0].join(',') === '2,2' : s.rows[0].join(',') === '2' && s.rows[1].join(',') === '4,4'
  };

  const commands = [B('Forward', '앞으로'), B('Turn left', '왼쪽 회전'), B('Turn right', '오른쪽 회전')];
  const commandMarks = ['↑', '↶', '↷'];
  const robotStart = () => ({ pos: 12, facing: 0, pc: 0, blocked: false });
  function robotStep(s) {
    if (s.pc >= s.code.length || s.blocked) return;
    const c = s.code[s.pc++];
    if (c === 1 || c === 2) { s.facing = (s.facing + (c === 1 ? 3 : 1)) % 4; return; }
    const x = s.pos % 4, y = Math.floor(s.pos / 4), dx = [0, 1, 0, -1][s.facing], dy = [-1, 0, 1, 0][s.facing];
    const next = s.pos + dx + dy * 4;
    if (x + dx < 0 || x + dx > 3 || y + dy < 0 || y + dy > 3 || s.walls.includes(next)) s.blocked = true;
    else s.pos = next;
  }
  const coding = {
    id: 'mcoding', icon: '🤖', title: B('Coding Robot', '코딩 로봇'), sub: B('Build, run and change a path', '길을 만들고 실행하고 고쳐요'),
    help: B('Choose a card, then a slot. Turns stay in place. Run starts over; Step runs one card. Select a slot to remove it.', '카드를 골라 칸에 놓아요. 회전은 제자리에서 해요. 실행은 처음부터, 한 단계는 카드 하나만 실행해요. 칸을 골라 뺄 수 있어요.'),
    init: m => ({ ...robotStart(), code: m === 2 ? [0, 2, 0, 0] : [], selected: -1, goal: m === 1 ? 4 : 6, walls: m === 2 ? [9] : [], edit: 'goal', free: !m }),
    prompt: m => m === 1 ? B('Reach the star. Start facing up.', '위를 보는 로봇을 별까지 보내요.') : m === 2 ? B('Fix the cards. Reach the star without hitting the wall.', '카드를 고쳐 벽을 피해 별까지 가요.') : B('Make a path. Move the star or add walls.', '길을 만들어요. 별을 옮기거나 벽을 놓아요.'),
    render({ state: s, chosen, mode }) {
      return `<div class="m-meter">${text(B('Facing', '보는 방향'))}: ${['↑', '→', '↓', '←'][s.facing]} · ${s.pc}/${s.code.length}${s.blocked ? ' ⛔' : ''}</div><div class="m-coding-panels"><div class="m-robot-board">${Array.from({ length: 16 }, (_, i) => target(`board${i}`, B(`Board row ${Math.floor(i / 4) + 1}, column ${i % 4 + 1}${s.pos === i ? ', robot' : s.walls.includes(i) ? ', wall' : s.goal === i ? ', star' : ''}`, `${Math.floor(i / 4) + 1}행 ${i % 4 + 1}열${s.pos === i ? ', 로봇' : s.walls.includes(i) ? ', 벽' : s.goal === i ? ', 별' : ''}`), s.pos === i ? `🍑${['↑', '→', '↓', '←'][s.facing]}` : s.walls.includes(i) ? '▦' : s.goal === i ? '⭐' : i === 12 ? '⌂' : '·')).join('')}</div><div class="m-code-slots">${Array.from({ length: 8 }, (_, i) => target(`code${i}`, B(`Card ${i + 1}: ${s.code[i] === undefined ? 'empty' : commands[s.code[i]].en}`, `${i + 1}번 카드: ${s.code[i] === undefined ? '빈칸' : commands[s.code[i]].ko}`), s.code[i] === undefined ? `${i + 1}` : commandMarks[s.code[i]], `aria-pressed="${s.selected === i}"`)).join('')}</div></div><div class="m-tray">${commands.map((c, i) => source(`command${i}`, c, commandMarks[i], chosen === `command${i}`)).join('')}${act('remove', words.remove)}</div><div class="m-tools">${!mode ? act('editboard', s.edit === 'goal' ? B('⭐ Move', '⭐ 옮기기') : B('▦ Walls', '▦ 벽')) : ''}${act('run', B('Run', '실행'))}${act('step', B('Step', '한 단계'))}${act('rewind', B('Start', '출발'))}</div>`;
    },
    tap(s, d) {
        if (!s.free) return null;
        const i = +d.slice(5); if (i === 12) return null;
        if (s.edit === 'goal') { s.goal = i; s.walls = s.walls.filter(w => w !== i); }
        else if (i !== s.goal) s.walls = s.walls.includes(i) ? s.walls.filter(w => w !== i) : [...s.walls, i];
        Object.assign(s, robotStart()); return null;
    },
    select(s, d) {
      if (d.startsWith('board')) return null;
      s.selected = +d.slice(4); return s.selected < s.code.length ? `movecard${s.selected}` : null;
    },
    drop(s, src, dest) {
      if (!/^code[0-7]$/.test(dest)) return;
      const i = Math.min(+dest.slice(4), s.code.length);
      if (src.startsWith('command')) { if (i === 8) return; s.code[i] = +src.slice(7); }
      else if (src.startsWith('movecard')) { const j = +src.slice(8); if (j === i) return; const c = s.code.splice(j, 1)[0]; s.code.splice(Math.min(i, s.code.length), 0, c); }
      s.selected = Math.min(i, s.code.length - 1); Object.assign(s, robotStart());
    },
    action(s, a, _, msg) {
      if (a === 'editboard') s.edit = s.edit === 'goal' ? 'wall' : 'goal';
      if (a === 'remove' && s.selected >= 0) { s.code.splice(s.selected, 1); s.selected = -1; Object.assign(s, robotStart()); }
      if (a === 'rewind' || a === 'run') Object.assign(s, robotStart());
      if (a === 'step') robotStep(s);
      if (a === 'run') for (let i = 0; i < s.code.length; i++) robotStep(s);
      if (s.blocked) msg(B('The robot stopped at an edge or wall. Change a card and try again.', '가장자리나 벽에서 멈췄어요. 카드를 바꿔 다시 해 봐요.'));
    },
    check(s) { const test = { ...copy(s), ...robotStart() }; for (let i = 0; i < test.code.length; i++) robotStep(test); return !test.blocked && test.pos === test.goal; }
  };

  // 84: optional free-play invitations. Same tools and controls; no target answer or new score.
  const freeBuildIdeas = [["🐍","snake","뱀"],["🏠","house","집"],["🌻","flower","꽃"],["🌳","tree","나무"],["🚂","train","기차"],["🚗","car","자동차"],["🚀","rocket","로켓"],["⛵","boat","배"],["🌉","bridge","다리"],["🏰","castle","성"],["🤖","robot","로봇"],["🐟","fish","물고기"],["🐱","cat","고양이"],["🐶","dog","강아지"],["🦋","butterfly","나비"],["🐢","turtle","거북이"],["🐰","rabbit","토끼"],["🪑","chair","의자"],["🪜","ladder","사다리"],["👑","crown","왕관"],["🪁","kite","연"],["☀️","sun","해"],["🦖","dinosaur","공룡"],["🎸","guitar","기타"],["🍎","apple","사과"],["☂️","umbrella","우산"],["🐘","elephant","코끼리"],["🦒","giraffe","기린"],["🌈","rainbow","무지개"],["🛝","slide","미끄럼틀"]];
  // cbn93 (user 11-09): the cube pictures are color by number. Each cell shows 1-4, the chart says which color each
  // number is, and a cube goes on a number only in that number's color. Plain outline filling was too easy.
  const cubePics93 = {snake:'144../..4../..444/....4',house:'..1../.111./.222./.232.',flower:'.121./.111./..4../.44..',tree:'.414./44144/..2../..2..',
    train:'1..../11333/11333/.2.2.',car:'...../.333./11111/.2.2.',rocket:'..1../.333./.333./2.2.2',boat:'..4../.22../11111/.111.',
    bridge:'...../11111/3.3.3/3.3.3',castle:'3.3.3/22222/22.22/22.22',robot:'.333./32323/.333./.1.1.',fish:'...../.33.1/32333/.33.1',
    cat:'2...2/22222/23232/.212.',dog:'1..../22232/.2222/.2..2',butterfly:'11.11/12321/.131./33.33',turtle:'...../..434/24444/.4.4.',
    rabbit:'.2.2./.1.1./.323./.222.',chair:'1..../1..../33333/1...1',ladder:'1...1/12221/1...1/12221',crown:'...../1.3.1/22222/22222',
    kite:'..1../.121./.343./..3..',sun:'.222./21212/22122/.222.',dinosaur:'...44/..434/2444./.4.4.',guitar:'..1../..1../.222./.232.',
    apple:'..4../.111./11121/.111.',umbrella:'.111./13131/..2../.22..',elephant:'.333./32133/3333./3.3..',giraffe:'22.../.2.../.2121/.2..2',
    rainbow:'.111./12221/23.32/3...3',slide:'1..../13.../1.3../1..33'};
  const picColors = ['#e5484d', '#f7c948', '#3f7fe8', '#3aa864'];
  const picNames = [B('red', '빨강'), B('yellow', '노랑'), B('blue', '파랑'), B('green', '초록')];
  cubes.topics = freeBuildIdeas.map(([e, en, ko]) => Object.assign(B(`Color by number: make ${en === 'apple' || en === 'umbrella' || en === 'elephant' ? 'an' : 'a'} ${en}. ${e}`, `번호대로 색칠해서 ${ko}${(ko.charCodeAt(ko.length - 1) - 0xac00) % 28 ? '을' : '를'} 완성해요. ${e}`), { pic: cubePics93[en].replace(/\//g, '').split('').map(ch => ch === '.' ? null : +ch - 1) }));
  cubes.freeLabel = B('Picture', '그림');
  cubes.picHelp = B("Find the number's color in the chart. Put that color cube on the number.", '숫자의 색을 색깔표에서 찾아요. 그 색 큐브를 숫자 위에 놓아요.');
  const picDone = s => s.pic.every((g, i) => g === null || s.cells[i]?.color === g);
  const cubeRender93 = cubes.render, cubeDrop93 = cubes.drop;
  cubes.render = c => {
    const s = c.state; if (c.mode || !s.pic) return cubeRender93(c);
    const total = s.pic.filter(g => g !== null).length, n = s.pic.filter((g, i) => g !== null && s.cells[i]).length;
    return `<div class="m-legend" aria-label="${esc(text(B('Color chart', '색깔표')))}">${picColors.map((col, i) => `<span><b>${i + 1}</b><i style="background:${col}"></i></span>`).join('')}<span class="m-count">🧊 ${n}/${total}</span></div><div class="m-cubes m-pic${picDone(s) ? ' m-pic-done' : ''}">${s.pic.map((g, i) => {
      const cell = s.cells[i];
      if (g === null) return `<span class="m-off" aria-hidden="true"></span>`;
      return target(`c${i}`, B(`Place ${i + 1}, ${cell ? text(picNames[cell.color]) + ' cube' : 'number ' + (g + 1)}`, `${i + 1}번 칸, ${cell ? text(picNames[cell.color]) + ' 큐브' : '숫자 ' + (g + 1)}`), cell ? '<span></span>' : `<span class="m-num">${g + 1}</span>`, `style="--m-color:${cell ? picColors[cell.color] : '#fff'}" aria-pressed="${c.chosen === `c${i}`}" data-filled="${!!cell}"`);
    }).join('')}</div><div class="m-tray">${picColors.map((col, i) => source(`color${i}`, B(`${text(picNames[i])} cube`, `${text(picNames[i])} 큐브`), `<span style="background:${col}"></span>`, c.chosen === `color${i}`)).join('')}</div><div class="m-tools">${act('remove', words.remove)}</div>`;
  };
  cubes.drop = (s, src, dest, msg) => {
    if (s.task || !s.pic) return cubeDrop93(s, src, dest, msg);
    const i = +dest.slice(1), g = s.pic[i];
    if (!dest.startsWith('c') || !Number.isInteger(i) || g == null || !src.startsWith('color')) return;
    const color = +src.slice(5);
    if (color !== g) { s.miss = i; msg(B(`Look at the chart. Number ${g + 1} is ${text(picNames[g])}.`, `색깔표를 봐요. ${g + 1}번은 ${text(picNames[g])}이에요.`)); say(text(B('Look at the chart again.', '색깔표를 다시 봐요.'))); return; }
    s.cells[i] = { color, split: false }; delete s.miss;
    if (picDone(s)) { msg(words.good); say(text(words.good)); }
  };
  patterns.topics = freeBuildIdeas.map(([e, en, ko]) => B(`Make ${en === 'apple' || en === 'umbrella' || en === 'elephant' ? 'an' : 'a'} ${en} with shapes. ${e}`, `도형으로 ${ko} 모양을 만들어요. ${e}`));
  baseten.topics = Array.from({ length: 30 }, (_, i) => { const n = 12 + i * 3; return B(`Explore ${n}. Try bundling and unbundling.`, `${n}을 만들고 묶거나 풀어 봐요.`); });
  clock.topics = Array.from({ length: 24 }, (_, i) => B(`Explore ${timeText(i * 30)}. Move both hands.`, `${Math.floor(i / 2) || 12}시${i % 2 ? ' 30분' : ''}를 만들고 바늘을 움직여 봐요.`));
  balance.topics = Array.from({ length: 30 }, (_, i) => B(`Explore ${i + 2} on both pans.`, `양쪽 접시에 ${i + 2}를 만들어 봐요.`));
  letters.topics = [["cat","cap"],["hat","bat"],["sun","run"],["pig","wig"],["dog","log"],["hen","pen"],["bed","red"],["bug","rug"],["fan","pan"],["map","cap"],["pot","hot"],["cup","pup"],["pin","fin"],["top","hop"],["net","pet"],["bag","tag"],["mop","pop"],["can","man"],["sit","hit"],["ten","hen"],["fox","box"],["bat","bit"],["pan","pin"],["hat","hot"],["tap","top"],["pig","peg"],["cot","cut"],["pat","pet"],["rag","rug"],["big","bag"]].map(([a, b]) => B(`Try ${a} and ${b}. Change the letters.`, `${a}와 ${b}를 만들고 글자를 바꿔 봐요.`));
  fractions.topics = denominators.flatMap(d => Array.from({ length: d }, (_, i) => B(`Explore ${i + 1}/${d}. Try bars and circles.`, `${d}분의 ${i + 1}을 막대와 원으로 만들어 봐요.`)));
  fractions.topics.push(B('Make a whole with halves and fourths.', '반과 4분의 1로 전체를 만들어 봐요.'), B('Make a whole with thirds and sixths.', '3분의 1과 6분의 1로 전체를 만들어 봐요.'), B('Make a whole with fourths and eighths.', '4분의 1과 8분의 1로 전체를 만들어 봐요.'));
  // Free coding still lets the child move the star and walls. Start from varied reachable boards.
  const codingInit84 = coding.init;
  coding.init = m => {
    const s = codingInit84(m);
    if (!m) {
      const boards = [];
      for (const goal of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14, 15]) {
        // All walls stay off the chosen route (up first, then right).
        const gx = goal % 4, gy = Math.floor(goal / 4);
        const route = [12]; for (let y = 2; y >= gy; y--) route.push(y * 4);
        for (let x = 1; x <= gx; x++) route.push(gy * 4 + x);
        for (const wall of [1, 5, 9, 13]) if (!route.includes(wall)) boards.push({ goal, walls: [wall] });
      }
      Object.assign(s, pick(boards));
    }
    return s;
  };

  // 85: a task travels with its construction. Reset/undo/language changes cannot
  // accidentally ask about one target and check another. These are guided,
  // unscored manipulatives: showing a construction target is intentional.
  const tasks = (tool, one, two, init, check) => {
    const freeInit = tool.init, freePrompt = tool.prompt;
    tool.challenges = { 1: one, 2: two };
    for (const m of [1, 2]) tool.challenges[m].forEach((t, i) => { t.id = `${tool.id}-${m}-${i}`; });
    tool.init = (m, t = tool.challenges[m]?.[0]) => m ? { ...init(m, t), task: copy(t) } : freeInit(0);
    tool.prompt = (m, t = tool.challenges[m]?.[0]) => m ? t.prompt : freePrompt(0);
    tool.check = (s, m) => !!s.task && check(s, m, s.task);
  };
  const placeHint = (chosen, src, dest) => chosen === src ? `drop-${dest}` : `src-${src}`;
  const clearChoice = chosen => /^(color|shape|unit|weight|letter|fractionpiece|command)/.test(chosen) ? `src-${chosen}` : `drop-${chosen.startsWith('move') ? 'slot' + chosen.slice(4) : chosen}`;
  const doneHint = m => m ? 'check' : null;
  const cubeOne = [{ n: 7, g: 2 }];
  for (let n = 2; cubeOne.length < 20; n++) for (let g = 1; g <= Math.min(4, n); g++) {
    if (n !== 7 || g !== 2) cubeOne.push({ n, g });
    if (cubeOne.length === 20) break;
  }
  const cubeTwo = [{ rows: 3, cols: 4, stripes: false }];
  for (const stripes of [false, true]) for (let rows = 2; rows <= 4; rows++) for (let cols = 2; cols <= 5; cols++) {
    if (cubeTwo.length < 20 && (stripes || rows !== 3 || cols !== 4)) cubeTwo.push({ rows, cols, stripes });
  }
  cubeOne.forEach(t => { t.prompt = B(`🎯 🧊×${t.n} · ${t.g} ${t.g === 1 ? 'group' : 'groups'}. Connect the cubes.`, `🎯 🧊×${t.n} · ${t.g}묶음으로 이어요.`); });
  cubeTwo.forEach(t => { t.prompt = B(`🎯 ▦ ${t.rows}×${t.cols}. ${t.stripes ? 'Make neighboring rows different.' : 'Build a rectangle.'}`, `🎯 ▦ ${t.rows}줄×${t.cols}개. ${t.stripes ? '이웃 줄은 다른 무늬로 만들어요.' : '직사각형을 만들어요.'}`); });
  tasks(cubes, cubeOne, cubeTwo, () => ({ cells: Array(20).fill(null) }), (s, m, t) => {
    const occupied = s.cells.map((c, i) => c ? i : -1).filter(i => i >= 0);
    if (m === 1) return occupied.length === t.n && groups(s.cells) === t.g;
    if (occupied.length !== t.rows * t.cols) return false;
    const xs = occupied.map(i => i % 5), ys = occupied.map(i => Math.floor(i / 5));
    if (Math.max(...xs) - Math.min(...xs) + 1 !== t.cols || Math.max(...ys) - Math.min(...ys) + 1 !== t.rows) return false;
    if (!t.stripes) return true;
    const rowColors = [];
    for (let y = Math.min(...ys); y <= Math.max(...ys); y++) {
      const row = occupied.filter(i => Math.floor(i / 5) === y).map(i => s.cells[i].color);
      if (new Set(row).size !== 1 || rowColors.at(-1) === row[0]) return false;
      rowColors.push(row[0]);
    }
    return true;
  });
  // The goal picture: the cells to fill and each cell's pattern. Shared by hint() and the dashed outline.
  function cubeGoal(t, m) {
    const goal = Array(20).fill(null);
    if (m === 1) {
      // A snake visits neighboring cells; each group has its own pattern.
      for (let k = 0; k < t.n; k++) { const y = Math.floor(k / 5), x = y % 2 ? 4 - k % 5 : k % 5; goal[y * 5 + x] = Math.floor(k * t.g / t.n); }
    } else for (let y = 0; y < t.rows; y++) for (let x = 0; x < t.cols; x++) goal[y * 5 + x] = t.stripes ? y % 2 : (x + y) % 3;   // 11-12: a plain rectangle is a 3-color diagonal pattern, so every number needs its own look-up
    return goal;
  }
  // fix91: a big dashed outline on the board itself (44px cells, 4px gaps). A line is drawn where a goal cell meets
  // a non-goal cell or a different group's pattern, so each group is its own outlined shape.
  function goalOutline(goal) {
    const segs = [];
    goal.forEach((g, i) => {
      if (g === null) return;
      const x = i % 5, y = Math.floor(i / 5), l = x * 48 - 2, r = l + 48, t = y * 48 - 2, b = t + 48;
      const other = q => q < 0 || goal[q] !== g;
      if (y === 0 || other(i - 5)) segs.push(`M${l} ${t}H${r}`);
      if (y === 3 || other(i + 5)) segs.push(`M${l} ${b}H${r}`);
      if (x === 0 || other(i - 1)) segs.push(`M${l} ${t}V${b}`);
      if (x === 4 || other(i + 1)) segs.push(`M${r} ${t}V${b}`);
    });
    return `<svg class="m-goal" viewBox="-2 -2 240 192" preserveAspectRatio="none" aria-hidden="true"><path vector-effect="non-scaling-stroke" d="${segs.join('')}" fill="none" stroke="#e8590c" stroke-width="3" stroke-dasharray="7 5" stroke-linecap="round"/></svg>`;
  }
  cubes.hint = (s, m, chosen) => {
    // cbn93: in a picture, glow the right color only after a wrong try (the chart is the first help).
    if (!m) return s.pic && s.miss != null && !s.cells[s.miss] ? placeHint(chosen, `color${s.pic[s.miss]}`, `c${s.miss}`) : null;
    if (cubes.check(s, m)) return 'check';
    // 11-12: levels are number charts now; like the pictures, the right color glows only after a wrong try.
    if (cubes.levelPic) return s.miss != null && !s.cells[s.miss] ? placeHint(chosen, `color${cubeGoal(s.task, m)[s.miss]}`, `c${s.miss}`) : null;
    const goal = cubeGoal(s.task, m);
    for (let i = 0; i < 20; i++) {
      if (goal[i] === null && s.cells[i]) return chosen === `c${i}` ? 'remove' : chosen ? clearChoice(chosen) : `drop-c${i}`;
      if (goal[i] !== null && (!s.cells[i] || s.cells[i].color !== goal[i] || s.cells[i].split)) return placeHint(chosen, `color${goal[i]}`, `c${i}`);
    }
    return null;
  };

  // 11-12 (user, sample 50): levels 1-2 were "fill the dashed outline", which a child does by copying the shape.
  // They now use the same number chart as the pictures: each goal cell shows a number and only that number's color fits.
  // The math goal (how many cubes, how many groups, rows x columns) stays in the prompt and the meter.
  cubes.levelPic = true;
  const cubeRender97 = cubes.render, cubeDrop97 = cubes.drop, taskMode = t => t.rows ? 2 : 1;
  cubes.render = c => {
    const s = c.state; if (!c.mode || !s.task) return cubeRender97(c);
    const goal = cubeGoal(s.task, c.mode), total = goal.filter(g => g !== null).length, n = s.cells.filter(Boolean).length;
    const used = [...new Set(goal.filter(g => g !== null))].sort();
    return `<div class="m-legend" aria-label="${esc(text(B('Color chart', '색깔표')))}">${used.map(i => `<span><b>${i + 1}</b><i style="background:${picColors[i]}"></i></span>`).join('')}<span class="m-count">🧊 ${n}/${total} · ${text(B('Groups', '묶음'))} ${groups(s.cells)}</span></div><div class="m-cubes m-pic">${goal.map((g, i) => {
      const cell = s.cells[i];
      if (g === null && !cell) return `<span class="m-off" aria-hidden="true"></span>`;
      return target(`c${i}`, B(`Place ${i + 1}, ${cell ? text(picNames[cell.color]) + ' cube' : 'number ' + (g + 1)}`, `${i + 1}번 칸, ${cell ? text(picNames[cell.color]) + ' 큐브' : '숫자 ' + (g + 1)}`), cell ? '<span></span>' : `<span class="m-num">${g + 1}</span>`, `style="--m-color:${cell ? picColors[cell.color] : '#fff'}" aria-pressed="${c.chosen === `c${i}`}" data-filled="${!!cell}"`);
    }).join('')}</div><div class="m-tray">${used.map(i => source(`color${i}`, B(`${text(picNames[i])} cube`, `${text(picNames[i])} 큐브`), `<span style="background:${picColors[i]}"></span>`, c.chosen === `color${i}`)).join('')}</div><div class="m-tools">${act('remove', words.remove)}</div>`;
  };
  cubes.drop = (s, src, dest, msg) => {
    if (!s.task) return cubeDrop97(s, src, dest, msg);
    const goal = cubeGoal(s.task, taskMode(s.task)), i = +dest.slice(1), g = goal[i];
    if (!dest.startsWith('c') || !Number.isInteger(i) || g == null || !src.startsWith('color')) return;
    const color = +src.slice(5);
    if (color !== g) { s.miss = i; msg(B(`Look at the chart. Number ${g + 1} is ${text(picNames[g])}.`, `색깔표를 봐요. ${g + 1}번은 ${text(picNames[g])}이에요.`)); say(text(B('Look at the chart again.', '색깔표를 다시 봐요.'))); return; }
    s.cells[i] = { color, split: false }; delete s.miss;
    if (goal.every((q, k) => q === null || s.cells[k]?.color === q)) { const t = B(`All filled! Tap ${text(words.check)}.`, `다 채웠어요! ${text(words.check)}을 눌러요.`); msg(t); say(text(t)); }
  };

  const patternOne = [{ x: 2, y: 1, w: 2, h: 2, kind: 0 }], patternTwo = [{ x: 1, y: 1, w: 4, h: 2, mixed: false }];
  for (const kind of [0, 2]) for (let y = 0; y < 3; y++) for (let x = 0; x < 5; x++) {
    if (patternOne.length < 20 && (kind || x !== 2 || y !== 1)) patternOne.push({ x, y, w: 2, h: 2, kind });
  }
  for (const [w, h] of [[2, 3], [2, 4], [4, 2], [4, 3], [4, 4], [6, 2], [6, 3], [6, 4]]) for (let y = 0; y <= 4 - h; y++) for (let x = 0; x <= 6 - w; x++) {
    if (patternTwo.length < 20) patternTwo.push({ x, y, w, h, mixed: true });
  }
  patternOne.forEach(t => { t.prompt = B(`🎯 ${t.kind ? '▭' : '△'}×2. Fill the dotted square.`, `🎯 ${t.kind ? '▭' : '△'}×2. 점선 네모를 채워요.`); });
  patternTwo.forEach(t => { t.prompt = B(`🎯 ▭ ${t.w}×${t.h}. ${t.mixed ? 'Fill with different kinds of shapes.' : 'Fill with two or more pieces.'}`, `🎯 ▭ ${t.w}×${t.h}. ${t.mixed ? '서로 다른 모양으로 채워요.' : '조각 둘 이상으로 채워요.'}`); });
  const patternPlan = (t, m) => {
    if (m === 1 && t.kind === 2) return [0, 1].map(dy => ({ kind: 2, x: t.x, y: t.y + dy, turn: 0, flip: false }));
    const out = [0, 2].map(turn => ({ kind: 0, x: t.x, y: t.y, turn, flip: false }));
    for (let y = 0; y < t.h; y++) for (let x = 0; x < t.w; x += 2) if (x || y >= 2) out.push({ kind: 2, x: t.x + x, y: t.y + y, turn: 0, flip: false });
    return out;
  };
  tasks(patterns, patternOne, patternTwo, () => ({ pieces: [], selected: -1 }), (s, m, t) => {
    if (m === 1 && (s.pieces.length !== 2 || s.pieces.some(p => p.kind !== t.kind))) return false;
    if (s.pieces.length < 2 || (t.mixed && new Set(s.pieces.map(p => p.kind)).size < 2)) return false;
    const polys = s.pieces.map(polygon);
    return !polys.some(p => p.some(([x, y]) => x < t.x || x > t.x + t.w || y < t.y || y > t.y + t.h)) &&
      Math.abs(sum(polys.map(area)) - t.w * t.h) < 1e-7 && polys.every((p, i) => polys.slice(i + 1).every(q => area(intersection(p, q)) < 1e-7));
  });
  patterns.hint = (s, m, chosen) => {
    if (!m) return null;
    if (patterns.check(s, m)) return 'check';
    const plan = patternPlan(s.task, m);
    for (let i = 0; i < s.pieces.length; i++) {
      const p = s.pieces[i], q = plan[i];
      if (!q || p.kind !== q.kind || p.x !== q.x || p.y !== q.y) return s.selected === i ? 'remove' : 'nextpiece';
      if (p.flip !== q.flip) return s.selected === i ? 'flip' : 'nextpiece';
      if (p.turn !== q.turn) return s.selected === i ? 'turn' : 'nextpiece';
    }
    const q = plan[s.pieces.length];
    return q ? placeHint(chosen, `shape${q.kind}`, `p${q.y * 6 + q.x}`) : null;
  };

  const baseOne = [14, 12, 18, 21, 25, 29, 30, 34, 38, 42, 46, 51, 55, 59, 63, 67, 72, 78, 84, 96].map(n => ({ n, ones: n % 10 }));
  const baseTwo = [126, 24, 37, 48, 59, 63, 75, 86, 97, 108, 114, 132, 145, 158, 169, 173, 184, 195, 207, 218].map(n => ({ n, ones: 10 + n % 10 }));
  baseOne.forEach(t => { t.prompt = B(`🎯 ${t.n}. Build with tens and ones.`, `🎯 ${t.n}. 십과 일로 만들어요.`); });
  baseTwo.forEach(t => { t.prompt = B(`🎯 ${t.n} · 1×${t.ones}. Use ${t.ones} ones.`, `🎯 ${t.n} · 1×${t.ones}. 일 ${t.ones}개를 써요.`); });
  const baseGoal = t => [t.ones, Math.floor((t.n - t.ones) / 10) % 10, Math.floor((t.n - t.ones) / 100)];
  tasks(baseten, baseOne, baseTwo, () => ({ counts: [0, 0, 0], selected: 0 }), (s, m, t) => s.counts.join() === baseGoal(t).join());
  baseten.hint = (s, m, chosen, p) => {
    const n = +(p.en.match(/\d+/) || [0])[0], goal = m ? baseGoal(s.task) : [n % 10, Math.floor(n / 10) % 10, Math.floor(n / 100)];
    if (!m && !n) return null;
    for (const i of [2, 1, 0]) {
      if (s.counts[i] > goal[i]) { if (chosen) return `src-${chosen}`; return s.selected === i ? 'remove' : `drop-unit${i}`; }
      if (s.counts[i] < goal[i]) return placeHint(chosen, `unit${i}`, `unit${i}`);
    }
    return doneHint(m);
  };

  const clockOne = [270, ...Array.from({ length: 24 }, (_, i) => i * 30).filter(n => n !== 270)].map(n => ({ n, start: 0 }));
  const clockTwo = [{ n: 455, start: 0, direct: true }];
  for (let i = 0; clockTwo.length < 20; i++) { const start = (i * 35 + 50) % 720, add = [15, 20, 30, 45][i % 4]; clockTwo.push({ n: (start + add) % 720, start, add }); }
  clockOne.forEach(t => { t.prompt = B(`🎯 🕒 ${timeText(t.n)}. Move the hands.`, `🎯 🕒 ${timeText(t.n)}. 바늘을 맞춰요.`); });
  clockTwo.forEach(t => { t.prompt = t.direct ? B('🎯 🕒 7:35. Set the clock.', '🎯 🕒 7:35. 바늘을 맞춰요.') : B(`🕒 ${timeText(t.start)} → +${t.add} min → ?`, `🕒 ${timeText(t.start)} → ${t.add}분 뒤 → ?`); });
  tasks(clock, clockOne, clockTwo, (m, t) => ({ minutes: t.start, step: m === 1 ? 30 : 5, digital: true }), (s, m, t) => s.minutes === t.n);
  clock.hint = (s, m, _, p) => {
    const match = p.en.match(/(\d+):(\d+)/), goal = m ? s.task.n : match ? (+match[1] % 12) * 60 + +match[2] : null;
    if (goal === null) return null;
    const delta = (goal - s.minutes + 1080) % 720 - 360;
    if (!delta) return doneHint(m);
    if (Math.abs(delta) >= 60) return delta > 0 ? 'hourplus' : 'hourminus';
    const step = Math.abs(delta) % 5 ? 1 : Math.abs(delta) % 30 ? 5 : 30;
    if (s.step !== step) return `step${step}`;
    return delta > 0 ? 'minplus' : 'minminus';
  };

  const weightsFor = (n, count) => {
    if (!n && (count === undefined || count === 0)) return [];
    if (n < 0 || count === 0) return null;
    for (const w of [5, 2, 1]) if (w <= n) { const rest = weightsFor(n - w, count === undefined ? undefined : count - 1); if (rest && rest.length < 8) return [w, ...rest]; }
    return null;
  };
  const balanceOne = [3, ...Array.from({ length: 20 }, (_, i) => i + 2).filter(n => n !== 3)].map(n => ({ n }));
  const balanceTwo = [{ n: 7, count: 2 }];
  for (let count = 2; count <= 5; count++) for (let n = count; n <= count * 5; n++) if (balanceTwo.length < 20 && (n !== 7 || count !== 2) && weightsFor(n, count)) balanceTwo.push({ n, count });
  balanceOne.forEach(t => { t.prompt = B(`⚖️ ${t.n} = ?. Match the right pan.`, `⚖️ ${t.n} = ?. 오른쪽을 같게 만들어요.`); });
  balanceTwo.forEach(t => { t.prompt = B(`⚖️ ${t.n} = ? · ●×${t.count}. Use ${t.count} weights.`, `⚖️ ${t.n} = ? · ●×${t.count}. 추 ${t.count}개로 만들어요.`); });
  tasks(balance, balanceOne, balanceTwo, (m, t) => ({ pans: [weightsFor(t.n), m === 2 ? [5] : []], selected: 1, locked: true }), (s, m, t) => sum(s.pans[1]) === t.n && (m === 1 || s.pans[1].length === t.count));
  balance.hint = (s, m, chosen, p) => {
    const n = m ? s.task.n : +(p.en.match(/\d+/) || [0])[0];
    if (!n) return null;
    for (const i of m ? [1] : [0, 1]) {
      const row = s.pans[i], count = m === 2 ? s.task.count - row.length : undefined, rest = weightsFor(n - sum(row), count);
      if (!rest || row.length + rest.length > 8) return i ? 'rightremove' : 'leftremove';
      if (rest.length) return placeHint(chosen, `weight${rest[0]}`, `pan${i}`);
    }
    return doneHint(m);
  };

  const wordPics = { cat:'🐱', cap:'🧢', hat:'🎩', bat:'🦇', sun:'☀️', run:'🏃', pig:'🐷', wig:'💇', dog:'🐶', log:'🪵', hen:'🐔', pen:'🖊️', bed:'🛏️', red:'🔴', bug:'🐛', rug:'▧', fan:'🪭', pan:'🍳', map:'🗺️', pot:'🍲', hot:'♨️', cup:'☕', pup:'🐶', pin:'📍', fin:'🦈', top:'🔝', hop:'🐇', net:'🥅', pet:'🐶', bag:'👜', tag:'🏷️', mop:'🧹', pop:'🫧', can:'🥫', man:'🧍', sit:'🪑', hit:'🏏', ten:'🔟' };
  const letterPairs = [['cap','cat'],['bat','hat'],['run','sun'],['wig','pig'],['log','dog'],['pen','hen'],['red','bed'],['rug','bug'],['pan','fan'],['cap','map'],['hot','pot'],['pup','cup'],['fin','pin'],['hop','top'],['pet','net'],['tag','bag'],['pop','mop'],['man','can'],['hit','sit'],['hen','ten']];
  const letterOne = letterPairs.map(([,word]) => ({ word, icon: wordPics[word] }));
  const letterTwo = letterPairs.map(([from,word]) => ({ from, word, icon: wordPics[word], fromIcon: wordPics[from] }));
  letterOne.forEach(t => { t.prompt = B(`🎯 ${t.icon} ${t.word}. Build the word.`, `🎯 ${t.icon} ${t.word}. 낱말을 만들어요.`); });
  letterTwo.forEach(t => { t.prompt = B(`${t.fromIcon} ${t.from} → ${t.icon} ${t.word}. Change one letter.`, `${t.fromIcon} ${t.from} → ${t.icon} ${t.word}. 한 글자를 바꿔요.`); });
  tasks(letters, letterOne, letterTwo, (m, t) => ({ slots: [...(t.from || '').padEnd(5, ' ')].map(ch => ch.trim()), page: 0, upper: false, selected: -1 }), (s, m, t) => s.slots.join('|') === [...t.word, '', ''].join('|'));
  letters.hint = (s, m, chosen, p) => {
    const pair = p.en.match(/^Try (\w+) and (\w+)/), word = m ? s.task.word : pair?.[1];
    if (!word) return null;
    if (!m && pair.slice(1).some(w => s.slots.join('|') === [...w, '', ''].join('|'))) return null;
    for (let i = 0; i < 5; i++) {
      const ch = word[i] || ''; if (s.slots[i] === ch) continue;
      if (!ch) { if (chosen && chosen !== `move${i}`) return chosen.startsWith('letter') ? `src-${chosen}` : `drop-slot${s.selected}`; return s.selected === i ? 'remove' : `drop-slot${i}`; }
      if (!m && !alphabet.slice(s.page * 6, s.page * 6 + 6).includes(ch)) return 'page';
      return placeHint(chosen, `letter${ch}`, `slot${i}`);
    }
    return doneHint(m);
  };

  const fractionOne = [{ a: [2,2], b: [] }];
  for (const d of denominators) for (let n = 1; n <= d; n++) if (d !== 2 || n !== 2) fractionOne.push({ a: Array(n).fill(d), b: [] });
  const fractionTwo = [{ a: [2], b: [4,4] }];
  for (const d of denominators) for (const e of denominators) for (let n = 1; n <= d; n++) if (d !== e && n * e % d === 0 && !(d === 2 && e === 4 && n === 1) && fractionTwo.length < 20) fractionTwo.push({ a: Array(n).fill(d), b: Array(n * e / d).fill(e) });
  fractionOne.forEach(t => { t.prompt = B(`🎯 A: ${t.a.length}/${t.a[0]}. Use 1/${t.a[0]} pieces.`, `🎯 A: ${t.a.length}/${t.a[0]}. ${t.a[0]}분의 1 조각으로 만들어요.`); });
  fractionTwo.forEach(t => { t.prompt = B(`🎯 A: ${t.a.length}/${t.a[0]} = B: ? · 1/${t.b[0]} pieces.`, `🎯 A: ${t.a.length}/${t.a[0]} = B: ? · ${t.b[0]}분의 1 조각으로.`); });
  tasks(fractions, fractionOne, fractionTwo, () => ({ rows: [[], []], selected: 0, circle: false }), (s, m, t) => s.rows[0].join() === t.a.join() && s.rows[1].join() === t.b.join());
  fractions.hint = (s, m, chosen, p) => {
    const match = p.en.match(/(\d+)\/(\d+)/);
    let goal = m ? [s.task.a, s.task.b] : match ? [Array(+match[1]).fill(+match[2]), []] : null;
    if (!goal && p.en.includes('whole')) goal = [p.en.includes('halves') ? [2,4,4] : p.en.includes('thirds') ? [3,6,6,6,6] : [4,8,8,8,8,8,8], []];
    if (!goal) return null;
    for (let i = 0; i < 2; i++) {
      const row = s.rows[i], want = goal[i];
      if (row.some((d, j) => d !== want[j])) {
        if (chosen) return `src-${chosen}`;
        return s.selected === i ? 'remove' : `drop-fraction${i}`;
      }
      if (row.length < want.length) return placeHint(chosen, `fractionpiece${want[row.length]}`, `fraction${i}`);
    }
    return doneHint(m);
  };

  // Shortest legal card sequence, bounded by the existing eight slots.
  const robotPlan = (goal, walls) => {
    const queue = [{ pos: 12, facing: 0, code: [] }], seen = new Set(['12/0']);
    for (let i = 0; i < queue.length; i++) {
      const q = queue[i]; if (q.pos === goal) return q.code;
      if (q.code.length === 8) continue;
      for (const c of [0, 2, 1]) {
        const s = { ...q, code: [c], pc: 0, blocked: false, walls }; robotStep(s);
        const key = `${s.pos}/${s.facing}`;
        if (!s.blocked && !seen.has(key)) { seen.add(key); queue.push({ pos: s.pos, facing: s.facing, code: [...q.code, c] }); }
      }
    }
    return null;
  };
  const codeOne = [{ goal: 4, walls: [] }], codeTwo = [{ goal: 6, walls: [9], code: [0,2,0,0] }];
  for (const goal of [0,1,2,3,4,5,6,7,8,9,10,11,13,14,15]) for (const walls of [[], [9], [5], [1], [13]]) {
    if (walls.includes(goal)) continue;
    const plan = robotPlan(goal, walls); if (!plan) continue;
    if (codeOne.length < 20 && !(goal === 4 && !walls.length)) codeOne.push({ goal, walls });
    if (codeTwo.length < 20 && walls.length && plan.includes(2) && !(goal === 6 && walls[0] === 9)) {
      const code = [...plan]; code[0] = 1; codeTwo.push({ goal, walls, code });
    }
  }
  codeOne.forEach(t => { t.prompt = B('🤖 ↑ → ⭐. Build a path to the star.', '🤖 ↑ → ⭐. 별까지 가는 길을 만들어요.'); });
  codeTwo.forEach(t => { t.prompt = B('🤖 → ⭐ · 🧱 ⛔. Fix the cards.', '🤖 → ⭐ · 🧱 ⛔. 벽을 피해 카드를 고쳐요.'); });
  const checkCode = coding.check;
  tasks(coding, codeOne, codeTwo, (m, t) => ({ ...robotStart(), code: t.code ? [...t.code] : [], selected: -1, goal: t.goal, walls: [...t.walls], edit: 'goal', free: false }), s => checkCode(s));
  coding.hint = (s, m, chosen) => {
    if (!m) return null;
    if (checkCode(s)) return !s.blocked && s.pos === s.goal && s.pc === s.code.length ? 'check' : 'run';
    const plan = robotPlan(s.goal, s.walls); if (!plan) return null;
    if (s.code.length > plan.length) {
      if (chosen && !chosen.startsWith('movecard')) return `src-${chosen}`;
      return s.selected === s.code.length - 1 ? 'remove' : `drop-code${s.code.length - 1}`;
    }
    for (let i = 0; i < plan.length; i++) if (s.code[i] !== plan[i]) return placeHint(chosen, `command${plan[i]}`, `code${i}`);
    return 'run';
  };

  [cubes, patterns, baseten, clock, balance, letters, fractions, coding].forEach(tool => registerGame({
    id: tool.id, grade: 'both', subject: 'create', icon: tool.icon, title: tool.title, sub: tool.sub,
    area: B('Manipulative Playground · Exploration', '교구 놀이터 · 탐색'),
    play() { mount(tool, this); }
  }));
})();
