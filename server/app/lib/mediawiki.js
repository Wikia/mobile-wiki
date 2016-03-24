/**
 * @description Mediawiki API functions
 */
import localSettings from '../../config/localSettings';
import Logger from './logger';
import Wreck from 'wreck';
import Promise from 'bluebird';
import Url from 'url';
import {WikiVariablesNotValidWikiError, WikiVariablesRequestError} from './custom-errors';

/**
 * @typedef {Object} CallbackParams
 * @property {Function} resolve
 * @property {Function} reject
 * @property {Object} err
 * @property {*} payload
 * @property {Object} response
 * @property {string} url
 */

/**
 * This list is taken from MediaWiki:app/includes/Defines.php
 * @type {{name: number}}
 */
export const namespace = {
	// virtual namespaces
	MEDIA: -2,
	SPECIAL: -1,
	// real namespaces
	MAIN: 0,
	TALK: 1,
	USER: 2,
	USER_TALK: 3,
	PROJECT: 4,
	PROJECT_TALK: 5,
	FILE: 6,
	FILE_TALK: 7,
	MEDIAWIKI: 8,
	MEDIAWIKI_TALK: 9,
	TEMPLATE: 10,
	TEMPLATE_TALK: 11,
	HELP: 12,
	HELP_TALK: 13,
	CATEGORY: 14,
	CATEGORY_TALK: 15,
	IMAGE: 6,
	IMAGE_TALK: 7
};

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
	return `http://${wikiDomain}/${path}${qsAggregator.length > 0 ? `?${qsAggregator.join('&')}` : ''}`;}

/**
 * @param {*} payload
 * @param {Hapi.Response} response
 * @returns {Object}
 */
export function sanitizeRejectData(payload, response) {
	const sanitizedData = (typeof payload === 'object' && payload !== null) ? payload : {
		payloadString: payload
	};

	if (typeof sanitizedData.exception !== 'object') {
		sanitizedData.exception = {};
	}

	// Make sure that we have exception code as we rely on it later
	sanitizedData.exception.code = sanitizedData.exception.code || response.statusCode;

	return sanitizedData;
}

/**
 * Handle request response
 *
 * @param {CallbackParams} params
 * @returns {void}
 */
function requestCallback(params) {
	const {resolve, reject, err, payload, response, url, host} = params;

	if (err) {
		Logger.error({
			url,
			error: err
		}, 'Error fetching url');

		reject({
			exception: {
				message: 'Invalid response',
				code: err.output.statusCode,
				details: err
			}
		});
	} else if (response.statusCode === 200) {
		resolve(payload);
	} else {
		// Don't flood logs with 404s
		if (response.statusCode !== 404) {
			Logger.error({
				url,
				headers: response.headers,
				statusCode: response.statusCode,
				details: (payload instanceof Buffer) ? payload.toString('utf-8') : payload,
				host
			}, 'Bad HTTP response');
		}

		reject(sanitizeRejectData(payload, response));
	}
}

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
function beforeRedirect(redirectMethod, statusCode, location, redirectOptions) {
	const redirectHost = Url.parse(location).hostname;

	if (redirectHost) {
		redirectOptions.headers.Host = redirectHost;
	}
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
			return requestCallback({
				resolve,
				reject,
				err,
				payload,
				response,
				url,
				host
			});
		});
	});
}

/**
 * Post http request
 *
 * @param {string} url
 * @param {string} formData to send in form foo=bar
 * @param {string} [host='']
 * @param {*} [headers={}]
 * @returns {Promise}
 */
export function post(url, formData, host = '', headers = {}) {
	headers.Host = host;
	headers['User-Agent'] = 'mercury';
	headers['X-Wikia-Internal-Request'] = 'mercury';
	headers['Content-Type'] = 'application/x-www-form-urlencoded';
	// Cannot be 'application/json' due to error in MW: 'Automatically populating $HTTP_RAW_POST_DATA
	// is deprecated and will be removed in a future version.' which is thrown for requests using
	// the payload instead of normal x-www-form-urlencoded requests.
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
		Wreck.request('POST', url, {payload: formData, headers}, (err, response) => {
			Wreck.read(response, null, (err, body) => {
				return requestCallback({
					resolve,
					reject,
					err,
					payload: body.toString(),
					response,
					url
				});
			});
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

	post(url, formData) {
		return post(url, formData, this.wikiDomain);
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
				if (wikiVariables.data) {
					return Promise.resolve(wikiVariables.data);
				} else {
					// If we got status 200 but not the expected format we handle it as a redirect to "Not valid wiki"
					throw new WikiVariablesNotValidWikiError();
				}
			}, () => {
				throw new WikiVariablesRequestError();
			});
	}
}

/**
 * Gets article data
 *
 * @class PageRequest
 */
export class PageRequest extends BaseRequest {
	/**
	 * Fetch article data
	 *
	 * @param {string} title
	 * @param {string} redirect
	 * @param {string} [sections]
	 * @returns {Promise}
	 */
	page(title, redirect, sections) {
		const urlParams = {
			controller: 'MercuryApi',
			method: 'getPage',
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

	/**
	 * prepare POST request body before sending to API
	 * Encode all params to be able to retrieve correct
	 * values from the text containing for example '&'
	 *
	 * @param {string} title title of edited article
	 * @param {string} wikitext editor wikitext
	 * @param {string} CKmarkup CK editor markup
	 * @returns {Promise}
	 */
	articleFromMarkup(title, wikitext, CKmarkup) {
		const url = createUrl(this.wikiDomain, 'wikia.php', {
				controller: 'MercuryApi',
				method: 'getArticleFromMarkup'
			}),
			params = {title};

		if (wikitext) {
			params.wikitext = wikitext;
		} else {
			params.CKmarkup = CKmarkup;
		}

		return this.post(url, Url.format({query: params}).substr(1));
	}
}
