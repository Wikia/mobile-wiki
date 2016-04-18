import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';
import DiscussionEditEditorMixin from '../mixins/discussion-edit-editor';

export default Ember.Component.extend(DiscussionModalDialogMixin, DiscussionEditEditorMixin, {
	discussionSort: Ember.inject.service(),

	actions: {
		deleteAllPosts() {
			this.attrs.deleteAllPosts(this.get('model.entities'));
		}
	}
});
