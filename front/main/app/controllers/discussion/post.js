import Ember from 'ember';
import DiscussionDeleteControllerMixin from '../../mixins/discussion-delete-controller';

export default Ember.Controller.extend(DiscussionDeleteControllerMixin, {
	postListSort: '',

	canShowMore: Ember.computed('model.postCount', 'model.replies.length', function () {
		const model = this.get('model');

		return model.get('replies.length') < model.get('postCount');
	}),

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
