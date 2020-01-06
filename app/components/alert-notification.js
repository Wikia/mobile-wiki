import { later, cancel } from '@ember/runloop';
import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  classNames: ['alert-notification', 'alert-box', 'wds-font-size-xs', 'wds-font-weight-normal'],
  classNameBindings: ['alert.type'],

  alert: null,
  timeout: null,

  action() {},

  /**
  * @returns {void}
  */
  didInsertElement() {
    const expiry = this.get('alert.expiry');
    const onInsertElement = this.get('alert.callbacks.onInsertElement');

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

  close: action(function (event) {
    event.preventDefault();
    const onCloseAlert = this.get('alert.callbacks.onCloseAlert');

    this.dismissNotification();

    if (typeof onCloseAlert === 'function') {
      onCloseAlert();
    }
  }),

  /**
  * @returns {void}
  */
  dismissNotification() {
    this.action(this.alert);
  },
});
