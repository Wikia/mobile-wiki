import DiscussionBaseRoute from './base';
import DiscussionContributionRouteMixin from '../../mixins/discussion-contribution-route';
import DiscussionUserModel from '../../models/discussion/user';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionModalDialogMixin from '../../mixins/discussion-modal-dialog';

export default DiscussionBaseRoute.extend(
	DiscussionContributionRouteMixin,
	DiscussionModerationRouteMixin,
	DiscussionModalDialogMixin,
	{
		userId: null,

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
