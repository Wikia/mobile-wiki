import Ember from 'ember';

/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({
	currentUser: Ember.inject.service(),

	/**
	 * Checks if there's a permission to upvote a post / reply
	 * @returns {boolean}
	 */
	canUpvote() {
		return !this.get('isDeleted') && !this.get('isParentDeleted') && this.get('currentUser.isAuthenticated');
	},

	actions: {
		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post) {
			if (this.canUpvote()) {
				this.get('upvote')(post);
			}
		}
	}
});
