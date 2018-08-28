import ArticleHandler from './article';

function getDynamicHeadTags(model) {
  const nextPageUrl = model.get('nextPageUrl');
  const prevPageUrl = model.get('prevPageUrl');
  const data = {};

  if (nextPageUrl) {
    data.next = nextPageUrl;
  }

  if (prevPageUrl) {
    data.prev = prevPageUrl;
  }

  return data;
}

/**
 * Export Category handler
 */
export default {
  // template's and controller's name
  viewName: 'category',
  controllerName: 'category',
  // hooks
  afterModel: ArticleHandler.afterModel,
  getDynamicHeadTags,
};
