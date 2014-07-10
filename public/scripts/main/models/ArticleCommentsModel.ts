/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentsModel = Ember.Object.extend({
});

App.ArticleCommentsModel.reopenClass({
	find: function (params) {
		var model = App.ArticleCommentsModel.create(),
			self = this;

		return new Ember.RSVP.Promise(function (resolve, reject) {
			Ember.$.ajax({
				url: self.url(params.id),
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
	url: function (id) {
		return '/api/v1/article/comments/' + id;
	}
});
