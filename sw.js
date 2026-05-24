// BJT 訓練 - Service Worker
// 简单缓存策略：app shell 优先缓存，运行时按需缓存

const VERSION = 'bjt-trainer-v0.5.0';
const SHELL_CACHE = `shell-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './data/listen.json',
  './data/questions.json',
  './data/keigo.json',
  './data/mocks.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon.png',
];

// 安装：缓存 app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      return cache.addAll(SHELL_ASSETS).catch((err) => {
        console.warn('[SW] Some shell assets failed to cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 激活：清旧版缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
          .map((k) => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// 取数据：
//   - HTML/CSS/JS: 网络优先（拿最新），失败回退缓存
//   - 字体/图片/音频: 缓存优先（节流量、可离线）
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // 跨源资源（Google Fonts、CDN）- 缓存优先
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        try {
          const fresh = await fetch(req);
          if (fresh.ok) cache.put(req, fresh.clone());
          return fresh;
        } catch (e) {
          return cached || new Response('Offline', { status: 503 });
        }
      })
    );
    return;
  }

  // 同源 HTML - 网络优先
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(SHELL_CACHE).then((c) => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // 同源静态资源 - 缓存优先
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => new Response('', { status: 504 }));
    })
  );
});
