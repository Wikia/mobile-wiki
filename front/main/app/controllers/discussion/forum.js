import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionContributionControllerMixin from '../../mixins/discussion-contribution-controller';
import DiscussionForumActionsControllerMixin from '../../mixins/discussion-forum-actions-controller';
import DiscussionBaseController from './base';
import DiscussionEditEditorMixin from '../../mixins/discussion-edit-editor';


export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionContributionControllerMixin,
	DiscussionForumActionsControllerMixin,
	DiscussionEditEditorMixin
);
