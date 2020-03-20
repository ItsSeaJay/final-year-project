Vue.component(
	'creature-listing',
	{
		props: [
			'creature'
		],
		template: '<li>{{ index }} {{ creature.name }}</li>'
	}
);

Vue.component(
	'combatant',
	{
		props: [
			'combatant'
		],
		template: `
			<tr>
				<td>?</td>
				<td>{{ combatant.name }}</td>
				<td>{{ combatant.hit_points }}</td>
				<td>{{ combatant.armor_class }}</td>
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
		addCreature: function (index) {
			this.initiativeOrder.push(this.creatures[index]);
		}
	},
	created: function () {
		// this runs when the component is mounted
		fetch("creatures.json")
			.then(data => data.json())
			.then(creatures => { this.creatures = creatures })
	}
});