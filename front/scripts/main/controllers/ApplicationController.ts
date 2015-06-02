/// <reference path="../app.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend(App.LoadingSpinnerMixin, App.AlertNotificationsMixin, {
	// This has to be here because we need to access media from ArticleController model to open lightbox
	// TODO: Should be refactored when decoupling article from application
	needs: ['article'],
	queryParams: ['file', 'map', {
		noAds: 'noads'
	}],
	file: null,
	map: null,
	noAds: '',

	smartBannerVisible: false,
	sideNavCollapsed: true,
	noScroll: false,
	fullPage: false,
	lightboxType: null,
	lightboxModel: null,

	init: function () {
		this.setProperties({
			domain: Em.get(Mercury, 'wiki.dbName') || window.location.href.match(/^https?:\/\/(.*?)\./)[1],
			language: Em.get(Mercury, 'wiki.language'),
			editorPreview: Em.get(Mercury, 'article.preview')
		});

		// This event is for tracking mobile sessions between Mercury and WikiaMobile
		M.track({
			action: M.trackActions.impression,
			category: 'app',
			label: 'load'
		});

		this._super();
	},

	actions: {
		/**
		 * @desc Handles query params that should open a lightbox.
		 * If you add another param to the app you should modify this function.
		 */
		handleLightbox: function () {
			var file = this.get('file'),
				map = this.get('map');

			if (!Em.isEmpty(file)) {
				this.openLightboxForMedia(file);
			} else if (!Em.isEmpty(map)) {
				this.openLightboxForMap(map);
			}
		},

		/**
		 * @desc Sets controller properties that are passed to LightboxWrapperComponent.
		 * Also blocks scrolling.
		 *
		 * @param lightboxType
		 * @param lightboxModel
		 */
		openLightbox: function (lightboxType: string, lightboxModel?: any): void {
			this.setProperties({
				lightboxModel: lightboxModel,
				lightboxType: lightboxType,
				noScroll: true
			});
		},

		/**
		 * @desc Resets properties related to lightbox which causes it to close.
		 * Also unblocks scrolling.
		 */
		closeLightbox: function (): void {
			this.setProperties({
				lightboxModel: null,
				lightboxType: null,
				file: null,
				map: null,
				noScroll: false
			});
		}
	},

	/**
	 * @desc Finds media in article model by the file query param and sends proper data to openLightbox action.
	 * TODO: It currently opens the first found image with the given title (file qp), we should improve it some day.
	 *
	 * @param file
	 */
	openLightboxForMedia: function (file: string): void {
		var mediaModel: typeof App.MediaModel = this.get('controllers.article.model.media'),
			lightboxMediaRefs = mediaModel ? mediaModel.getRefsForLightboxByTitle(M.String.normalize(file)) : null;

		if (!Em.isEmpty(lightboxMediaRefs)) {
			this.send('openLightbox', 'media', {
				media: mediaModel,
				mediaRef: lightboxMediaRefs.mediaRef,
				galleryRef: lightboxMediaRefs.galleryRef
			});
		}
	},

	/**
	 * @desc Find the map element in DOM by given map id and sends proper data to openLightbox action.
	 *
	 * @param map
	 */
	openLightboxForMap: function (map: string): void {
		var $map = Em.$(`a[data-map-id=${map}]`);

		this.send('openLightbox', 'map', {
			title: $map.data('map-title'),
			url: $map.data('map-url'),
			id: $map.data('map-id')
		});
	}
});
