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
                        	<th>Index</th>
                            <th>Initiative</th>
                            <th>Name</th>
                            <th>Hit Points</th>
                            <th>Armor Class</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for='(index, combatant) in data'>
                            <td>{{ index }}</td>
                            <td>???</td>
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
			var nextCombatant = JSON.parse(JSON.stringify(this.creatures[index]));

			// Add this creature to the initiative order
			this.initiativeOrder.push(nextCombatant);
		}
	},
	created: function () {
		// this runs when the component is mounted
		fetch("creatures.json")
			.then(data => data.json())
			.then(creatures => { this.creatures = creatures })
	}
});