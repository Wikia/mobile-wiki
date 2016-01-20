import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['alert-notification', 'alert-box'],
	classNameBindings: ['alert.type'],

	alert: null,
	timeout: null,

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
			this.set('timeout', Ember.run.later(this, this.dismissNotification, expiry));
		}

		if (typeof onInsertElement === 'function') {
			onInsertElement(this.$());
		}
	},

	/**
	 * @returns {void}
	 */
	willDestroyElement() {
		Ember.run.cancel(this.get('timeout'));
	},

	/**
	 * @returns {void}
	 */
	dismissNotification() {
		this.sendAction('action', this.get('alert'));
	},
});
