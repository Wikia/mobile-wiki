/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../mixins/VisibilityStateManager.ts" />
'use strict';

App.ArticleController = Em.Controller.extend({
	needs: ['application'],
	queryParams: [{
		commentsPage: 'comments_page'
	}],
	commentsPage: null,
	noAds: Em.computed.alias('controllers.application.noAds'),

	init: function (): void {
		this.setProperties({
			mainPageTitle: Em.get(Mercury, 'wiki.mainPageTitle'),
			siteName: Em.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
		});
	},

	actions: {
		updateHeaders: function (headers: NodeList): void {
			var article = this.get('model');
			article.set('sections', headers);
		},

		edit: function (title: string, sectionIndex: number): void {
			App.VisibilityStateManager.reset();
			this.transitionToRoute('edit', title, sectionIndex);
			M.track({
				action: M.trackActions.click,
				category: 'sectioneditor',
				label: 'edit',
				value: sectionIndex
			});
		},

		articleRendered: function () {
			this.send('handleLightbox');
		}
	}
});
