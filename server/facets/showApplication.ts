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

function showApplication (request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain = Utils.getCachedWikiDomainName(localSettings, request),
		wikiVariables = new MW.WikiRequest({wikiDomain: wikiDomain}).wikiVariables(),
		context: any = {};

	// TODO: These transforms could be better abstracted, as such, this is a lot like prepareArticleData
	context.server = Utils.createServerData(localSettings, wikiDomain);
	context.queryParams = Utils.parseQueryParams(request.query, []);
	context.localSettings = localSettings;
	context.userId = request.auth.isAuthenticated ? request.auth.credentials.userId : 0;

	wikiVariables.then((wikiVariables: any): Promise<any> => {
		var contentDir: string;

		Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, wikiVariables);

		context.wiki = wikiVariables;
		if (context.wiki.language) {
			contentDir = context.wiki.language.contentDir;
			context.isRtl = (contentDir === 'rtl');
		}

		return OpenGraph.getAttributes(request, context.wiki);
	}).then((openGraphData: any): void => {
		// Add OpenGraph attributes to context
		context.openGraph = openGraphData;

		outputResponse(request, reply, context);
	}).catch(Utils.RedirectedToCanonicalHost, (): void => {
		Logger.info('Redirected to canonical host');
	}).catch((error: any): void => {
		// `error` could be an object or a string here
		Logger.warn({error: error}, 'Failed to get complete app view context');
		// In case of any unforeseeable error, attempt to output with the context we have so far
		outputResponse(request, reply, context);
	});
}

function outputResponse (request: Hapi.Request, reply: Hapi.Response, context: any): void {
	Tracking.handleResponse(context, request);
	reply.view('application', context);
}

export = showApplication;
