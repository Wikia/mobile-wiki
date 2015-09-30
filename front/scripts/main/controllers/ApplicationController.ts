/// <reference path="../app.ts" />
/// <reference path="../mixins/LoadingSpinnerMixin.ts" />
/// <reference path="../mixins/AlertNotificationsMixin.ts" />
'use strict';

App.ApplicationController = Em.Controller.extend(App.LoadingSpinnerMixin, App.AlertNotificationsMixin, {
	// This has to be here because we need to access media from ArticleController model to open lightbox
	// TODO: Should be refactored when decoupling article from application
	article: Em.inject.controller(),
	queryParams: ['file', 'map',
		{ noAds: 'noads' },
		// TODO: should be on articles controller https://wikia-inc.atlassian.net/browse/HG-815
		{ commentsPage: 'comments_page' }
	],
	file: null,
	map: null,
	noAds: '',
	commentsPage: null,

	smartBannerVisible: false,
	sideNavVisible: false,
	userMenuVisible: false,
	noScroll: false,
	fullPage: false,
	noMargins: false,
	lightboxType: null,
	lightboxModel: null,
	lightboxVisible: false,
	// Controls the appearance of the share-header component
	enableShareHeader: false,
	// For rolling out the new top-bar component for the global nav
	useNewNav: false,

	sideNavCollapsedObserver: Em.observer('sideNavVisible', function (): void {
		if (this.get('sideNavVisible')) {
			this.set('noScroll', true);
		} else {
			this.set('noScroll', false);
		}
	}),

	init(): void {
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
		 * @desc Resets properties related to lightbox which causes it to close.
		 * Also unblocks scrolling.
		 */
		closeLightbox(): void {
			this.setProperties({
				lightboxModel: null,
				lightboxType: null,
				lightboxVisible: false,
				file: null,
				map: null,
				noScroll: false
			});
		},

		/**
		 * @desc Sets lightbox type and model but doesn't show it
		 * This method is used by Ads Module to prevent showing lightbox when there is no ad to display.
		 *
		 * @param lightboxType
		 * @param lightboxModel
		 */
		createHiddenLightbox(lightboxType: string, lightboxModel?: any): void {
			this.setProperties({
				lightboxModel,
				lightboxType,
				lightboxVisible: false,
				noScroll: false
			});
		},

		/**
		 * @desc Bubbles up to ApplicationRoute
		 *
		 * @param target
		 */
		handleLink(target: HTMLAnchorElement): void {
			this.get('target').send('handleLink', target);
		},

		/**
		 * @desc Handles query params that should open a lightbox.
		 * If you add another param to the app you should modify this function.
		 */
		handleLightbox(): void {
			var file = this.get('file'),
				map = this.get('map');

			if (!Em.isEmpty(file)) {
				this.openLightboxForMedia(file);
			} else if (!Em.isEmpty(map)) {
				this.openLightboxForMap(map);
			}
		},

		/**
		 * @desc Bubbles up to ApplicationRoute
		 */
		loadRandomArticle(): void {
			this.get('target').send('loadRandomArticle');
		},

		/**
		 * @desc Sets controller properties that are passed to LightboxWrapperComponent.
		 * Also blocks scrolling.
		 *
		 * @param lightboxType
		 * @param lightboxModel
		 */
		openLightbox(lightboxType: string, lightboxModel?: any): void {
			this.setProperties({
				lightboxModel,
				lightboxType,
				lightboxVisible: true,
				noScroll: true
			});
		},

		/**
		 * @desc Bubbles up to ApplicationRoute
		 *
		 * @param searchString
		 */
		search: function (searchString : string) {
			this.get('target').send('search', searchString);
		},

		/**
		 * @desc Sets query param with given name to given value. Uses whitelist.
		 *
		 * @param name
		 * @param value
		 */
		setQueryParam(name: string, value: any): void {
			var queryParamsWhitelist = ['file', 'map'];

			if (queryParamsWhitelist.indexOf(name) === -1) {
				Em.Logger.error('Something tried to set query param that is not on the whitelist', {
					name: name,
					value: value,
					whitelist: queryParamsWhitelist
				});
				return;
			}

			this.set(name, value);
		},

		/**
		 * @desc Sets lightbox visibility to true.
		 * If you use openLightbox with lightboxVisible=false you can use this method to show lightbox.
		 */
		showLightbox(): void {
			this.setProperties({
				lightboxVisible: true,
				noScroll: true
			});
		},

		toggleSideNav(visible: boolean): void {
			this.set('sideNavVisible', visible);
		},

		toggleSmartBanner(visible: boolean): void {
			this.set('smartBannerVisible', visible);
		},

		toggleUserMenu(visible: boolean): void {
			this.set('userMenuVisible', visible);
		}
	},

	/**
	 * @desc Finds media in article model by the file query param and sends proper data to openLightbox action.
	 * TODO: It currently opens the first found image with the given title (file qp), we should improve it some day.
	 *
	 * @param file
	 */
	openLightboxForMedia(file: string): void {
		var mediaModel: typeof App.MediaModel = this.get('article.model.media'),
			lightboxMediaRefs = mediaModel instanceof App.MediaModel?
				mediaModel.getRefsForLightboxByTitle(file):
				null;

		if (!Em.isEmpty(lightboxMediaRefs)) {
			this.send('openLightbox', 'media', {
				media: mediaModel,
				mediaRef: lightboxMediaRefs.mediaRef,
				galleryRef: lightboxMediaRefs.galleryRef
			});
		} else {
			// If we can't display the lightbox let's remove this param from the URL
			this.set('file', null);
		}
	},

	/**
	 * @desc Find the map element in DOM by given map id and sends proper data to openLightbox action.
	 *
	 * @param map
	 */
	openLightboxForMap(map: string): void {
		var $map = Em.$(`a[data-map-id=${map}]`);

		this.send('openLightbox', 'map', {
			title: $map.data('map-title'),
			url: $map.data('map-url'),
			id: $map.data('map-id')
		});
	}
});
