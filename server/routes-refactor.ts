import Hoek = require('hoek');
import localSettings = require('../config/localSettings');
import Caching = require('./lib/Caching');

var unauthenticatedRoutes: any[],
	unauthenticatedRouteConfig,
	authenticatedRoutes: any[],
	indexRoutePaths: string[],
	proxyRoutePaths: string[];

unauthenticatedRouteConfig = {
	config: {
		cache: {
			privacy: Caching.policyString(Caching.Policy.Public),
			expiresIn: 60000
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
	//{
		//method: 'GET',
		//path: '/front/{path*}',
		//handler: require('./facets/operations/assets')
	//},
	//{
		//method: 'GET',
		//path: '/public/{path*}',
		//handler: require('./facets/operations/assets')
	//},
	//{
		//method: 'GET',
		//path: '/heartbeat',
		//handler: require('./facets/operations/heartbeat')
	//},
	//{
		//method: 'GET',
		//path: localSettings.apiBase + '/article/{articleTitle*}',
		//handler: require('./facets/article/getArticleJSON')
	//},
	//{
		//method: 'GET',
		//path: localSettings.apiBase + '/article/comments/{articleId}/{page?}',
		//handler: require('./facets/article/getArticleComments')
	//},
	//{
		//method: 'GET',
		//path: localSettings.apiBase + '/search/{query}',
		//handler: require('./facets/search/getSearchResults')
	//},
];

//indexRoutePaths = [
	//'/wiki/{title*}',
	//'/{title*}',
	//// TODO this is special case needed for /wiki path, it should be refactored
	//'/{title}'
//];

//indexRoutePaths.forEach((path) => {
	//unauthenticatedRoutes.push({
		//method: 'GET',
		//path: path,
		//handler: require('./facets/article/showArticle')
	//})
//});

unauthenticatedRoutes = unauthenticatedRoutes.map((route) => {
	return Hoek.applyToDefaults(unauthenticatedRouteConfig, route);
});

export = unauthenticatedRoutes;
