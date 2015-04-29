'use strict';
// This was disabled for now and should be re-enabled with https://wikia-inc.atlassian.net/browse/SOC-633 when
// we're ready to launch the new auth pages.
App.LoginIconComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['external', 'login'],

	newLoginWhitelist: [
		'clashofclans',
		'creepypasta',
		'castleclash',
		'glee'
	],

	click: function (): void {
		if (this.shouldRedirectToNewLogin()) {
			window.location.href = '/join?redirect=' + encodeURIComponent(window.location.href);
		} else {
			window.location.href = '/Special:UserLogin';
		}
	},

	isJapanese: function (): boolean {
		var lang = navigator.language || navigator.browserLanguage;
		if (lang) {
			lang = lang.substr(0, 2);
		} else {
			lang = this.get('language.content');
		}
		return lang === 'ja';
	},

	/**
	 * Redirects to new login flow if a wiki is japanese / whitelisted above
	 * @returns {boolean}
	 */
	shouldRedirectToNewLogin: function (): boolean {
		var shouldRedirect = false,
			dbName = Mercury.wiki.dbName;

		this.newLoginWhitelist.forEach((whitelistedDBName: string) => {
			shouldRedirect = whitelistedDBName === dbName;
		});

		if (this.isJapanese()) {
			shouldRedirect = true;
		}

		return shouldRedirect;

	}
});
