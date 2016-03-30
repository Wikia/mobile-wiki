import {disableCache} from '../../lib/caching';

/**
 * Renders server error page without Ember
 *
 * @param {Hapi.Response} reply
 * @returns {void}
 */
export default function (reply) {
	const statusCode = 503,
		data = {},
		viewName = 'server-error',
		options = {
			layout: 'error'
		},
		response = reply.view(viewName, data, options);

	response.code(statusCode);
	response.type('text/html; charset=utf-8');

	disableCache(response);
}
