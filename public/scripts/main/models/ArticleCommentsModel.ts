/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentsModel = Ember.Object.extend({
});

App.ArticleCommentsModel.reopenClass({
	find: function (params: any) {
		var model = App.ArticleCommentsModel.create();

		return new Ember.RSVP.Promise((resolve: Function, reject: Function) => {
			Ember.$.ajax({
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
