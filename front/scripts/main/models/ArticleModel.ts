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
	article: null,
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
					if (err.status === 404) {
						this.setArticle(model, {
							error: err.responseJSON
						});
						resolve(model);
					} else {
						// TODO we currently abort transition when there was an error other than 404
						reject($.extend(err, model));
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
		var article = Mercury.article,
			adsInstance: Mercury.Modules.Ads,
			instantGlobals = Wikia.InstantGlobals || {};

		M.prop('articleContentPreloadedInDOM', false);

		// On first page load the article content is available only in HTML
		article.content = $.trim($('#preloadedContent').html());

		delete Mercury['article'];
		return article;
	},

	setArticle(model: typeof App.ArticleModel, source = this.getPreloadedData()): void {
		var data: any = {};

		if (source.error) {
			var error = source.error;

			data = {
				article: error.details,
				cleanTitle: M.String.normalizeToWhitespace(model.title),
				error: error
			};
		} else if (source) {
			if (source.details) {
				var details = source.details;

				data = $.extend(data, {
					ns: details.ns,
					cleanTitle: details.title,
					comments: details.comments,
					id: details.id,
					user: details.revision.user_id,
					description: details.description
				});
			}

			if (source.article) {
				var article = source.article;

				data = $.extend(data, {
					article: article.content || source.content,
					mediaUsers: article.users,
					type: article.type,
					media: App.MediaModel.create({
						media: article.media
					}),
					categories: article.categories,
					redirectEmptyTarget: source.redirectEmptyTarget || false
				});
			}

			if (source.relatedPages) {
				/**
				 * Code to combat a bug observed on the Karen Traviss page on the Star Wars wiki, where there
				 * are no relatedPages for some reason. Moving forward it would be good for the Wikia API
				 * to handle this and never return malformed structures.
				 */
				data.relatedPages = source.relatedPages;
			}

			if (source.adsContext) {
				if (source.adsContext.targeting) {
					source.adsContext.targeting.mercuryPageCategories = data.categories;
				}
				data.adsContext = source.adsContext;
			}

			if (source.topContributors) {
				// Same issue: the response to the ajax should always be valid and not undefined
				data.topContributors = source.topContributors;
			}

			data.isMainPage = source.isMainPage || false;

			if (source.mainPageData) {
				data.mainPageData = source.mainPageData;
				data.isCuratedMainPage = true;
			}
		}

		// We could keep whole article in global but we want to discourage that but
		// We need to update global article.type
		// to allow eg. for analytics to use it
		// TODO: Should analytics be part of ember? That should simplify how to pass stuff around.
		M.prop('article.type', data.type, true);
		model.setProperties(data);
	}
});
