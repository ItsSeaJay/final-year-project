var creatures = [];
var initiative_list = []

$(document).ready(function () {
	$.getJSON('creatures.json', function(data) {
		$.each(data, function(key, creature) {
			if("name" in creature) {
				creatures.push('<li onclick="addCreature(' + key + ')" id="' + key + '">' + creature["name"] + "</li>")
			}
		});

		$( "<ul/>", {
			"class": "my-new-list",
			html: creatures.join( "" )
		}).appendTo( "body" );
	})
});

function addCreature(key) {
	initiative_list.push(creatures[key])
	console.log(initiative_list);
}