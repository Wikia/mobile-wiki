import Ember from 'ember';
import LanguagesMixin from '../mixins/languages';
import localStorageConnector from '../utils/local-storage-connector';
import fetch from '../utils/wikia-fetch';
import {buildUrl} from '../utils/url';

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

		return fetch(
			buildUrl({
				path: '/wikia.php',
				query: {
					controller: 'WikiaInYourLangController',
					method: 'getNativeWikiaInfo',
					format: 'json',
					targetLanguage: browserLang
				}
			}))
			.then((response) => response.json())
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

				return modelInstance;
			});
	},
});

export default WikiaInYourLangModel;
