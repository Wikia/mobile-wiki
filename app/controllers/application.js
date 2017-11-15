import {inject as service} from '@ember/service';
import $ from 'jquery';
import {isEmpty} from '@ember/utils';
import {and, alias, bool, equal, reads} from '@ember/object/computed';
import {computed} from '@ember/object';
import Controller, {inject as controller} from '@ember/controller';
import MediaModel from '../models/media';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import NoScrollMixin from '../mixins/no-scroll';
import ConnectionTypeMixin from '../mixins/connection-type';
import {track, trackActions} from '../utils/track';
import {isHashLink} from '../utils/article-link';
import {trackPerf} from '../utils/track-perf';

export default Controller.extend(
	AlertNotificationsMixin,
	NoScrollMixin,
	ConnectionTypeMixin,
	{
		// This has to be here because we need to access media from ArticleController model to open
		// lightbox TODO: Should be refactored when decoupling article from application
		wikiPage: controller(),
		ads: service(),
		logger: service(),
		wikiVariables: service(),
		currentUser: service(),
		fastboot: service(),
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
		noAds: alias('ads.noAdsQueryParam'),
		commentsPage: null,

		applicationWrapperClassNames: null,
		smartBannerVisible: false,
		drawerVisible: false,
		drawerContent: null,
		userMenuVisible: false,
		fullPage: false,
		lightboxType: null,
		lightboxModel: null,
		lightboxVisible: false,
		lightboxCloseButtonDelay: 0,

		isSearchPage: equal('currentRouteName', 'search'),

		attributeBindings: ['dir'],
		classNames: ['application-wrapper'],
		classNameBindings: [
			'smartBannerVisible',
			'verticalClass',
			'isFandomAppSmartBannerVisible:with-fandom-app-smart-banner',
			'bfaaTemplate'
		],
		scrollLocation: null,

		firstRender: true,

		dir: reads('wikiVariables.language.contentDir'),

		bfaaTemplate: bool('ads.siteHeadOffset'),

		drawerContentComponent: computed('activeDrawerContent', function () {
			return `wikia-${this.get('activeDrawerContent')}`;
		}),

		verticalClass: computed('wikiVariables', function () {
			const vertical = this.get('wikiVariables.vertical');

			return `${vertical}-vertical`;
		}),

		/**
		 * @returns {boolean}
		 */
		isUserLangEn: equal('currentUser.language', 'en'),
		shouldShowFandomAppSmartBanner: and('isUserLangEn', 'wikiVariables.enableFandomAppSmartBanner'),
		isFandomAppSmartBannerVisible: and('shouldShowFandomAppSmartBanner', 'smartBannerVisible'),

		/**
		 * Necessary because presently, we open external links in new pages, so if we didn't
		 * cancel the click event on the current page, then the mouseUp handler would open
		 * the external link in a new page _and_ the current page would be set to that external link.
		 *
		 * @param {MouseEvent} event
		 * @returns {void}
		 */
		click(event) {
			/**
			 * check if the target has a parent that is an anchor
			 * We do this for links in the form <a href='...'>Blah <i>Blah</i> Blah</a>,
			 * because if the user clicks the part of the link in the <i></i> then
			 * target.tagName will register as 'I' and not 'A'.
			 */
			const $anchor = $(event.target).closest('a'),
				target = $anchor.length ? $anchor[0] : event.target;
			let tagName;

			if (target && this.shouldHandleClick(target)) {
				tagName = target.tagName.toLowerCase();

				if (tagName === 'a' && !isHashLink(target)) {
					this.handleLink(target);
					event.preventDefault();
				}
			}
		},

		/**
		 * Determine if we have to apply special logic to the click handler for MediaWiki / UGC content
		 *
		 * @param {EventTarget} target
		 * @returns {boolean}
		 */
		shouldHandleClick(target) {
			const $target = $(target),
				isReference = this.targetIsReference(target);

			return (
				$target.closest('.mw-content').length &&
				// ignore polldaddy content
				!$target.closest('.PDS_Poll').length &&
				// don't need special logic for article references
				!isReference
			);
		},

		/**
		 * Determine if the clicked target is an reference/in references list (in text or at the bottom
		 * of article)
		 *
		 * @param {EventTarget} target
		 * @returns {boolean}
		 */
		targetIsReference(target) {
			const $target = $(target);

			return Boolean(
				$target.closest('.references').length ||
				$target.parent('.reference').length
			);
		},

		/**
		 * @param {HTMLAnchorElement|EventTarget} target
		 * @returns {void}
		 */
		handleLink(target) {
			this.get('logger').debug('Handling link with href:', target.href);

			/**
			 * If either the target or the target's parent is an anchor (and thus target == true),
			 * then also check if the anchor has an href. If it doesn't we assume there is some other
			 * handler for it that deals with it based on ID or something and we just skip it.
			 */
			if (target && target.href) {
				/**
				 * But if it does have an href, we check that it's not the link to expand the comments
				 * If it's _any_ other link than that comments link, we stop its action and
				 * pass it up to handleLink
				 */
				if (!target.href.match(`^${window.location.origin}/a/.*/comments$`)) {
					this.sendAction('closeLightbox');
					this.sendAction('handleLink', target);
				}
			}
		},

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

			// This event is for tracking mobile sessions between Mercury and WikiaMobile
			// NOTE: this event won't have additional dimensions set up from API, ie. #19 (articleType)
			track({
				action: trackActions.impression,
				category: 'app',
				label: 'load'
			});

			this._super();

			if (this.get('effectiveConnectionType')) {
				track({
					action: trackActions.view,
					category: 'connection-type',
					label: this.get('effectiveConnectionType')
				});
			}


			if (this.firstRender === true) {
				this.firstRender = false;

				if (!this.get('fastboot.isFastBoot')) {
					trackPerf({
						name: 'appRendered',
						type: 'mark',
						context: {
							logged_in: this.get('currentUser.isAuthenticated'),
						}
					});
				}
			}
		},

		actions: {
			/**
			 * @param {string} content
			 * @returns {void}
			 */
			setDrawerContent(content) {
				this.set('activeDrawerContent', content);
			},

			closeDrawer() {
				this.set('activeDrawerContent', null);
				this.get('toggleDrawer')(false);
			},
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

				if (!isEmpty(file)) {
					this.openLightboxForMedia(file);
				} else if (!isEmpty(map)) {
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
					this.get('logger').error('Something tried to set query param that is not on the whitelist', {
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
		},

		/**
		 * Find the map element in DOM by given map id and sends proper data to openLightbox action.
		 *
		 * @param {string} map
		 * @returns {void}
		 */
		openLightboxForMap(map) {
			const $map = $(`a[data-map-id=${map}]`);

			this.send('openLightbox', 'map', {
				title: $map.data('map-title'),
				url: $map.data('map-url'),
				id: $map.data('map-id')
			});
		}
	}
);
