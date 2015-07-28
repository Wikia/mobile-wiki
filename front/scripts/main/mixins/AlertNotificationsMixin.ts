/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationsMixin = Em.Mixin.create({
	alertNotifications: Ember.A(),

	addAlert: function (
		type: string, message: string, expiry: number = 10000, unsafe: boolean = false, callbacks: any = {}
	): void {
		this.get('alertNotifications').pushObject({
			type,
			message,
			expiry,
			unsafe,
			callbacks
		});
	}
});
