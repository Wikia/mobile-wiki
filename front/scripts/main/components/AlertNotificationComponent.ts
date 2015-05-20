/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationComponent = Em.Component.extend({
	classNames: ['alert-notification', 'alert-box'],
	tagName: ['div'],

	classNameBindings: ['alert.type'],

	alerts: null,
	alert: null,

	notificationExpiry: 10000,
	timeout: null,

	didInsertElement: function (): void {
		this.set('timeout', setTimeout(() => {
			this.dismissNotification();
		}, this.get('notificationExpiry')));
	},

	willDestroyElement: function (): void {
		clearTimeout(this.get('timeout'));
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
