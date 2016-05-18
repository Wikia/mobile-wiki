import DiscussionBaseRoute from './base';
import DiscussionContributionRouteMixin from '../../mixins/discussion-contribution-route';
import DiscussionReportedPostsModel from '../../models/discussion/reported-posts';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionForumActionsRouteMixin from '../../mixins/discussion-forum-actions-route';
import DiscussionModalDialogMixin from '../../mixins/discussion-modal-dialog';

export default DiscussionBaseRoute.extend(
	DiscussionContributionRouteMixin,
	DiscussionModerationRouteMixin,
	DiscussionForumActionsRouteMixin,
	DiscussionModalDialogMixin,
	{
		discussionEditor: Ember.inject.service(),
		discussionSort: Ember.inject.service(),

		/**
		 * Redirect to 'latest' if any other (yet) unsupported sort called
		 *
		 * @param {EmberStates.Transition} transition
		 *
		 * @returns {void}
		 */
		beforeModel(transition) {
			const routeParams = transition.params['discussion.reported-posts'],
				sortBy = routeParams.sortBy;

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

			return DiscussionReportedPostsModel.find(Mercury.wiki.id, this.get('discussionSort.sortBy'));
		},

		/**
		 * @param {string} sortBy
		 * @returns {EmberStates.Transition}
		 */
		setSortBy(sortBy) {
			this.get('discussionSort').setSortBy(sortBy);
			return this.transitionTo('discussion.reported-posts', sortBy);
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
			 * Goes to post list page and attempts to create a new post there
			 *
			 * @param {object} postData
			 *
			 * @returns {void}
			 */
			create(postData) {
				this.get('discussionSort').setSortBy('latest');
				this.transitionTo('discussion.forum', 'latest').promise.then(() => {
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
