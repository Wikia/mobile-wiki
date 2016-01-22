import Ember from 'ember';
import DiscussionDeleteControllerMixin from '../../mixins/discussion-delete-controller';
import DiscussionUpvoteControllerMixin from '../../mixins/discussion-upvote-controller';

export default Ember.Controller.extend(
	DiscussionDeleteControllerMixin,
	DiscussionUpvoteControllerMixin, {

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
		 * @param {object} replyData
		 * @returns {void}
		 */
		create(replyData) {
			this.get('target').send('create', replyData);
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 *
		 * @returns {void}
		 */
		loadMoreComments() {
			this.get('target').send('loadMoreComments');
		}
	}
});
