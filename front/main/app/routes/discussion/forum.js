import DiscussionBaseRoute from './base';
import DiscussionRouteUpvoteMixin from '../../mixins/discussion-route-upvote';
import DiscussionForumModel from '../../models/discussion/forum';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionForumActionsRouteMixin from '../../mixins/discussion-forum-actions-route';
import DiscussionModalDialogMixin from '../../mixins/discussion-modal-dialog';

export default DiscussionBaseRoute.extend(
	DiscussionRouteUpvoteMixin,
	DiscussionModerationRouteMixin,
	DiscussionForumActionsRouteMixin,
	DiscussionModalDialogMixin,
	{
		canModerate: null,
		discussionSort: Ember.inject.service(),
		discussionEditor: Ember.inject.service(),

		forumId: null,

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.Promise}
		 */
		model(params) {
			const discussionSort = this.get('discussionSort');

			if (params.sortBy) {
				discussionSort.setSortBy(params.sortBy);
			}

			discussionSort.setOnlyReported(false);

			this.set('forumId', params.forumId);

			return DiscussionForumModel.find(Mercury.wiki.id, params.forumId, this.get('discussionSort.sortBy'));
		},

		/**
		 * @param {string} sortBy
		 * @returns {EmberStates.Transition}
		 */
		setSortBy(sortBy) {
			this.get('discussionSort').setSortBy(sortBy);
			return this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
		},

		actions: {
			/**
			 * @param {number} pageNum
			 * @returns {void}
			 */
			loadPage(pageNum) {
				this.modelFor(this.get('routeName')).loadPage(pageNum, this.get('discussionSort.sortBy'));
			},

			/**
			 * Applies sorting by date and attempts to create a new post
			 *
			 * @param {object} postData
			 *
			 * @returns {void}
			 */
			create(postData) {
				this.setSortBy('latest').promise.then(() => {
					const model = this.modelFor(this.get('routeName'));

					model.createPost(postData).then((data) => {
						if (data && !model.get('errorMessage')) {
							this.get('discussionEditor').trigger('newPost');
						}
					});
				});
			},
		}
	}
);
