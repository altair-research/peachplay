'use strict';
// Decorative shell artwork only; educational game pictures are never traversed.
const SHELL_PATHS = {
 home:'M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10',
 clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0M12 6v6l4 2',
 math:'M7 3v8M3 7h8M15 7h6M4 16l6 6M10 16l-6 6M15 16h6M15 21h6',
 read:'M3 4q5-1 9 2v15q-4-3-9-2zM21 4q-5-1-9 2v15q4-3 9-2z',
 write:'m15 3 6 6L9 21H3v-6zM12 6l6 6',
 ss:'M5 22V3h14l-3 5 3 5H5',
 sci:'M4 21C3 10 11 3 21 3c0 10-7 18-17 18Zm0 0L15 10',
 life:'M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 brain:'M3 3h8v4a2 2 0 1 0 4 0V3h6v8h-4a2 2 0 1 0 0 4h4v6H3z',
 play:'m9 5 10 7-10 7z',
 star:'m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',
 chart:'M4 3v18h18M8 17v-5M13 17V8M18 17V4',
 settings:'M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6',
 help:'M9 8a3 3 0 1 1 5 2c-2 1-2 2-2 4M12 18h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
 sound:'M3 9h4l6-5v16l-6-5H3zM17 8q5 4 0 8',
 people:'M9 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M1 21v-4a5 5 0 0 1 10 0v4M20 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M13 21v-4a5 5 0 0 1 10 0v4',
 repeat:'M3 10a9 9 0 0 1 16-5l2 3M21 2v6h-6M21 14a9 9 0 0 1-16 5l-2-3M3 22v-6h6'
};
function shellIcon(name) {
 const key=({school:'read',think:'brain',create:'write',gifted:'brain'})[name]||name;
 return `<svg class="shell-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${SHELL_PATHS[key]||SHELL_PATHS.read}"/></svg>`;
}
function refreshShellUI() {
 const v=view(), grown=document.body.classList.contains('grown');
 // Whitelisted navigation only; a game's emoji is its content.
 const icons={surprise:'play',primarySurprise:'play',stickers:'star',reviewStart:'repeat',adapt:'brain',dict:'read',settings:'settings',parent:'people',homeProg:'chart',homeFaq:'help',helloSay:'sound',homeBtn:'home',today15:'clock',navProg:'chart',navFaq:'help'};
 for(const [id,key] of Object.entries(icons)){
  const el=document.getElementById(id);if(!el||el.querySelector('.shell-icon'))continue;
  const gi=el.querySelector('.gi');
  if(gi)gi.innerHTML=shellIcon(key);
  else {const t=[...el.childNodes].find(n=>n.nodeType===3&&/\p{Extended_Pictographic}/u.test(n.textContent));if(t){t.textContent=t.textContent.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'');el.insertAdjacentHTML('afterbegin',shellIcon(key));}}

 }
 for(const el of v.querySelectorAll('.home-say'))if(!el.querySelector('.shell-icon'))el.innerHTML=shellIcon('sound');
 if(!grown)return;
 let bar=v.querySelector('.grown-meta');
 if(!bar){
  bar=document.createElement('div');bar.className='grown-meta';
  v.prepend(bar);
 }
 {
  const period=v.querySelector('#weekly,.tiles,.hchart') ? L(PT.week) : new Intl.DateTimeFormat(S.lang === 'ko' ? 'ko-KR' : 'en-US').format(new Date());
  const label=`${curKid().name || L(B('Me', '나'))} · ${gradeLabel(kidGrade())} · ${period}`;
  if(bar.textContent!==label)bar.textContent=label;
 }
 // Strip decorative pictographs from report text, preserving numbers, labels, IDs and controls.
 const walker=document.createTreeWalker(v,NodeFilter.SHOW_TEXT);const nodes=[];
 while(walker.nextNode())if(!walker.currentNode.parentElement.closest('svg,script,style,textarea,select,input,.avatar,.av,.kav,.kn,.grown-meta'))nodes.push(walker.currentNode);
 for(const n of nodes){const clean=n.textContent.replace(/[\p{Extended_Pictographic}\uFE0F\u200D\u20E3]/gu,'');if(clean!==n.textContent)n.textContent=clean;}
}
// Subscreens (school results, worksheet, report filters) retain the parent scope.
// Observe child replacements, never values, and disconnect while decorating.
const SHELL_OBSERVER=new MutationObserver(()=>{SHELL_OBSERVER.disconnect();refreshShellUI();observeShell();});
function observeShell(){SHELL_OBSERVER.observe(view(),{childList:true,subtree:true});}
observeShell();
