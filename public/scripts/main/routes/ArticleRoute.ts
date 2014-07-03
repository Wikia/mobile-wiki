/// <reference path="../app.ts" />

'use strict';

App.ArticleRoute = Em.Route.extend(App.ResetScroll, {
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
		}
	}
});
