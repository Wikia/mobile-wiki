import Ember from 'ember';
import DiscussionBaseRoute from '../../base';
import DiscussionUserActivityPostsModel from '../../../../models/discussion/moderator/user-activity-posts';

const {inject} = Ember;

export default DiscussionBaseRoute.extend(
	{
		currentUser: Ember.inject.service(),

		beforeModel() {

		},

		/**
		 * @param {object} params
		 * @returns {*}
		 */
		model(params) {
			// fixme mock data
			var result = [];
			for(let i = 0; i < 50; i++) {
				result.push({
					author: {
						badgePermission: '',
						name: 'Kttest2 very long username',
						avatarUrl: null
					},
					reported: Math.round(Math.random()*1000),
					notProcessed: Math.round(Math.random()*1000),
					validated: Math.round(Math.random()*1000),
					deleted: Math.round(Math.random()*1000),
				})
			}

			return result;
		},
	}
);
