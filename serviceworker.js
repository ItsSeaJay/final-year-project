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

const CACHE_NAME = 'final-year-project-v2';
var urlsToCache = [
	'/',
	'/css/main.css',
	'/css/normalize.css',
	'/img/sidebar/fast-forward-button.png',
	'/img/sidebar/large-paint-brush.png',
	'/img/sidebar/pause-button.png',
	'/img/sidebar/play-button.png',
	'/img/sidebar/save.png',
	'/js/vendor/dexie.min.js',
	'/js/vendor/vue.min.js',
	'/js/app.js',
	'/js/plugins.js',
	'/404.html',
	'/browserconfig.xml',
	'/favicon.ico',
	'/icon.png',
	'/index.html',
	'/creatures.json',
	'/robots.txt',
	'/humans.txt',
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