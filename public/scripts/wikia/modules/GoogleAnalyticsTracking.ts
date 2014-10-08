module Wikia.Modules {

	export class GoogleAnalyticsTracker {
		ACCOUNT_PRIMARY: string = 'primary';
		ACCOUNT_SPECIAL: string = 'special';

		accounts: Object;

		constructor () {
			var i: number,
				// All domains that host content for Wikia
				possibleDomains: string[] = [
					'wikia.com', 'ffxiclopedia.org', 'jedipedia.de',
					'marveldatabase.com', 'memory-alpha.org', 'uncyclopedia.org',
					'websitewiki.de', 'wowwiki.com', 'yoyowiki.org'
				];

			this.accounts = Wikia.tracking.ga;

			// Primary account (should not have a namespace prefix)
			window._gaq.push(['_setAccount', this.accounts[this.ACCOUNT_PRIMARY]['id']]);
			if (document.cookie.indexOf('qualaroo_survey_submission') > -1) {
				// 100% sampling for users who participated in a Qualaroo survey
				window._gaq.push(['_setSampleRate', '100']);
			} else {
				window._gaq.push(['_setSampleRate', this.accounts[this.ACCOUNT_PRIMARY]['sampleRate']]);
			}

			// Special wikis account
			if (this.accounts[this.ACCOUNT_SPECIAL] && this.isSpecialWiki()) {
				window._gaq.push([this.accounts[this.ACCOUNT_SPECIAL]['prefix'] + '._setAccount',
					this.accounts[this.ACCOUNT_SPECIAL]['id']]);
				window._gaq.push([this.accounts[this.ACCOUNT_SPECIAL]['prefix'] + '._setSampleRate',
					this.accounts[this.ACCOUNT_SPECIAL]['sampleRate']]);
			}

			// Use one of the domains above. If none matches, the tag will fall back to
			// the default which is 'auto', probably good enough in edge cases.
			for (i = 0; i < possibleDomains.length; i++) {
				if (document.location.hostname.indexOf(possibleDomains[i]) > -1) {
					window._gaq.push(['_setDomainName', possibleDomains[i]]);
					break;
				}
			}
		}

		/**
		 * Check whether this is a special wiki, which warrants additional tracking
		 *
		 * @returns {boolean}
		 */
		isSpecialWiki (): boolean {
			return false;
		}

		/**
		 * Tracks an event, using the parameters native to the GA _trackEvent method
		 *
		 * @see {@link https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiEventTracking}
		 * @param {string} category Event category.
		 * @param {string} action Event action.
		 * @param {string=""} label Event label.
		 * @param {number=0} value Event value. Has to be an integer.
		 * @param {boolean=false} noninteractive Event is non-interactive.
		 */
		public track (category: string, action: string, label: string, value: number, noninteractive: boolean): void {
			var args = Array.prototype.slice.call(arguments);

			window._gaq.push(['_trackEvent'].concat(args));

			if (this.isSpecialWiki()) {
				window._gaq.push([this.accounts[this.ACCOUNT_SPECIAL]['prefix'] + '._trackEvent'].concat(args));
			}
		}
	}
}
