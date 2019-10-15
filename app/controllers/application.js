import Controller, { inject as controller } from '@ember/controller';
import { alias, equal, oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import AlertNotificationsMixin from '../mixins/alert-notifications';
import Ads from '../modules/ads';

export default Controller.extend(
  AlertNotificationsMixin,
  {
    wikiPage: controller(),
    lightbox: service(),
    logger: service(),
    wikiVariables: service(),

    queryParams: ['file', 'theme',
      // TODO: should be on articles controller https://wikia-inc.atlassian.net/browse/HG-815
      {
        commentsPage: 'comments_page',
      },
    ],

    applicationWrapperClassNames: null,
    commentsPage: null,
    userMenuVisible: false,

    /**
   * @returns {void}
   */
    init() {
      this.setProperties({
        applicationWrapperClassNames: [],
        domain: this.get('wikiVariables.dbName')
        || (window.location && window.location.href.match(/^https?:\/\/(.*?)\./)[1]),
        language: this.get('wikiVariables.language'),
      });

      this._super();
    },

    file: alias('lightbox.file'),
    fullPage: oneWay('wikiPage.mobileApp'),
    isSearchPage: equal('currentRouteName', 'search'),
    mobileApp: oneWay('wikiPage.mobileApp'),

    actions: {
      /**
    * Bubbles up to ApplicationRoute
    *
    * @param {HTMLAnchorElement} target
    * @returns {void}
    */
      handleLink(target) {
        this.target.send('handleLink', target);
      },

      toggleSiteHeadShadow(visible) {
        this.set('siteHeadShadow', visible);
      },
    },
  },
);
