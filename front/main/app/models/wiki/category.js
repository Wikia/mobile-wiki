import Ember from 'ember';
import BaseModel from './base';
import request from 'ember-ajax/request';

const {get} = Ember,
	CategoryModel = BaseModel.extend({
		hasArticle: false,
		categoryMembersGrouped: null,
		nextPage: null,
		pages: null,
		prevPage: null,
		// TODO Remove after XW-2583 is released
		sections: null,
		trendingArticles: null,

		/**
		 * TODO Remove after XW-2583 is released
		 * @param {number} index
		 * @param {number} batchToLoad
		 * @returns {JQueryDeferred|JQueryPromise<T>}
		 */
		loadMore(index, batchToLoad) {
			const url = CategoryModel.getUrlBatchContent(this.get('title'), index, batchToLoad);

			return request(url)
				.then((pageData) => {
					const sectionIndex = `sections.${index}`;

					this.setProperties({
						[`${sectionIndex}.items`]: pageData.itemsBatch,
						[`${sectionIndex}.hasPrev`]: batchToLoad - 1 > 0,
						[`${sectionIndex}.hasNext`]: Math.ceil(this.get(`${sectionIndex}.total`) /
							this.get(`${sectionIndex}.batchSize`)) > batchToLoad,
						[`${sectionIndex}.prevBatch`]: batchToLoad - 1,
						[`${sectionIndex}.nextBatch`]: batchToLoad + 1
					});

					return this;
				});
		},

		/**
		 * @param {number} page
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(page) {
			const url = M.buildUrl({
				path: '/wikia.php',
				query: {
					controller: 'MercuryApi',
					method: 'getCategoryMembers',
					title: this.get('title'),
					categoryMembersPage: page,
					format: 'json'
				}
			});

			return request(url)
				.then((response) => {
					if (response.data.membersGrouped) {
						this.setProperties({
							categoryMembersGrouped: response.data.membersGrouped,
							nextPage: response.data.nextPage,
							nextPageUrl: response.data.nextPageUrl,
							prevPage: response.data.prevPage,
							prevPageUrl: response.data.prevPageUrl
						});
					}
				});
		}
	});

CategoryModel.reopenClass({
	/**
	 * @param {Model} model
	 * @param {Object} exception
	 * @param {Object} data
	 * @returns {void}
	 */
	setData(model, {exception, data}) {
		this._super(...arguments);

		let pageProperties;

		if (!exception && data) {
			// Category Basic Data
			// This data should always be set - no matter if category has an article or not
			pageProperties = {
				categoryMembersGrouped: get(data, 'nsSpecificContent.membersGrouped'),
				nextPage: get(data, 'nsSpecificContent.nextPage'),
				nextPageUrl: get(data, 'nsSpecificContent.nextPageUrl'),
				prevPage: get(data, 'nsSpecificContent.prevPage'),
				prevPageUrl: get(data, 'nsSpecificContent.prevPageUrl'),
				// TODO Remove after XW-2583 is released
				sections: get(data, 'nsSpecificContent.members.sections'),
				trendingArticles: get(data, 'nsSpecificContent.trendingArticles')
			};
		}

		model.setProperties(pageProperties);
	},

	/**
	 * Get url for batch of category members for given index.
	 * Index represents the letter members start from.
	 * TODO Remove after XW-2583 is released
	 *
	 * @param {string} categoryName
	 * @param {string} index
	 * @param {number} batch
	 * @returns {string}
	 */
	getUrlBatchContent(categoryName, index, batch) {
		const query = {
			controller: 'WikiaMobile',
			method: 'getCategoryBatch',
			batch,
			category: categoryName,
			format: 'json',
			index
		};

		return M.buildUrl({
			path: '/wikia.php',
			query
		});
	}
});

export default CategoryModel;
