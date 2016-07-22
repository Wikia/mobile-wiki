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
	 * @param {string} wikiDomain
	 * @returns {Promise.<any>}
	 */
	fetch(url, wikiDomain = this.wikiDomain) {
		return fetch(url, wikiDomain, this.redirects, this.headers);
	}

	post(url, formData) {
		return post(url, formData, this.wikiDomain);
	}
}

export class DesignSystemRequest extends BaseRequest {

	constructor(params) {
		super(params);

		this.corporatePageUrl = params.corporatePageUrl;
		this.wikiId = params.wikiId;
		this.language = params.language;
	}

	getFooter() {
		const url = createUrl(this.corporatePageUrl, 'wikia.php', {
			controller: 'DesignSystemApi',
			method: 'getFooter',
			wikiId: this.wikiId,
			lang: this.language
		});

		return this
			.fetch(url, this.corporatePageUrl)
			.then((footerData) => {
				if (footerData) {
					return footerData;
				} else {
					throw new Error('No footer data returned from API');
				}
			});
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
