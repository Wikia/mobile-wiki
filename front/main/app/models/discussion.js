import Ember from 'ember';

import DiscussionCategory from './discussion/domain/category';
import request from 'ember-ajax/request';

const DiscussionModel = Ember.Object.extend({
	categories: [],
	data: null,
	wikiId: null,

	/**
	 * @param {object} apiData
	 *
	 * @returns {void}
	 */
	setNormalizedData(apiData) {
		const categories = this.get('categories');

		Ember.get(apiData, '_embedded.doc:forum').forEach((categoryData) => {
			categories.pushObject(DiscussionCategory.create(categoryData));
		});

		this.set('categories', categories.sortBy('displayOrder'));
	},

	setSelectedCategories(selectedCategories) {
		this.get('categories').forEach((category) => {
			if (selectedCategories.indexOf(category.get('id')) !== -1) {
				category.set('selected', true);
			}
		});
	}
});

DiscussionModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {string} [sortBy='trending']
	 * @returns {Ember.RSVP.Promise}
	 */
	getCategories(wikiId, sortBy) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const discussionInstance = DiscussionModel.create({
					wikiId
				});

			request(M.getDiscussionServiceUrl(`/${wikiId}/forums`)).then((data) => {
				discussionInstance.setNormalizedData(data);

				resolve(discussionInstance);
			}).catch((err) => {
				// TODO handle errors
				reject(discussionInstance);
			});
		});
	}
});

export default DiscussionModel;
