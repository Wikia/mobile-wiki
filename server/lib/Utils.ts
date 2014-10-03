import util = require('util');
import localSettings = require('../../config/localSettings');
import Logger = require('./Logger');

module Utils {

	var passThroughEnv = {
		production: '%s.wikia.com',
		verify: 'verify.%s.wikia.com',
		preview: 'preview.%s.wikia.com'
	}

	function getDomainName(wikiSubDomain: string = ''): string {
		var environment: string = localSettings.environment,
			options: any = {
				production: '',
				preview: 'preview.',
				verify: 'verify.',
				sandbox: (localSettings.mediawikiHost + '.')
			};

		if (!environment) {
			Logger.fatal('Environment not set');
			throw Error('Environment not set');
		}

		if (wikiSubDomain) {
			wikiSubDomain = wikiSubDomain + '.';
		}

		if (typeof options[environment] !== 'undefined') {
			return options[environment] + wikiSubDomain + 'wikia.com';
		}

		// Devbox
		return wikiSubDomain + localSettings.mediawikiHost + '.wikia-dev.com';
	}

	function getFallbackSubDomain() {
		return (localSettings.wikiFallback || 'community')
	}

	/**
	 * @desc Generate wiki host name from the request host
	 */
	export function getWikiDomainName (host: string = ''): string {
		var regex: RegExp,
			match: string[],
			env = localSettings.environment;

		if (env && passThroughEnv.hasOwnProperty(env)) {
			if (host) {
				return host;
			}
			return util.format(passThroughEnv[env], getFallbackSubDomain());
		}

		/**
		 * Capture groups:
		 * 0. "sandbox-*|preview|verify" (if it's the beginning of the url)
		 * 1. The wiki name, including language code (i.e. it could be lastofus or de.lastofus)
		 *    ^ Note: this will match any number of periods in the wiki name, not just one for the language code
		 * We just return capture group 1
		 */
		regex = /^(?:sandbox\-[^\.]+|preview|verify)?\.?(.+?)\.wikia.*\.(?:com|local)$/;
		match = host.match(regex);

		return getDomainName ( match ? match[1] : getFallbackSubDomain() );
	}

	export function clearHost (host: string): string {
		return host.split(':')[0]; //get rid of port
	}
}

export = Utils;
