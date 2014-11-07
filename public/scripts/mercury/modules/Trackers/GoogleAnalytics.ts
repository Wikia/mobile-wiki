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
		queue: GoogleAnalyticsCode;

		constructor () {
			var i: number,
				// All domains that host content for Wikia
				possibleDomains: string[] = [
					'wikia.com', 'ffxiclopedia.org', 'jedipedia.de',
					'marveldatabase.com', 'memory-alpha.org', 'uncyclopedia.org',
					'websitewiki.de', 'wowwiki.com', 'yoyowiki.org'
				];

			this.accounts = Mercury.tracking.ga;
			this.queue = window._gaq || [];

			// Primary account
			this.initAccount(this.accountPrimary);

			// Special wikis account
			if (this.accounts[this.accountSpecial] && this.isSpecialWiki()) {
				this.initAccount(this.accountSpecial);
			}

			// Mercury-only account
			if (this.accounts[this.accountMercury]) {
				this.initAccount(this.accountMercury);
			}

			// Use one of the domains above. If none matches, the tag will fall back to
			// the default which is 'auto', probably good enough in edge cases.
			for (i = 0; i < possibleDomains.length; i++) {
				if (document.location.hostname.indexOf(possibleDomains[i]) > -1) {
					this.queue.push(['_setDomainName', possibleDomains[i]]);
					break;
				}
			}

			// Custom variables
			var adsContext = Mercury.Modules.Ads.getInstance().getContext();
			this.queue.push(['_setCustomVar', 1, 'DBname', Mercury.wiki.dbName]);
			this.queue.push(['_setCustomVar', 4, 'Skin', 'mercury', 3]);
			this.queue.push(['_setCustomVar', 17, 'Vertical', Mercury.wiki.vertical]);
			if (adsContext) {
				this.queue.push(['_setCustomVar', 3, 'Hub', adsContext.targeting.wikiVertical]);
				this.queue.push(['_setCustomVar', 14, 'HasAds', adsContext.opts.showAds ? 'Yes' : 'No']);
			}
		}

		/**
		 * Initialize an additional account or property
		 *
		 * @param {string} name The name of the account as specified in localSettings
		 */
		initAccount (name: string): void {
			var prefix = '';

			// Primary account should not have a namespace prefix
			if (name !== this.accountPrimary) {
				prefix = this.accounts[name].prefix + '.';
			}

			this.queue.push([prefix + '_setAccount', this.accounts[name].id]);
			this.queue.push([prefix + '_setSampleRate', this.accounts[name].sampleRate.toString()]);
		}

		/**
		 * Check whether this is a special wiki, which warrants additional tracking
		 *
		 * @returns {boolean}
		 */
		isSpecialWiki (): boolean {
			return !!Mercury.wiki.isGASpecialWiki;
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

			if (this.accounts[this.accountSpecial] && this.isSpecialWiki()) {
				this.queue.push([this.accounts[this.accountSpecial].prefix + '._trackEvent'].concat(args));
			}
			if (this.accounts[this.accountMercury]) {
				this.queue.push([this.accounts[this.accountMercury].prefix + '._trackEvent'].concat(args));
			}
		}

		/**
		 * Tracks the current page view
		 */
		trackPageView (): void {
			this.queue.push(['_trackPageview']);

			if (this.accounts[this.accountSpecial] && this.isSpecialWiki()) {
				this.queue.push([this.accounts[this.accountSpecial].prefix + '._trackPageview']);
			}
			if (this.accounts[this.accountMercury]) {
				this.queue.push([this.accounts[this.accountMercury].prefix + '._trackPageview']);
			}
		}
	}
}
