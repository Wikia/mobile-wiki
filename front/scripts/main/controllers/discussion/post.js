import DiscussionDeleteControllerMixin from '../../mixins/discussion-delete-controller';

export default Ember.Controller.extend(DiscussionDeleteControllerMixin, {
	postListSort: '',

	actions: {
		/**
		 * Bubbles up to DiscussionPostRoute
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('target').send('retry');
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 *
		 * @returns {void}
		 */
		create(postData) {
			this.get('target').send('create', postData);
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 *
		 * @returns {void}
		 */
		upvote(post) {
			this.get('target').send('upvote', post);
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 *
		 * @returns {void}
		 */
		loadMoreComments() {
			this.get('target').send('loadMoreComments');
		},

		/**
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.get('target').send('goToAllDiscussions');
		},
	}
});
