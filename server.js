#!/usr/bin/env node --use_strict

var Hapi = require('hapi');
var Path = require('path');
var config = require('./config');

var localSettings = config.localSettings();

var app = {};

app.initialize = function() {
	var server = new Hapi.createServer(localSettings.host, localSettings.port, {
		// ez enable cross origin resource sharing
		cors: true,
		views: {
			engines: {
				html: 'handlebars'
			},
			isCached: process.env.NODE_ENV === 'production',
			layout: true,
			/*
			 * Helpers are functions usable from within handlebars templates.
			 * @example the getScripts helper can be used like: <script src="{{ getScripts 'foo.js' }}">
			 */
			helpersPath: Path.join(__dirname, 'views', '_helpers'),
			path: Path.join(__dirname, 'views'),
			partialsPath: Path.join(__dirname, 'views', '_partials'),
		}
	});

	/*
	 * Routes
	 * TODO: These should be abstracted out into a separate directory with an index.js later, for modularity
	 * and maintainability sake
	 */

	// Set up static assets serving, this is probably not a final implementation as we should probably setup
	// nginx or apache to serve static assets and route the rest of the requests to node.
	server.route({
		method: 'GET',
		path: '/{path*}',
		handler: {
			directory: {
				path: Path.join(__dirname, '.tmp/public'),
				listing: false,
				index: false
			}
		}
	});

	// Base route
	server.route({
		method: 'GET',
		path: '/',
		handler: require('./controllers/home')
			.index
	});

	server.start(function() {
		console.log('Server started at: ' + server.info.uri);
	});
};

app.initialize();
