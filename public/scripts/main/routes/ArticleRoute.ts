/// <reference path="../app.ts" />

'use strict';

App.ArticleRoute = Em.Route.extend({
	model: function(params) {
		return App.ArticleModel.find({
			title: params.articleTitle,
			wiki: window.location.host.split('.')[0]
		});
	}
});
