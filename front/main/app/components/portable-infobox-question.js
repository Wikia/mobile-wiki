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
					'Hermione Granger': {
						question: 'What is Hermione Granger\'s House?',
						fieldToHide: 'House'
					},
					'Harry Potter': {
						question: 'What is Harry Potter\'s Patronus?',
						fieldToHide: 'Patronus'
					},
					'Ginevra Weasley': {
						question: 'What is Ginevra Weasley\'s Bogart?',
						fieldToHide: ''
					},
					'Luna Lovegood': {
						question: 'What is Luna Lovegood\'s wand?',
						fieldToHide: 'Wand'
					}
				},
				// marvel.wikia.com
				2233: {
					'Wolverine (James "Logan" Howlett)': {
						question: 'What is Wolverine (James "Logan" Howlett)\'s gender?',
						fieldToHide: 'Gender'
					},
					'Spider-Man (Peter Parker)': {
						question: 'What is Spider-Man (Peter Parker)\'s citizenship?',
						fieldToHide: 'Citizenship'
					},
					'Deadpool (Wade Wilson)': {
						question: 'What is Deadpool (Wade Wilson)\'s place of birth?',
						fieldToHide: 'Place of Birth'
					},
					'Hive (Earth-616)': {
						question: 'What is Hive (Earth-616)\'s origin?',
						fieldToHide: ''
					}
				},
				// gameofthrones.wikia.com
				130814: {
					'Sansa Stark': {
						question: 'Who is Sansa Stark\'s sister?',
						fieldToHide: 'Family',
						valueToHide: 'sister'
					},
					'Tyrion Lannister': {
						question: 'Who is Tyrion Lannister\'s brother?',
						fieldToHide: 'Family',
						valueToHide: 'brother'
					},
					'Daenerys Targaryen': {
						question: 'What is Daenerys Targaryen\'s religion?',
						fieldToHide: ''
					},
					'Gregor Clegane': {
						question: 'Who is Gregor Clegane\'s brother?',
						fieldToHide: 'Family',
						valueToHide: 'brother'
					}
				}
			},
			experimentMapWiki = experimentMap[Ember.get(Mercury, 'wiki.id')],
			experimentWikiPage = experimentMapWiki ? experimentMapWiki[this.get('pageTitle')] : null,
			answered = Ember.$.cookie(answeredCookieName);

		if (!experimentWikiPage || answered) {
			return '';
		}

		// We want to hide field in portable infobox with answer to our question
		if (experimentWikiPage.fieldToHide) {
			Ember.run.scheduleOnce('afterRender', this, () => {
				this.hideInfoboxField(experimentWikiPage.fieldToHide, experimentWikiPage.valueToHide);
			});
		}

		return experimentWikiPage.question;
	}),
	hideInfoboxField(field, value) {
		Ember.$('.portable-infobox').find('h3').filter(function () {
			if (this.textContent === field) {
				if (value) {
					this.hideFieldValue($(this).next('.pi-data-value'), value);
				} else {
					$(this).parent('.pi-item').remove();
				}
			}
		});
	},
	hideFieldValue($valueNode, value) {
		const values = $valueNode.html().split('<br>');
		let i = values.length - 1;

		for (i; i >= 0; i--) {
			if (values[i].indexOf(value) !== -1) {
				values.splice(i, 1);
			}
		}
		$valueNode.html(values.join('<br>'));
	},
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
