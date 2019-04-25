import { inject as service } from '@ember/service';
import fetch from 'fetch';
import BaseModel from './base';
import { namespace as mediawikiNamespace } from '../../utils/mediawiki-namespace';

export default BaseModel.extend({
  isRandomPage: true,
  ns: mediawikiNamespace.SPECIAL,
  wikiUrls: service(),
  wikiVariables: service(),
  fetchService: service('fetch'),

  /**
  * @returns {RSVP.Promise}
  */
  getArticleRandomTitle() {
    const url = this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
      forceNoSSLOnServerSide: true,
      path: '/api.php',
      query: {
        action: 'query',
        generator: 'random',
        grnnamespace: 0,
        format: 'json',
      },
    });
    const options = this.fetchService.getOptionsForInternalRequest(url);
    const reqUrl = this.fetchService.getUrlForInternalRequest(url);

    return fetch(reqUrl, Object.assign(options, {
      cache: 'no-store',
    }))
      .then(response => response.json())
      .then((data) => {
        if (data.query && data.query.pages) {
          const articleId = Object.keys(data.query.pages)[0];
          const pageData = data.query.pages[articleId];

          if (pageData.title) {
            this.set('title', pageData.title);

            return this;
          }
        }

        throw new Error({
          message: 'Data from server misshaped',
          data,
        });
      });
  },
});
