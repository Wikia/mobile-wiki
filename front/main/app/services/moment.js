import Ember from 'ember';
import moment from 'moment';
export default Ember.Service.extend({
	isLoaded: false,
	isLoading: false,

	loadTranslation(lang = 'en') {
		this.set('isLoading', true);
		Ember.$.getScript(M.buildUrl({path: `/front/main/assets/vendor/moment/locales/${lang}.js`})).complete(() => {
			this.set('isLoaded', true);
			this.set('isLoading', false);
		}).error(() => {
			Ember.Logger.error(`Can't get moment translation for ${lang}`);
		});
	}
});
