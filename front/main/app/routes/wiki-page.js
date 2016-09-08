import Ember from 'ember';
import ArticleHandler from '../utils/wiki-handlers/article';
import CategoryHandler from '../utils/wiki-handlers/category';
import CuratedMainPageHandler from '../utils/wiki-handlers/curated-main-page';
import HeadTagsDynamicMixin from '../mixins/head-tags-dynamic';
import RouteWithAdsMixin from '../mixins/route-with-ads';
import RouteWithBodyClassNameMixin from '../mixins/route-with-body-class-name';
import getPageModel from '../utils/wiki-handlers/wiki-page';
import {normalizeToUnderscore} from 'common/utils/string';
import {setTrackContext, trackPageView} from 'common/utils/track';
import {namespace as mediawikiNamespace, isContentNamespace} from '../utils/mediawiki-namespace';

export default Ember.Route.extend(
	HeadTagsDynamicMixin,
	RouteWithAdsMixin,
	RouteWithBodyClassNameMixin,
	{
		bodyClassNames: ['show-global-footer', 'show-global-footer-full-site-link'],
		redirectEmptyTarget: false,
		wikiHandler: null,
		currentUser: Ember.inject.service(),
		curatedMainPageData: Ember.inject.service(),
		ns: Ember.computed.alias('curatedMainPageData.ns'),
		adsContext: Ember.computed.alias('curatedMainPageData.adsContext'),
		description: Ember.computed.alias('curatedMainPageData.description'),
		ads: Ember.inject.service(),

		/**
		 * @param {Ember.model} model
		 * @returns {Object} handler for current namespace
		 */
		getHandler(model) {
			const currentNamespace = model.ns;

			if (model.isCuratedMainPage) {
				return CuratedMainPageHandler;
			} else if (isContentNamespace(currentNamespace)) {
				return ArticleHandler;
			} else if (currentNamespace === mediawikiNamespace.CATEGORY) {
				return CategoryHandler;
			} else {
				Ember.Logger.debug(`Unsupported NS passed to getHandler - ${currentNamespace}`);
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
				this.transitionTo('wiki-page', Ember.get(Mercury, 'wiki.mainPageTitle'));
			}
		},

		/**
		 * @param {*} params
		 * @returns {Ember.RSVP.Promise}
		 */
		model(params) {
			return getPageModel({
				basePath: Mercury.wiki.basePath,
				title: params.title,
				wiki: this.controllerFor('application').get('domain')
			});
		},

		/**
		 * @param {Ember.Object} model
		 * @param {EmberStates.Transition} transition
		 * @returns {void}
		 */
		afterModel(model, transition) {
			this._super(...arguments);

			if (model) {
				const handler = this.getHandler(model);

				if (handler) {
					transition.then(() => {
						this.updateTrackingData(model);

						if (typeof handler.afterTransition === 'function') {
							handler.afterTransition(model);
						}
					});

					this.set('wikiHandler', handler);

					handler.afterModel(this, model);
				} else {
					transition.abort();
					window.location.assign(M.buildUrl({
						wikiPage: Ember.get(transition, 'params.wiki-page.title'),
						query: {
							useskin: 'oasis'
						}
					}));
				}
			} else {
				Ember.Logger.warn('Unsupported page');
			}
		},

		/**
		 * Custom implementation of HeadTagsMixin::setDynamicHeadTags
		 * @param {Object} model, this is model object from route::afterModel() hook
		 * @returns {void}
		 */
		setDynamicHeadTags(model) {
			const pageUrl = model.get('url'),
				pageFullUrl = `${Ember.get(Mercury, 'wiki.basePath')}${pageUrl}`,
				data = {
					documentTitle: model.get('documentTitle'),
					description: model.get('description'),
					robots: 'index,follow',
					canonical: pageFullUrl
				};

			if (pageUrl) {
				data.appArgument = pageFullUrl;
			}

			this._super(model, data);
		},

		/**
		 * @param {ArticleModel} model
		 * @returns {void}
		 */
		updateTrackingData(model) {
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

		/**
		 * @returns {void}
		 */
		activate() {
			this.controllerFor('application').set('enableShareHeader', true);
		},

		/**
		 * @returns {void}
		 */
		deactivate() {
			this.controllerFor('application').set('enableShareHeader', false);
		},

		actions: {
			/**
			 * @returns {void}
			 */
			willTransition() {
				// notify a property change on soon to be stale model for observers (like
				// the Table of Contents menu) can reset appropriately
				this.notifyPropertyChange('displayTitle');
				this.get('ads').destroyInContentAds();
			},

			/**
			 * @returns {boolean}
			 */
			didTransition() {
				if (this.get('redirectEmptyTarget')) {
					this.controllerFor('application').addAlert({
						message: i18n.t('app.article-redirect-empty-target'),
						type: 'warning'
					});
				}

				return true;
			}
		}
	});
