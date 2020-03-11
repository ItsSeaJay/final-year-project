var creatures = [];
var initiative_order = [];

var states = {
	normal: 0,
	combat: 1,
}
var state = states.normal;

var turn = 0;
var round = 0;

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
						'?' +
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

					$('#initiative-modal').append('<button id="confirm-button">Confirm</button>');

					$('#confirm-button').click(function() {
						// Clear the unneeded HTML
						$('#initiative-modal>ul').html('');
						$('#initiative-list>table>tbody').html('');

						// Re-do the initiative list in order
						for (creature in initiative_order) {
							var html = '<tr data-id="' + (initiative_order.length - 1) + '" data-key="' + creature["key"] + '">' +
								'<td>' +
									initiative_order[creature]["score"] +
								'</td>' +
								'<td>' +
									creatures[initiative_order[creature]["key"]]["name"] +
								'</td>' +
								'<td>' + 
									creatures[initiative_order[creature]["key"]]["hit_points"] +
								'</td>' +
								'<td>' + 
									creatures[initiative_order[creature]["key"]]["armor_class"] +
								'</td>' +
								'</tr>';

							$('#initiative-list>table>tbody').append(html);
						}

						// Remove the confirm button
						$('#confirm-button').remove();

						// Ensure the current creature is displayed as active
						document.querySelector('#initiative-list>table>tbody').children[0].classList.add('active');

						// Add the "Next Turn" button
						$('#action-bar').append('<button>Next Turn</button>');

						document.querySelector('#action-bar').children[1].addEventListener('click', function() {
							turn++;
							console.log(turn);
						});
					});
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