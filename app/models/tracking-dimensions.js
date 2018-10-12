import { inject as service } from '@ember/service';
import EmberObject from '@ember/object';
import { TrackingDimensionsFetchError } from '../utils/errors';

export default EmberObject.extend({
  fastboot: service(),
  logger: service(),
  wikiUrls: service(),
  fetch: service(),

  fetchApi(isAnon, host, title) {
    const url = this.wikiUrls.build({
      host,
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getTrackingDimensions',
        title,
        isanon: isAnon,
        format: 'json',
      },
    });

    return this.fetch.fetchFromMediawiki(url, TrackingDimensionsFetchError)
      .catch(error => this.logger.error('getTrackingDimensions error: ', error));
  },
});
