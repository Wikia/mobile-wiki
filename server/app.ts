/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/hapi/hapi.d.ts" />

import hapi = require('hapi');
import path = require('path');
import localSettings = require('../config/localSettings');

class App {
	constructor() {
		var server: Hapi.Server,
			options: {},
			//Counter for maxRequestPerChild
			counter = 0;

		server = hapi.createServer(localSettings.host, localSettings.port, {
			// ez enable cross origin resource sharing
			cors: true,
			views: {
				engines: {
					hbs: require('handlebars')
				},
				isCached: process.env.NODE_ENV === 'production',
				layout: true,
				/*
				 * Helpers are functions usable from within handlebars templates.
				 * @example the getScripts helper can be used like: <script src="{{ getScripts 'foo.js' }}">
				 */
				helpersPath: path.join(__dirname, '../views', '_helpers'),
				path: path.join(__dirname, '../views'),
				partialsPath: path.join(__dirname, '../views', '_partials')
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
			function (err) {
				if (err) {
					console.log('[ERROR] ', err);
				}
			}
		);

		/*
		 * Routes
		 */
		require('./routes')(server);

		server.start(function () {
			console.log('Server started at: ' + server.info.uri);
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
}

var app: App = new App();
