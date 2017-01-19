import Ember from 'ember';
import CuratedContentModel from '../../models/curated-content';

/**
 * Set curatedContent data if main page has curated content set
 * @param {Object} mainPageModel
 * @returns {Object}
 */
function getCuratedContentModel(mainPageModel) {
	if (mainPageModel.curatedMainPageData.curatedContent) {
		return CuratedContentModel.create({
			type: 'section',
			items: mainPageModel.curatedMainPageData.curatedContent.items
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
		ns: model.get('ns'),
		title: Ember.getWithDefault(Mercury, 'wiki.siteName', 'Fandom powered by Wikia')
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
