import Controller, { inject as controller } from '@ember/controller';
import { action } from '@ember/object';
import { alias, equal, oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import AlertNotificationsMixin from '../mixins/alert-notifications';

export default Controller.extend(
  AlertNotificationsMixin,
  {
    wikiPage: controller(),
    lightbox: service(),
    logger: service(),
    wikiVariables: service(),

    queryParams: ['file', 'theme',
      {
        mobileApp: 'mobile-app',
      },
      // TODO: should be on articles controller https://wikia-inc.atlassian.net/browse/HG-815
      {
        commentsPage: 'comments_page',
      },
    ],

    applicationWrapperClassNames: null,
    commentsPage: null,
    userMenuVisible: false,
    mobileApp: false,

    /**
   * @returns {void}
   */
    init() {
      this.setProperties({
        applicationWrapperClassNames: [],
        domain: this.get('wikiVariables.dbName')
        || (window.location && (window.location.href.match(/^https?:\/\/(.*?)\./) || [])[1]),
        language: this.get('wikiVariables.language'),
      });

      this._super();
    },

    file: alias('lightbox.file'),
    fullPage: oneWay('mobileApp'),
    isSearchPage: equal('currentRouteName', 'search'),

    /**
     * Bubbles up to ApplicationRoute
     *
     * @param {HTMLAnchorElement} target
     * @returns {void}
     */
    @action
    handleLink(target) {
      this.target.send('handleLink', target);
    },

    @action
    toggleSiteHeadShadow(visible) {
      this.set('siteHeadShadow', visible);
    },
  },
);
