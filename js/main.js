var creatures = [];
var initiative_list = [];

var states = {
	normal: 0,
	combat: 1,
}
var state = states.normal;

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

	// Add a click event to the start button
	$('#action-bar').children('button').eq(0).click(function() {
		switch(state) {
			case states.normal:
				if (initiative_list.length > 1) {
					// Transition into the combat state
					this.innerHTML = 'End Combat';
					state = states.combat;
				} else {
					// Can't start the encounter unless there is more than one combatant
					alert('Can\'t start an encounter; more than one combatant needs to be present!');
				}
				break;
			case states.combat:
				this.innerHTML = 'Begin Encounter'
				state = states.normal;
				break;
		}
	});
});