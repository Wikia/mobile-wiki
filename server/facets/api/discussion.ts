/// <reference path='../../lib/Utils.ts' />
/// <reference path='../../lib/Tracking.ts' />
/// <reference path="../../../typings/hapi/hapi.d.ts" />

import MW = require('../../lib/MediaWiki');
import Utils = require('../../lib/Utils');
import Tracking = require('../../lib/Tracking');
import localSettings = require('../../../config/localSettings');

function discussion (request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain = Utils.getCachedWikiDomainName(localSettings, request.headers.host),
		wikiVariables = new MW.WikiRequest({wikiDomain: wikiDomain}).getWikiVariables(),
		result: any = {},
		openGraph: Promise<any>;

	result.server = Utils.createServerData(localSettings, wikiDomain);
	result.queryParams = Utils.parseQueryParams(request.query, []);
	result.weppyConfig = localSettings.weppy;
	result.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;

	wikiVariables.then((response: any): void => {
		// TODO: These transforms could be better abstracted, as such, this is a lot like prepareArticleData
		result.wiki = response.data;

		if (result.wiki.language) {
			var userDir = result.wiki.language.userDir;
			result.isRtl = (userDir === 'rtl');
		}

		// TODO: I'm not fond of there being several patterns for transforming the object here.
		Tracking.handleResponse(result, request);

		openGraph = getOpenGraphAttributes(request.path, request.params, result.wiki);
		if (openGraph) {
			openGraph.then((openGraphData: any): void => {
				result.openGraph = openGraphData;
				reply.view('application', result);
			});
		} else {
			reply.view('application', result);
		}
	});
}

function getOpenGraphAttributes (path: string, pathParams: any, wikiVars: any): any {
	var apiUrl: string,
		openGraphData: any = {},
		regexMatch: any,
		promise: Promise<any>;

	// Post
	if (pathParams.thing === 'p' && pathParams.id) {
		regexMatch = pathParams.id.match(/^[\w-]*?(\d+)$/);
console.log('REGEX MATCH', regexMatch);
		if (regexMatch !== null) {
			apiUrl = 'http://' + localSettings.servicesDomain + '/'
				+ localSettings.discuss.baseAPIPath + '/' + wikiVars.id
				+ '/threads/' + regexMatch[1];

			openGraphData.type = 'article';
			openGraphData.url = wikiVars.basePath + path;

			return new Promise((resolve: Function, reject: Function): void => {
				MW.fetch(apiUrl)
					.then((response: any): void => {
						var content = response._embedded.firstPost[0].rawContent;
						openGraphData.title = response.title ? response.title :
							'Discussion on ' + wikiVars.siteName;
						// Keep description to 175 characters or less
						openGraphData.description = content.length > 175 ?
							content.substr(0, 172) + '...' : content;
						openGraphData.image = wikiVars.image;
						resolve(openGraphData);
					})
					.catch((): void => {
						resolve(openGraphData);
					});
			});
		}
	}
}

export = discussion;
