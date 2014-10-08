/// <reference path="../app.ts" />
'use strict';

App.SmartBannerComponent = Em.Component.extend({
	classNames: ['smartbanner'],
	classNameBindings: ['noIcon', 'type', 'show'],
	noIcon: Em.computed.not('icon'),
	show: false,

	options: {
		// Language code for App Store
		appStoreLanguage: 'us',
		// Duration to hide the banner after being closed (0 = always show banner)
		daysHidden: 15,
		// Duration to hide the banner after "VIEW" is clicked *separate from when the close button is clicked* (0 = always show banner)
		daysReminder: 90
	},

	cookieData: {
		domain: window.location.hostname.replace(/^\w+/, ''),
		path: '/'
	},

	day: 86400000,

	style: function () {
		return "background-image: url(%@)".fmt(this.get('icon'));
	}.property('icon'),

	init: function () {
		var ua = window.navigator.userAgent,
			standalone = navigator.standalone, // Check if it's already a standalone web app or running within a webui view of an app (not mobile safari)
			wiki = Wikia.wiki || {},
			smartbanner = wiki.smartbanner || {},
			type: string,
			link: string,
			appId: string,
			inStore: string;

		// Detect banner type (iOS or Android)
		if (ua.match(/iPad|iPhone|iPod/i) !== null) {
			type = 'ios';
		} else if (ua.match(/Android/i) !== null) {
			type = 'android';
		}

		//Don't show banner if device isn't iOS or Android, website is loaded in app or user dismissed banner
		if (type &&
			!standalone &&
			smartbanner &&
			!smartbanner.disabled
			/* &&
			!cookie.get('sb-closed') &&
			!cookie.get('sb-installed')*/
		) {
			inStore = i18n.t('app:smartbanner-store-' + type);
			appId = Em.get(smartbanner, type + '.addId');

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
				title: smartbanner.name,
				icon: smartbanner.icon,
				type: type,
				gloss: (type === 'ios') ? 'gloss' : '',
				inStore: inStore,
				link: link,
				show: true
			});
		}
	},

	actions: {
		view: function () {
			console.log('view');
			this.set('show', false);

			//
			//cookie.set('sb-installed', 1, $.extend(cookieData, {
			//	expires: options.daysReminder * day
			//}));
			//
			//track.event('smart-banner', track.CLICK, {
			//	label: 'app-store',
			//	method: 'both'
			//}, ev);
		},

		close: function () {
			console.log('close');
			this.set('show', false);

			//cookie.set('sb-closed', 1, $.extend(cookieData, {
			//	expires: options.daysHidden * day
			//}));
			//
			//track.event('smart-banner', track.CLICK, {
			//	label: 'dismiss',
			//	method: 'both'
			//});
		}
	}
});
