import {inject as service} from '@ember/service';
import {readOnly} from '@ember/object/computed';
import {computed} from '@ember/object';
import config from '../config/environment';
import Component from '@ember/component';

export default Component.extend({
	currentUser: service(),
	tagName: '',
	servicesDomain: computed(() => config.APP.servicesExternalHost),

	cookieSyncEnabled: computed(() => {
		window.Cookies.get('autologin_done') !== '1' && this.currentUser.isAuthenticated
	})
});
