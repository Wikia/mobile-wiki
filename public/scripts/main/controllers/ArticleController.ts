/// <reference path="../app.ts" />
/// <reference path="../../baseline/Wikia.d.ts" />
'use strict';

App.ArticleController = Em.ObjectController.extend({
	needs: ['application'],

	queryParams: ['file', 'commentsPage'],
	file: null,
	commentsPage: null,
	commentsLoaded: null,
	commentsVisible: null,

	onModelChange: function () {
		this.setProperties({
			file: null,
			commentsPage: null,
			commentsLoaded: null,
			commentsVisible: null
		});
	}.observes('model'),

	displayUsers: function (): any[] {
		return this.get('users').slice(0, 5);
	}.property('users'),

	actions: {
		updateHeaders: function (headers: NodeList): void {
			var article = this.get('model');
			article.set('sections', headers);
		},

		changePage: function (title: string): void {
			this.transitionToRoute('article', title);
		},

		toggleComments: function (page: number): boolean {
			if (Em.isEmpty(page) && !Em.isEmpty(this.get('commentsPage'))) {
				this.set('commentsPage', null);
			} else {
				this.set('commentsPage', page || 1);
			}

			if (!this.get('commentsLoaded')) {
				this.set('commentsLoaded', true);

				return true;
			}

			return false;
		},

		articleRendered: function () {
			if (this.get('file')) {
				this.send('openLightbox', 'media-lightbox');
			} else if (this.get('commentsPage')) {
				this.send('toggleComments', this.get('commentsPage'));
			}
		}
	}
});
