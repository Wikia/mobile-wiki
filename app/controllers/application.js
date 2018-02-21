import {inject as service} from '@ember/service';
import {isEmpty} from '@ember/utils';
import {alias, equal} from '@ember/object/computed';
import Controller, {inject as controller} from '@ember/controller';
import MediaModel from '../models/media';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import NoScrollMixin from '../mixins/no-scroll';

export default Controller.extend(
	AlertNotificationsMixin,
	NoScrollMixin,
	{
		// This has to be here because we need to access media from ArticleController model to open
		// lightbox TODO: Should be refactored when decoupling article from application
		wikiPage: controller(),
		ads: service(),
		logger: service(),
		wikiVariables: service(),

		queryParams: ['file',
			{
				noAds: 'noads'
			},
			{
				fullPage: 'mobile-app'
			},
			// TODO: should be on articles controller https://wikia-inc.atlassian.net/browse/HG-815
			{
				commentsPage: 'comments_page'
			}
		],

		/**
		 * @returns {void}
		 */
		init() {
			this.setProperties({
				applicationWrapperClassNames: [],
				domain: this.get('wikiVariables.dbName') ||
				window.location && window.location.href.match(/^https?:\/\/(.*?)\./)[1],
				language: this.get('wikiVariables.language')
			});

			this._super();
		},

		file: null,
		commentsPage: null,
		applicationWrapperClassNames: null,
		drawerVisible: false,
		drawerContent: null,
		userMenuVisible: false,
		fullPage: null,
		lightboxType: null,
		lightboxModel: null,
		lightboxVisible: false,
		lightboxCloseButtonDelay: 0,

		noAds: alias('ads.noAdsQueryParam'),
		isSearchPage: equal('currentRouteName', 'search'),

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
				if (name !== 'file') {
					this.get('logger').error('Something tried to set query param that is not on the whitelist', {
						name,
						value,
						whitelist: ['file']
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
			toggleUserMenu(visible) {
				this.set('userMenuVisible', visible);
			},

			toggleSiteHeadShadow(visible) {
				this.set('siteHeadShadow', visible);
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

			if (!isEmpty(lightboxMediaRefs)) {
				this.send('openLightbox', 'media', {
					media: mediaModel,
					mediaRef: lightboxMediaRefs.mediaRef,
					galleryRef: lightboxMediaRefs.galleryRef
				});
			} else {
				// If we can't display the lightbox let's remove this param from the URL
				this.set('file', null);
			}
		}
	}
);
