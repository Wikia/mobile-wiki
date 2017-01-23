import Ember from 'ember';
import MediaModel from '../media';
import {normalizeToWhitespace} from 'common/utils/string';

const {Object: EmberObject, get} = Ember,
	BaseModel = EmberObject.extend({
		adsContext: null,
		basePath: null,
		categories: [],
		description: '',
		displayTitle: null,
		documentTitle: '',
		id: null,
		media: [],
		mediaUsers: [],
		ns: null,
		redirectEmptyTarget: false,
		otherLanguages: [],
		title: null,
		url: null,
		user: null,
		wiki: null
	});

BaseModel.reopenClass({
	/**
	 * @returns {*}
	 */
	getPreloadedData() {
		const article = Mercury.article;

		M.prop('articleContentPreloadedInDOM', false, true);

		if (article.data && article.data.article) {
			// On the first page load the article content is available only in HTML
			article.data.article.content = $('#preloadedContent').html();
		}

		Mercury.article = null;

		return article;
	},

	/**
	 * @param {Model} model
	 * @param {Object} exception
	 * @param {Object} data
	 * @returns {void}
	 */
	setData(model, {exception, data}) {
		const prefix = Mercury.wiki.namespaces[get(data, 'ns')] ? `${Mercury.wiki.namespaces[get(data, 'ns')]}:` : '';

		let pageProperties, article;

		if (exception) {
			pageProperties = {
				displayTitle: normalizeToWhitespace(model.title),
				exception
			};
		} else if (data) {
			// This data should always be set
			pageProperties = {
				articleType: get(data, 'articleType'),
				description: get(data, 'details.description'),
				title: get(data, 'details.title'),
				id: get(data, 'details.id'),
				ns: get(data, 'ns'),
				url: get(data, 'details.url'),
				categories: get(data, 'categories'),
				hasArticle: get(data, 'article.content.length') > 0,
			};

			// Article related Data - if Article exists
			if (data.article) {
				article = data.article;

				pageProperties = $.extend(pageProperties, {
					displayTitle: get(data, 'article.displayTitle'),
					user: get(data, 'details.revision.user_id')
				});

				if (article.content && article.content.length > 0) {
					pageProperties = $.extend(pageProperties, {
						content: article.content,
						mediaUsers: article.users,
						media: MediaModel.create({
							media: article.media
						}),
						redirectEmptyTarget: data.redirectEmptyTarget,
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

			// Display title is used in header
			pageProperties.displayTitle = pageProperties.displayTitle || pageProperties.title;
			pageProperties.documentTitle = prefix + pageProperties.displayTitle;
		}

		model.setProperties(pageProperties);
	},
});

export default BaseModel;
