import Ember from 'ember';

import DiscussionCategory from './domain/category';
import request from 'ember-ajax/request';

const DiscussionCategoriesModel = Ember.Object.extend({
	categories: new Ember.A(),
	data: null,
	wikiId: null,

	renamingErrorsMap: {
		'400': 'main.rename-category-length-error',
		'401': 'main.rename-category-auth-error',
		'403': 'main.rename-category-permissions-error',
		'404': 'main.rename-category-general-error',
	},

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
		});
	},

	getRenamingErrorMessage(err) {
		const statusCode = Ember.getWithDefault(err, 'errors.0.status', '404'),
			renamingErrorsMap = this.get('renamingErrorsMap'),
			message = Ember.getWithDefault(renamingErrorsMap, statusCode, renamingErrorsMap['404']);

		return i18n.t(message, {ns: 'discussion'});
	},

	renameCategory(category) {
		category.set('error', null);

		return request(M.getDiscussionServiceUrl(`/${this.get('wikiId')}/forums/${category.id}`), {
			data: JSON.stringify({
				name: category.get('displayedName'),
			}),
			method: 'POST',
		}).then((categoryData) => {
			const categories = this.get('categories'),
				updatedCategory = DiscussionCategory.create(categoryData),
				oldCategoryIndex = categories
					.indexOf(categories.find((cat) => cat.get('name') === category.get('name')));

			if (oldCategoryIndex !== -1) {
				categories.replace(oldCategoryIndex, 1, updatedCategory);
			}
		}).catch((err) => {
			category.set('error', this.getRenamingErrorMessage(err));

			//We need to rethrow here to trigger catch() on a batch promise
			throw new Error(err);
		});
	},

	updateCategories(categories) {
		const promisesList = categories.rejectBy('id').map((category) => {
			return this.addCategory(category.get('name'));
		});

		promisesList.pushObjects(
			categories.filter((category) => {
				return category.get('displayedName') !== category.get('name');
			}).map((category) => {
				return this.renameCategory(category);
			})
		);

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
