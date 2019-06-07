import fetch from '@wikia/ember-fandom/services/fetch';
import { inject as service } from '@ember/service';

export default fetch.extend({
  runtimeConfig: service(),
  tracing: service(),

  init() {
    this.config = {
      mwInternalHost: this.runtimeConfig.mwInternalHost,
      servicesExternalHost: this.runtimeConfig.servicesExternalHost,
      servicesInternalHost: this.runtimeConfig.servicesInternalHost,
    };

    this._super(...arguments);
  },

  // TODO: Consider moving this to ember-fandom
  fetchFromMediaWikiAuthenticated(requestUrl, accessToken, errorClass) {
    const options = this.getOptionsForInternalRequest(requestUrl) || {};
    const internalRequestUrl = this.getUrlForInternalRequest(requestUrl);

    options.headers = Object.assign(options.headers || {}, { 'X-Trace-Id': this.tracing.getTraceId() });

    if (accessToken) {
      options.headers.Cookie = `access_token=${accessToken}`;
    }

    return this.fetchAndParseResponse(internalRequestUrl, options, errorClass);
  },
});
