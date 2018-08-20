
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';
import { getWithDefault, get } from '@ember/object';
import Ember from 'ember';
import { isEmpty } from '@ember/utils';
import { run } from '@ember/runloop';
import config from '../config/environment';
import ArticleModel from '../models/wiki/article';
import HeadTagsStaticMixin from '../mixins/head-tags-static';
import ErrorDescriptor from '../utils/error-descriptor';
import {
	WikiVariablesRedirectError,
	DontLogMeError
} from '../utils/errors';
import {
	disableCache,
	setResponseCaching,
	CachingInterval,
	CachingPolicy
} from '../utils/fastboot-caching';
import { escapeRegex, normalizeToUnderscore } from '../utils/string';
import { track, trackActions } from '../utils/track';
import ApplicationModel from '../models/application';
import getAdsModule, { isAdEngine3Loaded } from '../modules/ads';

export default Route.extend(
	Ember.TargetActionSupport,
	HeadTagsStaticMixin,
	{
		ads: service(),
		currentUser: service(),
		fastboot: service(),
		i18n: service(),
		lightbox: service(),
		logger: service(),
		wikiUrls: service(),
		wikiVariables: service(),
		smartBanner: service(),
		router: service(),

		queryParams: {
			file: {
				replace: true,
			},
			commentsPage: {
				replace: true,
				refreshModel: false,
			},
			noexternals: {
				replace: true
			},
			uselang: {
				replace: true
			}
		},
		noexternals: null,

		beforeModel(transition) {
			this._super(transition);

			if (transition.targetName === 'wiki-page') {
				transition.data.title = decodeURIComponent(transition.params[transition.targetName].title);
			}
		},

		model(params, transition) {
			const fastboot = this.fastboot;
			const wikiPageTitle = transition.data.title;

			return ApplicationModel.create(getOwner(this).ownerInjection())
				.fetch(wikiPageTitle, transition.queryParams.uselang)
				.then((applicationData) => {
					this.wikiVariables.setProperties(applicationData.wikiVariables);

					if (fastboot.get('isFastBoot')) {
						this.injectScriptsFastbootOnly(applicationData.wikiVariables, transition.queryParams);
					}

					return applicationData;
				})
				.catch((error) => {
					if (error instanceof WikiVariablesRedirectError) {
						fastboot.get('response.headers').set(
							'location',
							error.additionalData[0].redirectLocation
						);
						fastboot.set('response.statusCode', 302);
					} else {
						this.logger.warn(`wikiVariables error: ${error}`);
					}

					throw error;
				});
		},

		afterModel(model, transition) {
			const fastboot = this.fastboot;

			this._super(...arguments);

			this.i18n.initialize(transition.queryParams.uselang || model.wikiVariables.language.content);

			if (
				!fastboot.get('isFastBoot') &&
				!transition.queryParams.noexternals
			) {

				getAdsModule().then((adsModule) => {
					if (isAdEngine3Loaded()) {
						return;
					}

					adsModule.init();

					adsModule.setSiteHeadOffset = (offset) => {
						this.set('ads.siteHeadOffset', offset);
					};

					adsModule.hideSmartBanner = () => {
						this.set('smartBanner.smartBannerVisible', false);
					};
				});
			}

			if (fastboot.get('isFastBoot')) {
				// https://www.maxcdn.com/blog/accept-encoding-its-vary-important/
				// https://www.fastly.com/blog/best-practices-for-using-the-vary-header
				fastboot.get('response.headers').set('vary', 'cookie,accept-encoding');
				fastboot.get('response.headers').set('Content-Language', model.wikiVariables.language.content);

				// Send per-wiki surrogate key header
				let surrogateKey = model.wikiVariables.surrogateKey;
				if (surrogateKey) {
					// append mobile-wiki specific key
					surrogateKey = `${surrogateKey} ${surrogateKey}-mobile-wiki`;
					fastboot.get('response.headers').set('Surrogate-Key', surrogateKey);
					fastboot.get('response.headers').set('X-Surrogate-Key', surrogateKey);
				}

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

		redirect(model) {
			const fastboot = this.fastboot,
				basePath = model.wikiVariables.basePath;

			if (fastboot.get('isFastBoot')) {
				const protocol = fastboot.get('request.headers').get('fastly-ssl')
					? 'https:'
					: fastboot.get('request.protocol');
				const fastbootRequest = this.get('fastboot.request');

				if (basePath === `${protocol}//${model.wikiVariables.host}`) {
					return;
				}

				// PLATFORM-3351 - if x-wikia-wikiaappsid is present, allow https even if basePath is set to http.
				if (fastbootRequest.get('headers').get('x-wikia-wikiaappsid') &&
					basePath === `http://${model.wikiVariables.host}`
				) {
					return;
				}

				fastboot.get('response.headers').set(
					'location',
					`${basePath}${fastbootRequest.get('path')}`
				);

				// Use a 302 redirect for HTTPS downgrades to match the behaviour on Fastly for now (PLATFORM-3523)
				if (protocol === 'https:' && basePath === `http://${model.wikiVariables.host}`) {
					fastboot.set('response.statusCode', 302);
				} else {
					fastboot.set('response.statusCode', 301);
				}

				// TODO XW-3198
				// We throw error to stop Ember and redirect immediately
				throw new DontLogMeError();
			}
		},

		activate() {
			// Qualaroo custom parameters
			if (!this.get('fastboot.isFastBoot') && window._kiq) {
				window._kiq.push(['set', {
					isLoggedIn: this.get('currentUser.isAuthenticated'),
					contentLanguage: this.get('wikiVariables.language.content')
				}]);
			}
		},

		setupController(controller, model) {
			controller.set('model', model);

			if (!this.get('fastboot.isFastBoot')) {
				// Prevent scrolling to the top of the page after Ember is loaded
				// See https://github.com/dollarshaveclub/ember-router-scroll/issues/55#issuecomment-313824423
				const routerScroll = this.get('_router.service');
				routerScroll.set('key', get(window, 'history.state.uuid'));
				routerScroll.update();

				run.scheduleOnce('afterRender', () => {
					const scrollPosition = routerScroll.get('position');
					window.scrollTo(scrollPosition.x, scrollPosition.y);
				});
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
				if (this.get('ads.module')) {
					this.get('ads.module').onTransition();
				}

				// Clear notification alerts for the new route
				this.controller.clearNotifications();

				// sets number of page views for Qualaroo
				if (window._kiq) {
					window._kiq.push(['set', { page_views: this.get('router._routerMicrolib.currentSequence') }]);
				}
			},

			error(error, transition) {
				const fastboot = this.fastboot;

				// TODO XW-3198
				// Don't handle special type of errors. Currently we use them hack Ember and stop executing application
				if (error instanceof DontLogMeError) {
					return false;
				}

				this.logger.error('Application error', error);
				if (fastboot.get('isFastBoot')) {
					fastboot.get('shoebox').put('serverError', true);
					fastboot.set('response.statusCode', getWithDefault(error, 'code', 503));
					this.injectScriptsFastbootOnly(null, transition.queryParams);

					// We can't use the built-in mechanism to render error substates.
					// When FastBoot sees that application route sends error, it dies.
					// Instead, we transition to the error substate manually.
					const errorDescriptor = ErrorDescriptor.create({ error });
					this.intermediateTransitionTo('application_error', errorDescriptor);
					return false;
				}

				return true;
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
				info = this.wikiUrls.getLinkInfo(
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
					const domainRegex = new RegExp(
						`^https?:\\/\\/[^\\/]+\\.${escapeRegex(config.productionBaseDomain)}\\/.*$`
					);

					if (info.url.charAt(0) === '#' || info.url.match(domainRegex)) {
						window.location.assign(info.url);
					} else {
						window.open(info.url);
					}
				} else {
					// Reaching this clause means something is probably wrong.
					this.logger.error('Unable to open link', target.href);
				}
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
			const bodyBottomComponent = applicationInstance.lookup('component:fastboot-only/body-bottom');

			bodyBottomComponent.appendTo(document.body);
		}
	}
);
