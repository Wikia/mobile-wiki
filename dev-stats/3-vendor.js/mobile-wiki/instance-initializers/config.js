define('mobile-wiki/instance-initializers/config', ['exports', 'mobile-wiki/config/environment', 'mobile-wiki/utils/extend'], function (exports, _environment, _extend) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.initialize = initialize;
	var isBlank = Ember.isBlank;


	function getServicesDomain(wikiaEnv, datacenter) {
		if (wikiaEnv === 'dev') {
			var devDomain = datacenter === 'poz' ? 'pl' : 'us';

			return 'services.wikia-dev.' + devDomain;
		} else if (wikiaEnv === 'staging') {
			return 'services.wikia-staging.com';
		} else {
			return 'services.wikia.com';
		}
	}

	function getHeliosInfoURL(wikiaEnv, datacenter) {
		if (wikiaEnv === 'dev') {
			var devEnvironment = datacenter === 'poz' ? 'poz-dev' : 'sjc-dev';

			return 'http://dev.' + devEnvironment + '.k8s.wikia.net/helios/info';
		} else if (wikiaEnv === 'staging') {
			return 'http://staging.helios.service.sjc.consul:9500/info';
		}

		return 'http://prod.' + datacenter + '.k8s.wikia.net/helios/info';
	}

	function getCookieDomain(wikiaEnv, datacenter) {
		if (wikiaEnv === 'dev') {
			var devDomain = datacenter === 'poz' ? 'pl' : 'us';

			return '.wikia-dev.' + devDomain;
		} else if (wikiaEnv === 'staging') {
			return '.wikia-staging.com';
		} else {
			return '.wikia.com';
		}
	}

	function initialize(applicationInstance) {
		var fastboot = applicationInstance.lookup('service:fastboot'),
		    shoebox = fastboot.get('shoebox'),
		    runtimeConfig = void 0,
		    runtimeServicesConfig = void 0,
		    runtimeHeliosConfig = void 0;

		if (fastboot.get('isFastBoot')) {
			var env = FastBoot.require('process').env,
			    wikiaEnv = env.WIKIA_ENVIRONMENT,
			    buckySampling = fastboot.get('request.queryParams.buckysampling'),
			    noExternals = fastboot.get('request.queryParams.noexternals');

			runtimeConfig = {
				cookieDomain: getCookieDomain(wikiaEnv, env.WIKIA_DATACENTER),
				gaUserSalt: env.SECRET_CHEF_GOOGLE_ANALYTICS_USER_ID_SALT,
				wikiaEnv: wikiaEnv,
				mediawikiDomain: env.MEDIAWIKI_DOMAIN,
				wikiaDatacenter: env.WIKIA_DATACENTER,
				inContextTranslationsEnabled: env.MOBILE_WIKI_INCONTEXT_ENABLED === 'true'
			};

			runtimeServicesConfig = {
				domain: getServicesDomain(wikiaEnv, env.WIKIA_DATACENTER)
			};

			runtimeHeliosConfig = {
				internalUrl: getHeliosInfoURL(wikiaEnv, env.WIKIA_DATACENTER)
			};

			if (!isBlank(buckySampling)) {
				var buckySamplingInt = parseInt(buckySampling, 10);

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
		} else {
			runtimeConfig = shoebox.retrieve('runtimeConfig');
			runtimeServicesConfig = shoebox.retrieve('runtimeServicesConfig');
			runtimeHeliosConfig = shoebox.retrieve('runtimeHeliosConfig');
		}

		(0, _extend.default)(_environment.default.services, runtimeServicesConfig);
		(0, _extend.default)(_environment.default.helios, runtimeHeliosConfig);
		(0, _extend.default)(_environment.default, runtimeConfig);
	}

	exports.default = {
		name: 'config',
		initialize: initialize
	};
});