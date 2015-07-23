/// <reference path="../app.ts" />
'use strict';

interface AlertNotification {
	type: string;
	message: string;
	notificationExpiry: number;
	callbacks: any;
}

App.AlertNotificationsComponent = Em.Component.extend({
	classNames: ['alert-notifications'],

	alerts: null,

	actions: {
		dismissAlert: function (alert: AlertNotification): void {
			this.get('alerts').removeObject(alert);
			if (typeof alert.callbacks.dismissAlert === 'function') {
				alert.callbacks.dismissAlert();
			}
		}
	}
});
