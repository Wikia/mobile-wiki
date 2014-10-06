import util = require('util');
import localSettings = require('../../config/localSettings');
import Logger = require('./Logger');

module Utils {

	function getDomainName(environment: string, wikiSubDomain: string = ''): string {
		if (environment === 'sandbox') {
			return localSettings.mediawikiHost + '.' + wikiSubDomain + '.wikia.com';
		}
		// Devbox
		return wikiSubDomain + localSettings.mediawikiHost + '.wikia-dev.com';
	}

	/**
	 * @desc Get fallback domain
	 * @returns {string}
	 */
	function getFallbackSubDomain() {
		return (localSettings.wikiFallback || 'community')
	}

	/**
	 * @desc Generate wiki host name from the request host
	 *
	 * @param hostName
	 * @returns {string}
	 */
	export function getWikiDomainName (hostName: string = ''): string {
		var regex: RegExp,
			match: string[],
			environment = localSettings.environment,
			// For these environments the host name can be passed through
			passThroughEnv = {
				production: '%s.wikia.com',
				verify: 'verify.%s.wikia.com',
				preview: 'preview.%s.wikia.com'
			};

		if (!environment) {
			throw Error('Environment not set');
		}

		if (environment && passThroughEnv.hasOwnProperty(environment)) {
			if (hostName) {
				return hostName;
			}
			return util.format(passThroughEnv[environment], getFallbackSubDomain());
		}

		/**
		 * Capture groups:
		 * 0. "sandbox-*" (if it's the beginning of the url)
		 * 1. The wiki name, including language code (i.e. it could be lastofus or de.lastofus)
		 *    ^ Note: this will match any number of periods in the wiki name, not just one for the language code
		 * We just return capture group 1
		 */
		regex = /^(?:sandbox\-[^\.]+)?\.?(.+?)\.wikia.*\.(?:com|local)$/;
		match = hostName.match(regex);

		return getDomainName(environment,  match ? match[1] : getFallbackSubDomain());
	}

	/**
	 * @desc Removes the port from hostname
	 *
	 * @param {string} host
	 * @returns {string}
	 */
	export function clearHost (host: string): string {
		return host.split(':')[0]; //get rid of port
	}
}

export = Utils;
