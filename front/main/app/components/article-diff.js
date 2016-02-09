import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['diff-page'],
	currentUser: Ember.inject.service(),
	showUndoButton: Ember.computed('currentUser.isAuthenticated', 'currentUser.isBlocked', function () {
		return this.get('currentUser.isAuthenticated') && !this.get('currentUser.isBlocked');
	}),
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
