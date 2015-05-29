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
				map = this.get('controllers.application.map');

			if (!Em.isEmpty(file)) {
				this.openLightboxForMedia(file);
			} else if (!Em.isEmpty(map)) {
				this.openLightboxForMap(map);
			}
		}
	},

	openLightboxForMedia (file: string): void {
		var mediaModel: typeof App.MediaModel = this.get('model.media'),
			lightboxMediaRefs = mediaModel.getRefsForLightboxByTitle(M.String.normalize(file));

		if (!Em.isEmpty(lightboxMediaRefs.mediaRef)) {
			this.send('openLightbox', 'media', {
				media: mediaModel,
				mediaRef: lightboxMediaRefs.mediaRef,
				galleryRef: lightboxMediaRefs.galleryRef
			});
		}
	},

	openLightboxForMap: function (map: string): void {
		var $map = Em.$(`a[data-map-id=${map}]`);

		this.send('openLightbox', 'map', {
			title: $map.data('map-title'),
			url: $map.data('map-url'),
			id: $map.data('map-id')
		});
	}
});
