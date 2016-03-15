import Ember from 'ember';
import UserFeedbackStorageMixin from '../mixins/user-feedback-storage';

export default Ember.Component.extend(
	UserFeedbackStorageMixin,
	{
		tagName: 'portable-infobox-question',
		classNames: ['portable-infobox-question'],
		classNameBindings: ['collapsed', 'submitted'],
		experimentId: 'INFOBOX_BASED_QUESTIONS',
		answeredCookieName: 'portableInfoboxQuestionAnswered',
		thankYou: false,
		submitted: Ember.computed('thankYou', function () {
			return this.thankYou;
		}),
		isVisible: Ember.computed.notEmpty('question'),
		invalid: '',
		question: Ember.computed('pageTitle', function () {
			const experimentMap = {
					// harrypotter.wikia.com
					509: {
						'Hermione Granger': {
							text: 'What is Hermione Granger\'s House?',
							level: 'easy'
						},
						'Harry Potter': {
							text: 'What is Harry Potter\'s Patronus?',
							level: 'easy'
						},
						'Ginevra Weasley': {
							text: 'What is Ginevra Weasley\'s Bogart?',
							level: 'hard'
						},
						'Luna Lovegood': {
							text: 'What is Luna Lovegood\'s wand?',
							level: 'hard'
						}
					},
					// marvel.wikia.com
					2233: {
						'Wolverine (James "Logan" Howlett)': {
							text: 'What is Wolverine (James "Logan" Howlett)\'s gender?',
							level: 'easy'
						},
						'Spider-Man (Peter Parker)': {
							text: 'What is Spider-Man (Peter Parker)\'s citizenship?',
							level: 'easy'
						},
						'Deadpool (Wade Wilson)': {
							text: 'What is Deadpool (Wade Wilson)\'s place of birth?',
							level: 'hard'
						},
						'Hive (Earth-616)': {
							text: 'hat is Hive (Earth-616)\'s origin?',
							level: 'hard'
						}
					},
					// gameofthrones.wikia.com
					130814: {
						'Sansa Stark': {
							text: 'Who is Sansa Stark\'s sister?',
							level: 'easy'
						},
						'Tyrion Lannister': {
							text: 'Who is Tyrion Lannister\'s brother?',
							level: 'easy'
						},
						'Daenerys Targaryen': {
							text: 'What is Daenerys Targaryen\'s religion?',
							level: 'hard'
						},
						'Gregor Clegane': {
							text: 'Who is Gregor Clegane\'s brother?',
							level: 'hard'
						}
					}
				},
				experimentMapWiki = experimentMap[Ember.get(Mercury, 'wiki.id')],
				answered = Ember.$.cookie(this.get('answeredCookieName'));

			return !answered && experimentMapWiki ? experimentMapWiki[this.get('pageTitle')] : '';
		}),

		actions: {
			submit() {
				// Because article content is not inserted to the page in ember way value from the intupt field
				// is not propagating to answer variable, hence hack below
				const answer = Ember.$('.portable-infobox-question__input')[0].value;

				if (!Ember.isEmpty(answer)) {
					this.set('invalid', '');
					this.set('thankYou', true);
					Ember.$.cookie(this.get('answeredCookieName'), true, 90);

					this.saveUserFeedback({
						experimentId: this.get('experimentId'),
						variationId: this.get('question').level,
						pageTitle: this.get('pageTitle'),
						wikiId: Ember.get(Mercury, 'wiki.id'),
						feedback: answer
					});
				} else {
					this.set('invalid', 'invalid');
				}
			}
		}
	}
);
