/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationComponent = Em.Component.extend({
	classNames: ['alert-notification', 'alert-box'],

	classNameBindings: ['alert.type'],

	alert: null,

	timeout: null,

	didInsertElement: function (): void {
		var expiry = this.get('alert').notificationExpiry || 10000; //Default to 10 seconds.

		if (expiry > 0) {
			this.set('timeout', Em.run.later(this, (): void => {
				this.dismissNotification();
			}, expiry));
		}

		if (typeof this.get('alert').callbacks.onInsertElement === 'function') {
			this.get('alert').callbacks.onInsertElement(this.$());
		}
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
			if (typeof this.get('alert').callbacks.onCloseAlert === 'function') {
				this.get('alert').callbacks.onCloseAlert();
			}
		}
	}
});
