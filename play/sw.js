// Offline cache so the games work on school Chromebooks without Wi-Fi after the first visit.
const CACHE = 'peachplay-v95';
const FILES = ['stroke-data.js', 'games-pair1to1.js', 'pair1to1.css', 'demo.js', 'demo.css', 'games-gap3-inquiry.js', 'gap3-inquiry.css', 'games-gap3-social1.js', 'gap3-social1.css', 'games-gap3-poetry.js', 'gap3-poetry.css', 'games-gap3-book.js', 'gap3-book.css', 'games-gap3-econ5.js', 'gap3-econ5.css', 'maps-data.js', 'maps/north-america.webp', 'maps/atlantic.webp', 'maps/georgia.webp', 'learner-style.js', 'review-spacing.js', 'today.js', 'homecard.js', 'homecard.css', 'fluency-check.js', 'habit.css', 'learnlog.js', 'session-report.js', 'gradeP.css', 'gradeP-data.js', 'gamesP-math.js', 'gamesP-read.js', 'gamesP-sci.js', 'gamesP-life.js', './', 'index.html', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'style.css', 'version.js', 'ui.css', 'blockpuzzle.css', 'beta.css', 'a11y.css', 'grade1.css', 'games1-math.js', 'games1-math2.js', 'games1-draw.js', 'games2-math.js', 'games2-read.js', 'games2-sci.js', 'games2-ss.js', 'games3-math.js', 'games3-math2.js', 'games3-read.js', 'games3-sci.js', 'games3-ss.js', 'games4-math.js', 'grade4-math.css', 'games4-math2.js', 'grade4-math2.css', 'games4-read.js', 'grade4-read.css', 'games4-sci.js', 'grade4-sci.css', 'games4-ss.js', 'grade4-ss.css', 'games5-math.js', 'grade5-math.css', 'games5-math2.js', 'grade5-math2.css', 'games5-read.js', 'grade5-read.css', 'games5-sci.js', 'grade5-sci.css', 'games5-ss.js', 'grade5-ss.css', 'grade3-math.css', 'grade3-math2.css', 'grade3-read.css', 'grade3-sci.css', 'grade3-ss.css', 'games1-read.js', 'games1-sci.js', 'games1-ss.js', 'world-data.js', 'backup.js', 'pwa.js', 'notice.js', 'manip.js', 'manip.css', 'theme.css', 'adaptive-extra.js', 'dictionary.js', 'dictionary.css', 'games-puzzle.js', 'puzzle.css', 'print.js', 'print.css', 'paper.js', 'paper.css', 'i18n.js', 'voice.js', 'core.js', 'games-math.js', 'games-read.js', 'games-write.js', 'games-read2.js', 'games-phoneme.js', 'phoneme.css', 'games-math2.js', 'games-represent.js', 'games-directions.js', 'directions.css', 'games-ladder.js', 'ladder.css', 'represent.css', 'games-sci2.js', 'games-brain.js', 'games-more.js', 'games-blocks.js', 'games-blockpuzzle.js', 'games-think.js', 'games-gifted.js', 'games-ga.js', 'games-sci.js', 'report-parse.js', 'profile.js', 'school-results.js', 'faq.js', 'profiles.js', 'adaptive.js', 'app.js', 'icon.svg', 'manifest.webmanifest', 'vendor/pdfjs/pdf.min.js', 'vendor/pdfjs/pdf.worker.min.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, { cache: 'reload' }))))));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x.startsWith('peachplay-v') && x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
// Cache first: every deploy changes CACHE, so the browser installs a new worker that downloads the whole new version at once,
// and waits for Reload in pwa.js before taking over. Serving the active worker cache keeps files from two deploys
// from mixing and makes the app open fast. Files that are not in the cache come from the network (and are kept if the answer is good).
// On a local development server the worker stays out of the way so edits show up immediately.
const DEV = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
self.addEventListener('fetch', e => {
  const req = e.request;
  if (DEV || req.method !== 'GET' || new URL(req.url).origin !== location.origin || new URL(req.url).pathname.endsWith('/notice.json')) return;   // the notice is always read fresh
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const hit = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
    if (hit) return hit;
    try {
      const r = await fetch(req);
      if (r && r.ok) { const copy = r.clone(); e.waitUntil(caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {})); }
      return r;
    } catch (err) { const any = await cache.match('./'); if (req.mode === 'navigate' && any) return any; throw err; }
  })());
});

self.addEventListener('message', e => { if (e.data && e.data.type === 'ACTIVATE_UPDATE') e.waitUntil(self.skipWaiting()); });

// Installation uses addAll: a failed download rejects installation without
// publishing a partial batch. Report readiness only after checking every file,
// including files the user has not opened yet. No persistent readiness flag.
self.addEventListener('message', e => {
  if (!e.data || e.data.type !== 'OFFLINE_STATUS' || !e.ports[0]) return;
  e.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE);
      const entries = await Promise.all(FILES.map(u => cache.match(new URL(u, self.location.href).href)));
      e.ports[0].postMessage({ ready: entries.every(Boolean) });
    } catch (err) { e.ports[0].postMessage({ ready: false }); }
  })());
});
