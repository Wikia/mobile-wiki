import Ember from 'ember';

/**
 * Handles deleting post and replies from pop-over
 */
export default Ember.Mixin.create({
	actions: {
		/**
		 * Delete item and close pop-over
		 *
		 * @returns {void}
		 */
		delete(item) {
			this.$('.discussion-more-options').mousedown();
			this.attrs.delete(item);
		},

		/**
		 * Undelete item and close pop-over
		 *
		 * @returns {void}
		 */
		undelete(item) {
			this.$('.discussion-more-options').mousedown();
			this.attrs.undelete(item);
		}
	}
});
