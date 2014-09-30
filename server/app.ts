/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/hapi/hapi.d.ts" />
/// <reference path="../config/localSettings.d.ts" />

import hapi = require('hapi');
import path = require('path');
import url = require('url');
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

		this.setupLogging(server);

		server.ext('onPreResponse', this.onPreResponseHandler);

		require('./methods')(server);
		/*
		 * Routes
		 */
		require('./routes')(server);

		server.start(function() {
			logger.info('Server started', process.pid, 'at: ' + server.info.uri);
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

		process.on('message', function(msg: string) {
			if(msg === 'shutdown') {
				server.stop({
					timeout: localSettings.workerDisconnectTimeout
				}, function() {
					logger.info('stopped', process.pid);
				});
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

	private setupLogging(server: Hapi.Server): void {
		server.on('log', (event, tags) => {
			logger.error('Server Error', {
				data: event.data
			});
		});

		server.on('internalError', (request, err) => {
			logger.error('Internal error', {
				text: err.message,
				url: url.format(request.url),
				host: request.headers.host
			});
		});

		server.on('response', function (request) {
			logger.debug('Response', {
				host: request.headers.host,
				url: url.format(request.url),
				code: request.response.statusCode,
				responseTime: parseFloat(request.response.headers['x-backend-response-time'])
			});
		});
	}
}

var app: App = new App();
