import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { DesignSystemFetchError } from '../utils/errors';

export default EmberObject.extend({
  wikiUrls: service(),
  fastboot: service(),
  fetch: service(),

  fetchAll(host, wikiId, language) {
    const url = this.wikiUrls.build({
      host,
      forceNoSSLOnServerSide: true,
      path: '/wikia.php',
      query: {
        controller: 'DesignSystemApi',
        method: 'getAllElements',
        product: 'wikis',
        id: wikiId,
        lang: language,
        version: 2,
        footer_version: 2,
      },
    });

    return this.fetch
      .fetchFromMediaWikiAuthenticated(url, this.get('fastboot.request.cookies.access_token'), DesignSystemFetchError)
      .then(navigationData => (
        {
          globalFooter: navigationData['global-footer'],
          globalNavigation: navigationData['global-navigation'],
          communityHeader: navigationData['community-header'],
        }
      ));
  },
});
