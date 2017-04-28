import Ember from 'ember';
import LanguagesMixin from '../mixins/languages';
import localStorageConnector from '../utils/local-storage-connector';
import fetch from '../utils/mediawiki-fetch';
import {buildUrl} from '../utils/url';

const {
	Object: EmberObject,
	RSVP
} = Ember;

/**
 * @param {string} lang
 * @returns {string}
 */
function getCacheKey(lang) {
	return `${lang}-WikiaInYourLang`;
}

/**
 * @param {string} browserLang
 * @returns {object}
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

export default EmberObject.extend(LanguagesMixin, {
	message: null,
	nativeDomain: null,

	/**
	 * @returns {Ember.RSVP.Promise}
	 */
	load() {
		const browserLang = this.getBrowserLanguage(),
			model = getFromCache(browserLang);

		if (model) {
			return RSVP.resolve(model);
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
				let out = null;

				if (resp.success) {
					out = {
						nativeDomain: resp.nativeDomain,
						message: resp.messageMobile
					};
				}

				// write to cache
				localStorageConnector.setItem(
					getCacheKey(browserLang),
					JSON.stringify({
						model: out,
						timestamp: new Date().getTime()
					})
				);

				return out;
			});
	},
});
