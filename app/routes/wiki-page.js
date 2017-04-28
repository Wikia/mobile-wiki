import Ember from 'ember';
import ArticleHandler from '../utils/wiki-handlers/article';
import CategoryHandler from '../utils/wiki-handlers/category';
import CuratedMainPageHandler from '../utils/wiki-handlers/curated-main-page';
import FileHandler from '../utils/wiki-handlers/file';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';
import RouteWithAdsMixin from '../mixins/route-with-ads';
import WikiPageHandlerMixin from '../mixins/wiki-page-handler';
import extend from '../utils/extend';
import {normalizeToUnderscore} from '../utils/string';
import {setTrackContext, trackPageView} from '../utils/track';
import {buildUrl} from '../utils/url';
import {namespace as mediawikiNamespace, isContentNamespace} from '../utils/mediawiki-namespace';

const {Route, RSVP, $, inject, get} = Ember;

export default Route.extend(
	WikiPageHandlerMixin,
	HeadTagsDynamicMixin,
	RouteWithAdsMixin,
	{
		redirectEmptyTarget: false,
		wikiHandler: null,
		ads: inject.service(),
		currentUser: inject.service(),
		fastboot: inject.service(),
		i18n: inject.service(),
		logger: inject.service(),
		wikiVariables: inject.service(),

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
			} else {
				this.get('logger').debug(`Unsupported NS passed to getHandler - ${currentNamespace}`);
				return null;
			}
		},

		/**
		 * @param {EmberStates.Transition} transition
		 * @returns {void}
		 */
		beforeModel(transition) {
			this._super();

			const title = transition.params['wiki-page'].title.replace('wiki/', '');

			this.controllerFor('application').send('closeLightbox');

			// If you try to access article with not-yet-sanitized title you can see in logs:
			// `Transition #1: detected abort.`
			// This is caused by the transition below but doesn't mean any additional requests.
			// TODO: This could be improved upon by not using an Ember transition to 'rewrite' the URL
			// Ticket here: https://wikia-inc.atlassian.net/browse/HG-641
			if (title.indexOf(' ') > -1) {
				this.transitionTo('wiki-page', normalizeToUnderscore(title));
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
		model(params) {
			const wikiVariables = this.get('wikiVariables');
			const host = wikiVariables.get('host');
			const modelParams = {
				host,
				title: params.title,
				wiki: wikiVariables.get('dbName')
			};

			if (params.page) {
				modelParams.page = params.page;
			}

			return RSVP.resolve(this.getPageModel(
				modelParams,
				this.get('wikiVariables.contentNamespaces')
			));
		},

		/**
		 * @param {Ember.Object} model
		 * @param {EmberStates.Transition} transition
		 * @returns {void}
		 */
		afterModel(model, transition) {
			this._super(...arguments);

			if (model) {
				const fastboot = this.get('fastboot');
				const handler = this.getHandler(model);
				let redirectTo = model.get('redirectTo');

				if (handler) {
					transition.then(() => {
						// Tracking has to happen after transition is done. Otherwise we track to fast and url isn't
						// updated yet. `didTrasition` hook is called too fast.
						this.trackPageView(model);

						if (typeof handler.afterTransition === 'function') {
							handler.afterTransition(model, this.get('wikiVariables.id'), this.get('wikiVariables.host'));
						}
					});

					this.set('wikiHandler', handler);

					handler.afterModel(this, ...arguments);
				} else {
					if (!redirectTo) {
						redirectTo = buildUrl({
							host: this.get('wikiVariables.host'),
							wikiPage: get(transition, 'params.wiki-page.title'),
							query: {
								useskin: 'oasis'
							}
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
		setDynamicHeadTags(model) {
			const handler = this.get('wikiHandler'),
				pageUrl = model.get('url'),
				pageFullUrl = `${this.get('wikiVariables.basePath')}${pageUrl}`,
				data = {
					htmlTitle: model.get('htmlTitle'),
					description: model.get('description'),
					robots: 'index,follow',
					canonical: pageFullUrl
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
				uaDimensions[14] = model.adsContext.opts.showAds ? 'Yes' : 'No';
			}
			if (articleType) {
				uaDimensions[19] = articleType;
			}
			if (typeof namespace !== 'undefined') {
				uaDimensions[25] = namespace;
			}

			setTrackContext({
				a: model.get('id'),
				n: model.get('ns')
			});

			trackPageView(uaDimensions);
		},

		/**
		 * @param {Ember.Controller} controller
		 * @param {Ember.Model} model
		 * @returns {void}
		 */
		renderTemplate(controller, model) {
			const handler = this.get('wikiHandler');

			if (handler) {
				this.render(handler.viewName, {
					controller: handler.controllerName,
					model
				});
			}
		},

		actions: {
			/**
			 * @returns {void}
			 */
			willTransition() {
				// notify a property change on soon to be stale model for observers (like
				// the Table of Contents menu) can reset appropriately
				this.notifyPropertyChange('displayTitle');
				this.get('ads').destroyAdSlotComponents();
			},

			/**
			 * @returns {boolean}
			 */
			didTransition() {
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
			error(error) {
				if (this.get('fastboot.isFastBoot') && (!error.code || error.code !== 404)) {
					this.get('logger').error('Wiki page error', error);
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
		}
	}
);
