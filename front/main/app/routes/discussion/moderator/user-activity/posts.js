import Ember from 'ember';
import DiscussionBaseRoute from '../../base';
import DiscussionUserActivityPostsModel from '../../../../models/discussion/moderator/user-activity-posts';

export default DiscussionBaseRoute.extend(
	{
		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			const parentParams = this.paramsFor('discussion.moderator.user-activity');

			return Ember.RSVP.hash({
				current: DiscussionUserActivityPostsModel.find(Mercury.wiki.id, parentParams.days)
			});
		},
	}
);
