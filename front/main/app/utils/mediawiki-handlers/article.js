import Ember from 'ember';
import ArticleModel from '../../models/article';

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
 * @param {*} params
 * @returns {Ember.model}
 */
function getModel(router, params) {
	return ArticleModel.find({
		basePath: Mercury.wiki.basePath,
		title: params.title,
		wiki: router.controllerFor('application').get('domain')
	});
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
	viewName: 'mediawiki-article',
	controllerName: 'mediawiki-article',
	getModel,
	didTransition
};
