/// <reference path="../typings/hapi/hapi.d.ts" />

import path = require('path');
import Hapi = require('hapi');
import localSettings = require('../config/localSettings');
import Utils = require('./lib/Utils');
import Tracking = require('./lib/Tracking');
import MediaWiki = require('./lib/MediaWiki');
import util = require('util');

var wikiDomains: {
	[key: string]: string;
} = {};

/**
 * Get cached Media Wiki domain name from the request host
 *
 * @param {string} host Request host name
 * @returns {string} Host name to use for API
 */
function getWikiDomainName(host: string): string {
	var wikiDomain: string;

	host = Utils.clearHost(host);
	wikiDomain = wikiDomains[host];

	return wikiDomains[host] = wikiDomain ? wikiDomain : Utils.getWikiDomainName(localSettings, host);
}

/**
 * Adds routes to the server
 *
 * @param server
 */
function routes(server: Hapi.Server) {
	var second = 1000,
		indexRoutes = [
			'/wiki/{title*}',
			'/{title*}'
		],
		proxyRoutes = [
			'/favicon.ico',
			'/robots.txt'
		],
		config = {
			cache: {
				privacy: 'public',
				expiresIn: 60 * second
			}
		};

	// TODO: Remove the cookie when we handle all traffic
	server.state('wk_mercury', {
		// 30 days in millisecons
		ttl: 2628000000,
		path: '/',
		autoValue: '1'
	});

	/**
	 * Article request handler
	 *
	 * @param request Hapi request object
	 * @param reply Hapi reply function
	 */
	function articleHandler(request: Hapi.Request, reply: any) {
		server.methods.getPreRenderedData({
			wikiDomain: getWikiDomainName(request.headers.host),
			title: request.params.title,
			redirect: request.query.redirect
		}, (error: any, result: any) => {
			var code = 200;

			Tracking.handleResponse(result, request);

			if (error) {
				code = error.code;

				result.error = JSON.stringify(error);
			}

			reply.view('application', result).code(code);
		});
	}

	// all the routes that should resolve to loading single page app entry view
	indexRoutes.forEach((route: string) => {
		server.route({
			method: 'GET',
			path: route,
			config: config,
			handler: articleHandler
		});
	});

	// eg. http://www.example.com/article/muppet/Kermit_the_Frog
	server.route({
		method: 'GET',
		path: localSettings.apiBase + '/article/{articleTitle*}',
		config: config,
		handler: (request: Hapi.Request, reply: Function) => {
			var params = {
				wikiDomain: getWikiDomainName(request.headers.host),
				title: request.params.articleTitle,
				redirect: request.params.redirect
			};

			server.methods.getArticleData(params, (error: any, result: any) => {
				reply(error || result);
			});
		}
	});

	// eg. http://www.example.com/articleComments/muppet/154
	server.route({
		method: 'GET',
		path: localSettings.apiBase + '/article/comments/{articleId}/{page?}',
		handler: (request: Hapi.Request, reply: Function) => {
			var params = {
					wikiDomain: getWikiDomainName(request.headers.host),
					articleId: parseInt(request.params.articleId, 10),
					page: parseInt(request.params.page, 10) || 0
				};

			server.methods.getArticleComments(params, (error: any, result: any) => {
				reply(error || result);
			});
		}
	});

	server.route({
		method: 'GET',
		path: localSettings.apiBase + '/search/{query}',
		handler: (request: any, reply: Function) => {
			var params = {
				wikiDomain: getWikiDomainName(request.headers.host),
				query: request.params.query
			};

			server.methods.searchSuggestions(params, (error: any, result: any) => {
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
				index: false,
				lookupCompressed: true
			}
		}
	});

	// Heartbeat route for monitoring
	server.route({
		method: 'GET',
		path: '/heartbeat',
		handler: (request: any, reply: Function) => {
			var memoryUsage = process.memoryUsage();
			reply('Server status is: OK')
				.header('X-Memory', String(memoryUsage.rss))
				.header('X-Uptime', String(~~ process.uptime()))
				.code(200);
		}
	});

	proxyRoutes.forEach((route: string) => {
		server.route({
			method: 'GET',
			path: route,
			handler: (request: any, reply: any) => {
				var path = route.substr(1),
					url = MediaWiki.createUrl(getWikiDomainName(request.headers.host), path);
				reply.proxy({
					uri: url,
					redirects: localSettings.proxyMaxRedirects || 3
				});
			}
		});
	});
}

export = routes;

