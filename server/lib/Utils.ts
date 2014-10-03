import localSettings = require('../../config/localSettings');

module Utils {

	export function getDomainName(wikiSubDomain: string = ''): string {
		var environment: string = localSettings.environment,
			options: any = {
				production: '',
				preview: 'preview.',
				verify: 'verify.',
				sandbox: (localSettings.host + '.')
			};

		if (!environment) {
			Logger.fatal('Environment not set');
			throw Error('Environment not set');
		}

		if (wikiSubDomain) {
			wikiSubDomain = wikiSubDomain + '.';
		}

		if (typeof options[environment] !== 'undefined') {
			return 'http://' + options[environment] + wikiSubDomain + 'wikia.com/';
		}

		// Devbox
		return 'http://' + wikiSubDomain + localSettings.mediawikiHost + '.wikia-dev.com/';
	}

	/**
	 * @desc extracts the wiki name from the host
	 */
	export function getWikiDomainName (host?: string): string {
		var regex: RegExp,
			match: string[];

		/**
		 * Capture groups:
		 * 0. "sandbox-*|preview|verify" (if it's the beginning of the url)
		 * 1. The wiki name, including language code (i.e. it could be lastofus or de.lastofus)
		 *    ^ Note: this will match any number of periods in the wiki name, not just one for the language code
		 * We just return capture group 1
		 */
		regex = /^(?:sandbox\-[^\.]+|preview|verify)?\.?(.+?)\.wikia.*\.(?:com|local)$/;
		match = host.match(regex);
		//TODO: This is a bad default, find better solution
		return match ? match[1] : (localSettings.wikiFallback || 'community');
	}
}

export = Utils;
