import DiscussionBaseController from './base';
import DiscussionContributionControllerMixin from '../../mixins/discussion-contribution-controller';
import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import ResponsiveMixin from '../../mixins/responsive';

export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	ResponsiveMixin,
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
