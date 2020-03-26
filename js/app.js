Vue.component(
	'creature-listing',
	{
		props: [
			'creature'
		],
		template: '<li>{{ creature.name }}</li>'
	}
);

const states = {
	normal: 0,
	precombat: 1,
	combat: 2
}

var app = new Vue({
	el: '#app',
	data: {
		state: states.normal,
		creatures: [],
		initiativeOrder: []
	},
	components: {
		'initiative-order': {
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
                            <td>{{ combatant.initiative_score }}</td>
                            <td>{{ combatant.name }}</td>
                            <td>{{ combatant.hit_points }}</td>
                            <td>{{ combatant.armor_class }}</td>
                        </tr>
                    </tbody>
                </table>
			`
		},
		'initiative-modal': {
			props: [
				'data'
			],
			template: `
				<div class="modal">
					<ul v-for="(index, combatant) in data">
						<li>
							<span>{{ index }} - {{ combatant.name }}</span>
							<input
							data-index="{{ index }}"
							type="number"
							value="{{ combatant.initiative_score }}"
							v-on:input="$emit('updateinitiative', $event)">
						</li>
					</ul>
					<button
					type="button"
					v-on:click="$emit('begin-combat')">
						Confirm
					</button>
				</div>
			`
		}
	},
	methods: {
		rollInitiative: function(creature) {
			// Calculate the initiative bonus based on the target's
			// dexterity score
			var initiativeBonus = Math.floor((this.initiativeOrder[combatant].dexterity - 10) / 2);
			// Roll the initiative score for this creature based on the bonus
			var initiativeScore = Math.round(Math.random() * (20 + 1)) + initiativeBonus;
		
			creature.initiative_score = initiativeScore;
		},
		updateInitiative: function (event) {
			console.log(event);

			var index = event.target.getAttribute('data-index');
			var clone = JSON.parse(JSON.stringify(this.initiativeOrder[index]));

			// Update the initiative score of the clone
			clone.initiative_score = event.data;

			console.log(clone.initiative_score);

			// Replace the creature in the list with the clone
			// this.$set(this.initiativeOrder,	index, clone);

			this.initiativeOrder[index].initiative_score = event.data;
		},
		addCreature: function (index) {
			var nextCombatant = JSON.parse(JSON.stringify(this.creatures[index]));

			if (this.state === states.precombat) {
				this.rollInitiative(nextCombatant);
			}

			// Add this creature to the initiative order
			this.initiativeOrder.push(nextCombatant);
		},
		setupEncounter: function (event) {
			if (this.initiativeOrder.length < 2) {
				alert('Need at least two combatants per encounter!');

				return;
			}

			for (combatant in this.initiativeOrder) {
				// Calculate the initiative bonus based on the target's
				// dexterity score
				var initiativeBonus = Math.floor((this.initiativeOrder[combatant].dexterity - 10) / 2);
				// Roll the initiative score for this creature based on the bonus
				var initiativeScore = Math.round(Math.random() * (20 + 1)) + initiativeBonus;
				var clone = JSON.parse(JSON.stringify(this.creatures));

				this.rollInitiative(this.initiativeOrder[combatant]);
			}

			this.state = states.precombat;
		},
		cancelEncounter: function (event) {
			this.state = states.normal;
		},
		beginCombat: function (event) {
			this.state = states.combat;
			console.log(this.state);

			console.log(this.initiativeOrder);

			this.initiativeOrder.sort(function (first, second) {
				return first.initiative_score + second.initiative_score;
			});

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