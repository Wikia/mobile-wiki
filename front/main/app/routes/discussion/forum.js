import DiscussionBaseRoute from './base';
import DiscussionRouteUpvoteMixin from '../../mixins/discussion-route-upvote';
import DiscussionForumModel from '../../models/discussion-forum';
import DiscussionLayoutMixin from '../../mixins/discussion-layout';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionFilteringRouteMixin from '../../mixins/discussion-filtering-route';

export default DiscussionBaseRoute.extend(
	DiscussionLayoutMixin,
	DiscussionRouteUpvoteMixin,
	DiscussionModerationRouteMixin,
	DiscussionFilteringRouteMixin,
	{
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
				this.modelFor('discussion.forum').loadPage(pageNum, this.get('discussionSort.sortBy'));
			},

			create(postData) {
				this.setSortBy('latest').promise.then(() => {
					this.modelFor('discussion.forum').createPost(postData).then((xhr) => {
						if (xhr.mercuryResponseData) {
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
