define('mobile-wiki/routes/wiki-page', ['exports', 'mobile-wiki/utils/wiki-handlers/article', 'mobile-wiki/utils/wiki-handlers/blog', 'mobile-wiki/utils/wiki-handlers/category', 'mobile-wiki/utils/wiki-handlers/curated-main-page', 'mobile-wiki/utils/wiki-handlers/file', 'mobile-wiki/mixins/head-tags-dynamic', 'mobile-wiki/mixins/route-with-ads', 'mobile-wiki/mixins/wiki-page-handler', 'mobile-wiki/utils/extend', 'mobile-wiki/utils/string', 'mobile-wiki/utils/track', 'mobile-wiki/utils/url', 'mobile-wiki/utils/mediawiki-namespace'], function (exports, _article, _blog, _category, _curatedMainPage, _file, _headTagsDynamic, _routeWithAds, _wikiPageHandler, _extend, _string, _track, _url, _mediawikiNamespace) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Route = Ember.Route,
	    RSVP = Ember.RSVP,
	    inject = Ember.inject,
	    get = Ember.get;
	exports.default = Route.extend(_wikiPageHandler.default, _headTagsDynamic.default, _routeWithAds.default, {
		redirectEmptyTarget: false,
		wikiHandler: null,
		ads: inject.service(),
		currentUser: inject.service(),
		fastboot: inject.service(),
		i18n: inject.service(),
		initialPageView: inject.service(),
		logger: inject.service(),
		wikiVariables: inject.service(),
		liftigniter: inject.service(),

		queryParams: {
			page: {
				// See controllers/category#actions.loadPage
				refreshModel: false
			}
		},

		/**
   * @param {Ember.Object} model
   * @returns {Object} handler for current namespace
   */
		getHandler: function getHandler(model) {
			var currentNamespace = model.ns;

			if (model.isCuratedMainPage) {
				return _curatedMainPage.default;
			} else if ((0, _mediawikiNamespace.isContentNamespace)(currentNamespace, this.get('wikiVariables.contentNamespaces'))) {
				return _article.default;
			} else if (currentNamespace === _mediawikiNamespace.namespace.CATEGORY) {
				return _category.default;
			} else if (currentNamespace === _mediawikiNamespace.namespace.FILE) {
				return _file.default;
			} else if (currentNamespace === _mediawikiNamespace.namespace.BLOG_ARTICLE) {
				return _blog.default;
			} else {
				this.get('logger').debug('Unsupported NS passed to getHandler - ' + currentNamespace);
				return null;
			}
		},


		/**
   *
   * @param {Ember.Controller} controller
   * @returns {void}
   */
		resetController: function resetController(controller) {
			controller.set('preserveScrollPosition', false);
		},


		/**
   * @param {EmberStates.Transition} transition
   * @returns {void}
   */
		beforeModel: function beforeModel(transition) {
			this._super(transition);

			var title = transition.params['wiki-page'].title.replace('wiki/', '');

			this.controllerFor('application').send('closeLightbox');

			// If you try to access article with not-yet-sanitized title you can see in logs:
			// `Transition #1: detected abort.`
			// This is caused by the transition below but doesn't mean any additional requests.
			// TODO: This could be improved upon by not using an Ember transition to 'rewrite' the URL
			// Ticket here: https://wikia-inc.atlassian.net/browse/HG-641
			if (title.indexOf(' ') > -1) {
				this.transitionTo('wiki-page', (0, _string.normalizeToUnderscore)(title));
			}

			// if title is empty, we want to redirect to main page
			if (!title.length) {
				this.transitionTo('wiki-page', this.get('wikiVariables.mainPageTitle'));
			}
		},


		/**
   * @param {*} params
   * @returns {Ember.RSVP.Promise}
   */
		model: function model(params) {
			var wikiVariables = this.get('wikiVariables');
			var host = wikiVariables.get('host');
			var modelParams = {
				host: host,
				title: params.title,
				wiki: wikiVariables.get('dbName')
			};

			if (params.page) {
				modelParams.page = params.page;
			}

			return RSVP.resolve(this.getPageModel(modelParams));
		},


		/**
   * @param {Ember.Object} model
   * @param {EmberStates.Transition} transition
   * @returns {void}
   */
		afterModel: function afterModel(model, transition) {
			var _this = this;

			this._super.apply(this, arguments);

			if (model) {
				var fastboot = this.get('fastboot');
				var handler = this.getHandler(model);
				var redirectTo = model.get('redirectTo');

				if (handler) {
					transition.then(function () {
						_this.get('liftigniter').initLiftigniter(model.adsContext);

						// Tracking has to happen after transition is done. Otherwise we track to fast and url isn't
						// updated yet. `didTransition` hook is called too fast.
						_this.trackPageView(model);

						if (typeof handler.afterTransition === 'function') {
							handler.afterTransition({
								model: model,
								wikiId: _this.get('wikiVariables.id'),
								host: _this.get('wikiVariables.host'),
								fastboot: fastboot
							});
						}
					});

					this.set('wikiHandler', handler);

					handler.afterModel.apply(handler, [this].concat(Array.prototype.slice.call(arguments)));
				} else {
					if (!redirectTo) {
						redirectTo = (0, _url.buildUrl)({
							host: this.get('wikiVariables.host'),
							wikiPage: get(transition, 'params.wiki-page.title'),
							query: (0, _extend.default)({}, transition.state.queryParams, { useskin: 'oasis' })
						});
					}

					if (fastboot.get('isFastBoot')) {
						fastboot.get('response.headers').set('location', redirectTo);
						fastboot.set('response.statusCode', 301);
					} else {
						window.location.replace(redirectTo);
					}
				}
			} else {
				this.get('logger').warn('Unsupported page');
			}
		},


		/**
   * Custom implementation of HeadTagsMixin::setDynamicHeadTags
   * @param {Object} model, this is model object from route::afterModel() hook
   * @returns {void}
   */
		setDynamicHeadTags: function setDynamicHeadTags(model) {
			var handler = this.get('wikiHandler'),
			    pageUrl = model.get('url'),
			    pageFullUrl = '' + this.get('wikiVariables.basePath') + pageUrl,
			    data = {
				htmlTitle: model.get('htmlTitle'),
				description: model.get('description'),
				robots: 'index,follow',
				canonical: pageFullUrl,
				amphtml: model.get('amphtml')
			};

			if (pageUrl) {
				data.appArgument = pageFullUrl;
			}

			if (handler && typeof handler.getDynamicHeadTags === 'function') {
				(0, _extend.default)(data, handler.getDynamicHeadTags(model));
			}

			this._super(model, data);
		},


		/**
   * @param {ArticleModel} model
   * @returns {void}
   */
		trackPageView: function trackPageView(model) {
			var articleType = model.get('articleType'),
			    namespace = model.get('ns'),
			    uaDimensions = {};

			// update UA dimensions
			if (model.adsContext) {
				uaDimensions[3] = model.adsContext.targeting.wikiVertical;
				uaDimensions[14] = model.adsContext.opts.showAds ? 'Yes' : 'No';
			}
			if (articleType) {
				uaDimensions[19] = articleType;
			}
			if (typeof namespace !== 'undefined') {
				uaDimensions[25] = namespace;
			}

			uaDimensions[28] = model.get('hasPortableInfobox') ? 'Yes' : 'No';
			uaDimensions[29] = model.get('featuredVideo') ? 'Yes' : 'No';

			(0, _track.setTrackContext)({
				a: model.get('id'),
				n: model.get('ns')
			});

			(0, _track.trackPageView)(this.get('initialPageView').isInitialPageView(), uaDimensions);
		},


		/**
   * @param {Ember.Controller} controller
   * @param {Ember.Model} model
   * @returns {void}
   */
		renderTemplate: function renderTemplate(controller, model) {
			var handler = this.get('wikiHandler');

			if (handler) {
				this.render(handler.viewName, {
					controller: handler.controllerName,
					model: model
				});
			}
		},


		actions: {
			/**
    * @returns {void}
    */
			willTransition: function willTransition() {
				// notify a property change on soon to be stale model for observers (like
				// the Table of Contents menu) can reset appropriately
				this.notifyPropertyChange('displayTitle');
				this.get('ads').destroyAdSlotComponents();
			},


			/**
    * @returns {boolean}
    */
			didTransition: function didTransition() {
				if (this.get('redirectEmptyTarget')) {
					this.controllerFor('application').addAlert({
						message: this.get('i18n').t('article.redirect-empty-target'),
						type: 'warning'
					});
				}

				return true;
			},


			/**
    * We can't use the built-in mechanism to render error substates
    * It bubbles the error to application route and then FastBoot dies
    * Instead, we transition to substate manually and prevent the bubbling
    *
    * @param {EmberError} error
    * @returns {boolean}
    */
			error: function error(_error) {
				if (this.get('fastboot.isFastBoot') && (!_error.code || _error.code !== 404)) {
					this.get('logger').error('Wiki page error', _error);
				}

				this.intermediateTransitionTo('wiki-page_error', _error);

				return false;
			},


			/**
    * When we load another page for category members, we don't reload the route's model
    * Because of that, we need to trigger the head tags update manually
    */
			updateDynamicHeadTags: function updateDynamicHeadTags() {
				this.setDynamicHeadTags(this.get('controller.model'));
			},


			/**
    * @param {string} lightboxType
    * @param {*} [lightboxModel]
    * @param {number} [closeButtonDelay]
    * @returns {void}
    */
			openLightbox: function openLightbox(lightboxType, lightboxModel, closeButtonDelay) {
				this.get('controller').send('openLightbox', lightboxType, lightboxModel, closeButtonDelay);
			}
		}
	});
});