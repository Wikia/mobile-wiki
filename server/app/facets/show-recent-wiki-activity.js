import showApplication from './show-application';

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export default function (request, reply) {
	showApplication(request, reply, null, {showSpinner: true}, true);
}
