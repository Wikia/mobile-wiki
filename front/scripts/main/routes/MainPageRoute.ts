/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../mixins/MainPageRouteMixin.ts" />

'use strict';

App.MainPageRoute = Em.Route.extend(App.MainPageRouteMixin, {
	model(): Em.RSVP.Promise {
		return App.MainPageModel.find();
	},

	afterModel(model: typeof App.MainPageModel): void {
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

	renderTemplate(controller: any, model: typeof App.MainPageModel): void {
		if (model.isCuratedMainPage) {
			this.render('main-page', {
				controller: 'mainPage',
				model
			});
		} else {
			this.render('article', {
				view: 'article',
				model
			});
		}
	},

	actions: {
		error(error: any, transition: EmberStates.Transition): boolean {
			if (transition) {
				transition.abort();
			}
			Em.Logger.warn('Route error', error.stack || error);
			return true;
		}
	}
});
