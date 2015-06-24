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
	routeCacheConfig = {
		privacy: Caching.policyString(Caching.Policy.Public),
		expiresIn: 60000
	},
	unauthenticatedRouteConfig = {
		config: {
			cache: routeCacheConfig,
			auth: false
		}
	},
	authenticatedRouteConfig = {
		config: {
			auth: {
				mode: 'try',
				strategy: 'session'
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
	 {
		method: 'GET',
		path: '/logout',
		handler: require('./facets/auth/logout')
	},
	{
		method: 'GET',
		path: '/breadcrumb',
		handler: require('./facets/operations/generateCSRFView')
	},
	{
		method: 'POST',
		path: '/editorPreview',
		handler: require('./facets/editorPreview')
	}
];

authenticatedRoutes = [
	/**
	 * Authentication Routes
	 * @description The following routes should be related to authentication
	 */
	{
		method: 'GET',
		path: '/join',
		handler: require('./facets/auth/join')
	},
	{
		method: 'GET',
		path: '/login',
		handler: require('./facets/auth/login').get
	},
	{
		method: 'GET',
		path: '/signup',
		handler: require('./facets/auth/signup').get
	},

];


articlePagePaths = [
	'/wiki/{title*}',
	'/{title*}',
	// TODO this is special case needed for /wiki path, it should be refactored
	'/{title}'
];

articlePagePaths.forEach((path) => {
	authenticatedRoutes.push({
		method: 'GET',
		path: path,
		handler: require('./facets/showArticle'),
		config: {
			cache: routeCacheConfig
		}
	});
});

unauthenticatedRoutes = unauthenticatedRoutes.map((route) => {
	return Hoek.applyToDefaults(unauthenticatedRouteConfig, route);
});
authenticatedRoutes = authenticatedRoutes.map((route) => {
	return Hoek.applyToDefaults(authenticatedRouteConfig, route);
});

routes = unauthenticatedRoutes.concat(authenticatedRoutes);

export = routes;
