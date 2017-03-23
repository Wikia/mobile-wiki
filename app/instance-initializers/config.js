import Ember from 'ember';
import config from '../config/environment';
import extend from '../utils/extend';

const {isBlank} = Ember;

function getServicesDomain(environment, datacenter) {
	if (environment === 'dev') {
		const devDomain = (datacenter === 'poz') ? 'pl' : 'us';

		return `services.wikia-dev.${devDomain}`
	} else if (environment === 'staging') {
		return 'services.wikia-staging.com';
	} else {
		return 'services.wikia.com';
	}
}

function getCookieDomain(environment, datacenter) {
	if (environment === 'dev') {
		const devDomain = (datacenter === 'poz') ? 'pl' : 'us';

		return `.wikia-dev.${devDomain}`
	} else if (environment === 'staging') {
		return '.wikia-staging.com';
	} else {
		return '.wikia.com';
	}
}

export function initialize(applicationInstance) {
	let fastboot = applicationInstance.lookup('service:fastboot'),
		shoebox = fastboot.get('shoebox'),
		runtimeConfig,
		runtimeServicesConfig;

	if (fastboot.get('isFastBoot')) {
		const env = FastBoot.require('process').env,
			environment = env.WIKIA_ENVIRONMENT,
			buckySampling = fastboot.get('request.queryParams.buckysampling');

		runtimeConfig = {
			mediawikiDomain: env.MEDIAWIKI_DOMAIN,
			wikiaDatacenter: env.WIKIA_DATACENTER,
			cookieDomain: getCookieDomain(environment, env.WIKIA_DATACENTER),
			environment,
		};

		runtimeServicesConfig = {
			domain: getServicesDomain(environment, env.WIKIA_DATACENTER)
		};

		if (!isBlank(buckySampling)) {
			const buckySamplingInt = parseInt(buckySampling, 10);

			if (buckySamplingInt >= 0 && buckySamplingInt <= 100) {
				// Convert percent to 0-1 scale
				runtimeConfig.weppy = {
					samplingRate: parseInt(buckySampling) / 100
				};
			}
		}

		shoebox.put('runtimeConfig', runtimeConfig);
		shoebox.put('runtimeServicesConfig', runtimeServicesConfig);
	} else {
		runtimeConfig = shoebox.retrieve('runtimeConfig');
		runtimeServicesConfig = shoebox.retrieve('runtimeServicesConfig');
	}

	extend(config.services, runtimeServicesConfig);
	extend(config, runtimeConfig);
}

export default {
	name: 'config',
	initialize
};
