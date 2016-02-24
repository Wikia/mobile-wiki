import DiscussionBaseRoute from './base';
import DiscussionRouteUpvoteMixin from '../../mixins/discussion-route-upvote';
import DiscussionReportedPostsModel from '../../models/discussion-reported-posts';
import DiscussionLayoutMixin from '../../mixins/discussion-layout';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';

export default DiscussionBaseRoute.extend(
	DiscussionLayoutMixin,
	DiscussionRouteUpvoteMixin,
	DiscussionModerationRouteMixin,
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

			create(postData) {
				this.setSortBy('latest').promise.then(() => {
					const model = this.modelFor('discussion.reported-posts');

					model.createPost(postData).then((xhr) => {
						if (xhr.mercuryResponseData && !model.get('errorMessage')) {
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

			applyFilters(sortBy, onlyReported) {
				const discussionSort = this.get('discussionSort'),
					currentSortBy = discussionSort.get('sortBy');

				let targetRoute;

				if (sortBy !== currentSortBy) {
					discussionSort.setSortBy(sortBy);
					targetRoute = 'discussion.reported-posts';
				}

				if (onlyReported === false) {
					targetRoute = 'discussion.forum';
				}

				return this.transitionTo(targetRoute, Mercury.wiki.id, sortBy);
			},
		}
	}
);
