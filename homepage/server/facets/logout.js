/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

function logout(request, reply) {
	reply.unstate('access_token');
	reply.redirect('/');
}

module.exports = logout;
