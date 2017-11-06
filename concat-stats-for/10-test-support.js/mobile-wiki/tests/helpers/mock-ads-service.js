define('mobile-wiki/tests/helpers/mock-ads-service', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Service = Ember.Service;
	var registerHelper = Ember.Test.registerHelper;
	exports.default = registerHelper('mockAdsService', function () {
		mockService(Service.extend({
			module: {
				pushSlotToQueue: function pushSlotToQueue() {},
				onReady: function onReady() {},
				onTransition: function onTransition() {},
				reload: function reload() {},
				reloadAfterTransition: function reloadAfterTransition() {},
				removeSlot: function removeSlot() {},
				waitForUapResponse: function waitForUapResponse() {}
			},
			destroyAdSlotComponents: function destroyAdSlotComponents() {},
			pushAdSlotComponent: function pushAdSlotComponent() {}
		}), 'ads');
	});
});