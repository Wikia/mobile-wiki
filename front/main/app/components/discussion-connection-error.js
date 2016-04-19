import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-error'],

	actions: {
		/**
		 * Attempts to retry a previously failed transition
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('error.transition').retry();
		}
	}
});
