/// <reference path="../typings/hoek/hoek.d.ts" />
import Hoek = require('hoek');
import localSettings = require('../config/localSettings');
import Caching = require('./lib/Caching');
import authUtils = require('./lib/AuthUtils');

interface RouteDefinition {
	method: string[]|string;
	path: string;
	handler: Function;
	config?: any;
}

var routes: RouteDefinition[],
	// routes that don't care if the user is logged in or not, i.e. lazily loaded modules
	unauthenticatedRoutes: RouteDefinition[],
	// routes where we want to know the user's auth status
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
		// TODO: if you call to api/mercury/comments/ without supplying an id, this actually calls /api/mercury/article
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
		path: localSettings.apiBase + '/main/section/{sectionName}',
		handler: require('./facets/api/mainPageSection').get
	},
	{
		method: 'GET',
		path: localSettings.apiBase + '/main/category/{categoryName}',
		handler: require('./facets/api/mainPageCategory').get
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
		handler: require('./facets/auth/join'),
		config: {
			pre: [
				{
					method: require('./facets/auth/authView').validateRedirect
				}
			]
		}
	},
	{
		method: 'GET',
		path: '/signin',
		handler: require('./facets/auth/signin').get,
		config: {
			pre: [
				{
					method: require('./facets/auth/authView').validateRedirect
				}
			]
		}
	},

	// @todo Add proper path instead of register
	//{
	//	method: 'GET',
	//	path: '/register',
	//	handler: require('./facets/auth/register').get,
	//	config: {
	//		pre: [
	//			{
	//				method: require('./facets/auth/authView').validateRedirect
	//			}
	//		]
	//	}
	//},
	{
		method: 'GET',
		path: '/register',
		handler: require('./facets/showApplication')
	},
	{
		method: 'GET',
		path: '/login',
		handler: function (request: Hapi.Request, reply: any): Hapi.Response {
			return reply.redirect(authUtils.getRedirectUrlWithQueryString('signin', request));
		}
	},
	{
		method: 'GET',
		path: '/signup',
		handler: function (request: Hapi.Request, reply: any): Hapi.Response {
			return reply.redirect(authUtils.getRedirectUrlWithQueryString('register', request));
		}
	},
	{
		method: 'GET',
		path: '/',
		//Currently / path is not available on production because of redirects from / to /wiki/...
		handler: require('./facets/showArticle'),
		config: {
			cache: routeCacheConfig
		}
	},
	{
		method: 'GET',
		// Catch invalid paths and redirect to the main page
		path: '/main/{invalid}',
		handler: function (request: Hapi.Request, reply: any): Hapi.Response {
			return reply.redirect('/');
		},
		config: {
			cache: routeCacheConfig
		}
	},
	{
		method: 'GET',
		// We don't care if there is a dynamic segment, Ember router handles that
		path: '/main/edit/{ignore*}',
		handler: require('./facets/showApplication'),
		config: {
			cache: routeCacheConfig
		}
	},
	{
		method: 'GET',
		path: '/main/section/{sectionName*}',
		handler: require('./facets/showCuratedContent'),
		config: {
			cache: routeCacheConfig
		}
	},
	{
		method: 'GET',
		path: '/main/category/{categoryName*}',
		handler: require('./facets/showCuratedContent'),
		config: {
			cache: routeCacheConfig
		}
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

// For application routes that are not articles and require the Ember app, push a route object
// that uses the `showApplication` route handler to get a basic Ember application instance
authenticatedRoutes.push({
	// Discussion forums
	method: 'GET',
	path: '/d/{type}/{id}/{action?}',
	handler: require('./facets/showDiscussions')
});

unauthenticatedRoutes = unauthenticatedRoutes.map((route) => {
	return Hoek.applyToDefaults(unauthenticatedRouteConfig, route);
});

authenticatedRoutes = authenticatedRoutes.map((route) => {
	return Hoek.applyToDefaults(authenticatedRouteConfig, route);
});

routes = unauthenticatedRoutes.concat(authenticatedRoutes);

export = routes;
