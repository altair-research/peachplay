'use strict';
(() => {
  'use strict';
  // 11-20 (i-Ready K practice, parent: many rounds without repeats): 45 compound words (was 12) plus 20 two-part words to
  // blend (kit + ten). Level 1: join two word sounds or two word parts. Level 2: take away the first OR the last word; the
  // part that was taken away is one of the wrong pictures (the mistake children really make), so the child has to listen.
  // Entry: [first, second, whole, picture]. Words with no picture for a part (raindrop, backpack...) appear in level 1 only.
  const words=[['sun','flower','sunflower','🌻'],['rain','bow','rainbow','🌈'],['snow','man','snowman','☃️'],['tooth','brush','toothbrush','🪥'],['cup','cake','cupcake','🧁'],['foot','ball','football','🏈'],['pop','corn','popcorn','🍿'],['pan','cake','pancake','🥞'],['butter','fly','butterfly','🦋'],['star','fish','starfish','⭐'],['mail','box','mailbox','📫'],['door','bell','doorbell','🔔'],
    ['fire','truck','fire truck','🚒'],['cow','boy','cowboy','🤠'],['sun','glasses','sunglasses','🕶️'],['hot','dog','hot dog','🌭'],['straw','berry','strawberry','🍓'],['water','melon','watermelon','🍉'],['pine','apple','pineapple','🍍'],['sea','shell','seashell','🐚'],['lady','bug','ladybug','🐞'],['sail','boat','sailboat','⛵'],['air','plane','airplane','✈️'],['base','ball','baseball','⚾'],
    ['basket','ball','basketball','🏀'],['wheel','chair','wheelchair','🦽'],['hand','bag','handbag','👜'],['pea','nut','peanut','🥜'],['head','phones','headphones','🎧'],['fire','man','fireman','🧑‍🚒'],['tea','cup','teacup','☕'],['egg','plant','eggplant','🍆'],['note','book','notebook','📓'],['flash','light','flashlight','🔦'],['tool','box','toolbox','🧰'],['key','board','keyboard','⌨️'],
    ['rain','drop','raindrop','💧'],['sun','rise','sunrise','🌅'],['snow','flake','snowflake','❄️'],['foot','print','footprint','👣'],['back','pack','backpack','🎒'],['skate','board','skateboard','🛹'],['fire','works','fireworks','🎆'],['lip','stick','lipstick','💄'],['tea','pot','teapot','🫖']];
  const partPicture={sun:'☀️',flower:'🌼',rain:'🌧️',bow:'🎀',snow:'❄️',man:'👨',tooth:'🦷',brush:'🪥',cup:'🥤',cake:'🎂',foot:'🦶',ball:'⚽',pop:'💥',corn:'🌽',pan:'🍳',butter:'🧈',fly:'🪰',star:'⭐',fish:'🐟',mail:'✉️',box:'📦',door:'🚪',bell:'🔔',
    fire:'🔥',truck:'🚚',cow:'🐄',boy:'👦',glasses:'👓',dog:'🐶',berry:'🫐',water:'💧',melon:'🍈',pine:'🌲',apple:'🍎',sea:'🌊',shell:'🐚',lady:'👩',bug:'🐛',sail:'⛵',boat:'🚤',air:'💨',plane:'🛩️',basket:'🧺',wheel:'🛞',chair:'🪑',hand:'✋',bag:'🛍️',nut:'🌰',phones:'📱',tea:'🍵',egg:'🥚',plant:'🪴',book:'📘',light:'💡',tool:'🔧',key:'🔑'};
  // Two-part words that are not compounds: [part 1, part 2, word, picture, how part 1 is said, how part 2 is said].
  const sylWords=[['kit','ten','kitten','🐈'],['pump','kin','pumpkin','🎃'],['ro','bot','robot','🤖','row'],['ba','by','baby','👶','bay','bee'],['can','dy','candy','🍬','can','dee'],['ta','co','taco','🌮','tah','koe'],['pan','da','panda','🐼','pan','duh'],['rock','et','rocket','🚀','rock','it'],['cook','ie','cookie','🍪','cook','ee'],['cac','tus','cactus','🌵','cack','tuss'],
    ['tur','key','turkey','🦃','ter'],['mon','key','monkey','🐵','mun'],['pen','guin','penguin','🐧','pen','gwin'],['drag','on','dragon','🐉','drag','un'],['bal','loon','balloon','🎈','buh'],['ap','ple','apple','🍎','ap','pull'],['lem','on','lemon','🍋','lem','un'],['car','rot','carrot','🥕','care','ut']];
  const wholePicture=x=>x[2]==='starfish'?'<svg viewBox="0 0 80 80" width="44" height="44" aria-hidden="true"><path d="M40 4 49 29 76 28 55 46 64 74 40 57 16 74 25 46 4 28 31 29Z" fill="#df8c56" stroke="#8c4933" stroke-width="3"/><g fill="#ffdda3"><circle cx="40" cy="38" r="3"/><circle cx="40" cy="22" r="2"/><circle cx="26" cy="35" r="2"/><circle cx="54" cy="35" r="2"/><circle cx="30" cy="55" r="2"/><circle cx="50" cy="55" r="2"/></g></svg>':x[3];
  const emo=p=>`<span class="emo" style="font-size:clamp(28px,5dvh,44px)" aria-hidden="true">${p}</span>`;
  registerGame({id:'compound',grade:'K',subject:'read',icon:'🧁',title:B('Word Sound Partners','낱말 소리 합치기'),sub:B('Join and take apart spoken words','말소리를 합치고 나눠요'),area:B('Reading · Compound words','읽기 · 합성어'),play(){
    const lv=lvl('compound'),wordOpt=(w,p,ok)=>({html:`${emo(p)}<span class="word ow-say" lang="en">${w}</span>`,ok});
    // 11-20 (서연): the parts were written (foot + print) and so were the choices (footprint) — joined by spelling, not by ear.
    const ear=(a,op,b)=>`<div class="cpd-say"><button class="say cpd" data-w="${a}" aria-label="${T().listen}">🔊</button><b aria-hidden="true">${op}</b><button class="say cpd" data-w="${b}" aria-label="${T().listen}">🔊</button></div>`;
    const wire=()=>{$$('.cpd').forEach(b=>b.onclick=()=>say(b.dataset.w,'en-US'));readOpts();};
    const readOpts=()=>{const rb=$('#spo');if(rb)rb.onclick=()=>$$('.opt .word').forEach((e,i)=>say(e.textContent,'en-US',i>0));};
    const show=s=>`<div style="font-size:clamp(22px,4dvh,30px)" lang="en">${s}</div>`;
    if(lv===1){
      if(Math.random()<0.3){
        const t=pick(sylWords),ds=others(sylWords,t,2);
        return quiz(this,{ask:B('Listen and join the two word parts.','듣고 두 낱말 조각을 합쳐요.'),askExtra:{t:`${t[4]||t[0]}. ${t[5]||t[1]}.`,lang:'en-US'},show:ear(t[4]||t[0],'+',t[5]||t[1]),opts:[t,...ds].map((x,i)=>wordOpt(x[2],x[3],i===0)),cls:'words',vocab:t[2],
          onRender:wire,after:B(`${t[0]} + ${t[1]} = ${t[2]}`,`${t[0]} + ${t[1]} = ${t[2]}`)});
      }
      const t=pick(words),ds=others(words.filter(x=>x[3]!==t[3]),t,2);
      return quiz(this,{ask:B('Listen and join the two word sounds.','듣고 두 낱말 소리를 합쳐요.'),askExtra:{t:`${t[0]}. ${t[1]}.`,lang:'en-US'},show:ear(t[0],'+',t[1]),opts:[t,...ds].map((x,i)=>wordOpt(x[2],wholePicture(x),i===0)),cls:'words',vocab:t[2],
        onRender:wire,after:B(`${t[0]} + ${t[1]} = ${t[2]}`,`${t[0]} + ${t[1]} = ${t[2]}`)});
    }
    // Level 2: take away the first word (answer = last part) or the last word (answer = first part).
    const first=Math.random()<0.5,keep=first?1:0,drop=first?0:1;
    const t=pick(words.filter(x=>partPicture[x[keep]]&&!x[2].includes(' '))),right=t[keep];
    const opts=[[right,partPicture[right]]];
    if(partPicture[t[drop]]&&partPicture[t[drop]]!==partPicture[right])opts.push([t[drop],partPicture[t[drop]]]);   // the part taken away
    for(const x of shuffle(words.filter(x=>x!==t&&partPicture[x[keep]]))){
      if(opts.length>=4)break;
      if(!opts.some(o=>o[0]===x[keep]||o[1]===partPicture[x[keep]]))opts.push([x[keep],partPicture[x[keep]]]);
    }
    quiz(this,{ask:first?B('Listen and take away the first word.','듣고 앞 낱말 소리를 빼요.'):B('Listen and take away the last word.','듣고 뒤 낱말 소리를 빼요.'),askExtra:{t:`Say ${t[2]} without ${t[drop]}.`,lang:'en-US'},
      show:ear(t[2],'−',t[drop]),opts:opts.map((o,i)=>wordOpt(o[0],o[1],i===0)),cls:'words',vocab:right,
      onRender:wire,after:B(`${t[2]} − ${t[drop]} = ${right}`,`${t[2]} − ${t[drop]} = ${right}`)});
  }});
  // 11-14 (P-bookway98, user panel 11-13): rebuilt as a picture book. The old page asked in text only and its level 1 arrow
  // pointed at the answer box. Now a page of picture words: the words already read are faded with ✓, 👆 rests on the last one read,
  // and the child taps the picture that comes next. Level 1: one page, 2 lines (the jump to the next line is the key step).
  // Level 2: two facing pages, 2 lines each (page by page: the left page ends before the right page starts). GA ELAGSEKRF1a.
  const BW_WORDS=[['🐶','dog'],['🐱','cat'],['🐟','fish'],['☀️','sun'],['🚗','car'],['🍎','apple'],['🐝','bee'],['🌳','tree'],['🎈','balloon'],['🐸','frog'],['🦆','duck'],['⭐','star'],['🌙','moon'],['🐷','pig'],['🧢','hat'],['🚌','bus']];
  // 11-15 (user panel on v5.00): the last word read (👆) is no longer a choice — it was the brightest thing on the page and the
  // first trap for a child who cannot read. More line ends and page ends per round. Two misses open a smaller step: the same
  // page with the reading order numbered 1, 2, 3…, then back to the question.
  function bwShow(words,k,pages,cols,nums){
    const per=2*cols;
    const cellHtml=i=>`<div class="bw-cell${i<k?' bw-read':i===k?' bw-last':''}">${nums?`<span class="bw-n" aria-hidden="true">${i+1}</span>`:''}<span class="bw-e">${words[i][0]}</span><span class="bw-w">${words[i][1]}</span>${i===k?'<span class="bw-f" aria-hidden="true">👆</span>':''}${i<k?'<span class="bw-ok" aria-hidden="true">✓</span>':''}</div>`;
    const page=p=>`<div class="bw-page" style="--bw-cols:${cols}">${Array.from({length:per},(_,j)=>cellHtml(p*per+j)).join('')}</div>`;
    return `<div class="bw-book${pages>1?' bw-spread':''}${nums?' bw-nums':''}" role="img" aria-label="${L(B(pages>1?'An open book with two pages of picture words':'A book page with two lines of picture words','그림 낱말이 있는 책'+(pages>1?' 두 쪽':' 한 쪽')))}">${Array.from({length:pages},(_,p)=>page(p)).join('')}</div>`;
  }
  registerGame({id:'bookway',grade:'K',subject:'read',icon:'📖',title:B('Follow the Book','책 읽는 방향'),sub:B('English books: start and follow','영어 책의 시작과 순서'),area:B('Reading · Book direction','읽기 · 책 방향'),play(){
    const lv=lvl('bookway'),pages=lv===1?1:2,rows=2,cols=lv===1?3:2,per=rows*cols,n=pages*per;
    const words=shuffle(BW_WORDS.slice()).slice(0,n);
    const cell=i=>({p:Math.floor(i/per),r:Math.floor(i%per/cols),c:i%cols});   // reading order index -> page, line, place
    const at=(p,r,c)=>p<pages&&r<rows&&c<cols&&p>=0&&r>=0&&c>=0?p*per+r*cols+c:-1;
    // last word read: -1 = nothing yet (where do we start?). About half the questions are a line end or a page end.
    const keys=lv===1?[-1,0,1,2,2,2,2,3]:[0,1,1,1,2,3,3,3,3,4,5,5];
    const k=pick(keys),ans=k+1;
    const C=cell(ans),L0=k>=0?cell(k):null,cand=[];
    // Mistakes children really make: start top-right, go down a column, read across the spread, skip ahead.
    if(k<0)cand.push(at(0,0,cols-1),at(0,rows-1,0),n-1);
    else{
      cand.push(at(L0.p,L0.r+1,L0.c));                       // straight down from the last word
      if(L0.c===cols-1&&L0.p+1<pages)cand.push(at(L0.p+1,L0.r,0)); // across the spine on the same line
      if(L0.c===cols-1)cand.push(at(L0.p,L0.r+1,cols-1));    // next line, but the right end
      if(C.r===rows-1&&C.c===0&&C.p+1<pages)cand.push(at(C.p+1,0,0));
      cand.push(ans+1);
    }
    // Choices are words not read yet; only near the end of the book, a faded word already read fills in. Never the 👆 word.
    const want=lv===1?3:4,opts=[ans],all=[...cand,...shuffle(Array.from({length:n},(_,i)=>i))];
    for(const ok of [x=>x>k&&x<n,x=>x>=0&&x<k])for(const x of all)if(ok(x)&&!opts.includes(x)&&opts.length<want)opts.push(x);
    const ask=k<0?B('Where do we start reading?','어디부터 읽을까요?'):B('We read up to 👆. What comes next?','👆까지 읽었어요. 다음은?');
    const after=pages>1&&C.p===1&&C.r===0&&C.c===0&&k>=0?B('Finish the left page, then go to the right page.','왼쪽 쪽을 다 읽고 오른쪽 쪽으로 가요.'):C.c===0&&C.r>0?B('At the end of a line, go down to the start of the next line.','줄 끝에서는 다음 줄 처음으로 내려가요.'):B('In an English book, read left to right, top to bottom.','영어 책은 왼쪽에서 오른쪽, 위에서 아래로 읽어요.');
    const choice=i=>({html:`<span class="emo">${words[i][0]}</span>`,label:words[i][1],ok:i===ans});
    quiz(this,{ask,show:bwShow(words,k,pages,cols,false),demoShow:bwShow(words,ans,pages,cols,false),cls:'shapes',opts:opts.map(choice),after,sd:{words,k,pages,cols,opts:opts.map(choice)}});
  },
  stepDown(item){
    const d=item.sd; if(!d)return null;
    return {ask:B('Follow the numbers 1, 2, 3… Which picture is next?','번호 1, 2, 3…을 따라가요. 다음 그림은?'),show:bwShow(d.words,d.k,d.pages,d.cols,true),cls:'shapes',opts:d.opts};
  }});
})();
// Reading extension: read & match, sight words, syllables, letter memory.
// Uses CVC / BIGGER word lists from games-write.js.

/// ---------- Read and match (decode a word, pick the picture) ----------
// 11-20 (i-Ready K practice, parent: many rounds without repeats): more words and a second kind of question.
// Kind 1: read the word, pick its picture. Kind 2: look at the picture, pick its written word (no 🔉 for the words: reading is the goal).
// Level 1: short-vowel CVC words, wrong choices are other CVC words. Level 2: + blends, digraphs and silent-e words, and the wrong
// choices are look-alike words (one letter changed, same start or same end: cat/hat/cap), so every letter has to be read.
const RM_CVC = [['map', '🗺️', '지도'], ['nut', '🥜', '견과'], ['hut', '🛖', '오두막'], ['jet', '✈️', '제트기'], ['van', '🚐', '승합차'], ['web', '🕸️', '거미줄'], ['cap', '🧢', '야구 모자'],
  ['bug', '🐛', '벌레'], ['rat', '🐀', '쥐'], ['fan', '🪭', '부채'], ['bag', '👜', '가방'], ['box', '📦', '상자'], ['six', '6️⃣', '여섯'], ['ten', '🔟', '열'], ['pin', '📌', '핀'], ['lip', '👄', '입술'],
  ['leg', '🦵', '다리'], ['pan', '🍳', '프라이팬'], ['can', '🥫', '통조림'], ['tub', '🛁', '욕조'], ['mug', '☕', '머그잔'], ['red', '🔴', '빨강'], ['ram', '🐏', '숫양'], ['dad', '👨', '아빠'],
  ['mom', '👩', '엄마'], ['sad', '😢', '슬픈'], ['mad', '😠', '화난'], ['hug', '🫂', '안아 주기'], ['log', '🪵', '통나무'], ['gas', '⛽', '기름']].map(x => [x[0], x[1], B(x[0], x[2])]);
const RM_BIG = [['crab', '🦀', '게'], ['drum', '🥁', '북'], ['flag', '🚩', '깃발'], ['sled', '🛷', '썰매'], ['sock', '🧦', '양말'], ['ring', '💍', '반지'], ['king', '🤴', '왕'], ['hand', '✋', '손'],
  ['tent', '⛺', '텐트'], ['truck', '🚚', '트럭'], ['chick', '🐤', '병아리'], ['shell', '🐚', '조개껍데기'], ['bell', '🔔', '종'], ['kite', '🪁', '연'], ['bone', '🦴', '뼈'], ['goat', '🐐', '염소'],
  ['seal', '🦭', '물개'], ['leaf', '🍃', '잎'], ['train', '🚆', '기차'], ['snake', '🐍', '뱀'], ['nose', '👃', '코'], ['bike', '🚲', '자전거'], ['five', '5️⃣', '다섯'], ['nine', '9️⃣', '아홉'],
  ['whale', '🐳', '고래'], ['sheep', '🐑', '양'], ['bee', '🐝', '벌'], ['corn', '🌽', '옥수수'], ['fork', '🍴', '포크'], ['shark', '🦈', '상어'], ['car', '🚗', '자동차'], ['clock', '⏰', '시계'], ['rock', '🪨', '돌']].map(x => [x[0], x[1], B(x[0], x[2])]);
// A picture the target word could also name is never a wrong choice (a cap is a hat, a chick is a bird, a flag is red).
const RM_CLASH = [['hat', 'cap'], ['cup', 'mug'], ['bus', 'van'], ['bird', 'chick'], ['fish', 'shark'], ['fish', 'whale'], ['red', 'flag'], ['ram', 'sheep'], ['dog', 'dad']];
const rmClash = (a, b) => RM_CLASH.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const rmLike = (a, b) => {   // look-alike score: same letters in the same places, same start, same end
  let s = 0; for (let i = 0; i < Math.min(a.length, b.length); i++) if (a[i] === b[i]) s++;
  if (a.length === b.length) s++; if (a.slice(-2) === b.slice(-2)) s++; if (a[0] === b[0]) s++;
  return s;
};
// 11-22 (IXL K skill types, user decision 2026-11-22): missing short vowel. A picture, the word with its vowel blank (c ? t)
// and 🔊 (said once after the question); choose a, e, i, o or u. The vowel letters are not read aloud (that would be the answer).
// Level 1: CVC words; the wrong vowels sound far from the right one (cat: i, u). Level 2: + blends and digraphs (fr?g, sh?p)
// and the wrong vowels are the ones a child really mixes up: they make another real word (hat → hut, hot) or sound close
// (e/i, a/e, o/u). In Georgia e and i before n/m sound alike (pen/pin), so they are never each other's wrong choice there.
// [word, picture, Korean]
const RM_V1 = [['cat', '🐱', '고양이'], ['hat', '🎩', '모자'], ['bat', '🦇', '박쥐'], ['map', '🗺️', '지도'], ['van', '🚐', '승합차'], ['cap', '🧢', '야구 모자'], ['rat', '🐀', '쥐'],
  ['fan', '🪭', '부채'], ['bag', '👜', '가방'], ['pan', '🍳', '프라이팬'], ['can', '🥫', '통조림'], ['cab', '🚕', '택시'],
  ['bed', '🛏️', '침대'], ['hen', '🐔', '암탉'], ['pen', '🖊️', '펜'], ['web', '🕸️', '거미줄'], ['ten', '🔟', '열'], ['leg', '🦵', '다리'], ['gem', '💎', '보석'], ['net', '🥅', '그물'], ['jet', '✈️', '제트기'],
  ['pig', '🐷', '돼지'], ['six', '6️⃣', '여섯'], ['pin', '📌', '핀'], ['bin', '🗑️', '쓰레기통'], ['kid', '🧒', '아이'], ['lip', '👄', '입술'],
  ['dog', '🐶', '강아지'], ['fox', '🦊', '여우'], ['box', '📦', '상자'], ['log', '🪵', '통나무'], ['pot', '🍲', '냄비'], ['ox', '🐂', '황소'],
  ['sun', '☀️', '해'], ['bus', '🚌', '버스'], ['cup', '🥤', '컵'], ['nut', '🥜', '견과'], ['hut', '🛖', '오두막'], ['bug', '🐛', '벌레'], ['tub', '🛁', '욕조'], ['mug', '☕', '머그잔']];
const RM_V2 = [['frog', '🐸', '개구리'], ['fish', '🐟', '물고기'], ['duck', '🦆', '오리'], ['milk', '🥛', '우유'], ['ship', '🚢', '배'], ['crab', '🦀', '게'], ['drum', '🥁', '북'],
  ['flag', '🚩', '깃발'], ['sled', '🛷', '썰매'], ['sock', '🧦', '양말'], ['ring', '💍', '반지'], ['king', '🤴', '왕'], ['hand', '✋', '손'], ['tent', '⛺', '텐트'], ['truck', '🚚', '트럭'],
  ['chick', '🐤', '병아리'], ['shell', '🐚', '조개껍데기'], ['bell', '🔔', '종'], ['clock', '⏰', '시계'], ['rock', '🪨', '돌'], ['lock', '🔒', '자물쇠'], ['gift', '🎁', '선물'],
  ['dish', '🍽️', '접시'], ['brick', '🧱', '벽돌'], ['thumb', '👍', '엄지'], ['plug', '🔌', '플러그'], ['skunk', '🦨', '스컹크'], ['ant', '🐜', '개미'], ['egg', '🥚', '달걀']];
// Real words a K child may know: a wrong vowel that makes one of these is the look-alike / sound-alike mistake.
const RM_REAL = new Set(('bat bet bit but cat cot cut hat hit hot hut pan pen pin pun pit pot pet pat bag beg big bog bug bad bed bid bud cap cop cup map mop ' +
  'ten tan tin ton bin ban bun fan fin fun van net nut not sun sin son six sax can pig peg dog dig dug log leg lag lug rat rot rut fox fix mug jet hen web ' +
  'gem gum lip lap kid cab cub tub tab pod pad ox ax ship shop chip chop chick check duck deck dock sock sack suck lock lick luck rock rack ring rang rung ' +
  'king hand tent drum flag clock click shell bell ball bill dish fish frog milk crab crib sled slid gift nest brick thumb plug skunk egg ant').split(' '));
const RM_CLOSE = { a: 'e', e: 'ia', i: 'e', o: 'ua', u: 'o' }, RM_VOW = 'aeiou';
function rmVowel(game, lv) {
  const [w, e, ko] = pick(lv === 1 ? RM_V1 : [...RM_V1, ...RM_V2]), vi = w.search(/[aeiou]/), v = w[vi];
  const merge = c => /[nm]/.test(w[vi + 1] || '') && 'ei'.includes(v) && 'ei'.includes(c);   // pen/pin in Georgia speech
  const rest = RM_VOW.split('').filter(c => c !== v && !merge(c));
  const ds = lv === 1
    ? shuffle(rest.filter(c => !RM_CLOSE[v].includes(c))).slice(0, 2)
    : [...shuffle(rest.filter(c => RM_REAL.has(w.slice(0, vi) + c + w.slice(vi + 1)))), ...shuffle(rest.filter(c => RM_CLOSE[v].includes(c))), ...shuffle(rest)]
      .filter((c, i, a) => a.indexOf(c) === i).slice(0, 2);
  const box = '<span style="display:inline-flex;align-items:center;justify-content:center;width:.9em;height:1.1em;margin:0 .08em;border:3px dashed #e0855a;border-radius:8px;color:#e0855a;vertical-align:middle">?</span>';
  return quiz(game, {
    ask: B('Listen. Which letter goes in the box?', '듣고 빈칸에 들어갈 글자를 골라요.'),
    show: `<div class="bigword"><span class="emo">${e}</span> <span lang="en" style="letter-spacing:.06em;white-space:nowrap">${w.slice(0, vi)}${box}${w.slice(vi + 1)}</span> <button class="say" id="hear" aria-label="${T().listen}">🔊</button></div>`,
    opts: [v, ...ds].map(c => ({ html: `<span class="num" lang="en">${c}</span>`, ok: c === v })), cls: 'shapes', readGoal: 'opts',
    after: B(`${w}!`, `${w} — ${ko}!`), vocab: w,
    onRender() { $('#hear').onclick = () => say(w, 'en-US'); say(w, 'en-US', true); }
  });
}
registerGame({
  id: 'readmatch', subject: 'read', icon: '👀', title: B('Read & Match', '읽고 짝 맞추기'), sub: B('Read the word, find the picture', '단어를 읽고 그림 찾기'),
  area: AREA_READ('Decoding'),
  play() {
    if (rnd(3) === 0) return rmVowel(this, lvl('readmatch'));
    const lv = lvl('readmatch'), pool = lv === 1 ? [...CVC, ...RM_CVC] : [...CVC, ...RM_CVC, ...BIGGER, ...RM_BIG], t = pick(pool);
    const fair = pool.filter(w => w[0] !== t[0] && w[1] !== t[1] && !rmClash(w[0], t[0]));
    const ds = lv === 1 ? others(fair, null, 2) : shuffle(fair).sort((a, b) => rmLike(b[0], t[0]) - rmLike(a[0], t[0])).slice(0, 5).sort(() => Math.random() - 0.5).slice(0, 2);
    if (Math.random() < 0.5) {
      // Picture -> word. The picture has no name tag (that would be the answer).
      return quiz(this, {
        ask: B('Look at the picture. Which word is it?', '그림을 보고 맞는 낱말을 골라요.'),
        show: `<div class="bigword"><span class="emo">${t[1]}</span></div>`,
        opts: [t, ...ds].map(w => ({ html: `<span class="num" lang="en">${w[0]}</span>`, ok: w === t })), cls: 'shapes', readGoal: 'opts',
        after: B(`${t[0]}!`, `${t[0]} — ${t[2].ko}!`), vocab: t[0]
      });
    }
    const o = (w) => ({ html: `<span class="emo">${w[1]}</span>`, ok: w === t });
    quiz(this, {
      ask: B('Read the word: which picture matches?', '단어를 읽고 어느 그림인지 골라요.'),
      show: `<div class="bigword">${t[0]} <button class="say" id="hear" aria-label="${T().listen}">🔊</button></div>`,
      opts: [o(t), ...ds.map(o)], cls: 'shapes', after: B(`${t[0]}!`, `${t[0]} — ${t[2].ko}!`), vocab: t[0],
      onRender() { $('#hear').onclick = () => say(t[0], 'en-US'); }
    });
  }
});

// ---------- Sight words (school list + UFLI-style heart words, docs/worksheets/ufli-foundations.md) ----------
// Sound boxes per word: '|' separates sounds, '*' marks a heart part (spelled in a way a K child cannot sound out yet).
// No '*' = the whole word can be sounded out (shown as "Sound it out").
// AI decision: s=/z/ (is, as, his) and 'and' count as sound-it-out, so the same letter is never a heart in one word and plain in another.
const SIGHT_PARTS = {
  a: 'a*', no: 'n|o*', go: 'g|o*', to: 't|o*', am: 'a|m', I: 'I*', of: 'o*|f*', an: 'a|n', into: 'i|n|t|o*', said: 's|ai*|d', and: 'a|n|d', is: 'i|s', so: 's|o*', do: 'd|o*', my: 'm|y*', the: 'th|e*',
  his: 'h|i|s', that: 'th|a|t', was: 'w|a*|s', are: 'are*', her: 'h|er*', see: 's|ee*', you: 'y|ou*', as: 'a|s', or: 'or*', she: 'sh|e*', your: 'y|our*', he: 'h|e*', me: 'm|e*', with: 'w|i|th', for: 'f|or*', not: 'n|o|t', this: 'th|i|s'
};
const SIGHT1 = ['a', 'no', 'go', 'to', 'am', 'I', 'of', 'an', 'into', 'said', 'and', 'is', 'so', 'do', 'my', 'the'];
const SIGHT2 = ['his', 'that', 'was', 'are', 'her', 'see', 'you', 'as', 'or', 'she', 'your', 'he', 'me', 'with', 'for', 'not', 'this'];
window.SCHOOL_SIGHT = Object.freeze({ L1: Object.freeze(SIGHT1.slice()), L2: Object.freeze(SIGHT2.slice()) });
window.SIGHT_PARTS = SIGHT_PARTS;
// Look-alike words (O1): same length class, shared letters, reversals (no/on, was/saw). No homophones of the target (see/sea, to/two, for/four).
const SIGHT_LOOK = {
  a: ['an', 'am', 'as'], no: ['on', 'so', 'go'], go: ['so', 'no', 'do'], to: ['do', 'so', 'go'], am: ['an', 'as', 'me'], I: ['a', 'it', 'is'], of: ['or', 'on', 'if'], an: ['am', 'as', 'and'],
  into: ['onto', 'in', 'and'], said: ['sad', 'sand', 'sail'], and: ['end', 'an', 'had'], is: ['as', 'his', 'it'], so: ['no', 'go', 'to'], do: ['to', 'no', 'go'], my: ['me', 'by', 'may'], the: ['he', 'then', 'she'],
  his: ['is', 'has', 'her'], that: ['this', 'than', 'hat'], was: ['saw', 'as', 'has'], are: ['ear', 'ate', 'or'], her: ['he', 'here', 'his'], see: ['she', 'bee', 'so'], you: ['your', 'yes', 'our'], as: ['is', 'an', 'has'],
  or: ['on', 'of', 'for'], she: ['he', 'see', 'the'], your: ['you', 'our', 'four'], he: ['she', 'her', 'the'], me: ['my', 'he', 'we'], with: ['will', 'this', 'wish'], for: ['of', 'or', 'from'], not: ['no', 'net', 'nut'], this: ['that', 'his', 'thin']
};
// Extra letter tiles for writing: letters a child really swaps in (said→sed, was→wuz, b/d, th→t).
const SIGHT_EXTRA = {
  no: ['u', 'm'], go: ['q', 'u'], to: ['d', 'u'], am: ['n', 'e'], of: ['v', 'u'], an: ['m', 'e'], into: ['e', 'u'], said: ['e', 'y'], and: ['e', 'b'], is: ['z', 'e'], so: ['c', 'u'], do: ['b', 'u'], my: ['i', 'n'], the: ['a', 'u'],
  his: ['z', 'e'], that: ['e', 'd'], was: ['u', 'z'], are: ['o', 'u'], her: ['u', 'i'], see: ['a', 'c'], you: ['w', 'e'], as: ['z', 'e'], or: ['a', 'u'], she: ['c', 'i'], your: ['e', 'a'], he: ['i', 'a'], me: ['n', 'i'], with: ['e', 'v'], for: ['v', 'u'], not: ['u', 'm'], this: ['e', 'z']
};
const sightParts = w => SIGHT_PARTS[w].split('|').map(p => ({ g: p.replace('*', ''), heart: p.endsWith('*') }));
// Sound boxes under the word; heart parts are red with ❤️, plain sounds blue. Boxes light up one by one.
function sightMap(w) {
  const parts = sightParts(w), hearts = parts.some(p => p.heart);
  // 11-12 (user: "two squares and a heart pop up — what do they mean?"): say what the colors mean, and draw the boxes as flat
  // color bars under the letters so they never look like buttons to press.
  const note = hearts ? B('👄 Blue: sound it out · ❤️ red: remember by heart', '👄 파란 칸은 소리로 읽어요 · ❤️ 빨간 칸은 외워요') : B('👄 All blue: sound it out!', '👄 모두 파란 칸: 소리로 읽어요!');
  return `<div class="sight-map" lang="en" style="display:flex;flex-direction:column;align-items:center;gap:.3em">
    <div style="display:flex;gap:.25em;align-items:flex-end">${parts.map((p, i) => `<span class="sm-part" data-i="${i}" style="display:inline-flex;flex-direction:column;align-items:center;gap:.15em">
      <span style="font-size:clamp(30px,7dvh,52px);font-weight:700;line-height:1;color:${p.heart ? '#c2334d' : '#24456e'}">${p.g}</span>
      <span class="sm-box" aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;width:100%;min-width:1.2em;height:1.1em;border-radius:3px;font-size:clamp(12px,2.4dvh,18px);pointer-events:none;box-shadow:none;${p.heart ? 'background:#f6b6c1' : 'background:#b9d2f5'}">${p.heart ? '❤️' : '👄'}</span></span>`).join('')}</div>
    <div class="sm-note" style="font-size:clamp(14px,2.6dvh,19px)">${L(note)}</div></div>`;
}
function showSightMap(w, box) {
  if (!box) return;
  box.innerHTML = sightMap(w);
  const hearts = sightParts(w).some(p => p.heart);
  const pickL = o => o[S.lang] || o.en;
  say(pickL(hearts ? B('Sound out the blue part. Remember the red heart part by heart.', '파란 칸은 소리로 읽고, 빨간 하트 칸은 외워요.') : B('Every part is blue. You can sound it out.', '모두 파란 칸이에요. 소리로 읽을 수 있어요.')), undefined, true);
  box.querySelectorAll('.sm-box').forEach((b, i) => { try { b.animate([{ transform: 'scale(.6)', opacity: .3 }, { transform: 'scale(1.15)', opacity: 1 }, { transform: 'scale(1)', opacity: 1 }], { duration: 420, delay: 250 + i * 380, fill: 'backwards' }); } catch (e) {} });
}
// Tile rounds have no onRender/onCorrect hooks: when a sight tile round appears in #view, speak the word, wire 🔊 and show the sound boxes once the word is spelled.
(() => {
  const v = document.getElementById('view'); if (!v || typeof MutationObserver !== 'function') return;
  new MutationObserver(() => {
    const h = v.querySelector('.show [data-sight]'); if (!h || h.dataset.wired) return;
    h.dataset.wired = '1'; const t = h.dataset.sight, slots = v.querySelector('.slots');
    h.onclick = () => sayWord(t);
    sayWord(t, true);   // the word is only heard, never written (Q1)
    const sp = v.querySelector('#sp'); if (sp) { const old = sp.onclick; sp.onclick = () => { if (old) old(); sayWord(t, true); }; }
    if (slots) { const mo = new MutationObserver(() => { if (!slots.isConnected) return mo.disconnect(); if (slots.querySelectorAll('.slot.filled').length === t.length) { mo.disconnect(); showSightMap(t, v.querySelector('.show')); } }); mo.observe(slots, { subtree: true, attributes: true, attributeFilter: ['class'] }); }
  }).observe(v, { childList: true });
})();
// 11-20 (i-Ready K practice, parent: many rounds without repeats): 4 picture sentences per school word (level 1 list).
// The child hears the whole sentence (🔊) and finds the missing word among look-alike words; '_' = the blank. The sentence is
// heard, so the other words need not be read. Wrong choices never already appear in the sentence (to: "I go _ school" never offers go).
// [shown, heard]
const SIGHT_SENT = {
  a: [['I see _ 🐶.', 'I see a dog.'], ['It is _ 🐝.', 'It is a bee.'], ['I have _ 🎈.', 'I have a balloon.'], ['Look at _ 🐸.', 'Look at a frog.']],
  no: [['There is _ 🍪 left.', 'There is no cookie left.'], ['I said _.', 'I said no.'], ['I have _ 🐶.', 'I have no dog.'], ['Oh _, my 🎈!', 'Oh no, my balloon!']],
  go: [['I _ to 🏫.', 'I go to school.'], ['We _ to the 🏖️.', 'We go to the beach.'], ['We _ in the 🚗.', 'We go in the car.'], ['Ready, set, _! 🏁', 'Ready, set, go!']],
  to: [['I go _ 🏫.', 'I go to school.'], ['Give the 🎁 _ Mom.', 'Give the gift to Mom.'], ['We walk _ the 🏠.', 'We walk to the house.'], ['I like _ swim. 🏊', 'I like to swim.']],
  am: [['I _ happy. 😀', 'I am happy.'], ['I _ five. 5️⃣', 'I am five.'], ['I _ hot. 🥵', 'I am hot.'], ['I _ big! 💪', 'I am big!']],
  I: [['_ see a 🐱.', 'I see a cat.'], ['_ like 🍕.', 'I like pizza.'], ['_ can jump. 🦘', 'I can jump.'], ['_ am sleepy. 😴', 'I am sleepy.']],
  of: [['A cup _ 🥛.', 'A cup of milk.'], ['A box _ 🖍️.', 'A box of crayons.'], ['A lot _ 🍎.', 'A lot of apples.'], ['A bag _ 🍪.', 'A bag of cookies.']],
  an: [['I see _ 🐜.', 'I see an ant.'], ['It is _ 🥚.', 'It is an egg.'], ['I ate _ 🍎.', 'I ate an apple.'], ['Look at _ 🐙.', 'Look at an octopus.']],
  into: [['Jump _ the 🛁.', 'Jump into the bath.'], ['Go _ the 🏠.', 'Go into the house.'], ['The 🐸 hops _ the 🌊.', 'The frog hops into the water.'], ['Put it _ the 📦.', 'Put it into the box.']],
  said: [['The 🐶 _, "Woof!"', 'The dog said, "Woof!"'], ['The 🐱 _, "Meow!"', 'The cat said, "Meow!"'], ['The 🐮 _, "Moo!"', 'The cow said, "Moo!"'], ['👩 Mom _, "Hi!"', 'Mom said, "Hi!"']],
  and: [['I like 🍎 _ 🍌.', 'I like apples and bananas.'], ['The 🐶 _ the 🐱 play.', 'The dog and the cat play.'], ['👩 Mom _ I go.', 'Mom and I go.'], ['I see a ☀️ _ a 🌙.', 'I see a sun and a moon.']],
  is: [['It _ a 🐶.', 'It is a dog.'], ['The ☀️ _ hot.', 'The sun is hot.'], ['My 🐱 _ big.', 'My cat is big.'], ['The 🍦 _ cold.', 'The ice cream is cold.']],
  so: [['I am _ happy! 😀', 'I am so happy!'], ['It is _ big! 🐘', 'It is so big!'], ['The 🍦 is _ cold!', 'The ice cream is so cold!'], ['You are _ fast! 🏃', 'You are so fast!']],
  do: [['I can _ it! 💪', 'I can do it!'], ['_ you like 🍕?', 'Do you like pizza?'], ['What _ you see? 👀', 'What do you see?'], ['_ not touch the 🔥!', 'Do not touch the fire!']],
  my: [['This is _ 🐶.', 'This is my dog.'], ['_ 🎒 is red.', 'My bag is red.'], ['Look at _ 🚲.', 'Look at my bike.'], ['I love _ 👩.', 'I love my mom.']],
  the: [['Look at _ 🌙.', 'Look at the moon.'], ['I see _ 🐝.', 'I see the bee.'], ['_ 🐱 is big.', 'The cat is big.'], ['Go to _ 🏠.', 'Go to the house.']]
};
registerGame({
  id: 'sight', subject: 'read', icon: '👁️', title: B('Sight Words', '자주 보는 단어'), sub: B('said, was, the, you...', 'said, was, the, you...'),
  area: AREA_READ('High-frequency words'),
  play() {
    const lv = lvl('sight');
    // L1: middle list, listen and find. L2: late list (+ about 1 in 4 from L1 for review), half find, half write with letter tiles.
    const t = lv === 1 ? pick(SIGHT1) : Math.random() < 0.25 ? pick(SIGHT1) : pick(SIGHT2);
    const write = lv >= 2 && t.length >= 2 && Math.random() < 0.5;
    if (write) {
      // K rounds are generated first and rendered later (adaptive-extra.js), so the wiring lives in the show markup (data-sight) and the #view observer above.
      return tileRound(this, {
        ask: B('Listen. Spell it!', '듣고 그 낱말을 글자로 써요.'),
        show: `<button class="say big-say" id="hear" data-sight="${t}" aria-label="${T().listen}">🔊</button>`, target: t.split(''), extra: SIGHT_EXTRA[t].filter(c => !t.includes(c)), speakTiles: false, oneRow: true, after: B(`${t}!`, `${t}!`), vocab: t
      });
    }
    // Level 1 (and level 1 words in level 2 review): most questions are a heard picture sentence with the word missing.
    if (SIGHT_SENT[t] && Math.random() < (lv === 1 ? 0.75 : 0.5)) {
      const [shown, heard] = pick(SIGHT_SENT[t]);
      const inSentence = shown.toLowerCase().split(/[^a-z]+/);
      const ds2 = shuffle(SIGHT_LOOK[t].filter(w => w !== t && !inSentence.includes(w.toLowerCase()))).slice(0, 2);
      const blank = '<span aria-hidden="true" style="display:inline-block;min-width:2em;border-bottom:3px solid currentColor">&nbsp;</span>';
      return quiz(this, {
        ask: B('Listen. Which word fits?', '듣고 빈칸에 들어갈 낱말을 눌러요.'), askExtra: { t: heard, lang: 'en-US' },
        show: `<div class="bigword sent" lang="en"><span>${shown.replace('_', blank)}</span></div><button class="say" id="hear" aria-label="${T().listen}">🔊</button>`,
        opts: [t, ...ds2].map(w => ({ html: `<span class="num" lang="en">${w}</span>`, ok: w === t })), cls: 'shapes',
        after: B(heard, heard),
        onRender() {
          $('#hear').onclick = () => say(heard, 'en-US');
          if (S.lang === 'en') { say(heard, 'en-US', true); const sp = $('#sp'), old = sp.onclick; sp.onclick = () => { old(); say(heard, 'en-US', true); }; }
        },
        onCorrect() { showSightMap(t, $('.show')); }
      });
    }
    const hear = `<button class="say big-say" id="hear" aria-label="${T().listen}">🔊</button>`;
    // Two look-alike words: only the whole spelling tells them apart.
    const ds = shuffle(SIGHT_LOOK[t].filter(w => w !== t)).slice(0, 2);
    quiz(this, {
      ask: B('Listen; find it!', '듣고 그 낱말을 눌러요.'), askExtra: { t, lang: 'en-US', word: true },
      show: hear,
      opts: [t, ...ds].map(w => ({ html: `<span class="num" lang="en">${w}</span>`, ok: w === t })), cls: 'shapes',
      after: B(`${t}!`, `${t}!`),
      onRender() {
        // quiz() speaks askExtra only in Korean; English needs the word queued too (on start and on 🔊 replay).
        $('#hear').onclick = () => sayWord(t);
        if (S.lang === 'en') { sayWord(t, true); const sp = $('#sp'), old = sp.onclick; sp.onclick = () => { old(); sayWord(t, true); }; }
      },
      onCorrect() { showSightMap(t, $('.show')); }
    });
  }
});

// ---------- Count the syllables ----------
const SYL = [['dog', '🐶', 1], ['sun', '☀️', 1], ['fish', '🐟', 1], ['apple', '🍎', 2], ['monkey', '🐵', 2], ['tiger', '🐯', 2], ['rabbit', '🐰', 2], ['cat', '🐱', 1], ['pig', '🐷', 1], ['hat', '🎩', 1], ['bus', '🚌', 1], ['pencil', '✏️', 2],
  ['banana', '🍌', 3], ['butterfly', '🦋', 3], ['elephant', '🐘', 3], ['umbrella', '☂️', 3], ['dinosaur', '🦖', 3],
  ['moon', '🌙', 1], ['star', '⭐', 1], ['duck', '🦆', 1], ['frog', '🐸', 1],
  ['bee', '🐝', 1], ['bear', '🐻', 1], ['goat', '🐐', 1], ['sheep', '🐑', 1],
  ['boat', '⛵', 1], ['train', '🚆', 1], ['truck', '🚚', 1], ['kite', '🪁', 1],
  ['book', '📘', 1], ['bell', '🔔', 1], ['key', '🔑', 1], ['sock', '🧦', 1],
  ['cake', '🎂', 1], ['bread', '🍞', 1], ['corn', '🌽', 1], ['grapes', '🍇', 1],
  ['leaf', '🍃', 1], ['tree', '🌳', 1], ['house', '🏠', 1], ['door', '🚪', 1],
  ['lemon', '🍋', 2], ['carrot', '🥕', 2], ['cookie', '🍪', 2], ['pizza', '🍕', 2],
  ['pumpkin', '🎃', 2], ['cherries', '🍒', 2], ['peanut', '🥜', 2], ['melon', '🍈', 2],
  ['turtle', '🐢', 2], ['penguin', '🐧', 2], ['dolphin', '🐬', 2], ['zebra', '🦓', 2],
  ['spider', '🕷️', 2], ['ladybug', '🐞', 3], ['kangaroo', '🦘', 3], ['octopus', '🐙', 3],
  ['rocket', '🚀', 2], ['airplane', '✈️', 2], ['tractor', '🚜', 2], ['balloon', '🎈', 2],
  ['button', '🔘', 2], ['scissors', '✂️', 2], ['trophy', '🏆', 2],
  ['tomato', '🍅', 3], ['potato', '🥔', 3], ['pineapple', '🍍', 3], ['broccoli', '🥦', 3],
  ['bicycle', '🚲', 3]];
// 11-22 (IXL K skill types, user decision 2026-11-22): "which word has the most / the fewest claps?" with three pictures.
// The words are spoken (🔉 and once after the question), never written. Level 1: two words have the same number of parts and
// one differs by one (1,1,2 or 2,2,1). Level 2: three different lengths (1, 2, 3), so every word must be counted and compared.
// Left out: pictures with a common other name of a different length (🐶 puppy, 🐱 kitty, ✈️ plane, 🚲 bike, 🥜 nut,
// 🏆 cup, ⛵ sailboat, 🐞 bug) and 🔘 (looks like a screen button).
const SYL_MORE = [['gorilla', '🦍', 3], ['koala', '🐨', 3], ['flamingo', '🦩', 3], ['tornado', '🌪️', 3], ['volcano', '🌋', 3],
  ['lizard', '🦎', 2], ['rainbow', '🌈', 2], ['candle', '🕯️', 2], ['robot', '🤖', 2], ['parrot', '🦜', 2], ['pretzel', '🥨', 2]];
const SYL_SKIP = ['dog', 'cat', 'airplane', 'bicycle', 'button', 'ladybug', 'peanut', 'trophy', 'boat'];
function sylMost(lv) {
  const bank = [...SYL, ...SYL_MORE].filter(x => !SYL_SKIP.includes(x[0])), of = n => shuffle(bank.filter(x => x[2] === n));
  const most = rnd(2) === 0;
  let ws;
  if (lv === 1) { const [one, two] = [of(1), of(2)]; ws = most ? [two[0], one[0], one[1]] : [one[0], two[0], two[1]]; }
  else { const a = of(1)[0], b = of(2)[0], c = of(3)[0]; ws = most ? [c, a, b] : [a, b, c]; }
  return {
    ask: most ? B('Which word has the most claps?', '박수를 가장 많이 치는 낱말은?') : B('Which word has the fewest claps?', '박수를 가장 적게 치는 낱말은?'),
    show: '<span class="emo" aria-hidden="true">👏</span>',
    opts: ws.map((w, i) => ({ html: `<span class="emo">${w[1]}</span><span class="word ow-say" lang="en">${w[0]}</span>`, ok: i === 0 })), cls: 'shapes',
    after: B(ws.map(w => `${w[0]}: ${w[2]} ${w[2] === 1 ? 'clap' : 'claps'}`).join(', '), ws.map(w => `${w[0]} 박수 ${w[2]}번`).join(', ')), vocab: ws[0][0],
    onRender() { $$('.opt .word').forEach(e => say(e.textContent, 'en-US', true)); }
  };
}
registerGame({
  id: 'syllable', subject: 'read', icon: '👏', title: B('Clap the Parts', '박수로 음절 세기'), sub: B('How many parts?', '몇 개로 나뉠까?'),
  area: AREA_READ('Syllables'),
  play() {
    // 11-14 (answer-skew): pick the number of parts first so 1 and 2 come up evenly (was 31 one-part words to 25); level 2 adds 3-part words.
    if (rnd(3) === 0) return quiz(this, sylMost(1));
    const parts = lvl('syllable') === 1 ? 1 + rnd(2) : 1 + rnd(3), t = pick(SYL.filter(x => x[2] === parts));
    quiz(this, {
      ask: B('Say the word and clap: how many parts?', '말하며 박수 치면 몇 부분일까요?'),
      show: `<div class="bigword"><span class="emo">${t[1]}</span> ${t[0]} <button class="say" id="hear">🔊</button></div><button class="pill" id="clap">👏 <span id="cl">0</span></button>`,
      opts: [1, 2, 3].map(n => ({ html: `<span class="num">${n}</span>`, label: '👏'.repeat(n), ok: n === t[2] })), cls: 'shapes',
      after: B(`${t[0]} has ${t[2]} ${t[2] === 1 ? 'part' : 'parts'}!`, `${t[0]}는 ${t[2]}부분이에요!`), vocab: t[0],
      onRender() { let c = 0; $('#hear').onclick = () => say(t[0], 'en-US'); $('#clap').onclick = () => { c++; $('#cl').textContent = c; }; }
    });
  }
});

// ---------- Memory match: big and little letters (flip cards) ----------
registerGame({
  id: 'memory', subject: 'read', icon: '🃏', title: B('Letter Memory', '글자 기억 게임'), sub: B('Flip cards, match A with a', '카드를 뒤집어 A와 a 찾기'),
  area: AREA_READ('Alphabet'),
  play() {
    const pairs = lvl('memory') === 1 ? 4 : 6, alphabet = 'ABCDEFGHIJKLMNOP'.split('');
    // Uppercase I and lowercase l look alike in Segoe UI. Keep either pair, never both.
    const excluded = pick(['I', 'L']);
    const eligible = alphabet.filter(letter => letter !== excluded);
    const ls = shuffle(eligible).slice(0, pairs);
    if (dup(this, ls.slice().sort().join(''))) return this.play();
    const cards = shuffle(ls.flatMap(c => [{ k: c, t: c }, { k: c, t: c.toLowerCase() }]));
    // 70a: the instruction is read aloud on start and can be replayed (K cannot be expected to read it).
    const instruction = L(B('Find the big and little letter pairs!', '짝이 되는 큰 글자와 작은 글자를 찾아요!'));
    view().innerHTML = `<div class="prompt">${instruction}<button class="say" id="sp" aria-label="${T().listen}">🔊</button></div>
      <div class="mem">${cards.map((c, i) => `<button class="card" data-i="${i}"><span class="back">🍑</span><span class="face">${c.t}</span></button>`).join('')}</div><pk-cheer class="cheer" id="cheer"></pk-cheer>`;
    $('#sp').onclick = () => say(instruction); say(instruction);
    let open = [], lock = false, misses = 0, matched = 0;
    const finish = () => { const ok = misses <= pairs; record('memory', ok); if (ok) addPeach(); $('#cheer').textContent = pick(T().right); nextButton(() => this.play()); };
    $$('.card').forEach(b => b.onclick = () => {
      if (lock || b.classList.contains('flip') || b.classList.contains('gone')) return;
      b.classList.add('flip'); const c = cards[+b.dataset.i]; say(c.t, 'en-US'); open.push(b);
      if (open.length < 2) return;
      lock = true; const [x, y] = open; open = [];
      if (cards[+x.dataset.i].k === cards[+y.dataset.i].k) {
        matched++; setTimeout(() => { x.classList.add('gone'); y.classList.add('gone'); lock = false; if (matched === pairs) finish(); }, 500);
      } else { misses++; setTimeout(() => { x.classList.remove('flip'); y.classList.remove('flip'); lock = false; }, 800); }
    });
  }
});

// 63a: L2 compares spoken word lengths.
(() => {
 const replace=(id,make)=>{const g=GAMES.find(g=>g.id===id),old=g.play;g.play=function(){if(lvl(id)===1)return old.call(this);quiz(this,make());};};
 // sight L2 sentence fill removed (2026-10-28): L2 is now listen-and-write with letter tiles (see sight above).
 replace('syllable', () => {
   if (rnd(3) === 0) return sylMost(2);
   const a = pick(SYL), b = pick(SYL.filter(word => word !== a));
   const picture = (word, other) => ({ html: `<span class="emo">${word[1]}</span>`, label: word[0], ok: word[2] > other[2] });
   return {
     ask: B('Which word needs more claps?', '박수를 더 많이 치는 낱말은?'),
     askExtra: { t: `${a[0]}. ${b[0]}.`, lang: 'en-US' },
     show: '<span class="emo" aria-hidden="true">👏</span>',
     opts: [picture(a, b), picture(b, a), { html: '<span class="num">=</span>', label: B('Same', '같아요'), ok: a[2] === b[2] }],
     cls: 'shapes'
   };
 });
})();
