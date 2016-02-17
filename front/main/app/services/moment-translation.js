import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
	isLoaded: false,
	isLoading: false,
	lang: Ember.get(Mercury, 'wiki.language.content') || 'en',

	changeLoadingStatus(done = true) {
		this.setProperties({
			isLoaded: done,
			isLoading: !done
		});
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
			}).error(() => {
				Ember.Logger.error(`Can't get moment translation for ${lang}`);
				this.extendEnTranslation();
			});
		} else {
			this.extendEnTranslation();
		}
	},
	init() {
		this.loadTranslation(this.lang);
	}
});
