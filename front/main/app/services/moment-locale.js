import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
	isLoaded: false,
	isLoading: false,
	localePath: {
		de: '/front/main/moment/de.js',
		es: '/front/main/moment/es.js',
		fr: '/front/main/moment/fr.js',
		it: '/front/main/moment/it.js',
		ja: '/front/main/moment/ja.js',
		pl: '/front/main/moment/pl.js',
		'pt-br': '/front/main/moment/pt-br.js',
		ru: '/front/main/moment/ru.js',
		'zh-cn': '/front/main/moment/zh-cn.js',
		'zh-tw': '/front/main/moment/zh-tw.js'
	},
	onLanguageChange: Ember.observer('Mercury.wiki.language.content', function () {
		this.loadTranslation();
	}),

	changeLoadingStatus(done = true) {
		this.setProperties({
			isLoaded: done,
			isLoading: !done
		});
	},
	setEnTranslation() {
		moment.locale('en');
		Ember.run.next(() => {
			this.changeLoadingStatus();
		});
	},
	loadTranslation() {
		const lang = Ember.get(Mercury, 'wiki.language.content') || 'en';

		this.changeLoadingStatus(false);
		if (lang !== 'en') {
			Ember.$.getScript(M.buildUrl({path: this.localePath[lang]})).done(() => {
				this.changeLoadingStatus();
			}).fail((jqxhr, settings, exception) => {
				Ember.Logger.error(`Can't get moment translation for ${lang} | ${exception}`);
				this.setEnTranslation();
			});
		} else {
			this.setEnTranslation();
		}
	},
	init() {
		this._super();
		moment.locale('en', {
			relativeTime: {
				m: '1 m',
				mm: '%d m',
				h: '1 h',
				hh: '%d h',
				d: '1 d',
				dd: '%d d'
			}
		});
	}
});
