import DiscussionBaseRoute from './base';
import DiscussionRouteUpvoteMixin from '../../mixins/discussion-route-upvote';
import DiscussionUserModel from '../../models/discussion-user';
import DiscussionLayoutMixin from '../../mixins/discussion-layout';
import DiscussionDeleteRouteMixin from '../../mixins/discussion-delete-route';

export default DiscussionBaseRoute.extend(
	DiscussionLayoutMixin,
	DiscussionRouteUpvoteMixin,
	DiscussionDeleteRouteMixin, {

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
				this.modelFor(this.routeName).loadPage(pageNum);
			}
		}
	}
);
