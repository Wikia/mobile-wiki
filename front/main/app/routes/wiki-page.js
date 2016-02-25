import Ember from 'ember';
import UniversalAnalytics from 'common/modules/Trackers/UniversalAnalytics';
import ArticleHandler from '../utils/mediawiki-handlers/article';
import CategoryHandler from '../utils/mediawiki-handlers/category';
import CuratedMainPageHandler from '../utils/mediawiki-handlers/curated-main-page';
import WikiPageModel from '../models/mediawiki/wiki-page';
import {normalizeToUnderscore} from 'common/utils/string';
import {setTrackContext, updateTrackedUrl, trackPageView} from 'common/utils/track';
import {namespace as MediawikiNamespace, getCurrentNamespace} from '../utils/mediawiki-namespace';

export default Ember.Route.extend({
	redirectEmptyTarget: false,
	mediaWikiHandler: null,
	currentUser: Ember.inject.service(),

	getHandler(model) {
		if (model.isCuratedMainPage) {
			return CuratedMainPageHandler;
		// This check is done here because promise in article model in case of 404 error
		// is resolved instead of being rejected
		} else if (Ember.get(model, 'exception.code') === 404) {
			return ArticleHandler;
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
		return WikiPageModel.find({
			basePath: Mercury.wiki.basePath,
			title: params.title,
			wiki: this.controllerFor('application').get('domain')
		});
	},

	/**
	 * @param {ArticleModel} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	afterModel(model, transition) {
		const exception = model.get('exception'),
			handler = this.getHandler(model);

		if (!Ember.isEmpty(exception)) {
			Ember.Logger.warn('Page model error:', exception);
		}

		transition.then(() => {
			this.updateTrackingData(model);
		});

		this.set('mediaWikiHandler', handler);

		if (handler) {
			handler.afterModel(this, model);
		}
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

			trackPageView(this.get('adsContext.targeting'));
		}).catch(() => {
			trackPageView(this.get('adsContext.targeting'));
		});
	},

	/**
	 * @param {Ember.controller} controller
	 * @param {Ember.model} model
	 * @returns {void}
	 */
	renderTemplate(controller, model) {
		this.render(this.get('mediaWikiHandler').viewName, {
			controller: this.get('mediaWikiHandler').controllerName,
			model
		});
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
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			this.get('mediaWikiHandler').didTransition(this);

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
