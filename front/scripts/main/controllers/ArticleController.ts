/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../mixins/VisibilityStateManager.ts" />
'use strict';

App.ArticleController = Em.Controller.extend({
	needs: ['application'],

	queryParams: ['file', 'map', {commentsPage: 'comments_page'}],
	file: null,
	commentsPage: null,
	map: null,
	noAds: Em.computed.alias('controllers.application.noAds'),

	actions: {
		updateHeaders: function (headers: NodeList): void {
			var article = this.get('model');
			article.set('sections', headers);
		},

		articleRendered: function () {
			if (this.get('file')) {
				this.send('openLightbox', 'media-lightbox');
			} else if (this.get('map')) {
				var foundMap = Em.$('a[data-map-id=' + this.get('map') + ']'),
					title = foundMap.data('map-title'),
					url = foundMap.data('map-url'),
					id = foundMap.data('map-id');

				this.send('openLightbox', 'map-lightbox', {
					title: title,
					url: url,
					id: id
				});
			}
		}
	}
});
