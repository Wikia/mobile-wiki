/// <reference path="../app.ts" />
'use strict';

App.WikiArticleController = Em.ObjectController.extend({
	actions: {
		updateHeaders: function(headers): void {
			var article = this.get('model');

			article.set('sections', headers);
		},
		changePage: function(title) {
			this.transitionToRoute('wiki.article', title);
		}
	}
});
