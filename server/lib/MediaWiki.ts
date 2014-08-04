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

	/**
	 * @desc a wrapper for making API requests for info about the wiki
	 *
	 */
	export class WikiRequest {
		name: string;

		constructor(params) {
			this.name = params.name;
		}

		wikiNamespaces() {
			var url: string = createUrl(this.name, 'api.php', {
				action: 'query',
				meta:   'siteinfo',
				siprop: 'namespaces',
				format: 'json'
				// TODO: , siinlanguagecode = ...
			});
			return fetch(url, 0);
		}

		localNavData() {
			var url: string = createUrl(this.name, 'api/v1/Navigation/Data', {});
			console.log('fetching ' + url);
			return fetch(url);
		}
	}

	export class ArticleRequest {
		name: string;
		title: string;

		constructor(params) {
			this.name = params.name;
			this.title = params.title;
		}

		article() {
			var url = createUrl(this.name, 'api/v1/Articles/asJson', {
					title: this.title
			});

			return fetch(url);
		}

		articleDetails(articles: string[] = [this.title]) {
			var url: string = createUrl(this.name, 'api/v1/Articles/Details', {
						titles: articles.map(function(text: string): string {
							return text.replace(' ', '_');
						}).join(',')
					});

			return fetch(url);
		}

		articleComments(articleId: number, page: number = 1) {
			var url: string = createUrl(this.name, 'api/v1/Mercury/ArticleComments', {
					articleId: articleId.toString(),
					page: page.toString()
				});

			return fetch(url);
		}

		relatedPages(articleIds: number[], limit: number = 6) {
			var url: string = createUrl(this.name, 'api/v1/RelatedPages/List', {
					ids: articleIds.join(','),
					limit: limit.toString()
				});

			return fetch(url);
		}

		userDetails(userIds: number[]) {
			var url: string = createUrl(this.name, 'api/v1/User/Details', {
					ids: userIds.join(',')
				});

			return fetch(url);
		}

		getArticleCommentsCount(articleId: number) {
			var url: string = createUrl(this.name, 'api/v1/Mercury/ArticleCommentsCount', {
						articleId: articleId.toString()
			});

			return fetch(url);
		}

		getWikiTheme(wikiName: string) {
			var url: string = createUrl(this.name, 'api/v1/Mercury/WikiSettings');

			return fetch(url);
		}

		getTopContributors(articleId: number) {
			var url: string = createUrl(this.name, 'api/v1/Mercury/TopContributorsPerArticle', {
				articleId: articleId.toString()
			});

			return fetch(url);
		}

	}

	/**
	 * @param url the url to fetch
	 * @param redirectsNum the number of redirects to follow, default 1
	 */
	export function fetch (url: string, redirects: number = 1) {
		return new Promise((resolve, reject) => {
			Nipple.get(url, {
				redirects: redirects
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

	export function getDomainName(wikiSubDomain: string): string {
		var environment = localSettings.environment,
			options = {
				production: '',
				preview: 'preview.',
				verify: 'verify.',
				sandbox: (localSettings.host + '.')
			};

		if (!environment) {
			throw Error('Environment not set');
		}

		if (typeof options[environment] !== 'undefined') {
			return 'http://' + options[environment] + wikiSubDomain + '.wikia.com/';
		}
		// Devbox
		return 'http://' + wikiSubDomain + '.' + localSettings.mediawikiHost + '.wikia-dev.com/';
	}

	export function createUrl(wikiSubDomain: string, path: string, params?: any): string {
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
