import Ember from 'ember';
import baseConfig from '../config/environment';
import {trackPageView} from '../utils/track';
import extend from '../utils/extend';

const {Service, computed, get, inject, set} = Ember;

export default Service.extend({
	fastboot: inject.service(),
	wikiVariables: inject.service(),

	config: computed(function () {
		let config = extend({}, baseConfig.tracking);

		config = this.setupComscore(config);

		return config;
	}),

	setupComscore(config) {
		const wikiVariablesConfig = this.get('wikiVariables.tracking.comscore');

		if (get(wikiVariablesConfig, 'c7Value')) {
			const request = this.get('fastboot.request');
			const requestUrl = `${request.get('protocol')}://${request.get('host')}${request.get('path')}`;
			const c7Value = get(wikiVariablesConfig, 'c7Value');
			const c7 = `${requestUrl}${requestUrl.indexOf('?') !== -1 ? '&' : '?'}` +
				`${get(config, 'comscore.keyword')}=${c7Value}`;

			set(config, 'comscore.c7', encodeURIComponent(c7));
			set(config, 'comscore.c7Value', c7Value);
		}

		return config;
	},

	trackPageView(uaDimensions) {
		trackPageView(uaDimensions);
	}
});
