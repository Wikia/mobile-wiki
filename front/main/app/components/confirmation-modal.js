import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['confirmation-message'],
	currentUser: Ember.inject.service(),
	showDiffLink: false,
	bodyText: [],

	actions: {
		/**
		 * @returns {void}
		 */
		undo() {
			this.sendAction('undo', this.get('bodyText'));
			this.sendAction('closeConfirmation');
		},
		/**
		 * @returns {void}
		 */
		close() {
			this.sendAction('closeConfirmation');
		}
	}
});
