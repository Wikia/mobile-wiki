import DiscussionBaseRoute from './base';
import DiscussionContributionRouteMixin from '../../mixins/discussion-contribution-route';
import DiscussionUserModel from '../../models/discussion/user';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionModalDialogMixin from '../../mixins/discussion-modal-dialog';
import DiscussionForumActionsRouteMixin from '../../mixins/discussion-forum-actions-route';

export default DiscussionBaseRoute.extend(
	DiscussionContributionRouteMixin,
	DiscussionModerationRouteMixin,
	DiscussionModalDialogMixin,
	DiscussionForumActionsRouteMixin,
	{
		userId: null,

		beforeModel(transition) {
			const page = transition.queryParams.page;

			if (!this.isProperPageParam(page)) {
				transition.queryParams.page = 1;
				this.refresh();
			}
		},

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			const indexModel = this.modelFor('discussion');

			this.set('userId', params.userId);

			return Ember.RSVP.hash({
				current: DiscussionUserModel.find(Mercury.wiki.id, params.userId, params.page),
				index: indexModel
			});
		},

		afterModel(model, transition) {
			this._super(...arguments);

			this.goToFirstPageIfNoPosts(model, transition.queryParams);
		},

		actions: {
			/**
			 * @param {number} pageNum
			 * @returns {void}
			 */
			loadPage(pageNum) {
				this.modelFor(this.get('routeName')).current.loadPage(pageNum);
			}
		}
	}
);
