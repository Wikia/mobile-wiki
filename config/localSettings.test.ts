/// <reference path="../typings/node/node.d.ts" />
/// <reference path="./localSettings.d.ts" />
/**
 * localSettings for application, used by default by travis
 * (settings in .travis.yml)
 * @example
 * var localConfig = require('./config').localSettings
 */

var localSettings: LocalSettings = {
	// NOTE: On your devbox, use your eth0 address in able to bind route to something accessible
	host: process.env.HOST,
	port: 8000,
	maxRequestsPerChild: parseInt(process.env.MAX_REQUEST_PER_CHILD, 10) || 1000,
	workerCount: parseInt(process.env.WORKER_COUNT, 10) || 2,
	// Targeted environment [production|preview|verify|devbox_name]
	environment: process.env.WIKIA_ENVIRONMENT,
	mediawikiHost: 'kenneth',
	gaId: 'GOOGLE ANALYTICS ID',
	// cache responses in [memory|memcached]
	cache: {
		name: 'appcache',
		engine: 'memory' // cache responses in [memory|memcached]
	},
	wikiFallback: 'glee'
};

export = localSettings;
