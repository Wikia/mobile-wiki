import Ember from 'ember';
import VisibilityStateManager from '../utils/visibility-state-manager';
import {normalizeToUnderscore} from 'common/utils/string';
import UniversalAnalytics from 'common/modules/Trackers/UniversalAnalytics';
import ArticleHandler from '../utils/mediawiki-handlers/article';
import CategoryHandler from '../utils/mediawiki-handlers/category';
import {namespace as MediawikiNamespace, getCurrentNamespace} from '../utils/mediawiki-namespace';

export default Ember.Route.extend({
	redirectEmptyTarget: false,

	getHandler() {
		switch (getCurrentNamespace()) {
		case MediawikiNamespace.MAIN:
			return ArticleHandler;
		case MediawikiNamespace.CATEGORY:
			return CategoryHandler;
		default:
			// not supported
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

		if (title === Mercury.wiki.mainPageTitle) {
			this.transitionTo('mainPage');
		}

		// If you try to access article with not-yet-sanitized title you can see in logs:
		// `Transition #1: detected abort.`
		// This is caused by the transition below but doesn't mean any additional requests.
		// TODO: This could be improved upon by not using an Ember transition to 'rewrite' the URL
		// Ticket here: https://wikia-inc.atlassian.net/browse/HG-641
		if (title.indexOf(' ') > -1) {
			this.transitionTo('wiki-page', normalizeToUnderscore(title));
		}
	},

	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return this.getHandler().getModel(this, params);
	},

	/**
	 * @param {ArticleModel} model
	 * @returns {void}
	 */
	afterModel(model) {
		const exception = model.exception,
			articleType = model.articleType;

		if (!Ember.isEmpty(exception)) {
			Ember.Logger.warn('Page model error:', exception);
		}

		if (articleType) {
			UniversalAnalytics.setDimension(19, articleType);
		}

		// if an article is main page, redirect to mainPage route
		// this will handle accessing /wiki/Main_Page if default main page is different article
		if (model.isMainPage) {
			this.replaceWith('mainPage');
		}

		this.controllerFor('application').set('currentTitle', model.get('title'));
		VisibilityStateManager.reset();

		// Reset query parameters
		model.set('commentsPage', null);

		this.set('redirectEmptyTarget', model.get('redirectEmptyTarget'));
	},

	/**
	 * @returns {void}
	 */
	renderTemplate() {
		debugger;
		this.render(this.getHandler().viewName, {
			controller: this.getHandler().controllerName
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
			this.getHandler().didTransition(this);

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
