/// <reference path="../app.ts" />
'use strict';

Wikia.WikiArticleRoute = Em.Route.extend({
	model: function (params: {articleTitle: string}): JQueryPromise <{article: string}> {
		var wikiName = this.modelFor('wiki').get('wikiName'),
			articleTitle = params.articleTitle;

		return $.get('/article/' + wikiName + '/' + articleTitle)
			.then(function (response: {payload: string}) {
				return {
					article: response.payload
				};
			});
	}
});
