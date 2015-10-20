/// <reference path="../../typings/hapi/hapi.d.ts" />

import Logger = require('../lib/Logger');
import MainPage = require('../lib/MainPage');
import Utils = require('../lib/Utils');
import localSettings = require('../../config/localSettings');
import processCuratedContentData = require('./operations/processCuratedContentData');

function showSection (request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain: string = Utils.getCachedWikiDomainName(localSettings, request),
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
	mainPage.getWikiVariables()
		.then((wikiVariables: any): void => {
			var result: any = {
					wiki: wikiVariables,
					server: MainPage.MainPageRequestHelper.createServerData(wikiDomain),
					mainPageData: {}
				},
				code = 200;

			Utils.redirectToCanonicalHostIfNeeded(localSettings, request, reply, wikiVariables);

			mainPage.setTitle(wikiVariables.mainPageTitle);

			mainPage.getSection()
				.then((pageData: any) => {
					result.mainPageData = {
						curatedContent: pageData.curatedContent,
						adsContext: pageData.mainPageData.adsContext,
						details: pageData.mainPageData.details
					};
				})
				.catch(MainPage.GetCuratedContentRequestError, (error) => {
					code = error.data.exception.code || 500;
					result.mainPageData.error = error.data.exception;
					allowCache = false;

					Logger.error('Request to MercuryApi::getCuratedContentSection failed', error.data.exception);
				})
				.catch(MainPage.GetMainPageDataRequestError, (errorWithCuratedContent) => {
					code = errorWithCuratedContent.data.exception.code || 500;
					result.mainPageData = {
						curatedContent: errorWithCuratedContent.data.curatedContent,
						error: errorWithCuratedContent.data.exception
					};

					allowCache = false;

					Logger.error('Request to MercuryApi::getMainPageDetailsAndAdsContext failed', errorWithCuratedContent.data.exception);
				}).finally(() => {
					processCuratedContentData(request, reply, result, allowCache, code);
				});
		})
		.catch(Utils.RedirectedToCanonicalHost, (): void => {
			Logger.info('Redirected to canonical host');
		})
		.catch((): void => {
			reply.redirect(localSettings.redirectUrlOnNoData);
		});
}

export = showSection;
