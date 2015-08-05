/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationsMixin = Em.Mixin.create({
	alertNotifications: Ember.A(),

	addAlert: function (alertData: AlertNotification): void {
		var message = alertData.message,
		    type = alertData.type || '',
		    expiry = alertData.expiry || 10000,
		    unsafe = alertData.unsafe || false,
		    callbacks = alertData.callbacks || {};

		this.get('alertNotifications').pushObject({
			message,
			type,
			expiry,
			unsafe,
			callbacks
		});
	}
});
