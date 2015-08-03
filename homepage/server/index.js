/*
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

'use strict';

var Hapi = require('hapi'),
	Good = require('good'),
	path = require('path'),
	routes = require('./routes').routes,
	server = new Hapi.Server();

server.connection({ port: 8111 });
server.route(routes);

server.views({
	engines: {
		html: require('handlebars')
	},
	path: path.resolve(__dirname, 'views'),
	layoutPath: path.resolve(__dirname, 'views/layout'),
	layout: 'default',
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
