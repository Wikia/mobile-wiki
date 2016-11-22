import Ember from 'ember';
import DiscussionBaseRoute from './base';
import DiscussionContributionRouteMixin from '../../mixins/discussion-contribution-route';
import DiscussionForumModel from '../../models/discussion/forum';
import DiscussionModerationRouteMixin from '../../mixins/discussion-moderation-route';
import DiscussionForumActionsRouteMixin from '../../mixins/discussion-forum-actions-route';
import DiscussionModalDialogMixin from '../../mixins/discussion-modal-dialog';
import localStorageConnector from '../../utils/local-storage-connector';

const {inject} = Ember;

export default DiscussionBaseRoute.extend(
	DiscussionContributionRouteMixin,
	DiscussionModerationRouteMixin,
	DiscussionForumActionsRouteMixin,
	DiscussionModalDialogMixin,
	{

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			// const discussionModel = this.modelFor('discussion'),
			// 	catId = this.getCategoriesFromQueryString(params.catId);
			//
			// discussionModel.categories.setSelectedCategories(catId);
			//
			// return Ember.RSVP.hash({
			// 	current: DiscussionForumModel.find(Mercury.wiki.id, catId, this.get('discussionSort.sortBy'),
			// 		params.page),
			// 	index: discussionModel
			// });
		},
	}
);
