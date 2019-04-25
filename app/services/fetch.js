import fetch from '@wikia/ember-fandom/services/fetch';
import { inject as service } from '@ember/service';

export default fetch.extend({
  runtimeConfig: service(),

  init() {
    this.config = {
      internalCache: this.runtimeConfig.internalCache,
      servicesExternalHost: this.runtimeConfig.servicesExternalHost,
      servicesInternalHost: this.runtimeConfig.servicesInternalHost,
    };

    this._super(...arguments);
  },

  // TODO: Consider moving this to ember-fandom
  fetchFromMediaWikiAuthenticated(requestUrl, accessToken, errorClass) {
    const options = this.getOptionsForInternalCache(requestUrl) || {};
    const internalRequestUrl = this.getUrlForInternalRequest(requestUrl);

    if (accessToken) {
      options.headers = Object.assign(options.headers || {}, { Cookie: `access_token=${accessToken}` });
    }

    return this.fetchAndParseResponse(internalRequestUrl, options, errorClass);
  },
});
