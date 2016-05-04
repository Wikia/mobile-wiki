import Ember from 'ember';
import MediaModel from '../media';
import {normalizeToWhitespace} from 'common/utils/string';
import request from 'ember-ajax/request';

/**
 * @typedef {Object} ArticleModelUrlParams
 * @property {string} title
 * @property {string} [redirect]
 */

/**
 * @typedef {Object} ArticleModelFindParams
 * @property {string} basePath
 * @property {string} wiki
 * @property {string} title
 * @property {string} [redirect]
 */

const ArticleModel = Ember.Object.extend({
	content: null,
	basePath: null,
	categories: [],
	displayTitle: null,
	documentTitle: '',
	comments: 0,
	description: '',
	isMainPage: false,
	mainPageData: null,
	media: [],
	mediaUsers: [],
	otherLanguages: [],
	title: null,
	url: null,
	user: null,
	users: [],
	wiki: null,
	isCuratedMainPage: false
});

ArticleModel.reopenClass({
	/**
	 * @param {ArticleModelUrlParams} params
	 * @returns {string}
	 */
	url(params) {
		let redirect = '';

		if (params.redirect) {
			redirect += `?redirect=${encodeURIComponent(params.redirect)}`;
		}

		return `${M.prop('apiBase')}/article/${params.title}${redirect}`;
	},

	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	getArticleRandomTitle() {
		const url = M.buildUrl({
			path: '/api.php',
			query: {
				action: 'query',
				generator: 'random',
				grnnamespace: 0,
				format: 'json'
			}
		});

		return request(url, {
			cache: false,
		}).then((data) => {
			if (data.query && data.query.pages) {
				const articleId = Object.keys(data.query.pages)[0],
					pageData = data.query.pages[articleId];

				if (pageData.title) {
					return pageData.title;
				}
			}

			throw new Error({
				message: 'Data from server misshaped',
				data
			});
		});
	},

	/**
	 * @returns {*}
	 */
	getPreloadedData() {
		const article = Mercury.article;

		M.prop('articleContentPreloadedInDOM', false);

		if (article.data && article.data.article) {
			// On the first page load the article content is available only in HTML
			article.data.article.content = $('#preloadedContent').html();
		}

		Mercury.article = null;

		return article;
	},

	/**
	 * @param {ArticleModel} model
	 * @param {*} [source=this.getPreloadedData()]
	 * @returns {void}
	 */
	setArticle(model, source = this.getPreloadedData()) {
		const exception = source.exception,
			data = source.data;

		let articleProperties = {},
			details,
			article;

		if (exception) {
			articleProperties = {
				displayTitle: normalizeToWhitespace(model.title),
				exception
			};
		} else if (data) {
			if (data.details) {
				details = data.details;

				articleProperties = {
					ns: details.ns,
					title: details.title,
					comments: details.comments,
					id: details.id,
					user: details.revision.user_id,
					url: details.url,
					description: details.description
				};
			}

			if (data.article) {
				article = data.article;

				articleProperties = $.extend(articleProperties, {
					content: article.content,
					displayTitle: article.displayTitle,
					mediaUsers: article.users,
					type: article.type,
					media: MediaModel.create({
						media: article.media
					}),
					categories: article.categories,
					redirectEmptyTarget: data.redirectEmptyTarget || false
				});
			}

			if (data.relatedPages) {
				/**
				 * Code to combat a bug observed on the Karen Traviss page on the Star Wars wiki, where there
				 * are no relatedPages for some reason. Moving forward it would be good for the Wikia API
				 * to handle this and never return malformed structures.
				 */
				articleProperties.relatedPages = data.relatedPages;
			}

			if (data.otherLanguages) {
				articleProperties.otherLanguages = data.otherLanguages;
			}

			if (data.adsContext) {
				articleProperties.adsContext = data.adsContext;

				if (articleProperties.adsContext.targeting) {
					articleProperties.adsContext.targeting.mercuryPageCategories = articleProperties.categories;
				}
			}

			if (data.topContributors) {
				// Same issue: the response to the ajax should always be valid and not undefined
				articleProperties.topContributors = data.topContributors;
			}

			articleProperties.isMainPage = data.isMainPage || false;

			if (data.mainPageData) {
				articleProperties.mainPageData = data.mainPageData;
				articleProperties.isCuratedMainPage = true;
			}

			// @todo this will be cleaned up in XW-1053
			articleProperties.articleType = articleProperties.type || data.articleType;

			/**
			 * For main pages, title is wiki name, so we don't want to have duplicated text in documentTitle
			 */
			articleProperties.documentTitle = articleProperties.isMainPage ?
					'' :
					articleProperties.documentTitle = articleProperties.displayTitle || articleProperties.title;
		}

		model.setProperties(articleProperties);
	}
});

export default ArticleModel;
