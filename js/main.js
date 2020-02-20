window.onload = function() {
	var request = new XMLHttpRequest();

	request.onload = function(elements) {
		var json = JSON.parse(elements);
		console.log(json);
	}

	request.open("get", "creatures.json", true);
	request.send();
}