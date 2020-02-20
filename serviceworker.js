if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
			// Registration of the service worker was successful
			console.log('ServiceWorker registration successful with scope ', registration.scope);
		}, function (err) {
			// Registration failed
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}

var CACHE_NAME = 'final-year-project-v1';
var urlsToCache = [
	'/',
	'/css/boilerplate.css',
	'/css/normalize.css',
	'/js/main.js',
	'/js/plugins.js',
	'/404.html',
	'/browserconfig.xml',
	'/favicon.ico',
	'/humans.txt',
	'/icon.png',
	'/index.html',
	'/robots.txt',
	'/serviceworker.js',
	'/site.webmanifest',
	'/tile-wide.png',
	'/tile.png',
];

self.addEventListener('install', function(event) {
	// Perform install steps
	event.waitUntil(
		caches.open(CACHE_NAME).then(function(cache) {
			console.log('Opened cache');
			return cache.addAll(urlsToCache);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches.match(event.request).then(function(response) {
			// Cache hit - return response
			if (response) {
				return response;
			}

			return fetch(event.request).then(
				function(response) {
					// Check if we received a valid response
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					// IMPORTANT: Clone the response. A response is a stream
					// and because we want the browser to consume the response
					// as well as the cache consuming the resposne, we need to
					// clone it so that we are able to have multiple streams.
					var responseToCache = response.clone();

					caches.open(CACHE_NAME).then(function(cache) {
						cache.put(event.request, responseToCache);
					});

					return response;
				}
			);
		})
	)
});