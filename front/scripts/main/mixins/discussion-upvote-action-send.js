

/**
 * Handles sending upvote action outside from the component.
 */
const DiscussionUpvoteActionSendMixin = Ember.Mixin.create({
	actions: {
		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post) {
			this.sendAction('upvote', post);
		}
	}
});

export default DiscussionUpvoteActionSendMixin;
