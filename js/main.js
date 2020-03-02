var creatures = [];
var initiative_order = [];

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
				var initiative_order_body = $('#initiative-list>table>tbody');
				var key = $(this).data('id');

				initiative_order.push({
					"key": key
				});

				var html = '<tr data-id="' + (initiative_order.length - 1) + '" data-key="' + key + '">' +
					'<td>' +
						(initiative_order.length - 1) +
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

					if (id === (initiative_order.length - 1)) {
						$(this).click(function() {
							// Only allow the user to remove combatants during the selction phase
							if (state == states.normal) {
								$(this).remove();

								var index = initiative_order.indexOf(creatures[key]);
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
				if (initiative_order.length > 1) {
					// Transition into the combat state
					this.innerHTML = 'End Combat';
					state = states.combat;

					// Hide the library
					$('#library').addClass('hidden');

					// Roll for initiative!
					for (creature in initiative_order) {
						var initiative_roll = Math.round(Math.random() * 20);
						var initiative_bonus = Math.round((creatures[initiative_order[creature]["key"]]["dexterity"] - 10) / 2);
						
						// Remember to factor dexterity for initiative score calculation
						initiative_order[creature]["score"] = initiative_roll + initiative_bonus;

						$('#initiative-modal>ul').append('<li>' + initiative_order[creature]["score"] + '</li>');
					}

					// Sort the list into descending order
					initiative_order.sort(function (a, b) {
						return b["score"] - a["score"];
					});

					console.log(initiative_order);
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