/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/wreck/wreck.d.ts" />

/**
 * @description Mediawiki API functions
 */

import localSettings = require('../../config/localSettings');
import Logger = require('./Logger');
import Wreck = require('wreck');
import Promise = require('bluebird');

interface MWRequestParams {
	wikiDomain: string;
	headers?: any;
	redirects?: number;
}

class BaseRequest {
	wikiDomain: string;
	headers: any;
	redirects: any;

	/**
	 * Search request constructor
	 *
	 * @param params
	 */
	constructor (params: MWRequestParams) {
		this.wikiDomain = params.wikiDomain;
		this.headers = params.headers;
	}

	fetch(url: string): any {
		return fetch(url, this.wikiDomain, this.redirects, this.headers);
	}
}

/**
 * Wrapper class for making API search requests
 */
export class SearchRequest extends BaseRequest {
	/**
	 * Default parameters to make the request url clean -- we may
	 * want to customize later
	 * @param query Search query
	 * @return {Promise<any>}
	 */
	searchForQuery (query: string): Promise<any> {
		var url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getSearchSuggestions',
			query: query
		});

		return this.fetch(url);
	}
}

/**
 * @desc a wrapper for making API requests for info about the wiki
 *
 */
export class WikiRequest extends BaseRequest {
	/**
	 * Gets general wiki information
	 *
	 * @return {Promise<any>}
	 */
	getWikiVariables (): Promise<any> {
		var url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getWikiVariables'
		});

		return this.fetch(url);
	}
}

/**
 * Gets article data
 */
export class ArticleRequest extends BaseRequest {
	/**
	 * Fetch article data
	 *
	 * @param title
	 * @param redirect
	 * @return {Promise<any>}
	 */
	article (title: string, redirect: string): Promise<any> {
		var urlParams: any = {
				controller: 'MercuryApi',
				method: 'getArticle',
				title: title
			},
			url: string;
		if (redirect) {
			urlParams.redirect = redirect;
		}
		url = createUrl(this.wikiDomain, 'wikia.php', urlParams);

		return this.fetch(url);
	}

	comments (articleId: number, page: number = 0): Promise<any> {
		var url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getArticleComments',
			id: articleId,
			page: page
		});

		return this.fetch(url);
	}

	curatedContentSection (sectionName: string): Promise<any> {
		var url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'MercuryApi',
			method: 'getCuratedContentSection',
			section: sectionName
		});

		return this.fetch(url);
	}

	category (categoryName: string, thumbSize: { width: number; height: number }): Promise<any> {
		var url = createUrl(this.wikiDomain, 'wikia.php', {
			controller: 'ArticlesApi',
			method: 'getList',
			expand: 'true',
			abstract: 0,
			width: thumbSize.width,
			height: thumbSize.height,
			category: categoryName
		});

		return this.fetch(url);
	}

	/**
	 * Get random article title
	 *
	 * @return {Promise<any>}
	 */
	randomTitle (): Promise<any> {
		var url = createUrl(this.wikiDomain, 'api.php', {
			action: 'query',
			generator: 'random',
			grnnamespace: 0,
			cb: Date.now(),
			format: 'json'
		});

		return this.fetch(url);
	}
}

/**
 * Fetch http resource
 *
 * @param url the url to fetch
 * @param redirects the number of redirects to follow, default 1
 * @return {Promise<any>}
 */
export function fetch (url: string, host: string = '', redirects: number = 1, headers: any = {}): Promise<any> {
	headers.Host = host;

	return new Promise((resolve: Function, reject: Function): void => {
		Wreck.get(url, {
			redirects: redirects,
			headers: headers,
			timeout: localSettings.backendRequestTimeout,
			json: true
		}, (err: any, response: any, payload: any): void => {
			if (err) {
				Logger.error({
					url: url,
					error: err
				}, 'Error fetching url');

				reject(err);
			} else if (response.statusCode === 200) {
				resolve(payload);
			} else {
				// When an empty response comes (for example 503 from Varnish) make it look same as the MediaWiki one
				if (payload === null) {
					payload = {
						exception: {
							message: 'Empty response',
							code: response.statusCode,
							details: null
						}
					};
				}

				Logger.error({
					url: url,
					headers: response.headers,
					statusCode: response.statusCode
				}, 'Bad HTTP response');

				reject(payload);
			}
		});
	});
}

/**
 * Create request URL
 *
 * @param wikiDomain
 * @param path
 * @param params
 * @return {string} url
 */
export function createUrl (wikiDomain: string, path: string, params: any = {}): string {
	var qsAggregator: string[] = [],
		queryParam: string;

	Object.keys(params).forEach(function(key): void {
		queryParam = (typeof params[key] !== 'undefined') ?
			key + '=' + encodeURIComponent(params[key]) :
			key;

		qsAggregator.push(queryParam);
	});

	// if mediawikiDomain is defined, override the wikiDomain
	if (localSettings.mediawikiDomain) {
		wikiDomain = localSettings.mediawikiDomain;
	}
	return 'http://' + wikiDomain + '/' + path + (qsAggregator.length > 0 ? '?' + qsAggregator.join('&') : '');
}
