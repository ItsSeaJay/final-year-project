var creatures = [];
var initiativeList = [];

$(document).ready(function () {
	// Obtain the global creatures list from the JSON data
	$.getJSON('creatures.json', function(data) {
		var library = [];

		creatures = data;

		$.each(data, function(key, creature) {
			if("name" in creature) {
				$('#library>ul').append('<li onclick="addCreature(' + key + ')" data-id="' + key + '">' + creature["name"] + '</li>');
			}
		});
	})
});

function addCreature(key) {
	var initiativeListBody = $('#initiative-list>table>tbody');

	initiativeList.push(creatures[key]);

	var html = '<tr data-id="' + (initiativeList.length - 1) + '"" data-key="' + key + '">' +
		'<td>' +
			(initiativeList.length - 1) +
		'</td>' +
		'<td>' +
			creatures[key]["name"] +
		'</td>' +
		'<td>' + 
			creatures[key]["hit_points"] +
		'</td>' +
		'<td>' + 
			creatures[key]["armor_class"] +
		'</td>' +
	'</tr>';

	// Add the markup into the DOM and associate an anonymous event with it
	var newListing = $('#initiative-list>table>tbody').append(html);
	newListing.click(function () {
		$(this).children().remove()
	});
}