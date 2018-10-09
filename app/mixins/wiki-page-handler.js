import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import EmberObject, { get } from '@ember/object';
import { getOwner } from '@ember/application';
// import { Promise, resolve } from 'rsvp';
import ArticleModel from '../models/wiki/article';
import BlogModel from '../models/wiki/blog';
import CategoryModel from '../models/wiki/category';
import FileModel from '../models/wiki/file';
import SpecialRandom from '../models/wiki/special-random';
import {
  namespace as MediawikiNamespace,
  isContentNamespace,
} from '../utils/mediawiki-namespace';
import fetch from '../utils/mediawiki-fetch';
import {
  getFetchErrorMessage,
  WikiPageFetchError,
} from '../utils/errors';
import extend from '../utils/extend';

/**
 *
 * @param {Object} wikiUrls
 * @param {Object} params
 * @returns {string}
 */
function getNamespaceNumber(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function dataForShoeBox(data, shoebox) {
  const dataForShoebox = extend({}, data);

  if (dataForShoebox.data && dataForShoebox.data.article) {
    // Remove article content so it's not duplicated in shoebox and HTML
    delete dataForShoebox.data.article.content;
  }

  shoebox.put('wikiPage', dataForShoebox);
  shoebox.put('trackingData', {
    articleId: get(dataForShoebox, 'data.details.id'),
    namespace: get(dataForShoebox, 'data.ns'),
  });
}

function getURL(wikiUrls, params) {
  const query = {
    controller: 'MercuryApi',
    method: 'getPage',
    title: params.title,
  };

  if (params.redirect) {
    query.redirect = params.redirect;
  }

  if (params.noads) {
    query.noads = params.noads;
  }

  if (params.noexternals) {
    query.noexternals = params.noexternals;
  }

  if (params.page) {
    query.categoryMembersPage = params.page;
  }

  // this is pseudo-versioning query param for collapsible sections (XW-4393)
  // should be removed after all App caches are invalidated
  query.collapsibleSections = 1;

  return wikiUrls.build({
    host: params.host,
    path: '/wikia.php',
    query,
  });
}

export default Mixin.create({
  fastboot: service(),
  wikiVariables: service(),
  simpleStore: service(),
  wikiUrls: service(),
  articleStates: service(),

  getPageModel(params) {
    const isFastBoot = this.get('fastboot.isFastBoot');
    const shoebox = this.get('fastboot.shoebox');
    const contentNamespaces = this.get('wikiVariables.contentNamespaces');
    const isInitialPageView = this.initialPageView.isInitialPageView();

    /* eslint no-else-return: 0 */
    if (isFastBoot || !isInitialPageView) {
      params.noads = this.get('fastboot.request.queryParams.noads');
      params.noexternals = this.get('fastboot.request.queryParams.noexternals');
      const url = getURL(this.wikiUrls, params);
      if (isFastBoot) {
        return fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            return getFetchErrorMessage(response).then(() => {
              throw new WikiPageFetchError({
                code: response.status || 503,
              }).withAdditionalData({
                requestUrl: url,
                responseUrl: response.url,
              });
            });
          })
          .then((data) => {
            if (isFastBoot) {
              dataForShoeBox(data, shoebox);
            }
            return this.getModelForNamespace(data, params, contentNamespaces);
          })
          .catch((error) => {
            if (isFastBoot) {
              shoebox.put('wikiPageError', error);
              this.fastboot.set('response.statusCode', error.code || 503);
            }

            throw error;
          });
      } else {
        this.get('articleStates').articleLoading();
        this.get('articleStates').spinnerOn();
        this.get('articleStates').hideEmptyLabel();

        let temporaryTitle = params.title.replace(/_/g, ' ');
        const IfColonExist = /:/.test(temporaryTitle);
        let namespaceNumber = 0;

        if (IfColonExist) {
          const textBeforeColon = new RegExp('^.*(?=(:))');
          const categoryFromParams = params.title.match(textBeforeColon)[0];
          namespaceNumber = getNamespaceNumber(
            this.wikiVariables.namespaces,
            categoryFromParams,
          );
          temporaryTitle = temporaryTitle.split(':').pop();
        }

        const model = this.getModelForNamespace({
          data: {
            ns: Number(namespaceNumber),
            htmlTitle: temporaryTitle,
            details: {
              title: temporaryTitle,
              ns: Number(namespaceNumber),
              type: '',
            },
            article: {
              content: '<aside></aside>',
            },
            nsSpecificContent: '',
          },
        }, params, contentNamespaces);

        fetch(url)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            return getFetchErrorMessage(response).then(() => {
              throw new WikiPageFetchError({
                code: response.status || 503,
              }).withAdditionalData({
                requestUrl: url,
                responseUrl: response.url,
              });
            });
          })
          .then((data) => {
            if (isFastBoot) {
              dataForShoeBox(data, shoebox);
            }
            model.setData(data);
            this.get('articleStates').articleDidLoad();
            this.get('articleStates').spinnerOff();
            this.get('articleStates').showEmptyLabel();
          })
          .catch((error) => {
            if (isFastBoot) {
              shoebox.put('wikiPageError', error);
              this.fastboot.set('response.statusCode', error.code || 503);
            }

            throw error;
          });
        return model;
        /*
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(model);
          }, 300);
        });
        */
      }
    }

    const wikiPageData = shoebox.retrieve('wikiPage');
    const wikiPageError = shoebox.retrieve('wikiPageError');

    // There is no way to remove stuff from shoebox, so ignore it on the consecutive page views
    if (wikiPageError && isInitialPageView) {
      throw wikiPageError;
    }

    if (get(wikiPageData, 'data.article')) {
      wikiPageData.data.article.content = document.querySelector('.article-content').innerHTML;
    }

    return this.getModelForNamespace(wikiPageData, params, contentNamespaces);
  },

  /**
   *
   * @param {Object} data
   * @param {Object} params
   * @param {Array} contentNamespaces
   * @returns {Object}
   */
  getModelForNamespace(data, params, contentNamespaces) {
    const currentNamespace = data.data.ns;
    const ownerInjection = getOwner(this).ownerInjection();
    let model;

    // Main pages can live in namespaces which are not marked as content
    if (isContentNamespace(currentNamespace, contentNamespaces) || data.data.isMainPage) {
      model = ArticleModel.create(ownerInjection, params);
      model.setData(data);

      return model;
    }
    if (currentNamespace === MediawikiNamespace.CATEGORY) {
      model = CategoryModel.create(ownerInjection, params);
      model.setData(data);

      return model;
    }
    if (currentNamespace === MediawikiNamespace.FILE) {
      model = FileModel.create(ownerInjection, params);
      model.setData(data);

      return model;
    }
    if (
      currentNamespace === MediawikiNamespace.BLOG_ARTICLE
      // User blog listing has BLOG_ARTICLE namespace but no article
      && data.data.article
    ) {
      model = BlogModel.create(ownerInjection, params);
      model.setData(data);

      return model;
    }
    if (currentNamespace === MediawikiNamespace.SPECIAL && data.data.isSpecialRandom) {
      model = SpecialRandom.create(ownerInjection);

      return model.getArticleRandomTitle();
    }
    return EmberObject.create({
      redirectTo: data.data.redirectTo || null,
    });
  },
});
