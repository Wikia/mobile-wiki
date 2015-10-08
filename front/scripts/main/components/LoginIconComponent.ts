/// <reference path="../../baseline/mercury.ts" />

'use strict';

// This was disabled for now and should be re-enabled with https://wikia-inc.atlassian.net/browse/SOC-633 when
// we're ready to launch the new auth pages.
App.LoginIconComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['external', 'login'],

	click(): void {
		var label: string,
			href: string;

		if (Mercury.wiki.enableNewAuth) {
			href = '/join?redirect=' +
			encodeURIComponent(window.location.href) +
			this.getUselangParam();
			label = 'join-link';
		} else {
			label = 'legacy-login-link';
			href = '/Special:UserLogin';
		}

		M.track({
			trackingMethod: 'ga',
			action: M.trackActions.click,
			category: 'user-login-mobile',
			label: label
		});

		window.location.href = href;
	},

	getUselangParam(): string {
		var lang: string = Mercury.wiki.language.content;
		if (!lang || lang === 'en') {
			return ''
		}
		return '&uselang=' + encodeURIComponent(lang);
	}
});
