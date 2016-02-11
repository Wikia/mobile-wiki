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
		 * @returns {void}
		 */
		save() {
			this.get('target').send('save');
		},

		/**
		 * @desc sends addItem action to route
		 * @param {String} type
		 * @returns {void}
		 */
		addItem(type) {
			this.get('target').send('addItem', type);
		},

		/**
		 * @desc sends setEditItem action to route
		 * @param {Object} item
		 * @returns {void}
		 */
		setEditItem(item) {
			this.get('target').send('setEditItem', item);
		}
	}
});
