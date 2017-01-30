import ArticleHandler from './article';

function getDynamicHeadTags(model) {
	const nextPageUrl = model.get('nextPageUrl'),
		prevPageUrl = model.get('prevPageUrl'),
		data = {};

	if (nextPageUrl) {
		data.next = nextPageUrl;
	}

	if (prevPageUrl) {
		data.prev = prevPageUrl;
	}

	return data;
}

/**
 * Export Category handler
 */
export default {
	// template's and controller's name
	viewName: 'category',
	controllerName: 'category',
	// hooks
	afterModel: ArticleHandler.afterModel,
	getDynamicHeadTags
};
