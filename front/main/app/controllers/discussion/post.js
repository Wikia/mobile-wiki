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
			loadOlderReplies() {
				this.get('target').send('loadOlderReplies');
			},

			/**
			 * Bubbles up to DiscussionPostRoute
			 *
			 * @returns {void}
			 */
			loadNewerReplies() {
				this.get('target').send('loadNewerReplies');
			},
		}
	}
);
