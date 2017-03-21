import config from '../config/environment';
import extend from '../utils/extend';

function getServicesDomain(environment, datacenter) {
	if (environment === 'dev') {
		const devDomain = (datacenter === 'poz') ? 'pl' : 'us';

		return `services.wikia-dev.${devDomain}`
	} else if (environment === 'staging'){
		return 'services.wikia-staging.com';
	} else {
		return 'services.wikia.com';
	}
}

function getCookieDomain(environment, datacenter) {
	if (environment === 'dev') {
		const devDomain = (datacenter === 'poz') ? 'pl' : 'us';

		return `.wikia-dev.${devDomain}`
	} else if (environment === 'staging'){
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
			environment = env.WIKIA_ENVIRONMENT;

		runtimeConfig = {
			mediawikiDomain: env.MEDIAWIKI_DOMAIN,
			wikiaDatacenter: env.WIKIA_DATACENTER,
			cookieDomain: getCookieDomain(environment, env.WIKIA_DATACENTER),
			environment,
		};

		runtimeServicesConfig = {
			domain: getServicesDomain(environment, env.WIKIA_DATACENTER)
		};

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
