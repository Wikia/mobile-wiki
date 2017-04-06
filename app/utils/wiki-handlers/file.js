import ArticleHandler from './article';

/**
 * Export File handler
 */
export default {
	// template's and controller's name
	viewName: 'file',
	controllerName: 'file',
	// hooks
	afterModel: ArticleHandler.afterModel
};
