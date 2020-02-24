$(document).ready(function () {
	$.getJSON('creatures.json', function(data) {
		var creatures = [];

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
	console.log(key);
}