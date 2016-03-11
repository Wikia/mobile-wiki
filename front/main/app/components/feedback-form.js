import Ember from 'ember';
import BottomBanner from './bottom-banner';

const variations = {
		0: {
			question: 'Did you find what you were looking for?',
			buttons: 'text'
		},
		1: {
			question: 'Did you find what you were looking for?',
			buttons: 'icons'
		},
		2: {
			question: 'Did this answer your question?',
			buttons: 'text'
		},
		3: {
			question: 'Was this article accurate?',
			buttons: 'text'
		},
		4: {
			question: 'What did you think of this article?',
			buttons: 'emots'
		},
		5: {
			question: 'How did this article make you feel?',
			buttons: 'emots'
		}
	},
	completed = {
		'no': {
			message: 'This site is created and maintained by fans like you. We welcome you to edit!',
			timeout: 10
		},
		'yes': {
			message: 'We\'ll share your appreciation with the users who wrote this article.',
			timeout: 7
		}
	};


export default BottomBanner.extend({
	classNames: ['feedback-form'],
	variationId: Math.floor(Math.random() * 6),
	message: '',
	textButtons: true,
	emotButtons: false,
	iconButtons: false,
	displayQuestion: true,
	displayInput: false,
	displayThanks: false,
	init() {
		this._super(...arguments);
		this.setVariation(this.get('variationId'));
	},
	setVariation(id) {
		const variation = variations[id];

		this.resetVariations();

		if (variation.buttons === 'text') {
			this.set('textButtons', true);
		} else if (variation.buttons === 'emots') {
			this.set('emotButtons', true);
		} else {
			this.set('iconButtons', true);
		}

		this.set('question', variation.question);
	},
	resetVariations() {
		this.setProperties({
			textButtons: false,
			emotButtons: false,
			iconButtons: false
		});
	},
	actions: {
		yes() {
			this.setProperties({
				displayQuestion: false,
				displayThanks: true,
				message: completed['yes'].message
			});
		},
		no() {
			this.setProperties({
				displayQuestion: false,
				displayInput: true
			});
		},
		feedback() {
			this.setProperties({
				displayInput: false,
				displayThanks: true,
				message: completed['no'].message
			});
		}
	}
});
