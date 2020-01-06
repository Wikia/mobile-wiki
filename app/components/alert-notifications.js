import Component from '@ember/component';
import { action } from '@ember/object';

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

export default Component.extend({
  classNames: ['alert-notifications'],

  alerts: null,

  /**
   * @param {AlertNotification} alert
   * @returns {void}
   */
  dismissAlert: action(function (alert) {
    this.alerts.removeObject(alert);
  }),
});
