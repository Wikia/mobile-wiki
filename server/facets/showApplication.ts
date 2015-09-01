/// <reference path='../lib/Utils.ts' />
/// <reference path='../lib/Tracking.ts' />
/// <reference path='../lib/OpenGraph.ts' />
/// <reference path="../../typings/hapi/hapi.d.ts" />

import MW = require('../lib/MediaWiki');
import Utils = require('../lib/Utils');
import Tracking = require('../lib/Tracking');
import OpenGraph = require('../lib/OpenGraph');
import Logger = require('../lib/Logger');
import localSettings = require('../../config/localSettings');
import landingPage = require('./discussions/landingPage');

function showApplication (request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain = Utils.getCachedWikiDomainName(localSettings, request.headers.host),
		wikiVariables = new MW.WikiRequest({wikiDomain: wikiDomain}).getWikiVariables(),
		context: any = {};

	// TODO: These transforms could be better abstracted, as such, this is a lot like prepareArticleData
	context.server = Utils.createServerData(localSettings, wikiDomain);
	context.queryParams = Utils.parseQueryParams(request.query, []);
	context.localSettings = localSettings;
	context.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;

	wikiVariables.then((response) => {
		var userDir: string;
		context.wiki = response.data;

		if (context.wiki.language) {
			userDir = context.wiki.language.userDir;
			context.isRtl = (userDir === 'rtl');
		}

		return OpenGraph.getAttributes(request, context.wiki);
	}).then((openGraphData: any): void => {
		// Add OpenGraph attributes to context
		context.openGraph = openGraphData;

		outputResponse(request, reply, context);
	}).catch((error: any): void => {
		// `error` could be an object or a string here
		Logger.warn({error: error}, 'Failed to get complete app view context');
		// In case of any unforeseeable error, attempt to output with the context we have so far
		outputResponse(request, reply, context);
	});
}

function outputResponse (request: Hapi.Request, reply: Hapi.Response, context: any): void {
	Tracking.handleResponse(context, request);
	//reply.view('application', context);

	landingPage.view(request, reply);
}

export = showApplication;
