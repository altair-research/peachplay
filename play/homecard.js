(() => {
  'use strict';
  // Home card (2026-10-28, P-homecard): "One thing at home today" + "One question today" for grown-ups.
  // The app cannot see hands-on work or hear the child explain, so those go to the grown-up (user decision 10-28).
  //   1) pick one area (ADAPT_DOMAINS key): recent missed answers (LearnLog) -> weak areas (Learner.weakDomain,
  //      school results) -> otherwise take turns through the grade's areas.
  //   2) pick one 5-minute hands-on activity and one question for that area, rotating by date.
  //      The same day shows the same card (an evidence-based pick is kept for the day in S.homecard.day).
  //   3) "Done" is kept on this device only (S.homecard.done, last 60). Nothing is sent or recorded as audio.
  // K-2 activities are the main set; grades 3-5 get one or two general ones per area.
  // Loaded before core.js (cleanState uses clean()); everything else runs after the app is ready.
  const B = (en, ko) => ({ en, ko });
  const isObj = v => v && typeof v === 'object' && !Array.isArray(v);
  const okDate = d => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d) && Number.isFinite(Date.parse(d + 'T00:00:00Z')) && new Date(d + 'T00:00:00Z').toISOString().slice(0, 10) === d;
  const H = (k, en, ko) => ({ g: k, t: B(en, ko) });                  // home activity; g: 'k' = K-2, 'u' = grades 3-5
  const Q = (k, qen, qko, aen, ako) => ({ g: k, q: B(qen, qko), a: B(aen, ako) }); // question + what a sure answer sounds like

  const ACT = {
    num: { home: [
      H('k', 'Gather a pile of spoons and forks. Move each one aside as you count it, then ask: "How many in all?"', '숟가락·포크를 한 무더기 모아요. 하나씩 옆으로 옮기며 세고, 끝나면 "모두 몇 개?" 하고 물어요.'),
      H('k', 'Write one number (like 7) on paper. The child draws that many circles under it, then counts them again.', '종이에 수 하나(예: 7)를 써요. 아이가 그 수만큼 동그라미를 그리고 다시 세어 확인해요.'),
      H('k', 'Show some fingers for one second, then hide them. "How many?" Then switch roles.', '손가락 몇 개를 1초만 보여 주고 감춰요. "몇 개였어?" 그다음엔 역할을 바꿔요.'),
      H('k', 'Make two plates of snacks. "Which has more? How many more?" Line them up to check.', '간식 두 접시를 만들어요. "어느 쪽이 더 많아? 몇 개 더?" 한 줄로 늘어놓아 확인해요.'),
      H('u', 'Pick two prices from a receipt or flyer. Which is bigger, and about how much more?', '영수증이나 전단에서 가격 두 개를 골라요. 어느 쪽이 더 크고, 대략 얼마나 더 큰지 말해요.'),
      H('u', 'When sharing a pizza or cake, ask what fraction of the whole one piece is.', '피자·케이크를 나눌 때 "한 조각은 전체의 몇 분의 몇이야?" 하고 물어요.')
    ], talk: [
      Q('k', '"How did you know?"', '"어떻게 알았어?"', 'They say they touched or moved each one as they counted.', '하나씩 짚거나 옮기며 셌다고 말해요.'),
      Q('k', '"If we add one more, how many?"', '"하나 더 있으면 몇 개가 될까?"', 'They say the next number without counting again from 1.', '처음부터 다시 세지 않고 바로 다음 수를 말해요.'),
      Q('k', '"How many more to make 10?"', '"10이 되려면 몇 개 더 있어야 해?"', 'They show the missing amount with fingers or objects.', '모자란 만큼을 손가락이나 물건으로 보여 줘요.'),
      Q('u', '"How did you estimate?"', '"어떻게 어림했어?"', 'They say they rounded to a nearby 10 or 100 first.', '가까운 10이나 100으로 바꿔 생각했다고 말해요.')
    ] },
    alg: { home: [
      H('k', 'Make a row with socks or blocks: red, blue, red, blue... Ask what comes next. Then the child makes a new pattern.', '양말이나 블록으로 빨강, 파랑, 빨강, 파랑… 줄을 만들고 다음을 물어요. 그다음엔 아이가 새 규칙을 만들어요.'),
      H('k', 'Make a body pattern together: clap, knees, clap, knees... Keep it going and switch who leads.', '손뼉, 무릎, 손뼉, 무릎… 몸 규칙을 함께 만들어 이어 가요. 이끄는 사람을 바꿔요.'),
      H('k', 'Split 8 beans between two hands in as many ways as you can (5 and 3, 6 and 2...).', '콩 8개를 두 손에 나눠 쥐는 방법을 모두 찾아요(5와 3, 6과 2…).'),
      H('k', 'Tell a story with real objects: "4 apples, we buy 2 more. How many now?" The child shows it.', '물건으로 이야기 문제를 해요: "사과 4개에 2개를 더 샀어. 이제 몇 개?" 아이가 물건으로 보여 줘요.'),
      H('u', 'Find things packed in equal groups (egg cartons, snack boxes) and say them as a multiplication.', '같은 개수로 묶인 물건(달걀판, 과자 상자)을 찾아 곱셈식으로 말해요.')
    ], talk: [
      Q('k', '"How did you know what comes next?"', '"다음에 뭐가 올지 어떻게 알았어?"', 'They name the part that repeats (red, blue).', '반복되는 부분(빨강-파랑)을 말해요.'),
      Q('k', '"4 and what make 7?"', '"4하고 몇이면 7이 돼?"', 'They count on from 4 or show it with fingers.', '4부터 이어 세거나 손가락으로 보여 줘요.'),
      Q('k', '"In this story, do we add or take away?"', '"이 이야기에서는 더해야 해, 빼야 해?"', 'They say whether the amount got bigger or smaller.', '양이 늘었는지 줄었는지를 근거로 말해요.'),
      Q('u', '"Why did you use multiplication?"', '"왜 곱셈으로 셌어?"', 'They say there were several groups of the same size.', '같은 개수 묶음이 여러 개라서라고 말해요.')
    ] },
    meas: { home: [
      H('k', 'Line up three things (a spoon, a book, a remote) from shortest to longest.', '집 안 물건 세 개(숟가락, 책, 리모컨)를 짧은 것부터 긴 것까지 줄 세워요.'),
      H('k', 'Measure a table with paper clips or blocks laid end to end, with no gaps.', '클립이나 블록을 빈틈없이 이어 놓아 식탁 길이를 재요.'),
      H('k', 'Sort the laundry socks by color and count which color has the most.', '빨래한 양말을 색깔별로 나누고 어느 색이 가장 많은지 세요.'),
      H('k', 'Sort coins and count them together; for grade 2, start with the quarters.', '동전을 종류별로 나눠 함께 세요. 2학년이면 25센트부터 세어 나가요.'),
      H('u', 'Note when dinner cooking starts and ends, then work out how long it took.', '저녁 요리를 시작한 시각과 끝난 시각을 적고, 걸린 시간을 계산해요.')
    ], talk: [
      Q('k', '"How did you measure it?"', '"어떻게 길이를 쟀어?"', 'They say they lined up the ends and left no gaps.', '끝을 맞추고 빈틈없이 이어 놓았다고 말해요.'),
      Q('k', '"Which one is heavier? How can you tell?"', '"어느 쪽이 더 무거워? 어떻게 알 수 있어?"', 'They hold both and describe what they felt.', '양손에 들어 보고 느낀 것을 말해요.'),
      Q('k', '"Which group has the most?"', '"어느 무리가 가장 많아?"', 'They compare by counting or lining the groups up.', '세어 보거나 줄 세워 비교했다고 말해요.'),
      Q('u', '"How long did it take?"', '"얼마나 걸렸어?"', 'They jump from the start time to the end time and explain the steps.', '시작 시각에서 끝 시각까지 건너뛰며 센 과정을 말해요.')
    ] },
    geo: { home: [
      H('k', 'On a walk, find shapes in signs, windows and wheels and name each one.', '산책하며 표지판·창문·바퀴에서 도형을 찾아 이름을 말해요.'),
      H('k', 'Make a triangle and a square with straws or cotton swabs, then count the sides.', '빨대나 면봉으로 세모와 네모를 만들고 변이 몇 개인지 세요.'),
      H('k', 'Cut a sandwich or paper into 2 equal parts, then 4. "Are they the same size?"', '샌드위치나 종이를 똑같이 둘로, 그다음 넷으로 나눠요. "크기가 같아?"'),
      H('k', 'Collect a box, a can and a ball. Which ones roll? Which ones stack?', '상자·캔·공을 모아요. 어느 것이 구르고, 어느 것이 쌓일까요?'),
      H('u', 'Use the corner of a sheet of paper to find right angles around the house.', '종이 모서리를 대어 보며 집 안에서 직각을 찾아요.')
    ], talk: [
      Q('k', '"How do you know it is a triangle?"', '"세모인지 어떻게 알아?"', 'They say it has 3 straight sides and 3 corners.', '곧은 변 3개, 꼭짓점 3개라고 말해요.'),
      Q('k', '"How do you know the parts are equal?"', '"똑같이 나눴는지 어떻게 알아?"', 'They lay one part on the other to compare.', '두 조각을 겹쳐 비교했다고 말해요.'),
      Q('k', '"Why does this one roll?"', '"이건 왜 굴러가?"', 'They point to a curved surface.', '둥근 면이 있어서라고 말해요.'),
      Q('u', '"How did you check it was a right angle?"', '"직각인지 어떻게 확인했어?"', 'They say the paper corner fit exactly.', '종이 모서리가 딱 맞았다고 말해요.')
    ] },
    pa: { home: [
      H('k', 'Climb stairs one step per word part: wa-ter-mel-on. How many steps?', '계단을 낱말 조각마다 한 칸씩 올라요: wa-ter-mel-on. 몇 칸이었어요?'),
      H('k', 'Say sounds one at a time (/s/ /u/ /n/); the child blends them into a word (sun).', '소리를 하나씩 끊어 말하면(/s/ /u/ /n/) 아이가 합쳐 낱말로 말해요(sun).'),
      H('k', 'Rhyme chain: you say a word, the child says one that rhymes. Made-up words count too.', '운 이어 가기: 보호자가 낱말을 말하면 아이가 운이 맞는 말을 해요. 지어낸 말도 괜찮아요.'),
      H('k', 'Take-away game: "Say cat. Now say it without /k/." Then switch roles.', '소리 빼기 놀이: "cat이라고 해 봐. 이제 /k/ 빼고 말해 봐." 그다음 역할을 바꿔요.'),
      H('u', 'While reading, split one long word into parts out loud, then say it whole.', '책을 읽다가 긴 낱말 하나를 소리 내 조각으로 나누고, 다시 이어 말해요.')
    ], talk: [
      Q('k', '"What is the first sound in map?"', '"map의 첫소리는 뭐야?"', 'They say the sound /m/, not the letter name.', '글자 이름이 아니라 소리 /m/로 말해요.'),
      Q('k', '"How many sounds are in dog?"', '"dog에는 소리가 몇 개야?"', 'They raise a finger for each sound: /d/ /o/ /g/, 3.', '손가락을 하나씩 펴며 /d/ /o/ /g/, 3개라고 말해요.'),
      Q('k', '"What rhymes with cat?"', '"cat이랑 끝이 같은 말은?"', 'They say words ending in -at, like hat or bat.', 'hat, bat처럼 -at으로 끝나는 말을 해요.'),
      Q('u', '"How did you split that word?"', '"그 낱말을 어떻게 나눠 읽었어?"', 'They say each part has one vowel sound.', '조각마다 모음 소리가 하나씩 있다고 말해요.')
    ] },
    ph: { home: [
      H('k', 'Put first-letter labels on things at home (d on the door, b on a bed) and say each sound.', '집 안 물건에 첫 글자 이름표를 붙여요(door에 d, bed에 b). 붙일 때마다 소리를 말해요.'),
      H('k', 'Build cat with magnet letters or cards. Change one letter to make a new word: cat, hat, hit.', '자석 글자나 카드로 cat을 만들고, 한 글자만 바꿔 새 낱말을 만들어요: cat, hat, hit.'),
      H('k', 'The child reads an easy book out loud; you just listen. If stuck: "Start with the first sound."', '아이가 쉬운 책을 소리 내 읽고 보호자는 듣기만 해요. 막히면 "첫소리부터 해 볼까?"'),
      H('k', 'Say short words (sun, map, pig); the child writes them on paper with a pencil.', '짧은 낱말(sun, map, pig)을 불러 주면 아이가 종이에 연필로 써요.'),
      H('u', 'Listen to the child read a page aloud. Break apart only the words they got stuck on.', '아이가 한 쪽을 소리 내 읽는 걸 들어 주고, 막힌 낱말만 함께 쪼개 읽어요.')
    ], talk: [
      Q('k', '"How did you read that word?"', '"그 낱말을 어떻게 읽었어?"', 'They say each sound, then blend them.', '소리를 하나씩 말한 뒤 이어서 읽었다고 말해요.'),
      Q('k', '"Which part was tricky?"', '"어디가 어려웠어?"', 'They point to the letter where they got stuck.', '막혔던 글자를 짚어 보여 줘요.'),
      Q('k', '"What changes when we add e to cap?"', '"cap 끝에 e를 붙이면 어떻게 달라져?"', 'They say the a now says its name (cape).', 'a가 이름 소리로 바뀐다고 말해요(cape).'),
      Q('u', '"Is there a part of this word you know?"', '"이 낱말에서 아는 부분이 있어?"', 'They find a known chunk like un- or -ing.', 'un-, -ing처럼 아는 조각을 찾아요.')
    ] },
    hfw: { home: [
      H('k', 'Lay 5 word cards on the floor. Call a word; the child finds it and steps on it.', '자주 쓰는 낱말 카드 5장을 바닥에 놓아요. 보호자가 부르면 아이가 찾아 밟아요.'),
      H('k', 'Pick one word (the, is, and). Count how many times it shows up on one page of a book.', '낱말 하나(the, is, and)를 정해 책 한 쪽에 몇 번 나오는지 세요.'),
      H('k', 'Build a short sentence with word cards (I see a cat) and read it together.', '낱말 카드로 짧은 문장(I see a cat)을 만들어 함께 읽어요.'),
      H('u', 'Make cards for 3 words that were tricky in today\'s reading and look at them again tomorrow.', '오늘 읽다가 헷갈린 낱말 3개를 카드로 만들어 내일 다시 봐요.')
    ], talk: [
      Q('k', '"How do you remember this word?"', '"이 낱말은 어떻게 기억해?"', 'They link it to its letters or sounds.', '글자 모양이나 소리와 연결해 말해요.'),
      Q('k', '"Can you say a sentence with this word?"', '"이 낱말이 들어간 문장을 말해 줄래?"', 'They use the word naturally in a sentence.', '그 낱말을 넣어 자연스럽게 말해요.'),
      Q('k', '"Did you know it right away?"', '"보자마자 알았어?"', 'They read it without sounding it out, or say how they checked.', '소리 내 풀지 않고 바로 읽거나, 어떻게 확인했는지 말해요.'),
      Q('u', '"What does yesterday\'s card word mean?"', '"어제 카드 낱말은 무슨 뜻이었지?"', 'They explain it in their own words.', '자기 말로 뜻을 설명해요.')
    ] },
    voc: { home: [
      H('k', 'Opposites game: you say "big", the child says "small" and acts it out.', '반대말 놀이: 보호자가 "크다"라고 하면 아이가 "작다"라고 하며 몸으로 표현해요.'),
      H('k', 'Name things at home in English and Korean, taking turns.', '집 안 물건 이름을 영어와 한국어로 번갈아 말해요.'),
      H('k', 'Sort kitchen things into "things we eat" and "things we use", naming each one.', '부엌 물건을 "먹는 것"과 "쓰는 것"으로 나누며 이름을 말해요.'),
      H('k', 'Pick one unknown word in a picture book and guess its meaning from the picture.', '그림책에서 모르는 낱말 하나를 골라 그림을 보고 뜻을 짐작해요.'),
      H('u', 'Pick one hard word from a talk or the news. Guess its meaning from nearby sentences, then check a dictionary.', '대화나 뉴스에서 어려운 낱말 하나를 골라 앞뒤 문장으로 뜻을 짐작한 뒤 사전으로 확인해요.')
    ], talk: [
      Q('k', '"What could this word mean? How did you guess?"', '"이 낱말은 무슨 뜻일까? 어떻게 짐작했어?"', 'They point to the picture or the sentence around it.', '그림이나 앞뒤 문장을 근거로 말해요.'),
      Q('k', '"What is another word for big?"', '"큰 것을 다르게 말하면?"', 'They give a similar word, like huge or giant.', 'huge, giant처럼 비슷한 말을 해요.'),
      Q('k', '"Which group does this belong to? Why?"', '"이건 어느 무리에 들어가? 왜?"', 'They give the reason, like "because we eat it".', '"먹는 거라서"처럼 이유를 말해요.'),
      Q('u', '"How did you figure out the meaning?"', '"뜻을 어떻게 알아냈어?"', 'They name a clue in the sentence or a word part.', '문장 속 단서나 낱말 조각(뿌리·앞붙이)을 근거로 말해요.')
    ] },
    lit: { home: [
      H('k', 'Stop in the middle of a story and ask: "What will happen next?" Then read on to check.', '이야기를 읽다 중간에 멈추고 "다음엔 어떻게 될까?" 물어요. 이어 읽으며 확인해요.'),
      H('k', 'Act out today\'s story with two toys or puppets.', '인형 두 개로 오늘 읽은 이야기를 연극처럼 해 봐요.'),
      H('k', 'Make the face of a character at one moment and say why they felt that way.', '이야기 속 인물의 그때 표정을 지어 보고 왜 그런 기분이었는지 말해요.'),
      H('k', 'Draw three scenes from the story on separate papers and put them in order.', '이야기 장면 세 개를 종이에 따로 그려 순서대로 놓아요.'),
      H('u', 'Ask the child to tell you about the book they are reading for 2 minutes; just listen.', '아이가 읽고 있는 책 이야기를 2분 동안 들어 주기만 해요.')
    ], talk: [
      Q('k', '"What happened in the story?"', '"이야기에서 무슨 일이 있었어?"', 'They tell it in order: beginning, middle, end.', '처음·중간·끝 순서로 말해요.'),
      Q('k', '"How did the character feel? Why?"', '"주인공은 어떤 기분이었을까? 왜?"', 'They point to a scene or picture as the reason.', '책 속 장면이나 그림을 근거로 말해요.'),
      Q('k', '"What would you have done?"', '"너라면 어떻게 했을 것 같아?"', 'They give their own idea with a reason.', '자기 생각과 이유를 함께 말해요.'),
      Q('u', '"What is the story trying to tell us?"', '"이 이야기가 말하고 싶은 건 뭘까?"', 'They state a lesson in one sentence and give a scene as an example.', '한 문장으로 말하고 장면 하나를 예로 들어요.')
    ] },
    inf: { home: [
      H('k', 'Look at a photo book about animals or vehicles and say one new fact.', '동물·탈것 사진책을 함께 보고 새로 안 사실 하나를 말해요.'),
      H('k', 'Make a sandwich by following step pictures or numbered steps, in order.', '그림이나 번호가 붙은 순서를 보며 샌드위치를 차례대로 만들어요.'),
      H('k', 'Choose one question (Why is the sky blue?) and find the answer in a book or by asking an adult.', '궁금한 질문 하나(하늘은 왜 파래?)를 정해 책이나 어른에게 물어 답을 찾아요.'),
      H('u', 'Read one paragraph of an article or manual and sum it up in one sentence.', '기사나 설명서 한 단락을 읽고 중심 내용을 한 문장으로 말해요.')
    ], talk: [
      Q('k', '"Tell me one thing you learned."', '"새로 알게 된 것 하나 말해 줄래?"', 'They say a fact from the book in their own words.', '책에 나온 사실을 자기 말로 말해요.'),
      Q('k', '"Where did you find that?"', '"그건 어디에서 알았어?"', 'They point to the photo or line on the page.', '책의 사진이나 글 줄을 짚어 보여 줘요.'),
      Q('k', '"What else do you want to know?"', '"더 알고 싶은 건 뭐야?"', 'They ask a question that connects to the topic.', '주제와 이어지는 질문을 해요.'),
      Q('u', '"What makes you think so?"', '"왜 그렇게 생각해?"', 'They point to a sentence in the text as evidence.', '글 속 문장을 근거로 짚어요.')
    ] },
    sci_life: { home: [
      H('k', 'Put a bean on a wet paper towel and draw how it looks each day for a few days.', '콩 하나를 젖은 휴지에 올려 두고 며칠 동안 날마다 모습을 그려요.'),
      H('k', 'On a walk, watch a bird or bug and talk about where it finds food.', '산책하며 새나 벌레를 보고 어디서 먹이를 찾는지 이야기해요.'),
      H('k', 'Find what living things need around the house: water, food, light, air.', '살아 있는 것에게 필요한 것(물, 음식, 빛, 공기)을 집 안에서 찾아요.'),
      H('u', 'Pick one dinner food and trace back where it came from (plant, animal, sun).', '저녁 반찬 하나가 어디서 왔는지 거슬러 올라가 말해요(식물, 동물, 해).')
    ], talk: [
      Q('k', '"How do you know it is alive?"', '"살아 있는지 어떻게 알아?"', 'They say it grows, eats or breathes.', '자라거나, 먹거나, 숨 쉰다고 말해요.'),
      Q('k', '"What happens if the plant gets no water?"', '"식물에게 물을 안 주면 어떻게 될까?"', 'They say it will wilt and explain why.', '시들 거라고 하고 이유를 말해요.'),
      Q('k', '"Where would this animal live? Why?"', '"이 동물은 어디에 살까? 왜?"', 'They use its food or body parts as the reason.', '먹이나 몸 생김새를 근거로 말해요.'),
      Q('u', '"If this living thing disappeared, what would change?"', '"이 생물이 사라지면 무엇이 달라질까?"', 'They follow who eats what to explain.', '먹고 먹히는 관계를 따라 설명해요.')
    ] },
    sci_earth: { home: [
      H('k', 'Each morning, look out the window and draw the weather on a calendar.', '아침마다 창밖 날씨를 보고 달력에 그림으로 표시해요.'),
      H('k', 'Draw the moon tonight. Draw it again in a few days and compare.', '오늘 밤 달 모양을 그리고, 며칠 뒤 다시 그려 비교해요.'),
      H('k', 'Stand in the same spot in the morning and at noon. Compare your shadows.', '아침과 낮에 같은 자리에 서서 그림자 길이를 비교해요.'),
      H('u', 'Mark the water line on a cup and check it for a few days. Where did the water go?', '컵에 물 높이를 표시하고 며칠 동안 살펴요. 물은 어디로 갔을까요?')
    ], talk: [
      Q('k', '"How is today\'s weather different from yesterday?"', '"어제와 오늘 날씨가 어떻게 달라?"', 'They compare using temperature, clouds or rain.', '기온·구름·비 같은 특징으로 비교해요.'),
      Q('k', '"Where does the sun seem to go during the day?"', '"해는 낮 동안 어디로 움직이는 것처럼 보여?"', 'They say or point: it rises on one side and sets on the other.', '한쪽에서 떠서 반대쪽으로 진다고 말하거나 가리켜요.'),
      Q('k', '"Why is there a shadow?"', '"그림자는 왜 생길까?"', 'They say something blocks the light.', '무언가가 빛을 막아서라고 말해요.'),
      Q('u', '"Where did the water go?"', '"물은 어디로 갔을까?"', 'They say it turned into water vapor in the air.', '수증기가 되어 공기 중으로 갔다고 말해요.')
    ] },
    sci_physical: { home: [
      H('k', 'Roll a toy car down a ramp made of books. Change the height; what happens?', '책으로 만든 비탈에서 장난감 자동차를 굴려요. 높이를 바꾸면 어떻게 될까요?'),
      H('k', 'With a fridge magnet, sort things into "sticks" and "does not stick".', '냉장고 자석으로 집 안 물건을 "붙는 것"과 "안 붙는 것"으로 나눠요.'),
      H('k', 'Put an ice cube in a cup and check it every few minutes.', '컵에 얼음 하나를 넣고 몇 분마다 살펴봐요.'),
      H('k', 'Stretch and pluck a rubber band. Feel the shake and listen to the sound.', '고무줄을 당겨 튕기고 떨림을 손으로 느끼며 소리를 들어요.'),
      H('u', 'Shine a flashlight at glass, paper and wood. Guess first, then check what lets light through.', '손전등을 유리·종이·나무에 비춰요. 먼저 짐작하고, 빛이 통과하는지 확인해요.')
    ], talk: [
      Q('k', '"How can we make it go farther?"', '"더 멀리 가게 하려면 어떻게 해?"', 'They say push harder or make the ramp higher.', '더 세게 밀거나 비탈을 높인다고 말해요.'),
      Q('k', '"Why did this one stick to the magnet?"', '"이건 왜 자석에 붙었을까?"', 'They say it has iron or some kinds of metal.', '쇠(어떤 금속)로 되어 있어서라고 말해요.'),
      Q('k', '"Why did the ice melt?"', '"얼음은 왜 녹았을까?"', 'They say it got warmer.', '따뜻해져서라고 말해요.'),
      Q('u', '"What did you expect, and what happened?"', '"뭐가 될 거라고 생각했고, 실제로는 어땠어?"', 'They compare their guess with the result.', '예상과 결과를 비교해 말해요.')
    ] },
    ss_history: { home: [
      H('k', 'Look at family photos: what is different about the child then and now?', '가족 사진을 보며 아이의 예전 모습과 지금을 비교해요.'),
      H('k', 'Ask a grandparent (call or video) what games they played as a child. Compare with today.', '할머니·할아버지께(전화·영상 통화도 좋아요) 어릴 때 놀이를 여쭤보고 지금과 비교해요.'),
      H('k', 'Mark the next holiday on a calendar and talk about what the day is for.', '달력에 다가오는 공휴일을 표시하고 무슨 날인지 이야기해요.'),
      H('u', 'Pick one person on a coin or bill and find out together what they did.', '동전·지폐 속 인물 한 명을 골라 무슨 일을 했는지 함께 찾아봐요.')
    ], talk: [
      Q('k', '"What is different now from long ago?"', '"옛날과 지금은 뭐가 달라?"', 'They compare one thing, like toys or phones.', '장난감이나 전화처럼 하나를 예로 들어 비교해요.'),
      Q('k', '"Why do people remember this person?"', '"이 사람은 왜 기억될까?"', 'They name something the person did.', '그 사람이 한 일을 말해요.'),
      Q('k', '"Did that happen before or after?"', '"그 일은 먼저 일어났어, 나중에 일어났어?"', 'They use time words like yesterday, today, tomorrow.', '어제·오늘·내일 같은 시간 말로 순서를 말해요.'),
      Q('u', '"Why did that event matter?"', '"그 일은 왜 중요했을까?"', 'They link a cause to a result.', '원인과 결과를 이어서 말해요.')
    ] },
    ss_geography: { home: [
      H('k', 'Walk from a bedroom to the front door saying "left, right, straight".', '방에서 현관까지 "왼쪽, 오른쪽, 앞으로"라고 말하며 걸어가요.'),
      H('k', 'Hide a toy and guide the child to it using only direction words.', '장난감 하나를 숨기고 방향 말로만 찾아가게 해요.'),
      H('k', 'Find your home, Georgia and Korea on a globe or a map app.', '지구본이나 지도 앱에서 우리 집, 조지아, 한국을 찾아봐요.'),
      H('u', 'Find a river or mountain in Georgia on a map and talk about why people live near it.', '지도에서 조지아의 강이나 산을 찾고, 왜 그 근처에 사람이 사는지 이야기해요.')
    ], talk: [
      Q('k', '"Which state and country is our home in?"', '"우리 집은 어느 주, 어느 나라에 있어?"', 'They say city, Georgia, United States in order.', '도시, 조지아, 미국 순서로 말해요.'),
      Q('k', '"On a map, which way is up?"', '"지도에서 위쪽은 어느 방향이야?"', 'They say north.', '북쪽이라고 말해요.'),
      Q('k', '"What do we pass on the way to school?"', '"학교 가는 길에 무엇을 지나?"', 'They name places in order.', '지나는 곳을 순서대로 말해요.'),
      Q('u', '"Why did people settle here?"', '"사람들은 왜 여기에 자리 잡았을까?"', 'They connect it to land or water features.', '강·땅 같은 지리 특징과 이어서 말해요.')
    ] },
    ss_civics: { home: [
      H('k', 'Hold a short family meeting, agree on one rule for the week and vote.', '짧은 가족회의를 열어 이번 주 규칙 하나를 함께 정하고 투표해요.'),
      H('k', 'Draw a thank-you card for a community helper (firefighter, librarian).', '동네 도우미(소방관, 사서)에게 고맙다는 그림 카드를 그려요.'),
      H('k', 'At a playground or library, find a rule posted for everyone and talk about it.', '놀이터나 도서관에서 모두를 위한 규칙을 찾아 이야기해요.'),
      H('u', 'Find one thing a mayor, governor or president did in the news and talk about it.', '뉴스에서 시장·주지사·대통령이 한 일 하나를 찾아 이야기해요.')
    ], talk: [
      Q('k', '"What would happen with no rules?"', '"규칙이 없으면 어떻게 될까?"', 'They say it would be unsafe or unfair.', '위험하거나 다툼이 생긴다고 말해요.'),
      Q('k', '"What does a good citizen do?"', '"좋은 시민은 어떻게 행동해?"', 'They name actions like sharing or taking turns.', '나누기, 차례 지키기 같은 행동을 말해요.'),
      Q('k', '"Why is voting a fair way to decide?"', '"투표로 정하면 왜 공평해?"', 'They say everyone gets a say.', '모두의 생각을 듣기 때문이라고 말해요.'),
      Q('u', '"Who makes that decision?"', '"그건 누가 정하는 거야?"', 'They name the right level: city, state or nation.', '시·주·나라 중 맞는 단계를 말해요.')
    ] },
    ss_economics: { home: [
      H('k', 'At the store, sort the list into "need" and "want".', '장 볼 때 목록을 "꼭 필요한 것"과 "갖고 싶은 것"으로 나눠요.'),
      H('k', 'Choose something to save for and put a coin in a jar together.', '모으고 싶은 것을 정하고 저금통에 동전을 함께 넣어요.'),
      H('k', 'On errands, spot people who sell things and people who help (goods and services).', '심부름 길에 물건을 파는 사람과 도움을 주는 사람(재화와 서비스)을 찾아요.'),
      H('u', 'Plan snacks within a set budget, then name what you chose not to buy.', '정한 돈 안에서 간식 계획을 세우고, 사지 않기로 한 것을 말해요.')
    ], talk: [
      Q('k', '"Is this a need or a want?"', '"이건 꼭 필요한 거야, 갖고 싶은 거야?"', 'They choose and give a reason.', '고르고 이유를 함께 말해요.'),
      Q('k', '"What if we do not have enough money?"', '"돈이 모자라면 어떻게 할까?"', 'They say choose one thing or save up.', '하나만 고르거나 모은다고 말해요.'),
      Q('k', '"Does that person sell things or help people?"', '"그 사람은 물건을 팔아, 도움을 줘?"', 'They tell goods and services apart.', '물건(재화)과 도움(서비스)을 구별해 말해요.'),
      Q('u', '"If you choose this, what do you give up?"', '"이걸 고르면 무엇을 포기하는 거야?"', 'They name the next-best thing they did not choose.', '고르지 않은 다음 후보를 말해요.')
    ] }
  };
  const KEYS = Object.keys(ACT);
  // Rotation order when there is no evidence: K-2 basics first, science and social studies after.
  const TURN = ['num', 'pa', 'ph', 'lit', 'alg', 'hfw', 'meas', 'voc', 'geo', 'inf', 'sci_life', 'ss_geography', 'sci_physical', 'ss_civics', 'sci_earth', 'ss_economics', 'ss_history'];
  const WHY = {
    miss: B('An area with missed answers in recent practice', '최근 연습에서 틀린 답이 있던 영역'),
    weak: B('An area the practice records say needs more practice', '연습 기록에서 더 연습하면 좋은 영역'),
    school: B('An area from the school results you entered', '넣어 주신 학교 결과에서 고른 영역'),
    turn: B('Taking turns through the areas', '여러 영역을 돌아가며 골라요')
  };
  const TX = {
    title: B('One thing at home today', '오늘 집에서 1개'),
    time: B('About 5 minutes, with things you already have.', '5분 정도, 집에 있는 물건으로 해요.'),
    talk: B('One question today', '오늘 한마디'),
    sure: B('A sure answer sounds like:', '이런 대답이면 잘 알고 있어요:'),
    done: B('Did it ✓', '했어요 ✓'),
    doneNow: B('Done today ✓', '오늘 했어요 ✓'),
    undo: B('Undo', '취소'),
    days: (n) => B(`Days done in the last 2 weeks: ${n}`, `최근 2주 동안 한 날: ${n}일`),
    why: B('The app cannot see hands-on work or hear your child explain, so this part is for you.', '앱은 손으로 하는 활동과 아이의 설명을 보거나 듣지 못해요. 그래서 이 부분은 보호자께 맡겨요.'),
    mini: B('For grown-ups', '보호자께')
  };

  // S.homecard = { day: { d, g, k, why, lock } | null, done: [[date, key, homeIndex, talkIndex]] (last 60) }
  const clean = (v) => {
    if (!isObj(v)) return null;
    const o = { day: null, done: [] };
    const d = v.day;
    if (isObj(d) && okDate(d.d) && /^[K1-5]$/.test(d.g) && KEYS.includes(d.k) && Object.keys(WHY).includes(d.why)) o.day = { d: d.d, g: d.g, k: d.k, why: d.why, lock: d.lock === true };
    const seen = new Set();
    o.done = (Array.isArray(v.done) ? v.done : []).filter(r => Array.isArray(r) && r.length === 4 && okDate(r[0]) && KEYS.includes(r[1]) && Number.isInteger(r[2]) && r[2] >= 0 && r[2] < 20 && Number.isInteger(r[3]) && r[3] >= 0 && r[3] < 20)
      .map(r => r.slice()).sort((x, y) => x[0].localeCompare(y[0])).filter(r => !seen.has(r[0]) && seen.add(r[0])).slice(-60);
    return o;
  };
  // cleanState cleans S.homecard on load; here we only make sure the shape exists and keep the same object.
  const st = () => { if (!isObj(S.homecard) || !Array.isArray(S.homecard.done)) S.homecard = clean(S.homecard) || { day: null, done: [] }; return S.homecard; };
  const dayNow = () => today();
  const dayNum = (d) => Math.floor(Date.parse(d + 'T00:00:00Z') / 86400000);
  const hash = (s) => [...s].reduce((n, c) => n + c.charCodeAt(0), 0);
  const band = (g) => ['K', '1', '2'].includes(g) ? 'k' : 'u';
  const allDomains = () => typeof ADAPT_DOMAINS === 'undefined' ? [] : Object.values(ADAPT_DOMAINS).flat();
  // Areas the grade actually has games for (pa/hfw stop at grade 3, for example).
  const gradeKeys = (g) => {
    const doms = allDomains();
    if (!doms.length) return TURN.slice();
    return TURN.filter(k => { const dom = doms.find(x => x.k === k); return dom && (dom.g[g] || []).length; });
  };
  // Turn-taking without evidence: K-2 rotates through math and reading basics only; grades 3-5 through every area.
  const turnKeys = (g) => { const keys = gradeKeys(g); if (band(g) !== 'k') return keys; const core = keys.filter(k => !/^(sci|ss)_/.test(k)); return core.length ? core : keys; };
  const domainOf = (id) => window.Learner && window.Learner.domainFor ? window.Learner.domainFor(id) : null;

  function choose(g, d) {
    const keys = gradeKeys(g);
    const n = dayNum(d);
    // 1) missed answers today, else in the last 3 days (2 or more in one area)
    if (window.LearnLog && Array.isArray(S.log)) {
      const rows = window.LearnLog.clean(S.log).filter(r => r[3] === 0 && !(r[5] & 2));
      const midnight = Math.floor(new Date(new Date().toDateString()).getTime() / 1000);
      for (const from of [midnight, midnight - 2 * 86400]) {
        const count = {};
        rows.filter(r => r[0] >= from).forEach(r => { const dom = domainOf(r[1]); if (dom && keys.includes(dom.k)) count[dom.k] = (count[dom.k] || 0) + 1; });
        const best = Object.entries(count).filter(([, c]) => c >= 2).sort((x, y) => y[1] - x[1] || keys.indexOf(x[0]) - keys.indexOf(y[0]))[0];
        if (best) return { k: best[0], why: 'miss' };
      }
    }
    // 2) school results (One Grade Level Below or lower), then weak areas from practice records
    const school = window.SchoolResults && window.SchoolResults.weakKeys ? window.SchoolResults.weakKeys().filter(k => keys.includes(k)) : [];
    if (school.length) return { k: school[n % school.length], why: 'school' };
    if (window.Learner && window.Learner.weakDomain) {
      const weak = allDomains().filter(dom => keys.includes(dom.k) && (() => { try { return window.Learner.weakDomain(dom); } catch (e) { return false; } })()).map(dom => dom.k);
      const sorted = keys.filter(k => weak.includes(k));
      if (sorted.length) return { k: sorted[n % sorted.length], why: 'weak' };
    }
    // 3) take turns
    const turn = turnKeys(g);
    return { k: turn.length ? turn[n % turn.length] : 'num', why: 'turn' };
  }
  // Today's area: an evidence-based pick stays for the whole day; a turn-taking pick may be replaced by evidence later.
  function dayPick() {
    const h = st(), d = dayNow(), g = kidGrade();
    const old = h.day && h.day.d === d && h.day.g === g ? h.day : null;
    if (old && old.lock) return old;
    const done = h.done.find(r => r[0] === d);
    if (old && done) return old;
    const c = choose(g, d);
    const next = { d, g, k: c.k, why: c.why, lock: c.why !== 'turn' };
    if (!old || old.k !== next.k || old.why !== next.why || old.lock !== next.lock) { h.day = next; if (typeof save === 'function') save(); }
    return h.day;
  }
  const listFor = (arr, g) => { const b = band(g), own = arr.filter(x => x.g === b); return own.length ? own : arr; };
  // -> { k, why, home: {g,t}, talk: {g,q,a}, hi, ti } for an area and date (same inputs, same card)
  function card(k, d = dayNow(), g = kidGrade()) {
    const set = ACT[k] || ACT.num, n = dayNum(d) + hash(k);
    const homes = listFor(set.home, g), talks = listFor(set.talk, g);
    const hi = n % homes.length, ti = (n + 1) % talks.length;
    return { k, home: homes[hi], talk: talks[ti], hi, ti };
  }
  const domName = (k) => { const dom = allDomains().find(x => x.k === k); return dom ? L(dom.n) : k; };
  const recentDays = () => { const from = window.Spacing ? window.Spacing.addDays(-13) : ''; return st().done.filter(r => r[0] >= from).length; };

  // Full card for the grown-ups screen.
  function html() {
    if (typeof kidGrade !== 'function' || kidGrade() === 'P') return '';
    const p = dayPick(), c = card(p.k, p.d, p.g), done = st().done.some(r => r[0] === p.d);
    return `<section class="hc-card" id="homecard">
      <h2>🏠 ${L(TX.title)}</h2>
      <p class="hc-why">${L(WHY[p.why])} · <b>${domName(p.k)}</b></p>
      <p class="hc-act">${L(c.home.t)}</p>
      <p class="hc-time">${L(TX.time)}</p>
      <h3>💬 ${L(TX.talk)}</h3>
      <p class="hc-q">${L(c.talk.q)}</p>
      <p class="hc-a"><span>${L(TX.sure)}</span> ${L(c.talk.a)}</p>
      <p class="hc-row">${done ? `<span class="hc-ok">${L(TX.doneNow)}</span> <button class="link" id="hcUndo">${L(TX.undo)}</button>` : `<button class="pill" id="hcDone">${L(TX.done)}</button>`} <span class="hc-days">${L(TX.days(recentDays()))}</span></p>
      <p class="note2 hc-note">${L(TX.why)}</p>
    </section>`;
  }
  function bind(after) {
    const redraw = () => { const el = document.getElementById('homecard'); if (el) el.outerHTML = html(); bind(after); if (typeof after === 'function') after(); };
    const b = document.getElementById('hcDone');
    if (b) b.onclick = () => { const h = st(), p = dayPick(), c = card(p.k, p.d, p.g); if (!h.done.some(r => r[0] === p.d)) h.done = h.done.concat([[p.d, p.k, c.hi, c.ti]]).slice(-60); h.day = Object.assign({}, p, { lock: true }); save(); redraw(); };
    const u = document.getElementById('hcUndo');
    if (u) u.onclick = () => { const h = st(); h.done = h.done.filter(r => r[0] !== dayNow()); save(); redraw(); };
  }
  // Small folded chip for the end of "Today's 15 minutes" (kid screen; no buttons). It is fixed at the bottom so the
  // end screen keeps its one-screen layout; opening it shows a small pop-up above the chip.
  function miniHtml() {
    if (typeof kidGrade !== 'function' || kidGrade() === 'P') return '';
    const p = dayPick(), c = card(p.k, p.d, p.g);
    return `<details class="hc-mini"><summary>🏠 ${L(TX.mini)}</summary><div class="hc-pop"><p><b>${L(TX.title)}</b> · ${domName(p.k)}</p><p>${L(c.home.t)}</p><p>💬 ${L(c.talk.q)}</p></div></details>`;
  }
  // Home activity text for one area key (for the school-results card); '' when the key is unknown.
  const homeText = (k, g = kidGrade()) => ACT[k] ? L(card(k, dayNow(), g).home.t) : '';

  window.HomeCard = { clean, html, bind, miniHtml, homeText, card, choose, dayPick, ACT, KEYS };
})();
