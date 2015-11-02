/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.ArticleRoute = Em.Route.extend({
	redirectEmptyTarget: false,

	/**
	 * @param {EmberStates.Transition} transition
	 * @returns {undefined}
	 */
	beforeModel(transition: EmberStates.Transition): void {
		var title = transition.params.article.title.replace('wiki/', '');

		this.controllerFor('application').send('closeLightbox');

		if (title === Mercury.wiki.mainPageTitle) {
			this.transitionTo('mainPage');
		}

		// If you try to access article with not-yet-sanitized title you can see in logs:
		// `Transition #1: detected abort.`
		// This is caused by the transition below but doesn't mean any additional requests.
		// TODO: This could be improved upon by not using an Ember transition to 'rewrite' the URL
		// Ticket here: https://wikia-inc.atlassian.net/browse/HG-641
		if (title.match(/\s/)) {
			this.transitionTo('article',
				M.String.normalizeToUnderscore(title)
			);
		}
	},

	/**
	 * @param {*} params
	 * @returns {Em.RSVP.Promise}
	 */
	model(params: any): Em.RSVP.Promise {
		return App.ArticleModel.find({
			basePath: Mercury.wiki.basePath,
			title: params.title,
			wiki: this.controllerFor('application').get('domain')
		});
	},

	/**
	 * @param {App.ArticleModel} model
	 * @returns {undefined}
	 */
	afterModel(model: typeof App.ArticleModel): void {
		var exception = model.exception;

		if (!Em.isEmpty(exception)) {
			Em.Logger.warn('Article model error:', exception);
		}

		// if an article is main page, redirect to mainPage route
		// this will handle accessing /wiki/Main_Page if default main page is different article
		if (model.isMainPage) {
			this.replaceWith('mainPage');
		}

		this.controllerFor('application').set('currentTitle', model.get('title'));
		App.VisibilityStateManager.reset();

		// Reset query parameters
		model.set('commentsPage', null);

		this.set('redirectEmptyTarget', model.get('redirectEmptyTarget'));
	},

	/**
	 * @returns {undefined}
	 */
	activate(): void {
		this.controllerFor('application').set('enableShareHeader', true);
	},

	/**
	 * @returns {undefined}
	 */
	deactivate(): void {
		this.controllerFor('application').set('enableShareHeader', false);
	},

	actions: {
		/**
		 * @param {EmberStates.Transition} transition
		 * @returns {undefined}
		 */
		willTransition(transition: EmberStates.Transition): void {
			// notify a property change on soon to be stale model for observers (like
			// the Table of Contents menu) can reset appropriately
			this.notifyPropertyChange('cleanTitle');
		},

		/**
		 * @returns {boolean}
		 */
		didTransition(): boolean {
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
		error(error: any, transition: EmberStates.Transition): boolean {
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
	updateHead(): void {
		var model: typeof App.ArticleModel = this.modelFor('article');

		this.updateTitleTag(model);
		this.updateCanonicalLinkTag(model);
		this.updateDescriptionMetaTag(model);
	},

	/**
	 * @param {App.ArticleModel} model
	 * @returns {void}
	 */
	updateTitleTag(model: typeof App.ArticleModel): void {
		var	defaultHtmlTitleTemplate = '$1 - Wikia',
			htmlTitleTemplate = Em.get(Mercury, 'wiki.htmlTitleTemplate') || defaultHtmlTitleTemplate;

		document.title = htmlTitleTemplate.replace('$1', model.get('cleanTitle'));
	},

	/**
	 * @param {App.ArticleModel} model
	 * @returns {void}
	 */
	updateCanonicalLinkTag(model: typeof App.ArticleModel): void {
		var canonicalUrl = Em.get(Mercury, 'wiki.basePath') + model.get('url'),
			$canonicalLinkTag = Em.$('head link[rel=canonical]');

		if (Em.isEmpty($canonicalLinkTag)) {
			$canonicalLinkTag = Em.$('<link rel="canonical">').appendTo('head');
		}

		$canonicalLinkTag.prop('href', canonicalUrl);
	},

	/**
	 * @param {App.ArticleModel} model
	 * @returns {void}
	 */
	updateDescriptionMetaTag(model: typeof App.ArticleModel): void {
		var description = model.getWithDefault('description', ''),
			$descriptionMetaTag = Em.$('head meta[name=description]');

		if (Em.isEmpty($descriptionMetaTag)) {
			$descriptionMetaTag = Em.$('<meta name="description">').appendTo('head');
		}

		$descriptionMetaTag.prop('content', description);
	}
});
