/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function logout(request, reply) {
	reply.unstate('access_token');
	reply.redirect('/');
}
