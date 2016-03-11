import Ember from 'ember';

/**
 * Handles deleting post and replies from pop-over
 */
export default Ember.Mixin.create({
	actions: {
		/**
		 * Delete item
		 * @param {object} item - post or reply
		 * @returns {void}
		 */
		delete(item) {
			this.attrs.delete(item);
		},

		/**
		 * Undelete item
		 * @param {object} item - post or reply
		 * @returns {void}
		 */
		undelete(item) {
			this.attrs.undelete(item);
		},

		/**
		 * Report an item
		 * @param {object} item - post or reply
		 * @returns {void}
		 */
		report(item) {
			this.attrs.report(item);
		},

		/**
		 * Locks an item
		 * @param {object} item - post
		 * @returns {void}
		 */
		lock(item) {
			this.attrs.lock(item);
		},

		/**
		 * Unlocks an item
		 * @param {object} item - post
		 * @returns {void}
		 */
		unlock(item) {
			this.attrs.unlock(item);
		},
	}
});
