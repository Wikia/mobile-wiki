define('mobile-wiki/utils/wiki-handlers/file', ['exports', 'mobile-wiki/utils/wiki-handlers/article'], function (exports, _article) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = {
		// template's and controller's name
		viewName: 'file',
		controllerName: 'file',
		// hooks
		afterModel: _article.default.afterModel
	};
});