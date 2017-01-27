import Ember from 'ember';
import DiscussionBaseRoute from '../../base';
import DiscussionUserActivityModerationsModel from '../../../../models/discussion/moderator/user-activity-moderations';

const {inject} = Ember;

export default DiscussionBaseRoute.extend(
	{
		currentUser: inject.service(),

		/**
		 * @param {object} params
		 * @returns {*}
		 */
		model(params) {
			const parentParams = this.paramsFor('discussion.moderator.user-activity');

			return Ember.RSVP.hash({
				current: DiscussionUserActivityModerationsModel.find(Mercury.wiki.id, parentParams.days),
			});
		},
	}
);
