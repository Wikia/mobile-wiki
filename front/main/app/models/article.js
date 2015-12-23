import Ember from 'ember';
import MediaModel from './media';
import {normalizeToWhitespace} from '../../mercury/utils/string';

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
	cleanTitle: null,
	comments: 0,
	description: null,
	isMainPage: false,
	mainPageData: null,
	media: [],
	mediaUsers: [],
	title: null,
	url: null,
	user: null,
	users: [],
	wiki: null,
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
	 * @param {ArticleModelFindParams} params
	 * @returns {Ember.RSVP.Promise}
	 */
	find(params) {
		const model = ArticleModel.create(params);

		return new Ember.RSVP.Promise((resolve, reject) => {
			if (M.prop('articleContentPreloadedInDOM') && !M.prop('asyncArticle')) {
				this.setArticle(model);
				resolve(model);
				return;
			}

			Ember.$.ajax({
				url: this.url(params),
				dataType: 'json',
				success: (data) => {
					this.setArticle(model, data);
					resolve(model);
				},
				error: (err) => {
					// Temporary solution until we can make error states work - ideally we should reject on errors
					if (err.status === 404) {
						this.setArticle(model, err.responseJSON);
						resolve(model);
					} else {
						reject(err);
					}
				}
			});
		});
	},

	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	getArticleRandomTitle() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: `${M.prop('apiBase')}/article?random&titleOnly`,
				cache: false,
				dataType: 'json',
				success: (data) => {
					if (data.title) {
						resolve(data.title);
					} else {
						reject({
							message: 'Data from server doesn\'t include article title',
							data
						});
					}
				},
				error: (err) => reject(err)
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
			article.data.article.content = $.trim($('#preloadedContent').html());
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
				cleanTitle: normalizeToWhitespace(model.title),
				exception
			};
		} else if (data) {
			if (data.details) {
				details = data.details;

				articleProperties = {
					ns: details.ns,
					cleanTitle: details.title,
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
		}

		// We could keep whole article in global but we want to discourage that but
		// We need to update global article.type
		// to allow eg. for analytics to use it
		// TODO: Should analytics be part of ember? That should simplify how to pass stuff around.
		M.prop('article.type', articleProperties.type, true);
		model.setProperties(articleProperties);
	}
});

export default ArticleModel;
