import Ember from 'ember';
import MediaModel from '../media';
import {normalizeToWhitespace} from 'common/utils/string';


/**
 * Get url for batch of category members for given index.
 * Index represents the letter members start from.
 *
 * @param {String} categoryName
 * @param {String} index
 * @param {Number} batch
 * @returns {string}
 */
function getUrlBatchContent(categoryName, index, batch) {
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

const CategoryModel = Ember.Object.extend({
	collections: null,
	basePath: null,
	categories: [],
	displayTitle: null,
	comments: 0,
	description: null,
	media: [],
	mediaUsers: [],
	otherLanguages: [],
	title: null,
	url: null,
	user: null,
	users: [],
	wiki: null,
	name: null,
	hasArticle: false,

	loadMore(index, batchToLoad) {
		const url = getUrlBatchContent(this.get('name'), index, batchToLoad);

		return Ember.$.ajax({
			url,
			dataType: 'json',
			method: 'get',
		}).then((pageData) => {
			this.set(
				`collections.${index}.items`,
				pageData.itemsBatch
			);
			this.set(
				`collections.${index}.hasPrev`,
				batchToLoad - 1 > 0
			);
			this.set(
				`collections.${index}.hasNext`,
				Math.ceil(this.get(`collections.${index}.total`) /
					this.get(`collections.${index}.batchSize`)) > batchToLoad
			);
			this.set(
				`collections.${index}.prevBatch`,
				batchToLoad - 1
			);

			return this;
		});
	}
});

CategoryModel.reopenClass({
	setCategory(model, pageData) {
		const exception = pageData.exception,
			data = pageData.data;

		let pageProperties = {},
			details,
			article;

		pageProperties.name = Ember.get(data, 'details.title');

		if (exception) {
			pageProperties = {
				displayTitle: normalizeToWhitespace(model.title),
				exception
			};
		} else if (data) {
			if (data.details) {
				details = data.details;
			}

			if (data.article) {
				article = data.article;

				if (article.content.length > 0) {
					pageProperties = $.extend(pageProperties, {
						content: article.content,
						displayTitle: article.displayTitle,
						mediaUsers: article.users,
						type: article.type,
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

			pageProperties.collections = Ember.get(data, 'nsData.members.collections');

			if (data.relatedPages) {
				/**
				 * Code to combat a bug observed on the Karen Traviss page on the Star Wars wiki, where there
				 * are no relatedPages for some reason. Moving forward it would be good for the Wikia API
				 * to handle this and never return malformed structures.
				 */
				pageProperties.relatedPages = data.relatedPages;
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

			if (data.topContributors) {
				// Same issue: the response to the ajax should always be valid and not undefined
				pageProperties.topContributors = data.topContributors;
			}

			// @todo this will be cleaned up in XW-1053
			pageProperties.articleType = pageProperties.type || data.articleType;
		}

		model.setProperties(pageProperties);
	}
});

export default CategoryModel;
