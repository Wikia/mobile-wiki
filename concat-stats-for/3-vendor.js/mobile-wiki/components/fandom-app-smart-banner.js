define('mobile-wiki/components/fandom-app-smart-banner', ['exports', 'mobile-wiki/utils/track', 'mobile-wiki/utils/browser', 'mobile-wiki/config/environment'], function (exports, _track2, _browser, _environment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var $ = Ember.$,
	    Component = Ember.Component,
	    computed = Ember.computed,
	    inject = Ember.inject,
	    run = Ember.run;
	exports.default = Component.extend({
		classNames: ['fandom-app-smart-banner'],

		options: {
			// Duration to hide the banner after close button is clicked (0 = always show banner)
			daysHiddenAfterClose: 30,

			// Duration to hide the banner after it is clicked (0 = always show banner)
			daysHiddenAfterView: 90
		},
		dayInMiliseconds: 86400000,
		closeButtonSelector: '.fandom-app-smart-banner__close',

		i18n: inject.service(),

		link: computed(function () {
			return _browser.system === 'ios' ? 'https://itunes.apple.com/us/app/fandom-powered-by-wikia/id1230063803?ls=1&mt=8' : 'https://play.google.com/store/apps/details' + '?id=com.fandom.app&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner';
		}),

		storeName: computed(function () {
			return _browser.system === 'ios' ? this.get('i18n').t('fandom-app-banner.app-store') : this.get('i18n').t('fandom-app-banner.google-play');
		}),

		actions: {
			/**
    * @returns {void}
    */
			close: function close() {
				this.setSmartBannerCookie(this.get('options.daysHiddenAfterClose'));
				this.sendAction('toggleVisibility', false);
				this.track(_track2.trackActions.close);
			}
		},

		click: function click(event) {
			if (event.target === this.$(this.get('closeButtonSelector'))[0]) {
				return;
			}

			this.track(_track2.trackActions.install);
			this.sendAction('toggleVisibility', false);
			this.setSmartBannerCookie(this.get('options.daysHiddenAfterView'));
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
			if (!_browser.standalone && $.cookie('fandom-sb-closed') !== '1') {
				this.sendAction('toggleVisibility', true);
				this.track(_track2.trackActions.impression);
			}
		},


		/**
   * Sets fandom-sb-closed=1 cookie for given number of days
   *
   * @param {number} days
   * @returns {void}
   */
		setSmartBannerCookie: function setSmartBannerCookie(days) {
			var date = new Date();

			date.setTime(date.getTime() + days * this.get('dayInMiliseconds'));
			$.cookie('fandom-sb-closed', 1, {
				expires: date,
				path: '/',
				domain: _environment.default.cookieDomain
			});
		},


		/**
   * @param {string} action
   * @returns {void}
   */
		track: function track(action) {
			(0, _track2.track)({
				action: action,
				category: 'fandom-app-smart-banner',
				label: this.get('dbName')
			});
		}
	});
});