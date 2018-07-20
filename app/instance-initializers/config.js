import config from '../config/environment';
import extend from '../utils/extend';

function getBaseDomain(wikiaEnv, request) {
	// x-staging is e.g. 'sandbox-s1' or 'preview'
	// it's set in https://github.com/Wikia/wikia-vcl/blob/master/wikia.com/control-stage.vcl
	const staging = request.get('headers').get('x-staging');

	if (wikiaEnv === 'dev') {
		return FastBoot.require('process').env.WIKIA_DEV_DOMAIN;
	} else if (staging) {
		return `${staging}.${config.productionBaseDomain}`;
	}

	return config.productionBaseDomain;
}

function getServicesDomain(wikiaEnv, datacenter, request) {
	if (wikiaEnv === 'dev') {
		const devDomain = (datacenter === 'poz') ? 'pl' : 'us';
		const devStack = (request.get('host').match(/\.(wikia-dev)\.(pl|us)$/gi)) ? 'wikia-dev' : 'fandom-dev';
		return `services.${devStack}.${devDomain}`;
	}

	return `services.${config.productionBaseDomain}`;
}

function getHeliosInfoURL(wikiaEnv, datacenter) {
	if (wikiaEnv === 'dev') {
		const devEnvironment = (datacenter === 'poz') ? 'poz-dev' : 'sjc-dev';

		return `http://dev.${devEnvironment}.k8s.wikia.net/helios/info`;
	}

	return `http://prod.${datacenter}.k8s.wikia.net/helios/info`;
}

function getCookieDomain(wikiaEnv) {
	if (wikiaEnv === 'dev') {
		return `.${FastBoot.require('process').env.WIKIA_DEV_DOMAIN}`;
	}

	return `.${config.productionBaseDomain}`;
}

export function initialize(applicationInstance) {
	let fastboot = applicationInstance.lookup('service:fastboot');
	let shoebox = fastboot.get('shoebox');
	let runtimeConfig;
	let runtimeServicesConfig;

	if (fastboot.get('isFastBoot')) {
		const env = FastBoot.require('process').env;
		const wikiaEnv = env.WIKIA_ENVIRONMENT;
		const request = fastboot.get('request');

		runtimeConfig = {
			baseDomain: getBaseDomain(wikiaEnv, fastboot.get('request')),
			cookieDomain: getCookieDomain(wikiaEnv),
			wikiaEnv,
			inContextTranslationsEnabled: env.MOBILE_WIKI_INCONTEXT_ENABLED === 'true',
		};

		runtimeServicesConfig = {
			domain: getServicesDomain(wikiaEnv, env.WIKIA_DATACENTER, request)
		};

		shoebox.put('runtimeConfig', runtimeConfig);
		shoebox.put('runtimeServicesConfig', runtimeServicesConfig);

		// variables below won't be available on the front end
		extend(config.fastbootOnly, {
			gaUserSalt: env.SECRET_CHEF_GOOGLE_ANALYTICS_USER_ID_SALT,
			helios: {
				internalUrl: getHeliosInfoURL(wikiaEnv, env.WIKIA_DATACENTER)
			},
			mediawikiDomain: env.MEDIAWIKI_DOMAIN,
			wikiaDatacenter: env.WIKIA_DATACENTER
		});
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
