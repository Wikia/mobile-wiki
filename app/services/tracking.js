import Service, {inject as service} from '@ember/service';
import {set, get} from '@ember/object';
import baseConfig from '../config/environment';
import extend from '../utils/extend';

export default Service.extend({
	fastboot: service(),
	wikiVariables: service(),
	config: null,

	init() {
		this._super(...arguments);

		if (!this.get('fastboot.isFastBoot')) {
			return;
		}

		// Extend defaults from the config file with config from wiki variables
		// It's enough for most trackers
		let config = extend({}, baseConfig.tracking, this.get('wikiVariables.tracking'));

		config = this.setupComscore(config);
		config = this.setupNielsen(config);

		this.get('fastboot.shoebox').put('tracking', config);

		this.set('config', config);
	},

	setupComscore(config) {
		if (get(config, 'comscore.c7Value')) {
			const request = this.get('fastboot.request');
			const requestUrl = `${request.get('protocol')}://${request.get('host')}${request.get('path')}`;
			const c7 = `${requestUrl}${requestUrl.indexOf('?') !== -1 ? '&' : '?'}` +
				`${get(config, 'comscore.keyword')}=${get(config, 'comscore.c7Value')}`;

			set(config, 'comscore.c7', encodeURIComponent(c7));
		}

		return config;
	},

	setupNielsen(config) {
		set(config, 'nielsen.section', get(config, 'vertical'));
		set(config, 'nielsen.dbName', this.get('wikiVariables.dbName'));

		return config;
	}
});
