/**
 * Caching related routines
 */

interface CacheValue extends Number {}

interface CachingSettings {
	enabled: boolean;
	cachingPolicy: Caching.Policy;
	varnishTTL: CacheValue;
	browserTTL: CacheValue;
}

interface Intervals {
	long: CacheValue;
	standard: CacheValue;
	short: CacheValue;
	disabled: CacheValue;
	default: CacheValue;
}

module Caching {

	// Caching policy
	export enum Policy {
		Private,
		Public,
	}

	// Caching expire intervals
	export var Interval: Intervals = {
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
	 * Sets proper headers to the response object
	 *
	 * Ported from https://github.com/Wikia/app/blob/dev/includes/wikia/nirvana/WikiaResponse.class.php#L309
	 *
	 * @param response
	 * @param cachingSettings
	 */
	export function setResponseCaching(response: Hapi.Response, cachingSettings: CachingSettings) {
		if (cachingSettings && cachingSettings.enabled && response.statusCode === 200) {

			if (cachingSettings.browserTTL === Interval.default) {
				cachingSettings.browserTTL = cachingSettings.varnishTTL;
			}
			if (cachingSettings.cachingPolicy === Policy.Public) {
				// Varnish caches for 5 seconds when Apache sends Cache-Control: public, s-maxage=0
				// perform this logic here
				if ( cachingSettings.varnishTTL === Interval.disabled ) {
					cachingSettings.varnishTTL = 5;
				}
				response.header('Cache-Control', 's-maxage=' + cachingSettings.varnishTTL);
			} else if (cachingSettings.cachingPolicy === Policy.Private) {
				response.header('Cache-Control', 'private, s-maxage=' + cachingSettings.varnishTTL);
			}
			if (cachingSettings.browserTTL > 0) {
				response.header('X-Pass-Cache-Control', policyString(cachingSettings.cachingPolicy) + ', max-age=' +
					cachingSettings.browserTTL);
			}
		}
	}

	/**
	 * Returns string representation of the caching policy constant
	 * @param policy
	 * @returns {string}
	 */
	export function policyString(policy: Policy): string {
		return Policy[policy].toLowerCase();
	}
}

export = Caching;
