import DiscussionBaseRoute from './base';
import DiscussionRouteUpvoteMixin from '../../mixins/discussion-route-upvote';
import DiscussionReportedPostsModel from '../../models/discussion-reported-posts';
import DiscussionLayoutMixin from '../../mixins/discussion-layout';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionForumActionsRouteMixin from '../../mixins/discussion-forum-actions-route';


export default DiscussionBaseRoute.extend(
	DiscussionLayoutMixin,
	DiscussionRouteUpvoteMixin,
	DiscussionModerationRouteMixin,
	DiscussionForumActionsRouteMixin,
	{
		discussionEditor: Ember.inject.service(),
		discussionSort: Ember.inject.service(),

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

			discussionSort.setOnlyReported(true);

			this.set('forumId', params.forumId);

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

			/**
			 * @param {string} sortBy
			 * @returns {void}
			 */
			setSortBy(sortBy) {
				this.setSortBy(sortBy);
			},
		}
	}
);
