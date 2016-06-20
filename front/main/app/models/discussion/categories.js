import Ember from 'ember';

import DiscussionCategory from './domain/category';
import request from 'ember-ajax/request';

const DiscussionCategoriesModel = Ember.Object.extend({
	categories: new Ember.A(),
	data: null,
	wikiId: null,

	selectedCategoryIds: Ember.computed('categories.@each.selected', function () {
		return this.getSelectedCategoryIds();
	}),

	/**
	 * @returns {Ember.Array}
	 */
	getSelectedCategoryIds() {
		return this.get('categories').filterBy('selected', true).mapBy('id');
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
			} else {
				category.set('selected', false);
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
	},

	updateCategories(categories) {
		const promisesList = [];

		categories.filterBy('category.id', undefined).forEach((category) => {
			promisesList.push(this.addCategory(category.get('category.name')));
		});

		return Ember.RSVP.Promise.all(promisesList);
	}
});

DiscussionCategoriesModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @returns {Ember.RSVP.Promise}
	 */
	getCategories(wikiId) {
		return new Ember.RSVP.Promise((resolve) => {
			const discussionInstance = DiscussionCategoriesModel.create({
				wikiId
			});

			request(M.getDiscussionServiceUrl(`/${wikiId}/forums`)).then((data) => {
				discussionInstance.setNormalizedData(data);

				resolve(discussionInstance);
			}).catch(() => {
				// Categories fail silently - you can still view the default category
				resolve(discussionInstance);
			});
		});
	}
});

export default DiscussionCategoriesModel;
