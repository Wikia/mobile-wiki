define('mobile-wiki/tests/helpers/destroy-app', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = destroyApp;
	function destroyApp(application) {
		Ember.run(application, 'destroy');
	}
});