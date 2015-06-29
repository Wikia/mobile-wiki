/// <reference path="../../typings/hapi/hapi.d.ts" />
/// <reference path="../lib/Article.ts" />

import MainPage = require('../lib/MainPage');
import Utils = require('../lib/Utils');
import Tracking = require('../lib/Tracking');
import Caching = require('../lib/Caching');
import localSettings = require('../../config/localSettings');
import MW = require('../lib/MediaWiki');
import wrapResult = require('./api/presenters/wrapResult');
import processCuratedContentData = require('./operations/processCuratedContentData')


var cachingTimes = {
	enabled: true,
	cachingPolicy: Caching.Policy.Public,
	varnishTTL: Caching.Interval.standard,
	browserTTL: Caching.Interval.disabled
};


function showCategory (request: Hapi.Request, reply: Hapi.Response): void {
	var wikiDomain: string = Utils.getCachedWikiDomainName(localSettings, request.headers.host),
		params = {
			wikiDomain: wikiDomain
		},
		mainPage: MainPage.MainPageRequestHelper,
		allowCache = true;

	if (request.params.categoryName) {
		params.categoryName = request.params.categoryName.substr(request.params.categoryName.indexOf(':') + 1);
	} else {
		params.categoryName = null
	}

	mainPage = new MainPage.MainPageRequestHelper(params);

	mainPage.getWikiVariables((error: any, wikiVariables: any) => {
		if (error) {
			reply.redirect(localSettings.redirectUrlOnNoData);
		} else {
			mainPage.setTitle(wikiVariables.mainPageTitle);
			mainPage.getCategory(wikiVariables, (error: any, result: any = {}) => {
				processCuratedContentData(request, reply, error, result, allowCache);
			});
		}
	});
}

export = showCategory;
