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
		no: {
			message: 'This site is created and maintained by fans like you. We welcome you to edit!',
			timeout: 10000
		},
		yes: {
			message: 'We\'ll share your appreciation with the users who wrote this article.',
			timeout: 7000
		}
	},
	helpImproveMessage = 'Your input helps to improve this wiki. Every bit of feedback is highly valued. ' +
		'What information was missing?',
	offsetLimit = 0.2,
	cookieName = 'feedback-form';


export default BottomBanner.extend({
	classNames: ['feedback-form'],
	bannerOffset: 0,
	lastOffset: 0,
	firstDisplay: false,
	// This is for testing only. Will be removed after setuping an experiment
	variationId: Math.floor(Math.random() * 6),
	variation: Ember.computed(function () {
		return variations[this.variationId];
	}),
	message: '',
	displayQuestion: true,
	displayInput: false,
	displayThanks: false,
	shouldDisplay: Ember.$.cookie('feedback-form'),
	init() {
		this._super(...arguments);

		if (!Ember.$.cookie(cookieName)) {
			Ember.run.scheduleOnce('afterRender', this, () => {
				const pageHeight = document.getElementsByClassName('wiki-container')[0].offsetHeight;

				this.set('bannerOffset', Math.floor(pageHeight * offsetLimit));
				Ember.$(window).on('scroll.feedbackForm', () => this.checkOffsetPosition());
			});
		}
	},
	willDestroyElement() {
		Ember.$(window).off('scroll.feedbackForm');
	},
	checkOffsetPosition() {
		const scrollY = window.scrollY,
			direction = scrollY >= this.get('lastOffset') ? 0 : 1;

		this.set('lastOffset', scrollY);

		Ember.run.debounce({}, () => {
			if ((this.get('firstDisplay') || scrollY > this.get('bannerOffset')) && direction) {
				this.setProperties({
					loaded: true,
					dismissed: false,
					firstDisplay: true
				});
			} else {
				this.set('dismissed', true);
			}
		}, 500);
	},
	dismissBanner(timeout) {
		Ember.$(window).off('scroll.feedbackForm');

		Ember.run.later(this, () => {
			this.setCookie(cookieName, 1);
			this.set('dismissed', true);
		}, timeout);

	},
	actions: {
		yes() {
			this.setProperties({
				displayQuestion: false,
				displayThanks: true,
				message: completed.yes.message
			});

			this.dismissBanner(completed.yes.timeout);
		},
		no() {
			this.setProperties({
				displayQuestion: false,
				displayInput: true,
				message: helpImproveMessage
			});
		},
		feedback() {
			this.setProperties({
				displayInput: false,
				displayThanks: true,
				message: completed.no.message
			});

			this.dismissBanner(completed.no.timeout);
		}
	}
});
