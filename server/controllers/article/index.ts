/// <reference path="../../../typings/hapi/hapi.d.ts" />
/// <reference path="../../../typings/bluebird/bluebird.d.ts" />
/// <reference path="../../../typings/mercury/mercury-server.d.ts" />

/**
 * @description Article controller
 */
import util = require('util');
import Promise = require('bluebird');
import MediaWiki = require('../../lib/MediaWiki');
import Utils = require('../../lib/Utils');
import logger = require('../../lib/Logger');
import localSettings = require('../../../config/localSettings');

interface ServerData {
	mediawikiDomain: string;
	apiBase: string;
	environment: string;
}

/**
 * Create server data
 *
 * @returns ServerData
 */
function createServerData (): ServerData {
	return {
		mediawikiDomain: Utils.getWikiDomainName(localSettings),
		apiBase: localSettings.apiBase,
		environment: Utils.getEnvironmentString(localSettings.environment),
		cdnBaseUrl: localSettings.environment === Utils.Environment.Prod ? localSettings.cdnBaseUrl : ''
	};
}

/**
 * Form the article data
 *
 * @param payload
 * @returns {}
 */
function createArticleData (payload: any) {
	var data: any;

	if (payload && payload.article) {
		data = {
			content: payload.article.content
		};
		// We're already sending the article body (which can get quite large) back to get rendered in the template,
		// so let's not send it with the JSON payload either
		delete payload.article.content;
	}

	return util._extend(
		{
			json: JSON.stringify(payload || {}),
			article: payload
		},
		data
	);
}

/**
 * Create wiki data object
 * @param wiki
 * @returns {}
 */
function createWikiData (wiki: any) {
	return util._extend(
		{
			// article data to bootstrap Ember with in first load of application
			json: JSON.stringify(wiki || {})
		},
		wiki
	);
}

/**
 * Handler for /article/{wiki}/{articleId} -- Currently calls to Wikia public JSON api for article:
 * http://www.wikia.com/api/v1/#!/Articles
 * This API is really not sufficient for semantic routes, so we'll need some what of retrieving articles by using the
 * article slug name
 *
 * @param params
 * @param callback
 * @param getWikiInfo whether or not to make a WikiRequest to get information about the wiki
 */
export function getData(params: ArticleRequestParams, callback: any, getWikiInfo: boolean = false): void {
	var requests = [
			new MediaWiki.ArticleRequest(params.wikiDomain).fetch(params.title, params.redirect)
		];

	logger.debug(params, 'Fetching article');

	if (getWikiInfo) {
		logger.debug({wiki: params.wikiDomain}, 'Fetching wiki variables');

		requests.push(new MediaWiki.WikiRequest({
			wikiDomain: params.wikiDomain
		}).getWikiVariables());
	}

	Promise.all(requests)
		.spread((article: any, wiki: any = {}) => {
			callback(article.exception, article.data, wiki.data);
		});
}

/**
 * Handle Full page data generation
 * @param params
 * @param next
 */
export function getFull(params: ArticleRequestParams, next: Function): void {
	getData(params, (error: any, article: any, wiki: any) => {
		next(error, {
			server: createServerData(),
			wiki: createWikiData(wiki),
			article: createArticleData(article)
		});
	}, true);
}

