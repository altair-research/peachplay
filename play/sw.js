// Offline cache so the games work on school Chromebooks without Wi-Fi after the first visit.
const CACHE = 'peachplay-v40';
const FILES = ['./', 'index.html', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'style.css', 'version.js', 'ui.css', 'blockpuzzle.css', 'beta.css', 'a11y.css', 'grade1.css', 'games1-math.js', 'games1-math2.js', 'games1-draw.js', 'games2-math.js', 'games1-read.js', 'games1-sci.js', 'games1-ss.js', 'backup.js', 'pwa.js', 'i18n.js', 'core.js', 'games-math.js', 'games-read.js', 'games-write.js', 'games-read2.js', 'games-math2.js', 'games-sci2.js', 'games-brain.js', 'games-more.js', 'games-blocks.js', 'games-blockpuzzle.js', 'games-think.js', 'games-gifted.js', 'games-ga.js', 'games-sci.js', 'report-parse.js', 'profile.js', 'faq.js', 'profiles.js', 'app.js', 'icon.svg', 'manifest.webmanifest', 'vendor/pdfjs/pdf.min.js', 'vendor/pdfjs/pdf.worker.min.js'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim())));
// Network first (so a deploy shows up right away); only good responses are cached, and an HTTP error or being offline falls back to the cached copy.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith((async () => {
    try {
      const r = await fetch(req, { cache: 'no-cache' });
      if (r && r.ok) { const copy = r.clone(); e.waitUntil(caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {})); return r; }
      return (await caches.match(req)) || r;
    } catch (err) { const hit = await caches.match(req); if (hit) return hit; throw err; }
  })());
});
