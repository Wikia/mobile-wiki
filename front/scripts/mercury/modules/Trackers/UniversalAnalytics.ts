/// <reference path="../../../../../typings/google.analytics/ga.d.ts" />
/// <reference path="../../modules/Ads.ts" />
/// <reference path="../../../baseline/mercury.ts" />

interface TrackerMap {
	[name: string]: UniversalAnalytics.Tracker;
}

module Mercury.Modules.Trackers {
	export class UniversalAnalytics {
		accounts: GAAccountMap;
		accountPrimary = 'primary';
		accountSpecial = 'special';
		accountAds = 'ads';
		trackers: TrackerMap;

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
			this.accounts = M.prop('tracking.ua');
			this.trackers = {};

			// Primary account
			this.initAccount(this.accountPrimary, adsContext, domain);

			// Special wikis account
			// For now, send all wikis to this property. Filtering for Mercury is done on the dashboard side.
			if (this.accounts[this.accountSpecial]) {
				this.initAccount(this.accountSpecial, adsContext, domain);
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
		initAccount (trackerName: string, adsContext: any, domain: string): void {
			var options, prefix;

			options = {
				name: "",
				allowLinker: true,
				sampleRate: this.accounts[trackerName].sampleRate
			};
			prefix = '';

			// Primary account should not have a namespace prefix
			if (trackerName !== this.accountPrimary) {
				prefix = this.accounts[trackerName].prefix + '.';
			}

			// Primary account should not have a namespace prefix
			if (trackerName !== this.accountPrimary) {
				options.name = this.accounts[trackerName].prefix;
			}

			this.trackers[trackerName] = ga.create(this.accounts[trackerName].id, 'auto', options);

			ga(prefix + 'require', 'linker');
			if (domain) {
				ga(prefix + 'linker:autoLink', domain);
			}

			/**** High-Priority Custom Dimensions ****/
			ga(prefix + 'set', 'dimension1', Mercury.wiki.dbName);                              // DBname
			ga(prefix + 'set', 'dimension2', Mercury.wiki.language.content);                    // ContentLanguage
			ga(prefix + 'set', 'dimension4', 'mercury');                                        // Skin
			// TODO: Currently the only login status is 'anon', in the future 'user' may be an option
			ga(prefix + 'set', 'dimension5', 'anon');                                           // LoginStatus

			/**** Medium-Priority Custom Dimensions ****/
			ga(prefix + 'set', 'dimension8', 'article');                                        // PageType
			ga(prefix + 'set', 'dimension9', String(Mercury.wiki.id));                          // CityId
			ga(prefix + 'set', 'dimension15', 'No');    // IsCorporatePage
			// TODO: Krux segmenting not implemented in Mercury https://wikia-inc.atlassian.net/browse/HG-456
			// ga(prefix + 'set', 'dimension16', getKruxSegment());                             // Krux Segment
			ga(prefix + 'set', 'dimension17', Mercury.wiki.vertical);                           // Vertical
			ga(prefix + 'set', 'dimension19', M.prop('article.type'));                          // ArticleType

			if (adsContext) {
				ga(prefix + 'set', 'dimension3', adsContext.targeting.wikiVertical);            // Hub
				ga(prefix + 'set', 'dimension14', adsContext.opts.showAds ? 'Yes' : 'No');      // HasAds
			}

			if (Mercury.wiki.wikiCategories instanceof Array) {
				ga(prefix + 'set', 'dimension18', Mercury.wiki.wikiCategories.join(','));       // Categories
			}
		}

		/**
		 * Tracks an event, using the parameters native to the UA send() method
		 *
		 * @see {@link https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEventTracking}
		 * @param {string} category Event category.
		 * @param {string} action Event action.
		 * @param {string} label Event label.
		 * @param {number} value Event value. Has to be an integer.
		 * @param {boolean} nonInteractive Whether event is non-interactive.
		 */
		track (category: string, action: string, label: string, value: number, nonInteractive: boolean): void {
			this.trackers[this.accountPrimary].send(
				'event',
				{
					eventCategory: category,
					eventAction: action,
					eventLabel: label,
					eventValue:value,
					nonInteraction: nonInteractive
				}
			);
			// For now, send all wikis to this property. Filtering for Mercury is done on the dashboard side.
			if (this.accounts[this.accountSpecial]) {
				this.trackers[this.accountSpecial].send(
					'event',
					{
						eventCategory: category,
						eventAction: action,
						eventLabel: label,
						eventValue:value,
						nonInteraction: nonInteractive
					}
				);
			}
		}

		/**
		 * Tracks an ads-related event
		 * @arguments set of parameters for ads-related event
		 */
		trackAds (): void {
			this.trackers[this.accountAds].send(
				'event',
				{
					eventCategory: category,
					eventAction: action,
					eventLabel: label,
					eventValue:value,
					nonInteraction: nonInteractive
				}
			);
		}

		/**
		 * Tracks the current page view
		 */
		trackPageView (): void {
			this.trackers[this.accountPrimary].send('pageview');

			// For now, send all wikis to this property. Filtering for Mercury is done on the dashboard side.
			if (this.accounts[this.accountSpecial]) {
				this.trackers[this.accountSpecial].send('pageview');
			}
		}
	}
}
