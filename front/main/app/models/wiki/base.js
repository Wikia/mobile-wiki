import Ember from 'ember';
import MediaModel from '../media';
import {normalizeToWhitespace} from 'common/utils/string';

const {Object, get} = Ember,
	BaseModel = Object.extend({
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
	 * @param {CategoryModel} model
	 * @param {Object} pageData
	 * @returns {void}
	 */
	setData(model, pageData) {
		const exception = pageData.exception,
			data = pageData.data,
			prefix = `${Mercury.wiki.namespaces[get(data, 'ns')]}:`;

		let pageProperties, article;

		if (exception) {
			pageProperties = {
				displayTitle: normalizeToWhitespace(model.title),
				exception
			};
		} else if (data) {
			// This data should always be set - no matter if file has an article or not
			pageProperties = {
				articleType: get(data, 'articleType'),
				description: get(data, 'details.description'),
				title: get(data, 'details.title'),
				id: get(data, 'details.id'),
				ns: get(data, 'ns'),
				url: get(data, 'details.url'),
			};

			// Article related Data - if Article exists
			if (data.article) {
				article = data.article;

				pageProperties = $.extend(pageProperties, {
					displayTitle: get(data, 'article.displayTitle'),
					user: get(data, 'details.revision.user_id')
				});

				if (article.content.length > 0) {
					pageProperties = $.extend(pageProperties, {
						content: article.content,
						mediaUsers: article.users,
						media: MediaModel.create({
							media: article.media
						}),
						categories: article.categories,
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
