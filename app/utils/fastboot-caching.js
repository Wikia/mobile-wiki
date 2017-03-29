/**
 * @typedef {Object} CachingIntervals
 * @property {number} long
 * @property {number} standard
 * @property {number} short
 * @property {number} disabled
 * @property {number} default
 */

/**
 * @typedef {Object} CachingPolicy
 */

/**
 * @typedef {Object} CachingSettings
 * @property {boolean} enabled
 * @property {CachingPolicy} cachingPolicy
 * @property {number} varnishTTL
 * @property {number} browserTTL
 */

export const CachingPolicy = {
		Private: 'private',
		Public: 'public'
	},
// Caching expire intervals
	CachingInterval = {
		// 30 days in seconds
		long: 2.592e+6,
		// 24h in seconds
		standard: 8.64e+4,
		// 3h in seconds
		short: 1.08e+4,
		// disabled
		disabled: 0,
		// default
		default: -1
	};

/**
 * Disables use of cache in the response
 *
 * @param {FastBoot} fastboot
 * @returns {void}
 */
export function disableCache(fastboot) {
	if (!fastboot.get('isFastBoot')) {
		return;
	}

	fastboot.get('response.headers').set('Cache-Control', 'private, s-maxage=0, max-age=0, must-revalidate');
}

/**
 * Sets proper headers to the response object
 *
 * Ported from https://github.com/Wikia/app/blob/dev/includes/wikia/nirvana/WikiaResponse.class.php#L309
 *
 * @param {FastBoot} fastboot
 * @param {CachingSettings} cachingSettings
 * @returns {void}
 */
export function setResponseCaching(fastboot, cachingSettings) {
	if (!fastboot.get('isFastBoot')) {
		return;
	}

	if (cachingSettings && cachingSettings.enabled) {
		if (cachingSettings.browserTTL === CachingInterval.default) {
			cachingSettings.browserTTL = cachingSettings.varnishTTL;
		}

		if (cachingSettings.cachingPolicy === CachingPolicy.Public) {
			// Varnish caches for 5 seconds when Apache sends Cache-Control: public, s-maxage=0
			// perform this logic here
			if (cachingSettings.varnishTTL === CachingInterval.disabled) {
				cachingSettings.varnishTTL = 5;
			}

			fastboot.get('response.headers').set('Cache-Control', `s-maxage=${cachingSettings.varnishTTL}`);
		} else if (cachingSettings.cachingPolicy === CachingPolicy.Private) {
			fastboot.get('response.headers').set('Cache-Control', `private, s-maxage=${cachingSettings.varnishTTL}`);
		}

		if (cachingSettings.browserTTL > 0) {
			fastboot.get('response.headers').set(
				'X-Pass-Cache-Control',
				`${cachingSettings.cachingPolicy}, max-age=${cachingSettings.browserTTL}`
			);
		}
	}
}
