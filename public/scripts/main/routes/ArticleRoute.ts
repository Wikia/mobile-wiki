/// <reference path="../app.ts" />

'use strict';

App.ArticleRoute = Em.Route.extend({
	beforeModel: function (transition) {
		if (Wikia.error) {
			transition.abort();
		}
	},
	model: function (params) {
		return App.ArticleModel.find({
			title: params.articleTitle,
			wiki: this.controllerFor('application').get('domain')
		});
	},
	actions: {
		error: function (error, transition) {
			alert(error.status + ' Error: Sorry, we couldn\'t find ' + error.title);
		},
		// TODO: Fix how this scrolls to the top even when there is an error. Bad.
		willTransition: function (transition) {
			window.scrollTo(0,0);
		}
	}
});
