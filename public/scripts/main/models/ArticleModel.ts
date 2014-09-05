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

App.ArticleModel = Ember.Object.extend({
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
	url: function (params: {title: string}) {
		return '/api/v1/article/' + params.title;
	},
	find: function (params: {wiki: string; title: string}) {
		var model = App.ArticleModel.create(params),
			self = this;

		model.set('wiki', params.wiki);
		model.set('title', params.title);

		if (Wikia._state.firstPage) {
			this.setArticle(model);
			return model;
		}

		return new Ember.RSVP.Promise(function (resolve: Function, reject: Function) {
			Ember.$.ajax({
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
	setArticle: function (model: Ember.Object, source = this.getPreloadedData()) {
		model.set('type', source.details.ns);
		model.set('cleanTitle', source.details.title);
		model.set('comments', source.details.comments);
		model.set('id', source.details.id);
		model.set('article', source.article.content || $('.article-content').html());
		model.set('media', source.article.media);
		model.set('mediaUsers', source.article.users);
		model.set('user', source.details.revision.user_id);
		model.set('categories', source.article.categories);
		model.set('adsContext', source.adsContext);

		/**
		 * Code to combat a bug observed on the Karen Traviss page on the Star Wars wiki, where there
		 * are no relatedPages for some reason. Moving forward it would be good for the Wikia API
		 * to handle this and never return malformed structures.
		 */
		model.set('relatedPages', source.relatedPages);

		// Same issue: the response to the ajax should always be valid and not undefined
		model.set('users', source.topContributors);
		model.set('basepath', source.basePath);
	}
});
