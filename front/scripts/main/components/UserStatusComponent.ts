/// <reference path="../app.ts" />
/// <reference path="../mixins/HeadroomMixin.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
/// <reference path="../../../../typings/i18next/i18next.d.ts" />
'use strict';


App.UserStatusComponent = Em.Component.extend({
	userLoggedIn: Em.computed('currentUser.isAuthenticated', function () {
		if (this.get('currentUser.isAuthenticated') === true) {
			return true;
		}
		// HTMLBars attribute binding only removes an attribute if it's value is set to null
		return null;
	}),

	userAvatarSrc: Em.computed.oneWay('currentUser.avatarPath'),

	userName: Em.computed.oneWay('currentUser.name'),

	anonAvatarHref: Em.computed(function (): string {
		if (Mercury.wiki.enableNewAuth) {
			return '/join';
		}
		return '/Special:UserLogin';
	}),

	loginHref: Em.computed(function (): string {
		if (Mercury.wiki.enableNewAuth) {
			return '/signin';
		}
		return '/Special:UserLogin';
	}),

	registerHref: Em.computed(function (): string {
		if (Mercury.wiki.enableNewAuth) {
			return '/register';
		}
		return '/Special:UserSignup';
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

	userMenuLinks: Em.computed('currentUser.name', function (): Array<any> {
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

	getUselangParam(): string {
		var lang: string = Em.get(Mercury, 'wiki.language.content');
		if (!lang || lang === 'en') {
			return '';
		}
		return '&uselang=' + encodeURIComponent(lang);
	},

	getRedirectString(): string {
		return '?redirect=' + encodeURIComponent(window.location.href) + this.getUselangParam();
	},

	/**
	 * Add redirect URL on click to make sure it accurately reflects current URL
	 * @param event
	 */
	click(event: Event): void {
		// handle join, register, and login links for anons
		if (!this.get('userLoggedIn')) {
			var $target: JQuery = $(event.target).closest('a'),
				href: string = $target.attr('href');

			// TODO: Add tracking here (HG-886)

			if (href) {
				event.preventDefault();
				window.location.assign(href + this.getRedirectString());
			}
		}
	}
});
