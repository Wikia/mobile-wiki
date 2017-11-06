define('mobile-wiki/utils/wiki-handlers/category', ['exports', 'mobile-wiki/utils/wiki-handlers/article'], function (exports, _article) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	function getDynamicHeadTags(model) {
		var nextPageUrl = model.get('nextPageUrl'),
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
	exports.default = {
		// template's and controller's name
		viewName: 'category',
		controllerName: 'category',
		// hooks
		afterModel: _article.default.afterModel,
		getDynamicHeadTags: getDynamicHeadTags
	};
});