/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export function logout(request, reply) {
	reply.unstate('access_token');
	reply.redirect('/');
}
