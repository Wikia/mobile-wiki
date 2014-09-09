import localSettings = require('../../config/localSettings');

module Utils {

	/**
	 * @desc extracts the wiki name from the host
	 */
	export function getWikiName (host: string): string {
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
