var creatures = [];
var initiative_list = [];

$(document).ready(function () {
	// Obtain the global creatures list from the JSON data
	$.getJSON('creatures.json', function(data) {
		var library = [];

		creatures = data;

		$.each(data, function(key, creature) {
			if("name" in creature) {
				var html = '<li data-id="' + key + '">'
					+ creature["name"] +
					'</li>';

				$('#library>ul').append(html);
			}
		});

		$('#library>ul').children().each(function() {
			$(this).click(function() {
				var initiative_list_body = $('#initiative-list>table>tbody');
				var key = $(this).data('id');

				initiative_list.push(creatures[key]);

				var html = '<tr data-id="' + (initiative_list.length - 1) + '" data-key="' + key + '">' +
					'<td>' +
						(initiative_list.length - 1) +
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
				$('#initiative-list>table>tbody').append(html);
				$('#initiative-list>table>tbody').children().each(function() {
					var id = $(this).data('id');

					if (id === (initiative_list.length - 1)) {
						$(this).click(function() {
							$(this).remove();

							var index = initiative_list.indexOf(creatures[key]);
						});
					}
				});
			});
		});
	});
});