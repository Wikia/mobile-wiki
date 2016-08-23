import Ember from 'ember';
import CuratedContentModel from '../../models/curated-content';

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
 * @param {Ember.Route} route
 * @param {Ember.model} model
 * @returns {Object}
 */
function afterModel(route, model) {
	model.set('curatedContent', getCuratedContentModel(model));

	route.controllerFor('main-page').setProperties({
		adsContext: model.get('adsContext'),
		isRoot: true,
		ns: model.get('ns'),
		title: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Wikia')
	});

	route.setProperties({
		ns: model.get('ns'),
		adsContext: model.get('adsContext'),
		description: model.get('description')
	});

	return model;
}

export default {
	// template's and controller's name
	controllerName: 'main-page',
	viewName: 'main-page',
	// hooks
	afterModel
};
