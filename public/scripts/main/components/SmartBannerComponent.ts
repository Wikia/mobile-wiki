/// <reference path="../app.ts" />
/// <reference path="../../mercury/utils/browser.ts" />
/// <reference path="../../../../typings/jquery.cookie/jquery.cookie.d.ts" />
'use strict';

App.SmartBannerComponent = Em.Component.extend({
	classNames: ['smart-banner'],
	classNameBindings: ['noIcon', 'verticalClass'],

	options: {
		// Language code for App Store
		appStoreLanguage: 'us',
		// Duration to hide the banner after close button is clicked (0 = always show banner)
		daysHiddenAfterClose: 15,
		// Duration to hide the banner after it is clicked (0 = always show banner)
		daysHiddenAfterView: 30
	},
	day: 86400000,
	isVisible: false,

	appId: function (): string {
		return this.get('config.appId.' + this.get('system'));
	}.property('config', 'system'),

	appScheme: function (): string {
		return this.get('config.appScheme.' + this.get('system'));
	}.property('config', 'system'),

	config: function (): any {
		return Em.getWithDefault(Mercury, 'wiki.smartBanner', {});
	}.property(),

	dbName: function (): string {
		return Em.get(Mercury, 'wiki.dbName');
	}.property(),

	description: Em.computed.alias('config.description'),

	icon: Em.computed.alias('config.icon'),

	iconStyle: function (): string {
		return 'background-image: url(%@)'.fmt(this.get('icon'));
	}.property('icon'),

	labelInStore: function (): string {
		return i18n.t('app:smartbanner-store-' + this.get('system'));
	}.property('system'),

	labelInstall: function (): string {
		return i18n.t('app:smartbanner-install-' + this.get('system'));
	}.property('system'),

	link: function (): string {
		var link: string,
			appId: string = this.get('appId');

		if (this.get('system') === 'android') {
			link = 'https://play.google.com/store/apps/details?id=' +
			appId +
			'&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner%26utm_term%3D' +
			this.get('dbName');
		} else {
			link = 'https://itunes.apple.com/' +
			this.get('options.appStoreLanguage') +
			'/app/id' +
			appId;
		}

		return link;
	}.property('appId', 'dbName', 'system'),

	noIcon: Em.computed.not('icon'),

	system: function (): string {
		return Mercury.Utils.Browser.getSystem();
	}.property(),

	title: Em.computed.alias('config.name'),

	verticalClass: function (): string {
		var vertical: string = Em.get(Mercury, 'wiki.vertical');
		return vertical + '-vertical';
	}.property(),

	click: function (event: MouseEvent): void {
		var $target = this.$(event.target);

		if ($target.is('.sb-close')) {
			this.close();
		} else {
			this.view();
		}
	},

	didInsertElement: function (): void {
		// Check if it's already a standalone web app or running within a webui view of an app (not mobile safari)
		var standalone: any = Em.get(navigator, 'standalone'),
			config: any = this.get('config');

		// Don't show banner if device isn't iOS or Android, website is loaded in app or user dismissed banner
		if (this.get('system') &&
			!standalone &&
			config.name &&
			!config.disabled &&
			$.cookie('sb-closed') !== '1'
		) {
			this.set('isVisible', true);
			this.track(M.trackActions.impression);
		} else {
			this.destroy();
		}
	},

	close: function (): void {
		this.setSmartBannerCookie(this.get('options.daysHiddenAfterClose'));
		this.set('isVisible', false);
		this.track(M.trackActions.close);
	},

	view: function (): void {
		var appScheme: string = this.get('appScheme');

		this.setSmartBannerCookie(this.get('options.daysHiddenAfterView'));

		if (appScheme) {
			this.tryToOpenApp(appScheme);
		} else {
			window.open(this.get('link'), '_blank');
		}

		this.set('isVisible', false);
	},

	/**
	 * Try to open app using custom scheme and if it fails go to fallback function
	 *
	 * @param {string} appScheme
	 */
	tryToOpenApp: function (appScheme: string): void {
		this.track(M.trackActions.open);
		window.document.location.href = appScheme + '://';

		Em.run.later(this, this.fallbackToStore, 300);
	},

	/**
	 * Open app store
	 */
	fallbackToStore: function (): void {
		this.track(M.trackActions.install);
		window.open(this.get('link'), '_blank');
	},

	/**
	 * Sets sb-closed=1 cookie for given number of days
	 *
	 * @param {number} days
	 */
	setSmartBannerCookie: function (days: number): void {
		var date: Date = new Date();
		date.setTime(date.getTime() + (days * this.get('day')));
		$.cookie('sb-closed', 1, {
			expires: date,
			path: '/'
		});
	},

	track: function (action: string): void {
		M.track({
			action: action,
			category: 'smart-banner',
			label: Em.get(Mercury, 'wiki.dbName')
		});
	}
});
