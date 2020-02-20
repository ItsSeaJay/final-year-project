if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
		navigator.serviceWorker.register('/serviceworker.js').then(function(registration) {
			// Registration of the service worker was successful
			console.log('ServiceWorker registration successful with scope ' registration.scope);
		}, function (err) {
			// Registration failed
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}