define('mobile-wiki/utils/mediawiki-fetch', ['exports', 'fetch', 'mobile-wiki/config/environment'], function (exports, _fetch, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = mediawikiFetch;
	function mediawikiFetch(url) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		if (typeof FastBoot !== 'undefined' && _environment.default.mediawikiDomain) {
			var Url = FastBoot.require('url'),
			    proxyingAgent = FastBoot.require('proxying-agent'),
			    parsedUrl = Url.parse(url);

			options.agent = proxyingAgent.create('http://' + _environment.default.mediawikiDomain, parsedUrl.host);
			options.follow = options.follow || 5;
		}

		return (0, _fetch.default)(url, options);
	}
});