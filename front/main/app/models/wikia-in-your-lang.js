import Ember from 'ember';
import LanguagesMixin from '../mixins/languages';
import localStorageAdapter from 'common/utils/localStorageAdapter';

const WikiaInYourLangModel = Ember.Object.extend(LanguagesMixin, {
	message: null,
	nativeDomain: null
});

WikiaInYourLangModel.reopenClass(LanguagesMixin, {
	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	load() {
		const browserLang = WikiaInYourLangModel.getBrowserLanguage(),
			model = WikiaInYourLangModel.getFromCache(browserLang);

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
					modelInstance = WikiaInYourLangModel.create({
						nativeDomain: resp.nativeDomain,
						message: resp.messageMobile
					});
				}

				// write to cache
				localStorageAdapter.setItem(
					WikiaInYourLangModel.getCacheKey(browserLang),
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
		const key = WikiaInYourLangModel.getCacheKey(browserLang),
			value = JSON.parse(localStorageAdapter.getItem(key)),
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

export default WikiaInYourLangModel;
