/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.ArticleRoute = Em.Route.extend({
	queryParams: {
		file: {
			replace: true
		},
		commentsPage: {
			replace: true
		}
	},

	beforeModel: function (transition: EmberStates.Transition) {
		if (Wikia.error) {
			transition.abort();
		}

		this.replaceWith(this.sanitizeURL(window.location.pathname));
	},

	/**
	 * We need to support links like:
	 * /wiki/Rachel Berry
	 * /wiki/Rachel  Berry
	 * /wiki/Rachel__Berry
	 *
	 * but we want them to be displayed normalized in URL bar
	 */
	sanitizeURL: function (path: string = '') {
		return decodeURIComponent(path)
			.replace(/\s/g, '_')
			.replace(/_+/g, '_');
	},

	model: function (params: any) {
		return App.ArticleModel.find({
			title: this.sanitizeURL(params.title),
			wiki: this.controllerFor('application').get('domain')
		});
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition) {
			transition.abort();
			Em.Logger.warn(error);
		},

		// TODO: This currently will scroll to the top even when the app has encountered
		// an error. Optimally, it would remain in the same place.
		willTransition: function (transition: EmberStates.Transition) {
			if (transition.targetName === 'article') {
				window.scrollTo(0, 0);
			}

			// notify a property change on soon to be stale model for observers (like
			// the Table of Contents menu) can reset appropriately
			this.notifyPropertyChange('cleanTitle');
		}
	}
});
