import Ember from 'ember';

const {
	Mixin,
	String: {dasherize},
	computed,
	inject
} = Ember;

export default Mixin.create({
	wikiVariables: inject.service(),
	defaultLanguage: 'en',

	isJapaneseBrowser: computed('isJapaneseWikia', function () {
		let lang = navigator.language || navigator.browserLanguage;

		if (!lang) {
			return this.get('isJapaneseWikia');
		}

		lang = lang.substr(0, 2);

		return lang === 'ja';
	}),

	isJapaneseWikia: computed.equal('wikiVariables.language.content', 'ja'),

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
	getUselangParam() {
		const lang = this.get('wikiVariables.language.content');

		if (!lang || lang === 'en') {
			return '';
		}

		return `&uselang=${encodeURIComponent(lang)}`;
	}
});
