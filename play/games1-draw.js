'use strict';
// Grade 1 hands-on geometry (GSR.4.2 and 4.3): draw the cut lines yourself, and build a shape by dragging pieces into place.
// Both use pointer events (touch or mouse) and never rely on a timer. They are check-up exempt (CHECK_SKIP in profile.js).
const svgPoint = (svg, e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const m = svg.getScreenCTM(); return m ? p.matrixTransform(m.inverse()) : { x: 0, y: 0 }; };
const finishRound = (game, ok, missed, afterText) => {
  record(game.id, ok && !missed); if (ok && !missed) addPeach();
  const c = $('#cheer'); if (c) c.textContent = pick(T().right);
  const f = $('#fact'); if (f && afterText) f.textContent = L(afterText);
  nextButton(() => game.play());
};
const roundShell = (askText, svgHtml, extra = '') => `<div class="prompt">${askText}<button class="say" id="sp" aria-label="${T().listen}">🔊</button></div><div class="show">${svgHtml}</div>${extra}<pk-cheer class="cheer" id="cheer"></pk-cheer><div class="fact" id="fact"></div>`;

// ---------- Cut it: draw the lines ----------
const CUT_SHAPES = { circle: { cx: 50, cy: 50, r: 40 }, rect: { x: 10, y: 20, w: 80, h: 60 } };
const distToLine = (p, a, b) => { const dx = b.x - a.x, dy = b.y - a.y, L2 = Math.hypot(dx, dy) || 1; return Math.abs(dy * (p.x - a.x) - dx * (p.y - a.y)) / L2; };
const angleDeg = (a, b) => { let d = Math.abs(Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI) % 180; return d; };
const angleBetween = (l1, l2) => { let d = Math.abs(angleDeg(l1[0], l1[1]) - angleDeg(l2[0], l2[1])); if (d > 90) d = 180 - d; return d; };
G1({
  id: 'partitiondraw', icon: '✂️', title: B('Cut It Fairly', '똑같이 잘라요'), sub: B('Draw the cuts for halves and fourths', '선을 그어 반과 4분의 1'), u: 'Equal shares (draw)',
  play() {
    const lv = lvl('partitiondraw'), shape = pick(['circle', 'rect']), n = lv === 1 ? 2 : pick([2, 4]), name = n === 2 ? B('halves (2 equal shares)', '반 (똑같은 2조각)') : B('fourths (4 equal shares)', '4분의 1 (똑같은 4조각)');
    const ask = B(`Cut the ${shape === 'circle' ? 'circle' : 'rectangle'} into ${name.en}. Drag your finger across it to draw a line.`, `${shape === 'circle' ? '동그라미(원)' : '직사각형'}을 ${name.ko}으로 잘라요. 손가락으로 쭉 끌어서 선을 그어요.`);
    const sh = CUT_SHAPES[shape], center = shape === 'circle' ? { x: sh.cx, y: sh.cy } : { x: sh.x + sh.w / 2, y: sh.y + sh.h / 2 };
    const body = shape === 'circle' ? `<circle cx="${sh.cx}" cy="${sh.cy}" r="${sh.r}" fill="#ffd166" stroke="#1d3557" stroke-width="3"/>` : `<rect x="${sh.x}" y="${sh.y}" width="${sh.w}" height="${sh.h}" rx="3" fill="#ffd166" stroke="#1d3557" stroke-width="3"/>`;
    view().innerHTML = roundShell(L(ask), `<svg id="cutsvg" viewBox="0 0 100 100" class="cutsvg">${body}<g id="cuts" stroke="#ef476f" stroke-width="3" stroke-linecap="round"></g></svg>`, `<div><button class="pill" id="clr">↺ ${L(B('Clear', '지우기'))}</button></div>`);
    const svg = $('#cutsvg'), cuts = $('#cuts'); let lines = [], missed = false, done = false, cur = null, tries = 0;
    const askNow = () => say(L(ask)); $('#sp').onclick = askNow; askNow();
    const draw = () => { cuts.innerHTML = lines.map(l => `<line x1="${l[0].x}" y1="${l[0].y}" x2="${l[1].x}" y2="${l[1].y}"/>`).join('') + (cur ? `<line x1="${cur[0].x}" y1="${cur[0].y}" x2="${cur[1].x}" y2="${cur[1].y}" opacity=".6"/>` : ''); };
    // extend a drawn line through the shape so the result looks like a clean cut
    const snapLine = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y, L2 = Math.hypot(dx, dy) || 1, ux = dx / L2, uy = dy / L2, far = 60; return [{ x: center.x - ux * far, y: center.y - uy * far }, { x: center.x + ux * far, y: center.y + uy * far }]; };
    const clip = (l) => { const out = [{ ...l[0] }, { ...l[1] }]; return out; };
    const ok2 = (ls) => {
      if (n === 2) return ls.length === 1;
      if (ls.length < 2) return null;
      const [a, b] = ls, ang = angleBetween(a, b);
      if (shape === 'circle') return ang >= 75 && ang <= 105;
      const horiz = (l) => { const d = angleDeg(l[0], l[1]); return d < 12 || d > 168; }, vert = (l) => Math.abs(angleDeg(l[0], l[1]) - 90) < 12;
      const diag = (l, s) => { const d = angleDeg(l[0], l[1]), t = Math.atan2(sh.h, sh.w) * 180 / Math.PI; return s ? Math.abs(d - t) < 11 : Math.abs(d - (180 - t)) < 11; };
      return (horiz(a) && vert(b)) || (vert(a) && horiz(b)) || (diag(a, true) && diag(b, false)) || (diag(a, false) && diag(b, true));
    };
    const onDown = (e) => { if (done) return; const p = svgPoint(svg, e); cur = [p, p]; try { svg.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); draw(); };
    const onMove = (e) => { if (!cur) return; cur[1] = svgPoint(svg, e); draw(); e.preventDefault(); };
    const onUp = (e) => {
      if (!cur) return; const a = cur[0], b = cur[1]; cur = null;
      if (Math.hypot(b.x - a.x, b.y - a.y) < 25) { draw(); return; }
      if (distToLine(center, a, b) > (shape === 'circle' ? 7 : 6)) { missed = true; tries++; const c = $('#cheer'); if (c) c.textContent = T().again; $('#fact').textContent = L(B('A fair cut goes through the middle.', '공평하게 자르려면 한가운데를 지나야 해요.')); draw(); sfx('no'); return; }
      lines.push(clip(snapLine(a, b))); draw();
      const r = ok2(lines);
      if (r === true) { done = true; $('#fact').textContent = ''; finishRound(this_, true, missed, B(n === 2 ? 'Two equal shares are halves.' : 'Four equal shares are fourths, or quarters.', n === 2 ? '똑같은 2조각은 반(halves)이에요.' : '똑같은 4조각은 4분의 1(fourths, quarters)이에요.')); }
      else if (r === false) { missed = true; lines = []; draw(); const c = $('#cheer'); if (c) c.textContent = T().again; $('#fact').textContent = L(B('Are all the pieces the same size? Try again!', '조각 크기가 모두 같을까요? 다시 해 봐요!')); sfx('no'); }
    };
    const this_ = this;
    svg.addEventListener('pointerdown', onDown); svg.addEventListener('pointermove', onMove); svg.addEventListener('pointerup', onUp); svg.addEventListener('pointercancel', () => { cur = null; draw(); });
    $('#clr').onclick = () => { if (!done) { lines = []; cur = null; draw(); } };
    window.__cut = { shape, n, center, sh, lines: () => lines };
  }
});

// ---------- Build the shape: drag the pieces in ----------
const partGeom = (p) => (p.pts ? `<polygon points="${p.pts}"` : `<path d="${p.d}"`);
const relSig = (p, i) => (p.pts ? p.pts.split(' ').map(q => { const [x, y] = q.split(',').map(Number); return `${(x - p.c[0]).toFixed(0)},${(y - p.c[1]).toFixed(0)}`; }).join(' ') : 'd' + i);
G1({
  id: 'shapebuild', icon: '🧱', title: B('Build the Shape', '도형 만들기'), sub: B('Drag the pieces into place', '조각을 끌어다 맞춰요'), u: 'Composing shapes (build)',
  play() {
    const lv = lvl('shapebuild'), cp = pick(lv === 1 ? COMPS.filter(c => c.parts.length <= 2) : COMPS), k = 0.8, tx = 40, ty = 4, n = cp.parts.length;
    const ask = B(`Drag the pieces to build the ${L(cp.n)}. Fill the dotted outline!`, `조각을 끌어다 점선 안을 채워 ${cp.n.ko}을 만들어요!`);
    const cols = Math.min(n, 3), rows = Math.ceil(n / cols), cellW = 160 / cols, cellH = rows === 1 ? 70 : 46, homes = shuffle(cp.parts.map((_, i) => i)).map((pi, slot) => ({ pi, hx: cellW * (slot % cols) + cellW / 2, hy: 112 + cellH * Math.floor(slot / cols) + cellH / 2 }));
    const targets = cp.parts.map((p, i) => `<g transform="translate(${tx} ${ty}) scale(${k})">${partGeom(p)} fill="#f3eefc" stroke="#9a8ff0" stroke-width="2.5" stroke-dasharray="4 3" stroke-linejoin="round" data-slot="${i}"/></g>`).join('');
    const pieces = homes.map(h => { const p = cp.parts[h.pi], [cx, cy] = p.c; return `<g class="bpiece2" data-p="${h.pi}" style="cursor:grab" transform="translate(${h.hx} ${h.hy}) scale(${k}) translate(${-cx} ${-cy})">${partGeom(p)} fill="${COMP_COL[h.pi % 6]}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></g>`; }).join('');
    view().innerHTML = roundShell(L(ask), `<svg id="sbsvg" viewBox="0 0 160 ${112 + cellH * rows + 4}" class="sbsvg">${targets}<g id="pcs">${pieces}</g></svg>`);
    const svg = $('#sbsvg'), askNow = () => say(L(ask)); $('#sp').onclick = askNow; askNow();
    const placed = new Set(), usedSlots = new Set(), pos = {}; let drag = null, missed = false;
    homes.forEach(h => { pos[h.pi] = { x: h.hx, y: h.hy, hx: h.hx, hy: h.hy }; });
    const sigs = cp.parts.map(relSig), el = (pi) => $(`.bpiece2[data-p="${pi}"]`), place = (pi) => { const [cx, cy] = cp.parts[pi].c; };
    const setT = (pi, x, y) => { const [cx, cy] = cp.parts[pi].c; el(pi).setAttribute('transform', `translate(${x} ${y}) scale(${k}) translate(${-cx} ${-cy})`); };
    const onMove = (e) => { if (!drag) return; const p = svgPoint(svg, e); pos[drag.pi].x = p.x - drag.ox; pos[drag.pi].y = p.y - drag.oy; setT(drag.pi, pos[drag.pi].x, pos[drag.pi].y); e.preventDefault(); };
    const onUp = () => {
      if (!drag) return; const pi = drag.pi; drag = null; window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp); window.removeEventListener('pointercancel', onUp);
      const q = pos[pi]; let slot = -1, best = 1e9;
      cp.parts.forEach((p, i) => { if (usedSlots.has(i) || sigs[i] !== sigs[pi]) return; const tx_ = tx + k * p.c[0], ty_ = ty + k * p.c[1], d = Math.hypot(q.x - tx_, q.y - ty_); if (d < best) { best = d; slot = i; } });
      if (slot >= 0 && best < 12) {                     // snap into the outline
        usedSlots.add(slot); placed.add(pi); const g = el(pi); g.setAttribute('transform', `translate(${tx} ${ty}) scale(${k})`); g.style.cursor = 'default'; g.style.pointerEvents = 'none'; g.setAttribute('data-done', '1');
        const tgt = svg.querySelector(`[data-slot="${slot}"]`); if (tgt) tgt.parentNode.style.display = 'none'; tone(660, 90, 0, 'triangle', 0.1);
        if (placed.size === n) { finishRound(this_, true, missed, B(`${L(cp.what)} make a ${L(cp.n)}.`, `${cp.what.ko}로 ${cp.n.ko}을 만들었어요.`)); }
      } else { missed = true; pos[pi].x = pos[pi].hx; pos[pi].y = pos[pi].hy; setT(pi, pos[pi].x, pos[pi].y); tone(180, 120, 0, 'triangle', 0.08); }
    };
    const this_ = this;
    $$('.bpiece2').forEach(g => g.addEventListener('pointerdown', (e) => { if (g.getAttribute('data-done')) return; const pi = +g.dataset.p, p = svgPoint(svg, e); drag = { pi, ox: p.x - pos[pi].x, oy: p.y - pos[pi].y }; g.parentNode.appendChild(g); window.addEventListener('pointermove', onMove, { passive: false }); window.addEventListener('pointerup', onUp); window.addEventListener('pointercancel', onUp); e.preventDefault(); }));
    window.__sb = { cp, n, k, tx, ty, pos, drop: (pi) => { /* test hook: snap piece pi to its own slot */ pos[pi].x = tx + k * cp.parts[pi].c[0]; pos[pi].y = ty + k * cp.parts[pi].c[1]; drag = { pi, ox: 0, oy: 0 }; onUp(); }, placed };
  }
});

// ---------- Grade 2: cut a rectangle into halves, thirds or fourths ----------
registerGame({
  id: 'partitiondraw2', grade: '2', subject: 'math', icon: '✂️', title: B('Cut It Into Equal Shares', '똑같은 조각으로 자르기'), sub: B('Draw lines for halves, thirds and fourths', '선을 그어 반, 3분의 1, 4분의 1'), u: 'Equal shares (draw)', area: B('Grade 2 Math · Equal shares (draw)', '2학년 수학 · 똑같이 나누기(그리기)'),
  play() {
    const lv = lvl('partitiondraw2'), n = pick(lv === 1 ? [2, 3] : [2, 3, 4]), sh = CUT_SHAPES.rect;
    const name = n === 2 ? B('halves (2 equal shares)', '반 (똑같은 2조각)') : n === 3 ? B('thirds (3 equal shares)', '3분의 1 (똑같은 3조각)') : B('fourths (4 equal shares)', '4분의 1 (똑같은 4조각)');
    const ask = B(`Cut the rectangle into ${name.en}. Drag your finger across it to draw each line.${n === 3 ? ' You need 2 lines.' : n === 4 ? ' You need 2 lines.' : ''}`, `직사각형을 ${name.ko}으로 잘라요. 손가락을 끌어서 선을 그어요.${n === 3 || n === 4 ? ' 선은 2개가 필요해요.' : ''}`);
    view().innerHTML = roundShell(L(ask), `<svg id="cutsvg" viewBox="0 0 100 100" class="cutsvg"><rect x="${sh.x}" y="${sh.y}" width="${sh.w}" height="${sh.h}" rx="3" fill="#ffd166" stroke="#1d3557" stroke-width="3"/><g id="cuts" stroke="#ef476f" stroke-width="3" stroke-linecap="round"></g></svg>`, `<div><button class="pill" id="clr">↺ ${L(B('Clear', '지우기'))}</button></div>`);
    const svg = $('#cutsvg'), cuts = $('#cuts'), cx = sh.x + sh.w / 2, cy = sh.y + sh.h / 2; let lines = [], missed = false, done = false, cur = null;
    const askNow = () => say(L(ask)); $('#sp').onclick = askNow; askNow();
    const draw = () => { cuts.innerHTML = lines.map(l => `<line x1="${l.a.x}" y1="${l.a.y}" x2="${l.b.x}" y2="${l.b.y}"/>`).join('') + (cur ? `<line x1="${cur[0].x}" y1="${cur[0].y}" x2="${cur[1].x}" y2="${cur[1].y}" opacity=".6"/>` : ''); };
    const kind = (a, b) => { const d = angleDeg(a, b); return d < 12 || d > 168 ? 'h' : Math.abs(d - 90) < 12 ? 'v' : 'o'; };
    const fail = (msg) => { missed = true; const c = $('#cheer'); if (c) c.textContent = T().again; $('#fact').textContent = L(msg); sfx('no'); lines = []; draw(); };
    const this_ = this;
    const win = () => { done = true; $('#fact').textContent = ''; finishRound(this_, true, missed, B(n === 2 ? 'Two equal shares are halves.' : n === 3 ? 'Three equal shares are thirds.' : 'Four equal shares are fourths, or quarters.', n === 2 ? '똑같은 2조각은 반(halves)이에요.' : n === 3 ? '똑같은 3조각은 3분의 1(thirds)이에요.' : '똑같은 4조각은 4분의 1(fourths, quarters)이에요.')); };
    const onUp = (a, b) => {
      if (Math.hypot(b.x - a.x, b.y - a.y) < 25) { draw(); return; }
      const k = kind(a, b), tol = 7;
      if (n === 2) {                                           // any straight cut through the middle
        if (distToLine({ x: cx, y: cy }, a, b) > tol) return fail(B('A fair cut goes through the middle.', '공평하게 자르려면 한가운데를 지나야 해요.'));
        const ang = angleDeg(a, b) * Math.PI / 180, f = 70; lines = [{ a: { x: cx - Math.cos(ang) * f, y: cy - Math.sin(ang) * f }, b: { x: cx + Math.cos(ang) * f, y: cy + Math.sin(ang) * f } }]; draw(); win(); return;
      }
      if (k === 'o') return fail(B('Draw straight up-down or straight left-right lines.', '위아래로 곧게, 또는 왼쪽 오른쪽으로 곧게 그어 보세요.'));
      const pos = k === 'v' ? (a.x + b.x) / 2 : (a.y + b.y) / 2;
      const ln = k === 'v' ? { k, p: pos, a: { x: pos, y: sh.y - 3 }, b: { x: pos, y: sh.y + sh.h + 3 } } : { k, p: pos, a: { x: sh.x - 3, y: pos }, b: { x: sh.x + sh.w + 3, y: pos } };
      if (lines.length && lines[0].k !== k) return fail(B('Make both lines go the same way.', '두 선을 같은 방향으로 그어 보세요.'));
      lines.push(ln); draw();
      if (lines.length < 2) return;
      const lo = k === 'v' ? sh.x : sh.y, len = k === 'v' ? sh.w : sh.h, ps = lines.map(l => l.p).sort((x, y) => x - y);
      const want = n === 3 ? [lo + len / 3, lo + 2 * len / 3] : [lo + len / 4, lo + 3 * len / 4];
      // fourths: two lines, one vertical and one horizontal through the middle (4 equal corners); thirds: two parallel lines at 1/3 and 2/3
      if (n === 3) { if (Math.abs(ps[0] - want[0]) <= tol && Math.abs(ps[1] - want[1]) <= tol) { lines = want.map(p => (k === 'v' ? { k, a: { x: p, y: sh.y - 3 }, b: { x: p, y: sh.y + sh.h + 3 } } : { k, a: { x: sh.x - 3, y: p }, b: { x: sh.x + sh.w + 3, y: p } })); draw(); win(); } else fail(B('Are all three pieces the same size? Try again!', '세 조각이 모두 같은 크기일까요? 다시 해 봐요!')); }
    };
    if (n === 4) {
      // fourths: one vertical and one horizontal line, each through the middle
      var onUp4 = (a, b) => {
        if (Math.hypot(b.x - a.x, b.y - a.y) < 25) { draw(); return; }
        const k = kind(a, b); if (k === 'o') return fail(B('Draw straight up-down or straight left-right lines.', '위아래로 곧게, 또는 왼쪽 오른쪽으로 곧게 그어 보세요.'));
        const pos = k === 'v' ? (a.x + b.x) / 2 : (a.y + b.y) / 2, mid = k === 'v' ? cx : cy;
        if (Math.abs(pos - mid) > tolMid) return fail(B('A fair cut goes through the middle.', '공평하게 자르려면 한가운데를 지나야 해요.'));
        if (lines.some(l => l.k === k)) return fail(B('Draw one up-down line and one left-right line.', '위아래 선 하나, 왼쪽 오른쪽 선 하나를 그어 보세요.'));
        lines.push(k === 'v' ? { k, a: { x: cx, y: sh.y - 3 }, b: { x: cx, y: sh.y + sh.h + 3 } } : { k, a: { x: sh.x - 3, y: cy }, b: { x: sh.x + sh.w + 3, y: cy } }); draw();
        if (lines.length === 2) win();
      };
    }
    const tolMid = 7, handle = n === 4 ? (a, b) => onUp4(a, b) : onUp;
    svg.addEventListener('pointerdown', (e) => { if (done) return; const p = svgPoint(svg, e); cur = [p, p]; try { svg.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); draw(); });
    svg.addEventListener('pointermove', (e) => { if (!cur) return; cur[1] = svgPoint(svg, e); draw(); e.preventDefault(); });
    svg.addEventListener('pointerup', () => { if (!cur) return; const a = cur[0], b = cur[1]; cur = null; if (done) return; handle(a, b); draw(); });
    svg.addEventListener('pointercancel', () => { cur = null; draw(); });
    $('#clr').onclick = () => { if (!done) { lines = []; cur = null; draw(); } };
    window.__cut2 = { n, sh, cx, cy, lines: () => lines };
  }
});
