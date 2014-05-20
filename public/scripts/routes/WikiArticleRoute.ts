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
					title: response.articleTitle,
					headers: []
				});
			});
		// TODO: remove this, is for working on a train
		// return Wikia.WikiArticleModel.create({
		// 	article: '<blockquote>"This is just an example of a blockquote. This is just an example of a blockquote. This is just an example of"</blockquote> Then more normal text. Then more normal text. Then more normal text. Then more normal text. Then more normal text. Then more normal text. Then more normal text. Then more normal text. Then more normal text. Then more normal text. ',
		// 	title: 'Mock Article Title',
		//     headers: []
		// });
	},
	setupController: function(controller, model): void {
		controller.set('model', model);
	}
});
