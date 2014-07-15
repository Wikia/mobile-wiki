/// <reference path="../typings/hapi/hapi.d.ts" />

import path = require('path');
import Hapi = require('hapi');

function routes(server) {
	var second = 1000;
	// all the routes that should resolve to loading single page app entry view

	function restrictedHandler (request, reply) {
		reply.view('error', Hapi.error.notFound('Invalid URL parameters'));
	}

	server.route({
		method: '*',
		path: '/',
		handler: restrictedHandler
	});

	server.route({
		method: '*',
		path: '/{p*}',
		handler: restrictedHandler
	});

	var indexRoutes: string[] = [
		'/a/{title}',
		'/a/{title}/comments'
	];

	var notFoundError = 'Could not find article or Wiki, please check to' +
						' see that you supplied correct parameters';

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
				server.methods.getPrerenderedData({
					wiki: request.headers.host.split('.')[0],
					title: request._pathSegments[2]
				}, (error, result) => {
					// TODO: handle error a bit better :D
					if (error) {
						error = Hapi.error.notFound(notFoundError);
						reply.view('error', error);
					} else {
						reply.view('application', result);
					}
				});
			}
		});
	});

	// eg. http://www.example.com/article/muppet/Kermit_the_Frog
	server.route({
		method: 'GET',
		path: '/api/v1/article/{articleTitle}',
		config: config,
		handler: (request, reply) => {
			var params = {
				wikiName: request.headers.host.split('.')[0],
				articleTitle: request.params.articleTitle
			};
			server.methods.getArticleData(params, (error, result) => {
				// TODO: handle error a bit better :D
				if (error) {
					error = Hapi.error.notFound(notFoundError);
				}
				reply(error || result);
			});
		}
	});

	// eg. http://www.example.com/articleComments/muppet/154
	server.route({
		method: 'GET',
		path: '/api/v1/article/comments/{articleId}/{page?}',
		handler: (request, reply) => {
			var params = {
				host: request.headers.host.split('.')[0],
				articleId: parseInt(request.params.articleId, 10),
				page: (request.params.page, 10) || 1
			};
			server.methods.getArticleComments(params, (error, result) => {
				if (error) {
					error = Hapi.error.notFound(notFoundError);
				}
				reply(error || result);
			});
		}
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

