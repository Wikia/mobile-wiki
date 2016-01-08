/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

function signout(request, reply) {
	reply.unstate('access_token');

	if (request.response) {
		// Make sure to invalidate cache
		request.response.vary('cookie');
	}
	reply.redirect('/');
}

module.exports = signout;
