import ArticleHandler from './article';

/**
 * Export File handler
 */
export default {
	// template's and controller's name
	viewName: 'blog',
	controllerName: 'blog',
	// hooks
	afterModel: ArticleHandler.afterModel
};
