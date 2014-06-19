/// <reference path="../typings/node/node.d.ts" />
/// <reference path="../typings/hapi/hapi.d.ts" />

import hapi = require('hapi');
import path = require('path');
import localSettings = require('../config/localSettings');

class App {
	constructor() {
		var server: Hapi.Server,
			options: {};

		server = hapi.createServer(localSettings.host, localSettings.port, {
			// ez enable cross origin resource sharing
			cors: true,
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
			}
		});

		options = {
			subscribers: {
				console: ['ops', 'request', 'log', 'error']
			}
		};

		/*
		 * Server Methods
		 */
		require('./methods')(server);
		/*
		 * Routes
		 */
		require('./routes')(server);

		server.start(function() {
			console.log('Server started at: ' + server.info.uri);
		});
	}
}

var app: App = new App();
