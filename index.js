#!/usr/bin/env node --use strict

/* jshint strict: false */
var Hapi = require('hapi');
var Path = require('path');

var app = {};

app.initialize = function() {
	var server = new Hapi.createServer('localhost', 8888, {
		cors: true,
		views: {
			engines: {
				html: 'handlebars'
			},
			isCached: process.env.NODE_ENV === 'production',
			layout: true,
			helpersPath: Path.join(__dirname, 'views', '_helpers'),
			path: Path.join(__dirname, 'views'),
			partialsPath: Path.join(__dirname, 'views', '_partials'),
		}
	});

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
