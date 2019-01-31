import { Promise } from 'rsvp';
import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import Ads from '../modules/ads';

export default Service.extend({
  module: Ads.getInstance(),
  fastboot: service(),
  wikiVariables: service(),
  currentUser: service(),
  wikiUrls: service(),
  fetchService: service('fetch'),
  siteHeadOffset: 0,
  slotNames: null,
  noAdsQueryParam: null,
  disableAdsInMobileApp: null,
  noAds: computed('noAdsQueryParam', 'disableAdsInMobileApp', function () {
    return ['0', null, ''].indexOf(this.noAdsQueryParam) === -1
      || ['0', null, ''].indexOf(this.disableAdsInMobileApp) === -1
      || this.get('currentUser.isAuthenticated');
  }),
  adSlotComponents: null,
  waits: null,
  searchAdsPromise: null,

  init() {
    this._super(...arguments);
    this.setProperties({
      adSlotComponents: {},
      waits: {},
      slotNames: {
        bottomLeaderBoard: 'bottom_leaderboard',
        invisibleHighImpact: 'invisible_high_impact',
        invisibleHighImpact2: 'invisible_high_impact_2',
        mobileInContent: 'mobile_in_content',
        mobilePreFooter: 'mobile_prefooter',
        topLeaderBoard: 'top_leaderboard',
        incontentNative: 'incontent_native',
      },
    });

    if (!this.get('fastboot.isFastBoot')) {
      this.module.showAds = !this.noAds;
    }
  },

  pushAdSlotComponent(slotName, adSlotComponent) {
    this.adSlotComponents[slotName] = adSlotComponent;
  },

  beforeTransition() {
    this.module.beforeTransition();

    Object.keys(this.adSlotComponents).forEach((slotName) => {
      this.adSlotComponents[slotName].destroy();
    });

    this.set('adSlotComponents', {});
  },

  addWaitFor(key, promise) {
    this.waits[key] = this.waits[key] || [];
    this.waits[key].push(promise);
  },

  getWaits(key) {
    return Promise.all(this.waits[key] || []);
  },

  clearWaits(key) {
    this.waits[key] = [];
  },

  waitForSearchAds() {
    if (this.searchAdsPromise) {
      return this.searchAdsPromise;
    }

    const adsContextPromise = this.fetchSearchAdsContext();
    const adEnginePromise = Ads.waitForAdEngine();

    this.searchAdsPromise = new Promise((resolve) => {
      Promise.all([adEnginePromise, adsContextPromise])
        .then(([ads, adsContext]) => {
          adsContext.user = adsContext.user || {};
          adsContext.user.isAuthenticated = this.get('currentUser.isAuthenticated');

          ads.init(adsContext);
          ads.onReady(() => {
            resolve(adsContext);
          });
        });
    });

    return this.searchAdsPromise;
  },

  /**
   * @private
   * @returns {Promise<T | never>}
   */
  fetchSearchAdsContext() {
    const url = this.wikiUrls.build({
      host: this.get('wikiVariables.host'),
      forceNoSSLOnServerSide: true,
      path: '/wikia.php',
      query: {
        controller: 'MercuryApi',
        method: 'getSearchPageAdsContext',
      },
    });
    const options = this.fetchService.getOptionsForInternalCache(url);

    return fetch(url, options)
      .then(response => response.json()
        .then(data => data.adsContext));
  },
});
