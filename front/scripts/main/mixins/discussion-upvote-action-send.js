/**
 * Handles sending upvote action outside from the component.
 */
export default Ember.Mixin.create({
	actions: {
		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post) {
			if (!this.get('isDeleted') && !this.get('isParentDeleted')) {
				this.sendAction('upvote', post);
			}
		}
	}
});
