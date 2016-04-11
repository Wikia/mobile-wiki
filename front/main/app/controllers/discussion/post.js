import Ember from 'ember';
import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionUpvoteControllerMixin from '../../mixins/discussion-upvote-controller';

export default Ember.Controller.extend(
	DiscussionModerationControllerMixin,
	DiscussionUpvoteControllerMixin,
	{
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
			loadOlderComments() {
				this.get('target').send('loadOlderComments');
			},

			/**
			 * Bubbles up to DiscussionPostRoute
			 *
			 * @returns {void}
			 */
			loadNewerComments() {
				this.get('target').send('loadNewerComments');
			},
		}
	}
);
