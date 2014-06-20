/// <reference path="../typings/hapi/hapi.d.ts" />

import path = require('path');

function routes(server) {
	var second = 1000;
	// all the routes that should resolve to loading single page app entry view
	var indexRoutes: string[] = [
		'/',
		'/w/{parts*}'
	];

	var config = {
		cache: {
			privacy: 'public',
			expiresIn: 60 * second
			   }
	};

	indexRoutes.forEach(function(route: string) {
		server.route({
			method: 'GET',
			path: route,
			config: config,
			handler: (request, reply) => {
				server.methods.getPrerenderedData(request._pathSegments, (error, result) => {
					// TODO: handle error a bit better :D
					reply.view('application', error || result);
				});
			}
		});
	});

	// eg. http://www.example.com/article/muppet/Kermit_the_Frog
	server.route({
		method: 'GET',
		path: '/article/{wikiName}/{articleTitle}',
		config: config,
		handler: (request, reply) => {
			server.methods.getArticleData(request.params, (error, result) => {
				// TODO: handle error a bit better :D
				reply(error || result);
			});
		}
		//require('./controllers/article').handleRoute
	});

	// eg. http://www.example.com/articleComments/muppet/154
	server.route({
		method: 'GET',
		path: '/articleComments/{wiki}/{articleId}/{page?}',
		handler: require('./controllers/articleComments').handleRoute
	});

	// Set up static assets serving, this is probably not a final implementation as we should probably setup
	// nginx or apache to serve static assets and route the rest of the requests to node.
	server.route({
		method: 'GET',
		path: '/public/{path*}',
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

