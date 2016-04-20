import DiscussionBaseRoute from './base';
import DiscussionRouteUpvoteMixin from '../../mixins/discussion-route-upvote';
import DiscussionUserModel from '../../models/discussion/user';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionModalDialogMixin from '../../mixins/discussion-modal-dialog';

export default DiscussionBaseRoute.extend(
	DiscussionRouteUpvoteMixin,
	DiscussionModerationRouteMixin,
	DiscussionModalDialogMixin,
	{
		userId: null,

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.Promise}
		 */
		model(params) {
			this.set('userId', params.userId);
			return DiscussionUserModel.find(Mercury.wiki.id, params.userId);
		},

		actions: {
			/**
			 * @param {number} pageNum
			 * @returns {void}
			 */
			loadPage(pageNum) {
				this.modelFor(this.get('routeName')).loadPage(pageNum);
			}
		}
	}
);
