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
	none: CacheValue;
}

module Caching {

	export enum Policy {
		Private,
		Public,
	}

	export var Interval: Intervals = {
		// 30 days in seconds
		long: 2.592e+6,
		// 24h in seconds
		standard: 8.64e+4,
		// 3h in seconds
		short: 1.08e+4,
		// no cache
		none: 0
	};


	// Ported from https://github.com/Wikia/app/blob/dev/includes/wikia/nirvana/WikiaResponse.class.php#L309
	export function setResponseCaching(response: Hapi.Response, cachingSettings: CachingSettings) {
		if (cachingSettings && cachingSettings.enabled && response.statusCode == 200) {

			if (cachingSettings.browserTTL === Interval.none) {
				cachingSettings.browserTTL = cachingSettings.varnishTTL;
			}
			if (cachingSettings.cachingPolicy === Policy.Public) {
				// Varnish caches for 5 seconds when Apache sends Cache-Control: public, s-maxage=0
				// perform this logic here
				if ( cachingSettings.varnishTTL === Interval.none ) {
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

	export function policyString( policy: Policy): string {
		return Policy[policy].toLowerCase();
	}
}

export = Caching;
