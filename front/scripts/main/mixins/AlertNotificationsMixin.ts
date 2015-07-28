/// <reference path="../app.ts" />
'use strict';

interface AlertData {
	type: string;
	message: string;
	expiry?: number;
	unsafe?: boolean;
	callbacks?: any;
}

App.AlertNotificationsMixin = Em.Mixin.create({
	alertNotifications: Ember.A(),

	addAlert: function(alertData: AlertData): void {
		var type = alertData.type,
		    message = alertData.message,
		    expiry = alertData.expiry ? alertData.expiry : 10000,
		    unsafe = alertData.unsafe ? alertData.unsafe : false,
		    callbacks = alertData.callbacks ? alertData.callbacks : {};

		this.get('alertNotifications').pushObject({
			type,
			message,
			expiry,
			unsafe,
			callbacks
		});
	}
});
