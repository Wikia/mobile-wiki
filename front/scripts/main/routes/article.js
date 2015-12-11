import ArticleModel from '../models/article';
import VisibilityStateManager from '../mixins/visibility-state-manager';
import {normalizeToUnderscore} from '../../mercury/utils/string';
import App from '../app';

export default App.ArticleRoute = Ember.Route.extend({
	redirectEmptyTarget: false,

	/**
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	beforeModel(transition) {
		const title = transition.params.article.title.replace('wiki/', '');

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
			this.transitionTo('article', normalizeToUnderscore(title));
		}
	},

	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return ArticleModel.find({
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
		const exception = model.exception;

		if (!Ember.isEmpty(exception)) {
			Ember.Logger.warn('Article model error:', exception);
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
			this.notifyPropertyChange('cleanTitle');
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			this.updateHead();

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

			this.controllerFor('application').addAlert({
				message: i18n.t('app.article-error'),
				type: 'alert'
			});

			return true;
		}
	},

	/**
	 * @TODO this can be much simpler using ember-cli-meta-tags
	 *
	 * @returns {void}
	 */
	updateHead() {
		const model = this.modelFor('article');

		this.updateTitleTag(model);
		this.updateCanonicalLinkTag(model);
		this.updateDescriptionMetaTag(model);
	},

	/**
	 * @param {ArticleModel} model
	 * @returns {void}
	 */
	updateTitleTag(model) {
		const defaultHtmlTitleTemplate = '$1 - Wikia',
			htmlTitleTemplate = Ember.get(Mercury, 'wiki.htmlTitleTemplate') || defaultHtmlTitleTemplate;

		document.title = htmlTitleTemplate.replace('$1', model.get('cleanTitle'));
	},

	/**
	 * @param {ArticleModel} model
	 * @returns {void}
	 */
	updateCanonicalLinkTag(model) {
		const canonicalUrl = Ember.get(Mercury, 'wiki.basePath') + model.get('url');
		let $canonicalLinkTag = Ember.$('head link[rel=canonical]');

		if (Ember.isEmpty($canonicalLinkTag)) {
			$canonicalLinkTag = Ember.$('<link rel="canonical">').appendTo('head');
		}

		$canonicalLinkTag.prop('href', canonicalUrl);
	},

	/**
	 * @param {ArticleModel} model
	 * @returns {void}
	 */
	updateDescriptionMetaTag(model) {
		const description = model.getWithDefault('description', '');
		let $descriptionMetaTag = Ember.$('head meta[name=description]');

		if (Ember.isEmpty($descriptionMetaTag)) {
			$descriptionMetaTag = Ember.$('<meta name="description">').appendTo('head');
		}

		$descriptionMetaTag.prop('content', description);
	}
});
