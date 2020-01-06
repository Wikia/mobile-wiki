import EmberObject from '@ember/object';
import { or } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { inject as service } from '@ember/service';
import BaseModel from './base';
import { CategoryMembersFetchError } from '../../utils/errors';
import { normalizeToUnderscore } from '../../utils/string';

export default BaseModel.extend({
  wikiUrls: service(),
  fetch: service(),

  host: null,
  hasArticle: false,
  members: null,
  pagination: null,
  totalNumberOfMembers: 0,
  trendingPages: null,

  hasPagination: or('pagination.nextPageKey', 'pagination.prevPageKey'),

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
        title: normalizeToUnderscore(this.title),
        format: 'json',
      },
    };

    if (from !== null) {
      urlParams.query.categoryMembersFrom = from;
    }

    return this.fetch.fetchFromMediawiki(
      this.wikiUrls.build(urlParams),
      CategoryMembersFetchError,
    ).then(({ data }) => {
      if (isEmpty(data) || isEmpty(data.members)) {
        throw new Error('Unexpected response from server');
      }

      this.setProperties(this.sanitizeRawData(data));
    });
  },

  /**
   * @param {Object} data
   * @returns {void}
   */
  setData({ data }) {
    this._super(...arguments);

    if (data && data.nsSpecificContent) {
      this.setProperties(this.sanitizeRawData(data.nsSpecificContent));
    }
  },

  sanitizeRawData(rawData) {
    const members = [];
    const properties = {
      members,
      pagination: rawData.pagination,
    };

    Object.keys(rawData.members)
      .forEach((firstChar) => {
        const group = EmberObject.create({
          firstChar,
          members: rawData.members[firstChar],
          isCollapsed: false,
        });

        members.push(group);
      });

    // Two below are only returned from getPage resource
    if (rawData.totalNumberOfMembers) {
      properties.totalNumberOfMembers = rawData.totalNumberOfMembers;
    }

    if (rawData.trendingPages) {
      properties.trendingPages = rawData.trendingPages;
    }

    return properties;
  },
});
