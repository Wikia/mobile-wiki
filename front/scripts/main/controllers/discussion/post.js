import DiscussionDeleteControllerMixin from '../../mixins/discussion-delete-controller';
import DiscussionModalDialogControllerMixin from '../../mixins/discussion-modal-dialog-controller';

export default Ember.Controller.extend(DiscussionDeleteControllerMixin, DiscussionModalDialogControllerMixin, {
	postListSort: '',

	actions: {
		/**
		 * Bubbles up to DiscussionPostRoute
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('target').send('retry');
		},
		// TODO
		create(postData) {
			this.get('target').send('create', postData);
		},

		upvote(post) {
			this.get('target').send('upvote', post);
		},


		loadMoreComments() {
			this.get('target').send('loadMoreComments');
		},


		/**
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.get('target').send('goToAllDiscussions');
		},
	}
});
