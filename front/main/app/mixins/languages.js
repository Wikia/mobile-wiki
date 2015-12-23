import Ember from 'ember';

export default Ember.Mixin.create({
	currentUser: Ember.inject.service(),

	defaultLanguage: 'en',

	isJapaneseBrowser: Ember.computed(function () {
		let lang = navigator.language || navigator.browserLanguage;

		if (!lang) {
			return this.get('isJapaneseWikia');
		}

		lang = lang.substr(0, 2);

		return lang === 'ja';
	}),

	isJapaneseWikia: Ember.computed(() => Ember.get(Mercury, 'wiki.language.content') === 'ja'),

	/**
	 * Returns navigator language with fallback to a default language
	 * defined at the top of this object
	 * @returns {string}
	 */
	getBrowserLanguage() {
		let lang = navigator.language || navigator.browserLanguage;

		if (!lang) {
			return this.get('defaultLanguage');
		} else {
			lang = lang.dasherize();

			// pt-br is the only one supported share-feature language with dash and 5 characters
			if (lang !== 'pt-br') {
				lang = lang.split('-')[0];
			}

			return lang;
		}
	},

	/**
	 * Obtains a localized language (browser lang for anons,
	 * user lang for logged-in users)
	 * @returns {string}
	 */
	getLanguage() {
		if (this.get('currentUser', 'isAuthenticated')) {
			return this.get('currentUser', 'language');
		} else {
			return this.getBrowserLanguage();
		}
	},

	/**
	 * Creates an escaped uselang querystring param
	 * @returns {string}
	 */
	getUselangParam() {
		const lang = Ember.get(Mercury, 'wiki.language.content');

		if (!lang || lang === 'en') {
			return '';
		}

		return `&uselang=${encodeURIComponent(lang)}`;
	}
});
