/// <reference path="../../../typings/hapi/hapi.d.ts" />

import Utils = require('../../lib/Utils');
import localSettings = require('../../../config/localSettings');

/**
 * TODO: clean up this function
 *
 * @param {Hapi.Request} request
 * @param result
 */
function prepareSectionData (request: Hapi.Request, result: any): void {
	var title: string,
		userDir = 'ltr';

	if (result.sectionData.items && result.sectionData.items.length > 0) {
		title = request.url.path.replace('\/main\/section\/', '');
	} else {
		title = result.wiki.mainPageTitle.replace(/_/g, ' ');
	}

	if (result.wiki.language) {
		userDir = result.wiki.language.userDir;
		result.isRtl = (userDir === 'rtl');
	}

	result.displayTitle = title;
	result.isMainPage = true;
	result.canonicalUrl = result.wiki.basePath + '/';
	// the second argument is a whitelist of acceptable parameter names
	result.queryParams = Utils.parseQueryParams(request.query, ['noexternals', 'buckysampling']);

	result.weppyConfig = localSettings.weppy;
	if (typeof result.queryParams.buckySampling === 'number') {
		result.weppyConfig.samplingRate = result.queryParams.buckySampling / 100;
	}

	result.userId = request.state.wikicitiesUserID ? request.state.wikicitiesUserID : 0;
}

export = prepareSectionData;
