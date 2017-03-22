import Ember from 'ember';
import baseConfig from '../config/environment';
import {trackPageView} from '../utils/track';
import extend from '../utils/extend';

const {Service, computed, get, inject, set} = Ember;

export default Service.extend({
	fastboot: inject.service(),
	wikiVariables: inject.service(),

	config: computed(function () {
		let config = extend({}, baseConfig.tracking, this.get('wikiVariables.tracking'));

		config = this.setupComscore(config);

		return config;
	}),

	setupComscore(config) {
		if (get(config, 'comscore.c7Value')) {
			const request = this.get('fastboot.request');
			const requestUrl = `${request.get('protocol')}://${request.get('headers').get('host')}${request.get('path')}`;
			const c7 = `${requestUrl}${requestUrl.indexOf('?') !== -1 ? '&' : '?'}` +
				`${get(config, 'comscore.keyword')}=${get(config, 'comscore.c7Value')}`;

			set(config, 'comscore.c7', encodeURIComponent(c7));
		}

		return config;
	},

	trackPageView(uaDimensions) {
		if (this.get('fastboot.isFastBoot')) {
			return;
		}

		trackPageView(uaDimensions);
	}
});
