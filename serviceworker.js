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
	'/js/main.js'
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

			return fetch(event.request);
		})
	)
});