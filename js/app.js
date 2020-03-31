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
		initiativeOrder: [],
		activeCombatant: 0,
		turn: 0,
		activeTab: 1,
		newCharacterForm: false
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
						<tr v-for="(index, combatant) in data" v-bind:class="{ active: index }">
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
					<h2>Initiative Rolls</h2>

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
		},
		'new-character-form': {
			props: [
				'character'
			],
			template: `
				<div class="container">
					<form>
						<label for="name">Name</label>
						<input type="text" name="name" />
						<br>
						<label for="size">Size</label>
						<select name="size" id="size">
							<option value="fine">Fine</option>
							<option value="diminutive">Diminutive</option>
							<option value="Tiny">Tiny</option>
							<option value="small">Small</option>
							<option value="Medium">Medium</option>
							<option value="large">Large</option>
							<option value="huge">Huge</option>
							<option value="gargantuan">Gargantuan</option>
							<option value="colossal">Colossal</option>
						</select>
					</form>
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
			console.log(event.target.value);

			var index = event.target.getAttribute('data-index');

			this.initiativeOrder[index].initiative_score = parseFloat(event.target.value);
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

			// Sort the table into order
			this.initiativeOrder.sort(function (first, second) {
				return first.initiative_score < second.initiative_score;
			});

			console.log(this.initiativeOrder);
		},
		advanceTurn: function (event) {
			this.turn += 1;
			console.log(this.turn);
		},
		getActive: function (event) {
			console.log(event);
		}
	},
	created: function () {
		// this runs when the component is mounted
		fetch("creatures.json")
			.then(data => data.json())
			.then(creatures => { this.creatures = creatures })
	}
});

// Configure IndexedDB
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
if (!window.indexedDB) {
   window.alert("Your browser doesn't support a stable version of IndexedDB.");
}