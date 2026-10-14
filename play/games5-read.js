(() => {
'use strict';
const decks=new Map();
const take=(id,lv)=>{const k=`${id}:${lv}:${S.lang}`;let d=decks.get(k);if(!d){d=shuffle(Array.from({length:10},(_,i)=>i));decks.set(k,d);}const i=d.shift();d.push(i);return i;};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const item=(ask,text,right,wrong)=>({ask,askSay:B(ask.en,/[A-Za-z]/.test(ask.ko)?'영어 질문을 들어 보세요.':ask.ko),askExtra:S.lang==='ko'&&/[A-Za-z]/.test(ask.ko)?{t:ask.en,lang:'en-US'}:undefined,show:`<div class="g5-reading" lang="en">${esc(text).replaceAll('\n','<br>')}<button class="g5-read-listen" type="button" aria-label="${L(B('Listen to English text; reading help','영어 본문 듣기 · 읽기 도움'))}">🔊 ${L(B('Listen (help)','듣기 도움'))}</button></div>`,opts:[right,...wrong].map((x,i)=>({html:`<span class="word" lang="en">${esc(x)}</span>`,ok:i===0})),cls:'words g5-read-options',after:B(`Answer: ${right}. Check the clues and question conditions.`,`정답: ${right} · 본문의 단서와 질문 조건을 확인해요.`),vocab:right,onRender(){const b=document.querySelector('.g5-read-listen');if(b)b.onclick=()=>say(text,'en-US');const c=document.querySelector('#spo');if(c)c.onclick=()=>[...document.querySelectorAll('.opt .word')].forEach((x,i)=>say(x.textContent,'en-US',i>0));}});
const reg=(id,en,ko,code,make,subject='read')=>registerGame({id,grade:'5',subject,icon:subject==='write'?'✏️':'📖',title:B(en,ko),sub:B('Short texts · partial practice; listening is help','짧은 글 · 부분 연습 · 듣기는 읽기 도움이에요'),area:B(`Grade 5 ${subject==='write'?'Writing':'Reading'} · ${code}`,`5학년 ${subject==='write'?'쓰기':'읽기'} · ${code}`),play(){const lv=lvl(id)>1?2:1,i=take(id,lv),it=make(lv,i);it.itemKey=`${id}:${lv}:${i}`;quiz(this,it);}});
const rows=s=>{const out=[];let lines=[];for(const line of s.trim().split('\n')){if(!line.includes('|')){lines.push(line);continue;}const r=line.split('|');if(lines.length){r[0]=[...lines,r[0]].join('\n');lines=[];}out.push(r);}if(lines.length)throw new Error('Unfinished reading row');return out;};
const bank=(id,en,ko,code,ask,sets,subject)=>reg(id,en,ko,code,(lv,i)=>{const r=sets[lv-1][i];let prompt=ask[lv-1];if(id==='context5'){const word=(lv===1?['fragile','narrow','abundant','vacant','transparent','damp','sturdy','rapid','enormous','optional']:['reluctant','depleted','diverged','somber','intermittently','ambiguous','improvised','conserved','muted','temporary'])[i];prompt=B(`What does ${word} mean here?`,`여기서 ${word}의 뜻을 골라요.`);}return item(prompt,r[0],r[1],r.slice(2,4));},subject);
reg('decode5','Decode Word Parts','철자와 뜻을 가진 낱말 조각','5.F.P.4.a–c',(lv,i)=>{
const r=(lv===1?rows('sun|set|sunset\nrab|bit|rabbit\npic|nic|picnic\nbas|ket|basket\nmag|net|magnet\nnap|kin|napkin\nvel|vet|velvet\nmuf|fin|muffin\nden|tist|dentist\nhel|met|helmet'):rows('re|paint|ing|repainting\nun|help|ful|unhelpful\ndis|agree|ment|disagreement\nhope|less|ness|hopelessness\nfear|less|ness|fearlessness\npre|heat|ing|preheating\nre|play|ing|replaying\nun|thank|ful|unthankful\nmis|place|ment|misplacement\ncare|less|ness|carelessness'))[i],word=r.pop();return item(B(lv===1?'Join the spelling chunks. Which word?':'Join the meaningful word parts. Which word?',lv===1?'철자 조각을 합쳐서 낱말을 만들어요.':'뜻을 가진 낱말 조각을 합쳐요.'),r.join(' + '),word,[r.slice().reverse().join(''),r[0]+r[0]+r.slice(1).join('')]);});
reg('roots5','Roots in Context','어근으로 뜻 찾기','5.L.V.2.a–c',(lv,i)=>{
const r=(lv===1?rows(`biography: bio = life; graph = write|a written account of a life|a study of rocks|a device measuring heat
autograph: auto = self; graph = write|a person’s own signature|a picture of mountains|a listening device
photograph: photo = light; graph = record|an image recorded using light|a sound carried by a wire|a report about water
telephone: tele = far; phon = sound|a device carrying sound over distance|a tool measuring weight|a book about plants
television: tele = far; vis = see|a system sending moving pictures over distance|a paper map|a tool carrying water
portable: port = carry; able = can be|able to be carried|unable to move|having many pages
transport: trans = across; port = carry|carry between places|look very closely|write about a life
inspect: spect = look|look at closely|carry far away|make a loud sound
spectator: spect = look|someone watching an event|someone making a map|someone measuring heat
biology: bio = life; logy = study|the study of living things|the study of numbers|a written signature`):rows(`I wrote an autobiography about my childhood.|a book about the writer’s own life|a book about someone else only|a weather report
In geography, we studied rivers and land.|the study of places and Earth’s features|the study of sounds|the study of spelling only
The telegraph sent a message to a far town.|a system sending messages over distance|a plant-growing device|a water-freezing device
Hydropower uses moving water. Hydro means water.|power from water|power from sunlight only|power from wind only
Hydration replaced the plant’s lost water.|supplying water|removing water|adding light
The machine can dehydrate fruit.|remove water|supply water|make sound louder
The microphone changed voices into electrical signals.|a device that picks up sound|a land-measuring tool|a carrying device
She used a megaphone so the crowd could hear.|a device making a voice carry farther|a close-photography tool|an author’s life story
Sea and see are homophones.|words with the same sound|words with opposite meanings|words with identical spellings
The telescope showed a distant object.|an instrument for viewing far objects|a nearby-sound recorder|a water container`))[i];return item(B(lv===1?'Use the Greek or Latin root clue. Which meaning fits?':'Use the roots and the context. Which meaning fits?',lv===1?'그리스어·라틴어 어근 단서로 뜻을 골라요.':'어근과 문맥을 함께 보고 뜻을 골라요.'),r[0],r[1],r.slice(2));});
reg('spell5','Spelling Changes','철자 변화','5.F.P.4 · 5.L.V.2.c',(lv,i)=>{const r=(lv===1?rows('help + ful|helpful|helpfull|helful\ncare + less|careless|careles|carless\nfear + less|fearless|fearles|feerless\nkind + ness|kindness|kindnes|kindniss\nslow + ly|slowly|slowley|sloly\nteach + er|teacher|teecher|techer\npay + ment|payment|paiment|paymment\njoy + ful|joyful|joyfull|joiful\ndark + ness|darkness|darknes|darckness\nwash + able|washable|washible|washeable'):rows('happy + ness|happiness|happyness|happines\nhappy + ly|happily|happyly|happilly\ncopy + ed|copied|copyed|coppied\nstudy + es|studies|studyes|studdies\nhope + ing|hoping|hopeing|hopping\nuse + able|usable|useablee|ussable\nbake + er|baker|bakeer|bakker\nplan + ed|planned|planed|plannedd\nrun + ing|running|runing|runnning\nbig + er|bigger|biger|biggger'))[i];return item(B('Join the parts; make any needed spelling change.','조각을 합쳐요. 필요하면 철자를 바꿔요.'),r[0],r[1],r.slice(2));});
bank('fluency5','Read for Meaning','뜻을 살려 읽어요','5.F.F.1.b–d (partial)',[B('Replace the comma with /. Keep the words in order.','쉼표를 /로 바꾸어요. 낱말 순서는 그대로 두어요.'),B('Which reading decision preserves the meaning?','뜻을 살리는 읽기 방법을 골라요.')],[rows(`After the rain, the field glistened.|After the rain / the field glistened.|After / the rain the field glistened.|After the rain the / field glistened.
Before our meeting, we checked the map.|Before our meeting / we checked the map.|Before / our meeting we checked the map.|Before our meeting we / checked the map.
Although tired, the team finished.|Although tired / the team finished.|Although / tired the team finished.|Although tired the / team finished.
In the distance, a bell rang.|In the distance / a bell rang.|In / the distance a bell rang.|In the distance a / bell rang.
When the lights dimmed, everyone sat.|When the lights dimmed / everyone sat.|When the lights / dimmed everyone sat.|When the lights dimmed everyone / sat.
If the wind stops, we can sail.|If the wind stops / we can sail.|If the / wind stops we can sail.|If the wind stops we / can sail.
Beside the pond, a turtle rested.|Beside the pond / a turtle rested.|Beside / the pond a turtle rested.|Beside the pond a / turtle rested.
At the end of the path, we turned.|At the end of the path / we turned.|At the end / of the path we turned.|At the end of the path we / turned.
For the first time, I felt confident.|For the first time / I felt confident.|For / the first time I felt confident.|For the first time I / felt confident.
Without a sound, the cat slipped away.|Without a sound / the cat slipped away.|Without / a sound the cat slipped away.|Without a sound the / cat slipped away.`),rows(`“Is this your bag?” she asked.|Use a questioning voice.|Read it as a command.|Ignore the question mark.
Stop! The bridge is unsafe.|Stress the urgent warning.|Use a sleepy tone.|Read Stop as a question.
I wanted to go, but stayed to help.|Pause at the contrast after go.|Stop between wanted and to.|Leave out but.
We need paper, glue, and string.|Pause between list items.|Join paperglue as one word.|Skip the last item.
The blue boat—not the red one—won.|Treat the middle phrase as an aside.|Say both boats won.|Omit not.
If it snows, the trip will change.|Keep condition and result together.|Treat change as a question.|Read only the condition.
“Come inside,” he said softly.|Use a gentle voice.|Shout throughout.|Read comma as a word.
I read desert as dessert, then noticed “dry sand.”|Reread using the dry-land meaning.|Keep dessert.|Skip the sentence.
The box was heavy; nevertheless, she lifted it.|Mark the contrast.|Read she could not lift it.|Ignore the second clause.
First check the latch; next, open the gate.|Read in the given order.|Reverse the actions.|Read next before first.`)]);
bank('context5','Context Clues','문맥 속 뜻','5.L.V.3.a',[B('Which meaning fits the key word?','문맥 속 낱말의 뜻을 골라요.'),B('Infer the meaning from cause or contrast.','원인이나 서로 다른 점을 보여 주는 단서로 뜻을 짐작해요.')],[rows(`The fragile glass broke with a small tap.|easily broken|very flexible|extremely loud
The narrow path fit only one walker.|not wide|not safe to touch|covered with ice
The abundant crop filled many baskets.|more than enough|almost absent|fully rotten
The room was vacant; nobody occupied it.|empty|noisy|crowded
The transparent lid let us see inside.|see-through|heavy|unbreakable
The damp cloth still held a little water.|slightly wet|completely dry|very smooth
The sturdy shelf held heavy books.|strong and solid|easily bent|brightly colored
The rapid stream moved very quickly.|fast|shallow|silent
The enormous tent covered the yard.|very large|nearly invisible|rather tiny
The task was optional; students could choose it.|not required|forbidden|already finished`),rows(`Maya was reluctant to perform. She lingered while others volunteered.|not eager|unable to hear|ready to rush
The battery was depleted, so the lamp went dark.|used up|made larger|connected safely
The trail diverged: one path went up, one down.|split in different directions|ended at once|became one path
Unlike the cheerful note, the reply was somber.|serious and sad|bright and playful|quickly written
The radio crackled intermittently, with silent gaps.|from time to time|without stopping|at maximum volume
The instructions were ambiguous: each reader built a different shape.|open to more than one meaning|very brief only|written in red
Ari improvised a paddle from a board when his broke.|made a solution from available materials|copied a complete plan|refused to act
The town conserved water by reducing waste.|used carefully to avoid waste|gave away all|turned into ice
The bird’s muted colors blended into gray branches.|soft and not bright|extremely shiny|changing constantly
The repair was temporary; a permanent bridge would follow.|lasting a limited time|lasting forever|finished too late`)]);
bank('analogy5','Word Relationships','낱말 관계','5.L.V.3.b',[B('Complete the same relationship.','같은 낱말 관계가 되도록 채워요.'),B('Use the relationship or context.','낱말 관계나 문맥으로 골라요.')],[rows(`page : book :: petal : __|flower|leaf|seed
brush : paint :: broom : __|sweep|cook|sew
cow : calf :: sheep : __|lamb|foal|cub
hot : cold :: early : __|late|soon|first
begin : start :: finish : __|end|open|try
seed : plant :: egg : __|chick|nest|feather
wheel : bicycle :: blade : __|scissors|paper|glue
chef : kitchen :: teacher : __|classroom|harbor|forest
rain : wet :: sunlight : __|warm|dark|icy
foot : shoe :: hand : __|glove|hat|sock`),rows(`silent : quiet :: tiny : __|small|huge|wide
expand : contract :: advance : __|retreat|travel|begin
chapter : novel :: scene : __|play|recipe|index
thermometer : temperature :: ruler : __|length|weight|time
The bass swam near the dock. Bass is __.|a fish|a low musical range|a rope
They wound the clock. Wound means __.|turned to tighten a spring|an injury|a gust
The crane lifted a beam. Crane is __.|a lifting machine|a bird|an insect
The band’s conductor raised a baton. Baton is __.|a conductor’s stick|a relay stick|a tree branch
The river bank held grass. Bank is __.|land beside water|a money business|a cloud
He repaired a tear in fabric. Tear is __.|a rip|a drop from an eye|a noise`)]);
bank('wordshade5','Precise Words','뜻의 미묘한 차이','5.L.V.3.c',[B('Choose the precise action word.','행동에 정확히 맞는 낱말을 골라요.'),B('Match all the stated conditions.','설명한 조건에 모두 맞게 골라요.')],[rows(`Speak quietly so only a nearby friend hears.|whisper|shout|announce
Run at full speed in a short race.|sprint|stroll|crawl
Look at the clock for just a moment.|glance|stare|ignore
Walk slowly for pleasure, without hurry.|stroll|dash|charge
Eat with tiny repeated bites.|nibble|gulp|pour
Shine with faint, unsteady light.|glimmer|blaze|darken
Close a door with a loud forceful bang.|slam|ease|open
Hold tightly so it cannot slip.|grip|drop|release
Shiver from cold.|tremble|giggle|relax
Talk about a problem to find a solution.|discuss|sing|sleep`),rows(`A reporter needs a neutral verb: the witness gave facts without arguing.|stated|boasted|pleaded
Someone asks urgently for help, without ordering it.|pleaded|commanded|muttered
Someone walks with difficulty because an ankle hurts.|limped|marched|wandered
A boat moves gently without steering or power.|drifted|raced|sank
A lamp emits strong steady light, not a faint flicker.|glowed|glimmered|vanished
A student looks closely for details.|examined|glanced|ignored
Quiet pleasure produces a small smile, not loud laughter.|smiled|roared|sobbed
A speaker talks unclearly in a low voice.|mumbled|declared|screamed
The room is slightly cool, not bitterly cold.|cool|freezing|scorching
Someone moves quickly, but not necessarily at top speed.|hurried|sprinted|sauntered`)]);
reg('reference5','Read Dictionary Entries','사전 자료 읽기','5.L.V.3.d',(lv,i)=>{const r=(lv===1?rows(`harbor: sheltered water for boats|a safe place for boats|a steep mountain|a racing track
trail: a path for travel|a route people follow|a cutting tool|a room
canopy: an overhead covering|a covering above|a tunnel below|a shelf below
observe: watch carefully|watch with attention|forget a detail|give an order
repair: fix damage|make something work again|break it deliberately|carry it away
compare: examine similarities and differences|find what is alike and different|guess without looking|put something away
annual: happening once each year|once per year|every hour|only once ever
fertile: able to support plant growth|good for growing plants|always frozen|without minerals
predict: say what may happen|describe a possible future|report only the past|copy a result
precise: exact and careful|exact|uncertain|very large`):rows(`bank: 1 money business; 2 land along water. We sat by the stream on the bank.|2|1|neither
bat: 1 flying mammal; 2 sports club. The bat slept in the cave.|1|2|neither
crane: 1 bird; 2 lifting machine. The crane moved the beam.|2|1|neither
light: 1 illumination; 2 not heavy. The light bag was easy to lift.|2|1|neither
scale: 1 weighing device; 2 fish covering. We weighed flour on the scale.|1|2|neither
current: 1 water flow; 2 happening now. The raft followed the current.|1|2|neither
seal: 1 marine mammal; 2 close tightly. Seal the jar.|2|1|neither
spring: 1 season; 2 elastic coil. The spring in the chair broke.|2|1|neither
rock: 1 stone; 2 move back and forth. The waves rock the boat.|2|1|neither
charge: 1 ask a price; 2 rush forward. The shop will charge five dollars.|1|2|neither`))[i];return item(B(lv===1?'Use the original glossary. Choose the meaning.':'Which numbered definition fits?',lv===1?'이 용어 풀이에 맞는 뜻을 골라요.':'문장에 맞는 뜻의 번호를 골라요.'),r[0],r[1],r.slice(2));});
bank('sentence5','Connect Ideas','문장 뜻 잇기','5.L.GC.2 · 5.T.SS.1.c–d',[B('Keep the stated relation.','설명한 관계에 맞는 연결어를 골라요.'),B('Preserve both ideas.','두 생각을 모두 살린 문장을 골라요.')],[rows(`Cause: We stayed inside __ rain began.|because|although|unless
Contrast: He was tired, __ he finished.|but|so|because
Time: Wash your hands __ eating.|before|unless|because
Condition: We can play __ the field is dry.|if|although|because
Addition: We packed water __ fruit.|and|but|unless
Result: The bridge closed, __ we took another road.|so|although|before
Example: Pack a tool, __ a ruler.|such as|unless|although
Comparison: This rope is longer __ that one.|than|because|if
Time: We cleaned up __ the meeting ended.|after|unless|despite
Contrast: __ it was cold, she wore a light coat.|Although|Because|So`),rows(`Rain caused the show to stop.|The show stopped because rain began.|Rain began because the show stopped.|The show stopped before rain.
Nora wanted to leave yet stayed to help.|Nora stayed although she wanted to leave.|Nora left without helping.|Nora never wanted to leave.
Only a signed form permits the trip.|You may go only if the form is signed.|You may go without a signed form.|Signing forbids the trip.
Both teams practiced and improved.|Both practiced, and both improved.|Neither improved.|Neither practiced.
Packing happens before the bus arrives.|Pack before the bus arrives.|Pack after the bus leaves.|Unpack when it arrives.
The ice melted because the room warmed.|The room’s warming caused the ice to melt.|The room warmed because ice was added.|The ice froze as it warmed.
Lee brought apples; Sam brought pears.|Lee brought apples, while Sam brought pears.|Both brought only apples.|Lee brought neither fruit.
The class read first, then discussed.|After reading, the class discussed.|The class discussed before reading.|The class never discussed.
The red bag costs more than the blue bag.|The blue bag costs less.|Both cost the same.|The red bag costs less.
The road was blocked, so the delivery used the train.|The blocked road led to using the train.|The train caused the road to open.|The delivery used the blocked road.`)],'write');
bank('edit5','Edit a Sentence','문장 표기 고치기','5.L.GC.1',[B('Follow the named rule.','설명한 문법·표기 규칙에 맞게 골라요.'),B('Edit without changing the meaning.','설명한 뜻을 유지하며 고쳐요.')],[rows(`Singular indefinite pronoun: everyone.|Everyone has a ticket.|Everyone have a ticket.|Everyone having a ticket.
Singular indefinite pronoun: each.|Each is sealed.|Each are sealed.|Each be sealed.
Opening clause needs a comma.|After the bell rang, we left.|After the bell rang we, left.|After, the bell rang we left.
Opening phrase needs a comma.|Before dinner, I set the table.|Before, dinner I set the table.|Before dinner I, set the table.
Keep the dependent clause with a full sentence.|Because it rained, we stayed.|Because it rained.|Because it rained we.
Match the intensive pronoun to I.|I myself made it.|I himself made it.|I ourselves made it.
Match the intensive pronoun to she.|She herself checked it.|She myself checked it.|She themselves checked it.
Match the intensive pronoun to we.|We ourselves planned it.|We itself planned it.|We herself planned it.
A short poem title uses paired quotation marks.|We read “Morning Path.”|We read “Morning Path.|We read Morning Path.”
A full book title is italicized. Choose the instruction.|Italicize the book title.|Capitalize the entire paragraph.|Delete the title.`),rows(`Preserve singular agreement for each student.|Each student has a folder.|Each student have a folder.|Each student are a folder.
Nobody was absent. Keep past tense.|Nobody was absent.|Nobody were absent.|Nobody are absent.
Set off the opening clause about rain.|When the rain stopped, we left.|When, the rain stopped we left.|When the rain stopped we, left.
The team members checked their own work. Stress them.|They themselves checked it.|They himself checked it.|They myself checked it.
We stay if lightning continues. Keep the condition.|Unless lightning stops, we will stay.|Unless lightning stops, we leave.|We cause lightning to stop.
Ari saw Ben while Ari carried a box. Remove ambiguity.|While Ari carried a box, Ari saw Ben.|While Ben carried a box, Ari saw Ben.|Ben carried Ari’s box.
Packing finished before the bus arrived. Keep the order.|We had packed before the bus arrived.|We will pack after it arrives.|We packed after it arrived.
Set off the introductory phrase.|With great care, Maya lifted it.|With great care Maya, lifted it.|With, great care Maya lifted it.
Match an intensive pronoun to he.|He himself built it.|He themselves built it.|He yourself built it.
A short story title needs paired quotation marks.|We read “The Quiet Gate.”|We read “The Quiet Gate.|We read The Quiet Gate.”`)],'write');
bank('purpose5','Audience and Purpose','독자와 목적','5.T.C.1',[B('What is the main purpose?','주된 목적을 골라요.'),B('Match the audience and purpose.','독자와 목적에 맞는 표현을 골라요.')],[rows(`Join our garden club on Friday!|invite participation|explain a machine|tell an adventure
Turn the handle, then lift the lid.|give instructions|describe a character|argue about taxes
The library closes Saturday at noon.|announce useful information|tell a joke|sell a bicycle
Add a reading corner; quiet seats help us focus.|persuade with a reason|describe a storm|list bus stops
Roots absorb water; leaves use light.|explain a process|invite a guest|tell a mystery
The dragon hid a bell under its wing.|entertain with a story|report real measurements|give safety rules
Dear principal, may we use the courtyard?|request permission|explain word roots|describe a journey
The bottle holds 500 milliliters.|report a measurement|ask for help|invite someone
Trail closed for repairs. Do not enter.|warn and guide|advertise a toy|tell a poem
Thank you for repairing our bench.|express appreciation|announce a price|give a recipe`),rows(`Invite young students clearly.|Come try our club Friday after school!|Attendance is mandatory forever.|This reports water temperatures.
Explain a rule to new visitors.|Please sign in at the desk.|Do the usual.|The desk is a monster.
Ask a principal politely for a room.|May our club use room 4 Tuesday?|Give us the room now!|Room 4 is blue.
Write a report without overclaiming.|In three trials, the covered cup lost less water.|Every lid always works perfectly.|The greatest discovery ever!
Warn hikers clearly.|Trail closed; use the marked alternate route.|The forest is always dangerous.|Hurry through the closed trail.
Persuade classmates with a relevant reason.|A book swap lets us share existing books.|Blue is my favorite color.|Bring all possessions.
Explain a new device.|Press green to start the timer.|Activate it as usual.|Green reminds me of grass.
Thank a volunteer specifically.|Your repair made the bench usable.|You did some stuff.|No repair happened.
Give a schedule to families.|Concert: 6 p.m. in the gym.|The concert is wonderful.|Attend whenever you like.
Invite a garden expert politely.|Could you share how you plan gardens?|Tell all secrets now!|Gardens exist.`)]);
bank('viewpoint5','Compare Viewpoints','관점 비교','5.T.C.2.a,c',[B('Identify the narrator’s viewpoint.','서술자의 관점을 보여 주는 표현을 골라요.'),B('How do the accounts differ?','두 기록의 관점은 어떻게 다를까요?')],[rows(`I waited at the finish for my friend.|I and my show first person|he shows first person|they show first person
Nora checked her bag.|Nora and her show third person|The narrator uses “I”|The narrator uses “we”
We built our bridge together.|We and our show first person|she shows first person|Nora shows first person
He noticed the missing key.|He shows third person|I shows third person|our shows third person
My hands shook as I stepped onstage.|My and I show first person|they show first person|he shows first person
The children watched their teacher draw.|The narrator describes others in third person.|The narrator uses “I”.|The narrator uses “we”.
I knew why I hid the note.|The narrator reports their own thoughts.|An outside observer reports no thoughts.|The author must be this character.
Sam wondered if he could fix it.|An outside narrator tells Sam’s thought.|Sam uses I to narrate.|No thought is shown.
We could not see around the bend.|The narrators’ knowledge is limited.|They know every future event.|No narrator speaks.
Rina smiled, but Lee did not know why.|Lee’s knowledge is limited.|Lee knows Rina’s reason.|Everyone knows everything.`),rows(`A: I loved the crowd. B: The crowd was too loud; I wanted a quiet room.|They react differently to the crowd.|Both dislike it.|Neither mentions it.
A: The path saved my walk. B: It removed part of our garden.|One values convenience; one notes a loss.|Both describe only benefits.|Both oppose walking.
A: It felt easy after practice. B: I was new and felt lost.|Experience affects their reactions.|Both have equal practice.|Rules must differ.
A: I heard music backstage. B: From my seat I watched lights.|Different locations reveal different details.|Both stand backstage.|Neither observes anything.
A: I planted seeds. B: I later saw sprouts.|One plants; one observes a later result.|Both planted together.|Both saw no plants.
A: I liked leading. B: I wanted a turn too.|Their roles and wishes differ.|Both already led.|Neither wants to lead.
A: Noise kept me awake. B: I liked the celebration.|The same event affects them differently.|Both slept happily.|The event was silent.
A: I thought it was stuck. B: I knew the latch location.|They have different information.|Both know the latch.|Neither sees a door.
A: I feared the storm. B: I studied it from shelter.|One focuses on fear; one on observation.|Shelter guarantees no risk.|Both caused the storm.
A: I lost a sketch. B: I found one with no owner’s name.|Each knows part of the situation.|Both know everything.|Neither has a sketch.`)]);
bank('character5','Character and Conflict','인물과 갈등','5.T.T.1.a–b',[B('Which action addresses the problem?','문제를 해결하려는 행동을 골라요.'),B('What role does this event or setting play?','사건이나 배경이 하는 역할을 골라요.')],[rows(`Nora lost a sketch. She retraced her steps.|retracing her steps|losing the sketch|forgetting its color
Lee’s bridge fell. He strengthened its supports.|strengthening supports|watching it fall|painting the floor
Sam missed practice. He asked for notes.|asking for notes|missing practice|hiding his bag
Ari broke a promise. He apologized and set a reminder.|apologizing and setting a reminder|forgetting the promise|blaming the clock
Maya could not reach a shelf. She asked an adult.|asking for help|guessing its color|waiting without speaking
Jo and Ben disagreed. They listened to each other.|listening to both plans|refusing to talk|counting pencils
Kai’s plant wilted. He checked watering notes.|checking watering notes|naming the plant|hiding the notebook
Rina feared a speech. She practiced with a friend.|practicing with a friend|skipping every rehearsal|closing the room
Tao spilled paint. He cleaned and replaced the paper.|cleaning and replacing paper|hiding the spill|changing the subject
Dee’s map lacked a bridge. She marked a verified crossing.|marking a verified crossing|ignoring the gap|folding the map`),rows(`Rain closed the field. The team planned indoor practice.|Weather forces a new plan.|Weather ends all teamwork.|Setting has no effect.
The library was silent. Ari wrote his question instead of calling.|The setting shapes his choice.|He forgot how to speak.|The library has no rules.
A second failure led Jo to ask an expert.|Failure changes her strategy.|Learning is impossible.|The expert disappears.
Sam heard another account and corrected his accusation.|New information changes his judgment.|He keeps the accusation.|No decision changes.
A delayed bus made Nora call the organizer.|A delay creates a problem she addresses.|Nora caused the delay.|Calling reverses time.
A locked gate made Lee find the marked entrance.|An obstacle redirects his route.|The gate supplies a key.|The route stays identical.
Maya’s partner found a mistake. Their revision worked.|Cooperation helps solve the problem.|Nobody gives input.|The error stays unchanged.
A broken tool made Kai improvise a safe replacement.|The break tests resourcefulness.|Appearance proves carelessness.|The tool fixes itself.
A visitor taught Rina a new seed-sorting method.|The encounter adds knowledge.|Rina already knew it.|The visitor takes every seed.
Dee returned a notebook and gained its owner’s trust.|Her action builds a relationship.|Trust predates their meeting.|Returning destroys the friendship.`)]);
bank('theme5','Change and Theme','성장과 주제','5.T.T.1.c–d',[B('Choose a theme supported by the story.','이야기가 뒷받침하는 주제를 골라요.'),B('What do both stories support?','두 이야기가 함께 뒷받침하는 생각을 골라요.')],[rows(`Kai’s kite failed twice. He adjusted it until it flew.|Persistence can support learning.|Success needs no effort.|Mistakes must be hidden.
Maya and Jo could not lift a box alone. Together they moved it.|Cooperation can solve a problem.|Help is always useless.|Only one deserves credit.
Lee forgot a job, admitted it, then repaired the damage.|Responsibility can rebuild trust.|Promises never matter.|Blame fixes everything.
Rina returned found money when nobody was watching.|Honesty matters without an audience.|Secrecy always earns rewards.|Finding changes ownership.
Sam invited an isolated newcomer to join.|Small acts can create belonging.|New people should be ignored.|Friends need identical backgrounds.
Nora prepared a speech and spoke while still nervous.|Courage can include fear.|Courage means no fear ever.|Preparation cannot help.
Ari asked why his model failed, then improved it.|Questions can support learning.|You must know everything first.|Models never need changes.
Jo taught a younger reader. Both enjoyed the last page.|Sharing knowledge can help others grow.|Teaching prevents enjoyment.|Age alone decides skill.
Dee listened before replying. A compromise followed.|Listening can resolve disagreement.|Loudness proves correctness.|Compromise needs permanent silence.
Tao watered the garden daily, even when bored.|Care includes steady effort.|Only exciting tasks matter.|Wishes alone grow gardens.`),rows(`A retested a failed recipe. B redesigned a broken base.|Mistakes can guide improvement.|Failure is always permanent.|Neither changed anything.
A: Neighbors shared tools. B: Classmates divided a task.|Cooperation can make work possible.|Teamwork prevents success.|Only tools matter.
A admitted a foul. B corrected an unsupported claim.|Honesty can require admitting errors.|Winning justifies any claim.|Errors should stay secret.
A welcomed a newcomer. B made space for a new member.|Inclusion supports belonging.|Belonging requires exclusion.|Isolation is the shared goal.
A shy singer rehearsed. B a worried cyclist practiced safely.|Preparation can support courage.|Fear always vanishes instantly.|Practice guarantees all outcomes.
A asked for help. B learned from a neighbor.|Seeking knowledge can improve work.|Help proves permanent inability.|Learning ends in childhood.
A returned a tool. B completed an agreed task.|Keeping commitments supports trust.|Promises do not matter.|Trust depends only on looks.
A club revised plans after listening. Friends heard both sides.|Listening can change decisions.|Only the first idea matters.|Disagreement cannot change.
A watered daily. B read a little each evening.|Steady effort supports growth.|Only one big effort counts.|Routines always fail.
A builder used feedback. An artist tried a suggestion.|Useful feedback can encourage growth.|All feedback must be rejected.|All suggestions are automatically right.`)]);
bank('structure5','Text Structure','글의 짜임','5.T.SS.1.a–d',[B('How is this text organized?','글의 짜임을 골라요.'),B('Which revision improves organization?','짜임을 살리는 수정 방법을 골라요.')],[rows(`First mark, next cut, finally join.|sequence|comparison|description only
Both cups hold water, but one has a lid.|comparison|sequence|problem and solution
A pipe leaked, so the floor got wet.|cause and effect|comparison|steps
The path flooded. Workers added drainage.|problem and solution|character description|price list
The tent is wide, blue, waterproof.|description|chronology|argument against tents
Day 1: seeds. Day 4: sprouts.|chronology|opinion|contrast only
Heading: Tools. Below: ruler, saw, clamp.|grouped information|plot climax|dialogue
A chart compares two cups’ water loss.|comparison using a chart|rhyme pattern|story ending
Paragraph 1: problem. Paragraph 2: repairs.|problem and solution|random list|description only
Because winds increased, the race moved inside.|cause and effect|alphabetical order|poem structure`),rows(`Steps say paint, sand, measure. Correct process is measure, sand, paint.|Reorder steps.|Delete only measuring.|Sort by word length.
A comparison describes only one cup.|Add matching features of the second cup.|Add a song.|Repeat the first color.
An explanation gives an effect but omits its known cause.|Add the cause.|Replace it with a joke.|Move the title.
A repair guide names a problem but no remedy.|Add a step addressing the problem.|Describe the cover.|Remove the problem.
A boat-design paragraph shifts to lunch prices.|Move prices to a relevant separate section.|Join without transition.|Delete all main ideas.
Results are listed without explaining the test.|Add the method needed to interpret results.|Hide the method.|Mix rows randomly.
A data table has numbers without units.|Label the units.|Only brighten numbers.|Remove numbers.
Different stages have identical headings.|Use distinct stage headings.|Remove all headings.|Repeat the same heading.
A conclusion introduces an unrelated topic.|Return to the supported main idea.|Add more unrelated topics.|Remove evidence.
A timeline puts June before April in the same year.|Order the dated events chronologically.|Sort by title length.|Omit dates.`)]);
bank('figurative5','Figurative Language','비유의 뜻과 효과','5.T.SS.2.a–b',[B('What does the phrase mean here?','문맥 속 비유의 뜻을 골라요.'),B('What effect does the phrase create?','비유가 만드는 느낌을 골라요.')],[rows(`Her grin was like sunshine after gloomy news.|Her smile brought cheer.|Her face emitted solar energy.|It caused daybreak.
The library was a sea of books.|There were many books.|Water flooded all shelves.|Books became fish.
He broke the ice with a friendly question.|He eased awkwardness.|He shattered frozen water.|He ended the meeting.
I waited a thousand years for the bus!|The wait felt long.|The speaker lived for centuries.|The bus traveled through time.
Wind whispered through the grass.|Wind made a soft sound.|Wind spoke actual words.|Grass understood words.
Clouds were like soft pillows.|They looked fluffy.|They were filled with cloth.|People could safely sleep on them.
The room was a beehive of activity.|People were busy.|Only insects filled it.|Everyone stood still.
The task was a piece of cake for her.|It felt easy.|It was edible.|It required baking.
His backpack weighed a ton in his tired arms.|It felt very heavy.|It was measured at one ton.|Nobody could ever lift it.
The stubborn door refused to open.|It was hard to open.|It decided consciously.|It answered aloud.`),rows(`The pond lay like a mirror.|The simile emphasizes smooth reflection.|It emphasizes loud currents.|It proves glass composition.
The warning was a red flag.|The metaphor signals trouble.|An actual flag is required.|It means victory.
Leaves danced along the path.|Personification makes movement lively.|Leaves have human muscles.|The path is motionless.
Her words bridged the groups.|The metaphor highlights connection.|It is a building plan.|Words are steel.
He moved like a shadow through the quiet hall.|It suggests unobtrusive movement.|It suggests loud steps.|He has no body.
A mountain of paperwork covered the desk.|Exaggeration stresses the amount.|It reports mountain height.|No papers exist.
The city woke as shutters opened.|Personification suggests activity starting.|A city is a person.|Everyone sleeps longer.
News hit him like a wave.|The simile stresses emotional impact.|Seawater entered the room.|He felt only mild boredom.
She kept her cool in the argument.|The idiom means staying calm.|It measures body temperature.|She stopped listening.
The tiny lamp was a star in the shed.|The metaphor highlights a bright point.|The lamp uses nuclear fusion.|There is no light.`)]);
bank('explain5','Explain with Evidence','설명의 근거','5.T.T.2.a–d',[B('Which detail supports the explanation?','설명을 뒷받침하는 근거를 골라요.'),B('Connect the records within their evidence.','자료에서 확인할 수 있는 내용에 맞게 두 기록을 연결해요.')],[rows(`Covered cup lost 2 mL; open cup lost 8 mL in our test.|Covered lost less.|Both lost zero.|Lids always stop all loss.
Old route: 900 m. New: 600 m.|New was 300 m shorter.|Old was shorter.|Nobody walked.
A tree’s shadow covered our bench at noon.|The bench was shaded then.|Every bench was shaded.|The tree needs no water.
Chairs before: 12. After: 18.|Six chairs were added.|Book count fell.|Every visitor got a seat.
Visible grit remained on filter paper.|The filter caught visible grit.|All germs vanished.|Water became safe to drink.
A cart rolled up a ramp instead of steps.|A ramp provides a rolling route.|The cart flew.|All buildings have ramps.
After a pipe repair, our next check found no drops.|No drops appeared in that check.|The pipe will never fail.|All water vanished.
Sorting errors: unlabelled bins 3, labelled bins 0.|Labels reduced errors in this trial.|No future errors are possible.|Bins cannot hold things without labels.
The new bus schedule lists a school stop.|The schedule includes that stop.|Every student uses it.|Every journey is faster.
A leaf sketch shows edges and veins.|The sketch records visible shape details.|It proves the plant’s age.|It measures roots.`),rows(`A: I measured 4 cm growth. B: A summary reports my measurement.|A is firsthand; B is secondhand.|Both are B’s firsthand observations.|Neither is a measurement.
A: Three benches repaired. B: Lumber invoice for three benches.|The records are consistent.|All benches stay safe forever.|No repair occurred.
A: Bridge closed Monday. B: Tuesday notice gives an alternate route.|The notice responds to closure.|The bridge certainly reopened.|Tuesday caused Monday.
A: Planted tray had 8 sprouts. B: Unplanted tray had none.|The records compare trays.|Every seed sprouts.|All gardens are measured.
A: Poll had 20 replies. B: 12 favored a swap.|Most respondents favored it.|Every student agreed.|No one disagreed.
A: Added lid. B: Loss fell from 8 to 3 mL in the next trial.|The lid trial had lower loss.|Evaporation ended everywhere.|Water changed into soil.
A: Map marks two entrances. B: My walk used the eastern one.|The walk used a marked entrance.|The western entrance is nonexistent.|The map lists every visitor.
A: Observer heard a noon bell. B: A later report quotes them.|The report uses an observation secondhand.|The reporter heard it personally for certain.|It rang at midnight.
A: Log identifies loose hinge. B: Photo shows repaired door.|Log explains repair; photo records result.|Photo proves every cause.|Neither concerns the door.
A: Chart lists daily rain. B: Paragraph gives the week’s sum.|The paragraph summarizes chart data.|The paragraph measures another week.|Charts supply no evidence.`)]);
bank('opinion5','Support an Opinion','의견 뒷받침하기','5.T.T.3.a,c',[B('Choose a relevant reason for the claim.','주장에 관련 있는 이유를 골라요.'),B('Choose supported evidence or a conclusion.','주장을 뒷받침하는 근거나 마무리를 골라요.')],[rows(`Claim: Hold a book swap.|We can share books we have finished.|Blue is nice.|Clocks have hands.
Claim: Add a shaded rest area.|Visitors can rest out of direct sun.|Pencils are short.|Rain falls.
Claim: Label supply bins.|Labels help finding and returning supplies.|The door is wooden.|Lunch is at noon.
Claim: Repair the bench.|A usable bench offers seating.|The moon has craters.|The school has a name.
Claim: Keep quiet reading time.|Quiet may support focusing on books.|Paper comes in packs.|The wall is tall.
Claim: Plan a class garden.|We can observe plant growth.|Buses have wheels.|The ocean is large.
Claim: Share cleanup jobs.|Dividing tasks balances participation.|My shoes are red.|Tables have corners.
Claim: Keep a tool-loan log.|It shows which tools need returning.|Clouds move.|Weeks have seven days.
Claim: Include a walking break.|A break lets us move and change position.|Notebooks have lines.|Windows have glass.
Claim: Post a meeting schedule.|Members can see when to attend.|The room has a floor.|Birds sing.`),rows(`Claim: Labels reduce errors. Trial errors fell from 5 to 1.|Use the trial as evidence.|Claim nobody will ever err.|Use wall color.
Claim: Book swaps avoid purchases. Twelve families exchanged owned books.|The exchange shows reuse.|All books are now free.|Reading scores must have risen.
Claim: We need a larger room. Eighteen members; twelve seats.|The numbers show a shortage.|The room name proves size.|Six must never attend.
Claim: Repairs reduce waste. Four tools returned to use.|Cite the four repaired tools.|All repairs are free.|Cite lunch prices.
Claim: Add an entrance. Long queues formed at the single gate.|Queues are relevant to access.|Every visitor hated the event.|Roof color proves access.
Claim: Publish directions. Three visitors missed an unmarked turn.|The missed turn supports directions.|All maps are useless.|Everyone should know all routes.
Claim: Share cleanup. Choose a closing sentence.|Shared jobs can balance our work.|Now discuss the moon.|Nobody needs to clean.
Claim: Keep reading time. End with a supported idea.|Quiet reading time can support focus.|Quiet guarantees perfect grades.|Stop every other hobby.
Claim: Use a sign-out log. Avoid overclaiming.|A log may help track borrowed tools.|A log guarantees no breakage.|A log measures quality automatically.
Claim: Provide shade. Choose a relevant example.|Visitors rested on a shaded bench on sunny days.|Visitors wore blue.|A nearby clock was repaired.`)],'write');
bank('poetry5','Poem Structure','시의 짜임','5.T.T.4.a–b (partial)',[B('Choose a supported observation.','시에서 확인할 수 있는 짜임을 골라요.'),B('What effect comes from the structure?','이 짜임이 만드는 효과를 골라요.')],[rows(`Soft drops of rain,\nTap on the pane.|rain and pane rhyme|both lines begin Rain|there are four lines
A seed below,\nBegins to grow.|below and grow rhyme|there is one line|every word rhymes
A winding way,\nAt break of day.|way and day rhyme|day and break rhyme|three stanzas
The lamp is bright,\nAgainst the night.|bright and night rhyme|lamp and night rhyme|identical lines
The falling snow,\nMoves soft and slow.|snow and slow rhyme|falling and soft rhyme|five lines
Wind,\nA leaf turns,\nThe path changes.|No regular end-rhyme pattern.|Every line ends wind.|One line only.
One branch bends.\nAnother holds.|Two lines.|Two four-line stanzas.|Both lines rhyme.
The ball rolls.\nThe child follows.\nThe game begins.|Three lines.|One word only.|All lines repeated.
Stars above.\n\nFootsteps below.|A blank line separates stanzas.|One unbroken line.|No spaces.
Wait,\nWait,\nThe gate opens.|Wait is repeated.|The last line repeats Wait.|Every line has three words.`),rows(`The river hurries,\nHurries,\nHurries to the sea.|Repetition stresses ongoing movement.|The river stops.|Exact speed is measured.
A small seed waits.\n\nA green shoot rises.|The stanza break marks a change.|The shoot is removed.|An exact date is proved.
I listen—\nthen\na bell.|Short lines slow the reveal.|A new speaker is added.|Every word rhymes.
The path is long, the morning clear,\nI walk with hope instead of fear.|Rhyming endings link the lines.|No sound relationship exists.|The event is proved true.
Tap.\nTap.\nTap.\nRain.|Short repeated lines suggest taps.|Rain is silent only.|Four seasons appear.
Before: bare earth.\nAfter: green leaves.|Parallel lines emphasize contrast.|Change is hidden.|Conditions are identical.
A window glows; the street is still.\nA window glows beyond the hill.|Repeated openings connect images.|Only one window exists for certain.|Distance is measured exactly.
Up the stair,\nPast the chair,\nInto air.|Matching endings repeat sound.|All words have the same meaning.|Flight is proved.
A door opens.\nSomeone listens.\nA story starts.|Free verse need not have regular rhyme.|Every poem needs end rhyme.|No rhyme means prose only.
The pond holds sky.\nThe wind arrives.\nThe image breaks.|The last event changes the calm scene.|The image stays unchanged.|A calendar date is named.`)]);
bank('source5','Sources and Evidence','자료와 근거','5.T.RA.1–2',[B('Which source directly addresses the question?','질문에 직접 관련 있는 자료를 골라요.'),B('Respect the evidence and its limits.','근거의 범위를 지킨 결론이나 출처 표기를 골라요.')],[rows(`Question: How many books borrowed Tuesday?|Tuesday’s checkout log|a poem about books|a lunch menu
Question: Where is the trail entrance?|the current park map|a recipe|ticket prices
Question: How much water did our cup lose?|our measurement table|a song about rain|a street map
Question: When does the club meet?|the dated club schedule|a story about friends|a plant diagram
Question: What bench repairs were made?|the repair log|a sports score|a cloud photo
Question: What materials did our model use?|our materials list|a fictional diary|an ocean map
Question: What happened at the observed gate?|the observer’s dated notes|a door poem|a word list
Question: How many picked option A?|the survey tally|a cover design|a bus photo
Question: Which route avoids the closed bridge?|closure notice and alternate-route map|old weather forecast|a recipe
Question: Who wrote this article?|the author line|a nearby advertisement|browser wallpaper`),rows(`A dated log counts 12 repairs this month. A rumor says hundreds.|Use the log’s count within its scope.|Treat the rumor as certain.|The log covers all years.
A study lists methods and measurements. An ad gives praise only.|Data better support measurement claims.|Praise is measurement.|Every ad is always false.
This year’s schedule differs from last year’s.|Use the current dated schedule.|Ignore dates.|Last year must be right.
Two of three trials lost 4 mL. Paraphrase fairly.|In two trials, measured loss was 4 mL.|Every trial everywhere loses 4 mL.|No loss occurred.
You copy a report’s exact words.|Use quotation marks and name the report.|Claim the words as your own.|Change one word and omit the source.
An image has no date, location, or scale.|More context is needed for a measurement claim.|It proves every measurement.|Colors prove its date.
Jo’s report, page 2, gives class results.|Name Jo’s report and page 2.|Cite only “the internet.”|Give no source.
Two records count different time periods.|Check periods before comparison.|One must be dishonest.|Add counts without checking overlap.
An official page describes one study.|Use evidence within the study’s scope.|Every official claim is automatically true.|Official pages never change.
A summary omits that only six objects were tested.|Include the sample size.|Treat six as the whole world.|Delete the date too.`)]);
})();




