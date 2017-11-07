import {isBlank} from '@ember/utils';
import config from '../config/environment';
import extend from '../utils/extend';

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

function getHeliosInfoURL(wikiaEnv, datacenter) {
	if (wikiaEnv === 'dev') {
		const devEnvironment = (datacenter === 'poz') ? 'poz-dev' : 'sjc-dev';

		return `http://dev.${devEnvironment}.k8s.wikia.net/helios/info`;
	} else if (wikiaEnv === 'staging') {
		return 'http://staging.helios.service.sjc.consul:9500/info';
	}

	return `http://prod.${datacenter}.k8s.wikia.net/helios/info`;
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
		runtimeServicesConfig,
		runtimeHeliosConfig;

	if (fastboot.get('isFastBoot')) {
		const env = FastBoot.require('process').env,
			wikiaEnv = env.WIKIA_ENVIRONMENT,
			buckySampling = fastboot.get('request.queryParams.buckysampling'),
			noExternals = fastboot.get('request.queryParams.noexternals');

		runtimeConfig = {
			cookieDomain: getCookieDomain(wikiaEnv, env.WIKIA_DATACENTER),
			wikiaEnv,
			mediawikiDomain: env.MEDIAWIKI_DOMAIN,
			wikiaDatacenter: env.WIKIA_DATACENTER,
			inContextTranslationsEnabled: env.MOBILE_WIKI_INCONTEXT_ENABLED === 'true',
		};

		runtimeServicesConfig = {
			domain: getServicesDomain(wikiaEnv, env.WIKIA_DATACENTER)
		};

		runtimeHeliosConfig = {
			internalUrl: getHeliosInfoURL(wikiaEnv, env.WIKIA_DATACENTER)
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
		shoebox.put('runtimeHeliosConfig', runtimeHeliosConfig);

		// variables below won't be available on the front end
		runtimeConfig.gaUserSalt = env.SECRET_CHEF_GOOGLE_ANALYTICS_USER_ID_SALT;
	} else {
		runtimeConfig = shoebox.retrieve('runtimeConfig');
		runtimeServicesConfig = shoebox.retrieve('runtimeServicesConfig');
		runtimeHeliosConfig = shoebox.retrieve('runtimeHeliosConfig');
	}

	extend(config.services, runtimeServicesConfig);
	extend(config.helios, runtimeHeliosConfig);
	extend(config, runtimeConfig);
}

export default {
	name: 'config',
	initialize
};
