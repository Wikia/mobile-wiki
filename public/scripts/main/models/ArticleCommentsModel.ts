/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentsModel = Em.Object.extend({
	articleId: null,
	comments: 0,
	users: null,
	pagesCount: 0,
	page: 0,

	fetch: function () {
		var page = this.get('page'),
			articleId = this.get('articleId');

		if (page && page >= 0 && articleId) {
			return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
				Em.$.ajax({
					url: this.url(articleId, page),
					success: (data) => {
						this.setProperties(data.payload);
						resolve(this);
					},
					error: (data) => {
						reject(data);
					}
				});
			});
		}
	}.observes('page', 'articleId'),

	reset: function () {
		this.setProperties({
			comments: 0,
			users: null,
			pagesCount: 0
		});
	}.observes('articleId'),

	url: function (articleId: number, page: number = 0) {
		return App.get('apiBase') + '/article/comments/' + articleId + '/' + page;
	}
});
