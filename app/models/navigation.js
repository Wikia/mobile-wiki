import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import {
  getFetchErrorMessage,
  DesignSystemFetchError,
} from '../utils/errors';
import fetch from '../utils/mediawiki-fetch';

export default EmberObject.extend({
  wikiUrls: service(),
  fastboot: service(),
  runtimeConfig: service(),

  fetchAll(host, wikiId, language) {
    const url = this.wikiUrls.build({
      host,
      path: '/wikia.php',
      query: {
        controller: 'DesignSystemApi',
        method: 'getAllElements',
        product: 'wikis',
        id: wikiId,
        lang: language,
        version: 2,
      },
    });

    return fetch(url, {
      headers: {
        Cookie: `access_token=${this.get('fastboot.request.cookies.access_token')}`,
      },
      internalCache: this.runtimeConfig.internalCache,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return getFetchErrorMessage(response).then(() => {
          throw new DesignSystemFetchError({
            code: 503,
          }).withAdditionalData({
            responseStatus: response.status,
            requestUrl: url,
            responseUrl: response.url,
          });
        });
      })
      .then(navigationData => (
        {
          globalFooter: navigationData['global-footer'],
          globalNavigation: navigationData['global-navigation'],
          communityHeader: navigationData['community-header'],
        }
      ));
  },
});
