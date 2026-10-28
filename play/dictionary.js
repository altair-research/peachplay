(() => {
  'use strict';
  // Original bilingual word list. Emoji are memory cues, not exact diagrams.
  const groups = [
    ['Animals', '동물', '🐾', `dog|개|🐕;cat|고양이|🐈;bird|새|🐦;fish|물고기|🐟;rabbit|토끼|🐇;horse|말|🐎;cow|소|🐄;pig|돼지|🐖;sheep|양|🐑;goat|염소|🐐;duck|오리|🦆;chicken|닭|🐔;frog|개구리|🐸;turtle|거북|🐢;snake|뱀|🐍;lizard|도마뱀|🦎;bear|곰|🐻;fox|여우|🦊;deer|사슴|🦌;wolf|늑대|🐺;lion|사자|🦁;tiger|호랑이|🐅;elephant|코끼리|🐘;monkey|원숭이|🐒;giraffe|기린|🦒;zebra|얼룩말|🦓;whale|고래|🐋;dolphin|돌고래|🐬;penguin|펭귄|🐧;owl|올빼미|🦉`],
    ['Food', '음식', '🍎', `apple|사과|🍎;banana|바나나|🍌;orange|오렌지|🍊;peach|복숭아|🍑;pear|배|🍐;grape|포도|🍇;strawberry|딸기|🍓;watermelon|수박|🍉;lemon|레몬|🍋;cherry|체리|🍒;pineapple|파인애플|🍍;carrot|당근|🥕;potato|감자|🥔;tomato|토마토|🍅;corn|옥수수|🌽;broccoli|브로콜리|🥦;cucumber|오이|🥒;onion|양파|🧅;bread|빵|🍞;rice|밥|🍚;egg|달걀|🥚;cheese|치즈|🧀;milk|우유|🥛;water|물|💧;juice|주스|🧃;soup|수프|🥣;salad|샐러드|🥗;sandwich|샌드위치|🥪;noodles|국수|🍜;cookie|쿠키|🍪`],
    ['Body & feelings', '몸과 기분', '👋', `head|머리|🧑;hair|머리카락|🧑;face|얼굴|🙂;eye|눈|👁️;ear|귀|👂;nose|코|👃;mouth|입|👄;tooth|이|🦷;tongue|혀|👅;neck|목|🧑;shoulder|어깨|🧑;arm|팔|💪;elbow|팔꿈치|💪;hand|손|✋;finger|손가락|☝️;thumb|엄지손가락|👍;leg|다리|🦵;knee|무릎|🦵;foot|발|🦶;toe|발가락|🦶;heart|심장|🫀;brain|뇌|🧠;bone|뼈|🦴;skin|피부|✋;happy|행복한|😊;sad|슬픈|😢;angry|화가 난|😠;scared|무서워하는|😨;tired|피곤한|🥱;surprised|놀란|😮`],
    ['Weather & sky', '날씨와 하늘', '☀️', `sun|태양|☀️;moon|달|🌙;star|별|⭐;sky|하늘|🌌;cloud|구름|☁️;rain|비|🌧️;snow|눈|❄️;wind|바람|🌬️;storm|폭풍|⛈️;lightning|번개|🌩️;thunder|천둥|⛈️;rainbow|무지개|🌈;fog|안개|🌫️;ice|얼음|🧊;sunny|맑은|☀️;cloudy|구름이 낀|☁️;rainy|비가 오는|🌧️;snowy|눈이 오는|🌨️;windy|바람이 부는|🌬️;hot|더운|🥵;cold|추운|🥶;warm|따뜻한|🌤️;cool|서늘한|🍃;spring|봄|🌷;summer|여름|🏖️;fall|가을|🍂;winter|겨울|☃️;season|계절|🗓️;temperature|온도|🌡️;thermometer|온도계|🌡️`],
    ['Shapes & math', '도형과 수학', '🔺', `circle|원|⭕;triangle|삼각형|🔺;square|정사각형|🟨;rectangle|직사각형|▭;oval|타원|🥚;hexagon|육각형|⬡;cube|정육면체|🧊;sphere|구|⚽;cone|원뿔|🔺;cylinder|원기둥|🥫;line|선|➖;point|점|🔵;side|변|📐;corner|모서리가 만나는 곳|📐;angle|각|📐;length|길이|📏;width|너비|📏;height|높이|📏;area|넓이|🟨;perimeter|둘레|🔲;fraction|분수|🍕;half|절반|◐;equal|같은|🟰;more|더 많은|➕;less|더 적은|➖;add|더하다|➕;subtract|빼다|➖;multiply|곱하다|✖️;divide|나누다|➗;pattern|규칙적인 배열|🔁`],
    ['Numbers & time', '수와 시간', '🔢', `zero|영|0️⃣;one|일|1️⃣;two|이|2️⃣;three|삼|3️⃣;four|사|4️⃣;five|오|5️⃣;six|육|6️⃣;seven|칠|7️⃣;eight|팔|8️⃣;nine|구|9️⃣;ten|십|🔟;eleven|십일|🔢;twelve|십이|🔢;thirteen|십삼|🔢;fourteen|십사|🔢;fifteen|십오|🔢;twenty|이십|🔢;hundred|백|💯;thousand|천|🔢;first|첫 번째|🥇;second|두 번째|🥈;third|세 번째|🥉;clock|시계|🕒;hour|시간|🕐;minute|분|⏱️;day|하루|🌅;week|일주일|🗓️;month|달(기간)|📅;year|해(기간)|📆;calendar|달력|📅`],
    ['School', '학교', '🏫', `school|학교|🏫;teacher|선생님|🧑‍🏫;student|학생|🧑‍🎓;classroom|교실|🏫;desk|책상|🪑;chair|의자|🪑;book|책|📖;pencil|연필|✏️;pen|펜|🖊️;eraser|지우개|✏️;crayon|크레용|🖍️;paper|종이|📄;notebook|공책|📓;backpack|책가방|🎒;ruler|자|📏;scissors|가위|✂️;glue|풀|🧴;library|도서관|📚;playground|놀이터|🛝;bus|버스|🚌;letter|글자|🔤;word|낱말|🔤;sentence|문장|📝;story|이야기|📖;page|쪽|📄;read|읽다|📖;write|쓰다|✍️;draw|그리다|🎨;listen|듣다|👂;question|질문|❓`],
    ['Maps & community', '지도와 우리 동네', '🗺️', `map|지도|🗺️;globe|지구본|🌐;compass|나침반|🧭;north|북쪽|⬆️;south|남쪽|⬇️;east|동쪽|➡️;west|서쪽|⬅️;land|땅|🏞️;ocean|대양|🌊;river|강|🏞️;lake|호수|🏞️;mountain|산|⛰️;island|섬|🏝️;forest|숲|🌳;desert|사막|🏜️;city|도시|🏙️;town|작은 도시|🏘️;country|나라|🗺️;state|주(미국의 지역)|🗺️;road|도로|🛣️;bridge|다리(건너는 길)|🌉;home|집|🏠;hospital|병원|🏥;park|공원|🏞️;store|가게|🏪;farm|농장|🚜;firefighter|소방관|🧑‍🚒;doctor|의사|🧑‍⚕️;mail carrier|우편 배달원|📬;flag|깃발|🚩`],
    ['Nature & science', '자연과 과학', '🌱', `plant|식물|🌱;tree|나무|🌳;leaf|잎|🍃;flower|꽃|🌸;seed|씨앗|🌰;root|뿌리|🌱;stem|줄기|🌱;soil|흙|🟫;rock|암석|🪨;sand|모래|🏖️;insect|곤충|🐞;butterfly|나비|🦋;bee|벌|🐝;ant|개미|🐜;spider|거미|🕷️;habitat|서식지|🏞️;fossil|화석|🦴;air|공기|🌬️;light|빛|💡;heat|열|🔥;sound|소리|🔊;magnet|자석|🧲;energy|에너지|⚡;solid|고체|🧊;liquid|액체|💧;gas|기체|💨;shadow|그림자|🌑;Earth|지구|🌍;recycle|재활용하다|♻️;observe|관찰하다|🔍`],
    ['Daily life & actions', '생활과 움직임', '🏃', `shirt|셔츠|👕;pants|바지|👖;dress|원피스|👗;coat|외투|🧥;hat|모자|🧢;shoe|신발|👟;sock|양말|🧦;umbrella|우산|☂️;bed|침대|🛏️;door|문|🚪;window|창문|🪟;table|탁자|🪑;cup|컵|🥤;plate|접시|🍽️;spoon|숟가락|🥄;fork|포크|🍴;soap|비누|🧼;towel|수건|🧻;walk|걷다|🚶;run|달리다|🏃;jump|뛰어오르다|🤸;sit|앉다|🪑;stand|서다|🧍;sleep|자다|😴;eat|먹다|🍽️;drink|마시다|🥤;wash|씻다|🧼;help|돕다|🤝;share|함께 나누다|🤝;play|놀다|🧸`]
  ];
  const words = groups.flatMap((g, topic) => g[3].split(';').map(row => {
    const [en, ko, icon] = row.split('|'); return { en, ko, icon, topic };
  }));
  const wordKeys = new Set(words.map(w => w.en.toLowerCase()));
  window.cleanDictionaryHistory = history => Object.fromEntries(Object.entries(history || {}).filter(([key]) => wordKeys.has(key)).slice(-300));
  // core loads first; finish dictionary membership validation once its list is ready.
  if (typeof S !== 'undefined' && S.metWords) { S.metWords = window.cleanDictionaryHistory(S.metWords); save(); }
  window.rememberDictionaryWords = function (vocab) {
    if (typeof vocab !== 'string' || !vocab.trim()) return;
    const text = ' ' + vocab.toLowerCase().replace(/[^a-z]+/g, ' ').trim() + ' ';
    const met = words.filter(w => text.includes(' ' + w.en.toLowerCase() + ' '));
    if (!met.length) return;
    S.metWords = window.cleanDictionaryHistory(cleanState(S).metWords);
    met.forEach(w => { S.metWords[w.en.toLowerCase()] = today(); }); save();
  };
  const strings = {
    en: { title: 'Picture Dictionary', close: 'Close', search: 'Search English or Korean', met: 'Words I have met', badge: '✓ Met in a game', all: 'All topics', topic: 'Topic', empty: 'No words found. Try another word.', note: 'Pictures are clues. Game words you have met are marked ✓. Only dictionary words and the latest date are saved for each child on this device.', muted: 'Voice is off in settings.', unavailable: 'Voice is unavailable in this browser.', count: n => `${n} words`, english: 'Listen in English', korean: 'Listen in Korean' },
    ko: { title: '그림 사전', close: '닫기', search: '영어나 한국어로 찾아요', met: '내가 만난 낱말', badge: '✓ 게임에서 만났어요', all: '모든 주제', topic: '주제', empty: '낱말이 없어요. 다른 낱말로 찾아봐요.', note: '그림은 뜻을 떠올리는 힌트예요. 게임에서 만난 낱말에는 ✓ 표시가 있어요. 사전에 있는 낱말과 마지막으로 만난 날짜만 아이별로 이 기기에 저장해요.', muted: '설정에서 음성이 꺼져 있어요.', unavailable: '이 브라우저에서는 음성을 쓸 수 없어요.', count: n => `${n}개 낱말`, english: '영어 발음 듣기', korean: '한국어 발음 듣기' }
  };
  let active = null;
  window.openDictionary = function () {
    if (active) { active.querySelector('input').focus(); return; }
    const ko = typeof S !== 'undefined' && S.lang === 'ko', t = strings[ko ? 'ko' : 'en'];
    const previous = document.activeElement;
    const dialog = document.createElement('dialog'); dialog.className = 'd-dialog'; active = dialog;
    dialog.setAttribute('aria-labelledby', 'd-title');
    dialog.innerHTML = `<section class="d-panel"><header class="d-header"><h2 id="d-title">📖 ${t.title}</h2><button type="button" class="d-close">${t.close} ✕</button></header><label class="d-label">${t.search}<input class="d-search" type="search" autocomplete="off" maxlength="80"></label><label class="d-label">${t.topic}<select class="d-topic"></select></label><label class="d-met-filter"><input type="checkbox" class="d-met">${t.met}</label><p class="d-note">${t.note}</p><p class="d-status" role="status" aria-live="polite"></p><div class="d-list" tabindex="0" role="region" aria-label="${t.title}"></div></section>`;
    const search = dialog.querySelector('input'), select = dialog.querySelector('select'), list = dialog.querySelector('.d-list'), status = dialog.querySelector('.d-status');
    [t.all, ...groups.map(g => `${g[2]} ${g[ko ? 1 : 0]}`)].forEach((label, i) => {
      const option = document.createElement('option'); option.value = String(i - 1); option.textContent = label; select.append(option);
    });
    const metFilter = dialog.querySelector('.d-met');
    const voiceOff = () => typeof S !== 'undefined' && (S.muted || S.voiceOff);
    const supported = () => 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    function speak(word, language) {
      if (voiceOff()) { status.textContent = t.muted; return; }
      if (!supported()) { status.textContent = t.unavailable; return; }
      try {
        window.speechSynthesis.cancel();
        const utterance = new window.SpeechSynthesisUtterance(word[language]);
        utterance.lang = language === 'en' ? 'en-US' : 'ko-KR'; utterance.rate = 0.85; if (window.Voice) window.Voice.apply(utterance, utterance.lang);
        utterance.onerror = () => { if (active === dialog) status.textContent = t.unavailable; };
        window.speechSynthesis.speak(utterance);
      } catch { status.textContent = t.unavailable; }
    }
    function render() {
      const query = search.value.trim().normalize('NFC').toLocaleLowerCase();
      const matches = words.filter(w => (!metFilter.checked || S.metWords?.[w.en.toLowerCase()]) && (select.value === '-1' || w.topic === Number(select.value)) && `${w.en} ${w.ko}`.normalize('NFC').toLocaleLowerCase().includes(query));
      list.replaceChildren(); list.scrollTop = 0;
      status.textContent = `${t.count(matches.length)}${voiceOff() ? ' · ' + t.muted : !supported() ? ' · ' + t.unavailable : ''}`;
      if (!matches.length) { const p = document.createElement('p'); p.className = 'd-empty'; p.textContent = t.empty; list.append(p); }
      matches.forEach(word => {
        const card = document.createElement('article'); card.className = 'd-card';
        const icon = document.createElement('span'); icon.className = 'd-icon'; icon.textContent = word.icon; icon.setAttribute('aria-hidden', 'true'); card.append(icon);
        [['en', t.english], ['ko', t.korean]].forEach(([language, label]) => {
          const row = document.createElement('div'); row.className = 'd-word-row';
          const text = document.createElement('span'); text.lang = language; text.textContent = word[language]; text.className = 'd-word';
          const button = document.createElement('button'); button.type = 'button'; button.className = 'd-speak'; button.textContent = '🔊'; button.setAttribute('aria-label', `${label}: ${word[language]}`); button.disabled = voiceOff() || !supported(); button.onclick = () => speak(word, language);
          row.append(text, button); card.append(row);
        });
        const date = S.metWords?.[word.en.toLowerCase()];
        if (date) { const badge = document.createElement('span'); badge.className = 'd-met-badge'; badge.textContent = t.badge; badge.title = date; card.append(badge); }
        list.append(card);
      });
    }
    dialog.querySelector('.d-close').onclick = () => dialog.close();
    dialog.addEventListener('close', () => { if (supported()) window.speechSynthesis.cancel(); dialog.remove(); active = null; if (previous?.isConnected) previous.focus(); });
    search.oninput = render; select.onchange = render; metFilter.onchange = render;
    document.body.append(dialog); render(); dialog.showModal();
    // Start at Close: opening on a phone must not summon its keyboard.
    dialog.querySelector('.d-close').focus();
  };
})();
