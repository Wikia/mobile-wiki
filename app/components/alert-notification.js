import {later, cancel} from '@ember/runloop';
import Component from '@ember/component';

export default Component.extend({
	classNames: ['alert-notification', 'alert-box'],
	classNameBindings: ['alert.type'],

	alert: null,
	timeout: null,

	action() {},

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
	didInsertElement() {
		const expiry = this.get('alert.expiry'),
			onInsertElement = this.get('alert.callbacks.onInsertElement');

		if (expiry > 0) {
			this.set('timeout', later(this, this.dismissNotification, expiry));
		}

		if (typeof onInsertElement === 'function') {
			onInsertElement(this.$());
		}
	},

	/**
	 * @returns {void}
	 */
	willDestroyElement() {
		cancel(this.get('timeout'));
	},

	/**
	 * @returns {void}
	 */
	dismissNotification() {
		this.get('action')(this.get('alert'));
	},
});
