define('mobile-wiki/mixins/languages', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var equal = Ember.computed.equal;
	var Mixin = Ember.Mixin;
	var dasherize = Ember.String.dasherize;
	var computed = Ember.computed;
	exports.default = Mixin.create({
		wikiVariables: service(),
		defaultLanguage: 'en',

		isJapaneseBrowser: computed('isJapaneseWikia', function () {
			var lang = navigator.language || navigator.browserLanguage;

			if (!lang) {
				return this.get('isJapaneseWikia');
			}

			lang = lang.substr(0, 2);

			return lang === 'ja';
		}),

		isJapaneseWikia: equal('wikiVariables.language.content', 'ja'),

		/**
   * Returns navigator language with fallback to a default language
   * defined at the top of this object
   * @returns {string}
   */
		getBrowserLanguage: function getBrowserLanguage() {
			var lang = navigator.language || navigator.browserLanguage;

			if (!lang) {
				return this.get('defaultLanguage');
			} else {
				lang = dasherize(lang);

				// pt-br is the only one supported share-feature language with dash and 5 characters
				if (lang !== 'pt-br') {
					lang = lang.split('-')[0];
				}

				return lang;
			}
		},


		/**
   * Creates an escaped uselang querystring param
   * @returns {string}
   */
		getUselangParam: function getUselangParam() {
			var lang = this.get('wikiVariables.language.content');

			if (!lang || lang === 'en') {
				return '';
			}

			return '&uselang=' + encodeURIComponent(lang);
		}
	});
});