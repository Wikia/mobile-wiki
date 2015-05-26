/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationComponent = Em.Component.extend({
	classNames: ['alert-notification', 'alert-box'],

	classNameBindings: ['alert.type'],

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
		this.sendAction('action', this.get('alert'));
	},

	actions: {
		close: function (): void {
			this.dismissNotification();
		}
	}
});
