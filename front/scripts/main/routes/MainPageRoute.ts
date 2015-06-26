/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageRoute = Em.Route.extend(App.RouteActionsMixin, {
	model: function (): Em.RSVP.Promise {
		return App.MainPageModel.find();
	},

	renderTemplate: function (controller: any, model: typeof App.ArticleModel): void {
		if (model.isCuratedMainPage) {
			this.render('mainPage');
		} else {
			this.render('article', {
				view: 'article',
				model: model
			});
		}
	}
});
