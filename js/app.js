Vue.component(
	'creature-listing',
	{
		props: [
			'creature'
		],
		template: '<li>{{ creature.name }}</li>'
	}
);

Vue.component(
	'combatant',
	{
		props: [
			'creature'
		],
		template: `
			<tr>
				<td>?</td>
				<td>{{ creature.name }}</td>
				<td>{{ creature.hit_points }}</td>
				<td>{{ creature.armor_class }}</td>
			</tr>
		`
	}
)

var app = new Vue({
	el: '#app',
	data: {
		creatures: [],
		initiativeOrder: []
	},
	methods: {
		addCreature: function (event) {
			for (creature in this.creatures) {
				// Search for the creature in the array
				if (this.creatures[creature].name === event.target.innerHTML) {
					// Add that creature to the initiative order
					this.initiativeOrder.push(this.creatures[creature]);
				}
			}

			console.log(this.initiativeOrder);
		}
	},
	created: function () {
		// this runs when the component is mounted
		fetch("creatures.json")
			.then(data => data.json())
			.then(creatures => { this.creatures = creatures })
	}
});