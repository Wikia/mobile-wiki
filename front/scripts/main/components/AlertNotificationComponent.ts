/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationComponent = Em.Component.extend({
	classNames: ['alert-notification', 'alert-box'],

	classNameBindings: ['alert.type'],

	alerts: null,
	alert: null,

	notificationExpiry: 10000,
	timeout: null,

	didInsertElement: function (): void {
		this.set('timeout', Em.run.later(this, (): void => {
			this.dismissNotification();
		}, this.get('notificationExpiry')));
	},

	willDestroyElement: function (): void {
		Em.run.cancel(this.get('timeout'));
	},

	dismissNotification: function (): void {
		this.get('alerts').removeObject(this.get('alert'));
	},

	actions: {
		close: function (): void {
			this.dismissNotification();
		}
	}
});
