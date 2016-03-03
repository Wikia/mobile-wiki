import CuratedContentModel from '../../models/curated-content';
import Ember from 'ember';

/**
 * Set curatedContent data if main page has curated content set
 * @param {Object} mainPageModel
 * @returns {Object}
 */
function getCuratedContentModel(mainPageModel) {
	if (mainPageModel.mainPageData.curatedContent) {
		return CuratedContentModel.create({
			type: 'section',
			items: CuratedContentModel.sanitizeItems(mainPageModel.mainPageData.curatedContent)
		});
	}
	return Ember.Object.create();
}

/**
 * @param {Ember.router} router
 * @param {Ember.model} model
 * @returns {void}
 */
function afterModel(router, model) {
	model.set('curatedContent', getCuratedContentModel(model));

	router.controllerFor('main-page').setProperties({
		adsContext: model.get('adsContext'),
		isRoot: true,
		ns: model.get('ns'),
		title: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
	});

	return model;
}

export default {
	// template's and controller's name
	controllerName: 'main-page',
	viewName: 'main-page',
	// hooks
	afterModel,
	// all other, handler-specific functions
	getCuratedContentModel,
};
