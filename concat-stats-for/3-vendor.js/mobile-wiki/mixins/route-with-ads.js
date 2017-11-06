define('mobile-wiki/mixins/route-with-ads', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		fastboot: service(),
		initialPageView: service(),

		/**
   * Reset AdEngine variables before article load
   *
   * @returns {void}
   */
		beforeModel: function beforeModel() {
			this._super();

			var isInitialPageView = this.get('initialPageView').isInitialPageView();

			if (!this.get('fastboot.isFastBoot') && !isInitialPageView) {
				window.wgNow = new Date();
			}
		}
	});
});