import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import BaseModel from './base';

export default BaseModel.extend({
  hasArticle: false,
  heroImage: null,
  fileUsageList: null,
  fileUsageListSeeMoreUrl: null,
  redirectTo: false,
  wikiUrls: service(),
  currentUser: service(),

  /**
  * @param {Object} data
  * @returns {void}
  */
  setData({ data }) {
    this._super(...arguments);
    let pageProperties;

    if (data) {
      const media = get(data, 'nsSpecificContent.media');

      // This data should always be set - no matter if file has an article or not
      pageProperties = {
        articleType: 'file',
        fileUsageList: get(data, 'nsSpecificContent.fileUsageList')
          .map(item => this.prepareFileUsageItem(item)),
        fileUsageListSeeMoreUrl: get(data, 'nsSpecificContent.fileUsageListSeeMoreUrl'),
        fileThumbnail: media,
      };
      if(!this.get('currentUser.isAuthenticated')){
	      pageProperties.ns = 'redirect';
	      pageProperties.redirectTo =  pageProperties.fileThumbnail.href;
      }
    }

    this.setProperties(pageProperties);
  },

  prepareFileUsageItem({ titleText: title, snippet, url }) {
    return {
      title,
      snippet,
      prefixedTitle: this.wikiUrls.getEncodedTitleFromURL(url),
    };
  },
});
