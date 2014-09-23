/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/hapi/hapi.d.ts" />
/// <reference path="../config/localSettings.d.ts" />

import hapi = require('hapi');
import path = require('path');
import localSettings = require('../config/localSettings');
import logger = require('./lib/Logger');

class App {
	constructor() {
		var server: Hapi.Server,
			options: {},
			//Counter for maxRequestPerChild
			counter = 0,
			second = 1000;

		server = hapi.createServer(localSettings.host, localSettings.port, {
			// ez enable cross origin resource sharing
			cors: true,
			cache: this.getCacheSettings(localSettings.cache),
			views: {
				engines: {
					hbs: require('handlebars')
				},
				isCached: true,
				layout: true,
				/*
				 * Helpers are functions usable from within handlebars templates.
				 * @example the getScripts helper can be used like: <script src="{{ getScripts 'foo.js' }}">
				 */
				helpersPath: path.join(__dirname, '../views', '_helpers'),
				path: path.join(__dirname, '../views'),
				partialsPath: path.join(__dirname, '../views', '_partials')
			},
			state: {
				cookies: {
					strictHeader: false
				}
			}
		});

		options = {
			subscribers: {
				console: ['ops', 'request', 'log', 'error']
			}
		};

		server.pack.register({
				plugin: require('good'),
				options: options
			},
			function (err: any) {
				if (err) {
					logger.error(err);
				}
			}
		);

		server.ext('onPreResponse', this.onPreResponseHandler);

		require('./methods')(server);
		/*
		 * Routes
		 */
		require('./routes')(server);

		server.start(function() {
			logger.info('Server started at: ' + server.info.uri);
			process.send('Server started');
		});

		server.on('response', function () {
			counter++;

			if (counter >= localSettings.maxRequestsPerChild) {
				//This is a safety net for memory leaks
				//It restarts child so even if it leaks we are 'safe'
				process.exit(0);
			}
		});
	}

	/**
	 * @desc Create caching config object based on caching config
	 *
	 * @param {object} cache Cache settings
	 * @returns {object} Caching config
	 */
	private getCacheSettings(cache: CacheInterface): CacheInterface {
		if (typeof cache === 'object') {
			cache.engine = require('catbox-' + cache.engine);
			return cache;
		}
		// Fallback to memory
		logger.warning('No cache settings found. Falling back to memory');
		return {
			name: 'appcache',
			engine: require('catbox-memory')
		};
	}

	/**
	 * @desc Set `X-Backend-Response-Time` header to every response. Value is in ms
	 *
	 * @param {object} request
	 * @param {function} next
	 */
	private onPreResponseHandler(request: Hapi.Request, next: Function): void {
		var response = <Hapi.Response>(request.response),
			responseTimeSec = (Date.now() - request.info.received) / 1000;
		if (response && response.header) {
			response.header('X-Backend-Response-Time', responseTimeSec.toFixed(3));
		}
		next();
	}
}

var app: App = new App();
