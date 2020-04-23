const STATES = {
	normal: 0,
	precombat: 1,
	combat: 2
};

var db;
var app = new Vue({
	el: '#app',
	data: {
		state: STATES.normal,
		creatures: [],
		characters: [],
		encounters: [],
		initiativeOrder: [],
		activeCombatant: 0,
		turn: 0,
		activeTab: 1,
		hideSidebar: false,
		forms: {
			newCharacter: true
		}
	},
	components: {
		'creature-listing': {
			props: [
				'creature'
			],
			template: `
				<li>{{ creature.name }}</li>
			`
		},
		'initiative-order': {
			props: [
				'combatants'
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
						<tr v-for="(combatant, index) in combatants">
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
				'combatants'
			],
			template: `
				<div class="modal">
					<h2>Initiative Rolls</h2>

					<ul v-for="(combatant, index) in combatants">
						<li>
							<span>{{ index }} - {{ combatant.name }}</span>
							<input
							:data-index="index"
							type="number"
							:value="combatant.initiative_score"
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
			template: `
				<div>
					<h2>New Character</h2>
					<hr>
					<p v-if="errors.length">
						<ul>
							<li v-for="error in errors">{{ error }}</li>
						</ul>
					</p>
					<form @submit.prevent="onSubmit">
						<label for="name">Name</label>
						<input type="text" name="name" v-model="character.name" required />
						<br>
						<label for="type">Type</label>
						<input type="text" name="type" v-model="character.type" />
						<br>
						<label for="size">Size</label>
						<select name="size" id="size" select="medium" v-model="character.size">
							<option value="small">Small</option>
							<option value="Medium">Medium</option>
							<option value="large">Large</option>
						</select>
						<br>
						<label for="level">Level</label>
						<input type="text" name="level" v-model="character.level" />
						<br>
						<label for="hit_points">Hit Points</label>
						<input type="number" name="hit_points" value="10" v-model="character.hit_points" required />
						<input type="text" name="hit_dice" value="1d1+0" v-model="character.hit_dice" />
						<br>
						<label for="armor_class">Armor Class</label>
						<input type="number" name="armor_class" value="10" />
						<div class="ability-scores">
							<label for="strength">Strength</label>
							<input type="number" name="strength" value="10" v-model="character.strength" required />
							<label for="dexterity">Dexterity</label>
							<input type="number" name="dexterity" value="10" v-model="character.dexterity" required />
							<label for="constitution">Constitution</label>
							<input type="number" name="constitution" value="10" v-model="character.constitution" required />
							<label for="intelligence">Intelligence</label>
							<input type="number" name="intelligence" value="10" v-model="character.intelligence" required />
							<label for="wisdom">Wisdom</label>
							<input type="number" name="wisdom" value="10" v-model="character.wisdom" required />
							<label for="charisma">Charisma</label>
							<input type="number" name="charisma" value="10" v-model="character.charisma" required />
						</div>
						<input type="submit" value="Submit" />
						<button type="button" v-on:click="$parent.forms.newCharacter = false">
							Cancel
						</button>
					</form>
				</div>
			`,
			data: function () {
				return {
					character: {
						name: '',
						type: '',
						size: '',
						hit_points: 1,
						hit_dice: '',
						armor_class: 10,
						strength: 10,
						dexterity: 10,
						constitution: 10,
						intelligence: 10,
						wisdom: 10,
						charisma: 10
					},
					errors: [],
				}
			},
			methods: {
				validate: function () {
					var valid = true;

					// Reset the list of errors
					this.errors = [];
					
					if (this.character.name === '') {
						this.errors.push('Name required');
					}

					if (this.character.hit_points === null) {
						this.errors.push('Hit points required');
					}

					if (this.character.hit_points < 0) {
						this.errors.push('Hit points cannot be negative');
					}

					if (this.character.level < 0 || this.character.level > 20) {
						this.errors.push('Invalid character level');
					}

					if (this.character.strength < 0 || this.character.strength > 30) {
						this.errors.push('Invalid strength score');
					}

					if (this.character.dexterity < 0 || this.character.dexterity > 30) {
						this.errors.push('Invalid dexterity score');
					}

					if (this.character.constitution < 0 || this.character.constitution > 30) {
						this.errors.push('Invalid constitution score');
					}

					if (this.character.intelligence < 0 || this.character.intelligence > 30) {
						this.errors.push('Invalid intelligence score');
					}

					if (this.character.wisdom < 0 || this.character.wisdom > 30) {
						this.errors.push('Invalid wisdom score');
					}

					if (this.character.charisma < 0 || this.character.charisma > 30) {
						this.errors.push('Invalid charisma score');
					}

					if (this.errors.length > 0) {
						valid = false;
					}

					return valid;
				},
				onSubmit: function(event) {
					// First, attempt to validate the form
					if (this.validate() === false) {
						event.preventDefault();

						return;
					}

					// Make a clone of the current character
					var clone = JSON.parse(JSON.stringify(this.character));

					// Add the clone to the database
					db.characters.add(clone);
					// Add the clone to the local character data
					this.$parent.characters.push(clone);
					// Reset the form data
					this.character = {
						name: '',
						type: '',
						size: '',
						hit_points: 1,
						hit_dice: '',
						armor_class: 10,
						strength: 10,
						dexterity: 10,
						constitution: 10,
						intelligence: 10,
						wisdom: 10,
						charisma: 10
					};

					// Close the form dialog
					this.$parent.newCharacterForm = false;
				}
			}
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

			if (this.state === STATES.precombat) {
				this.rollInitiative(nextCombatant);
			}

			// Add this creature to the initiative order
			this.initiativeOrder.push(nextCombatant);
		},
		addCharacter: function (index) {
			var clone = JSON.parse(JSON.stringify(this.characters[index]));

			if (this.state === STATES.precombat) {
				this.rollInitiative(clone);
			}

			// Add this character to the initiative order
			this.initiativeOrder.push(clone);
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

			this.state = STATES.precombat;
		},
		cancelEncounter: function (event) {
			this.state = STATES.normal;
		},
		saveEncounter: function (event) {
			var currentDate = new Date();
			var name = currentDate.getDate() + "/"
                + (currentDate.getMonth() + 1)  + "/" 
                + currentDate.getFullYear() + " @ "  
                + currentDate.getHours() + ":"  
                + currentDate.getMinutes() + ":" 
                + currentDate.getSeconds();
            var encounter = {
            	name: name,
            	combatants: this.initativeOrder,
            };

            console.log(encounter);

			db.encounters.add(encounter);
			this.encounters.push(encounter);
		},
		loadEncounter: function (index) {
			this.initativeOrder = this.encounters[index].combatants;
		},
		beginCombat: function (event) {
			this.state = STATES.combat;

			// Sort the table into order
			this.initiativeOrder.sort(function (first, second) {
				return first.initiative_score > second.initiative_score;
			});
		},
		advanceTurn: function (event) {
			this.turn += 1;
			console.log(this.turn);
		}
	},
	created: function () {
		// Configure the database
		db = new Dexie('final_year_project');
		db.version(2).stores({
			characters: '++id,name,type,size,hit_points,hit_dice,armor_class,strength,dexterity,constitution,wisdom,charisma',
			encounters: '++id,name,combatants'
		});
		db.open();
		db.characters.toArray().then(characters => {
			this.characters = characters
		});
		db.encounters.toArray().then(encounters => {
			this.encounters = encounters
		});

		// This runs when the component is mounted
		fetch("creatures.json")
			.then(data => data.json())
			.then(creatures => { this.creatures = creatures })
	}
});