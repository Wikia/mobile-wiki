/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

App.SearchResultsRoute = Em.Route.extend({
	// Don't let the script to start loading multiple times (user opens the route, goes back, opens it again)
	googleCustomSearchLoadingInitialized: false,

	// Return a promise and resolve only after script is loaded - this way the route won't load before it happens
	beforeModel(): Em.RSVP.Promise {
		if (!this.get('googleCustomSearchLoadingInitialized')) {
			return this.loadGoogleCustomSearch();
		}

		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			resolve();
		});
	},

	loadGoogleCustomSearch() : JQueryXHR {
		var searchKey = '006230450596576500385:kcgbfm7zpa8',
			url = (document.location.protocol === 'https:' ? 'https:' : 'http:') +
				'//www.google.com/cse/cse.js?cx=' + searchKey;

		this.set('googleCustomSearchLoadingInitialized', true);
		return Em.$.getScript(url);
	},
});
