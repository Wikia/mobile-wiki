import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
	isLoaded: false,
	onLanguageChange: Ember.observer('Mercury.wiki.language.content', function () {
		this.loadTranslation(Ember.get(Mercury, 'wiki.language.content'));
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
			Ember.$.getScript(M.buildUrl({path: `/front/common/locales/moment/${lang}.js`})).done(() => {
				this.changeLoadingStatus();
			}).fail((jqxhr, settings, exception) => {
				Ember.Logger.error(`Can't get moment translation for ${lang} | ${exception}`);
				this.extendEnTranslation();
			});
		} else {
			this.extendEnTranslation();
		}
	},
	init() {
		this.loadTranslation(Ember.get(Mercury, 'wiki.language.content'));
	}
});
