import Ember from 'ember';
import UserFeedbackStorageMixin from '../mixins/user-feedback-storage';
import {getDomain} from '../utils/domain';
import {track, trackActions} from 'common/utils/track';

const answeredCookieName = 'portableInfoboxQuestionAnswered',
	trackingCategory = 'portable-infobox-question';

export default Ember.Component.extend(
	UserFeedbackStorageMixin,
	{
		tagName: 'portable-infobox-question',
		classNames: ['portable-infobox-question'],
		classNameBindings: ['collapsed', 'submitted'],
		answer: '',
		classInvalid: '',
		experimentId: 'INFOBOX_BASED_QUESTIONS',
		inputId: 'portableInfoboxQuestion',
		isVisible: Ember.computed.notEmpty('question'),
		submitted: false,
		question: Ember.computed('pageTitle', function () {
			const experimentMap = {
					// harrypotter.wikia.com
					509: {
						'Hermione Granger': {
							text: 'What is Hermione Granger\'s House?',
							level: 'easy',
							fieldToHide: 'House'
						},
						'Harry Potter': {
							text: 'What is Harry Potter\'s Patronus?',
							level: 'easy',
							fieldToHide: 'Patronus'
						},
						'Ginevra Weasley': {
							text: 'What is Ginevra Weasley\'s Bogart?',
							level: 'hard',
							fieldToHide: ''
						},
						'Luna Lovegood': {
							text: 'What is Luna Lovegood\'s wand?',
							level: 'hard',
							fieldToHide: 'Wand'
						}
					},
					// marvel.wikia.com
					2233: {
						'Wolverine (James "Logan" Howlett)': {
							text: 'What is Wolverine (James "Logan" Howlett)\'s gender?',
							level: 'easy',
							fieldToHide: 'Gender'
						},
						'Spider-Man (Peter Parker)': {
							text: 'What is Spider-Man (Peter Parker)\'s citizenship?',
							level: 'easy',
							fieldToHide: 'Citizenship'
						},
						'Deadpool (Wade Wilson)': {
							text: 'What is Deadpool (Wade Wilson)\'s place of birth?',
							level: 'hard',
							fieldToHide: 'Place of Birth'
						},
						'Hive (Earth-616)': {
							text: 'What is Hive (Earth-616)\'s origin?',
							level: 'hard',
							fieldToHide: ''
						}
					},
					// gameofthrones.wikia.com
					130814: {
						'Sansa Stark': {
							text: 'Who is Sansa Stark\'s sister?',
							level: 'easy',
							fieldToHide: 'Family',
							valueToHide: 'sister',
							valueSeparator: '<br>'
						},
						'Tyrion Lannister': {
							text: 'Who is Tyrion Lannister\'s brother?',
							level: 'easy',
							fieldToHide: 'Family',
							valueToHide: 'brother',
							valueSeparator: '<br>'
						},
						'Daenerys Targaryen': {
							text: 'What is Daenerys Targaryen\'s religion?',
							level: 'hard',
							fieldToHide: ''
						},
						'Gregor Clegane': {
							text: 'Who is Gregor Clegane\'s brother?',
							level: 'hard',
							fieldToHide: 'Family',
							valueToHide: 'brother',
							valueSeparator: '<br>'
						}
					},
					// warframe.wikia.com
					544934: {
						Manic: {
							text: 'What is the Faction of Manic?',
							level: 'easy',
							fieldToHide: 'Faction'
						},
						Seeker: {
							text: 'What is the Faction of Seeker?',
							level: 'easy',
							fieldToHide: 'Faction'
						},
						Ivara: {
							text: 'What is the Armor of Ivara?',
							level: 'hard',
							fieldToHide: 'Armor'
						},
						Jackal: {
							text: 'What is the Alloy Armor of Jackal?',
							level: 'hard',
							fieldToHide: 'Alloy Armor'
						}
					},
					// disney.wikia.com
					374: {
						'Judy Hopps': {
							text: 'What color are Judy Hopps\' eyes?',
							level: 'easy',
							fieldToHide: 'Appearance',
							valueToHide: 'eyes'
						},
						'Nick Wilde': {
							text: 'What color are Nick Wilde\'s eyes?',
							level: 'easy',
							fieldToHide: 'Appearance',
							valueToHide: 'eyes'
						},
						Bellwether: {
							text: 'What color are Bellwether\'s eyes?',
							level: 'easy',
							fieldToHide: 'Appearance',
							valueToHide: 'eyes'
						},
						'Mr. Big (Zootopia)': {
							text: 'What color are Mr. Big\'s eyes?',
							level: 'easy',
							fieldToHide: 'Appearance',
							valueToHide: 'eyes'
						}
					},
					// starwars.wikia.com
					147: {
						'Darth Maul': {
							text: 'What color are Darth Maul\'s eyes?',
							level: 'easy',
							fieldToHide: 'Eye color'
						},
						'Kylo Ren': {
							text: 'What color are Kylo Ren\'s eyes?',
							level: 'easy',
							fieldToHide: 'Eye color'
						},
						'Anakin Skywalker': {
							text: 'What color are Anakin Skywalker\'s eyes?',
							level: 'easy',
							fieldToHide: 'Eye color'
						},
						Snoke: {
							text: 'What color are Snoke\'s eyes?',
							level: 'easy',
							fieldToHide: 'Eye color'
						}
					},
					// walkingdead.wikia.com
					13346: {
						'Negan (TV Series)': {
							text: 'What gender is Negan?',
							level: 'easy',
							fieldToHide: 'Gender'
						},
						'Carol Peletier (TV Series)': {
							text: 'What gender is Carol Peletier?',
							level: 'easy',
							fieldToHide: 'Gender'
						},
						'Glenn Rhee (TV Series)': {
							text: 'What gender is Glenn Rhee?',
							level: 'easy',
							fieldToHide: 'Gender'
						},
						'Sam Anderson (TV Series)': {
							text: 'What gender is Sam Anderson?',
							level: 'easy',
							fieldToHide: 'Gender'
						}
					}
				},
				experimentMapWiki = experimentMap[Ember.get(Mercury, 'wiki.id')],
				experimentWikiPage = !Ember.isEmpty(experimentMapWiki) ? experimentMapWiki[this.get('pageTitle')] : null,
				answered = Ember.$.cookie(answeredCookieName);

			if (!experimentWikiPage || answered) {
				return '';
			}

			// We want to hide field in portable infobox with answer to our question
			if (experimentWikiPage.fieldToHide) {
				Ember.run.scheduleOnce('afterRender', this, () => {
					this.hideInfoboxField(
						experimentWikiPage.fieldToHide,
						experimentWikiPage.valueToHide,
						experimentWikiPage.valueSeparator
					);
				});
			}

			return experimentWikiPage;
		}),
		hideInfoboxField(field, value, separator = ',') {
			Ember.$('.portable-infobox').find('h3').filter((index, elem) => {
				if (elem.textContent === field) {
					if (value) {
						const $valueNode = Ember.$(elem).next('.pi-data-value'),
							values = $valueNode.html().split(separator).filter((currentValue) => {
								return currentValue.indexOf(value) === -1;
							});

						$valueNode.html(values.join(separator));
					} else {
						Ember.$(elem).parent('.pi-item').remove();
					}
				}
			});
		},
		actions: {
			submit() {
				// Because article content is not inserted to the page in ember way value from the intupt field
				// is not propagating to answer variable, hence hack below
				const answer = this.$(`#${this.inputId}`)[0].value;

				this.set('answer', answer);
				if (!Ember.isEmpty(answer)) {
					this.setProperties({
						classInvalid: '',
						submitted: true,
					});
					Ember.$.cookie(answeredCookieName, true, {expires: 90, path: '/', domain: getDomain()});

					this.saveUserFeedback({
						experimentId: this.get('experimentId'),
						variationId: this.get('question').level,
						pageTitle: this.get('pageTitle'),
						wikiId: Ember.get(Mercury, 'wiki.id'),
						feedback: answer,
						feedbackImpressionsCount: this.getCookieCounter('infoboxQuestionsImpressions')
					});
					track({
						action: trackActions.submit,
						category: trackingCategory,
						label: 'answered'
					});
				} else {
					this.set('classInvalid', 'invalid');
				}
			},
		},

		init() {
			this._super(...arguments);
			if (!Ember.isEmpty(this.get('question'))) {
				this.incrementCookieCounter('infoboxQuestionsImpressions');
				track({
					action: trackActions.impression,
					category: trackingCategory,
					label: 'question'
				});
				Ember.run.scheduleOnce('afterRender', this, () => {
					this.$(`#${this.inputId}`)
						.one('focusin', () => {
							track({
								action: trackActions.focus,
								category: trackingCategory,
								label: 'input'
							});
						})
						.focusout(() => {
							this.set('classInvalid', '');
						});
				});
			}
		}
	}
);
