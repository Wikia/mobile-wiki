/// <reference path="../../main/mixins/LanguagesMixin.ts" />
'use strict';
// This was disabled for now and should be re-enabled with https://wikia-inc.atlassian.net/browse/SOC-633 when
// we're ready to launch the new auth pages.
App.LoginIconComponent = Em.Component.extend(App.LanguagesMixin, {
	tagName: 'a',
	classNames: ['external', 'login'],
	//Let's remove this flag once we're good to go with the new login flow
	newLoginEnabled: false,

	newLoginWhitelist: [
		'clashofclans',
		'creepypasta',
		'castleclash',
		'glee'
	],

	click: function (): void {
		if (this.newLoginEnabled && this.shouldRedirectToNewLogin()) {
			window.location.href = '/join?redirect=' + encodeURIComponent(window.location.href);
		} else {
			window.location.href = '/Special:UserLogin';
		}
	},

	/**
	 * Redirects to new login flow if a wiki is japanese / whitelisted above
	 * @returns {boolean}
	 */
	shouldRedirectToNewLogin: function (): boolean {
		var shouldRedirect = false,
			dbName = Mercury.wiki.dbName;

		shouldRedirect = this.newLoginWhitelist.some((whitelistedDBName: string): boolean => {
			return whitelistedDBName === dbName;
		});

		return shouldRedirect;
	}
});
