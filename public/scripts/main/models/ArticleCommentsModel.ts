/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentsModel = Em.Object.extend({
	articleId: null,
	comments: null,
	users: null,
	pagesCount: null,
	page: 0,

	fetch: function (page?: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: this.url(this.get('articleId'), this.get('page')),
				success: (data) => {
					this.setProperties(data.payload);
					resolve(this);
				},
				error: (data) => {
					reject(data);
				}
			});
		});
	}.observes('page', 'articleId'),

	init: function () {
		return this.fetch();
	},

	url: function (articleId: number, page: number = 0) {
		return App.get('apiBase') + '/article/comments/' + articleId + '/' + page;
	}
});
