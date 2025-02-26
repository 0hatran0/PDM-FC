
const version = 1;
const cachename = 'app-fc-v' + version;

const arquivos = [
  './',
  './index.html',
  './main.js',
  './service-worker.js',
  './manifest.json',
  './style.css',
  './dados.json',
  './IMAGENS/2149442335.jpg',
  './IMAGENS/2149482552.jpg',
  './IMAGENS/icon192.png',
  './IMAGENS/icon512.png',
  './IMAGENS/logo-3.png',
  './IMAGENS/manoel-gomes.jpg',
  './IMAGENS/organic-box.jpg',
  './IMAGENS/procurar.png',
];


self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cachename).then(function (cache) {
      return cache.addAll(arquivos);
    })
  );
});


self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request)
          .then(function (response) {
            let responseClone = response.clone();

            caches.open(cachename).then(function (cache) {
              cache.put(event.request, responseClone);
            });
            return response;
          })
          .catch(function () {
            return caches.match('./index.html');
          });
      }
    })
  );
});
