import fetch from '@wikia/ember-fandom/services/fetch';
import { inject as service } from '@ember/service';

export default fetch.extend({
  runtimeConfig: service(),
  tracing: service(),

  init() {
    this.config = {
      internalCache: this.runtimeConfig.internalCache,
      servicesExternalHost: this.runtimeConfig.servicesExternalHost,
      servicesInternalHost: this.runtimeConfig.servicesInternalHost,
      wikiaEnv: this.runtimeConfig.wikiaEnv,
    };

    this._super(...arguments);
  },

  // TODO: Consider moving this to ember-fandom
  fetchFromMediaWikiAuthenticated(requestUrl, accessToken, errorClass) {
    const options = this.getOptionsForInternalCache(requestUrl);

    options.headers = {
      'X-Trace-Id': this.tracing.getTraceId(),
    };

    if (accessToken) {
      options.headers.Cookie = `access_token=${accessToken}`;
    }

    return this.fetchAndParseResponse(requestUrl, options, errorClass);
  },
});
