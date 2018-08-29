import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';
import config from '../config/environment';

export default Component.extend({
  currentUser: service(),
  tagName: '',
  servicesDomain: computed(() => config.APP.servicesExternalHost),

  cookieSyncEnabled: computed(() => {
    window.Cookies.get('autologin_done') !== '1' && this.currentUser.isAuthenticated;
  }),
});
