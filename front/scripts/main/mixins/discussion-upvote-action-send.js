import App from '../app';

/**
 * Handles sending upvote action outside from the component.
 */
export default App.DiscussionUpvoteActionSendMixin = Ember.Mixin.create({
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
