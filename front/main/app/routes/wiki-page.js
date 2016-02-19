import Ember from 'ember';
import {normalizeToUnderscore} from 'common/utils/string';
import UniversalAnalytics from 'common/modules/Trackers/UniversalAnalytics';
import ArticleHandler from '../utils/mediawiki-handlers/article';
import CategoryHandler from '../utils/mediawiki-handlers/category';
import CuratedMainPageHandler from '../utils/mediawiki-handlers/curated-main-page';
import {namespace as MediawikiNamespace, getCurrentNamespace} from '../utils/mediawiki-namespace';
import WikiPageModel from '../models/mediawiki/wiki-page';

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

		this.set('mediaWikiHandler', this.getHandler(model));

		this.get('mediaWikiHandler').afterModel(this, model);
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
