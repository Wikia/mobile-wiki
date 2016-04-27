import Ember from 'ember';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import MediaModel from '../models/media';
import {track, trackActions} from 'common/utils/track';

export default Ember.Controller.extend(
	AlertNotificationsMixin,
	{
		// This has to be here because we need to access media from ArticleController model to open
		// lightbox TODO: Should be refactored when decoupling article from application
		wikiPage: Ember.inject.controller(),
		queryParams: ['file', 'map',
			{
				noAds: 'noads'
			},
			// TODO: should be on articles controller https://wikia-inc.atlassian.net/browse/HG-815
			{
				commentsPage: 'comments_page'
			}
		],
		file: null,
		map: null,
		noAds: '',
		commentsPage: null,

		smartBannerVisible: false,
		drawerVisible: false,
		userMenuVisible: false,
		noScroll: false,
		fullPage: false,
		noMargins: false,
		lightboxType: null,
		lightboxModel: null,
		lightboxVisible: false,
		lightboxCloseButtonDelay: 0,

		// Controls the appearance of the share-header component
		enableShareHeader: false,

		drawerCollapsedObserver: Ember.observer('drawerVisible', function () {
			if (this.get('drawerVisible')) {
				this.set('noScroll', true);
			} else {
				this.set('noScroll', false);
			}
		}),

		/**
		 * @returns {void}
		 */
		init() {
			this.setProperties({
				domain: Ember.get(Mercury, 'wiki.dbName') || window.location.href.match(/^https?:\/\/(.*?)\./)[1],
				language: Ember.get(Mercury, 'wiki.language')
			});

			// This event is for tracking mobile sessions between Mercury and WikiaMobile
			// NOTE: this event won't have additional dimensions set up from API, ie. #19 (articleType)
			track({
				action: trackActions.impression,
				category: 'app',
				label: 'load'
			});

			this._super();
		},

		actions: {
			/**
			 * Resets properties related to lightbox which causes it to close. Also unblocks scrolling.
			 *
			 * @returns {void}
			 */
			closeLightbox() {
				this.setProperties({
					lightboxModel: null,
					lightboxType: null,
					lightboxVisible: false,
					lightboxCloseButtonDelay: 0,
					file: null,
					map: null,
					noScroll: false
				});
			},

			/**
			 * Sets lightbox type and model but doesn't show it. This method is used by Ads Module to
			 * prevent showing lightbox when there is no ad to display.
			 *
			 * @param {string} lightboxType
			 * @param {Object} [lightboxModel]
			 * @param {number} [closeButtonDelay]
			 * @returns {void}
			 */
			createHiddenLightbox(lightboxType, lightboxModel, closeButtonDelay) {
				this.setProperties({
					lightboxModel,
					lightboxType,
					lightboxVisible: false,
					lightboxCloseButtonDelay: closeButtonDelay,
					noScroll: false
				});
			},

			/**
			 * Bubbles up to ApplicationRoute
			 *
			 * @param {HTMLAnchorElement} target
			 * @returns {void}
			 */
			handleLink(target) {
				this.get('target').send('handleLink', target);
			},

			/**
			 * Handles query params that should open a lightbox.
			 * If you add another param to the app you should modify this function.
			 *
			 * @returns {void}
			 */
			handleLightbox() {
				const file = this.get('file'),
					map = this.get('map');

				if (!Ember.isEmpty(file)) {
					this.openLightboxForMedia(file);
				} else if (!Ember.isEmpty(map)) {
					this.openLightboxForMap(map);
				}
			},

			/**
			 * Bubbles up to ApplicationRoute
			 *
			 * @returns {void}
			 */
			loadRandomArticle() {
				this.get('target').send('loadRandomArticle');
			},

			/**
			 * Sets controller properties that are passed to LightboxWrapperComponent.
			 * Also blocks scrolling.
			 *
			 * @param {string} lightboxType
			 * @param {Object} [lightboxModel]
			 * @param {number} [closeButtonDelay]
			 * @returns {void}
			 */
			openLightbox(lightboxType, lightboxModel, closeButtonDelay) {
				this.setProperties({
					lightboxModel,
					lightboxType,
					lightboxVisible: true,
					lightboxCloseButtonDelay: closeButtonDelay,
					noScroll: true
				});
			},

			/**
			 * Sets query param with given name to given value. Uses whitelist.
			 *
			 * @param {string} name
			 * @param {*} value
			 * @returns {void}
			 */
			setQueryParam(name, value) {
				const queryParamsWhitelist = ['file', 'map'];

				if (queryParamsWhitelist.indexOf(name) === -1) {
					Ember.Logger.error('Something tried to set query param that is not on the whitelist', {
						name,
						value,
						whitelist: queryParamsWhitelist
					});
					return;
				}

				this.set(name, value);
			},

			/**
			 * Sets lightbox visibility to true. If you use openLightbox with lightboxVisible=false
			 * you can use this method to lightbox.
			 *
			 * @returns {void}
			 */
			showLightbox() {
				this.setProperties({
					lightboxVisible: true,
					noScroll: true
				});
			},

			/**
			 * @param {boolean} visible
			 * @returns {void}
			 */
			toggleDrawer(visible) {
				this.set('drawerVisible', visible);
			},

			/**
			 * @param {boolean} visible
			 * @returns {void}
			 */
			toggleSmartBanner(visible) {
				this.set('smartBannerVisible', visible);
			},

			/**
			 * @param {boolean} visible
			 * @returns {void}
			 */
			toggleUserMenu(visible) {
				this.set('userMenuVisible', visible);
			}
		},

		/**
		 * Finds media in article model by the file query param and sends proper data to
		 * openLightbox action.
		 * TODO: It currently opens the first found image with the given title (file qp),
		 * TODO: we should improve it some day.
		 *
		 * @param {string} file
		 * @returns {void}
		 */
		openLightboxForMedia(file) {
			const mediaModel = this.get('wikiPage.model.media'),
				lightboxMediaRefs = mediaModel instanceof MediaModel ?
					mediaModel.getRefsForLightboxByTitle(file) :
					null;

			if (!Ember.isEmpty(lightboxMediaRefs)) {
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
		 * Find the map element in DOM by given map id and sends proper data to openLightbox action.
		 *
		 * @param {string} map
		 * @returns {void}
		 */
		openLightboxForMap(map) {
			const $map = Ember.$(`a[data-map-id=${map}]`);

			this.send('openLightbox', 'map', {
				title: $map.data('map-title'),
				url: $map.data('map-url'),
				id: $map.data('map-id')
			});
		}
	}
);
