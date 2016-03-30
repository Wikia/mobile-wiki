import Ember from 'ember';
import MediaModel from '../media';
import {normalizeToWhitespace} from 'common/utils/string';

const {Object, get, $} = Ember,
	CategoryModel = Object.extend({
		adsContext: null,
		// set when creating model instance
		basePath: '',
		categories: null,
		description: '',
		displayTitle: '',
		hasArticle: false,
		id: null,
		media: null,
		mediaUsers: null,
		name: '',
		ns: null,
		otherLanguages: null,
		sections: null,
		// set when creating model instance
		title: '',
		url: '',
		user: null,
		// set when creating model instance
		wiki: null,

		/**
		 * @returns {void}
		 */
		init() {
			this._super(...arguments);
			this.categories = [];
			this.media = [];
			this.mediaUsers = [];
			this.otherLanguages = [];
		},

		/**
		 * @param {number} index
		 * @param {number} batchToLoad
		 * @returns {JQueryDeferred|JQueryPromise<T>}
		 */
		loadMore(index, batchToLoad) {
			const url = CategoryModel.getUrlBatchContent(this.get('name'), index, batchToLoad);

			return $.getJSON(url)
				.done((pageData) => {
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
	 * @param {CategoryModel} model
	 * @param {Object} pageData
	 * @returns {void}
	 */
	setCategory(model, pageData) {
		const exception = pageData.exception,
			data = pageData.data;

		let pageProperties, article;

		if (exception) {
			pageProperties = {
				displayTitle: normalizeToWhitespace(model.title),
				exception
			};
		} else if (data) {
			// Category Basic Data
			// This data should always be set - no matter if category has an article or not
			pageProperties = {
				articleType: data.articleType,
				description: get(data, 'details.description'),
				displayTitle: get(data, 'details.title'),
				documentTitle: get(data, 'details.documentTitle'),
				id: get(data, 'details.id'),
				name: get(data, 'details.title'),
				ns: data.ns,
				sections: get(data, 'nsSpecificContent.members.sections'),
				url: get(data, 'details.url')
			};

			// Article related Data - if Article exists
			if (data.article) {
				article = data.article;

				pageProperties = $.extend(pageProperties, {
					user: get(data, 'details.revision.user_id'),
				});

				if (article.content.length > 0) {
					pageProperties = $.extend(pageProperties, {
						content: article.content,
						mediaUsers: article.users,
						media: MediaModel.create({
							media: article.media
						}),
						categories: article.categories,
						redirectEmptyTarget: data.redirectEmptyTarget || false,
						hasArticle: true
					});
				}
			}

			if (data.otherLanguages) {
				pageProperties.otherLanguages = data.otherLanguages;
			}

			if (data.adsContext) {
				pageProperties.adsContext = data.adsContext;

				if (pageProperties.adsContext.targeting) {
					pageProperties.adsContext.targeting.mercuryPageCategories = pageProperties.categories;
				}
			}
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
