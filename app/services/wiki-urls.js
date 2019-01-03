import wikiUrls from '@wikia/ember-fandom/services/wiki-urls';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default wikiUrls.extend({
  wikiVariables: service(),
  runtimeConfig: service(),

  init() {
    this.config = {
      baseDomain: this.runtimeConfig.baseDomain,
    };

    this._super(...arguments);
  },

  /**
  * @typedef {Object} LinkInfo
  * @property {string|null} article
  * @property {string|null} url
  * @property {string|null} [hash]
  */

  /**
  * Parse links in an article and return information about how to process a given link.
  * Only one of article or url will be non-null. If article is
  * non-null, then the application should transition to that article.
  * If url is non-null, then the application should
  * go to the link directly. NOTE: url might be a jumplink. Do with that what you will.
  *
  * @param {string} currentTitle - the title of the current article, such as David_Michael_Vigil
  * @param {string} hash - jumplink, either '#something'
  * (to indicate there is a jumplink) or '' or undefined
  * @param {string} uri - the absolute link
  * @param {string} queryString - the query string
  *
  * @returns {LinkInfo}
  */
  getLinkInfo(currentTitle, hash, uri, queryString) {
    const basePath = this.get('wikiVariables.basePath');
    const localPathMatch = uri.match(`^${basePath}(?:${this.langPath})(.*)$`);

    // We treat local URLs with query params that aren't handled elsewhere
    // as external links rather than as articles
    if (localPathMatch && !queryString) {
      const local = localPathMatch[1];

      /**
    * Here we test if its an article link.
    * We also have to check for /wiki/something for the jump links,
    * because the url will be in that form and there will be a hash
    *
    * @todo We currently don't handle links to other pages with jump links appended. If input is a
    * link to another page,
    * we'll simply transition to the top of that page regardless of whether or not
    * there is a #jumplink appended to it.
    *
    * Example match array for /wiki/Kermit_the_Frog#Kermit_on_Sesame_Street
    *     0: "/wiki/Kermit_the_Frog#Kermit on Sesame Street"
    *     1: "Kermit_the_Frog"
    *     2: "#Kermit_on_Sesame_Street"
    */
      const article = local.match(new RegExp('^(?:/wiki)/([^#]+)(#.*)?$'));

      let comparison;

      if (article) {
        try {
          comparison = decodeURIComponent(article[1]);
        } catch (e) {
          comparison = article[1];
        }

        if (comparison === currentTitle && hash) {
          return {
            article: null,
            url: hash,
          };
        }

        return {
          article: article[1],
          url: null,
          hash: article[2] ? hash : null,
        };
      }
    }

    return {
      article: null,
      url: uri,
    };
  },

  /**
  * Extracts the page title from a URL by stripping the host and article path.
  *
  * @param  {string} url - URL from which to extract the title
  * @return {string}
  */
  getEncodedTitleFromURL(url) {
    return url ? url.replace(new RegExp(`^(https?://[^/]+)?${this.langPathRegexp}?(/wiki)?/`), '') : '';
  },

  /**
  * Opens the login page preserving current page as a redirect
  * and adding a language code to the querystring
  * @returns {void}
  */
  goToLogin(redirectUrl) {
    const url = redirectUrl || window.location.href;

    window.location.href = this.build({
      host: `www.${this.runtimeConfig.baseDomain}`,
      langPath: '',
      path: '/join',
      query: {
        redirect: url,
        uselang: this.get('wikiVariables.language.content'),
      },
    });
  },
});
