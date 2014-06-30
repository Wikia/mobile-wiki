/// <reference path="../app.ts" />
'use strict';

App.ArticleController = Em.ObjectController.extend({
	actions: {
		updateHeaders: function(headers): void {
			var article = this.get('model');
			article.set('sections', headers);
		},
		changePage: function(title) {
			this.transitionToRoute('article', title);
		}
	}
});
