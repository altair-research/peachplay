// Original schematic pictures and the shared Pre-K activity contract.
(() => {
  'use strict';
  const colors = ['#436cb5', '#cb633e', '#588443', '#8254a5'];
  const names = { ball:B('ball','공'), cup:B('cup','컵'), book:B('book','책'), box:B('box','상자'), flower:B('flower','꽃'), tree:B('tree','나무'), cat:B('cat','고양이'), fish:B('fish','물고기'), hat:B('hat','모자'), sun:B('sun','해'), rain:B('rain','비'), cloud:B('cloud','구름'), water:B('water','물'), towel:B('towel','수건'), soap:B('soap','비누'), leaf:B('leaf','잎'), rock:B('rock','돌'), house:B('house','집'), star:B('star','별'), dog:B('dog','개'), log:B('log','통나무'), frog:B('frog','개구리'), boat:B('boat','배'), goat:B('goat','염소'), mouse:B('mouse','쥐'), bee:B('bee','벌'), key:B('key','열쇠'), chair:B('chair','의자'), apple:B('apple','사과'), bear:B('bear','곰'), duck:B('duck','오리'), sock:B('sock','양말'), clock:B('clock','시계'), moon:B('moon','달') };
  const escape=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function svg(body, label='', w=120, h=100) {
    const bilingual=typeof label==='object';
    return `<svg class="pk-picture" viewBox="0 0 ${w} ${h}" role="img" aria-label="${escape(bilingual?L(label):label)}"${bilingual?` data-pk-en="${escape(label.en)}" data-pk-ko="${escape(label.ko)}"`:''}>${body}</svg>`;
  }
  const face = (mood='happy', c='#edbd8e') => `<circle cx="60" cy="48" r="30" fill="${c}"/><circle cx="49" cy="43" r="3"/><circle cx="71" cy="43" r="3"/><path d="${mood==='sad'?'M47 66q13-17 26 0':mood==='angry'?'M47 61h26':'M47 57q13 18 26 0'}" fill="none" stroke="#30343c" stroke-width="3"/>${mood==='angry'?'<path d="M43 32l14 5m20-5l-14 5" stroke="#30343c" stroke-width="3"/>':''}`;
  function art(k, c=colors[0]) {
    const drawings = {
      ball:`<circle cx="60" cy="50" r="33" fill="${c}"/><path d="M32 34q28 32 56 0M60 18q-25 32 0 64" stroke="white" stroke-width="3" fill="none"/>`,
      cup:`<path d="M30 25h50v48q-25 16-50 0z" fill="${c}"/><path d="M80 33h12q18 25-12 28" stroke="${c}" stroke-width="7" fill="none"/>`,
      book:'<path d="M13 25q24-12 47 0q23-12 47 0v56q-24-12-47 0q-23-12-47 0z" fill="#edc46c" stroke="#684b38" stroke-width="3"/><path d="M60 25v56M24 40h23m-23 12h23m26-12h22m-22 12h22" stroke="#684b38" stroke-width="3"/>',
      box:'<rect x="27" y="24" width="66" height="58" fill="#cd9b65" stroke="#684b38" stroke-width="3"/><path d="M60 24v58m-33-39h66" stroke="#684b38" stroke-width="3"/>',
      flower:'<path d="M60 45v45m0-18q-32-18-23 5m23-14q32-18 23 5" stroke="#468240" stroke-width="5" fill="none"/>'+[0,60,120,180,240,300].map(a=>`<ellipse cx="60" cy="27" rx="11" ry="17" fill="#d87897" transform="rotate(${a} 60 43)"/>`).join('')+'<circle cx="60" cy="43" r="12" fill="#edc46c"/>',
      tree:'<rect x="53" y="54" width="14" height="40" fill="#966639"/><circle cx="42" cy="42" r="24" fill="#548e48"/><circle cx="77" cy="42" r="24" fill="#548e48"/><circle cx="60" cy="25" r="24" fill="#548e48"/>',
      cat:'<path d="M33 35l-5-24 24 17m15 0l24-17-5 24" fill="#d6a168" stroke="#66482d" stroke-width="2"/>'+face()+'<path d="M32 52h-17m17 8l-17 5m73-13h17m-17 8l17 5" stroke="#66482d" stroke-width="2"/>',
      fish:`<ellipse cx="52" cy="50" rx="35" ry="25" fill="${c}"/><path d="M83 50l28-24v48z" fill="${c}"/><circle cx="30" cy="43" r="4"/>`,
      hat:'<path d="M33 60V32q27-20 54 0v28" fill="#8961a7"/><ellipse cx="60" cy="63" rx="49" ry="12" fill="#8961a7"/><path d="M33 51h54" stroke="#edc46c" stroke-width="7"/>',
      sun:'<circle cx="60" cy="50" r="23" fill="#e9b83d"/>'+Array.from({length:8},(_,i)=>`<path d="M60 8v12" transform="rotate(${i*45} 60 50)" stroke="#e9b83d" stroke-width="5"/>`).join(''),
      cloud:'<path d="M23 66a17 17 0 0 1 3-34a25 25 0 0 1 44-8a22 22 0 0 1 27 42z" fill="#a8b4c6"/>',
      water:'<path d="M60 8q-59 66-20 80q60 18 40-35z" fill="#579dcc"/><path d="M45 61q-6 14 8 16" stroke="white" stroke-width="4" fill="none"/>',
      towel:'<rect x="25" y="16" width="70" height="70" rx="5" fill="#edc46c"/><path d="M31 67h58m-58 8h58" stroke="#9a7230" stroke-width="3"/>',
      soap:'<rect x="23" y="32" width="74" height="45" rx="16" fill="#d87897"/><circle cx="34" cy="20" r="7" fill="#b7dce7"/><circle cx="87" cy="20" r="12" fill="#b7dce7"/>',
      leaf:'<path d="M24 80Q12 20 97 12Q108 83 24 80z" fill="#548e48"/><path d="M15 91l69-64m-48 40l-2-22m14 10l26 4" stroke="#325e2c" stroke-width="3"/>',
      rock:'<path d="M13 74l11-39 38-21 40 28 6 35z" fill="#8e949a" stroke="#555c65" stroke-width="3"/>',
      house:'<path d="M20 44l40-32 40 32" fill="#cb633e"/><path d="M28 42h64v49H28z" fill="#edc46c"/><rect x="49" y="58" width="22" height="33" fill="#8254a5"/>',
      star:'<path d="M60 8l14 28 32 5-23 22 5 32-28-15-28 15 5-32-23-22 32-5z" fill="#edc46c"/>',
      key:'<circle cx="35" cy="38" r="20" fill="none" stroke="#b18a35" stroke-width="10"/><path d="M49 53l35 35m-10-10l10-10m-20 0l10-10" stroke="#b18a35" stroke-width="10"/>',
      chair:'<path d="M35 10v55h55V35M35 53h55M35 65v29m55-29v29" stroke="#966639" stroke-width="9" fill="none"/>',
      apple:'<path d="M60 28C6 0 10 90 51 90h18c41 0 45-90-9-62z" fill="#cb633e"/><path d="M60 28V8m1 10q28-22 24 0z" stroke="#548e48" stroke-width="5" fill="#548e48"/>',
      log:'<rect x="21" y="32" width="76" height="47" fill="#966639"/><ellipse cx="21" cy="55" rx="13" ry="24" fill="#c99e6c"/><ellipse cx="97" cy="55" rx="13" ry="24" fill="#c99e6c"/><ellipse cx="97" cy="55" rx="7" ry="15" fill="none" stroke="#966639" stroke-width="2"/>',
      boat:'<path d="M12 68h96l-22 24H34z" fill="#966639"/><path d="M60 7v61m-3-57L24 60h33m6-49l27 49H63" stroke="#436cb5" stroke-width="3" fill="#edc46c"/>',
      moon:'<path d="M80 13a39 39 0 1 0 13 67A39 39 0 0 1 80 13z" fill="#edc46c"/>',
      sock:'<path d="M50 10h32v49q1 12-11 18L35 94q-21-8-8-24l23-14z" fill="#8254a5"/><path d="M50 22h32" stroke="#edc46c" stroke-width="8"/>',
      clock:'<circle cx="60" cy="50" r="37" fill="#fff" stroke="#436cb5" stroke-width="6"/><path d="M60 23v27l21 13" stroke="#30343c" stroke-width="5" fill="none"/>',
      bee:'<ellipse cx="62" cy="54" rx="30" ry="20" fill="#edc46c"/><ellipse cx="50" cy="29" rx="17" ry="13" fill="#b7dce7"/><ellipse cx="77" cy="29" rx="17" ry="13" fill="#b7dce7"/><path d="M50 36v36m18-36v36" stroke="#30343c" stroke-width="6"/><circle cx="86" cy="49" r="3"/>',
      duck:'<ellipse cx="60" cy="66" rx="32" ry="20" fill="#edc46c"/><circle cx="78" cy="37" r="20" fill="#edc46c"/><path d="M92 38h20l-20 11z" fill="#cb633e"/><circle cx="82" cy="32" r="3"/>',
      frog:'<ellipse cx="60" cy="56" rx="35" ry="26" fill="#548e48"/><circle cx="38" cy="29" r="14" fill="#548e48"/><circle cx="82" cy="29" r="14" fill="#548e48"/><circle cx="38" cy="29" r="5"/><circle cx="82" cy="29" r="5"/><path d="M40 58q20 19 40 0" fill="none" stroke="#30343c" stroke-width="3"/>',
      dog:'<ellipse cx="31" cy="38" rx="14" ry="28" fill="#966639"/><ellipse cx="89" cy="38" rx="14" ry="28" fill="#966639"/>'+face()+'<ellipse cx="60" cy="52" rx="7" ry="5" fill="#30343c"/>',
      bear:'<circle cx="33" cy="23" r="15" fill="#966639"/><circle cx="87" cy="23" r="15" fill="#966639"/>'+face('happy','#b78858'),
      mouse:'<circle cx="29" cy="23" r="19" fill="#a8b4c6"/><circle cx="91" cy="23" r="19" fill="#a8b4c6"/>'+face('happy','#a8b4c6')+'<circle cx="60" cy="53" r="5" fill="#d87897"/>',
      goat:'<path d="M34 31l-4-24m56 24l4-24" stroke="#966639" stroke-width="7"/>'+face('happy','#e3dac5')+'<path d="M49 74l11 21 11-21" fill="#e3dac5"/>'
    };
    if(k==='rain') return svg(drawings.cloud+'<path d="M30 75l-7 16m30-16l-7 16m30-16l-7 16m30-16l-7 16" stroke="#436cb5" stroke-width="4"/>',names.rain);
    if(!drawings[k]) throw new Error('Unknown Pre-K picture: '+k);
    return svg(drawings[k],names[k]);
  }
  function shape(k, size=30, rotation=0, c=colors[0]) {
    const b=k===0?`<circle cx="60" cy="50" r="${size}"/>`:k===1?`<path d="M60 ${50-size}L${60+size} ${50+size}H${60-size}z"/>`:`<rect x="${60-size}" y="${50-size}" width="${size*2}" height="${size*2}"/>`;
    return svg(`<g fill="${c}" transform="rotate(${rotation} 60 50)">${b}</g>`,[B('circle','동그라미'),B('triangle','세모'),B('square','네모')][k]);
  }
  function group(n, kind='ball', arrangement=0) { return `<div class="pk-group pk-arr${arrangement}">${Array.from({length:n},()=>art(kind)).join('')}</div>`; }
  function scene(parts) { return `<div class="pk-scene">${parts.join('<svg class="pk-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12h18m-7-7l7 7-7 7" stroke="currentColor" stroke-width="3" fill="none"/></svg>')}</div>`; }
  function position(where, kind='ball') {
    const coords={inside:[60,59],outside:[110,59],above:[60,15],below:[60,92]}, [x,y]=coords[where];
    return svg(`<rect x="30" y="35" width="60" height="43" rx="3" fill="none" stroke="#966639" stroke-width="4"/><svg x="${x-13}" y="${y-11}" width="26" height="22" viewBox="0 0 120 100">${art(kind).replace(/^.*?<svg[^>]*>|<\/svg>$/g,'')}</svg>`,B(`${names[kind].en} ${where} the box`,`${names[kind].ko} 그림이 상자 ${ {inside:'안',outside:'밖',above:'위',below:'아래'}[where]}에 있어요`),140,110);
  }
  const poses={wave:[36,36,84,71],stretch:[32,48,88,48],up:[43,23,77,23],down:[42,76,78,76],wide:[20,61,100,61],shoulders:[43,53,77,53],lap:[45,75,75,75],clap:[56,54,64,54],heart:[54,63,66,63],head:[47,28,73,28],oneUp:[40,28,82,75],oneOut:[26,61,76,71]};
  function person(mood='happy', tone=0, pose='wave') {
    const skin=['#f0c39c','#bb815f','#81543e'][tone%3];
    const [x1,y1,x2,y2]=poses[pose]||poses.wave;
    return svg(`<g transform="translate(25 0) scale(.6)">${face(mood,skin)}</g><path d="M60 49v27M60 61L${x1} ${y1}M60 61L${x2} ${y2}M60 76L43 96M60 76L77 96" stroke="${colors[tone%4]}" stroke-width="8" fill="none" stroke-linecap="round"/>`,B(mood+' person, '+pose,'그림 속 사람 · '+{happy:'기쁜 모습',sad:'슬픈 모습',angry:'화난 모습'}[mood]));
  }
  const history=new Map();
  const localize=html=>String(html||'').replace(/<svg\b[^>]*\bdata-pk-en="([^"]*)" data-pk-ko="([^"]*)"[^>]*>/g,(tag,en,ko)=>tag.replace(/aria-label="[^"]*"/,`aria-label="${S.lang==='ko'?ko:en}"`));
  function choose(g, banks) {
    const lv=Math.min(2,Math.max(1,lvl(g.id))), bank=banks[lv-1], key=g.id+':'+lv;
    const recent=history.get(key)||[], available=bank.map((it,i)=>[it,i]).filter(([,i])=>!recent.includes(i)), [item,index]=pick(available);
    history.set(key,[...recent,index].slice(-4)); return {...item,show:localize(item.show),opts:item.opts.map(o=>({...o,html:localize(o.html)}))};
  }
  function register(id, subject, title, ko, code, banks, config={}) {
    banks=banks.map(b=>[...new Map(b.map(it=>[JSON.stringify(it),it])).values()]);
    if(banks.some(b=>b.length<12)) throw new Error(id+' needs 12 distinct tasks per level');
    registerGame({id,grade:'P',rounds:5,subject,icon:{math:'🧩',read:'🔊',write:'🎨',sci:'🌱',ss:'🏡',life:'🌈'}[subject],title:B(title,ko),sub:B('Two pictures · play together','그림 두 개 · 함께 놀이해요'),area:B('Pre-K · '+code,'프리케이 · '+code),pkBanks:banks,pkOpen:!!config.open,
      play(){ const item=choose(this,banks); if(config.open) return open(this,item); quiz(this,{...item,pk:true,cls:'pk-options'}); }
    });
  }
  function task(en,ko,show,yes,no,extra={}) { return {ask:B(en,ko),show,opts:[{html:yes,ok:true,say:extra.pkChoices?.[0]},{html:no,ok:false,say:extra.pkChoices?.[1]}],...extra}; }
  function recordPlay(id) {
    const date=today(), h=((S.hist=S.hist||{})[date]=S.hist[date]||{r:0,w:0,g:{}});
    // Presence in the existing per-game history records participation, with no right/wrong increment.
    h.g[id]=h.g[id]||[0,0]; save();
  }
  function playRecordHtml() {
    const dates=Object.keys(S.hist||{}).sort().reverse().slice(0,14);
    return `<ul>${dates.flatMap(date=>Object.keys(S.hist[date].g||{}).filter(id=>gameById(id)?.grade==='P').map(id=>`<li>${date} · ${L(gameById(id).title)}</li>`)).join('')}</ul>`;
  }
  function open(g,item) {
    const two=lvl(g.id)===2 && g.id==='stampP'; let taps=0, busy=false;
    view().innerHTML=`<div class="prompt pk-prompt"><button class="say" id="sp" aria-label="${T().listen}">🔊</button></div><div class="pk-adult">${L(I18N[S.lang].prekTogether)}</div><div class="show">${item.show||''}</div><div class="opts pk-options">${item.opts.map((o,i)=>`<button class="opt" data-i="${i}">${o.html}</button>`).join('')}</div><div class="pk-canvas" id="pkCanvas"></div><div class="cheer" id="cheer" role="status"></div><button class="link" id="pkSkip">${L(B('Skip this activity','이 놀이 건너뛰기'))}</button>`;
    $$('[data-pk-en]').forEach(e=>e.setAttribute('aria-label',e.getAttribute('data-pk-'+S.lang)));
    const ask=()=>say(L(item.ask)); $('#sp').onclick=ask; ask();
    const complete=()=>{if(busy)return; busy=true; SESSION.done++; recordPlay(g.id); addPeach(); $('#cheer').textContent=L(B('Thanks for playing together!','함께 놀이했어요!')); $$('.opt').forEach(b=>b.disabled=true); nextButton(()=>g.play(),{auto:false});};
    $$('.opt').forEach(b=>b.onclick=()=>{ if(busy)return; $('#pkCanvas').insertAdjacentHTML('beforeend',item.opts[+b.dataset.i].html); if(++taps >= (two?2:1))complete(); });
    $('#pkSkip').onclick=complete;
  }
  window.PK={svg,art,shape,group,scene,position,person,face,names,colors,register,task,recordPlay,playRecordHtml};
  window.prekGrownups=function() {
    view().innerHTML=`<h1>${T().grownups} · ${L(PT.gP)}</h1><p>${T().prekTogether}</p><p>${T().prekPolicy}</p><div class="menu">${visibleGames().map(g=>`<button class="pill" data-pklv="${g.id}">${L(g.title)} · ${stat(g.id).level===2?2:1}</button>`).join('')}</div><button class="pill" id="gprint">🖨️ ${L(B('Play record','놀이 기록'))}</button><button class="pill" id="gcert">🏅 ${L(B('Celebration','칭찬 수료증'))}</button><button class="pill" id="gkids">${L(PT.kids)}</button>${backupHtml()}<button class="next" id="b">${T().back}</button>`;
    $$('[data-pklv]').forEach(b=>b.onclick=()=>{const st=stat(b.dataset.pklv);st.level=st.level===2?1:2;save();prekGrownups();});
    $('#gprint').onclick=()=>window.openPrintReport(); $('#gcert').onclick=()=>window.openPrintReport('certificate'); $('#gkids').onclick=profilesScreen; backupBind(); $('#b').onclick=home;
  };
})();
