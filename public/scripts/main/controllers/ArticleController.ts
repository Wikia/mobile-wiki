/// <reference path="../app.ts" />
/// <reference path="../../baseline/Wikia.d.ts" />
'use strict';

App.ArticleController = Em.ObjectController.extend({
	needs: ['application'],

	queryParams: ['file', 'commentsPage'],
	file: null,
	commentsPage: null,

	displayUsers: function (): any[] {
		return this.get('users').slice(0, 5);
	}.property('users'),

	actions: {
		updateHeaders: function (headers: NodeList): void {
			var article = this.get('model');
			article.set('sections', headers);
		},

		changePage: function (title: string): void {
			this.set('file', null);
			this.transitionToRoute('article', title);
		},

		articleRendered: function () {
			if (this.get('file')) {
				this.send('openLightbox', 'media-lightbox');
			}
		}
	}
});
