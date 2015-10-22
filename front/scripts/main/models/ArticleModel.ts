/// <reference path="../../baseline/mercury" />
/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/string.ts" />
/// <reference path="../../mercury/modules/Ads.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />

interface Response {
	data: {
		details: {
			id: number;
			title: string;
			ns: string;
			url: string;
			description: string;
			revision: {
				id: number;
				user: string;
				user_id: number;
				timestamp: string;
			};
			comments: number;
			type: string;
			abstract: string;
			thumbnail: string;
		};
		article: {
			content: string;
			media: any[];
			users: any;
			categories: any[];
		};
		isMainPage: boolean;
		mainPageData: any[];
		relatedPages: any[];
		topContributors: any[];
		adsContext: any;
		redirectEmptyTarget: boolean;
	};
}

App.ArticleModel = Em.Object.extend({
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
	user: null,
	users: [],
	wiki: null,
});

App.ArticleModel.reopenClass({
	url(params: {title: string; redirect?: string}): string {
		var redirect = '';

		if (params.redirect) {
			redirect += '?redirect=' + encodeURIComponent(params.redirect);
		}

		return App.get('apiBase') + '/article/' + params.title + redirect;
	},

	find(params: {basePath: string; wiki: string; title: string; redirect?: string}): Em.RSVP.Promise {
		var model = App.ArticleModel.create(params);

		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			if (M.prop('articleContentPreloadedInDOM') && !M.prop('asyncArticle')) {
				this.setArticle(model);
				resolve(model);
				return;
			}

			Em.$.ajax(<JQueryAjaxSettings>{
				url: this.url(params),
				dataType: 'json',
				success: (data): void => {
					this.setArticle(model, data);
					resolve(model);
				},
				error: (err: any): void => {
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

	getArticleRandomTitle(): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: App.get('apiBase') + '/article?random&titleOnly',
				cache: false,
				dataType: 'json',
				success: (data): void => {
					if (data.title) {
						resolve(data.title);
					} else {
						reject({
							message: 'Data from server doesn\'t include article title',
							data: data
						});
					}
				},
				error: (err): void => {
					reject(err);
				}
			});
		});
	},

	getPreloadedData(): any {
		var article = Mercury.article;

		M.prop('articleContentPreloadedInDOM', false);

		if (article.data && article.data.article) {
			// On the first page load the article content is available only in HTML
			article.data.article.content = $.trim($('#preloadedContent').html());
		}

		delete Mercury['article'];
		return article;
	},

	setArticle(model: typeof App.ArticleModel, source = this.getPreloadedData()): void {
		var articleProperties: any = {},
			exception = source.exception,
			data = source.data,
			details: any,
			article: any;

		if (exception) {
			articleProperties = {
				cleanTitle: M.String.normalizeToWhitespace(model.title),
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
					description: details.description
				};
			}

			if (data.article) {
				article = data.article;

				articleProperties = $.extend(articleProperties, {
					content: article.content,
					mediaUsers: article.users,
					type: article.type,
					media: App.MediaModel.create({
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
