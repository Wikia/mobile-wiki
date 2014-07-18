/// <reference path="../typings/hapi/hapi.d.ts" />

import path = require('path');
import Hapi = require('hapi');

/**
 * @desc extracts the wiki name from the host
 */
function getWikiName (host: string) {
	/**
	 * Capture groups:
 	 * 1. "sandbox-mercury." (if it's the beginning of the url)
	 * 2. The wiki name, including language code (i.e. it could be lastofus or de.lastofus)
	 * 3. Port including leading colon (e.g. :8000)
	 * We just return capture group 2
	*/
	var regex = /^(sandbox\-mercury\.)?(.+?)\.wikia.*\.com(:[0-9]+)?$/;
	return host.match(regex)[2];
}

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
					wiki: getWikiName(request.headers.host),
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
				wikiName: getWikiName(request.headers.host),
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
			var hostParts = request.headers.host.split('.');
			var params = {
				host: hostParts[hostParts.length - 3],
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

