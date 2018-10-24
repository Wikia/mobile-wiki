import { or } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import BaseModel from './base';
import { CategoryMembersFetchError } from '../../utils/errors';

export default BaseModel.extend({
  wikiUrls: service(),
  fetch: service(),

  firstPageUrl: null,
  host: null,
  hasArticle: false,
  isPrevPageTheFirstPage: false,
  lastPageKey: null,
  lastPageUrl: null,
  membersGrouped: null,
  nextPageKey: null,
  nextPageUrl: null,
  prevPageKey: null,
  prevPageUrl: null,
  trendingArticles: null,

  hasPagination: or('nextPageKey', 'prevPageKey'),

  /**
   * @param {number} from
   * @returns {Ember.RSVP.Promise}
   */
  loadFrom(from) {
    const urlParams = {
      host: this.host,
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getCategoryMembers',
        title: this.title,
        format: 'json',
      },
    };

    if (from !== null) {
      urlParams.query.categoryMembersPage = from;
    }

    return this.fetch.fetchFromMediawiki(
      this.wikiUrls.build(urlParams),
      CategoryMembersFetchError,
    ).then(({ data }) => {
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
