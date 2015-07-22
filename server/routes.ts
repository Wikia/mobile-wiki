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
	{
		method: 'GET',
		path: '/',
		//Currently / path is not available on production because of redirects from / to /wiki/...
		// TODO (CONCF-761): we shouldn't load articles for Curated Main Pages
		handler: require('./facets/showArticle')
	},
	{
		method: 'GET',
		// Catch invalid paths and redirect to the main page
		path: '/main/{invalid}',
		handler: function (request: Hapi.Request, reply: any): Hapi.Response {
			return reply.redirect('/');
		}
	},
	{
		method: 'GET',
		// We don't care if there is a dynamic segment, Ember router handles that
		path: '/main/edit/{ignore?}',
		// TODO (CONCF-761): we shouldn't load article for Curated Content Tool
		handler: require('./facets/showArticle')
	},
	{
		method: 'GET',
		path: '/main/section/{sectionName*}',
		handler: require('./facets/showMainPageSection')
	},
	{
		method: 'GET',
		path: '/main/category/{categoryName*}',
		handler: require('./facets/showMainPageCategory')
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
	{
		method: 'GET',
		path: '/register',
		handler: require('./facets/auth/register').get,
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
	}
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
