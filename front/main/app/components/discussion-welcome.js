import Ember from 'ember';
import wrapMeHelper from '../helpers/wrap-me';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['desktop-hidden'],

	wasSeen: new Boolean(localStorage.getItem('discussionWelcomeMessageSeen')),

	guidelinesLink: wrapMeHelper.compute([
		Ember.Handlebars.Utils.escapeExpression(i18n.t('main.guidelines-link-title', {ns: 'discussion'}))
	], {
		tagName: 'a',
		className: 'guidelinesOpener',
	}),

	/**
	 * @param {Object} event - event object
	 * @returns {void}
	 */
	click(event) {
		if (event.target.classList.contains('guidelinesOpener')) {
			track(trackActions.GuidelinesLinkWelcomeTapped);
			this.get('gotoGuidelines')();
		}
	},

	actions: {
		/**
		 * Closes the welcome message and sets 'discussionWelcomeMessageSeen' key in localStorage
		 * @returns {void}
		 */
		close() {
			this.set('wasSeen', true);
			localStorage.setItem('discussionWelcomeMessageSeen', 'wasSeen');
			track(trackActions.WelcomeMessageClose);
		},
	},
});
