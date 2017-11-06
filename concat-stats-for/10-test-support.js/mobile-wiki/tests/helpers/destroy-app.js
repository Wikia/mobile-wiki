define('mobile-wiki/tests/helpers/destroy-app', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = destroyApp;
	var run = Ember.run;
	function destroyApp(application) {
		run(application, 'destroy');
	}
});