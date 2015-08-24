/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.ArticleRoute = Em.Route.extend({
	beforeModel: function (transition: EmberStates.Transition):void {
		var title = transition.params.article.title.replace('wiki/', '');

		if (Mercury.error) {
			this.transitionTo('notFound');
		}

		this.controllerFor('application').send('closeLightbox');

		if (title === Mercury.wiki.mainPageTitle) {
			this.transitionTo('mainPage');
		}

		// If you try to access article with not-yet-sanitized title you can see in logs:
		// `Transition #1: detected abort.`
		// This is caused by the transition below but doesn't mean any additional requests.
		// TODO: This could be improved upon by not using an Ember transition to 'rewrite' the URL
		// Ticket here: https://wikia-inc.atlassian.net/browse/HG-641
		if (title.match(/\s/)) {
			this.transitionTo('article',
				M.String.normalizeToUnderscore(title)
			);
		}
	},

	model: function (params: any): Em.RSVP.Promise {
		return App.ArticleModel.find({
			basePath: Mercury.wiki.basePath,
			title: params.title,
			wiki: this.controllerFor('application').get('domain')
		});
	},

	afterModel: function (model: typeof App.ArticleModel): void {
		// if an article is main page, redirect to mainPage route
		// this will handle accessing /wiki/Main_Page if default main page is different article
		if (model.isMainPage) {
			this.replaceWith('mainPage');
		}

		this.controllerFor('application').set('currentTitle', model.get('title'));
		App.VisibilityStateManager.reset();

		// Reset query parameters
		model.set('commentsPage', null);
	},

	actions: {
		willTransition: function (transition: EmberStates.Transition): void {
			// notify a property change on soon to be stale model for observers (like
			// the Table of Contents menu) can reset appropriately
			this.notifyPropertyChange('cleanTitle');
		},

		error: function (error: any, transition: EmberStates.Transition): boolean {
			if (transition) {
				transition.abort();
			}
			Em.Logger.warn('Route error', error.stack || error);
			return true;
		},

		didTransition: function (): boolean {
			// TODO (HG-781): This currently will scroll to the top even when the app has encountered an error.
			// Optimally, it would remain in the same place.
			window.scrollTo(0, 0);

			// bubble up to ApplicationRoute#didTransition
			return true;
		}
	}
});
