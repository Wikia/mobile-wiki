import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';

export default Component.extend({
  currentUser: service(),
  fastboot: service(),
  tagName: '',
  servicesHost: oneWay('runtimeConfig.servicesExternalHost'),
  isSyncableCookieSet: computed(function () {
    if (this.fastboot.isFastBoot) {
      // Don't create iframe in fastboot to avoid duplicate service call
      return false;
    }

    return typeof window.Cookies.get('tracking-opt-in-status') !== 'undefined'
      && window.Cookies.get('cookiesync_done') !== '1';
  }),
});
