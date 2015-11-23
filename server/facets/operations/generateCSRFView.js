/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function generateCSRFView(request, reply) {
	reply.view('breadcrumb', null, {layout: 'empty'});
}
