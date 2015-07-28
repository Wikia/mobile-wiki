/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationComponent = Em.Component.extend({
	classNames: ['alert-notification', 'alert-box'],

	classNameBindings: ['alert.type'],

	alert: null,

	timeout: null,

	didInsertElement: function (): void {
		var expiry = this.get('alert').expiry;

		if (expiry > 0) {
			this.set('timeout', Em.run.later(this, this.dismissNotification, expiry));
		}

		var onInsertElement = this.get('alert.callbacks.onInsertElement');
		if (typeof onInsertElement === 'function') {
			onInsertElement(this.$());
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
			var onCloseAlert = this.get('alert.callbacks.onCloseAlert');
			if (typeof onCloseAlert === 'function') {
				onCloseAlert();
			}
		}
	}
});
