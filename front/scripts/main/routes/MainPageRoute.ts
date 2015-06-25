/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageRoute = Em.Route.extend({
	model: function (params: any) {
		return App.ArticleModel.find({
			basePath: Mercury.wiki.basePath,
			title: Mercury.wiki.mainPageTitle,
			wiki: this.controllerFor('application').get('domain')
		});
	},

	// TODO: Main page should has its own template, we shouldn't use article template
	renderTemplate: function(controller, model) {
		this.render('article', {
			controller: 'article',
			view: 'article',
			model: model
		});
	},
});
