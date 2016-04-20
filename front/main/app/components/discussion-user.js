import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';

export default Ember.Component.extend(DiscussionModalDialogMixin, {
	discussionSort: Ember.inject.service(),

	actions: {
		deleteAllPosts() {
			this.attrs.deleteAllPosts(this.get('model.entities'));
		}
	}
});
