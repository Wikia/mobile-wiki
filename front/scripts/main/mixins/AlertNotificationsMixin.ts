/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationsMixin = Em.Mixin.create({
	alertNotifications: Ember.A(),

	addAlert: function (alertType: string, message: string, notificationExpiry: number, unsafe: boolean = false, callbacks: any = {}): void {
		this.get('alertNotifications').pushObject({
			type: alertType,
			message: message,
			notificationExpiry: notificationExpiry,
			unsafe: unsafe,
			callbacks: callbacks
		});
	}
});
