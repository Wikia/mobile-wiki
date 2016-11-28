import Ember from 'ember';
import DiscussionBaseModel from '../base';
import DiscussionUserActivityPosts from '../domain/user-activity-posts'
import request from 'ember-ajax/request';

const DiscussionUserActivityPostsModel = DiscussionBaseModel.extend(
	{
		setNormalizedData(data) {
			this.set('data', DiscussionUserActivityPosts.create(data));
		}
	}
);

DiscussionUserActivityPostsModel.reopenClass(
	{
		/**
		 * @param {number} wikiId
		 * @param {array|string} [categories=[]]
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, days) {
			const userActivityPostsInstance = DiscussionUserActivityPostsModel.create({
					wikiId,
				}),
				requestUrl = M.getDiscussionServiceUrl(`/${wikiId}/threads`),
				requestData = {
					viewableOnly: false
				};

			return new Ember.RSVP.Promise((resolve, reject) => {
				return request(M.getDiscussionServiceUrl(`/${wikiId}/leaderboards`), {
					data: {
						days
					}
				}).then((data) => {
					userActivityPostsInstance.setNormalizedData(data);
					resolve(userActivityPostsInstance);
				}).catch((err) => {
					userActivityPostsInstance.setErrorProperty(err);

					reject(userActivityPostsInstance);
				});
			});
		},
	}
);

export default DiscussionUserActivityPostsModel;
