import { Promise } from 'rsvp';
import Service, { inject as service } from '@ember/service';
import Ads from '../../modules/ads';

export default Service.extend({
  fastboot: service(),
  currentUser: service(),
  siteHeadOffset: 0,
  slotNames: null,
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
  },

  pushAdSlotComponent(slotName, adSlotComponent) {
    this.adSlotComponents[slotName] = adSlotComponent;
  },

  beforeTransition() {
    Ads.beforeTransition();

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
      isSubjectToCcpa: this.currentUser.isSubjectToCcpa,
    };

    Ads.afterTransition(adsContext);
  },
});
