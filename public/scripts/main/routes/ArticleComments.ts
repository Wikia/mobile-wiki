/// <reference path="../app.ts" />

'use strict';

App.ArticleCommentsRoute = Em.Route.extend({
	renderTemplate: function () {
		this.render('article/comments', {
			outlet: 'comments'
		});
	}
});
