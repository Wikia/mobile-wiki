/**
 * @description Mediawiki API functions
 */
import localSettings from '../../config/localSettings';
import Logger from './Logger';
import Wreck from 'wreck';
import Promise from 'bluebird';
import Url from 'url';

/**
 * Create request URL
 *
 * @param {string} wikiDomain
 * @param {string} path
 * @param {*} params
 * @returns {string}
 */
export function createUrl(wikiDomain, path, params = {}) {
	const qsAggregator = [];

	/**
	 * @param {*} key
	 * @returns {void}
	 */
	Object.keys(params).forEach((key) => {
		const queryParam = (typeof params[key] !== 'undefined') ?
			`${key}=${encodeURIComponent(params[key])}` :
			key;

		qsAggregator.push(queryParam);
	});

	// if mediawikiDomain is defined, override the wikiDomain
	if (localSettings.mediawikiDomain) {
		wikiDomain = localSettings.mediawikiDomain;
	}
	return `http://${wikiDomain}/${path}${qsAggregator.length > 0 ? `?${qsAggregator.join('&')}` : ''}`;
}

/**
 * Fetch http resource
 *
 * @param {string} url - the url to fetch
 * @param {string} [host='']
 * @param {number} [redirects=1] - the number of redirects to follow, default 1
 * @param {*} [headers={}]
 * @returns {Promise}
 */
export function fetch(url, host = '', redirects = 1, headers = {}) {
	/**
	 * We send requests to Consul URL and the target wiki is passed in the Host header.
	 * When Wreck gets a redirection response it updates URL only, not headers.
	 * That's why we need to update Host header manually.
	 *
	 * @param {string} redirectMethod
	 * @param {number} statusCode
	 * @param {string} location
	 * @param {*} redirectOptions
	 * @returns {void}
	 */
	const beforeRedirect = (redirectMethod, statusCode, location, redirectOptions) => {
		const redirectHost = Url.parse(location).hostname;

		if (redirectHost) {
			redirectOptions.headers.Host = redirectHost;
		}
	};

	headers.Host = host;
	headers['User-Agent'] = 'mercury';
	headers['X-Wikia-Internal-Request'] = 'mercury';

	/**
	 * @param {Function} resolve
	 * @param {Function} reject
	 * @returns {void}
	 */
	return new Promise((resolve, reject) => {
		/**
		 * @param {*} err
		 * @param {*} response
		 * @param {*} payload
		 * @returns {void}
		 */
		Wreck.get(url, {
			redirects,
			headers,
			timeout: localSettings.backendRequestTimeout,
			json: true,
			beforeRedirect
		}, (err, response, payload) => {
			if (err) {
				Logger.error({
					url,
					error: err
				}, 'Error fetching url');

				reject({
					exception: {
						message: 'Invalid response',
						code: response.statusCode,
						details: err
					}
				});
			} else if (response.statusCode === 200) {
				resolve(payload);
			} else {
				// Unify error response so it's easier to handle later
				if (payload === null || !payload.exception) {
					payload = {
						exception: {
							message: 'Invalid response',
							code: response.statusCode,
							details: payload ? payload.toString('utf-8') : null
						}
					};
				}

				Logger.error({
					url,
					headers: response.headers,
					statusCode: response.statusCode
				}, 'Bad HTTP response');

				reject(payload);
			}
		});
	});
}

/**
 * @class BaseRequest
 *
 * @property {string} wikiDomain
 * @property {*} headers
 * @property {*} redirects
 */
class BaseRequest {
	/**
	 * Search request constructor
	 *
	 * @param {MWRequestParams} params
	 * @returns {void}
	 */
	constructor(params) {
		this.wikiDomain = params.wikiDomain;
		this.headers = params.headers;
	}

	/**
	 * @param {string} url
	 * @returns {Promise.<any>}
	 */
	fetch(url) {
		return fetch(url, this.wikiDomain, this.redirects, this.headers);
	}
}

/**
 * Wrapper class for making API search requests
 *
 * @class SearchRequest
 */
export class SearchRequest extends BaseRequest {
	/**
	 * Default parameters to make the request url clean -- we may
	 * want to customize later
	 *
	 * @param {string} query
	 * @returns {Promise<any>}
	 */
	searchForQuery(query) {
		const url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getSearchSuggestions',
			query
		});

		return this.fetch(url);
	}
}

/**
 * a wrapper for making API requests for info about the wiki
 *
 * @class WikiRequest
 */
export class WikiRequest extends BaseRequest {
	/**
	 * Gets general wiki information
	 *
	 * @returns {Promise<any>}
	 */
	wikiVariables() {
		const url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getWikiVariables'
		});

		return this
			.fetch(url)
			/**
			 * @param {*} wikiVariables
			 * @returns {Promise}
			 */
			.then((wikiVariables) => {
				return Promise.resolve(wikiVariables.data);
			});
	}
}

/**
 * Gets article data
 *
 * @class ArticleRequest
 */
export class ArticleRequest extends BaseRequest {
	/**
	 * Fetch article data
	 *
	 * @param {string} title
	 * @param {string} redirect
	 * @param {string} [sections]
	 * @returns {Promise}
	 */
	article(title, redirect, sections) {
		const urlParams = {
			controller: 'MercuryApi',
			method: 'getArticle',
			title
		};

		if (redirect) {
			urlParams.redirect = redirect;
		}

		if (sections) {
			urlParams.sections = sections;
		}

		return this.fetch(createUrl(this.wikiDomain, 'wikia.php', urlParams));
	}

	/**
	 * @param {number} articleId
	 * @param {number} [page=0]
	 * @returns {Promise}
	 */
	comments(articleId, page = 0) {
		const url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getArticleComments',
			id: articleId,
			page
		});

		return this.fetch(url);
	}

	/**
	 * @param {string} sectionName
	 * @returns {Promise}
	 */
	curatedContentSection(sectionName) {
		const url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getCuratedContentSection',
			section: sectionName
		});

		return this.fetch(url);
	}

	/**
	 * @param {string} categoryName
	 * @param {*} thumbSize
	 * @param {string} [offset='']
	 * @returns {Promise}
	 */
	category(categoryName, thumbSize, offset = '') {
		const url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'ArticlesApi',
			method: 'getList',
			expand: 'true',
			abstract: 0,
			width: thumbSize.width,
			height: thumbSize.height,
			category: categoryName,
			offset,
			limit: 24
		});

		return this.fetch(url);
	}

	/**
	 * Get random article title
	 *
	 * @returns {Promise}
	 */
	randomTitle() {
		const url = createUrl(this.wikiDomain, 'api.php', {
			action: 'query',
			generator: 'random',
			grnnamespace: 0,
			cb: Date.now(),
			format: 'json'
		});

		return this.fetch(url);
	}

	/*
	 * @returns {Promise}
	 */
	mainPageDetailsAndAdsContext() {
		const url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getMainPageDetailsAndAdsContext'
		});

		return this.fetch(url);
	}
}

/**
 * @class WikiVariablesRequestError
 */
export class WikiVariablesRequestError {
	/**
	 * @param {MWException} error
	 * @returns {void}
	 */
	constructor(error) {
		Error.apply(this, arguments);
		this.error = error;
	}
}

WikiVariablesRequestError.prototype = Object.create(Error.prototype);
