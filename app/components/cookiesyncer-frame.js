import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import Component from '@ember/component';
import config from '../config/environment';

export default Component.extend({
	currentUser: service(),
	tagName: '',
	servicesDomain: computed(() => config.APP.servicesExternalHost),
	isCookieSet: window.Cookies.get('tracking-opt-in-status') !== 'undefined',
});
