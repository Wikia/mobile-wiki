import Ember from 'ember';
import MediaModel from '../media';
import {normalizeToWhitespace} from 'common/utils/string';
import request from 'ember-ajax/request';

const {Object, get} = Ember,
	FileModel = Object.extend({
		adsContext: null,
		// set when creating model instance
		basePath: '',
		categories: null,
		description: '',
		displayTitle: '',
		documentTitle: '',
		hasArticle: false,
		id: null,
		media: null,
		mediaUsers: null,
		name: '',
		ns: null,
		otherLanguages: null,
		// set when creating model instance
		title: '',
		url: '',
		heroImage: null,
		fileUsageList: null,
		fileUsageListSeeMoreUrl: null,
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
			this.fileUsageList = [];
		}
	});

FileModel.reopenClass({
	/**
	 * @param {CategoryModel} model
	 * @param {Object} pageData
	 * @returns {void}
	 */
	setFile(model, pageData) {
		// TODO extract code that is shared between file, category and article
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
				articleType: get(data, 'file'),
				description: get(data, 'details.description'),
				title: get(data, 'details.title'),
				id: get(data, 'details.id'),
				name: get(data, 'details.title'),
				ns: get(data, 'ns'),
				fileUsageList: get(data, 'nsSpecificContent.fileUsageList').map(this.prepareFileUsageItem),
				fileUsageListSeeMoreUrl: get(data, 'nsSpecificContent.fileUsageListSeeMoreUrl'),
				url: get(data, 'details.url'),
				heroImage: {
					url: get(data, 'details.thumbnail'),
					title: get(data, 'details.title'),
					width: get(data, 'details.original_dimensions.width'),
					height: get(data, 'details.original_dimensions.height'),
					itemContext: 'file',
					type: get(data, 'details.type'),
					shouldBeLoaded: true
				}
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

			// Display title is used in header
			pageProperties.displayTitle = pageProperties.displayTitle || pageProperties.title;
			pageProperties.documentTitle = prefix + pageProperties.displayTitle;
		}

		model.setProperties(pageProperties);
	},

	prepareFileUsageItem(item) {
		return {
			title: get(item, 'titleText'),
			snippet: get(item, 'snippet'),
			prefixedTitle: get(item, 'url').replace(/^http:\/\/[^\/]+(\/wiki)?\//i, '')
		};
	}
});

export default FileModel;
