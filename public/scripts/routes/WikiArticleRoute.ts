/// <reference path="../app.ts" />
'use strict';

interface MockResponseObject {
	payload: string;
    params: { articleTitle: string; };
}

Wikia.WikiArticleRoute = Em.Route.extend({
	model: function (params: {articleTitle: string}): JQueryPromise <{article: string}> {
		var wikiName = this.modelFor('wiki').get('wikiName'),
			articleTitle = params.articleTitle;

		
		return Ember.$.getJSON('/article/' + wikiName + '/' + articleTitle)
			.then(function (response: MockResponseObject) {
				return Wikia.WikiArticleModel.create({
					article: response.payload,
					title: response.params.articleTitle
				});
			});
	},
	setupController: function(controller, model): void {
		controller.set('model', model);
	}
});
