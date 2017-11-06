define('mobile-wiki/routes/application', ['exports', 'mobile-wiki/models/wiki/article', 'mobile-wiki/mixins/head-tags-static', 'mobile-wiki/utils/article-link', 'mobile-wiki/utils/error-descriptor', 'mobile-wiki/utils/errors', 'mobile-wiki/utils/fastboot-caching', 'mobile-wiki/utils/string', 'mobile-wiki/utils/track', 'mobile-wiki/utils/url', 'mobile-wiki/models/application'], function (exports, _article, _headTagsStatic, _articleLink, _errorDescriptor, _errors, _fastbootCaching, _string, _track, _url, _application) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Route = Ember.Route;
	var getOwner = Ember.getOwner;
	var TargetActionSupport = Ember.TargetActionSupport;
	exports.default = Route.extend(TargetActionSupport, _headTagsStatic.default, {
		ads: service(),
		currentUser: service(),
		fastboot: service(),
		i18n: service(),
		logger: service(),
		wikiVariables: service(),

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

		model: function model(params, transition) {
			var _this = this;

			var fastboot = this.get('fastboot');

			// We need the wiki page title for setting tracking dimensions in ApplicationModel.
			// Instead of waiting for the wiki page model to resolve,
			// let's just use the value from route params.
			var wikiPageTitle = void 0;

			if (transition.targetName === 'wiki-page') {
				wikiPageTitle = transition.params['wiki-page'].title;
			}

			return _application.default.create(getOwner(this).ownerInjection()).fetch(wikiPageTitle, transition.queryParams.uselang).then(function (applicationData) {
				_this.get('wikiVariables').setProperties(applicationData.wikiVariables);

				if (fastboot.get('isFastBoot')) {
					_this.injectScriptsFastbootOnly(applicationData.wikiVariables, transition.queryParams);
				}

				return applicationData;
			}).catch(function (error) {
				_this.get('logger').warn('wikiVariables error: ' + error);
				if (error instanceof _errors.WikiVariablesRedirectError) {
					fastboot.get('response.headers').set('location', error.additionalData[0].redirectLocation);
					fastboot.set('response.statusCode', 302);
				}

				throw error;
			});
		},
		afterModel: function afterModel(model, transition) {
			var _this2 = this;

			var instantGlobals = window.Wikia && window.Wikia.InstantGlobals || {},
			    fastboot = this.get('fastboot');

			this._super.apply(this, arguments);

			this.get('i18n').initialize(transition.queryParams.uselang || model.wikiVariables.language.content);

			if (!fastboot.get('isFastBoot') && this.get('ads.adsUrl') && !transition.queryParams.noexternals && !instantGlobals.wgSitewideDisableAdsOnMercury) {
				var adsModule = this.get('ads.module');

				adsModule.init(this.get('ads.adsUrl'));

				/*
     * This global function is being used by our AdEngine code to provide prestitial/interstitial ads
     * It works in similar way on Oasis: we call ads server (DFP) to check if there is targeted ad unit for a user.
     * If there is and it's in a form of prestitial/interstitial the ad server calls our exposed JS function to
     * display the ad in a form of modal. The ticket connected to the changes: ADEN-1834.
     * Created lightbox might be empty in case of lack of ads, so we want to create lightbox with argument
     * lightboxVisible=false and then decide if we want to show it.
     */
				adsModule.createLightbox = function (contents, closeButtonDelay, lightboxVisible) {
					var actionName = lightboxVisible ? 'openLightbox' : 'createHiddenLightbox';

					if (!closeButtonDelay) {
						closeButtonDelay = 0;
					}

					_this2.send(actionName, 'ads', { contents: contents }, closeButtonDelay);
				};

				adsModule.showLightbox = function () {
					_this2.send('showLightbox');
				};

				adsModule.setSiteHeadOffset = function (offset) {
					_this2.set('ads.siteHeadOffset', offset);
				};
			}

			if (fastboot.get('isFastBoot')) {
				// https://www.maxcdn.com/blog/accept-encoding-its-vary-important/
				// https://www.fastly.com/blog/best-practices-for-using-the-vary-header
				fastboot.get('response.headers').set('vary', 'cookie,accept-encoding');
				fastboot.get('response.headers').set('Content-Language', model.wikiVariables.language.content);

				// TODO remove `transition.queryParams.page`when icache supports surrogate keys
				// and we can purge the category pages
				if (this.get('currentUser.isAuthenticated') || transition.queryParams.page) {
					(0, _fastbootCaching.disableCache)(fastboot);
				} else {
					// TODO don't cache errors
					(0, _fastbootCaching.setResponseCaching)(fastboot, {
						enabled: true,
						cachingPolicy: _fastbootCaching.CachingPolicy.Public,
						varnishTTL: _fastbootCaching.CachingInterval.standard,
						browserTTL: _fastbootCaching.CachingInterval.disabled
					});
				}
			}
		},
		redirect: function redirect(model) {
			var fastboot = this.get('fastboot'),
			    basePath = model.wikiVariables.basePath;

			if (fastboot.get('isFastBoot') && basePath !== fastboot.get('request.protocol') + '//' + model.wikiVariables.host) {
				var fastbootRequest = this.get('fastboot.request');

				fastboot.get('response.headers').set('location', '' + basePath + fastbootRequest.get('path') + (0, _url.getQueryString)(fastbootRequest.get('queryParams')));
				fastboot.set('response.statusCode', 301);

				// TODO XW-3198
				// We throw error to stop Ember and redirect immediately
				throw new _errors.DontLogMeError();
			}
		},


		actions: {
			loading: function loading(transition) {
				var _this3 = this;

				if (this.controller) {
					this.controller.set('isLoading', true);
					transition.promise.finally(function () {
						_this3.controller.set('isLoading', false);
					});
				}
			},
			didTransition: function didTransition() {
				this.get('ads.module').onTransition();

				// Clear notification alerts for the new route
				this.controller.clearNotifications();
			},
			error: function error(_error, transition) {
				var fastboot = this.get('fastboot');

				// TODO XW-3198
				// Don't handle special type of errors. Currently we use them hack Ember and stop executing application
				if (_error instanceof _errors.DontLogMeError) {
					return false;
				}

				this.get('logger').error('Application error', _error);

				if (fastboot.get('isFastBoot')) {
					fastboot.get('shoebox').put('serverError', true);
					fastboot.set('response.statusCode', 503);
					this.injectScriptsFastbootOnly(null, transition.queryParams);

					// We can't use the built-in mechanism to render error substates.
					// When FastBoot sees that application route sends error, it dies.
					// Instead, we transition to the error substate manually.
					var errorDescriptor = _errorDescriptor.default.create({ error: _error });
					this.intermediateTransitionTo('application_error', errorDescriptor);
					return false;
				}

				return true;
			},


			/**
    * @param {HTMLAnchorElement} target
    * @returns {void}
    */
			handleLink: function handleLink(target) {
				var currentRoute = this.router.get('currentRouteName');

				var title = void 0,
				    trackingCategory = void 0,
				    info = void 0;

				if (currentRoute === 'wiki-page') {
					title = this.controllerFor('wikiPage').get('model').get('title');
				} else {
					title = '';
				}

				trackingCategory = target.dataset.trackingCategory;
				info = (0, _articleLink.default)(this.get('wikiVariables.basePath'), title, target.hash, target.href, target.search);

				/**
     * Handle tracking
     */
				if (trackingCategory) {
					(0, _track.track)({
						action: _track.trackActions.click,
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
					if (info.url.charAt(0) === '#' || info.url.match(/^https?:\/\/.*\.wikia(-.*)?\.com.*\/.*$/)) {
						window.location.assign(info.url);
					} else {
						window.open(info.url);
					}
				} else {
					// Reaching this clause means something is probably wrong.
					this.get('logger').error('Unable to open link', target.href);
				}
			},


			/**
    * @returns {void}
    */
			loadRandomArticle: function loadRandomArticle() {
				var _this4 = this;

				this.get('controller').send('toggleDrawer', false);

				_article.default.create(getOwner(this).ownerInjection()).getArticleRandomTitle().then(function (articleTitle) {
					_this4.transitionTo('wiki-page', encodeURIComponent((0, _string.normalizeToUnderscore)(articleTitle)));
				}).catch(function (err) {
					_this4.send('error', err);
				});
			},


			// We need to proxy these actions because of the way Ember is bubbling them up through routes
			// see http://emberjs.com/images/template-guide/action-bubbling.png
			/**
    * @returns {void}
    */
			handleLightbox: function handleLightbox() {
				this.get('controller').send('handleLightbox');
			},


			/**
    * @param {string} lightboxType
    * @param {*} [lightboxModel]
    * @returns {void}
    */
			createHiddenLightbox: function createHiddenLightbox(lightboxType, lightboxModel) {
				this.get('controller').send('createHiddenLightbox', lightboxType, lightboxModel);
			},


			/**
    * @returns {void}
    */
			showLightbox: function showLightbox() {
				this.get('controller').send('showLightbox');
			},


			/**
    * @returns {void}
    */
			closeLightbox: function closeLightbox() {
				this.get('controller').send('closeLightbox');
			},


			// This is used only in not-found.hbs template
			/**
    * @returns {void}
    * @param {string} query
    */
			goToSearchResults: function goToSearchResults(query) {
				this.transitionTo('search', { queryParams: { query: query } });
			},
			openNav: function openNav() {
				this.get('controller').setProperties({
					drawerContent: 'nav',
					drawerVisible: true
				});
			}
		},

		injectScriptsFastbootOnly: function injectScriptsFastbootOnly(wikiVariables, queryParams) {
			this._super.apply(this, arguments);

			if (!this.get('fastboot.isFastBoot')) {
				return;
			}

			// Render components into FastBoot's HTML, outside of the Ember app so they're not touched when Ember starts
			var applicationInstance = getOwner(this);
			var document = applicationInstance.lookup('service:-document');
			var headBottomComponent = applicationInstance.lookup('component:fastboot-only/head-bottom');
			var bodyBottomComponent = applicationInstance.lookup('component:fastboot-only/body-bottom');

			headBottomComponent.set('wikiVariables', wikiVariables);
			headBottomComponent.appendTo(document.head);

			bodyBottomComponent.set('queryParams', queryParams);
			bodyBottomComponent.appendTo(document.body);
		}
	});
});