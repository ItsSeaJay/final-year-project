$(document).ready(function () {
	$.getJSON('creatures.json', function(data) {
		var creatures = [];

		$.each(data, function(key, creature) {
			if("name" in creature) {
				creatures.push('<li id="' + key + '">' + creature["name"] + "</li>")
			}
		});

		$( "<ul/>", {
			"class": "my-new-list",
			html: creatures.join( "" )
		}).appendTo( "body" );
	})
});