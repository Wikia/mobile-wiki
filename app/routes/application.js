import Ember from 'ember';
import ArticleModel from '../models/wiki/article';
import ApplicationModel from '../models/application';
import HeadTagsStaticMixin from '../mixins/head-tags-static';
import getLinkInfo from '../utils/article-link';
import {normalizeToUnderscore} from '../utils/string';
import {track, trackActions} from '../utils/track';
import {getQueryString} from '../utils/url';
import {NonJsonApiResponseError, DontLogMeError} from '../errors/main';

import {disableCache, setResponseCaching, CachingInterval, CachingPolicy} from '../utils/fastboot-caching';

const {
	Logger,
	Route,
	TargetActionSupport,
	getOwner,
	inject
} = Ember;

export default Route.extend(
	TargetActionSupport,
	HeadTagsStaticMixin,
	{
		ads: inject.service(),
		currentUser: inject.service(),
		fastboot: inject.service(),
		i18n: inject.service(),
		wikiVariables: inject.service(),

		queryParams: {
			commentsPage: {
				replace: true
			},
			noexternals: {
				replace: true
			},
			uselang: {
				replace: true
			}
		},
		noexternals: null,

		model(params, transition) {
			const fastboot = this.get('fastboot');

			let title;

			if (transition.targetName === 'wiki-page') {
				title = transition.params['wiki-page'].title;
			}

			return ApplicationModel.get(fastboot, title, this.get('currentUser'))
				.then((wikiVariables) => {
					if (fastboot.get('isFastBoot')) {
						this.injectScriptsFastbootOnly(wikiVariables, transition.queryParams);
					}

					this.get('wikiVariables').setProperties(wikiVariables);

					return wikiVariables;
				})
				.catch((error) => {
					if (error instanceof NonJsonApiResponseError) {
						const fastboot = this.get('fastboot');

						fastboot.get('response.headers').set(
							'location',
							error.additionalData[0].redirectLocation
						);
						fastboot.set('response.statusCode', 302);

						// TODO XW-3198
						// We throw error to stop Ember
						throw error;
					}

					this.injectScriptsFastbootOnly(null, transition.queryParams);
					throw error;
				});
		},

		afterModel(model, transition) {
			const instantGlobals = (window.Wikia && window.Wikia.InstantGlobals) || {},
				fastboot = this.get('fastboot');

			this._super(...arguments);

			this.get('i18n').initialize(transition.queryParams.uselang || model.language.content);

			if (
				!fastboot.get('isFastBoot') &&
				this.get('ads.adsUrl') &&
				!transition.queryParams.noexternals &&
				!instantGlobals.wgSitewideDisableAdsOnMercury
			) {
				const adsModule = this.get('ads.module');

				adsModule.init(this.get('ads.adsUrl'));

				/*
				 * This global function is being used by our AdEngine code to provide prestitial/interstitial ads
				 * It works in similar way on Oasis: we call ads server (DFP) to check if there is targeted ad unit for a user.
				 * If there is and it's in a form of prestitial/interstitial the ad server calls our exposed JS function to
				 * display the ad in a form of modal. The ticket connected to the changes: ADEN-1834.
				 * Created lightbox might be empty in case of lack of ads, so we want to create lightbox with argument
				 * lightboxVisible=false and then decide if we want to show it.
				 */
				adsModule.createLightbox = (contents, closeButtonDelay, lightboxVisible) => {
					const actionName = lightboxVisible ? 'openLightbox' : 'createHiddenLightbox';

					if (!closeButtonDelay) {
						closeButtonDelay = 0;
					}

					this.send(actionName, 'ads', {contents}, closeButtonDelay);
				};

				adsModule.showLightbox = () => {
					this.send('showLightbox');
				};

				adsModule.setSiteHeadOffset = (offset) => {
					this.set('ads.siteHeadOffset', offset);
				};
			}

			if (fastboot.get('isFastBoot')) {
				// https://www.maxcdn.com/blog/accept-encoding-its-vary-important/
				// https://www.fastly.com/blog/best-practices-for-using-the-vary-header
				fastboot.get('response.headers').set('vary', 'cookie,accept-encoding');
				fastboot.get('response.headers').set('Content-Language', model.language.content);

				// TODO remove `transition.queryParams.page`when icache supports surrogate keys
				// and we can purge the category pages
				if (this.get('currentUser.isAuthenticated') || transition.queryParams.page) {
					disableCache(fastboot);
				} else {
					// TODO don't cache errors
					setResponseCaching(fastboot, {
						enabled: true,
						cachingPolicy: CachingPolicy.Public,
						varnishTTL: CachingInterval.standard,
						browserTTL: CachingInterval.disabled
					});
				}
			}
		},

		redirect(model, transition) {
			const fastboot = this.get('fastboot');

			if (fastboot.get('isFastBoot') && model.basePath !== `${fastboot.get('request.protocol')}://${model.host}`) {
				const fastbootRequest = this.get('fastboot.request');

				fastboot.get('response.headers').set(
					'location',
					`${model.basePath}${fastbootRequest.get('path')}${getQueryString(fastbootRequest.get('queryParams'))}`
				);
				fastboot.set('response.statusCode', 301);

				// TODO XW-3198
				// We throw error to stop Ember and redirect immediately
				throw new DontLogMeError();
			}
		},

		actions: {
			loading(transition) {
				if (this.controller) {
					this.controller.set('isLoading', true);
					transition.promise.finally(() => {
						this.controller.set('isLoading', false);
					});
				}
			},

			didTransition() {
				this.get('ads.module').onTransition();

				// Clear notification alerts for the new route
				this.controller.clearNotifications();

				if (!this.get('fastboot.isFastBoot')) {
					M.initialPageView = false;
				}
			},

			/**
			 * @param {HTMLAnchorElement} target
			 * @returns {void}
			 */
			handleLink(target) {
				const currentRoute = this.router.get('currentRouteName');

				let title,
					trackingCategory,
					info;

				if (currentRoute === 'wiki-page') {
					title = this.controllerFor('wikiPage').get('model').get('title');
				} else {
					title = '';
				}

				trackingCategory = target.dataset.trackingCategory;
				info = getLinkInfo(
					this.get('wikiVariables.basePath'),
					title,
					target.hash,
					target.href,
					target.search
				);

				/**
				 * Handle tracking
				 */
				if (trackingCategory) {
					track({
						action: trackActions.click,
						category: trackingCategory
					});
				}

				/**
				 * handle links that are external to the application
				 */
				if (target.className.indexOf('external') > -1) {
					return window.location.assign(target.href);
				}

				if (info.article) {
					this.transitionTo('wiki-page', info.article + (info.hash ? info.hash : ''));
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
					Logger.error('unable to open link', target.href);
				}
			},

			/**
			 * @returns {void}
			 */
			loadRandomArticle() {
				this.get('controller').send('toggleDrawer', false);

				ArticleModel
					.getArticleRandomTitle(this.get('wikiVariables.host'))
					.then((articleTitle) => {
						this.transitionTo('wiki-page', encodeURIComponent(normalizeToUnderscore(articleTitle)));
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
			 * @returns {void}
			 * @param {string} query
			 */
			goToSearchResults(query) {
				this.transitionTo('search', {queryParams: {query}});
			},

			openNav() {
				this.get('controller').setProperties({
					drawerContent: 'nav',
					drawerVisible: true
				});
			}
		},

		injectScriptsFastbootOnly(wikiVariables, queryParams) {
			this._super(...arguments);

			if (!this.get('fastboot.isFastBoot')) {
				return;
			}

			// Render components into FastBoot's HTML, outside of the Ember app so they're not touched when Ember starts
			const applicationInstance = getOwner(this);
			const document = applicationInstance.lookup('service:-document');
			const headBottomComponent = applicationInstance.lookup('component:fastboot-only/head-bottom');
			const bodyBottomComponent = applicationInstance.lookup('component:fastboot-only/body-bottom');

			headBottomComponent.set('wikiVariables', wikiVariables);
			headBottomComponent.appendTo(document.head);

			bodyBottomComponent.set('queryParams', queryParams);
			bodyBottomComponent.appendTo(document.body);
		}
	}
);
