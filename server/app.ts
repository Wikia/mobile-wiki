/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/hapi/hapi.d.ts" />
/// <reference path="../config/localSettings.d.ts" />

import hapi = require('hapi');
import path = require('path');
import url = require('url');
import localSettings = require('../config/localSettings');
import logger = require('./lib/Logger');

// NewRelic is only enabled on one server and that logic is managed by chef, which passes it to our config
if (localSettings.isNewRelicEnabled) {
	require('newrelic');
}

/**
 * Application class
 */
class App {

	/**
	 * Creates new `hapi` server
	 */
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
			state: {
				cookies: {
					strictHeader: false
				}
			}
		});

		this.setupLogging(server);

		server.views({
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
		});

		server.ext('onPreResponse', this.onPreResponseHandler);

		require('./methods')(server);
		/*
		 * Routes
		 */
		require('./routes')(server);

		server.start(function() {
			logger.info({url: server.info.uri}, 'Server started');
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
			if (msg === 'shutdown') {
				server.stop({
					timeout: localSettings.workerDisconnectTimeout
				}, function() {
					logger.info('Server stopped');
				});
			}
		});
	}

	/**
	 * Create caching config object based on caching config
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
		logger.warn('No cache settings found. Falling back to memory');
		return {
			name: 'appcache',
			engine: require('catbox-memory')
		};
	}

	/**
	 * Set `X-Backend-Response-Time` header to every response. Value is in ms
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

	/**
	 * Setup logging for Hapi events
	 *
	 * @param server
	 */
	private setupLogging(server: Hapi.Server): void {

		server.on('log', (event: any, tags: Array<string>) => {
			logger.info({
				data: event.data,
				tags: tags
			}, 'Log');
		});

		server.on('internalError', (request: Hapi.Request, err: Error) => {
			logger.error({
				text: err.message,
				url: url.format(request.url),
				host: request.headers.host
			}, 'Internal error');
		});

		server.on('response', (request: Hapi.Request) => {
			logger.info({
				host: request.headers.host,
				url: url.format(request.url),
				code: (<Hapi.Response>request.response).statusCode,
				responseTime: parseFloat((<Hapi.Response>request.response).headers['x-backend-response-time'])
			}, 'Response');
		});
	}
}

var app: App = new App();
