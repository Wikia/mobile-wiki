/// <reference path="../app.ts" />

'use strict';

App.WikiArticleRoute = Em.Route.extend({
	model: function(params) {
		return new Ember.RSVP.Promise({
			var articleModel = App.WikiArticleModel.find({
				title: params.articleTitle,
				wiki: this.modelFor('wiki').get('wikiName');
			});
			if (articleModel.get('exception')) {
				reject('Could not find article');
			} else {
				resolve(model);
			}
		});

		// return App.WikiArticleModel.find({
		// 	title: params.articleTitle,
		// 	wiki: this.modelFor('wiki').get('wikiName')
		// });
	}
});
