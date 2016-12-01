/* eslint-env es5, node */
/* eslint prefer-template: 0, prefer-arrow-callback: 0, no-var: 0, object-shorthand: 0, no-empty: 0 */

module.exports = function (environment) {
	var ENV = {
		modulePrefix: 'main',
		environment: environment,
		locationType: 'auto',
		newRelic: {
			agent: 'js-agent.newrelic.com/nr-spa-974.min.js',
			licenseKey: '60e97494a4',
			spaMonitoring: true
		},
		EmberENV: {
			EXTEND_PROTOTYPES: {
				Array: true,
				String: false,
				Function: false
			},
			FEATURES: {
				// Here you can enable experimental features on an ember canary build
				// e.g. 'with-controller': true
			}
		},
		APP: {
			// Here you can pass flags/options to your application instance
			// when it is created
		}
	};

	ENV['ember-cli-mirage'] = {
		// fixme remember to disable it before merging user activity branch
		enabled: true
	};

	if (environment === 'development') {
		ENV.APP.LOG_RESOLVER = false;
		ENV.APP.LOG_ACTIVE_GENERATION = true;
		ENV.APP.LOG_TRANSITIONS = true;
		ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		ENV.APP.LOG_VIEW_LOOKUPS = true;

		ENV['ember-cli-mirage'] = {
			// fixme remember to disable it before merging user activity branch
			enabled: true
		};
	}

	if (environment === 'test') {
		// Testem prefers this...
		ENV.baseURL = '/';
		ENV.locationType = 'none';

		// keep test console output quieter
		ENV.APP.LOG_ACTIVE_GENERATION = false;
		ENV.APP.LOG_VIEW_LOOKUPS = false;

		ENV.APP.rootElement = '#ember-testing';
	}

	if (environment === 'production') {
		// ENV.newRelic.applicationId = '4539016';
	}

	return ENV;
};
