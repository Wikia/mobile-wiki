import App from '../app';

/**
 * Handles sending upvote action outside from the component.
 */
App.DiscussionUpvoteActionSendMixin = Ember.Mixin.create({
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

export default App.DiscussionUpvoteActionSendMixin;
