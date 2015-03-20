/// <reference path="../../baseline/mercury" />
/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/string.ts" />
/// <reference path="../../mercury/modules/Ads.ts" />
/// <reference path="../../mercury/modules/InstantGlobals.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />

interface Response {
	data: {
		details: {
			id: number;
			title: string;
			ns: string;
			url: string;
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
		relatedPages: any[];
		topContributors: any[];
		adsContext: any
	};
}

App.ArticleModel = Em.Object.extend({
	article: null,
	basePath: null,
	categories: [],
	cleanTitle: null,
	comments: 0,
	media: [],
	mediaUsers: [],
	sections: [],
	title: null,
	user: null,
	users: [],
	wiki: null
});

App.ArticleModel.reopenClass({
	url: function (params: {title: string; redirect?: string}) {
		var redirect = '';

		if (params.redirect) {
			redirect += '?redirect=' + encodeURIComponent(params.redirect);
		}

		return App.get('apiBase') + '/article/' + params.title + redirect;
	},

	find: function (params: {basePath: string; wiki: string; title: string; redirect?: string}) {
		var model = App.ArticleModel.create(params);

		if (M.prop('firstPage')) {
			this.setArticle(model);
			return model;
		}

		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: this.url(params),
				dataType: 'json',
				success: (data) => {
					this.setArticle(model, data);
					resolve(model);
				},
				error: (err) => {
					if (err.status === 404) {
						this.setArticle(model, err.responseJSON);
						resolve(model);
					} else {
						// TODO we currently abort transition when there was an error other than 404
						reject($.extend(err, model));
					}
				}
			});
		});
	},

	getPreloadedData: function () {
		var article = Mercury.article,
			instantGlobals: Mercury.Modules.InstantGlobals;

		M.prop('firstPage', false);

		// On first page load the article content is available only in HTML
		article.content = $('.article-content').html();

		// Setup ads
		if (M.prop('resourcesUrl') && !M.prop('queryParams.noexternals')) {
			instantGlobals = Mercury.Modules.InstantGlobals.getInstance();
			instantGlobals.init(article);
		}

		delete Mercury.article;
		return article;
	},

	setArticle: function (model: typeof App.ArticleModel, source = this.getPreloadedData()) {
		var data: any = {};

		if (source.error) {
			var error = source.error;

			data = {
				article: error.details,
				cleanTitle: M.String.normalize(model.title),
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
					user: details.revision.user_id
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
					categories: article.categories
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
				data.adsContext = source.adsContext;
			}

			if (source.topContributors) {
				// Same issue: the response to the ajax should always be valid and not undefined
				data.topContributors = source.topContributors;
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
