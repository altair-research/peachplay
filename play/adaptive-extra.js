(() => {
  'use strict';
  // Original practice banks. Registration only: the control session owns the ladder and asset links.
  // Grade 3 sound games are optional foundation review, not a new grade 3 standard or test predictor.
  const add = (id, grade, title, area, make) => registerGame({
    id, grade, subject: 'read', icon: '📖', title, sub: B('Listen, read, and choose', '듣고 읽으며 골라요'),
    area: B(`${grade === 'K' ? 'Kindergarten' : 'Grade ' + grade} Reading · ${area.en}`, `${grade === 'K' ? '유치원' : grade + '학년'} 읽기 · ${area.ko}`),
    play() { quiz(this, make(lvl(id))); }
  });
  const choices = (right, wrongs) => [right, ...wrongs].map((w, i) => ({ html: `<span class="word">${typeof w === 'string' ? w : L(w)}</span>`, ok: i === 0 }));
  const passage = text => `<div class="storytext" lang="en" style="font-size:clamp(17px,3.1dvh,23px);line-height:1.3">${text}</div>`;
  const soundArea = B('Sound awareness', '소리 인식');
  const deletions = [
    ['smile', 's', 'mile', ['smell', 'small']], ['snail', 's', 'nail', ['tail', 'snow']],
    ['stop', 's', 'top', ['step', 'shop']], ['spin', 's', 'pin', ['pan', 'spot']],
    ['spot', 's', 'pot', ['pet', 'spoon']], ['sled', 's', 'led', ['lid', 'slide']],
    ['clap', 'k', 'lap', ['cap', 'clip']], ['glow', 'g', 'low', ['go', 'slow']],
    ['plane', 'p', 'lane', ['plan', 'plate']], ['train', 't', 'rain', ['trail', 'tin']],
    ['snap','s','nap',['snip','sap']], ['spill','s','pill',['spell','pal']],
    ['skate','s','Kate',['kit','state']], ['seat','s','eat',['sat','set']],
    ['sand','s','and',['sad','send']], ['sold','s','old',['sell','sod']],
    ['scold','s','cold',['coal','code']], ['sweep','s','weep',['sweet','sip']]
  ];
  deletions.push(...[["play","p","lay",["pay","day"]],["pray","p","ray",["pay","pry"]],["stone","s","tone",["toe","son"]],["steam","s","team",["seam","stem"]],["speak","s","peak",["seam","speck"]],["sleep","s","leap",["slip","deep"]],["swell","s","well",["sell","wall"]],["slack","s","lack",["sack","slap"]],["black","b","lack",["back","block"]],["blend","b","lend",["bend","land"]],["brag","b","rag",["bag","grab"]],["cram","k","ram",["cap","crab"]],["grow","g","row",["go","grew"]],["bread","b","red",["bed","bred"]],["twin","t","win",["tin","twine"]],["dwell","d","well",["bell","wall"]]]);
  const removeSteps3 = [["slip","s","lip","p","d","lid"],["slap","s","lap","p","b","lab"],["clip","k","lip","p","t","lit"],["trip","t","rip","p","b","rib"],["grip","g","rip","p","m","rim"],["scan","s","can","n","t","cat"],["cram","k","ram","m","t","rat"],["brag","b","rag","g","t","rat"],["flap","f","lap","p","b","lab"],["trim","t","rim","m","p","rip"],["steam","s","team","m","n","teen"],["speak","s","peak","k","l","peel"],["stone","s","tone","n","d","toad"],["plate","p","late","t","k","lake"],["brake","b","rake","k","n","rain"],["flake","f","lake","k","t","late"],["drain","d","rain","n","k","rake"],["trail","t","rail","l","n","rain"],["clean","k","lean","n","f","leaf"],["black","b","lack","k","p","lap"]];
  for (const grade of ['2', '3']) add('adremove' + grade, grade, B('Take Away a Sound', '소리 하나 빼요'), soundArea, lv => {
    if(grade==='2') {
      const bank=[["brake","b","rake","k",[["t","rate"],["n","rain"]]],["flake","f","lake","k",[["t","late"],["n","lane"]]],["slate","s","late","t",[["k","lake"],["n","lane"]]],["stake","s","take","k",[["p","tape"],["m","tame"]]],["space","s","pace","s",[["n","pain"],["d","paid"]]],["clean","k","lean","n",[["f","leaf"],["p","leap"]]],["cream","k","ream","m",[["d","read"],["p","reap"]]],["plate","p","late","t",[["k","lake"],["n","lane"]]],["grate","g","rate","t",[["k","rake"],["n","rain"]]],["trail","t","rail","l",[["n","rain"],["t","rate"]]],["frail","f","rail","l",[["n","rain"],["t","rate"]]],["drain","d","rain","n",[["k","rake"],["t","rate"]]],["smile","s","mile","l",[["t","mite"],["n","mine"]]],["snail","s","nail","l",[["m","name"],["p","nape"]]],["stop","s","top","p",[["t","tot"]]],["spin","s","pin","n",[["g","pig"],["t","pit"]]],["spot","s","pot","t",[["p","pop"],["d","pod"]]],["clap","k","lap","p",[["b","lab"],["d","lad"]]],["plane","p","lane","n",[["t","late"],["k","lake"]]],["train","t","rain","n",[["k","rake"],["t","rate"]]],["spill","s","pill","l",[["t","pit"],["g","pig"]]],["sand","s","and","d",[["t","ant"]]],["sweep","s","weep","p",[["k","week"],["d","weed"]]],["slip","s","lip","p",[["d","lid"],["t","lit"]]],["slap","s","lap","p",[["b","lab"],["d","lad"]]],["clip","k","lip","p",[["d","lid"],["t","lit"]]],["trip","t","rip","p",[["b","rib"],["m","rim"]]],["grip","g","rip","p",[["b","rib"],["m","rim"]]],["swing","s","wing","ng",[["n","win"]]],["scan","s","can","n",[["t","cat"],["p","cap"]]],["scat","s","cat","t",[["p","cap"],["n","can"]]],["skit","s","kit","t",[["d","kid"],["n","kin"]]],["skin","s","kin","n",[["d","kid"],["t","kit"]]]];
      // Additional familiar real results; choose first or last deletion at L1.
      const simple=[["play","p","lay"],["pray","p","ray"],["stone","s","tone"],["steam","s","team"],["speak","s","peak"],["steal","s","teal"],["slope","s","lope"],["swell","s","well"],["sweet","s","wheat"],["swear","s","wear"],["scold","s","cold"],["seat","s","eat"],["sold","s","old"],["glow","g","low"],["snow","s","no"],["slack","s","lack"],["black","b","lack"],["blend","b","lend"],["brat","b","rat"],["brag","b","rag"],["cram","k","ram"],["crow","k","row"],["grow","g","row"],["bread","b","red"],["twin","t","win"],["dwell","d","well"]];
      if(lv===1){const a=pick([...bank.map(x=>x.slice(0,3)),...simple]);return {ask:B('Remove the first sound. Which word remains?','첫소리를 빼면 어떤 낱말이 남나요?'),askExtra:{t:a[0],lang:'en-US'},show:passage(a[0]+' − /'+a[1]+'/'),opts:choices(a[2],[a[0],a[2]+'s']),cls:'words',after:B(a[0]+' → '+a[2],a[0]+' → '+a[2]),onRender(){const button=$('.storytext .rd');if(button)button.onclick=()=>say(a[0]+'. Remove the first sound, '+a[1]+'.','en-US');}};}
      const a=pick(bank),change=pick(a[4]);return {ask:B('Remove the first sound, then change the last sound.','첫소리를 뺀 뒤 끝소리를 바꿔요.'),askExtra:{t:a[0],lang:'en-US'},show:passage(a[0]+' − /'+a[1]+'/<br>/'+a[3]+'/ → /'+change[0]+'/'),opts:choices(change[1],[a[2],a[0]]),cls:'words',after:B(a[0]+' → '+a[2]+' → '+change[1],a[0]+' → '+a[2]+' → '+change[1]),onRender(){const button=$('.storytext .rd');if(button)button.onclick=()=>say(a[0]+'. Remove the first sound, '+a[1]+'. Then change the last sound, '+a[3]+', to '+change[0]+'.','en-US');}};
    }
    if(lv===2){const r=pick([...removeSteps3,['clap','k','lap','p','b','lab'],['plane','p','lane','n','t','late'],['train','t','rain','n','k','rake'],['glow','g','low','l','s','so'],['smile','s','mile','l','t','mite'],['spin','s','pin','n','g','pig'],['stop','s','top','p','t','tot'],['spot','s','pot','t','p','pop'],['snap','s','nap','n','k','cap'],['spill','s','pill','l','t','pit'],['sand','s','and','d','t','ant'],['sweep','s','weep','p','k','week']]);return {ask:B(`Say "${r[0]}" without its first /${r[1]}/. Then change /${r[3]}/ to /${r[4]}/.`,`"${r[0]}"의 첫 /${r[1]}/ 소리를 빼요. 그다음 /${r[3]}/ 소리를 /${r[4]}/로 바꿔요.`),opts:choices(r[5],[r[2],r[0]]),cls:'words',after:B(`${r[0]} → ${r[2]} → ${r[5]}`,`${r[0]} → ${r[2]} → ${r[5]}`)};}
    const t = pick(deletions);
    return { ask: B(`Say "${t[0]}" without the first /${t[1]}/ sound.`, `"${t[0]}"에서 첫 /${t[1]}/ 소리를 빼고 말해요.`),
      askExtra: { t: t[0], lang: 'en-US' }, opts: choices(t[2], t[3]), cls: 'words', after: B(`${t[0]} → ${t[2]}`, `${t[0]} → ${t[2]}`) };
  });
  const changes = [
    ['slip', 'p', 't', 'slit', ['slap', 'sip']], ['crab', 'b', 'k', 'crack', ['cab', 'crib']],
    ['grin', 'n', 'p', 'grip', ['green', 'gin']], ['flat', 't', 'p', 'flap', ['fat', 'flip']],
    ['trip', 'p', 'm', 'trim', ['tip', 'trap']], ['flag', 'g', 'p', 'flap', ['flat', 'lag']],
    ['swan', 'n', 'p', 'swap', ['swim', 'wan']], ['cup', 'p', 't', 'cut', ['cap', 'cub']],
    ['tent', 't', 's', 'tense', ['ten', 'test']], ['brim', 'm', 'k', 'brick', ['rim', 'brisk']],
    ['cap','p','t','cat',['cup','cab']], ['map','p','t','mat',['mop','mad']],
    ['pan','n','t','pat',['pen','pin']], ['pin','n','g','pig',['pan','pit']]
  ];
  changes.push(...[["bed","d","t","bet",["bad","bud"]],["bag","g","t","bat",["big","bug"]],["cut","t","p","cup",["cat","cot"]],["dig","g","p","dip",["dog","dug"]],["sit","t","p","sip",["sat","set"]],["leg","g","d","led",["lag","log"]],["net","t","k","neck",["nut","not"]],["bus","s","g","bug",["boss","buzz"]],["ham","m","t","hat",["hum","him"]],["hop","p","t","hot",["hip","hat"]],["ram","m","g","rag",["rim","rum"]],["fin","n","t","fit",["fan","fun"]],["luck","k","v","love",["lick","lock"]]]);
  const changeSteps3 = [["spit","t","n","spin","s","pin"],["spit","t","l","spill","s","pill"],["spin","n","t","spit","s","pit"],["slap","p","k","slack","s","lack"],["slab","b","p","slap","s","lap"],["slit","t","p","slip","s","lip"],["slit","t","k","slick","s","lick"],["snag","g","p","snap","s","nap"],["snap","p","g","snag","s","nag"],["flame","m","k","flake","f","lake"],["clap","p","m","clam","k","lamb"],["clam","m","p","clap","k","lap"],["cliff","f","k","click","k","lick"],["cliff","f","p","clip","k","lip"],["grip","p","m","grim","g","rim"],["grip","p","d","grid","g","rid"],["brain","n","k","brake","b","rake"],["brake","k","n","brain","b","rain"],["train","n","l","trail","t","rail"],["trail","l","n","train","t","rain"]];
  add('adchange3', '3', B('Change the Last Sound', '끝소리를 바꿔요'), soundArea, lv => {
    if(lv===2){const r=pick([...changeSteps3,['slip','p','t','slit','s','lit'],['crab','b','k','crack','k','rack'],['grin','n','p','grip','g','rip'],['flat','t','p','flap','f','lap'],['trip','p','m','trim','t','rim'],['flag','g','p','flap','f','lap'],['slip','p','k','slick','s','lick'],['flat','t','g','flag','f','lag'],['trip','p','k','trick','t','Rick'],['crab','b','m','cram','k','ram'],['grin','n','d','grid','g','rid'],['flag','g','k','flak','f','lack']]);return {ask:B(`In "${r[0]}", change the last /${r[1]}/ to /${r[2]}/. Then remove the first /${r[4]}/.`,`"${r[0]}"의 끝 /${r[1]}/를 /${r[2]}/로 바꿔요. 그다음 첫 /${r[4]}/를 빼요.`),opts:choices(r[5],[r[3],r[0]]),cls:'words',after:B(`${r[0]} → ${r[3]} → ${r[5]}`,`${r[0]} → ${r[3]} → ${r[5]}`)};}
    const t = pick(changes);
    return { ask: B(`In "${t[0]}", change the last /${t[1]}/ to /${t[2]}/.`, `"${t[0]}"의 끝 /${t[1]}/ 소리를 /${t[2]}/로 바꿔요.`),
      askExtra: { t: t[0], lang: 'en-US' }, opts: choices(t[3], t[4]), cls: 'words',
      after: B(`${t[0]} → ${t[3]}`, `${t[0]} → ${t[3]}`) };
  });
  const wordArea = B('High-frequency words', '자주 쓰는 낱말');
  const words = {
    K: [['the', 'tha', 'teh'], ['was', 'waz', 'wsa'], ['you', 'yoo', 'yu'], ['said', 'sed', 'sadi'], ['are', 'ar', 'aer'], ['one', 'wun', 'oen'], ['they', 'thay', 'tehy'], ['have', 'hav', 'haev'], ['come', 'cum', 'coem'], ['some', 'sum', 'soem']],
    1: [['were', 'wer', 'wre'], ['there', 'ther', 'thre'], ['what', 'wat', 'waht'], ['where', 'wher', 'whe'], ['their', 'thier', 'thir'], ['could', 'coud', 'culd'], ['would', 'woud', 'wuld'], ['should', 'shoud', 'shuld'], ['does', 'doez', 'deos'], ['many', 'meny', 'mnay']],
    2: [['because', 'becase', 'becaus'], ['people', 'peple', 'poeple'], ['friend', 'frend', 'freind'], ['enough', 'enogh', 'enuf'], ['again', 'agian', 'agen'], ['thought', 'thougt', 'thoght'], ['through', 'throu', 'throgh'], ['answer', 'anser', 'anwser'], ['heard', 'haerd', 'heerd'], ['often', 'ofen', 'oftne']],
    3: [['always', 'alwayz', 'alwasy'], ['together', 'togther', 'togeher'], ['another', 'anothr', 'anoter'], ['every', 'evry', 'evrey'], ['about', 'abaut', 'abuot'], ['before', 'befor', 'befoer'], ['around', 'arund', 'aruond'], ['different', 'diffrent', 'diferent'], ['though', 'thogh', 'thoug'], ['something', 'somthing', 'somehing']]
  };
  const sentences = {
    K: ['I see ___ sun.', 'It ___ fun yesterday.', 'Thank ___ for helping.', 'Mom ___ hello.', 'We ___ happy.', 'I have ___ nose.', '___ play with us.', 'I ___ a red hat.', 'Please ___ here.', 'I want ___ water.'],
    1: ['We ___ at home yesterday.', 'Put it over ___.', '___ is your name?', '___ is my bag?', 'They packed ___ bags.', 'I wish I ___ fly.', 'I ___ like a snack.', 'We ___ be kind.', 'She ___ her work.', 'How ___ books do you have?'],
    2: ['I smile ___ I am happy.', 'Three ___ are here.', 'My ___ plays with me.', 'We have ___ food for everyone.', 'Let us play ___.', 'Yesterday I ___ about the story.', 'We walk ___ the gate.', 'I know the ___.', 'Yesterday I ___ a bell ring.', 'We read after lunch most days, but not every day. We ___ read after lunch.'],
    3: ['I ___ brush my teeth at bedtime, every night.', 'The twins walk home ___.', 'I want ___ cup.', '___ child has a pencil.', 'This book is ___ trains.', 'We wash our hands ___ lunch.', 'We sit ___ the table.', 'Red and blue are ___ colors.', '___ it rained, we stayed dry.', 'I found ___ in the box: a key!']
  };
  words.K.push(['here', 'heer', 'herre'], ['little', 'litle', 'littel']);
  sentences.K.push('Come ___ to me.', 'I see a ___ cat.');
  // Original K listening targets and short context clues.
  const kWordPractice = [["all","al","awl","___ of us can go.","each"],
    ["and","adn","annd","Red ___ blue make purple.","or"],
    ["away","awya","awei","She put her toys ___ after play.","under"],
    ["big","bgi","bigg","An ant is tiny. An elephant is ___.","small"],
    ["blue","bleu","bloo","A clear sky is ___.","red"],
    ["can","cna","kann","I ___ clap with my hands.","am"],
    ["down","dwon","doun","Go ___ the slide to the sand.","up"],
    ["find","fnid","fined","Look until you ___ your shoe.","hide"],
    ["for","fro","frr","This gift is ___ you.","at"],
    ["funny","funy","funney","That joke made me laugh. It was ___.","sad"],
    ["go","goh","goo","The light is green. We can ___.","stop"],
    ["help","hlep","hellp","I can ___ you carry it.","look"],
    ["into","itno","innto","She stepped ___ the room.","under"],
    ["jump","jmup","jumpp","Bend your knees and ___ over the line.","sit"],
    ["look","lokk","luuk","___ at the bird up there.","Give"],
    ["make","maek","mak","Fold paper to ___ a boat.","take"],
    ["me","mee","mhe","I am thirsty. Give the cup to ___.","my"],
    ["my","mi","mye","This is ___ bag. I own it.","me"],
    ["not","nott","nto","A fish does ___ walk.","now"],
    ["play","paly","plai","We can ___ tag at recess.","read"],
    ["red","rde","redd","The stop sign is ___.","green"],
    ["run","rnu","runn","Use your feet to ___ a race.","fly"],
    ["see","ssee","sea","Open your eyes to ___ the bird.","hear"],
    ["three","thre","thrae","Two and one make ___.","five"],
    ["to","tto","tuh","I walk ___ school.","of"],
    ["up","upp","uhp","The balloon goes ___ into the sky.","down"],
    ["we","wee","whe","My friend and I are here. ___ can play.","Us"],
    ["where","whre","wher","___ is the dog hiding?","Who"],
    ["white","whiet","wite","Snow is ___.","black"],
    ["will","wil","wlll","I ___ go to school tomorrow.","was"],
    ["yes","yess","eys","Do you want to play? ___, I do.","No"],
    ["yellow","yelow","yellwo","A ripe banana is ___.","purple"],
    ["no","nno","noo","Is a fish a bird? ___, it is not.","Yes"]];
  for (const [word, first, second, sentence] of kWordPractice) {
    words.K.push([word, first, second]);
    sentences.K.push(sentence);
  }
  // 65: twelve distinct targets per grade; L2 adds sentence evidence.
  words[1].push(['once','wunce','onse'],['two','twoo','twu']);
  sentences[1].push('I went there ___, not twice.','One and one make ___.');
  words[2].push(['only','onley','olny'],['other','uther','ohter']);
  sentences[2].push('I have ___ one pencil, no more.','One shoe is here. Where is the ___ shoe?');
  words[3].push(['until','untill','untl'],['between','betwen','beetween']);
  sentences[3].push('We left as soon as the rain stopped. We waited ___ it stopped.','The small box is ___ the two big boxes.');
  // 87: existing grade-3 spelling/context format; no K–2 banks change.
  const grade3Extra = [
  [
    "better",
    "beter",
    "bettter",
    "I feel ___ than I did yesterday.",
    "good",
    "best"
  ],
  [
    "bring",
    "brign",
    "bringg",
    "Please ___ your book to class.",
    "brings",
    "brought"
  ],
  [
    "carry",
    "cary",
    "carrry",
    "I can ___ the box.",
    "carries",
    "carried"
  ],
  [
    "clean",
    "cleen",
    "celan",
    "No dirt remains on the cup. It is ___.",
    "dirty",
    "muddy"
  ],
  [
    "draw",
    "drau",
    "drwa",
    "Use a pencil to ___ a picture.",
    "drew",
    "drawn"
  ],
  [
    "drink",
    "drnik",
    "drinck",
    "I will ___ some water.",
    "drank",
    "drinks"
  ],
  [
    "eight",
    "eihgt",
    "eit",
    "Four and four make ___.",
    "seven",
    "nine"
  ],
  [
    "fall",
    "fal",
    "fawl",
    "Watch a leaf ___ from the tree.",
    "fell",
    "fallen"
  ],
  [
    "far",
    "farr",
    "faar",
    "The park is ten miles away. It is ___ from home.",
    "near",
    "close"
  ],
  [
    "full",
    "ful",
    "fooll",
    "Water reaches the cup’s rim. The cup is ___.",
    "empty",
    "half-full"
  ],
  [
    "grow",
    "gorw",
    "groe",
    "The seeds will ___ into plants.",
    "grew",
    "growing"
  ],
  [
    "hold",
    "hould",
    "hlod",
    "Please ___ the rope with both hands.",
    "held",
    "holds"
  ],
  [
    "keep",
    "keap",
    "kkeep",
    "I will ___ this note to read later.",
    "kept",
    "keeps"
  ],
  [
    "kind",
    "kinde",
    "kynd",
    "She helped her friend and spoke gently. She was ___.",
    "unkind",
    "mean"
  ],
  [
    "laugh",
    "lagh",
    "lauhg",
    "A funny joke can make us ___.",
    "laughed",
    "laughs"
  ],
  [
    "light",
    "lighht",
    "ligth",
    "This empty bag weighs very little. It is ___.",
    "heavy",
    "weight"
  ],
  [
    "long",
    "lng",
    "loong",
    "This ribbon is ten feet ___.",
    "length",
    "lengths"
  ],
  [
    "much",
    "muhc",
    "mutch",
    "How ___ water is in the bottle?",
    "many",
    "several"
  ],
  [
    "myself",
    "myslef",
    "mysefl",
    "No one helped me. I did it ___.",
    "ourselves",
    "themselves"
  ],
  [
    "never",
    "nevr",
    "nevver",
    "I have not been there even once. I have ___ been there.",
    "already",
    "always"
  ],
  [
    "only",
    "onley",
    "olny",
    "There is just one cookie left. There is ___ one.",
    "many",
    "several"
  ],
  [
    "own",
    "owne",
    "oen",
    "I ___ this bag; it belongs to me.",
    "owns",
    "owning"
  ],
  [
    "start",
    "strat",
    "starrt",
    "We will ___ the game after lunch.",
    "starts",
    "started"
  ],
  [
    "today",
    "todai",
    "toady",
    "It is Tuesday ___. Yesterday was Monday.",
    "tomorrow",
    "yesterday"
  ]
];
  words[3].push(...grade3Extra.map(r=>r.slice(0,3)));
  sentences[3].push(...grade3Extra.map(r=>r[3]));
  const grade3ContextWrong = ['never','between','these','Many','during','between','until','difference','Despite','nobody','among','until',...grade3Extra.map(r=>r[4])];
  for (const grade of ['K', '1', '2', '3']) add('adwords' + grade, grade, B('Familiar Word Spellings', '익숙한 낱말 철자'), wordArea, lv => {
    const familiar = grade === '2' ? pick(G2_WORD77) : grade === '1' && rnd(3) !== 0 ? pick(kWordPractice) : null;
    const t = familiar ? familiar.slice(0, 3) : pick(words[grade]);
    const index = words[grade].indexOf(t), sentence = familiar ? familiar[3] : sentences[grade][index];
    if(lv===1)return {ask:B(['K', '1'].includes(grade) ? 'Spell it.' : 'Listen and choose.','소리를 듣고 맞는 철자를 골라요.'),...(grade==='2'?{askSay:B('Listen and spell: '+t[0], '소리를 듣고 맞는 철자를 골라요.')} : {}),...(grade==='3'?{readGoal:'opts',onRender(){if(S.lang==='en')say(t[0],'en-US',true);const sp=$('#sp'),old=sp.onclick;sp.onclick=()=>{old();if(S.lang==='en')say(t[0],'en-US',true);};}}:{}),askExtra:{t:t[0],lang:'en-US'},opts:choices(t[0],t.slice(1)),cls:'words',after:B(t[0],t[0])};
    const contextWrong={K:['an','is','we','say','is','two','Them','has','comes','many','hear','few'],3:grade3ContextWrong};
    const alternatives=lv===2?[t[1],familiar?.[4]||(contextWrong[grade]||[])[index]|| (grade === 'K' ? kWordPractice[index - 12][4] : null) ||({'1':['was','their','who','who','there','must','am','was','doing','much','twice','four'],'2':['during','person','friendly','empty','never','think','though','answered','hear','always','all','another']}[grade]||['before','until'])[grade==='3'?index-10:index]]:t.slice(1);
    return { ...(grade==='3'?{readGoal:'opts'}:{}), ask: B(['K', '1'].includes(grade) ? 'Fill this blank.' : grade === '2' ? 'Pick the word that fits, with correct spelling.' : 'Which word fits and is spelled right?', '문장에 맞는 낱말의 올바른 철자를 골라요.'),
      askExtra: { t: sentence.replace('___', 'blank'), lang: 'en-US' }, show: passage(sentence), opts: choices(t[0], alternatives), cls: 'words', after: B(sentence.replace('___', t[0]), sentence.replace('___', t[0])), vocab: t[0],
      onRender() { const button = $('.storytext .rd'); if (button) button.onclick = () => say(sentence.replace('___', 'blank'), 'en-US'); } };
  });
  const contexts = [
    ['We wash our hands ___ lunch.', 'before', ['between', 'under']], ['The twins walk home ___.', 'together', ['during', 'between']],
    ['I finished this book. I want ___ one.', 'another', ['these', 'those']], ['___ child has a pencil.', 'Every', ['Many', 'Both']],
    ['We sat ___ the round table.', 'around', ['during', 'until']], ['The red and blue hats are ___.', 'different', ['during', 'between']],
    ['I found ___ in the box: a key!', 'something', ['nothing', 'nobody']], ['This book is ___ trains.', 'about', ['between', 'under']],
    ['___ it rained, we stayed dry inside.', 'Though', ['During', 'Despite']], ['I ___ brush my teeth at bedtime, every night.', 'always', ['never', 'rarely']],
    ['We left as soon as the rain stopped. We waited ___ it stopped.', 'until', ['among','between']],
    ['The small box is ___ the two big boxes.', 'between', ['during','until']]
  ];
  contexts.push(...grade3Extra.map(r=>[r[3],r[0],[r[4],r[5]]]));
  add('adwordcontext3', '3', B('Familiar Words in Sentences', '문장 속 익숙한 낱말'), wordArea, lv => {
    const t = pick(contexts);
    if(lv===2){const u=pick(contexts.filter(x=>x!==t&&x[1]!==t[1]));return {ask:B('Which pair fills the two blanks in order?','두 빈칸에 차례로 들어갈 낱말의 짝은?'),askExtra:{t:t[0].replace('___','blank')+' '+u[0].replace('___','blank'),lang:'en-US'},show:passage(t[0]+'<br>'+u[0]),opts:choices(t[1]+' → '+u[1],[t[2][0]+' → '+u[1],t[1]+' → '+u[2][0]]),cls:'words',onRender(){const button=$('.storytext .rd');if(button)button.onclick=()=>say(t[0].replace('___','blank')+' '+u[0].replace('___','blank'),'en-US');}};}
    return { ask: B('Which word completes the sentence?', '문장을 완성하는 낱말을 골라요.'), askExtra: { t: t[0].replace('___', 'blank'), lang: 'en-US' },
      show: passage(t[0]), opts: choices(t[1], t[2]), cls: 'words', after: B(t[0].replace('___', t[1]), t[0].replace('___', t[1])),onRender(){const button=$('.storytext .rd');if(button)button.onclick=()=>say(t[0].replace('___','blank'),'en-US');} };
  });
  const oppositePairs = [['hot', 'cold'], ['up', 'down'], ['big', 'small'], ['open', 'closed'], ['day', 'night'], ['full', 'empty'], ['wet', 'dry'], ['near', 'far'], ['fast', 'slow'], ['soft', 'hard'], ['in', 'out'], ['on', 'off']];
  for (const grade of ['K', '1']) add('admeaning' + grade, grade, B('Opposite Word Partners', '반대 뜻 짝꿍'), B('Vocabulary', '어휘'), lv => {
    if (grade === 'K' || (grade === '1' && lv === 1)) return kOppositeItem(lv, false);
    const index = rnd(oppositePairs.length), source = oppositePairs[index], pair = lv === 2 ? [...source].reverse() : source;
    const nearby = {hot:['warm','cool'],cold:['cool','warm'],up:['across','along'],down:['across','along'],big:['medium','huge'],small:['medium','tiny'],open:['ajar','wide'],closed:['ajar','narrow'],day:['dawn','noon'],night:['dawn','dusk'],full:['half-full','almost full'],empty:['half-full','almost empty'],wet:['damp','soaked'],dry:['damp','slightly wet'],near:['nearby','next to'],far:['farther','distant'],fast:['quick','steady'],slow:['steady','slower'],soft:['smooth','fluffy'],hard:['firm','rough'],in:['beside','near'],out:['beside','near'],on:['dim','bright'],off:['dim','bright']};
    if(grade==='1'&&lv===2){const other=pick(oppositePairs.filter(x=>x!==source)),right=pair[1]+' → '+other[1];return {ask:B('Which pair gives the opposites in order?','차례로 반대 뜻인 낱말의 짝은?'),show:passage(pair[0]+' → '+other[0]),askExtra:{t:pair[0]+', '+other[0],lang:'en-US'},opts:choices(right,[other[1]+' → '+pair[1],pair[1]+' → '+other[0]]),cls:'words'};}
    const ds = nearby[pair[0]];
    return { ask: B(`Which word means the opposite of "${pair[0]}"?`, `"${pair[0]}"와 반대 뜻인 낱말을 골라요.`),
      askExtra: { t: pair[0], lang: 'en-US' }, opts: choices(pair[1], ds), cls: 'words', after: B(`${pair[0]} ↔ ${pair[1]}`, `${pair[0]} ↔ ${pair[1]}`) };
  });
  // Short fiction and procedural passages are authored here, with the answer explicitly supported.
  // English target passages stay English in Korean mode. English read-aloud is wired per passage below.
  const names = ['Mia', 'Ben', 'Ava', 'Leo', 'Sam', 'Zoe', 'Max', 'Lily', 'Noah', 'Ella'];
  const objects = [['kite', '🪁'], ['ball', '⚽'], ['hat', '🧢'], ['book', '📖'], ['bag', '🎒']];
  const textRound = (text, ask, right, wrongs, after) => ({ ask, show: passage(text), opts: choices(right, wrongs), cls: 'words', after,
    onRender() { const button = $('.storytext .rd'); if (button) button.onclick = () => say(text, 'en-US'); }
  });
  for (const grade of ['K', '1']) add('adstory' + grade, grade, B('Tiny Story Details', '짧은 이야기 살펴봐요'), B('Comprehension: Literature', '이해: 이야기'), lv => {
    const name = pick(names), obj = pick(objects), others = shuffle(objects.filter(o => o !== obj)).slice(0, 2);
    // 70b: two short sentences; L2 names a second object, so the child must tell "sees" from "finds".
    const text = lv === 1 ? `${name} has a ${obj[0]}. ${name} takes it home.` : `${name} sees a ${others[0][0]}. ${name} finds a ${obj[0]}.`;
    const round = textRound(text, B(`What does ${name} ${lv === 1 ? 'have' : 'find'}?`, `이야기에서 ${lv === 1 ? '가지고 있는' : '찾은'} 물건을 골라요.`), obj[0], others.map(o => o[0]), B(`The story tells us: ${obj[0]}.`, `이야기에 나온 물건을 확인해요: ${obj[0]}.`));
    round.opts = [obj, ...others].map((o, i) => ({ html: `<span class="word">${o[1]} ${o[0]}</span>`, ok: i === 0 }));
    return round;
  });
  add('adstoryorderK', 'K', B('First and Next', '처음과 다음'), B('Comprehension: Literature', '이해: 이야기'), lv => {
    const name = pick(names), obj = pick(objects);
    const text = `${name} finds a ${obj[0]}. ${name} packs it away.`;
    const first = B('🔍 Finds it', '🔍 찾아요'), next = B('📦 Packs it', '📦 넣어 둬요');
    return textRound(text, lv === 1 ? B('What happens first?', '먼저 일어난 일을 골라요.') : B('What happens next?', '그다음 일어난 일을 골라요.'), lv === 1 ? first : next, [lv === 1 ? next : first, B('😴 Sleeps', '😴 자요')], B(text, text));
  });
  // 70b: picture step cards with two-word labels, so K children can use the pictures and read-aloud
  // instead of decoding a full procedure. [title, title picture, steps [picture, short label, spoken form]].
  const projects = [
    ['Sun', '🌞', [['📄', 'Get paper', 'get paper'], ['⭕', 'Draw circle', 'draw a circle'], ['✏️', 'Add rays', 'add rays']]],
    ['Bag', '🎒', [['👐', 'Open it', 'open the bag'], ['📖', 'Add book', 'put a book inside'], ['🤐', 'Zip it', 'zip the bag']]],
    ['Tower', '🏰', [['🧱', 'Get blocks', 'get blocks'], ['⬆️', 'Stack blocks', 'stack the blocks'], ['🚩', 'Add flag', 'put a flag on top']]],
    ['Card', '💌', [['📄', 'Fold paper', 'fold paper'], ['❤️', 'Draw heart', 'draw a heart'], ['✍️', 'Write name', 'write your name']]],
    ['Table', '🍴', [['⚪', 'Get plate', 'get a plate'], ['🥤', 'Add cup', 'add a cup'], ['🥄', 'Add spoon', 'add a spoon']]],
    ['Gift', '🎁', [['📄', 'Get paper', 'get paper'], ['📦', 'Cover box', 'cover the box'], ['🎀', 'Add bow', 'add a bow']]],
    ['Bookmark', '🔖', [['✂️', 'Cut strip', 'cut a paper strip'], ['⭐', 'Draw star', 'draw a star'], ['🖍️', 'Color star', 'color the star']]],
    ['Plant', '🌱', [['🏺', 'Get pot', 'get a pot'], ['🟫', 'Add soil', 'add soil'], ['🌰', 'Add seed', 'add a seed']]],
    ['Crown', '👑', [['✂️', 'Cut strip', 'cut a paper strip'], ['💎', 'Draw jewels', 'draw jewels'], ['🔗', 'Join ends', 'join the ends']]],
    ['Puppet', '🧦', [['🛍️', 'Get bag', 'get a paper bag'], ['🙂', 'Draw face', 'draw a face'], ['👂', 'Add ears', 'add paper ears']]],
    ['Fish', '🐟', [['📄', 'Get paper', 'get paper'], ['🥚', 'Draw oval', 'draw an oval'], ['✏️', 'Add tail', 'add a tail']]],
    ['Chain', '⛓️', [['✂️', 'Cut strips', 'cut paper strips'], ['⭕', 'Make loop', 'make a loop'], ['➕', 'Add loop', 'add another loop']]]
  ];
  // Finishing steps from projects where they clearly do not fit (index into projects).
  const wrongFinish = [[4, 1], [0, 10], [9, 4], [4, 1], [0, 9], [10, 4], [4, 1], [5, 0], [4, 10], [4, 1], [4, 1], [9, 4]];
  const kTopicProjects = [["Toast","🍞","🔪 Slice bread","♨️ Toast bread","🧈 Spread butter"],
    ["Sandwich","🥪","🖐️ Get bread","🥜 Spread filling","🍞 Cover filling"],
    ["Fruit bowl","🥣🍓","🍎 Wash fruit","🔪 Cut fruit","🥣 Fill bowl"],
    ["Juice","🧃","🍊 Cut orange","🤲 Squeeze orange","🥤 Pour juice"],
    ["Lemon water","🍋","💧 Pour water","🔪 Cut lemon","🥤 Add lemon"],
    ["Salad","🥗","🥬 Wash greens","🥕 Chop carrots","🥣 Toss salad"],
    ["Cereal","🥣🌾","🥣 Get bowl","🥄 Add cereal","🥛 Add milk"],
    ["Yogurt cup","🥛","🫙 Scoop yogurt","🫐 Wash berries","🥄 Stir berries in"],
    ["Water bottle","🫗","🫙 Open bottle","💧 Add water","🔒 Close bottle"],
    ["Cup of tea","🍵","🫖 Heat water","🍃 Add tea","☕ Pour tea"],
    ["Ice tray","🧊","💧 Fill tray","❄️ Freeze water","↗️ Pop out ice"],
    ["Pizza","🍕","🫓 Get dough","🍅 Add sauce","🧀 Add cheese"],
    ["Paper boat","⛵","📄 Fold paper","🔺 Fold corners","↔️ Open hull"],
    ["Paper fan","🪭","📄 Get paper","〰️ Fold pleats","🤏 Pinch end"],
    ["Mask","🎭","📄 Get card","👀 Cut eye holes","🧵 Tie string"],
    ["Name tag","🏷️","📄 Cut card","✍️ Write name","📌 Pin tag"],
    ["Drum","🥁","🥫 Get tin","🎈 Stretch balloon","🪢 Tie edge"],
    ["Collage","🎨","✂️ Cut shapes","📄 Lay them out","🧴 Glue shapes"],
    ["Wreath","🌿","🍃 Find leaves","⭕ Cut ring","🧴 Glue leaves"],
    ["Paper hat","👒","📰 Fold newspaper","🔺 Fold corners","↔️ Open hat"],
    ["Snowman","⛄","❄️ Roll snow","⬆️ Stack snowballs","🥕 Add nose"],
    ["Flag","🏳️","📄 Cut paper","🖍️ Draw stripes","🪵 Attach stick"],
    ["Necklace","📿","🧵 Get string","🔴 Thread beads","🪢 Tie ends"],
    ["Paper flower","🌼","📄 Cut petals","🔘 Join petals","🌱 Add stem"],
    ["Toy train","🚂","🧱 Set blocks","🔗 Join cars","➕ Add engine"],
    ["Toy garage","🚗","📦 Open box","✂️ Cut doorway","🚙 Park car"],
    ["Seed cup","🌱","🥤 Get cup","🟫 Add soil","🌰 Plant seed"],
    ["Bird feeder","🐦","🪵 Get tray","🌻 Add seeds","🧵 Hang tray"],
    ["Brush cup","🖌️","🥤 Get cup","💧 Add water","💦 Rinse brush"],
    ["Gift card","💌","📄 Fold card","🖍️ Draw picture","✉️ Seal envelope"],
    ["Paper airplane","✈️","📄 Fold paper","🔺 Fold tip","🪽 Fold wings"],
    ["Kite","🪁","🪵 Cross sticks","📄 Cover frame","🧵 Tie tail"]].map(([title, icon, ...cards]) => [title, icon, cards.map(card => {
    const split = card.indexOf(' '), phrase = card.slice(split + 1);
    return [card.slice(0, split), phrase, phrase.toLowerCase()];
  })]);
  const stepHtml = s => `<span class="word">${s[0]} ${s[1]}</span>`;
  const stepChoices = (right, wrongs) => [right, ...wrongs].map((s, i) => ({ html: stepHtml(s), ok: i === 0 }));
  const stepCards = (steps, words) => `<div class="storytext" lang="en" style="font-size:clamp(17px,3.1dvh,23px);line-height:1.5">${steps.map((s, i) =>
    `<span style="display:inline-block;margin:.1em .45em;white-space:nowrap">${words ? `<b>${words[i]}</b> ` : ''}<span aria-hidden="true">${s[0]}</span> ${s[1]}</span>`).join('')}</div>`;
  const spoken = steps => `First, ${steps[0][2]}. Next, ${steps[1][2]}. Last, ${steps[2][2]}.`;
  const stepRound = (ask, show, sayText, right, wrongs, after) => ({ ask, show, opts: stepChoices(right, wrongs), cls: 'words', after,
    onRender() { const button = $('.storytext .rd'); if (button) button.onclick = () => say(sayText, 'en-US'); } });
  for (const grade of ['K', '1']) add('adinfo' + grade, grade, B('Read the Steps', '순서 글을 읽어요'), B('Comprehension: Informational Text', '이해: 정보 글'), lv => {
    const [title, , steps] = pick(grade === '1' ? [...projects, ...kTopicProjects] : projects), text = spoken(steps);
    if (grade === '1' && lv === 2) {
      const pair = (a, b) => ({ html: `<span class="word" aria-label="${a[1]}, then ${b[1]}">${a[0]} → ${b[0]}</span>` });
      return { ask: B('Which pair is step 2 → step 3?', '2번 → 3번의 짝은?'), show: stepCards(steps, ['1)', '2)', '3)']),
        opts: [pair(steps[1], steps[2]), pair(steps[2], steps[1]), pair(steps[0], steps[2])].map((o, i) => ({ ...o, ok: i === 0 })), cls: 'words',
        after: B('Steps 2, then 3.', '2번 다음 3번이에요.'), onRender() { const button = $('.storytext .rd'); if (button) button.onclick = () => say(text, 'en-US'); } };
    }
    if (grade === '1') return stepRound(B('What is the first step?', '첫 번째 할 일을 골라요.'), passage(text), text, steps[0], [steps[1], steps[2]], B(text, text));
    const show = stepCards(steps, ['1)', '2)', '3)']);
    if (lv === 1) {
      const target = rnd(3), ordinal = ['first', 'second', 'last'][target];
      const ko = ['첫 번째', '두 번째', '마지막'][target];
      return stepRound(B('Which is the ' + ordinal + ' step?', ko + ' 할 일은?'), show, text, steps[target],
        steps.filter((_, i) => i !== target), B(text, text));
    }
    const later = rnd(2) === 0, anchor = later ? rnd(2) : 1 + rnd(2), target = anchor + (later ? 1 : -1);
    const clue = steps[anchor][1], direction = later ? 'after' : 'before', ko = later ? '다음' : '바로 전';
    return stepRound(B('What comes ' + direction + ' "' + clue + '"?', '"' + clue + '" ' + ko + '에 할 일은?'),
      show, text, steps[target], steps.filter((_, i) => i !== target), B(text, text));
  });
  add('adinfotopicK', 'K', B('What Do the Steps Make?', '무엇을 만드는 글일까요?'), B('Comprehension: Informational Text', '이해: 정보 글'), lv => {
    const pool = [...projects, ...kTopicProjects];
    const index = rnd(pool.length), [title, picture, steps] = pool[index];
    if (lv === 1) {
      const ds = shuffle(pool.filter((x, j) => j !== index && x[1] !== picture)).filter((x, i, a) => a.findIndex(y => y[1] === x[1]) === i).slice(0, 2);
      return stepRound(B('What do these steps make?', '이 순서로 무엇을 만들까요?'), stepCards(steps), spoken(steps), [picture, title], ds.map(x => [x[1], x[0]]), B(title, title));
    }
    // L2: infer the missing finishing step from the first two steps.
    const shown = steps.slice(0, 2).concat([['❓', '', '']]);
    const wrongs = index < projects.length ? wrongFinish[index].map(j => projects[j][2][2])
      : [kTopicProjects[(index + 5) % kTopicProjects.length][2][2], kTopicProjects[(index + 13) % kTopicProjects.length][2][2]];
    return stepRound(B('What step comes next?', '다음에 할 일은?'), stepCards(shown) + '<small>' + title + '</small>', `Make ${title}. First, ${steps[0][2]}. Next, ${steps[1][2]}. What comes last?`, steps[2], wrongs, B(`${title}: ${steps[2][1]}`, `${title}: ${steps[2][1]}`));
  });
})();
// K-only round selection. Identity ignores distractors/order; keep the last nine
// tasks even across sessions so any ten consecutive rounds are distinct.
(() => {
  'use strict';
  const clean = html => String(html || '').replace(/transform:[^;"']*/g, '');
  const identity = (game, item, tile) => JSON.stringify(tile
    ? [item.ask, item.target]
    : [item.ask, clean(item.show), item.opts.filter(o => o.ok).map(o => [clean(o.html), o.label]),
      game.id === 'compare' ? item.opts.map(o => clean(o.html)) : null]);
  for (const game of GAMES.filter(g => gradeOf(g) === 'K' && g.id !== 'memory')) {
    const make = game.play, histories = new Map(), recentKeys = [];
    game.play = function () {
      const slot = `${S.lang}:${lvl(this.id)}`, state = histories.get(slot) || { recent: recentKeys, pool: new Map() };
      histories.set(slot, state);
      const renderQuiz = window.quiz, renderTile = window.tileRound;
      let selected;
      try {
        for (let attempt = 0; attempt < 256; attempt++) {
          let candidate;
          window.quiz = (_g, item) => { candidate = { item, tile: false }; };
          window.tileRound = (_g, item) => { candidate = { item, tile: true }; };
          make.call(this);
          if (!candidate && this.roundMenu) return; // The entry menu renders without a scored round.
          if (!candidate) throw new Error(`K round is not capturable: ${this.id}`);
          const key = identity(this, candidate.item, candidate.tile);
          state.pool.set(key, candidate);
          if (!state.recent.includes(key)) { selected = { key, ...candidate }; break; }
        }
        if (!selected) {
          const available = [...state.pool].filter(([key]) => !state.recent.includes(key));
          if (!available.length) throw new Error(`K bank exhausted: ${this.id}`);
          const [key, candidate] = pick(available); selected = { key, ...candidate };
        }
      } finally { window.quiz = renderQuiz; window.tileRound = renderTile; }
      state.recent.push(selected.key);
      if (state.recent.length > 9) state.recent.shift();
      // Limit retained generated rounds; histories do not enter localStorage.
      if (state.pool.size > 64) for (const key of state.pool.keys()) {
        if (!state.recent.includes(key)) state.pool.delete(key);
        if (state.pool.size <= 64) break;
      }
      const limit = lvl(this.id) === 2 ? 4 : 3;
      if (!selected.tile && selected.item.opts.length > limit) {
        const correct = selected.item.opts.find(o => o.ok);
        selected.item = { ...selected.item, opts: [correct, ...shuffle(selected.item.opts.filter(o => !o.ok)).slice(0, limit - 1)] };
      }
      return (selected.tile ? renderTile : renderQuiz)(this, selected.item);
    };
  }
})();
