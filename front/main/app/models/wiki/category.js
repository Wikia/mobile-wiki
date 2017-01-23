import Ember from 'ember';
import BaseModel from './base';
import {normalizeToWhitespace} from 'common/utils/string';
import request from 'ember-ajax/request';

const {get} = Ember,
	CategoryModel = BaseModel.extend({
		hasArticle: false,
		sections: null,

		/**
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
				hasArticle: get(data, 'article.content.length') > 0,
				sections: get(data, 'nsSpecificContent.members.sections')
			};
		}

		model.setProperties(pageProperties);
	},

	/**
	 * Get url for batch of category members for given index.
	 * Index represents the letter members start from.
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
