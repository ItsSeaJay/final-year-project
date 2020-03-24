Vue.component(
	'creature-listing',
	{
		props: [
			'creature'
		],
		template: '<li>{{ index }} {{ creature.name }}</li>'
	}
);

var app = new Vue({
	el: '#app',
	data: {
		creatures: [],
		initiativeOrder: []
	},
	components: {
		initiative: {
			props: [
				'data'
			],
			template: `
				<table> 
                    <thead>
                        <tr>
                            <th>Initiative</th>
                            <th>Name</th>
                            <th>Hit Points</th>
                            <th>Armor Class</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for='combatant in data'>
                            <td>?</td>
                            <td>{{ combatant.name }}</td>
                            <td>{{ combatant.hit_points }}</td>
                            <td>{{ combatant.armor_class }}</td>
                        </tr>
                    </tbody>
                </table>
			`
		}
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