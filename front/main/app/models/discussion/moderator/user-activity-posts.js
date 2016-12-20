import Ember from 'ember';
import DiscussionUserActivityBaseModel from './user-activity-base';
import DiscussionUserActivityPosts from '../domain/user-activity-posts';

const DiscussionUserActivityPostsModel = DiscussionUserActivityBaseModel.extend(
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
		 * @param {number} days
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, days) {
			const userActivityPostsInstance = DiscussionUserActivityPostsModel.create({
					wikiId,
				}),
				path = `/${wikiId}/leaderboard/posts`;

			return userActivityPostsInstance.fetchDataFromTheService(path, days);
		},
	}
);

export default DiscussionUserActivityPostsModel;
