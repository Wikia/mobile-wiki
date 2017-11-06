define('mobile-wiki/utils/wiki-handlers/blog', ['exports', 'mobile-wiki/utils/wiki-handlers/article'], function (exports, _article) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		// template's and controller's name
		viewName: 'blog',
		controllerName: 'blog',
		// hooks
		afterModel: _article.default.afterModel
	};
});