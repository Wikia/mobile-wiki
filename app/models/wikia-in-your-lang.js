import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { resolve } from 'rsvp';
import localStorageConnector from '@wikia/ember-fandom/utils/local-storage-connector';
import LanguagesMixin from '../mixins/languages';
import { WikiaInYourLangFetchError } from '../utils/errors';

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
  const key = getCacheKey(browserLang);
  const valueJson = localStorageConnector.getItem(key) || '{}';
  const value = JSON.parse(valueJson);
  const now = new Date().getTime();

  // we cache for 30 days (2592000000)
  if (!value.model || now - value.timestamp > 2592000000) {
    return null;
  }

  return value.model;
}

export default EmberObject.extend(LanguagesMixin, {
  wikiVariables: service(),
  wikiUrls: service(),
  fetch: service(),

  message: null,
  nativeDomain: null,

  /**
  * @returns {RSVP.Promise}
  */
  load() {
    const browserLang = this.getBrowserLanguage();
    const model = getFromCache(browserLang);

    if (model) {
      return resolve(model);
    }

    const url = this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
      path: '/wikia.php',
      query: {
        controller: 'WikiaInYourLangController',
        method: 'getNativeWikiaInfo',
        format: 'json',
        targetLanguage: browserLang,
      },
    });

    return this.fetch.fetchFromMediawiki(url, WikiaInYourLangFetchError)
      .then((resp) => {
        let out = null;

        if (resp.success) {
          out = {
            nativeDomain: resp.nativeDomain,
            message: resp.messageMobile,
          };
        }

        // write to cache
        localStorageConnector.setItem(
          getCacheKey(browserLang),
          JSON.stringify({
            model: out,
            timestamp: new Date().getTime(),
          }),
        );

        return out;
      });
  },
});
