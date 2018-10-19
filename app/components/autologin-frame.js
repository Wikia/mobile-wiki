import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  currentUser: service(),
  fastboot: service(),
  runtimeConfig: service(),
  tagName: '',
  servicesDomain: oneWay('runtimeConfig.servicesExternalHost'),

  cookieSyncEnabled: computed(function () {
    if (this.fastboot.isFastBoot) {
      // Don't create iframe in fastboot to avoid duplicate service call
      return false;
    }

    return window.Cookies.get('autologin_done') !== '1' && window.Cookies.get('autologin_done') !== '2' && this.currentUser.isAuthenticated;
  }),
});
