define('mobile-wiki/tests/helpers/resolver', ['exports', 'mobile-wiki/resolver', 'mobile-wiki/config/environment'], function (exports, _resolver, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});


	var resolver = _resolver.default.create();

	resolver.namespace = {
		modulePrefix: _environment.default.modulePrefix,
		podModulePrefix: _environment.default.podModulePrefix
	};

	exports.default = resolver;
});