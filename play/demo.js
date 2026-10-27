/* Separate, unscored examples. Nothing here invokes a quiz answer handler. */
(() => {
  'use strict';
  let mixed = false, pending = null, activeFit = null;
  addEventListener('resize', () => activeFit?.());
  const signature = item => JSON.stringify([item.ask, item.askSay || '', (item.show || '').replace(/style="[^"]*"/g,''), item.opts.filter(o=>o.ok).map(o=>[o.html,o.label || ''])]);
  const text = (en, ko) => L(B(en, ko));
  window.PictureDemo = {
    intercept(game, item) {
      if (pending && pending.id === game.id) {
        const p = pending;
        if (signature(item) === p.key) {
          if (++p.tries < 40) { game.play(); return true; }
          // A constant generator cannot provide new material: do not score its demonstration.
          pending = null; view().innerHTML = `<button class="next" id="demoHome">🏠 ${T().back}</button>`;
          $('#demoHome').onclick = home; return true;
        }
        pending = null;
        return false;
      }
      // QA pages (scripts/qa/harness.js) skip the demo unless a test asks for it with __qa.demo = true.
      if (window.__qa && !window.__qa.demo) return false;
      if (DIAG.active || SESSION.review || SESSION.mix || mixed || SESSION.n !== 0 ||
          !(['P', 'K'].includes(gradeOf(game)) || gradeOf(game)==='both' && kidGrade()==='K') || S.demoSeen?.[game.id]) return false;
      const key = signature(item);
      view().innerHTML = `<section class="picture-demo" aria-label="${text('Watch first', '먼저 보아요')}">
        <div class="prompt">👀 ${text('Watch first', '먼저 보아요')}<button class="say" id="demoSay" aria-label="${T().listen}">🔊</button></div>
        <div class="demo-stage"><div class="demo-material">${item.show || ''}</div>
        <div class="demo-options" style="--demo-cols:${item.opts.length>3?2:item.opts.length}">${item.opts.map(o => `<div class="demo-option">${o.html}${o.label ? `<span class="ol">${labelText(o.label)}</span>` : ''}</div>`).join('')}</div></div>
        <span class="demo-finger" aria-hidden="true">👆</span>
        <div class="demo-actions"><button class="pill" id="demoReplay">🔁 ${text('Watch again', '다시 보기')}</button><button class="next" id="demoGo">▶ ${text('My turn', '내 차례')}</button></div></section>`;
      const root = $('.picture-demo'), finger = root.querySelector('.demo-finger');
      // Scale the example as a whole, keeping controls full size. Never crop a task's picture.
      const fit = () => {
        if (!root.isConnected) return;
        const stage=root.querySelector('.demo-stage');stage.style.zoom=1;
        let width=root.clientWidth;
        for(let n=0;n<3;n++){stage.style.width=width+'px';width=Math.max(width,stage.scrollWidth);}
        stage.style.width=width+'px';
        const available=Math.max(100,innerHeight-stage.getBoundingClientRect().top-root.querySelector('.demo-actions').getBoundingClientRect().height-64);
        stage.style.zoom=Math.min(1,root.clientWidth/width,available/Math.max(1,stage.scrollHeight));
      };
      activeFit=fit;fit();
      // onRender is deliberately not called: custom handlers may change learning state.
      root.querySelectorAll('button:not(.demo-actions button):not(#demoSay),[tabindex],input,a').forEach(e => {
        if (e.id !== 'demoSay') { e.tabIndex = -1; e.style.pointerEvents = 'none'; }
      });
      let animation, run = 0;
      const board = root.querySelector('.pair-board');
      // Pair Them Up (2026-10-27): show the joining itself, one top picture to one bottom picture, then the leftover, then the answer.
      const pairSteps = () => {
        if (!board) return [];
        const A = [...board.querySelectorAll('.pair-A .pair-token')], Bs = [...board.querySelectorAll('.pair-B .pair-token')], lines = board.querySelector('.pair-lines'), steps = [];
        const n = Math.min(A.length, Bs.length);
        for (let i = 0; i < n; i++) {
          steps.push({ el: A[i], tap: () => A[i].setAttribute('aria-pressed', 'true') });
          steps.push({ el: Bs[i], tap: () => {
            A[i].setAttribute('aria-pressed', 'false'); [A[i], Bs[i]].forEach(e => e.classList.add('paired'));
            const r = board.getBoundingClientRect(), p = A[i].getBoundingClientRect(), q = Bs[i].getBoundingClientRect();
            lines.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
            lines.insertAdjacentHTML('beforeend', `<line x1="${p.left + p.width / 2 - r.left}" y1="${p.top + p.height / 2 - r.top}" x2="${q.left + q.width / 2 - r.left}" y2="${q.top + q.height / 2 - r.top}" stroke="#426daa" stroke-width="3"/>`);
            if (i === n - 1) [...A.slice(n), ...Bs.slice(n)].forEach(e => e.classList.add('pair-leftover'));
          } });
        }
        return steps;
      };
      const resetPairs = () => { if (!board) return; board.querySelector('.pair-lines').innerHTML = ''; board.querySelectorAll('.pair-token').forEach(e => { e.classList.remove('paired', 'pair-leftover'); e.setAttribute('aria-pressed', 'false'); }); };
      const replay = async () => {
        if (!root.isConnected) return;
        const me = ++run; finger.getAnimations().forEach(x => x.cancel()); resetPairs();
        const target = root.querySelectorAll('.demo-option')[item.opts.findIndex(o => o.ok)];
        if (!target) return;
        const calm = S.calm || matchMedia('(prefers-reduced-motion: reduce)').matches;
        const at = el => { const r = root.getBoundingClientRect(), t = el.getBoundingClientRect(); return { left: `${t.left - r.left + t.width / 2 - 18}px`, top: `${t.top - r.top + t.height / 2}px`, opacity: 1 }; };
        const steps = [...pairSteps(), { el: target }];
        let from = { left: '5px', top: '20px', opacity: 0 };
        for (const [k, st] of steps.entries()) {
          const end = at(st.el), last = k === steps.length - 1;
          animation = finger.animate(calm ? [{ ...end, opacity: 0 }, end, end, ...(last ? [{ ...end, opacity: 0 }] : [])] :
            [from, ...(k ? [] : [{ ...from, opacity: 1 }]), end, { ...end, transform: 'scale(.8)' }, ...(last ? [{ ...end, opacity: 0 }] : [end])],
            { duration: calm ? 900 : (steps.length > 1 ? (last ? 1800 : 700) : 3000), fill: 'forwards' });
          try { await animation.finished; } catch (e) { return; }
          if (me !== run || !root.isConnected) return;
          st.tap?.(); from = end;
          if (st.tap && k === steps.length - 2) await new Promise(r => setTimeout(r, 900));   // let the leftover glow be seen
        }
      };
      $('#demoSay').onclick = () => say(board ? text('Watch. Join one top picture to one bottom picture. The picture left over shows which group has more. Then it is your turn.', '보아요. 위 그림 하나와 아래 그림 하나를 이어요. 남는 그림이 있는 쪽이 더 많아요. 다음은 내 차례예요.') : text('Watch. Tap one picture. Then it is your turn.', '보아요. 그림 하나를 눌러요. 다음은 내 차례예요.'));
      $('#demoReplay').onclick = replay;
      $('#demoGo').onclick = () => {
        run++; finger.getAnimations().forEach(x => x.cancel()); S.demoSeen ||= {}; S.demoSeen[game.id] = true; save();
        pending = {id: game.id, key, tries: 0}; game.play();
      };
      requestAnimationFrame(replay); $('#demoGo').focus();
      return true;
    }
  };
  addEventListener('DOMContentLoaded', () => {
    const originalSurprise = window.surprise;
    window.surprise = function(...args) { mixed = true; try { return originalSurprise.apply(this, args); } finally { mixed = false; } };
    const originalSettings = window.settings;
    window.settings = function(...args) {
      originalSettings.apply(this, args);
      const b = document.createElement('button'); b.className = 'pill'; b.id = 'demoReset';
      b.textContent = '🔁 ' + text('Watch demos again', '시범 다시 보기');
      b.onclick = () => { S.demoSeen = {}; save(); b.textContent = '✓ ' + text('Demos are ready', '다음 놀이에서 시범을 봐요'); say(b.textContent); };
      view().append(b);
    };
  });
})();
