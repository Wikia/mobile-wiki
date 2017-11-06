define('mobile-wiki/mixins/connection-type', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Mixin = Ember.Mixin;
	var computed = Ember.computed;
	exports.default = Mixin.create({
		fastboot: service(),
		connection: computed('fastboot.isFastBoot', function () {
			if (!this.get('fastboot.isFastBoot')) {
				return navigator.connection || navigator.mozConnection || navigator.webkitConnection;
			}
		}),
		effectiveConnectionType: computed('connection', function () {
			return this.get('connection.effectiveType');
		})
	});
});