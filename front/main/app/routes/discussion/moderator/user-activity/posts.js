import Ember from 'ember';
import DiscussionBaseRoute from '../../base';
import DiscussionUserActivityPostsModel from '../../../../models/discussion/moderator/user-activity-posts';

const {inject} = Ember;

export default DiscussionBaseRoute.extend(
	{
		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			const discussionModel = this.modelFor('discussion');

			//fixme mock data
			const mock = Ember.Object.create({
				days: 30,
				users:[
					{
						rank: 1,
						postCount: 999,
						userInfo: {
							badgePermission: '',
							name: 'Kttest2 very long username',
							avatarUrl: null
						}
					}
				]
			});

			return Ember.RSVP.hash({
				//current: DiscussionUserActivityPostsModel.find(Mercury.wiki.id),
				index: discussionModel,
				current: Ember.Object.create({data: mock})
			});
		},
	}
);
