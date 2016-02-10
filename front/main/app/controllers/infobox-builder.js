import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		/**
		 * Bubbles up to InfoboxBuilder Route
		 *
		 * @returns {void}
		 */
		cancel() {
			this.get('target').send('cancel');
		},

		/**
		 * Bubbles up to InfoboxBuilder Route
		 *
		 * @returns {void}
		 */
		save() {
			this.get('target').send('save');
		}
	}
});
