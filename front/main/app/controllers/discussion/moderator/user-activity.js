import DiscussionModerationControllerMixin from '../../../mixins/discussion-moderation-controller';
import DiscussionContributionControllerMixin from '../../../mixins/discussion-contribution-controller';
import ResponsiveMixin from '../../../mixins/responsive';
import DiscussionBaseController from '../base';

export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	ResponsiveMixin,
	{
		options: {
			posts: {
				isActive: false,
			}
		}
	}
);
