/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageRoute = Em.Route.extend(App.RouteActionsMixin, {
	model: function (params: any): Em.RSVP.Promise {
		return App.ArticleModel.find({
			basePath: Mercury.wiki.basePath,
			title: Mercury.wiki.mainPageTitle,
			wiki: this.controllerFor('application').get('domain')
		});
	},

	// TODO: Main page should has its own template, we shouldn't use article template
	renderTemplate: function (controller: any, model: typeof App.ArticleModel): void {
		this.render('article', {
			view: 'article',
			model: model
		});
	}
});
