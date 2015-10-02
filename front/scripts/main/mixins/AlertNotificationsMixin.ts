/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationsMixin = Em.Mixin.create({
	alertNotifications: Ember.A(),

	addAlert(alertData: AlertNotification): void {
		var message = alertData.message,
			type = alertData.type || '',
			expiry = alertData.expiry || 10000,
			unsafe = alertData.unsafe || false,
			callbacks = alertData.callbacks || {},
			persistent = alertData.persistent || false;

		this.get('alertNotifications').pushObject({
			message,
			type,
			expiry,
			unsafe,
			callbacks,
			persistent
		});
	},

	clearNotifications(): void {
		var notifications = this.get('alertNotifications'),
			updatedNotifications = notifications.filter((item: AlertNotification): boolean => {
				return item.persistent;
			});

		this.set('alertNotifications', updatedNotifications);
	}
});
