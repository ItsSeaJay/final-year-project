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
	var creatures;

	$.getJSON('creatures.json', function(data) {
		creatures = data;
	});

	$("section#initiative-list>ul").append("<li>test</li>");
}