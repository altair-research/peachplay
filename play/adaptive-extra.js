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
    ['plane', 'p', 'lane', ['plan', 'plate']], ['train', 't', 'rain', ['trail', 'tin']]
  ];
  for (const grade of ['2', '3']) add('adremove' + grade, grade, B('Take Away a Sound', '소리 하나 빼요'), soundArea, lv => {
    const t = pick(lv === 1 ? deletions.slice(0, 6) : deletions.slice(6));
    return { ask: B(`Say "${t[0]}" without the first /${t[1]}/ sound.`, `"${t[0]}"에서 첫 /${t[1]}/ 소리를 빼고 말해요.`),
      askExtra: { t: t[0], lang: 'en-US' }, opts: choices(t[2], t[3]), cls: 'words', after: B(`${t[0]} → ${t[2]}`, `${t[0]} → ${t[2]}`) };
  });
  const changes = [
    ['slip', 'p', 't', 'slit', ['slap', 'sip']], ['crab', 'b', 'k', 'crack', ['cab', 'crib']],
    ['grin', 'n', 'p', 'grip', ['green', 'gin']], ['flat', 't', 'p', 'flap', ['fat', 'flip']],
    ['trip', 'p', 'm', 'trim', ['tip', 'trap']], ['flag', 'g', 'p', 'flap', ['flat', 'lag']],
    ['swan', 'n', 'p', 'swap', ['swim', 'wan']], ['cup', 'p', 't', 'cut', ['cap', 'cub']],
    ['tent', 't', 's', 'tense', ['ten', 'test']], ['brim', 'm', 'k', 'brick', ['rim', 'brisk']]
  ];
  add('adchange3', '3', B('Change the Last Sound', '끝소리를 바꿔요'), soundArea, lv => {
    const t = pick(lv === 1 ? changes.slice(0, 5) : changes.slice(5));
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
    2: ['I smile ___ I am happy.', 'Three ___ are here.', 'My ___ plays with me.', 'We have ___ food for everyone.', 'Let us play ___.', 'I ___ about the story.', 'We walk ___ the gate.', 'I know the ___.', 'I ___ a bell ring.', 'We ___ read after lunch.'],
    3: ['I ___ brush my teeth at bedtime, every night.', 'The twins walk home ___.', 'I want ___ cup.', '___ child has a pencil.', 'This book is ___ trains.', 'We wash our hands ___ lunch.', 'We sit ___ the table.', 'Red and blue are ___ colors.', '___ it rained, we stayed dry.', 'I found ___ in the box: a key!']
  };
  for (const grade of ['K', '1', '2', '3']) add('adwords' + grade, grade, B('Familiar Word Spellings', '익숙한 낱말 철자'), wordArea, lv => {
    const t = pick(lv === 1 ? words[grade].slice(0, 5) : words[grade].slice(5));
    const sentence = sentences[grade][words[grade].indexOf(t)];
    return { ask: B('Which word fits? Choose the correct spelling.', '문장에 맞는 낱말의 올바른 철자를 골라요.'),
      askExtra: { t: sentence.replace('___', t[0]), lang: 'en-US' }, show: passage(sentence), opts: choices(t[0], t.slice(1)), cls: 'words', after: B(sentence.replace('___', t[0]), sentence.replace('___', t[0])), vocab: t[0],
      onRender() { const button = $('.storytext .rd'); if (button) button.onclick = () => say(sentence.replace('___', 'blank'), 'en-US'); } };
  });
  const contexts = [
    ['We wash our hands ___ lunch.', 'before', ['between', 'under']], ['The twins walk home ___.', 'together', ['during', 'between']],
    ['I finished this book. I want ___ one.', 'another', ['these', 'those']], ['___ child has a pencil.', 'Every', ['Many', 'Both']],
    ['We sat ___ the round table.', 'around', ['during', 'until']], ['The red and blue hats are ___.', 'different', ['during', 'between']],
    ['I found ___ in the box: a key!', 'something', ['nothing', 'nobody']], ['This book is ___ trains.', 'about', ['between', 'under']],
    ['___ it rained, we stayed dry inside.', 'Though', ['During', 'Despite']], ['I ___ brush my teeth at bedtime, every night.', 'always', ['never', 'rarely']]
  ];
  add('adwordcontext3', '3', B('Familiar Words in Sentences', '문장 속 익숙한 낱말'), wordArea, lv => {
    const t = pick(lv === 1 ? contexts.slice(0, 5) : contexts.slice(5));
    return { ask: B('Which word completes the sentence?', '문장을 완성하는 낱말을 골라요.'), askExtra: { t: t[0].replace('___', 'blank'), lang: 'en-US' },
      show: passage(t[0]), opts: choices(t[1], t[2]), cls: 'words', after: B(t[0].replace('___', t[1]), t[0].replace('___', t[1])) };
  });
  const oppositePairs = [['hot', 'cold'], ['up', 'down'], ['big', 'small'], ['open', 'closed'], ['day', 'night'], ['full', 'empty'], ['wet', 'dry'], ['near', 'far'], ['fast', 'slow'], ['soft', 'hard']];
  for (const grade of ['K', '1']) add('admeaning' + grade, grade, B('Opposite Word Partners', '반대 뜻 짝꿍'), B('Vocabulary', '어휘'), lv => {
    const index = (lv === 1 ? 0 : 5) + rnd(5), pair = oppositePairs[index];
    const ds = shuffle(oppositePairs.filter((_, i) => i !== index).map(p => p[1])).slice(0, 2);
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
    const name = pick(names), obj = pick(objects), ds = shuffle(objects.filter(o => o !== obj)).slice(0, 2).map(o => o[0]);
    const text = lv === 1 ? `${name} has a ${obj[0]}. ${name} takes it home.` : `${name} cannot find a ${obj[0]}. It is under the bed. ${name} picks it up.`;
    return textRound(text, B(`What does ${name} ${lv === 1 ? 'have' : 'find'}?`, `이야기에서 ${lv === 1 ? '가지고 있는' : '찾은'} 물건을 골라요.`), obj[0], ds, B(`The story tells us: ${obj[0]}.`, `이야기에 나온 물건을 확인해요: ${obj[0]}.`));
  });
  add('adstoryorderK', 'K', B('First and Next', '처음과 다음'), B('Comprehension: Literature', '이해: 이야기'), lv => {
    const name = pick(names), obj = pick(objects);
    const text = `${name} finds a ${obj[0]}. Then ${name} puts it in a box.`;
    const first = B('Finds it', '물건을 찾아요'), next = B('Puts it in a box', '상자에 넣어요');
    return textRound(text, lv === 1 ? B('What happens first?', '먼저 일어난 일을 골라요.') : B('What happens next?', '그다음 일어난 일을 골라요.'), lv === 1 ? first : next, [lv === 1 ? next : first, B('Goes to sleep', '잠을 자요')], B(text, text));
  });
  const instructions = [
    ['Draw a sun', 'Get paper', 'Draw a circle', 'Add rays'], ['Pack a bag', 'Open the bag', 'Put a book inside', 'Close the bag'],
    ['Build a tower', 'Get blocks', 'Stack the blocks', 'Put a flag on top'], ['Make a card', 'Fold paper', 'Draw a heart', 'Write your name'],
    ['Set a table', 'Get a plate', 'Put it on the table', 'Add a spoon'], ['Wrap a gift', 'Get paper', 'Cover the gift', 'Add a bow'],
    ['Make a bookmark', 'Cut a paper strip', 'Draw a star', 'Color the star'], ['Plant a pretend flower', 'Get a paper cup', 'Put a paper stem inside', 'Add a paper flower'],
    ['Make a paper crown', 'Get a paper strip', 'Draw jewels', 'Join the ends'], ['Make a puppet', 'Get a paper bag', 'Draw a face', 'Add paper ears']
  ];
  for (const grade of ['K', '1']) add('adinfo' + grade, grade, B('Read the Steps', '순서 글을 읽어요'), B('Comprehension: Informational Text', '이해: 정보 글'), lv => {
    const t = pick(lv === 1 ? instructions.slice(0, 5) : instructions.slice(5));
    const text = `${t[0]}: First, ${t[1].toLowerCase()}. Next, ${t[2].toLowerCase()}. Last, ${t[3].toLowerCase()}.`;
    const step = lv === 1 ? 1 : 3;
    return textRound(text, lv === 1 ? B('What is the first step?', '첫 번째 할 일을 골라요.') : B('What is the last step?', '마지막 할 일을 골라요.'), t[step], t.slice(1).filter((_, i) => i + 1 !== step), B(text, text));
  });
  add('adinfotopicK', 'K', B('What Do the Steps Make?', '무엇을 만드는 글일까요?'), B('Comprehension: Informational Text', '이해: 정보 글'), lv => {
    const t = pick(lv === 1 ? instructions.slice(0, 5) : instructions.slice(5));
    const text = `${t[0]}: ${t[1]}. ${t[2]}. ${t[3]}.`;
    const ds = shuffle(instructions.filter(x => x !== t)).slice(0, 2).map(x => x[0]);
    return textRound(text, B('Which title matches these steps?', '이 순서 글에 맞는 제목을 골라요.'), t[0], ds, B(t[0], t[0]));
  });
})();
