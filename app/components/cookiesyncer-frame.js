import {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import config from '../config/environment';
import Component from '@ember/component';

export default Component.extend({
	currentUser: service(),
	tagName: '',
	servicesDomain: computed(() => config.APP.servicesExternalHost),
	isCookieSet: window.Cookies.get('tracking-opt-in-status') !== 'undefined'
});
