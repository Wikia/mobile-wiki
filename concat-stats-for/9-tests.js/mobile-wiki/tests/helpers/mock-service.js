define('mobile-wiki/tests/helpers/mock-service', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var registerHelper = Ember.Test.registerHelper;
	exports.default = registerHelper('mockService', function (app, newService, serviceName) {
		var instance = app.__deprecatedInstance__,
		    registry = instance.register ? instance : instance.registry;

		return registry.register('service:' + serviceName, newService);
	});
});