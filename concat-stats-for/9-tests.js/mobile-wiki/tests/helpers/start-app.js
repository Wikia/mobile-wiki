define('mobile-wiki/tests/helpers/start-app', ['exports', 'mobile-wiki/app', 'mobile-wiki/config/environment', 'mobile-wiki/tests/helpers/mock-service', 'mobile-wiki/tests/helpers/mock-fastboot-service', 'mobile-wiki/tests/helpers/mock-ads-service'], function (exports, _app, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = startApp;
	function startApp(attrs) {
		var attributes = Ember.merge({}, _environment.default.APP);
		attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

		return Ember.run(function () {
			var application = _app.default.create(attributes);
			application.setupForTesting();
			application.injectTestHelpers();
			return application;
		});
	}
});