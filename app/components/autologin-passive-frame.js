import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import { system } from '../utils/browser';

export default Component.extend({
  currentUser: service(),
  fastboot: service(),
  runtimeConfig: service(),
  tagName: '',
  servicesDomain: oneWay('runtimeConfig.servicesExternalAlternativeHost'),

  passiveSyncEnabled: computed(function () {
    if (this.fastboot.isFastBoot) {
      // Don't create iframe in fastboot to avoid duplicate service call
      return false;
    }

    return system === 'ios' && window.Cookies.get('autologin_done') !== '2' && !this.currentUser.isAuthenticated;
  }),

  didRender() {
    window.addEventListener('message', this.reloadWindow.bind(this), false);
  },

  reloadWindow(event) {
    if (event.origin === this.servicesDomain && event.data === 'is_authed') {
      window.location.reload();
    }
  },
});
