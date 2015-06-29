/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageIndexRoute = Em.Route.extend({
	model: function (): Em.RSVP.Promise {
		return App.MainPageModel.find();
	},

	afterModel: function () {
		this.controllerFor('mainPage').setProperties({
			isRoot: true,
			title: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});
	},

	renderTemplate: function (controller: any, model: typeof App.ArticleModel): void {
		if (model.isCuratedMainPage) {
			this.render('mainPage', {
				controller: 'mainPage',
				model: model
			});
		} else {
			this.render('article', {
				view: 'article',
				model: model
			});
		}
	}
});
