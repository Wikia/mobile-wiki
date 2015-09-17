/// <reference path="../app.ts" />
/// <reference path="../mixins/HeadroomMixin.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />
'use strict';

App.TopBarComponent = Em.Component.extend(App.HeadroomMixin, {
	tagName: 'top-bar',
	attributeBindings: ['logoHref'],
	logoHref: Em.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),

	loginHref: Em.computed('redirectString', function () {
		if (Mercury.wiki.enableNewAuth) {
			return '/signin' + this.get('redirectString');
		}
		return '/Special:UserLogin';
	}),

	registerHref: Em.computed('redirectString', function () {
		if (Mercury.wiki.enableNewAuth) {
			return '/register' + this.get('redirectString');
		}
		return '/Special:UserSignup';
	}),

	joinHref: Em.computed('redirectString', function () {
		if (Mercury.wiki.enableNewAuth) {
			return '/join' + this.get('redirectString');
		}
		return '/Special:UserLogin';
	}),

	redirectString: Em.computed(window.location.href, function () {
		return '?redirect=' + encodeURIComponent(window.location.href) + this.getUselangParam()
	}),

	loginLink: Em.computed('loginHref', function () {
		var href = this.get('loginHref'),
			text = i18n.t('userStatus.login-text');
		return `<a href="${href}">${text}</a>`;
	}),

	registerLink: Em.computed('registerHref', function () {
		var href = this.get('registerHref'),
			text = i18n.t('userStatus.register-text');
		return `<a href="${href}">${text}</a>`;
	}),

	isUserLoggedIn: Em.computed('currentUser.isAuthenticated', function () {
		// HTMLBars attribute binding only removes an attribute if it's value is set to null
		if (this.get('currentUser.isAuthenticated') === false) {
			return null;
		}
		return true;
	}),

	links: Em.computed('currentUser.name', function (): Array<any> {
		return [
			{
				href: M.buildUrl({
					namespace: 'User',
					title: this.get('currentUser.name')
				}),
				textKey: 'user-menu-profile'
			},
			{
				href: M.buildUrl({
					namespace: 'Special',
					title: 'UserLogout'
				}),
				textKey: 'user-menu-log-out'
			}
		];
	}),

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
