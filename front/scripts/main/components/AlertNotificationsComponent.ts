/// <reference path="../app.ts" />
'use strict';

interface AlertNotification {
	type: string;
	message: string;
}

App.AlertNotificationsComponent = Em.Component.extend({
	classNames: ['alert-notifications'],
	tagName: ['div'],

	alerts: null,

	actions: {
		close: function (alert: AlertNotification): void {
			this.get('alerts').removeObject(alert);
		}
	}
});
