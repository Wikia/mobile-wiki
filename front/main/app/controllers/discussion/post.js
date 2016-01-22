import Ember from 'ember';
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
		 * @param {object} replyData
		 * @returns {void}
		 */
		create(replyData) {
			this.get('target').send('create', replyData);
		},

		/**
		 * Bubbles up to DiscussionPostRoute
		 *
		 * @param {object} post
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
		}
	}
});
