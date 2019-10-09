import { Promise } from 'rsvp';
import { computed } from '@ember/object';
import Service, { inject as service } from '@ember/service';
import Ads from '../../modules/ads';
import { pageTracker } from "../../modules/ads/tracking/page-tracker";

export default Service.extend({
  module: Ads.getInstance(),
  fastboot: service(),
  currentUser: service(),
  siteHeadOffset: 0,
  slotNames: null,
  noAdsQueryParam: null,
  disableAdsInMobileApp: null,
  noAds: computed('noAdsQueryParam', 'disableAdsInMobileApp', function () {
    const disablers = [
      [['0', null, ''].indexOf(this.noAdsQueryParam) === -1, 'noads'],
      [['0', null, ''].indexOf(this.disableAdsInMobileApp) === -1, 'mobile_app'],
      [!!this.currentUser.isAuthenticated, 'logged_user'],
    ].filter(disablerPair => !!disablerPair[0]).map(disablerPair => disablerPair[1]);

    if (disablers.length > 0) {
      pageTracker.trackProp('adengine', `off_${disablers[0]}`);
    }

    return disablers.length > 0;
  }),
  adSlotComponents: null,
  waits: null,

  init() {
    this._super(...arguments);
    this.setProperties({
      adSlotComponents: {},
      waits: {},
      slotNames: {
        bottomLeaderBoard: 'bottom_leaderboard',
        invisibleHighImpact2: 'invisible_high_impact_2',
        mobilePreFooter: 'mobile_prefooter',
        topLeaderBoard: 'top_leaderboard',
        topBoxad: 'top_boxad',
        incontentBoxad: 'incontent_boxad_1',
        floorAdhesion: 'floor_adhesion',
      },
    });

    if (!this.fastboot.isFastBoot) {
      this.module.enabled = !this.noAds;
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

    this.adSlotComponents = {};
  },

  addWaitFor(key, promise) {
    this.waits[key] = this.waits[key] || [];
    this.waits[key].push(promise);
  },

  getWaitsOf(key) {
    return Promise.all(this.waits[key] || []);
  },

  clearWaitsOf(key) {
    this.waits[key] = [];
  },

  setupAdsContext(adsContext) {
    adsContext.user = {
      isAuthenticated: this.currentUser.isAuthenticated,
    };

    this.get('module').afterTransition(adsContext);
  },
});
