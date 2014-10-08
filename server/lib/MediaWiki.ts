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
 * @desc wrapper class for making API search requests
 */
export class SearchRequest {
	wikiDomain: string;

	constructor (params: {wikiDomain: string}) {
		this.wikiDomain = params.wikiDomain;
	}

	/**
	 * @desc Default parameters to make the request url clean -- we may
	 * want to customize later
	 */
	searchForQuery (query: string) {
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

	constructor (params: {wikiDomain: string}) {
		this.wikiDomain = params.wikiDomain;
	}

	getWikiVariables (): Promise<any> {
		var url = createUrl(this.wikiDomain, 'api/v1/Mercury/WikiVariables');

		return fetch(url);
	}
}

export class ArticleRequest {
	wikiDomain: string;

	constructor (wikiDomain: string) {
		this.wikiDomain = wikiDomain;
	}

	fetch (title: string, redirect: string) {
		var url = createUrl(this.wikiDomain, 'api/v1/Mercury/Article', {
			title: title,
			redirect: redirect
		});

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
 * @param url the url to fetch
 * @param redirects the number of redirects to follow, default 1
 */
export function fetch (url: string, redirects: number = 1): Promise<any> {
	Logger.debug({url: url}, 'Fetching');

	return new Promise((resolve, reject) => {
		Wreck.get(url, {
			redirects: redirects,
			timeout: localSettings.backendRequestTimeout
		}, (err: any, res: any, payload: any): void => {
			if (err) {
				Logger.error({url: url, error:err}, 'Error fetching url');
				reject(err);
			} else {
				if (res.headers['content-type'].match('application/json')) {
					payload = JSON.parse(payload);
				}

				resolve(payload);
			}
		});
	});
}

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
