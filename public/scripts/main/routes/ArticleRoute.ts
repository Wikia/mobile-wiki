/// <reference path="../app.ts" />

'use strict';

App.ArticleRoute = Em.Route.extend({
	model: function (params) {
		return App.ArticleModel.find({
			title: params.articleTitle,
			wiki: window.location.host.split('.')[0]
		});
	},
	actions: {
		error: function (error, transition) {
			alert(error.status + ' Error: Sorry, we couldn\'t find ' + error.title);
		}
	}
});
