import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionUpvoteControllerMixin from '../../mixins/discussion-upvote-controller';
import DiscussionForumActionsControllerMixin from '../../mixins/discussion-forum-actions-controller';
import DiscussionBaseController from './base';

export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionUpvoteControllerMixin,
	DiscussionForumActionsControllerMixin
);
