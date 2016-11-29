import Ember from 'ember';
import DiscussionBaseModel from '../base';
import DiscussionUserActivityModerations from '../domain/user-activity-moderations';
import request from 'ember-ajax/request';

const DiscussionUserActivityModerationsModel = DiscussionBaseModel.extend(
	{
		setNormalizedData(data) {
			this.set('data', DiscussionUserActivityModerations.create(data));
		}
	}
);

DiscussionUserActivityModerationsModel.reopenClass(
	{
		/**
		 * @param {number} wikiId
		 * @param {array|string} [categories=[]]
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, days) {
			const userActivityModerationsInstance = DiscussionUserActivityModerationsModel.create({
				wikiId,
			});

			return new Ember.RSVP.Promise((resolve, reject) => {
				return request(M.getDiscussionServiceUrl(`/${wikiId}/leaderboard/moderator`), {
					data: {
						days
					}
				}).then((data) => {
					userActivityModerationsInstance.setNormalizedData(data);
					resolve(userActivityModerationsInstance);
				}).catch((err) => {
					userActivityModerationsInstance.setErrorProperty(err);

					reject(userActivityModerationsInstance);
				});
			});
		},
	}
);

export default DiscussionUserActivityModerationsModel;
