import DiscussionBaseRoute from './base';
import DiscussionContributionRouteMixin from '../../mixins/discussion-contribution-route';
import DiscussionReportedPostsModel from '../../models/discussion/reported-posts';
import DiscussionLayoutMixin from '../../mixins/discussion-layout';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionForumActionsRouteMixin from '../../mixins/discussion-forum-actions-route';
import DiscussionModalDialogMixin from '../../mixins/discussion-modal-dialog';

export default DiscussionBaseRoute.extend(
	DiscussionLayoutMixin,
	DiscussionContributionRouteMixin,
	DiscussionModerationRouteMixin,
	DiscussionForumActionsRouteMixin,
	DiscussionModalDialogMixin,
	{
		discussionEditor: Ember.inject.service(),
		discussionSort: Ember.inject.service(),

		forumId: null,

		/**
		 * Redirect to 'latest' if any other (yet) unsupported sort called
		 *
		 * @param {EmberStates.Transition} transition
		 *
		 * @returns {void}
		 */
		beforeModel(transition) {
			const routeParams = transition.params['discussion.reported-posts'],
				forumId = routeParams.forumId,
				sortBy = routeParams.sortBy;

			this.set('forumId', forumId);

			if (sortBy !== 'latest') {
				this.setSortBy('latest');
			}
		},

		/**
		 * @param {object} params
		 *
		 * @returns {Ember.RSVP.Promise}
		 */
		model(params) {
			const discussionSort = this.get('discussionSort');

			if (params.sortBy !== discussionSort.get('sortBy')) {
				discussionSort.setSortBy(params.sortBy);
			}

			discussionSort.setOnlyReported(true);

			return DiscussionReportedPostsModel.find(Mercury.wiki.id, params.forumId, this.get('discussionSort.sortBy'));
		},

		/**
		 * @param {string} sortBy
		 * @returns {EmberStates.Transition}
		 */
		setSortBy(sortBy) {
			this.get('discussionSort').setSortBy(sortBy);
			return this.transitionTo('discussion.reported-posts', this.get('forumId'), sortBy);
		},

		actions: {
			/**
			 * @param {number} pageNum
			 * @returns {void}
			 */
			loadPage(pageNum) {
				this.modelFor('discussion.reported-posts').loadPage(pageNum, this.get('discussionSort.sortBy'));
			},

			/**
			 * Goes to post list page and attempts to create a new post there
			 *
			 * @param {object} postData
			 *
			 * @returns {void}
			 */
			create(postData) {
				this.get('discussionSort').setSortBy('latest');
				this.transitionTo('discussion.forum', this.get('forumId'), 'latest').promise.then(() => {
					const model = this.modelFor('discussion.forum');

					model.createPost(postData).then((xhr) => {
						if (xhr.apiResponseData && !model.get('errorMessage')) {
							this.get('discussionEditor').trigger('newPost');
						}
					});
				});
			},
		}
	}
);
