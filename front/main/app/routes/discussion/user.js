import DiscussionBaseRoute from './base';
import DiscussionUserModel from '../../models/discussion-user';
import DiscussionLayoutMixin from '../../mixins/discussion-layout';

export default DiscussionBaseRoute.extend(DiscussionLayoutMixin, {
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
			this.modelFor('discussion.user').loadPage(pageNum);
		},

		create() {
		},
	}
});
