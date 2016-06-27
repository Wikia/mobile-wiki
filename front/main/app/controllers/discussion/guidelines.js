import DiscussionBaseController from './base';
import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';

export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	{}
);
