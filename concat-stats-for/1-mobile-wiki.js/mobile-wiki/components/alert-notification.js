define('mobile-wiki/components/alert-notification', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNames: ['alert-notification', 'alert-box'],
		classNameBindings: ['alert.type'],

		alert: null,
		timeout: null,

		actions: {
			/**
    * @returns {void}
    */
			close: function close() {
				var onCloseAlert = this.get('alert.callbacks.onCloseAlert');

				this.dismissNotification();

				if (typeof onCloseAlert === 'function') {
					onCloseAlert();
				}
			}
		},

		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			var expiry = this.get('alert.expiry'),
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
		willDestroyElement: function willDestroyElement() {
			Ember.run.cancel(this.get('timeout'));
		},


		/**
   * @returns {void}
   */
		dismissNotification: function dismissNotification() {
			this.sendAction('action', this.get('alert'));
		}
	});
});