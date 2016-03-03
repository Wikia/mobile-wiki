import ArticleHandler from './article';

/**
 * afterModel hook
 *
 * @param {Ember.Router} router
 * @param {Ember.Object} model
 * @returns {void}
 */
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
};
