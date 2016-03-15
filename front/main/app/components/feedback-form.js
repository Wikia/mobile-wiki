import Ember from 'ember';
import BottomBanner from './bottom-banner';
import {getGroup} from 'common/modules/AbTest';
import {track, trackActions} from 'common/utils/track';

const variations = {
		SATISFACTION_Q1_TEXT: {
			question: 'Did you find what you were looking for?',
			buttons: 'text'
		},
		SATISFACTION_Q1_ICON: {
			question: 'Did you find what you were looking for?',
			buttons: 'icons'
		},
		SATISFACTION_Q2_TEXT: {
			question: 'Did this answer your question?',
			buttons: 'text'
		},
		SATISFACTION_Q3_TEXT: {
			question: 'Was this article accurate?',
			buttons: 'text'
		},
		EMOTIONS_Q1_EMOT: {
			question: 'What did you think of this article?',
			buttons: 'emots'
		},
		EMOTIONS_Q2_EMOT: {
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
	cookieName = 'feedback-form',
	experimentName = 'USER_SATISFACTION_FEEDBACK';


export default BottomBanner.extend({
	classNames: ['feedback-form'],
	bannerOffset: 0,
	lastOffset: 0,
	firstDisplay: false,
	variationId: null,
	firstHide: false,
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
		this.set('variationId', getGroup(experimentName));

		if (!Ember.$.cookie(cookieName) && this.get('variationId')) {
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
					dismissed: false
				});

				if (!this.get('firstDisplay')) {
					this.trackImpression('user-feedback-first-prompt');
					this.set('firstDisplay', true);
				}
			} else {
				this.set('dismissed', true);

				if (this.get('firstDisplay') && !this.get('firstHide')) {
					this.trackImpression('user-feedback-first-prompt-hide');
					this.set('firstHide', true);
				}
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
	trackClick(label) {
		track({
			action: trackActions.click,
			category: 'user-feedback',
			label
		});
	},
	trackImpression(label) {
		track({
			action: trackActions.impression,
			category: 'user-feedback',
			label
		});
	},
	actions: {
		yes() {
			this.setProperties({
				displayQuestion: false,
				displayThanks: true,
				message: completed.yes.message
			});

			this.trackClick('user-feedback-yes');
			this.trackImpression('user-feedback-second-prompt-thankyou');

			this.dismissBanner(completed.yes.timeout);
		},
		no() {
			this.setProperties({
				displayQuestion: false,
				displayInput: true,
				message: helpImproveMessage
			});

			this.trackClick('user-feedback-no');
			this.trackImpression('user-feedback-second-prompt-feedback');
		},
		feedback() {
			this.setProperties({
				displayInput: false,
				displayThanks: true,
				message: completed.no.message
			});

			this.trackImpression('user-feedback-third-prompt-thankyou');

			this.dismissBanner(completed.no.timeout);
		}
	}
});
