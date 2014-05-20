/// <reference path="../definitions/hapi/hapi.d.ts" />

import path = require('path');

function routes(server) {
	// all the routes that should resolve to loading single page app entry view
	var indexRoutes: string[] = [
		'/',
		'/w/{parts*}'
	];

	indexRoutes.forEach(function (route: string) {
		server.route({
			method: 'GET',
			path: route,
			handler: require('./controllers/home')
		});
	});

	// eg. http://www.example.com/article/muppet/154
	server.route({
		method: 'GET',
		path: '/article/{wiki}/{articleTitle}',
		handler: require('./controllers/article').handleRoute
	});

	// eg. http://www.example.com/article/muppet/154
	server.route({
		method: 'GET',
		path: '/articleComments/{wiki}/{articleId}',
		handler: require('./controllers/articleComments').handleRoute
	});

	// Set up static assets serving, this is probably not a final implementation as we should probably setup
	// nginx or apache to serve static assets and route the rest of the requests to node.
	server.route({
		method: 'GET',
		path: '/{path*}',
		handler: {
			directory: {
				path: path.join(__dirname, '../public'),
				listing: false,
				index: false
			}
		}
	});
}

export = routes;
