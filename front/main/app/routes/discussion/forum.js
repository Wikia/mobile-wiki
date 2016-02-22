import DiscussionBaseRoute from './base';
import DiscussionRouteUpvoteMixin from '../../mixins/discussion-route-upvote';
import DiscussionForumModel from '../../models/discussion-forum';
import DiscussionLayoutMixin from '../../mixins/discussion-layout';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';

export default DiscussionBaseRoute.extend(
	DiscussionLayoutMixin,
	DiscussionRouteUpvoteMixin,
	DiscussionModerationRouteMixin, {
		discussionSort: Ember.inject.service(),

		forumId: null,
		queryParams: {
			reported: {
				refreshModel: true
			}
		},

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.Promise}
		 */
		model(params) {
			if (params.sortBy) {
				this.get('discussionSort').setSortBy(params.sortBy);
			}

			this.set('forumId', params.forumId);

			return DiscussionForumModel.find(Mercury.wiki.id, params.forumId, {
				sortBy: this.get('discussionSort.sortBy'),
				reported: params.reported
			});
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
				this.modelFor('discussion.forum').loadPage(pageNum, this.get('discussionSort.sortBy'));
			},

			create(postData) {
				this.setSortBy('latest').promise.then(() => {
					this.modelFor('discussion.forum').createPost(postData);
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
