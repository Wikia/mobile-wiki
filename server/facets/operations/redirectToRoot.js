/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
exports.redirectToRoot = function (request, reply) {
	reply.redirect('/');
};
