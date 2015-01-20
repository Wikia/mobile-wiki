/// <reference path="../typings/hapi/hapi.d.ts" />

import path = require('path');
import Hapi = require('hapi');
import localSettings = require('../config/localSettings');
import Utils = require('./lib/Utils');
import Caching = require('./lib/Caching');
import Tracking = require('./lib/Tracking');
import MediaWiki = require('./lib/MediaWiki');
import util = require('util');
import search = require('./controllers/search');
import article = require('./controllers/article/index');
import comments = require('./controllers/article/comments');

var wikiDomains: {
		[key: string]: string;
	} = {},
	cachingTimes = {
		article: {
			enabled: false,
			cachingPolicy: Caching.Policy.Private,
			varnishTTL: Caching.Interval.standard,
			browserTTL: Caching.Interval.default
		},
		articleAPI: {
			enabled: false,
			cachingPolicy: Caching.Policy.Private,
			varnishTTL: Caching.Interval.disabled,
			browserTTL: Caching.Interval.disabled
		},
		commentsAPI: {
			enabled: false,
			cachingPolicy: Caching.Policy.Private,
			varnishTTL: Caching.Interval.disabled,
			browserTTL: Caching.Interval.disabled
		},
		searchAPI: {
			enabled: false,
			cachingPolicy: Caching.Policy.Private,
			varnishTTL: Caching.Interval.disabled,
			browserTTL: Caching.Interval.disabled
		}
	};

/**
 * Get cached Media Wiki domain name from the request host
 *
 * @param {string} host Request host name
 * @returns {string} Host name to use for API
 */
function getWikiDomainName (host: string): string {
	var wikiDomain: string;

	host = Utils.clearHost(host);
	wikiDomain = wikiDomains[host];

	return wikiDomains[host] = wikiDomain ? wikiDomain : Utils.getWikiDomainName(localSettings, host);
}

/**
 * Prepares article data to be rendered
 * TODO: clean up this function
 *
 * @param {Hapi.Request} request
 * @param result
 */
function beforeArticleRender (request: Hapi.Request, result: any): void {
	var title: string,
		articleDetails: any,
		userDir = 'ltr';

	if (result.article.details) {
		articleDetails = result.article.details;
		title = articleDetails.cleanTitle ? articleDetails.cleanTitle : articleDetails.title;
	} else if (request.params.title) {
		title = request.params.title.replace(/_/g, ' ');
	} else {
		title = result.wiki.mainPageTitle.replace(/_/g, ' ');
	}

	if (result.article.article) {
		// we want to return the article content only once - as HTML and not JS variable
		result.articleContent = result.article.article.content;
		delete result.article.article.content;
	}

	if (result.wiki.language) {
		userDir = result.wiki.language.userDir;
		result.isRtl = (userDir === 'rtl');
	}

	result.displayTitle = title;
	result.isMainPage = (title === result.wiki.mainPageTitle.replace(/_/g, ' '));
	result.canonicalUrl = result.wiki.basePath + result.wiki.articlePath + title.replace(/ /g, '_');
	result.themeColor = Utils.getVerticalColor(localSettings, result.wiki.vertical);
	result.query = {
		noExternals: !!(request.query.noexternals && request.query.noexternals !== '0' && request.query.noexternals !== '')
	};
}

/**
 * Handles article response from API
 *
 * @param {Hapi.Request} request
 * @param reply
 * @param error
 * @param result
 */
function onArticleResponse (request: Hapi.Request, reply: any, error: any, result: any = {}): void {
	var code = 200,
		response: Hapi.Response;

	if (!result.article.article && !result.wiki.dbName) {
		//if we have nothing to show, redirect to our fallback wiki
		reply.redirect(localSettings.redirectUrlOnNoData);
	} else {
		Tracking.handleResponse(result, request);

		if (error) {
			code = error.code || error.statusCode || 500;
			result.error = JSON.stringify(error);
		}

		beforeArticleRender(request, result);

		response = reply.view('application', result);
		response.code(code);
		Caching.setResponseCaching(response, cachingTimes.article);
	}
}

/**
 * Adds routes to the server
 *
 * @param server
 */
function routes (server: Hapi.Server) {
	var second = 1000,
		indexRoutes = [
			'/wiki/{title*}',
			'/{title*}',
			// TODO this is special case needed for /wiki path, it should be refactored
			'/{title}'
		],
		proxyRoutes = [
			'/favicon.ico',
			'/robots.txt'
		],
		config = {
			cache: {
				privacy: Caching.policyString(Caching.Policy.Public),
				expiresIn: 60 * second
			}
		};

	// all the routes that should resolve to loading single page app entry view
	indexRoutes.forEach((route: string) => {
		server.route({
			method: 'GET',
			path: route,
			config: config,
			handler: (request: Hapi.Request, reply: any) => {
				var path: string = request.path,
					wikiDomain: string = getWikiDomainName(request.headers.host);

				if (path === '/' || path === '/wiki/') {
					article.getWikiVariables(wikiDomain, (error: any, wikiVariables: any) => {
						if (error) {
							// TODO check error.statusCode and react accordingly
							reply.redirect(localSettings.redirectUrlOnNoData);
						} else {
							article.getArticle({
								wikiDomain: wikiDomain,
								title: wikiVariables.mainPageTitle,
								redirect: request.query.redirect
							}, wikiVariables, (error: any, result: any = {}) => {
								onArticleResponse(request, reply, error, result);
							});
						}
					});
				} else  {
					article.getFull({
						wikiDomain: wikiDomain,
						title: request.params.title,
						redirect: request.query.redirect
					}, (error: any, result: any = {}) => {
						onArticleResponse(request, reply, error, result);
					});
				}
			}
		});
	});

	// eg. article/muppet/Kermit_the_Frog
	server.route({
		method: 'GET',
		path: localSettings.apiBase + '/article/{articleTitle*}',
		config: config,
		handler: (request: Hapi.Request, reply: Function) => {
			var response: Hapi.Response;
			article.getData({
				wikiDomain: getWikiDomainName(request.headers.host),
				title: request.params.articleTitle,
				redirect: request.params.redirect
			}, (error: any, result: any) => {
				var response = reply(error || result);
				Caching.setResponseCaching(response, cachingTimes.articleAPI);
			});
		}
	});

	// eg. articleComments/muppet/154
	server.route({
		method: 'GET',
		path: localSettings.apiBase + '/article/comments/{articleId}/{page?}',
		handler: (request: Hapi.Request, reply: Function) => {
			var params = {
					wikiDomain: getWikiDomainName(request.headers.host),
					articleId: parseInt(request.params.articleId, 10) || null,
					page: parseInt(request.params.page, 10) || 0
				};

			if (params.articleId === null) {
				reply(Hapi.error.badRequest('Invalid articleId'));
			} else {
				comments.handleRoute(params, (error: any, result: any): void => {
					var response = reply(error || result);
					Caching.setResponseCaching(response, cachingTimes.commentsAPI);
				});
			}
		}
	});

	// eg. search/muppet
	server.route({
		method: 'GET',
		path: localSettings.apiBase + '/search/{query}',
		handler: (request: any, reply: Function): void => {
			var params = {
				wikiDomain: getWikiDomainName(request.headers.host),
				query: request.params.query
			};

			search.searchWiki(params, (error: any, result: any) => {
				var response: Hapi.Response;
				if (error) {
					response = reply(error).code(error.exception.code);
				} else {
					response = reply(result);
				}
				Caching.setResponseCaching(response, cachingTimes.searchAPI);
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

	//eg. robots.txt
	proxyRoutes.forEach((route: string) => {
		server.route({
			method: 'GET',
			path: route,
			handler: (request: any, reply: any) => {
				var path = route.substr(1),
					url = MediaWiki.createUrl(getWikiDomainName(request.headers.host), path);

				reply.proxy({
					uri: url,
					redirects: localSettings.proxyMaxRedirects
				});
			}
		});
	});

	// Heartbeat route for monitoring
	server.route({
		method: 'GET',
		path: '/heartbeat',
		handler: (request: any, reply: Function) => {
			var memoryUsage = process.memoryUsage();

			reply('Server status is: OK')
				.header('X-Memory', String(memoryUsage.rss))
				.header('X-Uptime', String(~~process.uptime()))
				.code(200);
		}
	});
}

export = routes;

