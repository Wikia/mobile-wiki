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
		discussionSort: Ember.inject.service(),

		/**
		 * @returns {Ember.RSVP.hash}
		 */
		model() {
			const discussionSort = this.get('discussionSort'),
				indexModel = this.modelFor('discussion');

			discussionSort.setOnlyReported(true);
			discussionSort.setSortBy('latest');

			return Ember.RSVP.hash({
				current: DiscussionReportedPostsModel.find(Mercury.wiki.id, this.get('discussionSort.sortBy')),
				index: indexModel
			});
		},

		actions: {
			/**
			 * @param {number} pageNum
			 * @returns {void}
			 */
			loadPage(pageNum) {
				this.modelFor(this.get('routeName')).current.loadPage(pageNum, this.get('discussionSort.sortBy'));
			},
		}
	}
);
