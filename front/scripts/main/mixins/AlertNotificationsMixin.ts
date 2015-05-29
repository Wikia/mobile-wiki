/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationsMixin = Em.Mixin.create({
	alertNotifications: Ember.A(),

	addAlert: function (alertType: string, message: string): void {
		this.get('alertNotifications').pushObject({
			type: alertType,
			message: message
		});
	}
});
