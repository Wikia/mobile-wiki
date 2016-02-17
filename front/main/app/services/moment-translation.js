import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
	isLoaded: false,
	lang,
	onLanguageChange: Ember.observer('Mercury.wiki.language.content', function () {
		this.lang = this.loadTranslation();
	}),

	changeLoadingStatus(done = true) {
		this.set('isLoaded', done);
	},
	extendEnTranslation() {
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
		Ember.run.next(() => {
			this.changeLoadingStatus();
		});
	},
	loadTranslation(lang = 'en') {
		this.changeLoadingStatus(false);
		if (lang !== 'en') {
			Ember.$.getScript(M.buildUrl({path: `/front/common/locales/moment/${lang}.js`})).complete(() => {
				this.changeLoadingStatus();
				return lang;
			}).error(() => {
				Ember.Logger.error(`Can't get moment translation for ${lang}`);
				this.extendEnTranslation();
				return 'en';
			});
		} else {
			this.extendEnTranslation();
			return lang;
		}
	},
	init() {
		this.lang = this.loadTranslation(Ember.get(Mercury, 'wiki.language.content'));
	}
});
