/// <reference path="../app.ts" />
/// <reference path="../../wikia/utils/string.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />

interface Response {
	data: {
		details: {
			revision: {
				timestamp: number;
			};
			comments: any;
			id: number;
			ns: string;
			title: string;
		};
		article: {
			content: string;
			user: any;
			media: any[];
			users: any[];
			categories: any[];
		};
		relatedPages: any[];
		userDetails: any[];
		topContributors: any[];
	};
}

App.ArticleModel = Em.Object.extend({
	article: null,
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

		return App.get('apiBase') +'/article/' + params.title + redirect;
	},

	find: function (params: {wiki: string; title: string; redirect?: string}) {
		var model = App.ArticleModel.create(params);

		if (Wikia._state.firstPage) {
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
					reject($.extend(err, model));
				}
			});
		});
	},

	getPreloadedData: function () {
		Wikia._state.firstPage = false;
		return Wikia.article;
	},

	setArticle: function (model: typeof App.ArticleModel, source = this.getPreloadedData()) {
		var data: any = {};

		if (source.error) {
			var error = source.error;

			data = {
				article: error.details,
				cleanTitle: Wikia.Utils.String.normalize(model.title)
			}
		} else if (source) {
			if (source.details) {
				var details = source.details;

				data = $.extend(data, {
					ns: details.ns,
					cleanTitle: details.title,
					comments: details.comments,
					id: details.id,
					user: details.revision.user_id
				})
			}

			if (source.article) {
				var article = source.article;

				data = $.extend(data, {
					article: article.content || $('.article-content').html(),
					mediaUsers: article.users,
					media: App.MediaModel.create({
						media: article.media
					}),
					categories: article.categories
				})
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
				data.users = source.topContributors;
			}

			if (source.basePath) {
				data.basePath = source.basePath;
			}
		}

		model.setProperties(data);
	}
});
