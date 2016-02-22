import ArticleHandler from './article';

function afterModel(router, model) {
	ArticleHandler.afterModel(router, model);
}

/**
 * Export Category handler
 */
export default {
	// template's and controller's name
	viewName: 'category',
	controllerName: 'category',
	// hooks
	afterModel,
	didTransition: Ember.K
};
