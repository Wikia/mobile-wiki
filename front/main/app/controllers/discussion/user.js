import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionUpvoteControllerMixin from '../../mixins/discussion-upvote-controller';
import DiscussionBaseController from './base';

export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionUpvoteControllerMixin,
	{
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
			 * @param {number} pageNum
			 * @returns {void}
			 */
			loadPage(pageNum) {
				this.get('target').send('loadPage', pageNum);
			}
		}
	}
);
