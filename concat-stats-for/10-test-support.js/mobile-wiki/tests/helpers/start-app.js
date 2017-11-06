define('mobile-wiki/tests/helpers/start-app', ['exports', 'mobile-wiki/app', 'mobile-wiki/config/environment', 'mobile-wiki/tests/helpers/mock-service', 'mobile-wiki/tests/helpers/mock-fastboot-service', 'mobile-wiki/tests/helpers/mock-ads-service'], function (exports, _app, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = startApp;
	var merge = Ember.merge;
	var run = Ember.run;
	function startApp(attrs) {
		var attributes = merge({}, _environment.default.APP);
		attributes = merge(attributes, attrs); // use defaults, but you can override;

		return run(function () {
			var application = _app.default.create(attributes);
			application.setupForTesting();
			application.injectTestHelpers();
			return application;
		});
	}
});