/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationsMixin = Em.Mixin.create({
	alertNotifications: Ember.A(),

	/**
	 * @param {AlertNotification} alertData
	 * @returns {undefined}
	 */
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

	/**
	 * @returns {undefined}
	 */
	clearNotifications(): void {
		var notifications = this.get('alertNotifications'),
			updatedNotifications = notifications.filter((item: AlertNotification): boolean => {
				return item.persistent;
			});

		this.set('alertNotifications', updatedNotifications);
	}
});
