/// <reference path="../typings/hapi/hapi.d.ts" />

import path = require('path');
import Hapi = require('hapi');
import localSettings = require('../config/localSettings');

var wikiNames: {
	[key: string]: string;
} = {};

/**
 * @desc extracts the wiki name from the host
 */
function getWikiName (host: string) {
	host = host.split(':')[0]; //get rid of port

	var wikiName = wikiNames[host],
		regex: RegExp,
		match: string[];

	if (wikiName) {
		return wikiName;
	} else {
		/**
		 * Capture groups:
		 * 0. "sandbox-*|preview|verify" (if it's the beginning of the url)
		 * 1. The wiki name, including language code (i.e. it could be lastofus or de.lastofus)
		 *    ^ Note: this will match any number of periods in the wiki name, not just one for the language code
		 * We just return capture group 1
		 */
		regex = /^(?:sandbox\-[^\.]+|preview|verify)?\.?(.+?)\.wikia.*\.(?:com|local)$/;
		match = host.match(regex);
		//TODO: This is a bad default, find better solution
		wikiName = match ? match[1] : 'community';

		return wikiNames[host] = wikiName;
	}
}

function routes(server: Hapi.Server) {
	var second = 1000;
	// all the routes that should resolve to loading single page app entry view

	function restrictedHandler (request: Hapi.Request, reply: any) {
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
		'/a/{title}/comments',
		'/wiki/{title}',
		'/wiki/{title}/comments'
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
			handler: (request: Hapi.Request, reply: any) => {
				var errorParams = {
					message: 'Internal Server Error',
					code: 500,
					details: '',
					gaId: ''
				};
				server.methods.getPrerenderedData({
					wiki: getWikiName(request.headers.host),
					title: request.params.title
				}, (error: any, result: any) => {
					// TODO: handle error a bit better :D
					if (error) {
						if (error.exception) {
							errorParams = error.exception;
						}
						errorParams.gaId = localSettings.gaId;
						reply.view('error', errorParams).code(errorParams.code);
					} else {
						// export Google Analytics code to layout
						result.gaId = localSettings.gaId;
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
		handler: (request: Hapi.Request, reply: Function) => {
			var params = {
				wikiName: getWikiName(request.headers.host),
				articleTitle: request.params.articleTitle
			};
			server.methods.getArticleData(params, (error: any, result: any) => {
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
		handler: (request: Hapi.Request, reply: any) => {
			var hostParts = request.headers.host.split('.');
			var params = {
				host: hostParts[hostParts.length - 3],
				articleId: parseInt(request.params.articleId, 10),
				page: parseInt(request.params.page, 10) || 1
			};
			server.methods.getArticleComments(params, (error: any, result: any) => {
				if (error) {
					error = Hapi.error.notFound(notFoundError);
				}
				reply(error || result);
			});
		}
	});

	server.route({
		method: 'GET',
		path: '/api/v1/search/{query}',
		handler: (request: any, reply: any) => {
			var params = {
				wikiName: getWikiName(request.headers.host),
				query: request.params.query
			};
			server.methods.searchForQuery(params, (error: any, result: any) => {
				if (error) {
					error = Hapi.error.notFound('No results for that search term');
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

