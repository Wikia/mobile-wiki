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
			// There's no API for closing Ember Pop-Up, so that's
			// the only way to close it after triggering an action from it
			this.$('.discussion-more-options').mousedown();
			this.attrs.delete(item);
		},

		/**
		 * Undelete item and close pop-over
		 *
		 * @returns {void}
		 */
		undelete(item) {
			// There's no API for closing Ember Pop-Up, so that's
			// the only way to close it after triggering an action from it
			this.$('.discussion-more-options').mousedown();
			this.attrs.undelete(item);
		}
	}
});
