const CACHE_NAME = 'vehicle-garage-v3'

self.addEventListener('install', (event) => {
	self.skipWaiting()
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll([
		'/',
		'/index.html',
		'/manifest.webmanifest',
		'/icons/vehicle-garage-192.svg',
		'/icons/vehicle-garage-512.svg',
		'/icons/vehicle-garage-maskable.svg',
	])))
})

self.addEventListener('activate', (event) => {
	event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))).then(() => self.clients.claim())))
})

self.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return
	event.respondWith(fetch(event.request).then((response) => {
		const copy = response.clone()
		void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy))
		return response
	}).catch(() => caches.match(event.request).then((cached) => cached ?? caches.match('/index.html'))))
})
