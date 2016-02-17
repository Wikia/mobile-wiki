import Ember from 'ember';
import nearestParent from 'ember-pop-over/computed/nearest-parent';

/**
 * Handles deleting post and replies from pop-over
 */
export default Ember.Mixin.create({
	popover: nearestParent('pop-over'),

	actions: {
		/**
		 * Delete item and close pop-over
		 * @param {object} item - post or reply
		 * @returns {void}
		 */
		delete(item) {
			this.attrs.delete(item);
			this.get('popover').deactivate();
		},

		/**
		 * Undelete item and close pop-over
		 * @param {object} item - post or reply
		 * @returns {void}
		 */
		undelete(item) {
			this.attrs.undelete(item);
			this.get('popover').deactivate();
		},

		/**
		 * Report an item and close pop-over
		 * @param {object} item - post or reply
		 * @returns {void}
		 */
		report(item) {
			this.attrs.report(item);
			this.get('popover').deactivate();
		}
	}
});
