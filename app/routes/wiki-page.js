import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { resolve } from 'rsvp';
import { get } from '@ember/object';
import { scheduleOnce } from '@ember/runloop';
import ArticleHandler from '../utils/wiki-handlers/article';
import BlogHandler from '../utils/wiki-handlers/blog';
import CategoryHandler from '../utils/wiki-handlers/category';
import CuratedMainPageHandler from '../utils/wiki-handlers/curated-main-page';
import FileHandler from '../utils/wiki-handlers/file';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';
import RouteWithAdsMixin from '../mixins/route-with-ads';
import WikiPageHandlerMixin from '../mixins/wiki-page-handler';
import extend from '../utils/extend';
import { normalizeToUnderscore } from '../utils/string';
import { setTrackContext, trackPageView } from '../utils/track';
import {
	namespace as mediawikiNamespace,
	isContentNamespace
} from '../utils/mediawiki-namespace';
import getAdsModule, { isAdEngine3Loaded } from '../modules/ads';
import { logError } from '../modules/event-logger';

export default Route.extend(
	WikiPageHandlerMixin,
	HeadTagsDynamicMixin,
	RouteWithAdsMixin,
	{
		ads: service(),
		currentUser: service(),
		fastboot: service(),
		i18n: service(),
		initialPageView: service(),
		logger: service(),
		wikiVariables: service(),
		wdsLiftigniter: service(),
		lightbox: service(),
		wikiUrls: service(),

		queryParams: {
			page: {
				// See controllers/category#actions.loadPage
				refreshModel: false
			}
		},

		redirectEmptyTarget: false,
		wikiHandler: null,

		/**
		 * @param {EmberStates.Transition} transition
		 * @returns {void}
		 */
		beforeModel(transition) {
			this._super(transition);

			if (!transition.data.title) {
				transition.data.title = decodeURIComponent(transition.params['wiki-page'].title);
			}

			const title = transition.data.title;

			// If you try to access article with not-yet-sanitized title you can see in logs:
			// `Transition #1: detected abort.`
			// This is caused by the transition below but doesn't mean any additional requests.
			// TODO: This could be improved upon by not using an Ember transition to 'rewrite' the URL
			// Ticket here: https://wikia-inc.atlassian.net/browse/HG-641
			if (title.indexOf(' ') > -1) {
				// title needs to be encoded here because it may be redirected to https later and url with this title
				// is put into location header. If it's not encoded and contains utf characters, then
				// "TypeError: The header content contains invalid characters" is thrown
				this.transitionTo('wiki-page', encodeURIComponent(normalizeToUnderscore(title)));
			}

			// if title is empty, we want to redirect to main page
			if (!title.length) {
				this.transitionTo('wiki-page', this.get('wikiVariables.mainPageTitle'));
			}
		},

		/**
		 * @param {*} params
		 * @returns {RSVP.Promise}
		 */
		model(params, transition) {
			const wikiVariables = this.wikiVariables;
			const host = wikiVariables.get('host');
			const modelParams = {
				host,
				title: transition.data.title,
				wiki: wikiVariables.get('dbName')
			};

			if (params.page) {
				modelParams.page = Math.max(1, params.page);
			}

			return resolve(this.getPageModel(modelParams));
		},

		/**
		 * @param {Ember.Object} model
		 * @param {EmberStates.Transition} transition
		 * @returns {void}
		 */
		afterModel(model, transition) {
			this._super(...arguments);

			if (model) {
				const fastboot = this.fastboot;
				const wikiUrls = this.wikiUrls;
				const handler = this.getHandler(model);
				let redirectTo = model.get('redirectTo');

				if (model.isRandomPage) {
					this.transitionTo('wiki-page', encodeURIComponent(normalizeToUnderscore(model.title)));
				}

				if (handler) {
					scheduleOnce('afterRender', () => {
						// Tracking has to happen after transition is done. Otherwise we track to fast and url isn't
						// updated yet. `didTransition` hook is called too fast.
						this.trackPageView(model);
					});

					transition.then(() => {
						if (!this.get('fastboot.isFastBoot')) {
							M.trackingQueue.push((isOptedIn) => {
								if (isOptedIn) {
									this.wdsLiftigniter.initLiftigniter(model.adsContext);
								}
							});
						}

						if (typeof handler.afterTransition === 'function') {
							handler.afterTransition({
								model,
								wikiId: this.get('wikiVariables.id'),
								host: this.get('wikiVariables.host'),
								fastboot,
								wikiUrls
							});
						}
					});

					if (
						!fastboot.get('isFastBoot') &&
						!transition.queryParams.noexternals
					) {
						getAdsModule().then((adsModule) => {
							if (isAdEngine3Loaded(adsModule)) {
								model.adsContext.user = model.adsContext.user || {};
								model.adsContext.user.isAuthenticated = this.get('currentUser.isAuthenticated');

								adsModule.init(model.adsContext);
							}
						});
					}

					this.set('wikiHandler', handler);

					handler.afterModel(this, ...arguments);
				} else {
					if (!redirectTo) {
						redirectTo = wikiUrls.build({
							host: this.get('wikiVariables.host'),
							wikiPage: get(transition, 'params.wiki-page.title'),
							query: extend(
								{},
								transition.state.queryParams,
								{ useskin: 'oasis' }
							)
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
				this.logger.warn('Unsupported page');
			}
		},

		/**
		 * @param {Ember.Controller} controller
		 * @param {Ember.Model} model
		 * @returns {void}
		 */
		renderTemplate(controller, model) {
			const handler = this.wikiHandler;

			if (handler) {
				this.render(handler.viewName, {
					controller: handler.controllerName,
					model
				});
			}
		},

		/**
		 *
		 * @param {Ember.Controller} controller
		 * @returns {void}
		 */
		resetController(controller) {
			controller.set('preserveScrollPosition', false);
			controller.set('commentsPage', null);
		},

		actions: {
			/**
			 * @returns {void}
			 */
			willTransition() {
				// notify a property change on soon to be stale model for observers (like
				// the Table of Contents menu) can reset appropriately
				this.notifyPropertyChange('displayTitle');

				try {
					this.ads.destroyAdSlotComponents();
				} catch (e) {
					logError('destroyAdSlotComponents', e);
				}

				this.lightbox.close();
			},

			/**
			 * @returns {boolean}
			 */
			didTransition() {
				if (this.redirectEmptyTarget) {
					this.controllerFor('application').addAlert({
						message: this.i18n.t('article.redirect-empty-target'),
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
			error(error) {
				if (this.get('fastboot.isFastBoot') && (!error.code || error.code !== 404)) {
					this.logger.error('Wiki page error', error);
				}

				this.intermediateTransitionTo('wiki-page_error', error);

				return false;
			},

			/**
			 * When we load another page for category members, we don't reload the route's model
			 * Because of that, we need to trigger the head tags update manually
			 */
			updateDynamicHeadTags() {
				this.setDynamicHeadTags(this.get('controller.model'));
			}
		},

		/**
		 * @param {Ember.Object} model
		 * @returns {Object} handler for current namespace
		 */
		getHandler(model) {
			const currentNamespace = model.ns;

			if (model.isCuratedMainPage) {
				return CuratedMainPageHandler;
			} else if (isContentNamespace(currentNamespace, this.get('wikiVariables.contentNamespaces'))) {
				return ArticleHandler;
			} else if (currentNamespace === mediawikiNamespace.CATEGORY) {
				return CategoryHandler;
			} else if (currentNamespace === mediawikiNamespace.FILE) {
				return FileHandler;
			} else if (currentNamespace === mediawikiNamespace.BLOG_ARTICLE) {
				return BlogHandler;
			} else {
				this.logger.debug(`Unsupported NS passed to getHandler - ${currentNamespace}`);
				return null;
			}
		},

		/**
		 * Custom implementation of HeadTagsMixin::setDynamicHeadTags
		 * @param {Object} model, this is model object from route::afterModel() hook
		 * @returns {void}
		 */
		setDynamicHeadTags(model) {
			const handler = this.wikiHandler,
				pageUrl = model.get('url'),
				pageFullUrl = `${this.get('wikiVariables.basePath')}${pageUrl}`,
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
				extend(data, handler.getDynamicHeadTags(model));
			}

			this._super(model, data);
		},

		/**
		 * @param {ArticleModel} model
		 * @returns {void}
		 */
		trackPageView(model) {
			const articleType = model.get('articleType'),
				namespace = model.get('ns'),
				uaDimensions = {};

			// update UA dimensions
			if (model.adsContext) {
				uaDimensions[3] = model.adsContext.targeting.wikiVertical;
				uaDimensions[14] = model.adsContext.opts.showAds ? 'yes' : 'no';
			}
			if (articleType) {
				uaDimensions[19] = articleType;
			}
			if (typeof namespace !== 'undefined') {
				uaDimensions[25] = namespace;
			}

			uaDimensions[21] = model.get('id');
			uaDimensions[28] = model.get('hasPortableInfobox') ? 'yes' : 'no';
			uaDimensions[29] = model.get('featuredVideo') ? 'yes' : 'no';

			setTrackContext({
				a: model.get('id'),
				n: namespace
			});

			trackPageView(this.initialPageView.isInitialPageView(), uaDimensions);
		}
	}
);
