import Ember from 'ember';

import DiscussionCategory from './discussion/domain/category';
import request from 'ember-ajax/request';

const DiscussionModel = Ember.Object.extend({
	data: null,
	wikiId: null,

	selectedCategoryIds: Ember.computed('data.@each.selected', function () {
		return this.getSelectedCategoryIds();
	}),

	init() {
		this.set('data', new Ember.A());
		this._super();
	},

	/**
	 * @returns {Ember.Array}
	 */
	getSelectedCategoryIds() {
		return this.get('data').filterBy('selected', true).mapBy('id');
	},

	/**
	 * @param {Object} apiData
	 *
	 * @returns {void}
	 */
	setNormalizedData(apiData) {
		const categories = this.get('data');

		Ember.get(apiData, '_embedded.doc:forum').forEach((categoryData) => {
			categories.pushObject(DiscussionCategory.create(categoryData));
		});

		this.set('data', categories.sortBy('displayOrder'));
	},

	setSelectedCategories(selectedCategoryIds) {
		this.get('data').forEach((category) => {
			if (selectedCategoryIds.indexOf(category.get('id')) !== -1) {
				category.set('selected', true);
			} else {
				category.set('selected', false);
			}
		});
	},
});

DiscussionModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @returns {Ember.RSVP.Promise}
	 */
	getCategories(wikiId) {
		return new Ember.RSVP.Promise((resolve) => {
			const discussionInstance = DiscussionModel.create({
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

export default DiscussionModel;
