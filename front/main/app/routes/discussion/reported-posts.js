import DiscussionBaseRoute from './base';
import DiscussionRouteUpvoteMixin from '../../mixins/discussion-route-upvote';
import DiscussionReportedPostsModel from '../../models/discussion-reported-posts';
import DiscussionLayoutMixin from '../../mixins/discussion-layout';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';

export default DiscussionBaseRoute.extend(
	DiscussionLayoutMixin,
	DiscussionRouteUpvoteMixin,
	DiscussionModerationRouteMixin, {
		discussionSort: Ember.inject.service(),

		forumId: null,

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.Promise}
		 */
		model(params) {
			if (params.sortBy) {
				this.get('discussionSort').setSortBy(params.sortBy);
			}

			this.get('discussionSort').set('reported', true);

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
					this.modelFor('discussion.reported-posts').createPost(postData);
				});
			},

			/**
			 * @param {string} sortBy
			 * @returns {void}
			 */
			setSortBy(sortBy) {
				this.setSortBy(sortBy);
			},

			applyFilters(sortBy, shouldShowReported) {
				if (shouldShowReported === false) {
					return this.transitionTo('discussion.index');
				}
			},
		}
	}
);
