/// <reference path="../../definitions/q/Q.d.ts" />
/// <reference path="../../definitions/node/node.d.ts" />

/**
 * @description Mediawiki API functions
 */

import http = require('http');
import common = require('./common');

module mediawiki {

	interface URLParams {
		[key: string]: string
	}

	function createUrl(domain: string, path: string, params: URLParams = {}): string {
		var qsAggregator: string[] = [];
		Object.keys(params).forEach(function(key){
			qsAggregator.push(key + '=' + encodeURIComponent(params[key]));
		});
		return 'http://' +
			domain +
			'.wikia.com/' +
			path +
			(qsAggregator.length > 0 ? '?' + qsAggregator.join('&') : '');
	}

	function httpGet(url: string): Q.Promise<any> {
		return common.promisify(function (deferred: Q.Deferred<any>):void {
			var buffer: string = '';
			http.get(url, function (res) {
				res.on('data', function (chunk: string) {
					buffer += chunk;
				});

				res.on('end', function () {
					deferred.resolve({
						body: buffer,
						headers: res.headers
					});
				});
			})
			.on('error', function (err: Error) {
				deferred.reject(err);
			});
		});
	}

	function jsonGet(url: string):Q.Promise<any> {
		return common.promisify(function (deferred: Q.Deferred<any>):void {
			httpGet(url)
			.then(function(data){
				try {
					deferred.resolve(JSON.parse(data.body));
				} catch (error) {
					deferred.reject(error);
				}
			})
			.catch(function(error){
				deferred.reject(error)
			});
		});
	}

	export function article(wikiName: string, articleTitle: string): Q.Promise<any> {
		return httpGet(
			createUrl(
				wikiName,
				'index.php', {
					useskin: 'wikiamobile',
					action: 'render',
					title: articleTitle
				}
			)
		);
	}

	export function articleDetails(wikiName: string, articleTitles: string[]): Q.Promise<any> {
		return jsonGet(
			createUrl(
				wikiName,
				'api/v1/Articles/Details', {
					titles: articleTitles.map(function(text: string):string {
						return text.replace(' ', '_');
					}).join(',')
				}
			)
		);
	}

	export function articleComments(wikiName: string, articleId: number): Q.Promise<any> {
		// @todo JSON comments
		return httpGet(
			createUrl(
				wikiName,
				'wikia.php', {
					controller: 'ArticleComments',
					method: 'Content',
					articleId: articleId.toString()
				}
			)
		);
	}

	export function relatedPages(wikiName: string, articleIds: number[], limit: number = 6): Q.Promise<any> {
		return jsonGet(
			createUrl(
				wikiName,
				'api/v1/RelatedPages/List', {
					ids: articleIds.join(','),
					limit: limit.toString()
				}
			)
		);
	}

	export function userDetails(wikiName:string, userIds: number[]):Q.Promise<any> {
		return jsonGet(
			createUrl(
				wikiName,
				'api/v1/User/Details', {
					ids: userIds.join(',')
				}
			)
		);
	}
}

export = mediawiki