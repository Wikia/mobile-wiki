/// <reference path="../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../../typings/node/node.d.ts" />
/// <reference path="../../typings/nipple/nipple.d.ts" />

/**
 * @description Mediawiki API functions
 */

import localSettings = require('../../config/localSettings');
import Nipple = require('nipple');
import Promise = require('bluebird');

module MediaWiki {

	interface URLParams {
		[key: string]: string
	}

	export class ArticleRequest {
		article(wikiName: string, articleTitle: string) {
			var url = createUrl(wikiName, 'api/v1/Articles/asJson', {
					title: articleTitle
			});

			return fetch(url);
		}

		articleDetails(wikiName: string, articleTitles: string[]) {
			var url: string = createUrl( wikiName, 'api/v1/Articles/Details', {
						titles: articleTitles.map(function(text: string): string {
							return text.replace(' ', '_');
						}).join(',')
					});
			return fetch(url);
		}

		articleComments(wikiName: string, articleId: number, page: number = 1) {
			var url: string = createUrl( wikiName, 'api/v1/Mercury/ArticleComments', {
					articleId: articleId.toString(),
					page: page.toString()
				});
			return fetch(url);
		}

		relatedPages(wikiName: string, articleIds: number[], limit: number = 6) {
			var url: string = createUrl( wikiName, 'api/v1/RelatedPages/List', {
					ids: articleIds.join(','),
					limit: limit.toString()
				});

			return fetch(url);
		}

		userDetails(wikiName: string, userIds: number[]) {
			var url: string = createUrl(wikiName, 'api/v1/User/Details', {
					ids: userIds.join(',')
				});

			return fetch(url);
		}

		getArticleCommentsCount(wikiName: string, articleId: number) {
			var url: string = createUrl( wikiName, 'api/v1/Mercury/ArticleCommentsCount', {
						articleId: articleId.toString()
			});

			return fetch(url);
		}

		getWikiTheme(wikiName: string) {
			var url: string = createUrl( wikiName, 'api/v1/Mercury/WikiSettings');
			return fetch(url);
		}

		getTopContributors(wikiName: string, articleId: number) {
			var url: string = createUrl( wikiName, 'api/v1/Mercury/TopContributorsPerArticle', {
				articleId: articleId.toString()
			});

			return fetch(url);
		}

	}

	function fetch (url) {
		return new Promise((resolve, reject) => {
			Nipple.get(url, {
				redirects: 1
			}, (err, res, payload) => {
				if (res.headers['content-type'].match('application/json')) {
					payload = JSON.parse(payload);
				}
				if (err) {
					reject(err);
				} else {
					resolve(payload);
				}
			});
		});
	}

	function getDomainName(wikiSubDomain: string): string {
		var environment = localSettings.environment,
			options = {
				production: '',
				preview: 'preview.',
				verify: 'verify.',
				sandbox: ''
			};

		if (!environment) {
			throw Error('Environment not set');
		}

		if (typeof localSettings.environment === 'sandbox') {
			return 'http://' + localSettings.host + '.' + wikiSubDomain + '.wikia.com/';
		}

		if (typeof options[environment] !== 'undefined') {
			return 'http://' + options[environment] + wikiSubDomain + '.wikia.com/';
		}
		// Devbox
		return 'http://' + wikiSubDomain + '.' + localSettings.mediawikiHost + '.wikia-dev.com/';
	}

	function createUrl(wikiSubDomain: string, path: string, params: URLParams = {}): string {
		var qsAggregator: string[] = [];
		Object.keys(params).forEach(function(key) {
			qsAggregator.push(key + '=' + encodeURIComponent(params[key]));
		});
		return getDomainName(wikiSubDomain) +
			path +
			(qsAggregator.length > 0 ? '?' + qsAggregator.join('&') : '');
	}
}
export = MediaWiki;
