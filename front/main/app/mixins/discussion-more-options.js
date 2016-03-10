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
		report(item) {
			// There's no API for closing Ember Pop-Up, so that's
			// the only way to close it after triggering an action from it
			this.$('.discussion-more-options').mousedown();
			this.attrs.report(item);
		},

		/**
		 * Locks an item and closes pop-over
		 * @param {object} item - post
		 * @returns {void}
		 */
		lock(item) {
			// There's no API for closing Ember Pop-Up, so that's
			// the only way to close it after triggering an action from it
			this.$('.discussion-more-options').mousedown();
			this.attrs.lock(item);
		},

		/**
		 * Unocks an item and closes pop-over
		 * @param {object} item - post
		 * @returns {void}
		 */
		unlock(item) {
			// There's no API for closing Ember Pop-Up, so that's
			// the only way to close it after triggering an action from it
			this.$('.discussion-more-options').mousedown();
			this.attrs.unlock(item);
		},
	}
});
