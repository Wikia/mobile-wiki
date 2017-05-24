import Ember from 'ember';
import config from '../config/environment';
import extend from '../utils/extend';

const {isBlank} = Ember;

function getServicesDomain(wikiaEnv, datacenter) {
	if (wikiaEnv === 'dev') {
		const devDomain = (datacenter === 'poz') ? 'pl' : 'us';

		return `services.wikia-dev.${devDomain}`;
	} else if (wikiaEnv === 'staging') {
		return 'services.wikia-staging.com';
	} else {
		return 'services.wikia.com';
	}
}

function getCookieDomain(wikiaEnv, datacenter) {
	if (wikiaEnv === 'dev') {
		const devDomain = (datacenter === 'poz') ? 'pl' : 'us';

		return `.wikia-dev.${devDomain}`;
	} else if (wikiaEnv === 'staging') {
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
			wikiaEnv = env.WIKIA_ENVIRONMENT,
			buckySampling = fastboot.get('request.queryParams.buckysampling'),
			noExternals = fastboot.get('request.queryParams.noexternals');

		runtimeConfig = {
			cookieDomain: getCookieDomain(wikiaEnv, env.WIKIA_DATACENTER),
			gaUserSalt: env.GA_USERID_SALT,
			wikiaEnv,
			mediawikiDomain: env.MEDIAWIKI_DOMAIN,
			wikiaDatacenter: env.WIKIA_DATACENTER,
			inContextTranslationsEnabled: env.MOBILE_WIKI_INCONTEXT_ENABLED === "true",
		};

		runtimeServicesConfig = {
			domain: getServicesDomain(wikiaEnv, env.WIKIA_DATACENTER)
		};

		if (!isBlank(buckySampling)) {
			const buckySamplingInt = parseInt(buckySampling, 10);

			if (buckySamplingInt >= 0 && buckySamplingInt <= 100) {
				// Convert percent to 0-1 scale
				runtimeConfig.weppy = {
					samplingRate: buckySamplingInt / 100
				};
			}
		}

		if (!isBlank(noExternals)) {
			runtimeConfig.noExternals = Boolean(noExternals);
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
