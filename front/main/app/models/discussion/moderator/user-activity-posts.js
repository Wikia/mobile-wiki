import Ember from 'ember';
import DiscussionBaseModel from '../base';

const DiscussionUserActivityPostsModel = DiscussionBaseModel.extend(
	{
		findPosts(wikiId) {
			return '123';
		},
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
		find(wikiId, userModel) {
			const userActivityPostsInstance = DiscussionUserActivityPostsModel.create({
					wikiId,
				}),
				requestUrl = M.getDiscussionServiceUrl(`/${wikiId}/threads`),
				requestData = {
					viewableOnly: false
				};

			return Ember.RSVP.all([
				userActivityPostsInstance.findPosts(wikiId),
				userModel
			]).then(function (data) {

			});
		},
	}
);

export default DiscussionUserActivityPostsModel;
