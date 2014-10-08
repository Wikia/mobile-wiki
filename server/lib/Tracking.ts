/// <reference path="../../typings/hapi/hapi.d.ts" />

import localSettings = require('../../config/localSettings');

module Comscore {
	function getC7Value (vertical: string): string {
		return 'wikiacsid_' + vertical.toLowerCase();
	}

	function getC7ParamAndValue(requestUrl: string, c7Value: string): string {
		var paramAndValue = requestUrl + (requestUrl.indexOf('?') !== -1 ? '&' : '?') + localSettings.tracking.comscore.keyword + '=' + c7Value;

		return encodeURIComponent(paramAndValue);
	}

	export function handleResponse (tracking: any, vertical: string, request: Hapi.Request): void {
		tracking.comscore.c7 = getC7ParamAndValue(
			'http://' + request.headers.host + '/' + request.url.path,
			getC7Value(vertical)
		);
	}
}

export function handleResponse (result: any = {}, request: Hapi.Request = {}): void {
	var tracking = localSettings.tracking;

	Comscore.handleResponse(tracking, result.article.article.adsContext.targeting.wikiVertical,request);

	// export tracking code to layout and front end code
	result.tracking = tracking;
	result.trackingJson = JSON.stringify(tracking);
}
