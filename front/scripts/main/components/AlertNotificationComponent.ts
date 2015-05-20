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
			this.$().remove();
			this.get('alerts').removeObject(this.get('alert'));
		}, this.get('notificationExpiry')));
	},

	willDestroyElement: function (): void {
		clearTimeout(this.get('timeout'));
	},

	actions: {
		close: function (): void {
			this.get('alerts').removeObject(this.get('alert'));
		}
	}
});
