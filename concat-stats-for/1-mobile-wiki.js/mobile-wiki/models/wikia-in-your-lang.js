define('mobile-wiki/models/wikia-in-your-lang', ['exports', 'mobile-wiki/mixins/languages', 'mobile-wiki/utils/local-storage-connector', 'mobile-wiki/utils/mediawiki-fetch', 'mobile-wiki/utils/url'], function (exports, _languages, _localStorageConnector, _mediawikiFetch, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var EmberObject = Ember.Object;
	var resolve = Ember.RSVP.resolve;


	/**
  * @param {string} lang
  * @returns {string}
  */
	function getCacheKey(lang) {
		return lang + '-WikiaInYourLang';
	}

	/**
  * @param {string} browserLang
  * @returns {object}
  */
	function getFromCache(browserLang) {
		var key = getCacheKey(browserLang),
		    value = JSON.parse(_localStorageConnector.default.getItem(key)),
		    now = new Date().getTime();

		// we cache for 30 days (2592000000)
		if (!value || now - value.timestamp > 2592000000) {
			return null;
		}

		return value.model;
	}

	exports.default = EmberObject.extend(_languages.default, {
		wikiVariables: service(),

		message: null,
		nativeDomain: null,

		/**
   * @returns {RSVP.Promise}
   */
		load: function load() {
			var browserLang = this.getBrowserLanguage(),
			    model = getFromCache(browserLang);

			if (model) {
				return resolve(model);
			}

			return (0, _mediawikiFetch.default)((0, _url.buildUrl)({
				host: this.get('wikiVariables.host'),
				path: '/wikia.php',
				query: {
					controller: 'WikiaInYourLangController',
					method: 'getNativeWikiaInfo',
					format: 'json',
					targetLanguage: browserLang
				}
			})).then(function (response) {
				return response.json();
			}).then(function (resp) {
				var out = null;

				if (resp.success) {
					out = {
						nativeDomain: resp.nativeDomain,
						message: resp.messageMobile
					};
				}

				// write to cache
				_localStorageConnector.default.setItem(getCacheKey(browserLang), JSON.stringify({
					model: out,
					timestamp: new Date().getTime()
				}));

				return out;
			});
		}
	});
});