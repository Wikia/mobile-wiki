/**
 * @description Mediawiki API functions
 */
import settings from '../../config/settings';
import Logger from './logger';
import Wreck from 'wreck';
import Promise from 'bluebird';
import Url from 'url';
import {NonJsonApiResponseError, WikiVariablesRequestError} from './custom-errors';

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
	if (settings.mediawikiDomain) {
		wikiDomain = settings.mediawikiDomain;
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
 * @param {Function} resolve
 * @param {Function} reject
 * @param {Object} err
 * @param {*} payload
 * @param {Object} response
 * @param {string} url
 * @param {string} host
 * @param {string} [redirectLocation=null]
 *
 * @returns {void}
 */
function requestCallback({resolve, reject, err, payload, response, url, host, redirectLocation = null}) {
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
		resolve({
			payload,
			redirectLocation
		});
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
		let redirectLocation;

		/**
		 * @param {*} err
		 * @param {*} response
		 * @param {*} payload
		 * @returns {void}
		 */
		Wreck.get(url, {
			redirects,
			headers,
			timeout: settings.backendRequestTimeout,
			json: true,
			beforeRedirect,
			redirected: (statusCode, location) => {
				redirectLocation = location;
			}
		}, (err, response, payload) => {
			return requestCallback({
				resolve,
				reject,
				err,
				payload,
				response,
				url,
				host,
				redirectLocation
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
		Wreck.request('POST', url, {
			payload: formData,
			headers
		}, (err, response) => {
			Wreck.read(response, null, (err, body) => {
				return requestCallback({
					resolve,
					reject,
					err,
					payload: body.toString(),
					response,
					url,
					host
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
		this.request = params.request;
	}

	getUrl() {
		// mediawikiDomain is icache address
		const apiDomain = settings.mediawikiDomain || this.corporatePageUrl;

		return `http://${apiDomain}/api/v1/design-system/wikis/${this.wikiId}/${this.language}/`;
	}

	getDesignSystemData() {
		const url = this.getUrl();

		this.headers = {
			Cookie: `access_token=${this.request.state.access_token}`
		};

		return this
			.fetch(url, this.corporatePageUrl)
			.then(({payload}) => {
				if (payload) {
					return payload;
				} else {
					throw new Error('No data returned from API');
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
			 * @param {payload, redirectLocation}
			 * @returns {Promise}
			 */
			.then(({payload, redirectLocation}) => {
				if (payload.data) {
					return Promise.resolve(payload.data);
				} else {
					// If we got status 200 but not the expected format we handle it as a redirect
					throw new NonJsonApiResponseError(redirectLocation);
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

		return this.fetch(createUrl(this.wikiDomain, 'wikia.php', urlParams))
			/**
			 * @param {payload, redirectLocation}
			 * @returns {Promise}
			 */
			.then(({payload}) => payload);
	}

	/*
	 * @returns {Promise}
	 */
	mainPageDetailsAndAdsContext() {
		const url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getMainPageDetailsAndAdsContext'
		});

		return this.fetch(url)
			/**
			 * @param {payload, redirectLocation}
			 * @returns {Promise}
			 */
			.then(({payload}) => payload);
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

		return this.post(url, Url.format({query: params}).substr(1))
			/**
			 * @param {payload, redirectLocation}
			 * @returns {Promise}
			 */
			.then(({payload}) => payload);
	}
}
