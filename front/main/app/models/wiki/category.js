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
		isMercury: true,
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
	ns: null,
	id: null,

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
			this.set(
				`collections.${index}.nextBatch`,
				batchToLoad + 1
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

			pageProperties.name = Ember.get(data, 'nsData.name');
			pageProperties.displayTitle = Ember.get(data, 'nsData.name');

			if (data.article) {
				article = data.article;

				if (article.content.length > 0) {
					pageProperties = $.extend(pageProperties, {
						content: article.content,
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

			if (data.otherLanguages) {
				pageProperties.otherLanguages = data.otherLanguages;
			}

			if (data.adsContext) {
				pageProperties.adsContext = data.adsContext;

				if (pageProperties.adsContext.targeting) {
					pageProperties.adsContext.targeting.mercuryPageCategories = pageProperties.categories;
				}
			}

			// @todo this will be cleaned up in XW-1053
			pageProperties.articleType = pageProperties.type || data.articleType;
		}

		model.setProperties(pageProperties);
	}
});

export default CategoryModel;
