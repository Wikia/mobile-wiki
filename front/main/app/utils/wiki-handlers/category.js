import ArticleHandler from './article';

/**
 * Export Category handler
 */
export default {
	// template's and controller's name
	viewName: 'category',
	controllerName: 'category',
	// hooks
	afterModel: ArticleHandler.afterModel
};
