(() => {
'use strict';
// Original miniature passages. Selection practice is not independent writing or oral fluency assessment.
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const reg=(id,en,ko,code,make,subject='read')=>registerGame({id,grade:'3',subject,icon:subject==='write'?'✏️':'📖',title:B(en,ko),sub:B('Read, choose, and explain; listening is optional','읽고 고르고 설명해요 · 듣기는 선택이에요'),area:B(`Grade 3 ${subject==='write'?'Writing':'Reading'} · ${code}`,`3학년 ${subject==='write'?'쓰기':'읽기'} · ${code}`),play(){const item=make(lvl(id));quiz(this,item);}});
const item=(ask,passage,right,wrong,after)=>({ask,askSay:ask,show:passage?`<div class="g3-reading" lang="en">${esc(passage).replaceAll('\n','<br>')}<button type="button" class="g3-listen" aria-label="${L(B('Listen to the English text (reading help)','영어 본문 듣기 (읽기 도움)'))}">🔊 ${L(B('Listen (help)','듣기 도움'))}</button></div>`:'',opts:[right,...wrong].map((s,i)=>({html:`<span class="word" lang="en">${esc(s)}</span>`,ok:i===0})),cls:'words g3-read-options',after:after||B(right,'고른 답을 글과 비교해 봐요.'),vocab:right,onRender(){const b=document.querySelector('.g3-listen');if(b)b.onclick=()=>say(passage,'en-US');const choices=document.querySelector('#spo');if(choices)choices.onclick=()=>[...document.querySelectorAll('.opt .word')].forEach((s,i)=>say(s.textContent,'en-US',i>0));}});
const bank=(id,en,ko,code,rows,subject)=>reg(id,en,ko,code,lv=>{const r=pick(lv===1?rows.slice(0,2):rows);return item(B(r[0],r[1]),r[2],r[3],r.slice(4));},subject);
reg('decode3','Build a Word','낱말 만들기','3.F.P.4.a–c',lv=>{
 const rows=lv===1?[['re','play','replay'],['un','lock','unlock'],['help','ful','helpful'],['hope','less','hopeless']]:[['un','kind','ness','unkindness'],['re','paint','ing','repainting'],['care','less','ness','carelessness'],['dis','like','dislike']];
 const r=pick(rows),word=r[r.length-1],parts=r.slice(0,-1);
 return item(B('Join these word parts. Which word do they make?','낱말 조각을 합치면 어떤 낱말이 될까요?'),parts.join(' + '),word,[parts.slice().reverse().join(''),parts[0]+parts[0]+parts.slice(1).join('')]);
});
reg('affix3','Word Parts','낱말 조각','3.L.V.2',lv=>{
 const rows=[['repack','pack again','stop packing','pack badly'],['unlock','open a lock','make a new lock','lock again'],['fearless','without fear','full of fear','afraid again'],['helpful','giving help','without help','needing a lock'],['reusable','able to be used again','never used','used carelessly'],['carelessness','lack of care','full of care','care again']];const r=pick(lv===1?rows.slice(0,4):rows);
 return item(B('Use the word parts. What does this word mean?','낱말 조각(prefix, suffix)을 보고 뜻을 골라요.'),r[0],r[1],r.slice(2));
});
reg('spell3','Spelling Changes','철자 바꾸기','3.F.P.4.a–c',lv=>{
 const r=pick(lv===1?[['help + ful','helpful','helpfull','helful'],['care + less','careless','careles','carless'],['re + play','replay','reeplay','repley'],['un + kind','unkind','unkined','unkynd']]:[['hope + ing','hoping','hopeing','hopping'],['stop + ed','stopped','stoped','stoppt'],['carry + ed','carried','carryed','carred'],['happy + ness','happiness','happyness','happynes']]);
 return item(B('Join the parts. Make any needed spelling change.','조각을 합쳐요. 필요하면 철자를 바꿔요.'),r[0],r[1],r.slice(2));
});
bank('fluency3','Read in Phrases','뜻 단위로 읽기','3.F.F.1.c (partial)',[
 ['Keep every word. Put / only at the comma.','모든 낱말을 그대로 두고 쉼표 자리에만 /를 넣어요.','After lunch, we read.','After lunch / we read.','After / lunch we read.','After lunch we / read.'],
 ['Keep every word. Put / only at the comma.','모든 낱말을 그대로 두고 쉼표 자리에만 /를 넣어요.','Before bed, I draw.','Before bed / I draw.','Before / bed I draw.','Before bed I / draw.'],
 ['Which words ask a question? Read them with a questioning voice.','묻는 문장을 골라요. 묻는 말투로 읽어 봐요.','Where is my hat? It is on the chair.','Where is my hat?','It is on the chair.','My hat is here.'],
 ['Keep every word. Put / only at the comma.','모든 낱말을 그대로 두고 쉼표 자리에만 /를 넣어요.','When the bell rang, we packed our bags.','When the bell rang / we packed our bags.','When the bell / rang we packed our bags.','When the bell rang we / packed our bags.']]);
bank('context3','Context Clues','문맥 단서','3.L.V.3',[
 ['What does damp mean here?','여기서 damp는 무슨 뜻일까요?','The towel was damp. A little water still clung to it.','slightly wet','very loud','fully dry'],
 ['What does tiny mean here?','여기서 tiny는 무슨 뜻일까요?','A tiny box fit inside my hand. The big box did not.','very small','very noisy','very heavy'],
 ['What does reluctant mean here?','여기서 reluctant는 무슨 뜻일까요?','Ari was reluctant to enter. He stayed at the door and said, "I am not sure I want to go."','not eager to do it','ready and eager','already finished'],
 ['What does sturdy mean here?','여기서 sturdy는 무슨 뜻일까요?','The sturdy stool held a heavy box without bending. The weak stool broke.','strong and solid','easy to break','full of holes']]);
bank('wordshade3','Precise Words','더 정확한 낱말','3.L.V.1 · 3.L.V.3',[
 ['Which word means speaking very quietly?','아주 작은 목소리로 말한다는 뜻의 낱말은?','Mia wanted only her neighbor to hear.','whispering','shouting','yelling'],
 ['Which word means running at full speed?','있는 힘껏 빨리 달린다는 뜻의 낱말은?','Tao ran as fast as he could to the finish.','sprinting','strolling','standing'],
 ['Which word means eating in small bites?','조금씩 베어 먹는다는 뜻의 낱말은?','Lee took one little bite, then another.','nibbling','gulping','pouring'],
 ['Which word means looking briefly?','잠깐 본다는 뜻의 낱말은?','Nora looked at the clock for just a moment.','glancing','staring','sleeping']]);
bank('wordrelation3','Word Relationships','낱말 관계','3.L.V.3.a–b',[
 ['Choose the opposite of begin.','begin과 뜻이 반대인 낱말을 골라요.','','finish','start','open'],
 ['Choose a word with the same meaning as glad.','glad와 뜻이 같은 낱말을 골라요.','','happy','angry','tired'],
 ['What does bank mean in this sentence?','이 문장에서 bank의 뜻을 골라요.','We sat on the river bank to watch the water.','land beside a river','a place to keep money','a tall cloud'],
 ['What does bat mean in this sentence?','이 문장에서 bat의 뜻을 골라요.','The bat flew out at dusk.','an animal','a piece of sports equipment','a kind of shoe']]);
bank('sentence3','Connect Sentences','문장 연결','3.L.GC.2',[
 ['Join both facts without changing their meaning.','두 사실의 뜻을 그대로 살려 한 문장으로 이어요.','I packed a hat. I packed a scarf.','I packed a hat and a scarf.','I packed a hat but no scarf.','I packed only a scarf.'],
 ['Join both facts without changing their meaning.','두 사실의 뜻을 그대로 살려 한 문장으로 이어요.','Jin can swim. Jin can skate.','Jin can swim and skate.','Jin cannot swim or skate.','Jin can swim but cannot skate.'],
 ['Show that rain caused the move indoors.','비가 와서 놀이를 안으로 옮겼다는 뜻이 되게 이어요.','It rained. We moved the game inside.','We moved inside because it rained.','It rained because we moved inside.','We moved inside before any rain.'],
 ['Keep the contrast: wanting to play, yet staying inside.','놀고 싶었지만 안에 있었다는 뜻을 살려 이어요.','I wanted to play. I stayed inside.','I wanted to play, but I stayed inside.','I stayed inside because I hated playing.','I went outside to play.']],'write');
bank('edit3','Edit a Sentence','문장 고치기','3.L.GC.1 · 3.L.GC.2.c',[
 ['Choose the sentence with matching subject and verb.','주어와 동사가 알맞게 어울리는 문장을 골라요.','','The dog runs.','The dog run.','The dog running.'],
 ['Choose the sentence with matching subject and verb.','주어와 동사가 알맞게 어울리는 문장을 골라요.','','The birds sing.','The birds sings.','The birds singing.'],
 ['Keep both actions in the past.','두 행동이 모두 과거가 되도록 빈칸에 알맞은 낱말을 골라요.','Yesterday, I opened the box and __ inside.','looked','look','looking'],
 ['Choose the sentence with matching subject and verb.','주어와 동사가 알맞게 어울리는 문장을 골라요.','','The boxes near the door are heavy.','The boxes near the door is heavy.','The boxes near the door am heavy.']],'write');
bank('purpose3','Why Write This?','왜 쓴 글일까요?','3.T.C.1',[
 ['What does this text ask readers to do?','이 글은 독자에게 무엇을 해 달라고 하나요?','Please join our book swap. Bring a book and find a new story!','join a book swap','buy a bicycle','learn to bake'],
 ['Why was this text written?','이 글을 쓴 목적은 무엇일까요?','To fold the card, bring one edge to the other. Press along the fold.','to give instructions','to tell a joke','to sell a ticket'],
 ['Who most needs this notice?','이 안내가 가장 필요한 사람은 누구일까요?','Library visitors: Return your books at the front desk before closing.','people returning library books','people buying train tickets','people feeding pets'],
 ['Which words show an invitation?','초대한다는 것을 보여 주는 말은?','Come to our puppet show! It starts at two in Room 4.','Come to our puppet show!','It starts at two','in Room 4']]);
bank('viewpoint3','Who Is Telling?','누가 이야기하나요?','3.T.C.2',[
 ['Who tells this story using I?','I를 써서 이야기를 들려주는 사람은?','I am Liv. I built a tower with my brother.','Liv','Liv’s brother','a tower'],
 ['Whose feelings are stated?','누구의 기분이 글에 나와 있나요?','Omar felt nervous. He held his drawing behind his back.','Omar’s','his teacher’s','his neighbor’s'],
 ['How does Ren feel about rain?','Ren은 비를 어떻게 생각하나요?','Ren: "Rain waters my garden!" Bea: "Rain canceled our picnic."','pleased about water for the garden','upset about the picnic','afraid of the garden'],
 ['What do the two speakers disagree about?','두 사람이 다르게 생각하는 것은 무엇인가요?','Sol: "This music is too loud." Kit: "I like the loud music."','whether the loud music is enjoyable','whether music is playing','whether it is silent']]);
bank('character3','Actions Give Clues','행동에서 찾는 단서','3.T.T.1',[
 ['Which action shows helping?','도와주는 행동을 골라요.','Ana saw a dropped pencil. She picked it up for Jo.','picking up Jo’s pencil','looking at the clock','hiding her own pencil'],
 ['Which action shows persistence?','포기하지 않는 행동을 골라요.','The tower fell twice. Max tried again with a wider base.','trying again after it fell','leaving the blocks forever','refusing to try'],
 ['Why did the group finish sooner?','모둠이 더 빨리 마친 까닭은?','Nia divided the jobs. Each friend took one task. They finished before lunch.','Nia shared out the jobs.','Nobody did any work.','They lost their plan.'],
 ['Which detail supports calling Eli considerate?','Eli가 다른 사람을 배려한다는 근거는?','Eli moved his bag so a friend could sit. His bag was blue.','He made room for a friend.','His bag was blue.','He owned a bag.']]);
bank('plot3','Story Connections','이야기 연결','3.T.T.1',[
 ['What happened immediately after the spill?','물을 쏟은 바로 다음에 무슨 일이 있었나요?','A cup tipped. Water spilled. Mina fetched a towel. She wiped the table.','Mina fetched a towel.','A cup tipped.','She wiped the table.'],
 ['What happened first?','무슨 일이 가장 먼저 있었나요?','Bo drew a kite. Then he cut it out. Last, he added string.','Bo drew a kite.','Bo cut it out.','Bo added string.'],
 ['What caused the paper to blow away?','종이가 날아간 까닭은?','A gust came through the window. The loose paper blew off the desk.','a gust through the window','someone closing a book','a pencil rolling'],
 ['Which action solved the problem?','문제를 해결한 행동은 무엇인가요?','The gate would not close. A stone blocked it. Jo moved the stone, and the gate shut.','Jo moved the stone.','Jo painted the gate.','Jo left the stone there.']]);
bank('textstructure3','Text Structure','글 구조 탐정','3.T.SS.1',[
 ['Which heading fits this section?','이 부분에 맞는 소제목은?','Put the crayons in one box. Put the paper on the shelf.','Storing Art Supplies','Making a Sandwich','Walking a Dog'],
 ['Which word signals the last step?','마지막 단계를 알려 주는 낱말은?','First, fold. Next, press. Finally, open.','Finally','First','Next'],
 ['How is this text organized?','이 글은 어떤 짜임으로 쓰였나요?','The path flooded because heavy rain filled the ditch.','cause and effect','alphabetical list','description of a person'],
 ['Which heading helps you find the materials?','준비물을 찾으려면 어느 소제목을 봐야 하나요?','Headings: What You Need / Steps / Cleaning Up','What You Need','Steps','Cleaning Up']]);
bank('evidence3','Find the Evidence','근거 찾기','3.T.RA.2',[
 ['Which detail tells where the key was?','열쇠가 어디 있었는지 알려 주는 근거는?','The key was under the mat. The mat was green. Jo smiled.','The key was under the mat.','The mat was green.','Jo smiled.'],
 ['Which detail tells why the box was heavy?','상자가 무거웠던 까닭을 알려 주는 근거는?','The box held ten rocks. It had a red lid. Lin carried it slowly.','The box held ten rocks.','It had a red lid.','Lin carried it slowly.'],
 ['Which detail supports that no one had used the path recently?','최근에 길을 이용한 사람이 없었다는 생각을 뒷받침하는 근거는?','Fresh snow covered the path without footprints. A red sign stood beside it.','snow without footprints','the red sign','the sign beside the path'],
 ['Which detail supports that Sam was prepared for rain?','Sam이 비에 대비했다는 근거는?','Sam packed an umbrella. His backpack was green. He left at eight.','Sam packed an umbrella.','His backpack was green.','He left at eight.']]);
bank('explain3','Build an Explanation','설명하는 글 만들기','3.T.T.2',[
 ['Choose a detail about organizing this shelf.','이 선반을 정리하는 방법에 맞는 내용을 골라요.','Topic: Organizing our classroom shelf','Keep drawing paper in one tray.','The bus was late today.','I like swimming.'],
 ['Choose a detail that explains how to borrow a class book.','학급 책을 빌리는 방법을 설명하는 내용을 골라요.','Topic: Borrowing a class book','Write your name on the borrowing list.','My shoes have blue laces.','The game ended yesterday.'],
 ['Choose a closing sentence about this method.','이 방법을 정리하는 끝 문장을 골라요.','We sort blocks by size. Large blocks go below small blocks.','This keeps the blocks sorted by size.','Birds flew over the playground.','Tomorrow I will buy a hat.'],
 ['Choose a sentence that explains the step.','단계의 이유를 설명하는 문장을 골라요.','Press the fold flat before opening the card.','A flat fold makes a clear crease.','The card belongs to my cousin.','The desk is beside the door.']],'write');
bank('opinion3','Opinions and Reasons','의견과 이유','3.T.T.3',[
 ['Which reason supports this opinion?','이 의견을 뒷받침하는 이유는?','I think our class should have a book swap.','We could try books our friends enjoyed.','My socks are green.','Our clock has numbers.'],
 ['Which reason supports this opinion?','이 의견을 뒷받침하는 이유는?','I think we should label the supply bins.','Labels would help us find supplies.','Yesterday was Tuesday.','My jacket has pockets.'],
 ['Which example supports the reason?','이유를 뒷받침하는 예는?','I prefer partner reading because partners can help each other.','My partner helped me read a new word.','I read alone all afternoon.','We never opened our books.'],
 ['Which closing sentence returns to the opinion?','처음 의견으로 돌아가 마무리하는 문장은?','Our class should display student art so visitors can see our work.','Let’s make a space for our art.','The bus turns at the corner.','My lunch is in a bag.']],'write');
bank('poetry3','Poetry Patterns','시 속의 규칙','3.T.T.4.a',[
 ['Which end words rhyme?','각 행의 끝 낱말 중 끝소리가 같은 짝은?','I set my lantern by the light.\nIt kept me company at night.','light / night','set / lantern','company / by'],
 ['How many lines are in this poem?','이 시는 몇 행인가요?','A red leaf spins.\nA cool breeze sings.\nThe day begins.','3','2','4'],
 ['Use the end sounds. Which rhyme pattern fits?','각 행의 끝소리를 보고 알맞은 라임 규칙(rhyme pattern)을 골라요.','We sailed a boat.\nWe wore a coat.\nWe saw a tree.\nBeside the sea.','AABB','ABAB','ABBA'],
 ['Which words repeat the same beginning sound?','처음 소리가 반복되는 낱말 짝은?','Silver stars softly shine.\nTheir little lights are mine.','Silver / stars','little / mine','shine / lights']]);
bank('source3','Little Researcher','작은 조사','3.T.RA.1',[
 ['Which card answers when the club meets?','동아리가 언제 모이는지 알려 주는 카드는?','Practice cards: A—Club notice: We meet Friday. B—Art list: Bring crayons.','Card A','Card B','Neither card'],
 ['Which card answers what to bring?','무엇을 가져올지 알려 주는 카드는?','Practice cards: A—Club notice: We meet Friday. B—Art list: Bring crayons.','Card B','Card A','Neither card'],
 ['Which fact is supported by BOTH cards?','두 카드가 모두 뒷받침하는 사실은?','Practice cards: A—Class log: We planted beans Monday. B—Garden log: Our bean planting was Monday.','Beans were planted Monday.','The beans grew one meter.','Everyone planted carrots.'],
 ['Which source should be recorded for the meeting time?','모임 시각의 출처로 무엇을 기록해야 하나요?','Practice cards: A—Club notice: Meet at 3. B—Supply list: Paper and glue.','Card A: Club notice','Card B: Supply list','An unnamed website']]);
bank('revise3','Revise for Clarity','글 다듬기','3.L.GC.2 · 3.T.T.1–3',[
 ['Remove repeated words; keep both colors.','반복을 줄이고 두 색을 모두 남겨요.','The kite is red. The kite is blue.','The kite is red and blue.','The kite is only red.','The kite has no color.'],
 ['Keep both actions with less repetition.','반복을 줄이고 두 행동을 모두 남겨요.','I washed the cup. I dried the cup.','I washed and dried the cup.','I washed but never dried the cup.','I broke the cup.'],
 ['Keep the action and the detail about weight.','행동과 무게에 관한 내용을 모두 살려요.','The box was heavy. I carried the box.','I carried the heavy box.','I carried the empty bag.','I dropped the light box.'],
 ['Add a precise detail about how the door opened.','문이 어떻게 열렸는지 구체적으로 나타내요.','The door opened. It made a loud squeak.','The door opened with a loud squeak.','The door opened silently.','The door stayed shut.']],'write');
})();
