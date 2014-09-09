/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentsModel = Em.Object.extend({
	find: function (params: any) {
		var model = App.ArticleCommentsModel.create();

		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: this.url(params.id),
				success: function (data) {
					model.setProperties(data.payload);
					resolve(model);
				},
				error: function (data) {
					reject(data);
				}
			});
		});
	},
	url: function (id: string) {
		return '/api/v1/article/comments/' + id;
	}
});
