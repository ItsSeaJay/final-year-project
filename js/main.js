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
							// Only allow the user to remove combatants during the selction phase
							if (state == states.normal) {
								$(this).remove();

								var index = initiative_list.indexOf(creatures[key]);
							}
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

					// Hide the library
					$('#library').addClass('hidden');

					// Roll for initiative!
					for (creature in initiative_list) {
						var initiative_roll = Math.round(Math.random() * 20);
						var initiative_bonus = Math.round((initiative_list[creature]["dexterity"] - 10) / 2);
						
						// Remember to factor dexterity for initiative score calculation
						initiative_list[creature]["initiative"] = initiative_roll + initiative_bonus;

						$('#initiative-modal>ul').append('<li>' + initiative_list[creature]["initiative"] + '</li>');
					}
				} else {
					// Can't start the encounter unless there is more than one combatant
					alert('Can\'t start an encounter; more than one combatant needs to be present!');
				}
				break;
			case states.combat:
				// Reverse the global state back to normal
				this.innerHTML = 'Begin Encounter'
				state = states.normal;

				// Show the library
				$('#library').removeClass('hidden');
				break;
		}
	});
});