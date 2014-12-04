/// <reference path="../../../../../typings/google.analytics/ga.d.ts" />
interface Window {
	_gaq: any[]
}

interface GAAccount {
	// namespace prefix for _gaq.push methods, ie. 'special'
	prefix?: string;
	// ie. 'UA-32129070-1'
	id: string;
	// sampling percentage, from 1 to 100
	sampleRate: number;
}

interface GAAccountMap {
	[name: string]: GAAccount;
}

module Mercury.Modules.Trackers {
	export class GoogleAnalytics {
		accounts: GAAccountMap;
		accountPrimary = 'primary';
		accountSpecial = 'special';
		accountMercury = 'mercury';
		accountAds = 'ads';
		queue: GoogleAnalyticsCode;

		constructor () {
			var adsContext = Mercury.Modules.Ads.getInstance().getContext(),
				// All domains that host content for Wikia
				// Use one of the domains below. If none matches, the tag will fall back to
				// the default which is 'auto', probably good enough in edge cases.
				domain: string = [
					'wikia.com', 'ffxiclopedia.org', 'jedipedia.de',
					'marveldatabase.com', 'memory-alpha.org', 'uncyclopedia.org',
					'websitewiki.de', 'wowwiki.com', 'yoyowiki.org'
				].filter((domain) => document.location.hostname.indexOf(domain) > -1)[0];
			this.accounts = Mercury.tracking.ga;
			this.queue = window._gaq || [];

			// Primary account
			this.initAccount(this.accountPrimary, adsContext, domain);

			// Special wikis account
			// For now, send all wikis to this property. Filtering for Mercury is done on the dashboard side.
			if (this.accounts[this.accountSpecial]) {
				this.initAccount(this.accountSpecial, adsContext, domain);
			}

			// Mercury-only account
			if (this.accounts[this.accountMercury]) {
				this.initAccount(this.accountMercury, adsContext, domain);
			}
			this.initAccount(this.accountAds, adsContext, domain);
		}

		/**
		 * Initialize an additional account or property
		 *
		 * @param {string} name The name of the account as specified in localSettings
		 * @param {object} adsContext
		 * @param {string} domain
		 */
		initAccount (name: string, adsContext: any, domain: string): void {
			var prefix = '';

			// Primary account should not have a namespace prefix
			if (name !== this.accountPrimary) {
				prefix = this.accounts[name].prefix + '.';
			}

			this.queue.push(
				[prefix + '_setAccount', this.accounts[name].id],
				[prefix + '_setSampleRate', this.accounts[name].sampleRate.toString()],
				[prefix + '_setDomainName', domain],
				// Custom variables
				[prefix + '_setCustomVar', 1, 'DBname', Mercury.wiki.dbName],
				[prefix + '_setCustomVar', 4, 'Skin', 'mercury', 3],
				[prefix + '_setCustomVar', 17, 'Vertical', Mercury.wiki.vertical]
			);

			if (adsContext) {
				this.queue.push(
					[prefix + '_setCustomVar', 3, 'Hub', adsContext.targeting.wikiVertical],
					[prefix + '_setCustomVar', 14, 'HasAds', adsContext.opts.showAds ? 'Yes' : 'No']
				);
			}
		}

		/**
		 * Tracks an event, using the parameters native to the GA _trackEvent method
		 *
		 * @see {@link https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEventTracking}
		 * @param {string} category Event category.
		 * @param {string} action Event action.
		 * @param {string} label Event label.
		 * @param {number} value Event value. Has to be an integer.
		 * @param {boolean} nonInteractive Whether event is non-interactive.
		 */
		track (category: string, action: string, label: string, value: number, nonInteractive: boolean): void {
			var args = Array.prototype.slice.call(arguments);
			this.queue.push(['_trackEvent'].concat(args));
			// For now, send all wikis to this property. Filtering for Mercury is done on the dashboard side.
			if (this.accounts[this.accountSpecial]) {
				this.queue.push([this.accounts[this.accountSpecial].prefix + '._trackEvent'].concat(args));
			}
			if (this.accounts[this.accountMercury]) {
				this.queue.push([this.accounts[this.accountMercury].prefix + '._trackEvent'].concat(args));
			}
		}

		/**
		 * Tracks an ads-related event
		 * @arguments set of parameters for ads-related event
		 */
		trackAds (): void {
			var args = Array.prototype.slice.call(arguments);
			this.queue.push(args);
		}

		/**
		 * Tracks the current page view
		 */
		trackPageView (): void {
			this.queue.push(['_trackPageview']);

			// For now, send all wikis to this property. Filtering for Mercury is done on the dashboard side.
			if (this.accounts[this.accountSpecial]) {
				this.queue.push([this.accounts[this.accountSpecial].prefix + '._trackPageview']);
			}
			if (this.accounts[this.accountMercury]) {
				this.queue.push([this.accounts[this.accountMercury].prefix + '._trackPageview']);
			}
		}
	}
}
