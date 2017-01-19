import Ember from 'ember';
import BaseModel from './base';
import {normalizeToWhitespace} from 'common/utils/string';
import request from 'ember-ajax/request';

const ArticleModel = BaseModel.extend({
	content: null,
	comments: 0,
	isCuratedMainPage: false,
	isMainPage: false,
	mainPageData: null,
	user: null
});

ArticleModel.reopenClass({
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

		M.prop('articleContentPreloadedInDOM', false, true);

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
	setData(model, source = this.getPreloadedData()) {
		this._super(...arguments);

		const exception = source.exception,
			data = source.data;

		let articleProperties = {},
			details;

		if (!exception && data) {
			if (data.details) {
				details = data.details;

				articleProperties = {
					comments: details.comments,
					user: details.revision.user_id
				};
			}

			if (data.article) {
				articleProperties.content = data.article.content;
			}

			if (data.relatedPages) {
				/**
				 * Code to combat a bug observed on the Karen Traviss page on the Star Wars wiki, where there
				 * are no relatedPages for some reason. Moving forward it would be good for the Wikia API
				 * to handle this and never return malformed structures.
				 */
				articleProperties.relatedPages = data.relatedPages;
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

			if (articleProperties.isMainPage) {
				/**
				 * For main pages, title is wiki name, so we don't want to have duplicated text in documentTitle
				 */
				articleProperties.documentTitle = '';
			}
		}

		model.setProperties(articleProperties);
	}
});

export default ArticleModel;
