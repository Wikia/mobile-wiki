/// <reference path="../app.ts" />
'use strict';

/**
 * AlertNotification
 * @typedef {Object} AlertNotification
 * @property {string} message
 * @property {string} [type]
 * @property {number} [expiry]
 * @property {boolean} [unsafe]
 * @property {*} [callbacks]
 * @property {boolean} [persistent]
 */

interface AlertNotification {
	message: string;
	type?: string;
	expiry?: number;
	unsafe?: boolean;
	callbacks?: any;
	persistent?: boolean;
}

App.AlertNotificationsComponent = Em.Component.extend({
	classNames: ['alert-notifications'],

	alerts: null,

	actions: {
		/**
		 * @param {AlertNotification} alert
		 * @returns {void}
		 */
		dismissAlert(alert: AlertNotification): void {
			this.get('alerts').removeObject(alert);
		},
	},
});
