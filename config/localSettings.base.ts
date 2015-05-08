/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./localSettings.d.ts" />
/**
 * Base localSettings for application
 * @example
 * var localConfig = require('./config').localSettings
 */

import Utils = require('../server/lib/Utils');
var deepExtend: any = require('deep-extend');

var localSettings: LocalSettings = {
	apiBase: '/api/v1',
	// Default timeout for backend requests
	// This timeout is the same as the MW app timeout
	backendRequestTimeout: 300000,
	domain: 'wikia.com',
	// Targeted environment [prod|preview|verify|dev|testing]
	environment: Utils.getEnvironment(process.env.WIKIA_ENVIRONMENT),
	helios: {
		// Never add the host, secret or key here directly, only specify in your localSettings.ts (.gitignored)
		host: process.env.HELIOS_HOST,
		secret: process.env.HELIOS_SECRET,
		id: process.env.HELIOS_ID
	},
	ironSecret: 'TEST_SECRET_REPLACE_THIS',
	// NOTE: On your devbox, use your eth0 address in able to bind route to something accessible
	host: process.env.HOST,
	mediawikiDomain: process.env.MEDIAWIKI_DOMAIN || null,
	// Special salt for accepting HTML from MediaWiki for /editor_preview/
	mwPreviewSalt: process.env.MW_PREVIEW_SALT,
	// By default send logs to local syslog only. Possible targets are [syslog, console, default]
	// The value represent the minimum logging level
	loggers: {
		syslog: 'debug'
	},
	devboxDomain: Utils.stripDevboxDomain(process.env.HOST || process.env.LOGNAME),
	maxRequestsPerChild: parseInt(process.env.MAX_REQUEST_PER_CHILD, 10) || 50000,
	optimizely: {
		enabled: true,
		scriptPath: '//cdn.optimizely.com/js/',
		devAccount: '2441440871',
		account: '2449650414'
	},
	qualaroo: {
		enabled: true,
		scriptUrl: '//s3.amazonaws.com/ki.js/52510/bgJ.js',
	},
	port: process.env.PORT || 8000,
	proxyMaxRedirects: 3,
	redirectUrlOnNoData: 'http://community.wikia.com/wiki/Community_Central:Not_a_valid_Wikia',
	tracking: {
		ga: {
			primary: {
				id: 'UA-32129070-1',
				sampleRate: 10
			},
			ads: {
				prefix: 'ads',
				id: 'UA-32129071-1',
				sampleRate: 100
			}
		},
		quantserve: 'p-8bG6eLqkH6Avk',
		comscore: {
			keyword: 'comscorekw',
			id: '6177433',
			c7: '',
			c7Value: ''
		},
		krux: {
			mobileId: 'JTKzTN3f'
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
	weppy: {
		enabled: process.env.WIKIA_ENVIRONMENT === 'prod',
		host: 'http://speed.wikia.net/__rum',
		samplingRate: 0.01,
		aggregationInterval: 1000
	},
	wikiFallback: 'community',
	workerCount: parseInt(process.env.WORKER_COUNT, 10) || 1,
	workerDisconnectTimeout: 3000,
	// CDN prefix with no tailing slash
	cdnBaseUrl: '//mercury.nocookie.net'
};

export function getSettings(customLocalSet: any): LocalSettings {
	return deepExtend(localSettings, customLocalSet);
}
