'use strict';
// Adaptive practice check ("school diagnostic practice"): questions get harder after a right answer and easier after a miss,
// the way computer-adaptive school tests such as i-Ready work. It reuses the check-up engine (DIAG in profile.js) and the games
// that already exist, ordered from kindergarten to grade 3 inside each test domain. It gives a practice estimate, not a score.
// Not affiliated with or endorsed by Curriculum Associates (i-Ready); no test items are copied.
const ADAPT_DOMAINS = {
  math: [
    { k: 'num', n: B('Number and Operations', '수와 연산'), g: { K: ['count', 'represent', 'teens', 'compare', 'addsub', 'ladder'], 1: ['count120', 'tensones', 'compare100', 'add100', 'facts10'], 2: ['place1000', 'compare1000', 'add2dig', 'sub2dig', 'addsub1000'], 3: ['place3', 'compare3', 'round3', 'addsub3', 'unitfraction3', 'fractioncompare3', 'equivalent3'], 4: ['place4', 'shift4', 'compare4', 'round4', 'addsub4', 'equivalent4', 'fractioncompare4', 'fractionparts4', 'fractionadd4', 'tenthhundred4', 'decimal4', 'decimalcompare4'], 5: ['place5', 'power5', 'multiply5', 'divide5', 'remainder5', 'fractiondivision5', 'fractionorder5', 'fractionadd5', 'fractionsub5', 'mixed5', 'fractionmultiply5', 'scale5', 'unitdivide5', 'wholeunitdivide5', 'decimalplace5', 'decimalcompare5', 'decimalround5', 'decimaladd5'] } },
    { k: 'alg', n: B('Algebra and Algebraic Thinking', '대수적 사고'), g: { K: ['pattern', 'numline'], 1: ['factfam', 'truefalse', 'missingnum', 'wordprob', 'growpat'], 2: ['wordprob2', 'oddeven', 'growpat2', 'arrays', 'equalgroups'], 3: ['array3', 'divide3', 'factfamily3', 'multpattern3', 'balance3', 'multstory3', 'barstory3'], 4: ['multcompare4', 'multiply4', 'divide4', 'multistep4', 'pattern4', 'function4', 'factors4', 'prime4'], 5: ['expression5', 'patterns5'] } },
    { k: 'meas', n: B('Measurement and Data', '측정과 자료'), g: { K: ['measure', 'graph'], 1: ['cubelength', 'clock1', 'coins1', 'graph1'], 2: ['ruler', 'clock2g', 'money2', 'graph2'], 3: ['clock3', 'elapsed3', 'ruler3', 'measure3', 'graph3', 'area3'], 4: ['elapsed4', 'metric4', 'dotplot4'], 5: ['metric5', 'customary5', 'data5'] } },
    { k: 'geo', n: B('Geometry', '도형'), g: { K: ['shapes2d', 'shapes3d'], 1: ['shapeattr', 'shapecompose', 'partition'], 2: ['shapes2', 'symmetry', 'fractions2'], 3: ['polygon3', 'perimeter3', 'fractionline3'], 4: ['angle4', 'geometry4'], 5: ['coordinate5'] } }
  ],
  read: [
    { k: 'pa', n: B('Phonological Awareness', '소리 인식'), g: { K: ['rhyme', 'syllable', 'endsound', 'soundplay', 'phoneme'], 1: ['sylplay', 'onsetrime1', 'phonemes1'], 2: ['poems2', 'adremove2'], 3: ['adremove3', 'adchange3'] } },
    { k: 'ph', n: B('Phonics', '파닉스'), g: { K: ['letters', 'sounds', 'readmatch', 'wordchain'], 1: ['blends', 'longvowels', 'silly', 'twosyl'], 2: ['vowels2', 'syllables2', 'silly2'], 3: ['decode3', 'spell3'], 4: ['decode4', 'spell4'], 5: ['decode5', 'spell5'] } },
    { k: 'hfw', n: B('High-Frequency Words', '자주 쓰는 낱말'), g: { K: ['sight', 'adwordsK'], 1: ['tricky1', 'adwords1'], 2: ['tricky2', 'adwords2'], 3: ['adwords3', 'adwordcontext3'] } },
    { k: 'voc', n: B('Vocabulary', '어휘'), g: { K: ['opposites', 'admeaningK', 'directions'], 1: ['wordmeaning', 'admeaning1'], 2: ['wordnuance2', 'wordparts2'], 3: ['context3', 'wordshade3', 'wordrelation3', 'affix3'], 4: ['roots4', 'context4', 'wordrelation4', 'idiom4'], 5: ['roots5', 'context5', 'analogy5', 'wordshade5', 'reference5'] } },
    { k: 'lit', n: B('Comprehension: Literature', '이해: 이야기'), g: { K: ['adstoryK', 'adstoryorderK'], 1: ['storyq', 'adstory1'], 2: ['fables', 'poems2'], 3: ['character3', 'plot3', 'poetry3', 'viewpoint3'], 4: ['character4', 'theme4', 'viewpoint4', 'poetry4', 'figurative4'], 5: ['viewpoint5', 'character5', 'theme5', 'figurative5', 'poetry5'] } },
    { k: 'inf', n: B('Comprehension: Informational Text', '이해: 정보 글'), g: { K: ['adinfoK', 'adinfotopicK'], 1: ['factdet', 'adinfo1'], 2: ['info2', 'abc2'], 3: ['textstructure3', 'evidence3', 'purpose3', 'source3'], 4: ['purpose4', 'structure4', 'evidence4', 'source4'], 5: ['purpose5', 'structure5', 'explain5', 'opinion5', 'source5'] } }
  ]
};
// Content groups for same-grade review only; their order is not a difficulty scale.
Object.assign(ADAPT_DOMAINS, {
  sci: [
    { k: 'sci_life', n: B('Life Science', '생명과학'), g: {
      K: ['living'],
      1: ['plants1', 'animals1'],
      2: ['lifecycle2', 'pollen2'],
      3: ['habitat3', 'adaptation3', 'survival3', 'pollution3', 'conserve3'],
      4: ['organismrole4', 'foodweb4', 'ecosystem4'],
      5: ['vertebrate5', 'plantclass5', 'instinct5', 'traits5', 'microscope5', 'cellparts5', 'cellcompare5', 'microbenefit5', 'microharm5']
    } },
    { k: 'sci_earth', n: B('Earth and Space Science', '지구와 우주'), g: {
      K: ['sky'],
      1: ['weather1', 'precip', 'seasons1'],
      2: ['moon2', 'sky2', 'earthchange2'],
      3: ['rocksort3', 'rocktest3', 'soil3', 'soilwater3', 'erosion3', 'fossilclue3', 'fossilorder3'],
      4: ['skytools4', 'starplanet4', 'solarmodel4', 'daylight4', 'moonphase4', 'seasons4', 'waterstate4', 'watercycle4', 'weatherinstrument4', 'weathermap4', 'cloud4', 'climate4'],
      5: ['earthprocess5', 'earthmodel5', 'earthtech5']
    } },
    { k: 'sci_physical', n: B('Physical Science', '물질·에너지·힘'), g: {
      K: ['motion'],
      1: ['magnets1', 'light1', 'sound1'],
      2: ['matter2', 'matterchange2', 'force2'],
      3: ['heatsource3', 'temperature3', 'sundata3', 'sunshade3'],
      4: ['lightmaterial4', 'lightpath4', 'vibration4', 'signal4', 'force4'],
      5: ['physical5', 'waterparticles5', 'chemical5', 'electricity5', 'circuit5', 'conductor5', 'electromagnet5', 'magneticfield5']
    } }
  ],
  ss: [
    { k: 'ss_history', n: B('Historical Understandings', '역사'), g: {
      K: ['flags', 'holidays'],
      1: ['figures1', 'thennow'],
      2: ['heroes2', 'nations2', 'timeline2'],
      3: ['nativehomes3', 'nativetoday3', 'explorerwhy3', 'encounter3', 'colonyregion3', 'colonylife3', 'colonyperspective3'],
      4: ['revolutioncause4', 'revolutionpeople4', 'revolutionbattle4', 'declaration4', 'convention4', 'compromise4', 'war18124', 'expansion4', 'removal4', 'reform4', 'civilcause4', 'civilevents4', 'civilpeople4', 'reconstruction4', 'rightsbarrier4'],
      5: ['cattle5', 'innovation5', 'expansion5', 'immigration5', 'worldwarone5', 'twenties5', 'depression5', 'newdeal5', 'culturethirties5', 'worldwartwo5', 'wartime5', 'coldwar5', 'civilrights5', 'technology5', 'recenthistory5'] // 모두 숨김
    } },
    { k: 'ss_geography', n: B('Geographic Understandings', '지리'), g: {
      K: ['compass'],
      1: ['placetime', 'whereilive', 'mapdir', 'worldmap'],
      2: ['gamap2'],
      3: ['globe3', 'rivers3', 'mountains3', 'nativeregions3', 'explorerroute3'],
      4: ['physicalmap4', 'historicmap4', 'geography4'],
      5: ['places5', 'economicplaces5'] // hidden
    } },
    { k: 'ss_civics', n: B('Government and Civic Understandings', '정부와 시민'), g: {
      K: ['citizen'],
      1: ['character1', 'patriot'],
      2: ['gov2'],
      3: ['federal3', 'state3', 'civic3'],
      4: ['sovereignty4', 'federal4', 'checks4', 'billrights4'],
      5: ['rights5', 'amendments5'] // hidden
    } },
    { k: 'ss_economics', n: B('Economic Understandings', '경제'), g: {
      K: ['jobs'],
      1: ['goodsservices', 'savespend'],
      2: ['goods2', 'choices2'],
      3: ['resources3', 'publicservice3', 'trade3', 'market3', 'opportunity3'],
      4: ['historicaleconomy4', 'productivity4', 'budget4'],
      5: ['economy5'] // hidden; 복합 표준 한 게임
    } }
  ]
});
(() => {
  const topics = {
    sci_life: [['plants1'], ['animals1'], ['lifecycle2'], ['pollen2'], ['habitat3', 'adaptation3', 'survival3'], ['pollution3', 'conserve3'], ['organismrole4', 'foodweb4', 'ecosystem4'], ['vertebrate5', 'plantclass5'], ['instinct5', 'traits5'], ['microscope5', 'cellparts5', 'cellcompare5'], ['microbenefit5', 'microharm5']],
    sci_earth: [['weather1', 'precip'], ['seasons1'], ['moon2', 'sky2'], ['earthchange2'], ['rocksort3', 'rocktest3'], ['soil3', 'soilwater3'], ['erosion3'], ['fossilclue3', 'fossilorder3'], ['skytools4', 'starplanet4', 'solarmodel4'], ['daylight4', 'seasons4'], ['moonphase4'], ['waterstate4', 'watercycle4'], ['weatherinstrument4', 'weathermap4', 'cloud4', 'climate4'], ['earthprocess5', 'earthmodel5', 'earthtech5']],
    sci_physical: [['magnets1'], ['light1'], ['sound1'], ['matter2', 'matterchange2'], ['force2'], ['heatsource3', 'temperature3', 'sundata3', 'sunshade3'], ['lightmaterial4', 'lightpath4'], ['vibration4', 'signal4'], ['force4'], ['physical5', 'waterparticles5', 'chemical5'], ['electricity5', 'circuit5', 'conductor5'], ['electromagnet5', 'magneticfield5']],
    ss_history: [['flags'], ['holidays'], ['figures1'], ['thennow'], ['heroes2', 'timeline2'], ['nations2'], ['nativehomes3', 'nativetoday3'], ['explorerwhy3', 'encounter3'], ['colonyregion3', 'colonylife3', 'colonyperspective3'], ['revolutioncause4', 'revolutionpeople4', 'revolutionbattle4', 'declaration4'], ['convention4', 'compromise4'], ['war18124'], ['expansion4', 'removal4'], ['reform4'], ['civilcause4', 'civilevents4', 'civilpeople4', 'reconstruction4', 'rightsbarrier4']],
    ss_geography: [['compass'], ['placetime'], ['whereilive'], ['mapdir'], ['worldmap'], ['gamap2'], ['globe3'], ['rivers3', 'mountains3'], ['nativeregions3'], ['explorerroute3'], ['physicalmap4'], ['historicmap4', 'geography4']],
    ss_civics: [['character1'], ['patriot'], ['gov2'], ['federal3', 'state3'], ['civic3'], ['sovereignty4', 'federal4', 'checks4', 'billrights4']],
    ss_economics: [['goodsservices'], ['savespend'], ['goods2'], ['choices2'], ['resources3'], ['publicservice3'], ['trade3', 'market3'], ['opportunity3'], ['historicaleconomy4'], ['productivity4'], ['budget4']]
  };
  for (const domain of [...ADAPT_DOMAINS.sci, ...ADAPT_DOMAINS.ss]) {
    domain.reviewOnly = true;
    domain.diagnosticEnabled = false;
    domain.confirmEnabled = false;
    const ids = Object.values(domain.g).flat();
    domain.topics = topics[domain.k].concat(ids.filter(id => !topics[domain.k].some(group => group.includes(id))).map(id => [id]));
  }
})();
const ADAPT_LEN = { math: 24, read: 24 };
const AG = ['K', '1', '2', '3', '4', '5'];
const adaptLabel = (d) => { const g = AG[Math.floor(d / 2)], late = d % 2 === 1; return B(`${g === 'K' ? 'Kindergarten' : 'Grade ' + g}, ${late ? 'later' : 'early'} skills`, `${g === 'K' ? '유치원' : g + '학년'} ${late ? '후반' : '초반'} 수준`); };

function adaptMaxGrade() {
  const ready = typeof GRADE5_READY !== 'undefined' && GRADE5_READY ? 5 : typeof GRADE4_READY !== 'undefined' && GRADE4_READY ? 4 : typeof GRADE3_READY !== 'undefined' && GRADE3_READY ? 3 : 2;
  return Math.min(AG.indexOf(kidGrade()) + 1, ready);
}
function adaptLadder(dom) {                        // usable games per grade index (skips ids that are missing or not one-question games)
  return AG.map((g, i) => (i <= adaptMaxGrade() ? (dom.g[g] || []).filter(id => gameById(id) && !heldGame(gameById(id)) && !CHECK_SKIP.includes(id)) : []));
}
function makeAdapt(subject) {
  if (kidGrade() === 'P' || !ADAPT_LEN[subject]) { quitDiag(); return null; }
  const doms = ADAPT_DOMAINS[subject].map(dom => ({ dom, lad: adaptLadder(dom) })).filter(x => x.lad.some(l => l.length));
  const start = Math.min(AG.indexOf(kidGrade()), adaptMaxGrade()) * 2;            // start at the child's grade, early skills
  const topOf = (lad) => lad.reduce((m, l, i) => (l.length ? i : m), 0), st = doms.map(x => ({ d: Math.min(start, topOf(x.lad) * 2 + 1), hist: [] }));
  let turn = 0, cur = null;
  const nearest = (lad, gi) => { for (let k = 0; k < AG.length; k++) { if (lad[gi - k] && lad[gi - k].length) return gi - k; if (lad[gi + k] && lad[gi + k].length) return gi + k; } return 0; };
  return {
    subject,
    next() {
      const i = turn++ % doms.length, s = st[i], want = Math.floor(s.d / 2), gi = nearest(doms[i].lad, want), id = pick(doms[i].lad[gi]);
      const d = gi === want ? s.d : gi * 2 + (gi < want ? 1 : 0);        // no game at that grade: use the closest grade, harder level if it is lower
      cur = { i, d }; return { id, lv: (d % 2) + 1 };
    },
    update(ok) {
      if (!cur) return; const s = st[cur.i], top = 2 * adaptMaxGrade() + 1;
      s.hist.push({ d: cur.d, ok }); s.d = Math.max(0, Math.min(top, cur.d + (ok ? 1 : -1)));
    },
    result() {                                     // estimate = the highest difficulty answered right that was not followed by two misses at or below it
      return doms.map((x, i) => {
        const h = st[i].hist; if (!h.length) return null;
        const rights = h.filter(r => r.ok).map(r => r.d), est = rights.length ? Math.round((Math.max(...rights) + st[i].d) / 2) : 0;
        return { dom: x.dom, est, n: h.length, ok: h.filter(r => r.ok).length };
      }).filter(Boolean);
    }
  };
}

function adaptIntro() {
  if (kidGrade() === 'P') { quitDiag(); return home(); }
  const tips = [B('One question at a time. Take your time: there is no timer.', '한 번에 한 문제씩 나와요. 천천히 해도 돼요. 시간 제한은 없어요.'),
    B('Right answers make the next question harder. Misses make it easier. That is normal!', '맞히면 다음 문제가 조금 어려워지고, 틀리면 조금 쉬워져요. 원래 그런 거예요!'),
    B('Some questions will feel hard. Do your best and pick "I don\'t know" if you really don\'t know.', '어려운 문제도 나와요. 최선을 다하고, 정말 모르면 "잘 모르겠어요"를 눌러요.'),
    B('Read every choice before you tap. You can tap 🔊 to hear the question.', '보기를 끝까지 읽고 눌러요. 🔊를 누르면 문제를 읽어 줘요.'),
    B('It is not a pass or fail test. You can stop and take a break any time (🏠).', '합격·불합격 시험이 아니에요. 언제든 멈추고 쉬어도 돼요(🏠).')];
  view().innerHTML = `<h1>🧭 ${L(B('Diagnostic Practice', '진단 평가 연습'))}</h1>
    <p class="tag">${L(B('Practice for adaptive school tests like i-Ready.', 'i-Ready 같은 학교 적응형 진단 평가를 연습해요.'))}</p>
    <ul class="adtips">${tips.map(t => `<li>${L(t)}</li>`).join('')}</ul>
    <div class="adpick"><button class="big math" id="adm"><span class="gi">🔢</span>${T().subjects.math}<small>${L(B(`${ADAPT_LEN.math} questions · about 15 min`, `${ADAPT_LEN.math}문제 · 약 15분`))}</small></button>
    <button class="big read" id="adr"><span class="gi">📖</span>${T().subjects.read}<small>${L(B(`${ADAPT_LEN.read} questions · about 15 min`, `${ADAPT_LEN.read}문제 · 약 15분`))}</small></button></div>
    ${adaptHistoryHtml()}
    <p class="note2">${L(B('PeachPlay is not affiliated with i-Ready or Curriculum Associates. This practice uses PeachPlay\'s own questions and gives a practice estimate, not an official score.', 'PeachPlay는 i-Ready나 Curriculum Associates와 관련이 없어요. 이 연습은 PeachPlay가 직접 만든 문제를 쓰고, 공식 점수가 아닌 연습용 추정만 보여 줘요.'))}</p>
    <div><button class="next" id="b">${T().back}</button></div>`;
  $('#adm').onclick = () => startAdapt('math'); $('#adr').onclick = () => startAdapt('read'); $('#b').onclick = home;
  window.scrollTo(0, 0);
}
function adaptHistoryHtml() {
  const past = S.checks.filter(c => /^adapt-/.test(c.scope)).slice(-4).reverse(); if (!past.length) return '';
  return `<p class="note2">${L(B('Last practice:', '지난 연습:'))} ${past.map(c => `${c.scope === 'adapt-math' ? '🔢' : '📖'} ${c.at.slice(0, 10)} ${c.ok}/${c.total}`).join(' · ')}</p>`;
}
function startAdapt(subject) {
  if (kidGrade() === 'P' || !ADAPT_LEN[subject]) { quitDiag(); return home(); }
  S.introSeen = true; DIAG.run = (DIAG.run || 0) + 1; DIAG.scope = 'adapt-' + subject;
  DIAG.adapt = makeAdapt(subject); DIAG.items = new Array(ADAPT_LEN[subject]).fill(null);
  DIAG.active = true; DIAG.i = 0; DIAG.res = []; DIAG.busy = false; diagStep();
}
function adaptFinish() {
  const a = DIAG.adapt; DIAG.adapt = null;
  const gr = kidGrade(), res = a.result(), kidD = AG.indexOf(gr) * 2;
  const check = { at: new Date().toISOString().slice(0, 16), scope: DIAG.scope, grade: gr, items: DIAG.res, ok: DIAG.res.filter(x => x.ok).length, total: DIAG.res.length, est: res.map(r => [r.dom.k, r.est]) };
  S.checks.push(check); if (S.checks.length > 40) S.checks.shift(); save();
  const top = 2 * adaptMaxGrade() + 1;
  const domTop = (dom) => Math.min(top, 2 * adaptLadder(dom).reduce((m, l, i) => (l.length ? i : m), 0) + 1);   // some areas have no games in the upper grades
  const rel = (e, dom) => (e >= (dom ? domTop(dom) : top) ? B('top of this practice, great!', '이 연습의 가장 높은 단계예요!') : e >= kidD + 2 ? B('above grade level', '학년보다 높아요') : e >= kidD ? B('on grade level', '학년 수준이에요') : B('keep practicing', '더 연습해요'));
  const low = [...res].sort((p, q) => p.est - q.est)[0];
  const practice = low ? adaptLadder(low.dom)[Math.floor(low.est / 2)] || [] : [];
  view().innerHTML = `<h1>🧭 ${L(B('Practice done!', '연습 끝!'))}</h1>
    <p class="tag">${a.subject === 'math' ? T().subjects.math : T().subjects.read} · ${check.ok}/${check.total}</p>
    <div class="adres">${res.map(r => `<div class="adrow"><b>${L(r.dom.n)}</b><span class="adbar"><i style="width:${Math.round(100 * (r.est + 1) / (AG.length * 2))}%"></i><em style="left:${Math.round(100 * (kidD + 1) / (AG.length * 2))}%"></em></span><small>${L(adaptLabel(r.est))} · ${L(rel(r.est, r.dom))}</small></div>`).join('')}</div>
    <p class="note2">${L(B('The line on each bar is the start of your grade. This is a practice estimate from a few questions, not an official i-Ready score.', '막대의 세로선은 지금 학년의 시작이에요. 몇 문제로 본 연습용 추정이며 공식 i-Ready 점수가 아니에요.'))}</p>
    ${practice.length ? `<h2>💪 ${L(B('Practice next', '다음에 연습할 게임'))}: ${L(low.dom.n)}</h2><div class="menu">${practice.slice(0, 4).map(id => gameBtn(gameById(id))).join('')}</div>` : ''}
    <div><button class="next" id="again">🧭 ${L(B('Back to practice', '진단 연습으로'))}</button></div><div><button class="link" id="b">${T().letsPlay}</button></div>`;
  wireGames(); $('#again').onclick = adaptIntro; $('#b').onclick = home;
  say(L(B('Practice done! Great effort.', '연습 끝! 정말 잘했어요.'))); window.scrollTo(0, 0);
}
