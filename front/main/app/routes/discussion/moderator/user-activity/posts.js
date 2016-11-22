import Ember from 'ember';
import DiscussionBaseRoute from '../../base';

const {inject} = Ember;

export default DiscussionBaseRoute.extend(
	{
		currentUser: Ember.inject.service(),

		beforeModel() {
		},

		/**
		 * @param {object} params
		 * @returns {Ember.RSVP.hash}
		 */
		model(params) {
			if (!this.get('currentUser.isAuthenticated')) {
				throw new Error('No rights');
			}
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
