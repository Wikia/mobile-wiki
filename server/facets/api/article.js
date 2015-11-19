const Article = require('../../lib/Article'),
	Caching = require('../../lib/Caching'),
	Utils = require('../../lib/Utils'),
	localSettings = require('../../../config/localSettings'),
	getStatusCode = require('../operations/getStatusCode'),
	cachingTimes = {
		enabled: true,
		cachingPolicy: Caching.Policy.Public,
		varnishTTL: Caching.Interval.standard,
		browserTTL: Caching.Interval.disabled
	};

/**
 * @param {*} query
 * @returns {boolean}
 */
function isRequestForRandomTitle(query) {
	return (typeof query.random !== 'undefined' && typeof query.titleOnly !== 'undefined');
}

/**
 * @param {*} reply
 * @param {*} result
 * @param {boolean} allowCache
 * @returns {void}
 */
function handleArticleResponse(reply, result, allowCache) {
	const response = reply(result).code(getStatusCode(result));

	if (allowCache) {
		Caching.setResponseCaching(response, cachingTimes);
	} else {
		Caching.disableCache(response);
	}

}

/**
 * @description Entry point method for getting article API data, a HapiRouteHandler
 *
 * @param {Hapi.Request} request
 * @param {*} reply
 * @returns {void}
 */
export function get(request, reply) {
	const wikiDomain = Utils.getCachedWikiDomainName(localSettings, request),
		params = {
			wikiDomain,
			title: request.params.articleTitle,
			redirect: request.params.redirect
		};

	let article,
		allowCache = true;

	if (request.state.wikicities_session) {
		params.headers = {
			Cookie: `wikicities_session=${request.state.wikicities_session}`
		};
		allowCache = false;
	}

	article = new Article.ArticleRequestHelper(params);

	if (isRequestForRandomTitle(request.query)) {
		article
			.getArticleRandomTitle()
			/**
			 * @param {*} result
			 * @returns {void}
			 */
			.then((result) => {
				Caching.disableCache(reply(result));
			})
			/**
			 * @param {*} result
			 * @returns {void}
			 */
			.catch((result) => {
				Caching.disableCache(reply(result).code(getStatusCode(result)));
			});
	} else {
		article
			.getArticle()
			/**
			 * @param {*} result
			 * @returns {void}
			 */
			.then((result) => {
				handleArticleResponse(reply, result, allowCache);
			})
			/**
			 * @param {*} result
			 * @returns {void}
			 */
			.catch((result) => {
				// We already have the logic to handle rejected promise in handleArticleResponse
				handleArticleResponse(reply, result, allowCache);
			});
	}
}
