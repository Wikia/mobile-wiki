import TrackClickMixin from '../mixins/track-click';
import ArticleModel from '../models/article';
import {activate as variantTestingActivate} from '../../mercury/utils/variantTesting';
import {getLinkInfo} from '../../mercury/utils/articleLink';
import {normalizeToUnderscore} from '../../mercury/utils/string';
import Ads from '../../mercury/modules/Ads';

export default Ember.Route.extend(
	Ember.TargetActionSupport,
	TrackClickMixin,
	{
		queryParams: {
			commentsPage: {
				replace: true
			}
		},

		actions: {
			/**
			 * @returns {void}
			 */
			loading() {
				if (this.controller) {
					this.controller.set('isLoading', true);
				}
			},

			/**
			 * @returns {void}
			 */
			didTransition() {
				// Activate any A/B tests for the new route
				variantTestingActivate();

				if (this.controller) {
					this.controller.set('isLoading', false);
				}

				// Clear notification alerts for the new route
				this.controller.clearNotifications();

				/*
				 * This is called after the first route of any application session has loaded
				 * and is necessary to prevent the ArticleModel from trying to bootstrap from the DOM
				 */
				M.prop('articleContentPreloadedInDOM', false);

				// TODO (HG-781): This currently will scroll to the top even when the app has encountered an error.
				// Optimally, it would remain in the same place.
				window.scrollTo(0, 0);
			},

			/**
			 * @param {*} error
			 * @returns {void}
			 */
			error(error) {
				if (this.controller) {
					this.controller.set('isLoading', false);
				}

				Ember.Logger.error('Route error', error);
			},

			/**
			 * @param {HTMLAnchorElement} target
			 * @returns {void}
			 */
			handleLink(target) {
				const currentRoute = this.router.get('currentRouteName'),
					/**
					 * exec() returns an array of matches or null if no match is found.
					 */
					domainNameRegExpMatchArray = (/\.[a-z0-9\-]+\.[a-z0-9]{2,}$/i).exec(window.location.hostname),
					cookieDomain = domainNameRegExpMatchArray ? `; domain=${domainNameRegExpMatchArray[0]}` : '',
					defaultSkin = Ember.getWithDefault(Mercury, 'wiki.defaultSkin', 'oasis');

				let title,
					trackingCategory,
					info;

				if (currentRoute === 'article') {
					title = this.controllerFor('article').get('model').get('title');
				} else {
					title = '';
				}

				trackingCategory = target.dataset.trackingCategory;
				info = getLinkInfo(
					Mercury.wiki.basePath,
					title,
					target.hash,
					target.href
				);

				/**
				 * Handle tracking
				 */
				if (trackingCategory) {
					this.triggerAction({
						action: 'trackClick',
						target: this,
						actionContext: trackingCategory
					});
				}

				/**
				 * handle links that are external to the application like ?useskin=oasis
				 */
				if (target.className.indexOf('external') > -1) {
					if (target.href.indexOf(`useskin=${defaultSkin}`) > -1) {
						document.cookie = `useskin=${defaultSkin}${cookieDomain}; path=/`;
					}

					return window.location.assign(target.href);
				}

				if (info.article) {
					this.transitionTo('article', info.article + (info.hash ? info.hash : ''));
				} else if (info.url) {
					/**
					 * If it's a jump link or a link to something in a Wikia domain, treat it like a normal link
					 * so that it will replace whatever is currently in the window.
					 * TODO: this regex is alright for dev environment, but doesn't work well with production
					 */
					if (info.url.charAt(0) === '#' || info.url.match(/^https?:\/\/.*\.wikia(\-.*)?\.com.*\/.*$/)) {
						window.location.assign(info.url);
					} else {
						window.open(info.url);
					}
				} else {
					// Reaching this clause means something is probably wrong.
					Ember.Logger.error('unable to open link', target.href);
				}
			},

			/**
			 * @returns {void}
			 */
			loadRandomArticle() {
				this.get('controller').send('toggleSideNav', false);

				ArticleModel
					.getArticleRandomTitle()
					.then((articleTitle) => {
						this.transitionTo('article', encodeURIComponent(normalizeToUnderscore(articleTitle)));
					})
					.catch((err) => {
						this.send('error', err);
					});
			},

			// We need to proxy these actions because of the way Ember is bubbling them up through routes
			// see http://emberjs.com/images/template-guide/action-bubbling.png
			/**
			 * @returns {void}
			 */
			handleLightbox() {
				this.get('controller').send('handleLightbox');
			},

			/**
			 * @param {string} lightboxType
			 * @param {*} [lightboxModel]
			 * @param {number} [closeButtonDelay]
			 * @returns {void}
			 */
			openLightbox(lightboxType, lightboxModel, closeButtonDelay) {
				this.get('controller').send('openLightbox', lightboxType, lightboxModel, closeButtonDelay);
			},

			/**
			 * @param {string} lightboxType
			 * @param {*} [lightboxModel]
			 * @returns {void}
			 */
			createHiddenLightbox(lightboxType, lightboxModel) {
				this.get('controller').send('createHiddenLightbox', lightboxType, lightboxModel);
			},

			/**
			 * @returns {void}
			 */
			showLightbox() {
				this.get('controller').send('showLightbox');
			},

			/**
			 * @returns {void}
			 */
			closeLightbox() {
				this.get('controller').send('closeLightbox');
			},

			// This is used only in not-found.hbs template
			/**
			 * @param {boolean} visible
			 * @returns {void}
			 */
			toggleSideNav(visible) {
				this.get('controller').set('sideNavVisible', visible);
			},
		},

		/**
		 * @returns {void}
		 */
		activate() {
			const instantGlobals = (window.Wikia && window.Wikia.InstantGlobals) || {};
			let adsInstance;

			if (M.prop('adsUrl') && !M.prop('queryParams.noexternals') &&
				!instantGlobals.wgSitewideDisableAdsOnMercury) {
				adsInstance = Ads.getInstance();
				adsInstance.init(M.prop('adsUrl'));

				/*
				 * This global function is being used by our AdEngine code to provide prestitial/interstitial ads
				 * It works in similar way on Oasis: we call ads server (DFP) to check if there is targeted ad unit for a user.
				 * If there is and it's in a form of prestitial/interstitial the ad server calls our exposed JS function to
				 * display the ad in a form of modal. The ticket connected to the changes: ADEN-1834.
				 * Created lightbox might be empty in case of lack of ads, so we want to create lightbox with argument
				 * lightboxVisible=false and then decide if we want to show it.
				 */
				adsInstance.createLightbox = (contents, closeButtonDelay, lightboxVisible) => {
					const actionName = lightboxVisible ? 'openLightbox' : 'createHiddenLightbox';

					if (!closeButtonDelay) {
						closeButtonDelay = 0;
					}

					this.send(actionName, 'ads', {contents}, closeButtonDelay);
				};

				adsInstance.showLightbox = () => {
					this.send('showLightbox');
				};
			}
		},
	}
);
