(() => {
'use strict';
const decks=new Map();
const take=(id,lv,count=10)=>{const k=`${id}:${lv}:${S.lang}`;let d=decks.get(k);if(!d){d=shuffle(Array.from({length:count},(_,i)=>i));decks.set(k,d);}const i=d.shift();d.push(i);return i;};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const item=(ask,text,right,wrong)=>({ask,askSay:B(ask.en,/[A-Za-z]/.test(ask.ko)?'영어 질문을 들어 보세요.':ask.ko),askExtra:S.lang==='ko'&&/[A-Za-z]/.test(ask.ko)?{t:ask.en,lang:'en-US'}:undefined,show:`<div class="g5-reading" lang="en">${esc(text).replaceAll('\n','<br>')}<button class="g5-read-listen" type="button" aria-label="${L(B('Listen to English text; reading help','영어 본문 듣기 · 읽기 도움'))}">🔊 ${L(B('Listen (help)','듣기 도움'))}</button></div>`,opts:[right,...wrong].map((x,i)=>({html:`<span class="word" lang="en">${esc(x)}</span>`,ok:i===0})),cls:'words g5-read-options',after:B(`Answer: ${right}. Check the clues and question conditions.`,`정답: ${right} · 본문의 단서와 질문 조건을 확인해요.`),vocab:right,onRender(){const b=document.querySelector('.g5-read-listen');if(b)b.onclick=()=>say(text,'en-US');const c=document.querySelector('#spo');if(c)c.onclick=()=>[...document.querySelectorAll('.opt .word')].forEach((x,i)=>say(x.textContent,'en-US',i>0));}});
const support={"roots5":["Meaning choices; word building / parts of speech not practiced","뜻 고르기 · 낱말 만들기·품사 관계 미지원"],"viewpoint5":["Pronouns and short-text clues; limited writing-context practice","인칭·짧은 글 단서 · 작성 맥락은 일부만 연습"],"poetry5":["Poem analysis choices; poem writing not practiced","시 분석 보기 고르기 · 시 창작 미지원"]};
const scopeFor=id=>support[id];
const reg=(id,en,ko,code,make,subject='read')=>registerGame({id,grade:'5',subject,icon:subject==='write'?'✏️':'📖',title:B(en,ko),sub:B('Short texts · partial practice; listening is help','짧은 글 · 부분 연습 · 듣기는 읽기 도움이에요'),practiceScope:scopeFor(id)?B(...scopeFor(id)):undefined,area:B(`Grade 5 ${subject==='write'?'Writing':'Reading'} · ${code}${scopeFor(id)?" · "+scopeFor(id)[0]:""}`,`5학년 ${subject==='write'?'쓰기':'읽기'} · ${code}${scopeFor(id)?" · "+scopeFor(id)[1]:""}`),play(){const lv=lvl(id)>1?2:1,extra=bankGrowthRows[id]?.[lv]?.length||0,i=take(id,lv,10+extra),it=i<10?make(lv,i):bankGrowthItem(id,lv,i-10);const scope=scopeFor(id);if(scope){it.show+='<div class="g5-scope">'+L(B(scope[0],scope[1]))+'</div>';}if(S.lang==='ko'&&/[A-Za-z]/.test(it.ask.ko)){it.askSay=B(it.ask.en,'질문과 자료를 보고 답을 골라요. 영어 질문도 들어 보세요.');it.askExtra={t:it.ask.en,lang:'en-US'};}it.itemKey=`${id}:${lv}:${i}`;quiz(this,it);}});
const rows=s=>{const out=[];let lines=[];for(const line of s.trim().split('\n')){if(!line.includes('|')){lines.push(line);continue;}const r=line.split('|');if(lines.length){r[0]=[...lines,r[0]].join('\n');lines=[];}out.push(r);}if(lines.length)throw new Error('Unfinished reading row');return out;};
const bank=(id,en,ko,code,ask,sets,subject)=>reg(id,en,ko,code,(lv,i)=>{const r=sets[lv-1][i];let prompt=ask[lv-1];if(id==='context5'){const word=(lv===1?['fragile','narrow','abundant','vacant','transparent','damp','sturdy','rapid','enormous','optional']:['reluctant','depleted','diverged','somber','intermittently','ambiguous','improvised','conserved','muted','temporary'])[i];prompt=B(`What does ${word} mean here?`,`여기서 ${word}의 뜻을 골라요.`);}let wrong=r.slice(2,4);
if(id==='opinion5'){
 prompt=lv===1?B('Which reason explains how the proposal helps its intended task?','제안한 행동이 하려는 일에 어떻게 도움이 되는지 설명한 까닭을 골라요.'):ask[lv-1];
 wrong=(lv===1?[
 ['Swapping books creates new copies.','Swapping books pays their authors.'],
 ['Shade makes daylight last longer.','Shade keeps rain off the entire yard.'],
 ['Labels increase the bins’ capacity.','Labels reduce the number of supplies needed.'],
 ['Repairing seating makes the path wider.','Repairing seating adds a new meeting room.'],
 ['Quiet time changes the book’s vocabulary.','Quiet time replaces help with unfamiliar words.'],
 ['A garden makes plants grow without care.','A garden shows growth without measurements.'],
 ['Sharing jobs reduces the size of each room.','Sharing jobs removes the need to coordinate.'],
 ['A loan log shows which tools are broken.','A loan log shows which tools are best made.'],
 ['A walking break finishes the lesson sooner.','A walking break replaces the need for sleep.'],
 ['A schedule shows who actually attended.','A schedule shows what members learned.']
 ]:[
 ['Use the label color as evidence.','Use the number of bins as evidence.'],
 ['The exchange shows higher reading scores.','The exchange shows lower book prices.'],
 ['The numbers show six spare seats.','The numbers show eighteen spare seats.'],
 ['Cite the price of the replacement tools.','Cite the color of the repaired tools.'],
 ['The queue shows that the event was unpopular.','The queue shows that the room was too cold.'],
 ['The missed turn supports longer opening hours.','The missed turn supports cheaper tickets.'],
 ['Shared jobs mean less space needs cleaning.','Shared jobs mean less cleaning equipment exists.'],
 ['Quiet time replaces reading practice.','Quiet time is a form of physical exercise.'],
 ['A log shows that borrowed tools were repaired.','A log shows how well the tools perform.'],
 ['Visitors wore hats on cloudy days.','Visitors used a sunny bench on cool days.']
 ])[i];
}
if(id==='figurative5')wrong=(lv===1?[
 ['Her smile hid disappointment.','Her smile showed uncertainty.'],['The books were neatly separated in small groups.','Only a few books were available.'],['He made the group more uncomfortable.','He changed the topic to winter.'],['The wait felt surprisingly short.','The bus ride felt long.'],['The wind made a harsh booming sound.','The grass made no movement or sound.'],['They looked thin and flat.','They looked sharp and jagged.'],['People worked slowly and quietly.','People had stopped working.'],['It felt difficult.','It felt unfinished.'],['It felt light to carry.','It felt empty.'],['It was easy to open.','It opened smoothly after a push.']
 ]:[
 ['It emphasizes rough choppy motion.','It emphasizes the pond’s depth.'],['It signals a successful ending.','It suggests a calm uneventful moment.'],['It makes the motion seem slow and stiff.','It stresses the weight of the leaves.'],['It highlights separation.','It highlights confusion.'],['It suggests conspicuous noisy movement.','It suggests hesitation before entering.'],['It stresses the difficulty of climbing.','It stresses a small tidy workload.'],['It suggests activity ending.','It suggests activity continuing unchanged.'],['It stresses a gentle uneventful response.','It stresses a physical trip to the coast.'],['It means speaking more angrily.','It means avoiding the disagreement.'],['It highlights a dark unlit space.','It highlights many equally bright lamps.']
 ])[i];
if(id==='source5'&&lv===1)wrong=[
 ['Monday’s checkout log','Tuesday’s book-return log'],['the trail maintenance log','the outdated trail map'],['a cup capacity table','a water-temperature table'],['last year’s club schedule','the dated club attendance list'],['the bench purchase log','the bench cleaning log'],['our tool checkout list','our model measurement table'],['last month’s gate log','the gate construction plan'],['the survey question sheet','the survey invitation list'],['a bridge map from before the closure','a road-distance table without closure details'],['the article publication date','the article publisher’s address']
 ][i];
return item(prompt,r[0],r[1],wrong);},subject);
reg('decode5','Decode Word Parts','철자와 뜻을 가진 낱말 조각','5.F.P.4.a–c',(lv,i)=>{
const r=(lv===1?rows('sun|set|sunset\nrab|bit|rabbit\npic|nic|picnic\nbas|ket|basket\nmag|net|magnet\nnap|kin|napkin\nvel|vet|velvet\nmuf|fin|muffin\nden|tist|dentist\nhel|met|helmet'):rows('re|paint|ing|repainting\nun|help|ful|unhelpful\ndis|agree|ment|disagreement\nhope|less|ness|hopelessness\nfear|less|ness|fearlessness\npre|heat|ing|preheating\nre|play|ing|replaying\nun|thank|ful|unthankful\nmis|place|ment|misplacement\ncare|less|ness|carelessness'))[i],word=r.pop();return item(B(lv===1?'Join the spelling chunks. Which word?':'Join the meaningful word parts. Which word?',lv===1?'철자 조각을 합쳐서 낱말을 만들어요.':'뜻을 가진 낱말 조각을 합쳐요.'),r.join(' + '),word,[word.slice(0,1)+word.slice(2),word.slice(0,-1)+word.slice(-1).repeat(2)]);});
reg('roots5','Roots in Context','어근으로 뜻 찾기','5.L.V.2.a–c',(lv,i)=>{
const r=(lv===1?rows(`biography: bio = life; graph = write|a written account of a life|a study of rocks|a device measuring heat
autograph: auto = self; graph = write|a person’s own signature|a picture of mountains|a listening device
photograph: photo = light; graph = record|an image recorded using light|a sound carried by a wire|a report about water
telephone: tele = far; phon = sound|a device carrying sound over distance|a tool measuring weight|a book about plants
television: tele = far; vis = see|a system sending distant images|a paper map|a tool carrying water
portable: port = carry; able = can be|able to be carried|unable to move|having many pages
transport: trans = across; port = carry|carry between places|look very closely|write about a life
inspect: spect = look|look at closely|carry far away|make a loud sound
spectator: spect = look|someone watching an event|someone making a map|someone measuring heat
biology: bio = life; logy = study|the study of living things|the study of numbers|a written signature`):rows(`I wrote an autobiography about my childhood.|a book about the writer’s own life|a book about another person|a weather report
In geography, we studied rivers and land.|the study of places and Earth’s features|the study of sounds|the study of spelling
The telegraph sent a message to a far town.|a system sending messages over distance|a plant-growing device|a water-freezing device
Hydropower uses moving water. Hydro means water.|power from water|power from sunlight|power from wind
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
The blue boat—not the red one—won.|Treat the middle phrase as an aside.|Read the aside as saying both boats won.|Read the main statement without the word not.
If it snows, the trip will change.|Keep condition and result together.|Treat change as a question.|Read only the condition.
“Come inside,” he said softly.|Use a gentle voice.|Shout throughout.|Read comma as a word.
I read desert as dessert, then noticed “dry sand.”|Reread using the dry-land meaning.|Keep reading it as a sweet course.|Skip the sentence containing the difficult word.
The box was heavy; nevertheless, she lifted it.|Mark the contrast.|Read she could not lift it.|Ignore the second clause.
First check the latch; next, open the gate.|Read in the given order.|Reverse the actions.|Read next before first.`)]);
bank('context5','Context Clues','문맥 속 뜻','5.L.V.3.a',[B('Which meaning fits the key word?','문맥 속 낱말의 뜻을 골라요.'),B('Infer the meaning from cause or contrast.','원인이나 서로 다른 점을 보여 주는 단서로 뜻을 짐작해요.')],[rows(`The fragile glass broke with a small tap.|easily broken|very flexible|extremely loud
The narrow path fit only one walker.|not wide|unsafe|icy
The abundant crop filled many baskets.|more than enough|almost absent|fully rotten
The room was vacant; nobody occupied it.|empty|noisy|crowded
The transparent lid let us see inside.|see-through|heavy|unbreakable
The damp cloth still held a little water.|slightly wet|slightly damp|very smooth
The sturdy shelf held heavy books.|strong and solid|easily bent|brightly colored
The rapid stream moved very quickly.|fast|shallow|silent
The enormous tent covered the yard.|very large|nearly invisible|rather tiny
The task was optional; students could choose it.|not required|forbidden|already finished`),rows(`Maya was reluctant to perform. She lingered while others volunteered.|not eager|unable to hear|ready to rush
The battery was depleted, so the lamp went dark.|used up|made larger|connected safely
The trail diverged: one path went up, one down.|split into separate paths|ended at once|became one path
Unlike the cheerful note, the reply was somber.|serious and sad|bright and playful|quickly written
The radio crackled intermittently, with silent gaps.|from time to time|without stopping|at maximum volume
The instructions were ambiguous: each reader built a different shape.|open to more than one meaning|very brief only|written in red
Ari improvised a paddle from a board when his broke.|made a makeshift solution|copied a complete plan|refused to act
The town conserved water by reducing waste.|used without waste|gave away freely|froze solid
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
bank('wordshade5','Precise Words','뜻의 미묘한 차이','5.L.V.3.c',[B('Choose the precise action word.','행동에 정확히 맞는 낱말을 골라요.'),B('Match every condition in the description.','설명한 조건에 모두 맞게 골라요.')],[rows(`Speak quietly so only a nearby friend hears.|whisper|shout|announce
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
Quiet pleasure lifts the corners of her mouth without a sound.|smiled|roared|sobbed
A speaker talks unclearly in a low voice.|mumbled|declared|screamed
The room feels a little chilly; a light sweater is enough.|cool|freezing|scorching
Someone moves quickly, but not necessarily at top speed.|hurried|sprinted|sauntered`)]);
reg('reference5','Read Dictionary Entries','사전 자료 읽기','5.L.V.3.d',(lv,i)=>{const r=(lv===1?rows(`harbor: sheltered water for boats|a safe place for boats|a steep mountain|a racing track
trail: a path for travel|a travel route|a cutting tool|a room
canopy: an overhead covering|a covering above|a tunnel below|a shelf below
observe: watch carefully|watch with attention|forget a detail|give an order
repair: fix damage|make something work again|break it deliberately|carry it away
compare: examine similarities and differences|find what is alike and different|guess without looking|put something away
annual: happening once each year|once per year|every hour|only once ever
fertile: able to support plant growth|good for growing plants|always frozen|without minerals
predict: say what may happen|describe a possible future|report only the past|copy a result
precise: exact and careful|exact|uncertain|very large`):rows(`bank: 1 money business; 2 land along water; 3 tilt while turning. We sat by the stream on the bank.|2|1|3
bat: 1 flying mammal; 2 sports club; 3 hit at something. The bat slept in the cave.|1|2|3
crane: 1 bird; 2 lifting machine; 3 stretch the neck. The crane moved the beam.|2|1|3
light: 1 illumination; 2 not heavy; 3 ignite. The light bag was easy to lift.|2|1|3
scale: 1 weighing device; 2 fish covering; 3 climb. We weighed flour on the scale.|1|2|3
current: 1 water flow; 2 happening now; 3 electric charge flow. The raft followed the current.|1|2|3
seal: 1 marine mammal; 2 close tightly; 3 an official stamp. Seal the jar.|2|1|3
spring: 1 season; 2 elastic coil; 3 leap. The spring in the chair broke.|2|1|3
rock: 1 stone; 2 move back and forth; 3 a music style. The waves rock the boat.|2|1|3
charge: 1 ask a price; 2 rush forward; 3 fill a battery. The shop will charge five dollars.|1|2|3`))[i];return item(B(lv===1?'Use the original glossary. Choose the meaning.':'Which numbered definition fits?',lv===1?'이 용어 풀이에 맞는 뜻을 골라요.':'문장에 맞는 뜻의 번호를 골라요.'),r[0],r[1],r.slice(2));});
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
Every person attended yesterday. Use nobody and keep past tense.|Nobody was absent.|Nobody were absent.|Nobody are absent.
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
The library closes Saturday at noon.|announce news|tell a joke|sell a bicycle
Add a reading corner; quiet seats help us focus.|persuade with a reason|describe a storm|list bus stops
Roots absorb water; leaves use light.|explain a process|invite a guest|tell a mystery
The dragon hid a bell under its wing.|entertain with a story|report real measurements|give safety rules
Dear principal, may we use the courtyard?|request permission|explain word roots|describe a journey
The bottle holds 500 milliliters.|report a measurement|ask for help|invite someone
Trail closed for repairs. Do not enter.|warn and guide|advertise a toy|tell a poem
Thank you for repairing our bench.|express appreciation|announce a price|give a recipe`),rows(`Invite young students clearly.|Come try our club Friday after school!|Older experts only: bring your advanced projects.|Members only: check last week’s attendance.
Explain a rule to new visitors.|Please sign in at the desk.|Do the usual.|Visitors can sign in at any desk in any building.
Ask a principal politely for a room.|May our club use room 4 Tuesday?|Give us the room now!|Room 4 is blue.
Write a report without overclaiming.|In three trials, the covered cup lost less water.|Every lid always works perfectly.|The greatest discovery ever!
Warn hikers clearly.|Trail closed; use the marked alternate route.|The forest is always dangerous.|Hurry through the closed trail.
Persuade classmates with a relevant reason.|A book swap lets us share existing books.|Blue is my favorite color.|Buy a new book for every participant.
Explain a new device.|Press green to start the timer.|Activate it as usual.|Green reminds me of grass.
Thank a volunteer specifically.|Your repair made the bench usable.|You did some stuff.|No repair happened.
Give a schedule to families.|Concert: 6 p.m. in the gym.|The concert is wonderful.|Attend whenever you like.
Invite a garden expert politely.|Could you share how you plan gardens?|You must plant the whole garden for us.|Could we borrow your tools without a lesson?`)]);
bank('viewpoint5','Compare Viewpoints','관점 비교','5.T.C.2.a,c',[B('Identify the narrator’s viewpoint.','서술자의 관점을 보여 주는 표현을 골라요.'),B('How do the accounts differ?','두 기록의 관점은 어떻게 다를까요?')],[rows(`I waited at the finish for my friend.|I and my show first person|he shows first person|they show first person
Nora checked her bag.|Nora and her show third person|The narrator uses “I”|The narrator uses “we”
We built our bridge together.|We and our show first person|she shows first person|Nora shows first person
He noticed the missing key.|He shows third person|I shows third person|our shows third person
My hands shook as I stepped onstage.|My and I show first person|they show first person|he shows first person
The children watched their teacher draw.|The narrator describes others in third person.|The narrator describes personal experiences using I.|The narrator describes shared experiences using we.
I knew why I hid the note.|The narrator reports their own thoughts.|An outside observer reports no thoughts.|The author must be this character.
Sam wondered if he could fix it.|An outside narrator tells Sam’s thought.|Sam tells his own thoughts using I.|An outside narrator reports actions without thoughts.
We could not see around the bend.|The narrators’ knowledge is limited.|They know every future event.|No narrator speaks.
Rina smiled, but Lee did not know why.|Lee’s knowledge is limited.|Lee knows Rina’s reason.|Everyone knows everything.`),rows(`A: I loved the crowd. B: The crowd was too loud; I wanted a quiet room.|They react differently to the crowd.|Both react with dislike toward the crowd.|Neither expresses feelings about the crowd.
A: The path saved my walk. B: It removed part of our garden.|One values convenience; one notes a loss.|Both describe only benefits.|Both oppose walking.
A: It felt easy after practice. B: I was new and felt lost.|Experience affects their reactions.|Both have equal practice.|Rules must differ.
A: I heard music backstage. B: From my seat I watched lights.|Different locations reveal different details.|Both stand backstage.|Neither observes anything.
A: I planted seeds. B: I later saw sprouts.|One plants; one observes a later result.|Both planted together.|Both saw no plants.
A: I liked leading. B: I wanted a turn too.|Their roles and wishes differ.|Both already led.|Neither wants to lead.
A: Noise kept me awake. B: I liked the celebration.|The same event affects them differently.|Both slept peacefully during the event.|Neither was disturbed by noise during the event.
A: I thought it was stuck. B: I knew the latch location.|They have different information.|Both know the latch.|Neither sees a door.
A: I feared the storm. B: I studied it from shelter.|One focuses on fear; one on observation.|Both describe studying weather.|Both caused the storm.
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
Maya and Jo could not lift a box alone. Together they moved it.|Cooperation can solve a problem.|Working independently deserves more credit than helping.|The person who started should get the credit.
Lee forgot a job, admitted it, then repaired the damage.|Responsibility can rebuild trust.|An apology is a substitute for keeping a commitment.|Finding someone to blame is better than accepting responsibility.
Rina returned found money when nobody was watching.|Honesty matters without an audience.|Keeping a found item is acceptable when no one sees.|Finding changes ownership.
Sam invited an isolated newcomer to join.|Small acts can create belonging.|New people should be ignored.|Friends need identical backgrounds.
Nora prepared a speech and spoke while still nervous.|Courage can include fear.|Courage means no fear ever.|Preparation cannot help.
Ari asked why his model failed, then improved it.|Questions can support learning.|Knowing the answer matters more than asking a question.|Keeping a neat model matters more than testing it.
Jo taught a younger reader. Both enjoyed the last page.|Sharing knowledge can help others grow.|Teaching prevents enjoyment.|Age alone decides skill.
Dee listened before replying. A compromise followed.|Listening can resolve disagreement.|Loudness proves correctness.|Compromise needs permanent silence.
Tao watered the garden daily, even when bored.|Care includes steady effort.|Exciting work matters more than routine care.|Wishes alone grow gardens.`),rows(`A retested a failed recipe. B redesigned a broken base.|Mistakes can guide improvement.|An unsuccessful attempt is a reason to abandon the task.|Neither changed anything.
A: Neighbors shared tools. B: Classmates divided a task.|Cooperation can make work possible.|Teamwork prevents success.|Only tools matter.
A admitted a foul. B corrected an unsupported claim.|Honesty can require admitting errors.|Winning justifies any claim.|Errors should stay secret.
A welcomed a newcomer. B made space for a new member.|Inclusion supports belonging.|Belonging requires exclusion.|Isolation is the shared goal.
A shy singer rehearsed. B a worried cyclist practiced safely.|Preparation can support courage.|Feeling fear means preparation has failed.|Both chose to avoid their activity.
A asked for help. B learned from a neighbor.|Seeking knowledge can improve work.|Help proves permanent inability.|Learning ends in childhood.
A returned a tool. B completed an agreed task.|Keeping commitments supports trust.|Promises do not matter.|A confident appearance matters more than reliability.
A club revised plans after listening. Friends heard both sides.|Listening can change decisions.|The first suggestion deserves preference over later ones.|Disagreement cannot change.
A watered daily. B read a little each evening.|Steady effort supports growth.|A big single effort is better than a daily routine.|Waiting for inspiration is better than regular work.
A builder used feedback. An artist tried a suggestion.|Useful feedback can encourage growth.|Following a first plan is better than considering feedback.|Following advice matters more than testing its effect.`)]);
bank('structure5','Text Structure','글의 짜임','5.T.SS.1.a–d',[B('How is this text organized?','글의 짜임을 골라요.'),B('Which revision improves organization?','짜임을 살리는 수정 방법을 골라요.')],[rows(`First mark, next cut, finally join.|sequence|comparison|description only
Both cups hold water, but one has a lid.|comparison|sequence|problem and solution
A pipe leaked, so the floor got wet.|cause and effect|comparison|steps
The path flooded. Workers added drainage.|problem and solution|character description|price list
The tent is wide, blue, waterproof.|description|chronology|argument against tents
Day 1: seeds. Day 4: sprouts.|chronology|opinion|contrast only
Heading: Tools. Below: ruler, saw, clamp.|grouped information|plot climax|dialogue
A chart places the water loss of cup A beside cup B for readers to examine.|comparison using a chart|rhyme pattern|story ending
Paragraph 1: problem. Paragraph 2: repairs.|problem and solution|random list|description only
Because winds increased, the race moved inside.|cause and effect|alphabetical order|poem structure`),rows(`Steps say paint, sand, measure. Correct process is measure, sand, paint.|Put the steps in order.|Delete the measuring step.|Change headings, not order.
A comparison describes only one cup.|Add matching features of the second cup.|Add another description of the first cup.|Repeat the first color.
An explanation gives an effect but omits its known cause.|Add the missing cause.|Expand the effect instead.|Move the section’s title.
A repair guide names a problem but no remedy.|Add a step addressing the problem.|Describe the cover.|Remove the problem.
A boat-design paragraph shifts to lunch prices.|Move prices to a relevant separate section.|Join without transition.|Delete all main ideas.
Results are listed without explaining the test.|Add the missing method.|Remove the method section.|Rearrange results without grouping.
A data table has numbers without units.|Label the units.|Only brighten numbers.|Remove numbers.
Different stages have identical headings.|Use distinct stage headings.|Remove all headings.|Repeat the same heading.
A conclusion introduces an unrelated topic.|Return to the supported main idea.|Add more unrelated topics.|Remove evidence.
A timeline puts June before April in the same year.|Put events in date order.|Sort by title length.|Order events without dates.`)]);
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
bank('explain5','Explain with Evidence','설명의 근거','5.T.T.2.a–d',[B('Which detail supports the explanation?','설명을 뒷받침하는 근거를 골라요.'),B('Connect the records within their evidence.','자료에서 확인할 수 있는 내용에 맞게 두 기록을 연결해요.')],[rows(`Covered cup lost 2 mL; open cup lost 8 mL in our test.|Covered lost less.|Both lost zero.|The open cup lost less.
Old route: 900 m. New: 600 m.|New was 300 m shorter.|Old was shorter.|Nobody walked.
A tree’s shadow covered our bench at noon.|The bench was shaded then.|The bench was shaded at sunset.|The tree needs no water.
Chairs before: 12. After: 18.|Six chairs were added.|Book count fell.|Every visitor got a seat.
Visible grit remained on filter paper.|The filter caught visible grit.|Dissolved salt was removed.|Invisible particles were counted.
A cart rolled up a ramp instead of steps.|A ramp provides a rolling route.|The ramp provides a stepped route.|The ramp requires the cart to be carried.
After a pipe repair, our next check found no drops.|No drops appeared in that check.|The check found a slow leak.|The pipe had not been repaired.
Sorting errors: unlabelled bins 3, labelled bins 0.|Labels reduced errors in this trial.|No future errors are possible.|Bins cannot hold things without labels.
The new bus schedule lists a school stop.|The schedule includes that stop.|The schedule omits the school stop.|The schedule proves that trips are shorter.
A leaf sketch shows edges and veins.|It records leaf features.|It proves the plant’s age.|It measures root length.`),rows(`A: I measured 4 cm growth. B: A summary reports my measurement.|A is firsthand; B is secondhand.|Both are B’s firsthand observations.|Neither is a measurement.
A: Three benches repaired. B: Lumber invoice for three benches.|The records are consistent.|The invoice shows three benches were purchased.|No repair occurred.
A: Bridge closed Monday. B: Tuesday notice gives an alternate route.|The notice responds to closure.|The bridge certainly reopened.|Tuesday caused Monday.
A: Planted tray had 8 sprouts. B: Unplanted tray had none.|The records compare trays.|The records compare eight trays.|The records measure plant height.
A: Poll had 20 replies. B: 12 favored a swap.|Most respondents favored it.|Twelve replies opposed the swap.|Eight replies favored the swap.
A: Added lid. B: Loss fell from 8 to 3 mL in the next trial.|The lid trial had lower loss.|Evaporation ended everywhere.|Water changed into soil.
A: Map marks two entrances. B: My walk used the eastern one.|The walk used a marked entrance.|The western entrance is nonexistent.|The walk used an unmarked entrance.
A: Observer heard a noon bell. B: A later report quotes them.|The report uses an observation secondhand.|The reporter heard it personally for certain.|It rang at midnight.
A: Log identifies loose hinge. B: Photo shows repaired door.|Log explains repair; photo records result.|The photo identifies the loose hinge’s cause.|Neither concerns the door.
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
Claim: Book swaps avoid purchases. Twelve families exchanged owned books.|The exchange shows reuse.|The exchange shows lower cover prices.|Reading scores must have risen.
Claim: We need a larger room. Eighteen members; twelve seats.|The numbers show a shortage.|The room name proves size.|Six must never attend.
Claim: Repairs reduce waste. Four tools returned to use.|Cite the four repaired tools.|All repairs are free.|Cite lunch prices.
Claim: Add an entrance. Long queues formed at the single gate.|Queues are relevant to access.|The queue shows that visitors left early.|Roof color proves access.
Claim: Publish directions. Three visitors missed an unmarked turn.|The missed turn supports directions.|The missed turn supports a shorter event.|Everyone should know all routes.
Claim: Share cleanup. Choose a closing sentence.|Shared jobs can balance our work.|Now discuss the moon.|Nobody needs to clean.
Claim: Keep reading time. End with a supported idea.|Quiet reading time can support focus.|Reading time replaces reading practice.|Quiet reading is a physical exercise.
Claim: Use a sign-out log. Avoid overclaiming.|A log may help track borrowed tools.|A log repairs the borrowed tools.|A log measures quality automatically.
Claim: Provide shade. Choose a relevant example.|Visitors rested on a shaded bench on sunny days.|Visitors wore blue.|A nearby clock was repaired.`)],'write');
bank('poetry5','Poem Structure','시의 짜임','5.T.T.4.a–b (partial)',[B('Choose a supported observation.','시에서 확인할 수 있는 짜임을 골라요.'),B('What effect comes from the structure?','이 짜임이 만드는 효과를 골라요.')],[rows(`Soft drops of rain,\nTap on the pane.|rain and pane rhyme|both lines begin Rain|there are four lines
A seed below,\nBegins to grow.|below and grow rhyme|there is one line|every word rhymes
A winding way,\nAt break of day.|way and day rhyme|day and break rhyme|three stanzas
The lamp is bright,\nAgainst the night.|bright and night rhyme|lamp and night rhyme|identical lines
The falling snow,\nMoves soft and slow.|snow and slow rhyme|falling and soft rhyme|five lines
Wind,\nA leaf turns,\nThe path changes.|No regular end-rhyme pattern.|Every line ends wind.|One line only.
One branch bends.\nAnother holds.|One stanza of two lines.|Two stanzas of four lines.|One pair of rhyming lines.
The ball rolls.\nThe child follows.\nThe game begins.|Three lines.|One word only.|All lines repeated.
Stars above.\n\nFootsteps below.|Two stanzas, with a blank line.|One stanza, with one long line.|Two stanzas, with no gap.
Wait,\nWait,\nThe gate opens.|Wait is repeated.|The last line repeats Wait.|Every line has three words.`),rows(`The river hurries,\nHurries,\nHurries to the sea.|Repeating words stress motion.|Repeating words suggest rest.|Repeating words measure speed.
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
Question: When does the club meet this year?|the dated club schedule|a story about friends|a plant diagram
Question: What bench repairs were made?|the repair log|a sports score|a cloud photo
Question: What materials did our model use?|our materials list|a fictional diary|an ocean map
Question: What happened at the observed gate?|the observer’s dated notes|a door poem|a word list
Question: How many picked option A?|the survey tally|a cover design|a bus photo
Question: Which route avoids the closed bridge?|closure notice and alternate-route map|old weather forecast|a recipe
Question: Who wrote this article?|the named author line|a nearby advertisement|browser wallpaper`),rows(`A dated log counts 12 repairs this month. A rumor says hundreds.|Use the log’s count within its scope.|Treat the rumor as certain.|The log covers all years.
A study lists methods and measurements. An ad gives praise only.|Data better support measurement claims.|Praise is measurement.|Every ad is always false.
This year’s schedule differs from last year’s.|Use the current dated schedule.|Ignore dates.|Last year must be right.
Two of three trials lost 4 mL. Paraphrase fairly.|In two trials, measured loss was 4 mL.|Every trial everywhere loses 4 mL.|No loss occurred.
You copy a report’s exact words.|Use quotation marks and name the report.|Claim the words as your own.|Change one word and omit the source.
An image has no date, location, or scale.|More context is needed for a measurement claim.|It proves every measurement.|Colors prove its date.
Jo’s report, page 2, gives class results.|Name Jo’s report and page 2.|Cite only “the internet.”|Give no source.
Two records count different time periods.|Check periods before comparison.|One must be dishonest.|Add counts without checking overlap.
An official page describes one study.|Use evidence within the study’s scope.|Every official claim is automatically true.|Official pages never change.
A summary omits that only six objects were tested.|Include the sample size.|Treat six as the whole world.|Delete the date too.`)]);

// P-banks: new level-specific cases; see banks-grade5-candidates.md.
const bankGrowthRows={
"decode5": {
"1": [
{"ask":{"en":"Join the chunks. Which spelling fits?","ko":"철자 조각을 합친 낱말을 골라요."},"show":{"en":"cab + in","ko":"cab + in"},"right":{"en":"cabin","ko":"cabin"},"wrong":[{"en":"caben","ko":"caben"},{"en":"cabbin","ko":"cabbin"}]},
{"ask":{"en":"Join the chunks. Which spelling fits?","ko":"철자 조각을 합친 낱말을 골라요."},"show":{"en":"fab + ric","ko":"fab + ric"},"right":{"en":"fabric","ko":"fabric"},"wrong":[{"en":"fabrec","ko":"fabrec"},{"en":"fabrick","ko":"fabrick"}]}
],
"2": [
{"ask":{"en":"Combine the parts and use their meanings.","ko":"조각을 합치고 뜻도 생각해 골라요."},"show":{"en":"mis = wrongly; read = interpret written words. Which word means interpret wrongly?","ko":"mis = wrongly; read = interpret written words. Which word means interpret wrongly?"},"right":{"en":"misread","ko":"misread"},"wrong":[{"en":"reread","ko":"reread"},{"en":"unread","ko":"unread"}]},
{"ask":{"en":"Combine the parts and use their meanings.","ko":"조각을 합치고 뜻도 생각해 골라요."},"show":{"en":"re = again; build = construct. Which word means construct again?","ko":"re = again; build = construct. Which word means construct again?"},"right":{"en":"rebuild","ko":"rebuild"},"wrong":[{"en":"unbuilt","ko":"unbuilt"},{"en":"builder","ko":"builder"}]}
]
},
"roots5": {
"1": [
{"ask":{"en":"Use the root clue. Which meaning fits?","ko":"어근 단서에 맞는 뜻을 골라요."},"show":{"en":"audible: aud = hear; ible = able to be","ko":"audible: aud = hear; ible = able to be"},"right":{"en":"able to be heard","ko":"able to be heard"},"wrong":[{"en":"able to be carried","ko":"able to be carried"},{"en":"able to be seen","ko":"able to be seen"}]},
{"ask":{"en":"Use the root clue. Which meaning fits?","ko":"어근 단서에 맞는 뜻을 골라요."},"show":{"en":"aquatic: aqua = water","ko":"aquatic: aqua = water"},"right":{"en":"related to water","ko":"related to water"},"wrong":[{"en":"related to heat","ko":"related to heat"},{"en":"related to sound","ko":"related to sound"}]}
],
"2": [
{"ask":{"en":"Compare the context with the root meaning.","ko":"문맥과 어근의 뜻을 함께 비교해요."},"show":{"en":"A thermometer records temperature; a barometer records air pressure. Meter means measure. What do both tools do?","ko":"A thermometer records temperature; a barometer records air pressure. Meter means measure. What do both tools do?"},"right":{"en":"measure a property","ko":"measure a property"},"wrong":[{"en":"produce a property","ko":"produce a property"},{"en":"remove a property","ko":"remove a property"}]},
{"ask":{"en":"Compare the context with the root meaning.","ko":"문맥과 어근의 뜻을 함께 비교해요."},"show":{"en":"An export leaves a country; an import enters it. Port means carry. What changes between the words?","ko":"An export leaves a country; an import enters it. Port means carry. What changes between the words?"},"right":{"en":"the direction of carrying","ko":"the direction of carrying"},"wrong":[{"en":"the material being carried","ko":"the material being carried"},{"en":"the speed of carrying","ko":"the speed of carrying"}]}
]
},
"spell5": {
"1": [
{"ask":{"en":"Join the parts. Choose the correct spelling.","ko":"조각을 합친 올바른 철자를 골라요."},"show":{"en":"bright + ness","ko":"bright + ness"},"right":{"en":"brightness","ko":"brightness"},"wrong":[{"en":"brightnes","ko":"brightnes"},{"en":"brighness","ko":"brighness"}]},
{"ask":{"en":"Join the parts. Choose the correct spelling.","ko":"조각을 합친 올바른 철자를 골라요."},"show":{"en":"sudden + ly","ko":"sudden + ly"},"right":{"en":"suddenly","ko":"suddenly"},"wrong":[{"en":"suddenley","ko":"suddenley"},{"en":"sudenly","ko":"sudenly"}]}
],
"2": [
{"ask":{"en":"Apply the spelling change and sentence clue.","ko":"철자 변화와 문장 단서를 함께 살펴요."},"show":{"en":"The puppies are __. (play + ing)","ko":"The puppies are __. (play + ing)"},"right":{"en":"playing","ko":"playing"},"wrong":[{"en":"plaing","ko":"plaing"},{"en":"playying","ko":"playying"}]},
{"ask":{"en":"Apply the spelling change and sentence clue.","ko":"철자 변화와 문장 단서를 함께 살펴요."},"show":{"en":"Yesterday she __ the heavy bag. (carry + ed)","ko":"Yesterday she __ the heavy bag. (carry + ed)"},"right":{"en":"carried","ko":"carried"},"wrong":[{"en":"carryed","ko":"carryed"},{"en":"caried","ko":"caried"}]}
]
},
"fluency5": {
"1": [
{"ask":{"en":"Replace the comma with /. Keep every word in order.","ko":"쉼표를 /로 바꾸고 낱말 순서를 지켜요."},"show":{"en":"Beyond the fence, the horses grazed.","ko":"Beyond the fence, the horses grazed."},"right":{"en":"Beyond the fence / the horses grazed.","ko":"Beyond the fence / the horses grazed."},"wrong":[{"en":"Beyond / the fence the horses grazed.","ko":"Beyond / the fence the horses grazed."},{"en":"Beyond the fence the / horses grazed.","ko":"Beyond the fence the / horses grazed."}]},
{"ask":{"en":"Replace the comma with /. Keep every word in order.","ko":"쉼표를 /로 바꾸고 낱말 순서를 지켜요."},"show":{"en":"During the concert, the audience listened.","ko":"During the concert, the audience listened."},"right":{"en":"During the concert / the audience listened.","ko":"During the concert / the audience listened."},"wrong":[{"en":"During / the concert the audience listened.","ko":"During / the concert the audience listened."},{"en":"During the concert the / audience listened.","ko":"During the concert the / audience listened."}]}
],
"2": [
{"ask":{"en":"Use the punctuation and the meaning together.","ko":"문장 부호와 뜻을 함께 살펴요."},"show":{"en":"“You finished already?” Jo asked in surprise.","ko":"“You finished already?” Jo asked in surprise."},"right":{"en":"Use a surprised question voice.","ko":"Use a surprised question voice."},"wrong":[{"en":"Use a calm command voice.","ko":"Use a calm command voice."},{"en":"Use a flat statement voice.","ko":"Use a flat statement voice."}]},
{"ask":{"en":"Use the punctuation and the meaning together.","ko":"문장 부호와 뜻을 함께 살펴요."},"show":{"en":"The package was marked fragile, so I reread the word before setting it down gently.","ko":"The package was marked fragile, so I reread the word before setting it down gently."},"right":{"en":"Link the warning to the careful action.","ko":"Link the warning to the careful action."},"wrong":[{"en":"Link the warning to a forceful toss.","ko":"Link the warning to a forceful toss."},{"en":"Read so as if it signals contrast.","ko":"Read so as if it signals contrast."}]}
]
},
"context5": {
"1": [
{"ask":{"en":"Which meaning fits the marked word?","ko":"표시한 낱말의 뜻을 골라요."},"show":{"en":"The steep hill rose sharply above the road. What does steep mean?","ko":"The steep hill rose sharply above the road. What does steep mean?"},"right":{"en":"sloping sharply","ko":"sloping sharply"},"wrong":[{"en":"nearly level","ko":"nearly level"},{"en":"gently curving","ko":"gently curving"}]},
{"ask":{"en":"Which meaning fits the marked word?","ko":"표시한 낱말의 뜻을 골라요."},"show":{"en":"The aroma of fresh bread filled the bakery. What does aroma mean?","ko":"The aroma of fresh bread filled the bakery. What does aroma mean?"},"right":{"en":"a noticeable smell","ko":"a noticeable smell"},"wrong":[{"en":"a crackling sound","ko":"a crackling sound"},{"en":"a rough texture","ko":"a rough texture"}]}
],
"2": [
{"ask":{"en":"Use two clues to infer the meaning.","ko":"두 단서로 낱말의 뜻을 짐작해요."},"show":{"en":"The trail was arduous: even rested hikers moved slowly and needed many breaks. What does arduous mean?","ko":"The trail was arduous: even rested hikers moved slowly and needed many breaks. What does arduous mean?"},"right":{"en":"requiring much effort","ko":"requiring much effort"},"wrong":[{"en":"requiring little time","ko":"requiring little time"},{"en":"offering many choices","ko":"offering many choices"}]},
{"ask":{"en":"Use two clues to infer the meaning.","ko":"두 단서로 낱말의 뜻을 짐작해요."},"show":{"en":"His response was concise: it used just a few words yet included every needed fact. What does concise mean?","ko":"His response was concise: it used just a few words yet included every needed fact. What does concise mean?"},"right":{"en":"brief but complete","ko":"brief but complete"},"wrong":[{"en":"long and detailed","ko":"long and detailed"},{"en":"brief but unrelated","ko":"brief but unrelated"}]}
]
},
"analogy5": {
"1": [
{"ask":{"en":"Complete the same relationship.","ko":"같은 관계가 되도록 골라요."},"show":{"en":"author : novel :: composer : __","ko":"author : novel :: composer : __"},"right":{"en":"symphony","ko":"symphony"},"wrong":[{"en":"instrument","ko":"instrument"},{"en":"audience","ko":"audience"}]},
{"ask":{"en":"Complete the same relationship.","ko":"같은 관계가 되도록 골라요."},"show":{"en":"ounce : weight :: minute : __","ko":"ounce : weight :: minute : __"},"right":{"en":"time","ko":"time"},"wrong":[{"en":"length","ko":"length"},{"en":"volume","ko":"volume"}]}
],
"2": [
{"ask":{"en":"Compare the relationship or the context.","ko":"관계나 문맥을 비교해 골라요."},"show":{"en":"A branch of the library opened beside the park. Which meaning fits branch?","ko":"A branch of the library opened beside the park. Which meaning fits branch?"},"right":{"en":"a local part of an organization","ko":"a local part of an organization"},"wrong":[{"en":"a woody part of a tree","ko":"a woody part of a tree"},{"en":"a narrow part of a stream","ko":"a narrow part of a stream"}]},
{"ask":{"en":"Compare the relationship or the context.","ko":"관계나 문맥을 비교해 골라요."},"show":{"en":"A player serves a ball; a waiter serves a meal. What changes in the meaning of serves?","ko":"A player serves a ball; a waiter serves a meal. What changes in the meaning of serves?"},"right":{"en":"starts play versus provides food","ko":"starts play versus provides food"},"wrong":[{"en":"wins play versus prepares food","ko":"wins play versus prepares food"},{"en":"ends play versus buys food","ko":"ends play versus buys food"}]}
]
},
"wordshade5": {
"1": [
{"ask":{"en":"Choose the precise action word.","ko":"행동에 정확히 맞는 낱말을 골라요."},"show":{"en":"Move along the ground on hands and knees.","ko":"Move along the ground on hands and knees."},"right":{"en":"crawl","ko":"crawl"},"wrong":[{"en":"stride","ko":"stride"},{"en":"skip","ko":"skip"}]},
{"ask":{"en":"Choose the precise action word.","ko":"행동에 정확히 맞는 낱말을 골라요."},"show":{"en":"Pull something along the ground with effort.","ko":"Pull something along the ground with effort."},"right":{"en":"drag","ko":"drag"},"wrong":[{"en":"toss","ko":"toss"},{"en":"raise","ko":"raise"}]}
],
"2": [
{"ask":{"en":"Match both conditions in the description.","ko":"설명의 두 조건에 모두 맞게 골라요."},"show":{"en":"The speaker disagrees politely and gives a reason.","ko":"The speaker disagrees politely and gives a reason."},"right":{"en":"objects","ko":"objects"},"wrong":[{"en":"insults","ko":"insults"},{"en":"applauds","ko":"applauds"}]},
{"ask":{"en":"Match both conditions in the description.","ko":"설명의 두 조건에 모두 맞게 골라요."},"show":{"en":"The learner checks a draft and changes it to improve clarity.","ko":"The learner checks a draft and changes it to improve clarity."},"right":{"en":"revises","ko":"revises"},"wrong":[{"en":"copies","ko":"copies"},{"en":"discards","ko":"discards"}]}
]
},
"reference5": {
"1": [
{"ask":{"en":"Use the glossary entry. Which meaning fits?","ko":"용어 풀이에 맞는 뜻을 골라요."},"show":{"en":"durable: able to last despite use","ko":"durable: able to last despite use"},"right":{"en":"long-lasting","ko":"long-lasting"},"wrong":[{"en":"quickly broken","ko":"quickly broken"},{"en":"rarely used","ko":"rarely used"}]},
{"ask":{"en":"Use the glossary entry. Which meaning fits?","ko":"용어 풀이에 맞는 뜻을 골라요."},"show":{"en":"remote: far from other places","ko":"remote: far from other places"},"right":{"en":"far away","ko":"far away"},"wrong":[{"en":"close by","ko":"close by"},{"en":"newly built","ko":"newly built"}]}
],
"2": [
{"ask":{"en":"Use the entry and context to choose the definition number.","ko":"풀이와 문맥을 함께 보고 뜻의 번호를 골라요."},"show":{"en":"draft: 1 a rough written version; 2 a flow of air; 3 select for a team. A cold draft slipped under the door.","ko":"draft: 1 a rough written version; 2 a flow of air; 3 select for a team. A cold draft slipped under the door."},"right":{"en":"2","ko":"2"},"wrong":[{"en":"1","ko":"1"},{"en":"3","ko":"3"}]},
{"ask":{"en":"Use the entry and context to choose the definition number.","ko":"풀이와 문맥을 함께 보고 뜻의 번호를 골라요."},"show":{"en":"pitch: 1 throw a ball; 2 how high or low a sound is; 3 put up a tent. The flute produced a high pitch.","ko":"pitch: 1 throw a ball; 2 how high or low a sound is; 3 put up a tent. The flute produced a high pitch."},"right":{"en":"2","ko":"2"},"wrong":[{"en":"1","ko":"1"},{"en":"3","ko":"3"}]}
]
},
"sentence5": {
"1": [
{"ask":{"en":"Choose the connector that fits the relation.","ko":"관계에 맞는 연결어를 골라요."},"show":{"en":"Condition: You may borrow the camera __ you return it today.","ko":"Condition: You may borrow the camera __ you return it today."},"right":{"en":"if","ko":"if"},"wrong":[{"en":"although","ko":"although"},{"en":"because","ko":"because"}]},
{"ask":{"en":"Choose the connector that fits the relation.","ko":"관계에 맞는 연결어를 골라요."},"show":{"en":"Contrast: The box looked small, __ it held many tools.","ko":"Contrast: The box looked small, __ it held many tools."},"right":{"en":"yet","ko":"yet"},"wrong":[{"en":"so","ko":"so"},{"en":"because","ko":"because"}]}
],
"2": [
{"ask":{"en":"Keep both the relation and the order of events.","ko":"관계와 사건의 순서를 모두 지켜요."},"show":{"en":"The team checked the ropes before climbing because safety mattered.","ko":"The team checked the ropes before climbing because safety mattered."},"right":{"en":"Safety mattered, so the team checked ropes before climbing.","ko":"Safety mattered, so the team checked ropes before climbing."},"wrong":[{"en":"The team climbed before checking ropes for safety.","ko":"The team climbed before checking ropes for safety."},{"en":"The ropes were checked because climbing had ended.","ko":"The ropes were checked because climbing had ended."}]},
{"ask":{"en":"Keep both the relation and the order of events.","ko":"관계와 사건의 순서를 모두 지켜요."},"show":{"en":"The first route was shorter, but the longer route had a safer bridge.","ko":"The first route was shorter, but the longer route had a safer bridge."},"right":{"en":"The team could trade a longer trip for a safer crossing.","ko":"The team could trade a longer trip for a safer crossing."},"wrong":[{"en":"The shorter route also had the safer bridge.","ko":"The shorter route also had the safer bridge."},{"en":"Both routes had the same length and bridge.","ko":"Both routes had the same length and bridge."}]}
]
},
"edit5": {
"1": [
{"ask":{"en":"Follow the stated editing rule.","ko":"제시한 문장 규칙에 맞게 골라요."},"show":{"en":"Use a possessive for the one artist who owns the brush.","ko":"Use a possessive for the one artist who owns the brush."},"right":{"en":"the artist’s brush","ko":"the artist’s brush"},"wrong":[{"en":"the artists brush","ko":"the artists brush"},{"en":"the artists’ brush","ko":"the artists’ brush"}]},
{"ask":{"en":"Follow the stated editing rule.","ko":"제시한 문장 규칙에 맞게 골라요."},"show":{"en":"Use the past tense of choose.","ko":"Use the past tense of choose."},"right":{"en":"She chose the blue cloth.","ko":"She chose the blue cloth."},"wrong":[{"en":"She choosed the blue cloth.","ko":"She choosed the blue cloth."},{"en":"She choose the blue cloth.","ko":"She choose the blue cloth."}]}
],
"2": [
{"ask":{"en":"Correct the sentence while preserving its meaning.","ko":"뜻을 유지하며 문장을 바르게 고쳐요."},"show":{"en":"Keep two completed actions in the past: He opened the box and finds a note.","ko":"Keep two completed actions in the past: He opened the box and finds a note."},"right":{"en":"He opened the box and found a note.","ko":"He opened the box and found a note."},"wrong":[{"en":"He opens the box and found a note.","ko":"He opens the box and found a note."},{"en":"He opened the box and will find a note.","ko":"He opened the box and will find a note."}]},
{"ask":{"en":"Correct the sentence while preserving its meaning.","ko":"뜻을 유지하며 문장을 바르게 고쳐요."},"show":{"en":"Use commas and retain the direct address: Please help us Lena.","ko":"Use commas and retain the direct address: Please help us Lena."},"right":{"en":"Please help us, Lena.","ko":"Please help us, Lena."},"wrong":[{"en":"Please, help, us Lena.","ko":"Please, help, us Lena."},{"en":"Please help, us Lena.","ko":"Please help, us Lena."}]}
]
},
"purpose5": {
"1": [
{"ask":{"en":"Identify the main purpose.","ko":"주된 목적을 골라요."},"show":{"en":"Step 1: Wet the brush. Step 2: Add a small amount of paint.","ko":"Step 1: Wet the brush. Step 2: Add a small amount of paint."},"right":{"en":"explain a procedure","ko":"explain a procedure"},"wrong":[{"en":"recommend a purchase","ko":"recommend a purchase"},{"en":"recount a memory","ko":"recount a memory"}]},
{"ask":{"en":"Identify the main purpose.","ko":"주된 목적을 골라요."},"show":{"en":"The lost scarf has green stripes. Please return it to Room 4.","ko":"The lost scarf has green stripes. Please return it to Room 4."},"right":{"en":"recover a missing item","ko":"recover a missing item"},"wrong":[{"en":"compare clothing materials","ko":"compare clothing materials"},{"en":"explain how scarves are made","ko":"explain how scarves are made"}]}
],
"2": [
{"ask":{"en":"Choose wording that fits both audience and purpose.","ko":"독자와 목적에 모두 맞는 표현을 골라요."},"show":{"en":"A park sign for first-time visitors must explain how to reach the pond.","ko":"A park sign for first-time visitors must explain how to reach the pond."},"right":{"en":"Follow the marked path past the gate to the pond.","ko":"Follow the marked path past the gate to the pond."},"wrong":[{"en":"Our pond is the loveliest spot in the whole park.","ko":"Our pond is the loveliest spot in the whole park."},{"en":"Last summer I visited the pond with my cousin.","ko":"Last summer I visited the pond with my cousin."}]},
{"ask":{"en":"Choose wording that fits both audience and purpose.","ko":"독자와 목적에 모두 맞는 표현을 골라요."},"show":{"en":"A class report for families must summarize the cleanup results.","ko":"A class report for families must summarize the cleanup results."},"right":{"en":"We filled six bags and cleared both marked paths.","ko":"We filled six bags and cleared both marked paths."},"wrong":[{"en":"Please bring gloves for a cleanup next month.","ko":"Please bring gloves for a cleanup next month."},{"en":"Imagine a path where squirrels plan a cleanup.","ko":"Imagine a path where squirrels plan a cleanup."}]}
]
},
"viewpoint5": {
"1": [
{"ask":{"en":"Which expression identifies the narrator’s viewpoint?","ko":"서술자의 관점을 보여 주는 표현은?"},"show":{"en":"We packed our instruments before the bus arrived.","ko":"We packed our instruments before the bus arrived."},"right":{"en":"we and our: first person","ko":"we and our: first person"},"wrong":[{"en":"bus and instruments: second person","ko":"bus and instruments: second person"},{"en":"arrived and packed: third person","ko":"arrived and packed: third person"}]},
{"ask":{"en":"Which expression identifies the narrator’s viewpoint?","ko":"서술자의 관점을 보여 주는 표현은?"},"show":{"en":"She watched the kite while her brother held the string.","ko":"She watched the kite while her brother held the string."},"right":{"en":"she and her: third person","ko":"she and her: third person"},"wrong":[{"en":"kite and string: first person","ko":"kite and string: first person"},{"en":"brother and held: second person","ko":"brother and held: second person"}]}
],
"2": [
{"ask":{"en":"Compare what each narrator can know or notices.","ko":"서술자가 아는 것과 주목한 점을 비교해요."},"show":{"en":"Builder: “I worried whether the bridge would hold.” Visitor: “I noticed its bright paint.”","ko":"Builder: “I worried whether the bridge would hold.” Visitor: “I noticed its bright paint.”"},"right":{"en":"One focuses on safety; the other on appearance.","ko":"One focuses on safety; the other on appearance."},"wrong":[{"en":"Both focus only on the bridge’s bright paint.","ko":"Both focus only on the bridge’s bright paint."},{"en":"Both describe the builder’s private thoughts.","ko":"Both describe the builder’s private thoughts."}]},
{"ask":{"en":"Compare what each narrator can know or notices.","ko":"서술자가 아는 것과 주목한 점을 비교해요."},"show":{"en":"A: “I could not see inside the locked shed.” B: “Inside, I searched every shelf.”","ko":"A: “I could not see inside the locked shed.” B: “Inside, I searched every shelf.”"},"right":{"en":"The narrators have different access to the setting.","ko":"The narrators have different access to the setting."},"wrong":[{"en":"Both narrators observe the same interior details.","ko":"Both narrators observe the same interior details."},{"en":"Neither narrator enters any part of the setting.","ko":"Neither narrator enters any part of the setting."}]}
]
},
"character5": {
"1": [
{"ask":{"en":"Which action tries to solve the problem?","ko":"문제를 해결하려는 행동은?"},"show":{"en":"The costume tore before the show. Pat sewed a patch over the tear.","ko":"The costume tore before the show. Pat sewed a patch over the tear."},"right":{"en":"sewing on a patch","ko":"sewing on a patch"},"wrong":[{"en":"noticing the tear","ko":"noticing the tear"},{"en":"waiting for the show","ko":"waiting for the show"}]},
{"ask":{"en":"Which action tries to solve the problem?","ko":"문제를 해결하려는 행동은?"},"show":{"en":"The group could not agree on a route. Uma compared both maps.","ko":"The group could not agree on a route. Uma compared both maps."},"right":{"en":"comparing the maps","ko":"comparing the maps"},"wrong":[{"en":"wanting different routes","ko":"wanting different routes"},{"en":"folding away both maps","ko":"folding away both maps"}]}
],
"2": [
{"ask":{"en":"Explain how the event affects the conflict.","ko":"사건이 갈등에 미치는 영향을 골라요."},"show":{"en":"Two partners blame each other for missing notes. They find the notes in a shared folder.","ko":"Two partners blame each other for missing notes. They find the notes in a shared folder."},"right":{"en":"The discovery removes the cause of their disagreement.","ko":"The discovery removes the cause of their disagreement."},"wrong":[{"en":"The discovery proves one partner hid the notes.","ko":"The discovery proves one partner hid the notes."},{"en":"The discovery makes the missing notes harder to find.","ko":"The discovery makes the missing notes harder to find."}]},
{"ask":{"en":"Explain how the event affects the conflict.","ko":"사건이 갈등에 미치는 영향을 골라요."},"show":{"en":"A player wants to win alone. After an injury, teammates help finish the relay.","ko":"A player wants to win alone. After an injury, teammates help finish the relay."},"right":{"en":"Needing help challenges the player’s belief about teamwork.","ko":"Needing help challenges the player’s belief about teamwork."},"wrong":[{"en":"The injury proves teammates cannot affect the outcome.","ko":"The injury proves teammates cannot affect the outcome."},{"en":"The relay removes every chance to learn from others.","ko":"The relay removes every chance to learn from others."}]}
]
},
"theme5": {
"1": [
{"ask":{"en":"Choose a theme supported by the story.","ko":"이야기가 뒷받침하는 주제를 골라요."},"show":{"en":"A child could keep a shiny new box or a worn note from a grandparent. The child kept the note because it recalled a shared adventure.","ko":"A child could keep a shiny new box or a worn note from a grandparent. The child kept the note because it recalled a shared adventure."},"right":{"en":"An object’s personal meaning can matter more than its appearance.","ko":"An object’s personal meaning can matter more than its appearance."},"wrong":[{"en":"A beautiful outside is the best measure of personal value.","ko":"A beautiful outside is the best measure of personal value."},{"en":"Objects are worth keeping only when they have never been used.","ko":"Objects are worth keeping only when they have never been used."}]},
{"ask":{"en":"Choose a theme supported by the story.","ko":"이야기가 뒷받침하는 주제를 골라요."},"show":{"en":"A team listened to a quiet member’s idea and found the missing trail marker.","ko":"A team listened to a quiet member’s idea and found the missing trail marker."},"right":{"en":"Useful ideas can come from any member.","ko":"Useful ideas can come from any member."},"wrong":[{"en":"The most confident speaker deserves preference.","ko":"The most confident speaker deserves preference."},{"en":"Good teams avoid changing their plans.","ko":"Good teams avoid changing their plans."}]}
],
"2": [
{"ask":{"en":"What idea is supported by both stories?","ko":"두 이야기가 함께 뒷받침하는 생각은?"},"show":{"en":"A: Before a race, one runner helps an opponent fasten a loose shoe. B: During a contest, a painter lends a rival a spare brush.","ko":"A: Before a race, one runner helps an opponent fasten a loose shoe. B: During a contest, a painter lends a rival a spare brush."},"right":{"en":"Competition can coexist with kindness toward an opponent.","ko":"Competition can coexist with kindness toward an opponent."},"wrong":[{"en":"Helping an opponent means giving up one’s own place in a contest.","ko":"Helping an opponent means giving up one’s own place in a contest."},{"en":"Fair competition requires keeping every useful resource from opponents.","ko":"Fair competition requires keeping every useful resource from opponents."}]},
{"ask":{"en":"Find the idea supported by both stories.","ko":"두 이야기가 함께 뒷받침하는 생각은?"},"show":{"en":"A: A guide slows down for a tired walker. B: A reader waits while a partner sounds out a word.","ko":"A: A guide slows down for a tired walker. B: A reader waits while a partner sounds out a word."},"right":{"en":"Patience can help others take part.","ko":"Patience can help others take part."},"wrong":[{"en":"Finishing fastest matters more than including others.","ko":"Finishing fastest matters more than including others."},{"en":"Helping others requires doing every task for them.","ko":"Helping others requires doing every task for them."}]}
]
},
"structure5": {
"1": [
{"ask":{"en":"Identify how the text is organized.","ko":"글의 짜임을 골라요."},"show":{"en":"One lamp uses a battery; the other plugs into a wall. Both give light.","ko":"One lamp uses a battery; the other plugs into a wall. Both give light."},"right":{"en":"comparison","ko":"comparison"},"wrong":[{"en":"chronological history","ko":"chronological history"},{"en":"problem and solution","ko":"problem and solution"}]},
{"ask":{"en":"Identify how the text is organized.","ko":"글의 짜임을 골라요."},"show":{"en":"The tap leaked. A new washer stopped the drip.","ko":"The tap leaked. A new washer stopped the drip."},"right":{"en":"problem and solution","ko":"problem and solution"},"wrong":[{"en":"comparison","ko":"comparison"},{"en":"spatial description","ko":"spatial description"}]}
],
"2": [
{"ask":{"en":"Choose a revision that clarifies the stated organization.","ko":"제시한 짜임을 분명하게 하는 수정은?"},"show":{"en":"A report explains three effects of a storm, but jumps between them in every paragraph.","ko":"A report explains three effects of a storm, but jumps between them in every paragraph."},"right":{"en":"Group the details into one paragraph for each effect.","ko":"Group the details into one paragraph for each effect."},"wrong":[{"en":"Put every detail into one paragraph with no grouping.","ko":"Put every detail into one paragraph with no grouping."},{"en":"Move the conclusion between each pair of details.","ko":"Move the conclusion between each pair of details."}]},
{"ask":{"en":"Choose a revision that clarifies the stated organization.","ko":"제시한 짜임을 분명하게 하는 수정은?"},"show":{"en":"Directions list joining the boards before cutting them to size. Cutting must happen first.","ko":"Directions list joining the boards before cutting them to size. Cutting must happen first."},"right":{"en":"Move the cutting step before the joining step.","ko":"Move the cutting step before the joining step."},"wrong":[{"en":"Repeat the joining step before every other step.","ko":"Repeat the joining step before every other step."},{"en":"Remove both steps from the instructions.","ko":"Remove both steps from the instructions."}]}
]
},
"figurative5": {
"1": [
{"ask":{"en":"What does the expression mean here?","ko":"문맥에서 표현의 뜻은?"},"show":{"en":"The classroom was a freezer until the heat came on.","ko":"The classroom was a freezer until the heat came on."},"right":{"en":"The room felt extremely cold.","ko":"The room felt extremely cold."},"wrong":[{"en":"The room stored frozen food.","ko":"The room stored frozen food."},{"en":"The room had no furniture.","ko":"The room had no furniture."}]},
{"ask":{"en":"What does the expression mean here?","ko":"문맥에서 표현의 뜻은?"},"show":{"en":"He finally spilled the beans about the surprise trip.","ko":"He finally spilled the beans about the surprise trip."},"right":{"en":"He revealed the secret plan.","ko":"He revealed the secret plan."},"wrong":[{"en":"He dropped the packed lunch.","ko":"He dropped the packed lunch."},{"en":"He forgot the travel date.","ko":"He forgot the travel date."}]}
],
"2": [
{"ask":{"en":"Explain the effect using the surrounding clues.","ko":"주변 단서와 함께 표현의 효과를 골라요."},"show":{"en":"“The deadline chased me,” she wrote as the final hour ticked away.","ko":"“The deadline chased me,” she wrote as the final hour ticked away."},"right":{"en":"It makes time pressure feel active and threatening.","ko":"It makes time pressure feel active and threatening."},"wrong":[{"en":"It makes the work feel finished and relaxing.","ko":"It makes the work feel finished and relaxing."},{"en":"It makes the clock seem broken and motionless.","ko":"It makes the clock seem broken and motionless."}]},
{"ask":{"en":"Explain the effect using the surrounding clues.","ko":"주변 단서와 함께 표현의 효과를 골라요."},"show":{"en":"“Ideas sprouted” after the group heard a new question.","ko":"“Ideas sprouted” after the group heard a new question."},"right":{"en":"It compares new thoughts to fresh growth.","ko":"It compares new thoughts to fresh growth."},"wrong":[{"en":"It compares old thoughts to fading light.","ko":"It compares old thoughts to fading light."},{"en":"It compares a silent room to empty soil.","ko":"It compares a silent room to empty soil."}]}
]
},
"explain5": {
"1": [
{"ask":{"en":"Which detail supports the explanation?","ko":"설명을 뒷받침하는 세부 근거는?"},"show":{"en":"In a fictional test, a lined box kept ice for 40 minutes; an unlined box kept it for 25.","ko":"In a fictional test, a lined box kept ice for 40 minutes; an unlined box kept it for 25."},"right":{"en":"The lined box kept ice longer in this test.","ko":"The lined box kept ice longer in this test."},"wrong":[{"en":"Both boxes kept ice for the same time.","ko":"Both boxes kept ice for the same time."},{"en":"The unlined box kept ice longer in this test.","ko":"The unlined box kept ice longer in this test."}]},
{"ask":{"en":"Which detail supports the explanation?","ko":"설명을 뒷받침하는 세부 근거는?"},"show":{"en":"A fictional reading log lists 6 morning pages and 4 evening pages.","ko":"A fictional reading log lists 6 morning pages and 4 evening pages."},"right":{"en":"More pages were read in the morning.","ko":"More pages were read in the morning."},"wrong":[{"en":"More pages were read in the evening.","ko":"More pages were read in the evening."},{"en":"Both sessions had equal page counts.","ko":"Both sessions had equal page counts."}]}
],
"2": [
{"ask":{"en":"Connect both records without going beyond them.","ko":"두 기록의 범위 안에서 근거를 연결해요."},"show":{"en":"Trial A: a padded case had one cracked tile out of ten. Trial B: an unpadded case had four out of ten.","ko":"Trial A: a padded case had one cracked tile out of ten. Trial B: an unpadded case had four out of ten."},"right":{"en":"These trials support comparing padding as a possible protection.","ko":"These trials support comparing padding as a possible protection."},"wrong":[{"en":"These trials prove padded cases can never allow damage.","ko":"These trials prove padded cases can never allow damage."},{"en":"These trials show the unpadded case protected more tiles.","ko":"These trials show the unpadded case protected more tiles."}]},
{"ask":{"en":"Connect both records without going beyond them.","ko":"두 기록의 범위 안에서 근거를 연결해요."},"show":{"en":"Bus log: 12 minutes on Monday, 18 on Tuesday. Traffic notes: roadwork Tuesday only.","ko":"Bus log: 12 minutes on Monday, 18 on Tuesday. Traffic notes: roadwork Tuesday only."},"right":{"en":"Roadwork may help explain Tuesday’s longer trip.","ko":"Roadwork may help explain Tuesday’s longer trip."},"wrong":[{"en":"Roadwork certainly explains every minute of both trips.","ko":"Roadwork certainly explains every minute of both trips."},{"en":"Monday’s trip took longer because roadwork was absent.","ko":"Monday’s trip took longer because roadwork was absent."}]}
]
},
"opinion5": {
"1": [
{"ask":{"en":"Which reason directly supports the stated goal?","ko":"제시한 목표를 직접 뒷받침하는 이유는?"},"show":{"en":"Goal: Help users find supplies and return them to the right drawer. Proposal: Label the shared supply drawers.","ko":"Goal: Help users find supplies and return them to the right drawer. Proposal: Label the shared supply drawers."},"right":{"en":"Labels would help users locate and return supplies.","ko":"Labels would help users locate and return supplies."},"wrong":[{"en":"Labels would remind users which drawers need to be closed.","ko":"Labels would remind users which drawers need to be closed."},{"en":"Labels would show which person last borrowed each item.","ko":"Labels would show which person last borrowed each item."}]},
{"ask":{"en":"Which reason directly supports the proposal?","ko":"제안을 직접 뒷받침하는 이유는?"},"show":{"en":"Proposal: Add a short rehearsal before the presentation.","ko":"Proposal: Add a short rehearsal before the presentation."},"right":{"en":"Practice could reveal unclear sections before the audience arrives.","ko":"Practice could reveal unclear sections before the audience arrives."},"wrong":[{"en":"Practice could predict exactly how long every audience question takes.","ko":"Practice could predict exactly how long every audience question takes."},{"en":"Practice could replace listening to audience feedback afterward.","ko":"Practice could replace listening to audience feedback afterward."}]}
],
"2": [
{"ask":{"en":"Choose a conclusion supported by the given evidence.","ko":"제시한 근거가 뒷받침하는 결론은?"},"show":{"en":"Proposal: Move a checkout desk. Trial: 8 of 10 users found it faster; 2 took longer.","ko":"Proposal: Move a checkout desk. Trial: 8 of 10 users found it faster; 2 took longer."},"right":{"en":"The move helped most trial users, though not all.","ko":"The move helped most trial users, though not all."},"wrong":[{"en":"The move helped every user by the same amount.","ko":"The move helped every user by the same amount."},{"en":"The move made most trial users take longer.","ko":"The move made most trial users take longer."}]},
{"ask":{"en":"Choose a conclusion supported by the given evidence.","ko":"제시한 근거가 뒷받침하는 결론은?"},"show":{"en":"Proposal: Keep two quiet study tables. Survey: 14 want quiet space, 6 want group talk; 20 answered.","ko":"Proposal: Keep two quiet study tables. Survey: 14 want quiet space, 6 want group talk; 20 answered."},"right":{"en":"Keep some quiet space while considering group needs.","ko":"Keep some quiet space while considering group needs."},"wrong":[{"en":"Use every table for quiet work because all prefer it.","ko":"Use every table for quiet work because all prefer it."},{"en":"Remove quiet space because most prefer group talk.","ko":"Remove quiet space because most prefer group talk."}]}
]
},
"poetry5": {
"1": [
{"ask":{"en":"Choose a supported observation about the poem.","ko":"시의 짜임에서 확인할 수 있는 것은?"},"show":{"en":"One red leaf,\nOne bare tree,\nOne still path.","ko":"One red leaf,\nOne bare tree,\nOne still path."},"right":{"en":"All three lines begin with One.","ko":"All three lines begin with One."},"wrong":[{"en":"All three lines end in rhyme.","ko":"All three lines end in rhyme."},{"en":"Each line has only one word.","ko":"Each line has only one word."}]},
{"ask":{"en":"Choose a supported observation about the poem.","ko":"시의 짜임에서 확인할 수 있는 것은?"},"show":{"en":"The lantern’s glow,\nAcross the snow.","ko":"The lantern’s glow,\nAcross the snow."},"right":{"en":"The final words rhyme.","ko":"The final words rhyme."},"wrong":[{"en":"Both lines begin with the same word.","ko":"Both lines begin with the same word."},{"en":"The poem has three stanzas.","ko":"The poem has three stanzas."}]}
],
"2": [
{"ask":{"en":"Connect the poem’s structure to its effect.","ko":"시의 짜임과 효과를 연결해요."},"show":{"en":"Run, run, run—\nThe station bell!\nRest.\nWe made it.","ko":"Run, run, run—\nThe station bell!\nRest.\nWe made it."},"right":{"en":"Repeated running gives way to relief after the speakers arrive.","ko":"Repeated running gives way to relief after the speakers arrive."},"wrong":[{"en":"Repeated running gives way to regret about missing the train.","ko":"Repeated running gives way to regret about missing the train."},{"en":"Repeated running continues after the speakers have reached their goal.","ko":"Repeated running continues after the speakers have reached their goal."}]},
{"ask":{"en":"Connect the poem’s structure to its effect.","ko":"시의 짜임과 효과를 연결해요."},"show":{"en":"At dawn, I wait.\nAt noon, I wait.\nAt dusk—your footsteps!","ko":"At dawn, I wait.\nAt noon, I wait.\nAt dusk—your footsteps!"},"right":{"en":"Repeated waiting highlights the change at the end.","ko":"Repeated waiting highlights the change at the end."},"wrong":[{"en":"Repeated waiting makes the ending another quiet wait.","ko":"Repeated waiting makes the ending another quiet wait."},{"en":"The three lines describe events in reverse order.","ko":"The three lines describe events in reverse order."}]}
]
},
"source5": {
"1": [
{"ask":{"en":"Choose the source that directly answers the question.","ko":"질문에 직접 답하는 자료는?"},"show":{"en":"Question: What time did the school bus reach the stop today?","ko":"Question: What time did the school bus reach the stop today?"},"right":{"en":"today’s arrival-time log","ko":"today’s arrival-time log"},"wrong":[{"en":"today’s seating list","ko":"today’s seating list"},{"en":"last term’s route proposal","ko":"last term’s route proposal"}]},
{"ask":{"en":"Choose the source that directly answers the question.","ko":"질문에 직접 답하는 자료는?"},"show":{"en":"Question: How deep was the pond at the marked pole this morning?","ko":"Question: How deep was the pond at the marked pole this morning?"},"right":{"en":"this morning’s depth measurement","ko":"this morning’s depth measurement"},"wrong":[{"en":"this morning’s bird count","ko":"this morning’s bird count"},{"en":"last year’s depth measurement","ko":"last year’s depth measurement"}]}
],
"2": [
{"ask":{"en":"Compare the evidence and respect its limits.","ko":"근거를 비교하고 그 범위를 지켜요."},"show":{"en":"One visitor reports a busy park. A counter records 80 entries on Saturday and 25 on Sunday.","ko":"One visitor reports a busy park. A counter records 80 entries on Saturday and 25 on Sunday."},"right":{"en":"Use the dated counts to compare those two days.","ko":"Use the dated counts to compare those two days."},"wrong":[{"en":"Use one visitor’s impression to prove every day is busy.","ko":"Use one visitor’s impression to prove every day is busy."},{"en":"Use Saturday’s count as the count for both days.","ko":"Use Saturday’s count as the count for both days."}]},
{"ask":{"en":"Compare the evidence and respect its limits.","ko":"근거를 비교하고 그 범위를 지켜요."},"show":{"en":"A chart reports 15 votes but gives no survey date. A second gives 20 votes on May 3.","ko":"A chart reports 15 votes but gives no survey date. A second gives 20 votes on May 3."},"right":{"en":"The missing date limits a comparison over time.","ko":"The missing date limits a comparison over time."},"wrong":[{"en":"The larger count proves the first survey happened earlier.","ko":"The larger count proves the first survey happened earlier."},{"en":"The missing date proves the first count is false.","ko":"The missing date proves the first count is false."}]}
]
}
};
const bankGrowthItem=(id,lv,i)=>{const r=bankGrowthRows[id][lv][i];const it=item(r.ask,r.show.en,r.right.en,r.wrong.map(x=>x.en));it.bankGrowth=true;it.cls+=' bank-growth-options';return it;};
})();




