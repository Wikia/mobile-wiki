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
		path: '/{path*}',
		handler: require('./facets/assets')
	}
];
