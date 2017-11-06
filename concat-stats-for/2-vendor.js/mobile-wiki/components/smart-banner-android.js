define('mobile-wiki/components/smart-banner-android', ['exports', 'mobile-wiki/modules/thumbnailer', 'mobile-wiki/utils/track', 'mobile-wiki/utils/browser'], function (exports, _thumbnailer, _track2, _browser) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var oneWay = Ember.computed.oneWay;
	var reads = Ember.computed.reads;
	var not = Ember.computed.not;
	var $ = Ember.$;
	var Component = Ember.Component;
	var get = Ember.get;
	var computed = Ember.computed;
	var htmlSafe = Ember.String.htmlSafe;
	var run = Ember.run;
	exports.default = Component.extend({
		classNames: ['smart-banner-android'],
		classNameBindings: ['noIcon'],

		wikiVariables: service(),

		options: {
			// Language code for App Store
			appStoreLanguage: 'us',

			// Duration to hide the banner after close button is clicked (0 = always show banner)
			daysHiddenAfterClose: 15,

			// Duration to hide the banner after it is clicked (0 = always show banner)
			daysHiddenAfterView: 30
		},
		day: 86400000,

		appId: oneWay('config.appId.android'),
		appScheme: oneWay('config.appScheme.android'),
		config: computed('wikiVariables', function () {
			return this.get('wikiVariables').get('smartBanner') || {};
		}),
		dbName: reads('wikiVariables.dbName'),
		description: oneWay('config.description'),
		icon: oneWay('config.icon'),
		iconSize: 92,

		iconStyle: computed('icon', function () {
			if (this.get('noIcon')) {
				return null;
			}

			var icon = _thumbnailer.default.getThumbURL(this.get('icon'), {
				mode: _thumbnailer.default.mode.thumbnailDown,
				width: this.iconSize,
				height: this.iconSize
			});

			return htmlSafe('background-image: url(' + icon + ')');
		}),

		link: computed('appId', 'dbName', function () {
			return 'https://play.google.com/store/apps/details?id=' + this.get('appId') + ('&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner%26utm_term%3D' + this.get('dbName'));
		}),

		noIcon: not('icon'),
		title: oneWay('config.name'),

		actions: {
			/**
    * @returns {void}
    */
			close: function close() {
				this.setSmartBannerCookie(this.get('options.daysHiddenAfterClose'));
				this.sendAction('toggleVisibility', false);
				this.track(_track2.trackActions.close);
			},


			/**
    * @returns {void}
    */
			view: function view() {
				var appScheme = this.get('appScheme');

				this.setSmartBannerCookie(this.get('options.daysHiddenAfterView'));

				if (appScheme) {
					this.tryToOpenApp(appScheme);
				} else {
					window.open(this.get('link'), '_blank');
				}

				this.sendAction('toggleVisibility', false);
			}
		},

		/**
   * @param {MouseEvent} event
   * @returns {void}
   */
		click: function click(event) {
			var $target = this.$(event.target);

			if (!$target.is('.sb-close')) {
				this.send('view');
			}
		},


		/**
   * @returns {void}
   */
		willInsertElement: function willInsertElement() {
			// this HAVE TO be run while rendering, but it cannot be run on didInsert/willInsert
			// running this just after render is working too
			run.scheduleOnce('afterRender', this, this.checkForHiding);
		},


		/**
   * @returns {void}
   */
		checkForHiding: function checkForHiding() {
			var _get = this.get('config'),
			    name = _get.name,
			    disabled = _get.disabled;

			// Show custom smart banner only when a device is Android
			// website isn't loaded in app and user did not dismiss it already


			if (_browser.system === 'android' && !_browser.standalone && name && !disabled && $.cookie('sb-closed') !== '1') {
				this.sendAction('toggleVisibility', true);
				this.track(_track2.trackActions.impression);
			}
		},


		/**
   * Try to open app using custom scheme and if it fails go to fallback function
   *
   * @param {string} appScheme
   * @returns {void}
   */
		tryToOpenApp: function tryToOpenApp(appScheme) {
			this.track(_track2.trackActions.open);
			window.document.location.href = appScheme + '://';

			run.later(this, this.fallbackToStore, 300);
		},


		/**
   * Open app store
   *
   * @returns {void}
   */
		fallbackToStore: function fallbackToStore() {
			this.track(_track2.trackActions.install);
			window.open(this.get('link'), '_blank');
		},


		/**
   * Sets sb-closed=1 cookie for given number of days
   *
   * @param {number} days
   * @returns {void}
   */
		setSmartBannerCookie: function setSmartBannerCookie(days) {
			var date = new Date();

			date.setTime(date.getTime() + days * this.get('day'));
			$.cookie('sb-closed', 1, {
				expires: date,
				path: '/'
			});
		},


		/**
   * @param {string} action
   * @returns {void}
   */
		track: function track(action) {
			(0, _track2.track)({
				action: action,
				category: 'smart-banner',
				label: this.get('dbName')
			});
		}
	});
});