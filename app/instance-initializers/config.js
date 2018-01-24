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
			noExternals = fastboot.get('request.queryParams.noexternals');

		runtimeConfig = {
			cookieDomain: getCookieDomain(wikiaEnv, env.WIKIA_DATACENTER),
			wikiaEnv,
			inContextTranslationsEnabled: env.MOBILE_WIKI_INCONTEXT_ENABLED === 'true',
		};

		runtimeServicesConfig = {
			domain: getServicesDomain(wikiaEnv, env.WIKIA_DATACENTER)
		};

		runtimeHeliosConfig = {
			internalUrl: getHeliosInfoURL(wikiaEnv, env.WIKIA_DATACENTER)
		};

		if (!isBlank(noExternals)) {
			runtimeConfig.noExternals = Boolean(noExternals);
		}

		shoebox.put('runtimeConfig', runtimeConfig);
		shoebox.put('runtimeServicesConfig', runtimeServicesConfig);

		// variables below won't be available on the front end
		extend(config.fastbootOnly, {
			gaUserSalt: env.SECRET_CHEF_GOOGLE_ANALYTICS_USER_ID_SALT,
			mediawikiDomain: env.MEDIAWIKI_DOMAIN,
			wikiaDatacenter: env.WIKIA_DATACENTER
		});

		extend(config.fastbootOnly.helios, runtimeHeliosConfig);
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
