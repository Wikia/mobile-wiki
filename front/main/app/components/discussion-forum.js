import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';

export default Ember.Component.extend(DiscussionModalDialogMixin, {
	discussionEditor: Ember.inject.service(),

	editEditorActive: Ember.computed.readOnly('discussionEditor.isEditEditorOpen')
});
