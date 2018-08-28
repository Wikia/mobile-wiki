import EmberObject, { get } from '@ember/object';
import { getOwner } from '@ember/application';
import extend from '../../utils/extend';

/**
 * get type for open graph, website is for main page even if API returns 'article'
 *
 * @param {bool} isMainPage
 * @param {string} type
 * @returns string
 */
function getType({ isMainPage, details: { type } }) {
  if (isMainPage) {
    return 'website';
  }
  return type;
}

export default EmberObject.extend({
  adsContext: null,
  basePath: null,
  categories: null,
  description: '',
  displayTitle: null,
  htmlTitle: '',
  id: null,
  ns: null,
  redirectEmptyTarget: false,
  title: null,
  url: null,
  user: null,
  wiki: null,
  isRandomPage: false,

  /**
	 * @param {Object} data
	 * @returns {void}
	 */
  setData({ data }) {
    let pageProperties;
    let article;

    if (data) {
      // This data should always be set
      pageProperties = {
        articleType: get(data, 'articleType'),
        categories: get(data, 'categories'),
        languageLinks: get(data, 'languageLinks'),
        description: get(data, 'details.description'),
        hasArticle: get(data, 'article.content.length') > 0,
        htmlTitle: get(data, 'htmlTitle'),
        id: get(data, 'details.id'),
        ns: get(data, 'ns'),
        title: get(data, 'details.title'),
        url: get(data, 'details.url'),
        type: getType(data),
      };

      // Article related Data - if Article exists
      if (data.article) {
        article = data.article;

        extend(pageProperties, {
          displayTitle: get(data, 'article.displayTitle'),
        });

        if (article.content && article.content.length > 0) {
          extend(pageProperties, {
            content: article.content,
            redirectEmptyTarget: data.redirectEmptyTarget,
          });
        }

        if (data.article.featuredVideo) {
          pageProperties.featuredVideo = data.article.featuredVideo;
        }
      }

      if (data.adsContext) {
        pageProperties.adsContext = data.adsContext;

        if (pageProperties.adsContext.targeting) {
          pageProperties.adsContext.targeting.mercuryPageCategories = pageProperties.categories;
        }
      }

      // Display title is used in header
      pageProperties.displayTitle = pageProperties.displayTitle || pageProperties.title;
    }

    this.setProperties(pageProperties);
  },
});
