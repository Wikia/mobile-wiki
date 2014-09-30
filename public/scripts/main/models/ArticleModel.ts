/// <reference path="../app.ts" />
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
		var model = App.ArticleModel.create(params),
			self = this;

		model.set('wiki', params.wiki);
		model.set('title', params.title);

		if (Wikia._state.firstPage) {
			this.setArticle(model);
			return model;
		}

		return new Em.RSVP.Promise(function (resolve: Function, reject: Function) {
			Em.$.ajax({
				url: self.url(params),
				dataType: 'json',
				async: false,
				success: function (data) {
					self.setArticle(model, data);
					resolve(model);
				},
				error: function (err) {
					reject($.extend(err, model));
				}
			});
		});
	},

	getPreloadedData: function () {
		Wikia._state.firstPage = false;
		return Wikia.article;
	},

	setArticle: function (model: Em.Object, source = this.getPreloadedData()) {
		model.setProperties({
			type: source.details.ns,
			cleanTitle: source.details.title,
			comments: source.details.comments,
			id: source.details.id,
			article: source.article.content || $('.article-content').html(),
			mediaUsers: source.article.users,
			media: App.MediaModel.create({
				media: source.article.media
			}),
			user: source.details.revision.user_id,
			categories: source.article.categories,
			adsContext: source.adsContext,

			/**
			 * Code to combat a bug observed on the Karen Traviss page on the Star Wars wiki, where there
			 * are no relatedPages for some reason. Moving forward it would be good for the Wikia API
			 * to handle this and never return malformed structures.
			 */
			relatedPages: source.relatedPages,

			// Same issue: the response to the ajax should always be valid and not undefined
			users: source.topContributors,
			basepath: source.basePath
		});
	}
});
