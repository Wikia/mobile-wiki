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

/**
 * Wrapper class for making API search requests
 */
export class SearchRequest {
	wikiDomain: string;

	/**
	 * Search request constructor
	 *
	 * @param params
	 */
	constructor (params: {wikiDomain: string}) {
		this.wikiDomain = params.wikiDomain;
	}

	/**
	 * Default parameters to make the request url clean -- we may
	 * want to customize later
	 * @param query Search query
	 * @returns
	 */
	searchForQuery (query: string): Promise<any> {
		var url = createUrl(this.wikiDomain, 'api/v1/SearchSuggestions/List', {
			query: query
		});

		return fetch(url);
	}
}

/**
 * @desc a wrapper for making API requests for info about the wiki
 *
 */
export class WikiRequest {
	wikiDomain: string;

	/**
	 * WikiRequest constructor
	 *
	 * @param params
	 */
	constructor (params: {wikiDomain: string}) {
		this.wikiDomain = params.wikiDomain;
	}

	/**
	 * Gets general wiki information
	 *
	 * @returns {Promise<any>}
	 */
	getWikiVariables (): Promise<any> {
		var url = createUrl(this.wikiDomain, 'api/v1/Mercury/WikiVariables');

		return fetch(url);
	}
}

/**
 * Gets article data
 */
export class ArticleRequest {
	wikiDomain: string;

	/**
	 * ArticleRequest constructor
	 * @param wikiDomain
	 */
	constructor (wikiDomain: string) {
		this.wikiDomain = wikiDomain;
	}

	/**
	 * Fetch article data
	 *
	 * @param title
	 * @param redirect
	 * @returns {Promise<any>}
	 */
	fetch (title: string, redirect: string) {
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

		return fetch(url);
	}

	comments (articleId: number, page: number = 0) {
		var url = createUrl(this.wikiDomain, 'api/v1/Mercury/ArticleComments', {
			id: articleId,
			page: page
		});

		return fetch(url);
	}
}

/**
 * Fetch http resource
 *
 * @param url the url to fetch
 * @param redirects the number of redirects to follow, default 1
 */
export function fetch (url: string, redirects: number = 1): Promise<any> {
	Logger.debug({url: url}, 'Fetching');

	return new Promise((resolve, reject) => {
		Wreck.get(url, {
			redirects: redirects,
			timeout: localSettings.backendRequestTimeout,
			json: true
		}, (err: any, response: any, payload: any): void => {
			if (err) {
				Logger.error({
					url: url,
					error: err
				}, 'Error fetching url');
			} else {
				if (response.statusCode !== 200) {
					Logger.error({
						url: url,
						headers: response.headers,
						statusCode: response.statusCode
					}, 'Bad HTTP response');
				}
			}

			resolve(err || payload);
		});
	});
}

/**
 * Create request URL
 *
 * @param wikiDomain
 * @param path
 * @param params
 * @returns {string}
 */
export function createUrl(wikiDomain: string, path: string, params: any = {}): string {
	var qsAggregator: string[] = [],
		queryParam: string;

	Object.keys(params).forEach(function(key) {
		queryParam = (typeof params[key] !== 'undefined') ?
			key + '=' + encodeURIComponent(params[key]) :
			key;

		qsAggregator.push(queryParam);
	});

	return 'http://' + wikiDomain + '/' + path + (qsAggregator.length > 0 ? '?' + qsAggregator.join('&') : '');
}
