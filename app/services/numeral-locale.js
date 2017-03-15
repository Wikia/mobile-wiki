import Ember from 'ember';

export default Ember.Service.extend({
	currentUser: Ember.inject.service(),
	defaultLanguage: 'en',
	isLoaded: false,
	isLoading: false,
	// Path to all supported locales, so they can be fingerprinted
	localePath: {
		de: '/front/vendor/assets/numeral/de.js',
		es: '/front/vendor/assets/numeral/es.js',
		fr: '/front/vendor/assets/numeral/fr.js',
		it: '/front/vendor/assets/numeral/it.js',
		ja: '/front/vendor/assets/numeral/ja.js',
		pl: '/front/vendor/assets/numeral/pl.js',
		'pt-br': '/front/vendor/assets/numeral/pt-br.js',
		ru: '/front/vendor/assets/numeral/ru.js',
		'zh-cn': '/front/vendor/assets/numeral/zh-cn.js',
		'zh-tw': '/front/vendor/assets/numeral/zh-tw.js'
	},
	/**
	 * Changes status of downloading numeral's locale to trigger helper's observers
	 *
	 * @param {boolean} done
	 * @return {void}
	 */
	changeLoadingStatus(done = true) {
		this.setProperties({
			isLoaded: done,
			isLoading: !done
		});
	},
	/**
	 * Changes numeral locale. By default it's English which is always preloaded.
	 *
	 * @param {string} [locale='en']
	 * @return {void}
	 */
	setLocale(locale = 'en') {
		numeral.language(locale);
		this.changeLoadingStatus();
	},
	/**
	 * Downloads locale for numeral if content language is not en, otherwise just changes to en
	 *
	 * @return {void}
	 */
	loadLocale() {
		if (!this.get('isLoading')) {
			const contentLanguage = Ember.get(Mercury, 'wiki.language.content'),
				lang = this.localePath.hasOwnProperty(contentLanguage) ? contentLanguage : this.defaultLanguage;

			this.changeLoadingStatus(false);
			if (lang === 'en') {
				this.setLocale();
			} else {
				Ember.$.getScript(this.localePath[lang]).done(() => {
					this.setLocale(lang);
				}).fail((jqxhr, settings, exception) => {
					Ember.Logger.error(`Can't get numeral translation for ${lang} | ${exception}`);
					this.setLocale();
				});
			}
		}
	}
});
