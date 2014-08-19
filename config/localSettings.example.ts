/// <reference path="../typings/node/node.d.ts" />
/**
 * localSettings for application
 * @example
 * var localConfig = require('./config').localSettings
 */

var localSettings = {
	// NOTE: On your devbox, use your eth0 address in able to bind route to something accessible
	host: process.env.HOST,
	port: 8000,
	maxRequestsPerChild: parseInt(process.env.MAX_REQUEST_PER_CHILD, 10) || 1000,
	workerCount: parseInt(process.env.WORKER_COUNT, 10) || 2,
	// Targeted environment [production|preview|verify|devbox_name]
	environment: process.env.WIKIA_ENVIRONMENT,
	mediawikiHost: 'your-devbox-name',
	mediawikiCb: '123',
	gaId: 'GOOGLE ANALYTICS ID'
};

export = localSettings;
