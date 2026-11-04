'use strict';
// Brain games (logic / spatial / memory). Not tied to one school subject; inspired by classic
// "think outside the box" dot puzzles, scaled to kindergarten.
const AREA_BRAIN = (u) => B(`Brain · ${u}`, `두뇌 · ${u}`);

// ---------- 1. Connect the dots (in number order) ----------
const polyPts = (n, r, rot = -90) => Array.from({ length: n }, (_, i) => { const a = (rot + i * 360 / n) * Math.PI / 180; return [50 + r * Math.cos(a), 50 + r * Math.sin(a)]; });
const starPts = () => Array.from({ length: 10 }, (_, i) => { const a = (-90 + i * 36) * Math.PI / 180, r = i % 2 ? 17 : 40; return [50 + r * Math.cos(a), 52 + r * Math.sin(a)]; });
const heartPts = () => [[50, 88], [28, 66], [14, 48], [14, 32], [24, 20], [38, 20], [50, 32], [62, 20], [76, 20], [86, 32], [86, 48], [72, 66]];
const DOT_SHAPES = {
  house: { pts: [[20, 55], [50, 20], [80, 55], [80, 88], [20, 88]], e: '🏠', n: B('a house', '집') },
  crown: { pts: [[15, 80], [15, 32], [35, 56], [50, 20], [65, 56], [85, 32], [85, 80]], e: '👑', n: B('a crown', '왕관') },
  hexagon: { pts: polyPts(6, 38), e: '🐝', n: B('a honeycomb', '벌집') },
  sun: { pts: polyPts(10, 38), e: '☀️', n: B('the sun', '해') },
  star: { pts: starPts(), e: '⭐', n: B('a star', '별') },
  heart: { pts: heartPts(), e: '❤️', n: B('a heart', '하트') },
  kite: { pts: [[50, 12], [78, 45], [50, 90], [22, 45]], e: '🪁', n: B('a kite', '연') },
  tree: { pts: [[50, 10], [78, 48], [62, 48], [82, 80], [18, 80], [38, 48], [22, 48]], e: '🎄', n: B('a tree', '나무') },
  boat: { pts: [[12,52],[88,52],[70,82],[30,82]], e: '⛵', n: B('a boat', '배') },
  mountain: { pts: [[12,84],[38,20],[55,54],[68,30],[88,84]], e: '⛰️', n: B('a mountain', '산') },
  flag: { pts: [[24,90],[24,12],[82,12],[68,40],[28,40],[28,90]], e: '🚩', n: B('a flag', '깃발') },
  arrow: { pts: [[12,38],[56,38],[56,16],[88,50],[56,84],[56,62],[12,62]], e: '➡️', n: B('an arrow', '화살표') },
  fish: { pts: [[12,28],[35,42],[60,18],[88,50],[60,82],[35,58],[12,72]], e: '🐟', n: B('a fish', '물고기') },
  cup: { pts: [[24,15],[78,15],[68,88],[34,88]], e: '🥤', n: B('a cup', '컵') },
  bell: { pts: [[18,72],[30,56],[30,28],[50,12],[70,28],[70,56],[82,72]], e: '🔔', n: B('a bell', '종') },
  shirt: { pts: [[30,15],[70,15],[90,40],[72,50],[72,85],[28,85],[28,50],[10,40]], e: '👕', n: B('a shirt', '옷') },
  pants: { pts: [[24,15],[76,15],[82,88],[58,88],[50,46],[42,88],[18,88]], e: '👖', n: B('pants', '바지') },
  boot: { pts: [[25,12],[54,12],[54,55],[82,68],[82,86],[25,86]], e: '👢', n: B('a boot', '장화') },
  chair: { pts: [[20,12],[40,12],[40,52],[82,52],[82,86],[65,86],[65,68],[20,68]], e: '🪑', n: B('a chair', '의자') },
  table: { pts: [[12,35],[88,35],[88,85],[70,85],[70,53],[30,53],[30,85],[12,85]], e: '🪑', n: B('a table', '탁자') },
  stairs: { pts: [[12,85],[12,60],[36,60],[36,35],[60,35],[60,12],[86,12],[86,85]], e: '🪜', n: B('stairs', '계단') },
  lightning: { pts: [[55,10],[20,58],[44,58],[34,90],[82,36],[57,36]], e: '⚡', n: B('lightning', '번개') },
  pencil: { pts: [[35,84],[35,30],[50,10],[65,30],[65,84]], e: '✏️', n: B('a pencil', '연필') },
  rocket: { pts: [[50,10],[68,35],[68,58],[84,82],[60,72],[40,72],[16,82],[32,58],[32,35]], e: '🚀', n: B('a rocket', '로켓') },
  butterfly: { pts: [[50,35],[15,12],[12,46],[32,58],[18,88],[50,72],[82,88],[68,58],[88,46],[85,12]], e: '🦋', n: B('a butterfly', '나비') },
  umbrella: { pts: [[12,45],[28,18],[50,10],[72,18],[88,45],[56,45],[56,88],[44,88],[44,45]], e: '☂️', n: B('an umbrella', '우산') },
  cross: { pts: [[36,12],[64,12],[64,36],[88,36],[88,64],[64,64],[64,88],[36,88],[36,64],[12,64],[12,36],[36,36]], e: '➕', n: B('a cross', '십자') },
  diamond: { pts: [[12,30],[32,12],[68,12],[88,30],[50,88]], e: '💎', n: B('a gem', '보석') },
  bowl: { pts: [[12,28],[88,28],[78,68],[60,84],[40,84],[22,68]], e: '🥣', n: B('a bowl', '그릇') },
  trapezoid: { pts: [[32,20],[68,20],[90,82],[10,82]], e: '🔷', n: B('a trapezoid', '사다리꼴') },
  parallelogram: { pts: [[32,20],[90,20],[68,82],[10,82]], e: '🔷', n: B('a slanted shape', '기울어진 네모') },
  chevron: { pts: [[14,18],[50,42],[86,18],[86,52],[50,80],[14,52]], e: '🏹', n: B('a bent arrow', '꺾인 화살표') },
  vase: { pts: [[30,12],[70,12],[58,38],[78,68],[68,88],[32,88],[22,68],[42,38]], e: '🏺', n: B('a vase', '꽃병') },
  crown2: { pts: [[14,88],[14,20],[34,20],[34,40],[66,40],[66,20],[86,20],[86,88]], e: '🏰', n: B('a castle', '성') },
  tent: { pts: [[12,88],[50,12],[88,88],[62,88],[50,58],[38,88]], e: '⛺', n: B('a tent', '텐트') }
};
registerGame({
  id: 'dots', subject: 'brain', icon: '🔗', title: B('Connect the Dots', '점 잇기'), sub: B('Follow the numbers', '숫자 순서대로'),
  area: AREA_BRAIN('Number order'),
  play() {
    const level = lvl('dots'), pool = Object.keys(DOT_SHAPES).filter(k => level === 2 || DOT_SHAPES[k].pts.length <= 8);
    const key = pick(pool), sh = { ...DOT_SHAPES[key], pts: DOT_SHAPES[key].pts.map(p => p.slice()) };
    // More numbered steps at L2, on the same recognizable outline. Split only the longest edge.
    while (level === 2 && sh.pts.length < 10) {
      const lengths = sh.pts.map((p, i) => Math.hypot(p[0] - sh.pts[(i + 1) % sh.pts.length][0], p[1] - sh.pts[(i + 1) % sh.pts.length][1]));
      const i = lengths.indexOf(Math.max(...lengths)), a = sh.pts[i], b = sh.pts[(i + 1) % sh.pts.length];
      sh.pts.splice(i + 1, 0, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]);
    }
    if (dup(this, JSON.stringify(['dots', sh.pts]))) return this.play();
    const n = sh.pts.length, ask = B('Connect the dots in order. What is it?', '숫자 순서대로 점을 이어요. 무엇이 될까요?');
    view().innerHTML = `<div class="prompt">${L(ask)}<button class="say" id="sp">🔊</button></div>
      <svg id="dsvg" class="dotsvg" viewBox="0 0 100 100"><polygon id="dfill" points="" fill="#ffd166" fill-opacity="0"/><polyline id="dline" points="" fill="none" stroke="#ef476f" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><line id="ddrag" x1="0" y1="0" x2="0" y2="0" stroke="#ef476f" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="3 2" opacity="0" pointer-events="none"/>
      ${sh.pts.map((p, i) => `<g class="dg" data-i="${i}"><circle cx="${p[0]}" cy="${p[1]}" r="4.6" class="dc"/><text x="${p[0]}" y="${p[1] + 1.9}" class="dt">${i + 1}</text><circle cx="${p[0]}" cy="${p[1]}" r="8" fill="transparent"/></g>`).join('')}</svg>
      <pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    $('#sp').onclick = () => say(L(ask)); say(L(ask));
    let next = 0, missed = false, pts = [], drawing = false;
    // Drawing (2026-11-01 user): besides tapping each number, the child can drag a finger from dot to dot and the line follows.
    // Passing over a wrong dot while drawing is not a miss; only a wrong tap is.
    const svg = $('#dsvg'), drag = $('#ddrag');
    const at = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse()); return [q.x, q.y]; };
    const near = (p, i) => Math.hypot(sh.pts[i][0] - p[0], sh.pts[i][1] - p[1]) < 7.5;
    const rubber = (p) => { if (!next || next >= n || !p) { drag.setAttribute('opacity', '0'); return; } const a = sh.pts[next - 1]; drag.setAttribute('x1', a[0]); drag.setAttribute('y1', a[1]); drag.setAttribute('x2', p[0]); drag.setAttribute('y2', p[1]); drag.setAttribute('opacity', '.7'); };
    svg.addEventListener('pointerdown', e => {
      if (next >= n) return; const p = at(e);
      if (near(p, next)) connect(next); else if (!(next && near(p, next - 1))) return;
      drawing = true; try { svg.setPointerCapture(e.pointerId); } catch (x) {}
    });
    svg.addEventListener('pointermove', e => { if (!drawing) return; const p = at(e); if (next < n && near(p, next)) connect(next); rubber(drawing && next < n ? p : null); });
    const stop = () => { drawing = false; rubber(null); };
    svg.addEventListener('pointerup', stop); svg.addEventListener('pointercancel', stop);
    const connect = (i) => {
      const g = $(`.dg[data-i="${i}"]`);
      {
        pts.push(sh.pts[i].join(',')); $('#dline').setAttribute('points', pts.join(' ')); g.classList.add('done'); say(String(i + 1)); next++;
        if (next === n) {
          $('#dline').setAttribute('points', [...pts, pts[0]].join(' ')); $('#dfill').setAttribute('points', pts.join(' ')); $('#dfill').setAttribute('fill-opacity', '.55');
          recordFinal('dots', missed); if (!missed) addPeach();
          $('#cheer').textContent = `${sh.e} ${pick(T().right)} ${L(B('It is ', '이것은 '))}${L(sh.n)}!`; say(`${L(B('It is ', '이것은 '))}${L(sh.n)}!`);
          stop(); nextButton(() => this.play());
        }
      }
    };
    $$('.dg').forEach(g => g.onclick = () => {
      const i = +g.dataset.i; if (next >= n) return;
      if (i === next) connect(i);
      else if (!g.classList.contains('done')) { g.classList.add('no'); setTimeout(() => g.classList.remove('no'), 400); if (!missed) { missed = true; record('dots', false); } }
    });
  }
});

// ---------- 2. Connect all dots with few lines (brain test) ----------
const LINE_PUZZLES = {
  four: { lv: 1, limit: 2, s: 40, ox: 30, oy: 30, dots: [[0, 0], [1, 0], [0, 1], [1, 1]], sol: [[0, 0, 1, 1], [1, 0, 0, 1]] },
  ex: { lv: 1, limit: 2, s: 28, ox: 22, oy: 22, dots: [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], sol: [[0, 0, 2, 2], [2, 0, 0, 2]] },
  six: { lv: 1, limit: 3, s: 26, ox: 20, oy: 34, dots: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]], sol: [[0, 0, 2, 0], [2, 0, 0, 1], [0, 1, 2, 1]] },
  nine: { lv: 2, limit: 4, s: 20, ox: 20, oy: 20, dots: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]], sol: [[0, 0, 3, 0], [3, 0, 0, 3], [0, 3, 0, 0], [0, 0, 2, 2]] }
};
// Original dot layouts: each row is one valid straight segment; no recolors or translated copies.
Object.assign(LINE_PUZZLES, {
  layout1: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[0,1],[1,1]],"sol":[[0,0,1,0],[0,1,1,1]]},
  layout2: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[2,0],[0,1],[1,1]],"sol":[[0,0,2,0],[0,1,1,1]]},
  layout3: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[1,0],[2,0],[0,1],[1,1]],"sol":[[1,0,2,0],[0,1,1,1]]},
  layout4: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[2,0],[0,1],[1,1]],"sol":[[0,0,2,0],[0,1,1,1]]},
  layout5: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[3,0],[0,1],[1,1]],"sol":[[0,0,3,0],[0,1,1,1]]},
  layout6: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[1,0],[3,0],[0,1],[1,1]],"sol":[[1,0,3,0],[0,1,1,1]]},
  layout7: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[3,0],[0,1],[1,1]],"sol":[[0,0,3,0],[0,1,1,1]]},
  layout8: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[2,0],[3,0],[0,1],[1,1]],"sol":[[2,0,3,0],[0,1,1,1]]},
  layout9: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[2,0],[3,0],[0,1],[1,1]],"sol":[[0,0,3,0],[0,1,1,1]]},
  layout10: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[1,0],[2,0],[3,0],[0,1],[1,1]],"sol":[[1,0,3,0],[0,1,1,1]]},
  layout11: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1]],"sol":[[0,0,3,0],[0,1,1,1]]},
  layout12: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[2,0],[0,1],[2,1]],"sol":[[0,0,2,0],[0,1,2,1]]},
  layout13: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[2,0],[0,1],[2,1]],"sol":[[0,0,2,0],[0,1,2,1]]},
  layout14: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[3,0],[0,1],[2,1]],"sol":[[0,0,3,0],[0,1,2,1]]},
  layout15: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[1,0],[3,0],[0,1],[2,1]],"sol":[[1,0,3,0],[0,1,2,1]]},
  layout16: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[3,0],[0,1],[2,1]],"sol":[[0,0,3,0],[0,1,2,1]]},
  layout17: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[2,0],[3,0],[0,1],[2,1]],"sol":[[0,0,3,0],[0,1,2,1]]},
  layout18: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[1,0],[2,0],[3,0],[0,1],[2,1]],"sol":[[1,0,3,0],[0,1,2,1]]},
  layout19: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[2,0],[3,0],[0,1],[2,1]],"sol":[[0,0,3,0],[0,1,2,1]]},
  layout20: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[3,0],[1,1],[2,1]],"sol":[[0,0,3,0],[1,1,2,1]]},
  layout21: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[3,0],[1,1],[2,1]],"sol":[[0,0,3,0],[1,1,2,1]]},
  layout22: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[2,0],[3,0],[1,1],[2,1]],"sol":[[0,0,3,0],[1,1,2,1]]},
  layout23: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]],"sol":[[0,0,2,0],[0,1,2,1]]},
  layout24: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[3,0],[0,1],[1,1],[2,1]],"sol":[[0,0,3,0],[0,1,2,1]]},
  layout25: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[3,0],[0,1],[1,1],[2,1]],"sol":[[0,0,3,0],[0,1,2,1]]},
  layout26: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[2,0],[3,0],[0,1],[1,1],[2,1]],"sol":[[0,0,3,0],[0,1,2,1]]},
  layout27: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[1,0],[2,0],[3,0],[0,1],[1,1],[2,1]],"sol":[[1,0,3,0],[0,1,2,1]]},
  layout28: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[3,0],[0,1],[3,1]],"sol":[[0,0,3,0],[0,1,3,1]]},
  layout29: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[3,0],[0,1],[3,1]],"sol":[[0,0,3,0],[0,1,3,1]]},
  layout30: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[2,0],[3,0],[0,1],[3,1]],"sol":[[0,0,3,0],[0,1,3,1]]},
  layout31: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[1,0],[3,0],[0,1],[1,1],[3,1]],"sol":[[0,0,3,0],[0,1,3,1]]},
  layout32: {"lv":1,"limit":2,"s":22,"ox":17,"oy":34,"dots":[[0,0],[2,0],[3,0],[0,1],[1,1],[3,1]],"sol":[[0,0,3,0],[0,1,3,1]]},
  layout33: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[0,1],[1,1],[0,2],[1,2]],"sol":[[0,0,2,0],[0,1,1,1],[0,2,1,2]]},
  layout34: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[2,0],[3,0],[0,1],[2,1],[0,2],[1,2]],"sol":[[0,0,3,0],[0,1,2,1],[0,2,1,2]]},
  layout35: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[3,0],[1,1],[2,1],[0,2],[1,2]],"sol":[[0,0,3,0],[1,1,2,1],[0,2,1,2]]},
  layout36: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[2,0],[3,0],[0,1],[1,1],[2,1],[0,2],[1,2]],"sol":[[2,0,3,0],[0,1,2,1],[0,2,1,2]]},
  layout37: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[1,0],[2,0],[3,0],[0,1],[3,1],[0,2],[1,2]],"sol":[[1,0,3,0],[0,1,3,1],[0,2,1,2]]},
  layout38: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[0,1],[1,1],[3,1],[0,2],[1,2]],"sol":[[0,0,1,0],[0,1,3,1],[0,2,1,2]]},
  layout39: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[2,0],[3,0],[0,1],[1,1],[3,1],[0,2],[1,2]],"sol":[[2,0,3,0],[0,1,3,1],[0,2,1,2]]},
  layout40: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[1,0],[2,0],[3,0],[2,1],[3,1],[0,2],[1,2]],"sol":[[1,0,3,0],[2,1,3,1],[0,2,1,2]]},
  layout41: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[1,0],[3,0],[0,1],[2,1],[3,1],[0,2],[1,2]],"sol":[[1,0,3,0],[0,1,3,1],[0,2,1,2]]},
  layout42: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[1,0],[2,0],[1,1],[2,1],[3,1],[0,2],[1,2]],"sol":[[1,0,2,0],[1,1,3,1],[0,2,1,2]]},
  layout43: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[3,0],[1,1],[2,1],[3,1],[0,2],[1,2]],"sol":[[0,0,3,0],[1,1,3,1],[0,2,1,2]]},
  layout44: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2]],"sol":[[0,0,3,0],[0,1,3,1],[0,2,1,2]]},
  layout45: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[1,0],[2,0],[3,0],[0,1],[1,1],[0,2],[2,2]],"sol":[[1,0,3,0],[0,1,1,1],[0,2,2,2]]},
  layout46: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[3,0],[1,1],[2,1],[0,2],[2,2]],"sol":[[0,0,3,0],[1,1,2,1],[0,2,2,2]]},
  layout47: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[1,0],[3,0],[0,1],[1,1],[2,1],[0,2],[2,2]],"sol":[[1,0,3,0],[0,1,2,1],[0,2,2,2]]},
  layout48: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[2,0],[3,0],[0,1],[3,1],[0,2],[2,2]],"sol":[[0,0,3,0],[0,1,3,1],[0,2,2,2]]},
  layout49: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[3,0],[1,1],[3,1],[0,2],[2,2]],"sol":[[0,0,3,0],[1,1,3,1],[0,2,2,2]]},
  layout50: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[2,0],[3,0],[0,1],[1,1],[3,1],[0,2],[2,2]],"sol":[[0,0,3,0],[0,1,3,1],[0,2,2,2]]},
  layout51: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[3,0],[2,1],[3,1],[0,2],[2,2]],"sol":[[0,0,3,0],[2,1,3,1],[0,2,2,2]]},
  layout52: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[1,0],[2,0],[3,0],[0,1],[2,1],[3,1],[0,2],[2,2]],"sol":[[1,0,3,0],[0,1,3,1],[0,2,2,2]]},
  layout53: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[2,0],[3,0],[1,1],[2,1],[3,1],[0,2],[2,2]],"sol":[[0,0,3,0],[1,1,3,1],[0,2,2,2]]},
  layout54: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[2,2]],"sol":[[1,0,3,0],[0,1,3,1],[0,2,2,2]]},
  layout55: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[1,2],[2,2]],"sol":[[0,0,3,0],[0,1,1,1],[1,2,2,2]]},
  layout56: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[3,0],[0,1],[1,1],[2,1],[1,2],[2,2]],"sol":[[0,0,3,0],[0,1,2,1],[1,2,2,2]]},
  layout57: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[3,0],[0,1],[3,1],[1,2],[2,2]],"sol":[[0,0,3,0],[0,1,3,1],[1,2,2,2]]},
  layout58: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[3,1],[1,2],[2,2]],"sol":[[0,0,3,0],[0,1,3,1],[1,2,2,2]]},
  layout59: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[2,0],[3,0],[0,1],[1,1],[0,2],[1,2],[2,2]],"sol":[[0,0,3,0],[0,1,1,1],[0,2,2,2]]},
  layout60: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[1,0],[2,0],[3,0],[0,1],[2,1],[0,2],[1,2],[2,2]],"sol":[[1,0,3,0],[0,1,2,1],[0,2,2,2]]},
  layout61: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]],"sol":[[0,0,2,0],[0,1,2,1],[0,2,2,2]]},
  layout62: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[3,0],[0,1],[3,1],[0,2],[1,2],[2,2]],"sol":[[0,0,3,0],[0,1,3,1],[0,2,2,2]]},
  layout63: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[2,0],[3,0],[1,1],[3,1],[0,2],[1,2],[2,2]],"sol":[[0,0,3,0],[1,1,3,1],[0,2,2,2]]},
  layout64: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[2,1],[3,1],[0,2],[1,2],[2,2]],"sol":[[0,0,2,0],[2,1,3,1],[0,2,2,2]]},
  layout65: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[3,0],[0,1],[2,1],[3,1],[0,2],[1,2],[2,2]],"sol":[[0,0,3,0],[0,1,3,1],[0,2,2,2]]},
  layout66: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[3,0],[0,1],[1,1],[0,2],[3,2]],"sol":[[0,0,3,0],[0,1,1,1],[0,2,3,2]]},
  layout67: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[1,0],[2,0],[3,0],[1,1],[2,1],[0,2],[3,2]],"sol":[[0,0,3,0],[1,1,2,1],[0,2,3,2]]},
  layout68: {"lv":2,"limit":3,"s":22,"ox":17,"oy":23,"dots":[[0,0],[3,0],[0,1],[1,1],[3,1],[0,2],[3,2]],"sol":[[0,0,3,0],[0,1,3,1],[0,2,3,2]]}
});
const distSeg = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy; let t = l2 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t)); return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy)); };
registerGame({
  id: 'lines', subject: 'brain', icon: '🧩', title: B('Few Lines Puzzle', '선 몇 개로 잇기'), sub: B('Connect every dot', '모든 점을 이어요'),
  area: AREA_BRAIN('Problem solving'),
  play() {
    const keys = Object.keys(LINE_PUZZLES).filter(k => LINE_PUZZLES[k].lv === lvl('lines')), key = pick(keys);
    if (dup(this, JSON.stringify(['lines', LINE_PUZZLES[key].dots, LINE_PUZZLES[key].limit]))) return this.play();
    const P = LINE_PUZZLES[key], D = P.dots.map(d => [P.ox + d[0] * P.s, P.oy + d[1] * P.s]), toXY = (g) => [P.ox + g[0] * P.s, P.oy + g[1] * P.s];
    const ask = B(`Connect ALL the dots with only ${P.limit} straight lines!`, `곧은 선 ${P.limit}개만으로 모든 점을 이어요!`);
    view().innerHTML = `<div class="prompt">${L(ask)}<button class="say" id="sp">🔊</button></div>
      <svg id="lsvg" class="dotsvg linesvg" viewBox="0 0 100 100"><g id="hintg"></g><g id="lg"></g><line id="prev" x1="0" y1="0" x2="0" y2="0" stroke="#ef476f" stroke-width="2.2" stroke-linecap="round" opacity=".6"/>
      ${D.map(d => `<circle cx="${d[0]}" cy="${d[1]}" r="3.4" class="ldot"/>`).join('')}</svg>
      <div class="lcount" id="lc">✏️ 0/${P.limit}</div>
      <div><button class="pill" id="undo">↩ ${T().undo}</button> <button class="pill" id="clr">🗑 ${T().clear}</button> <button class="pill" id="hint">💡 ${T().hint}</button></div>
      <pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    $('#sp').onclick = () => say(L(ask)); say(L(ask));
    const svg = $('#lsvg'), lines = []; let start = null, hinted = false, failed = false, solved = false;
    const pt = (e) => { const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; const q = p.matrixTransform(svg.getScreenCTM().inverse()); return [q.x, q.y]; };
    const snap = (p) => { let best = null, bd = P.s * 0.28; D.forEach(d => { const k = Math.hypot(d[0] - p[0], d[1] - p[1]); if (k < bd) { bd = k; best = d; } }); return best || p; };
    const redraw = () => { $('#lg').innerHTML = lines.map((l, i) => `<line x1="${l[0][0]}" y1="${l[0][1]}" x2="${l[1][0]}" y2="${l[1][1]}" stroke="${['#ef476f', '#118ab2', '#06d6a0', '#8338ec', '#ff8c42'][i % 5]}" stroke-width="2.4" stroke-linecap="round"/>`).join(''); $('#lc').textContent = `✏️ ${lines.length}/${P.limit}`; };
    const covered = () => D.every(d => lines.some(l => distSeg(d, l[0], l[1]) <= P.s * 0.3));
    const check = () => {
      if (solved) return;
      if (covered() && lines.length <= P.limit) {
        solved = true; const ok = !hinted && !failed; record('lines', ok); if (ok) addPeach();
        $('#cheer').textContent = pick(T().right) + ' 🧠'; say(pick(T().right)); nextButton(() => this.play());
      } else if (lines.length >= P.limit && !covered()) { failed = true; $('#cheer').textContent = T().tooMany; say(T().again); }
    };
    svg.onpointerdown = (e) => { if (solved) return; start = snap(pt(e)); try { svg.setPointerCapture(e.pointerId); } catch (x) {} e.preventDefault(); };
    svg.onpointermove = (e) => { if (!start) return; const p = pt(e), pv = $('#prev'); pv.setAttribute('x1', start[0]); pv.setAttribute('y1', start[1]); pv.setAttribute('x2', p[0]); pv.setAttribute('y2', p[1]); e.preventDefault(); };
    svg.onpointerup = (e) => {
      if (!start) return; const end = snap(pt(e)), pv = $('#prev'); ['x1', 'y1', 'x2', 'y2'].forEach(a => pv.setAttribute(a, 0));
      if (Math.hypot(end[0] - start[0], end[1] - start[1]) > 4) { lines.push([start, end]); redraw(); $('#cheer').textContent = ''; check(); }
      start = null;
    };
    const hidePrev = () => { const pv = $('#prev'); ['x1', 'y1', 'x2', 'y2'].forEach(k => pv.setAttribute(k, 0)); start = null; };
    svg.onpointercancel = hidePrev; svg.onlostpointercapture = () => { if (start) hidePrev(); };      // touch gestures can be cancelled mid-drag
    const clearHint = () => { $('#hintg').innerHTML = ''; };
    const undo = () => { if (solved) return; hidePrev(); if (lines.length) lines.pop(); else clearHint(); redraw(); $('#cheer').textContent = ''; };
    const clear = () => { if (solved) return; hidePrev(); lines.length = 0; clearHint(); redraw(); $('#cheer').textContent = ''; };
    ['undo', 'clr'].forEach(id => { const b = $('#' + id), f = id === 'undo' ? undo : clear; b.onclick = f; b.onpointerdown = (e) => e.stopPropagation(); });
    $('#hint').onclick = () => { if (solved) return; hinted = true; $('#hintg').innerHTML = P.sol.map(s => { const a = toXY([s[0], s[1]]), b = toXY([s[2], s[3]]); return `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#06d6a0" stroke-width="2.6" stroke-dasharray="4 3" stroke-linecap="round" opacity=".7"/>`; }).join(''); };
    window.__lines = { svg, D, P, toXY };
  }
});

// ---------- 3. Maze ----------
function genMaze(n) {
  const c = Array.from({ length: n }, () => Array.from({ length: n }, () => ({ t: 1, r: 1, b: 1, l: 1, v: 0 })));
  const st = [[0, 0]]; c[0][0].v = 1;
  while (st.length) {
    const [r, k] = st[st.length - 1], nb = shuffle([[-1, 0, 't', 'b'], [1, 0, 'b', 't'], [0, -1, 'l', 'r'], [0, 1, 'r', 'l']]).filter(d => c[r + d[0]] && c[r + d[0]][k + d[1]] && !c[r + d[0]][k + d[1]].v);
    if (!nb.length) { st.pop(); continue; }
    const d = nb[0], nr = r + d[0], nc = k + d[1]; c[r][k][d[2]] = 0; c[nr][nc][d[3]] = 0; c[nr][nc].v = 1; st.push([nr, nc]);
  }
  return c;
}
registerGame({
  id: 'maze', subject: 'brain', icon: '🧀', title: B('Mouse Maze', '생쥐 미로'), sub: B('Find the cheese', '치즈를 찾아요'),
  area: AREA_BRAIN('Mazes'),
  play() {
    const n = lvl('maze') === 1 ? 4 : 6, m = genMaze(n), ask = B('Help the mouse find the cheese! Drag or tap the arrows.', '생쥐가 치즈를 찾게 도와요! 끌거나 화살표를 눌러요.');
    if (dup(this, JSON.stringify(['maze', m.map(row => row.map(c => [c.t, c.r, c.b, c.l]))]))) return this.play();
    view().innerHTML = `<div class="prompt">${L(ask)}<button class="say" id="sp">🔊</button></div>
      <div class="maze" id="mz" style="--n:${n}">${m.map((row, r) => row.map((c, k) => `<div class="mc2 ${c.t ? 'wt' : ''} ${c.r ? 'wr' : ''} ${c.b ? 'wb' : ''} ${c.l ? 'wl' : ''}" data-r="${r}" data-c="${k}"></div>`).join('')).join('')}</div>
      <div class="dpad"><button class="pill" data-d="u">⬆️</button><div><button class="pill" data-d="l">⬅️</button><button class="pill" data-d="d">⬇️</button><button class="pill" data-d="r">➡️</button></div></div>
      <pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    $('#sp').onclick = () => say(L(ask)); say(L(ask));
    const cell = (r, k) => document.querySelector(`.mc2[data-r="${r}"][data-c="${k}"]`);
    let pr = 0, pc = 0, done = false, moves = 0;
    const paint = () => { $$('.mc2').forEach(x => { x.textContent = ''; }); cell(n - 1, n - 1).textContent = '🧀'; cell(pr, pc).textContent = '🐭'; cell(pr, pc).classList.add('trail'); };
    const step = (dr, dc) => {
      if (done) return false; const c = m[pr][pc], nr = pr + dr, nc = pc + dc; if (nr < 0 || nc < 0 || nr >= n || nc >= n) return false;
      if ((dr === -1 && c.t) || (dr === 1 && c.b) || (dc === -1 && c.l) || (dc === 1 && c.r)) return false;
      pr = nr; pc = nc; moves++; paint();
      if (pr === n - 1 && pc === n - 1) { done = true; record('maze', true); addPeach(); $('#cheer').textContent = pick(T().right) + ' 🧀'; say(pick(T().right)); nextButton(() => this.play()); }
      return true;
    };
    paint();
    $$('.dpad button').forEach(b => b.onclick = () => { const d = b.dataset.d; step(d === 'u' ? -1 : d === 'd' ? 1 : 0, d === 'l' ? -1 : d === 'r' ? 1 : 0); });
    const mz = $('#mz'); let drag = false;
    const follow = (e) => { const el = document.elementFromPoint(e.clientX, e.clientY), t = el && el.closest && el.closest('.mc2'); if (!t) return; const r = +t.dataset.r, k = +t.dataset.c; if (Math.abs(r - pr) + Math.abs(k - pc) === 1) step(r - pr, k - pc); };
    mz.onpointerdown = (e) => { drag = true; follow(e); e.preventDefault(); }; mz.onpointermove = (e) => { if (drag) follow(e); e.preventDefault(); }; mz.onpointerup = () => { drag = false; }; mz.onpointercancel = mz.onpointerup;
    window.__maze = { m, n, step, state: () => [pr, pc] };
  }
});

// ---------- 4. Shadow match ----------
const SHADOW_ITEMS = [['🐘', B('elephant', '코끼리')], ['🦒', B('giraffe', '기린')], ['🐢', B('turtle', '거북이')], ['🐟', B('fish', '물고기')], ['🦆', B('duck', '오리')], ['🚀', B('rocket', '로켓')],
  ['🏠', B('house', '집')], ['🌳', B('tree', '나무')], ['🦋', B('butterfly', '나비')], ['🐙', B('octopus', '문어')], ['✈️', B('airplane', '비행기')], ['🎸', B('guitar', '기타')], ['🔔', B('bell', '종')], ['🐇', B('rabbit', '토끼')]];
registerGame({
  id: 'shadow', subject: 'brain', icon: '🌑', title: B('Shadow Match', '그림자 맞추기'), sub: B('Whose shadow is it?', '누구의 그림자일까?'),
  area: AREA_BRAIN('Visual matching'),
  play() {
    if(lvl('shadow')===2){const [a,b,c]=shuffle(SHADOW_ITEMS).slice(0,3);quiz(this,{ask:B('Match both shadows in the same order.','두 그림자를 같은 순서의 그림 짝과 맞춰요.'),show:`<span class="emo shadowed">${a[0]} ${b[0]}</span>`,opts:[[a,b],[b,a],[a,c]].map((pair,i)=>({html:`<span class="emo">${pair[0][0]} ${pair[1][0]}</span>`,ok:i===0})),cls:'shapes'});return;}
    const t = pick(SHADOW_ITEMS), ds = others(SHADOW_ITEMS, t, lvl('shadow') === 2 ? 3 : 2), o = (x) => ({ html: `<span class="emo">${x[0]}</span>`, label: x[1], ok: x === t });
    quiz(this, {
      ask: B('Which picture makes this shadow?', '이 그림자는 어느 그림일까요?'),
      show: `<span class="emo shadowed">${t[0]}</span>`, opts: [o(t), ...ds.map(o)], cls: 'shapes', after: B(`It is a ${t[1].en}!`, `${t[1].ko}!`), vocab: t[1].en
    });
  }
});

// ---------- 5. Odd one out ----------
const LOOK = [['🍎', '🍅'], ['🐶', '🐺'], ['🐱', '🐯'], ['🌞', '🌕'], ['🍊', '🏀'], ['⚽', '🏀'], ['🐸', '🐢'], ['🟦', '🟪'], ['🍌', '🌙'], ['🐻', '🐼']];
const CATS = { animals: ['🐶', '🐱', '🐰', '🐻', '🦁', '🐸', '🐷'], fruit: ['🍎', '🍌', '🍇', '🍓', '🍊', '🍒'], vehicles: ['🚗', '🚌', '🚲', '✈️', '🚂', '🚁'], sports: ['⚽', '🏀', '🎾', '🏈'], weather: ['☀️', '🌧️', '❄️', '🌈'] };
registerGame({
  id: 'odd', subject: 'brain', icon: '🧐', title: B('Odd One Out', '다른 것 찾기'), sub: B('Which is different?', '무엇이 다를까?'),
  area: AREA_BRAIN('Sorting & logic'),
  play() {
    const look = lvl('odd') === 2 && rnd(2) === 0, o = (e, ok) => ({ html: `<span class="emo">${e}</span>`, ok });
    if (look) {
      const [a, b] = pick(LOOK), swap = rnd(2) === 0, same = swap ? b : a, diff = swap ? a : b;
      quiz(this, { ask: B('Look carefully. Which one is different?', '잘 보세요. 어느 것이 다를까요?'), opts: [...Array.from({ length: 4 }, () => o(same, false)), o(diff, true)], cls: 'five', after: B('Great eyes!', '눈이 정말 좋아요!') });
    } else {
      const ks = Object.keys(CATS), c1 = pick(ks), c2 = pick(ks.filter(k => k !== c1)), good = shuffle(CATS[c1]).slice(0, 3), bad = pick(CATS[c2]);
      quiz(this, { ask: B('Which one does NOT belong?', '어느 것이 어울리지 않을까요?'), opts: [...good.map(e => o(e, false)), o(bad, true)], cls: 'four', after: B('It is not like the others!', '다른 것과 달라요!') });
    }
  }
});

// ---------- 6. Copy the colors (Simon) ----------
const PADS = [['#ef476f', 262], ['#118ab2', 330], ['#06d6a0', 392], ['#ffd166', 523]];
let simonTok = 0;
registerGame({
  id: 'simon', subject: 'brain', icon: '🎹', title: B('Copy the Colors', '색깔 따라 하기'), sub: B('Watch, then repeat', '보고 똑같이 눌러요'),
  area: AREA_BRAIN('Memory'),
  play() {
    const len = lvl('simon') === 1 ? 3 : 4 + rnd(2), seq = Array.from({ length: len }, () => rnd(4)), tok = ++simonTok, sleep = (ms) => new Promise(r => setTimeout(r, ms));
    if (dup(this, JSON.stringify(['simon', seq]))) return this.play();
    view().innerHTML = `<div class="prompt" id="st">${T().watch}</div>
      <div class="pads">${PADS.map((p, i) => `<button class="pad" data-i="${i}" style="background:${p[0]}" aria-label="color ${i + 1}"></button>`).join('')}</div>
      <div><button class="pill" id="rep">👂 ${T().replay}</button></div><pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    const pads = $$('.pad'), flash = async (i) => { pads[i].classList.add('lit'); beep(PADS[i][1]); await sleep(420); pads[i].classList.remove('lit'); await sleep(160); };
    let step = 0, missed = false, busy = true, solved = false;
    const playSeq = async () => { busy = true; $('#st').textContent = T().watch; await sleep(500); for (const i of seq) { if (tok !== simonTok || !$('#st')) return; await flash(i); } if (tok !== simonTok || !$('#st')) return; $('#st').textContent = T().yourTurn; say(T().yourTurn); busy = false; step = 0; };
    pads.forEach(p => p.onclick = async () => {
      if (busy || solved) return; const i = +p.dataset.i; p.classList.add('lit'); beep(PADS[i][1], 200); setTimeout(() => p.classList.remove('lit'), 220);
      if (i === seq[step]) { step++; if (step === seq.length) { solved = true; recordFinal('simon', missed); if (!missed) addPeach(); $('#cheer').textContent = pick(T().right); say(pick(T().right)); nextButton(() => this.play()); } }
      else { if (!missed) { missed = true; record('simon', false); } $('#cheer').textContent = T().again; say(T().again); busy = true; await sleep(900); $('#cheer').textContent = ''; if (tok === simonTok) playSeq(); }
    });
    $('#rep').onclick = () => { if (!busy && !solved) { missed = true; playSeq(); } };
    playSeq(); window.__simon = { seq, pads };
  }
});
