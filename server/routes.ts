/// <reference path="../typings/hoek/hoek.d.ts" />
import Hoek = require('hoek');
import localSettings = require('../config/localSettings');
import Caching = require('./lib/Caching');

interface RouteDefinition {
	method: string[]|string;
	path: string;
	handler: Function;
	config?: any;
}

var routes: RouteDefinition[],
	unauthenticatedRoutes: RouteDefinition[],
	authenticatedRoutes: RouteDefinition[],
	articlePagePaths: string[],
	proxyRoutePaths: string[],
	unauthenticatedRouteConfig = {
		config: {
			cache: {
				privacy: Caching.policyString(Caching.Policy.Public),
				expiresIn: 60000
			},
			auth: {
				mode: 'try',
				strategy: 'session'
			},
			plugins: {
				'hapi-auth-cookie': {
					redirectTo: false
				}
			}
		}
	};

unauthenticatedRoutes = [
	{
		method: 'GET',
		path: '/favicon.ico',
		handler: require('./facets/operations/proxyMW')
	},
	{
		method: 'GET',
		path: '/robots.txt',
		handler: require('./facets/operations/proxyMW')
	},
	{
		method: 'GET',
		path: '/front/{path*}',
		handler: require('./facets/operations/assets')
	},
	{
		method: 'GET',
		path: '/public/{path*}',
		handler: require('./facets/operations/assets')
	},
	{
		method: 'GET',
		path: '/heartbeat',
		handler: require('./facets/operations/heartbeat')
	},
	/**
	 * API Routes
	 * @description The following routes should just be API routes
	 */
	{
		method: 'GET',
		path: localSettings.apiBase + '/article/{articleTitle*}',
		handler: require('./facets/api/article').get
	},
	{
		method: 'GET',
		// TODO: if you call to api/v1/comments/ without supplying an id, this actually calls /api/v1/article
		path: localSettings.apiBase + '/article/comments/{articleId}/{page?}',
		handler: require('./facets/api/articleComments').get
	},
	{
		method: 'GET',
		path: localSettings.apiBase + '/search/{query}',
		handler: require('./facets/api/search').get
	},
	/**
	 * Authentication Routes
	 * @description The following routes should be related to authentication
	 */
	 {
		method: 'GET',
		path: '/logout',
		handler: require('./facets/auth/logout')
	},
	{
		method: 'GET',
		path: '/login',
		config: {
			auth: {
				mode: 'try',
				strategy: 'session'
				},
				plugins: {
					'hapi-auth-cookie': {
						redirectTo: false
				}
			}
		},
		handler: require('./facets/auth/login').get
	},
	{
		method: 'POST',
		path: '/login',
		handler: require('./facets/auth/login').post
	},
	{
		// Store authentication data after log-in
		method: 'GET',
		path: '/auth',
		handler: require('./facets/auth/handleAuth')
	},
	{
		method: 'GET',
		path: '/breadcrumb',
		handler: require('./facets/operations/generateCSRFView')
	},
	{
		method: 'GET',
		path: '/join',
		handler: require('./facets/auth/join')
	},
];

articlePagePaths = [
	'/wiki/{title*}',
	'/{title*}',
	// TODO this is special case needed for /wiki path, it should be refactored
	'/{title}'
];

articlePagePaths.forEach((path) => {
	unauthenticatedRoutes.push({
		method: 'GET',
		path: path,
		handler: require('./facets/showArticle')
	});
});

authenticatedRoutes = [
	{
		method: 'GET',
		path: '/test',
		// TODO: This is just an example, remove this handler logic from the routes file later
		handler (request: Hapi.Request, reply: any) {
			reply(request.auth);
		}
	}
];

unauthenticatedRoutes = unauthenticatedRoutes.map((route) => {
	return Hoek.applyToDefaults(unauthenticatedRouteConfig, route);
});

routes = unauthenticatedRoutes.concat(authenticatedRoutes);

export = routes;
