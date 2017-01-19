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
			const discussionModel = this.modelFor('discussion'),
				parentParams = this.paramsFor('discussion.moderator.user-activity');

			return Ember.RSVP.hash({
				current: DiscussionUserActivityPostsModel.find(Mercury.wiki.id, parentParams.days),
				index: discussionModel
			});
		},
	}
);
