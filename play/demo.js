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
      let animation;
      const replay = () => {
        if (!root.isConnected) return;
        animation?.cancel();
        const target = root.querySelectorAll('.demo-option')[item.opts.findIndex(o => o.ok)];
        if (!target) return;
        const r = root.getBoundingClientRect(), t = target.getBoundingClientRect();
        const end = { left: `${t.left - r.left + t.width / 2 - 18}px`, top: `${t.top - r.top + t.height / 2}px`, opacity: 1 };
        const calm = S.calm || matchMedia('(prefers-reduced-motion: reduce)').matches;
        animation = finger.animate(calm ? [{...end, opacity: 0}, end, end, {...end, opacity: 0}] :
          [{left: '5px', top: '20px', opacity: 0}, {left: '5px', top: '20px', opacity: 1}, end, {...end, transform: 'scale(.8)'}, {...end, opacity: 0}],
          {duration: calm ? 1800 : 3000, fill: 'forwards'});
      };
      $('#demoSay').onclick = () => say(text('Watch. Tap one picture. Then it is your turn.', '보아요. 그림 하나를 눌러요. 다음은 내 차례예요.'));
      $('#demoReplay').onclick = replay;
      $('#demoGo').onclick = () => {
        animation?.cancel(); S.demoSeen ||= {}; S.demoSeen[game.id] = true; save();
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
