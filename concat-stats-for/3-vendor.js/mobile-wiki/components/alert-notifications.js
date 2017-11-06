define('mobile-wiki/components/alert-notifications', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNames: ['alert-notifications'],

		alerts: null,

		actions: {
			/**
    * @param {AlertNotification} alert
    * @returns {void}
    */
			dismissAlert: function dismissAlert(alert) {
				this.get('alerts').removeObject(alert);
			}
		}
	});
});