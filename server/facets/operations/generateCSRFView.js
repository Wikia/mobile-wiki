/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
exports.generateCSRFView = function (request, reply) {
	reply.view('breadcrumb', null, {layout: 'empty'});
};
