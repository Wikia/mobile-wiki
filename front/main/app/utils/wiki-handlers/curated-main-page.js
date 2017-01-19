import Ember from 'ember';
import CuratedContentModel from '../../models/curated-content';

const {Object: EmberObject, getWithDefault, get} = Ember;

/**
 * Set curatedContent data if main page has curated content set
 * @param {Object} mainPageModel
 * @returns {Object}
 */
function getCuratedContentModel(mainPageModel) {
	const curatedContent = get(mainPageModel, 'curatedMainPageData.curatedContent');

	if (curatedContent) {
		return CuratedContentModel.create({
			type: 'section',
			items: curatedContent.items
		});
	}

	return EmberObject.create();
}

/**
 * @param {Ember.Route} route
 * @param {Object} model
 * @returns {Object}
 */
function afterModel(route, model) {
	model.set('curatedContent', getCuratedContentModel(model));

	route.controllerFor('main-page').setProperties({
		adsContext: model.get('adsContext'),
		ns: model.get('ns'),
		title: getWithDefault(Mercury, 'wiki.siteName', 'Fandom powered by Wikia')
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
