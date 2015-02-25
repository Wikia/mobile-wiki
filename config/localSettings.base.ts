/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./localSettings.d.ts" />
/**
 * Base localSettings for application
 * @example
 * var localConfig = require('./config').localSettings
 */

import util = require('util');
import Utils = require('../server/lib/Utils');

var localSettings: LocalSettings = {
	apiBase: '/api/v1',
	// Default timeout for backend requests
	// This timeout is the same as the MW app timeout
	backendRequestTimeout: 300000,
	// Targeted environment [prod|preview|verify|dev|testing]
	environment: Utils.getEnvironment(process.env.WIKIA_ENVIRONMENT),
	// NOTE: On your devbox, use your eth0 address in able to bind route to something accessible
	host: process.env.HOST,
	// By default send logs to local syslog only. Possible targets are [syslog, console, default]
	// The value represent the minimum logging level
	loggers: {
		syslog: 'debug'
	},
	// This should always be overriden by environment variable or localSettings.ts
	mediawikiHost: Utils.stripDevboxDomain(process.env.HOST || 'OVERRIDE_ME'),
	maxRequestsPerChild: parseInt(process.env.MAX_REQUEST_PER_CHILD, 10) || 50000,
	optimizely: {
		enabled: false,
		scriptPath: '//cdn.optimizely.com/js/',
		devAccount: '2441440871',
		account: '2449650414'
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
			special: {
				prefix: 'special',
				id: 'UA-32132943-1',
				sampleRate: 100
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
	wikiFallback: 'community',
	workerCount: parseInt(process.env.WORKER_COUNT, 10) || 1,
	workerDisconnectTimeout: 3000,
	// CDN prefix with no tailing slash
	cdnBaseUrl: '//mercury.nocookie.net'
};

export function getSettings(customLocalSet: any): LocalSettings {
	return util._extend(localSettings, customLocalSet);
}
