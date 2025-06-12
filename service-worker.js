const CACHE_NAME = "pdf-app-cache-v1"; // Nama cache, ganti jika update
const urlsToCache = [
  "/", // Halaman utama
  "/index.html",
  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.53/pdfmake.min.js", // Library pdfmake
  "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js", // Fonts pdfmake
  "https://cdn.tailwindcss.com", // Tailwind CSS
  // Tambahkan lebih banyak URL jika diperlukan, seperti index.js
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
