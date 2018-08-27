import {inject as service} from '@ember/service';
import {computed} from '@ember/object';
import config from '../config/environment';
import Component from '@ember/component';

export default Component.extend({
	currentUser: service(),
	tagName: '',
	servicesDomain: computed(() => config.app.servicesExternalHost),
	isCookieSet: (typeof $.cookie('tracking-opt-in-status') === 'undefined' ? false : true)
});
