import ArticleHandler from './article';
import BaseHandler from './base-handler';

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
export default Ember.$.extend({}, BaseHandler, {
	// template's and controller's name
	viewName: 'category',
	controllerName: 'category',
	// hooks
	afterModel
});
