/// <reference path="../app.ts" />
/// <reference path="../mixins/HeadroomMixin.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />
'use strict';


// TODO: add click tracking for login/reg/join links
App.UserStatusComponent = Em.Component.extend(App.HeadroomMixin, {
	tagName: 'user-status',
	attributeBindings: ['anonAvatarSrc', 'anonAvatarHref', 'userLoggedIn', 'userAvatarSrc', 'userName'],
	classNames: ['user-status', 'needsclick'],
	anonAvatarSrc: 'http://wikia.github.io/style-guide/assets/images/icons/icon_avatar.svg',

	anonAvatarHref: Em.computed('redirectString', function (): string {
		if (Mercury.wiki.enableNewAuth) {
			return '/join' + this.get('redirectString');
		}
		return '/Special:UserLogin';
	}),

	userLoggedIn: Em.computed('currentUser.isAuthenticated', function () {
		// HTMLBars attribute binding only removes an attribute if it's value is set to null
		if (this.get('currentUser.isAuthenticated') === false) {
			return null;
		}
		return true;
	}),

	userAvatarSrc: Em.computed('currentUser.avatarPath', function (): string {
		return this.get('currentUser.avatarPath');
	}),

	userName: Em.computed('currentUser.avatarPath', function (): string {
		return this.get('currentUser.name');
	}),

	loginHref: Em.computed('redirectString', function (): string {
		if (Mercury.wiki.enableNewAuth) {
			return '/signin' + this.get('redirectString');
		}
		return '/Special:UserLogin';
	}),

	registerHref: Em.computed('redirectString', function (): string {
		if (Mercury.wiki.enableNewAuth) {
			return '/register' + this.get('redirectString');
		}
		return '/Special:UserSignup';
	}),

	redirectString: Em.computed('router.url', function (): string {
		return '?redirect=' + encodeURIComponent(this.get('router.url')) + this.getUselangParam();
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

	getUselangParam: function (): string {
		var lang: string = Em.get(Mercury, 'wiki.language.content');
		if (!lang || lang === 'en') {
			return '';
		}
		return '&uselang=' + encodeURIComponent(lang);
	}
});
