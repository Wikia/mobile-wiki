/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

'use strict';

exports.routes = [
	{
		method: 'GET',
		path: '/',
		handler: require('./facets/index')
	},
	{
		method: 'GET',
		path: '/beginners',
		handler: require('./facets/beginners')
	},
	{
		method: 'GET',
		path: '/companyinfo',
		handler: require('./facets/companyinfo')
	},
	{
		method: 'GET',
		path: '/search',
		handler: require('./facets/search')
	},
	{
		method: 'GET',
		path: '/login',
		handler: require('./facets/signin')
	},
	{
		method: 'GET',
		path: '/logout',
		handler: require('./facets/logout')
	},
	{
		method: 'GET',
		path: '/privacy',
		handler: require('./facets/privacy')
	},
	{
		method: 'GET',
		path: '/termsofservice',
		handler: require('./facets/termsofservice')
	},
	{
		method: 'GET',
		path: '/globals',
		handler: require('./facets/globals')
	},
	{
		method: 'GET',
		path: '/{path*}',
		handler: require('./facets/assets')
	},
];
