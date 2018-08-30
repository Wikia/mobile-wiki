import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';
import config from '../config/environment';

export default Component.extend({
	currentUser: service(),
	fastboot: service(),
	tagName: '',
	servicesDomain: computed(() => config.APP.servicesExternalHost),

	cookieSyncEnabled: computed(() => {
		if (this.fastboot.isFastBoot) {
			// Don't create iframe in fastboot to avoid duplicate service call
			return false;
		}

		return typeof window.Cookies.get('autologin_done') !== 'undefined' && this.currentUser.isAuthenticated;
	}),
});
