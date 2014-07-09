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
		// TODO: This currently will scroll to the top even when the app has encountered
		// an error. Optimally, it would remain in the same place.
		willTransition: function (transition) {
			var currentArticleStr = this.currentModel.get('title');
			if (transition.targetName !== 'article.comments' && transition.intent.contexts[0] !== currentArticleStr) {
				window.scrollTo(0, 0);
			}
		}
	}
});
