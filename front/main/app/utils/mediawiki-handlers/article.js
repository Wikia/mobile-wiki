import Ember from 'ember';
import VisibilityStateManager from '../visibility-state-manager';

/**
 * @param {ArticleModel} model
 * @returns {void}
 */
function updateTitleTag(model) {
	const defaultHtmlTitleTemplate = '$1 - Wikia',
		htmlTitleTemplate = Ember.get(Mercury, 'wiki.htmlTitleTemplate') || defaultHtmlTitleTemplate;

	document.title = htmlTitleTemplate.replace('$1', model.get('displayTitle'));
}

/**
 * @param {ArticleModel} model
 * @returns {void}
 */
function updateCanonicalLinkTag(model) {
	const canonicalUrl = `${Ember.get(Mercury, 'wiki.basePath')}${model.get('url')}`;
	let $canonicalLinkTag = Ember.$('head link[rel=canonical]');

	if (Ember.isEmpty($canonicalLinkTag)) {
		$canonicalLinkTag = Ember.$('<link rel="canonical">').appendTo('head');
	}

	$canonicalLinkTag.prop('href', canonicalUrl);
}

/**
 * @param {ArticleModel} model
 * @returns {void}
 */
function updateDescriptionMetaTag(model) {
	const description = model.getWithDefault('description', '');
	let $descriptionMetaTag = Ember.$('head meta[name=description]');

	if (Ember.isEmpty($descriptionMetaTag)) {
		$descriptionMetaTag = Ember.$('<meta name="description">').appendTo('head');
	}

	$descriptionMetaTag.prop('content', description);
}

/**
 * @param {ArticleModel} model
 * @returns {void}
 */
function updateIOSSmartBannerMetaTag(model) {
	const articleUrl = model.get('url'),
		appId = Ember.get(Mercury, 'wiki.smartBanner.appId.ios');

	let $descriptionMetaTag, content;

	// If smart banner is available on this wiki
	if (appId) {
		$descriptionMetaTag = Ember.$('head meta[name=apple-itunes-app]');
		content = `app-id=${appId}`;

		if (Ember.isEmpty($descriptionMetaTag)) {
			$descriptionMetaTag = Ember.$('<meta name="apple-itunes-app">').appendTo('head');
		}

		if (articleUrl) {
			content += `, app-argument=${Ember.get(Mercury, 'wiki.basePath')}${articleUrl}`;
		}

		$descriptionMetaTag.prop('content', content);
	}
}

/**
 * @param {Ember.router} router
 * @param {Ember.model} model
 * @returns {void}
 */
function afterModel(router, model) {
	if (!Ember.isEmpty(model.exception)) {
		Ember.Logger.warn('Article model error:', model.exception);
	}

	router.controllerFor('application').set('currentTitle', model.get('title'));
	VisibilityStateManager.reset();

	// Reset query parameters
	model.set('commentsPage', null);

	router.set('redirectEmptyTarget', model.get('redirectEmptyTarget'));
}

/**
 * @TODO this can be much simpler using ember-cli-meta-tags
 *
 * @param {Ember.router} router
 * @returns {void}
 */
function didTransition(router) {
	const model = router.modelFor('wikiPage');

	updateTitleTag(model);
	updateCanonicalLinkTag(model);
	updateDescriptionMetaTag(model);
	updateIOSSmartBannerMetaTag(model);
}

/**
 * Export Article handler
 */
export default {
	// template's and controller's name
	controllerName: 'article',
	viewName: 'article',
	afterModel,
	didTransition,
	// all other, handler-specific functions
	updateTitleTag,
	updateCanonicalLinkTag,
	updateDescriptionMetaTag,
	updateIOSSmartBannerMetaTag
};
