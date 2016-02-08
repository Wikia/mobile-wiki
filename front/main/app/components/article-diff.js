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
		 * @returns {void}
		 */
		undo() {
			this.sendAction('undo');
		}
	}
});
