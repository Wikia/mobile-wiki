import DiscussionBaseController from './base';
import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionEditEditorMixin from '../../mixins/discussion-edit-editor';

export default DiscussionBaseController.extend(
	DiscussionModerationControllerMixin,
	DiscussionEditEditorMixin,
	{}
);
