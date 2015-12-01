import App from '../app';

/**
 * AlertNotification
 * @typedef {Object} AlertNotification
 * @property {string} message
 * @property {string} [type]
 * @property {number} [expiry]
 * @property {boolean} [unsafe]
 * @property {*} [callbacks]
 * @property {boolean} [persistent]
 */

export default App.AlertNotificationsComponent = Ember.Component.extend({
	classNames: ['alert-notifications'],

	alerts: null,

	actions: {
		/**
		 * @param {AlertNotification} alert
		 * @returns {void}
		 */
		dismissAlert(alert) {
			this.get('alerts').removeObject(alert);
		},
	},
});
