/// <reference path="../app.ts" />

'use strict';

App.WikiArticleRoute = Em.Route.extend({
	model: function(params) {
		return App.WikiArticleModel.find({
			title: params.articleTitle,
			wiki: this.modelFor('wiki').get('wikiName')
		});
	}
});
