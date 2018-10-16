import Controller, { inject as controller } from '@ember/controller';
import { alias, equal, oneWay } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import AlertNotificationsMixin from '../mixins/alert-notifications';

function scrollItTop(durationInMs) {
  let i = 0;
  const int = setInterval(() => {
    window.scrollTo(0, 0);
    i += 10;
    if (i >= durationInMs) clearInterval(int);
  }, 20);
}

export default Controller.extend(
  AlertNotificationsMixin,
  {
    wikiPage: controller(),
    ads: service(),
    lightbox: service(),
    logger: service(),
    wikiVariables: service(),
    articleStates: service(),

    queryParams: ['file',
      {
        noAds: 'noads',
      },
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
    fullPage: oneWay('mobileApp'),
    isSearchPage: equal('currentRouteName', 'search'),
    noAds: alias('ads.noAdsQueryParam'),
    mobileApp: alias('ads.disableAdsInMobileApp'),

    actions: {
      /**
    * Bubbles up to ApplicationRoute
    *
    * @param {HTMLAnchorElement} target
    * @returns {void}
    */
      handleLink(target) {
        this.articleStates.scrollTopDone = false;

        scrollItTop(200);

        setTimeout(() => {
          this.articleStates.scrollTopDone = true;
        }, 100);

        this.target.send('handleLink', target);
      },

      toggleSiteHeadShadow(visible) {
        this.set('siteHeadShadow', visible);
      },
    },
  },
);
