import DiscussionDeleteControllerMixin from '../../mixins/discussion-delete-controller';
import DiscussionModalDialogControllerMixin from '../../mixins/discussion-modal-dialog-controller';

export default Ember.Controller.extend(DiscussionDeleteControllerMixin, DiscussionModalDialogControllerMixin, {
	postListSort: '',

	actions: {
		/**
		 * @returns {void}
		 */
		expand() {
			const model = this.get('model');

			model.loadNextPage().then(() => {
				const model = this.get('model');

				if (model.get('minorError')) {
					// Hide more posts button when error occurred
					model.set('postCount', model.get('replies.length'));
				}
			});
		},

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


		retry() {
			this.get('target').send('retry');
		},
		retry() {
			this.get('target').send('retry');
		},

		/**
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.get('target').send('goToAllDiscussions');
		},

		/**
		 * @returns {void}
		 */
		goToForum() {
			const model = this.get('model');

			this.get('target').send('goToForum', model.get('forumId'), this.get('postListSort'));
		},
	}
});
