/**
 * @typedef {Object} Comment
 * @property {number} id
 * @property {string} text
 * @property {number} created
 * @property {string} userName
 * @property {Comment[]} [replies]
 */

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} avatar
 * @property {string} url
 */

/**
 * @typedef {Object} CommentsDataMWPayload
 * @property {Comment[]} comments
 * @property {User[]} users
 */

/**
 * @typedef {Object} CommentsDataMW
 * @property {CommentsDataMWPayload} payload
 * @property {number} pagesCount
 * @property {string} basePath
 */

/**
 * @typedef {Object} CommentsDataPayload
 * @property {Comment[]} comments
 * @property {User[]} users
 * @property {number} pagesCount
 * @property {string} basePath
 */

/**
 * @typedef {Object} CommentsDataStatus
 * @property {number} code
 * @property {string} [message]
 * @property {string} [errorName]
 */

/**
 * @typedef {Object} CommentsData
 * @property {CommentsDataPayload} payload
 * @property {CommentsDataStatus} status
 */

const Boom = require('boom'),
	MW = require('../../lib/MediaWiki'),
	Utils = require('../../lib/Utils'),
	localSettings = require('../../../config/localSettings'),
	getStatusCode = require('../operations/getStatusCode');

/**
 * Wrap article comments data response
 *
 * @param {CommentsDataMW} commentsData - Article comments payload from API
 * @returns {CommentsData} Wrapped Article comments object
 */
function transformResponse(commentsData) {
	// TODO: ad hoc response wrapping, normalize across app
	return {
		payload: {
			comments: commentsData.payload.comments,
			users: commentsData.payload.users,
			pagesCount: commentsData.pagesCount,
			basePath: commentsData.basePath
		},
		status: {
			code: 200
		}
	};
}

/**
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
exports.get = function (request, reply) {
	const params = {
		wikiDomain: Utils.getCachedWikiDomainName(localSettings, request),
		articleId: parseInt(request.params.articleId, 10) || null,
		page: parseInt(request.params.page, 10) || 0
	};

	if (params.articleId === null) {
		// TODO: ad hoc error handling, use Boom everywhere?
		reply(Boom.badRequest('Invalid articleId'));
	} else {
		new MW.ArticleRequest(params).comments(
			params.articleId,
			params.page
		)
		/**
		 * @param {*} response
		 * @returns {void}
		 */
		.then((response) => {
			reply(transformResponse(response));
		})
		/**
		 * @param {*} error
		 * @returns {void}
		 */
		.catch((error) => {
			reply(error).code(getStatusCode(error));
		});
	}
};
