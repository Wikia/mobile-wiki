import Ember from 'ember';
import DiscussionUserActivityBaseModel from './user-activity-base';
import DiscussionUserActivityReports from '../domain/user-activity-reports';

const DiscussionUserActivityReportsModel = DiscussionUserActivityBaseModel.extend(
	{
		setNormalizedData(data) {
			this.set('data', DiscussionUserActivityReports.create(data));
		}
	}
);

DiscussionUserActivityReportsModel.reopenClass(
	{
		/**
		 * @param {number} wikiId
		 * @param {number} days
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, days) {
			const userActivityReportsInstance = DiscussionUserActivityReportsModel.create({
					wikiId,
				}),
				path = `/${wikiId}/leaderboard/reports`;

			return userActivityReportsInstance.fetchDataFromTheService(path, days);
		},
	}
);

export default DiscussionUserActivityReportsModel;
