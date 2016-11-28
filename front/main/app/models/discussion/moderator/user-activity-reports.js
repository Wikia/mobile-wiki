import Ember from 'ember';
import DiscussionBaseModel from '../base';
import DiscussionUserActivityReports from '../domain/user-activity-reports'
import request from 'ember-ajax/request';

const DiscussionUserActivityReportsModel = DiscussionBaseModel.extend(
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
		 * @param {array|string} [categories=[]]
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, days) {
			const userActivityReportsInstance = DiscussionUserActivityReportsModel.create({
					wikiId,
				});

			return new Ember.RSVP.Promise((resolve, reject) => {
				return request(M.getDiscussionServiceUrl(`/${wikiId}/leaderboard/reports`), {
					data: {
						days
					}
				}).then((data) => {
					userActivityReportsInstance.setNormalizedData(data);
					resolve(userActivityReportsInstance);
				}).catch((err) => {
					userActivityReportsInstance.setErrorProperty(err);

					reject(userActivityReportsInstance);
				});
			});
		},
	}
);

export default DiscussionUserActivityReportsModel;
