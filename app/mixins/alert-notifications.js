import { A } from '@ember/array';
import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  alertNotifications: null,

  init() {
    this._super(...arguments);
    this.set('alertNotifications', A());
  },

  addAlert({
    message,
    type = 'info',
    expiry = 10000,
    unsafe = false,
    callbacks = {},
    persistent = {},
  }) {
    this.alertNotifications.pushObject({
      message,
      type,
      expiry,
      unsafe,
      callbacks,
      persistent,
    });
  },

  clearNotifications() {
    const updatedNotifications = this.alertNotifications.filter(item => item.persistent);

    this.set('alertNotifications', updatedNotifications);
  },
});
