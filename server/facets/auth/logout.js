/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
exports.logout = function (request, reply) {
	reply.unstate('access_token');
	reply.redirect('/');
};
