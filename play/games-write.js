'use strict';
// Writing games (EL Education K writing, "Drawing and writing", labeling, letter formation).
const AREA_WRITE = (u) => B(`Writing · ${u}`, `쓰기 · ${u}`);

// ---------- shared: tap-the-tiles-in-order engine (spell a word / build a sentence) ----------
function tileRound(game, cfg) {
  if (dup(game, cfg.target.join(' '))) return game.play();
  const tokens = shuffle([...cfg.target, ...cfg.extra]);
  if (cfg.oneRow === undefined && tokens.length <= 7 && tokens.every(t => String(t).length <= 2)) cfg.oneRow = true;   // letter tiles stay on one line
  view().innerHTML = `
    <div class="prompt">${L(cfg.ask)}<button class="say" id="sp" aria-label="${T().listen}">🔊</button></div>
    <div class="show">${cfg.show || ''}</div>
    <div class="slots${cfg.oneRow ? ' onerow' : ''}">${cfg.target.map(() => '<div class="slot"></div>').join('')}</div>
    <div class="opts tiles${cfg.oneRow ? ' onerow' : ''}">${tokens.map((t, i) => `<button class="opt tile" data-i="${i}">${t}</button>`).join('')}</div>
    <pk-cheer class="cheer" id="cheer"></pk-cheer><div class="fact" id="fact"></div>`;
  const ask = () => say(L(cfg.askSay || cfg.ask));
  $('#sp').onclick = ask; ask();
  let pos = 0, missed = false;
  if (DIAG.active) DIAG.decorate(game);
  $$('.tile').forEach(b => b.onclick = () => {
    if (b.disabled) return;
    const tok = tokens[+b.dataset.i];
    if (tok === cfg.target[pos]) {
      $$('.slot')[pos].textContent = tok; $$('.slot')[pos].classList.add('filled');
      b.disabled = true; b.classList.add('used'); pos++;
      if (cfg.speakTiles) say(tok, 'en-US');
      if (pos === cfg.target.length) {
        if (DIAG.active) { DIAG.answer(game, !missed, null); return; }
        recordFinal(game.id, missed); if (!missed) addPeach();
        $('#cheer').textContent = pick(T().right);
        if (cfg.after) { $('#fact').textContent = L(cfg.after); say(cfg.vocab || L(cfg.after), cfg.vocab ? 'en-US' : undefined); }
        nextButton(() => game.play());
      }
    } else { b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); if (!missed) { missed = true; if (!DIAG.active) record(game.id, false); } say(T().again); }
  });
}

const CVC = [['cat', '🐱', B('cat', '고양이')], ['dog', '🐶', B('dog', '강아지')], ['sun', '☀️', B('sun', '해')], ['hat', '🎩', B('hat', '모자')], ['pig', '🐷', B('pig', '돼지')], ['bus', '🚌', B('bus', '버스')],
  ['cup', '🥤', B('cup', '컵')], ['bed', '🛏️', B('bed', '침대')], ['fox', '🦊', B('fox', '여우')], ['hen', '🐔', B('hen', '암탉')], ['bat', '🦇', B('bat', '박쥐')], ['pen', '🖊️', B('pen', '펜')]];
const BIGGER = [['frog', '🐸', B('frog', '개구리')], ['fish', '🐟', B('fish', '물고기')], ['moon', '🌙', B('moon', '달')], ['star', '⭐', B('star', '별')], ['tree', '🌳', B('tree', '나무')],
  ['duck', '🦆', B('duck', '오리')], ['milk', '🥛', B('milk', '우유')], ['cake', '🎂', B('cake', '케이크')], ['bird', '🐦', B('bird', '새')], ['bear', '🐻', B('bear', '곰')], ['ship', '🚢', B('ship', '배')]];
const ALPHA = 'abcdefghijklmnopqrstuvwxyz'.split('');

// ---------- 1. Label it (spell the word for the picture) ----------
registerGame({
  id: 'label', subject: 'write', icon: '🏷️', title: B('Label It', '그림에 이름 붙이기'), sub: B('Spell the word', '글자를 순서대로'),
  area: AREA_WRITE('Labeling'),
  play() {
    const w = pick(lvl('label') === 1 ? CVC : [...CVC, ...BIGGER]);
    const letters = w[0].split(''), extra = others(ALPHA.filter(c => !letters.includes(c)), '', 2);
    tileRound(this, {
      ask: B('Spell the word for the picture!', '그림의 이름을 글자로 만들어요!'), show: `<span class="emo">${w[1]}</span>`,
      target: letters, extra, speakTiles: true, oneRow: true, after: B(`${w[0]}!`, `${w[0]} — ${w[2].ko}!`), vocab: w[0]
    });
  }
});

// ---------- 2. Build a sentence ----------
const SENTENCES = {
  1: [['I see a cat.', '🐱'], ['I like my dog.', '🐶'], ['We can go up.', '⬆️'], ['The sun is hot.', '☀️'], ['I can run.', '🏃'], ['My hat is here.', '🧢'], ['I see a pig.', '🐷'], ['I see a bus.', '🚌'], ['I see a fox.', '🦊'], ['I see a hen.', '🐔'], ['I see a bat.', '🦇'], ['I see a pen.', '🖊️']],
  2: [['I see a big dog.', '🐕'], ['We like to play.', '⚽'], ['The cat is on the bed.', '🐱'], ['I can see the moon.', '🌙'], ['The bird can fly up.', '🐦'], ['My mom and I read.', '📖'], ['I can see a fish.', '🐟'], ['I can see a star.', '⭐'], ['I can see a tree.', '🌳'], ['I can see a duck.', '🦆'], ['I can see a bear.', '🐻'], ['I can see a ship.', '🚢']]
};
registerGame({
  id: 'sentence', subject: 'write', icon: '📝', title: B('Build a Sentence', '문장 만들기'), sub: B('Put the words in order', '단어를 순서대로'),
  area: AREA_WRITE('Sentences'),
  play() {
    const s = pick(SENTENCES[lvl('sentence')]), words = s[0].split(' ');
    const extraPool = ['to', 'the', 'is', 'we', 'run', 'big', 'and'].filter(x => !words.includes(x));
    tileRound(this, {
      ask: B('Put the words in order to make a sentence!', '단어를 순서대로 놓아 문장을 만들어요!'), show: `<span class="emo">${s[1]}</span>`,
      target: words, extra: others(extraPool, '', 1), speakTiles: false, after: B(s[0], s[0]), vocab: s[0]
    });
  }
});

// ---------- canvas helper ----------
function makeCanvas(w, h) {
  const dpr = window.devicePixelRatio || 1, c = document.createElement('canvas');
  c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px'; c.className = 'draw';
  const ctx = c.getContext('2d'); ctx.scale(dpr, dpr); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  return { c, ctx, dpr, w, h };
}
function bindStroke(cv, color, width, onDraw, onEnd) {
  let drawing = false, last = null;
  const pos = (e) => { const r = cv.c.getBoundingClientRect(); return [(e.clientX - r.left) * (cv.w / r.width), (e.clientY - r.top) * (cv.h / r.height)]; };
  cv.c.onpointerdown = (e) => { drawing = true; last = pos(e); try { cv.c.setPointerCapture(e.pointerId); } catch (err) {} onDraw(last, last, true); e.preventDefault(); };
  cv.c.onpointermove = (e) => { if (!drawing) return; const p = pos(e); onDraw(last, p, false); last = p; e.preventDefault(); };
  const end = () => { if (drawing) { drawing = false; if (onEnd) onEnd(); } };
  cv.c.tabIndex = 0; cv.c.setAttribute('role', 'group');
  cv.c.setAttribute('aria-label', L(B('Drawing canvas. Arrow keys move; Enter or Space starts and stops drawing.', '그림판. 방향키로 이동하고 Enter 또는 Space로 그리기를 시작하거나 멈춰요.')));
  let cursor = [cv.w / 2, cv.h / 2], keyDrawing = false;
  cv.c.parentElement?.style.setProperty('--cursor-x', '50%'); cv.c.parentElement?.style.setProperty('--cursor-y', '50%');
  cv.c.onkeydown = e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); keyDrawing = !keyDrawing; if (keyDrawing) onDraw(cursor, cursor, true); else if (onEnd) onEnd(); return; }
    const delta = { ArrowLeft: [-5, 0], ArrowRight: [5, 0], ArrowUp: [0, -5], ArrowDown: [0, 5] }[e.key]; if (!delta) return;
    e.preventDefault(); const next = [Math.max(0, Math.min(cv.w, cursor[0] + delta[0])), Math.max(0, Math.min(cv.h, cursor[1] + delta[1]))];
    if (keyDrawing) onDraw(cursor, next, false); cursor = next;
    cv.c.parentElement?.style.setProperty('--cursor-x', (cursor[0] / cv.w * 100) + '%'); cv.c.parentElement?.style.setProperty('--cursor-y', (cursor[1] / cv.h * 100) + '%');
  };
  cv.c.onblur = () => { if (keyDrawing && onEnd) onEnd(); keyDrawing = false; };
  cv.c.onpointerup = end; cv.c.onpointercancel = end;
}
const canvasSize = () => { const w = Math.min(560, Math.max(260, window.innerWidth - 40)); return [w, Math.round(w * 0.64)]; };

// ---------- 3. Trace letters and numbers ----------
const TRACE_UP = 'ABCDEFHILOTUVXYZ'.split(''), TRACE_LOW = 'acehilmnorstuvwxz'.split('');
// D7 (2026-10-28, K school test): 4 and 5 were written backward several times. These digits keep the start dot and
// direction arrows at every level, come up a little more often, and sometimes ask "which one faces the right way?".
const TRACE_FLIP = '234579';
const TRACE_NUMS = '0123456789'.split('').concat(['4', '5']);
// The digit is drawn from its stroke path (no text), so the mirrored wrong answer is the same shape turned around.
const digitSvg = (ch, mirror) => `<svg viewBox="0 0 100 100" style="width:clamp(70px,16dvh,120px);height:auto" aria-hidden="true">${TraceStrokes[ch].map(st => `<polyline points="${st.map(([x, y]) => `${((mirror ? 1 - x : x) * 100).toFixed(1)},${(y * 100).toFixed(1)}`).join(' ')}" fill="none" stroke="#1d3557" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`;
function traceFlipRound(game, ch) {
  quiz(game, {
    ask: B(`Which ${ch} faces the right way?`, `바르게 쓴 ${ch}는 어느 쪽일까요?`),
    opts: shuffle([{ html: digitSvg(ch, false), ok: true }, { html: digitSvg(ch, true), ok: false }]), cls: 'shapes',
    after: B(`This ${ch} faces the right way. When you trace it, start at dot 1.`, `이 ${ch}가 바른 방향이에요. 따라 쓸 때는 1번 점에서 시작해요.`), vocab: ch
  });
}
registerGame({
  id: 'trace', subject: 'write', icon: '✏️', title: B('Trace It', '따라 쓰기'), sub: B('Letters and numbers', '글자와 숫자'),
  area: AREA_WRITE('Letter & number formation'),
  play() {
    const lv = lvl('trace'), mode = pick(lv === 1 ? ['up', 'num'] : ['up', 'low', 'num']);
    const ch = mode === 'up' ? pick(TRACE_UP) : mode === 'low' ? pick(TRACE_LOW) : pick(TRACE_NUMS);
    if (dup(this, mode + ch)) return this.play();
    if (mode === 'num' && TRACE_FLIP.includes(ch) && window.TraceStrokes?.[ch] && rnd(3) === 0) return traceFlipRound(this, ch);
    if (window.TraceStrokes?.[ch]) return traceGuidedRound(this, ch, lv);
    const [w, h] = canvasSize(), disp = makeCanvas(w, h), ink = makeCanvas(w, h), mask = makeCanvas(w, h);
    const font = (px) => `800 ${px}px "Arial Rounded MT Bold", Arial, sans-serif`;
    const fs = ch.length > 1 ? h * 0.7 : h * 0.82;
    [mask.ctx, disp.ctx].forEach(x => { x.font = font(fs); x.textAlign = 'center'; x.textBaseline = 'alphabetic'; });
    const base = h * 0.78;
    mask.ctx.fillStyle = '#000'; mask.ctx.fillText(ch, w / 2, base);
    disp.ctx.fillStyle = '#ffd9c7'; disp.ctx.fillText(ch, w / 2, base);
    const maskData = mask.ctx.getImageData(0, 0, w * mask.dpr, h * mask.dpr).data;
    let done = false, missed = false;
    const color = '#ef476f', bw = 16;
    const ask = B(`Trace the ${mode === 'num' ? 'number' : 'letter'} ${ch}. Use your finger!`, `${ch} ${mode === 'num' ? '숫자' : '글자'}를 손가락으로 따라 써요!`);
    view().innerHTML = `<div class="prompt">${L(ask)}<button class="say" id="sp" aria-label="${T().listen}">🔊</button></div><div class="canvaswrap" id="cw"></div>
      <div><button class="pill" id="clr">${T().clear}</button> <button class="pill" id="tdone">✓ ${T().done}</button></div><pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    $('#cw').appendChild(disp.c);
    $('#sp').onclick = () => say(L(ask)); say(L(ask));
    if (DIAG.active) DIAG.decorate(this);
    const stroke = (cv) => (a, b) => { cv.ctx.strokeStyle = color; cv.ctx.lineWidth = bw; cv.ctx.beginPath(); cv.ctx.moveTo(a[0], a[1]); cv.ctx.lineTo(b[0] + 0.01, b[1]); cv.ctx.stroke(); };
    const sd = stroke(disp), si = stroke(ink);
    const evaluate = () => {
      const id = ink.ctx.getImageData(0, 0, w * ink.dpr, h * ink.dpr).data; let m = 0, hit = 0, inkPx = 0, spill = 0;
      for (let i = 3; i < id.length; i += 4) { const on = maskData[i] > 128, painted = id[i] > 128; if (on) { m++; if (painted) hit++; } if (painted) { inkPx++; if (!on) spill++; } }
      return { coverage: hit / (m || 1), spill: inkPx ? spill / inkPx : 0 };
    };
    bindStroke(disp, color, bw, (a, b) => { sd(a, b); si(a, b); }, () => {
      if (done) return; const r = evaluate(); window.__trace = r;
      if (r.coverage >= 0.5 && r.spill < 0.65) {
        done = true; if (DIAG.active) { DIAG.answer(this, !missed, null); return; }
        recordFinal('trace', missed); if (!missed) addPeach();
        $('#cheer').textContent = pick(T().right); say(ch, 'en-US'); disp.c.onpointerdown = null; disp.c.onkeydown = null; $('#tdone').disabled = true; nextButton(() => this.play());
      }
    });
    let doneTries = 0;
    $('#tdone').onclick = () => {
      if (done) return;
      if (++doneTries < 2) { const t = L(B('Trace over the whole pink shape.', '분홍 글자 위를 끝까지 따라 써요.')); $('#cheer').textContent = t; say(t); return; }
      done = true; if (DIAG.active) { DIAG.answer(this, false, null); return; }
      if (SESSION.review) reviewSolved(); else SESSION.done++; $('#cheer').textContent = L(B('Nice try! Let us trace again next time.', '잘했어요! 다음에 또 따라 써 봐요.')); disp.c.onpointerdown = null; disp.c.onkeydown = null; $('#tdone').disabled = true; nextButton(() => this.play());
    };
    $('#clr').onclick = () => { ink.ctx.clearRect(0, 0, w, h); disp.ctx.clearRect(0, 0, w, h); disp.ctx.fillStyle = '#ffd9c7'; disp.ctx.fillText(ch, w / 2, base); };
    window.__traceTest = { ch, w, h, maskData, ink, disp, dpr: mask.dpr };
  }
});

// Motor guidance: rejected strokes and clearing never log knowledge errors.
function traceGuidedRound(game, ch, lv) {
  const [w, fullH] = canvasSize(), h = Math.min(fullH, Math.max(150, innerHeight * .34));
  const disp = makeCanvas(w,h), ink = makeCanvas(w,h), mask = makeCanvas(w,h), draft = makeCanvas(w,h);
  const paths = TraceStrokes[ch].map(s => s.map(([x,y]) => [x*w,y*h]));
  const bw = 16, tolerance = Math.max(24, h*.14);
  let current = 0, done = false, startOK = false, progress = 0, maxProgress = 0, backwards = 0, jumped = false;
  const line = (ctx, pts, width, color, dash=[]) => {
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(...pts[0]);pts.slice(1).forEach(p=>ctx.lineTo(...p));ctx.stroke();ctx.setLineDash([]);
  };
  paths.forEach(p=>line(mask.ctx,p,bw*1.4,'#000'));
  const maskData=mask.ctx.getImageData(0,0,w*mask.dpr,h*mask.dpr).data;
  const ask=B(`Trace ${ch} from dot 1.`,`${ch}, 1번 점부터 따라 써요.`);
  view().innerHTML=`<div class="prompt">${L(ask)}<button class="say" id="sp" aria-label="${T().listen}">🔊</button></div><div class="canvaswrap trace-guided" id="cw"></div><div class="trace-tools"><button class="pill" id="clr">${T().clear}</button><span class="trace-hint" id="traceHint" role="status"></span><button class="pill" id="tdone">✓ ${T().done}</button></div><pk-cheer class="cheer" id="cheer"></pk-cheer>`;
  $('#cw').append(disp.c);$('#sp').onclick=()=>say(L(ask));say(L(ask));
  if(DIAG.active)DIAG.decorate(game);
  const paint = () => {
    disp.ctx.clearRect(0,0,w,h);
    paths.forEach((pts,i)=>{
      const active=i===current, color=active?'#225caa':'#aeb8c3';
      if(lv===1||TRACE_FLIP.includes(ch)){
        line(disp.ctx,pts,active?5:3,color,[5,7]);
        const a=pts[0],b=pts[1],dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),tip=[a[0]+dx*.65,a[1]+dy*.65],ang=Math.atan2(dy,dx);
        if(len>8)line(disp.ctx,[[tip[0]-10*Math.cos(ang-.55),tip[1]-10*Math.sin(ang-.55)],tip,[tip[0]-10*Math.cos(ang+.55),tip[1]-10*Math.sin(ang+.55)]],3,color);
      }
    });
    disp.ctx.drawImage(ink.c,0,0,w,h);disp.ctx.drawImage(draft.c,0,0,w,h);
    paths.forEach((pts,i)=>{
      const [x,y]=pts[0],active=i===current;
      const shared=paths.slice(0,i).filter(p=>Math.hypot(p[0][0]-x,p[0][1]-y)<15).length;
      const labelX=x+shared*25;
      disp.ctx.fillStyle=active?'#225caa':'#dbe3ed';disp.ctx.beginPath();disp.ctx.arc(labelX,y,active&&TRACE_FLIP.includes(ch)?15:11,0,Math.PI*2);disp.ctx.fill();
      disp.ctx.fillStyle=active?'#fff':'#33465c';disp.ctx.font='bold 15px Arial';disp.ctx.textAlign='center';disp.ctx.textBaseline='middle';disp.ctx.fillText(String(i+1),labelX,y);
      if(shared)line(disp.ctx,[[x,y+12],[labelX,y+12]],1,'#788aa0');
    });
    const key=$('#traceHint');if(key)key.textContent='✓'.repeat(Math.min(current,paths.length))+(current<paths.length?' ●'+(current+1):'');
  };
  const hint=()=>{
    if(!disp.c.isConnected)return;
    const p=paths[Math.min(current,paths.length-1)][0];
    const el=document.createElement('span');el.className='trace-start-hint';el.textContent=String(current+1);el.style.left=(p[0]/w*100)+'%';el.style.top=(p[1]/h*100)+'%';$('#cw').append(el);setTimeout(()=>el.remove(),1500);
    const t=L(B(`Start at dot ${current+1}.`,`${current+1}번 점에서 시작해요.`));$('#traceHint').textContent=t;say(t);
  };
  const nearestProgress=(point,pts)=>{
    const lens=pts.slice(1).map((p,i)=>Math.hypot(p[0]-pts[i][0],p[1]-pts[i][1])),total=lens.reduce((a,b)=>a+b,0);let offset=0,best=Infinity,value=0;
    lens.forEach((length,i)=>{const a=pts[i],b=pts[i+1],dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dy)/(length*length||1))),dist=Math.hypot(point[0]-a[0]-t*dx,point[1]-a[1]-t*dy),candidate=(offset+t*length)/(total||1),score=dist+Math.abs(candidate-progress)*tolerance*.5;if(score<best){best=score;value=candidate;}offset+=length;});
    if(maxProgress>.8&&Math.hypot(point[0]-pts.at(-1)[0],point[1]-pts.at(-1)[1])<tolerance*.55)value=1;
    return value;
  };
  const evaluate=()=>{
    const data=ink.ctx.getImageData(0,0,w*ink.dpr,h*ink.dpr).data;let m=0,hit=0,n=0,spill=0;
    for(let i=3;i<data.length;i+=4){const on=maskData[i]>128,painted=data[i]>128;if(on){m++;if(painted)hit++;}if(painted){n++;if(!on)spill++;}}
    return {coverage:hit/(m||1),spill:n?spill/n:0};
  };
  paint();
  bindStroke(disp,'#ef476f',bw,(a,b,begin)=>{
    if(done||current>=paths.length)return;
    if(begin){draft.ctx.clearRect(0,0,w,h);progress=0;maxProgress=0;backwards=0;jumped=false;startOK=Math.hypot(a[0]-paths[current][0][0],a[1]-paths[current][0][1])<=tolerance;if(!startOK){hint();return;}}
    if(!startOK)return;
    if(begin)$('#cw').querySelectorAll('.trace-start-hint').forEach(e=>e.remove());
    const next=nearestProgress(b,paths[current]);
    const pts=paths[current],closed=Math.hypot(pts[0][0]-pts.at(-1)[0],pts[0][1]-pts.at(-1)[1])<tolerance;
    if(closed&&next-progress>.4)jumped=true;backwards+=Math.max(0,progress-next);progress=next;maxProgress=Math.max(maxProgress,next);
    line(draft.ctx,[a,[b[0]+.01,b[1]]],bw,'#ef476f');paint();
  },()=>{
    if(done||current>=paths.length||!startOK)return;
    if(maxProgress<.8||progress<.65||backwards>.35||jumped){draft.ctx.clearRect(0,0,w,h);paint();hint();return;}
    ink.ctx.drawImage(draft.c,0,0,w,h);draft.ctx.clearRect(0,0,w,h);current++;paint();
    const r=evaluate();window.__trace={...r,current,total:paths.length};
    if(current===paths.length){
      if(r.coverage>=.5&&r.spill<.65){
        done=true;if(DIAG.active){DIAG.answer(game,true,null);return;}
        recordFinal('trace',false);addPeach();$('#cheer').textContent=pick(T().right);say(ch,'en-US');disp.c.onpointerdown=null;disp.c.onkeydown=null;$('#tdone').disabled=true;nextButton(()=>game.play());
      }else{$('#traceHint').textContent=L(B('Clear and try again.','지우고 다시 해요.'));}
    }
  });
  // 2026-10-28 sample S3: a child whose strokes were not accepted saw only "Clear" and no way forward.
  // "Done" first points at the next dot; on the second press it moves on without a peach (motor practice, not a knowledge error).
  let doneTries=0;
  $('#tdone').onclick=()=>{
    if(done)return;
    if(++doneTries<2){if(current<paths.length)hint();else{const t=L(B('Clear and try again.','지우고 다시 해요.'));$('#traceHint').textContent=t;say(t);}return;}
    done=true;if(DIAG.active){DIAG.answer(game,false,null);return;}
    if(SESSION.review)reviewSolved();else SESSION.done++;$('#cheer').textContent=L(B('Nice try! Let us trace again next time.','잘했어요! 다음에 또 따라 써 봐요.'));disp.c.onpointerdown=null;disp.c.onkeydown=null;$('#tdone').disabled=true;nextButton(()=>game.play());
  };
  $('#clr').onclick=()=>{if(done)return;current=0;startOK=false;$('#cw').querySelectorAll('.trace-start-hint').forEach(e=>e.remove());ink.ctx.clearRect(0,0,w,h);draft.ctx.clearRect(0,0,w,h);paint();};
  window.__traceTest={ch,w,h,maskData,ink,disp,dpr:mask.dpr,paths,level:lv,current:()=>current,evaluate};
}

// ---------- 4. Free drawing ("Drawing and writing") ----------
const DRAW_PROMPTS = [B('Draw your favorite toy!', '좋아하는 장난감을 그려요!'), B('Draw your family!', '우리 가족을 그려요!'), B('Draw something in the sky!', '하늘에 있는 것을 그려요!'),
  B('Draw your home!', '우리 집을 그려요!'), B('Draw a Georgia peach!', '조지아 복숭아를 그려요!'), B('Draw your best friend!', '가장 친한 친구를 그려요!')];
registerGame({
  id: 'draw', subject: 'write', icon: '🎨', title: B('Draw & Tell', '그리고 말해요'), sub: B('Draw, then tell a story', '그림을 그리고 이야기해요'),
  area: AREA_WRITE('Drawing and writing'),
  play() {
    const base = pick(DRAW_PROMPTS), pr = lvl('draw')===2?B(base.en+' Add a place. Why there?',base.ko+' 배경도 그리고 까닭을 말해요.'):base; if (dup(this, pr.en)) return this.play();
    const [w, h] = canvasSize(), cv = makeCanvas(w, h);
    const colors = ['#1d3557', '#ef476f', '#ff8c42', '#ffd166', '#06d6a0', '#118ab2', '#8338ec', '#8d5524'];
    let color = colors[0], size = 8;
    cv.ctx.fillStyle = '#fff'; cv.ctx.fillRect(0, 0, w, h);
    view().innerHTML = `<div class="prompt">${L(pr)}<button class="say" id="sp" aria-label="${T().listen}">🔊</button></div><div class="canvaswrap" id="cw"></div>
      <div class="palette">${colors.map((c, i) => `<button class="sw ${i === 0 ? 'sel' : ''}" data-c="${c}" style="background:${c}" aria-label="${L([B('Navy', '남색'), B('Pink', '분홍색'), B('Orange', '주황색'), B('Yellow', '노란색'), B('Green', '초록색'), B('Blue', '파란색'), B('Purple', '보라색'), B('Brown', '갈색')][i])}"></button>`).join('')}
      <button class="sw sz" data-s="5">·</button><button class="sw sz" data-s="12">●</button><button class="sw sz" data-s="22">⬤</button></div>
      <div><button class="pill" id="clr">${T().clear}</button> <button class="next" id="done">${T().done}</button></div><pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    $('#cw').appendChild(cv.c);
    $('#sp').onclick = () => say(L(pr)); say(L(pr));
    $$('.sw[data-c]').forEach(b => b.onclick = () => { color = b.dataset.c; $$('.sw[data-c]').forEach(x => x.classList.remove('sel')); b.classList.add('sel'); });
    $$('.sw.sz').forEach(b => b.onclick = () => { size = +b.dataset.s; });
    bindStroke(cv, color, size, (a, b) => { cv.ctx.strokeStyle = color; cv.ctx.lineWidth = size; cv.ctx.beginPath(); cv.ctx.moveTo(a[0], a[1]); cv.ctx.lineTo(b[0] + 0.01, b[1]); cv.ctx.stroke(); });
    $('#clr').onclick = () => { cv.ctx.fillStyle = '#fff'; cv.ctx.fillRect(0, 0, w, h); };
    $('#done').onclick = () => {
      record('draw', true); addPeach(); $('#done').disabled = true;
      $('#cheer').textContent = T().tellAbout; say(T().tellAbout);
      nextButton(() => this.play(), { auto: false });
    };
  }
});
