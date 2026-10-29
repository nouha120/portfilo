const CACHE = `nouha-portfolio-v1:${self.registration.scope}`;
const HOME = self.registration.scope;
const assetURL = path => new URL(path, HOME).href;

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const response = await fetch(HOME, { cache: "reload" });
    if (!response.ok) throw new Error("Portfolio unavailable");
    const html = await response.clone().text();
    const resources = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
      .map(match => new URL(match[1], HOME))
      .filter(url => url.origin === self.location.origin && url.href.startsWith(HOME));
    await cache.addAll([...new Set(resources.map(url => url.href))]);
    await cache.put(HOME, response);
    // A CV download remains available offline after the first successful visit.
    try { await cache.add(assetURL("cv/cv.pdf")); } catch { /* Optional document. */ }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.href.startsWith(HOME)) return;
  if (request.mode === "navigate" && !url.pathname.endsWith(".pdf")) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response.ok && response.headers.get("content-type")?.includes("text/html")) await cache.put(HOME, response.clone());
        return response;
      } catch {
        return await cache.match(HOME) || Response.error();
      }
    })());
  } else if (["script", "style", "image", "font"].includes(request.destination) || url.pathname.endsWith(".pdf")) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      // Fresh responses keep icons, the CV and same-name assets up to date.
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch {
        return await cache.match(request) || Response.error();
      }
    })());
  }
});
