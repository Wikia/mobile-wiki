import DiscussionForumWrapper from './discussion-forum-wrapper';
import DiscussionEditEditorMixin from '../mixins/discussion-edit-editor';

export default DiscussionForumWrapper.extend(
	DiscussionEditEditorMixin,
	{
		classNames: ['user-list-wrapper']
	}
);
