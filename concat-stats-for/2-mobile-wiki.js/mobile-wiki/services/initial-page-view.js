define('mobile-wiki/services/initial-page-view', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Service = Ember.Service,
	    getOwner = Ember.getOwner;
	exports.default = Service.extend({
		isInitialPageView: function isInitialPageView() {
			var router = getOwner(this).lookup('router:main')._routerMicrolib;

			return router.currentSequence === 1;
		}
	});
});