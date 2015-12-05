import App from '../app';
import LanguagesMixin from '../mixins/languages';

export default App.WikiaInYourLangModel = Ember.Object.extend(
	LanguagesMixin,
	{
		message: null,
		nativeDomain: null
	}
);

App.WikiaInYourLangModel.reopenClass({
	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	load() {
		const browserLang = this.get('getLanguage'),
			model = App.WikiaInYourLangModel.getFromCache(browserLang);

		return new Ember.RSVP.Promise((resolve, reject) => {
			if (model) {
				resolve(model);
				return;
			}

			Ember.$.getJSON(
				M.buildUrl({path: '/wikia.php'}),
				{
					controller: 'WikiaInYourLangController',
					method: 'getNativeWikiaInfo',
					format: 'json',
					targetLanguage: browserLang
				}
			).done((resp) => {
				let modelInstance = null;

				if (resp.success) {
					modelInstance = App.WikiaInYourLangModel.create({
						nativeDomain: resp.nativeDomain,
						message: resp.messageMobile
					});
				}

				// write to cache
				window.localStorage.setItem(
					App.WikiaInYourLangModel.getCacheKey(browserLang),
					JSON.stringify({
						model: modelInstance,
						timestamp: new Date().getTime()
					})
				);

				resolve(modelInstance);
			}).fail((err) => {
				reject(err);
			});
		});
	},

	/**
	 * @param {string} browserLang
	 * @returns {WikiaInYourLangModel}
	 */
	getFromCache(browserLang) {
		const key = App.WikiaInYourLangModel.getCacheKey(browserLang),
			value = JSON.parse(window.localStorage.getItem(key)),
			now = new Date().getTime();

		// we cache for 30 days (2592000000)
		if (!value || now - value.timestamp > 2592000000) {
			return null;
		}

		return value.model;
	},

	/**
	 * @param {string} lang
	 * @returns {string}
	 */
	getCacheKey(lang) {
		return `${lang}-WikiaInYourLang`;
	}
});
