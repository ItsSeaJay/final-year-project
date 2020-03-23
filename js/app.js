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
	'initiative-list',
	{
		props: [
			'initiativeOrder'
		],
		template: `
			<table>
				<tr v-for="i in 32">
					<td>{{ i }}</td>
				</tr>
			</table>
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