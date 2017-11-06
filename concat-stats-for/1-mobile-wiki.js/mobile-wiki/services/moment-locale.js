define('mobile-wiki/services/moment-locale', ['exports', 'moment'], function (exports, _moment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Service = Ember.Service;
	var service = Ember.inject.service;
	var $ = Ember.$;
	var run = Ember.run;
	exports.default = Service.extend({
		logger: service(),
		wikiVariables: service(),
		defaultLocation: 'en',
		enRelativeTime: {
			m: '1m',
			mm: '%dm',
			h: '1h',
			hh: '%dh',
			d: '1d',
			dd: '%dd'
		},
		isLoaded: false,
		isLoading: false,
		// Path to all supported locales, so they can be fingerprinted
		localePath: {
			de: '/mobile-wiki/moment/de.js',
			es: '/mobile-wiki/moment/es.js',
			fr: '/mobile-wiki/moment/fr.js',
			it: '/mobile-wiki/moment/it.js',
			ja: '/mobile-wiki/moment/ja.js',
			pl: '/mobile-wiki/moment/pl.js',
			'pt-br': '/mobile-wiki/moment/pt-br.js',
			ru: '/mobile-wiki/moment/ru.js',
			'zh-cn': '/mobile-wiki/moment/zh-cn.js',
			'zh-tw': '/mobile-wiki/moment/zh-tw.js'
		},
		/**
   * Changes status of downloading moment's locale to trigger helper's observers
   *
   * @param {boolean} done
   * @return {void}
   */
		changeLoadingStatus: function changeLoadingStatus() {
			var done = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			this.setProperties({
				isLoaded: done,
				isLoading: !done
			});
		},

		/**
   * Changes moment locale to en. It's loaded by default, so we don't need to download it
   *
   * @return {void}
   */
		setEnLocale: function setEnLocale() {
			var _this = this;

			_moment.default.locale('en');
			// Change status when moment finished changing locale
			run.next(function () {
				_this.changeLoadingStatus();
			});
		},

		/**
   * Downloads locale for moment if content language is not en, otherwise just changes to en
   *
   * @return {void}
   */
		loadLocale: function loadLocale() {
			var _this2 = this;

			if (!this.get('isLoading')) {
				var contentLang = this.get('wikiVariables.language.content'),
				    lang = this.localePath.hasOwnProperty(contentLang) ? contentLang : this.defaultLocation;

				this.changeLoadingStatus(false);
				if (lang === 'en') {
					this.setEnLocale();
				} else {
					$.getScript(this.localePath[lang]).done(function () {
						_this2.changeLoadingStatus();
					}).fail(function (jqxhr, settings, exception) {
						_this2.get('logger').error('Can\'t get moment translation for ' + lang, exception);
						_this2.setEnLocale();
					});
				}
			}
		},

		// Extends default en translation by needed relative time on init
		init: function init() {
			this._super();
			_moment.default.updateLocale('en', {
				relativeTime: this.enRelativeTime
			});
		}
	});
});