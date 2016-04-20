import Ember from 'ember';
import LanguagesMixin from '../mixins/languages';
import localStorageConnector from '../utils/local-storage-connector';
import request from 'ember-ajax/request';

/**
 * @param {string} lang
 * @returns {string}
 */
function getCacheKey(lang) {
	return `${lang}-WikiaInYourLang`;
}

/**
 * @param {string} browserLang
 * @returns {WikiaInYourLangModel}
 */
function getFromCache(browserLang) {
	const key = getCacheKey(browserLang),
		value = JSON.parse(localStorageConnector.getItem(key)),
		now = new Date().getTime();

	// we cache for 30 days (2592000000)
	if (!value || now - value.timestamp > 2592000000) {
		return null;
	}

	return value.model;
}

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
			model = getFromCache(browserLang);

		if (model) {
			return Ember.RSVP.resolve(model);
		}

		return request(
			M.buildUrl({path: '/wikia.php'}), {
				data: {
					controller: 'WikiaInYourLangController',
					method: 'getNativeWikiaInfo',
					format: 'json',
					targetLanguage: browserLang
				}
			})
			.then((resp) => {
				let modelInstance = null;

				if (resp.success) {
					modelInstance = WikiaInYourLangModel.create({
						nativeDomain: resp.nativeDomain,
						message: resp.messageMobile
					});
				}

				// write to cache
				localStorageConnector.setItem(
					getCacheKey(browserLang),
					JSON.stringify({
						model: modelInstance,
						timestamp: new Date().getTime()
					})
				);

				resolve(modelInstance);
			})
			.catch((err) => {
				reject(err);
			});
	},
});

export default WikiaInYourLangModel;
