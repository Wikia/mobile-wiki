/// <reference path="../../baseline/mercury.ts" />

'use strict';
// This was disabled for now and should be re-enabled with https://wikia-inc.atlassian.net/browse/SOC-633 when
// we're ready to launch the new auth pages.
App.LoginIconComponent = Em.Component.extend({
	tagName: 'a',
	classNames: ['external', 'login'],

	click: function (): void {
		if (Mercury.wiki.enableNewAuth) {
			window.location.href = '/join?redirect=' +
			encodeURIComponent(window.location.href) +
			'&uselang=' + Mercury.wiki.language.content || 'en';
		} else {
			window.location.href = '/Special:UserLogin';
		}
	}
});
