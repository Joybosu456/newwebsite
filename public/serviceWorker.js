// const CACHE_NAME = "version-1";
// const urlsToCache = ["index.html", "offline.html"]
// this.addEventListener("install", (e) => {
//     e.waitUntil(
//         caches.open(CACHE_NAME).then((cache) => {
//             return cache.addAll(urlsToCache);
//         })
//     )
// })
// this.addEventListener("fetch", (e) => {
//     e.respondWith(
//         caches.match(e.request).then((res) => {
//             return fetch(e.request).catch(() => caches.match("offline.html"))
//         }
//         )
//     )
// })
// this.addEventListener("activate", (e) => {
//     const cacheWhiteList = [];
//     cacheWhiteList.push(CACHE_NAME)
//     e.waitUntil(caches.keys().then((cacheName) =>
//         Promise.all(cacheName.map((cacheName) => {
//             if (!cacheWhiteList.includes(cacheName)) {
//                 return caches.delete(cacheName)
//             }
//         }))
//     ))
// })
