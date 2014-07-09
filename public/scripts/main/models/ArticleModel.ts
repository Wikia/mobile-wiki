/// <reference path="../app.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />

interface Response {
	payload: {
		article: string;
		user: any;
		media: any[];
		users: any[];
		categories: any[];
	};
	articleTitle: string;
	articleDetails: {
		revision: {
			timestamp: number;
		};
		comments: any;
		id: number;
		ns: string;
		title: string;
	};
	relatedPages: {
		items: any[];
	};
	userDetails: {
		items: any[];
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
	url: function (params) {
		return '/article/' + params.wiki + '/' + params.title;
	},
	find: function (params) {
		var model = App.ArticleModel.create(params),
			self = this;

		model.set('wiki', params.wiki);
		model.set('title', params.title);

		if (Wikia._state.firstPage) {
			this.setArticle(model);
			return model;
		}

		return new Ember.RSVP.Promise(function (resolve, reject) {
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
	setArticle: function (model, source = this.getPreloadedData()) {
		model.set('type', source.articleDetails.ns);
		model.set('cleanTitle', source.articleDetails.title);
		model.set('comments', source.articleDetails.comments);
		model.set('id', source.articleDetails.id);

		model.set('article', source.payload.article || $('.article-content').html());
		model.set('media', source.payload.media);
		model.set('mediaUsers', source.payload.users);
		model.set('user', source.payload.user);
		model.set('categories', source.payload.categories);

		model.set('relatedPages', source.relatedPages.items[source.articleDetails.id]);
		model.set('users', source.userDetails.items);

		model.set('basepath', source.userDetails.basepath);
	}
});
