/// <reference path="../app.ts" />

'use strict';

App.ArticleIndexRoute = Em.Route.extend({
	beforeModel: function (transition) {
		if (Wikia.error) {
			transition.abort();
		}
	},
	model: function (params, transition) {
		return App.ArticleIndexModel.find({
			title: params.articleTitle,
			wiki: this.controllerFor('application').get('domain')
		});
	},
	actions: {
		error: function (error, transition) {
			transition.abort();
			console.warn(error);
		},
		// TODO: This currently will scroll to the top even when the app has encountered
		// an error. Optimally, it would remain in the same place.
		willTransition: function (transition) {
			if (transition.targetName === 'article.index') {
				window.scrollTo(0, 0);
			}
			// notify a property change on soon to be stale model for observers (like
			// the Table of Contents menu) can reset appropriately
			this.notifyPropertyChange('cleanTitle');
		}
	}
});
