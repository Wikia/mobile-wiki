import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['confirmation-message'],
	currentUser: Ember.inject.service(),
	showDiffLink: false,
	summary: [],

	actions: {
		/**
		 * @returns {void}
		 */
		confirm() {
			this.sendAction('confirm', this.get('summary'));
			this.sendAction('close');
		},

		/**
		 * @returns {void}
		 */
		close() {
			this.sendAction('close');
		}
	}
});
