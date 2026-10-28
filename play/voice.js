// Voice: pick the best-sounding speechSynthesis voice on this device for en / ko.
// No network calls of our own. Some voices ("Online"/"Google") are cloud voices run by the
// browser maker: only the sentence text goes to them, never the child's data. When offline we
// skip them (they would be silent) and fall back to a voice installed on the device.
(function () {
  'use strict';
  const has = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const KEY = 'pp.voice.';                 // device setting (not child data): pp.voice.en / pp.voice.ko
  const bad = new Set();                   // voiceURIs that failed this session
  let cache = [];

  const base = (lang) => String(lang || '').toLowerCase().replace('_', '-').split('-')[0] === 'ko' ? 'ko' : 'en';
  const vlang = (v) => String(v.lang || '').toLowerCase().replace('_', '-');
  const isAndroid = () => /Android/i.test(navigator.userAgent || '');
  const online = () => navigator.onLine !== false;

  function voices() {
    if (!has) return [];
    try { const v = speechSynthesis.getVoices(); if (v && v.length) cache = v; } catch (e) {}
    return cache;
  }

  // Robotic/novelty voices (macOS/iOS "Eloquence" and joke voices, eSpeak).
  const NOVELTY = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|fred|kathy|grandma|grandpa|rocko|shelley|flo|eddy|reed|sandy)\b|espeak/i;
  // Warm, clear voices that suit a children's narrator (higher is better).
  const LIKED = {
    en: [[/\b(jenny|aria|ava|emma|michelle)\b/i, 25], [/\b(samantha|allison|susan|zoe|nicky|joelle)\b/i, 20], [/\bana\b/i, 10]],
    ko: [[/\bsun-?hi\b/i, 25], [/\b(yuna|sora|suhyun|jian)\b/i, 20], [/\b(injoon|hyunsu)\b/i, 10]]
  };

  function score(v, lang) {
    const L = base(lang), vl = vlang(v), name = (v.name || '') + ' ' + (v.voiceURI || '');
    if (vl.split('-')[0] !== L) return -1;
    if (bad.has(v.voiceURI)) return -1;
    let s = 10;
    if (L === 'en') s += vl === 'en-us' ? 30 : /en-(gb|au|ca|ie|nz)/.test(vl) ? 12 : 4;
    if (L === 'ko') s += vl === 'ko-kr' ? 30 : 10;
    if (/natural|neural/i.test(name)) s += 100;               // Edge "… Online (Natural)", ChromeOS natural
    else if (/premium/i.test(name)) s += 90;                 // Apple Premium
    else if (/enhanced/i.test(name)) s += 75;                // Apple Enhanced
    else if (/^google\b/i.test(v.name || '')) s += 60;       // Chrome desktop cloud voices
    else if (/online/i.test(name)) s += 40;
    if (NOVELTY.test(v.name || '')) s -= 200;
    if (/compact/i.test(name)) s -= 20;                      // Apple low-quality compact voices
    if (/^microsoft\b/i.test(v.name || '') && !/online|natural/i.test(name)) s -= 5; // old SAPI desktop voices
    (LIKED[L] || []).forEach(([re, n]) => { if (re.test(v.name || '')) s += n; });
    if (v.localService === false && !online()) s -= 500;     // cloud voice while offline = silence
    if (v.default) s += 2;
    return s;
  }

  function list(lang) {
    return voices().map(v => ({ v, s: score(v, lang) })).filter(x => x.s >= 0).sort((a, b) => b.s - a.s);
  }

  function saved(lang) { try { return localStorage.getItem(KEY + base(lang)) || ''; } catch (e) { return ''; } }

  function pick(lang) {
    const ranked = list(lang);
    if (!ranked.length) return null;
    const want = saved(lang);
    if (want) {
      const hit = ranked.find(x => x.v.voiceURI === want);
      if (hit && !(hit.v.localService === false && !online())) return hit.v;
    }
    return ranked[0].v;
  }

  // Neural voices already speak at a natural pace; slowing them too much sounds smeared.
  function prosody(v, lang) {
    const neural = v && /natural|neural|premium|enhanced/i.test((v.name || '') + ' ' + (v.voiceURI || ''));
    if (base(lang) === 'ko') return { rate: neural ? 0.95 : 0.9, pitch: 1 };
    return { rate: neural ? 0.92 : 0.85, pitch: neural ? 1 : 1.05 };
  }

  // Chrome desktop cloud voices stop after ~15 s; a pause/resume tick keeps them going.
  let keepAlive = 0;
  function startKeepAlive() {
    clearInterval(keepAlive);
    keepAlive = setInterval(() => {
      try { if (!speechSynthesis.speaking) { clearInterval(keepAlive); return; } speechSynthesis.pause(); speechSynthesis.resume(); } catch (e) { clearInterval(keepAlive); }
    }, 10000);
  }

  function apply(u, lang) {
    if (!u) return u;
    lang = lang || u.lang || 'en-US';
    const v = pick(lang), p = prosody(v, lang);
    if (!u.lang) u.lang = base(lang) === 'ko' ? 'ko-KR' : 'en-US';
    if (v) u.voice = v;
    u.rate = p.rate; u.pitch = p.pitch;
    if (v && v.localService === false) {
      let started = false;
      u.addEventListener('start', () => { started = true; if (!isAndroid()) startKeepAlive(); });
      u.addEventListener('end', () => clearInterval(keepAlive));
      // A cloud voice that fails before speaking (network hiccup): retry once with a device voice.
      u.addEventListener('error', (e) => {
        clearInterval(keepAlive);
        if (started || (e && /interrupted|canceled/.test(e.error || ''))) return;
        bad.add(v.voiceURI);
        try { const r = new SpeechSynthesisUtterance(u.text); r.lang = u.lang; apply(r, lang); speechSynthesis.speak(r); } catch (_) {}
      });
    }
    return u;
  }

  // For a grown-ups "choose voice" control. Returns [{uri, name, lang, cloud, best}] best first.
  function options(lang) {
    return list(lang).map((x, i) => ({ uri: x.v.voiceURI, name: x.v.name, lang: x.v.lang, cloud: x.v.localService === false, best: i === 0 }));
  }
  function setPreferred(lang, uri) {
    try { if (uri) localStorage.setItem(KEY + base(lang), uri); else localStorage.removeItem(KEY + base(lang)); } catch (e) {}
  }
  function preview(lang, text) {
    if (!has) return;
    try {
      speechSynthesis.cancel();
      const ko = base(lang) === 'ko';
      const u = new SpeechSynthesisUtterance(text || (ko ? '안녕! 나는 피치야. 같이 놀자!' : "Hi! I'm Peachy. Let's play!"));
      u.lang = ko ? 'ko-KR' : 'en-US';
      speechSynthesis.speak(apply(u, u.lang));
    } catch (e) {}
  }

  const listeners = [];
  function onChange(fn) { if (typeof fn === 'function') listeners.push(fn); }
  if (has) {
    const changed = () => { voices(); listeners.forEach(fn => { try { fn(); } catch (e) {} }); };
    try {
      if (speechSynthesis.addEventListener) speechSynthesis.addEventListener('voiceschanged', changed);
      else speechSynthesis.onvoiceschanged = changed;
    } catch (e) {}
    voices();
    // Some browsers (older Safari) never fire voiceschanged: poll briefly.
    let tries = 0; const t = setInterval(() => { if (voices().length || ++tries > 20) { clearInterval(t); if (cache.length) changed(); } }, 250);
  }

  window.Voice = { pick, apply, options, setPreferred, preview, onChange, score, _base: base };
})();
