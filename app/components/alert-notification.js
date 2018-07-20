import { later, cancel } from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
	classNames: ['alert-notification', 'alert-box', 'wds-text-xs', 'wds-font-normal'],
	classNameBindings: ['alert.type'],

	alert: null,
	timeout: null,

	action() {},

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		const expiry = this.get('alert.expiry'),
			onInsertElement = this.get('alert.callbacks.onInsertElement');

		if (expiry > 0) {
			this.set('timeout', later(this, this.dismissNotification, expiry));
		}

		if (typeof onInsertElement === 'function') {
			onInsertElement(this.element);
		}
	},

	/**
	 * @returns {void}
	 */
	willDestroyElement() {
		cancel(this.timeout);
	},

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			const onCloseAlert = this.get('alert.callbacks.onCloseAlert');

			this.dismissNotification();

			if (typeof onCloseAlert === 'function') {
				onCloseAlert();
			}
		},
	},

	/**
	 * @returns {void}
	 */
	dismissNotification() {
		this.action(this.alert);
	},
});
