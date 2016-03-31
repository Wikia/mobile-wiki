import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['discussion-error', 'columns', 'large-6'],

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
