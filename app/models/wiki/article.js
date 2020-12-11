import BaseModel from './base';

export default BaseModel.extend({
  comments: 0,
  content: null,
  curatedMainPageData: null,
  featuredVideo: null,
  hasPortableInfobox: false,
  isCuratedMainPage: false,
  isMainPage: false,
  user: null,
  heroImage: null,
  canShowComments: false,

  /**
  * @param {Object} data
  * @returns {void}
  */
  setData({ data }) {
    this._super(...arguments);

    let articleProperties = {};
    let details;

    if (data) {
      if (data.details) {
        details = data.details;

        articleProperties = {
          comments: details.comments,
          details,
        };
      }

      if (data.article) {
        articleProperties.content = data.article.content;

        if (data.article.hasPortableInfobox) {
          articleProperties.hasPortableInfobox = data.article.hasPortableInfobox;
        }

        if (data.article.adsContext && data.article.adsContext.opts.enableTopLeaderboardGap) {
          articleProperties.enableTopLeaderboardGap = data.article.enableTopLeaderboardGap;
        }

        if (data.article.heroImage) {
          articleProperties.heroImage = data.article.heroImage;
        }
      }

      if (data.topContributors) {
        // Same issue: the response to the ajax should always be valid and not undefined
        articleProperties.topContributors = data.topContributors;
      }

      articleProperties.isMainPage = data.isMainPage || false;
      articleProperties.amphtml = data.amphtml;
      articleProperties.isUcp = data.isUcp;
      articleProperties.canShowComments = data.canShowComments || false;

      if (data.curatedMainPageData) {
        articleProperties.curatedMainPageData = data.curatedMainPageData;
        articleProperties.isCuratedMainPage = true;
      }
    }

    this.setProperties(articleProperties);
  },
});
