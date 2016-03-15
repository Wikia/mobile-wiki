import Ember from 'ember';

const answeredCookieName = 'portableInfoboxQuestionAnswered';

export default Ember.Component.extend({
	tagName: 'portable-infobox-question',
	classNames: ['portable-infobox-question'],
	classNameBindings: ['collapsed', 'submitted'],
	thankYou: false,
	submitted: Ember.computed('thankYou', function () {
		return this.thankYou;
	}),
	isVisible: Ember.computed.notEmpty('question'),
	invalid: '',
	answer: '',
	question: Ember.computed('pageTitle', function () {
		const experimentMap = {
				// harrypotter.wikia.com
				509: {
					'Hermione Granger': 'What is Hermione Granger\'s House?',
					'Harry Potter': 'What is Harry Potter\'s Patronus?',
					'Ginevra Weasley': 'What is Ginevra Weasley\'s Bogart?',
					'Luna Lovegood': 'What is Luna Lovegood\'s wand?'
				},
				// marvel.wikia.com
				2233: {
					'Wolverine (James "Logan" Howlett)': 'What is Wolverine (James "Logan" Howlett)\'s gender?',
					'Spider-Man (Peter Parker)': 'What is Spider-Man (Peter Parker)\'s citizenship?',
					'Deadpool (Wade Wilson)': 'What is Deadpool (Wade Wilson)\'s place of birth?',
					'Hive (Earth-616)': 'hat is Hive (Earth-616)\'s origin?'
				},
				// gameofthrones.wikia.com
				130814: {
					'Sansa Stark': 'Who is Sansa Stark\'s sister?',
					'Tyrion Lannister': 'Who is Tyrion Lannister\'s brother?',
					'Daenerys Targaryen': 'What is Daenerys Targaryen\'s religion?',
					'Gregor Clegane': 'Who is Gregor Clegane\'s brother?'
				}
			},
			experimentMapWiki = experimentMap[Ember.get(Mercury, 'wiki.id')],
			answered = Ember.$.cookie(answeredCookieName);

		return !answered && experimentMapWiki ? experimentMapWiki[this.get('pageTitle')] : '';
	}),

	actions: {
		submit() {
			// Because article content is not inserted to the page in ember way value from the intupt field
			// is not propagating to answer variable, hence hack below
			const answer = Ember.$('.portable-infobox-question__input')[0].value;

			this.set('answer', answer);
			if (answer) {
				this.set('invalid', '');
				this.set('thankYou', true);
				Ember.$.cookie(answeredCookieName, true, 90);
			} else {
				this.set('invalid', 'invalid');
			}
		}
	}
});
