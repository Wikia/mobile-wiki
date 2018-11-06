/* eslint-disable class-methods-use-this */
/* eslint no-console: 0 */
import { Promise } from 'rsvp';
import adsSetup from './setup';
import fanTakeoverResolver from './fan-takeover-resolver';
import adBlockDetection from './tracking/adblock-detection';
import pageTracker from './tracking/page-tracker';
import videoAds from '../video-players/video-ads';
import biddersDelay from './bidders-delay';
import billTheLizard from './bill-the-lizard';

const SLOT_NAME_MAP = {
  MOBILE_TOP_LEADERBOARD: 'mobile_top_leaderboard',
  MOBILE_IN_CONTENT: 'mobile_in_content',
  MOBILE_PREFOOTER: 'mobile_prefooter',
  BOTTOM_LEADERBOARD: 'bottom_leaderboard',
  INVISIBLE_HIGH_IMPACT_2: 'invisible_high_impact_2',
};

class Ads {
  constructor() {
    this.engine = null;
    this.events = null;
    this.instantGlobals = null;
    this.isLoaded = false;
    this.jwPlayerMoat = videoAds.jwPlayerMOAT;
    this.onReadyCallbacks = [];
    this.showAds = true;
  }

  static getInstance() {
    if (Ads.instance === null) {
      Ads.instance = new Ads();
    }
    return Ads.instance;
  }

  static loadGoogleTag() {
    window.M.loadScript('//www.googletagservices.com/tag/js/gpt.js', true);
  }

  init(mediaWikiAdsContext = {}) {
    if (!this.isLoaded) {
      this.getInstantGlobals()
        .then((instantGlobals) => {
          M.trackingQueue.push(
            isOptedIn => this.setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn),
          );
        });
    }
  }

  callExternals() {
    const { bidders } = window.Wikia.adBidders;
    const { krux } = window.Wikia.adServices;

    biddersDelay.resetPromise();
    bidders.requestBids({
      responseListener: biddersDelay.markAsReady,
    });

    krux.call();
    this.trackLabrador();
  }

  setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn) {
    const { context, events, utils } = window.Wikia.adEngine;
    const { bidders } = window.Wikia.adBidders;
    const { universalAdPackage } = window.Wikia.adProducts;

    this.events = events;
    this.events.registerEvent('MENU_OPEN_EVENT');
    this.instantGlobals = instantGlobals;
    this.showAds = this.showAds && mediaWikiAdsContext.opts.pageType !== 'no_ads';

    adsSetup.configure(mediaWikiAdsContext, instantGlobals, isOptedIn);

    context.push('delayModules', biddersDelay);
    events.on(events.AD_SLOT_CREATED, (slot) => {
      console.info(`Created ad slot ${slot.getSlotName()}`);
      bidders.updateSlotTargeting(slot.getSlotName());
    });

    events.on(events.PAGE_CHANGE_EVENT, utils.readSessionId);
    events.on(events.PAGE_CHANGE_EVENT, universalAdPackage.reset);
    events.on(events.PAGE_CHANGE_EVENT, fanTakeoverResolver.reset);
    events.on(events.PAGE_CHANGE_EVENT, billTheLizard.reset);
    events.on(events.PAGE_CHANGE_EVENT, this.callExternals.bind(this));
    this.callExternals();

    billTheLizard.configureBillTheLizard(instantGlobals);

    this.startAdEngine();

    this.isLoaded = true;
    this.onReadyCallbacks.forEach(callback => callback());
    this.onReadyCallbacks = [];
  }

  trackLabrador() {
    const { utils } = window.Wikia.adEngine;

    // Track Labrador values to DW
    const labradorPropValue = utils.getSamplingResults().join(';');

    if (labradorPropValue) {
      pageTracker.trackProp('labrador', labradorPropValue);
    }
  }

  waitForVideoBidders() {
    const { context, utils } = window.Wikia.adEngine;

    if (!this.showAds) {
      return Promise.resolve();
    }

    const timeout = new Promise((resolve) => {
      setTimeout(resolve, context.get('options.maxDelayTimeout'));
    });

    // TODO: remove logic related to passing bids in JWPlayer classes once we remove legacyModule.js
    // we don't need to pass bidder parameters here because they are set on slot create
    return Promise.race([
      biddersDelay.getPromise(),
      timeout,
    ]).then(() => {
      utils.logger('featured-video', 'resolving featured video delay');
    });
  }

  startAdEngine() {
    if (this.showAds) {
      this.engine = adsSetup.init();
      Ads.loadGoogleTag();
    }
  }

  finishFirstCall() {
    const { btfBlockerService } = window.Wikia.adEngine;

    if (this.showAds) {
      btfBlockerService.finishFirstCall();
      fanTakeoverResolver.resolve();
    }
  }

  initJWPlayer(player, bidParams, slotTargeting) {
    if (this.showAds) {
      videoAds.init(player, { featured: true }, slotTargeting);
    }
  }

  getInstantGlobals() {
    return new Promise(resolve => window.getInstantGlobals(resolve));
  }

  onReady(callback) {
    if (this.isLoaded) {
      callback();
    } else {
      this.onReadyCallbacks.push(callback);
    }
  }

  isSlotApplicable(slotName) {
    return !!SLOT_NAME_MAP[slotName];
  }

  getAdSlotComponentAttributes(slotName) {
    const { context } = window.Wikia.adEngine;

    let name = SLOT_NAME_MAP[slotName] || slotName;

    if (context.get('options.slotRepeater') && name === 'mobile_in_content') {
      name = 'incontent_boxad_1';
    }

    const slotDefinition = context.get(`slots.${name}`);

    return {
      disableManualInsert: slotDefinition.disableManualInsert,
      isAboveTheFold: slotDefinition.aboveTheFold,
      name,
      hiddenClassName: 'hide',
    };
  }

  isArticleSectionCollapsed() {
    const { context } = window.Wikia.adEngine;

    return context.get('options.mobileSectionsCollapse');
  }

  pushSlotToQueue(name) {
    const { context } = window.Wikia.adEngine;

    const slotId = SLOT_NAME_MAP[name] || name;

    context.push('state.adStack', {
      id: slotId,
    });
  }

  beforeTransition() {
    this.events.beforePageChange();
  }

  onTransition(options) {
    const { context } = window.Wikia.adEngine;

    if (this.events) {
      context.set('state.adStack', []);
      this.events.pageChange(options);

      if (this.showAds) {
        this.engine.runAdQueue();
      }
    }
  }

  afterTransition(mediaWikiAdsContext, instantGlobals) {
    this.instantGlobals = instantGlobals || this.instantGlobals;
    adBlockDetection.track();

    if (this.events) {
      this.events.pageRender({
        adContext: mediaWikiAdsContext,
        instantGlobals: this.instantGlobals,
      });
    }
  }

  removeSlot() {
    // TODO: This method is not needed once we remove legacyModule.js
  }

  waitForReady() {
    return new Promise(resolve => this.onReady(resolve));
  }

  waitForUapResponse(uapCallback, noUapCallback) {
    fanTakeoverResolver.getPromise().then((isFanTakeover) => {
      if (isFanTakeover) {
        uapCallback();
      } else {
        noUapCallback();
      }
    });
  }

  onMenuOpen() {
    this.events.emit(this.events.MENU_OPEN_EVENT);
  }
}

Ads.instance = null;

export default Ads;
