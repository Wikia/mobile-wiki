/// <reference path="../app.ts" />
'use strict';

App.SmartBannerComponent = Em.Component.extend({
	classNames: ['smart-banner'],
	classNameBindings: ['noIcon', 'type', 'show', 'verticalClass'],
	noIcon: Em.computed.not('icon'),
	show: false,

	options: {
		// Language code for App Store
		appStoreLanguage: 'us',
		// Duration to hide the banner after close button is clicked (0 = always show banner)
		daysHiddenAfterClose: 15,
		// Duration to hide the banner after it is clicked (0 = always show banner)
		daysHiddenAfterView: 30
	},

	cookieData: {
		domain: window.location.hostname.replace(/^\w+/, ''),
		path: '/'
	},

	day: 86400000,

	iconStyle: function () {
		return 'background-image: url(%@)'.fmt(this.get('icon'));
	}.property('icon'),

	verticalClass: function () {
		return this.get('vertical') + '-vertical';
	}.property('vertical'),

	init: function () {
		var ua = Em.get(window, 'navigator.userAgent'),
			// Check if it's already a standalone web app or running within a webui view of an app (not mobile safari)
			standalone = Em.get(navigator, 'standalone'),
			wiki = Em.getWithDefault(Mercury, 'wiki', {}),
			smartBannerConfig = Em.getWithDefault(wiki, 'smartBanner', {}),
			vertical = Em.get(wiki, 'vertical'),
			type: string,
			link: string,
			appId: string,
			inStore: string,
			install: string;

		// Detect banner type (iOS or Android)
		if (ua.match(/iPad|iPhone|iPod/i) !== null) {
			type = 'ios';
		} else if (ua.match(/Android/i) !== null) {
			type = 'android';
		}

		//Don't show banner if device isn't iOS or Android, website is loaded in app or user dismissed banner
		if (type &&
			!standalone &&
			smartBannerConfig &&
			!smartBannerConfig.disabled,
			$.cookie('sb-closed', Number) !== 1
		) {
			inStore = i18n.t('app:smartbanner-store-' + type);
			install = i18n.t('app:smartbanner-install-' + type);
			appId = Em.get(smartBannerConfig, 'appId.' + type);

			if (type === 'android') {
				link = 'https://play.google.com/store/apps/details?id=' +
				appId +
				'&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner%26utm_term%3D' +
				wiki.dbName;
			} else {
				link = 'https://itunes.apple.com/' +
				this.get('options.appStoreLanguage') +
				'/app/id' +
				appId;
			}

			//track.event('smart-banner', track.IMPRESSION, {
			//	method: 'both'
			//});

			this.setProperties({
				vertical: vertical,
				title: smartBannerConfig.name,
				icon: smartBannerConfig.icon,
				type: type,
				inStore: inStore,
				install: install,
				link: link,
				show: true
			});
		}
	},

	hammerOptions: {
		touchAction: 'auto'
	},

	gestures: {
		tap: function (event: HammerEvent): void {
			var $target = this.$(event.target);

			if ($target.is('.sb-close')) {
				this.close();
			} else {
				this.view();
			}
		}
	},

	close: function () {
		this.set('show', false);
		this.setSmartBannerCookie(this.get('options.daysHiddenAfterClose'));

		//track.event('smart-banner', track.CLICK, {
		//	label: 'dismiss',
		//	method: 'both'
		//});
	},

	view: function () {
		this.set('show', false);
		this.setSmartBannerCookie(this.get('options.daysHiddenAfterView'));
		window.open(this.get('link'), '_blank');

		//track.event('smart-banner', track.CLICK, {
		//	label: 'app-store',
		//	method: 'both'
		//}, ev);
	},

	/**
	 * Sets sb-closed=1 cookie for given number of days
	 *
	 * @param {number} days
	 */
	setSmartBannerCookie: function (days: number) {
		var date: Date = new Date();
		date.setTime(date.getTime() + (days * this.get('day')));
		$.cookie('sb-closed', 1, {
			expires: date,
			path: '/'
		});
	}
});
