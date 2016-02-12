import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		/**
		 * @returns {void}
		 */
		cancel() {
			this.get('target').send('cancel');
		},

		/**
		 * @returns {void}
		 */
		save() {
			this.get('target').send('save');
		},

		/**
		 * @param {String} type
		 * @returns {void}
		 */
		addItem(type) {
			this.get('target').send('addItem', type);
		},

		/**
		 * @param {Object} item
		 * @returns {void}
		 */
		removeItem(item) {
			this.get('target').send('removeItem', item);
		},

		/**
		 * @param {Object} item
		 * @returns {void}
		 */
		setEditItem(item) {
			this.get('target').send('setEditItem', item);
		}
	}
});
