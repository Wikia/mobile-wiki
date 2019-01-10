/* eslint-disable class-methods-use-this */
/* eslint no-console: 0 */
import { Promise } from 'rsvp';
import adsSetup from './setup';
import fanTakeoverResolver from './fan-takeover-resolver';
import adBlockDetection from './tracking/adblock-detection';
import pageTracker from './tracking/page-tracker';
import videoTracker from './tracking/video-tracking';
import biddersDelay from './bidders-delay';
import billTheLizard from './bill-the-lizard';

const SLOT_NAME_MAP = {
  MOBILE_TOP_LEADERBOARD: 'mobile_top_leaderboard',
  MOBILE_IN_CONTENT: 'mobile_in_content',
  MOBILE_PREFOOTER: 'mobile_prefooter',
  BOTTOM_LEADERBOARD: 'bottom_leaderboard',
  INVISIBLE_HIGH_IMPACT: 'invisible_high_impact',
  INVISIBLE_HIGH_IMPACT_2: 'invisible_high_impact_2',
};

class Ads {
  constructor() {
    this.engine = null;
    this.instantGlobals = null;
    this.isLoaded = false;
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
    const { geoEdge, krux, moatYi } = window.Wikia.adServices;

    biddersDelay.resetPromise();
    bidders.requestBids({
      responseListener: biddersDelay.markAsReady,
    });

    geoEdge.call();
    krux.call();
    moatYi.call();
  }

  callLateExternals() {
    const { context } = window.Wikia.adEngine;
    const { nielsen } = window.Wikia.adServices;

    const targeting = context.get('targeting');

    nielsen.call({
      type: 'static',
      assetid: `fandom.com/${targeting.s0v}/${targeting.s1}/${targeting.artid}`,
      section: `FANDOM ${targeting.s0v.toUpperCase()} NETWORK`,
    });
    this.trackLabrador();
  }

  setupAdEngine(mediaWikiAdsContext, instantGlobals, isOptedIn) {
    const { context, events, utils } = window.Wikia.adEngine;
    const { bidders } = window.Wikia.adBidders;
    const { universalAdPackage } = window.Wikia.adProducts;

    events.registerEvent('MENU_OPEN_EVENT');
    this.instantGlobals = instantGlobals;
    this.showAds = this.showAds && mediaWikiAdsContext.opts.pageType !== 'no_ads';

    adsSetup.configure(mediaWikiAdsContext, instantGlobals, isOptedIn);
    videoTracker.register();

    context.push('delayModules', biddersDelay);

    events.on(events.PAGE_CHANGE_EVENT, utils.resetSamplingCache);
    events.on(events.PAGE_CHANGE_EVENT, utils.readSessionId);
    events.on(events.PAGE_CHANGE_EVENT, universalAdPackage.reset);
    events.on(events.PAGE_CHANGE_EVENT, fanTakeoverResolver.reset);
    events.on(events.PAGE_CHANGE_EVENT, billTheLizard.reset);
    events.on(events.PAGE_CHANGE_EVENT, this.callExternals.bind(this));

    billTheLizard.configureBillTheLizard(instantGlobals);

    this.callExternals();
    this.startAdEngine();
    this.callLateExternals();

    events.on(events.PAGE_RENDER_EVENT, this.callLateExternals.bind(this));
    events.on(events.AD_SLOT_CREATED, (slot) => {
      console.info(`Created ad slot ${slot.getSlotName()}`);
      bidders.updateSlotTargeting(slot.getSlotName());
    });
    events.on(events.MOAT_YI_READY, (data) => {
      pageTracker.trackProp('moat_yi', data);
    });

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

  createJWPlayerVideoAds(options) {
    const { jwplayerAdsFactory } = window.Wikia.adProducts;

    if (this.showAds) {
      return jwplayerAdsFactory.create(options);
    }

    return null;
  }

  loadJwplayerMoatTracking() {
    const { jwplayerAdsFactory } = window.Wikia.adProducts;

    jwplayerAdsFactory.loadMoatPlugin();
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
    if (!this.isLoaded) {
      return;
    }

    const { events } = window.Wikia.adEngine;

    events.beforePageChange();
  }

  onTransition(options) {
    if (!this.isLoaded) {
      return;
    }
    const { context, events } = window.Wikia.adEngine;

    context.set('state.adStack', []);
    events.pageChange(options);

    if (this.showAds) {
      this.engine.runAdQueue();
    }
  }

  afterTransition(mediaWikiAdsContext, instantGlobals) {
    if (!this.isLoaded) {
      return;
    }

    const { events } = window.Wikia.adEngine;

    this.instantGlobals = instantGlobals || this.instantGlobals;
    adBlockDetection.track();

    events.pageRender({
      adContext: mediaWikiAdsContext,
      instantGlobals: this.instantGlobals,
    });
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
    if (!this.isLoaded) {
      return;
    }
    const { events } = window.Wikia.adEngine;

    events.emit(events.MENU_OPEN_EVENT);
  }
}

Ads.instance = null;

export default Ads;
