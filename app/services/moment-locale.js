import Ember from 'ember';
import moment from 'moment';

const {Service, $, inject, run} = Ember;

export default Service.extend({
	logger: inject.service(),
	wikiVariables: inject.service(),
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
	changeLoadingStatus(done = true) {
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
	setEnLocale() {
		moment.locale('en');
		// Change status when moment finished changing locale
		run.next(() => {
			this.changeLoadingStatus();
		});
	},
	/**
	 * Downloads locale for moment if content language is not en, otherwise just changes to en
	 *
	 * @return {void}
	 */
	loadLocale() {
		if (!this.get('isLoading')) {
			const contentLang = this.get('wikiVariables.language.content'),
				lang = this.localePath.hasOwnProperty(contentLang) ? contentLang : this.defaultLocation;

			this.changeLoadingStatus(false);
			if (lang === 'en') {
				this.setEnLocale();
			} else {
				$.getScript(this.localePath[lang]).done(() => {
					this.changeLoadingStatus();
				}).fail((jqxhr, settings, exception) => {
					this.get('logger').error(`Can't get moment translation for ${lang}`, exception);
					this.setEnLocale();
				});
			}
		}
	},
	// Extends default en translation by needed relative time on init
	init() {
		this._super();
		moment.locale('en', {
			relativeTime: this.enRelativeTime
		});
	}
});
