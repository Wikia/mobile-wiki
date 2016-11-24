import Ember from 'ember';
import DiscussionBaseRoute from '../../base';
import DiscussionUserActivityPostsModel from '../../../../models/discussion/moderator/user-activity-posts';

const {inject} = Ember;

export default DiscussionBaseRoute.extend(
	{
		currentUser: Ember.inject.service(),

		beforeModel() {

		},

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			const discussionModel = this.modelFor('discussion');

			return Ember.RSVP.hash({
				current: DiscussionUserActivityPostsModel.find(Mercury.wiki.id, this.get('currentUser').get('userModel')),
				index: discussionModel
			});
		},
	}
);
