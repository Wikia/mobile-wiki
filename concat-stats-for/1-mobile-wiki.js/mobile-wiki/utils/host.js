define('mobile-wiki/utils/host', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = getHostFromRequest;
	/**
  * @param {Object} request - FastBoot request
  * @returns {string}
  */
	function getHostFromRequest(request) {
		// We use two special domain prefixes for Ad Operations and Sales reasons
		// Their purpose is to allow separate targeting by having a different domain in the browser
		// We still want to call production API with non-prefixed host
		// See https://github.com/Wikia/wikia-vcl/blob/master/wikia.com/control-stage.vcl
		var headers = request.get('headers');
		// One of our layers cuts out sandbox-* prefix from the host, use x-original-host instead
		var host = headers.get('x-original-host') || request.get('host');

		if (headers.get('x-staging') === 'externaltest') {
			host = host.replace(/^(externaltest|showcase)\./, '');
		}

		return host;
	}
});