// Shared renderers extracted without changing the standalone puzzles.
(() => {
  'use strict';
  const seq = n => Array.from({ length: n }, (_, i) => i);
  const grid = (a, n, mark = -1, box = 0) => `<div class="z-grid" style="--z-n:${n}">${a.map((v, i) => `<span class="z-cell ${i === mark ? 'z-mark z-empty' : ''} ${box && (i % n + 1) % box === 0 ? 'z-edge' : ''} ${box && (Math.floor(i / n) + 1) % (n / box) === 0 ? 'z-bottom' : ''}">${i === mark ? '' : v === null ? '·' : v}</span>`).join('')}</div>`;
  const bits = (a, n) => grid(a.map(v => v ? '●' : '·'), n);
  const line = s => `<div class="z-line">${s}</div>`;
  const turn = (a, n) => seq(a.length).map(i => a[(n - 1 - i % n) * n + Math.floor(i / n)]);
  const mirror = (a, n) => seq(a.length).map(i => a[Math.floor(i / n) * n + n - 1 - i % n]);
  const pyramid = (rows, at, col) => rows.slice().reverse().map((r, k) => `<div class="z-pyramid">${r.map((v, j) => rows.length - 1 - k === at && j === col ? `<b class="z-empty" aria-label="${L(B('empty block', '빈 칸'))}"></b>` : `<b>${v}</b>`).join('')}</div>`).join('');
  window.PuzzleVisuals = { grid, bits, line, turn, mirror, pyramid };
})();
