define('mobile-wiki/mixins/connection-type', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Mixin = Ember.Mixin,
	    inject = Ember.inject,
	    computed = Ember.computed;
	exports.default = Mixin.create({
		fastboot: inject.service(),
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