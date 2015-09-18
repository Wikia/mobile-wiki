/// <reference path="../app.ts" />
/// <reference path="../mixins/HeadroomMixin.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />
'use strict';

App.TopBarComponent = Em.Component.extend(App.HeadroomMixin, {
	tagName: 'top-bar',
	attributeBindings: ['logoHref'],
	logoHref: Em.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),

	//click: function (): void {
	//	var label: string,
	//		href: string;
	//
	//	if (Mercury.wiki.enableNewAuth) {
	//		href = '/join?redirect=' +
	//		encodeURIComponent(window.location.href) +
	//		this.getUselangParam();
	//		label = 'join-link';
	//	} else {
	//		label = 'legacy-login-link';
	//		href = '/Special:UserLogin';
	//	}
	//
	//	M.track({
	//		trackingMethod: 'ga',
	//		action: M.trackActions.click,
	//		category: 'user-login-mobile',
	//		label: label
	//	});
	//
	//	window.location.href = href;
	//},

	getUselangParam: function (): string {
		var lang: string = Mercury.wiki.language.content;
		if (!lang || lang === 'en') {
			return '';
		}
		return '&uselang=' + encodeURIComponent(lang);
	}
});
