import Ember from 'ember';
import UniversalAnalytics from 'common/modules/Trackers/UniversalAnalytics';
import ArticleHandler from '../utils/wiki-handlers/article';
import CategoryHandler from '../utils/wiki-handlers/category';
import CuratedMainPageHandler from '../utils/wiki-handlers/curated-main-page';
import getPageModel from '../utils/wiki-handlers/wiki-page';
import {normalizeToUnderscore} from 'common/utils/string';
import {setTrackContext, updateTrackedUrl, trackPageView} from 'common/utils/track';
import {namespace as MediawikiNamespace, getCurrentNamespace} from '../utils/mediawiki-namespace';

export default Ember.Route.extend({
	redirectEmptyTarget: false,
	wikiHandler: null,
	currentUser: Ember.inject.service(),

	getHandler(model) {
		if (model.isCuratedMainPage) {
			return CuratedMainPageHandler;
		}

		switch (getCurrentNamespace()) {
		case MediawikiNamespace.MAIN:
			return ArticleHandler;
		case MediawikiNamespace.CATEGORY:
			return CategoryHandler;
		default:
			Ember.Logger.debug(`Unsupported NS passed to getHandler - ${getCurrentNamespace()}`);
			return null;
		}
	},

	/**
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	beforeModel(transition) {
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
		if (model) {
			const exception = model.exception,
				handler = this.getHandler(model);

			if (!Ember.isEmpty(exception)) {
				Ember.Logger.warn('Wiki page model error:', exception);
			}

			this.setHeadTags(model);

			transition.then(() => {
				this.updateTrackingData(model);
			});

			this.set('wikiHandler', handler);

			handler.afterModel(this, model);
		} else {
			Ember.Logger.warn('Unsupported page');
		}
	},

	/**
	 * This function handles updating head tags like title, meta and link after transition.
	 * It uses ember-cli-meta-tags add-on.
	 * @param {ArticleModel} model
	 * @returns {void}
	 */
	setHeadTags(model) {
		const headTags = [],
			defaultHtmlTitleTemplate = '$1 - Wikia',
			pageUrl = model.get('url'),
			description = model.getWithDefault('description', ''),
			htmlTitleTemplate = Ember.get(Mercury, 'wiki.htmlTitleTemplate') || defaultHtmlTitleTemplate,
			canonicalUrl = `${Ember.get(Mercury, 'wiki.basePath')}${pageUrl}`,
			appId = Ember.get(Mercury, 'wiki.smartBanner.appId.ios'),
			appleAppContent = pageUrl ?
				`app-id=${appId}, app-argument=${Ember.get(Mercury, 'wiki.basePath')}${pageUrl}` :
				`app-id=${appId}`;

		document.title = htmlTitleTemplate.replace('$1', model.get('displayTitle'));

		headTags.push(
			{
				type: 'link',
				tagId: 'canonical-url',
				attrs: {
					rel: 'canonical',
					href: canonicalUrl
				}
			},
			{
				type: 'meta',
				tagId: 'meta-description',
				attrs: {
					name: 'description',
					content: description
				}
			}
		);

		if (appId) {
			headTags.push({
				type: 'meta',
				tagId: 'meta-apple-app',
				attrs: {
					name: 'apple-itunes-app',
					content: appleAppContent
				}
			});
		}

		this.set('headTags', headTags);
	},

	/**
	 * @param {ArticleModel} model
	 * @returns {void}
	 */
	updateTrackingData(model) {
		const articleType = model.get('articleType'),
			namespace = model.get('ns');

		if (articleType) {
			UniversalAnalytics.setDimension(19, articleType);
		}

		if (typeof namespace !== 'undefined') {
			UniversalAnalytics.setDimension(25, namespace);
		}

		setTrackContext({
			a: model.get('title'),
			n: model.get('ns')
		});

		updateTrackedUrl(window.location.href);

		this.get('currentUser.userModel').then(({powerUserTypes}) => {
			if (powerUserTypes) {
				UniversalAnalytics.setDimension(
					23,
					powerUserTypes.contains('poweruser_lifetime') ? 'yes' : 'no'
				);

				UniversalAnalytics.setDimension(
					24,
					powerUserTypes.contains('poweruser_frequent') ? 'yes' : 'no'
				);
			} else {
				UniversalAnalytics.setDimension(23, 'no');
				UniversalAnalytics.setDimension(24, 'no');
			}
		}).finally(() => {
			trackPageView(this.get('adsContext.targeting'));
		});
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
	 * Remove head tags set in server, so ember-cli-meta-tags add-on can handle by his own.
	 * This is temporary solution. Remove this when fastboot is introduced.
	 * @returns {void}
	 */
	removeHeadTagsSetInServer() {
		Ember.$('link[rel=canonical]:not([id])').remove();
		Ember.$('meta[name=description]:not([id])').remove();
		Ember.$('meta[name=apple-itunes-app]:not([id])').remove();
	},

	/**
	 * @returns {void}
	 */
	activate() {
		this.controllerFor('application').set('enableShareHeader', true);
		this.removeHeadTagsSetInServer();
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
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			const handler = this.get('wikiHandler');

			if (handler) {
				handler.didTransition(this);
			}

			if (this.get('redirectEmptyTarget')) {
				this.controllerFor('application').addAlert({
					message: i18n.t('app.article-redirect-empty-target'),
					type: 'warning'
				});
			}

			return true;
		},

		/**
		 * @param {*} error
		 * @param {EmberStates.Transition} transition
		 * @returns {boolean}
		 */
		error(error, transition) {
			if (transition) {
				transition.abort();
			}

			Ember.Logger.debug(error);

			this.controllerFor('application').addAlert({
				message: i18n.t('app.article-error'),
				type: 'alert'
			});

			return true;
		}
	},
});
