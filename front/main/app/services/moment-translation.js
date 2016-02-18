import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
	isLoaded: false,
	isLoading: false,
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
			Ember.$.getScript(M.buildUrl({path: `/front/common/locales/moment/${lang}.js`})).done(() => {
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
