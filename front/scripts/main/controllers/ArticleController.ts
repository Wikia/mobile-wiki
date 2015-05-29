/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../mixins/VisibilityStateManager.ts" />
'use strict';

App.ArticleController = Em.Controller.extend({
	needs: ['application'],
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
			var file = this.get('controllers.application.file'),
				map = this.get('controllers.application.map'),
				mediaModel: typeof App.MediaModel,
				lightboxMediaRefs: LightboxMediaRefs;

			if (!Em.isEmpty(file)) {
				mediaModel = this.get('model.media');
				lightboxMediaRefs = mediaModel.getRefsForLightboxByTitle(M.String.normalize(file));
				if (!Em.isEmpty(lightboxMediaRefs.mediaRef)) {
					this.send('openLightbox', 'media', {
						media: mediaModel,
						mediaRef: lightboxMediaRefs.mediaRef,
						galleryRef: lightboxMediaRefs.galleryRef
					});
				}
			}

			//if (this.get('file')) {
			//	this.send('openLightbox', 'media');
			//} else if (this.get('map')) {
			//	var foundMap = Em.$('a[data-map-id=' + this.get('map') + ']'),
			//		title = foundMap.data('map-title'),
			//		url = foundMap.data('map-url'),
			//		id = foundMap.data('map-id');
			//
			//	this.send('openLightbox', 'map', {
			//		title: title,
			//		url: url,
			//		id: id
			//	});
			//}
		}
	}
});
