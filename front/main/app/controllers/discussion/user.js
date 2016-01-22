import DiscussionDeleteControllerMixin from '../../mixins/discussion-delete-controller';
import DiscussionUpvoteControllerMixin from '../../mixins/discussion-upvote-controller';

export default Ember.Controller.extend(
	DiscussionDeleteControllerMixin,
	DiscussionUpvoteControllerMixin, {

	application: Ember.inject.controller(),

	actions: {
		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('target').send('retry');
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @param {string} postId
		 * @param {boolean} openInNewTab
		 * @returns {void}
		 */
		goToPost(postId, openInNewTab = false) {
			this.get('target').send('goToPost', postId, openInNewTab);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @param {number} pageNum
		 * @returns {void}
		 */
		loadPage(pageNum) {
			this.get('target').send('loadPage', pageNum);
		}
	}
});
