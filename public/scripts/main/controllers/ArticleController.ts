/// <reference path="../app.ts" />
/// <reference path="../../baseline/Wikia.d.ts" />
'use strict';

App.ArticleController = Em.ObjectController.extend({
	needs: ['application'],

	queryParams: ['file', 'commentsPage'],
	file: null,
	commentsPage: null,

	displayUsers: function () {
		return this.get('users').slice(0, 5);
	}.property('users'),

	actions: {
		updateHeaders: function(headers: NodeList): void {
			var article = this.get('model');
			article.set('sections', headers);
		},
		changePage: function(title: string) {
			this.transitionToRoute('article', title);
		},
		// Bubbled up from ArticleSectionHeaderView, which is a child of ArticleView
		scrollToTop: function () {
			window.scrollTo(0, 0);
		}
	}
});
