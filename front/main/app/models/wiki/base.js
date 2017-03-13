import Ember from 'ember';
import MediaModel from '../media';
import {normalizeToWhitespace} from '../../utils/string';
import M from '../../mmm';

const {Object: EmberObject, get} = Ember,
	BaseModel = EmberObject.extend({
		adsContext: null,
		basePath: null,
		categories: [],
		description: '',
		displayTitle: null,
		htmlTitle: '',
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
		let pageProperties, article;

		if (exception) {
			const normalizedTitle = normalizeToWhitespace(model.title);

			pageProperties = {
				displayTitle: normalizedTitle,
				htmlTitle: normalizedTitle,
				exception
			};
		} else if (data) {
			// This data should always be set
			pageProperties = {
				articleType: get(data, 'articleType'),
				categories: get(data, 'categories'),
				description: get(data, 'details.description'),
				hasArticle: get(data, 'article.content.length') > 0,
				htmlTitle: get(data, 'htmlTitle'),
				id: get(data, 'details.id'),
				ns: get(data, 'ns'),
				title: get(data, 'details.title'),
				url: get(data, 'details.url'),
			};

			// Article related Data - if Article exists
			if (data.article) {
				article = data.article;

				Object.assign(pageProperties, {
					displayTitle: get(data, 'article.displayTitle'),
					user: get(data, 'details.revision.user_id')
				});

				if (article.content && article.content.length > 0) {
					Object.assign(pageProperties, {
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
		}

		model.setProperties(pageProperties);
	},
});

export default BaseModel;
