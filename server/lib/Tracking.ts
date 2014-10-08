/// <reference path="../../typings/hapi/hapi.d.ts" />

import localSettings = require('../../config/localSettings');

export module Tracking {
	module Comscore {
		function getC7Value (vertical: string): string {
			return 'wikiacsid_' + vertical.toLowerCase();
		}

		function getC7ParamAndValue(requestUrl: string, c7Value: string): string {
			var paramAndValue = requestUrl + (requestUrl.indexOf('?') !== -1 ? '&' : '?') + localSettings.tracking.comscore.keyword + '=' + c7Value;

			return encodeURIComponent(paramAndValue);
		}

		export function handleResponse (result: any, request: Hapi.Request): void {
			result.tracking.comscore.c7 = getC7ParamAndValue(
				'http://' + request.headers.host + '/' + request.url.path,
				getC7Value(result.article.article.adsContext.targeting.wikiVertical)
			);
		}
	}

	export function handleResponse (result: any = {}, request: Hapi.Request = {}): void {
		Comscore.handleResponse(result, request);

		// export tracking code to layout and front end code
		result.tracking = localSettings.tracking;
		result.trackingJson = JSON.stringify(localSettings.tracking);
	}
}
