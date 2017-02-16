import Promise from 'bluebird';

/**
 * @typedef {Object} OpenGraphAttributes
 * @property {string} [description]
 * @property {string} [image]
 * @property {number} [imageHeight]
 * @property {number} [imageWidth]
 * @property {string} title
 * @property {string} type
 * @property {string} url
 */

/**
 * @param {Hapi.Request} request
 * @param {*} wikiVars
 * @returns {Promise}
 */
export function getAttributes(request, wikiVars) {
	// Discussions path
	if (request.path.split('/')[1] === 'd') {
		return getPromiseForDiscussionData(request, wikiVars);
	}

	return Promise.resolve({});
}
