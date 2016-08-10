import ArticleHandler from './article';

/**
 * afterModel hook
 *
 * @param {Ember.Route} route
 * @param {Ember.Object} model
 * @returns {void}
 */
function afterModel(route, model) {
	ArticleHandler.afterModel(route, model);
}

/**
 * Export Category handler
 */
export default {
	// template's and controller's name
	viewName: 'category',
	controllerName: 'category',
	// hooks
	afterModel
};
