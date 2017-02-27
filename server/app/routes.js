import Hoek from 'hoek';
import {Policy} from './lib/caching';
import proxyMW from './facets/operations/proxy-mw';
import {handler as assetsHandler} from './facets/operations/assets';
import heartbeatHandler from './facets/operations/heartbeat';
import mediaWikiPageHandler from './facets/mediawiki-page';
import articlePreview from './facets/article-preview';
import showApplication from './facets/show-application';

/**
 * @typedef {Object} RouteDefinition
 * @property {string[]|string} method
 * @property {string} path
 * @property {Function} handler
 * @property {*} [config]
 */

const routeCacheConfig = {
		privacy: Policy.Public,
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
	},
	mediaWikiPagePaths = [
		'/wiki/{title*}',
		'/{title*}'
	];

let routes,
	// routes that don't care if the user is logged in or not, i.e. lazily loaded modules
	unauthenticatedRoutes = [
		{
			method: 'GET',
			path: '/favicon.ico',
			handler: proxyMW
		},
		{
			method: 'GET',
			path: '/robots.txt',
			handler: proxyMW
		},
		{
			method: 'GET',
			path: '/mobile-wiki/{path*}',
			handler: assetsHandler,
			config: {
				cors: {
					origin: ['*'],
					// We can't set `access-control-allow-origin: 'http://gta.wikia.com'`
					// The same URL is shared between wikis and cached in the browser
					matchOrigin: false
				}
			}
		},
		{
			method: 'GET',
			path: '/search',
			handler: showApplication,
			config: {
				cache: routeCacheConfig
			}
		},
		{
			method: 'GET',
			path: '/heartbeat',
			handler: heartbeatHandler
		},
		{
			method: 'POST',
			path: '/article-preview',
			handler: articlePreview
		}
	],
	// routes where we want to know the user's auth status
	authenticatedRoutes = [];

/**
 * @param {*} path
 * @returns {void}
 */
mediaWikiPagePaths.forEach((path) => {
	authenticatedRoutes.push({
		method: 'GET',
		path,
		handler: mediaWikiPageHandler,
		config: {
			cache: routeCacheConfig
		}
	});
});

/**
 * @param {*} route
 * @returns {*}
 */
unauthenticatedRoutes = unauthenticatedRoutes.map((route) => {
	return Hoek.applyToDefaults(unauthenticatedRouteConfig, route);
});

/**
 * @param {*} route
 * @returns {*}
 */
authenticatedRoutes = authenticatedRoutes.map((route) => {
	return Hoek.applyToDefaults(authenticatedRouteConfig, route);
});

routes = unauthenticatedRoutes.concat(authenticatedRoutes);

export {routes};
