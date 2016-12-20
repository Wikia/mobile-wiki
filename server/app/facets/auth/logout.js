/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function logout(request, reply) {
	const userLogoutURL = '/wiki/Special:UserLogout';
	reply.redirect(userLogoutURL);
}
