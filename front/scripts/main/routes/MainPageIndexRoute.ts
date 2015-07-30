/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageIndexRoute = Em.Route.extend({
	model: function (): Em.RSVP.Promise {
		return App.MainPageModel.find();
	},

	afterModel: function (model: typeof App.MainPageModel): void {
		var mainPageTitle = M.String.normalizeToWhitespace(Em.get(Mercury, 'wiki.mainPageTitle'));
		document.title = mainPageTitle + ' - ' + Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia');

		this.controllerFor('mainPage').setProperties({
			adsContext: model.get('adsContext'),
			isRoot: true,
			ns: model.get('ns'),
			title: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});

		if (!model.isCuratedMainPage) {
			// This is needed for articles
			App.VisibilityStateManager.reset();
		}
	},

	renderTemplate: function (controller: any, model: typeof App.MainPageModel): void {
		if (model.isCuratedMainPage) {
			this.render('main-page', {
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
