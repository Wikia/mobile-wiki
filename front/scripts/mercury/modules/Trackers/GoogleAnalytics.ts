/// <reference path="../../../../../typings/google.analytics/ga.d.ts" />
/// <reference path="../../modules/Ads.ts" />
/// <reference path="../../../baseline/mercury.ts" />
interface Window {
	_gaq: any[]
}

module Mercury.Modules.Trackers {
	export class GoogleAnalytics {
		accounts: GAAccountMap;
		accountPrimary = 'primary';
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
			this.accounts = M.prop('tracking.ga');
			this.queue = window._gaq || [];

			this.initAccount(this.accountPrimary, adsContext, domain);
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
			var prefix = '',
				loginStatus: string;

			// Primary account should not have a namespace prefix
			if (name !== this.accountPrimary) {
				prefix = this.accounts[name].prefix + '.';
			}

			loginStatus = M.prop('isAuthenticated') ? 'user' : 'anon';
			this.queue.push(
				[prefix + '_setAccount', this.accounts[name].id],
				[prefix + '_setSampleRate', this.accounts[name].sampleRate.toString()],
				[prefix + '_setDomainName', domain],
				// Custom variables
				[prefix + '_setCustomVar', 1, 'DBname', Mercury.wiki.dbName, 3],
				[prefix + '_setCustomVar', 2, 'ContentLanguage', Mercury.wiki.language.content, 3],
				[prefix + '_setCustomVar', 4, 'Skin', 'mercury', 3],
				[prefix + '_setCustomVar', 5, 'LoginStatus', loginStatus, 3],
				[prefix + '_setCustomVar', 9, 'CityId', String(Mercury.wiki.id), 3],
				[prefix + '_setCustomVar', 15, 'IsCorporatePage', 'No', 3],
				// TODO: Krux segmenting not implemented in Mercury https://wikia-inc.atlassian.net/browse/HG-456
				// [prefix + '_setCustomVar', 16, 'Krux Segment', getKruxSegment(), 3],
				[prefix + '_setCustomVar', 17, 'Vertical', Mercury.wiki.vertical, 3],
				[prefix + '_setCustomVar', 19, 'ArticleType', M.prop('article.type'), 3]
			);

			if (adsContext) {
				this.queue.push(
					[prefix + '_setCustomVar', 3, 'Hub', adsContext.targeting.wikiVertical, 3],
					[prefix + '_setCustomVar', 14, 'HasAds', adsContext.opts.showAds ? 'Yes' : 'No', 3]
				);
			}
			if (Mercury.wiki.wikiCategories instanceof Array) {
				this.queue.push(
					[prefix + '_setCustomVar', 18, 'Categories', Mercury.wiki.wikiCategories.join(',') , 3]
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
		}

		/**
		 * Tracks an ads-related event
		 * @arguments set of parameters for ads-related event
		 */
		trackAds (): void {
			var trackingData = Array.prototype.slice.call(arguments);
			trackingData.unshift('ads._trackEvent');
			this.queue.push(trackingData);
		}

		/**
		 * Tracks the current page view
		 */
		trackPageView (): void {
			var mainPageTitle = Mercury.wiki.mainPageTitle,
				isMainPage = window.location.pathname.split('/').indexOf(mainPageTitle),
				pageType = ['_setCustomVar', 8, 'PageType', isMainPage ? 'home' : 'article', 3];

			this.queue.push(pageType),

			// Set custom var in ad account as well
			pageType[0] = this.accounts[this.accountAds].prefix + '.' + pageType[0];
			this.queue.push(pageType);

			this.queue.push(['_trackPageview']);
		}
	}
}
