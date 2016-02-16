import Ember from 'ember';
import moment from 'moment';

export default Ember.Service.extend({
	isLoaded: false,
	isLoading: false,

	loadTranslation(lang = 'en') {
		this.set('isLoading', true);
		if (lang !== 'en') {
			Ember.$.getScript(M.buildUrl({path: `/front/common/locales/moment/${lang}.js`})).complete(() => {
				this.setProperties({
					isLoaded: true,
					isLoading: false
				});
			}).error(() => {
				Ember.Logger.error(`Can't get moment translation for ${lang}`);
			});
		} else {
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
				this.setProperties({
					isLoaded: true,
					isLoading: false
				});
			});
		}

	}
});
