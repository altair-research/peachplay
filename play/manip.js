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

  function mount(tool) {
    let mode = 0, state = tool.init(0), chosen = null, history = [], feedback = '', drag = null, swallowClick = false;
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
        <div class="m-modes">${[words.free, words.one, words.two].map((w, i) => act(`mode-${i}`, w, `aria-pressed="${mode === i}"`)).join('')}</div>
        <p class="m-prompt">${esc(text(tool.prompt(mode)))}</p>
        <div class="m-work">${tool.render(ctx())}</div>
        <p class="m-feedback" role="status" aria-live="polite">${esc(feedback || text(words.help))}</p>
        <div class="m-footer">${act('undo', words.undo, history.length ? '' : 'disabled')}${act('reset', words.reset)}${mode ? act('check', words.check) : act('help', B('How to', '사용법'))}</div>`;
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
        mode = +action.slice(5); state = tool.init(mode); chosen = null; history = []; feedback = ''; draw(key); say(text(tool.prompt(mode))); return;
      }
      if (action === 'listen' || action === 'help') { message(tool.help || words.help); say(`${text(tool.prompt(mode))} ${text(tool.help || words.help)}`); }
      else if (action === 'undo') { if (history.length) state = history.pop(); chosen = null; feedback = ''; }
      else if (action === 'reset') { change(() => { state = tool.init(mode); }); chosen = null; }
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
      S.lang = S.lang === 'en' ? 'ko' : 'en'; save();
      languageButton.textContent = S.lang === 'en' ? '한국어' : 'English';
      feedback = ''; root.setAttribute('aria-label', text(tool.title)); draw(); say(text(tool.prompt(mode)));
    };
    languageButton.addEventListener('click', language, true);
    const observer = new MutationObserver(() => {
      if (!root.isConnected) { languageButton.removeEventListener('click', language, true); observer.disconnect(); drag = null; try { speechSynthesis.cancel(); } catch (_) {} }
    });
    observer.observe(view(), { childList: true });
    draw(); say(`${text(tool.prompt(mode))} ${text(tool.help || words.help)}`);
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
    render({ state: s, chosen }) {
      const n = s.cells.filter(Boolean).length;
      return `<div class="m-meter">${text(B('Cubes', '큐브'))}: ${n} · ${text(B('Groups', '묶음'))}: ${groups(s.cells)}</div><div class="m-cubes">${s.cells.map((c, i) => {
        const linked = q => c && !c.split && s.cells[q] && !s.cells[q].split && s.cells[q].color === c.color;
        return target(`c${i}`, B(`Place ${i + 1}${c ? ', cube ' + marks[c.color] : ', empty'}`, `${i + 1}번 칸${c ? ', 큐브 ' + marks[c.color] : ', 빈칸'}`), c ? `<span>${marks[c.color]}</span>` : '·', `style="--m-color:${c ? colors[c.color] : '#fff'}" aria-pressed="${chosen === `c${i}`}" data-filled="${!!c}" data-east="${i % 5 < 4 && linked(i + 1)}" data-south="${i < 15 && linked(i + 5)}"`);
      }).join('')}</div><div class="m-tray">${colors.map((_, i) => source(`color${i}`, B(`Cube ${marks[i]}`, `${marks[i]} 큐브`), `<span style="background:${colors[i]}">${marks[i]}</span>`, chosen === `color${i}`)).join('')}</div><div class="m-tools">${act('join', B('Connect', '연결'))}${act('split', B('Separate', '떼기'))}${act('remove', words.remove)}</div>`;
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
      const outline = mode ? `<rect x="${mode === 1 ? 88 : 44}" y="44" width="${mode === 1 ? 88 : 176}" height="88" fill="#eef3fa" stroke="#334155" stroke-width="2" stroke-dasharray="5 4"/>` : '';
      return `<div class="m-meter">${text(B('Pieces', '조각'))}: ${s.pieces.length}/12 ${s.selected >= 0 ? `· ${s.selected + 1}` : ''}</div><div class="m-pattern-board">${svg(outline + s.pieces.map((p, i) => `<polygon points="${polygon(p).map(([x, y]) => `${x * 44},${y * 44}`).join(' ')}" fill="${colors[p.kind % 4]}" fill-opacity=".85" stroke="${i === s.selected ? '#1d4ed8' : '#344958'}" stroke-width="${i === s.selected ? 4 : 2}"/>`).join(''))}<div class="m-grid">${Array.from({ length: 24 }, (_, i) => target(`p${i}`, B(`Place at row ${Math.floor(i / 6) + 1}, column ${i % 6 + 1}`, `${Math.floor(i / 6) + 1}행 ${i % 6 + 1}열에 놓기`), '·')).join('')}</div></div><div class="m-tray">${shapes.map((s, i) => source(`shape${i}`, s.n, shapeSVG(i, colors[i % 4]), chosen === `shape${i}`)).join('')}</div><div class="m-tools">${act('nextpiece', B('Next piece', '다음 조각'))}${act('turn', B('Turn', '돌리기'))}${act('flip', B('Flip', '뒤집기'))}${act('remove', words.remove)}</div>`;
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
    check: (s, m) => m === 1 ? s.counts.join(',') === '4,1,0' : value(s) === 126 && s.counts[0] === 16
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
    help: B('Choose a letter, then a space. Listen reads a whole word, not separate sounds.', '글자와 놓을 칸을 눌러요. 낱말 듣기는 낱말 전체를 읽어 줘요.'),
    init: m => ({ slots: m === 2 ? ['c', 'a', 'p', '', ''] : ['', '', '', '', ''], page: 0, upper: false, selected: -1 }),
    prompt: m => m === 1 ? B('🐱 Build cat. Listen or use the word.', '🐱 cat을 만들어요. 듣거나 낱말을 보아요.') : m === 2 ? B('🧢 cap → 🐱 cat. Change one letter.', '🧢 cap → 🐱 cat. 글자 하나를 바꿔요.') : B('Make English words with letter tiles.', '글자 타일로 영어 낱말을 만들어요.'),
    render({ state: s, mode, chosen }) {
      const pool = mode ? 'catpms' : alphabet.slice(s.page * 6, s.page * 6 + 6);
      return `<div class="m-letter-art" aria-hidden="true">${mode === 1 ? '🐱' : mode === 2 ? '🧢 → 🐱' : 'a b c'}</div><div class="m-slots">${s.slots.map((ch, i) => target(`slot${i}`, B(`Space ${i + 1}: ${ch || 'empty'}`, `${i + 1}번 칸: ${ch || '빈칸'}`), ch ? (s.upper ? ch.toUpperCase() : ch) : '·', `aria-pressed="${s.selected === i}"`)).join('')}</div><div class="m-tray">${[...pool].map(ch => source(`letter${ch}`, B(`Letter ${ch}`, `글자 ${ch}`), s.upper ? ch.toUpperCase() : ch, chosen === `letter${ch}`)).join('')}</div><div class="m-tools">${mode ? act('word', B('Hear cat', 'cat 듣기')) : act('page', B('More letters', '다른 글자'))}${act('case', B('Aa', 'Aa'), `aria-label="${esc(text(B('Switch letter case', '대소문자 바꾸기')))}"`)}${act('remove', words.remove)}</div>`;
    },
    select(s, d) { s.selected = +d.slice(4); return s.slots[s.selected] ? `move${s.selected}` : null; },
    drop(s, src, dest) { const i = +dest.slice(4); if (src.startsWith('letter')) s.slots[i] = src.slice(6); else { const j = +src.slice(4); [s.slots[i], s.slots[j]] = [s.slots[j], s.slots[i]]; } s.selected = i; },
    action(s, a) { if (a === 'page') s.page = (s.page + 1) % 5; if (a === 'case') s.upper = !s.upper; if (a === 'remove' && s.selected >= 0) s.slots[s.selected] = ''; if (a === 'word') say('cat', 'en-US'); },
    check: s => s.slots.join('|') === 'c|a|t||'
  };

  // Integer units (LCM 2,3,4,6,8 = 24) keep every comparison exact.
  const denominators = [2, 3, 4, 6, 8];
  const fractions = {
    id: 'mfractions', icon: '◔', title: B('Fraction Models', '분수 타일과 원'), sub: B('Parts of the same whole', '같은 전체를 나눠요'),
    help: B('Choose a piece, then a row. Remove takes off the last piece. Bars and circles show the same whole.', '조각을 골라 줄에 놓아요. 빼기는 마지막 조각을 빼요. 막대와 원의 전체 크기는 같아요.'),
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

  [cubes, patterns, baseten, clock, balance, letters, fractions, coding].forEach(tool => registerGame({
    id: tool.id, grade: 'both', subject: 'create', icon: tool.icon, title: tool.title, sub: tool.sub,
    area: B('Manipulative Playground · Exploration', '교구 놀이터 · 탐색'),
    play() { mount(tool); }
  }));
})();
