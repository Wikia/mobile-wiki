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
		return '/api/v1/article/' + params.title;
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
		var content;

		model.set('type', source.articleDetails.ns);
		model.set('cleanTitle', source.articleDetails.title);
		model.set('comments', source.articleDetails.comments);
		model.set('id', source.articleDetails.id);

		content = source.payload.article || $('.article-content').html();

		// TODO: move this code to ArticleView in an observer and also don't use float.
		// instead use position relative/absolute to get it in the right place
		// top: 15px right 0
		content = content.replace(/(<h[234].*?>)/gi, function (headerType, headerTag) {
			return headerTag + '<a href="#top" style="float:right">&#8593;</a>';
		});

		model.set('article', content);
		model.set('media', source.payload.media);
		model.set('mediaUsers', source.payload.users);
		model.set('user', source.payload.user);
		model.set('categories', source.payload.categories);

		model.set('relatedPages', source.relatedPages.items[source.articleDetails.id]);
		model.set('users', source.userDetails.items);

		model.set('basepath', source.userDetails.basepath);
	}
});
