import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['portable-infobox-question'],
	classNameBindings: ['collapsed'],
	experimentMap: {
		// harrypotter.wikia.com
		'Hermione Granger': 'What is Hermione Granger\'s House?',
		'Harry Potter': 'What is Harry Potter\'s Patronus?',
		'Ginevra Weasley': 'What is Ginevra Weasley\'s Bogart?',
		'Luna Lovegood': 'What is Luna Lovegood\'s wand?',
		// marvel.wikia.com
		'Wolverine (James "Logan" Howlett)': 'What is Wolverine (James "Logan" Howlett)\'s gender?',
		'Spider-Man (Peter Parker)': 'What is Spider-Man (Peter Parker)\'s citizenship?',
		'Deadpool (Wade Wilson)': 'What is Deadpool (Wade Wilson)\'s place of birth?',
		'Hive (Earth-616)': 'hat is Hive (Earth-616)\'s origin?',
		// gameofthrones.wikia.com
		'Sansa Starks': 'Who is Sansa Stark\'s sister?',
		'Tyrion Lannister': 'Who is Tyrion Lannister\'s brother?',
		'Tyrion Lannister': 'Who is Tyrion Lannister\'s brother?',
		'Daenerys Targaryen': 'What is Daenerys Targaryen\'s religion?',
		'Gregor Clegane': 'Who is Gregor Clegane\'s brother?',
		// warframe.wikia.com for testing
		'Battalyst': 'When Batman was borned?',
		'Adhesive Blast': 'When Adhesive Blast very first artcile was created?',
	},
	question: Ember.computed('title', function() {
		return this.experimentMap[this.title];
	})
});
