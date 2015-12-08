/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function redirectToRoot(request, reply) {
	reply.redirect('/');
}
