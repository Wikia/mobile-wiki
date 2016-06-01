import Ember from 'ember';

import DiscussionCategory from './discussion/domain/category';
import request from 'ember-ajax/request';

const DiscussionModel = Ember.Object.extend({
	categories: [],
	data: null,
	wikiId: null,

	selectedCategoryIds: Ember.computed('categories.@each.selected', function () {
		return this.getCategoryIds(this.get('categories'));
	}),

	getCategoryIds(categories) {
		return categories.filterBy('selected', true).mapBy('id');
	},

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

	setSelectedCategories(selectedCategoryIds) {
		this.get('categories').forEach((category) => {
			if (selectedCategoryIds.indexOf(category.get('id')) !== -1) {
				category.set('selected', true);
			}
		});
	},

	addCategory(categoryName) {
		return request(M.getDiscussionServiceUrl(`/${this.get('wikiId')}/forums`), {
			data: JSON.stringify({
				name: categoryName,
				// TODO get rid of parentId and siteId when SOC-2576 is done
				parentId: 1,
				siteId: this.get('wikiId')
			}),
			method: 'POST',
		}).then((categoryData) => {
			const categories = this.get('categories');

			categories.pushObject(DiscussionCategory.create(categoryData));

			this.set('categories', categories.sortBy('displayOrder'));
		}).catch(() => {
			reject(this);
		});
	}
});

DiscussionModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @returns {Ember.RSVP.Promise}
	 */
	getCategories(wikiId) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const discussionInstance = DiscussionModel.create({
				wikiId
			});

			request(M.getDiscussionServiceUrl(`/${wikiId}/forums`)).then((data) => {
				discussionInstance.setNormalizedData(data);

				resolve(discussionInstance);
			}).catch(() => {
				// TODO handle errors
				reject(discussionInstance);
			});
		});
	}
});

export default DiscussionModel;
