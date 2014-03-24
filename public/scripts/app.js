'use strict';
/* global Em */
window.Wikia = Em.Application.create({
	LOG_TRANSITIONS: true
});

Wikia.Router.map(function () {
	this.resource('wiki', {
		path: '/:wikiName'
	}, function () {
		this.route('article', {
			path: 'article/:articleId'
		});
	});
});

Wikia.ApplicationRoute = Em.Route.extend({
	model: function(params) {
		console.log(params);
		return params;
	}
});

Wikia.ApplicationController = Em.Controller.extend({
	name: 'Wikia R&D'
});

Wikia.WikiRoute = Em.Route.extend({
	model: function (params) {
		return Em.Object.create(params);
	}
});

Wikia.WikiController = Em.ObjectController.extend({
});

Wikia.WikiView = Em.View.extend({
	templateName: 'wiki'
});

Wikia.WikiIndexRoute = Em.Route.extend({
	model: function (params) {
		return params;
	}
});

Wikia.WikiArticleRoute = Em.Route.extend({
	model: function (params) {
		var wikiName,
				articleId;

		wikiName = this.modelFor('wiki').get('wikiName');
		articleId = params.articleId;
		return $.get('/article/' + wikiName + '/' + articleId)
						.then(function(response) {
							return response.payload.sections;
						});
	}
});
Wikia.WikiArticleController = Em.ArrayController.extend({
});

