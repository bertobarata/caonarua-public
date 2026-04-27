/**
 * Service Worker - CNR Creche Canina
 * Cache offline para melhor performance e disponibilidade
 */

const CACHE_NAME = 'cnr-cache-v3';
const RUNTIME_CACHE = 'cnr-runtime-v3';

// Assets críticos para cache inicial
const PRECACHE_ASSETS = [
  './',
  'index.html',
  'css/styles.css',
  'css/animations.css',
  'js/animations.js',
  'js/hero-particles.js',
  'js/dog-effects.js',
  'js/caes-animations.js',
  'assets/logos/CNR-logotipo-removebg.webp',
  'assets/fotos/index/background-1920w.webp',
  'assets/fotos/index/background.webp',
  // Fontes
  'assets/fonts/Nunito/static/Nunito-ExtraBold.ttf',
  'assets/fonts/Bubblegum_Sans/BubblegumSans-Regular.ttf',
];

// Páginas HTML para cache
const HTML_PAGES = [
  'creche.html',
  'passeiosnanatureza.html',
  'passeios-individuais.html',
  'estadias-familiares.html',
  'transportes.html',
  'faq.html',
  'formulario.html',
];

// Instalação: cache de assets críticos
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Ativação: limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => {
              console.log('[Service Worker] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: estratégia Cache-First para assets, Network-First para HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requisições externas (WhatsApp, Instagram, etc.)
  if (url.origin !== location.origin) {
    return;
  }

  // Ignorar formspree.io (formulários)
  if (url.hostname.includes('formspree.io')) {
    return;
  }

  // Estratégia Network-First para páginas HTML
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clonar resposta para cache
          const responseClone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Se offline, buscar do cache
          return caches.match(request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Se não tem cache, retornar página offline básica
              return caches.match('index.html');
            });
        })
    );
    return;
  }

  // Estratégia Cache-First para assets (CSS, JS, imagens, fontes)
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Se não está em cache, buscar da rede e cachear
          return fetch(request).then((response) => {
            // Só cachear respostas válidas
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          });
        })
    );
    return;
  }

  // Para tudo o resto, tentar rede primeiro
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Mensagens do cliente
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
