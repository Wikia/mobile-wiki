/// <reference path="../app.ts" />
'use strict';

App.AlertNotificationComponent = Em.Component.extend({
	classNames: ['alert-notification', 'alert-box'],

	classNameBindings: ['alert.type'],

	alert: null,

	timeout: null,

	didInsertElement: function (): void {
		var expiry = this.get('alert').expiry,
		    onInsertElement = this.get('alert.callbacks.onInsertElement');

		if (expiry > 0) {
			this.set('timeout', Em.run.later(this, this.dismissNotification, expiry));
		}

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
			var onCloseAlert = this.get('alert.callbacks.onCloseAlert');
			this.dismissNotification();
			if (typeof onCloseAlert === 'function') {
				onCloseAlert();
			}
		}
	}
});
