import DiscussionBaseController from './base';
import DiscussionContributionControllerMixin from '../../mixins/discussion-contribution-controller';

export default DiscussionBaseController.extend(
	DiscussionContributionControllerMixin,
	{}
);
