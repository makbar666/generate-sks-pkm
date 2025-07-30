const CACHE_NAME = "pdf-app-cache-v2"; // Nama cache, ganti jika update
const urlsToCache = [
  "/", // Halaman utama
  "/index.html",
  "/index.js",
  "/manifest.json"
  // Removed external CDN URLs to avoid CSP issues
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Meng-cache file-file...");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("Service Worker: Menghapus cache lama...");
            return caches.delete(key);
          }
        })
      )
    )
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Jika ada di cache, gunakan cache; jika tidak, fetch dari server
      return response || fetch(event.request);
    })
  );
});
