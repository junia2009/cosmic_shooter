// Cosmic Shooter 3D - Service Worker
//
// 更新フロー（"2回開けば反映" パターン）:
//   1. ユーザーがアプリを開く → ブラウザが毎回 sw.js を取得（updateViaCache:'none' で確実に）
//   2. CACHE 文字列の差分でブラウザが新SWを「waiting」状態でインストール
//   3. install で self.skipWaiting() → 即座に activate 状態へ昇格
//   4. activate で旧キャッシュ削除 + self.clients.claim() で既存タブを掌握
//   5. ただし「現在開いているページ」自体はもう旧HTMLで描画されているので、
//      実際に新版を見るには 1度アプリを閉じてもう1度開く必要がある（=2回開く）
//
// 新バージョンを出すときの手順:
//   - この CACHE 文字列を必ず変更（例: v1.6.3 → v1.6.4）
//   - その変更1つだけで activate 時に旧キャッシュが自動で破棄される

const CACHE = 'cosmic-shooter-v1.6.3';

const FILES = [
  './',
  './index.html',
  './icon-180.png',
  './icon-512.png',
  './audio/space_pop.mp3',
  './audio/cyber_attack.mp3',
];

self.addEventListener('install', (event) => {
  // タブを閉じる待ちをスキップして即時アクティブ化
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(FILES))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // 別オリジン（Three.js CDN等）はブラウザのHTTPキャッシュ任せ
  if (url.origin !== self.location.origin) return;

  // cache-first: ヒットすればキャッシュ、無ければネットワークへ
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});
