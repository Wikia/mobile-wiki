import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['diff-page'],
	currentUser: Ember.inject.service(),
	showDiffLink: false,

	actions: {
		/**
		 * Passes up a show action to show modal
		 * @returns {void}
		 */
		showConfirmation() {
			this.sendAction('showConfirmation');
		}
	}
});
