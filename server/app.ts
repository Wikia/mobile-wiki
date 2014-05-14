/// <reference path="../definitions/hapi/hapi.d.ts" />

import Hapi = require('hapi');
import path = require('path');
var localSettings: any = require('./../../config/LocalSettings');

var app: any = {};

app.initialize = function () {
	var server: HapiServer,
		options: {};

	server = Hapi.createServer(localSettings.host, localSettings.port, {
		// ez enable cross origin resource sharing
		cors: true,
		views: {
			engines: {
				hbs: 'handlebars'
			},
			isCached: process.env.NODE_ENV === 'production',
			layout: true,
			/*
			 * Helpers are functions usable from within handlebars templates.
			 * @example the getScripts helper can be used like: <script src="{{ getScripts 'foo.js' }}">
			 */
			helpersPath: path.join(__dirname, '../../views', '_helpers'),
			path: path.join(__dirname, '../../views'),
			partialsPath: path.join(__dirname, '../../views', '_partials')
		}
	});


	options = {
		subscribers: {
			console: ['ops', 'request', 'log', 'error']
		}
	};

	server.pack.require('good', options, function (err) {
		if (err) {
			console.log('[ERROR] ', err);
		}
	});

	/*
	 * Routes
	 */
	require('./routes')(server);

	server.start(function () {
		console.log('Server started at: ' + server.info.uri);
	});
};

app.initialize();
