var creatures = [];
var initiativeList = [];

$(document).ready(function () {
	// Obtain the global creatures list from the JSON data
	$.getJSON('creatures.json', function(data) {
		var library = [];

		creatures = data;

		$.each(data, function(key, creature) {
			if("name" in creature) {
				$('#library>ul').append('<li onclick="addCreature(' + key + ')" id="' + key + '">' + creature["name"] + '</li>');
			}
		});
	})
});

function addCreature(key) {
	initiativeList.push(creatures[key]);
	$('#initiative-list>ul').append('<li>' + creatures[key]["name"] + '</li>');
}