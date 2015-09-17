/// <reference path="../../typings/hapi/hapi.d.ts" />

import MainPage = require('../lib/MainPage');
import Utils = require('../lib/Utils');
import localSettings = require('../../config/localSettings');
import processCuratedContentData = require('./operations/processCuratedContentData');

function showSection (request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain: string = Utils.getCachedWikiDomainName(localSettings, request.headers['x-original-host']),
		params: MainPageRequestParams = {
			sectionName: decodeURIComponent(request.params.sectionName) || null,
			wikiDomain: wikiDomain
		},
		mainPage: MainPage.MainPageRequestHelper,
		allowCache = true;

	if (request.state.wikicities_session) {
		params.headers = {
			'Cookie': `wikicities_session=${request.state.wikicities_session}`
		};
		allowCache = false;
	}

	mainPage = new MainPage.MainPageRequestHelper(params);
	mainPage.getWikiVariables((error: any, wikiVariables: any) => {
		if (error) {
			reply.redirect(localSettings.redirectUrlOnNoData);
		} else {
			mainPage.setTitle(wikiVariables.mainPageTitle);
			mainPage.getSection(wikiVariables, (error: any, result: any = {}) => {
				processCuratedContentData(request, reply, error, result, allowCache);
			});
		}
	});
}

export = showSection;
