import Ember from 'ember';
import MediaModel from '../media';
import {normalizeToWhitespace} from 'common/utils/string';

const {Object, get, $, isArray} = Ember,
	keys = window.Object.keys,
	CategoryModel = Object.extend({
		basePath: null,
		categories: null,
		description: null,
		displayTitle: null,
		hasArticle: false,
		id: null,
		media: null,
		mediaUsers: null,
		name: null,
		ns: null,
		otherLanguages: null,
		sections: null,
		title: null,
		url: null,
		user: null,
		users: null,
		wiki: null,

		init() {
			this._super(...arguments);
			this.categories = [];
			this.media = [];
			this.mediaUsers = [];
			this.otherLanguages = [];
			this.users = [];
		},

		loadMore(index, batchToLoad) {
			const url = CategoryModel.getUrlBatchContent(this.get('name'), index, batchToLoad);

			return $.getJSON(url)
				.done((pageData) => {
					const sectionIndex = `sections.${index}`;

					this.setProperties({
						[`${sectionIndex}.items`]: CategoryModel.addTitles(pageData.itemsBatch),
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

		let pageProperties = {},
			details,
			article;

		if (exception) {
			pageProperties = {
				displayTitle: normalizeToWhitespace(model.title),
				exception
			};
		} else if (data) {
			if (data.details) {
				details = data.details;

				pageProperties = {
					ns: details.ns,
					id: details.id,
					user: details.revision.user_id,
					url: details.url,
					description: details.description
				};
			}

			pageProperties.name = get(data, 'nsSpecificContent.name');
			pageProperties.displayTitle = get(data, 'nsSpecificContent.name');

			if (data.article) {
				article = data.article;

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
				} else {
					pageProperties.hasArticle = false;
				}
			}

			pageProperties.sections = CategoryModel.addTitles(get(data, 'nsSpecificContent.members.sections'));

			if (data.otherLanguages) {
				pageProperties.otherLanguages = data.otherLanguages;
			}

			if (data.adsContext) {
				pageProperties.adsContext = data.adsContext;

				if (pageProperties.adsContext.targeting) {
					pageProperties.adsContext.targeting.mercuryPageCategories = pageProperties.categories;
				}
			}

			pageProperties.articleType = data.articleType;
		}

		model.setProperties(pageProperties);
	},

	/**
	 * Get url for batch of category members for given index.
	 * Index represents the letter members start from.
	 *
	 * @param {String} categoryName
	 * @param {String} index
	 * @param {Number} batch
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
	},

	/**
	 * add title to sectionItem based on url eg. /wiki/Namespace:Title -> Namespace:Title
	 *
	 * @param  {Array.<{url: string, name: string}>} sectionItems - array of items
	 * @returns {Array.<{url: string, name: string, title: string}>}
	 */
	addTitlesToSection(sectionItems) {
		return sectionItems.map((item) => {
			item.title = item.url.replace('/wiki/', '');

			return item;
		});
	},

	/**
	 * Adds titles to section
	 * When used in loadMore context it has access only to one batch array
	 * when used in setCategory context it has to iterate over object that contains
	 * all batches for a given category
	 *
	 * TODO - this should be done server side XW-1165
	 *
	 * @param {Object|Array} sections
	 * @returns {Object|Array}
	 */
	addTitles(sections) {
		if (isArray(sections)) {
			sections = CategoryModel.addTitlesToSection(sections);
		} else {
			keys(sections).forEach((sectionKey) => {
				const sectionItem = sections[sectionKey];

				sectionItem.items = CategoryModel.addTitlesToSection(sectionItem.items);
			});
		}

		return sections;
	}
});

export default CategoryModel;
