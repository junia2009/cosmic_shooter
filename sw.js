// Cosmic Shooter 3D - Service Worker
// 役割:
//  - HTML（ナビゲーション要求）は network-first で最新を取りに行く
//    → 新バージョンが公開されたら次回起動時に自動反映される
//  - 静的アセット（音声・アイコン・JS等）は cache-first で軽量化
//  - バージョン文字列でキャッシュキーを変えるため、デプロイ時に古いキャッシュは自動破棄

const VERSION = '1.6.1';
const CACHE_NAME = 'cosmic-shooter-' + VERSION;

const STATIC_ASSETS = [
  './',
  './index.html',
  './icon-180.png',
  './icon-512.png',
  './audio/space_pop.mp3',
  './audio/cyber_attack.mp3',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
      ),
      self.clients.claim(),
    ])
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

function isHtmlRequest(req, url) {
  if (req.mode === 'navigate') return true;
  if (url.pathname.endsWith('.html')) return true;
  if (url.pathname === '/' || url.pathname.endsWith('/')) return true;
  const accept = req.headers.get('accept') || '';
  return accept.indexOf('text/html') !== -1;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // クロスオリジン（Three.js CDN等）はブラウザ任せ
  if (url.origin !== self.location.origin) return;

  if (isHtmlRequest(req, url)) {
    // HTML: network-first（新版を即時反映）
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((c) => c || caches.match('./index.html'))
        )
    );
    return;
  }

  // 静的アセット: cache-first（高速 + オフライン対応）
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        }
        return res;
      });
    })
  );
});
