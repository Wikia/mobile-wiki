import Ember from 'ember';

/**
 * Handles deleting post and replies from pop-over
 */
export default Ember.Mixin.create({
	actions: {
		/**
		 * Delete item and close pop-over
		 * @param {object} item - post or reply
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
		 * @param {object} item - post or reply
		 * @returns {void}
		 */
		undelete(item) {
			// There's no API for closing Ember Pop-Up, so that's
			// the only way to close it after triggering an action from it
			this.$('.discussion-more-options').mousedown();
			this.attrs.undelete(item);
		},

		/**
		 * Report an item and close pop-over
		 * @param {object} item - post or reply
		 * @returns {void}
		 */
		reportPost(item) {
			// There's no API for closing Ember Pop-Up, so that's
			// the only way to close it after triggering an action from it
			this.$('.discussion-more-options').mousedown();
			this.attrs.reportPost(item);
		},

		/**
		 * Report an item and close pop-over
		 * @param {object} item - post or reply
		 * @returns {void}
		 */
		reportReply(item) {
			// There's no API for closing Ember Pop-Up, so that's
			// the only way to close it after triggering an action from it
			this.$('.discussion-more-options').mousedown();
			this.attrs.reportReply(item);
		}
	}
});
