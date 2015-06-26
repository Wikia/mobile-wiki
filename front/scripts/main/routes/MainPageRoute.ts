/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.MainPageRoute = Em.Route.extend({
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
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition): boolean {
			if (transition) {
				transition.abort();
			}
			Em.Logger.warn('Route error', error.stack || error);
			return true;
		},

		// TODO: This currently will scroll to the top even when the app has encountered
		// an error. Optimally, it would remain in the same place.
		didTransition: function (): boolean {
			window.scrollTo(0, 0);
			// bubble up to application didTransition hook
			return true;
		},
		openCuratedContentItem: function(item) {
			this.get('controller').send('openCuratedContentItem', item);
		}
	}
});
