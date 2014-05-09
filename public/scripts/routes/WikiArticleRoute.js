'use strict';
Wikia.WikiArticleRoute = Em.Route.extend({
	model: function (params) {
		var wikiName,
				articleId,
				model;

		wikiName = this.modelFor('wiki').get('wikiName');
		articleId = params.articleId;
		return $.get('/article/' + wikiName + '/' + articleId)
			.then(function(response) {
					return {
						article: response.payload.sections,
						headings: [1,2,3,4,5]
					};
		});
	}
});

