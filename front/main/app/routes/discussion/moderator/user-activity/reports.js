import Ember from 'ember';
import DiscussionBaseRoute from '../../base';
import DiscussionUserActivityReportsModel from '../../../../models/discussion/moderator/user-activity-reports';

const {inject} = Ember;

export default DiscussionBaseRoute.extend(
	{
		currentUser: inject.service(),

		/**
		 * @param {object} params
		 * @returns {*}
		 */
		model(params) {
			const discussionModel = this.modelFor('discussion'),
				parentParams = this.paramsFor('discussion.moderator.user-activity');

			return Ember.RSVP.hash({
				current: DiscussionUserActivityReportsModel.find(Mercury.wiki.id, parentParams.days),
				index: discussionModel
			});
		},
	}
);
