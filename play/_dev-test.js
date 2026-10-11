// dev-only helpers (git-ignored): load with  s=document.createElement('script');s.src='_dev-test.js';document.head.appendChild(s)
window.__validate=async(ids,N=60)=>{const probs={},counts={};const rawQuiz=window.quiz,rawTile=window.tileRound;
const bad=(id,msg)=>{(probs[id]=probs[id]||new Set()).add(msg)};
const txt=(h)=>String(h||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const Ls=(x)=>{try{return x==null?'':(typeof x==='string'?x:(x.en||'')+' '+(x.ko||''))}catch(e){return 'ERR'}};
window.quiz=(game,item)=>{try{if(!item.ask||!(item.ask.en||typeof item.ask==='string')){bad(game.id,'ask-missing')}
const all=[Ls(item.ask),Ls(item.askSay),Ls(item.after),item.show||'',...item.opts.map(o=>(o.html||'')+' '+Ls(o.label))].join(' ');const m=all.match(/undefined|NaN|\[object|\bnull\b|Infinity|-\d+ (tens|ones)/);if(m)bad(game.id,'bad-token:'+m[0]+' :: '+txt(Ls(item.ask)).slice(0,60));
const n=item.opts.length;if(n<2||n>5)bad(game.id,'opt-count '+n);const ok=item.opts.filter(o=>o.ok).length;if(ok!==1)bad(game.id,'ok-count '+ok+' :: '+txt(L(item.ask)).slice(0,60));const keys=item.opts.map(o=>o.html);if(new Set(keys).size!==keys.length)bad(game.id,'dup-opts :: '+txt(L(item.ask)).slice(0,50)+' => '+item.opts.map(o=>txt(o.html)).join('|'));
const dupTxt=item.opts.map(o=>txt(o.html)+'|'+txt(Ls(o.label)));if(item.opts.every(o=>txt(o.html)||txt(Ls(o.label)))&&new Set(dupTxt).size!==dupTxt.length)bad(game.id,'dup-text :: '+txt(L(item.ask)).slice(0,50));
counts[game.id]=(counts[game.id]||0)+1;}catch(e){bad(game.id,'exc '+e.message)}};
window.tileRound=(game,cfg)=>{try{const all=[Ls(cfg.ask),cfg.target.join(' '),Ls(cfg.after)].join(' ');if(/undefined|NaN|\[object|\bnull\b/.test(all))bad(game.id,'tile-bad-token');if(!cfg.target||cfg.target.length<2)bad(game.id,'tile-target');counts[game.id]=(counts[game.id]||0)+1;}catch(e){bad(game.id,'exc '+e.message)}};
for(const id of ids){const g=GAMES.find(x=>x.id===id);if(!g){bad(id,'NOT REGISTERED');continue}
for(const lang of ['en','ko'])for(const lv of [1,2]){S.lang=lang;stat(id).level=lv;for(let i=0;i<N;i++){try{SESSION.id=id;g.play()}catch(e){bad(id,'EXC '+e.message.slice(0,90))}}}}
window.quiz=rawQuiz;window.tileRound=rawTile;S.lang='en';return {counts,probs:Object.fromEntries(Object.entries(probs).map(([k,v])=>[k,[...v].slice(0,6)]))}};
window.__fit=async(ids,reps=6)=>{const sl=(ms)=>new Promise(r=>setTimeout(r,ms));const bad={};for(const id of ids){const g=GAMES.find(x=>x.id===id);for(const lang of ['en','ko'])for(const lv of [1,2]){S.lang=lang;stat(id).level=lv;for(let i=0;i<reps;i++){launch(g);await sl(40);const o=document.documentElement.scrollHeight-innerHeight,w=document.documentElement.scrollWidth-innerWidth;if(o>1||w>1){bad[id]=bad[id]||[];if(bad[id].length<3)bad[id].push(`${lang}${lv}:${o}/${w}`)}
const op=document.querySelectorAll('.opt');if(op[0]){op[0].click();await sl(30);const o2=document.documentElement.scrollHeight-innerHeight;if(o2>1){bad[id]=bad[id]||[];if(bad[id].length<3)bad[id].push(`after${lang}${lv}:${o2}`)}}}}}S.lang='en';return bad};
console.log('dev helpers loaded');
