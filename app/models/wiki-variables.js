import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import fetch from 'fetch';
import {
  WikiVariablesRedirectError,
  WikiVariablesFetchError,
} from '../utils/errors';

export default EmberObject.extend({
  fastboot: service(),
  fetchService: service('fetch'),
  wikiUrls: service(),
  tracing: service(),

  load(protocol, host, accessToken) {
    const url = this.wikiUrls.build({
      host,
      forceNoSSLOnServerSide: true,
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getMobileWikiVariables',
        format: 'json',
      },
    });

    const options = this.fetchService.getOptionsForInternalCache(url);

    options.headers = {};

    if (accessToken) {
      options.headers = {
        Cookie: `access_token=${accessToken}`,
        'X-Trace-Id': this.tracing.getTraceId(),
      };
    }

    if (this.get('fastboot.isFastBoot')) {
      const requestHeaders = this.get('fastboot.request.headers');
      const stagingHeader = requestHeaders.get('X-Staging');

      if (stagingHeader) {
        options.headers['X-Staging'] = stagingHeader;
      }
    }
    return fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          return response.text().then(() => {
            throw new WikiVariablesFetchError({
              code: response.status || 503,
            }).withAdditionalData({
              host,
              url,
            });
          });
        }

        const contentType = response.headers.get('content-type');

        if (contentType && contentType.indexOf('application/json') !== -1) {
          return response.json();
        }
        if (url !== response.url) {
          // API was redirected to non-json page
          throw new WikiVariablesRedirectError().withAdditionalData({
            redirectLocation: response.url,
          });
        }
        // non-json API response
        return response.text().then(() => {
          throw new WikiVariablesFetchError({
            code: response.status || 503,
          }).withAdditionalData({
            host,
            url,
          });
        });
      }).then((response) => {
        if (!response.data.siteName) {
          response.data.siteName = 'FANDOM powered by Wikia';
        }

        response.data.host = host;

        // Make sure basePath is using https
        // if the current request from the client was made over https
        if (accessToken && response.data.basePath && protocol === 'https') {
          response.data.basePath = response.data.basePath.replace(/^http:\/\//, 'https://');
        }

        return response.data;
      })
      .catch((error) => {
        if (error.name === 'WikiVariablesRedirectError') {
          throw error;
        }

        throw new WikiVariablesFetchError({
          code: error.code || 503,
        }).withAdditionalData({
          host,
          url,
        }).withPreviousError(error);
      });
  },
});
