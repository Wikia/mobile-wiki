import Ember from 'ember';
import {normalizeToUnderscore} from 'common/utils/string';
import UniversalAnalytics from 'common/modules/Trackers/UniversalAnalytics';
import ArticleHandler from '../utils/mediawiki-handlers/article';
import CategoryHandler from '../utils/mediawiki-handlers/category';
import CuratedMainPageHandler from '../utils/mediawiki-handlers/curated-main-page';
import getPageModel from '../utils/mediawiki-handlers/wiki-page';
import {namespace as MediawikiNamespace, getCurrentNamespace} from '../utils/mediawiki-namespace';

export default Ember.Route.extend({
	redirectEmptyTarget: false,
	mediaWikiHandler: null,

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
	 * @param {ArticleModel} model
	 * @returns {void}
	 */
	afterModel(model) {
		if (model) {
			const exception = model.exception,
				articleType = model.articleType,
				handler = this.getHandler(model);

			if (!Ember.isEmpty(exception)) {
				Ember.Logger.warn('Page model error:', exception);
			}

			if (articleType) {
				UniversalAnalytics.setDimension(19, articleType);
			}

			this.set('mediaWikiHandler', handler);

			handler.afterModel(this, model);
		} else {
			Ember.Logger.warn('Unsupported page');
		}
	},

	/**
	 * @param {Ember.controller} controller
	 * @param {Ember.model} model
	 * @returns {void}
	 */
	renderTemplate(controller, model) {
		const handler = this.get('mediaWikiHandler');

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
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			const handler = this.get('mediaWikiHandler');

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
