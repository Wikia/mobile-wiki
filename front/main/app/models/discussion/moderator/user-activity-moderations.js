import Ember from 'ember';
import DiscussionUserActivityBaseModel from './user-activity-base';
import DiscussionUserActivityModerations from '../domain/user-activity-moderations';

const DiscussionUserActivityModerationsModel = DiscussionUserActivityBaseModel.extend(
	{
		setNormalizedData(data) {
			this.set('data', DiscussionUserActivityModerations.create(data));
		},
	}
);

DiscussionUserActivityModerationsModel.reopenClass(
	{
		/**
		 * @param {number} wikiId
		 * @param {number} days
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, days) {
			const userActivityModerationsInstance = DiscussionUserActivityModerationsModel.create({
				wikiId,
			}),
				path = `/${wikiId}/leaderboard/moderator`;

			return userActivityModerationsInstance.fetchDataFromTheService(path, days);
		},
	}
);

export default DiscussionUserActivityModerationsModel;
