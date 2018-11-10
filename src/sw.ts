/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

// For some reason the `declare` ServiceWorker line errors without an import.
import "./model/thread.js";

declare var self: ServiceWorkerGlobalScope;

const CACHE_NAME = "assets";
const CORE_ASSETS = ["index.html", "bootstrap.js", "worker.js"];

async function downloadCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(CORE_ASSETS);
}

self.oninstall = event => {
  event.waitUntil(Promise.all([downloadCoreAssets(), self.skipWaiting()]));
};

self.onactivate = event => {
  event.waitUntil(self.clients.claim());
};

self.onfetch = event => {
  const parsedURL = new URL(event.request.url);
  if (parsedURL.hostname !== location.hostname) {
    return;
  }
  const networkResponsePromise = fetch(event.request);
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        const networkResponse = await networkResponsePromise;
        cache.put(event.request, networkResponse.clone());
      } catch (e) {
        /* intentionally left blank */
      }
    })()
  );
  event.respondWith(
    (async () => {
      const cacheResponse = await caches.match(event.request);
      if (cacheResponse) {
        return cacheResponse;
      }
      const networkResponse = await networkResponsePromise;
      return networkResponse.clone();
    })()
  );
};
