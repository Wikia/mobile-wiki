import Ember from 'ember';

export default Ember.Service.extend({
	isLoaded: false,
	isLoading: false,

	loadTranslation(lang = 'en') {
		this.set('isLoading', true);
		if (lang !== 'en') {
			Ember.$.getScript(M.buildUrl({path: `/front/common/locales/moment/${lang}.js`})).complete(() => {
				this.set('isLoaded', true);
				this.set('isLoading', false);
			}).error(() => {
				Ember.Logger.error(`Can't get moment translation for ${lang}`);
			});
		}
		else {
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
	}
});
