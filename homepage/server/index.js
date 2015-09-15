/*
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

'use strict';

var Hapi = require('hapi'),
	Good = require('good'),
	path = require('path'),
	localSettings = require('../config/localSettings').localSettings,
	routes = require('./routes').routes,
	server = new Hapi.Server();

server.connection({ port: localSettings.port });

// Initialize cookies
server.state('access_token', {
	isHttpOnly: true,
	clearInvalid: true,
	domain: localSettings.authCookieDomain
});

// Initialize session
server.state('session', {
	ttl: 24 * 60 * 60 * 1000,  // One day
	isSecure: true,
	path: '/',
	encoding: 'base64json'
});

server.route(routes);

server.views({
	engines: {
		html: require('handlebars')
	},
	path: path.resolve(__dirname, 'views'),
	layoutPath: path.resolve(__dirname, 'views/_layouts'),
	partialsPath: path.join(__dirname, 'views/_partials'),
	layout: 'default'
});

// Console logging
// TODO: This is a temporary solution for console logging, should be
// changed to use bunyan-based logger like main server
server.register({
	register: Good,
	options: {
		reporters: [{
			reporter: require('good-console'),
			events: {
				response: '*',
				log: '*'
			}
		}]
	}
}, function (err) {
	if (err) {
		throw err; // something bad happened loading the plugin
	}

	server.start(function () {
		server.log('info', 'Server running at: ' + server.info.uri);
	});
});
