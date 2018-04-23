module.exports = function (environment) {
	let ENV = {
		modulePrefix: 'mobile-wiki',
		environment,
		locationType: 'router-scroll',
		historySupportMiddleware: true,
		facebook: {
			appId: '112328095453510'
		},
		productionBaseDomain: 'wikia.com',
		services: {
			domain: 'services.wikia.com',
			discussions: {
				baseAPIPath: 'discussion'
			},
			onSiteNotifications: {
				baseAPIPath: 'on-site-notifications'
			},
			eventLogger: {
				baseAPIPath: 'event-logger'
			}
		},
		verticalColors: {
			comics: '#ff5400',
			games: '#94d11f',
			books: '#ff7f26',
			movies: '#09d3bf',
			lifestyle: '#ffd000',
			music: '#c819ad',
			tv: '#00b7e0'
		},
		translationsNamespaces: ['main', 'search', 'design-system'],
		tracking: {
			ua: {
				primary: {
					id: 'UA-32129070-1',
					sampleRate: 100
				},
				ads: {
					prefix: 'ads',
					id: 'UA-32129071-1',
					sampleRate: 100
				},
				scriptUrl: 'https://www.google-analytics.com/analytics.js'
			},
			quantcast: {
				id: 'p-8bG6eLqkH6Avk',
				labels: 'Category.MobileWeb.Mercury'
			},
			comscore: {
				keyword: 'comscorekw',
				id: '6177433',
				c7: '',
				c7Value: ''
			},
			krux: {
				mobileId: 'JTKzTN3f'
			},
			netzathleten: {
				enabled: false,
				url: '',
				isMainPage: false
			}
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
		},
		fastboot: {
			hostWhitelist: [
				/mobile-wiki-.*\.(dev|prod|staging)\.(poz-dev|poz|sjc-dev|sjc|res)\.k8s\.wikia\.net/,
				/.*\.wikia-dev\.(pl|us)/,
				/.*\.wikia.com/,
				/^localhost:\d+$/
			]
		},
		fastbootOnly: {
			helios: {
				internalUrl: 'http://prod.sjc.k8s.wikia.net/helios/info',
				timeout: 3000
			}
		}
	};

	if (environment === 'development') {
		ENV.APP.LOG_RESOLVER = false;
		ENV.APP.LOG_ACTIVE_GENERATION = true;
		ENV.APP.LOG_TRANSITIONS = true;
		ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
		ENV.APP.LOG_VIEW_LOOKUPS = true;

		ENV.fastbootOnly.helios.internalUrl = 'http://dev.sjc-dev.k8s.wikia.net/helios/info';
		ENV.facebook.appId = '881967318489580';

		ENV['ember-cli-mirage'] = {
			enabled: false
		};
	}

	if (environment === 'test') {
		// Testem prefers this...
		ENV.rootURL = '/';
		ENV.locationType = 'none';

		// keep test console output quieter
		ENV.APP.LOG_ACTIVE_GENERATION = false;
		ENV.APP.LOG_VIEW_LOOKUPS = false;

		ENV.APP.rootElement = '#ember-testing';
		ENV.APP.autoboot = false;

		ENV['ember-cli-mirage'] = {
			autostart: true
		};
	}

	if (process.env.IMAGE_VERSION) {
		ENV.APP.version = process.env.IMAGE_VERSION;
	}

	return ENV;
};
