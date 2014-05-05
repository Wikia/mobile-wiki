'use strict';
Wikia.WikiArticleRoute = Em.Route.extend({
	model: function (params) {
		var wikiName,
				articleId;

		wikiName = this.modelFor('wiki').get('wikiName');
		articleId = params.articleId;
		return $.get('/article/' + wikiName + '/' + articleId)
			.then(function(response) {
				return response.payload.sections;
		});
	}
});

