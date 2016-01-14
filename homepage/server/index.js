/*
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

'use strict';

var Hapi = require('hapi'),
	path = require('path'),
	localSettings = require('../config/localSettings').localSettings,
	routes = require('./routes').routes,
	logger = require('./logger'),
	server = new Hapi.Server();

server.connection({
	port: localSettings.port,
	routes: {
		state: {
			failAction: 'log'
		}
	}
});

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

server.ext('onPreResponse', function (request, reply) {
	if (request.response.variety !== 'file') {
		request.response.vary('cookie');
	}

	return reply.continue();
});


server.route(routes);

server.views({
	engines: {
		hbs: require('handlebars')
	},
	path: path.resolve(__dirname, 'views'),
	layoutPath: path.resolve(__dirname, 'views/_layouts'),
	partialsPath: path.join(__dirname, 'views/_partials'),
	layout: 'default'
});

server.register(logger.createLogger(localSettings.logger), function (err) {
	if (err) {
		throw err;
	}

	server.start(function () {
		server.log('info', 'Server running at: ' + server.info.uri);
	});
});
