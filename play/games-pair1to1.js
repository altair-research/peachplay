(() => {
  'use strict';
  const banks = {
    1: [[1,2],[2,1],[1,3],[3,1],[2,3],[3,2],[2,4],[4,2],[3,4],[4,3],[3,5],[5,3],[4,5],[5,4],[1,4],[4,1]],
    2: [[3,4],[4,3],[3,5],[5,3],[4,6],[6,4],[5,7],[7,5],[6,8],[8,6],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8]]
  };
  const icons = ['🍎','🐟','🌼','🟣'];
  const history = {1:[],2:[]};
  const choice = (side, equal) => `<svg viewBox="0 0 100 70" aria-hidden="true"><rect x="8" y="8" width="84" height="22" rx="7" fill="${equal || side === 'A' ? '#4d78bd' : '#e2e8ef'}"/><rect x="8" y="40" width="84" height="22" rx="7" fill="${equal || side === 'B' ? '#4d78bd' : '#e2e8ef'}"/><text x="50" y="${equal ? 45 : side==='A'?25:57}" text-anchor="middle" fill="${equal?'#253653':'white'}" font-size="22">${equal?'=':side}</text></svg>`;
  registerGame({
    id:'pair1to1',grade:'K',subject:'math',icon:'🔗',title:B('Pair Them Up','하나씩 짝지어요'),
    sub:B('Join one to one','하나씩 이어요'),area:B('Math · Comparing sets','수학 · 묶음 비교'),
    play(){
      const lv=Math.min(2,lvl(this.id)), available=banks[lv].map((v,i)=>i).filter(i=>!history[lv].includes(i));
      const index=pick(available),[a,b]=banks[lv][index];history[lv]=[...history[lv],index].slice(-8);
      const icon=icons[Math.floor(index/4)], wideA=index%4<2;
      const row=(n,side)=>`<div class="pair-group pair-${side}"><span class="pair-label">${side}</span>${Array.from({length:n},(_,i)=>{
        // Stagger L2 targets so 44px touch squares fit even when eight objects are spread narrowly.
        const spread=lv===1?Math.max(a,b)*44:((side==='A')===wideA?260:180),step=spread/Math.max(1,(lv===1?Math.max(a,b):n)-1);
        const left=lv===1?`calc(50% - ${Math.max(a,b)*22}px + ${i*44+22}px)`:`calc(50% + ${(i-(n-1)/2)*step}px)`;
        return `<button class="pair-token" data-side="${side}" data-token="${i}" style="left:${left};top:${lv===2?12+(i%2)*44:16}px" aria-label="${side} ${i+1}" aria-pressed="false">${icon}</button>`;
      }).join('')}</div>`;
      quiz(this,{
        ask:B('Which group has more?', '어느 쪽이 더 많아요?'),
        show:`<div class="pair-board" data-a="${a}" data-b="${b}" data-level="${lv}"><div class="pair-instruction" aria-hidden="true">👆 A ↕ B 🔗</div>${row(a,'A')}<svg class="pair-lines" aria-hidden="true"></svg>${row(b,'B')}</div>`,
        opts:[{html:choice('A'),label:B('Top','위쪽'),ok:a>b},{html:choice('B'),label:B('Bottom','아래쪽'),ok:b>a},{html:choice('',true),label:B('Same','같아요'),ok:a===b}],
        cls:'pair-answers',
        onRender(){
          const board=$('.pair-board'), lines=board.querySelector('.pair-lines');let selected=null;const pairs=[];
          const redraw=()=>{
            const r=board.getBoundingClientRect();lines.setAttribute('viewBox',`0 0 ${r.width} ${r.height}`);
            lines.innerHTML=pairs.map(([x,y])=>{const p=x.getBoundingClientRect(),q=y.getBoundingClientRect();return `<line x1="${p.left+p.width/2-r.left}" y1="${p.top+p.height/2-r.top}" x2="${q.left+q.width/2-r.left}" y2="${q.top+q.height/2-r.top}" stroke="#426daa" stroke-width="3"/>`;}).join('');
          };
          board.querySelectorAll('.pair-token').forEach(btn=>btn.onclick=()=>{
            if(btn.dataset.paired)return;
            if(!selected||selected.dataset.side===btn.dataset.side){selected?.setAttribute('aria-pressed','false');selected=btn;btn.setAttribute('aria-pressed','true');return;}
            pairs.push([selected,btn]);[selected,btn].forEach(e=>{e.dataset.paired='1';e.setAttribute('aria-pressed','false');e.classList.add('paired');});selected=null;redraw();
            if(pairs.length===Math.min(a,b))board.querySelectorAll('.pair-token:not([data-paired])').forEach(e=>e.classList.add('pair-leftover'));
          });
          board.querySelectorAll('.pair-token').forEach(btn=>btn.onkeydown=e=>{
            if(e.key==='Enter'||e.key===' '){e.preventDefault();btn.click();}
          });
          const observer=new ResizeObserver(()=>{if(board.isConnected)redraw();else observer.disconnect();});observer.observe(board);
          // Final answer is the only graded action. Connecting is optional and never reveals a choice after a miss.
        },
        onCorrect(){ $$('.pair-token').forEach(e=>{e.disabled=true;}); },
        after:B('One picture with one picture.', '그림 하나와 그림 하나를 이어요.')
      });
    }
  });
})();
