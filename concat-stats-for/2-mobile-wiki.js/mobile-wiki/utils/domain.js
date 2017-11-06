define('mobile-wiki/utils/domain', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = extractDomainFromUrl;


	/**
  * @param {string} url
  * @returns {string|null}
  */
	function extractDomainFromUrl(url) {
		var domain = /^(?:https?:\/\/)?((?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(?:[/?#]|$)/i.exec(url);

		return Ember.isArray(domain) ? domain[1] : null;
	}
});