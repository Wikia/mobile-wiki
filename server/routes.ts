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
			auth: false,
			plugins: {
				'hapi-auth-cookie': {
					redirectTo: false
				}
			}
		}
	},
	authPageConfig = {
		auth: {
			mode: 'try',
			strategy: 'session'
		},
		plugins: {
			'hapi-auth-cookie': {
				redirectTo: false
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
	{
		method: 'GET',
		path: '/wiki',
		handler: require('./facets/operations/redirectToRoot')
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
	{
		method: 'GET',
		path: localSettings.apiBase + '/curatedContent/{sectionName}',
		handler: require('./facets/api/curatedContent').get
	},
	{
		method: 'GET',
		path: localSettings.apiBase + '/category/{categoryName}',
		handler: require('./facets/api/category').get
	},
	{
		method: 'GET',
		path: localSettings.apiBase + '/userDetails',
		handler: require('./facets/api/userDetails').get
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
		config: authPageConfig,
		handler: require('./facets/auth/login').get
	},
	{
		method: 'GET',
		path: '/signup',
		config: authPageConfig,
		handler: require('./facets/auth/signup').get
	},
	{
		method: 'GET',
		path: '/breadcrumb',
		handler: require('./facets/operations/generateCSRFView')
	},
	{
		method: 'GET',
		path: '/join',
		config: authPageConfig,
		handler: require('./facets/auth/join')
	},
	{
		method: 'POST',
		path: '/editorPreview',
		handler: require('./facets/editorPreview')
	}
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

authenticatedRoutes = [];

unauthenticatedRoutes = unauthenticatedRoutes.map((route) => {
	return Hoek.applyToDefaults(unauthenticatedRouteConfig, route);
});

routes = unauthenticatedRoutes.concat(authenticatedRoutes);

export = routes;
