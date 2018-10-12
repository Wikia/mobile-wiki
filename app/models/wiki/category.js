import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import BaseModel from './base';
import fetch from '../../utils/mediawiki-fetch';

export default BaseModel.extend({
  wikiUrls: service(),
  runtimeConfig: service(),

  host: null,
  hasArticle: false,
  membersGrouped: null,
  nextPage: null,
  pages: null,
  prevPage: null,
  trendingArticles: null,


  /**
  * @param {number} page
  * @returns {Ember.RSVP.Promise}
  */
  loadPage(page) {
    return fetch(this.wikiUrls.build({
      host: this.host,
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getCategoryMembers',
        title: this.title,
        categoryMembersPage: page,
        format: 'json',
      },
    }), {
      internalCache: this.runtimeConfig.internalCache,
    })
      .then(response => response.json())
      .then(({ data }) => {
        if (isEmpty(data) || isEmpty(data.membersGrouped)) {
          throw new Error('Unexpected response from server');
        }

        this.setProperties(data);
      });
  },

  /**
  * @param {Object} data
  * @returns {void}
  */
  setData({ data }) {
    this._super(...arguments);

    if (data && data.nsSpecificContent) {
      this.setProperties(data.nsSpecificContent);
    }
  },
});
